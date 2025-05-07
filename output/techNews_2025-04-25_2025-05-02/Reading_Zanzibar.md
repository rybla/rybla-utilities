# Reading Zanzibar

Google published [Zanzibar: Google’s Consistent, Global Authorization System](https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/) in 2019. It describes a system for authorization – enforcing who can do what – which maxes out both flexibility and scalability. Google has lots of different apps that rely on Zanzibar, and bigger scale than practically any other company, so it needed Zanzibar.

The Zanzibar paper made quite a stir. There are at least four companies that advertise products as being inspired by or based on Zanzibar. It says a lot for everyone to loudly reference this paper on homepages and marketing materials: companies aren’t advertising their own innovation as much as simply saying they’re following the gospel.

A short list of companies & OSS products I found:

*   Companies
    *   [WorkOS](https://workos.com/) FGA
    *   [Authzed](https://authzed.com/)
    *   [auth0 FGA](https://auth0.com/fine-grained-authorization)
    *   [Ory](https://www.ory.sh/)
    *   [Permify](https://permify.co/)
*   Open source
    *   [Ory Keto](https://github.com/ory/keto) (Go)
    *   [Warrant](https://github.com/warrant-dev/warrant) (Go) probably the basis for WorkOS FGA, since WorkOS acquired Warrant.
    *   [SpiceDB](https://github.com/authzed/spicedb) (Go) the basis for Authzed.
    *   [Permify](https://github.com/Permify/permify) (Go)
    *   [OpenFGA](https://github.com/openfga/openfga) (Go) the basis of auth0 FGA.

I read the paper, and have a few notes, but [the Google Zanzibar Paper, annotated by AuthZed](https://authzed.com/zanzibar) is the same thing from a real domain expert (albeit one who works for one of these companies), so read that too, or instead.

### Features

My brief summary is that the Zanzibar paper describes the _features_ of the system succinctly, and those features are really appealing. They’ve figured out a few primitives from which developers can build really flexible authorization rules for almost any kind of application. They avoid making assumptions about ID formats, or any particular relations, or how groups are set up. It’s abstract and beautiful.

The gist of the system is:

*   Objects: things in your data model, like documents
*   Users: needs no explanation
*   Namespaces: for isolating applications
*   Usersets: groups of users
*   Userset rewrite rules: allow usersets to inherit from each other or have other kinds of set relationships
*   Tuples, which are like `(object)#(relation)@(user)`, and are sort of the core ‘rule’ construct for saying who can access what

There’s then a neat configuration language which looks like this in an example:

    name: "doc"
    
    relation { name: "owner"}
    
    relation {
    name: "editor"
    	userset_rewrite {
    	union {
    	child { _this f } }
    	child { computed_userset { relation: "owner" } }
    
    relation {
    	name: "viewer"
    	userset_rewrite {
    	union {
    		child {_this f} }
    		child { computed_userset & relation: "editor" 3 }
    		child { tuple_to_userset {
    		tupleset { relation: "parent" }
    		computed_userset {
    		object: $TUPLE_USERSET_OBJECT # parent folder
    		relation: "viewer"
    		} } }
    } } }
    

It’s pretty neat. At this point in the paper I was sold on Zanzibar: I could see this as being a much nicer way to represent authorization than burying it in a bunch of queries.

### Specifications & Implementation details

And then the paper discusses specifications: how much scale it can handle, and how it manages consistency. This is where it becomes much more noticeably Googley.

So, with Google’s scale and international footprint, all of their services need to be globally distributed. So Zanzibar is a distributed system, and it is also a system that needs good consistency guarantees so that it avoid the “new enemy” problem, nobody is able to access resources that they shouldn’t, and applications that are relying on Zanzibar can get a consistent view of its data.

Pages 5-11 are about this challenge, and it is a big one with a complex, high-end solution, and a lot of details that are very specific to Google. Most noticeably, Zanzibar is built with [Spanner](https://en.wikipedia.org/wiki/Spanner_%28database%29) Google’s distributed database, and Spanner has the [ability to order timestamps using TrueTime](https://sookocheff.com/post/time/truetime/), which relies on atomic clocks and GPS antennae: this is not standard equipment for a server. Even CockroachDB, which is explicitly modeled off of Spanner, [can’t rely on having GPS & atomic clocks around](https://www.cockroachlabs.com/blog/living-without-atomic-clocks/) so it has to take a very different approach. But this time accuracy idea is pretty central to Zanzibar’s idea of **zookies**, which are sort of like tokens that get sent around in its API and indicate what time reference the client expects so that a follow-up response doesn’t accidentally include stale data.

To achieve scalability, Zanzibar is also a multi-server architecture: there are aclservers, watchservers, a Leopard indexing system that creates compressed [skip list](https://en.wikipedia.org/wiki/Skip_list)\-based representations of usersets. There’s also a clever solution to the caching & hot-spot problem, in which certain objects or tuples will get lots of requests all at once so their database shard gets overwhelmed.

### Conclusions

Zanzibar is two things:

1.  A flexible, relationship-based access control model
2.  A system to provide that model to applications at enormous scale and with consistency guarantees

My impressions of these things match with AuthZed’s writeup so I’ll just quote & link them:

> There seems to be a lot of confusion about Zanzibar. Some people think all relationship-based access control is “Zanzibar”. This section really brings to light that the ReBAC concepts have already been explored in depth, and that Zanzibar is really the scaling achievement of bringing those concepts to Google’s scale needs. [link](https://authzed.com/zanzibar#annotations/intro/zanzibar-as-an-engineering-project)

And

> Zookies are very clearly important to Google. They get a significant amount of attention in the paper and are called out as a critical component in the conclusion. Why then do so many of the Zanzibar-like solutions that are cropping up give them essentially no thought? [link](https://authzed.com/zanzibar#annotations/intro/zanzibar-implementations-without-zookies)

I finished the paper having absorbed a lot of tricky ideas about how to solve the distributed-consistency problems, and if I were to describe Zanzibar, those would be a big part of the story. But maybe that’s not what people mean when they say Zanzibar, and it’s more a description of features?

I did find that Permify has a zookie-like [Snap Token](https://docs.permify.co/operations/snap-tokens), AuthZed/SpiceDB has [ZedTokens](https://authzed.com/docs/spicedb/concepts/zanzibar#new-enemy-problem), and Warrant has [Warrant-Tokens](https://github.com/warrant-dev/warrant#limitations). Whereas [OpenFGA doesn’t have anything like zookies](https://openfga.dev/docs/interacting/consistency#future-work) and [neither does Ory Keto](https://github.com/ory/keto?tab=readme-ov-file#ory-permissions-keto-and-the-googles-zanzibar-model). So it’s kind of mixed on whether these Zanzibar-inspired products have Zanzibar-inspired implementations, or focus more on exposing the same API surface.

For my own needs, zookies and distributed consistency to the degree described in the Zanzibar paper are overkill. There’s no way that we’d deploy a sharded five-server system for authorization when the main application is doing just fine with single-instance Postgres. I want the API surface that Zanzibar describes, but would trade some scalability for simplicity. Or use a third-party service for authorization. Ideally, I wish there was something like these products but smaller, or delivered as a library rather than a server.