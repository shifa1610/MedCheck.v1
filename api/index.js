import vercelHandler from '../server/vercelHandler.js';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  const rewrittenUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const apiPath = rewrittenUrl.searchParams.get('path') || '';
  if (!/^[a-zA-Z0-9/_-]*$/.test(apiPath)) {
    return res.status(400).json({ error: 'Invalid API route.' });
  }

  rewrittenUrl.searchParams.delete('path');
  req.url = `/api/${apiPath}${rewrittenUrl.search}`;
  return vercelHandler(req, res);
}
