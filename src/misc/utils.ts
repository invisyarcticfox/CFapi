export function checkAuth(c) {
  const authHead = c.req.header('authorization')
  const expAuth = `Bearer ${c.env.API_KEY}`

  if (!authHead || authHead !== expAuth) {
    return false
  }

  return true
}

export function generateId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}