/\* Body mods \*/ body { min-height: 100vh; min-height: -webkit-fill-available; -moz-osx-font-smoothing: grayscale; -webkit-font-smoothing: antialiased; -moz-font-smoothing: antialiased; -o-font-smoothing: antialiased; text-decoration-thickness: 0.07em !important; text-underline-offset: 0.08em !important; text-underline-position: under; } /\* Text Selection Color \*/ ::-moz-selection { background: rgba(20, 110, 245, 0.95); color: #FFFFFF; } ::selection { background: rgba(20, 110, 245, 0.95); color: #FFFFFF; } /\* Margin top for headings in rich text elements \*/ .w-richtext>:first-child { margin-top: 0; } .w-richtext>:last-child, .w-richtext ol li:last-child, .w-richtext ul li:last-child { margin-bottom: 0; } .w-input, .w-select, a { color: inherit; font-size: inherit; -webkit-appearance: none; -moz-appearance: none; } /\* Global Focus Outline Color - will update to use native focus(keyboard) state \*/ \*:focus:not(:focus-visible) { outline: 0; } /\*----- Button's arrow moving on hover -----\*/ .card:hover .button-icon\_right, .button:hover .button-icon\_right { transform: translateX(8px); } .card:hover .button-icon\_top-right, .button:hover .button-icon\_top-right { transform: translate(8px, -8px); } /\* Truncation utility \*/ .u-truncate-2lines { display: -webkit-box; overflow: hidden; -webkit-line-clamp: 2; -webkit-box-orient: vertical; } .u-truncate-3lines { display: -webkit-box; overflow: hidden; -webkit-line-clamp: 3; -webkit-box-orient: vertical; } /\* Feature content and images opacity on current \*/ .sticky-features\_item-anchor + .sticky-features\_item-content { opacity: 0.2; } .sticky-features\_item-anchor + .sticky-features\_img-wrapper { opacity: 0; } .sticky-features\_item-anchor.w--current + div { opacity: 1; z-index:10; } /\* Feature tabs transitions \*/ .feature\_tab-link.w--current .tab-link\_description { opacity: 1; height: auto; transition: opacity .5s ease-out, max-height 1.2s cubic-bezier(.165, .84, .44, 1); display: block; } .feature\_tab-link.cc-dark.w--current .tab-link\_description { color: var(--gray-200); } .feature\_tab-link.cc-dark.w--current .feature\_item-content { color: var(--white); } @media only screen and (max-width: 991px) { .feature\_tab-link .tab-link\_description.cc-mobile-visibility { opacity: 1; height: auto; display: block; max-height: 200px; transition: opacity .5s ease-out, max-height 1.2s cubic-bezier(.165, .84, .44, 1); } .feature\_tab-link.cc-dark .tab-link\_description { color: var(--gray-200) !important; } } /\* Features dropdown — Used in hero section in our feature pages \*/ \[theme="light"\] .features-dropdown-toggle, \[theme="light"\] .brand-boilerplate-components--features-dropdown-toggle { color: #5a5a5a; border-color: #d8d8d8; } \[theme="light"\] .features-dropdown-toggle:hover, \[theme="light"\] .features-dropdown-toggle.w--open, \[theme="light"\] .brand-boilerplate-components--features-dropdown-toggle:hover, \[theme="light"\] .brand-boilerplate-components--features-dropdown-toggle.w--open { color: #080808; border-color: #5a5a5a; } .features-dropdown-link\_block:hover \*:not(.tag\_new):not(.brand-boilerplate-components--tag\_new), .brand-boilerplate-components--features-dropdown-link\_block:hover \*:not(.tag\_new):not(.brand-boilerplate-components--tag\_new) { text-decoration: underline; } @media (prefers-reduced-motion) { /\* Remove transition from all to make things instant \*/ \* { -webkit-transition: all 0s linear 0s !important; transition: all 0s linear 0s !important; } /\* Custom classes to hide/show content \*/ .a11y-reduce-motion-show { display: block !important; } .a11y-reduce-motion-hide { display: none; } } /\* Add popup interaction on logo marquee \*/ \[data-logo-link\]:hover \[data-link-svg-wrap\] { opacity: 0.6; } \[data-logo-popup\] { opacity: 0; transform: translateY(-1rem); transition: opacity 0.3s ease, transform 0.3s ease; pointer-events: none; /\* Prevent hover issues when hidden \*/ } \[data-logo-link\]:hover \[data-logo-popup\] { opacity: 1; transform: translateY(-3rem); pointer-events: auto; }

// Add reduced motion IX to <body> const observer = new MutationObserver(function (m, mo) { const body = document.body; if (body) { body.setAttribute("data-wf-ix-vacation", "1"); mo.disconnect(); } }); observer.observe(document, { childList: true, subtree: true, }); // Load all of this after the whole page (and jquery) has loaded window.onload = function() { // Set footer copyright year $('\[class\*="footer-copyright\_year"\]').text(new Date().getFullYear()); // "Skip to main" script var skipLinkEle = document.getElementById('skip-link'); if (skipLinkEle) { skipLinkEle.addEventListener('click keydown', function (e) { if (e.type === "keydown" && e.which !== 13) { return; } e.preventDefault(); var target = document.getElementById('main'); target.setAttribute('tabindex', '-1'); target.focus(); }); } // Trap modal focus and enable ESC key for accessibility var buttonThatOpenedModal; var findModal = function (elem) { var tabbable = elem.find('select, input, textarea, button, a').filter(':visible'); var firstTabbable = tabbable.first(); var lastTabbable = tabbable.last(); firstTabbable.focus(); lastTabbable.on('keydown', function (e) { if ((e.which === 9 && !e.shiftKey)) { e.preventDefault(); firstTabbable.focus(); } }); firstTabbable.on('keydown', function (e) { if ((e.which === 9 && e.shiftKey)) { e.preventDefault(); lastTabbable.focus(); } }); elem.on('keydown', function (e) { if (e.keyCode === 27) { $(elem).find('\[class$="modal-close\_btn"\]').click(); }; }); }; var modalOpenButton = $('\[class$="modal-open\_btn"\]'); modalOpenButton.on('keydown', function (e) { if (e.which !== 13 && e.which !== 32) { return; } e.preventDefault(); var evt = document.createEvent("MouseEvents"); evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); $(this).get(0).dispatchEvent(evt); }); modalOpenButton.on('click', function () { $(this).next().show(); findModal($(this).next()); buttonThatOpenedModal = $(this); }); var modalCloseButton = $('\[class$="modal-close\_btn"\], \[class$="modal-close\_area"\]'); modalCloseButton.on('keydown', function (e) { if (e.which !== 13 && e.which !== 32) { return; } e.preventDefault(); var evt = document.createEvent("MouseEvents"); evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); $(this).get(0).dispatchEvent(evt); }); modalCloseButton.on('click', function () { $(this).closest('\[class$="modal-wrapper"\]').hide(); if (buttonThatOpenedModal) { buttonThatOpenedModal.focus(); buttonThatOpenedModal = null; } }); // Toggle accordion attributes for accessibility var accordionToggleButton = $('.accordion-trigger'); accordionToggleButton.on('keydown', function (e) { if (e.which !== 13 && e.which !== 32) { return; } e.preventDefault(); var evt = document.createEvent("MouseEvents"); evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); $(this).get(0).dispatchEvent(evt); }); accordionToggleButton.on('click', function (e) { $(this).toggleAttrVal('aria-expanded', "false", "true"); $(this).parent().find('.accordion-content').toggleAttrVal('aria-hidden', "true", "false"); }); // jQuery method to toggle attribute value $.fn.toggleAttrVal = function (attr, val1, val2) { var test = $(this).attr(attr); if (test === val1) { $(this).attr(attr, val2); return this; } if (test === val2) { $(this).attr(attr, val1); return this; } $(this).attr(attr, val1); return this; }; };

.truncate { display: -webkit-box; overflow: hidden; -webkit-line-clamp: 1; -webkit-box-orient: vertical; } /\* - - - RTF Code Blocks - - - \*/ .w-code-block { border-radius: 0.25rem; border: 1px solid #D8D8D8; background: #f0f0f0 !important; color: #171717 !important; margin: 2rem 0; overflow-x: auto; font-size: 0.85em !important; } .w-code-block code { border: none !important; margin: 0 !important; } .w-code-block .hljs-class { color: #ed52cb !important; } .w-code-block .hljs-function { color: #171717 !important; } .w-code-block .hljs-keyword, .xml.hljs-attr { color: #146ef5 !important; } .hljs, .xml { color: #363636 !important; } .hljs-comment, .hljs-quote { color: #eaeaea !important; } .hljs-comment, .hljs-quote { color: #eaeaea; } .hljs-variable, .hljs-template-variable, .hljs-tag, .hljs-name, .hljs-selector-id, .hljs-selector-class, .hljs-regexp, .hljs-deletion { color: #363636 !important; } .hljs-number, .hljs-built\_in, .hljs-builtin-name, .hljs-literal, .hljs-type, .hljs-meta, .hljs-link { color: #ed52cb !important; } .hljs-params { color: #ff6b00 !important; } .hljs-attribute { color: #a3bfce; } .hljs-string, .hljs-symbol, .hljs-bullet, .hljs-addition { color: #171717 !important; } .hljs-title, .hljs-section { color: #171717 !important; } .hljs-keyword, .hljs-selector-tag { color: #6720ff !important; } .hljs-attribute, .hljs-name, .hljs-selector-tag { font-weight: normal !important; } .hljs-emphasis { font-style: italic; }

[

Discover top website trends and insights for 2025

Read report

↗

/\* Make g-nav\_wrapper relative if sticky wrapper applied for top notification banner use \*/ .notification\_bar + .g-nav-wrapper { position: sticky; top: 0; } .notification\_bar + .g-nav-wrapper .g-nav-wrapper-position { position: relative; } body:has( .notification\_bar) { position: relative; } /\* Make g-nav\_wrapper relative if sticky wrapper applied for top notification banner use \*/ \[class$="notification\_bar"\] + \[class$="g-nav-wrapper"\] { position: sticky; top: 0; } \[class$="notification\_bar"\] + \[class$="g-nav-wrapper"\] \[class$="g-nav-wrapper-position"\] { position: relative; } body:has( \[class$="notification\_bar"\]) { position: relative; } /\* Make g-nav\_wrapper relative if sticky wrapper applied for top notification banner use \*/ .brand-boilerplate-components--notification\_bar + .brand-boilerplate-components--g-nav-wrapper { position: sticky; top: 0; } .brand-boilerplate-components--notification\_bar + .brand-boilerplate-components--g-nav-wrapper .brand-boilerplate-components--g-nav-wrapper-position { position: relative; } body:has( .brand-boilerplate-components--notification\_bar) { position: relative; }

](https://www.webflow.com/resources/report/2025-state-of-the-website)

[Skip to main content](#main)

[

Webflow

](https://webflow.com/?r=0)

[Contact sales](https://webflow.com/contact-sales)

*   Platform
    
    *   Build
        
        *   [
            
            Design
            
            Build high-performing sites
            
            
            
            ](https://webflow.com/design)
        *   [
            
            Edit mode
            
            Empower your content team
            
            
            
            ](https://webflow.com/edit-mode)
        *   [
            
            Interactions
            
            Craft immersive experiences
            
            
            
            ](https://webflow.com/interactions-animations)
        *   [
            
            Page building
            
            New
            
            Launch simple landing pages quickly and easily
            
            
            
            ](https://webflow.com/page-building)
        *   [
            
            Shared Libraries
            
            New
            
            Unify your design system across multiple sites
            
            
            
            ](https://webflow.com/shared-libraries)
    *   Manage
        
        *   [
            
            CMS
            
            Manage content at scale
            
            
            
            ](https://webflow.com/cms)
        *   [
            
            Hosting
            
            Host and scale your site without the hassle
            
            
            
            ](https://webflow.com/hosting)
        *   [
            
            Localization
            
            Customize your site for a worldwide audience
            
            
            
            ](https://webflow.com/localization)
        *   [
            
            Security
            
            Ensure your site stays safe
            
            
            
            ](https://webflow.com/security)
    *   Optimize
        
        *   [
            
            Analyze
            
            New
            
            Understand how your site performs
            
            
            
            ](https://webflow.com/analyze)
        *   [
            
            Optimize
            
            New
            
            Maximize conversions with testing and personalization
            
            
            
            ](https://webflow.com/optimize)
        *   [
            
            SEO
            
            Grow your reach with fine-tuned controls
            
            
            
            ](https://webflow.com/seo)
    *   Extend
        
        *   [
            
            Apps
            
            Connect your site to apps like HubSpot, Adobe Express, and more
            
            
            
            ](https://webflow.com/apps)
        *   [
            
            Figma to Webflow
            
            Turn static designs into clean, production-ready code
            
            
            
            ](https://webflow.com/figma-to-webflow)
    *   [
        
        Platform overview
        
        Explore the power of the Webflow Platform
        
        ↗
        
        ](https://webflow.com/platform)[
        
        AI at Webflow
        
        Elevate your site with the power of AI
        
        ↗
        
        ](https://webflow.com/ai)
    
*   Solutions
    
    *   Webflow for
        
        *   [
            
            Enterprise
            
            Built for world-class organizations
            
            
            
            ](https://webflow.com/enterprise)
        *   [
            
            Agencies
            
            Accelerate your agency’s growth
            
            
            
            ](https://webflow.com/solutions/agencies)
        *   [
            
            Freelancers
            
            Build custom sites for clients
            
            
            
            ](https://webflow.com/solutions/freelancers)
        *   [
            
            Global alliances
            
            Unlock enterprise-level partnership
            
            
            
            ](https://webflow.com/solutions/global-alliances)
        *   [
            
            Startups
            
            Move faster with Webflow
            
            
            
            ](https://webflow.com/startups)
        *   [
            
            Classrooms
            
            Register to use Webflow for free
            
            
            
            ](https://webflow.com/classroom)
    *   Compare
        
        *   [
            
            Contentful
            
            
            
            ](https://webflow.com/vs/contentful)
        *   [
            
            Framer
            
            
            
            ](https://webflow.com/vs/framer)
        *   [
            
            Sitecore
            
            
            
            ](https://webflow.com/vs/sitecore)
        *   [
            
            Wix
            
            
            
            ](https://webflow.com/vs/wix)
        *   [
            
            WordPress
            
            
            
            ](https://webflow.com/vs/wordpress)
    *   [
        
        Customer story
        
        ↗
        
        How Dropbox Sign transformed collaboration with Webflow
        
        67%
        
        **Decrease in dev ticketing**
        
        
        
        ](https://webflow.com/customers/dropbox-sign)
        
        [
        
        Customer stories
        
        Browse Webflow success stories
        
        
        
        ](https://webflow.com/customers)
    
*   Resources
    
    *   Get started
        
        *   [
            
            Templates
            
            Website templates for any use case
            
            
            
            ](https://webflow.com/templates)
        *   [
            
            Made in Webflow
            
            Find and clone inspiring sites
            
            
            
            ](https://webflow.com/made-in-webflow)
        *   [
            
            Hire a Certified Partner
            
            Find a freelancer or agency to help with your next project
            
            
            
            ](https://webflow.com/certified-partners)
        *   [
            
            Developers
            
            Submit an app, explore our APIs, get technical support, and more
            
            
            
            ](https://developers.webflow.com/)
    *   Learn
        
        *   [
            
            Webflow University
            
            Learn web design and development for free
            
            
            
            ](https://university.webflow.com/)
        *   [
            
            Blog
            
            Stories, insights, and advice for how you build for the web
            
            
            
            ](https://webflow.com/blog)
        *   [
            
            Resources
            
            Free ebooks, webinars, whitepapers, and reports
            
            
            
            ](https://webflow.com/resources)
    *   Discover
        
        *   [
            
            Customer stories
            
            Explore enterprise and agency success stories
            
            
            
            ](https://webflow.com/customers)
        *   [
            
            Community
            
            Connect with the worldwide Webflow community
            
            
            
            ](https://webflow.com/community)
        *   [
            
            Partner with Webflow
            
            Grow your business by becoming a Webflow partner
            
            
            
            ](https://webflow.com/partners)
    *   Get help
        
        *   [
            
            Support
            
            Jump into our product docs or connect with our Support team
            
            
            
            ](https://help.webflow.com/)
        *   [
            
            Forum
            
            Ask questions and learn alongside other Webflow users
            
            
            
            ](https://forum.webflow.com/)
    
*   [Enterprise](https://webflow.com/enterprise)
*   [Pricing](https://webflow.com/pricing)

[Log in](https://webflow.com/dashboard/login)[Contact sales](https://webflow.com/contact-sales)[

Get started — it's free

](https://webflow.com/dashboard/signup)

//Close modal when pressing the Esc key window.addEventListener('keyup', function(event) { if (event.which === 27) { wf\_utils.signupModalUtils.closeModal(); } }); //Lock body scroll when nav is open window.addEventListener('DOMContentLoaded', (event) => { $('.brand-boilerplate-components--g-nav\_menu-button, .w-nav-overlay').click(function() { if ($('body').css('overflow') !== 'hidden') { $('body').css('overflow', 'hidden'); } else { $('body').css('overflow', 'auto'); } }); }); // Global nav - Changes subnav height and width in a very flowy way window.onload = function() { $('.brand-boilerplate-components--g-nav\_menu-dropdown\_toggle').on('click', function () { const containerElement = $(this).next().find('.brand-boilerplate-components--g-nav\_menu\_container'); setTimeout(function () { const containerWidth = containerElement.outerWidth(); $('.brand-boilerplate-components--g-nav\_menu-container-bg').width(containerWidth); const containerHeight = containerElement.outerHeight(); $('.brand-boilerplate-components--g-nav\_menu-container-bg').height(containerHeight); }, 50); }); };

/\* Lowering z-index so that it's below the nav when opened \*/ .w-webflow-badge { z-index: 100 !important; } /\* Nav styling and focus states \*/ .g-nav\_menu-section\_link:focus .g-nav\_menu-section\_link-heading, .g-nav\_menu-section\_link-row:focus .g-nav\_menu-section\_link-heading { text-decoration: underline; } .g-nav\_menu-section\_link:hover .g-nav\_menu-beta\_tag, .g-nav\_menu-section\_link:focus .g-nav\_menu-beta\_tag { text-decoration: none !important; } .g-nav \*:focus { outline: none !important; } /\* On smaller desktop devices, there is a lack of packing on both the meganav, and the dropdown, that needs to be compensated accordingly \*/ @media (min-width:992px) and (max-width: 1320px) { .g-nav { padding: 0px 8px 0px 20px; } .g-nav\_menu\_container.cc-small { margin-left: auto; margin-right: auto; } .g-nav\_menu-content\_block { padding-right: 20px; } .g-nav\_menu-grid-left { padding-left: 20px; } } @media screen and (max-width: 1068px) and (min-width: 992px) { .g-nav\_menu-link\_wrapper.button { padding: 12px 16px; } .g-nav\_menu-left { grid-column-gap: 1rem; } .g-nav\_menu-right { grid-column-gap: 1rem; } .button.cc-nav { padding: 14px 16px; font-size:0.9rem; } .g-nav { padding: 0px 8px 0px 16px; } .g-nav\_menu-link\_wrapper { font-size:0.9rem; } } .w-nav-overlay { overflow: scroll !important; } /\*----- Styling -----\*/ .g-nav\[theme="dark"\] { background-color: #080808; } .g-nav\[theme="dark"\] .g-nav\_menu-link\_wrapper, .g-nav\[theme="dark"\] .g-brand-logo, .g-nav\[theme="dark"\] .g-nav\_menu-dropdown\_toggle, .g-nav\[theme="dark"\] .g-nav\_menu-link\_wrapper-mobile { color: #FFFFFF; opacity: 1; } .g-nav\[theme="dark"\] .g-nav\_menu-button-icon { filter: invert(1); } @media only screen and (min-width: 991px) { .g-nav\_menu-link\_wrapper { transition: color 0.3s; /\* Smooth color transition \*/ } .g-nav\_menu-mobile-flex:hover .g-nav\_menu-link\_wrapper, .g-nav\_menu-mobile-flex:hover .g-nav\_menu-dropdown\_toggle, .g-nav\_menu-mobile-flex:hover .g-nav\_menu-link\_wrapper { color: #5A5A5A; /\* Change color of all links to dark gray when navigation is hovered \*/ } .g-nav\_menu-mobile-flex .g-nav\_menu-dropdown\_toggle:hover, .g-nav\_menu-mobile-flex .g-nav\_menu-dropdown\_toggle.w--open, .g-nav\_menu-mobile-flex .g-nav\_menu-link\_wrapper:hover { color: #080808; /\* Ensure the hovered link remains black \*/ } .g-nav\[theme="dark"\] .g-nav\_menu-mobile-flex:hover .g-nav\_menu-dropdown\_toggle, .g-nav\[theme="dark"\] .g-nav\_menu-mobile-flex:hover .g-nav\_menu-link\_wrapper { color: #ABABAB; /\* Change color of all links to light gray when navigation is hovered \*/ } .g-nav\[theme="dark"\] .g-nav\_menu-mobile-flex .g-nav\_menu-link\_wrapper:hover, .g-nav\[theme="dark"\] .g-nav\_menu-mobile-flex .g-nav\_menu-dropdown\_toggle:hover, .g-nav\[theme="dark"\] .g-nav\_menu-mobile-flex .g-nav\_menu-dropdown\_toggle.w--open { color: #FFFFFF; /\* Ensure the hovered link remains white \*/ } } @media only screen and (max-width: 991px) { .g-nav\[theme="dark"\] .g-nav\_menu-link\_wrapper, .g-nav\[theme="dark"\] .g-nav\_menu-dropdown\_toggle, .g-nav\_menu-link\_wrapper, .g-nav\_menu-dropdown\_toggle { color: #080808; } .g-nav\_menu-link\_wrapper:hover, .g-nav\[theme="dark"\] .g-nav\_menu-link\_wrapper:hover, .g-nav\[theme="dark"\] .g-brand-logo:hover, .g-nav\[theme="dark"\] .g-nav\_menu-dropdown\_toggle:hover { color: #146EF5; } .g-nav\_menu { height: calc(100vh - 65px) !important; min-height: auto; } } /\*----- Animating -----\*/ .g-nav\_menu-section-list\_item { opacity: 0; transform: translateY(20px); transition: opacity 0.3s ease, transform 0.3s ease; } .g-nav\_menu-dropdown.w--open .g-nav\_menu-section-list\_item { opacity: 1; transform: translateY(0); } /\* Adjustment for the published live version \*/ /\* Nav styling and focus states \*/ .brand-boilerplate-components--g-nav\_menu-section\_link:focus .brand-boilerplate-components--g-nav\_menu-section\_link-heading, .brand-boilerplate-components--g-nav\_menu-section\_link-row:focus .brand-boilerplate-components--g-nav\_menu-section\_link-heading { text-decoration: underline; } .brand-boilerplate-components--g-nav\_menu-section\_link:hover .brand-boilerplate-components--g-nav\_menu-beta\_tag, .brand-boilerplate-components--g-nav\_menu-section\_link:focus .brand-boilerplate-components--g-nav\_menu-beta\_tag { text-decoration: none !important; } .brand-boilerplate-components--g-nav \*:focus { outline: none !important; } /\* On smaller desktop devices, there is a lack of packing on both the meganav, and the dropdown, that needs to be compensated accordingly \*/ @media (min-width:992px) and (max-width: 1320px) { .brand-boilerplate-components--g-nav { padding: 0px 8px 0px 20px; } .brand-boilerplate-components--g-nav\_menu\_container.cc-small { margin-left: auto; margin-right: auto; } .brand-boilerplate-components--g-nav\_menu-content\_block { padding-right: 20px; } .brand-boilerplate-components--g-nav\_menu-grid-left { padding-left: 20px; } } @media screen and (max-width: 1068px) and (min-width: 992px) { .brand-boilerplate-components--g-nav\_menu-link\_wrapper.button { padding: 12px 16px; } .brand-boilerplate-components--g-nav\_menu-left { grid-column-gap: 1rem; } .brand-boilerplate-components--g-nav\_menu-right { grid-column-gap: 1rem; } .button.cc-nav { padding: 14px 16px; font-size:0.9rem; } .brand-boilerplate-components--g-nav { padding: 0px 8px 0px 16px; } .brand-boilerplate-components--g-nav\_menu-link\_wrapper { font-size:0.9rem; } } .w-nav-overlay { overflow: scroll !important; } /\*----- Styling -----\*/ .brand-boilerplate-components--g-nav\[theme="dark"\] { background-color: #080808; } .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-link\_wrapper, .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-brand-logo, .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-dropdown\_toggle, .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-link\_wrapper-mobile { color: #FFFFFF; opacity: 1; } .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-button-icon { filter: invert(1); } @media only screen and (min-width: 991px) { .brand-boilerplate-components--g-nav\_menu-link\_wrapper { transition: color 0.3s; /\* Smooth color transition \*/ } .brand-boilerplate-components--g-nav\_menu-mobile-flex:hover .brand-boilerplate-components--g-nav\_menu-link\_wrapper, .brand-boilerplate-components--g-nav\_menu-mobile-flex:hover .brand-boilerplate-components--g-nav\_menu-dropdown\_toggle, .brand-boilerplate-components--g-nav\_menu-mobile-flex:hover .brand-boilerplate-components--g-nav\_menu-link\_wrapper { color: #5A5A5A; /\* Change color of all links to dark gray when navigation is hovered \*/ } .brand-boilerplate-components--g-nav\_menu-mobile-flex .brand-boilerplate-components--g-nav\_menu-dropdown\_toggle:hover, .brand-boilerplate-components--g-nav\_menu-mobile-flex .brand-boilerplate-components--g-nav\_menu-dropdown\_toggle.w--open, .brand-boilerplate-components--g-nav\_menu-mobile-flex .brand-boilerplate-components--g-nav\_menu-link\_wrapper:hover { color: #080808; /\* Ensure the hovered link remains black \*/ } .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-mobile-flex:hover .brand-boilerplate-components--g-nav\_menu-dropdown\_toggle, .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-mobile-flex:hover .brand-boilerplate-components--g-nav\_menu-link\_wrapper { color: #ABABAB; /\* Change color of all links to light gray when navigation is hovered \*/ } .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-mobile-flex .brand-boilerplate-components--g-nav\_menu-link\_wrapper:hover, .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-mobile-flex .brand-boilerplate-components--g-nav\_menu-dropdown\_toggle:hover, .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-mobile-flex .brand-boilerplate-components--g-nav\_menu-dropdown\_toggle.w--open { color: #FFFFFF; /\* Ensure the hovered link remains white \*/ } } @media only screen and (max-width: 991px) { .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-link\_wrapper, .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-dropdown\_toggle, .brand-boilerplate-components--g-nav\_menu-link\_wrapper, .brand-boilerplate-components--g-nav\_menu-dropdown\_toggle { color: #080808; } .brand-boilerplate-components--g-nav\_menu-link\_wrapper:hover, .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-link\_wrapper:hover, .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-brand-logo:hover, .brand-boilerplate-components--g-nav\[theme="dark"\] .brand-boilerplate-components--g-nav\_menu-dropdown\_toggle:hover { color: #146EF5; } .brand-boilerplate-components--g-nav\_menu { height: calc(100vh - 65px) !important; min-height: auto; } } /\*----- Animating -----\*/ .brand-boilerplate-components--g-nav\_menu-section-list\_item { opacity: 0; transform: translateY(20px); transition: opacity 0.3s ease, transform 0.3s ease; } .brand-boilerplate-components--g-nav\_menu-dropdown.w--open .brand-boilerplate-components--g-nav\_menu-section-list\_item { opacity: 1; transform: translateY(0); }

![](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/673e4ccd26b9e1ebc598bc7f_f2382f890d505a114941a91d402ace26_webflow-desktop.avif)![](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/673e4ccd26b9e1ebc598bc8e_cfe5d91f9dbc640ed4dd82626c6d780b_webflow-tablet.avif)

Trusted by teams at

![Ideo](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/6723909da87bc591d8c364b7_58fb196935aa93002e9dcb9e1960e346_ideo-logo.svg)![Monday.com](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/66bd15c719d20c52532af070_2a2e4d49a16cbf827caf34d631f571f7_monday.com.svg)![BBDO](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/6723909da87bc591d8c364cb_a0d57b70cbf637736a3a186e369e1495_bbdo-logo.svg)![The New York Times](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/66bd15c719d20c52532af085_f65cede8603886ff8a92058ce445494c_nytimes.svg)![Ted](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/66bd15c719d20c52532af0ac_87a35dab6d903c1bdf093c990363fd07_TED.svg)![Philips](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/66bd15c719d20c52532af0dc_1f3891936e4298c9ed02312ca75a7e4b_philips.svg)

[

Blog

](http://www.webflow.com/blog)

→

Webflow makes GSAP 100% free — plus more exciting updates

Webflow makes GSAP 100% free — plus more exciting updates
=========================================================

Discover exciting updates to GSAP — supported by Webflow — plus product enhancements and more.

1.  [
    
    Blog
    
    ](https://webflow.com/blog)
    
    →
    
2.  [
    
    Inside Webflow
    
    ](https://webflow.com/blog/category/inside-webflow)
    
    →
    
3.  Webflow makes GSAP 100% free — plus more exciting updates
    

Webflow makes GSAP 100% free — plus more exciting updates
=========================================================

Discover exciting updates to GSAP — supported by Webflow — plus product enhancements and more.

![](https://cdn.prod.website-files.com/6009ec8cda7f305645c9d91b/680fe98d39d6635030906397_GSAP_GTM_MAY_blog_hero_2400x1260.jpg)

No items found.

Written by

![Rachel Wolan](https://cdn.prod.website-files.com/6009ec8cda7f305645c9d91b/66740bc3c543448f9064feef_65a06165d1926b535533ead9_rachelwolan-cpo-p-500.webp)

Rachel Wolan

Chief Product Officer

[

Rachel Wolan

](/blog/authors/rachel-wolan)

![Rachel Wolan](https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg)

[

](/blog/authors/)

![Rachel Wolan](https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg)

[

](/blog/authors/)

Webflow makes GSAP 100% free for the web community, giving developers more freedom to harness the full breadth of GSAP-powered motion.

As the first Website Experience Platform, our goal at Webflow is to empower modern teams to create engaging, brand-differentiated experiences that turn visitors into customers — and the best-performing sites we see are interactive and use animation to stand out.

This is why in the fall of 2024, [Webflow acquired the industry-leading JavaScript animation library, GreenSock Animation Platform (GSAP)](https://webflow.com/blog/webflow-acquires-gsap), to take our [Interaction solutions](https://webflow.com/interactions-animations) to the next level. We’re honored to be able to partner with GSAP on this journey to give web animation superpowers to everyone — whether you want to bring your ideas to life visually or through code.

Today, we’re excited to share some major updates to GSAP and Webflow, made with the broader GSAP community and our shared customers in mind.

**GSAP is now 100% free — here’s why**
--------------------------------------

We’re fully committed to investing in GSAP’s future, guided by your feedback and the expertise of the original GSAP team who brought this technology to life. And that investment starts with [making GSAP 100% free for all users.](http://www.gsap.com/pricing) 

This means _everyone_ — whether or not you’re a Webflow customer — will be able to leverage all of GSAP’s tools completely free of charge, including the previously paid Club plugins. We’re also expanding the standard license to cover commercial use, so you’re fully empowered to use GSAP anywhere, at no cost to you.

The GSAP team has always strived to make their offerings free to as many people as possible while maintaining high quality standards that benefit the entire community. That’s why Webflow is excited to be able to help them achieve this goal of becoming 100% free. With Webflow’s support, the GSAP team can continue to lead the charge in product and industry innovation while allowing even more developers the opportunity to harness the full breadth of GSAP-powered motion. 

**What’s new from GSAP and Webflow**
------------------------------------

In addition to making GSAP 100% free, we're excited to release a series of improvements for GSAP developers and our shared Webflow customers. Here’s what we’ve been working on together: 

### **Major upgrade to GSAP’s SplitText plugin**

[

Pause

Play



](#)

As part of our ongoing investment in GSAP, we’ve honed in on making one of GSAP’s most popular plugins even better. [SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) has been completely rewritten from the ground up with exciting improvements that include:

*   50% file size reduction for faster load times and improved performance 
*   Baked-in accessibility for screen readers
*   Easy masking for advanced “reveal” effects
*   New deepSlice feature that intelligently handles nested elements that spill onto multiple lines
*   New responsive features allowing for cleaner reflows and more seamless animations
*   And more!

[With 14 new features in total](https://gsap.com/blog/3-13), we’re excited to see more community members leveraging the improved — and now free — SplitText plugin. To get started, [see GSAP’s updated documentation on SplitText.](https://gsap.com/docs/v3/Plugins/SplitText/)

### **Easier GSAP plugin integration in Webflow**

![Screenshot of Webflow's GSAP animation settings panel, showing options to enable the GSAP animation library. The interface displays that GSAP Core is enabled on the site, with a section for GSAP Plugins where users can select additional animation capabilities. The "Flip" plugin is checked for smooth layout transitions, while ScrollTrigger and SplitText options are unchecked. The panel explains that plugins add capabilities but increase page load, with a recommendation to only enable plugins needed for custom code.](https://cdn.prod.website-files.com/6009ec8cda7f305645c9d91b/680fe9280582e073a36afc10_GSAP_GTM_MAY_blog_inline_2400x1260.jpg)

_All GSAP plugins are now directly available in and hosted by Webflow._

Previously, using GSAP Club plugins in Webflow was often a cumbersome process. We've made it easier by making all GSAP plugins directly available in and hosted by Webflow. Here's how it works: 

1.  Go to Site Settings and toggle on the [GSAP Core library](https://gsap.com/core/) and plugins you want to include on your site.
2.  Create your animations with custom code. 

And that’s it! To learn how to get started, check out [GSAP’s Webflow guide](https://gsap.com/resources/Webflow/). 

### **Preview custom code in Webflow before publishing**  

![Screenshot of a Webflow editor interface with a space-themed website design. The interface shows a toggle for "Enable custom code?" that is turned on, and a collaboration feature showing a comment from a user named Sam Lee saying "I love this custom animation! Nice work 🚀" posted 34 minutes ago. The website background features a planet Earth with a ring against a starry black space background, with partial text visible that appears to spell out "Br...". The top navigation shows tabs for "Misson" and "Voyage".](https://cdn.prod.website-files.com/6009ec8cda7f305645c9d91b/680fea66428a57e5320a7cb2_custom_code_in_preview-thumbnail-1280x720.png)

_You can now preview your Webflow site with custom HTML, CSS or JavaScript applied —including animations written with GSAP!_

To give you more confidence and control in your deployment, [we launched site previews with custom code](https://webflow.com/updates/site-previews-with-custom-code). This allows you to preview the effects of any custom code before publishing it on your Webflow site — including animations written with GSAP.

**What’s next** 
----------------

In the coming months, we’ll be expanding our native [Webflow Interactions](https://webflow.com/interactions-animations) with:

*   Popular GSAP features, so you can start building GSAP-powered animations visually
*   The ability to create with and preview your Interactions on a horizontal timeline for a more intuitive motion development experience
*   The ability to reuse any Interaction across your site, resulting in increased workflow efficiency and design consistency

These updates unlock the ability for anyone — regardless of coding knowledge — to build GSAP-powered motion into Webflow sites. It also sets the foundation for the next generation of native Webflow Interactions. This will be entirely replatformed on GSAP and deeply integrated with our Website Experience Platform — from design systems to collaboration workflows and much more.

We can’t wait for what’s to come. Together, GSAP and Webflow are committed to shaping the future of web animation and continuously raising the ceiling on what developers, designers, marketers, and agencies can build — visually or with code.

**Stay connected with us:**

*   **Learn more during our announcement video:** Join us on May 9 at 9 AM PT on YouTube to hear from myself (Rachel Wolan, CPO of Webflow), Cassie Evans (GSAP Developer Education Lead), and Keegan O’Leary (Webflow & GSAP Developer) as we share more about these Webflow and GSAP updates, including live demos. Subscribe to [Webflow’s YouTube channel](https://www.youtube.com/webflow) to get notified.**‍**
*   **Participate in our community challenge:** In partnership with Codepen, we’ve kicked off an exciting Webflow and GSAP community challenge running throughout May. We invite all GSAP developers — Webflow customer or not — to participate. We can’t wait to see what you build — [learn more about the challenge](https://webflow.com/community/webflow-challenge).

No items found.

window.addEventListener('load', async () => { // Get all buttons with the attribute 'video-playback="button"' const buttons = document.querySelectorAll('a\[video-playback="button"\]'); // Add click event listeners to each button buttons.forEach(button => { button.addEventListener('click', (event) => { event.preventDefault(); // Prevent default action of the button // Find the parent element and then the video within the same container const video = button.parentNode.querySelector('video'); // Toggle play/pause based on the video's current state if (video.paused) { video.play(); button.querySelector('\[video-playback="pause"\]').style.display = 'block'; button.querySelector('\[video-playback="play"\]').style.display = 'none'; } else { video.pause(); button.querySelector('\[video-playback="play"\]').style.display = 'block'; button.querySelector('\[video-playback="pause"\]').style.display = 'none'; } }); }); // fallback: show controls if autoplay fails let video = document.querySelector('video\[muted\]\[autoplay\]'); try { await video.play(); } catch (err) { video.controls = true; } });

[

↗

](#)

[

↗

](#)

[

](#)

Last Updated

April 30, 2025

Category

[

Inside Webflow

](https://webflow.com/blog/category/inside-webflow)

Share this

[X](#)

[Facebook](https://www.facebook.com/sharer/sharer.php?u=https://webflow.com/blog/gsap-becomes-free)

[LinkedIn](https://www.linkedin.com/shareArticle?url=https://webflow.com/blog/gsap-becomes-free&title=Webflow makes GSAP 100% free — plus more exciting updates&summary=Webflow makes GSAP 100% free for the web community, giving developers more freedom to harness the full breadth of GSAP-powered motion. )

[Pinterest](http://pinterest.com/pin/create/button/?url=https://www.webflow.com/blog/gsap-becomes-free&title=Webflow makes GSAP 100% free — plus more exciting updates&description=Discover exciting updates to GSAP — supported by Webflow — plus product enhancements and more.)

Unlock exclusive Webflow content
--------------------------------

Subscribe now for best practices, research reports, and more.

form.mktoForm.mktoHasWidth.mktoLayoutLeft { display: flex !important; flex-direction: column !important; grid-column-gap: 2px !important; grid-row-gap: 2px !important; } \[data-brand-mode="blog"\] .mktoFormRow { border-bottom: 2px solid #FFFFFF !important; } \[data-brand-mode="blog"\] .mktoFormRow.full-width { padding-left: 16px !important; padding-right: 16px !important; margin-top: 16px !important; border-bottom: none !important; text-wrap: balance !important; } \[data-brand-mode="blog"\] .mktoField { border: none !important; background-color: var(--gray-100) !important; border-radius: 0px !important; } \[data-brand-mode="blog"\] .mktoField:hover { border: none !important; background-color: var(--gray-200) !important; } \[data-brand-mode="blog"\] .mktoField:focus { border-color: var(--gray-200) !important; outline-offset: 0px !important; outline-style: none !important; outline-color: #FFFFFF !important; } \[data-brand-mode="blog"\] .mktoField:focus { outline-color: var(--gray-600) !important; outline-offset: 2p !important; outline-width: 2px !important; outline-style: solid !important; } \[data-brand-mode="blog"\] .terms-statement, \[data-brand-mode="blog"\] .terms-statement a, \[data-brand-mode="blog"\] .mktoInstruction { font-size: .875rem !important; } \[data-brand-mode="blog"\] .mktoFormRow:has( .terms-statement) .mktoFormCol { margin-bottom: 0 !important; } \[data-brand-mode="blog"\] .mktoFormRow:has( .terms-statement) { width: calc(100% - 11rem); } \[data-brand-mode="blog"\] .mktoButtonRow { padding-left: 16px !important; padding-right: 16px !important; padding-bottom: 16px !important; padding-top: 16px !important; } @media screen and (max-width: 480px) { \[data-brand-mode="blog"\] .mktoFormRow:has( .terms-statement) { width: 100%; } \[data-brand-mode="blog"\] .mktoButtonRow { position: static; } } /\* Adjust specific fields/rows to span both columns \*/ .mktoFormRow:has( #LblHow\_can\_we\_best\_support\_you\_\_c), .mktoFormRow:has( #LblWhat\_are\_you\_hoping\_to\_learn\_about\_\_c) { -ms-grid-column: span 2; grid-column-start: span 2; -ms-grid-column-span: 2; grid-column-end: span 2; -ms-grid-row: span 1; grid-row-start: span 1; -ms-grid-row-span: 1; grid-row-end: span 1; }

![](https://dhygzobemt712.cloudfront.net/Icons/Light/24px/CircleCheckYes.svg)

You are now subscribed.

[

↗

](#)

[

](#)

Related articles
----------------

[

Slide left

←

](#)[

Slide right

→

](#)

![](https://cdn.prod.website-files.com/6009ec8cda7f305645c9d91b/670eae79eacbf9edb625f39d_GSAP_Blog-hero_2400x1260.jpg)

[Inside Webflow](https://webflow.com/blog/category/inside-webflow)

### Webflow acquires the GreenSock business, the company behind GSAP, to bolster animations for its Website Experience Platform

by

Linda Tong

[Inside Webflow](https://webflow.com/blog/category/inside-webflow)

### Webflow acquires the GreenSock business, the company behind GSAP, to bolster animations for its Website Experience Platform

Webflow announces the acquisition of the GreenSock business, the company behind GreenSock Animation Platform (GSAP).

by

Linda Tong

[

Webflow acquires the GreenSock business, the company behind GSAP, to bolster animations for its Website Experience Platform

](/blog/webflow-acquires-gsap)

![](https://cdn.prod.website-files.com/6009ec8cda7f305645c9d91b/670e896e306e5c657c7b81b1_WXP_Blog-hero_2400x1260.png)

[Inside Webflow](https://webflow.com/blog/category/inside-webflow)

### Webflow is the first Website Experience Platform (WXP)

by

Linda Tong

[Inside Webflow](https://webflow.com/blog/category/inside-webflow)

### Webflow is the first Website Experience Platform (WXP)

As the first Website Experience Platform, Webflow empowers modern marketing teams to visually build, manage, and optimize stunning websites that scale.

by

Linda Tong

[

Webflow is the first Website Experience Platform (WXP)

](/blog/webflow-first-website-experience-platform-wxp)

![](https://cdn.prod.website-files.com/6009ec8cda7f305645c9d91b/671832b8e6bd637b8d9dcac1_COMPOSABLE%20CMS_DesignBlogHeader07_2400x1260-1-7.png)

[Inspiration](https://webflow.com/blog/category/inspiration)

### The next generation of CMS: A Website Experience Platform

by

Brett Domeny

[Inspiration](https://webflow.com/blog/category/inspiration)

### The next generation of CMS: A Website Experience Platform

Content management systems are changing. Our Website Experience Platform was designed to empower businesses to optimize teams, resources, and time-to-market.

by

Brett Domeny

[

The next generation of CMS: A Website Experience Platform

](/blog/next-generation-cms)

Get started for free
--------------------

Try Webflow for as long as you like with our free Starter plan. Purchase a paid Site plan to publish, host, and unlock additional features.  

[

Get started — it's free

](https://webflow.com/dashboard/signup)

### Transforming the design process at

![Philips](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/651d9107f9f229d775b8cf26_philips.svg)![Monday.com](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/651d9107f9f229d775b8cf27_monday-com.svg)![BBDO](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/651d9107f9f229d775b8cf2d_bbdo-light.svg)![Ideo](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/651d9106f9f229d775b8cf25_ideo-light.svg)![Upwork](https://cdn.prod.website-files.com/5dbfba8e8b3107b9aa912e57/5f68cb94c190432b9d328107_upwork.svg)![OrangeTheory Fitness](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/67112bee0df48092e8f3e0e9_orangetheory.svg)![Greenhouse](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/651d9107f9f229d775b8cf28_greenhouse.svg)![NCR](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/651d9107f9f229d775b8cf2e_ncr-light.svg)![TED](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/651d9107f9f229d775b8cf2a_ted.svg)![Hellosignropbox](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/651d9107f9f229d775b8cf2b_dropbox.svg)![New York Times](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/651d9107f9f229d775b8cf2f_nytimes-light.svg)![Discord](https://cdn.prod.website-files.com/6009e6adcf8c45466fee3e56/651d9107f9f229d775b8cf2c_discord.svg)

Product

*   [
    
    Platform
    
    ](https://webflow.com/platform)
*   [
    
    Design
    
    ](https://webflow.com/design)
*   [
    
    Edit mode
    
    ](https://webflow.com/edit-mode)
*   [
    
    Interactions
    
    ](https://webflow.com/interactions-animations)
*   [
    
    GSAP
    
    ](https://gsap.com/pricing/)
*   [
    
    Page building
    
    New
    
    ](https://webflow.com/page-building)
*   [
    
    Shared Libraries
    
    New
    
    ](https://webflow.com/shared-libraries)
*   [
    
    CMS
    
    ](https://webflow.com/cms)
*   [
    
    Hosting
    
    ](https://webflow.com/hosting)
*   [
    
    Localization
    
    ](https://webflow.com/localization)
*   [
    
    Security
    
    ](https://webflow.com/security)
*   [
    
    Ecommerce
    
    ](https://webflow.com/ecommerce)
*   [
    
    Analyze
    
    New
    
    ](https://webflow.com/analyze)
*   [
    
    Optimize
    
    New
    
    ](https://webflow.com/optimize)
*   [
    
    SEO
    
    ](https://webflow.com/seo)
*   [
    
    DevLink
    
    Labs
    
    ](http://webflow.com/devlink)
*   [
    
    Figma to Webflow
    
    Labs
    
    ](https://webflow.com/figma-to-webflow)
*   [
    
    Accessibility
    
    ](https://webflow.com/accessibility)
*   [
    
    AI
    
    ](https://webflow.com/ai)

Solutions

*   [
    
    Enterprise
    
    ](https://webflow.com/enterprise)
*   [
    
    Startups
    
    ](https://webflow.com/startups)
*   [
    
    Global alliances
    
    ](https://webflow.com/solutions/global-alliances)
*   [
    
    Agencies
    
    ](https://webflow.com/solutions/agencies)
*   [
    
    Freelancers
    
    ](https://webflow.com/solutions/freelancers)
*   [
    
    Classrooms
    
    ](https://webflow.com/for/classroom)

Resources

*   [
    
    University
    
    ](https://university.webflow.com)
*   [
    
    Blog
    
    ](https://webflow.com/blog)
*   [
    
    Customer stories
    
    ](https://webflow.com/customers)
*   [
    
    Webinars and ebooks
    
    ](https://webflow.com/resources)
*   [
    
    Apps
    
    ](https://webflow.com/apps)
*   [
    
    Libraries
    
    ](https://webflow.com/libraries)
*   [
    
    Templates
    
    ](https://webflow.com/templates)
*   [
    
    Developers
    
    ](http://developers.webflow.com/)
*   [
    
    Made in Webflow
    
    ](https://webflow.com/made-in-webflow)
*   [
    
    Glossary
    
    ](https://webflow.com/glossary)
*   [
    
    Livestreams
    
    ](https://webflow.com/events/livestreams)

Company

*   [
    
    About
    
    ](https://webflow.com/about)
*   [
    
    Careers
    
    We're Hiring
    
    ](https://webflow.com/careers)
*   [
    
    Press
    
    ](https://webflow.com/press)
*   [
    
    Webflow Ventures
    
    ](https://webflow.com/webflow-ventures)
*   [
    
    Webflow Shop
    
    ](https://shop.webflow.com)
*   [
    
    Terms of Service
    
    ](https://webflow.com/legal/terms)
*   [
    
    Privacy policy
    
    ](https://webflow.com/legal/privacy)
*   [
    
    Cookie policy
    
    ](https://webflow.com/legal/cookie-policy)
*   [
    
    Cookie preferences
    
    ](#)
*   [
    
    Accessibility statement
    
    ](https://webflow.com/accessibility/statement)
*   [
    
    Sitemap
    
    ](https://webflow.com/sitemap)

Community

*   [
    
    Discover the community
    
    ](https://webflow.com/community)
*   [
    
    Partner with Webflow
    
    ](https://webflow.com/partners)
*   [
    
    Certified Partners
    
    ](https://webflow.com/certified-partners)
*   [
    
    Become a template designer
    
    ](https://webflow.com/templates/applications)
*   [
    
    Become an affiliate
    
    ](https://webflow.com/affiliates)
*   [
    
    Become a Global Leader
    
    ](https://webflow.com/community/global-leaders)
*   [
    
    Find a meetup near you
    
    ](https://webflow.com/events)

Get help

*   [
    
    Support
    
    ](https://support.webflow.com/)
*   [
    
    Pricing
    
    ](https://webflow.com/pricing)
*   [
    
    Status
    
    ](https://status.webflow.com/)
*   [
    
    Forum
    
    ](https://forum.webflow.com/)
*   [
    
    Wishlist
    
    ](https://wishlist.webflow.com/)

© 2025 Webflow, Inc. All rights reserved

[

](https://webflow.com/?r=0)

*   [
    
    Made in Webflow
    
    ](https://webflow.com/discover/popular#recent)
*   [
    
    YouTube
    
    ](https://www.youtube.com/webflow)
*   [
    
    X
    
    ](https://twitter.com/webflow)
*   [
    
    Facebook
    
    ](https://www.facebook.com/webflow/)
*   [
    
    Linkedin
    
    ](https://www.linkedin.com/company/webflow-inc-)
*   [
    
    Instagram
    
    ](https://www.instagram.com/webflow/)
*   [
    
    TikTok
    
    ](https://www.tiktok.com/@webflow)

//-- Amplitude initialize if (!location.pathname.startsWith('/blog/')) { wf\_analytics.init({ pageView: { name: 'Blog Viewed', data: {} }, page: 'blog' }); } // else: for blog articles we call initAnalytics from the page custom code // ---- Custom intellimize audiences ---- // User is logged in/out intellimize.ready(() => { wf\_utils.getUser((user) => { const isLoggedIn = user ? 'true' : 'false'; const scope = 'user'; // or 'pageview' const attributes = { loggedIn: isLoggedIn }; intellimize.setAttributes(scope, attributes); }); }); // User device type (mac, pc, etc.) intellimize.ready(() => { const userAgent = navigator.userAgent.toLowerCase(); let deviceType = 'Other'; if (userAgent.includes('mac')) deviceType = 'Mac'; else if (userAgent.includes('windows')) deviceType = 'Windows'; else if (userAgent.includes('linux')) deviceType = 'Linux'; else if (userAgent.includes('android')) deviceType = 'Android'; else if (userAgent.includes('iphone') || userAgent.includes('ipad')) deviceType = 'iOS'; const scope = 'user'; // or 'pageview' const attributes = { userAgent: deviceType }; intellimize.setAttributes(scope, attributes); }); $('#search-icon').click(function(){ $('#search').focus(); }); // Get UTM parameters from current URL function getUTMParams() { const urlParams = new URLSearchParams(window.location.search); const utmParams = {}; \['utm\_source', 'utm\_medium', 'utm\_campaign', 'utm\_term', 'utm\_content'\].forEach(param => { if (urlParams.has(param)) { utmParams\[param\] = urlParams.get(param); } }); return utmParams; } // Check if domain is Webflow function isWebflowDomain(hostname) { return hostname.endsWith('webflow.com') || hostname.endsWith('webflow.io'); } // Check if URL already has UTM parameters function hasUTMParams(url) { return Array.from(url.searchParams.keys()).some(param => param.startsWith('utm\_')); } // Apply UTM parameters to all links function applyStickyUTM() { const utmParams = getUTMParams(); if (Object.keys(utmParams).length === 0) return; document.querySelectorAll('a').forEach(link => { if (link.href.startsWith('#') || link.href.startsWith('javascript:')) return; try { const url = new URL(link.href); if (!isWebflowDomain(url.hostname) || hasUTMParams(url)) return; Object.entries(utmParams).forEach((\[key, value\]) => { url.searchParams.set(key, value); }); link.href = url.toString(); } catch (e) { console.warn('Invalid URL:', link.href); } }); } // Run when DOM is loaded document.addEventListener('DOMContentLoaded', applyStickyUTM); // Run when content changes if (window.MutationObserver) { new MutationObserver(() => applyStickyUTM()) .observe(document.body, { subtree: true, childList: true }); } wf\_analytics.init({ pageView: { name: 'Blog Viewed', data: { 'published at': new Date("Apr 30, 2025"), 'updated at': new Date("Apr 30, 2025"), 'created at': new Date("Apr 28, 2025"), 'category': "Inside Webflow", 'post title': "gsap-becomes-free", 'post author': "rachel-wolan", 'post tag slug': "brand-pmm", } }, page: 'blog' }); { "@context": "http://schema.org", "@type": "Article", "headline": "Webflow makes GSAP 100% free — plus more exciting updates", "alternativeHeadline": "Discover exciting updates to GSAP — supported by Webflow — plus product enhancements and more.", "thumbnailUrl": "https://cdn.prod.website-files.com/6009ec8cda7f305645c9d91b/680fe98d39d6635030906397\_GSAP\_GTM\_MAY\_blog\_hero\_2400x1260.jpg", "image": "https://cdn.prod.website-files.com/6009ec8cda7f305645c9d91b/680fe98d39d6635030906397\_GSAP\_GTM\_MAY\_blog\_hero\_2400x1260.jpg", "author": "Rachel Wolan", "genre": "Inside Webflow", "articleSection": "Inside Webflow", "url": "https://webflow.com/blog/gsap-becomes-free", "datePublished": "Apr 30, 2025", "dateCreated": "Apr 28, 2025", "dateModified": "Apr 30, 2025", "publisher": { "@type": "Organization", "name": "Webflow", "sameAs": "https://webflow.com", "logo": { "@type": "ImageObject", "url": "https://cdn.prod.website-files.com/583347ca8f6c7ee058111b3b/5892125fcc115cf20213e381\_webflow-logo-blue-200x75.png", "width": "200", "height": "75" } }, "description": "Discover exciting updates to GSAP — supported by Webflow — plus product enhancements and more.", "mainEntityOfPage": { "@type": "WebPage", "@id": "https://webflow.com/blog/gsap-becomes-free" } } (function() { var modal = $('.signup-modal'); var hasAccount = document.cookie.indexOf('wflogin') >= 0 || document.cookie.indexOf('wf\_') >=0; var lastModalOpen = localStorage.getItem('lastModalOpen'); var ONE\_DAY = 86400; if (!modal) return; if (hasAccount) return; if (!lastModalOpen || ((Date.now() - lastModalOpen) / 1000) > ONE\_DAY \* 5) { setTimeout(function() { localStorage.setItem('lastModalOpen', Date.now()); modal.css('display', 'block'); modal.css('opacity', '1.0'); }, 30 \* 1000); } })(); function findParentByTagName(element, tagName) { var parent = element; while (parent !== null && parent.tagName !== tagName.toUpperCase()) { parent = parent.parentNode; } return parent; } wf\_utils.addClickListener(\[document.querySelector('\[data-wf-share\]')\], function(event) { var parent = findParentByTagName(event.target || event.srcElement, 'A'); if (parent) { event.preventDefault(); var itemClass = (parent.className && parent.className.split(' ').find(function (className) { return /at-svc-.\*/.test(className); })) || ''; var shareType = itemClass.replace('at-svc-', ''); wf\_analytics.track('Website Social Button Clicked', { slug: 'gsap-becomes-free', 'post name': 'Webflow makes GSAP 100% free — plus more exciting updates', 'post author': 'Rachel Wolan', 'post tag slug': 'brand-pmm', 'published date': 'Apr 30, 2025', 'updated date': 'Apr 30, 2025', 'share type': shareType, type: 'blog', }); } }); //----- Resources Slider Config ----- const resourcesSwiper = new Swiper("#related-slider", { speed: 300, autoHeight: true, followFinger: true, slideToClickedSlide: false, slidesPerView: 1, spaceBetween: 40, noSwipingSelector: 'a', mousewheel: { forceToAxis: true }, keyboard: { enabled: true, onlyInViewport: true }, navigation: { nextEl: "#resources-slider-right", prevEl: "#resources-slider-left", disabledClass: "is-disabled", }, breakpoints: { // mobile landscape 480: { slidesPerView: 1, }, // tablet 768: { slidesPerView: 2, }, // desktop 992: { slidesPerView: 3, } }, }); $(function() { $(".w-condition-invisible").remove(); }); const button = document.getElementById('twitter-share-link'); let shareTitle = encodeURIComponent(\`"${document.title}"\`); button.href = \`https://x.com/intent/tweet?url=https://webflow.com/blog/gsap-becomes-free&text=${shareTitle} by Rachel Wolan\`; button.target = '\_blank'; button.rel = 'noopener noreferrer'; MktoForms2.loadForm("//go.webflow.com", "050-LKC-745", 1591, function(form) { //Add an onSuccess handler form.onSuccess(function(values, followUpUrl) { // Hide form and show success elements $('\[data-form="form-wrapper"\]').hide(); $('\[data-form="success-wrapper"\]').show(); return false; }); }); // Site Key for client-side recaptcha var recaptchaSiteKey = "6LdEZD8jAAAAAFnhphir8s8mupFMI-IZZJbGt-pp";