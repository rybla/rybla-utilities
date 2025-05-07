# Journelly: like tweeting but for your eyes only (in plain text)

May 1, 2025

On iOS, we're spoiled for choice when it comes to note-taking, journaling, or social media apps. In note-taking alone, I've flip-flopped back and forth between different note-taking and journaling apps. For one reason or another, none would stick. My initial attempt at building such an app faded just the same. That is, until I realized what I really wanted was a cocktail of sorts, combining user experiences from all three kinds. Only then, I finally gained some traction and Journelly was truly born.

I'm happy to share that, as of today, Journelly is generally available on the App Store. Check out [journelly.com](https://journelly.com/) for all app details or just read on...

[![download-on-app-store.png](https://xenodium.github.io/images/journelly-like-tweeting-but-for-your-eyes-only/icon.png)](https://apps.apple.com/app/id6470714669)

[![download-on-app-store.png](https://xenodium.github.io/images/flat-habits-for-ios/download-on-app-store.png)](https://apps.apple.com/app/id6470714669)

## Like tweeting, but for your eyes only

While bringing social to note-taking was categorically never a goal, we got a thing or two we can draw from social media apps. They make it remarkably easy to browse and just share stuff.

All my previous mobile note-taking attempts failed to stick around almost exclusively because of friction. By bringing a social-media-like feed to my notes and making it remarkably easy to just add and search for things, app stickiness quickly took off.

Of course, these being my personal notes, privacy is non-negotiable. With Journelly being offline by default, combining elements from note-taking, journaling, and social media apps, I came to think of Journelly's experience as "tweeting but for your eyes only".

![](https://xenodium.github.io/images/journelly-like-tweeting-but-for-your-eyes-only/sideways.jpg)

## Is it a notes app? Journaling app? It's whatever you want it to be…

I like how journaling apps automatically bundle timestamps with your entries and maybe additional information like location or even weather details. At the same time, splitting my writing between two apps (quick notes vs. journaling) always felt like unnecessary friction. Even having to decide which app to launch felt like a deterrent.

While my typical Journelly use-case hops between taking notes, journaling, today's grocery shopping list, saving a few links from the web, music, movies—the list goes on… jcs from [Irreal](https://irreal.org/blog/) puts it best: "[Journelly is a bit of a shape shifter](https://irreal.org/blog/?p=12908)." With just enough structure (but not too much), Journelly can serve all sorts of use-cases.

## No lock-in (powered by org plain text)

While I want a smooth mobile note-taking experience, I also don't want my notes to live in a data island of sorts. I'm a fan of plain text. I've been writing my notes and blog posts at xenodium.com using [Org](https://orgmode.org/worg/org-syntax.html) plain text for well over a decade now, so my solution naturally had to have some plain text thrown at it.

Journelly stores entries using [Org](https://orgmode.org/worg/org-syntax.html) markup for now, but [Markdown](https://www.markdownguide.org/basic-syntax/) is coming too. Interested in Markdown support? [Please reach out](mailto:journelly+markdown@xenodium.com?subject=I'm%20interested%20Markdown%20for%20Journelly&body=Just%20want%20to%20register%20my%20interest%20in%20Markdown%20support%20for%20Journelly). The more requests I receive, the sooner I'll get it out the door. Oh, and since we're talking Markdown, I also launched [lmno.lol](https://lmno.lol/), a Markdown-powered blogging service (minus the yucky bits of the modern web). Custom domains are welcome too. My xenodium.com blog runs off [lmno.lol](https://lmno.lol/).

Is it really powered by Org markup? Go ahead and fire up your beloved [Emacs](https://www.gnu.org/software/emacs/), [Vim](https://www.vim.org/), [Neovim](https://neovim.io/), [VS Code](https://code.visualstudio.com/), [Sublime Text](https://www.sublimetext.com/), [Zed](https://zed.dev/)… and take a peek. It's just text.

![](https://xenodium.github.io/images/journelly-like-tweeting-but-for-your-eyes-only/emacs.gif)

Having shown you all of that, this is all just cherry on the implementation cake. You need not know anything about markups to use Journelly. Just open the app and start writing.

## iCloud syncing (optional)

While Journelly is offline by default, you may optionally sync with other devices via iCloud.

Folks have reported using [Working Copy](https://workingcopy.app/), [Sushitrain](https://github.com/pixelspark/sushitrain), or [Möbius Sync](https://mobiussync.com/) for syncing, though your mileage may vary. As of v1, I can only offer iCloud as the officially supported provider.

There's little structure enforced on Journelly entries. Write whatever you want. If you want some categorization, sprinkle entries with your favorite hashtags. They're automatically actionable on tap, enabling quick searches in the future.

## Thank you beta testers!

Nearly 300 folks signed up to [Journelly's TestFlight](https://xenodium.com/journelly-open-for-beta). Thank you for testing, reporting issues, and all the great suggestions. While many of your feature requests made it to the launch, I've had to defer quite few to enable the v1 release. The good news is I now have a healthy backlog I can work on to bring features over time.

## Support indie development

The [App Store](https://www.apple.com/app-store/) is a crowded place. Building ✨sustainable✨ iOS apps is quite the challenge, especially when doing right by the user. Journelly steers clear of ads, tracking, distractions, bloat, lock-in, and overreaching permissions. It embraces open formats like [Org](https://orgmode.org/) markup, safeguarding the longevity of your data.

Support independent development.

[![download-on-app-store.png](https://xenodium.github.io/images/journelly-like-tweeting-but-for-your-eyes-only/icon.png)](https://apps.apple.com/app/id6470714669)

[![download-on-app-store.png](https://xenodium.github.io/images/flat-habits-for-ios/download-on-app-store.png)](https://apps.apple.com/app/id6470714669)

 [![LMNO.lol](https://xenodium.github.io/images/journelly-like-tweeting-but-for-your-eyes-only/lmno-icon.png)](https://lmno.lol/)[![Plain Org](https://plainorg.github.io/favicon.ico) ](https://plainorg.com/)[![Scratch](https://xenodium.github.io/images/scratch-a-minimal-scratch-area/scratch_icon.png) ](https://apps.apple.com/app/id1671420139)[![Flat Habits](https://flathabits.github.io/favicon.ico) ](https://flathabits.com/)[![Fresh Eyes](https://xenodium.github.io/images/fresh-eyes-now-on-the-app-store/fresh_eyes_icon.png)](https://apps.apple.com/app/id6480411697)

[sponsor](https://github.com/sponsors/xenodium) my [content](https://xenodium.com/) and [projects](https://github.com/sponsors/xenodium)

powered by [LMNO.lol](https://lmno.lol/)

[privacy policy](https://lmno.lol/blog/privacy-policy) · [terms of service](https://lmno.lol/blog/terms-of-service)