export default function handler(req, res) {
  const count = Math.min(parseInt(req.query.count) || 1, 100);
  const firstNames = ['Arjun','Priya','Rohan','Sneha','Vikram','Ananya','Aditya','Diya','Ravi','Kavya'];
  const lastNames = ['Sharma','Patel','Singh','Gupta','Kumar','Reddy','Nair','Iyer','Joshi','Mehta'];
  const cities = ['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Pune','Jaipur','Ahmedabad','Lucknow','Chandigarh'];
  const roles = ['Engineer','Manager','Director','Lead','Developer','Designer','Analyst'];
  const rand = arr => arr[Math.floor(Math.random() * arr.length)];
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const users = Array.from({length: count}, () => {
    const fn = rand(firstNames), ln = rand(lastNames);
    return {
      id: `usr_${Math.random().toString(36).slice(2, 10)}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@gmail.com`,
      phone: `+91${randInt(6000000000, 9999999999)}`,
      city: rand(cities),
      role: rand(roles)
    };
  });

  res.json({ count, users });
}