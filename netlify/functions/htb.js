// Netlify serverless function — proxies HackTheBox API v4
// Requires env variable: HTB_APP_TOKEN

const HTB_UID  = 2950735;          // ReRoyZ — avoids an extra /user/info call
const BASE_LAB = 'https://labs.hackthebox.com';
const BASE_WWW = 'https://www.hackthebox.com';

exports.handler = async () => {
  const token = process.env.HTB_APP_TOKEN;

  const respHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (!token) {
    return { statusCode: 503, headers: respHeaders, body: JSON.stringify({ error: 'HTB_APP_TOKEN not set.' }) };
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'User-Agent': 'Portfolio/1.0',
  };

  async function tryGet(url) {
    try {
      const res = await fetch(url, { headers: authHeaders });
      const ct  = res.headers.get('content-type') || '';
      if (!ct.includes('json')) return null;
      const json = await res.json();
      return res.ok ? json : null;
    } catch {
      return null;
    }
  }

  // Try multiple profile endpoints — accept the first that returns a name
  const profileUrls = [
    `${BASE_LAB}/api/v4/profile/${HTB_UID}`,
    `${BASE_WWW}/api/v4/profile/${HTB_UID}`,
    `${BASE_LAB}/api/v4/user/profile/basic/${HTB_UID}`,
    `${BASE_WWW}/api/v4/user/profile/basic/${HTB_UID}`,
  ];

  let raw = null;
  for (const url of profileUrls) {
    const json = await tryGet(url);
    const u = json?.profile ?? json?.info ?? json;
    if (u?.name) { raw = u; break; }
  }

  if (!raw) {
    return { statusCode: 502, headers: respHeaders, body: JSON.stringify({ error: 'All profile endpoints failed' }) };
  }

  // Cover every field-name variant HTB has used across API versions
  const avatar = raw.avatar ?? raw.avatar_thumb ?? null;

  return {
    statusCode: 200,
    headers: { ...respHeaders, 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    body: JSON.stringify({
      name:           raw.name,
      rank:           raw.rank           ?? raw.rank_name        ?? raw.current_rank   ?? null,
      rank_id:        raw.rank_id        ?? null,
      level:          raw.level          ?? raw.current_level    ?? raw.user_level     ?? null,
      points:         raw.points         ?? raw.user_points      ?? raw.total_points   ?? null,
      ranking:        raw.ranking        ?? raw.global_rank      ?? raw.rank_position  ?? null,
      avatar:         avatar ? `https://www.hackthebox.com${avatar}` : null,
      country:        raw.country_name   ?? raw.country          ?? null,
      user_owns:      raw.user_owns      ?? raw.userOwns         ?? null,
      system_owns:    raw.system_owns    ?? raw.systemOwns       ?? null,
      challenge_owns: raw.challenge_owns ?? raw.challengeOwns    ?? null,
      _raw:           raw,
    }),
  };
};
