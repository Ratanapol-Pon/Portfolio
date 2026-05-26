// Netlify serverless function — proxies HackTheBox API v4
// Requires env variable: HTB_APP_TOKEN
// Generate at: app.hackthebox.com → Account Settings → API Tokens → Add New Token

const BASE = 'https://www.hackthebox.com/api/v4';

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

  async function htbGet(path) {
    const res = await fetch(`${BASE}${path}`, { headers: authHeaders });
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('json')) throw new Error(`non-JSON from ${path} (status ${res.status})`);
    const json = await res.json();
    if (!res.ok) throw new Error(`${res.status} from ${path}: ${JSON.stringify(json).slice(0, 200)}`);
    return json;
  }

  try {
    // Step 1: get basic info + user ID
    const infoJson = await htbGet('/user/info');
    const info = infoJson.info ?? infoJson;

    if (!info || !info.id) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'No user ID in /user/info', raw: JSON.stringify(infoJson).slice(0, 400) }),
      };
    }

    const uid = info.id;

    // Step 2: get full profile stats by ID
    let profile = null;
    try {
      const profJson = await htbGet(`/profile/${uid}`);
      profile = profJson.profile ?? profJson;
    } catch (e) {
      // profile fetch failed — fall back to info only
    }

    const u = profile ?? info;

    const avatar = u.avatar ?? info.avatar;

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
      body: JSON.stringify({
        name:           u.name           ?? info.name,
        rank:           u.rank           ?? info.rank           ?? null,
        rank_id:        u.rank_id        ?? info.rank_id        ?? null,
        level:          u.level          ?? info.level          ?? null,
        points:         u.points         ?? info.points         ?? null,
        ranking:        u.ranking        ?? info.ranking        ?? null,
        avatar:         avatar           ? `https://www.hackthebox.com${avatar}` : null,
        country:        u.country_name   ?? info.country_name   ?? null,
        user_owns:      u.user_owns      ?? info.user_owns      ?? null,
        system_owns:    u.system_owns    ?? info.system_owns    ?? null,
        challenge_owns: u.challenge_owns ?? info.challenge_owns ?? null,
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
