# What I’ve learned from jj

I recently started using the [Jujutsu](https://jj-vcs.github.io/jj/latest/) version control system, and it’s changed how I think about working with code. As someone who’s been using [git](https://git-scm.com/) for nearly two decades, it’s refreshing to gain new perspectives on my daily work and get a sense of what might be possible in the future.

Working with git has been great, especially in contrast to what came before. But despite years of development, it still has sharp edges and presents a steep learning curve. Jujutsu doesn’t fix that, exactly, but it sands off some rough edges and makes some different decisions that result in a much safer and far more flexible workflow.

See the next post for [jj tips and tricks](https://zerowidth.com/2025/jj-tips-and-tricks/).

## Everything (is) changes

Where git operates solely on commits–snapshots of the codebase explicitly captured with `git commit`–Jujutsu treats everything as a unique but flexible “change”. Jujutsu unifies several concepts from git: the working copy, commits of the files you’ve edited, the git index, and the stash. While `jj` still uses git’s snapshot-based storage under the hood, it treats everything as a more generic “change”, each identified with a unique revision. The underlying git commit associated with a change may evolve over time but keeps the same revision identifier.

“Change” is an easily-overloaded term. I’m using “change” here to talk about Jujutsu changes, “commit” for git commits, “edits” or “modifications” for alterations of the codebase, and “revision” to refer to `jj`‘s identifier for a specific change. Hopefully that’s clear enough, but be aware that documentation and tutorials often use “change” and “commit” interchangeably–it usually doesn’t matter, but I’m keeping those separate here for precision.

A change includes the current state of the files on disk. Any modification to your files, whether editing, moving, renaming, or deleting, is automatically[1](#fn1) captured by `jj`. You don’t need to explicitly tell `jj` about what you’ve done in your working copy, it’s already tracked. This removes the need for an “index” or staging area, since everything is captured already as part of the current change.

A change is associated with one or more parents, just like a git commit. The set of edits it captures may be empty. And, in fact, the default for a new change (`jj new`) is `(empty) (no description)`: basically a no-op, but tracked as a separate revision from its parent or parents.

Instead of switching branches as you work, you “edit a revision”. When you switch to a different or new change in your repository, that also updates the files on disk to match. This won’t accidentally overwrite anything, because whatever was there would already have been captured in whatever change you were just on. That means switching around to different changes in the repository is safe, and you won’t lose any modifications you’ve made, no matter where you are in the repository’s history.

Instead of just editing an existing change, though, the recommended pattern is to always use `jj new` : this starts a new, empty change on top of whatever revision you wanted to look at or modify. Because the new change starts out empty, you see the files as they were the parent change, which is what you intended. It’s safer, though: any edits you make will be associated with the new change you’re on, rather than updating the preexisting one. Didn’t want to keep those edits you just made? It’s as easy as `jj abandon`: the current change goes away and you’re back with a fresh new one. And if you do want to keep them, you can, using `jj new` to begin a new empty change after the change you were just working on.

This pattern, making a new change on an existing revision that you want to modify also covers the “git stash” pattern naturally. It’s trivial to start a new, different change with `jj new`: it leaves whatever you were working on right where it was. You can go back to it later if you want, or abandon it if you don’t. These “work in progress” changes have more context than `git stash`, too: instead of just a `stash{3}: WIP on some-branch`, they exist in the change history alongside everything else.

While you might think creating new empty changes with `jj new` all the time would leave your repository history littered with empty changes, `jj` tries to clean up after itself. If you move away from an empty change to somewhere else–`jj new`, `jj edit`, or whatever–it will automatically discard empty changes that you leave behind. Non-empty changes are preserved.

## Commits and intentionality

So far I’ve talked about edits and making new changes. What about constructing a commit history, like you’d expect with the normal edit/commit git workflow loop?

A new change has no “description”: it’s like a commit without a commit message. If you’ve made some edits and want to save that work, you can use `jj describe` to set a description for the current change. Follow it up with a `jj new` to continue, starting a new change on the one you just described. `jj commit` is shorthand for this, it’s essentially `jj describe && jj new`.

A description on a change is optional, but `jj` won’t let you push un-described commits to a remote repository. Describing a change is a way of saying “I’m done with this change, here’s what’s in it” before moving on.

Along with describing and making new changes, `jj squash` allows you to take some or all of the current change and “squash” it into another revision. This is usually the immediate parent, but can be any revision. Being able to pick and choose where modifications go makes it easier to be intentional about where something belongs. Say I had a change history `q -> r -> s`, was working on `s`, and realized I had something that belongs in `q`. With `jj`, it’s as easy as `jj squash --into q` to push the current changes into `q`. With git, I’d have to make a fixup commit and then do an interactive rebase to get things into the right place. In practice, I rarely bothered, because of the friction–having to do an interactive rebase at all–and the risk, having to be mindful of what uncommitted changes might be overwritten or lost in my working copy. With `jj squash`, the current change is pushed into whatever target revision you want. And if that change has children, they’ll all be automatically rebased to incorporate the updated code, no additional work is needed.

It’s also easy to split a change in two with `jj split`. Should the edits you’ve made belong in separate changes–maybe even for squashing to new places after–it’s now easy to do. It’s also possible with `git`, but as with other operations, it’s more complicated and difficult.

Rebases with `jj` are the same as git, conceptually, but both simpler and more direct. If I had `s -> t -> u -> v` and wanted to reorder them, it’s as easy as `jj rebase --revision u --after s`, and I’d end up with `s -> u -> t -> v`, no interactive reordering needed. `jj rebase` can do far, far more, but the main thing is that it’s easy to do.

These small but important differences from the usual git workflow have meant that I’m more mindful about where any particular code changes “belongs”. It’s easy to put things in the right place, and to build a commit or change series that’s a logical and well-encapsulated series of discrete steps. I’m a lot less likely now to make a series of commits and then throw a few “whoops” and “fix that thing I missed” commits at the end, because I can effortlessly split, squash, update, and rearrange the history.

## Flexibility and safety

Along with capturing every edit into a change, `jj` stores two extra sequences of metadata. The operation log records the state of the repository as it changes, and the `evolog` (“evolution log”) tracks an individual revision as it changes.

Think of the operation log like the git reflog, which tracks the current `HEAD` as you commit, switch branches, rebase, and so forth. Going back to the previous state is as easy as `jj undo`, or `jj op restore` for an earlier state. Whether what I’ve done is as simple as a `jj new` or as complex as a multi-headed `jj rebase`, going back to the prior state is that easy. It’s far more powerful and useful than the git reflog because of how easy it is to restore the entire repository back to a previous state.

The operation log has given me confidence to try all kinds of things. Rebasing revisions to different places, temporarily creating multi-parent merges to do work then unwinding them later once I’ve shipped some PRs, or just experimenting with various commands–it’s all risk-free because I can trivially restore my repository and state back to the way it was. Having the backstop of the operation log means `jj rebase` is far less scary: if I’m not sure something will work, I can just try it! If it works, great, and if not? `jj undo` and I can try something else.

As I explained earlier, I recommend using `jj new` before making edits anywhere. If you forget to do that, any edits you make end up in the current change with whatever was there already. If you didn’t mean to, it would usually be impossible to tease that change back apart to make things “right”, or even to revert back to what the change was before.

Fortunately, the `jj` `evolog`, or “evolution log”, tracks the history of a single change over time, like a mini git history just within a single change. Using the evolog, it’s possible to recover the previous version of a change, apply that diff to a new change, and restore the old state: taking what was two separate modifications jammed into one and teasing them apart back into separate changes. Before `jj`, I would have had to rely on, at best, the undo history in my editor, or would have simply given up on recovering that part of the code history. This feature is perhaps less useful for day to day work, but I was glad to learn it was there and to be able to successfully try it out. For an example of how to do this, see [the jj documentation](https://jj-vcs.github.io/jj/latest/FAQ/#i-accidentally-changed-files-in-the-wrong-commit-how-do-i-move-the-recent-changes-into-another-commit).

## Conflict resolution

One of the consequenses of being able to modify changes in-place is that all subsequent changes need to be rebased to account for the updated parent. If there were a sequence `s -> t -> u -> v` and you’d modified `t`, `jj` will automatically rebase the rest: `s -> t' -> u' -> v'`. This includes conflicts, if any arise. The difference from `git` is that conflicts are not a stop-the-world event! You’ll see in the `jj log` output that changes have a conflict, but it won’t prevent a command (like an explicit or implicit rebase) from running to completion. You get to choose when and how to resolve the conflicts afterward. I found this a surprising benefit: rebases are already less stressful because of how easy `undo` is, but now I’m no longer interrupted and forced to resolve conflicts immediately.

The [conflict markers](https://jj-vcs.github.io/jj/latest/conflicts/#conflict-markers) take some getting used to. But once you’ve resolved a conflict, any child changes will be automatically rebased again. That often clears the conflict for the rest of the branch.

## Interop

Jujutsu doesn’t bother with naming branches for normal operations, nor does it have a “current branch”, but named branches do still exist as “bookmarks”. Like git branches, bookmarks are labels pointing at a change, but unlike git, they don’t move around as you make new changes. Changes in Jujutsu are treated as far more mutable than commits in git, so “move this bookmark to this new change” is a more intentional act. Managing bookmarks is a bit of a hassle still, and has more friction out of the box than I’d prefer. There are some common configs that help, though, which I documented in a [followup post](https://zerowidth.com/2025/jj-tips-and-tricks/#bookmarks-and-branches).

`jj` encourages a rebase-friendly workflow, given how easy it is to rebase and rearrange things at any time. This is somewhat incompatible with forges[2](#fn2) like GitHub, where force pushes invalidate review comments in pull requests. So there’s somewhat of a mismatch between `jj` and `git` models, but it’s not insurmountable. For repositories where I’m collaborating with others, I’m trying a new approach, updating my `jj` config to consider any commit that’s been pushed to a remote as “immutable”. If I were to try and modify or rebase one of these commits, I’d get an error message. It’s a more restrictive pattern than `jj` allows for, but I’m going to stick with this for now to reduce confusion in pull requests.

Meanwhile, any change that hasn’t been pushed to a branch yet is fair game! I rebase, split, and squash readily and often.

Using `jj` in colocated mode, alongside a `git` repo, means all the git commands still work. `jj git init --colocate` creates a new `.jj` directory, and you can now use `jj` commands. It’s an easy way to experiment with `jj` without committing fully: try it out, and if it doesn’t feel right or help you like you’d hoped, you can `rm -r .jj` and go back to git. One interesting note: while `jj` captures every file in your working copy (i.e. no “dirty” or “untracked” files), `git status` will still show things the “old” way. If you edit a file, `git status` will show it as modified but not committed, while `jj status` will show that it’s modified _and_ that it’s been stored as part of the current change.

Each change is associated with a git commit, or rather, a git commit has a change ID associated with it. When a change is modified, the associated git commit is replaced with a new one with the change’s updated contents. This is irrelevant until you’ve pushed those commits to a remote server. If you edit a change (thereby rewriting the git history), you’ll have to force push to update the remote.

## “Units of change” and collaboration

The flexibility afforded by `jj` is philosophically different from the [commit history doesn’t matter](https://zachholman.com/posts/git-commit-history/) approach to git branches. The idea, particularly as realized in the [GitHub pull request workflow](https://docs.github.com/en/get-started/using-github/github-flow), is that the real “unit of change” is a pull request, and the individual commits making up a PR are essentially irrelevant.

I’ve been comfortable with that approach for a long time. But now, with the ease at which I can “put the right things in the right place”, I’ve found myself caring more about individual commits: discrete, standalone units of work that don’t necessarily require the broader context of a pull request. I haven’t gone all the way to “one commit per PR” territory, but each commit feels more important to get right because it’s easier to do it that way.

My day-to-day work hasn’t changed much. I’m still using the normal vanilla PR-focused, merge-only GitHub flow. I use `jj` locally, opening PRs with as clean a history as I can to start. Because of the limitations when force pushes and rebases are involved, I still fall back to “fixup” style commits toward the tail end of a review cycle on a PR.

What’s different is that I can see new paths and possibilities. I’m curious about things like [interdiff code review](https://gist.github.com/thoughtpolice/9c45287550a56b2047c6311fbadebed2) and [stacked PRs](https://benjamincongdon.me/blog/2022/07/17/In-Praise-of-Stacked-PRs/). I’m eagerly watching developments like per-commit code review in tools like [GitButler](https://blog.gitbutler.com/gitbutlers-new-patch-based-code-review/) and efforts to add `Change-ID` as a supported header in [git itself](https://lore.kernel.org/git/CAESOdVBBeQDtRmRSQeHomuxQubTP5ggKZWGG88n88qKYBHR=+w@mail.gmail.com/T/#t) to enable durable change tracking on top of commits. It feels like the pull request as it exists today is fundamentally limited, and I can’t wait to see what’s over the horizon for collaborative tools based on a change-focused iterative model.

Unfortunately, all of the local advantages of `jj` don’t translate to an upstream repository or collaboration tools. Until there’s more direct integration or a collaboration/code review system that supports `jj` natively, I’ll have to live with the mismatch in capabilities.

Using `jj` feels like using `git-svn` when the rest of the team is still using `svn`. While I still use git and GitHub for collaboration, I get to use a flexible and fun tool locally. I can try new things with confidence, safe in the knowledge that `jj` has my back for putting things right if anything goes wrong.

## Resources

If you’d like to try `jj`, I recommend [Steve’s Jujutsu Tutorial](https://steveklabnik.github.io/jujutsu-tutorial/) as the best way to get started. The [official docs](https://jj-vcs.github.io/jj/latest/) have all the details including installation instructions.

`jj` hides or improves upon many of the difficult things about day-to-day work with git, but it still really helps if you’re familiar with how git works. If you’re not, I highly recommend Julia Evans’ [How Git Works](https://wizardzines.com/zines/git/).

I learned `jj` as a system building on top of git rather than as a novel standalone utility. This worked well for me because of my experience with git, so I can’t say if it would have an easier learning curve for someone new to version control systems. The underlying git storage abstractions can leak, especially when it comes to working with a remote git repository, so it really helps to know what’s going on.

As a followup to this post, I’ve written down some of the [tips and tricks I’ve learned for using `jj` effectively](https://zerowidth.com/2025/jj-tips-and-tricks/).

1.  Nearly automatically: snapshots are taken when you run a `jj` command. If you’re in the habit of `git status` or `git diff` every now and again, `jj status` will do the same thing with that extra side effect. [↩](#fnref1)
    
2.  Presumably named after SourceForge, this means any hosting, collaboration, or code review service like GitHub, GitLab, gerritt, etc. [↩](#fnref2)