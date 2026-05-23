export default async function handler(req, res) {
  const address = req.query.address;
  if (!address) {
    return res.status(400).json({ error: 'Missing address parameter' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Google Maps API key not configured' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&region=it`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const loc = data.results[0].geometry.location;
      return res.status(200).json({ lat: loc.lat, lng: loc.lng });
    }

    return res.status(200).json({ lat: null, lng: null });
  } catch (err) {
    return res.status(500).json({ error: 'Geocoding failed' });
  }
}
