// Netlify serverless function — proxies HackTheBox API v4
// Requires env variable: HTB_APP_TOKEN
// Generate at: app.hackthebox.com → Account Settings → API Tokens → Add New Token

exports.handler = async () => {
  const token = process.env.HTB_APP_TOKEN;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (!token) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ error: 'HTB_APP_TOKEN not configured.' }),
    };
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'User-Agent': 'Portfolio/1.0',
  };

  async function tryGet(url) {
    const res = await fetch(url, { headers: authHeaders });
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('json')) return null;
    const json = await res.json();
    if (!res.ok) return null;
    return json;
  }

  // Step 1: find a working user/info endpoint and get the user ID
  const infoUrls = [
    'https://labs.hackthebox.com/api/v4/user/info',
    'https://www.hackthebox.com/api/v4/user/info',
  ];

  let info = null;
  let workingBase = null;

  for (const url of infoUrls) {
    try {
      const json = await tryGet(url);
      const u = json?.info ?? json;
      if (u?.id && u?.name) {
        info = u;
        workingBase = url.replace('/api/v4/user/info', '');
        break;
      }
    } catch (_) {}
  }

  if (!info) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: 'Could not fetch user info from any HTB endpoint' }),
    };
  }

  // Step 2: fetch full profile stats using the discovered base URL and user ID
  let p = {};
  let profileError = null;

  const profileUrls = [
    `${workingBase}/api/v4/profile/${info.id}`,
    `https://www.hackthebox.com/api/v4/profile/${info.id}`,
    `https://labs.hackthebox.com/api/v4/profile/${info.id}`,
  ];

  for (const url of profileUrls) {
    try {
      const json = await tryGet(url);
      const u = json?.profile ?? json;
      if (u && (u.level != null || u.points != null || u.rank)) {
        p = u;
        profileError = null;
        break;
      }
      profileError = `no stats in response from ${url}`;
    } catch (e) {
      profileError = `${url}: ${e.message}`;
    }
  }

  const avatar = p.avatar ?? info.avatar ?? null;

  return {
    statusCode: 200,
    headers: {
      ...headers,
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
    body: JSON.stringify({
      name:           p.name           ?? info.name,
      rank:           p.rank           ?? null,
      rank_id:        p.rank_id        ?? info.rank_id  ?? null,
      level:          p.level          ?? null,
      points:         p.points         ?? null,
      ranking:        p.ranking        ?? null,
      avatar:         avatar ? `https://www.hackthebox.com${avatar}` : null,
      country:        p.country_name   ?? p.country     ?? null,
      user_owns:      p.user_owns      ?? null,
      system_owns:    p.system_owns    ?? null,
      challenge_owns: p.challenge_owns ?? null,
      _workingBase:   workingBase,
      _profileError:  profileError,
    }),
  };
};
