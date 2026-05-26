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
    // Step 1: get user ID from basic info
    const infoJson = await htbGet('/user/info');
    const info = infoJson.info ?? infoJson;
    const uid = info.id;

    if (!uid) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'No user ID returned', raw: infoJson }),
      };
    }

    // Step 2: get full profile stats using the user ID
    let p = {};
    let profileError = null;
    try {
      const profJson = await htbGet(`/profile/${uid}`);
      p = profJson.profile ?? profJson;
    } catch (e) {
      profileError = e.message;
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
        rank_id:        p.rank_id        ?? info.rank_id ?? null,
        level:          p.level          ?? null,
        points:         p.points         ?? null,
        ranking:        p.ranking        ?? null,
        avatar:         avatar ? `https://www.hackthebox.com${avatar}` : null,
        country:        p.country_name   ?? p.country ?? null,
        user_owns:      p.user_owns      ?? null,
        system_owns:    p.system_owns    ?? null,
        challenge_owns: p.challenge_owns ?? null,
        _profileError:  profileError,
        _profileRaw:    Object.keys(p).length > 0 ? p : undefined,
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
