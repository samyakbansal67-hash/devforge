const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// ─── Fake Data Generators ───────────────────────────────────
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const firstNames = ['Arjun','Priya','Rohan','Sneha','Vikram','Ananya','Aditya','Diya','Ravi','Kavya','Siddharth','Meera','Kiran','Nisha','Varun','Aisha','Manish','Pooja','Arun','Lakshmi'];
const lastNames = ['Sharma','Patel','Singh','Gupta','Kumar','Reddy','Nair','Iyer','Joshi','Mehta','Shah','Verma','Chandra','Rao','Das','Agarwal','Bhatia','Mohan','Srinivas',' Chatterjee'];
const cities = ['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Jaipur','Ahmedabad','Lucknow','Chandigarh','Indore','Bhopal','Coimbatore','Kochi'];
const companies = ['TechCorp','DataDrive','CloudNine','ByteForce','NexGen','AlphaOmega','FutureNet','SoftStack','InfoPeak','CyberLink','NetWorks','CodeBase','DevStudio','AppVentures','WebWorks'];
const domains = ['techcorp.io','datadrive.com','cloudnine.dev','byteforce.tech','nexgen.co','alphaomega.in','futurenet.io','softstack.dev','infopeak.com','cyberlink.in'];
const roles = ['Engineer','Manager','Director','Lead','Senior Developer','Product Manager','Designer','Analyst','Consultant','Architect'];
const domains_tech = ['gmail.com','outlook.com','yahoo.com','protonmail.com','techcorp.io','work.mail'];

app.get('/api/fake/user', (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 1, 100);
  const users = [];
  for (let i = 0; i < count; i++) {
    const fn = rand(firstNames); const ln = rand(lastNames);
    users.push({
      id: `usr_${Math.random().toString(36).slice(2, 10)}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${randInt(1,99)}@${rand(domains_tech)}`,
      phone: `+91${randInt(6000000000,9999999999)}`,
      address: { city: rand(cities), state: rand(cities), zip: `${randInt(100000,999999)}`, country: 'India' },
      company: rand(companies), role: rand(roles),
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
    });
  }
  res.json({ count, users });
});

app.get('/api/fake/company', (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 1, 100);
  const companies_out = [];
  for (let i = 0; i < count; i++) {
    const c = rand(companies); const d = rand(domains);
    companies_out.push({
      id: `co_${Math.random().toString(36).slice(2, 8)}`,
      name: c,
      domain: d,
      email: `hello@${d}`,
      phone: `+91${randInt(4000000000,4999999999)}`,
      address: { city: rand(cities), country: 'India' },
      founded: randInt(2000, 2023),
      employees: randInt(5, 10000),
      type: rand(['Private','Public','Startup',' LLP','NGO'])
    });
  }
  res.json({ count, companies: companies_out });
});

app.get('/api/fake/text', (req, res) => {
  const paragraphs = parseInt(req.query.paragraphs) || 3;
  const text = Array.from({length: paragraphs}, () =>
    `Lorem ipsum dolor sit amet. ${rand(['Technology','Innovation','Design','Development','Business'])} drives our world forward. ` +
    `${rand(['Speed','Quality','Efficiency','Scale','Growth'])} defines success in modern ${rand(['startups','companies','organizations','teams'])}.`
  ).join('\n\n');
  res.json({ paragraphs, text });
});

// ─── Utility Endpoints ───────────────────────────────────────
const { v4: uuidv4 } = require('crypto').randomUUID ? () => require('crypto').randomUUID() : null;

app.get('/api/uuid', (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 1, 50);
  const uuids = Array.from({length: count}, () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  });
  res.json({ uuids });
});

app.get('/api/password', (req, res) => {
  const length = Math.min(Math.max(parseInt(req.query.length) || 16, 8), 128);
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const password = Array.from({length}, (_, i) => charset[Math.floor(Math.random() * charset.length)]).join('');
  res.json({ length, password });
});

app.get('/api/base64/encode', (req, res) => {
  const text = req.query.text || 'Hello World';
  res.json({ original: text, encoded: Buffer.from(text).toString('base64') });
});

app.get('/api/base64/decode', (req, res) => {
  const encoded = req.query.text || '';
  try {
    res.json({ encoded, decoded: Buffer.from(encoded, 'base64').toString('utf8') });
  } catch(e) { res.status(400).json({ error: 'Invalid base64' }); }
});

app.get('/api/json/format', (req, res) => {
  const json = req.query.json || '{"name":"DevForge","version":"1.0"}';
  try {
    const parsed = JSON.parse(json);
    res.json({ valid: true, formatted: JSON.stringify(parsed, null, 2) });
  } catch(e) { res.status(400).json({ valid: false, error: e.message }); }
});

app.get('/api/color/random', (req, res) => {
  const count = Math.min(parseInt(req.query.count) || 5, 20);
  const colors = Array.from({length: count}, () => {
    const r = randInt(0,255), g = randInt(0,255), b = randInt(0,255);
    return { hex: `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`, rgb: `rgb(${r},${g},${b})` };
  });
  res.json({ count, colors });
});

app.get('/api/user-agent/parse', (req, res) => {
  const ua = req.query.ua || req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';
  const isMobile = /mobile|android|iphone/i.test(ua);
  const isBot = /bot|crawl|spider/i.test(ua);
  const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/)?.[0] || 'Unknown';
  const os = ua.match(/\(([^)]+)\)/)?.[1] || 'Unknown OS';
  res.json({ ua, browser, os, isMobile, isBot });
});

// ─── Health & Info ────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    name: 'DevForge API',
    version: '1.0.0',
    endpoints: ['/api/fake/user','/api/fake/company','/api/fake/text','/api/uuid','/api/password','/api/base64/encode','/api/base64/decode','/api/json/format','/api/color/random','/api/user-agent/parse'],
    docs: '/api/docs',
    buy: '/buy.html'
  });
});

app.get('/api/docs', (req, res) => {
  res.json({
    title: 'DevForge API Documentation',
    usage: 'Append query parameters to each endpoint. Example: /api/fake/user?count=5',
    authentication: 'none — currently open access',
    rateLimit: '100 requests per minute',
    buyLifetime: '/buy.html — Lifetime access for ₹999',
    endpoints: [
      { method: 'GET', path: '/api/fake/user', params: { count: '1-100' }, description: 'Generate fake user profiles (Indian names)' },
      { method: 'GET', path: '/api/fake/company', params: { count: '1-100' }, description: 'Generate fake company data' },
      { method: 'GET', path: '/api/fake/text', params: { paragraphs: '1-10' }, description: 'Generate placeholder text' },
      { method: 'GET', path: '/api/uuid', params: { count: '1-50' }, description: 'Generate UUIDs' },
      { method: 'GET', path: '/api/password', params: { length: '8-128' }, description: 'Generate secure passwords' },
      { method: 'GET', path: '/api/base64/encode', params: { text: 'string' }, description: 'Base64 encode' },
      { method: 'GET', path: '/api/base64/decode', params: { text: 'base64 string' }, description: 'Base64 decode' },
      { method: 'GET', path: '/api/json/format', params: { json: 'JSON string' }, description: 'Validate and format JSON' },
      { method: 'GET', path: '/api/color/random', params: { count: '1-20' }, description: 'Generate random colors' },
      { method: 'GET', path: '/api/user-agent/parse', params: { ua: 'string' }, description: 'Parse user agent string' },
    ]
  });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`DevForge running on port ${PORT}`));