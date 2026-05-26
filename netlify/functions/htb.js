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

  // Try multiple known HTB API v4 endpoints in order
  const candidates = [
    'https://www.hackthebox.com/api/v4/user/info',
    'https://www.hackthebox.com/api/v4/profile/info',
    'https://labs.hackthebox.com/api/v4/user/info',
  ];

  const attempts = [];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { headers: authHeaders });
      const ct = res.headers.get('content-type') || '';
      const isJson = ct.includes('json');

      if (!isJson) {
        attempts.push({ url, status: res.status, error: `non-JSON response (${ct})` });
        continue;
      }

      const json = await res.json();

      if (!res.ok) {
        attempts.push({ url, status: res.status, error: JSON.stringify(json).slice(0, 200) });
        continue;
      }

      const u = json.info ?? json.profile ?? json;
      if (!u || !u.name) {
        attempts.push({ url, status: res.status, error: 'no name in response', raw: JSON.stringify(json).slice(0, 200) });
        continue;
      }

      // Success
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
        body: JSON.stringify({
          name:           u.name,
          rank:           u.rank,
          rank_id:        u.rank_id,
          level:          u.level,
          points:         u.points,
          ranking:        u.ranking        ?? null,
          avatar:         u.avatar         ? `https://www.hackthebox.com${u.avatar}` : null,
          country:        u.country_name   ?? null,
          user_owns:      u.user_owns      ?? null,
          system_owns:    u.system_owns    ?? null,
          challenge_owns: u.challenge_owns ?? null,
        }),
      };
    } catch (err) {
      attempts.push({ url, error: err.message });
    }
  }

  return {
    statusCode: 502,
    headers,
    body: JSON.stringify({ error: 'All HTB endpoints failed', attempts }),
  };
};
