# Show HN: OSle – A 510 bytes OS in x86 assembly

[![logo](https://github.com/shikaan/osle/raw/main/docs/logo.svg)](https://github.com/shikaan/osle/blob/main/docs/logo.svg)

A tiny and mighty boot sector OS.

osle-demo.mov

#### [🚀 Try it out in the browser! 🚀](https://shikaan.github.io/osle/)

[](#---try-it-out-in-the-browser-)

👀 Overview
-----------

[](#-overview)

OSle is a [real-mode](https://wiki.osdev.org/Real_Mode) OS that fits in a boot sector.

It's written in x86 assembly and, despite its tiny size (only 510 bytes), it packs essential features like:

*   **Shell**: Run commands and builtins.
*   **File System**: Read, write, and find files on the system.
*   **Process Management**: Cooperatively spawn child processes.
*   **Userland Software**: Comes with [pre-built software](https://github.com/shikaan/osle/blob/main/bin) and an [SDK](https://github.com/shikaan/osle/blob/main/sdk) to write your own.

[Check out the online demo](https://shikaan.github.io/osle) to see it in action!

📚 Creating your first OSle program
-----------------------------------

[](#-creating-your-first-osle-program)

OSle includes a tiny [Software Development Kit (SDK)](https://github.com/shikaan/osle/blob/main/sdk) that includes definitions and a toolchain to create your own OSle programs.

Follow the [step-by-step tutorial](https://github.com/shikaan/osle/blob/main/tutorial) to write your first program!

🛠️ Development
---------------

[](#️-development)

To develop OSle and OSle programs you will need the following tools:

*   [nasm](https://www.nasm.us/)
*   [GNU make](https://www.gnu.org/software/make/) (usually preinstalled)
*   [bochs](https://bochs.sourceforge.io/) (optional)

Installation instructions

#### macOS

[](#macos)

Install dependencies using Homebrew:

brew install nasm
brew install bochs

#### Linux

[](#linux)

Install dependencies using your local package manager, e.g., on Debian:

apt install nasm bochs

### Build and Run OSle locally

[](#build-and-run-osle-locally)

These recipes will compile OSle and use the [SDK](https://github.com/shikaan/osle/blob/main/sdk) to compile and bundle all the pre-built programs. Using `start` will also run bochs right away.

# build and run osle on bochs
make start

# or

# build osle
make osle
# use QEMU to run it
qemu-system-i386 -fda osle.img

### Build and Run your OSle program

[](#build-and-run-your-osle-program)

# ensure you have a working OSle image at osle.img
make osle

# compile your source to generate my\_file.bin
sdk/build my\_file.s

# bundle my\_file.bin into the osle.img image
sdk/pack my\_file.bin

# run it!
qemu-system-i386 -fda osle.img

### Use OSle on a Real Device

[](#use-osle-on-a-real-device)

Write the built image to a device using `dd`:

Warning

The following action can damage your hardware. We take no responsibility for any damage OSle might cause.

# generate an OSle image at osle.img
make osle

# write it on a device
sudo dd if=osle.img of=/dev/YOUR\_DEVICE bs=512 count=1

🤝 Contributing
---------------

[](#-contributing)

Feel free to explore the [issues](https://github.com/shikaan/osle/issues) and [pull requests](https://github.com/shikaan/osle/pulls) to contribute or request features.

License
-------

[](#license)

[MIT](https://github.com/shikaan/osle/blob/main/LICENSE)