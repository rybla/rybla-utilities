# Fast(er) regular expression engines in Ruby

## Introduction

With modern, overengineered, and over-obfuscated websites, we at [SerpApi](https://serpapi.com/) face increasing challenges with extracting data from them. Beside the usual HTML parsing, sometimes we're literally forced to fall back to good 'ol regular expressions, e.g. for extracting embedded JS data. And while regexps do the trick, they might come at a cost.

[Onigmo](https://github.com/k-takata/Onigmo), the default regexp engine in Ruby, while substantially [updated](https://www.ruby-lang.org/en/news/2022/12/25/ruby-3-2-0-released/) in Ruby 3.2, still has weak points that may really upset in terms of scan time, adding latency to our search requests.

Let's find out what alternatives are available in the wild and how they compare to Ruby.

## Contenders

### re2

It's [developed](https://github.com/google/re2) by Google, and it's widely [used](https://support.google.com/docs/answer/62754#zippy=%2Csee-an-example%2Ccommon-regular-expressions) in various Google products. Under the hood it uses what they call "an on-the-fly deterministic finite-state automaton algorithm based on Ken Thompson's Plan 9 grep". It is [stated](https://github.com/google/re2/wiki/WhyRE2) that `re2` was designed with an explicit goal of being able to handle regular expressions from untrusted sources, i.e. to be resistant from [ReDoS](https://en.wikipedia.org/wiki/ReDoS) attacks. There is well-maintained Ruby bindings [gem](https://github.com/mudge/re2).

### rust/regex

[Native](https://github.com/rust-lang/regex) regex engine in Rust. According to [rebar](https://github.com/BurntSushi/rebar), it's one of the fastest engines overall, and it uses the same approach of building DFA during the search time as `re2`. There are no up-to-date, ready-to-use Ruby bindings, so I've created a simple [PoC](https://github.com/ocvit/rust_regexp) for this comparison.

### pcre2

One of the [best-known](https://github.com/PCRE2Project/pcre2) regex engines due to wide adoption across many commercial and open-source products, as well as languages like PHP and R, where it's used as a default one. It supports a separate JIT mode that improves search time significantly in most cases. Unfortunately, Ruby [bindings](https://github.com/dv/pcre2) are outdated and do not work properly. For instance, mentioned above JIT cannot be enabled with the latest binaries, making the engine not worth to be compared.

## Benchmarks

The benchmarks presented here are the variations of [rebar](https://github.com/BurntSushi/rebar/?tab=readme-ov-file#benchmark-groups) ones. Specifically, those that are validated with [count](https://github.com/BurntSushi/rebar/blob/master/MODELS.md#count) and [count-spans](https://github.com/BurntSushi/rebar/blob/master/MODELS.md#count-spans) models.

The following results were gathered using:

*   `ruby 3.4.3 (2025-04-14 revision d0b7e5b6a0) +PRISM [x86_64-linux]`
*   `re2 (2.15.0)`
*   `rust_regexp (0.1.2)`
*   DigitalOcean CPU-optimized Intel Premium instance with 4 vCPUs / 8 GB
*   Ubuntu 24.04.1 LTS

Benchmark scripts with haystack data and raw benchmark results, including macOS / M4 Max results, can be found on [GitHub](https://github.com/ocvit/serpapi-blog-regexp).

### Literal

From [rebar](https://github.com/BurntSushi/rebar/?tab=readme-ov-file#literal):

> This group of benchmarks measures regex patterns that are simple literals. It is mainly meant to demonstrate two things. Firstly is whether the regex engine does some of the most basic forms of optimization by recognizing that a pattern is just a literal, and that a full blown regex engine is probably not needed. Indeed, naively using a regex engine for this case is likely to produce measurements much worse than most regex engines. Secondly is how the performance of simple literal searches changes with respect to both case insensitivity and Unicode. Namely, substring search algorithms that work well on ASCII text don't necessarily also work well on UTF-8 that contains many non-ASCII codepoints. This is especially true for case insensitive searches.

With an English haystack with a minimal number of German words, i.e. Unicode characters with umlauts, `rust/regex` takes the lead, while `re2` and `ruby` are not that far apart.

    -- [literal/sherlock-en]
    Calculating -------------------------------------
                    ruby      2.169k (± 0.8%) i/s  (460.97 μs/i) -     10.850k in   5.001876s
                     re2      2.510k (± 1.5%) i/s  (398.37 μs/i) -     12.550k in   5.000721s
              rust/regex     12.248k (± 0.4%) i/s   (81.65 μs/i) -     61.350k in   5.009252s
    
    Comparison:
              rust/regex:    12247.5 i/s
                     re2:     2510.2 i/s - 4.88x  slower
                    ruby:     2169.3 i/s - 5.65x  slower
    

With the same haystack but case-insensitive matching, `ruby` becomes significantly slower.

    Calculating -------------------------------------
                    ruby    158.153 (± 1.9%) i/s    (6.32 ms/i) -    795.000 in   5.028382s
                     re2    596.211 (± 0.2%) i/s    (1.68 ms/i) -      3.009k in   5.046886s
              rust/regex      5.605k (± 0.4%) i/s  (178.40 μs/i) -     28.050k in   5.004126s
    
    Comparison:
              rust/regex:     5605.5 i/s
                     re2:      596.2 i/s - 9.40x  slower
                    ruby:      158.2 i/s - 35.44x  slower
    

With Unicode-specific haystack, i.e. fully Cyrillic text, `re2` suddenly becomes slower than `ruby`. This `re2` tendency of not being "Unicode-friendly" will be encountered many times later.

    -- [literal/sherlock-ru]
    Calculating -------------------------------------
                    ruby      1.157k (± 0.8%) i/s  (864.47 μs/i) -      5.865k in   5.070396s
                     re2    288.332 (± 0.3%) i/s    (3.47 ms/i) -      1.456k in   5.049813s
              rust/regex      6.721k (± 0.5%) i/s  (148.79 μs/i) -     34.221k in   5.091769s
    
    Comparison:
              rust/regex:     6721.0 i/s
                    ruby:     1156.8 i/s - 5.81x  slower
                     re2:      288.3 i/s - 23.31x  slower
    

Eventually, `ruby`'s poor case-insensitivity performance prevails over `re2`'s poor Unicode performance, so with Cyrillic text and `i` flag, `ruby` becomes the slowest one again.

    -- [literal/sherlock-casei-ru]
    Calculating -------------------------------------
                    ruby     51.814 (± 0.0%) i/s   (19.30 ms/i) -    260.000 in   5.018218s
                     re2    352.650 (± 0.3%) i/s    (2.84 ms/i) -      1.785k in   5.061719s
              rust/regex      2.722k (± 0.4%) i/s  (367.41 μs/i) -     13.821k in   5.077995s
    
    Comparison:
              rust/regex:     2721.8 i/s
                     re2:      352.6 i/s - 7.72x  slower
                    ruby:       51.8 i/s - 52.53x  slower
    

The last example in this benchmark group is Chinese text, and `re2` takes the last place. However, the difference is not that big compared to the Cyrillic one.

    -- [literal/sherlock-zh]
    Calculating -------------------------------------
                    ruby      6.360k (± 0.4%) i/s  (157.23 μs/i) -     32.334k in   5.083835s
                     re2      2.233k (± 0.3%) i/s  (447.77 μs/i) -     11.373k in   5.092542s
              rust/regex     30.128k (± 0.3%) i/s   (33.19 μs/i) -    151.200k in   5.018621s
    
    Comparison:
              rust/regex:    30128.2 i/s
                    ruby:     6360.2 i/s - 4.74x  slower
                     re2:     2233.3 i/s - 13.49x  slower
    

### Literal with alternation

From [rebar](https://github.com/BurntSushi/rebar/?tab=readme-ov-file#literal-alternate):

> This group is like `literal`, but expands the complexity from a simple literal to a small alternation of simple literals, including case insensitive variants where applicable. This benchmark ups the ante when it comes to literal optimizations. Namely, for a regex engine to optimize this case, it generally needs to be capable of reasoning about literal optimizations that require one or more literals from a set to match. Many regex engines don't deal with this case well, or at all.

This group of benchmarks reuses haystacks from [literal](#literal) but with alternated patterns. Alternation in `ruby` becomes a weak point in the same way as case-insensitivity. The position of engines is static across all examples - `rust/regex`, `re2`, and then `ruby`.

    -- [literal-alt/sherlock-en]
    Calculating -------------------------------------
                    ruby    175.748 (± 0.0%) i/s    (5.69 ms/i) -    884.000 in   5.029956s
                     re2    552.693 (± 0.7%) i/s    (1.81 ms/i) -      2.805k in   5.075420s
              rust/regex      6.407k (± 0.4%) i/s  (156.08 μs/i) -     32.100k in   5.010115s
    
    Comparison:
              rust/regex:     6407.2 i/s
                     re2:      552.7 i/s - 11.59x  slower
                    ruby:      175.7 i/s - 36.46x  slower
    
    

    -- [literal-alt/sherlock-casei-en]
    Calculating -------------------------------------
                    ruby     83.630 (± 0.0%) i/s   (11.96 ms/i) -    424.000 in   5.070034s
                     re2    550.273 (± 0.4%) i/s    (1.82 ms/i) -      2.805k in   5.097541s
              rust/regex      2.896k (± 0.5%) i/s  (345.30 μs/i) -     14.739k in   5.089453s
    
    Comparison:
              rust/regex:     2896.1 i/s
                     re2:      550.3 i/s - 5.26x  slower
                    ruby:       83.6 i/s - 34.63x  slower
    

    -- [literal-alt/sherlock-ru]
    Calculating -------------------------------------
                    ruby     29.989 (± 0.0%) i/s   (33.35 ms/i) -    150.000 in   5.001989s
                     re2    324.299 (± 0.6%) i/s    (3.08 ms/i) -      1.632k in   5.032606s
              rust/regex      2.292k (± 0.5%) i/s  (436.34 μs/i) -     11.679k in   5.096204s
    
    Comparison:
              rust/regex:     2291.8 i/s
                     re2:      324.3 i/s - 7.07x  slower
                    ruby:       30.0 i/s - 76.42x  slower
    

    -- [literal-alt/sherlock-casei-ru]
    Calculating -------------------------------------
                    ruby     12.274 (± 0.0%) i/s   (81.47 ms/i) -     62.000 in   5.051406s
                     re2    314.334 (± 0.6%) i/s    (3.18 ms/i) -      1.581k in   5.029859s
              rust/regex    627.731 (± 0.6%) i/s    (1.59 ms/i) -      3.162k in   5.037377s
    
    Comparison:
              rust/regex:      627.7 i/s
                     re2:      314.3 i/s - 2.00x  slower
                    ruby:       12.3 i/s - 51.14x  slower
    

    -- [literal-alt/sherlock-zh]
    Calculating -------------------------------------
                    ruby     84.924 (± 0.0%) i/s   (11.78 ms/i) -    432.000 in   5.087020s
                     re2    737.563 (± 0.1%) i/s    (1.36 ms/i) -      3.723k in   5.047722s
              rust/regex     10.016k (± 0.4%) i/s   (99.84 μs/i) -     50.745k in   5.066428s
    
    Comparison:
              rust/regex:    10016.1 i/s
                     re2:      737.6 i/s - 13.58x  slower
                    ruby:       84.9 i/s - 117.94x  slower
    

### Date

From [rebar](https://github.com/BurntSushi/rebar/?tab=readme-ov-file#date):

> This is a monster regex for extracting dates from unstructured text from the [datefinder](https://github.com/akoumjian/datefinder/tree/master) project written in Python. The regex itself was taken from [printing the DATES\_PATTERN](https://github.com/akoumjian/datefinder/blob/5376ece0a522c44762b1ab656fc80737b427ed16/datefinder/constants.py#L112-L124) variable in the `datefinder` project. I then removed all names from the capture groups, unnecessary escapes and collapsed it to a single line (because not all regex engines support verbose mode). The regex is more akin to a tokenizer, and the `datefinder` library attempts to combine these tokens into timestamps.

This is another example of automata-oriented engines outperforming `ruby` (that is a backtracker).

    -- [date/ascii]
    Calculating -------------------------------------
                    ruby      0.583 (± 0.0%) i/s     (1.71 s/i) -      3.000 in   5.141671s
                     re2     13.299 (± 0.0%) i/s   (75.19 ms/i) -     67.000 in   5.038107s
              rust/regex     18.069 (± 0.0%) i/s   (55.34 ms/i) -     91.000 in   5.036226s
    
    Comparison:
              rust/regex:       18.1 i/s
                     re2:       13.3 i/s - 1.36x  slower
                    ruby:        0.6 i/s - 30.97x  slower
    

### Cloudflare ReDoS

From [rebar](https://github.com/BurntSushi/rebar/?tab=readme-ov-file#cloud-flare-redos):

> This benchmark uses a regex that helped cause an [outage at Cloudflare](https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/). This class of vulnerability is typically called a "regular expression denial of service," or "ReDoS" for short. It doesn't always require a malicious actor to trigger. Since it can be difficult to reason about the worst case performance of a regex when using an unbounded backtracking implementation, it might happen entirely accidentally on valid inputs.

The particular regexp that contributed to the outage was:

    (?:(?:"|'|\]|\}|\\|\d|(?:nan|infinity|true|false|null|undefined|symbol|math)|`|\-|\+)+[)]*;?((?:\s|-|~|!|\{\}|\|\||\+)*.*(?:.*=.*)))
    

As discussed in Cloudflare's post-mortem, the specific problematic portion of the regexp is:

    .*(?:.*=.*)
    

Or more simply:

    .*.*=.*;
    

Here are the results for the original regexp, along with the simplified variant with short and long haystacks compared.

    -- [cloudflare-redos/original]
    Calculating -------------------------------------
                    ruby     38.874k (± 0.3%) i/s   (25.72 μs/i) -    197.268k in   5.074535s
                     re2    269.196k (± 0.3%) i/s    (3.71 μs/i) -      1.352M in   5.020755s
              rust/regex    307.633k (± 0.3%) i/s    (3.25 μs/i) -      1.568M in   5.097012s
    
    Comparison:
              rust/regex:   307633.0 i/s
                     re2:   269195.8 i/s - 1.14x  slower
                    ruby:    38874.4 i/s - 7.91x  slower
    

    -- [cloudflare-redos/simplified-short]
    Calculating -------------------------------------
                    ruby    118.655k (± 0.4%) i/s    (8.43 μs/i) -    596.200k in   5.024702s
                     re2    275.180k (± 1.8%) i/s    (3.63 μs/i) -      1.378M in   5.010738s
              rust/regex      2.300M (± 0.4%) i/s  (434.81 ns/i) -     11.682M in   5.079644s
    
    Comparison:
              rust/regex:  2299833.5 i/s
                     re2:   275180.0 i/s - 8.36x  slower
                    ruby:   118655.3 i/s - 19.38x  slower
    

    -- [cloudflare-redos/simplified-long]
    Calculating -------------------------------------
                    ruby      1.391k (± 1.0%) i/s  (719.03 μs/i) -      7.000k in   5.033739s
                     re2      5.373k (± 0.7%) i/s  (186.13 μs/i) -     27.183k in   5.059767s
              rust/regex     39.191k (± 1.3%) i/s   (25.52 μs/i) -    197.166k in   5.031788s
    
    Comparison:
              rust/regex:    39190.6 i/s
                     re2:     5372.7 i/s - 7.29x  slower
                    ruby:     1390.8 i/s - 28.18x  slower
    

### Words

From [rebar](https://github.com/BurntSushi/rebar/?tab=readme-ov-file#words):

> This benchmark measures how long it takes for a regex engine to find words in a haystack. We compare one regex that finds all words, `\b\w+\b` and another regex that only looks for longer words, `\b\w{12,}\b`. The split between finding all words and finding only long words tends to highlight the overhead of matching in each regex engine. Regex engines that are quicker to get in and out of its match routine do better at finding all words than regex engines that have higher overhead.

This group of benchmarks uses English and Cyrillic haystacks from the [literal](#literal) group, but there are a few limitations.

`\b` matcher is not Unicode aware in `re2`, producing a slightly different match count with English text (because of the inclusion of umlauts) and completely different results with Cyrillic text, so the latter one was excluded from the comparison.

Forcing `re2` to match Unicode characters makes it slower than `ruby` once again.

    -- [words/all-english]
    Calculating -------------------------------------
                    ruby    194.375 (± 1.0%) i/s    (5.14 ms/i) -    988.000 in   5.083383s
                     re2    102.214 (± 0.0%) i/s    (9.78 ms/i) -    520.000 in   5.087453s
              rust/regex    528.470 (± 0.6%) i/s    (1.89 ms/i) -      2.652k in   5.018450s
    
    Comparison:
              rust/regex:      528.5 i/s
                    ruby:      194.4 i/s - 2.72x  slower
                     re2:      102.2 i/s - 5.17x  slower
    

Matching long words avoids any with Unicode characters beforehand, so `re2` does not get penalized. Even more, long bounded repeats seem to be more efficient in `re2` than in `rust/regex`.

    -- [words/long-english]
    Calculating -------------------------------------
                    ruby    351.391 (± 0.6%) i/s    (2.85 ms/i) -      1.785k in   5.079936s
                     re2      6.397k (± 0.5%) i/s  (156.33 μs/i) -     32.000k in   5.002787s
              rust/regex    852.843 (± 0.2%) i/s    (1.17 ms/i) -      4.335k in   5.083041s
    
    Comparison:
                     re2:     6396.6 i/s
              rust/regex:      852.8 i/s - 7.50x  slower
                    ruby:      351.4 i/s - 18.20x  slower
    

### Bounded repeat

From [rebar](https://github.com/BurntSushi/rebar/?tab=readme-ov-file#bounded-repeat):

> This group of benchmarks measures how well regex engines do with bounded repeats. Bounded repeats are sub-expressions that are permitted to match up to some fixed number of times. For example, `a{3,5}` matches `3`, `4` or `5` consecutive `a` characters. Unlike unbounded repetition operators, the regex engine needs some way to track when the bound has reached its limit. For this reason, many regex engines will translate `a{3,5}` to `aaaa?a?`. Given that the bounds may be much higher than `5` and that the sub-expression may be much more complicated than a single character, bounded repeats can quickly cause the underlying matcher to balloon in size.

With comparably short bounded repeats of English letters `re2` still performs very well compared to `ruby`.

    -- [bounded-repeat/letters-en]
    Calculating -------------------------------------
                    ruby    160.076 (± 1.2%) i/s    (6.25 ms/i) -    816.000 in   5.098412s
                     re2    694.208 (± 0.9%) i/s    (1.44 ms/i) -      3.519k in   5.069443s
              rust/regex      2.046k (± 0.3%) i/s  (488.76 μs/i) -     10.250k in   5.009798s
    
    Comparison:
              rust/regex:     2046.0 i/s
                     re2:      694.2 i/s - 2.95x  slower
                    ruby:      160.1 i/s - 12.78x  slower
    

But it completely loses with Unicode again.

    -- [bounded-repeat/letters-ru]
    Calculating -------------------------------------
                    ruby     84.089 (± 0.0%) i/s   (11.89 ms/i) -    424.000 in   5.042387s
                     re2     16.273 (±18.4%) i/s   (61.45 ms/i) -     80.000 in   5.038373s
              rust/regex    970.406 (± 0.7%) i/s    (1.03 ms/i) -      4.947k in   5.098106s
    
    Comparison:
              rust/regex:      970.4 i/s
                    ruby:       84.1 i/s - 11.54x  slower
                     re2:       16.3 i/s - 59.63x  slower
    

More gnarly `context` and `capitals` regexps perform more even across the engines. Though, `(?:.)` sub-expression coupled with the bounded repeat in `capitals` makes `rust/regex` quite a bit slower.

    -- [bounded-repeat/context]
    Calculating -------------------------------------
                    ruby      3.306 (± 0.0%) i/s  (302.47 ms/i) -     17.000 in   5.142134s
                     re2      8.342 (± 0.0%) i/s  (119.88 ms/i) -     42.000 in   5.035165s
              rust/regex      8.506 (± 0.0%) i/s  (117.56 ms/i) -     43.000 in   5.055945s
    
    Comparison:
              rust/regex:        8.5 i/s
                     re2:        8.3 i/s - 1.02x  slower
                    ruby:        3.3 i/s - 2.57x  slower
    

    -- [bounded-repeat/capitals]
    Calculating -------------------------------------
                    ruby     14.767 (± 0.0%) i/s   (67.72 ms/i) -     74.000 in   5.011244s
                     re2     91.607 (± 0.0%) i/s   (10.92 ms/i) -    459.000 in   5.010646s
              rust/regex     77.138 (± 0.0%) i/s   (12.96 ms/i) -    392.000 in   5.081858s
    
    Comparison:
                     re2:       91.6 i/s
              rust/regex:       77.1 i/s - 1.19x  slower
                    ruby:       14.8 i/s - 6.20x  slower
    

### Noseyparker

From [rebar](https://github.com/BurntSushi/rebar/?tab=readme-ov-file#noseyparker):

> This benchmark measures how well regex engines do when asked to look for matches for many different patterns. The patterns come from the [Nosey Parker](https://github.com/praetorian-inc/noseyparker) project, which finds secrets and sensitive information in textual data and source repositories. Nosey Parker operates principally by defining a number of rules for detecting secrets (for example, AWS API keys), and then looking for matches of those rules in various corpora. The rules are, as you might have guessed, defined as regular expressions.

This is a particularly brutal benchmark with way too long scan times. To make it reasonable across all engines, the number of regexps was lowered to 50, and the haystack was shortened to ~7 MB.

Regexps were run one by one (and not joined together) to simulate a scenario when a reference to the matched regexp is required.

Alternatively, `rust/regex` and `re2` support `set` functionality that represents a collection of regular expressions that can be searched for simultaneously. `set` scan provides indexes of regexps that matched at least once. This smaller scope of selected regexps can be used as a kind of pre-scan before the full scans. Ideally, such approach should reduce overall search time, but only if `set` is significantly faster than regular regexp.

    -- [noseyparker/default]
    Calculating -------------------------------------
                    ruby      2.259 (± 0.0%) i/s  (442.76 ms/i) -     12.000 in   5.313185s
                     re2      2.229 (± 0.0%) i/s  (448.62 ms/i) -     12.000 in   5.383492s
              rust/regex     54.259 (± 0.0%) i/s   (18.43 ms/i) -    275.000 in   5.068428s
                 re2 set     46.733 (± 0.0%) i/s   (21.40 ms/i) -    236.000 in   5.050062s
          rust/regex set      0.179 (± 0.0%) i/s     (5.58 s/i) -      1.000 in   5.576035s
    
    Comparison:
              rust/regex:       54.3 i/s
                 re2 set:       46.7 i/s - 1.16x  slower
                    ruby:        2.3 i/s - 24.02x  slower
                     re2:        2.2 i/s - 24.34x  slower
          rust/regex set:        0.2 i/s - 302.55x  slower
    

Surprisingly, `rust/regex set` appeared to be extremely unoptimized compared to running the same regexps one by one. In contrast, `re2 set` showed significant improvement over plain `re2`.

Something was wrong, so I started playing with input params to find the weak point. First, I tried disabling Unicode, so `\w`, `\d`, `\s`, `\b` matchers in `rust/regex` became non-Unicode aware. It improved performance to the level of sequential regexps, but I felt like it could do better.

    -- [noseyparker/no-unicode]
    Calculating -------------------------------------
                    ruby      2.261 (± 0.0%) i/s  (442.30 ms/i) -     12.000 in   5.307593s
                     re2      2.222 (± 0.0%) i/s  (449.97 ms/i) -     12.000 in   5.399727s
              rust/regex     58.438 (± 0.0%) i/s   (17.11 ms/i) -    295.000 in   5.048170s
                 re2 set     46.765 (± 0.0%) i/s   (21.38 ms/i) -    236.000 in   5.046541s
          rust/regex set     63.660 (± 0.0%) i/s   (15.71 ms/i) -    324.000 in   5.089633s
    
    Comparison:
          rust/regex set:       63.7 i/s
              rust/regex:       58.4 i/s - 1.09x  slower
                 re2 set:       46.8 i/s - 1.36x  slower
                    ruby:        2.3 i/s - 28.16x  slower
                     re2:        2.2 i/s - 28.65x  slower
    

Filtering out regexps one by one, I found that wide scopes like `[^a-zA-Z0-9_-]` have the same effect as `\w` in Unicode mode, increasing the scan time significantly, especially if included in non-capturing `(?:.)` groups. Removing such regexps gave another bump for `rust/regexp set`.

    -- [noseyparker/no-unicode-no-wide-scopes]
    Calculating -------------------------------------
                    ruby      6.987 (± 0.0%) i/s  (143.12 ms/i) -     35.000 in   5.009224s
                     re2      3.223 (± 0.0%) i/s  (310.31 ms/i) -     17.000 in   5.275362s
              rust/regex    103.759 (± 1.0%) i/s    (9.64 ms/i) -    520.000 in   5.011819s
                 re2 set     94.412 (± 1.1%) i/s   (10.59 ms/i) -    477.000 in   5.053396s
          rust/regex set    559.751 (± 0.4%) i/s    (1.79 ms/i) -      2.805k in   5.011212s
    
    Comparison:
          rust/regex set:      559.8 i/s
              rust/regex:      103.8 i/s - 5.39x  slower
                 re2 set:       94.4 i/s - 5.93x  slower
                    ruby:        7.0 i/s - 80.11x  slower
                     re2:        3.2 i/s - 173.70x  slower
    

It's not practical to cherry-pick regexps or disable Unicode, so I would avoid using `rust/regex set` unless it is 100% tested to perform better than sequential regexps.

## Engine limitations

As mentioned above, `\w`, `\d`, `\s`, `\b` matchers behave differently with Unicode in different engines. Namely, in `re2`, they don't match extended Unicode characters.

    RE2('(\w+)').scan("- Yes, Fräulein.").to_a.flatten
    # => ["Yes", "Fr", "ulein"]
    
    RE2('(\d+)').scan("0123٠١٢٣").to_a.flatten
    # => ["0123"]
    
    RE2('(\s)').scan(" \u200A\u2000").to_a.size
    # => 1
    
    RE2('(\b[0-9A-Za-z_]+\b)').scan("- Yes, Fräulein.").to_a.flatten
    # => ["Yes", "Fr", "ulein"]
    

`\w`, `\d`, `\s` are not Unicode aware in `ruby` either, but you have an option to use `[[:alpha:]]`, `[[:digit:]]`, `[[:space:]]` instead. `\b` works in Unicode mode by default.

    "- Yes, Fräulein.".scan(/\w+/)
    # => ["Yes", "Fr", "ulein"]
    
    "- Yes, Fräulein.".scan(/[[:alpha:]]+/)
    # => ["Yes", "Fräulein"]
    
    "0123٠١٢٣".scan(/\d+/)
    # => ["0123"]
    
    "0123٠١٢٣".scan(/[[:digit:]]+/)
    # => ["0123٠١٢٣"]
    
    " \u200A\u2000".scan(/\s/).size
    # => 1
    
    " \u200A\u2000".scan(/[[:space:]]/).size
    # => 3
    
    "- Yes, Fräulein.".scan(/\b[0-9A-Za-z_]+\b/)
    # => ["Yes"]
    

It's funny that `re2` includes `[[:alpha:]]`, `[[:digit:]]`, `[[:space:]]` scopes too, but they're strictly ASCII-like.

    RE2('([[:alpha:]]+)').scan("- Yes, Fräulein.").to_a.flatten
    # => ["Yes", "Fr", "ulein"]
    
    RE2('([[:digit:]]+)').scan("0123٠١٢٣").to_a.flatten
    # => ["0123"]
    
    RE2('([[:space:]])').scan(" \u200A\u2000").to_a.size
    # => 1
    

In `rust/regex` all 4 are Unicode aware by default, with the option to fall back to ASCII mode.

    RustRegexp.new('\w+').scan("- Yes, Fräulein.")
    # => ["Yes", "Fräulein"]
    
    RustRegexp.new('\w+', unicode: false).scan("- Yes, Fräulein.")
    # => ["Yes", "Fr", "ulein"]
    
    RustRegexp.new('\d+').scan("0123٠١٢٣")
    # => ["0123٠١٢٣"]
    
    RustRegexp.new('\d+', unicode: false).scan("0123٠١٢٣")
    # => ["0123"]
    
    RustRegexp.new('\s').scan(" \u200A\u2000").size
    # => 3
    
    RustRegexp.new('\s', unicode: false).scan(" \u200A\u2000").size
    # => 1
    
    RustRegexp.new('\b[0-9A-Za-z_]+\b').scan("- Yes, Fräulein.")
    # => ["Yes"]
    
    RustRegexp.new('\b[0-9A-Za-z_]+\b', unicode: false).scan("- Yes, Fräulein.")
    # => ["Yes", "Fr", "ulein"]
    

Another inconvenience with `re2` was found with bounded repeats with a really high max – it does not support values higher than `1000`.

    RE2('.{0,1000}').ok?
    # => true
    
    RE2('.{0,1001}').ok?
    # => false
    # => invalid repetition size: {0,1001}
    

In `ruby`, max limit is `100000`.

    /.{0,100000}/
    # => ok
    
    /.{0,100001}/
    # => too big number for repeat range
    

In `rust/regex`, there is a limit for `10485760` bytes (= 10 MBs) per compiled regexp. Bounded repeat max depends on the character class and encoding mode (Unicode vs ASCII).

    RustRegexp.new('.{0,10082}')
    # => ok
    
    RustRegexp.new('.{0,10083}')
    # => ArgumentError: Compiled regex exceeds size limit of 10485760 bytes.
    
    RustRegexp.new('.{0,87379}', unicode: false)
    # => ok
    
    RustRegexp.new('.{0,87380}', unicode: false)
    # => ArgumentError: Compiled regex exceeds size limit of 10485760 bytes.
    
    RustRegexp.new('\w{0,209}')
    # => ok
    
    RustRegexp.new('\w{0,210}')
    # => ArgumentError: Compiled regex exceeds size limit of 10485760 bytes.
    
    RustRegexp.new('\w{0,77099}', unicode: false)
    # => ok
    
    RustRegexp.new('\w{0,77100}', unicode: false)
    # => ArgumentError: Compiled regex exceeds size limit of 10485760 bytes.
    

Another nuance was found in `ruby`, which cannot scan the haystack with invalid UTF-8 byte sequences.

    haystack = "\xfc\xa1\xa1\xa1\xa1\xa1abc"
    
    haystack.scan(/.+/)
    # => ArgumentError: invalid byte sequence in UTF-8 (ArgumentError)
    
    RE2('(.+)').scan(haystack)
    # => ["abc"]
    
    RustRegexp.new('.+').scan(haystack)
    # => ["abc"]
    

`rust_regexp` is built on top of `regex::bytes` API that makes parsing of invalid UTF-8 possible. The default `regex` API would fail similarly to `ruby`.

## Conclusions

*   `re2` provides a substantial performance improvement over `ruby` in all cases except those involving Unicode text.
*   `re2` has limitations with Unicode awareness of specific matchers.
*   `re2 set` is always faster than `re2` with sequential regexps.
*   `rust_regexp` is the fastest alternative for `ruby` overall, with no Unicode concerns on a per-regexp basis.
*   `rust_regexp` with sequential regexps is faster than `re2 set`.
*   `rust_regexp set` is very picky to regexps and should be used with _careful_ consideration. Otherwise, abysmal performance can be encountered to the point of being `~300x` slower than `rust_regexp` with sequential regexps.
*   both `re2` and `rust_regexp` can be used for parsing strings with invalid UTF-8 byte sequences, `ruby` can't do that.