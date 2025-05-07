# How to Install Microsoft Phi-4 Reasoning Locally?

[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F899k4h5pi7u25qtk2pw6.jpg)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F899k4h5pi7u25qtk2pw6.jpg)

Phi-4-Reasoning is Microsoft’s specialized model crafted to tackle advanced reasoning tasks with precision. Built on the solid foundation of Phi-4, this version has been carefully fine-tuned using high-quality datasets focusing on math, science, and coding challenges. What makes it stand out is its ability to walk through problems step-by-step, offering thoughtful explanations before arriving at final answers. With a focus on logical reasoning, chain-of-thought workflows, and advanced problem-solving, it performs impressively even against much larger models — all while running on a relatively efficient 14B parameter architecture.

Ideal for scenarios where smart reasoning and accuracy matter the most, Phi-4-Reasoning shines in math olympiad problems, scientific queries, and complex coding tasks, while keeping the output clear, safe, and grounded.

### [](#model-resource)Model Resource

Hugging Face

**Link:** [https://huggingface.co/microsoft/Phi-4-reasoning](https://huggingface.co/microsoft/Phi-4-reasoning)

[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fa132dkjad3946lprukoa.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fa132dkjad3946lprukoa.png)

### [](#stepbystep-process-to-install-microsoft-phi4-reasoning-locally)Step-by-Step Process to Install Microsoft Phi-4 Reasoning Locally

For the purpose of this tutorial, we will use a GPU-powered Virtual Machine offered by NodeShift; however, you can replicate the same steps with any other cloud provider of your choice. NodeShift provides the most affordable Virtual Machines at a scale that meets GDPR, SOC2, and ISO27001 requirements.

### [](#step-1-sign-up-and-set-up-a-nodeshift-cloud-account)Step 1: Sign Up and Set Up a NodeShift Cloud Account

Visit the NodeShift Platform and create an account. Once you’ve signed up, log into your account.

Follow the account setup process and provide the necessary details and information.  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fn1ed3iopg2lpc4palh3z.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fn1ed3iopg2lpc4palh3z.png)

### [](#step-2-create-a-gpu-node-virtual-machine)Step 2: Create a GPU Node (Virtual Machine)

GPU Nodes are NodeShift’s GPU Virtual Machines, on-demand resources equipped with diverse GPUs ranging from H100s to A100s. These GPU-powered VMs provide enhanced environmental control, allowing configuration adjustments for GPUs, CPUs, RAM, and Storage based on specific requirements.  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fhs831iskhyhyarp5p30h.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fhs831iskhyhyarp5p30h.png)

[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F418jaiei2sbc5sblhnuh.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F418jaiei2sbc5sblhnuh.png)  
Navigate to the menu on the left side. Select the GPU Nodes option, create a GPU Node in the Dashboard, click the Create GPU Node button, and create your first Virtual Machine deploy

### [](#step-3-select-a-model-region-and-storage)Step 3: Select a Model, Region, and Storage

In the “GPU Nodes” tab, select a GPU Model and Storage according to your needs and the geographical region where you want to launch your model.  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fwt8pd9bfmmovc3e77g2y.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fwt8pd9bfmmovc3e77g2y.png)

[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ffolbuqv96o5eqz3th79w.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ffolbuqv96o5eqz3th79w.png)

We will use 1 x RTXA6000 GPU for this tutorial to achieve the fastest performance. However, you can choose a more affordable GPU with less VRAM if that better suits your requirements.

### [](#step-4-select-authentication-method)Step 4: Select Authentication Method

There are two authentication methods available: Password and SSH Key. SSH keys are a more secure option. To create them, please refer to our official documentation.  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fieexry7f3yfk1okra003.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fieexry7f3yfk1okra003.png)

### [](#step-5-choose-an-image)Step 5: Choose an Image

