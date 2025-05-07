# The cost of poison

## The cost of poison 48th day of Discord 3191 YOLD

It all started with a toot.

> Here's an interesting observation: in my setup, serving dynamically generated garbage is _considerably_ cheaper than serving the same amount of data from static files. As such, enacting an infinite maze conserves resources even when in front of otherwise static files.
> 
> This is going to be a Thread, you may want to hold on, or mute me for a hot minute while I type this whole thing in.
> 
> :thread:

No, not that one. And it wasn’t really a toot, either. It wasn’t any single, one thing - it was this overwhelming aura of defeat. Not _my_ aura, but… I had a feeling that there is considerable reluctance to use a garbage generator in the fight against The Crawlers. Despite [my experiences](https://chronicles.mad-scientist.club/tales/a-season-on-iocaine/), despite tooting my horn about it whenever I observed something interesting about my fight, I’ve heard numerous voices chanting the age old mantra of defeat: “but at what cost!”. Today, I will try my best to dispel some myths regarding the cost of running a garbage generator.

We will be talking purely about quantifiable costs, we will not touch on ethics and the like. Just pure numbers, untainted by anyone’s opinion on the values and methodologies of the Adversaries.

Lets set the stage!

## [\##](#meet-the-adversaries) Meet the Adversaries

Our adversaries are The Crawlers, relentless, mindless robots that scour the internet in search of new data to slurp up and ingest, so that the plagiarism machines can be trained to regurgitate them for the unsuspecting prompter paying $20 a month to get fed bullshit. Knowing the _effect_ of these robots, their relentless assault on our collective infrastructure, we often imagine them as aggressive colonizers, coming there to claim our work as their own. An army of Terminators, if you wish: unstoppable, powerful, overwhelming, a force we cannot hope to stop. Kill one, and two appears, like a hydra.

For the naive observer, this is terrifying. What hope does a single human have against such an army? What good does it do if I try to poison them? They’ll just come back to retaliate, in larger numbers, faster, more aggressively!

Dear reader! I am afraid we have watched too many movies.

What I have observed in practice is that each individual crawling node is _slow_, and has its own, constant crawling speed (exceptions apply, of course, but they’re rare). The reason they’re overwhelming our infrastructure is to be found in their numbers. While each of them crawls at a slow speed, there are _many_ of them coming at us at the same time. This is both a gift, and a curse, as we will see.

Dramatics aside, our adversaries are The Crawlers, bots that individually pose little threat, but they come in large numbers. Some of them identify themselves, a lot of them try to hide. They are aggressive, in the sense that if they feel denied, they will come back in disguise. They are overwhelming, in the sense that the only way to block them is to go offline. Since we do not wish to go offline, we can only mitigate.

## [\##](#setting-the-stages) Setting the stages

We know our adversaries - lets turn around, and look in the mirror! What do we see?

I see a slightly overengineered contraption, a small shared virtual server in the cloud acting as a front for a homelab. The public-facing VPS holds little data, everything important is behind a WireGuard tunnel in the homelab. It has a few (shared) cores, a few gigs of memory, and a small slice of SSD, 40 gigs or so. The systems behind this VPS are also old, and not all that powerful: a 2014-era Mac Mini, with 4 cores, 4GiB ram, and 512GiB of HDD (not SSD, HDD). Lets call this setup the _Homelab_.

My headmate is a less ambitious person, they see a single, bigger, dedicated server, directly connected to the internet. We do not know where this server is, in the cloud, or in a homelab, but it matters little - it is directly connected, and can hold everything we want to serve. Headmate insists we call their setup the _Server_, and I see no reason to disagree.

For the sake of this exercise, our only aim will be to serve static files. No fediverse instances, no code forges, no nothing - just static files. This will make things simpler to reason about, but also presents a larger challenge, and challenging exercises are great practice for the mind. What kind of static files, you ask? All kinds! Some HTML pages for static sites I host - like this blog here, or my [previous one](https://asylum.madhouse-project.org/), or the [documentation site for iocaine](https://iocaine.madhouse-project.org/) -, along with the necessary assets like stylesheets and images. But we’d also host some bigger files, like tarballs, OCI containers, or a gallery of select works from my Brother’s portfolio. All in all, about 100GiB of data, give or take. Not particularly large by todays standards, but not tiny, either.

## [\##](#adjusting-our-aim) Adjusting our aim

Before we continue on our journey, it is important to discuss what we wish to achieve. First of all, we wish to remain online, and we wish to serve our human visitors, preferably without inconveniencing them too much. At the same time, our resources (including our time as administrators of the system) are finite, we can’t throw infinite amount of money on the problem, nor can we manually approve every request.

In short, we’re looking for a way to reduce the impact of The Crawlers, without burning ourselves out, with the least impact on our human visitors. We do not aim to exclude all crawlers, we do not aim for protecting our work from all of them - we’re aiming for Good Enough, not Perfect.

## [\##](#the-cost-of-defeat) The cost of defeat

Let us answer the question: **What happens if we give in?**, in other words, when we don’t do anything, and let The Crawlers come, when we serve them our work, and let them consume it and claim it as their own. This is the worst case scenario. This is defeat.

With no defenses up, we’d serve everything as-is, for everyone. The common wisdom is that serving static files is cheap - and it is certainly cheaper than serving most dynamic content. Unfortunately, this common wisdom fails to account for bandwidth. While it is true that serving static files requires little resources as far as CPU and RAM are concerned, serving them to The Crawlers means that we incur significant bandwidth costs.

Let us estabilish another fact! How severe is the Crawler attack, anyway? In numbers! How many requests a day do they make? How many do legit visitors do? Having spent the past few months building defenses, and building a comprehensive dataset, I can answer this question with quite a bit of confidence: The Crawlers are hitting my sites about 5 million requests a day, while legit visitors on the same sites are in the hundreds, or low thousands at best. In other words, if I am being generous, 99% of the requests made against my servers are from Crawlers. A staggering number, but similar numbers are seen by others, too.

For the sake of this experiment, we’ll assume the best case scenario: the robots only ever request smaller content: HTML, CSS, and maybe an image or two. No tarballs, OCI images or anything bigger than 100KiB, and lets say the average page is around 10KiB (which, in this Year 3191 of Our Lady Discord is ridiculously generous).

### [\###](#defeat-in-the-eyes-of-the-server) Defeat in the eyes of the Server

What does it mean for the _Server_?

At five million hits a day, with the average page size being 10KiB, we’re looking at around 48GiB of daily traffic, 1.4TiB a month, give or take. That is a very large amount of traffic, considering that if we only served human visitors, we’d be at around 3GiB of traffic monthly. Lets put that into perspective: serving the bots consumes more than **ten times** the **monthly** traffic served to human visitors, **daily**. Think about that for a minute.

While 1.4TiB is a lot, it’s also very comfortably below the roughly 20TiB of monthly traffic a lot of cloud providers limit you to. You could brush this off as not important, but I’d like to remind you: I was _very_ generous when setting the stage. The reality is that this might easily be an order of magnitude larger if you’re hosting a lot of images the Crawlers decided to munch on, for example…. and then we’re suddenly at 14TiB a month, inching uncomfortably close to the 20TiB limit of many cloud providers. And, if we factor in dynamic content, this gets a _lot_ worse, too.

Nevertheless, within the constraints of the experiment, 1.4TiB of traffic monthly is not the end of the world. There is no CPU or RAM use to worry about, and the _Server_ can fulfill these requests without batting an eye. There’s no problem here, right?

### [\###](#the-homelab-s-demise) The Homelab’s demise

The situation at the _Homelab_ is considerably worse, however, because it is not serving files directly: you have to pay the traffic tax twice: once to get the content from the Homelab to the VPS, then to send it further to the Crawlers. That’s your traffic doubled, and chances are, you will be much more conscious about network traffic when it eats into your bandwidth at home.

One may think that asking the fronting reverse proxy to do some caching would mitigate the problem, that it would keep frequently accessed files in cache, on the VPS, so the traffic between the _Homelab_ and the VPS could be avoided. Unfortunately, one would be wrong. Remember the Adversaries? The part where we observed they’re diverse, and large in number? Yes? That translates to having little to no “frequently accessed files”, unless what we’re hosting is very, very small.

Still, the _Homelab_ can adequately serve all visitors, the CPU and RAM usage is negligible, the traffic is higher, but acceptable.

## [\##](#build-that-wall) Build that wall

Despite everything, including 2.8TiB of almost completely useless monthly traffic, if we’re the kind of people who don’t like waste, the picture I painted above will not spark joy. We’ll want to do _something_. We’re not going to care about CPU and RAM, because there’s not much we can do on that front, they’re not the problem. Our problem is traffic. How do we cut down traffic?

### [\###](#one-block-at-a-time) One block at a time

The best way to cut down on traffic is to make it disappear, naturally. If that was your first instinct, it is a correct one! Unfortunately, it is not an effective one. Remember: The Crawlers are distributed, they come from millions of unique IP addresses, and some of them are residential, shared with humans. You cannot possibly block them all - you might aswell go offline.

You _can_ block a large number of crawlers, but that’s always going to be a compromise. I blocked the entire ASN of Alibaba and Huawei, because I had no legit visitors from their ranges. I could afford that compromise, but that’s not a generally available option.

No, blocking, while not entirely useless, it helps little, and has many, many downsides.

### [\###](#killing-it-slowly) Killing it slowly

Another tactic would be to slow the Crawlers down. If they get throttled, we may spend more time serving them (marginally increasing our use of CPU and RAM), but might be able to cut down significantly on traffic! That would be a fair trade, if it worked. Unfortunately, like many other defense mechanisms, it does not, because Crawlers are distributed, and attack from many nodes: you slow them down, they will compensate by assigning more crawler nodes to the job, to maintain their internal crawling rate.

I’ve been there, tried it, I ended up spending a fair bit of effort on it, and with more CPU and RAM used, the traffic did not noticably change in any direction. This is not a practical method to cut down on traffic.

### [\###](#sex-gzip-bomb-gzip-bomb) sex gzip bomb, gzip bomb

“Just throw them a gzip bomb!”, they said, “That’ll teach them!”, they said. They were wrong.

You see, many of the crawlers do not decompress on the go. They just store what they received, and let some other node process it. A lot of the crawlers are running on through malicious SDKs, they’re cheap and disposable, the less work they do, the better. Serving them a gzip bomb might kill a different node, but it will have no effect on the crawling. This might make you feel good, and it might reduce your traffic, as a gzip bomb is smaller than the average page size we set when setting the stage, but there’s another thing to consider: the crawling and processing nodes are controlled by something. That something expects results. If they don’t receive results, they will enact countermeasures.

If you gzip bomb them, whether you crash the crawler or another node, something, somewhere, will notice that these nodes aren’t having success. If they aren’t, they’ll don a disguise, making _your_ job harder.

This is, unfortunately, not an effective defense mechanism. It _is_ a funny one, though.

### [\###](#these-are-not-the-pages-you-are-looking-for) These are not the pages you are looking for

The problem with Jedi mind tricks is that they only work if the other party has a mind to play tricks on. The Crawlers do not. You can try fooling them into believing that a resource they want to access does not exist, you can try to tell them they do not have permission, you may even pretend to be a Teapot (Utah, or otherwise), but you will not succeed.

You see, the crawlers do not operate in isolation. They follow links, internal or external. If another site links to you, the crawler will assume that the link is legit. There’s even a chance they have a copy of it, that they obtained by other means (by having crawled it successfully earlier, having slipped through your defenses, or simply having bought a dataset). If they are faced with a torrent of errors, they will assume they’re blocked, and will enact countermeasures.

These are all simple defenses that people already tried, defenses that are trivial to circumvent. These defenses had workarounds way before the plague of the plagiarism machines appeared. The only result of this tactic is that they come back in disguise. That’s shooting ourselves in the foot. Not sure about you, but I don’t like to hurt my feet.

### [\###](#the-great-wall) The Great Wall

An effective tactic against the scrapers is to enact a Great Wall. A paywall, login-wall, proof-of-work wall, you name it. A wall the Crawlers cannot possibly evade. Some of these will work for a while, but they all come with a huge cost: they almost universally inconvenience the legitimate visitor too, sometimes substantially.

Why do I say they’ll work for a while? Because every wall can be evaded. It’s a question of time and money, and they have more of both than we do. A login-wall can be circumvented by buying passwords. A proof-of-work wall can be circumvented by doing the work - yes, that costs them, but again: they have more money than we do. More money than your average visitor does.

## [\##](#intermission) Intermission

What then can we do, if most defenses fail already, and new ones are doomed to fail when they reach enough spread to trigger a response from The Crawlers? _What do we do?_

I’d like to highlight a pattern in all of the defenses above: they all attempt at blocking the Crawlers. **What if we didn’t?**

## [\##](#the-cost-of-poison) The cost of poison

The Crawlers don’t really care what they ingest, as long as it resembles something trainable. They don’t like to get blocked, they don’t like countermeasures. So the best way we can achieve our aim of reducing our costs, is to serve The Crawlers something they’ll be busy munching on, which is cheaper to serve than the real content, and is still acceptable for the bots. That’s where the Poison comes in, and that is why I named my garbage generator “iocaine”.

You see, in the [Princess Bride](https://princessbride.fandom.com/wiki/Iocaine_powder), Iocaine powder is a colorless, odorless, and deadly poison from Australia. Something you don’t see, nor smell, nor taste - _exactly_ the kind of thing we want to serve the robots. Something other than the real content, but _to them_, something indistinguishable from valuable training material.

If they’re not blocked, if the Crawlers do not recognize the countermeasure, they will happily ingest garbage, and leave us alone otherwise. All we have to do is to figure out a way to serve garbage cheaper than the real thing. That’s going to be a challenge, because serving static files are cheap! So the common wisdom says, at least. But let us examine if that holds…

To do so, let us add another character to the stage: The Garbage Generator. The entire purpose of this thing is to generate small amount of garbage, as efficiently as possible, because we do not want to waste our own resources. We want it to be fast, and we want to serve the Crawlers fast too - because as we’ve seen above, if we try to slow them down, that will not always have the desired effect. If we serve them as fast as we can, they will still maintain their internal crawling speed - but we used less resources to serve them.

Both of our environments, the _Server_ and the _Homelab_ too, will run the garbage generator on the internet-facing system. Why? Because that’s the most efficient. Unlike many gigabytes of static files, the garbage generator does not need much space: a few megabytes of training data is all it needs. Its memory use is on the low side too. In short: we can afford running it on a constrained device, and that helps us save bandwidth.

### [\###](#a-poisoned-server) A poisoned server

On the _Server_, we have plenty of available CPU and RAM: we’re only serving static files, so most of the RAM is - ideally - used for caching, we can spare a few megabytes for garbage generation. So worst case scenario, we’ll trade a bit of CPU time for hopefully considerable bandwidth savings. That wouldn’t be a bad trade!

Let us look into how much bandwidth we’d save! A reasonably sized, decent looking page of garbage is around 3-4KiB. To err on the side of caution, we’ll crunch some numbers assuming the average size is on the larger side, 4KiB.

With five million daily requests, that’s 2GiB a day, somewhat below 60GiB a month. I’ll let that sink in for a moment.

Still waiting.

Ok, if you’re still with me, you may have scrolled back up to see how much data we served with no defenses up. This is 46GiB _less_ **daily**. And more than two orders of magnitudes smaller monthly. That is an astonishing amount of data we did not need to serve.

And the cost? The cost is negligible amount of memory, and a bit of CPU. But… how impactfull is that CPU load? It is dynamically generated, uncached garbage, afterall. It _must_ be somewhat expensive! You’d think so, but you wouldn’t entirely be correct. Garbage generation requires CPU and memory _only_: it never touches the disk after the initial training. As such, any time we’re serving garbage instead of a file that wasn’t in memory already, we’re spending less CPU time, and chances are, less memory too.

Even if you have a fast SSD, reading a file from disk, especially a small one, is going to cost more than generating similar amount of garbage from RAM alone. On top of the SSD being slower than RAM, there’s the filesystem tax, too. And as we established: with distributed crawlers, you can rarely keep a file cached.

However, once the Crawlers are dealt with through a garbage generator, the landscape will be very different: we’ll have far fewer requests, and there’s a decent chance that some can be cached, because human access patterns are very different than the Crawlers’. There’s a decent chance humans will land on one of a handful of pages, they’re more likely to request assets too, which many bots do not - and since we don’t waste caching on the robots, we can cache a whole lot more for the human visitor!

Not only does the garbage generator save a lot of bandwidth, not only is it faster than serving a static file from disk, it also reduces the pressure on the server, and its cache, so it can cache the human-frequented files more effectively!

### [\###](#we-have-poison-at-home) We have poison at home

Perhaps not surprisingly, similar things can be observed on the _Homelab_ too, except the savings there take a little different shape. The bandwidth saved is more, because when we serve garbage, we do not need to talk to the backend, so there’s no traffic on the WireGuard interface. That’s already a bigger save than on the _Server_.

The CPU and RAM costs of garbage generation is roughly the same. It might require a higher precentage of CPU time and RAM, but only because there’s less of those on the VPS. But the VPS is also not doing anything else now than serving garbage, and proxying the rest. It can afford a bit of extra CPU time, and the memory requirements are miniscule, even for a small VPS like in the _Homelab_.

As for the efficiency: because the _Homelab_ VPS never had direct access to the files, it was always slower to serve them. Not having to serve them saves not just bandwidth, but CPU and memory too, because the VPS doesn’t have to communicate with the backend to proxy things over. Even if we used a network filesystem instead of proxying, we’d still save time.

And like in the case of the _Server_, not having to deal with the robots allows the VPS to cache! And in _this_ case, that’s perhaps even more impactfull, because the cost of serving an uncached resource isa lot higher in the _Homelab_ case. With the bot-pressure gone, there’s a possibility that the VPS would be able to cache at least some of the requests.

As such, using a garbage generator is perhaps even a bigger win in the _Homelab_ case.

## [\##](#the-way-we-win) The way we win

Months of watching them, months of trying various defenses made me conclude that we’re not only able to fight the scourge that these Crawlers are, but we can actually win. We can’t make them go away, not overnight, nor anytime soon. But we can drastically cut down our costs (and mask our data in the process), while they’re still going to spend the same effort trying to slurp up and train on our garbage. It costs us nearly nothing to generate - so little, that by and large, garbage is cheaper to generate than it is to serve static files. Yet, they still come, they still download, they still train on it. Or maybe they don’t, but then they spend time on trying to detect the garbage. It costs _them_.

And the beautiful part? There are a _lot_ of different garbage generators. Each a little different, and each _instance_ of them is a little different too.

Will they try to counter it? If (when?) this kind of defense spreads enough - probably. But that’s going to be _their_ cost. They will have to develop countermeasures, and that’s a lot harder than generating garbage. By that time, we’ll have the upper hand. We already do.

Let me repeat that: **We already have the upper hand.**

We have elaborate tools that lets us identify the Crawlers with great certainty (some passively, some actively), we have tools that deny them the content, and we have grabage generators that denies them, _and_ saves us considerable resources too. We can combine these, we can mix and match as appropriate, and we can keep on building more tools, diverse tools. They may be able to counter some of them, but they cannot counter all of them. We have the advantage of our skill, and we have the strength in numbers: while there are a lot of different crawlers, there are more of us, independent developers, artists, creators. We can stand up and deny them.

All we have to do is keep fighting, and keep our work, our data, our art, our code where we can defend them. By opting out of Big Tech, by putting our code on Codeberg or SourceHut, rather than proprietary platforms, we deny them easy access. By hosting our own site, or hosting with an indie hosting service, we deny them easy access to our art.

**We** have the upper hand, because we can survive without Big Tech. We can **thrive** without them. They cannot exist without us. Take advantage of that.