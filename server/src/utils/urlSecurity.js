const dns = require('dns').promises;
const ipaddr = require('ipaddr.js');

/**
 * Normalizes user-submitted URL string
 * Supports: example.com, www.example.com, http://example.com, https://example.com
 */
function normalizeUrl(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Please provide a valid website URL.');
  }

  let trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Please provide a valid website URL.');
  }

  // Prepend https:// if protocol is missing
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch (err) {
    throw new Error('The URL format is invalid. Example: https://example.com');
  }

  // Only allow http: and https:
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS protocols are supported.');
  }

  // Hostname validation
  const hostname = parsed.hostname.toLowerCase();
  if (!hostname || hostname.includes(' ') || hostname.length > 255) {
    throw new Error('Invalid website domain name.');
  }

  return {
    rawUrl: parsed.href,
    origin: parsed.origin,
    protocol: parsed.protocol,
    hostname: hostname,
    pathname: parsed.pathname || '/',
    port: parsed.port
  };
}

/**
 * Validates that an IP address is not private, loopback, link-local, or reserved.
 */
function isPrivateIp(ipString) {
  try {
    const addr = ipaddr.parse(ipString);
    const range = addr.range();

    // Block non-public IP ranges
    const blockedRanges = [
      'loopback',
      'private',
      'linkLocal',
      'carrierGradeNat',
      'uniqueLocal',
      'broadcast',
      'reserved',
      'unspecified'
    ];

    if (blockedRanges.includes(range)) {
      return true;
    }

    // Additional check for special IPv4 ranges
    if (addr.kind() === 'ipv4') {
      const octets = addr.octets;
      // 0.0.0.0/8
      if (octets[0] === 0) return true;
      // 10.0.0.0/8
      if (octets[0] === 10) return true;
      // 127.0.0.0/8
      if (octets[0] === 127) return true;
      // 169.254.0.0/16
      if (octets[0] === 169 && octets[1] === 254) return true;
      // 172.16.0.0/12
      if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;
      // 192.168.0.0/16
      if (octets[0] === 192 && octets[1] === 168) return true;
      // 100.64.0.0/10 (CGNAT)
      if (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127) return true;
    }

    return false;
  } catch (e) {
    // If it cannot be parsed, treat as unsafe
    return true;
  }
}

/**
 * Validates URL against SSRF and private network attacks.
 * Resolves hostname via DNS and checks all returned IP addresses.
 */
async function validateUrlForSsrf(inputUrl) {
  const { rawUrl, hostname, protocol, origin, pathname } = normalizeUrl(inputUrl);

  // Check obvious prohibited hostnames
  const prohibitedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'];
  if (prohibitedHosts.includes(hostname) || hostname.endsWith('.localhost') || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    throw new Error('Access to local or internal network addresses is restricted.');
  }

  // Check if hostname is an IP literal
  if (ipaddr.isValid(hostname)) {
    if (isPrivateIp(hostname)) {
      throw new Error('Access to private or local IP addresses is restricted.');
    }
  } else {
    // Resolve hostname to IP to protect against SSRF (DNS rebinding / private targets)
    try {
      const addresses = await dns.lookup(hostname, { all: true });
      if (!addresses || addresses.length === 0) {
        throw new Error(`Domain "${hostname}" could not be resolved. Please verify the URL.`);
      }

      for (const record of addresses) {
        if (isPrivateIp(record.address)) {
          throw new Error('This domain resolves to a restricted private or internal IP address.');
        }
      }
    } catch (err) {
      if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
        throw new Error(`Domain "${hostname}" does not exist or cannot be reached.`);
      }
      throw err;
    }
  }

  return {
    normalizedUrl: rawUrl,
    hostname,
    protocol,
    origin,
    pathname
  };
}

module.exports = {
  normalizeUrl,
  isPrivateIp,
  validateUrlForSsrf
};
