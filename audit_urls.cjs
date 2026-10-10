const https = require('https');

const urls = [
  'https://seoplusplus.vercel.app/',
  'https://seoplusplus.vercel.app/tools',
  'https://seoplusplus.vercel.app/tools/search-console',
  'https://seoplusplus.vercel.app/tools/dr-checker',
  'https://seoplusplus.vercel.app/tools/keyword-finder',
  'https://seoplusplus.vercel.app/tools/hashtags',
  'https://seoplusplus.vercel.app/tools/captions',
  'https://seoplusplus.vercel.app/tools/hooks',
  'https://seoplusplus.vercel.app/tools/content-ideas',
  'https://seoplusplus.vercel.app/tools/character-counter',
  'https://seoplusplus.vercel.app/tools/utm-builder',
  'https://seoplusplus.vercel.app/blog',
  'https://seoplusplus.vercel.app/write-for-us',
  'https://seoplusplus.vercel.app/blog/what-is-seo-beginners-guide',
  'https://seoplusplus.vercel.app/blog/how-to-check-website-seo-audit-guide',
  'https://seoplusplus.vercel.app/blog/google-search-console-beginner-guide',
  'https://seoplusplus.vercel.app/blog/technical-seo-checklist-crawling-indexing',
  'https://seoplusplus.vercel.app/blog/how-to-write-high-ctr-meta-titles-descriptions',
  'https://seoplusplus.vercel.app/blog/guest-posting-quality-guidelines-outreach',
  'https://seoplusplus.vercel.app/about',
  'https://seoplusplus.vercel.app/contact',
  'https://seoplusplus.vercel.app/privacy',
  'https://seoplusplus.vercel.app/terms',
  'https://seoplusplus.vercel.app/disclaimer'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        const staticCanonical = (data.match(/link rel="canonical" href="([^"]+)"/) || ['','NONE'])[1];
        const title = (data.match(/<title>([^<]*)<\/title>/) || ['','NO_TITLE'])[1];
        resolve({
          url: url,
          status: res.statusCode,
          canonical: staticCanonical,
          title: title.substring(0, 60)
        });
      });
    });
    req.on('error', function(err) {
      resolve({ url: url, status: 'ERROR', error: err.message });
    });
    req.on('timeout', function() {
      req.destroy();
      resolve({ url: url, status: 'TIMEOUT' });
    });
  });
}

(async function() {
  for (var i = 0; i < urls.length; i++) {
    var result = await checkUrl(urls[i]);
    if (result.error) {
      console.log('ERROR  ' + result.url + ' | ' + result.error);
    } else {
      var statusStr = String(result.status);
      var issue = '';
      // A SPA always returns the root index.html for all routes (status 200) 
      // but canonical in static HTML will always be "/" for all routes
      if (result.canonical !== 'NONE' && result.canonical === 'https://seoplusplus.vercel.app/') {
        issue = ' *** STATIC CANONICAL HARDCODED TO / ***';
      }
      console.log(statusStr + '  ' + result.url + ' | canonical: ' + result.canonical + issue);
    }
  }
  console.log('Done.');
})();
