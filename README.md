# HealthyWorld website

Multi-page, 4-language (English, اردو, हिन्दी, العربية) health website. Plain HTML/CSS/JS, no server needed.

## What is inside
- `website/`  the finished site. Upload the CONTENTS of this folder (index.html must be at the top level).
- `source/`   the generator, so you can change text/colours and rebuild.

## Publish (free) in 10 minutes
1. Create a free account on Cloudflare Pages, Netlify or GitHub Pages.
2. Upload everything inside `website/` (Netlify: drag and drop the folder).
3. Buy a domain (about $10 a year, e.g. from Namecheap or Cloudflare), connect it in the host's "Custom domain" settings.
4. IMPORTANT: put your real domain and email into the site, then rebuild (needs Node.js 18+):
   `cd source && SITE=https://yourdomain.com EMAIL=you@yourdomain.com OUT=../website node src/build.js`
   This updates canonical links, sitemap.xml, robots.txt and the Contact page. Upload again.
5. Google Search Console: add your domain, verify it, submit `https://yourdomain.com/sitemap.xml`.

## Earn with it
- Google AdSense: apply after the site is live on your own domain with real traffic. Requirements: original content, a site you own, policy compliance, applicant 18+ (a parent/guardian can apply for under-18s). When approved, paste the AdSense script where `src/build.js` has the comment "AdSense", rebuild and upload. Add the `ads.txt` file AdSense gives you to the site root.
- The Privacy page already explains cookies/ads in general terms. Check it with the AdSense policies before applying.
- Affiliate links (healthy food, kitchen tools, fitness gear) and your own paid plans/PDFs are other options.
- Health is a strict topic for Google. Add more helpful pages (one article per topic and age group), cite WHO/government sources, and keep the medical disclaimer.

## Notes
- All pictures are original illustrations drawn in code. To use real photos, put image files in `website/assets/` and change the `<img src>` in `source/src/build.js`.
- Yoga/exercise animations are drawn by `source/src/figure.js` and pose files `poses_*.js`. They are simple stick-style demos, not a substitute for a trainer.
- Text in Urdu, Hindi and Arabic was machine-translated: have a native speaker proofread before you publish.
