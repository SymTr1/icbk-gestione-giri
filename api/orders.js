export default async function handler(req, res) {
  const apiKey = process.env.ICBK_DB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ICBK_DB_API_KEY not configured' });
  }

  const baseUrl = 'https://collegamento-db-produzione-icbk.vercel.app';

  // Forward query params
  const params = new URLSearchParams();
  if (req.query.date) params.set('date', req.query.date);
  if (req.query.from) params.set('from', req.query.from);
  if (req.query.to) params.set('to', req.query.to);
  if (req.query.status) params.set('status', req.query.status);
  if (req.query.driver) params.set('driver', req.query.driver);
  if (req.query.customer) params.set('customer', req.query.customer);
  if (req.query.limit) params.set('limit', req.query.limit);
  if (req.query.offset) params.set('offset', req.query.offset);

  const qs = params.toString();
  const url = `${baseUrl}/api/orders${qs ? '?' + qs : ''}`;

  try {
    const response = await fetch(url, {
      headers: { 'x-api-key': apiKey }
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch orders: ' + err.message });
  }
}
