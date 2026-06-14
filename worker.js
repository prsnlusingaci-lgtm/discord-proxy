export default {
  async fetch(request) {
    const DISCORD_TOKEN = 'MTUxNTc1NzQ5ODY5Nzc3NzE5Mw.GMgjIP.5MKj5GKr2kYMT2W1JzqnBOlFI0Pta_nJL_q6pM';
    const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);
    const discordPath = url.pathname.replace('/discord', '');
    const discordUrl  = `https://discord.com/api/v10${discordPath}${url.search}`;

    const isFormData = request.headers.get('content-type')?.includes('multipart');
    const body = request.method !== 'GET' ? (isFormData ? await request.formData() : await request.text()) : null;

    const headers = { 'Authorization': `Bot ${DISCORD_TOKEN}` };
    if (!isFormData) headers['Content-Type'] = 'application/json';

    const resp = await fetch(discordUrl, {
      method: request.method,
      headers,
      body: body || undefined,
    });

    const data = await resp.text();
    return new Response(data, {
      status: resp.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
};
