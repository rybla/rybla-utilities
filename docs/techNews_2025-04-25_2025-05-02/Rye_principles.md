# Rye principles

If examples above made you interested, you can delve deeper into the Rye language and Rye runtime. You have few sources for that, both are still work-in-progress, so check back later for more and better content:

Rye is primarily developed on **Linux**, but can also run on **Mac OS** and **Windows**. Rye also runs in **web-browsers** (Wasm) and **Docker**. Rye was compiled for mobile (Android and iOS).

Rye lives on **GitHub**.

Visit, star, report issues, or contribute! **Building from source** is easy with Go. Dee the [**README**](https://github.com/refaktor/rye#building-rye) for instructions..

Rye's main binary comes with core language functions and also a lot of bindings already included. Below are some examples of what's already included:

AWS Bcrypt BSON Crypto FT search Goroutines HTML parser HTTP servers JSON MySQL Psql Postmark Regexp SMTP server SXML SQLite

Rye can be extended internally or externally. External extension are developed in their own repositories:

Rye is designed around a few core principles that should make it expressive, but predictable. While we are still refining details, these ideas shape how Rye behaves and why it feels different from other languages.

These principles are not the features of Rye, look at [Meet Rye](https://ryelang.org/meet_rye/) and the [Cookbook](https://ryelang.org/cookbook/) for that, but they do dictate the features and design decisions.

### Rye is flexible about the language

#### Everything is an Expression

All constructs in Rye return a value - including control flow, I/O and assignment - allowing more composable code and less intermediate state.

    ; you can print (or probe) inline, probe is better for debugging
    apples: print 12
    ; prints 12 and assigns 12 to word apples
        
    ; and assign inline 
    fruits: apples + oranges: 21
    ; assigns 21 to oranges and 33 to fruits
    
    ; either is a conditional function like if/else
    name: "Bob"
    print either name = "Bob" { "Hello Bob" } { "Locked" }
    ; prints Hello Bob
    
    ; expressions compose nicely and linearly
    range 1 10                                                    ; returns numbers from 1 to 10
    range 1 10 |filter { .math/is-prime }                         ; returns prime numbers from 1 to 10    
    range 1 10 |filter { .math/is-prime } |map fn { n } { 1 / n } ; returns reciprocals of primes
    range 1 10 |filter { .math/is-prime } |map fn { n } { 1 / n } |sum |probe
    ; prints sum of reciprocals of primes:
    ;  [Decimal: 1.176190]
    

#### Code is Data

Rye code consists of Rye values (e.g., blocks, words, literal values, ...). There is no difference between Rye code and Rye data. This brings internal consistency and options for code introspection, but we don't want to abuse it.

    thats-true: { capitalize "that's true" }    ; a word with colon on the right or left is a s set-word
    
    do thats-true
    ; returns "That's true"
            
    print-thats-true: { print } ++ thats-true
        
    if 1 > 0 print-thats-true
    ; prints That's true    
    
    ; a simple rule engine for a water tank
    rules: [
        context { condition: { temp > 0 |and level < 70 } action: { print "OPEN" } }
        context { condition: { temp < 0 |or level > 99 } action: { print "CLOSE" } }
    ]
    
    temp: 23 , level: 45
    
    for rules { ::rule
        if do rule/condition rule/action
    }
    ; prints OPEN
    

#### First-Class Everything

Words, functions, blocks of code, scopes (contexts), and literals are all values that can be created, passed, returned, or assigned. Every value of Rye Runtime is also accessible to the language itself.

    some-word: 'this-word
    some-func: fn { x } { x + 1 }
    
    inspect-fn: fn { f } {
      print2 "Code: " dump ?f
      print2 "Result f(100): " f 100
    }
    
    inspect-fn ?some-func
    ; prints:
    ; Code: fn { x } { x + 1 }
    ; Result f(100): 101
    
    ; we will define tank-1 as a context (scope) to make previous example cleaner
    rules: [
        context { condition: { temp > 0 |and level < 70 } action: { open } }
        context { condition: { temp < 0 |or level > 99 } action: { close } }
    ]
    
    tank-1: context { temp: 31 level: 100 open: does { print "OPENING" } close: does { print "CLOSING" } }
    
    for rules { ::rule
        do\par tank-1 {  ; do\par sets context tank-1 as a parent context while evaluating (doing) the code
            if do rule/condition rule/action
        }
    }
    ; prints CLOSING
    

#### Functions are all you need

Rye has no keywords and no special forms. For example if, loop, fn, try, return are all built-in functions and every active component of the language is just a built-in or an ordinary function call. This makes language very symmetrical, consistent and editable. If special forms are just functions you can always make your own.

    probe ?if
    ; Prints:
    ; [Pure Builtin(2): Executes a block of code if the condition is true, returning the result of the block or false.]
    
    probe ?fn
    ; Prints:
    ; [Pure Builtin(2): Creates a function with named parameters specified in the first block and code in the second block.]
    
    ; our custom if
    if-joe: fn { n code } { if n = "Joe" { do code } }
    if-joe "Joe" { print "Hey" }
    ; prints Hey
        
    flip-flop-loop: fn { n a b } { .loop { .is-odd .either { a } { b } |do } }
    flip-flop-loop 5 { prns "Tik" } { prns "Tok" }
    ; Prints:
    ; Tik Tok Tik Tok Tik
    

  

### Rye is strict about state handling

#### Constants by default

Words you define with **set-words** (single colon) are constants and can't be redefined in given context. This being the default gives you certainty that most things can't change under your feet. This reduces the amount of code you need to look at, to be certain about the effects of the code you are working with or looking at.

    name: "Tango"
    
    name: "Cash"
    ; produces error, you can't use a set-word (one colon) to set an already set word
    
    name:: "Cash"        ; word with two colons is a mod-word
    ; also produces error, use of mod-word is correct, but name is a constant in given context
    
    ; you need to use var, or mod-word directly to define a variable word
    var 'current-month "January"
    current-month:: "February"
    
    current-year:: 2024  ; mod-word also creates a variable word if not yet created
    current-year:: 2025
    
    ; functions being constants by default is what we usually want
    cant-redefine: fn { } { "me" }
    
    ; context and function created using set-words are constants
    person: context {
        say-hi: does { print "Hi!" }
    }
    

#### Explicit about modifying words

As we've demonstrated above, **set-words** can only set words once. Even if word is a variable, you need a **mod-word** (double colon), which is visually explicit and visually costly, so you only use it when you have a concrete reason.

    { "jim" "jane" "oto" } .for { :name , print capitalize name }
    ; produces Error, set-word 'name' can't set an already set word
    
        
    ; sometimes you need a mod-word
    { "jim" "jane" "oto" } .for { ::name , print capitalize name }
    ; prints:
    ; Jim
    ; Jane
    ; Oto
    
    ; but a lot of those cases can be solved more directly and with no assignment
    { "jim" "jane" "oto" } .for { .capitalize .print }
    ; prints:
    ; Jim
    ; Jane
    ; Oto
    

#### Constrained in-place modification

Rye encourages **immutable operations**. Almost all functions return new values rather than modify data. However, for specific cases, in-place modification is possible but again **visually explicit**. Functions that mutate values must end with **!** (e.g., append! change! inc!)

    ; many cases where you would use append! have much better solutions
    names: { "jane" "anne" "john" }
    
    ; you don't want to do this
    jay-s: { }
    for names {
        ::n
        if first n = "j" { append! jay-s n }
    }
    
    ; if you can do it in more declarative and intent expressive way
    filter names { .first = "j" }
    

#### No direct changes outside of current scope

Rye enforces strict scope isolation, meaning you can't directly modify variables in outer or nested scopes using assignment words (set or mod-words). Restriction prevents unexpected side effects and makes code easier and again more local to reason about. Instead, Rye encourages explicit and controlled ways to interact with other scopes. In case of modification these means calling functions, again ending with **!**.

    var 'name "EU"
    
    country: context {
        var 'name "Slovenia"
    
        change-name!: fn { n } { .change! 'name }
    }     
    
    print name
    ; prints EU
    
    print country/name
    ; prints Slovenia
    
    name:: "BRICS"
    
    country/name:: "Brasil"
    ; Error - this syntax doesn't even exist
    
    country/change-name! "China"
    

  

### Rye has no Null, but a very rich Failure value

#### Null lacks specificity

Null "a billion dollar mistake" has two main problems. It holds **no information**, so meaning is only assumed. Null can also be passed forward silently, causing unexpected **problems later**, than it was unknowingly created.

Unlike Python/Java, Rye forces you to handle missing data explicitly via Failures. Rye functions either return a desired value or they return a Failure (also a type of Rye value).

    person: dict { name: "Anne" }
    print "name" <- person
    ; prints Anne
    
    ; returns None in Python (or Java)
    print "surname" <- person
    ; Produces an Error "missing key", not none
    
    match? regexp "[0-9]*" "abc"
    ; returns Failure "no result", not none
    

#### Failure is information

#### 

Contrary to Null, Rye Failure can be rich with information. A failure can have a message (string), a type (word), even Failure code (integer). It can also hold details of exact failure. And it can reference a parent failure, so lower level failures can translate to higher level ones as they move up the stack.

    failure 404           ; Constructs a failure with status code 404
    fail "user not found" ; Fails with a failure with specific message
    fail { 403 wrong-signin-data } ; Fails with failure w/ specific code and type
    
    read %user.txt |check { "Couldn't read user file" }
    ; If user.txt is missing it returns a nested Failure
    ; Failure: Couldn't read user file
    ;  └ Failure: user.txt: no such file or directory in builtin file-schema//read
    
    validate dict { score: "10A" } { score: required integer }
    ; returns a Failure with status 403, type 'validation-failure 
    ; and details: { score: "not integer" } 
    

#### Failure enforces resolution

Unlike Null, which can be silently passed around, Rye forces you to address Failures immediately.

You can use functions like **fix** (to provide default values), **check** (to check for failure and add context to it if it happens), or **disarm** (to deactivate the Failure and access it's data) to handle Failures gracefully.

If failure is not handeled it elevates into an Error, our program enters an unpredicted state and generally needs to be stopped and Error fixed in code.

    person -> "surname" |print
    ; produces a Failure and because it's not handeled and Error happens
    
    ; Fix returns an original value, or result of a block in case of a failure
    person -> "name" |fix { "John" } |print
    ; prints Anne
    
    person -> "surname" |fix { "Doe" } |print
    ; print Doe
    
    ; We've already seen check in the previous section
    ; check returns an original value or wraps failure in a higher level failure
    ; ^check is a returning variant of check, look at Meet Rye for specifics		
    get-user-data: fn { uid } {
          read to-file uid ++ ".json"
          |^check "Couldn't read user data." 
          |parse-json 
          |^check "Couldn't parse user data."
    }
    
    get-user-data "u101"   ; in case file is there but it's not proper JSON
    ; We get a higher (current function) level failure, an in it a lower level failure
    ; Failure: Couldn't parse user data 
    ;  └ Failure: Failed to Unmarshal. in builtin parse-json.
    
    validate dict { score: "10A" } { score: required integer } |disarm |to-json
    ; returns a JSON:
    ; { "status": 403, "type": "validation-failure", "data": {  "score": "not integer", } } 
    

  

### Higher level languages need higher level value types

If a language tries to be more high-level, closer to humans, it need value types closer to humans.

#### Table value type

#### 

People use tabular format to work with a lot of data, so one of Rye value types is a Table. Visit The Cookbook to learn much more about Tables. This is just a quick example.

    spr: load\xlsx %adversaries.xlsx
    spr .where-contains 'Species "AI" 
    |order-by 'Year 'asc 
    |head 3 
    |columns? { 'Name 'Keywords } 
    |order-by 'Name 'asc 
    |display
    ; 
    ; | Name     | Keywords                            |
    ; +------------------------------------------------+
    ; | HAL 9000 | Calculating, Logical, Fatal         |
    ; | Ultron   | Ambitious, Intelligent, Destructive |
    ; | VIKI     | Logical, Overbearing, Ruthless      |
    

If this got you interested, [**Meet Rye**](https://ryelang.org/meet_rye) is a good next step!