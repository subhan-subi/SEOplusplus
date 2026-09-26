const axios = require('axios');
const { validateUrlForSsrf } = require('../utils/urlSecurity');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 SEOly-Bot/1.0';

/**
 * Checks if robots.txt exists and extracts sitemap references if available
 */
async function checkRobotsTxt(origin) {
  try {
    const robotsUrl = `${origin}/robots.txt`;
    const res = await axios.get(robotsUrl, {
      timeout: 4000,
      headers: { 'User-Agent': USER_AGENT },
      maxContentLength: 512 * 1024,
      validateStatus: () => true
    });

    const isAvailable = res.status >= 200 && res.status < 300 && typeof res.data === 'string';
    const sitemapsFound = [];
    if (isAvailable) {
      const lines = res.data.split(/\r?\n/);
      for (const line of lines) {
        const match = line.match(/^sitemap:\s*(https?:\/\/[^\s]+)/i);
        if (match) {
          sitemapsFound.push(match[1].trim());
        }
      }
    }

    return {
      exists: isAvailable,
      status: res.status,
      url: robotsUrl,
      sitemapsFound
    };
  } catch (err) {
    return {
      exists: false,
      status: null,
      url: `${origin}/robots.txt`,
      sitemapsFound: []
    };
  }
}

/**
 * Checks if sitemap.xml is accessible
 */
async function checkSitemap(origin, knownSitemaps = []) {
  const targetUrls = knownSitemaps.length > 0 
    ? knownSitemaps.slice(0, 2) 
    : [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`];

  for (const sitemapUrl of targetUrls) {
    try {
      const res = await axios.get(sitemapUrl, {
        timeout: 4000,
        headers: { 'User-Agent': USER_AGENT },
        maxContentLength: 1024 * 1024,
        validateStatus: () => true
      });

      if (res.status >= 200 && res.status < 300 && typeof res.data === 'string' && (res.data.includes('<urlset') || res.data.includes('<sitemapindex') || res.headers['content-type']?.includes('xml'))) {
        return {
          exists: true,
          status: res.status,
          url: sitemapUrl
        };
      }
    } catch (e) {
      // Continue to next check
    }
  }

  return {
    exists: false,
    status: null,
    url: targetUrls[0]
  };
}

/**
 * Fetches the web page content and metadata safely
 */
async function crawlPage(validatedTarget) {
  const { normalizedUrl, origin } = validatedTarget;

  const startTime = Date.now();

  // Custom client to validate redirects against SSRF
  const client = axios.create({
    timeout: 12000,
    maxRedirects: 5,
    maxContentLength: 6 * 1024 * 1024, // 6 MB limit
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br'
    },
    validateStatus: () => true // Allow handling 4xx, 5xx explicitly
  });

  // Interceptor to prevent SSRF through redirect chains
  client.interceptors.response.use(async (response) => {
    // If redirected, check new destination URL
    const requestUrl = response.request?.res?.responseUrl;
    if (requestUrl && requestUrl !== normalizedUrl) {
      await validateUrlForSsrf(requestUrl);
    }
    return response;
  });

  let pageResponse;
  try {
    pageResponse = await client.get(normalizedUrl);
  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      throw new Error('Connection timed out. The website took too long to respond.');
    }
    if (err.response?.status === 403 || err.response?.status === 401) {
      throw new Error(`The website returned HTTP ${err.response.status} (Access Denied / Protected by Bot Protection).`);
    }
    throw new Error(err.message || 'Unable to connect to the target website.');
  }

  const responseTimeMs = Date.now() - startTime;
  const finalUrl = pageResponse.request?.res?.responseUrl || normalizedUrl;
  const rawHtml = typeof pageResponse.data === 'string' ? pageResponse.data : '';

  // Parallel checks for robots.txt and sitemap
  const robotsInfo = await checkRobotsTxt(origin);
  const sitemapInfo = await checkSitemap(origin, robotsInfo.sitemapsFound);

  return {
    statusCode: pageResponse.status,
    statusText: pageResponse.statusText,
    headers: pageResponse.headers || {},
    responseTimeMs,
    finalUrl,
    html: rawHtml,
    robotsInfo,
    sitemapInfo,
    pageSizeBytes: Buffer.byteLength(rawHtml, 'utf8')
  };
}

module.exports = {
  crawlPage,
  checkRobotsTxt,
  checkSitemap
};
