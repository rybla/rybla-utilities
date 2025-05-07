# A Full-Network ATProto Relay for $34 a Month

This is an update to a [Summer 2024 blog post](https://whtwnd.com/bnewbold.net/3kwzl7tye6u2y). At the time, atproto relays required a cache of the full network on local disk to validate data structures. With the [Sync v1.1](https://github.com/bluesky-social/proposals/tree/main/0006-sync-iteration) updates, relays don't need all that disk I/O. What impact does that have on hosting setup and operating costs?

Turns out the dev community beat me to the punch and folks like [@futur.blue](https://whtwnd.com/futur.blue/3lkubavdilf2m) and [@bad-example](https://bsky.app/profile/bad-example.com/post/3lnykcasepc2c) have been doing this for months on Rapsberry Pis and $19/month VPS servers in European jurisdiction.

But i'm still really psyched at how much simpler things have become, so I set up my own $34/month VPS demo instance, and this is the write-up.

The relay describe here is running at: [https://relay-vps.demo.bsky.dev](https://relay-vps.demo.bsky.dev/)

## Let's Go Shopping

What kind of a server do we need? As of April 2025, the atproto network firehose throughput hits a peak of around 600 events/second on a random day. In the past we have seen sustained rates of 2000 events/sec, and it is nice to have some headroom.

On our (large) production servers, the relay has been running steady-state with a couple CPU cores utilized, and up to 12 GByte or so of RAM. Memory usage starts low and creeps up; it is mostly consumed by identity caching, which can be configured down.

We see about 30 Mbps of sustained bandwidth for a firehose WebSocket. On the ingest side, that is the sum of all the PDS connections; on the output side, it is a single unified socket (one per consumer). Some overhead is good, both for traffic and recovering from downtime, so i'd recommend looking for a server with 200 Mbps unmetered.

Disk used to be the main consideration, but now it isn't. The "backfill window" or "replay window" uses the most storage, but can be configured to reduce size (eg, 1hr or 12hr instead of the 72hr default). Disk utilizaiton doesn't grow unbounded, it just scales as a function of network traffic in the past few hours or days. It is still nice to have a fast disk, but a few hundred GByte are enough today.

I checked prices on a couple popular providers, and found a good deal on a VPS instance in the USA. It costs $30/month with no setup fee; with tax that came out to about $34/month. It has 8 vCPU, 16 GB RAM, 160 GB of disk, and an unmetered 1 Gbps network connection. This isn't even a bare-bones provider, and there are comparable options available in many regions and jurisdictions. This instance should have enough resources to get through spikes of traffic, or a couple doublings of network growth, before it really starts to run hot.

## Provisioning and Setup

I did a basic install with Ubuntu 24.04, got my SSH keys and `sudo` set up, and configured DNS.

Some of the commands I ran:

    apt update
    apt upgrade
    apt install ripgrep fd-find dstat htop iotop iftop pg-activity httpie caddy golang postgresql yarnpkg build-essential
    
    # set up yarn command; could also have used nvm
    ln -s /usr/bin/yarnpkg /usr/bin/yarn
    
    # set the hostname
    hostnamectl hostname relay-example.demo.bsky.dev
    
    # punch holes in default firewall for HTTP/S
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # create data directories
    mkdir -p /data/relay
    mkdir -p /data/relay/persist
    chown ubuntu:ubuntu /data/relay/
    chown ubuntu:ubuntu /data/relay/persist
    

You can create random passwords with OpenSSL: `openssl rand -base64 24`

Next I set up PostgreSQL (ran these commands after connecting with `sudo -u postgres psql`).

    CREATE USER relay WITH PASSWORD 'CHANGEME';
    
    CREATE DATABASE relay;
    GRANT ALL PRIVILEGES ON DATABASE relay TO relay;
    
    # these are needed for newer versions of postgres
    \c relay postgres
    GRANT ALL ON SCHEMA public TO relay;
    

I didn't bother with any other PostgreSQL or system tuning, just left it all default.

Caddy is great as a simple reverse proxy. It does auto-TLS certificates and handles WebSockets by default. You can probably get this going with certbot and haproxy or nginx as well.

Create a system-wide Caddy config at `/etc/caddy/Caddyfile`, replacing any existing file. Substitute in your hostname:

    relay-example.demo.bsky.dev {
      reverse_proxy 127.0.0.1:2470
    }
    

Then, cloned and built the project in the home directory of the `ubuntu` user:

    # pull source code and build. if you had patches or a working branch, would modify here
    git clone https://github.com/bluesky-social/indigo
    cd indigo
    make build-relay-admin-ui build
    

A nifty thing with modern Go is that it will auto-download newer toolchains if needed, so you shouldn't need to bother with installing a specific version.

For a demo, i'm just going to run this thing directly in a `screen` session, though you could also poke around in the git repo and find a Dockerfile.

## Configuration and Bootstrap

You can see what configuration variables are available with `./relay -h` and `./relay serve -h`. I recommend creating a `.env` file to store the config.

Here is what I put in the `.env` (obviously changing the passwords as needed):

    RELAY_ADMIN_PASSWORD=CHANGEME
    DATABASE_URL=postgres://relay:CHANGEME@localhost:5432/relay
    RELAY_PERSIST_DIR=/data/relay/persist
    RELAY_TRUSTED_DOMAINS=*.host.bsky.network
    ENVIRONMENT=demo
    
    # configure a short 2 hour backfill/replay window
    RELAY_REPLAY_WINDOW=2h
    
    # keep this 'true' during Sync v1.1 protocol transition, then remove (eg, late summer 2025)
    RELAY_LENIENT_SYNC_VALIDATION=true
    
    # this line is for 'goat'
    ATP_RELAY_HOST=http://localhost:2470
    

Indigo comes with the `goat` command-line tool, which is helpful for administering and poking around. It can share the `.env` file as long as you run it from the same directory as the relay.

At this point, things should be ready to run! You can give it a try with either of:

    # from built executable
    ./relay serve
    
    # re-build on every run
    go run ./cmd/relay serve
    

Out of the box, the relay doesn't know about any hosts though! You'll probably want to bootstrap it from an existing relay. Shut down the relay (if it was running), and pull in a set of hosts (this could take a few minutes):

    ./relay pull-hosts --relay-host https://relay1.us-west.bsky.network
    

With a full host set, it might take a few minutes for the relay to ramp after every restart. The main cause of this right now is identity lookups: fetching DID documents from the network. It should be possible soon to set up a local redis instances to make restarts smoother, but it isn't really needed for a demo like this.

That's it! The relay will start consuming from the current cursor offsets of all the hosts (PDS instances), it doesn't do any backfill. The output firehose should be ready to use pretty quickly.

## Exploring and Administering

The relay comes with a web UI which you can reach at `https://<hostname>/dash` (you'll need to put in the admin password).

You can also use the `goat relay admin` commands to do account and host takedowns, ban entire domain suffixes, tweak limits and quotas, etc.

Here are some example commands for poking around:

    goat relay host diff https://relay1.us-west.bsky.network https://relay-example.demo.bsky.dev
    
    goat firehose
    
    goat relay host add pds.example.com
    
    goat relay admin host list
    
    goat firehose | pv -l -i10 > /dev/null
    
    goat firehose --verify-basic --verify-sig --verify-mst -q
    

The relay exports Prometheus metrics on a separate port:

    http get :2471/metrics
    

## Resource Use

My demo relay isn't using much CPU:

    # uptime
    
    03:10:30 up 8 days, 21:39,  2 users,  load average: 1.17, 1.11, 1.07
    

    # dstat
    
    ----total-usage---- -dsk/total- -net/total- ---paging-- ---system--
    usr sys idl wai stl| read  writ| recv  send|  in   out | int   csw 
      5   2  92   0   0|   0  3510k|1323k   53k|   0     0 |8480    13k
      5   1  91   1   0|   0  3989k|1723k   66k|   0     0 |9132    14k
      6   2  90   0   0|   0  3048k|1958k   53k|   0     0 |  10k   16k
     15   3  79   1   0|   0  8927k|4516k   92k|   0     0 |  17k   26k
      7   2  89   1   0|   0  4392k|1973k   57k|   0     0 |  11k   18k
      8   2  88   1   0|   0  5193k|2376k   65k|   0     0 |  13k   21k
      7   1  89   1   0|   0  4199k|2113k   60k|   0     0 |  12k   19k
      6   2  89   1   0|   0  4688k|1943k   61k|   0     0 |  12k   19k
      7   2  90   1   0|   0  3968k|1932k   55k|   0     0 |  11k   17k
      6   2  89   1   0|   0  4702k|2047k   61k|   0     0 |  11k   18k
      7   2  88   1   0|   0  4552k|1987k   93k|   0     0 |  13k   20k
    

    # pg_activity
    
    PostgreSQL 16.8 - relay-vps.demo.bsky.dev - postgres@/var/run/postgresql:5432/postgres - Ref.: 2s -
     * Global: 7 days, 19 hours and 19 minutes uptime, 1.73G dbs size - 0B/s growth, 95.18% cache hit ratio
       Sessions: 41/100 total, 1 active, 40 idle, 0 idle in txn, 0 idle in txn abrt, 0 waiting
       Activity: 766 tps, 0 insert/s, 536 update/s, 0 delete/s, 1316 tuples returned/s, 0 temp files, 0B tem
     * Worker processes: 0/8 total, 0/4 logical workers, 0/8 parallel workers
       Other processes & info: 0/3 autovacuum workers, 0/10 wal senders, 0 wal receivers, 0/10 repl. slots
     * Mem.: 15.25G total, 323.92M (2.07%) free, 2.06G (13.48%) used, 12.88G (84.44%) buff+cached
       Swap: 0B total, 0B (-) free, 0B (-) used
       IO: 0/s max iops, 0B/s - 0/s read, 0B/s - 0/s write
       Load average: 1.31 1.12 1.08
    

    # sudo du -sh /data/relay /var/log /var/lib/postgresql/
    
    21G     /data/relay
    114M    /var/log
    2.4G    /var/lib/postgresql/
    

    # df -h /
    
    Filesystem      Size  Used Avail Use% Mounted on
    /dev/sda1       154G   30G  125G  19% /