# Claude Integrations

Today we're announcing Integrations, a new way to connect your apps and tools to Claude. We're also expanding Claude's [Research](https://www.anthropic.com/news/research) capabilities with an advanced mode that searches the web, your Google Workspace, and now your Integrations too. Claude can research for up to 45 minutes before delivering a comprehensive report, complete with citations. In addition to these updates, we're making web search available globally for all Claude users on paid plans.

## Integrations

Last November, we launched the [Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) (MCP)—an open standard connecting AI apps to tools and data. Until now, support for MCP was limited to Claude Desktop through local servers. Today, we're introducing Integrations, allowing Claude to work seamlessly with remote MCP servers across the web and desktop apps. Developers can build and host servers that enhance Claude’s capabilities, while users can discover and connect any number of these to Claude.

When you connect your tools to Claude, it gains deep context about your work—understanding project histories, task statuses, and organizational knowledge—and can take actions across every surface. Claude becomes a more informed collaborator, helping you execute complex projects in one place with expert assistance at every step.

To start, you can choose from Integrations for 10 popular services, including [Atlassian’s Jira and Confluence](https://www.atlassian.com/platform/remote-mcp-server), [Zapier](https://zapier.com/mcp), [Cloudflare](https://github.com/cloudflare/mcp-server-cloudflare/tree/main), [Intercom](https://www.intercom.com/blog/introducing-model-context-protocol-fin), [Asana](https://developers.asana.com/docs/using-asanas-model-control-protocol-mcp-server), [Square](https://developer.squareup.com/docs/mcp), [Sentry](https://docs.sentry.io/product/sentry-mcp/), [PayPal](https://www.paypal.ai/), [Linear](https://linear.app/changelog/2025-05-01-mcp), and [Plaid](https://api.dashboard.plaid.com/mcp/sse)—with more to follow from companies like Stripe and GitLab. Developers can also create their own Integrations in as little as 30 minutes using our documentation or solutions like [Cloudflare](https://blog.cloudflare.com/remote-model-context-protocol-servers-mcp/) that provide built-in OAuth authentication, transport handling, and integrated deployment.

Each integration drastically expands what Claude can do. Zapier, for example, connects thousands of apps through pre-built workflows, automating processes across your software stack. With the [Zapier Integration](https://zapier.com/mcp), Claude can access these apps and your custom workflows through conversation—even automatically pulling sales data from HubSpot and preparing meeting briefs based on your calendar.

With access to Atlassian’s Jira and Confluence, Claude can collaborate with you on building new products, managing tasks more effectively, and scaling your work by summarizing and creating multiple Confluence pages and Jira work items at once.

Connect Intercom to respond faster to user feedback. Intercom's AI agent Fin, now an MCP client, can take actions like filing bugs in Linear when users report issues. Chat with Claude to identify patterns and debug using Intercom's conversation history and user attributes—managing the entire workflow from user feedback to bug resolution in one conversation.

## Advanced Research

We're introducing several new updates to build on our recently-released [Research](https://www.anthropic.com/news/research) capability. Claude can now conduct deeper investigations across hundreds of internal and external sources, delivering more comprehensive reports in anywhere from five to 45 minutes.

With its new ability to do more complex research, available when you toggle on the Research button, Claude breaks down your request into smaller parts, investigating each deeply before compiling a comprehensive report. While most reports complete in five to 15 minutes, Claude may take up to 45 minutes for more complex investigations—work that would typically take hours of manual research.

We've also expanded Claude's data access. We launched Research with support for web search and Google Workspace, but now with Integrations, Claude can also search any application you connect.

When Claude incorporates information from sources, it provides clear citations that link directly to the original material. This transparency ensures you can confidently use Claude's research findings, knowing exactly where each insight originated.

## Getting started

Integrations and advanced Research are now available in beta on the Max, Team, and Enterprise plans, and will soon be available on Pro. Web search is now globally available to all [Claude.ai](http://claude.ai/) paid plans. For more information on getting started with Integrations, MCP servers, and security and privacy practices when connecting data sources to Claude, visit our [Help Center](https://support.anthropic.com/en/articles/11175166-about-integrations-using-remote-mcp).