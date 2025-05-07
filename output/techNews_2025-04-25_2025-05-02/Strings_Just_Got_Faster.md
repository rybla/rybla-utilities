# Strings Just Got Faster

In JDK 25, [we improved](https://github.com/openjdk/jdk/pull/24625) the performance of the class `String` in such a way that the `String::hashCode` function is mostly [_constant foldable_](https://en.wikipedia.org/wiki/Constant_folding). For example, if you use Strings as keys in a static unmodifiable `Map`, you will likely see significant performance improvements.

## Example

Here is a relatively advanced example where we maintain an immutable `Map` of native calls, its keys are the name of the method call and the values are a `MethodHandle` that can be used to invoke the associated system call:

    // Set up an immutable Map of system calls
    static final Map<String, MethodHandle> SYSTEM_CALLS = Map.of(
            “malloc”, linker.downcallHandle(mallocSymbol,…),
            “free”, linker.downcallHandle(freeSymbol…),
            ...);
    
    …
    
    // Allocate a memory region of 16 bytes
    long address = SYSTEM_CALLS.get(“malloc”).invokeExact(16L);
    …
    // Free the memory region
    SYSTEM_CALLS.get(“free”).invokeExact(address);
    
    

The method `linker.downcallHandle(…)` takes a symbol and additional parameters to bind a native call to a Java `MethodHandle` via the [Foreign Function & Memory API](https://openjdk.org/jeps/454) introduced in JDK 22. This is a relatively slow process and involves spinning bytecode. However, once entered into the `Map`, the new performance improvements in the `String` class alone allow constant folding of both the key lookups and the values, thus improving performance by a factor of more than 8x:

    --- JDK 24 ---
    
    Benchmark                     Mode  Cnt  Score   Error  Units
    StringHashCodeStatic.nonZero  avgt   15  4.632 ± 0.042  ns/op
    
    --- JDK 25 ---
    
    Benchmark                     Mode  Cnt  Score   Error  Units
    StringHashCodeStatic.nonZero  avgt   15  0.571 ± 0.012  ns/op
    

**Note** : the benchmarks above are not using a `malloc()` `MethodHandle` but an `int` _identity function_. After all, we are not testing the performance of `malloc()` but the actual `String` lookup and `MethodHandle` performance.

This improvement will benefit any immutable `Map<String, V>` with Strings as keys and where values (of arbitrary type `V`) are looked up via constant Strings.

## How Does It Work?

When a `String` is first created, its hashcode is unknown. On the first call to `String::hashCode`, the actual hashcode is computed and stored in a private field `String.hash`. This transformation might sound odd; if `String` is _immutable_, how can it mutate its state? The answer is that the mutation cannot be observed from the outside; `String` would functionally behave the same regardless of whether or not an internal `String.hash` cache field is used. The only difference is that it becomes faster for subsequent calls.

Now that we know how `String::hashCode` works, we can unveil the performance changes made (which consists of a single line of code): the internal field `String.hash` is marked with the JDK-internal `@Stable` annotation. That’s it!

`@Stable` tells the virtual machine it can read the field once and, if it is no longer its default value (zero), it can trust the field never change again. Hence, it can _constant-fold_ the `String::hashcode` operation and replace the call with the known `hash`. As it turns out, the fields in the immutable `Map` and the internals of the `MethodHandle` are also trusted in the same way. This means the virtual machine can constant-fold the entire chain of operations:

*   Computing the hash code of the String “malloc” (which is always `-1081483544`)
*   Probing the immutable `Map` (i.e., compute the internal array index which is always the same for the `malloc` hashcode)
*   Retrieving the associated `MethodHandle` (which always resides on said computed index)
*   Resolving the actual native call (which is always the native `malloc()` call)

In effect, this means the native `malloc()` method call can be invoked directly, which explains the tremendous performance improvements. To put it in other words, the chain of operation is completely short-circuited.

## What Are the Ifs and Buts?

There is an unfortunate corner case that the new improvement does not cover: if the hash code of the `String` happens to be zero, constant folding will not work. As we learned above, constant folding can only take place for non-default values (i.e., non-zero values for `int` fields). However, we anticipate we will be able to fix this small impediment in the near future. You might think only one in about 4 billion distinct Strings has a hash code of zero and that might be right in the average case. However, one of the most common strings (the empty string “”) has a hash value of zero. On the other hand, no string with 1 - 6 characters (inclusive) (all characters ranging from \` \` (space) to `Z`) has a hash code that is zero.

## A Final Note

As `@Stable` annotation is applicable only to internal JDK code, you cannot use it directly in your Java applications. However, we are working on a new JEP called [JEP 502: Stable Values (Preview)](https://openjdk.org/jeps/502) that will provide constructs that allow user code to indirectly benefit from `@Stable` fields in a similar way.

## What’s the Next Step?

You can [download JDK 25](https://jdk.java.net/) already today and see how much this performance improvement will benefit your current applications,