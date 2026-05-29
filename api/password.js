export default function handler(req, res) {
  const length = Math.min(Math.max(parseInt(req.query.length) || 16, 8), 64);
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const password = Array.from({length}, () => charset[Math.floor(Math.random() * charset.length)]).join('');
  res.json({ length, password });
}