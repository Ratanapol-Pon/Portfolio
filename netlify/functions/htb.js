// Netlify serverless function — proxies HackTheBox API v4
// Requires env variable: HTB_APP_TOKEN
//
// Always returns a consistent JSON shape:
//   success: { ok: true,  data: { ...profile fields }, error: null }
//   failure: { ok: false, data: null, error: "<message>" }

const HTB_UID    = 2950735;          // ReRoyZ — avoids an extra /user/info call
const BASE_LAB   = 'https://labs.hackthebox.com';
const BASE_WWW   = 'https://www.hackthebox.com';
const TIMEOUT_MS = 5000;

const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

const OK_HEADERS = {
  ...BASE_HEADERS,
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
};

const ERROR_HEADERS = {
  ...BASE_HEADERS,
  'Cache-Control': 'no-store',
};

function ok(data) {
  return { statusCode: 200, headers: OK_HEADERS, body: JSON.stringify({ ok: true, data, error: null }) };
}

function fail(statusCode, error) {
  return { statusCode, headers: ERROR_HEADERS, body: JSON.stringify({ ok: false, data: null, error }) };
}

async function tryGet(url, authHeaders) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: authHeaders, signal: controller.signal });
    const ct  = res.headers.get('content-type') || '';
    if (!res.ok || !ct.includes('json')) return null;
    return await res.json();
  } catch {
    return null; // network error, timeout (abort), or invalid JSON
  } finally {
    clearTimeout(timer);
  }
}

exports.handler = async () => {
  try {
    const token = process.env.HTB_APP_TOKEN;
    if (!token) return fail(503, 'HTB_APP_TOKEN not set.');

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'User-Agent': 'Portfolio/1.0',
    };

    // Try multiple profile endpoints — accept the first that returns a name
    const profileUrls = [
      `${BASE_LAB}/api/v4/profile/${HTB_UID}`,
      `${BASE_WWW}/api/v4/profile/${HTB_UID}`,
      `${BASE_LAB}/api/v4/user/profile/basic/${HTB_UID}`,
      `${BASE_WWW}/api/v4/user/profile/basic/${HTB_UID}`,
    ];

    let raw = null;
    for (const url of profileUrls) {
      const json = await tryGet(url, authHeaders);
      const u = json?.profile ?? json?.info ?? json;
      if (u?.name) { raw = u; break; }
    }

    if (!raw) return fail(502, 'All profile endpoints failed.');

    // Cover every field-name variant HTB has used across API versions
    const avatar = raw.avatar ?? raw.avatar_thumb ?? null;

    return ok({
      id:             HTB_UID,
      name:           raw.name,
      rank:           raw.rank           ?? raw.rank_name       ?? raw.current_rank  ?? null,
      rank_id:        raw.rank_id        ?? null,
      points:         raw.points         ?? raw.user_points     ?? raw.total_points  ?? null,
      ranking:        raw.ranking        ?? raw.global_rank     ?? raw.rank_position ?? null,
      rank_progress:  raw.current_rank_progress ?? null,
      next_rank:      raw.next_rank      ?? null,
      avatar:         avatar ? `https://www.hackthebox.com${avatar}` : null,
      country:        raw.country_name   ?? raw.country         ?? null,
      user_owns:      raw.user_owns      ?? raw.userOwns        ?? null,
      system_owns:    raw.system_owns    ?? raw.systemOwns      ?? null,
      challenge_owns: raw.challenge_owns ?? raw.challengeOwns   ?? null,
    });
  } catch (err) {
    return fail(500, `Unexpected error: ${err?.message || 'unknown'}`);
  }
};
