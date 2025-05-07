# Show HN: Blast – Fast, multi-threaded serving engine for web browsing AI agents

[![BLAST Logo](https://github.com/stanford-mast/blast/raw/main/docs/assets/blast_icon_only.png)](https://github.com/stanford-mast/blast/blob/main/docs/assets/blast_icon_only.png)

A high-performance serving engine for web browsing AI.

[![Website](https://camo.githubusercontent.com/62e55a66e270965020133cb93f20dc3c0ba41c889394894c2a4840439fcf3949/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f626c61737470726f6a6563742e6f72672d464645303637)](https://blastproject.org/) [![Documentation](https://camo.githubusercontent.com/8c85d1b4b8a0379abb1e0d9e751f5c80d69157b38c2aba91656fe966e20c4e62/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446f63732d464645303637)](https://docs.blastproject.org/) [![Discord](https://camo.githubusercontent.com/bd0f2777dbc0481864d2e583fcb52d1bebbf33b67029349b5f30e443a70d5372/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f446973636f72642d464645303637)](https://discord.gg/AUMAYTAS) [![Twitter Follow](https://camo.githubusercontent.com/cc1ef085a3b52a471c862ed6ae38f2b2a628007bfbaeed428e323cba1255e4b8/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f7265616c63616c656277696e3f7374796c653d736f6369616c)](https://x.com/realcalebwin)

[![BLAST UI Demo](https://github.com/stanford-mast/blast/raw/main/website/assets/blast_ui_gif.gif)](https://github.com/stanford-mast/blast/blob/main/website/assets/blast_ui_gif.gif)

## ❓ Use Cases

[](#-use-cases)

1.  **I want to add web browsing AI to my app...** BLAST serves web browsing AI with an OpenAI-compatible API and concurrency and streaming baked in.
2.  **I need to automate workflows...** BLAST will automatically cache and parallelize to keep costs down and enable interactive-level latencies.
3.  **Just want to use this locally...** BLAST makes sure you stay under budget and not hog your computer's memory.

## 🚀 Quick Start

[](#-quick-start)

pip install blastai && blastai serve

from openai import OpenAI

client \= OpenAI(
    api\_key\="not-needed",
    base\_url\="http://127.0.0.1:8000"
)

\# Stream real-time browser actions
stream \= client.responses.create(
    model\="not-needed",
    input\="Compare fried chicken reviews for top 10 fast food restaurants",
    stream\=True
)

for event in stream:
    if event.type \== "response.output\_text.delta":
        print(event.delta if " " in event.delta else "<screenshot>", end\="", flush\=True)

## ✨ Features

[](#-features)

*   🔄 **OpenAI-Compatible API** Drop-in replacement for OpenAI's API
*   🚄 **High Performance** Automatic parallelism and prefix caching
*   📡 **Streaming** Stream browser-augmented LLM output to users
*   📊 **Concurrency** Out-of-the-box support many users with efficient resource management

## 📚 Documentation

[](#-documentation)

Visit [documentation](https://docs.blastproject.org/) to learn more.

## 🤝 Contributing

[](#-contributing)

Awesome! See our [Contributing Guide](https://docs.blastproject.org/development/contributing) for details.

## 📄 MIT License

[](#-mit-license)

As it should be!