Next, you will need to choose an image for your Virtual Machine. We will deploy Microsoft Phi-4 Reasoning on a Jupyter Virtual Machine. This open-source platform will allow you to install and run the Microsoft Phi-4 Reasoning on your GPU node. By running this Model on a Jupyter Notebook, we avoid using the terminal, simplifying the process and reducing the setup time. This allows you to configure the model in just a few steps and minutes.

Note: NodeShift provides multiple image template options, such as TensorFlow, PyTorch, NVIDIA CUDA, Deepo, Whisper ASR Webservice, and Jupyter Notebook. With these options, you don’t need to install additional libraries or packages to run Jupyter Notebook. You can start Jupyter Notebook in just a few simple clicks.  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fc39nwvmm2ledap4002b6.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fc39nwvmm2ledap4002b6.png)

After choosing the image, click the ‘Create’ button, and your Virtual Machine will be deployed.  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Foy4hrbp7m0rxkvwiyc3u.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Foy4hrbp7m0rxkvwiyc3u.png)

### [](#step-6-virtual-machine-successfully-deployed)Step 6: Virtual Machine Successfully Deployed

You will get visual confirmation that your node is up and running.  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ftonznl7zltvfujcys8qz.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ftonznl7zltvfujcys8qz.png)

### [](#step-7-connect-to-jupyter-notebook)Step 7: Connect to Jupyter Notebook

Once your GPU VM deployment is successfully created and has reached the ‘RUNNING’ status, you can navigate to the page of your GPU Deployment Instance. Then, click the ‘Connect’ Button in the top right corner.  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fu41f31h2f9ipp9c3d7r2.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fu41f31h2f9ipp9c3d7r2.png)

After clicking the ‘Connect’ button, you can view the Jupyter Notebook.  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F06vr72lsr8ggad82ibxb.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F06vr72lsr8ggad82ibxb.png)

Now open Python 3(pykernel) Notebook.  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fe7nmnqmpechdxmcvswsu.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fe7nmnqmpechdxmcvswsu.png)

### [](#step-8-check-gpu-amp-cuda-availability)Step 8: Check GPU & CUDA Availability

Run the following commands to check GPU & CUDA availability:  
`!nvidia-smi   !nvcc --version   `  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fjchpyiifw8w0b9d004qw.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fjchpyiifw8w0b9d004qw.png)

[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fg0fppheuv0x8bmnhwvs9.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fg0fppheuv0x8bmnhwvs9.png)

### [](#step-9-install-required-libraries)Step 9: Install Required Libraries

Run the following command to install required libraries:  
`pip install transformers accelerate torch   `  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fweygkth3k8c349p5l9n1.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fweygkth3k8c349p5l9n1.png)

### [](#step-10-load-the-model)Step 10: Load the Model

Run the following code to load the model:  
\`from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from\_pretrained("microsoft/Phi-4-reasoning")  
model = AutoModelForCausalLM.from\_pretrained("microsoft/Phi-4-reasoning", device\_map="auto", torch\_dtype="auto")  
\`  
[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fa4p2c4mhwt87c32tg0m0.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fa4p2c4mhwt87c32tg0m0.png)

### [](#step-11-run-inference)Step 11: Run Inference

[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F6i6pr503r06wz2z9rwd5.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F6i6pr503r06wz2z9rwd5.png)

[![Image description](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F6p8vv479uiqjctr9vjvc.png)](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F6p8vv479uiqjctr9vjvc.png)

### [](#conclusion)Conclusion

Running Microsoft’s Phi-4-Reasoning locally has never been easier. With just a few simple steps, you can deploy this powerful reasoning model right inside a Jupyter Notebook and begin exploring its advanced capabilities in math, science, coding, and more. Thanks to NodeShift’s GPU-powered virtual machines, the entire process is smooth, scalable, and accessible — whether you’re experimenting for research, solving complex problems, or building smart features into your own projects.

With its thoughtful chain-of-thought approach and strong performance across reasoning benchmarks, Phi-4-Reasoning strikes a great balance between efficiency and intelligence. Once set up, you’re free to dive into deep problem solving — all from your browser, without the hassle.