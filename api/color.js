export default function handler(req, res) {
  const count = Math.min(parseInt(req.query.count) || 5, 20);
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const colors = Array.from({length: count}, () => {
    const r = randInt(0,255), g = randInt(0,255), b = randInt(0,255);
    return {
      hex: `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`,
      rgb: `rgb(${r},${g},${b})`
    };
  });
  res.json({ count, colors });
}