# The Day Anubis Saved Our Websites From a DDoS Attack

One part of my work for the ScummVM project is helping to keep the server infrastructure up and running, including our primary server, which hosts our website, wiki, forums, and some internal applications.

About three weeks ago, I started receiving monitoring notifications indicating an increased load on the MariaDB server. This in itself is nothing too unusual. It usually means nothing but a sudden influx of new visitors, and in most cases, it is just a link being shared somewhere or a single IP trying to annoy us.

The notifications popped up and disappeared as quickly as they appeared. I started to look into the log files of our web server, and I didn’t notice anything too unusual, maybe a bit more background noise. This went on for a couple of days without seriously impacting our server or accessibility–it was a tad slower than usual.

And then the website went down.

We use a stack consisting of Apache2, PHP-FPM, and MariaDB to host the web applications. The server logs revealed that everything was saturated. Apache2 refused to accept new connections, the PHP-FPM pools were completely filled, and MariaDB also had no connections left.

Now, it was time to find out what was going on. Hoping that it was just one single IP trying to annoy us, I opened the access log of the day and was greeted by this:

    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /index.php?days=30&from=20250417123108&hidemyself=1&limit=500&target=Lure_of_the_Temptress&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6366 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.2 (KHTML, like Gecko) Chrome/16.0.843.0 Safari/534.2"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /index.php?from=20250417205327&hidemyself=0&limit=100&target=California_Pacific_Computer_Company&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6363 "-" "Mozilla/5.0 (compatible; MSIE 6.0; Windows NT 4.0; Trident/3.1)"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /index.php?days=30&from=20250410022141&hidebots=0&hideliu=1&hideminor=1&target=The_Big_Red_Adventure&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6368 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_3; rv:1.9.4.20) Gecko/8520-08-18 14:24:31.076782 Firefox/3.8"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /index.php?days=1&from=20250424060651&fromFormatted=06%3A06%2C+24+April+2025&hideminor=1&limit=100&target=RAMA&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6368 "-" "Mozilla/5.0 (X11; Linux i686; rv:1.9.7.20) Gecko/4195-09-07 16:38:05.879333 Firefox/3.8"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /index.php?days=30&from=20250424183156&fromFormatted=18%3A31%2C+24+April+2025&hideminor=1&limit=250&target=AGOS%2FVersions&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6367 "-" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.0 (KHTML, like Gecko) Chrome/39.0.887.0 Safari/534.0"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /index.php?days=30&from=20250411043805&hidebots=0&target=OpenTasks%2FEngine%2FImprove_WME&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6367 "-" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; rv:1.9.3.20) Gecko/9958-03-18 16:15:48.117981 Firefox/14.0"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /index.php?days=30&from=20250411042538&hidebots=0&hidemyself=1&limit=250&target=Compiling_ScummVM%2FPlayStation_Portable&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6363 "-" "Opera/9.13.(X11; Linux i686; ce-RU) Presto/2.9.173 Version/11.00"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /api.php?action=feedrecentchanges&days=14&feedformat=atom&from=20250405110953&hidebots=1&hidemyself=1&limit=50&target=Summer_of_Code%2FGSoC2010&urlversion=1 HTTP/1.1" 200 6364 "-" "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/531.2 (KHTML, like Gecko) Chrome/24.0.862.0 Safari/531.2"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /index.php?days=30&from=20250421165249&fromFormatted=16%3A52%2C+21+April+2025&limit=100&target=Template%3AMain_Contact&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6366 "-" "Opera/9.61.(X11; Linux x86_64; st-ZA) Presto/2.9.160 Version/12.00"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /index.php?returnto=Special%3ARecentChangesLinked&returntoquery=from%3D20250418162237%26fromFormatted%3D16%253A22%252C%2B18%2BApril%2B2025%26hidemyself%3D1%26target%3DAGIWiki%252FAl_Pond_-_On_Holiday&title=Special%3AUserLogin HTTP/1.1" 200 6365 "-" "Mozilla/5.0 (compatible; MSIE 7.0; Windows 98; Win 9x 4.90; Trident/3.1)"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /index.php?days=30&from=20250417091241&hidebots=1&limit=250&target=Summer_of_Code%2FApplication%2F2007&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6366 "-" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_1 like Mac OS X; nr-ZA) AppleWebKit/535.26.3 (KHTML, like Gecko) Version/3.0.5 Mobile/8B114 Safari/6535.26.3"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /api.php?action=webapp-manifest HTTP/2.0" 200 2102 "https://wiki.scummvm.org/index.php?title=Hopkins_FBI" "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /index.php?days=30&from=20250417023112&hidebots=0&hideminor=1&hidemyself=1&limit=250&target=AGIWiki%2FSpecial_flags&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6367 "-" "Mozilla/5.0 (compatible; MSIE 7.0; Windows 98; Trident/3.1)"
    127.0.0.1 - - [24/Apr/2025:23:42:29 +0000] "GET /index.php?days=30&from=20250416060403&hideanons=1&limit=100&target=Summer_of_Code%2FApplication%2F2007&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6367 "-" "Mozilla/5.0 (Linux; Android 4.3) AppleWebKit/536.0 (KHTML, like Gecko) Chrome/51.0.880.0 Safari/536.0"
    127.0.0.1 - - [24/Apr/2025:23:42:30 +0000] "GET /index.php?days=1&hidebots=0&hideminor=1&hidemyself=0&limit=250&mobileaction=toggle_view_mobile&target=HOWTO-Tips_And_Tricks&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6366 "-" "Mozilla/5.0 (Android 4.4.3; Mobile; rv:58.0) Gecko/58.0 Firefox/58.0"
    127.0.0.1 - - [24/Apr/2025:23:42:30 +0000] "GET /index.php?days=30&from=20250415120719&limit=250&target=Time_Zone&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6366 "-" "Mozilla/5.0 (iPad; CPU iPad OS 1_1_5 like Mac OS X) AppleWebKit/532.1 (KHTML, like Gecko) FxiOS/12.3t5461.0 Mobile/69A052 Safari/532.1"
    127.0.0.1 - - [24/Apr/2025:23:42:30 +0000] "GET /index.php?title=SCI/Testing&direction=next&oldid=14195 HTTP/1.1" 200 6364 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5; rv:123.0esr) Gecko/20100101 Firefox/123.0esr"
    127.0.0.1 - - [24/Apr/2025:23:42:30 +0000] "GET /index.php?days=14&from=20250417034946&hideliu=1&hideminor=1&target=Nippon_Safes_Inc.&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6364 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1; rv:1.9.6.20) Gecko/9899-07-01 03:29:48.393829 Firefox/3.8"
    127.0.0.1 - - [24/Apr/2025:23:42:30 +0000] "GET /index.php?returnto=Special%3ARecentChangesLinked&returntoquery=days%3D30%26from%3D20250410005945%26hidebots%3D1%26hideminor%3D1%26hidemyself%3D1%26target%3DUser%253ASpookypeanut&title=Special%3AUserLogin HTTP/1.1" 200 6367 "-" "Mozilla/5.0 (Windows; U; Windows 95) AppleWebKit/533.2.2 (KHTML, like Gecko) Version/4.1 Safari/533.2.2"
    127.0.0.1 - - [24/Apr/2025:23:42:30 +0000] "GET /index.php?days=30&from=20250410094930&hidebots=1&hideminor=1&hidemyself=1&limit=100&target=Loom&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6364 "-" "Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/533.1 (KHTML, like Gecko) FxiOS/9.0k8480.0 Mobile/92A641 Safari/533.1"
    127.0.0.1 - - [24/Apr/2025:23:42:30 +0000] "GET /index.php?days=30&from=20250425184120&fromFormatted=18%3A41%2C+25+April+2025&hideminor=1&hidemyself=1&target=Indiana_Jones_and_the_Fate_of_Atlantis&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6365 "-" "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_1 like Mac OS X; pl-PL) AppleWebKit/535.5.2 (KHTML, like Gecko) Version/4.0.5 Mobile/8B116 Safari/6535.5.2"
    127.0.0.1 - - [24/Apr/2025:23:42:31 +0000] "GET /index.php?diff=39241&oldid=29636&mobileaction=toggle_view_desktop HTTP/2.0" 200 2104 "https://wiki.scummvm.org/index.php?diff=39241&oldid=29636&mobileaction=toggle_view_desktop" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.3"
    127.0.0.1 - - [24/Apr/2025:23:42:31 +0000] "GET /index.php?days=30&from=20250407050329&hideliu=1&hideminor=1&hidemyself=1&target=Summer_of_Code%2FGSoC_Ideas_2020&title=Special%3ARecentChangesLinked HTTP/1.1" 200 6367 "-" "Mozilla/5.0 (Android 2.2; Mobile; rv:51.0) Gecko/51.0 Firefox/51.0"
    

