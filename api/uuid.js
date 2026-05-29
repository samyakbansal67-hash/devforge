export default function handler(req, res) {
  const count = Math.min(parseInt(req.query.count) || 1, 50);
  const uuids = Array.from({length: count}, () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    })
  );
  res.json({ uuids });
}