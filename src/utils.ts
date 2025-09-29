import type { AppContext } from './types'


export function checkAuth(c:AppContext):boolean {
  const authHead = c.req.header('authorization')
  const expAuth = `Bearer ${c.env.VERY_SECRET_API_KEY}`
  if (!authHead || authHead !== expAuth) return false
  return true
}

export function generateId(length:number=8):string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < length; i++) id += chars.charAt(Math.floor(Math.random() * chars.length))
  return id
}