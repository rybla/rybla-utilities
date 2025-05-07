# Optimizing Guile Scheme

[Guile](https://gnu.org/software/guile) is a rather niche language that I love dearly. Guile is a Scheme dialect that features an advanced optimizing bytecode compiler, a JIT compiler, and a modest set of developer tools for inspecting and debugging. Through my time spent developing [Chickadee](https://dthompson.us/projects/chickadee.html), a game programming library, I have gotten quite familiar with how to get the most out of Guile in terms of performance. Every now and then I share a tip or two with someone on IRC or the fediverse and think “I should blog about this” so now I’m finally doing that. These tips are quite simple and apply to optimizing any dynamic language. The only difference is that there isn’t much in the way of helpful examples specifically for Guile… until now.

Scheme is a dynamic language which means that there is a limited amount of compile-time information that can be used by Guile to optimize the resulting bytecode. When we put on our optimizer hat, our job is to give the compiler a hand so the optimization passes can do their thing. I should stress that the level of code scrutiny we’re about to get into is usually unnecessary and the result doesn’t always look like the beautiful, functional Scheme you may be used to. However, most programs have some core loop or kernel, a small piece of the larger program, that would be benefit from being optimized to its fullest. In Chickadee, the most performance sensitive code is in the graphics layer, where lots of floating point math happens.

### Rule 1: Don’t allocate

If you can avoid allocation, you will probably have at least decent throughput without doing much else. Some allocations are explicit; `(vector 1 2 3)` clearly allocates a vector. Other allocations are implicit; `(+ x 1)` may or may not allocate depending on the value of `x`.

If `x` is `42` then there is no allocation because the result, `43`, is in the fixnum range (`[-2^63, 2^63)` on 64-bit machines.) Guile stores fixnums as “immediate” values; values which are not heap allocated. However, if `x` is `42.0` then Guile will allocate a float on the heap to store the result `43.0`. Did you know that floats were heap allocated in Guile? I didn’t when I was getting started! All numbers besides fixnums are heap allocated.

Now that you know the hard truth about Guile’s floats, you might think that math is doomed to be slow on Guile; that any realtime graphics program will be a stuttery mess. Keep reading and I will explain why this isn’t the case!

### Rule 2: Prefer monomorphic over polymorphic

The base Scheme environment mostly provides monomorphic procedures; `append` is for lists, `string-append` is for strings, etc. The big exception to this rule is the numeric tower. While beautiful, it can be a hinderance to performant code. All of the arithmetic operators are polymorphic; `+` adds any two numbers together and there are many types of numbers.

Compiled as-is, it means that multiple dispatch on the operands needs to happen at runtime to determine which specialized “add $type-a and $type-b” routine needs to be called.

The R6RS specification introduced monomorphic procedures for fixnums and floats such as `fx+` and `fl+`. These procedures remove the overhead of generic dispatching, but they don't help with the allocation problem; Without a sufficiently advanced compiler, `(fl* (fl+ x y) z)` will allocate a new float to hold the intermediate result of `fl+` that gets thrown away after the `fl*` call. But I wouldn’t be writing this if Guile _didn’t_ have a sufficiently advanced compiler!

### Why not both?

We can write numeric code that is both specialized and allocates minimally. Guile’s compiler performs a _type inference_ pass on our code and will specialize numeric operations wherever possible. For example, if Guile can prove that all the variables involved in `(* (+ x y) z)` are floats, it will optimize the resulting bytecode so that:

*   The floats within `x`, `y`, and `z` are used directly.
*   `+` and `*` are compiled to specialized `fadd` and `fmul` primitives.
*   The intermediate result of `(+ x y)` does not allocate a new heap object.

This is called _unboxing_. Imagine every Scheme value as an object stored inside a little box. Unboxing means removing some objects from their respective boxes, performing some sequence of operations on them _without_ storing each intermediate result in a throwaway box, and then putting the final result into a new box. Unboxing is how we we can satisfy both of our optimization rules for numeric code.

Unboxed floating point math is what allows Chickadee to do things like render thousands of sprites at 60 frames per second without constant GC-related stutter.

### The tools

To optimize effectively, we need tools to help us identify problematic code and tools to validate that our changes are improving things. The most essential tools I use are accessible via REPL commands:

*   `,profile`: Evaluate an expression in the context of `statprof` and print the results.
*   `,disassemble`: Print the bytecode disassembly of a procedure.

An additional tool that does not have it’s own REPL command is `gcprof`, which is a profiler that can help identify code that most frequently triggers garbage collection. I won’t be using it here but you should know it exists.

Now, let’s get into some examples and walk through optimizing each one.

### Example 1: Variadic arguments

It’s common in Scheme for procedures to handle an arbitrary number of arguments. For example, the `map` procedure can process as many lists as you throw at it; `(map + '(1 2 3) '(4 5 6) '(7 8 9))` produces the result `(12 15 18)`.

Supporting an arbitrary number of arguments makes for flexible interfaces, but a naive implementation will cause excessive GC churn in the common case where only a few arguments are passed.

Let’s analyze a contrived example. The following procedure computes the average of all arguments:

    (use-modules (srfi srfi-1))
    
    (define (average . args)
      (/ (fold + 0 args) (length args)))

Let's profile it and see how well it performs:

    scheme@(guile-user)> ,profile (let lp ((i 0))
                                    (when (< i 100000000)
                                      (average 1 2 3)
                                      (lp (+ i 1))))
    %     cumulative   self
    time   seconds     seconds  procedure
     31.99     13.68      4.43  <current input>:1918:16:average
     23.43      7.94      3.25  srfi/srfi-1.scm:452:2:fold
     22.73      3.15      3.15  +
      8.22      1.14      1.14  length
      5.94      0.82      0.82  list?
      5.24      0.73      0.73  procedure?
      1.22     13.85      0.17  <current input>:1979:9
      1.22      0.17      0.17  %after-gc-thunk
      0.00      0.17      0.00  anon #x19675c0
    ---
    Sample count: 572
    Total time: 13.853321979 seconds (6.297763116 seconds in GC)

Nearly half of our time was spent in GC. Let's find out why by taking a look at the disassembly:

    scheme@(guile-user)> ,disassemble average
    Disassembly of #<procedure average args> at #x1a9cbd0:
    
       0    (instrument-entry 240)                                at (unknown file):1918:16
       2    (assert-nargs-ge 1)
       3    (bind-rest 1)                   ;; 2 slots
       4    (alloc-frame 9)                 ;; 9 slots
       5    (static-ref 8 189)              ;; #<variable 7fa802ccba40 value: #<procedure fold (kons knil list1) | (kons kni…> at (unknown file):1919:6
       7    (immediate-tag=? 8 7 0)         ;; heap-object?
       9    (je 9)                          ;; -> L1
      10    (static-ref 8 162)              ;; #<directory (guile-user) 7fa802cf8c80>
      12    (static-ref 6 192)              ;; fold
      14    (call-scm<-scm-scm 8 8 6 111)   ;; lookup-bound
      16    (static-set! 8 178)             ;; #<variable 7fa802ccba40 value: #<procedure fold (kons knil list1) | (kons kni…>
    L1:
      18    (scm-ref/immediate 8 8 1)
      19    (static-ref 6 187)              ;; #<variable 7fa802c36a40 value: #<procedure + (#:optional _ _ . _)>> at (unknown file):1919:11
      21    (immediate-tag=? 6 7 0)         ;; heap-object?
      23    (je 7)                          ;; -> L2
      24    (call-scm<-scmn-scmn 6 194 198 113);; lookup-bound-private
      28    (static-set! 6 178)             ;; #<variable 7fa802c36a40 value: #<procedure + (#:optional _ _ . _)>>
    L2:
      30    (scm-ref/immediate 2 6 1)
      31    (make-immediate 1 2)            ;; 0                  at (unknown file):1919:13
      32    (mov 3 8)                                             at (unknown file):1919:5
      33    (mov 0 7)
      34    (handle-interrupts)
      35    (call 5 4)
      37    (receive 0 5 9)
      39    (static-ref 6 191)              ;; #<variable 7fa802c2d990 value: #<procedure length (_)>> at (unknown file):1919:21
      41    (immediate-tag=? 6 7 0)         ;; heap-object?
      43    (je 7)                          ;; -> L3
      44    (call-scm<-scmn-scmn 6 174 188 113);; lookup-bound-private
      48    (static-set! 6 182)             ;; #<variable 7fa802c2d990 value: #<procedure length (_)>>
    L3:
      50    (scm-ref/immediate 4 6 1)
      51    (mov 3 7)
      52    (handle-interrupts)
      53    (call 4 2)
      55    (receive 1 4 9)
      57    (call-scm<-scm-scm 8 8 7 5)     ;; div                at (unknown file):1919:2
      59    (reset-frame 1)                 ;; 1 slot
      60    (handle-interrupts)
      61    (return-values)

Note instruction 3, `bind-rest`. The Guile manual says:

> Instruction: bind-rest f24:DST
> 
> Collect any arguments at or above DST into a list, and store that list at DST.

So, for each call, a sequence of pairs is allocated to hold all of the arguments. That's probably where a lot of our allocation is coming from. To optimize this, let’s first assume that `average` is typically called with 3 arguments or less. It would be great if we could make these common cases fast while still allowing the flexibility of passing an arbitrary number of arguments. To do this, we’ll use `case-lambda`:

    (define average
      (case-lambda
        (() 0)
        ((x) x)
        ((x y) (/ (+ x y) 2))
        ((x y z) (/ (+ x y z) 3))
        ;; ... and so on, add as many cases as you'd like!
        (args
         (/ (fold + 0 args) (length args)))))

Let’s re-run the profiler to see if this is actually better:

    %     cumulative   self
    time   seconds     seconds  procedure
     76.47      0.63      0.63  <current input>:2055:2:average
     23.53      0.82      0.19  <current input>:2073:9
    ---
    Sample count: 51
    Total time: 0.82462725 seconds (0.0 seconds in GC)

I'd say that nearly 17x faster with no GC is an improvement!

Let’s see what's changed in the disassembly:

    scheme@(guile-user)> ,disassemble average
    Disassembly of #<procedure average () | (x) | (x y) | (x y z) | args> at #x1ab4c70:
    
       0    (instrument-entry 278)                                at (unknown file):2055:2
       2    (arguments<=? 1)
       3    (jne 6)                         ;; -> L1
       4    (alloc-frame 9)                 ;; 9 slots
       5    (make-immediate 8 2)            ;; 0                  at (unknown file):2056:8
       6    (reset-frame 1)                 ;; 1 slot
       7    (handle-interrupts)
       8    (return-values)
    L1:
       9    (arguments<=? 2)
      10    (jne 6)                         ;; -> L2
      11    (alloc-frame 9)                 ;; 9 slots
      12    (mov 8 7)
      13    (reset-frame 1)                 ;; 1 slot
      14    (handle-interrupts)
      15    (return-values)
    L2:
      16    (arguments<=? 3)
      17    (jne 10)                        ;; -> L3
      18    (alloc-frame 9)                 ;; 9 slots
      19    (call-scm<-scm-scm 8 7 6 0)     ;; add                at (unknown file):2058:14
      21    (make-immediate 7 10)           ;; 2                  at (unknown file):2058:22
      22    (call-scm<-scm-scm 8 8 7 5)     ;; div                at (unknown file):2058:11
      24    (reset-frame 1)                 ;; 1 slot
      25    (handle-interrupts)
      26    (return-values)
    L3:
      27    (arguments<=? 4)
      28    (jne 12)                        ;; -> L4
      29    (alloc-frame 9)                 ;; 9 slots
      30    (call-scm<-scm-scm 8 7 6 0)     ;; add                at (unknown file):2059:16
      32    (call-scm<-scm-scm 8 8 5 0)     ;; add
      34    (make-immediate 7 14)           ;; 3                  at (unknown file):2059:26
      35    (call-scm<-scm-scm 8 8 7 5)     ;; div                at (unknown file):2059:13
      37    (reset-frame 1)                 ;; 1 slot
      38    (handle-interrupts)
      39    (return-values)
    L4:
      40    (assert-nargs-ge 1)
      41    (bind-rest 1)                   ;; 2 slots
      42    (alloc-frame 9)                 ;; 9 slots
      43    (static-ref 8 189)              ;; #f                 at (unknown file):2061:9
      45    (immediate-tag=? 8 7 0)         ;; heap-object?
      47    (je 9)                          ;; -> L5
      48    (static-ref 8 162)              ;; #<directory (guile-user) 7fa802cf8c80>
      50    (static-ref 6 192)              ;; fold
      52    (call-scm<-scm-scm 8 8 6 111)   ;; lookup-bound
      54    (static-set! 8 178)             ;; #f
    L5:
      56    (scm-ref/immediate 8 8 1)
      57    (static-ref 6 187)              ;; #f                 at (unknown file):2061:14
      59    (immediate-tag=? 6 7 0)         ;; heap-object?
      61    (je 7)                          ;; -> L6
      62    (call-scm<-scmn-scmn 6 194 198 113);; lookup-bound-private
      66    (static-set! 6 178)             ;; #f
    L6:
      68    (scm-ref/immediate 2 6 1)
      69    (make-immediate 1 2)            ;; 0                  at (unknown file):2061:16
      70    (mov 3 8)                                             at (unknown file):2061:8
      71    (mov 0 7)
      72    (handle-interrupts)
      73    (call 5 4)
      75    (receive 0 5 9)
      77    (static-ref 6 191)              ;; #f                 at (unknown file):2061:24
      79    (immediate-tag=? 6 7 0)         ;; heap-object?
      81    (je 7)                          ;; -> L7
      82    (call-scm<-scmn-scmn 6 174 188 113);; lookup-bound-private
      86    (static-set! 6 182)             ;; #f
    L7:
      88    (scm-ref/immediate 4 6 1)
      89    (mov 3 7)
      90    (handle-interrupts)
      91    (call 4 2)
      93    (receive 1 4 9)
      95    (call-scm<-scm-scm 8 8 7 5)     ;; div                at (unknown file):2061:5
      97    (reset-frame 1)                 ;; 1 slot
      98    (handle-interrupts)
      99    (return-values)

There are more instructions now, but the branches for the known arity cases do not contain a `bind-rest` instruction. Only branch `L4`, the one that handles the final clause of the `case-lambda`, uses `bind-rest`.

### Example 2: Floating point math

> “Nothing brings fear to my heart more than a floating point number.”
> 
> — [Gerald Sussman](https://youtu.be/HB5TrK7A4pI?t=672)

Programs that need to crunch numbers in realtime, such as games, rely on floating point numbers. Dedicated hardware in the form of FPUs and GPUs make them essential for gettin’ math done quick and so we put up with their black magic.

Consider the following code that calculates the magnitude of a 2D vector:

    (define (magnitude x y)
      (sqrt (+ (* x x) (* y y))))

Would you believe me if I told you the bytecode is less than perfect?

    scheme@(guile-user)> ,disassemble magnitude
    Disassembly of #<procedure magnitude (x y)> at #x1a3fad8:
    
       0    (instrument-entry 84)                                 at (unknown file):2106:16
       2    (assert-nargs-ee/locals 3 0)    ;; 3 slots (2 args)
       3    (call-scm<-scm-scm 2 1 1 4)     ;; mul                at (unknown file):2107:11
       5    (call-scm<-scm-scm 1 0 0 4)     ;; mul                at (unknown file):2107:19
       7    (call-scm<-scm-scm 2 2 1 0)     ;; add                at (unknown file):2107:8
       9    (call-scm<-scm 2 2 68)          ;; sqrt               at (unknown file):2107:2
      11    (reset-frame 1)                 ;; 1 slot
      12    (handle-interrupts)
      13    (return-values)

Note the `call-scm<-scm-scm` instructions calling generic math primitives `mul` and `add`.

    scheme@(guile-user)> ,profile (let lp ((i 0))
                                    (when (< i 100000000)
                                      (magnitude 3.0 4.0)
                                      (lp (+ i 1))))
    %     cumulative   self
    time   seconds     seconds  procedure
     85.12     26.94     24.50  <current input>:13:16:magnitude
      8.48      2.44      2.44  %after-gc-thunk
      6.40     28.79      1.84  <current input>:21:9
      0.00      2.44      0.00  anon #x1e9e5c0
    ---
    Sample count: 672
    Total time: 28.786191396 seconds (26.349479685 seconds in GC)

Oof, nearly all of our time is spent in GC!

To fix this, we need to constrain our inputs by using predicates to guard the path to the numeric code. This will inform Guile that certain types of numbers will never reach this branch and allow the compiler to choose more specialized primitives. If we’re okay with only working with floats (we are) then we should constrain our procedure accordingly:

    (define (magnitude x y)
      (unless (and (real? x) (inexact? x)
                   (real? y) (inexact? y))
        (error "expected floats" x y))
      (sqrt (+ (* x x) (* y y))))

And the stats:

    %     cumulative   self
    time   seconds     seconds  procedure
     82.73      4.13      4.06  <current input>:177:16:magnitude
     15.83      4.91      0.78  <current input>:187:9
      1.44      0.07      0.07  %after-gc-thunk
      0.00      0.07      0.00  anon #x1e9e5c0
    ---
    Sample count: 139
    Total time: 4.909505945 seconds (3.970948419 seconds in GC)

Our code now runs about 6x faster, but GC is still taking up most of that time. Let's examine the disassembly:

    Disassembly of #<procedure magnitude (x y)> at #x1f41378:
    
       0    (instrument-entry 206)                                at (unknown file):177:16
       2    (assert-nargs-ee/locals 3 4)    ;; 7 slots (2 args)
       3    (immediate-tag=? 5 3 2)         ;; fixnum?            at (unknown file):178:15
       5    (je 10)                         ;; -> L1
       6    (immediate-tag=? 5 7 0)         ;; heap-object?
       8    (jne 54)                        ;; -> L3
       9    (heap-tag=? 5 127 23)           ;; heap-number?
      11    (jne 51)                        ;; -> L3
      12    (heap-tag=? 5 4095 791)         ;; compnum?
      14    (je 48)                         ;; -> L3
    L1:
      15    (immediate-tag=? 5 3 2)         ;; fixnum?            at (unknown file):178:25
      17    (je 45)                         ;; -> L3
      18    (heap-tag=? 5 4095 535)         ;; flonum?
      20    (jne 42)                        ;; -> L3
      21    (immediate-tag=? 4 3 2)         ;; fixnum?            at (unknown file):179:15
      23    (je 10)                         ;; -> L2
      24    (immediate-tag=? 4 7 0)         ;; heap-object?
      26    (jne 36)                        ;; -> L3
      27    (heap-tag=? 4 127 23)           ;; heap-number?
      29    (jne 33)                        ;; -> L3
      30    (heap-tag=? 4 4095 791)         ;; compnum?
      32    (je 30)                         ;; -> L3
    L2:
      33    (immediate-tag=? 4 3 2)         ;; fixnum?            at (unknown file):179:25
      35    (je 27)                         ;; -> L3
      36    (heap-tag=? 4 4095 535)         ;; flonum?
      38    (jne 24)                        ;; -> L3
      39    (call-f64<-scm 6 5 17)          ;; scm->f64           at (unknown file):181:11
      41    (fmul 6 6 6)
      42    (call-f64<-scm 5 4 17)          ;; scm->f64           at (unknown file):181:19
      44    (fmul 5 5 5)
      45    (fadd 6 6 5)                                          at (unknown file):181:8
      46    (call-f64<-f64 6 6 70)                                at (unknown file):181:2
      48    (allocate-pointerless-words/immediate 5 2)
      49    (load-u64 4 0 535)
      52    (word-set!/immediate 5 0 4)
      53    (tail-pointer-ref/immediate 4 5 1)
      54    (load-u64 3 0 0)
      57    (f64-set! 4 3 6)
      58    (mov 6 5)
      59    (reset-frame 1)                 ;; 1 slot
      60    (handle-interrupts)
      61    (return-values)
    L3:
      62    (static-ref 6 134)              ;; misc-error         at (unknown file):180:4
      64    (make-immediate 3 4)            ;; #f
      65    (make-non-immediate 2 133)      ;; "expected floats ~S ~S" at (unknown file):180:11
      67    (make-immediate 1 772)          ;; ()                 at (unknown file):180:4
      68    (allocate-words/immediate 0 2)
      69    (scm-set!/immediate 0 0 4)
      70    (scm-set!/immediate 0 1 1)
      71    (allocate-words/immediate 4 2)
      72    (scm-set!/immediate 4 0 5)
      73    (scm-set!/immediate 4 1 0)
      74    (allocate-words/immediate 5 2)
      75    (scm-set!/immediate 5 0 3)
      76    (scm-set!/immediate 5 1 1)
      77    (allocate-words/immediate 1 2)
      78    (scm-set!/immediate 1 0 4)
      79    (scm-set!/immediate 1 1 5)
      80    (allocate-words/immediate 5 2)
      81    (scm-set!/immediate 5 0 2)
      82    (scm-set!/immediate 5 1 1)
      83    (allocate-words/immediate 4 2)
      84    (scm-set!/immediate 4 0 3)
      85    (scm-set!/immediate 4 1 5)
      86    (throw 6 4)

Important note: It seems that Guile 3.0.9, the latest stable release as of writing, does not perform the desired optimization here. All the output you are seeing here is from a Guile built from commit `fb1f5e28b1a575247fd16184b1c83b8838b09716` of the main branch. If you are reading this months/years into the future, then as long as you have Guile > 3.0.9 you should be all set.

There's a lot more instructions, but starting with instruction 41 we can see that unboxed float instrutions like `fadd` and `fmul` are being used. It's not made very clear, but instruction 46, `call-f64<-f64`, is a call to a `sqrt` primitive specialized for floats. Since our inputs have to be floats, Guile unboxes them as f64s via the `call-f64<-scm` instruction. The cost of the runtime checks is cheap compared to the cost of all the GC churn in the first version.

The source of our time spent in GC is the `allocate-pointerless-words/immediate` instruction at index 48. This allocates a new heap object and the subsequent instructions like `f64-set!` set the contents of the heap object to the result of the `sqrt` call. Our optimizations are local and once we cross the procedure call boundary we need boxed values again.

### Example 3: Please inline

Guile will automatically inline procedures it considers small enough for the potential performance improvements to be worth the additional code size. It’s a nice feature, but there are times when you wish something would be inlined but it doesn’t happen.

Let’s define a procedure that normalizes 2D vectors. To do so, we’ll build atop the `magnitude` procedure from example 2.

    (define (normalize x y)
      (let ((mag (magnitude x y)))
        (when (= mag 0.0)
          (error "cannot normalize vector with 0 magnitude" x y))
        (values (/ x mag) (/ y mag))))

It would be _great_ if all the unboxed float goodness from `magnitude` spilled over to `normalize`. Let’s see if that happened (it didn’t):

    scheme@(guile-user)> ,disassemble normalize
    Disassembly of #<procedure normalize (x y)> at #x16609b0:
    
       0    (instrument-entry 254)                                at (unknown file):17:19
       2    (assert-nargs-ee/locals 3 6)    ;; 9 slots (2 args)
       3    (static-ref 8 211)              ;; #<variable 7f05e03e8490 value: #<procedure magnitude (x y)>> at (unknown file):18:14
       5    (immediate-tag=? 8 7 0)         ;; heap-object?
       7    (je 9)                          ;; -> L1
       8    (static-ref 8 184)              ;; #<directory (guile-user) 7f05ec481c80>
      10    (static-ref 5 214)              ;; magnitude
      12    (call-scm<-scm-scm 8 8 5 111)   ;; lookup-bound
      14    (static-set! 8 200)             ;; #<variable 7f05e03e8490 value: #<procedure magnitude (x y)>>
    L1:
      16    (scm-ref/immediate 2 8 1)
      17    (mov 1 7)                                             at (unknown file):18:13
      18    (mov 0 6)
      19    (handle-interrupts)
      20    (call 6 3)
      22    (receive 0 6 9)
      24    (static-ref 5 210)              ;; 0.0                at (unknown file):19:17
      26    (=? 8 5)                                              at (unknown file):19:10
      27    (je 11)                         ;; -> L2
      28    (call-scm<-scm-scm 7 7 8 5)     ;; div                at (unknown file):21:12
      30    (call-scm<-scm-scm 8 6 8 5)     ;; div                at (unknown file):21:22
      32    (mov 6 7)                                             at (unknown file):21:4
      33    (mov 7 8)
      34    (mov 8 6)
      35    (reset-frame 2)                 ;; 2 slots
      36    (handle-interrupts)
      37    (return-values)
    L2:
      38    (static-ref 8 206)              ;; misc-error         at (unknown file):20:6
      40    (make-immediate 5 4)            ;; #f
      41    (make-non-immediate 4 205)      ;; "cannot normalize vector with 0 magnitude ~S ~S" at (unknown file):20:13
      43    (make-immediate 3 772)          ;; ()                 at (unknown file):20:6
      44    (allocate-words/immediate 2 2)
      45    (scm-set!/immediate 2 0 6)
      46    (scm-set!/immediate 2 1 3)
      47    (allocate-words/immediate 6 2)
      48    (scm-set!/immediate 6 0 7)
      49    (scm-set!/immediate 6 1 2)
      50    (allocate-words/immediate 7 2)
      51    (scm-set!/immediate 7 0 5)
      52    (scm-set!/immediate 7 1 3)
      53    (allocate-words/immediate 3 2)
      54    (scm-set!/immediate 3 0 6)
      55    (scm-set!/immediate 3 1 7)
      56    (allocate-words/immediate 7 2)
      57    (scm-set!/immediate 7 0 4)
      58    (scm-set!/immediate 7 1 3)
      59    (allocate-words/immediate 6 2)
      60    (scm-set!/immediate 6 0 5)
      61    (scm-set!/immediate 6 1 7)
      62    (throw 8 6)

Instruction 20 is `call`, so inlining didn’t happen. Furthermore, the two `/` calls (instructions 28 and 30) use the generic division primitive rather than `fdiv`. No unboxing for us.

The profiler confirms that things aren’t so great:

    scheme@(guile-user)> ,profile (let lp ((i 0))
                                    (when (< i 100000000)
                                      (normalize 3.0 4.0)
                                      (lp (+ i 1))))
    %     cumulative   self
    time   seconds     seconds  procedure
     52.80     21.16     11.51  <current input>:17:19:normalize
     41.01      9.36      8.94  <current input>:9:19:magnitude
      3.29      0.72      0.72  %after-gc-thunk
      2.90     21.80      0.63  <current input>:23:9
      0.00      0.72      0.00  anon #x15fd5c0
    ---
    Sample count: 517
    Total time: 21.795201408 seconds (19.704395422 seconds in GC)

To force the compiler to inline `magnitude`, we’ll change the definition of to use `define-inlinable`:

    (define-inlinable (magnitude x y)
      (unless (and (real? x) (inexact? x)
                   (real? y) (inexact? y))
        (error "expected floats" x y))
      (sqrt (+ (* x x) (* y y))))

`define-inlinable` is a handy little macro that will substitute the procedure body into its call sites.

Now let’s see the disassembly:

    Disassembly of #<procedure normalize (x y)> at #x16993c8:
    
       0    (instrument-entry 276)                                at (unknown file):58:19
       2    (assert-nargs-ee/locals 3 4)    ;; 7 slots (2 args)
       3    (immediate-tag=? 5 3 2)         ;; fixnum?            at (unknown file):59:13
       5    (je 10)                         ;; -> L1
       6    (immediate-tag=? 5 7 0)         ;; heap-object?
       8    (jne 97)                        ;; -> L4
       9    (heap-tag=? 5 127 23)           ;; heap-number?
      11    (jne 94)                        ;; -> L4
      12    (heap-tag=? 5 4095 791)         ;; compnum?
      14    (je 91)                         ;; -> L4
    L1:
      15    (immediate-tag=? 5 3 2)         ;; fixnum?
      17    (je 88)                         ;; -> L4
      18    (heap-tag=? 5 4095 535)         ;; flonum?
      20    (jne 85)                        ;; -> L4
      21    (immediate-tag=? 4 3 2)         ;; fixnum?
      23    (je 10)                         ;; -> L2
      24    (immediate-tag=? 4 7 0)         ;; heap-object?
      26    (jne 79)                        ;; -> L4
      27    (heap-tag=? 4 127 23)           ;; heap-number?
      29    (jne 76)                        ;; -> L4
      30    (heap-tag=? 4 4095 791)         ;; compnum?
      32    (je 73)                         ;; -> L4
    L2:
      33    (immediate-tag=? 4 3 2)         ;; fixnum?
      35    (je 70)                         ;; -> L4
      36    (heap-tag=? 4 4095 535)         ;; flonum?
      38    (jne 67)                        ;; -> L4
      39    (call-f64<-scm 6 5 17)          ;; scm->f64
      41    (fmul 3 6 6)
      42    (call-f64<-scm 2 4 17)          ;; scm->f64
      44    (fmul 1 2 2)
      45    (fadd 3 3 1)
      46    (call-f64<-f64 3 3 70)
      48    (load-f64 1 0 0)                                      at (unknown file):60:10
      51    (f64=? 3 1)
      52    (je 28)                         ;; -> L3
      53    (fdiv 6 6 3)                                          at (unknown file):62:12
      54    (allocate-pointerless-words/immediate 5 2)
      55    (load-u64 4 0 535)
      58    (word-set!/immediate 5 0 4)
      59    (tail-pointer-ref/immediate 4 5 1)
      60    (load-u64 1 0 0)
      63    (f64-set! 4 1 6)
      64    (fdiv 6 2 3)                                          at (unknown file):62:22
      65    (allocate-pointerless-words/immediate 4 2)
      66    (load-u64 3 0 535)
      69    (word-set!/immediate 4 0 3)
      70    (tail-pointer-ref/immediate 3 4 1)
      71    (load-u64 2 0 0)
      74    (f64-set! 3 2 6)
      75    (mov 6 5)                                             at (unknown file):62:4
      76    (mov 5 4)
      77    (reset-frame 2)                 ;; 2 slots
      78    (handle-interrupts)
      79    (return-values)
    L3:
      80    (static-ref 6 178)              ;; misc-error         at (unknown file):61:6
      82    (make-immediate 3 4)            ;; #f
      83    (make-non-immediate 2 177)      ;; "cannot normalize vector with 0 magnitude ~S ~S" at (unknown file):61:13
      85    (make-immediate 1 772)          ;; ()                 at (unknown file):61:6
      86    (allocate-words/immediate 0 2)
      87    (scm-set!/immediate 0 0 4)
      88    (scm-set!/immediate 0 1 1)
      89    (allocate-words/immediate 4 2)
      90    (scm-set!/immediate 4 0 5)
      91    (scm-set!/immediate 4 1 0)
      92    (allocate-words/immediate 5 2)
      93    (scm-set!/immediate 5 0 3)
      94    (scm-set!/immediate 5 1 1)
      95    (allocate-words/immediate 1 2)
      96    (scm-set!/immediate 1 0 4)
      97    (scm-set!/immediate 1 1 5)
      98    (allocate-words/immediate 5 2)
      99    (scm-set!/immediate 5 0 2)
     100    (scm-set!/immediate 5 1 1)
     101    (allocate-words/immediate 4 2)
     102    (scm-set!/immediate 4 0 3)
     103    (scm-set!/immediate 4 1 5)
     104    (throw 6 4)
    L4:
     105    (static-ref 6 153)              ;; misc-error         at (unknown file):59:13
     107    (make-immediate 3 4)            ;; #f
     108    (make-non-immediate 2 160)      ;; "expected floats ~S ~S" at (unknown file):54:11
     110    (make-immediate 1 772)          ;; ()                 at (unknown file):59:13
     111    (allocate-words/immediate 0 2)
     112    (scm-set!/immediate 0 0 4)
     113    (scm-set!/immediate 0 1 1)
     114    (allocate-words/immediate 4 2)
     115    (scm-set!/immediate 4 0 5)
     116    (scm-set!/immediate 4 1 0)
     117    (allocate-words/immediate 5 2)
     118    (scm-set!/immediate 5 0 3)
     119    (scm-set!/immediate 5 1 1)
     120    (allocate-words/immediate 1 2)
     121    (scm-set!/immediate 1 0 4)
     122    (scm-set!/immediate 1 1 5)
     123    (allocate-words/immediate 5 2)
     124    (scm-set!/immediate 5 0 2)
     125    (scm-set!/immediate 5 1 1)
     126    (allocate-words/immediate 4 2)
     127    (scm-set!/immediate 4 0 3)
     128    (scm-set!/immediate 4 1 5)
     129    (throw 6 4)

Much better! All of the instructions for `magnitude` are now part of `normalize`. `/` is compiled to `fdiv` just like we had hoped.

    %     cumulative   self
    time   seconds     seconds  procedure
     93.04      9.24      9.19  <current input>:58:19:normalize
      6.52      9.88      0.64  <current input>:71:9
      0.43      0.04      0.04  %after-gc-thunk
      0.00      0.04      0.00  anon #x15fd5c0
    ---
    Sample count: 230
    Total time: 9.879456057 seconds (8.858042989 seconds in GC)

We’re 2x faster now, though still a lot of GC. For our final example, we will fully embrace _mutable state_. As much us Schemers like functional programming, mutable state is sometimes necessary.

### Example 4: Bytevectors

For _really_ performance sensitive math code, we can go one step further to avoid allocation and use bytevectors to store the results of numeric operations. Chickadee uses bytevectors extensively to minimize the number of heap allocated floats. Bytevectors have the advantage of unboxed getters and setters, so they’re my preferred data structure for math intensive code.

Let's revisit the vector math of the previous two examples, but this time using bytevectors to represent 2D vectors.

    (define-inlinable (vec2 x y)
      (let ((bv (make-f32vector 2)))
        (f32vector-set! bv 0 x)
        (f32vector-set! bv 1 y)
        bv))
    
    (define-inlinable (vec2-x v)
      (f32vector-ref v 0))
    
    (define-inlinable (vec2-y v)
      (f32vector-ref v 1))
    
    (define-inlinable (magnitude v)
      (let ((x (vec2-x v))
            (y (vec2-y v)))
        (sqrt (+ (* x x) (* y y)))))
    
    (define (normalize v)
      (let ((mag (magnitude v)))
        (when (= mag 0.0)
          (error "cannot normalize vector with 0 magnitude" v))
        (vec2 (/ (vec2-x v) mag) (/ (vec2-y v) mag))))

Here’s the disassembly for `normalize` now:

    Disassembly of #<procedure normalize (v)> at #x1b05d50:
    
       0    (instrument-entry 492)                                at (unknown file):454:19
       2    (assert-nargs-ee/locals 2 11)   ;; 13 slots (1 arg)
       3    (make-immediate 12 2)           ;; 0                  at (unknown file):455:13
       4    (immediate-tag=? 11 7 0)        ;; heap-object?
       6    (jne 83)                        ;; -> L8
       7    (heap-tag=? 11 127 77)          ;; bytevector?
       9    (jne 80)                        ;; -> L8
      10    (word-ref/immediate 10 11 1)
      11    (load-s64 9 0 0)
      14    (imm-u64<? 10 3)
      15    (jnl 72)                        ;; -> L7
      16    (usub/immediate 10 10 3)
      17    (pointer-ref/immediate 8 11 2)
      18    (f32-ref 7 8 9)
      19    (make-immediate 6 18)           ;; 4
      20    (load-s64 5 0 4)
      23    (u64<? 5 10)
      24    (jnl 61)                        ;; -> L6
      25    (f32-ref 10 8 5)
      26    (fmul 8 7 7)
      27    (fmul 4 10 10)
      28    (fadd 8 8 4)
      29    (call-f64<-f64 8 8 70)
      31    (load-f64 4 0 0)                                      at (unknown file):456:10
      34    (f64=? 8 4)
      35    (je 48)                         ;; -> L5
      36    (fdiv 11 7 8)                                         at (unknown file):458:10
      37    (fdiv 10 10 8)                                        at (unknown file):458:29
      38    (static-ref 8 332)              ;; #f                 at (unknown file):388:13
      40    (immediate-tag=? 8 7 0)         ;; heap-object?
      42    (je 9)                          ;; -> L1
      43    (static-ref 8 305)              ;; #<directory (guile-user) 7f05ec481c80>
      45    (static-ref 7 335)              ;; make-f32vector
      47    (call-scm<-scm-scm 8 8 7 111)   ;; lookup-bound
      49    (static-set! 8 321)             ;; #f
    L1:
      51    (scm-ref/immediate 1 8 1)
      52    (make-immediate 0 10)           ;; 2                  at (unknown file):388:28
      53    (handle-interrupts)                                   at (unknown file):458:4
      54    (call 11 2)
      56    (receive 4 11 13)
      58    (immediate-tag=? 8 7 0)         ;; heap-object?
      60    (jne 21)                        ;; -> L4
      61    (heap-tag=? 8 127 77)           ;; bytevector?
      63    (jne 18)                        ;; -> L4
      64    (word-ref/immediate 7 8 1)
      65    (imm-u64<? 7 3)
      66    (jnl 13)                        ;; -> L3
      67    (usub/immediate 12 7 3)
      68    (pointer-ref/immediate 7 8 2)
      69    (f32-set! 7 9 11)
      70    (u64<? 5 12)
      71    (jnl 6)                         ;; -> L2
      72    (f32-set! 7 5 10)
      73    (mov 12 8)
      74    (reset-frame 1)                 ;; 1 slot
      75    (handle-interrupts)
      76    (return-values)
    L2:
      77    (throw/value+data 6 331)        ;; #(out-of-range "bytevector-ieee-single-native-set!" "Argument 2 out of rang…")
    L3:
      79    (throw/value+data 12 329)       ;; #(out-of-range "bytevector-ieee-single-native-set!" "Argument 2 out of rang…")
    L4:
      81    (throw/value+data 8 353)        ;; #(wrong-type-arg "bytevector-ieee-single-native-set!" "Wrong type argument …")
    L5:
      83    (throw/value 11 377)            ;; #(misc-error #f "cannot normalize vector with 0 magnitude ~S") at (unknown file):457:6
    L6:
      85    (throw/value+data 6 391)        ;; #(out-of-range "bytevector-ieee-single-native-ref" "Argument 2 out of range…") at (unknown file):455:13
    L7:
      87    (throw/value+data 12 389)       ;; #(out-of-range "bytevector-ieee-single-native-ref" "Argument 2 out of range…")
    L8:
      89    (throw/value+data 11 395)       ;; #(wrong-type-arg "bytevector-ieee-single-native-ref" "Wrong type argument i…")

This looks pretty good! All the math is done with unboxed floats and no heap floats are allocated at all. Unboxed floats are pulled out of the bytevector with `f32-ref` and stuffed back in with `f32-set!`. But we’re still allocating a new bytevector at the end. This is generally fine, but for _reeeeaaally_ performance sensitive code we want to avoid this allocation, too. For this case, we can write a variant of `normalize` that mutates another 2D vector to store the result.

    (define-inlinable (set-vec2-x! v x)
      (f32vector-set! v 0 x))
    
    (define-inlinable (set-vec2-y! v y)
      (f32vector-set! v 1 y))
    
    (define (normalize! v dst)
      (let ((mag (magnitude v)))
        (when (= mag 0.0)
          (error "cannot normalize vector with 0 magnitude" v))
        (set-vec2-x! dst (/ (vec2-x v) mag))
        (set-vec2-y! dst (/ (vec2-y v) mag))))

We can then define the functional version in terms of the imperative version:

    (define (normalize v)
      (let ((v* (vec2 0.0 0.0)))
        (normalize! v v*)
        v*))

Now we have options. We can use the less elegant, imperative variant when we can’t afford to allocate and use the functional variant otherwise. This is a simplified version of how vecs, matrices, and rects work in Chickadee.

Let’s compare the two. First, the functional API:

    scheme@(guile-user)> ,profile (let ((v (vec2 3.0 4.0)))
                                    (let lp ((i 0))
                                      (when (< i 100000000)
                                        (normalize v)
                                        (lp (+ i 1)))))
    %     cumulative   self
    time   seconds     seconds  procedure
     46.46      7.84      7.73  make-srfi-4-vector
     31.61      5.26      5.26  <current input>:425:19:normalize!
     12.95     16.23      2.15  <current input>:432:19:normalize
      5.87      0.98      0.98  ice-9/boot-9.scm:408:31:make-f32vector
      2.42     16.63      0.40  <current input>:439:32
      0.69      0.11      0.11  %after-gc-thunk
      0.00      0.11      0.00  anon #x15fd5c0
    ---
    Sample count: 579
    Total time: 16.633395281 seconds (12.628994384 seconds in GC)

And now the imperative API:

    scheme@(guile-user)> ,profile (let ((v (vec2 3.0 4.0))
                                        (dst (vec2 0.0 0.0)))
                                    (let lp ((i 0))
                                      (when (< i 100000000)
                                        (normalize! v dst)
                                        (lp (+ i 1)))))
    %     cumulative   self
    time   seconds     seconds  procedure
     91.03      1.13      1.13  <current input>:272:19:normalize!
      8.97      1.24      0.11  <current input>:343:32
    ---
    Sample count: 78
    Total time: 1.244961515 seconds (0.0 seconds in GC)

13x faster and no GC! To use this technique in your own program, you may want to use something like a pool to reuse objects over and over; or just stash an object somewhere to use as scratch space.

Note: Unlike example 2, these optimizations _do_ happen on Guile 3.0.9 and IIRC any stable Guile 3.0.x release.

### Happy hacking

Well, that’s all I’ve got! There are other sources of allocation to be aware of, like closures, but I couldn’t come up with clean examples. If I think of something good maybe I’ll update this post later.

To reiterate, most of the code you write doesn’t need to be examined this closely. Don’t rush off and use `define-inlinable` everywhere and inflate the size of your compiled modules! Let the profiler focus your attention on what matters. May your Scheme be speedy and your GCs infrequent. 🙏