For privacy reasons, I replaced the real IPs with 127.0.0.1, but trust me, there were many IPs–around 35.000, to be precise–from residential networks all over the world. At this scale, it makes no sense to even consider blocking individual IPs, subnets, or entire networks. Due to the open nature of the project, geo-blocking isn’t an option either.

The main problem is time. The URLs accessed in the attack are the most expensive ones the wiki offers since they heavily depend on the database and are highly dynamic, requiring some processing time in PHP. This is the worst-case scenario since it throws the server into a death spiral.

First, the database starts to lag or even refuse new connections. This, combined with the steadily increasing server load, leads to slower PHP execution. Eventually, all resources in the PHP-FPM pools are used up, and since Apache2 doesn’t get a reply from PHP-FPM in time, it waits until it runs out of free connections. At this point, the website dies. Restarting the stack immediately solves the problem for a couple of minutes at best until the server starves again.

To bring the website back up, I cranked up the configuration of our stack to insane values, risking that the server would eventually run out of memory.

I needed a proper solution, something that takes the load away from the web application stack.

## Hi, Anubis!

[Anubis](https://anubis.techaro.lol/) is a program that checks incoming connections, processes them, and only forwards “good” connections to the web application. To do so, Anubis sits between the server or proxy responsible for accepting HTTP/HTTPS and the server that provides the application.

Designed to protect websites from AI scraper bots, Anubis primarily focuses on parameters like the user agent sent with the request and looks for oddities in the connection. “Known good” and harmless clients are always accepted, and “Known bad” clients are always denied. In case the defaults are not working for your application, Anubis allows extensive configuration with customizable [bot policy definitions](https://anubis.techaro.lol/docs/admin/policies) .

And then, there’s the in-between, the part where the real magic happens. Many bots disguise themselves as standard browsers to circumvent filtering based on the user agent. So, if something claims to be a browser, it should behave like one, right? To verify this, Anubis presents a [proof-of-work challenge](https://anubis.techaro.lol/docs/design/why-proof-of-work/) that the browser needs to solve. If the challenge passes, it forwards the incoming request to the web application protected by Anubis; otherwise, the request is denied.

_Solving_ the challenge–which is valid for one week once passed–takes a couple of seconds on the client side, occupying CPU time. _Checking_ if the browser solved the very fast on the server side, taking up virtually no resources.

![Anubis presenting the proof-of-work challenge](https://fabulous.systems/posts/2025/05/anubis-saved-our-websites-from-a-ddos-attack/anubis_in_action.webp)

Anubis presenting the proof-of-work challenge

As a regular user, all you’ll notice is a loading screen when accessing the website. As an attacker with stupid bots, you’ll never get through. As an attacker with clever bots, you’ll end up exhausting your own resources. As an AI company trying to scrape the website, you’ll quickly notice that CPU time can be expensive if used on a large scale.

Long story short, deploying Anubis immediately solved our issues. In fact, you can see the exact time in our monitoring.

![Monitoring showing the drop in MariaDB usage after deploying Anubis](https://fabulous.systems/posts/2025/05/anubis-saved-our-websites-from-a-ddos-attack/database_load.webp)

Monitoring showing the drop in MariaDB usage after deploying Anubis

I didn’t get a single notification afterward. The server load has never been lower. The attack itself is still ongoing at the time of writing this article. To me, Anubis is not only a blocker for AI scrapers. Anubis is a DDoS protection.

* * *

_Credits: Anubis is created by [Techaro](https://techaro.lol/) . The Anubis mascot is created by [CELPHASE](https://bsky.app/profile/celphase.bsky.social)_

_Do you have any comments or suggestions regarding this article? Please drop an e-mail to [feedback@fabulous.systems!](mailto:feedback@fabulous.systems?subject=Feedback:%20'The%20Day%20Anubis%20Saved%20Our%20Websites%20From%20a%20DDoS%20Attack')_