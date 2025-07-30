export function checkAuth(c:any):boolean {
  const authHead = c.req.header('authorization')
  const expAuth = `Bearer ${c.env.API_KEY}`
  if (!authHead || authHead !== expAuth) return false
  return true
}

export function generateId(length:number=8):string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < length; i++) id += chars.charAt(Math.floor(Math.random() * chars.length))
  return id
}