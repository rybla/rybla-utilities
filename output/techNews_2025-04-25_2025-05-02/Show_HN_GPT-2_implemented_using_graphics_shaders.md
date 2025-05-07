# Show HN: GPT-2 implemented using graphics shaders

## GPT-2 WebGL Inference Demo

[](#gpt-2-webgl-inference-demo)

A browser-based, WebGL2 implementation of GPT-2.

[![Demo](https://github.com/nathan-barry/gpt2-webgl/raw/main/assets/demo.gif)](https://github.com/nathan-barry/gpt2-webgl/blob/main/assets/demo.gif)

## 🚀 Features

[](#-features)

*   Full GPT-2 small (117M) forward pass in the GPU via WebGL2 shaders
*   BPE tokenization using `js-tiktoken` in the browser (no WASM fetch)
*   Simple Python script to download the pretrained weights

* * *

## 📋 Prerequisites

[](#-prerequisites)

*   **Node.js** ≥ 16.x and **npm**
*   **Python** ≥ 3.8
*   A modern browser with WebGL2 support (Chrome, Firefox, Safari, Edge)

* * *

## 🐍 Download the GPT-2 Weights

[](#-download-the-gpt-2-weights)

We rely on HuggingFace’s `transformers` to pull down the official GPT-2 weights and emit raw `Float32Array` blobs:

1.  Install Python dependencies:
    
    pip install torch numpy transformers
    
2.  Run the downloader:
    
    python download\_weights.py
    
    This will fetch:
    *   `wte.bin` (token embeddings)
    *   `wpe.bin` (positional embeddings)
    *   `c_attn_q_w_0.bin` … `c_attn_q_w_11.bin`
    *   `c_attn_k_w_0.bin` … etc.
    *   `lm_head_w.bin`, `lm_head_b.bin`
    *   And a generated `manifest.json` mapping names → URLs

* * *

## ⚙️ Front-end Setup with Vite

[](#️--front-end-setup-with-vite)

We use Vite to bundle TS, serve ESM modules & handle `js-tiktoken`:

1.  Install JS dependencies:
    
    npm install
    
2.  Start the local dev server:
    
    npm run dev
    
3.  Open your browser at
    
        http://localhost:5173
        
    

Any changes under `src/` will trigger HMR and live-reload.

* * *

## 📄 License

[](#-license)

MIT