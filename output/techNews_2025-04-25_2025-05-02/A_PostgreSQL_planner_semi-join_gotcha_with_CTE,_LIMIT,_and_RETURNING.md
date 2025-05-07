# A PostgreSQL planner semi-join gotcha with CTE, LIMIT, and RETURNING

I recently discovered an unexpected behavior in PostgreSQL involving a pattern of using a Common Table Expression (CTE) with `DELETE ... RETURNING` and `LIMIT` to process a batch of items from a queue-like table. What seemed straightforward turned out to have a surprising interaction with the query planner.

## The scenario

Let’s say you have a `task_queue` table and want to pull exactly _one_ task for a specific `queue_group_id`. A common approach is using a CTE:

    -- The seemingly straightforward query
    WITH deleted_tasks AS (
      DELETE FROM task_queue
      WHERE id IN (
        SELECT id FROM task_queue
        WHERE queue_group_id = 15 -- Specific group
        LIMIT 1                 -- <<< The crucial limit
        FOR UPDATE SKIP LOCKED  -- Avoid lock contention
      )
      RETURNING item_id         -- Get the ID of the item associated with the deleted task
    )
    SELECT item_id FROM deleted_tasks;
    

The intent here is clear: find one available task row (`LIMIT 1`), delete it, and return its associated `item_id`. You’d expect the `RETURNING` clause to give you back, at most, one `item_id`.

## The surprise

In this case, we started seeing logs indicating that this exact query structure was sometimes returning _multiple_ `item_id`s – sometimes 4, sometimes 5 – despite the explicit `LIMIT 1` deep inside the query. How could that happen? If we’re telling Postgres to find and delete only one row based on the inner `SELECT`, how are we getting multiple rows back?

## Deeper dive with EXPLAIN ANALYZE

When SQL behaves unexpectedly, `EXPLAIN ANALYZE` is essential. Running it on the problematic query revealed something interesting about the planner’s execution strategy:

    -- Example EXPLAIN ANALYZE output showing the issue
    Nested Loop Semi Join  (cost=0.00..2.06 rows=1 width=38) (actual time=0.045..0.065 rows=5 loops=1)
      Join Filter: (task_queue.id = "sub".id)
      ->  Seq Scan on task_queue  (cost=0.00..1.01 rows=1 width=14) (actual time=0.013..0.015 rows=5 loops=1)
            -- Assuming some filter or condition leads to 5 candidate rows initially
      ->  Subquery Scan on "sub"  (cost=0.00..1.03 rows=1 width=40) (actual time=0.007..0.008 rows=1 loops=5) -- <<< Subquery runs 5 times!
            ->  Limit  (cost=0.00..1.02 rows=1 width=14) (actual time=0.006..0.006 rows=1 loops=5)            -- <<< Limit runs 5 times!
                  ->  Index Scan using task_queue_pkey on task_queue tasks_sub (cost=0.00..1.01 rows=1 width=14) (actual time=0.005..0.005 rows=1 loops=5)
                        Index Cond: (queue_group_id = 15)
                        -- The important part: This Limit node runs 5 times!
    Planning Time: 0.123 ms
    Execution Time: 0.088 ms
    

Look closely at the lines marked `<<<`. The `Subquery Scan` and the `Limit` node _inside_ it were executed **5 times** (`loops=5`). Instead of running the subquery with `LIMIT 1` once, materializing its single result, and then using that `id` for the `DELETE`, the planner chose a different path.

## Why the semi Join optimization

The planner transformed our query into a `Nested Loop Semi Join`. In simple terms, instead of treating the CTE/subquery as something to compute fully upfront (materialization), it decided to correlate the outer part of the `DELETE` (finding candidate rows in `task_queue`) with the inner subquery.

Here’s the catch: in this semi-join plan, the subquery (including the `LIMIT 1`) was executed _for each candidate row_ found by the outer scan. If the outer scan initially identified 5 potential rows that could match the criteria (before locking and final checks), it ran the `LIMIT 1` subquery 5 separate times. Each run could potentially find and lock _a different_ row satisfying `queue_group_id = 15`, leading to multiple rows being deleted and returned.

❗ **The query planner chose an optimization strategy (semi-join) that effectively applied the `LIMIT` per-candidate-row from the outer scan, not globally as we intended.**

PostgreSQL CTEs are not always optimization fences. While they can sometimes force materialization, the planner often has the freedom to inline them or transform the query in other ways, as happened here.

## Intermittency explained

This also explains why the issue was intermittent. The planner’s choice depends on table statistics, data distribution, costs, and internal heuristics. On some runs, it might choose a plan that materializes the subquery first (behaving as expected). On other runs, perhaps due to updated statistics or slight changes in data, it might switch to the semi-join plan, causing the unexpected behavior. This makes such issues notoriously hard to reproduce consistently.

## Solution

To force the behavior we wanted (ensure the `LIMIT` applies globally before the `DELETE`), we restructured the query to avoid the CTE for the `DELETE` condition, using a simple subselect directly in the `WHERE` clause:

    -- Revised query without the CTE for the DELETE condition
    DELETE FROM task_queue
    WHERE id = ( -- Use '=' for a single expected ID
      SELECT id FROM task_queue
      WHERE queue_group_id = 15
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    RETURNING item_id;
    

_(Note: If you strictly need to handle the case where _zero_ rows might be found by the subquery without erroring, using `id IN (...)` might still be necessary, but test the plan!)_

This structure appears less ambiguous to the planner and typically encourages it to evaluate the subquery (with its `LIMIT 1`) first, find the single `id`, and then perform the delete.

## Takeaway

While CTEs are a powerful tool for organizing complex queries, be cautious when using them with `DELETE` (or `UPDATE`) and `LIMIT`, especially when relying on the `RETURNING` clause for atomicity. The planner’s optimization choices might surprise you and lead to behavior counter to your intent. Always double-check your query plan with `EXPLAIN ANALYZE` for critical operations like this to ensure PostgreSQL is executing the query the way you expect.