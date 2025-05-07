# Building Burstables: CPU slicing with cgroups

New

EuroGPT Enterprise is open source, runs in Europe, and keeps your data private. [Try it now](https://www.ubicloud.com/use-cases/eurogpt-enterprise)

[![](https://cdn.prod.website-files.com/64f9d9b4e737e7b37d4e39a4/64fe48116c52fe1a51e17279_ubicolud%20logo.png)](https://www.ubicloud.com/)

All Blog Posts

April 29, 2025 · 6 min read

![Burak Yucesoy](https://cdn.prod.website-files.com/64f9d9b4e737e7b37d4e39a4/67d0232ed41bec76b48e3edb_20240411-Maciek-small-min.jpg)

Maciek Sarnowicz

Contributor

_Ubicloud is an open source alternative to AWS. You can self-host our software or use our managed service to reduce your cloud costs by 3x._ 

_‍_

Some of our customers told us that the price of dedicated VMs was too steep and asked for a lower entry point. We looked into it and came up with [burstable VMs](https://www.ubicloud.com/blog/ubicloud-burstable-vms). These VMs run on a fraction of a shared CPU and burst to a higher level of CPU usage to support occasional spikes in usage.

To implement burstable VMs, we leveraged Linux [Control Groups v2](https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html) (cgroups v2), a Linux kernel feature that helps manage resource usage. We thought our open-source implementation of burstable VMs might be interesting enough to write about. We also learned a lot about Linux cgroups in the process!

### The building blocks

Linux cgroups are organized hierarchically. Each group acts as a “container” that can host child groups, processes, and threads. These groups control specific system usage, such as cpu, io, memory, hugetlb, pids, and rdma. You can also configure cpusets to control the cpu and memory placement of Linux processes.

At each group level, you can enable specific _controllers_ to set resource limits. These resource limits apply to the group’s children (other groups and processes) and also make that controller available to the children’s groups.

For example, if we enable the memory controller for a group called "webservices", we can set a memory limit of 4GB for this group. Then, any processes within this group will share this 4GB allocation. We could further create child groups like "webservices/frontend" with 1.5GB and "webservices/backend" with 2.5GB, distributing the parent's resources among children.

You can use cgroups either through the virtual filesystem or through Linux’s system manager (systemd). However, not all of cgroup’s functionality is exposed through systemd. In particular, the CPU burst settings are not.

#### Cgroups through a virtual filesystem

You can inspect the Control Group hierarchy and configuration through a virtual filesystem mounted at /sys/fs/cgroup. Key files include:

*   cgroup.controllers: Lists all available controllers
*   cgroup.subtree\_control: Defines controllers selected for this cgroup and its descendants
*   cpuset.\*: Configuration files for the cpuset controller
*   cpu.\*: Configuration files for the CPU controller

Most of these files are writable, allowing you to modify configuration settings as needed.

#### Cgroups through systemd

In the systemd world, control groups manifest as _slices_ - logical units for managing system resources. By default, systemd already organizes processes into predefined slices like system.slice and user.slice, creating a natural hierarchy.

We can extend this organization by creating our own custom slice for resource management. For instance, imagine we want to isolate and control resources for a CPU-intensive workload:

Our slice definition is remarkably simple:

    # /etc/systemd/system/example.slice
    [Slice]

The service that will live within our slice:

    # /etc/systemd/system/stress.service
    [Service] 
    Slice=example.slice 
    ExecStart=stress-ng --cpu 1 --cpu-load 50 --cpu-load-slice 100

After starting this service, systemd automatically incorporates our new slice into the hierarchy:

     CGroup: /
               ├─example.slice
               │ └─stress.service
               │   ├─1886 stress-ng --cpu 1 --cpu-load 50 --cpu-load-slice 100
               │   └─1887 "stress-ng-cpu [run]"
               ├─system.slice
               │ ├─cron.service
               │ │ └─637 /usr/sbin/cron -f -P
    	    ...
               └─user.slice
                 └─user-1000.slice
                   ├─session-1.scope
                   │ ├─724 "sshd: ubi [priv]"
    		  ...

What makes this approach powerful is how it provides fine-grained control over resource allocation. Each slice becomes a container for managing multiple related processes as a cohesive unit. This organization isn't just visual - it provides a framework for applying resource controls. Our custom example.slice has now become a management point where we can apply specific resource constraints using the various cgroup controllers.

### The ins and outs of the controllers

We utilize two controllers to manage the CPU limits and enable VM instances to burst beyond their allocated limit: cpuset and cpu.

‍**The cpuset controller** enables setting a range of CPUs the group can use. Additionally, setting the partition type to **root** creates an isolated cpu set dedicated to the group and other subgroups and processes. This allows us to create a resource “box” to host a single dedicated VM or a set of burstable VMs sharing the CPUs and to keep those VMs from running workloads on CPUs belonging to other groups. 

‍**The cpu controller** allows setting the maximum CPU limit (**cpu.max**), which controls the amount of the host’s CPU allocated to individual VMs. When we put multiple VMs inside one group, we can restrict their CPU allocation at each VM level to control the amount of CPU sharing in the group. 

Furthermore, we can set the **cpu.max.burst** limit for each VM to allow it to occasionally exceed the regular CPU limit. The burstability controls were first implemented in the Linux kernel by Alibaba engineer Huaixin Chang _(_[_source_](https://www.alibabacloud.com/blog/kill-the-annoying-cpu-throttling-and-make-containers-run-faster_598738?spm=a2c65.11461447.0.0.68fc73ebAgbWYb)_)_ and further evolved with the cgroups v2 implementation. The kernel controls the amount of bursting and awards the CPU “credits” accumulated over time by a process up to a specific limit. For example, if the process’s maximum CPU limit is set to 100%, the burst limit is set at an additional 100%, and the process has been running at an average of 70%, it accumulates a 30% CPU credit that allows it to burst up to 130%. This is all, of course, also constrained by time. The credits are accumulated and dispensed at CPU scheduling intervals, which are sub-second.

With our example.slice in place, we can now leverage the cgroup filesystem interface to apply resource constraints. Let's check the current CPU allocation:

    $ cat /sys/fs/cgroup/example.slice/cpu.max
    max 100000

The output indicates our slice currently has unlimited CPU access (shown by "max") within the standard quota period of 100,000 microseconds. We can easily throttle the CPU usage by modifying this file:

    $ echo "25000 100000" | sudo tee /sys/fs/cgroup/example.slice/cpu.max

With this change, we've allocated only 25% of CPU resources to everything in our example.slice - including our stress-testing service. The running stress-ng process is immediately affected, now limited to using at most a quarter of the available CPU resources.To see the effect of our changes, we can examine the CPU statistics:

    $ cat /sys/fs/cgroup/example.slice/cpu.stat

This reveals real-time metrics on CPU usage, throttling events, and burst utilization - showing exactly how our constraints are being enforced on the workload.

### Putting it all together

Combining all of the above, here is how we now control virtual machines on a host:

![afr calculation](https://cdn.prod.website-files.com/64f9d9b4e737e7b37d4e39a4/680f6228905a82a9c4944c16_VM%20host-min%20(1).jpg)

We create slice units and assign a set of dedicated host CPUs to each of them.  

The Standard VMs run each in their own cgroup (slice), with an isolated set of host CPUs assigned. We create those on-demand with each VM, and their lifespan is tied together. 

The Burstable VMs are placed in a cgroup where instances share a set of host CPUs. We place the new instances in an existing slice unit or create a new slice if needed. Each VM is provided with a minimum CPU allocation at 50% of the vCPU limit and can burst into the shared space at up to 100% of the vCPU limit. Because the CPU is shared, the ability to burst is not guaranteed. At the same time, the burstable instances are confined within their own group and cannot interfere with Standard VMs running on the same host. 

We can inspect the configuration of each cgroup (slice) by inspecting the content of virtual files stored at each cgroup’s unit level under /system/fs/cgroup/<cgroup-name>. Here is an example from our implementation:

    cgroup.controllers: cpuset cpu memory pids
    cgroup.subtree_control: cpu memory pids
    cpuset.cpus: 4-5
    cpuset.cpus.effective: 4-5
    cpuset.cpus.partition: root
    cpu.max: max 100000
    cpu.max.burst: 0

All this functionality is orchestrated by our control plane. It tracks the CPU allocation to each cgroup and each VM, calculates the limits, and assigns them based on the VM size and its specification mapped to the host’s architecture. Some cgroup settings are not preserved over host restarts, therefore, we ensure that the control plane re-applies them as needed and when needed. 

Also, we paid attention to the VM provisioning time and ensured that all this new functionality did not increase it. We made the cgroup setup logic run in parallel to other tasks performed during the provisioning of a VM and kept the overall elapsed time unchanged.

### Performance Testing – CPU-bound workload

We ran a simple stress test simulating a CPU-bound and bursty workload to see how the burstability is used. For this, we used the stress-ng utility.

    stress-ng --cpu 2 --cpu-load 60 --cpu-load-slice 100 --timeout 60s

We run stress-ng on the following set of servers:

*   A standard-2 instance to observe how it behaves on a relatively “unconstrained” instance. Note that the workload doesn’t fully use the standard-2 instance
*   A single burstable-2 instance, representing a low-density scenario where no other workloads are running on the neighboring instances
*   Multiple burstable-2 instances, representing a high-density scenario where all instances sharing a set of CPUs are equally loaded
*   similar single-instance and multiple instances runs for burstable-1 VMs.

The workload is sized such that it utilizes close to the full capacity of the burstable instances, but because it is not a constant load, it allows for some effects of burstability.

![afr calculation](https://cdn.prod.website-files.com/64f9d9b4e737e7b37d4e39a4/680f63d14b0b886fffb2b97e_2%20cpu%20burstable.jpg)

We can observe the following:

*   When burstable-2 instances run without much neighboring workload, they can utilize the burstability as they have room to expand. We observe about 30% improvement for this workload.
*   Conversely, when all instances in a shared CPU set are fully loaded, there is no room for bursting, and the VMs cannot achieve the same results.
*   When the workload is too large for the instance’s size, such as when we run the 2-cpu workload on a burstable-1 instance, there is no room to accumulate bursting credits. As a result, we don’t use the bursting capability (last two columns on the chart).

We then run a 1-cpu workload only on burstable-1 instances:

    stress-ng --cpu 1 --cpu-load 60 --cpu-load-slice 100 --timeout 60s

![afr calculation](https://cdn.prod.website-files.com/64f9d9b4e737e7b37d4e39a4/67d02975d41bec76b493c720_1%20cpu%20burstable-min.jpg)

Here we can see that when the workload is sized correctly to the server size, and there are no neighboring instances taking away the shared CPU, the workload has room to burst into and improves by about 30%.

### Takeaways

We have four takeaways from building burstables. First, burstable VMs provide a cost-effective solution for workloads that can run on a fraction of a vCPU. Examples include small websites, SaaS services, development and test environments.

For example, a simple fault-tolerant web app requires at least two VMs behind a load balancer, backed by a managed Postgres database. The total cost of that setup with dedicated 8GB instances was $100/month ($0.14/hr) on Ubicloud before the introduction of burstable VMs. With burstable instances, the cost drops to less than $25/month ($0.035/hr).

Second, our experiments show that once the burstable instance is correctly sized to the workload, you get about 30% burst capacity during resource spikes.

Third, sadly, cgroups v2 restricts this burst capacity to micro-intervals - and the burst credits don’t accumulate over minutes or hours. Aggregating and applying burst credits over a longer time period requires that we collect statistics and apply burst credits outside of the cgroups v2 implementation. We haven’t yet incorporated these changes into our implementation.

Finally, even with this small caveat, we found cgroups v2 to provide robust resource management across VMs. VMs exceed their baseline allocation when needed, while maintaining strong isolation between workload groups.

Linux and open source virtualization solutions have come a long way since the [early days of the cloud](https://www.ubicloud.com/blog/cloud-virtualization-red-hat-aws-firecracker-and-ubicloud-internals). As we improve our open source cloud, we’re committed to transparently sharing our implementation details. If you have any questions or comments, please drop us a line at [\[email protected\]](https://www.ubicloud.com/cdn-cgi/l/email-protection#5b282e2b2b34292f1b2e39323837342e3f75383436) anytime.