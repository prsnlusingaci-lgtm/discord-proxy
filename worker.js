export default {
  async fetch(request) {
    const DISCORD_TOKEN = 'MTUxNTc1NzQ5ODY5Nzc3NzE5Mw.GMgjIP.5MKj5GKr2kYMT2W1JzqnBOlFI0Pta_nJL_q6pM';
    const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);
    // أي مسار يجي للـ worker نحوله لـ Discord API مباشرة
    const discordUrl = 'https://discord.com/api/v10' + url.pathname + url.search;

    const contentType = request.headers.get('content-type') || '';
    const isFormData  = contentType.includes('multipart');

    let body = undefined;
    if (request.method !== 'GET') {
      body = isFormData ? await request.formData() : await request.text();
    }

    const headers = { 'Authorization': `Bot ${DISCORD_TOKEN}` };
    if (!isFormData && request.method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    const resp = await fetch(discordUrl, { method: request.method, headers, body });
    const data = await resp.text();

    return new Response(data, {
      status: resp.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
};
