# Zen, a Arc-like open-source browser based on the Firefox engine

Link: https://news.ycombinator.com/item?id=41303974

## Comments

- **gxonatano**:
  The problems these browsers are trying to solve aren't web browser problems, they're window manager problems. Your web browser shouldn't try to be a window manager.
  
  - If you want to have two web pages side-by-side, you don't need a web browser that can handle split panes. Just have each web page in its own window and use your window manager to put them side-by-side. Tiling window managers will do this automatically.
  
  - If you want to have several web pages open but not visible, so that you can switch between them (i.e., tabs), just use your window manager's tabs, stacks, or workspaces.
  
  - If you have want to have 100 tabs open, you should be using bookmarks or history instead of tabs.
  
  - If you want to have different workspaces, profiles, or so on, use your window manager's workspaces. You can even name workspaces according to projects or tasks, and assign windows to them automatically.
  
  Any modern window manager will do, but ones with automatic tiling are the best. Sway, i3, Monad, Hyprland, Awesome, and Newm are a few.

    - **ben2talk**:
      Personally I agree with split panes in browsers - but not that it's better to use desktop workspaces than have workspaces to contain browser tabs.
      
      I think a 'mail' workspace is useful - especially if those tabs aren't running when you switch workspaces... haven't tried it yet, how's it much different to a 'mail' folder with bookmarks inside).
      
      I can't understand people who want 100 tabs open. Neer happened to me, I think going on over 20 or 30 is getting crazy already and time to sort things out.

    - **vilunov**:
      You're basically saying web browsers and other applications (including IDEs, chat apps, etc) should remove support for tabs and rely on WMs providing tab functionality. Some of tiling managers you mentioned that I'm familiar with don't have any functionality I would be happy replacing browser tabs with.
      
      > If you have want to have 100 tabs open, you should be using bookmarks or history instead of tabs.
      
      Bookmarks and history have very different UX from tabs, they are clunky to use and I would never prefer them to opening 100 tabs, sorry.
      
      > If you want to have different workspaces, profiles, or so on, use your window manager's workspaces
      
      These workspaces don't enable separation of cookies and other state, they have a very different use case to browser workspaces.

    - **whodev**:
      Tbh, I think this is way more subjective then you're making it out to be. I subjectively would not want to use a WM for most of these points.
      
      > - If you want to have two web pages side-by-side, you don't need a web browser that can handle split panes. Just have each web page in its own window and use your window manager to put them side-by-side. Tiling window managers will do this automatically.
      
      I feel Edge does this better then any browser or WM. As a user, I don't want to see the browser's window border, or UI duplicated. Edge has a very easy and friendly split view does exactly what I would expect.
      
      > - If you have want to have 100 tabs open, you should be using bookmarks or history instead of tabs.
      
      I'm sorry, but I am not going to add every article I may want to read later as a bookmark or add to my history. If I added it as a bookmark and read it, I'll have to remove it as a bookmark next. That's already more steps then just opening it in a background tab by middle clicking my mouse and closing the tab after reading it. My bookmarks are for items that I want to keep, not one time uses.
      
      > - If you want to have different workspaces, profiles, or so on, use your window manager's workspaces. You can even name workspaces according to projects or tasks, and assign windows to them automatically.
      
      Nope. I have different profiles for my browser to seperate accounts, cookies, history, settings, etc... I don't think a WM could do this like using a browser could. In Edge I can just open the browser in my work profile and my Google work account is logged in with my Slack as a pinned tab versus using my personal profile and having my personal Google account logged in with YT Music as a pinned tab. This is a critical feature to me.

        - **Defletter**:
          Yup, that 100 tab comment had me instantly clocking them as an i3 (or similar) user. There's just something about those types of window managers that has them convinced it's some kind of panacea for every problem. We already have tabs and we already have bookmarks: if bookmarks were an easier way to queue things up to look at later than tabs, most people would already be doing that, and yet tabs prevail. There must therefore be something about tabs that people find more useful and or more convenient than bookmarks.
          
          The "just use bookmarks, bro" mindset comes from their foregone conclusion that windows are good, tabs are bad, therefore anything that favours tabs is also bad and should be done differently if you insist on doing it at all. Just let people have tabs.

            - **oneeyedpigeon**:
              > There must therefore be something about tabs that people find more useful and or more convenient than bookmarks.
              
              I suspect it really is as simple as 'tabs are always visible'. Hidden behind a menu, it's easy to forget bookmarks exist unless you really buy into that way of working and open your bookmarks menu frequently. Tabs are the 'default' alternative. However, I do think most browser bookmarking could be improved immeasurably — start by having a proper bookmark manager, similar to something like Pinboard.

    - **ikety**:
      I highly disagree with this. I use both terminal multiplexers and browsers with split window functionality for portability reasons. I use multiple operating systems in different environments and can't rely on a tiling window manager in some of them. I can rely on my terminal multiplexer and browser tiling working wherever I am running the program the same way every time.
      
      This is all kind of just your opinion that you are stating as hard fact

    - **Robbo89**:
      I haven't logged into this site for years but just had to after this... what a load of rubbish. Zen browser is showing what firefox should have been at least half a decade ago.

        - **ben2talk**:
          Not at all. Zen browser is trying to achieve Vivaldi UI on the Firefox browser - but more limited. Opera has been doing this for years...
          
          More fluid tab experience looked nice - though I don't prefer vertical tabs, I liked that I could drag to make them bigger/compact, drag them to top/bottom/sides, and use a shortcut to HideUI.
          
          HideUI is the single most loved feature of this 'Firefox' for me. To get rid of the tab/tool/URL bars, but have access (via keyboard/mouseover) is awesome... though better if we could assign something like F7 tabs F4 toolbar.

    - **solarkraft**:
      > just use your window manager's tabs, stacks, or workspaces.
      
      I wish we were in a world in which this is realistic. I can’t think of any major environment in which this is practical (maybe KDE has some plugin …).
      
      Microsoft once experimented with what I consider to be the right approach (https://www.reddit.com/r/Windows10/comments/65cfl8/microsoft...), but it didn’t get far.

    - **jnrk**:
      Edge has a convenient split view feature that allows you to set links from the first pane to open in the second pane, rather than in a new tab. Particularly useful for browsing Hacker News etc.

    - **OutlawHusbando**:
      In ideal world, but you should consider about cross-platform capability and usability, most os window managements sucks, that's why web browsers implement their own.

    - **deagle50**:
      Two windows side by side means two separate tab bars, and if they are vertical, very little horizontal space.

- **rchaud**:
  Very cool project, happy to see a browser that's not a Chromium fork for once.
  
  Some feedback:
  
  - Web Panels: have an option for letting CTRL + Click (or other shortcut) open the link in the Web Panel sidebar. Drag and dropping the link into the sidebar would be a good shortcut as well. This works for use cases like browsing a search results page, and opening multiple links without losing focus on the search results page itself.
  
  - Horizontal Nav Bar: Vivaldi and Arc browser both have no horizontal bar taking up real estate. Maybe this is not possible to replicate with an FF fork, but having sidebar navigation AND a mostly full size top nav bar is redundant.

- **BiteCode_dev**:
  I've been wanting split view in FF for a long time, so I'm going to try this right now
  
  And I know somebody, somewhere, is going to argue that it should be the job of the desktop.
  
  I disagree.
  
  I don't want to have to create each context I want things to exist in, and manipulate that carefully.
  
  I like automatic context. That's why I like tabs in my browser and not a thousand windows. And that's why I enjoy my split views to be inside the tabs I just created.

    - **depingus**:
      Mozilla maintains a Firefox extension that does split view in the browser. Its called Side View. https://addons.mozilla.org/en-US/firefox/addon/side-view/

        - **lagniappe**:
          That's a sidebar, they're not the same. It requires hacks to change the dimensions to a true split, and the things like zoom and extensions don't work the same in it. This is a half-measure at best.

        - **butz**:
          "This add-on is not actively monitored for security by Mozilla. Make sure you trust it before installing." What?

            - **slenk**:
              A lot of legitimate Firefox Addons say that. Just means Moz can't manually review every single extension if they want to allow their users a good extension experience...unlike developing Chrome extensions

                - **tredre3**:
                  > Just means Moz can't manually review every single extension
                  
                  The extension in question is authored by Mozilla.

                    - **rovr138**:
                      Different teams.
                      
                      In the case of extensions like this one should be asking , “Do I trust the author?”

            - **cqqxo4zV46cp**:
              I’m sure that you can piece together how this could happen.

        - **alimbada**:
          I've tried it. It's not nearly half as good as Edge's split screen feature.

    - **ReadCarlBarks**:
      Vote here: https://connect.mozilla.org/t5/ideas/split-screen-tab-in-tab...

        - **KennyBlanken**:
          Or don't waste your time, given Mozilla management does whatever it or Google wants? Just like with Google, nobody works on anything that won't help get them promoted?
          
          There are decade-old "everyone agrees this sucks, please fix it" bugs in bugzilla that are ignored because nobody in management or development cares. It's not sexy, can't go on their resume, it won't let them give presentations at conferences, or get them on people's podcasts, or tweeted about...

            - **ziddoap**:
              76 ideas which were submitted are currently in development and 84 have been delivered.
              
              Using your anger/passion to try and sway people to be even less involved doesn't help anyone.

                - **imchillyb**:
                  OP stated that there are bugs over a decade old at this point, that still exist due to the concerns mentioned.
                  
                  You didn’t address his statement nor his concerns.
                  
                  You avoided that part of the conversation to basically tell him to shut up.
                  
                  Address the issues first, like Firefox management team should be doing, but aren’t.
                  
                  I’m with OP.  Firefox is a horrible user experience.  And it’s that way by design.  Couldn’t have Google stop paying Mozilla’s bills now could they?

                    - **ziddoap**:
                      ReadCarlBarks linked to where you can vote on ideas.
                      
                      KennyBlanken said don't bother to vote on ideas because they wont listen.
                      
                      I pointed out that many ideas are in development or have been delivered (i.e. they do listen).
                      
                      The rest seems pretty boring to discuss and unlikely to be a productive conversation. I'm already bored trying to explain this.

                - **witrak**:
                  >76 ideas which were submitted are currently in development and 84 have been delivered.
                  
                  So what? Does it invalidate the critics of glacial speed of making other improvements?

                    - **ziddoap**:
                      It invalidates the assertion that the ideas page isn't listened to and that it's a waste of time to vote on the features.

    - **grounder**:
      Vivaldi has split view / tab tiling and I really like it too. Vivaldi is based on Chromium.

    - **bloopernova**:
      I use vertical tabs, so I don't want 2 windows with tabs, I want 1 window with tabs-1stview-2ndview

- **explosion-s**:
  I've recently made a similar (more modular) project which compiles various features and patches them into a Firefox profile. It can compile themes, hardening, userscripts, userstyles and more into a clean firefox profile, basically removing the bloat from firefox while still being fully customizable: https://github.com/explosion-scratch/firebuilder

    - **mnmalst**:
      This looks really great. One thing I have never seen done is having the url bar completely removed and put everything in the sidebar. That would really save some vertical space. Since you seem to know your way around the firefox sources, do you think that's possible?

        - **reubenmorais**:
          I don't know what you mean by having the URL bar completely removed (how do you navigate?) but I use CSS to trim the top of my Firefox to look a bit neater with the Sideberry extension: https://gist.github.com/reuben/4afa453611abd7f1477429b2c001f...

            - **mnmalst**:
              I meant something like this browser does: https://arc.net/ where the urlbar and all the buttons of the navigation bar are in the sidebar as well, so you have more room vertically for the actual web content.

            - **philsnow**:
              Oh that's lovely, thank you, I didn't know it was possible to do.

        - **explosion-s**:
          Im not sure - most of what my project does is compile multiple people's modifications together, I feel like I saw one such repo recently, I'll reply if I find it

            - **mnmalst**:
              Would appreciate it, haven't seen something like this yet.

    - **KennyBlanken**:
      Downloads/firebuilder-darwin-arm64
      24334 |   allowPositionals: true
      24335 | });
      24336 | var PROFILE_PATH_CLI = args.positionals[2];
      24337 | var THIS_DIR2 = __dirname;
      24338 | var MODULE_DIR2 = resolve4(THIS_DIR2, "modules");
      24339 | var OPTIONS = Object.fromEntries(readdirSync2(resolve4(MODULE_DIR2)).filter((i) => lstatSync2(join8(MODULE_DIR2, i)).isDirectory()).map((i) => ({
                                               ^
      ENOENT: No such file or directory
         errno: -2
       syscall: "open"
         path: "/Users/tjs/Documents/.coding/firefox-profile-creator/modules"
      
            at /$bunfs/root/firebuilder-darwin-arm64:24339:34
      
      
      
      Downloads/firebuilder-darwin-arm64 --help
      
      24322 | import {parseArgs} from "util";
      24323 | import {homedir as homedir2} from "os";
      24324 | var __dirname = "/Users/tjs/Documents/.coding/firefox-profile-creator";
      24325 | var APP_PATH = join8("/Applications", "Firefox.app", "Contents", "MacOS", "firefox");
      24326 | var PROFILES_PATH = resolve4(homedir2(), "Library", "Application Support", "Firefox", "Profiles");
      24327 | var args = parseArgs({
        args: Bun.argv,
        options: {
          launch: {
            type: "boolean"
          }
        },
        allowPositionals: true
      });
                         ^
      TypeError: Unknown option '--help'. To specify a positional argument starting with a '-', place it at the end of the command after '--', as in '-- "--help"
       code: "ERR_PARSE_ARGS_UNKNOWN_OPTION"
      
            at /$bunfs/root/firebuilder-darwin-arm64:24327:12
      
      
      
      Little documentation on how to use it, either...

        - **explosion-s**:
          Somehow it has hard coded something wrong - I'm so sorry I literally just tested it. Actually moving into college tomorrow but I might be able to fix it the next day. Try cloning and 'bun run cli.js' in the meantime?
          
          I'll fix asap

        - **explosion-s**:
          Update: After a tough 24 minutes I have fixed the bug! Apparently it's an issue with old versions of Bun so I had to upgrade, but I also added a `--help` flag and usage.

    - **btown**:
      Really cool! Do you know if there's anything similar for Chrome?

        - **explosion-s**:
          I don't think so, it's a lot harder to patch chrome because you'd need to recompile it. There is ungoogled-chromium but it doesn't add many features, mainly takes away the bloat. Unfortunately drm content is a bit finicky in ungoogled chromium.
          
          Firefox is great for modding because everything is contained in one profile folder, so one can simply make a new profile folder however they want and have the perfect browser

- **widdershins**:
  Not many straightforwardly positive comments here so far, so I will write one.
  
  I'm a Firefox user but I've recently been tempted by Arc primarily because of its 'workspaces' feature and its minimal UI that gets out the way. I used Arc for several weeks and really got a taste for these features, so I'm really happy to see them come to a Gecko-based browser. Thank you, and keep it up!
  
  My advice would be: don't advertise wooly claims about performance and security, when it's not clear exactly what's different from Firefox there. Instead, focus on this simple fact: it's an alternative UI for Firefox-based browsing, and that's great.

    - **dao-**:
      Agreed. I work at Mozilla as an engineer for Firefox, and I'm generally happy to see this.
      
      I currently work on tab groups, and I'm curious to see what their implementation will look like or whether they'll try to fast-track our work-in-progress once that's somewhat viable.
      
      For the sidebar and vertical tabs, they seem to have implemented their own thing rather than using what our team has been working on. At a first glance, the results look similar. I wonder if they'll want to ditch their implementation once we've released, as forking this stuff long-term may not be super cost efficient.
      
      Their claims about performance do seem dubious. Mostly they seem to tweak a bunch of Firefox prefs, but more often than not there are good reasons for Firefox's defaults, and changing them may come with a tradeoff.

        - **nokeya**:
          Tab groups again? I don’t remember when exactly, but like 10 years ago Firefox already had this feature. I was using them happily, organising all my numerous tabs to a dozen of groups by theme (work, social, movies, etc). But then Mozilla decided: “Nobody is using tab groups, screw it!” and removed them. All groups and tabs were lost. Now history will repeat?

            - **dao-**:
              I remember, I was around back then. :) Panorama was in some ways ahead of its time. The UI was nice visually but also somewhat heavy handed / not very beginner friendly to say the least, which contributed to it being used only by a relatively small share of our user base.
              
              We're cautious about not repeating history. We're implementing tab groups from scratch and directly in the tab bar. Our Firefox View feature (Tools > Firefox View) may later get a more visual surface for managing groups.

                - **nokeya**:
                  It was used by advanced users. And what advanced users do? Disable telemetry;) So, I suppose the share was a little bigger but not that much.

                    - **eddyg**:
                      Or, just don't disable (anonymous) metrics.
                      
                      There's a BIG difference between tracking and metrics, but they are often treated the same, especially by "power users".

                        - **titusjohnson**:
                          There's no difference between tracking and metrics, they're the same thing. You get your metrics out of the data you track. Browser phone home? Tracking.
                          
                          And there's no way for a user to validate that any tracking is indeed anonymous. The technical level needed to asses this is just... out of reach for everyone (the quantity of people who can properly verify this is small enough we can safely ignore it when speaking generally and use the coloquialism Everyone)

                            - **eddyg**:
                              There is definitely a difference between tracking and metrics. One saves and associates information like “when and where did this piece of data come from?” along with other “identifiable” information, the other simply increments a count for things like “advanced feature X enabled”. If you don’t see the obvious difference between this type of data, then that’s on you. The latter can provide extremely valuable signals, and when “power users” disable it (and tell regular users to do the same, spreading FUD) because they think it’s “tracking” (it’s not), that’s their problem when a tool/app/service starts moving in directions they don’t like.

                                - **titusjohnson**:
                                  I was too succinct in my previous message, I guess.
                                  
                                  To you and I there is a difference between tracking and metrics. To everyone else there is none. All my Mom knows is that the software dialed home. It is impossible to verify what it said to the mothership. The popup promised "Metrics only!" but then Little Snitch lit up like a Christmas tree 4 times! It's stealing my info!
                                  
                                  How does the consumer know that the "metrics" didn't include home IP, OS version, and god knows whatever else? Again, metrics are a subset of data. Even the internet request to ship a fully anonymized usage info like "saved_files: 10, opened_files: 11" metric set contains Gobs and Gobs of identifiable information on and around the request itself. Does the company stash inbound request data for troubleshooting? That's fucking tracking bro. Your data dog instance is chock-full of tracking info.
                                  
                                  It is not reasonable to expect end-users to be able to verify the claim that "only metrics are tracked". It is safer for everyone to assume this is a bald-faced lie, because at the end of the day it is impossible to verify to any level of certainty.

                        - **krageon**:
                          They're treated the same because they are the same, which people with domain knowledge (i.e. power users) are aware of.
                          
                          A terrible way to get them to stop doing something you don't personally agree with is by starting your post with a bad idea, support it with a lie and close it with a personal attack.

                    - **LtdJorge**:
                      I explicitly enable it

                    - **Y_Y**:
                      Maybe instead of ubiquitous stupidity-tqxax telemetry we could have some neo-Nielsen families and get to pick a roughly representative sample out of voluntary, compensated users. A trusted third party contracts the victims and agregates the data. Don't ask me who regulates or pays though.

                        - **jackstraw14**:
                          > A trusted third party
                          
                          And why wouldn't it be Nielsen :) I remember when they sent me cash in the mail as a kid, fun times.

                            - **cbsks**:
                              They still do that. Just a few weeks ago my daughter filled out their survey and got $5!

                                - **jackstraw14**:
                                  That's so cool, mine was about 30 years ago. I had no idea they were still doing this!

                - **OutlawHusbando**:
                  > We're cautious about not repeating history. We're implementing tab groups from scratch and directly in the tab bar. Our Firefox View feature (Tools > Firefox View) may later get a more visual surface for managing groups.
                  
                  Hi! Thanks for letting us know about Firefox Team is being very careful this time, I want to share my idea too because I think the Firefox community have probably tinkered enough to figure out that Tree Styled Tab Group like Sidebery/Tree Style Tab is the best Tab Group implementation, because they're so easy to use, just drag and drop and work great in practice.
                  
                  I hope you consider making Tree Styled Tab Group an option for vertical tab.

                - **justinclift**:
                  > which contributed to it being used only by a relatively small share of our user base.
                  
                  And that's why telemetry is such a brain dead idea.  People then actually make decisions based upon "number of people using feature X" which is incredibly... lets just say "unwise".

                    - **1oooqooq**:
                      wonder if we should just accept it as "voting" and monitor their telemetry experiment and spam the option we would like

                        - **ReadCarlBarks**:
                          You can vote for features on Mozilla Connect: https://connect.mozilla.org/

                            - **1oooqooq**:
                              nice find. nobody uses that and sadly it became a desperate support forum which mostly goes ignored

                            - **justinclift**:
                              Seems like a reasonable idea.  With this in place, why are Mozilla using telemetry instead?

                                - **1oooqooq**:
                                  because Mozilla, the foundation, is hostile. it's a political money grab.
                                  
                                  with telemetry they can justify whatever. they can go to the board and say "look people are clicking more on pocket, which we put prominently on the UI against everyone wishes, and they barely use bookmarks, which have critical bugs open for over 20years... who would have thought of this counterintuitive insight if it weren't for my genius persistence on trying and measuring new ideas uh? so are we good on the extra bonus to my close childhood friends?" ...see, it makes the pitch defensable, if you don't say the right parts out loud.

                        - **justinclift**:
                          Might be more accurate. ;)

            - **Vinnl**:
              I think you're referring to Panorama View [1], introduced in Firefox 4 (2010). I think there are still extensions that replicate the experience [2].
              
              There are many things different now that might make it work better this time. If not just that it's 14 years later, different UI, and the pattern being familiar from other browsers, might make a difference too. But no guarantees, of course.
              
              (Note: I don't work on Tab Groups.)
              
              [1] https://web.archive.org/web/20110613070035/http://www.azaras...
              
              [2] https://addons.mozilla.org/firefox/addon/simple-tab-groups/ is widely used, but I'm not sure if it does the overview. Other extensions do.

                - **capitainenemo**:
                  There's also https://bugzilla.mozilla.org/show_bug.cgi?id=1509350 filed in 2018 for restoring it, now duped against this official bug...
                  https://bugzilla.mozilla.org/show_bug.cgi?id=1907090

                - **cxr**:
                  Panorama from Firefox 4.  Also called Tab Groups.

            - **jay_kyburz**:
              I never understand the need for tab groups, once you get above 4-5 tabs you are actively working in, whats wrong with bookmarks?

                - **KingMob**:
                  Bookmarks are perceptually longer-term than open tabs, so there may be more reluctance to save to a bookmark. (E.g., if planning a trip to Italy, do you want to bookmark some blogger's food recs for Rome, forever?)
                  
                  But worse is, it relies on recalling the text in the bookmark's title to resurface it. You might not remember the page title, but you can always scan through open tabs.

                    - **miah_**:
                      I wrote love the ability to associate a TTL with bookmarks. Let me bookmark for 3 hours or 2 days or forever. Of course the 3 and 2 are user choices.
                      
                      Mostly the way I deal with this now is sharing the tab to another Firefox on a different computer then use it there and decide it's fate.

                        - **krferriter**:
                          This is an interesting idea for a feature, that I think I would like too. I like to save things to maybe look at later and a TTL would manage automatically dropping them from bookmarks in case I never actually want to look at it later.

                    - **torstenvl**:
                      I add a folder to my bookmark bar. All project related tabs get bookmarked there. When I'm done, I either delete the whole folder or file it somewhere.
                      
                      I can also open all in tabs, if I really want to.

                - **proaralyst**:
                  Work make me use Chrome, and I have recently converted hard to tab groups. I've found two main uses: one for a collection of reference tabs that I mostly want open or closed together (specific API references that are normally spread out over a few pages); the other is to organise groups of tabs for different projects I'm working on.
                  
                  Both of these make context switching easier as I can quickly hide all of the tabs I'm not currently using, knowing they'll be just as easy to reopen later. In Chrome, tab groups can be saved too, so they give you a bit of the persistence of bookmarks.
                  
                  I'm still a Firefox user where I have a choice, and I'm really excited to hear they're working on first-class tab groups

                - **PrototypeNM1**:
                  Think of it like memory hierarchies. Bookmarks are long term storage, tabs are registers. Tab groups fall somewhere in the middle, easy to reengage with and easy to put out of focus.

                - **slightwinder**:
                  Bookmarks suck. They are slow and cumbersome to manage, especially when it's many related urls. And for working with them, I need to open them as a tab anyway, so why not stay there from the beginning?

                - **cxr**:
                  I use Firefox's existing native support for tab groups that it's had since pre-1.0.  They're called windows.

                    - **artificialLimbs**:
                      Cool until you restart your machine.

                        - **cxr**:
                          Do you mean "… and then it's not very cool anymore"?  And if so, then why not?

                            - **jerbear4328**:
                              I think they meant that you lose your windows after a reboot, because Firefox only restores one window, compared to all of your groups.

                                - **lionelw**:
                                  Firefox restores all windows.

                                    - **jay_kyburz**:
                                      If you close your windows in the wrong order, you will lose your tabs and pinned tabs.
                                      
                                      Example: Have a primary window with you email, calendar and important sites pinned.
                                      
                                      Then open another window and open a few tabs.
                                      
                                      Then at the end of the day, close your primary window first, then discover you still have the secondary window open and close it as well.
                                      
                                      When you restart Firefox you will get the secondary window and your "primary" window will be lost with all your pinned tabs.
                                      
                                      I actually went down a rabbit hole of trying to log it as a bug, but the behavior is by design apparently.

                                        - **niutech**:
                                          Use Ctrl-Shift-Q so that all windows are closed at once.

                                        - **krageon**:
                                          You can reopen the window you're missing with ctrl+shift+n, the same way you open a formerly closed tab (only that's not n, that's t). I do agree it's irritating this isn't made more plain.

                - **superkuh**:
                  Bookmarks don't have tab history.

        - **josh-sematic**:
          Glad to hear Mozilla is working on adding this. I switched to a chrome-based browser for a while and the only thing I miss after going back to Firefox is tab groups.

        - **BodyCulture**:
          Firefox is the only browser that freezes Ubuntu after some extensive internet use, especially with video watching. Since many years and still today.

            - **1oooqooq**:
              happens to me too. but i would bet money it's because of memory corruption in both of our cases.
              
              i have the exact same setup on ECC ram and zero crashes. on non ECC (cheap, garbage, that everyone accepted as the default) ram, one crash every couple weeks.
              
              so unless you can prove software on the same cpu is non deterministic, it is ram corruption.

            - **BossingAround**:
              I've never used Ubuntu, but on Fedora and openSUSE Tumbleweed, I've never run into this issue (and I've had like 50+ tabs open for weeks since i don't really reboot my work laptop unless I have to)

            - **csouzaf**:
              I'm not sure how this contributes to the thread. This isn't a technical support forum, so it might not be the best place to discuss specific browser issues.
              
              I've been using Firefox on Ubuntu since 18.04 was first released (about 6 years ago), and while I've encountered some issues, I haven't experienced the problem you're describing.
              
              Of course, browser performance can be affected by many factors in your system. If you're seeking help, you might have better luck in a dedicated support forum or the official Firefox support channels.

            - **codethief**:
              Does it freeze completely (forcing you to resort to kill -9) or is it just slow?
              
              In any case, I've been been a Ubuntu user since ~2010 (and a Firefox user since its inception). I remember there being a time when Firefox was slower than Chrome and freezing occasionally but that was a looong time ago and I haven't had any issues with performance or freezes/crashes ever since.

            - **mkesper**:
              Are you using the snap version? I don't doubt that will give a crappy experience.

            - **botanical**:
              I'm on the Firefox snap on Ubuntu but don't get any freezes.

        - **viraptor**:
          > I currently work on tab groups
          
          (It's happening.gif)
          
          But seriously, that makes me extremely happy. I'm using the weird hack in tree style tabs to do this and it's not great. I'd love this to work in general and something with a persistent "current context" for new tabs.

            - **Vinnl**:
              If you're unfamiliar with Sidebery, it's similar to TST but has a neat tab groups feature as well.
              
              Speaking of, there are other cool new features coming to Firefox - such as vertical tabs: https://connect.mozilla.org/t5/discussions/here-s-what-we-re...

                - **viraptor**:
                  Thanks, sideberry looks great. I've defaulted to TST for so long, I haven't looked for alternatives, but it seems worth trying.

        - **NBPEL**:
          Thanks for your replying, it's great to know that you're very open to see what Firefox forks are doing.
          
          And I guess threads like this is a great place to gather user opinions.
          
          I think in this thread, people did talk about Split View a lot (link: https://news.ycombinator.com/item?id=41306665), can you talk to the team about this feature ? Considering it's getting a lot of comment, people seem to want it a lot.

        - **Croftengea**:
          Native vertical tabs in vanilla FF? Whoohoo! Imho, the killer feature is automatic group assignment based on URL patters. Will the vanilla implementation support it?

            - **dao-**:
              We'll at some point support the tabGroups webextension API, so it would be fairly straightforward for add-ons to do that. We're also looking at automatic grouping options though.

                - **Croftengea**:
                  Thank you!

        - **lloydatkinson**:
          What is the hold up on adding Chrome like tab groups with colours and ability to collapse them?

            - **dao-**:
              We're working on that.

        - **methuselah_in**:
          its good to see you giving direct feedback.

        - **1oooqooq**:
          Firefox defaults lately are awful and out of touch...
          
          gestures for reload/back/forward? really?
          
          several decades and still not incorporating uBlockOrigin as a native feature? really?
          
          a convoluted only-4-containers shenanigans that not even the author understand instead of simply isolating private tabs per window like everyone asked over the years?
          
          using on android? too bad now you don't have half the settings available, AND you will not access many extension for no technical reason other than mozilla implemented a blacklist! ...oh and no access to about:config either!
          
          i don't recall many examples because i gave up caring and have a list of settings (most not even available in the settings screen) and extension i must install on Firefox every new install which is larger than my OS customizations.... and on android i did what anybself respecting person would do and never touch Mozilla's default. install F-DROID's instead.
          
          so, no, Firefox defaults are not very good.

            - **downsplat**:
              For Android, I've been using Firefox Beta as my daily driver for over a year,   it works flawlessly, and about:config is available.

                - **1oooqooq**:
                  yeah, even the very own devs HATE the defaults someone (who?) decided for android.
                  
                  first there was a non documented setting to remove the blacklist for extensions... when they blocked access to about:config then everyone started using firefox dev... now they removed the block from nightly (i guess using real bleeding edge dev annoyed them)...
                  
                  anyway, this only proves me point even harder.

            - **slightwinder**:
              > several decades and still not incorporating uBlockOrigin as a native feature? really?
              
              Might be better that way. AdBlockers are fast-moving, with a dedicated, diligent working community. Outside the browser, they probably can work better.

                - **fabrice_d**:
                  Not just that, but why would Mozilla pick the winner here? Everyone complains about the side effects of default search engines, let's not do it again with ad-blockers!
                  
                  And anyway, their Google contract certainly prevents them from doing shipping ad-blocking by default.

                    - **1oooqooq**:
                      because that was the original promise with extensions! contribute without the red tape, and if enough people like it, we will incorporate.
                      
                      heck dev tools started as someone cloning IE dev tool as an extension... there were two... the IE clone and a dalvik debugger... mozilla had no problem picking the winer and incorporating in the official build.
                      
                      > their google contract
                      
                      stop normalizing this! they officially denie this arrangement exist! so they cannot use it as an excuse.

                - **1oooqooq**:
                  the extension already incorporates a interface to select/finetune/update the rules.
                  
                  for the past decade updates to the extension itself have been UI only.

            - **yonrg**:
              I'm a firefox-only user, and I read your comment in two ways. It's grumpy, but also on the point! Thanks, I feel similarly. What is your main browser btw?
              
              FF works for me in great ways, and I am highly productive with it, as long as some plugins still work: uBlock, tridactyl, foxyproxy. And for UI: sidebery, stylus.
              
              From time to time I feel I should turn my back towards FF when they come up with new decisions in their UI, which I drastically reduce (no menu, no tabs,...), or new features, which are more disturbing than helping.
              
              On android, I discovered 'kiwi browser' which is FF based but does not blacklist the plugins.

                - **mnmalst**:
                  Man you got my hopes up for a bit there since I remembered Kiwi browser was chromium based which after checking, it still is. From there website: "Kiwi is based on Chromium and WebKit." https://kiwibrowser.com/

                - **Vinnl**:
                  Note that Firefox for Android no longer explicitly allowlists extensions: anyone can write one that anyone can install.

            - **cma**:
              > several decades and still not incorporating uBlockOrigin as a native feature? really?
              
              How much less will Google pay to be the default search if this is added?

                - **1oooqooq**:
                  but they will never say that out loud ;) so what is the official position? they don't even have one. nobody touch tickets mentioning these things. so sad how open source is so easily coopted.
                  
                  i remember when google and Microsoft had to do the w3c misdirection, now they don't even pretend.

            - **autoexec**:
              They've automatically added spying by default now too. Mozilla is now an ad-tech company. Don't expect defaults to get any better.

    - **angryasian**:
      You should try Firefox Mozilla containers
      
      https://addons.mozilla.org/en-US/firefox/addon/multi-account...
      
      This is official supported add-on

        - **czk**:
          This is the main reason I still use Firefox. Being able to have multiple color-coded containers for my different Azure roles at work, and being able to set a custom socks5 proxy on each container so I can route certain container tabs through a different VPN service.

        - **mdaniel**:
          Along with the excellent "open in container" extension, allowing launching URLs into containers: https://addons.mozilla.org/en-US/firefox/addon/open-url-in-c...
          
            $ firefox 'ext+container:name=HN&url=https://news.ycombinator.com/item%3Fid=41311435'

            - **worble**:
              I'm curious what the use-case of this extension is? Other sites/applications aren't going to be using this custom protocol handler, and if it's just for my own browser then I'm going to be creating containers and then setting "always open site in this container" and Firefox will always open that site in a specific container. What are you using this for?

                - **mdaniel**:
                  > Other sites/applications aren't going to be using this custom protocol handler
                  
                  I have my own xdg-open in the PATH which supersedes the /usr/bin one (I believe there actually is a plugin mechanism for xdg-open but I found it easier to just create my own binary than learn their tomfoolery), and with that in mind, I'm able to make any URL routing decisions I'd like via that
                  
                  > then setting "always open site in this container"
                  
                  ... which won't work for multi-tenant sites like console.aws.amazon.com or portal.azure.com which use cookies or other such nonsense to determine who you are currently logged in as. That's actually true of Google and Microsoft, too, although I have less day-to-day experience with that. I am, of course, aware of the user switcher built into both AWS and Azure consoles, but it's not the same as having a giant red themed container for production accounts versus green for QA ones
                  
                  As for your specific question, I also use aws-vault to cook federated login URLs for the console because my experience of working with AWS SSO and Okta is some ... it's a lot of clicking ... versus letting aws-vault build the federated signin URL and then launching it into the container named according to its AccountID (so it's easy to programatically dispatch them)

    - **espadrine**:
      Product presentation is a hard-to-develop skill. I agree that many aspects of the page are muddy.
      
      I personally find their compact mode the cleanest I have ever seen. This is the entire window: https://imgur.com/hhfyeVz
      To access the address bar, move the mouse to the top, or type Ctrl+L.
      For the tabs, move the mouse to the left, or type Ctrl+1, 2… or Ctrl+Tab to cycle through.
      
      I wish Firefox had such a compact mode.

    - **adhamsalama**:
      Sideberry extension does this perfectly.
      I migrated from Vivaldi to Firefox because of it.

        - **prometheon1**:
          Same! I switched back from Brave to Firefox last year after discovering that Sidebery has tab panels (which I think Arc calls workspaces) that can be set to use the same Firefox container. I want to be logged into different accounts of the same service, in Brave I had different "profiles" for this, but I like that now in Firefox I can have everything in a single window and I can easily switch between containers by switching to a different panel. (Which I have a hotkey for)

    - **charlie0**:
      Tried Arc and didn't like it. It's main selling point is the workspaces. However, I'm not the type of person to have 200 tabs open at once, so it wasn't as useful for me as I thought it would be. It's def a nice looking app though.

    - **gchamonlive**:
      I might be willing to try it because of these workspaces.
      
      How does It differ from Firefox Profile Manager?

        - **artificialLimbs**:
          With workspaces, I can choose a different workspace (on my Mac) with a right/left swipe of my mouse in the vertical tabs column. It's mind blowingly more productive.

    - **thisislife2**:
      > don't advertise wooly claims about performance and security
      
      And about privacy ...

    - **autoexec**:
      If they commit to keeping all Firefox's spying out of their Firefox-based browsing UI that's all I really need. Firefox was fine, it's just stopped working for its users and respecting their privacy.

- **bogwog**:
  I hope a sustainable Firefox fork emerges soon because it seems Google's illegal default search deals (aka the only thing keeping Mozilla afloat) are coming to an end. That's a great thing in general, but it would really suck if FF died and we all got stuck with Chrome derivatives.
  
  Personally, I wouldn't mind paying for my web browser if it's good. I wouldn't pay for Mozilla's FF, but I would pay for a fork of it by a company whose business model doesn't involve ads or selling data. I happily pay for Kagi, and will happily pay for the app that I use the most.

    - **bearjaws**:
      Mozilla could keep building FF without Google, but it would require that 90% of the C suite get laid off and dedicated focus from the company...

        - **Barrin92**:
          For the fiscal year 2022 which is the most recent data on Wikipedia, it says that 81% of Mozilla's revenue is from Google (about 480 million) they list 220 million as expenses for software development.
          
          If they lost the Google revenue they wouldn't just have to fire "the C suite" but lay off most of their engineers. An independent browser engine is a project with code in the tens of millions of lines, you obviously need to pay hundreds or of engineers to work on this, which is why there's pretty much only three competitive ones, all maintained with significant resources.
          
          https://en.wikipedia.org/wiki/Mozilla_Corporation#Finances

            - **WD-42**:
              Hundreds of developers?
              
              It's a large code base, but it doesn't require hundreds of developers working concurrently to keep it up to date. Web standards move fast, but not that fast.
              
              Take a look at Ladybird. There's a browser being built from scratch with a small team (less than 10?)
              
              If Mozilla fired 90% of it's employees and kept the 10% to actually work on Firefox, it could be a great browser.

                - **maleldil**:
                  > Take a look at Ladybird. There's a browser being built from scratch with a small team (less than 10?)
                  
                  Ladybird is so, so far away from being comparable to Firefox. It only supports a fraction of modern websites.

                - **uasi**:
                  Have you taken a look at Firefox's bug bug tracker?[1] Keeping up with Web standards is nothing compared to the tremendous amount of work required to maintain a cross-platform web browser.
                  
                  [1]: https://bugzilla.mozilla.org/describecomponents.cgi?product=...

        - **KennyBlanken**:
          Good. They've lost market share continuously for fifteen years.
          
          In 2009 they had a 30% market share.
          
          Now they have a 5-6% market share.
          
          4/5ths of their market share, gone.

            - **observationist**:
              2.8% in July '24, Linux has a higher desktop market share than Firefox has browser share.

            - **choilive**:
              The number of internet users have also gone up 300% over that time period, so on absolute terms they still have a sizeable user base.. but yes. They need to figure out how to increase market share.

                - **fabrice_d**:
                  They are even losing users in absolute terms: check https://data.firefox.com/dashboard/user-activity

        - **beefnugs**:
          Nah, they would just enshittify like everyone else. This world is trash. The only hope is it pisses off enough people for them to contribute to some open competitor, the circle of softwarelife

- **commercialnix**:
  I use Sway (an i3 clone for Wayland), so these "split views" and "workspaces" are not appealing to me.
  
  Zen makes serious claims about performance and sandboxing, but do not forwardly present writings on how they do these things, leaving us with the impression there are some tweaks here and there but not much more.

    - **zamadatix**:
      I'm a Sway user as well but I still find value in features like workspaces, tabs, and split views in certain apps even though they are all also features in Sway. Sometimes a particular split (or any of those other things) can itself be a context I want to switch to in part of my current view. Rather than individually orchestrate that from wherever the components are into my current view it can be nice to define that relation more directly via something like this.
      
      Not saying such features in apps must also be appealing to you as well or anything equally silly, just whether or not they are appealing is more hinged on that base question of whether you like the idea of nested organizational structures than whether or not your window manager has a similar tiling  feature.

    - **gorgoiler**:
      I’ve been using the sway family of window managers for nearly 20 years!  (First ion2, then ion3, then i3, and now sway.)  In all this time I’ve briefly used native tabs but mostly now use windows without title bars or any other decorations in split mode all of the time.  Most of the day I simply have a terminal running tmux on the first workspace with vim in the first tmux window, shells in the others, and a browser on the second sway workspace.
      
      Would I benefit from using native windows in sway?  It often feels like vim splitting, tmux splitting, Firefox tabs, and sway windows are all fighting with against other or at the very least not cooperating when they could be doing a better job if they all deferred to sway.  I’m just not sure how to do that well with easy switching between windows and I don’t know if vim even supports it at all unless I use gvim?

        - **granra**:
          I used to also use i3 and later sway and I noticed I only ever tiled my terminals. I don't really remember why but I started using tmux (with tilish) and I liked that I can detach and reattach to sessions later. But at that point I'm just full screening windows so now I'm on gnome and use a single terminal window with tmux :)
          
          Edit: my journey of text editors has been vim -> neovim -> helix so I just have them open inside the tmux sessions.

            - **gorgoiler**:
              Another part of my journey is moving to entirely local development rather than ssh-ing from a $2000 MacBook (running a Linux virtual machine) to a $5000 dev server.  I now use native Linux on a $250 mini PC to write my glue code and k8s to hand off all my big compute tasks.
              
              But what that really means is, while ssh-tmux-vim is great when you need it, local UIs could be so much richer, and I would never know because I am still tied to using my local machine as if it were a remote host.
              
              I should stop writing about it and just do something.  I have a feeling that using native sway tabs for everything might be fantastic, if I can get over the hump of making the change.

            - **dotancohen**:
              As a very longtime VIM user, can you talk me into helix?

                - **granra**:
                  I'm not one for preaching about software :p
                  
                  I thought I'd miss the infinite extendability of neovim with all my plugins and such but it didn't end up mattering to me and it was quite freeing actually to be just bound to what is supported in the core editor (as long as it's enough for you). I've been waiting for editorconfig support since before switching but it doesn't look like it will be merged into core.
                  
                  Afaik there's plans to add plugin support using some custom lisp language which I'm excited about (I wrote all my neovim config in fennel).
                  
                  But overall it's really fast and comes with essentials built-in like LSP and tree sitter support. There's some learning curve coming from vim in terms of key commands and such as helix is inspired by kakoune in that realm.
                  
                  I don't think I did a really good job at convincing you but that's what came from my head quickly :D

                    - **dotancohen**:
                      Thanks you! I will take a look. I waited very long to jump to neovim.

        - **bee_rider**:
          Tmux splits are really nice on the server, and getting the server and my local system to be aware of each other is… either very difficult or impossible.
          
          Tmux and vim splits, the competition between them can be a little annoying. Mostly I prefer tmux splits, but the shared yank buffers and ability to link scrolling in vim is really nice.
          
          You can open a terminal in vim somehow IIRC, maybe vim as a multiplexer is the way to true enlightenment, haha.

        - **joshmarinacci**:
          Could you provide some screenshots? I’d love to see what your desktop looks like with this configuration.

        - **commercialnix**:
          I feel like you and I would be friends.

    - **boesboes**:
      No need to be so snarky.

        - **gpvos**:
          What's snarky about that?

- **chown**:
  I've recently started using Arc mostly out of FOMO and there are parts that I like and parts I don't. I have been a Firefox user for a long time before that so glad to see something similar that's one of the major priorities is the aesthetics and I very much appreciate that.
  
  I tried to use it on my macOS Apple Silicone and got an error about it being broken and macOS suggested to trash it. Not sure if it is a bug issue. Will come back and try it again though to give it a second chance :)

    - **causal**:
      +1 on Apple Silicon build being damaged. A lot of users that care about aesthetic are going to be on MBPs and they're all blocked right now.

    - **xuf**:
      This is described in their FAQ. Running `xattr -d com.apple.quarantine '/Applications/Zen Browser.app/'` fixes the issue, see https://docs.zen-browser.app/faq#zen-browser-is-damaged-and-...

        - **thraway3837**:
          I'll suggest that bypassing Gatekeeper for an unknwon app from an unknown developer is a bad idea. I'll wait until they implement official code signing from Apple.

            - **0x2a**:
              It also breaks support for integrating with the 1Password desktop app.

        - **wlonkly**:
          This feels like a strong signal that either
          
          - this app won't see much adoption and will eventually fall out of maintenance, or
          
          - the developers are going to be a pain in the ass to work with,
          
          or both.

            - **sweeter**:
              thats pretty unfair to the devs. You need a Developer ID through Apple, a mac, and you need to pay. Thats kind of a ridiculous expectation to begin with. Two of those things can be solved with money (a significant amount of money mind you, for the purpose of releasing a single application) and Apple can arbitrarily make the Dev ID process arduous and painful.

    - **sparky_**:
      This super unhelpful error is sometimes the result of trying to run an unsigned or developer signed binary on Apple Silicon. Try `xattr -d com.apple.quarantine program.app`, then open it by right clicking on the app, and selecting 'Open' while holding option + command.

        - **warkdarrior**:
          Bypassing Gatekeeper (the binary signing process in macOS) does not seem like a good idea when downloading apps off random websites.

            - **sparky_**:
              Given the audience on HN, I think we can presume any readers of my comment are not trying to execute completely random untrusted binaries. There are legitimate cases when you need to do this to run a binary you trust, but the system doesn't.

            - **eitland**:
              I always run everything through virustotal first. (I should probably add that this is step two in my process: step one is to be very cautious and not download most things in the first place.)

    - **bearjaws**:
      Pretty sure this is the invalid signature error, not just unsigned which usually works via right click -> open.
      
      Not that it helps, but its kind of an easy error to make. I want to try it too but I guess I'll wait.

        - **dimal**:
          I thought the same thing, but that didn't work for me. It's busted.

- **cynical_slave**:
  I want the newest open tab to be at the top of the list, not at the bottom. The top is where your mouse usually is, that's where the website controls are, that's where stuff happens. Having to move the mouse to the bottom to activate recent tabs is annoying, especially on huge monitors.
  
  It baffles me that none of the browsers or extensions that implement sidebar tabs have this option.

    - **TuxMark5**:
      Sideberry for Firefox has settings that allow changing how new tabs behave. One of the settings allows placing new tabs on top of the list.

        - **cynical_slave**:
          It seems Sideberry only allows opening new tabs at the beginning of the list. That is not the same as just sorting newest at the top, since it also switches the order of native tabs as well. I want native tabs (since we can't hide them) to remain left to right.
          And I can't even move the "New Tab" button to the top.

            - **4k93n2**:
              changing "place new tab (general rule)" to "panel start" in sidebery will put the new tab right at the top. unless you mean you want it only at the top of the group?
              
              zen also has a "compact mode" than hides the native tabs, but it hides other things you might want as well

- **a2128**:
  It's sad they don't link it clearly but it's available on Flathub if you're on Linux: https://flathub.org/apps/io.github.zen_browser.zen

- **0x2a**:
  Looks like it supports Firefox extensions such as uBlock Origin as well. Surprised the website didn't mention it.
  
  Wonder if this still applies:
  
  https://github.com/gorhill/uBlock/wiki/uBlock-Origin-works-b...

    - **rocketvole**:
      I mean, it's a firefox-based browser. Is there any reason why it wouldn't support firefox extensions?

        - **0x2a**:
          I thought it might be similar to Orion based on the submission title, but it looks like a rebranded Firefox (which is great). This is what Mozilla should be doing.

- **jszymborski**:
  This website mentions LibreWolf which I've recently switched to. It's truly great. Takes care of all the decrapification I do to a fresh FF install while keeping up with the upstream security updates. Feels like how FF should feel imho.

- **tcsenpai**:
  I used Arc a lot back when I used MacOS. Was definitely a pleasing experience.
  I missed it a lot since I switched to Linux/Firefox.
  I just set up Zen with all my extensions and bookmarks, it behaves very well: let's see if it stands the trial of time, but very nice work. I like the UI

    - **adhamsalama**:
      Have you tried the Sideberry extension?

        - **tcsenpai**:
          Nope. I see it is a vertical tab extension: will try it!

- **willi59549879**:
  I quite like the zen browser. It is privacy focused but also visually appealing. 
  The feature that I like best, is that the browser does not take up a lot of space for itself. Even the top bar can be hidden. That way most of the screen is there to show the website.

    - **wmstack**:
      This is the information I was looking for. Does it have the Arc style search box/dialog/palette that pops up when you need it?

        - **willi59549879**:
          there is no search button. but you can search in the url bar, which will show you a button to switch to the corresponding tab

- **layer8**:
  Whenever I read “beautiful” in marketing copy, I’m immediately put off. It’s so presumptuous and conveys vanity. Moreover, users may prefer their software to be utilitarian, and in any case are likely to have different opinions on what constitutes “beauty”. For that aspect: Show, don’t tell. If people do find it beautiful, then they don’t need to be told. And if they don’t, then telling them is unlikely to change that.

    - **BiteCode_dev**:
      I read it the opposite way:
      
      - I feel more passion from the author.
      
      - I value the pride they show in their work.
      
      - I know many people actually care about beauty. In fact, with the same amount of bugs, the users of the most beautiful software will actually report it's less buggy.
      
      The problem is when someone makes appearances more important than being useful.
      
      But I want to give this project the benefit of the doubt.
      
      We need more browser diversity.

        - **gexla**:
          How do you know it was one of the developers who wrote this? Maybe they hired someone to create the site and the content. Granted, the site is in the repo and you can see who committed the assets. But that still doesn't tell you who originally wrote it.

            - **mthoms**:
              The developers either created or commissioned the website. Accordingly, I think we can safely assume it conveys their goals.

            - **billsmithaustin**:
              You're suggesting one of the developers went through all the trouble to create a browser, then allowed someone to add assets to the repo without the developer reviewing them first?

                - **gexla**:
                  I'm suggesting that you don't know who wrote the content. You don't know the developers wrote it. And if a non-developer wrote it, then that person probably isn't going to commit the content to a repo.

        - **beAbU**:
          The first sentence in the first paragraph on the website is "beautifully designed". Clearly the creator wants to bring to our attention that they spent a lot of time designing the visual aspects of this browser. And from the looks of things, this is indeed true. The browser does look very beautiful.
          
          But... this is literally form over function.
          
          Browsers should be like car tyres. Only after you have selected for your functional use case and requirements, do you filter for visual aesthetics.

        - **dartos**:
          This is based on Firefox, so it doesn’t really help with browser diversity.
          
          Ladybird does, but it’s not really ready for prime time yet

            - **BiteCode_dev**:
              Of course it does.
              
              Right now FF shares are so low devs are ignoring it.
              
              If more browsers use this engine, more devs will test with it.
              
              Also, if it reaches success, it make FF future more robust, which also helps with future diversity.

                - **dartos**:
                  No way.
                  
                  If google decides that they don’t want to fund Mozilla anymore, then these Firefox derivatives fall as well. I don’t really see the zen team (or other ff forks) hiring the FF devs that are making 6 figures at Mozilla.
                  
                  If Firefox decides to deeply ingrain some DRM standard, there’s a high likelihood that it’ll be included in downstream browsers like this one, unless they are privacy nuts like librewolf.
                  
                  We need entirely new browsers that are more than window dressing on top of existing ones.

                    - **immibis**:
                      Remember what happened to Thunderbird, though. Mozilla dropped it, and it got better. There are good reasons to think that Mozilla - the corporate entity - is cancer.

                        - **dartos**:
                          Isn’t thunderbird still part of Mozilla?
                          
                          It says it still is on their site.

                            - **cxr**:
                              Nominally yes, and insofar as the Mozilla Foundation is "Mozilla".  Even then, the relationship is ceremonial.
                              
                              And Mozilla Corp is something different altogether.

                                - **dartos**:
                                  If it walks like a duck and talks like a duck, odds are it’s a duck.

                                    - **cxr**:
                                      ... what?

                                        - **dartos**:
                                          If the shoe fits

                                            - **cxr**:
                                              These are not good comments.

                                                - **lproven**:
                                                  To me, they were clear, informative, and amusingly expressed.
                                                  
                                                  But then I am a native speaker and a Brit and these are abbreviations of familiar expressions.

                            - **manuelmoreale**:
                              > Thunderbird operates in a for-profit subsidiary of the non-profit Mozilla Foundation.
                              
                              I guess the answer is yes.

                            - **lproven**:
                              Not really, no, it is not.
                              
                              T'bird is owned and run by a for-profit company called MZLA.
                              
                              That company is owned by the non-profit Mozilla Foundation but Mozilla does not own, run, operate, or control Thunderbird.
                              
                              Comparison: Pret a Manger, the fancy sandwich chain, is part-owned by Mcdonald's. But you can't buy a Big Mac in Pret, and you can't buy a Pret fancy noodle salad in McDonald's.

    - **InsideOutSanta**:
      I like it, because it shows the author's aspiration. Not all software aims to be visually appealing, which is totally fine. But depending on what the software is, aesthetics are something that I find important.
      
      For browsers in particular, that is a major reason why I don't use any of the existing Firefox forks: they are all very utilitarian. But I look at a browser window pretty much all day long, so I prefer a visual design that brings me joy.

        - **TedDoesntTalk**:
          > I prefer a visual design that brings me joy
          
          This sounds like a marketing-speak. Joy is not an experience gained by staring at the visual design of a browser. You are confusing joy and another experience, perhaps appeal or attraction.
          
          If you genuinely experience joy from browser visual design, you are probably that same guy who experiences “delight” when a customer support representative treats you well on a phone call.

            - **InsideOutSanta**:
              Why are you spending your time explaining to people you've never met what kinds of emotions they feel, or how legitimate their emotions are?

        - **moffkalast**:
          That's probably for the best, every time Firefox tries to make itself look nicer they manage to make UX worse in the process.

        - **Y_Y**:
          Can we just have two separate things? One is a browser that works well, and the other could be maybe some pretty pieces of paper that you can stick over the UI elements that don't spark joy for you.

            - **InsideOutSanta**:
              Why do they ned to be separate?

    - **wccrawford**:
      I feel the same, and not just about "beautiful".  Any time a marketing person tells me how to think about their product, it pushes me away.  Tell me what it is, now how I should think about it.

        - **niam**:
          That's my instinct when people describe themselves, too. e.g in dating profiles when people remark about how "I'm smart, funny", etc.
          
          They may be both of those things! But I can't help that my first conceit is always to think "that's not yours to decide here".

        - **gexla**:
          Imagine having an artist who does paintings and an architect both come up with a concept for a building. Then have each explain their design decisions and why you might select that concept. Each are going to use much different language, though each concept might still be described as beautiful by a judge. Of course, you still need to craft your language to appeal to the buyer, but an architect can probably still do that more effectively. And that architect likely isn't going to use the word "beautiful." The architect's message would likely resonate with me because I could feel the domain knowledge and craft skills shining through.

            - **mionhe**:
              I think you be comparing an amateur artist with a professional architect (which isn't surprising; amateur architects are very rare and professional artists have less visibility.) Only amateur artists would actually describe their work as "beautiful".
              
              If you go to a gallery or museum and read what a professional artist says about their own work (usually found on little cards next to paintings/scriptures/etc.) their descriptions tend to be about much more focused on what they were trying to convey and how they used that medium to do it.
              
              This is also what I've seen from professional architects.
              
              That doesn't mean you would be any more swayed by the professional artist, but it's at least more apples to apples.

                - **gexla**:
                  A couple of things on this...
                  
                  If only an amateur would use the word beautiful, then was it an amateur who wrote the content for this site?
                  
                  The core of my comment was that different professions use different language. In your example, I may find a similar level of skillful description of their work, but that's not going to cross over into different domains. The architect would likely write a more compelling pitch for a building design concept than an artist who is a painter. The artist may not use the word "beautiful" but still may use other language which is a similar miss in domain language used for a successful pitch.
                  
                  In my field, I have to sell software development services to customers who may not be technical. I have to be careful to limit the depth of my technical explanations. But I'm still going to use just enough domain language that the customer will intuitively understand that I have a better grasp of the work to be done than the newly hired sales guy who is doing a pitch for the company he represents.
                  
                  Here's a snippet from "above the fold."
                  
                  > Beautifully designed, privacy-focused, and packed with features.
                  
                  Packed with features? That's like creating a menu item in your site nav entitled "Stuff" or "Misc."
                  
                  Maybe they were just in a hurry.

        - **lo_zamoyski**:
          You mean "tell me what it does". Beautiful is what a thing is. And what a thing does follows from what it is.
          
          Contrary to modern misconception, beauty is objective. Taste is subjective. What makes good taste is alignment of the subjective with the objective.
          
          So, in this case, we can ask "what makes a browser beautiful?". Well, since it is a tool, then its usefulness is intrinsic to the kind of thing it is. So, how useful it is as browser is constitutive of its beauty, as beauty has to do with the perfection with which something realizes the kind of thing it is.

            - **Y_Y**:
              > You mean "tell me what it does". Beautiful is what a thing is. And what a thing does follows from what it is.
              
              If they state in the readme that it's a web browser and I can compile it using GNU make then I'll believe them. If they say it's whizzy fast and easy to learn then I'll consider that's probably somewhat true. If I read "beautiful" and "paradigm-changing" and "redefines the browsing experience" then I imagine they're just trying to puff themselves up without having anything concrete to back it up.
              
              It's true that things can be beautiful, and there are some universal (enough) beauty standards. The signal of being beautiful is not saying "look how beautiful I am" though. It's easy to claim something like that and hard to refute, so it's not a very good signal. The beauty should speak for itself, or at least be attested to be a third-party like with a quote from a review.

    - **hoistbypetard**:
      I don't find it off-putting. I may or may not agree that the software is beautiful because, as you point out, people often have different opinions on what constitutes beauty.
      
      All the same, I find it useful to know that the authors of the software consider "beauty" one of their goals. And beauty does not preclude utility.

    - **nosioptar**:
      Also, beauty is in the eye of the beerholder.  I don't consider the screenshots of Zen to be beautiful by any measure.  It's a mess of grey on grey, none of the buttons look like buttons, and I'm getting a headache from all the moving crap on the home page.

    - **gexla**:
      From the site...
      
      > Beautifully designed, privacy-focused, and packed with features.
      
      If I'm going to put in the effort to create something like this. There is ONE powerful reason which compels me to do this. If I'm pitching this to an investor, then I need to craft a message to convince the investor to hand over money. The above line is wasting space.
      
      I get a sense that the message is either crafted by developers who are horrible at doing so, or by copy people who know nothing about the product. And in neither case does anyone spend significant time finding and interacting with passionate potential users to find what sorts of messaging resonates with them. As with writing, you need to find your voice, and let that voice drive the messaging.
      
      Personally, I wouldn't even bother starting such a project if I didn't get to the "find your voice" part. Maybe the developers have some hand-wavy plan to sell options and accessories rather than having a strong starting point to solving a problem.

        - **mthoms**:
          Come on. It's an open-source, community-funded, soft-launch of an alpha product. The cynicism on this site is really over the top sometimes.

            - **gexla**:
              It's still hopefully useful dialogue on a common subject. I would be grateful to get this much feedback. And the discussion helps boost the visibility of this project on HN. Pick apart my work all you like, I'm happy to see it continue to hover on page 1. Please continue.

                - **mthoms**:
                  It's not the message, it's the delivery. Some people don't react well to having their skills publicly derided as "horrible". We're all human after all.

                    - **gexla**:
                      That's feedback. You don't survive in this world without feedback. Even in Kindergarten, you had grades. What world do you come from?

            - **layer8**:
              In that case, the website wants to make it look like a polished professional product, which is cringe at best and disingenuous at worst.

                - **mthoms**:
                  If that's the impression you got, I don't know what to tell you. Among the very first words on the page are "Donate" (clearly indicating that it is not a professional product). And directly below that we have the words "Introducing Zen Alpha" which should tell you to expect a product that is anything but polished.
                  
                  >is cringe at best and disingenuous at worst.
                  
                  Groan. Can we stop with the hyperbole and be a little more constructive? You're saying it's "cringe" and "disingenuous" because they used a professional looking template and their marketing copy needs work? Let's give them the benefit of the doubt, shall we?

    - **fauigerzigerk**:
      I don't like it either. It's the language popularised by Apple and it makes me cringe every single time.
      
      But is it really the most important thing you have to say about a new browser?
      
      It's just marketing language after all. A lot of great products are marketed using this repulsive language. I couldn't care less.

    - **vagab0nd**:
      Speaking of marketing, whenever I see a comparison chart where "our product" ticks all the boxes, I immediately think "what criteria did you not include in the comparison?"

    - **WD-42**:
      I normally don’t mind but this landing page in particular is a bit extra.

- **cropcirclbureau**:
  I'll say it again, the golden standard for workspaces and sidebars is Sideberry and it's written for Firefox. Always glad to see new browser chrome efforts building on Firefox but it's such a high bar. Will still give this a try though.

- **hysan**:
  Seems… quite lacking in details? It makes some pretty bold claims but doesn’t explain how it achieves things like better performance. Their docs are also pretty empty.

    - **dao-**:
      Here are Firefox about:config preferences they tweak for performance:
      
      https://github.com/zen-browser/desktop/blob/1eaf6e49ef8edd44...
      
      I also found this somewhat funny:
      
        # Edit: ok, ill remove it, goodbye top #1 on fastest browsers benchmark :[
        # ac_add_options --without-wasm-sandboxed-libraries
      
      https://github.com/zen-browser/desktop/blob/1eaf6e49ef8edd44...

    - **dnpls**:
      The website is so bare, I'd like to see a list with all the major features and some screenshots before downloading anything.

- **ZeroGravitas**:
  I got a weird error when trying to run the app from within the .DMG on ARM Mac, in case anyone who can look into it is reading.
  
  It said "Zen Browser" is damaged and can't be opened, you should reject the disk image.
  
  edit: it's a known thing to do with Apples security, workarounds in step 3 here:
  
  https://github.com/zen-browser/desktop/issues/53

    - **causal**:
      Reading the discussion, I see the developers intend to never sign their OSX package. This is a pretty big red flag for me, shows that the developer isn't really serious about supporting OSX.
      
      Too bad, I was excited by the idea, but this is just unprofessional and I really need to trust my browser.

        - **mariusor**:
          > this is just unprofessional
          
          Or they just prefer to not go out of their way to support the walled garden that is the Apple ecosystem. Principles beat professionalism any day for me.

            - **causal**:
              Then don't claim to support it

                - **mariusor**:
                  How would you phrase "we have a version that runs on your platform" then?

    - **SigmundurM**:
      Per their documentation [1], you have to bypass MacOS's gatekeeper.
      
      [1]: https://docs.zen-browser.app/guides/install-macos#step-3-byp...

    - **ulimn**:
      I hate this about MacOS. It happens seldom enough for me to forget about it and every time I have to search the web for the solution. Thanks for posting the steps.

- **thinker5555**:
  I've seen the "workspaces" thing in a few different browsers now. I know Vivaldi and Arc have them, and it sounds like it's a separate thing from profiles, but I don't quite grok what the difference is between workspaces and profiles.  Can anyone help enlighten me?  If you use both workspaces and profiles, what do you do differently between them?

    - **_benj**:
      I use workspaces in Vivaldi and they are pretty much a set of tabs that I can switch as a set, but all under the same profile. As an example, in my dev workspace I have GitHub, localhost, and a few other things I might need. In another workspace in have Google calendar, Jira, gmail, etc… I can switch workspaces and it will switch all of the current tabs in my browser.
      
      But, I’m logged in, say, in the same GitHub or Google account across workspace.
      
      Profiles on the other hand (I’ve used those on Arc) change where you are logged in… so I can be logged in to my work gmail on one profile, and to my personal gmail on another.
      
      Personally I don’t find profiles that useful just for the fact that I simply use different browsers for personal and work… but a use case for profiles is, for example, to be signed in as admin and user to your local dev web application and test things between the two just by changing tabs instead of having to logout and login

    - **slightwinder**:
      Workspace is mainly just managing Tabs. While Profiles are separating all settings, including addons, passwords, bookmarks, etc.

        - **mkbkn**:
          This is the best and simplest answer.

    - **protomolecule**:
      One might think of them as virtual desktops.

        - **8organicbits**:
          Could I think of profiles as virtual desktops too?

            - **lysp**:
              Different user logins

    - **quasarj**:
      Doesn't FF have them as well? Or maybe it's an extension.

    - **1oooqooq**:
      it's just a group of tabs. absolutely nothing else. profiles offer settings (proxy, etc) and state (cookies, etc) isolation.
      
      it's the same as opening a new window for me. meh.

        - **mthoms**:
          Arc spaces have transient and pinned tabs, which in turn can be organized as needed into folders.  Some tabs are actually multi-tab (split screen). The folders themselves have a neat feature whereby active tabs can be shown while hiding inactive tabs located in the same folder.  I can also switch to a specific space with a user defined hotkey, and customize the color of each workspace. Each workspace can have its own profile (and history) or you can share profiles between workspaces. You choose.
          
          None of those on their own are groundbreaking, but all together they make for a compelling differentiator (for me anyways, but I have ADHD so prioritize different things than most).
          
          Describing all that as "absolutely nothing [other than a new window]" is not accurate at all.

            - **1oooqooq**:
              thanks for the excellent description... but the question was how it's different from profiles, which is used for isolation and settings change. what you described is still nothing more than moving windows around.

                - **mthoms**:
                  I don't know what to say to that. I just described 5 or so features that are objectively more than simply "moving windows around".
                  
                  Maybe it's because I wasn't clear that many of those features work on per workspace basis - transient tabs (unique to each workspace), unique folder organization features (customized for each workspace), built in split screen (again - with custom arrangements per workspace), hotkey switching between workspaces, different color theme per workspace (so it's easy to know which workspace I'm in, or select another window quickly with Mission Control).
                  
                  Then there's the fact that profiles are a separate thing from workspaces so you can mix and match profiles to workspaces according to your needs. So you can have three workspace and have two share a single profile.
                  
                  If those features aren't compelling to you that's fine. Just say so. But please comment constructively or not at all. I genuinely have no interest in trying to "sell" anyone on this workflow. I was just answering the question.
                  
                  >what you described is still nothing more than moving windows around.
                  
                  Ok, even if that were true (it objectively isn't), I like wrangling less windows. How's that? Good enough for you? Why would I want four windows open, when I can have one or two (did I mention that I have ADHD)?
                  
                  If it helps, you can think of workspaces like another level of tabs. Tabs are objectively good right? Yet everything you can do with a tab can be done with a window. Right?

- **Hard_Space**:
  Does anyone know if Zen identifies itself as 'Firefox' at program-level when running on Windows? This is the biggest mistake that FF forks and offshoots make, since it makes it impossible to run Firefox and the derivative work at the same time.

    - **jeremiahlee**:
      Just tested with Zen v1.0.0-a.26. User agent reports: 
      Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:129.0) Gecko/20100101 Firefox/129.0
      
      Exact match with Firefox v129.0.1:
      Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:129.0) Gecko/20100101 Firefox/129.0

        - **ReadCarlBarks**:
          He's not asking about the User-Agent string sent to websites.
          
          He's asking about how the browser identifies itself to the Windows operating system. According to him, other forks say simply "Firefox," which makes it impossible to run them alongside the official Firefox release.

    - **autoexec**:
      Shouldn't be a problem if you use the portable version of one (or even both if that's an option).

- **forthwall**:
  I'm really enjoying the experience of Zen. I appreciate a ~modernish~ style and UX paradigm on a browser that isn't chrome based. Keep it up!

- **dartharva**:
  I don't know why but websites always feel downgraded with Firefox and its descendants. Long load times, incomplete/failed loads, bad font rendering, buffering.. It feels evident that webmasters only care for compatibility with Chrome et al.
  
  It felt that it was subsiding in between, but sites have again started breaking on it nowadays.

    - **raffraffraff**:
      I use Firefox on Linux and in general it's fine. Only really dreadful stuff like Microsoft Teams will outright fail. I've found that using NextDNS or an adblocker is more harmful on certain sites. I've had situations where a website completely fails until I change my DNS provider to 1.1.1.1 or 8.8.8.8 or wherever. But I tend to avoid sites like that if I have a choice.
      
      I'm sticking with Firefox. I like the account features (sync, send tab to another device etc) but Firefox's killer feature is container tabs, especially with the add-on for regex URL matching for container selection, and the other add-on that automatically handles AWS SSO accounts.

        - **avazhi**:
          Well at this point for anybody who cares about adblocking Firefox is the only choice, unfortunately.

        - **noisem4ker**:
          I noticed Teams unexpectedly started working in Firefox for me, a few months ago.

            - **tux3**:
              That's terrible. Maybe if you downgrade?

        - **Kokouane**:
          Also important note, but Firefox account settings/sync is End-to-End encrypted, a nice privacy feature compared to the much more invasive Google Account sync.

        - **xolve**:
          > especially with the add-on for regex URL matching for container selection
          
          Which add-on is that? It would be quite helpful.

            - **alje**:
              That is a built-in Firefox container feature. Open a website in a container and then click on the container icon (right next to the search bar) to keep that site open in that container. Every other time, that site loads directly into that container

                - **xolve**:
                  Thats per domain, not on any pattern of URL.

                    - **raffraffraff**:
                      Yep, I think it's called "Containerise" with the British spelling. To make it work you need to remove your existing URL rules from the main container tabs add-on, or they'll fight like cat and dog if there's a conflict.
                      
                      What's great about regex matching is that you can grab a regex for each of your Google accounts, and bookmark the URL that the regex matches. I've changed the Firefox search bar config to prioritise bookmarks in the results. I can now type 'gmail', and the top two results are:
                      
                      Gmail (work)
                      
                      Gmail (personal)
                      
                      Each opens in opens in the correct container. The trick sometimes is finding a bookmarkable URL with a specific string that you can use in a regex.
                      
                      To be honest it's one of the features I wish Firefox would add to their add-on because I don't like giving their party add-ons access to my data.

        - **justinclift**:
          Have you seen the thing were Mozilla officially bought an advertising company recently then started adding advertising friendly features near silently?

            - **grounder**:
              Can you provide more info about this?

                - **justinclift**:
                  Yep:
                  
                  https://news.ycombinator.com/item?id=40842808

                    - **justinclift**:
                      Better link: https://archive.md/6Un3E

    - **winter_blue**:
      I use Firefox a lot (and occasionally Chrome), and I haven't had any issues with Firefox. I've been pretty happy with it.

    - **frosting1337**:
      While I agree that develops really only care for Chromium compatability, I've not really noticed any issues with Firefox, except with Google sites every now and then (YouTube in particular).

        - **raffraffraff**:
          Weirdly, I've had to install the full Google Chrome because the Chromium has been problematic. Can't remember details, but I think MS Teams was one example.

        - **dartharva**:
          Yes, Youtube is the main irritant for me as well.

            - **mariusor**:
              When it comes to the websites belonging to the competition, I feel like it's unjust to blame Firefox instead of, in this case, Google.

                - **dartharva**:
                  Google is ironically a key sponsor of Firefox.

    - **mrweasel**:
      That might be dependent on use case and which sites you use. I haven't installed Chrome for more than 3 years. Firefox has been my primary browser ever since Opera switched from using Presto, but I kept Chrome as a backup for the longest time. Now I don't needed it anymore. I do have Safari available, but that's mostly for testing.
      
      When your coming directly from Chrome, then maybe you see the problems more? I know I started really disliking Chrome, mostly do to the UI and the developer tools (which is worse that Firefox and much worse than the old Opera, in my opinion).

    - **exusn**:
      Font rendering does feel much worse on macOS, but on Windows you can tweak the cleartype parameters a bit and get it closer to Edge/Chrome.
      
      https://searchfox.org/mozilla-central/rev/404408660a4d976e2a...

    - **ilrwbwrkhv**:
      As web developers it is our moral and ethical duty to use Firefox / any non chromium browsers because we truly understand the problem of one company controlling the web.

    - **Fire-Dragon-DoL**:
      Same problem, to the point that I started testing alternative browsers that are chromium based. Currently using Brave, I couldn't find better alternatives that worked on linux, windows and Android.
      
      It's shocking that there isn't a decent chromium based browser that supports extensions on android.

        - **Kokouane**:
          There is an app called Kiwi Browser that does support extensions on Android. The issue becomes no sync, which I think is also a feature you are looking for.
          
          It makes sense that Chrome has never built it, have to keep the users from using Adblock.

            - **Fire-Dragon-DoL**:
              I'm aware of Kiwi, but it lags for months to a year behind chromium updates, which is very dangerous.
              
              Chrome for sure, I was surprised that also any other browser (Via, Soul, Brave, vivaldi) don't support extensions.
              
              I'm on Brave now because while it does not support ublock origin, the adblocker is stronger than the others I tried and works similarly. It also has some sort of builtin sponsorblock, so I use it on the phone over Firefox which is slow.

    - **jmprspret**:
      Fonts do always look way better on Chrome. I can't explain it.

        - **widdershins**:
          It's just familiarity. I use Firefox on macOS and I always think the fonts look fuzzy on Chrome when I'm occasionally forced to use it. I spent a few weeks on Arc (Chrome-based) earlier this year, got used to the fonts, and then they looked a bit weird when I came back to Firefox.

            - **seabrookmx**:
              +1
              
              I hate the Chrome fonts for this reason.
              
              I'm surprised Mac users are noticing a difference though, I find the difference basically vanishes on really high res displays (like my QHD-ish panel on my Framework 13).

                - **pjerem**:
                  Pixels aren’t noticeable anymore in such resolutions but font rendering and anti aliasing may still impact perceived contrast and crispness.
                  
                  Though, on such displays, disabling AA totally is a viable option but it will still feel different.

        - **pjerem**:
          Interesting, font rendering is the number one thing that makes me hate Electron apps (I have so much more reasons to hate Chrome).
          
          It’s to the point that I just can’t use, say, VS Code on a monitor that is not Hi-DPI.
          
          Don’t get me wrong, I’m not saying that the font doesn’t look better. Maybe it’s aesthetically more pleasing but to me, it’s just harder to read.
          
          I have multiple eye issues that may not help and which make me more demanding but since I don’t have this issue with OS rendered fonts, I consider this to be an issue.

    - **ReadCarlBarks**:
      When a site doesn't work properly, please use this form to notify Mozilla: https://webcompat.com/issues/new

    - **christophilus**:
      Slack video chat works only in Chrome. As in, they explicitly check for non-Chrome browsers and say “Nope. We won’t even let you try”.
      
      When I saw that, I thought, “Yep. We’ve come full-circle.” Chrome really is the new IE.

    - **Zyten**:
      I had the most issues with sites like YouTube, where I‘m not surprised that Chrome based browsers run better. However, I recently also had issues with Sony, where the login page would error out every single time with Safari and Firefox. Chromium worked just fine.
      
      I honestly do not understand why there’s this little testing being done. Yeah, Chrome is dominant, but that doesn’t mean that other browsers should not be used or don’t exist. It‘s actively harming users. In our software development projects (HPC software), we deliberately test with all compilers available on HPC systems, just to ensure that nothing breaks…

- **yellowapple**:
  Looks nice.  I like that it defaults to vertical tabs, but I don't like the inability to give them any sort of hierarchy, be it a full-blown tree like Tree Style Tabs or with tab groups like Edge.
  
  Since it's just a Firefox reskin, I was able to login with my Mozilla account and sync my extensions, Tree Style Tabs included.  Enabling Zen's "compact mode" turns it into a pretty ideal setup for TST, since the default tab list disappears entirely.  Still would be nice to not need TST in the first place.
  
  Workspaces seem like a nice idea in theory, though currently underbaked in practice.  Deleting a workspace appears to be bugged at the moment; attempting to do so just switches to the workspace instead of deleting it.  It'd be great if they could integrate with Containers; I'd love to be able to e.g. set a default container for a given workspace (and then all tabs in that workspace would default to that particular container).
  
  The Zen Sidebar is pretty cool; I can see myself using the premade Wikipedia and Google Translate panels quite a bit, in addition to setting up some of my own.  Resizing the Sidebar is pretty finicky, unfortunately; dragging the edge will often fail and cause the Sidebar's size to snap to a tiny width.
  
  Zen seems to have a built-in profile switcher, which is interesting, but seems redundant with Containers and way more limited.  I also don't know why it defaulted to creating both "Default (alpha)" and "Default Profile" profiles, nor do I know why it set "Default (alpha)" as the default.  I assume because this is an alpha release?
  
  I don't know if Zen changes enough for me to prefer using it over normal Firefox (especially with Firefox's own vertical tab and sidebar improvements on the horizon), but I appreciate that this exists and look forward to seeing where it goes.

- **wpwpwpw**:
  Thank you for your work! I believe it's not ready for daily driving, but I was happy to try it out and, maybe, to check again later so it replaces firefox. Loved all the new features and look and feel. However, there are some quirks I'll describe here, maybe they'll be useful. The sidebar is missing some hover popups so one can know what the buttons mean; animations, in general, are not very good, making the interface look rough; some parts of the regular firefox interface are just "glued in", and they feel a bit alien / missing integration (bookmarks, history...); tab bar at right side not working, although there is a button for it (useful for wide monitors in which you pin the window to the right side). Keep going!

- **antran22**:
  I checked this out and I gotta say it is still in a very early stage. The features they are presenting seem nice, but not very usable, with a lot of rough edges.
  
  Then I found this issue, where essentially they left a huge backdoor open with Remote Debugger: https://github.com/zen-browser/desktop/pull/927. The guy claims that it was due to ignorance, but seeing this really shakes up my paranoia. Luckily I haven't typed any credential into the app. From a security-minded user's perspective, this is not a good sign. I hope that they would really put privacy & security forward, get some 3rd party security audits.

- **groove9373**:
  I noticed that the Firefox Multi-Account Containers addon isn't working for me on Zen browser. I'm using it via Flatpak. Does anyone else have this issue?

- **gsimons88**:
  Does anybody have insight into how this compares to Brave? In their own comparison Brave is not even considerd.

    - **mrweasel**:
      > In their own comparison Brave is not even considerd
      
      If their target audience is disgruntled Firefox users that makes a ton of sense. I would not consider replacing Firefox with a browser based on Chrome/Chromium. It's not that I think it a bad rendering engine, it not, but I don't like the mono-culture that has been promoted and would like to avoid contributing to it, if I can.

        - **netbioserror**:
          I still don't understand this "browser engine monopoly" argument. Engines are the most difficult part to build and coordinate around. WebKit is open source and gets contributions from across the industry. It would make sense for most people to coalesce around that single target. The browsers built around the engine are the feature-filled interfaces people care about and where competition should happen. The engine has no opinions about tracking or tabs or built-in services. As soon as we argue we need unique engines, there are now multiple competing standards for developers to target. In fact, I'd bet that future engines that cite issues with WebKit as their motivation for a fork or a from-scratch rewrite will start using the tagline "WebKit-compatible" because that standard is so important.

            - **DHPersonal**:
              The issue with a single browser having dominance is that the largest contributor to that project doesn’t just control the project, they control the Web.

            - **mrweasel**:
              > It would make sense for most people to coalesce around that single target
              
              No it wouldn't. Even the OpenSSH project has states that they'd prefer that more SSH implementation where around, due to security concerns. Bugs in OpenSSL where/are a serious issue, because of it was almost a monopoly until HeartBleed.
              
              Having a single rendering engine be 95% of the market is not a good option in terms of overall security for the internet.
              
              The rendering engine in Chrome is Blink, which is a fork of WebKit. Safari,  GNOME Web and DuckDuckGos macOS browser still uses WebKit. Blink and WebKit is going to share some of the same issues, as they come from the same codebase, but they are two separate rendering engines at this point.

    - **Kokouane**:
      They only compared to Firefox-based browsers which does make sense. Most people are already firmly on one side of the Chromium vs FF engine debate.
      
      Compared to Brave in what terms? Speed, not sure, but Chromium is known to be better. As far as I know, Brave doesn't allow split tabs or workspaces though.

        - **NayamAmarshe**:
          Brave now has split tabs in the latest nightly iirc.
          
          Not sure about workspaces, is it like profiles?

            - **Perz1val**:
              Seems like workspaces are just a different UI for tab grouping, some ppl may prefer it. For me both are usable, but both are just a partial remedy for people that keep too much tabs opened

- **brianzelip**:
  Finally something not chromium!

- **niks1**:
  I have a few questions I would be very interested to hear the answers
  1 When is the earliest we can try tab grouping in Firefox Nightly? 2 Will the following things be available, the ability to group by dragging and dropping a tab, the ability to name and change the name, assign a color, and pin and hide a tab group, and the option to sleep tabs in groups? 3 Is the Workspaces feature being considered, it is quite popular and has been implemented in Floorp and Zen? 4 Is tab grouping also considered for the Android version of Firefox? 5 Are there any plans for a Portable version with a built-in dark theme for websites? Thank you very much! We are very sad that many features have been removed, tab grouping, pwa, rss, compact mode, menu icons, etc., hopefully this will all be coming to Firefox and such mistakes will not be made again.

- **eddyg**:
  The most game-changing thing for me about Arc has been Air Traffic Control. I have spaces set up my various web-based apps, and previously they would be scattered among my dozens of browser windows. Now, the tabs of each web app are beautifully contained in their own spaces, thanks to ATC.
  
  Any idea if Zen supports this? And ctrl-tab for quickly cycling between recent tabs (even across Spaces)?

- **niks1**:
  I have a few questions
  I would be very interested to hear the answers
  
  1 When is the earliest we can try tab grouping in Firefox Nightly?
  2 Will the following things be available, the ability to group by dragging and dropping a tab, the ability to name and change the name, assign a color, and pin and hide a tab group, and the option to sleep tabs in groups?
  3 Is the Workspaces feature being considered, it is quite popular and has been implemented in Floorp and Zen?
  4 Is tab grouping also considered for the Android version of Firefox?
  5 Are there any plans for a Portable version with a built-in dark theme for websites?
  Thank you very much!
  We are very sad that many features have been removed, tab grouping, pwa, rss, compact mode, menu icons, etc., hopefully this will all be coming to Firefox and such mistakes will not be made again.

- **ilrwbwrkhv**:
  https://old.reddit.com/r/firefox/comments/1bsm9lu/im_doing_a...
  
  Reddit launch of the project about 4 months ago.
  
  Fantastic project and already very polished browser. Really enjoying it!

- **gpm**:
  femou are you the author?
  
  https://github.com/zen-browser/desktop/tree/main/src/browser... has a submodule pointing to https://github.com/zen-browser/components/tree/dab7fd0b2fbf2... which isn't public... I assume that's an oversight.

    - **Izmaki**:
      Woops.

- **bityard**:
  Seems like the features they promote on the marketing page are ones that Vivaldi has had for quite some time. I'll probably give it a try but when I gave up on Firefox, one of the main reasons was that many of the sites I visit aren't tested on Firefox due to the low market share and are broken in subtle ways.

    - **getcrunk**:
      Like what? Aside from google and Apple being actively hostile to Firefox I rarely have issues

        - **Yeri**:
          100% and if I have issues it's an extension (like ublock or privacy badger)

            - **dimator**:
              These two are the culprits every time a page has issues on Firefox for me.

- **remedan**:
  I really like the UI! I use Firefox with Sidebery and the top tab bar hidden via userChrome.css, which is kind of a hassle. Zen supports that kind of layout out of the box.
  
  I'm very happy to see a new modern browser not based on Chromium. Will definitely test drive it to see if it's worth switching to.

    - **hodanli**:
      i really like the hierarchy in sidebery

- **bionsystem**:
  All of those are features I love in Vivaldi. If it matures it will be a very welcome open source replacement.

    - **aezart**:
      I've been looking for a Vivaldi replacement as well, due to the looming manifest v3 stuff. Hopefully this, or another project like it, works out.

        - **adhamsalama**:
          Try Firefox with the Sideberry extension.

    - **PikachuEXE**:
      I use Vivaldi too. Will try this one out to see how it compared to Firefox

- **jeremiahlee**:
  Website getting hugged to death for a second day. Direct link to downloads from the GitHub releases: https://github.com/zen-browser/desktop/releases

- **desipenguin**:
  Does Zen have (or plan to build) Auto Archive feature like Arc ?
  https://resources.arc.net/hc/en-us/articles/19228855311127-A...
  
  I couldn't find any Firefox extension that does this (Or maybe I didn't look hard enough)
  
  This is the one feature that brought me to Arc
  
  (I've since stopped using Arc, and moved to Vivaldi. My "main" browser is still Firefox)

- **pshirshov**:
  Really cool but so far noone was able to package it for NixOS: https://github.com/NixOS/nixpkgs/issues/327982

    - **MarceColl**:
      I wrote a flake based on the binary release while it gets packaged in case you are interested: https://github.com/MarceColl/zen-browser-flake

- **anjel**:
  Was really looking forward to trying this browser out. But the windows installer fails VirusTotal scan by 4 separate scanners.
  Its usually a false positive, but its not the environment to giving the benefit of the doubt for.
  This happens more and more often for me, and I'm surprised software development skips the stage of addressing this prior to app launch and promotion.

- **redkoala**:
  Vertical tabs and privacy focused implementation gives me a good combination between the Arc browsing experience and the privacy protections that Mullvad browser (or private mode Firefox) deliver.

    - **willi59549879**:
      I was very surprised with selection if the search engine after install. None of the browsers I tried do that. I quite like the vertical tabs also the browser is visually appealing

    - **danpalmer**:
      Yeah I'm keen to try Zen to see if they've nailed the tab/workspace UX in the way that Arc has. I don't like Arc's decline into slow AI features and growth hacks, but some of the core functionality is really nice.

- **Alifatisk**:
  First we got Floorp, now we got Zen. Love it! I hope they make it available through Chocolatey and Homebrew like Floorp.
  
  I really like that Zen offers two options, a setup wizard and a portable binary.

- **shafyy**:
  Looks promising. How do you plan on being financially sustainable?

- **bpbp-mango**:
  Split tab is cool.
  Couldn't import data from firefox.
  Quite slow to launch.
  Profiles are buggy, the name gets lost and it keeps launching the welcome wizard.
  
  looking forward to seeing this mature

- **dev213**:
  (now ex-) Firefox user here. I think I am in love with this browser.
  
  I tried switching to arc, but it didn't stick since I really got used to the Firefox way of life. The arc browser also felt really commercial and has a lot of gimmicky AI features, which is not optimal.
  
  This Zen browser is like a blend of the best of both worlds!

- **mkbkn**:
  On Linux Mint 21.1 Mate, I was not able to launch or use the Appimage file. Then I installed the flatpak version and it worked. Though I prefer the former.
  
  Anyway, it looks good on the first try. Will give it a good try for a month or so before committing to it.
  
  Does it have "profiles" feature like Vivaldi?

- **maelito**:
  Firefox's container addon is one of the features that make me love firefox. But they could be integrated better.
  
  I'll try Zen.

- **Mashimo**:
  > Optimized for peak performance
  
  What does that even mean?

    - **Alifatisk**:
      I interpret that as they have tweaked the configurations with the performance in mind, meaning their goal when customizing the browser has been to get as much juice as possible out of the browser.

        - **MrAlex94**:
          Realistically, compiler flags and config flags have had diminishing returns on Firefox builds for a few years now. Mozilla are very quick to update the toolchain now, compared to before as well as taking care of curated CPU-dispatch where necessary.

- **gukkey**:
  I have been looking for an alternative for Arc for some time and this seems promising. Doesn't have folders and peek for now, but excited to see how it's going to evolve. Atleast this project isn't just firefox slapped with a wannabe arc theme.

- **anon23432343**:
  One thing almost all arc clones dont get right and I talked with other arc users about this is that arc when surfing has no ui besides the border no top bar not tabs you can hide everything if you want to.
  
  I downloaded Zen and what do i see a top bar which I can not hide or at least I can not find how to do it.

    - **joshjob42**:
      Activate Compact Mode in the settings.

    - **anon23432343**:
      Okay I found it but its wanky at best. how do i show the topbar once its gone?
      
      I get that this ia an alpha but yeah going back to arc feels much smoother

- **braggerxyz**:
  Hmm, doesn't appeal to me. There is nothing over stock FF which I would consider important for me.

- **mrweasel**:
  Someone pointed out to me that you can set eBay as the default search engine. That seems like a weird option. There can't be many that primarily uses their browser to access eBay, though I wouldn't rule out that people with this preference exists.

    - **nyanpasu64**:
      Stock Firefox also allows setting Amazon and eBay as a default search engine, and I wonder if this is related to Amazon being a sponsored shortcut on the new tab page.

    - **autoexec**:
      I wish you could just set the default search engine to "none". I just disable it eventually anyway, but it still leaves a bunch of garbage behind, like having "Search <whatever> for <blah blah blah>" in the context menu.

    - **biugbkifcjk**:
      Maybe they get some royalties by having it as an option?

- **jedisct1**:
  Do people really care about the engine being used under the hood?
  
  From a user perspective, I see no difference between Blink, Webkit and Gecko.
  And when there is, it's a website that has only been tested on Blink, or uses features not available elsewhere.

    - **rocketvole**:
      traditionally no, but adblocking on firefox has been traditionally better and chrome(and therefore chromium) is about to break many adblocks

    - **tjoff**:
      Yes, I care deeply about diversity in the browser land.
      
      Luckily Gecko also performs the best for me.

- **Saris**:
  I'm getting a 403 forbidden error from Vercel while using Firefox to try and look at a Firefox fork lol.

- **findthewords**:
  I have a suggestion: use the existing tabs sidepanel to display "bookmarks" and "history" in it, for a consistent experience, instead of two different kinds of pop up panels.

- **lovestaco**:
  Good software.
  
  One more smart thing to do would be to open different workspace by middle click on the workspace name or giving options to open from the list.

- **grumblepeet**:
  Sadly didnt run for me on Windows on this Arm laptop although in mitigation I didnt try that hard & was in a hurry. I might have another look at it later. Uninstalled for now.

- **tamimio**:
  I will give it a try. Firefox has recently not been the best, especially in private browsing mode. Opening less than 15 tabs there, and it’s already using 25 GiB of RAM!

- **ertucetin**:
  Why are there so many new browsers these days? Is there really that much demand for them? Considering that creating one is very hard and requires a team.

    - **bee_rider**:
      The situation is pretty bad, where there are only two browsers: an ad-company controlled one that is making life harder for ad-blockers, and Firefox which is… fine, but somehow both stagnant and unfocused.
      
      So, the opening is there, can’t blame people for trying to fill it.
      
      OTOH this is just a Firefox fork advertised as a new browser.

        - **joshmarinacci**:
          Don’t forget Safari. Essentially there are three browser engines that all browsers are built on. The only engine that is truly new in the last 15 years is Servo. (And maybe Ladybird)

            - **bee_rider**:
              lol, I posted the comment from mobile safari but didn’t think of it. Eh, closed source software doesn’t count, haha.

- **chrisabrams**:
  I tried downloading this for MacOS Silicon and was told the dmg was damaged :/ Guess I'll wait a little bit for things to iron out.

    - **Alifatisk**:
      It's not damaged, read some other comments about the workaround for this.

- **giancarlostoro**:
  I have been using Firefox since after 2004 (I'm not sure if it was 2005 or 2006) and while I love the browser, I wish they would invest moreso in just making it less cluttered. One of the first things I do when I install Firefox is get rid of the stupid gaps next to the URL bar. Every. single. time. It really angers me. Who wanted that? Do people leave it on because they can't figure out how to remove them?
  
  We had a browser aiming towards being a full on Rust application, and I was excited and cheering that on, not because it was Rust, but because the focus by shifting to Rust was security and speed. Now I'm not sure the focus.
  
  I like how sleek this browser looks, and the "themes" seem to target very specific needs of minimalizing the UI which I also appreciate. I'll have to pull this one down for my Linux box to try it out.

    - **someone4958923**:
      >  One of the first things I do when I install Firefox is get rid of the stupid gaps next to the URL bar. Every. single. time. I
      
      THIS! This is the first thing I do after installing firefox. Nice to see I'm not the only one :)

        - **giancarlostoro**:
          I can't go 1 minute with that thing turned on, it drives me crazy.

- **vfclists**:
  Is it based on the GeckoView engine for Android which is never going to be ported to Windows?

- **keen99**:
  ah a cute but soon-to-be-dead project, since they apparently are intentionally breaking the macos experience.    either support your users or remove support for your users - shipping them an intentionally broken experience is a bad move.

- **raghavbali**:
  the browser wars are heating up again! nice

    - **whywhywhywhy**:
      The browser window chrome[1] wars*
      
      1:(As in the pre Chrome meaning of the word)

- **sweeter**:
  You had me at tab groups. It is baffling that Firefox has refused to do anything sane about tab groups.

- **sirodoht**:
  macOS says "“Zen Browser.app” is damaged and can’t be opened. You should move it to the Bin." :(

    - **weikju**:
      Probably isn't notarized. Right-click the app and open, or use the terminal:
      
      xattr -d com.apple.quarantine /path/to/app
      
      edit: turns out they are describing this process here from a link on the macos download page:
      
      https://github.com/zen-browser/desktop/issues/53

        - **danpalmer**:
          The link is titled "Download Zen for macOS" which seems superfluous when the DMG starts downloading immediately, perhaps it needs a better title.
          
          Also while I understand some people have moral objections to the 100 dollar/euro registration fee, clearly a lot more than that has been spent in time to get the application to this stage, almost all apps for macOS distributing like this are notarized now, and with such a slick marketing page it just feels weird to then not spend a relatively small amount of money to make this immediately far more accessible. The instructions aren't hard to follow, but still make trying it out 10-100x harder.
          
          Also it's tricky to get donations for something that literally prevents people using the application, no one is going to donate for the registration fee before even trying it, and once they've gotten through the installation process there's no incentive to donate for that anymore.

            - **tadfisher**:
              To be fair, requiring the developer 100/eur per year in perpetuity to avoid a dialog literally telling the user to drag the app into the Trash feels a lot like extortion.

            - **devjab**:
              I don’t think anyone should pay Apple to notarize their applications to be honest. It’s basically extortion that you need both a running $99 subscription and a MacBook of some sort to complete the process. I understand why big companies will do so, but for OSS projects it frankly should cost anything. I do wonder if the process would stick if companies like Google and Microsoft refused to do it though they obviously won’t.
              
              That being said, I’m sure a lot of OSS projects are willing to accept it if you personally chose to pay the fee.

            - **zamadatix**:
              At this point the browser isn't even beta on a single platform, I don't think making it easy to install on macOS is really a pressing priority to expect developers to drop money on in hopes of growth quite yet.

            - **whywhywhywhy**:
              I’ll pay it when they just fully block software that doesn’t pay.
              
              Until then as they escalate their extortion dialogs I’ll just normalize instructions on how to run dodgy looking shell scripts that bypass them on software I release for free.

            - **weikju**:
              > The link is titled "Download Zen for macOS" which seems superfluous when the DMG starts downloading immediately, perhaps it needs a better title.
              
              yes I found that awkward as well

            - **rchaud**:
              If you are downloading a new browser app in 2024, it's a fair bet that you know how to get around MacOS' nanny state policies around un-notarized apps.

- **anotheryou**:
  Any difference besides the UI to using sideberry with containers?
  
  E.g. seperated history suggestions or something?

    - **ikari_pl**:
      definitely not any of the differences that make Arc attractive (new windows aren't portals to the same tabs, cmd+t doesn't open a tab/command bar, search doesn't turn into AI search...)

- **ebri**:
  I'll take qutebrowser any day. Best damn thing I've learned to use since (n)vim.

- **qurashee**:
  "The only limit is your imagination" is a direct reference to zombo.com for me

- **lagniappe**:
  “Zen Browser.app” is damaged and can’t be opened. You should eject the disk image.
  
  Current MacOS on M2

    - **ObscureMind**:
      cd /Applications && xattr -d com.apple.provenance "Zen Browser.app"/ && xattr -d com.apple.quarantine "Zen Browser.app"/

        - **lagniappe**:
          I appreciate it, but I'll wait.
          
          When you enter a restaurant or hotel, and the lobby is disheveled, the parts you can't see likely won't be of a higher standard. Not for me yet.

- **imagetic**:
  My download was corrupt and macOS threw it in the trash. That's a first.

    - **wlonkly**:
      Same here -- I tried the x86 build as well with the same result.

- **deagle50**:
  I've wanted a split view in Firefox forever. Thank you!

- **jdeaton**:
  The macos disk images are "broken" according to my os.

- **owjofwjeofm**:
  to me the main feature that makes arc browser appealing is how they combine the features of open tabs and bookmarks into one intuitive system, and making switching an open tab into a tab in the saved section really frictionless, and allowing you to view a tab in the same section in the same manner as an open tab. It also then automatically takes care of the memory management aspect of closing unused tabs for you while keeping the visual representation of open/saved tabs the same, and letting you be confident that the state of the saved tabs section is persisted.
  
  No browser that I've seen comparing itself to arc really does this.
  I downloaded zen and looked at it for like 30 seconds and it doesn't look like it does this either.

- **nxtcoder17**:
  how is it different than [floorp](https://floorp.app/en) ?

    - **latexr**:
      Every time I see a question like this on HN, the answer can be found out with minimal effort. If you want to recommend some relevant alternative you use, just be honest and say that. If you really want to know, it would be reasonable to spend twenty seconds on the page, there’s a comparison table.

    - **nusl**:
      You can determine this yourself quite quickly by visiting each site and comparing them.

    - **stackghost**:
      I suppose it doesn't have a name I'd be embarrassed to tell my grandmother about.

- **mazugrin2**:
  femou, are you affiliated with Zen? Do you know if there are any plans to add support for ARM users running Windows or Linux?

- **upcoming-sesame**:
  Images on the landing page look very pixelated

- **NayamAmarshe**:
  The website design is really cool! I love it!

    - **krunck**:
      Design is meaningless when there is zero content. The site has no information to help me in making a decision of whether I should try it out. No technical information at all.

    - **Dalewyn**:
      I hate it; it looks like a Tiktok adshort and I gathered no useful information despite significant movement through the voluminous scroll bar.

- **causality0**:
  Someone want to explain what "based on the Firefox engine" means? Is it a fork of Firefox or do they think I'm too stupid to know what Gecko is?

    - **Kokouane**:
      Not a fork, it is just based on Gecko from what I can tell on their GitHub. To be fair, Zen is clearly targeting a regular audience who most likely do not know what Gecko is.

- **lordofgibbons**:
  I'm very interested! Before I adopt, could you please share what's your business model?

- **account42**:
  What is it with modern software and ungoogleable names. Make up something unique instead of just using short english words FFS.

- **eitland**:
  Does this thing have nested tabs (like TST or Sideberry) or is this another one that didn't realize that saving vertical space, while useful, is less than half the point of vertical tabs?

- **riperoni**:
  Firefox with some extras might he nice, but the structure of that web page raises the question:
  
  Who is the target audience? That website has so many oversimplified marketing claims that are about security and customization. It seems wholly undecided if the target audience is people who fall for buzz words or someone actually interested in quantitative improvements over Firefox.
  
  And yet the comparison is just checkboxes and not even including base Firefox. How about bar graphs for comparison and some actual pictures of the advertised customization, layout and workspaces?
  
  To me this still feels a little shady, even though the features seem nice.

- **ramon156**:
  While I don't condone complaining for the sake of complaining, I really don't see why I would use this. 
  Every argument feels very "floatey".
  
  When I think of browser devs, I don't think about fancy UI, and blazingly fast speeds! I think about engineers who know what they're talking about.
  
  I've never heard of floorp, and the arguments against librewolf are silly. On top of that, some of these "features" like themes, profile switching are already in FireFox. So again, why would I choose Zen?
  
  I don't see how this project adds any value to the very mature FF, it's just piggybacking imo.

    - **dotancohen**:
      Sometimes (not necessarily here) just a better UI for existing features is enough to make a project succeed.

        - **ZeroGravitas**:
          One relevant example being Firefox, which started in exactly that way. Hiding some features from the overly-featureful Mozilla and focusing on the basic user flow.

    - **Perz1val**:
      The whole thing looks like the "new month, new JS framework" situation

- **ammar-DLL**:
  i wish if this made in gtk4 or qt6

- **benreesman**:
  We don’t need those investors: https://youtu.be/kKAue9DiHc0

