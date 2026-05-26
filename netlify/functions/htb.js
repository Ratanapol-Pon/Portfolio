// Netlify serverless function — proxies HackTheBox API v4
// Requires env variable: HTB_APP_TOKEN
// Generate at: app.hackthebox.com → Profile → Settings → API Key → Create App Token

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
      body: JSON.stringify({ error: 'HTB_APP_TOKEN not configured in Netlify environment variables.' }),
    };
  }

  try {
    const res = await fetch('https://app.hackthebox.com/api/v4/user/info', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'User-Agent': 'Portfolio/1.0',
      },
    });

    if (!res.ok) {
      const errBody = await res.text();
      return {
        statusCode: res.status,
        headers,
        body: JSON.stringify({ error: `HTB API responded with ${res.status}`, detail: errBody }),
      };
    }

    const json = await res.json();
    const u = json.info ?? json.profile ?? json;
    if (!u || !u.name) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'Unexpected API shape', raw: JSON.stringify(json).slice(0, 300) }),
      };
    }

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
        ranking:        u.ranking         ?? null,
        avatar:         u.avatar          ? `https://www.hackthebox.com${u.avatar}` : null,
        country:        u.country_name    ?? null,
        user_owns:      u.user_owns       ?? null,
        system_owns:    u.system_owns     ?? null,
        challenge_owns: u.challenge_owns  ?? null,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
