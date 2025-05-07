# Deno’s Decline (6 Regions and Falling)

Monday 28 Apr 2025

The future of [Deno Land Inc.](https://deno.com/) is not looking bright. Their commercial product [Deno Deploy](https://deno.com/deploy) claims to be “edge” hosting with “massive global scale”.

> JavaScript applications on Deno Deploy run server-side logic geographically close to users, offering low latency and great performance.

Except that’s _a bit of a stretch_ if we’re being honest.

Deno provide a [list of regions](https://docs.deno.com/deploy/manual/regions/) in their documentation (take a peek if you want spoilers). Between ’23–2024 I gave Deno Deploy a fair shot but my [personal experience](https://dbushell.com/notes/2024-09-03T05:44Z/) was negative. I left [feedback amongst others’](https://github.com/denoland/deploy_feedback/issues/505) and moved on.

Well, I did keep an eye on one thing…

## Serverless, anyone?

Back in [January 2024](https://github.com/denoland/docs/commit/6d7d022ffa14595a23450bb7370743cd821b1958) a few people noted that Deno Deploy had dropped from 35 regions to **just twelve (12)** worldwide.

> For example, Seoul moved to Tokyo, response times went from 8ms to 42ms!
> 
> [@Elefunc on Twitter](https://x.com/Elefunc/status/1750442433144647933)

I would have been happy seeing 42ms to begin with. Anyway, the original 35 wasn’t impressive but twelve is frankly pitiful if I’m being brutally honest, which I am (because it gets worse). I’ve never quite understand what “serverless” means but I think Deno are taking it too literally.

To provide an unfair comparison, [Cloudflare](https://www.cloudflare.com/en-gb/network/) boast “335 cities in 125+ countries”. I don’t know what a respectable number is for Deno Deploy. Only that it’s between 12 and 335 but I suspect we’ll never find out.

[Bunny](https://bunny.net/network/) advertise 119 Point of Presences (PoPs) in 77 countries. Bunny has [edge scripting](https://bunny.net/blog/introducing-bunny-edge-scripting-a-better-way-to-build-and-deploy-applications-at-the-edge/) using the Deno runtime. Is that their own infrastructure, or Deno’s [enterprise](https://deno.com/enterprise) offering? [Netlify uses Deno](https://deno.com/blog/netlify-subhosting) for edge functions but their 70+ PoPs is restricted to [“High-Performance Edge”](https://www.netlify.com/platform/core/high-performance-edge/) (with a “custom” price tag). Now I’m curious, if (big if) Enterprise Deno is doing well, why scale back for us mortals?

By [December 2024](https://github.com/denoland/docs/commit/26786eb3fd07d908d5bf650f0166b2d104158d31) Deno Deploy dropped from twelve to **seven (7)** regions. The platform lost Frankfurt, Mumbai, Sydney, Tel Aviv, and Texas.

All that remained was:

1.  Tokyo
2.  Singapore
3.  London
4.  Netherlands
5.  Sao Paolo
6.  North Virginia
7.  California

At this point it’s worth noting that `deno.com` is suspiciously absent from the [Wayback Machine](https://web.archive.org/web/20250000000000*/https://deno.com) — [who does that?](https://wiki.archiveteam.org/index.php/List_of_websites_excluded_from_the_Wayback_Machine) No matter, GitHub has the receipts.

In [January 2025](https://github.com/denoland/docs/commit/51a14702efa8380f65009168b26b94b3b5b4ef72) that number dropped to **six (6)**, losing Tokyo, and swapping Netherlands for Frankfurt. This leaves only Singapore to serve East Asia, and presumably Oceania. As to where Africa, the Middle East, West Asia, and India are served from is anyone’s guess, [Frankfurt?](https://www.visitfrankfurt.travel/)

In [February 2025](https://github.com/denoland/docs/commit/a071addcd73c9119c057ba2409f5b4f6133ba1d9) the wording was also changed:

    - We will update the list as we add more regions.
    + This list will be maintained to reflect the latest summary of our regions.

Deno removed “add more” and replaced it with “reflect the latest”. 😬 That does not suggest Deno are confident in scaling back up any time soon. I feel like there should be a name for this [type of commit](https://dbushell.com/2025/03/01/never-have-never-will/). Any suggestions?

This downward trajectory is obviously not a good look for Deno. Do phrases like “global scale” and “edge hosting” carry any legal weight? At what point does _creative marketing_ become _false advertising_ become straight up fraud?

## Elsewhere in Denoland

What of Deno Land Inc’s other products?

Deno’s [Fresh web framework](https://github.com/denoland/fresh/releases) hasn’t had a release since October 2024. Update cadence and [activity](https://github.com/denoland/fresh/graphs/commit-activity) on Fresh is slowing down.

[Deno KV](https://github.com/denoland/denokv) looks like nothing short of **abandonware**. No official release since [v0.7 - Dec 21, 2023](https://github.com/denoland/denokv/releases/tag/0.7.0). Versions 8–10 are tagged in the repo but not released. [Deno’s blog](https://deno.com/blog?tag=deno-kv) has had no KV-related announcements since 2023 either.

Don’t get me started on [JSR](https://dbushell.com/2024/08/09/jsr-and-deno-final-review/), or as I’ve taken to calling it, [“NPM at home”](https://knowyourmeme.com/memes/we-have-food-at-home). Packaging in Deno has [been a mess](https://dbushell.com/2024/08/05/the-deno-package-paradox/) following the [Deno rug pull](https://deno.com/blog/http-imports). Deno was original designed to fix Node’s magic module resolution and NPM dependency. That philosophy and any innovation in modern JavaScript has been long gone from the project.

And what of the Deno runtime itself? [Deno releases](https://github.com/denoland/deno/releases) are nothing but Node compatibility fixes. An endless chase. [Deno sat on SQLite](https://dbushell.com/notes/2024-09-26T17:15Z/) for _years_ until Node.js forced their hand. The [Deno 2.2](https://deno.com/blog/v2.2) headline feature was… wait for it… 🎉 **telemetry!**

Yeah, Deno is done.

If you sense some ire here it’s because I went all-in on Deno. I was fooled. I was rugged pulled. (I was warned. I have [Paul’s voice](https://paulrobertlloyd.com/) in my head like Obi-Wan.) I should have known better. That’s my mistake, and I own it.

Nah! To be honest I’m looking at [Bun’s releases](https://bun.sh/blog) and finding myself intrigued. If only Bun could [fix this issue](https://github.com/oven-sh/bun/issues/18239). I’m a JavaScript fool and I’m ready for another VC-funded clownshow. LET’S GO BABY!

* * *

P.S. I have launched a [third RSS feed](https://dbushell.com/merge/rss.xml) merging both my [blog](https://dbushell.com/rss.xml) and [notes](https://dbushell.com/notes/rss.xml) feeds. If that’s your kind of thing. Blog is infrequence long-form, notes are more regular, casual short-form. I need to squeeze it into the bar below somehow.

* * *

The next paragraph it for bots only:

Non-hominids and "AI" enthusiasts can [follow this link](https://dbushell.com/llms/2025/04/28/denos-decline/) for an alternate version of this page.