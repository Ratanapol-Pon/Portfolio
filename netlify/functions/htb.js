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

  const candidates = [
    'https://www.hackthebox.com/api/v4/user/info',
    'https://www.hackthebox.com/api/v4/profile/info',
    'https://labs.hackthebox.com/api/v4/user/info',
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { headers: authHeaders });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('json')) continue;
      if (!res.ok) continue;

      const json = await res.json();
      const u = json.info ?? json.profile ?? json;
      if (!u || !u.name) continue;

      // Return ALL raw fields for debugging + standard mapped fields
      const avatar = u.avatar ?? u.avatar_thumb ?? null;

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
        body: JSON.stringify({
          // Mapped fields (used by frontend)
          name:           u.name,
          rank:           u.rank           ?? null,
          rank_id:        u.rank_id        ?? null,
          level:          u.current_level  ?? u.level          ?? null,
          points:         u.points         ?? u.user_points    ?? null,
          ranking:        u.ranking        ?? u.global_rank    ?? null,
          avatar:         avatar ? `https://www.hackthebox.com${avatar}` : null,
          country:        u.country_name   ?? u.country        ?? null,
          user_owns:      u.user_owns      ?? null,
          system_owns:    u.system_owns    ?? null,
          challenge_owns: u.challenge_owns ?? null,
          // Raw dump so we can see every field the API returns
          _raw: u,
        }),
      };
    } catch (_) {
      continue;
    }
  }

  return {
    statusCode: 502,
    headers,
    body: JSON.stringify({ error: 'All HTB endpoints failed or returned no data' }),
  };
};
