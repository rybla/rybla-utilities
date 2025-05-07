---
title: "Choose-Your-Own-Adventure AI Dungeon Games · Gwern.net"
author: "Gwern"
publishedDate: "2021-06-06"
sourceUrl: https://gwern.net/cyoa
---

[NN sampling](/doc/ai/nn/sampling/index "Link to ai/nn/sampling tag index"), [GPT fiction](/doc/ai/nn/transformer/gpt/fiction/index "Link to ai/nn/transformer/gpt/fiction tag index"), [text game](/doc/fiction/text-game/index "Link to fiction/text-game tag index")

Neural networks like GPT-3 power text adventure games where you can do anything; but they are too expensive. I propose that if we turn them into Choose Your Own Adventure hypertext games, they become feasible and enable new gameplay.

2021-06-06–2021-06-22 _finished_ [certainty](/about#confidence-tags "Explanation of 'confidence' metadata: probability of overall being meaningfully correct, expressed as Kesselman Estimative Words (ranging 0–100%: 'certain'/'highly likely'/'likely'/'possible'/'unlikely'/'highly unlikely'/'remote'/'impossible')"): _possible_ [importance](/about#importance-tags "Explanation of 'importance' metadata: rating 1–10 about how much a topic matters to the world."): _4_ [backlinks](#backlinks "Reverse citations/backlinks for this page (the list of other pages which link to this page).") [similar](#similars "Similar links for this link (by text embedding).") [bibliography](#link-bibliography "Bibliography of links cited in this page (forward citations).")

*   [AID Problems](#aid-problems)
    *   [Stuck](#stuck)
*   [Rethinking Game Trees](#rethinking-game-trees)
*   [Choose Your Own Adventure](#choose-your-own-adventure)
*   [CYOA Advantages](#cyoa-advantages)
    *   [Newbies](#newbies)
    *   [Amortizing Generation Cost](#amortizing-generation-cost)
*   [Optimizing Trees](#optimizing-trees)
    *   [Happy Path](#happy-path)
    *   [Finetuning](#finetuning)
    *   [Ranking & RL Finetuning](#ranking-rl-finetuning)
    *   [Emergent Gameplay](#emergent-gameplay)
    *   [Combined: The CYOA Flywheel](#combined-the-cyoa-flywheel)
*   [Limitations: Gaming In Public](#limitations-gaming-in-public)
*   [See Also](#see-also)
*   [External Links](#external-links)
*   [Appendix](#appendix)
    *   [Game Tree Sizes](#game-tree-sizes)

> A useful variation on [_AI Dungeon_](https://en.wikipedia.org/wiki/AI_Dungeon "AI Dungeon")\-style (AID) text games would be to turn them into shared public game trees of pre-generated options which the player selects from, [Choose-Your-Own-Adventure](https://en.wikipedia.org/wiki/Choose_Your_Own_Adventure "Choose Your Own Adventure")\-[book](https://en.wikipedia.org/wiki/Gamebook "Gamebook") style.
> 
> This trades storing kilobytes for running teraflops and so can dramatically reduce costs as players spend most of their time reading cached output (rarely needing nor wanting to generate brandnew output requiring a NN run), can increase quality as players collectively uprank actions/outcomes which are highest-quality, and caters to newbies who don’t understand the power of NN-backed text games and flail around.

Revisiting _AI Dungeon_ (AID) in the light of a year of [GPT-3](/gpt-3 "'GPT-3 Creative Fiction', Gwern 2020"), I would like to propose a radical redesign of it based on the problems it has encountered. AID-1 was one of the most interesting uses of the [GPT-2](/gpt-2 "'GPT-2 Neural Network Poetry', Branwen & Presser 2019") & [GPT-3](/doc/www/arxiv.org/90cd91e98db4f7b0b1cd57da7c3713dbe34c2146.pdf#openai "'GPT-3: Language Models are Few-Shot Learners', Brown et al 2020") neural network models; computer games, forever frustrated by their inability to offer worlds as arbitrarily complex and realistic as a human [Dungeon Master](https://en.wikipedia.org/wiki/Dungeon_Master "Dungeon Master") running [Dungeons & Dragons](https://en.wikipedia.org/wiki/Dungeons_%26_Dragons "<em>Dungeons & Dragons</em>") games (which is effectively a collaborative fiction writing exercise), no matter how many verbs are added to the text adventure parser or how many 3D artists are hired, finally can handle _anything_ a player can type in, and improvise with it.

At its best, an _AI Dungeon_ game like [“My Musical Troupe of Orcs Uses Music to Advance Orc Rights”](https://web.archive.org/web/20191127163535/http://www.aidungeon.io/2019/11/my-orc-band-and-our-quest-for-equal.html "'_AI Dungeon 2_: My Musical Troupe of Orcs Uses Music to Advance Orc Rights', Walton 2019") really feels like simulating an entire world. Of course, as current NNs have many limitations (they are far from human-level intelligence, lack any kind of memory, are unable to plan, are not trained to create high-quality fiction, have weak common sense, etc), AID and its imitators typically does not deliver such a peak experience on average. And in practice, even the average experience tends to be compromised by current technical & economic realities—AID, as run by Nick Walton’s startup Latitude as of April–June 2021, has been experiencing problems relating to GPT-3 cost, and its use of the [OpenAI API](/doc/www/openai.com/e7b698d924327364328fcc135de15ee6e4823044.html "'OpenAI API', Brockman et al 2020") & OA’s mandatory moderation thereof.

# [AID Problems](#aid-problems "Link to section: § 'AID Problems'")

AID and imitators are currently designed in the most straightforward way possible: a seed text, often unique or customized, and then text generation step by step after waiting for player text responses. This causes 3 major problems:

1.  **Cost**: every turn invokes a full-cost call to a NN model. No matter what you do, this is always going to be expensive.
    
    This has devastating consequences on what players can be allowed to do and how often, how hard they must be monetized, how one is beholden to APIs, centralization requiring/enabling censorship, etc.
    
2.  **Quality**: models like GPT-3 can generate good output when cherry-picked at a level like ‘best of 20’; the other 19, however, range from ‘meh’ to ‘atrocious’. Few people have the patience, or funds, to do 20 samples per action/outcome, however, because of #1.
    
    If one _could_, however, the results might be stunning.
    
3.  **Learning Curve**: the default experience for AID seems to be to open it up, type in a few sentences like “Hello, I am a human”, decide it’s boring, and to quit.
    
    A generative model doesn’t automatically show you what it can _do_; one has to elicit by demanding cool stuff, of the sort most people quite understandably expect computers to be completely incapable of. (How can a computer be a good D&D DM when it also takes 20 seconds to load a social media website, which then is broken? How can a LLM possibly do anything interesting, when it can’t answer trick questions about the spelling of words?)
    

## [Stuck](#stuck "Link to section: § 'Stuck'")

Fixing these AID problems are intrinsically difficult. The AID model is inherently extremely expensive, and tweaks like [model sparsification/distillation](/doc/ai/nn/sparsity/index "‘NN sparsity’ directory") can deliver [only so much](/doc/www/arxiv.org/b91f3311b525c2aa3c0535d29c16a16699e5d55e.pdf "‘On the Predictability of Pruning Across Scales’, Rosenfeld et al 2020") in the way of cost savings before the quality goes to hell. The cost of GPT-3 is already a near-fatal problem for Latitude; [experience curves](https://en.wikipedia.org/wiki/Experience_curve_effects "Experience curve effects") in deep learning (see [Hernandez & Brown2020](/doc/www/arxiv.org/69ec12e2b9b1c001a978d916f515b5a75bc3f340.pdf#openai "Measuring the Algorithmic Efficiency of Neural Networks")) are fast, but we still aren’t going to see GPT-3-level models on low-end GPUs for several years to come (which is a long time to wait, however amusing problems may seem in retrospect), and whatever cost/efficiency gains algorithms & hardware give us, players may respond to by escalating demands. (It was not so long ago that people were dreaming of access to [GPT-2](/doc/ai/nn/transformer/gpt/2/2019-radford.pdf#openai "'Language Models are Unsupervised Multitask Learners', Radford et al 2019")\-1.5b; running & finetuning that or models up to 9b parameters is now ordinary, but GPT-3 has spoiled people for them. Once GPT-3-level NNs become available on home computers, players will doubtless clamor for voice-synthesis/3D-image/human-level interactions—much as there is _still_ an audience for ever more realistic 3D FPS games, despite regular predictions that ‘the latest PS1 \[or PS2 or PS5 or _Crysis_\] game has finally exhausted the possibilities of incremental gains in fancy graphics and now developers will _have_ to focus on gameplay’.)

# [Rethinking Game Trees](#rethinking-game-trees "Link to section: § 'Rethinking Game Trees'")

To solve this, we need to rethink AID entirely; AID is the first and simplest way to do a text game with NN models, but it may not be the best.

Games are often thought of in terms of ‘trees’ defined by actions and possible outcomes, like in chess or Go. All books exist in [The Library of Babel](https://en.wikipedia.org/wiki/The_Library_of_Babel "The Library of Babel"); when we explore the tree and select a possible text completion each time, we are search for one specific book in the Library. If we retrace our path and choose differently, we will end in a different part of the library, with different books. Text generation is also a tree—just a _wide_ tree.

Typically, in GPT-related apps, this is hidden from the player: you just see the blinking cursor, not a tree of possible text completions from there. Of this tree, the player sees only one branch; he can erase outputs and rewind to an earlier branch, but still can only see his current branch, and is blind to all the options. Anyway, it would be too difficult and expensive to show the player all the branches, because that requires generating many more samples, only to throw them away, likely unseen.

But what if we embraced the tree hidden behind the AID interface? What if we _didn’t_ throw them away? What if we kept all those branches we generated at such expense, and shared them with other players? How would we do that?

# [Choose Your Own Adventure](#choose-your-own-adventure "Link to section: § 'Choose Your Own Adventure'")

By playing not ‘neural net D&D’ but ‘neural net _Choose Your Own Adventure_’ (CYOA) text games instead: a game where instead of ‘generating’ the next turn, each page instead gives you a few good options to choose.

In a CYOA version of AID, everyone starts with a certain scenario(s), which describes a situation and lists, say, 5 possible actions. This is the root of the tree. Each of these actions is pre-generated by a model; a player chooses one to go to the next scene/node, and it is fetched from the database to show the outcome; only if the outcome hasn’t been generated before & is not cached, does the NN have to generate the outcome. Then another set of 5 actions is listed (also usually pre-generated). And so on. Unlike regular CYOAs, the adventure is never ending—because the NN just keeps expanding out terminal nodes on demand. And while it may sound complex, it is easy to implement.[1](#fn1)

Switching to a CYOA model solves all 3 problems with AID, and is not merely a cost-saving crutch coming at the expense of game quality—a CYOA approach enables many things that are hard or impossible with the default AID interface.

# [CYOA Advantages](#cyoa-advantages "Link to section: § 'CYOA Advantages'")

## [Newbies](#newbies "Link to section: § 'Newbies'")

A newbie firing it up for the first time is greeted by a UI that is as simple as can be, working just like a hypertext web browser, in a familiar format ([26% of Americans have read a CYOA](/doc/www/egamebook.com/d0a2cdcee51df0288f94e8125eb40b87a37fbc8e.html "'48% of Americans know what gamebooks are', Hracek 2015"), 20% more have heard of them) and immediately sucking them in with interesting options and outcomes on every page, more comprehensive, creative, and high quality than any normal single-authored CYOA could ever hope to be or compete with the hivemind of AI+human-community—the adventure never ends, it just slows down a bit when you go out of cache. There is no ‘cold start’ problem like there is with AID. No one will ever ask “but what do I _do_” of a CYOA. (What do you do? You click to find out whether throwing the anchor at the space-octopus works or if you should instead try to mind-meld with it to negotiate a peace-treaty between the space-octopii & humanity, that’s what you do. And then you discover the _advanced_ ways to use it…)

## [Amortizing Generation Cost](#amortizing-generation-cost "Link to section: § 'Amortizing Generation Cost'")

As players play through the game tree, the actions/outcomes are cached permanently, and the tree fills out. Soon, players are spending most of their time hitting cached pages. Such interactions are ~100% free: they’re just a few kilobytes fetched from a database. The more that players play, the cheaper each play/player becomes. Because of this cheapness, it is easy to scale up to many players, easy to afford high-quality rather than low-quality models, etc. (The use of a few ranked choices is critical: if regular freeform text inputs were allowed, they would probably not be all that much more interesting than curated choices, but the ‘branching factor’ would be like tens of thousands per node, and you can forget about caching anything.)

CYOA vs AID is not a hard dichotomy, but a spectrum of novelty vs cost.

A CYOA can interpolate anywhere between the 2 extremes: the CYOA extreme is 100% cached, pre-generated, and static; it is free to play, and you can host hundreds of thousands of players on a single dedicated server for a few bucks a month of hosting costs. The other extreme is the default AID extreme: there is zero caching, everything is generated on demand by expensive NNs just for that turn, and immediately thrown away; highly active players can easily rack up scores of dollars in OA API costs per month according to AID2 (due to playing hours a day using large history + finetuned models), and startups can burn through millions in VC capital catering to relatively small player bases, with few options for how to cut costs (OA isn’t going to cut the API bill, so what do you do? Degrade the model players paid for? Between a rock & a hard place there, and hell hath few furies like a gamer scorned). In between, one has a mix of a cached tree, and occasional generation events adding new nodes.

CYOA operators can adjust their spot on the spectrum by tweaking who can generate what when where at how much cost. For example, perhaps there is a ‘free tier’ who is unable to generate at all, and can only traverse existing nodes; or perhaps free tier players can generate at will, but only in public or even popular public sub-trees (to increase reuse probability), or only using the cheapest (smallest lowest-quality) model.[2](#fn2) If costs are too low, generations can be upgraded, new options generated to be added to popular nodes, players can be directed to interesting but under-explored subtrees to start fleshing them out, one’s idle GPU can go around filling out missing nodes during downtime just to be prepared for future players… ‘Whales’ are critical to game profitability, and they can be catered to in many ways, far more easily than in AID (which is already maximally expensive): perhaps they get 20 options instead of 5 generated for them, or perhaps they get dedicated GPUs filling out nodes in advance, so they never have to waste a few seconds waiting & twiddling their thumbs (ie. if they are at node depth X, then children nodes at depth X+1 & depth X+2 are generated in the background for them, rather than waiting for them to make a choice and only then generating a node).

Many options and possible settings to choose the point on the spectrum that balances cost, novelty, and playability, and avoiding the messy situations with AID’s costs. This makes it more likely that acceptable tradeoffs and an economically-feasible business model can be found.

# [Optimizing Trees](#optimizing-trees "Link to section: § 'Optimizing Trees'")

One can go further than simply offering up a tree with choices by optimizing the tree.

Choices can be ranked by popularity: bad choices, which few players care enough to choose, can automatically fall off the list and be replaced by new choices. Choices could be explicitly voted on to filter even more heavily. Players could have the option to reroll at any given point to stir in new options—this doesn’t undermine the cost savings because after filtering through 10 or 20 choices at a given node, the top 5 choices will almost certainly be much better than a random new choice, and so players just won’t bother unless the choices really are terrible. And nothing bars editing choices or writing new ones by hand to insert at a given node—the NN doesn’t care. Further, I refer to it as a tree, but it doesn’t need to be a tree either, only a _graph_ (classic CYOAs were not trees either, and sometimes weren’t even connected graphs!); the straightforward generation approach is relatively unlikely to loop back to existing nodes (the generated text would need to be identical, which is extremely unlikely), but more advanced models might be able to choose to link to an existing nodes, and players may find it quite useful to edit the game-tree as a graph to set up ‘hubs’ or ‘episodes’ or ‘loops’.

The ranking mechanism, it’s worth noting as a concrete example of how it improves quality game-wide, further helps solve AID’s problems with long-range coherency & memory, and problems like characters changing sex mid-scene as the NN ‘forgets’—if players do not want such contradictions or forgettings, then they simply will not choose the actions or outcomes which entail contradictions, and will tend to pick the ones which are consistent and continue the story well. The players collectively serve as the long-term memory and make up for the NN’s failings. (AID tries to solve this with a limited ‘notes’ function which hardwires ‘facts’ into each generation as a kind of long-term memory, but that uses up the context window and still doesn’t work well.)

Because of this flexibility, you may be able to use a cheap small NN and not the big fancy ones like GPT-3: sure, maybe the _average_ completion is not nearly as good, but the community will just upvote the best ones, edit in new ones as necessary, and will make the quality competitive. (You could start competing with AID right now using GPT-neo on your home desktop, no need to be a slave to the OA API and its many burdens!) Choices can also be tagged by players: “funny”, “dramatic”, “friendly”, “sexy” (perhaps color-coded)… NNs can [be chained](/doc/www/arxiv.org/5d14b0987f9515481e779f55ac4c9a23c3b5a021.pdf#google "AI Chains: Transparent and Controllable Human-AI Interaction by Chaining Large Language Model Prompts"), so it would be possible to generate generic actions and [style transfer](/doc/www/arxiv.org/66d3bfee9cebb10d9be66a5f33100684bc436df3.pdf#google "A Recipe For Arbitrary Text Style Transfer with Large Language Models") them, among other things. (“Say ‘hello’ but sexy”, “Say ‘hello’ but Scottish”, “Say ‘hello’ but surly”…)

## [Happy Path](#happy-path "Link to section: § 'Happy Path'")

People sometimes dislike the idea of procedural generation gameplay because they prefer a hand-written carefully-tailored plot or plot-tree which has a ‘happy path’ of highest-possible-quality content; this is reasonable, but a false dichotomy.

One can embed a standard structured plot _into_ procedural settings, and procedurally-generated games like [_Elite_](https://en.wikipedia.org/wiki/Elite_\(video_game\) "Elite (video game)")/[_Masters of Orion II_](https://en.wikipedia.org/wiki/Master_of_Orion_II:_Battle_at_Antares "Master of Orion II: Battle at Antares") or [_Nethack_](https://en.wikipedia.org/wiki/NetHack "NetHack") (or the standard RPG with ‘random encounters’) have always mixed in some degree of prewritten structure. For example, in Nethack, levels are randomly generated each game, but the key locations like the bottom-most castle & magic items needed to ‘ascend’ will always be present and roughly the same; there will always be a ‘mines’ level guarding a particularly useful item, which contains [Sokoban](https://en.wikipedia.org/wiki/Sokoban "Sokoban") puzzles (but these puzzles themselves will be generated). The happy path may trigger automatically, or it may be accessed by the player going to a particular location to ‘begin the plot’

A CYOA tree can embed a curated plot, distinguished by its high-quality. It could steer a player towards it by making the happy path choice always the first choice—players being lazy, they will be biased towards the first choice, especially if there is any convention of first=best. Sampling of new nodes could also be biased towards happy-path nodes: there are many ways to ‘pull’ or ‘steer’ a language model’s samples towards desired targets (the simplest just being measuring textual similarity with happy-path nodes and [throwing out](https://en.wikipedia.org/wiki/Rejection_sampling "Rejection sampling") samples which are too distant). One could also exploit the instructability of models to write chains of ‘out of universe’ editorial prompts defining ‘meta-plots’: “the next chapter should be funny, somehow, to offer a relief from the serious melodrama of the previous chapter”.

Many possibilities.

## [Finetuning](#finetuning "Link to section: § 'Finetuning'")

## [Ranking & RL Finetuning](#ranking-rl-finetuning "Link to section: § 'Ranking & RL Finetuning'")

Given enough rankings, one can then train a ranker to predict the score of a choice. This can be used to screen new generations, rerank existing sets of options on top of popularity/votes, and one could even do OA-style [preference learning](/doc/www/arxiv.org/35c4624c49a78d2ee73a8bdd67cfbc1f527fb333.pdf#openai "'Learning to summarize from human feedback', Stiennon et al 2020") to train a new better NN which directly tries to generate good completions rather than merely statistically likely completions (which is what a default or fiction-finetuned model is doing), enabling high quality generations without any human feedback.[3](#fn3)

## [Emergent Gameplay](#emergent-gameplay "Link to section: § 'Emergent Gameplay'")

A CYOA might sound stale and boring, but the curation means it’ll be quite the opposite because of the social aspects.

It would be like a hybrid of [HyperCard](https://en.wikipedia.org/wiki/HyperCard "Hypercard") & [MUDs](https://en.wikipedia.org/wiki/Multi-user_dungeon "Multi-user dungeon") (eg. [_Kingdom of Loathing_](https://en.wikipedia.org/wiki/Kingdom_of_Loathing "Kingdom of Loathing")), because CYOA paths are deep-linkable URLs, in a way AID is not: I can easily hand you a link to an arbitrarily deep node, and you can click on it and start playing exactly the same thing I am playing; there is nothing remotely like this for AID—even if you hand me a _scenario_, our games immediately diverge and there is no way for me to easily share my version with you. But with a CYOA tree, it’s all just URLs/paths/pointers. And “the street finds its own use for things”.

So a player can ‘author’ an adventure by carefully curating a premise and then choosing actions and backing up and editing, creating a full-fledged scenario in collaboration with the NN, and then announce the trail down the overall tree to the new sub-tree when the sub-tree is satisfactory. Or players can diverge into different sub-adventures and continuums, and communities can develop elaborate in-jokes and allusions across nodes, or influence the rankings to create ‘canonical’ stories or environments. If you’ve ever seen ‘forum quests’ (Internet evolution of [play-by-post tabletop RPG games](https://tvtropes.org/pmwiki/pmwiki.php/Main/PlayByPostGames "Play-by-Post Games")), imagine that, but with [parasocial](/doc/sociology/technology/parasocial/index "'Parasocial Relationships Online', Gwern 2020") factions contending to decide which option at a key node becomes the ‘True End’ and which ones are just ‘Bad Ends’. There might be elaborate discussions as groups step through adventures, debating which choices they all will take, with heretics reviled & exiled… Streamers might let fans vote to decide what fork they go down, and their hordes of fans follow them down it, voting with their feet for specific choices, and sculpting a particular stream.

## [Combined: The CYOA Flywheel](#combined-the-cyoa-flywheel "Link to section: § 'Combined: The CYOA Flywheel'")

So, this creates positive feedback loops in multiple ways:

1.  cheap play draws in new players, amortizing fixed costs over more players;
    
2.  the more players you have, the more caching reduces cost per player, enabling you to offer the same level of service or cut prices or invest in more generation;
    
3.  the more players and nodes, the better ranked choices become, increasing player happiness while decreasing node generation (further reducing cost);
    
4.  and the better choices and scenarios are by default, the more players will be drawn in by the quality rather than low costs, feeding into the previous 3 feedback loops;
    
5.  the more players, the more likely community effects are to kick in and enable creation of brandnew ways to play, driving 1–4.
    

Players of this might look down on regular AID-likes:

“You pay _how much_‽ Like, is that per year? And you get random illogical completions most of the time, while being unable to share good games, and it takes several hours just to get an idea what you can do? But how do you do quests together with your clan or [VTubers](https://en.wikipedia.org/wiki/VTuber "VTuber")? Wait, you don’t know what a ‘quest’ is? smh! Well, I suppose that’s OK for fapping (you pervert), but that sounds like about it. Why don’t you try CYOA for a bit? I found a funny one the other day, where you turn into a goose, who is naughty…”

# [Limitations: Gaming In Public](#limitations-gaming-in-public "Link to section: § 'Limitations: Gaming In Public'")

The main flaw with this is that people might want the contents of the tree to remain secret—that it’s not enough to merely have no names associated with it, but the content itself must be secret. Perhaps the content has private data like names of people one knows, or is the thought of anyone ever reading it is just sheer mortification. If people only want limited customization, like “Hi, $NAME!”, then that’s easy to handle with templating/prompts, somewhat like AID’s current world-variables, but that doesn’t work for f—ked-up porn.

I don’t see how CYOA-AID can too easily handle such use-cases, aside from making trees per-account private, and the player having to pay full-freight for any new nodes. But this is no worse than they currently undergo with AID, so that seems fine to me. (People generating f—ked-up porn are no worse off, are potentially better if they create shared porn-trees, perhaps restricted to small opt-in communities[4](#fn4), and are much better off when they play the regular trees.) Perhaps everyone greatly overestimates the appeal of customization, because in AID, it costs exactly the same as non-customized; OnlyFans notwithstanding, there are millions of viewers for regular porn stars’ videos, after all. So the requirement of game trees being public may not be a big deal.

# [See Also](#see-also "Link to section: § 'See Also'")

*   [This Waifu Does Not Exist](/twdne "'This Waifu Does Not Exist', Gwern 2019")
    

# [External Links](#external-links "Link to section: § 'External Links'")

*   [_Behind The Throne_](/doc/www/localhost/15f364e684436e4e13c24a9ad1fde15fb2dacb01.html "Thinkwert 2025"), [_Dead Planet_](/doc/www/localhost/cdb9faa1ab6d951d879b9f52534a1451f1d332ad.html "Thinkwert 2025") (Thinkwert)
    
*   [“Complex game worlds, simple interfaces”](/doc/www/egamebook.com/21bca4a61a1e6a797ff58c51ded03ec21ee27f83.html "'Complex game worlds, simple interfaces', Hracek 2015")
    
*   [_Endless Visual Novel_](https://endlessvn.io/ "Endless Visual Novel") ([“We’re making a new AI storytelling game with AI-generated graphics and music”](/doc/www/old.reddit.com/744a373c253961f8938f9fb13d2c8bb756d6a969.html))
    
*   [“1999: _King of Dragon Pass_”](https://if50.substack.com/p/1999-king-of-dragon-pass "1999: King of Dragon Pass") ([WP](https://en.wikipedia.org/wiki/King_of_Dragon_Pass "King of Dragon Pass")), [“2009: _Fallen London_”](https://if50.substack.com/p/2009-fallen-london "2009: Fallen London") ([WP](https://en.wikipedia.org/wiki/Fallen_London "Fallen London"); experiments in semi-synthetic text adventures with modular narratives); [“2003: _The Kingdom of Loathing_”](https://if50.substack.com/p/2003-kingdom-of-loathing "2003: The Kingdom of Loathing") ([WP](https://en.wikipedia.org/wiki/Kingdom_of_Loathing "Kingdom of Loathing")), [“1997: _Achaea_”](https://if50.substack.com/p/1997-achaea "1997: Achaea - by Aaron A. Reed - 50 Years of Text Games") ([WP](https://en.wikipedia.org/wiki/Achaea,_Dreams_of_Divine_Lands "Achaea, Dreams of Divine Lands")), [“1990: _LambdaMOO_”](https://if50.substack.com/p/1990-lambdamoo "1990: LambdaMOO") ([WP](https://en.wikipedia.org/wiki/LambdaMOO "LambdaMOO")), [“Welcome to Armageddon!”](/doc/www/cabinetmagazine.org/1ae3602c2b07aa0ce63b515568348f8947872014.html "A philosophy of 'permadeath' in the multiuser dungeon") ([WP](https://en.wikipedia.org/wiki/Armageddon_\(MUD\) "Armageddon (MUD)")), [“2011: _Nested_”](https://if50.substack.com/p/2011-nested "2011: Nested - by Aaron A. Reed - 50 Years of Text Games"); [“2015: _Lifeline_”](https://if50.substack.com/p/2015-lifeline "2015: <em>Lifeline</em>") ([WP](https://en.wikipedia.org/wiki/Lifeline_\(2015_video_game\) "Lifeline (2015 video game)")); [_The Gostak_](https://if50.substack.com/p/the-gostak "<em>The Gostak</em>")
    
*   [“Standard Patterns in Choice-Based Games”](/doc/www/heterogenoustasks.wordpress.com/927e47e1d10dd1b25586b7dc48eaa3a5a4ab5cdd.html "Standard Patterns in Choice-Based Games")
    
*   [“Scheherazade: Crowd-Powered Interactive Narrative Generation”](/doc/fiction/text-game/2015-li-2.pdf "'Scheherazade: Crowd-Powered Interactive Narrative Generation', Li & Riedl 2015b"), Li & Riedl2015 ([crowdsourcing](https://en.wikipedia.org/wiki/Crowdsourcing "Crowdsourcing") a DAG of text nodes)
    
*   [“By the Numbers: How to Write a Long Interactive Novel That Doesn’t Suck”](/doc/www/www.choiceofgames.com/5a6d41752106f5a75dcecbc02616cfe4fc4b7ea6.html "By the Numbers: How to Write a Long Interactive Novel That Doesn’t Suck") (hidden state to switch between choices)
    
*   [“TextWorldExpress: Simulating Text Games at One Million Steps Per Second”](/doc/www/arxiv.org/a5d9fda6525f07d7fe7e44cfdd2c52ad86f0b1f9.pdf "'TextWorldExpress: Simulating Text Games at One Million Steps Per Second', Jansen & Côté 2022"), Jansen & Côté2022
    
*   [“Social Simulacra: Creating Populated Prototypes for Social Computing Systems”](/doc/www/arxiv.org/2b8d932ac6e814643fe5a474fe968f4b55e942f2.pdf "'Social Simulacra: Creating Populated Prototypes for Social Computing Systems', Park et al 2022"), Park et al 2022 (“Social simulacra take as input the designer’s description of a community’s design—goal, rules, and member personas—and produce as output an instance of that design with simulated behavior, including posts, replies, and anti-social behaviors.”)
    
*   [“Whimsy: Get Your Kids to Love Reading with Choose-Your-Own Adventures, powered by GPT-4! 🤖”](https://www.whimsyapp.com/ "Whimsy - An AI-powered story app for kids")
    
*   [Hypersplit](/doc/www/news.ycombinator.com/5af562af4159ae2ce7f4934405e81a47ddfb695b.html)
    

# [Appendix](#appendix "Link to section: § 'Appendix'")

## [Game Tree Sizes](#game-tree-sizes "Link to section: § 'Game Tree Sizes'")

Despite the possibility of exponential growth, game trees can be extremely large—into the billions of nodes—before storage becomes any concern on modern storage devices, since terabytes or petabytes can be rented easily on hobbyist budgets like $123.98$1002021/month. > > Thus, the real challenge is creating a large game tree worth storing at all.

According to the [second _AI Dungeon 2_ database leak report](/doc/www/github.com/f961c98ae5fd6ec9b438e5d09530ac8baf336c2d.html "'_AI Dungeon_ Public Disclosure Vulnerability Report—GraphQL Unpublished Adventure Data Leak', AetherDevSecOps 2021"), AID had available 1 billion “actions” (turns) in 50 million adventures (games). This translates to a mean ~200 turns per game, with an unknown but probably small amount of rerolling or backtracking.

The 184 [classic](https://en.wikipedia.org/wiki/List_of_Choose_Your_Own_Adventure_books "List of Choose Your Own Adventure books") [CYOA books have complicated graphs](https://www.atlasobscura.com/articles/cyoa-choose-your-own-adventure-maps "'These Maps Reveal the Hidden Structures of <em>Choose Your Own Adventure</em> Books: If you decide to see more, click on this story', Laskow 2017"), but the books generally ranged 100–200 pages (usually closer to 100) where each page is a discrete node with typically 2 choices; the graphs tend to be ‘wide’, and a book might have as many as 42 endings (which are terminal nodes). Apparently the single longest path in any CYOA book is 61 nodes (in _Surf Monkeys_, which then has fewer endings to make up), and most are much less. (For comparison, the average chess game is something like 40–50 moves, and the average Go game ~200 moves.) The ‘bushiest’ CYOA book offers 48 non-terminal nodes or ‘decision points’ (_By Balloon to the Sahara_), so the entire series might be somewhere on the order of 19,000 total nodes with perhaps 7,000 decision nodes?

Thus, it’s possible to offer a worthwhile experience with game-trees with depths on the order of 20.

Now, consider a tree with 2 or 3 choices per node, and the worst-case where there are no imbalances & we must store every possible node. How does this work, storage-wise?

After 10 turns, you still only have 2,047 nodes (210 − 1 + 1, a full [binary tree](https://en.wikipedia.org/wiki/Binary_tree "Binary tree")). This is a small & affordable number, no matter how they are generated. And once they are generated and cached, they are free for the rest of eternity. No matter how many millions or billions of players go through the first 10 turns, they are all 100% free once you generate those 2047 nodes.

Even 20 turns deep, the tree is still only ~2 million nodes. (AID had >500×, over 1 billion ‘nodes’, and that was with clamping down on use due to cost.) And remember, it’s a spectrum with CYOA turning into AID as the cache miss rate increases: at worst, with 0% cache hit rate, you are merely as inefficient and expensive as AID (the player somehow contrives to hit a new uncached node every single time & the NN must be used), while at best, 100% cached, you are infinitely cheaper (player hits only cached nodes which are a tiny string of text [read instantly](/doc/www/www.sqlite.org/ea437be2fd093a01800489ce74f0bea99b367eff.html "SQLite: 35% Faster Than The Filesystem [for small files]") from your database served using ~unlimited bandwidth).

Another way to put it is to back out storage requirements: you can rent a 12tb server from Hetzner for ~$61.99$502021/month, which is easy for anyone to pay for as a hobby or startup. After overhead, the OS, and the server software, let’s say that gives you 10tb of database. A node requires maybe 1kb of space (>512 bytes, the action texts, and a couple integer IDs) for an implementation lacking any fancy features like tagging or annotations. We’ll ignore any compression.

So, you can store 10TB × 1000GB/TB × 1000MB/GB × 1000KB/MB = 110 or 10 billion or 10,000,000,000 nodes in that server. For the binary tree, that’s storing a complete total game-tree of _34_ turns before it is even possible to go out of cache; add another server or wait a few years to double capacity, and you go down to 35 turns, and so on. (For 3 choices, that’d be more like 21 turns, I think.) If you are willing to build your own box stuffed with drives instead of using off-the-shelf dedicated servers, it’s entirely possible to build petabyte boxes (40 turns deep) for maybe $12,397.8$10,0002021 (since a 10tb drive costs ~$123.98$1002021, so 100 of those…) or bigger (accumulate 10 of those petabyte boxes, and you’re 44 turns deep).

So, you can plausibly create trees covering a large fraction of game time, which will then save a large fraction of generation requests, and all this well before reaching AID scale (which is itself surely a lower bound on how much will be feasible in the future). Nor is storage of text is a major barrier, as text is just extremely cheap and getting cheaper. This leaves _generating_ is the main cost here—terabytes of high-quality NN text doesn’t come cheap. The major challenge for a CYOA game tree, economically, is the bootup period, the phase where the game tree is small and most of it not yet generated or paid for and [the flywheel](#combined-the-cyoa-flywheel) has not started up.

* * *

1.  While the ranker+RL model would be nontrivial, most of this would be relatively trivial to implement, and a CRUD web app, nothing complicated. It’s just a tree, after all. You keep a list of action IDs associated with each outcome ID, and follow the pointers etc.[↩︎](#fnref1)
    
2.  Even small reductions in quality may push generation requests off a cliff. It will be extremely unlikely that they’ll generate a better choice than the community has curated using the highest-quality model’s suggestions, so they’ll prefer to keep using those & so they won’t generate new choices unless they _have_ to, and so the operators can be lenient about it since there won’t be much load, and everyone is happy.[↩︎](#fnref2)
    
3.  OA-style [PPO](/doc/www/arxiv.org/3bea63801e4be23388010d93ad52af1f08638214.pdf#openai "'Proximal Policy Optimization Algorithms', Schulman et al 2017") might be obsolete now. [I found it](/gpt-2-preference-learning "'GPT-2 Preference Learning for Music Generation', Gwern 2019") difficult, requiring multiple RAM-hungry models with special finicky slow [reinforcement learning](https://en.wikipedia.org/wiki/Reinforcement_learning "Reinforcement learning") training for relatively poor results, and so no one does it—but the new [Decision Transformer](/doc/www/sites.google.com/6d52698eb87380d0a5f8db5680fd2cf2bf7a1cc9.html "'Decision Transformer: Reinforcement Learning via Sequence Modeling', Chen et al 2021") demonstrates that [you can probably do this with a _single_ self-supervised model](/gpt-2-preference-learning#decision-transformers-preference-learning-as-simple-as-possible "'GPT-2 Preference Learning for Music Generation § Decision Transformers: Preference Learning As Simple As Possible', Gwern 2019") simply by treating it as a text finetuning problem and formatting ranked choices appropriately before doing normal finetuning self-supervised training. So if you can finetune a GPT model on a fiction dataset, you are also trivially able to train a ranker & RL-optimized model![↩︎](#fnref3)
    
4.  Regular public game-play can be billed as a fixed-fee all-you-can-eat subscription; totally private play can be billed per-generation; game-trees shared among more than 1 player but not across the public as an investment in the future is a little trickier.
    
    You could imagine a subscription bill which simply divided number of players with access by the total cost of that tree that month, but regardless of the opt-in, players might balk at the ‘unfairness’ of the cross-subsidies: “I didn’t read any of our tree last month because I was busy, but the other guys went wild and my bill doubled!”
    
    It might be simpler to bill per-generation, and perhaps rely on general pro-socialness, and a bit of gamification, like a leaderboard of who in the community paid for more of the tree than the rest. (Perhaps whales will be happy to bask in the esteem from their generosity?)[↩︎](#fnref4)
    

# [Backlinks](#backlinks-section "Link to section: § 'Backlinks'")

[\[Backlinks (what links here)\]](/metadata/annotation/backlink/%252Fcyoa.html "Reverse citations/backlinks for this page (the list of other pages which link to this page).")

# [Similar Links](#similars-section "Link to section: § 'Similar Links'")

[\[Similar links by topic\]](/metadata/annotation/similar/%252Fcyoa.html "Similar links for this link (by text embedding). Lazily-transcluded version at footer of page for easier scrolling.")

# [Bibliography](#link-bibliography-section "Link to section: § 'Bibliography'")

[\[Bibliography of links/references used in page\]](/metadata/annotation/link-bibliography/%252Fcyoa.html "Bibliography of links cited in this page (forward citations). Lazily-transcluded version at footer of page for easier scrolling.")