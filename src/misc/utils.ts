import crypto from 'crypto'


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

export function generateOAuthHeader(
{ apiKey, apiSecret, accessToken, accessSecret }:
{ apiKey: string, apiSecret: string, accessToken: string, accessSecret: string }
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const nonce = crypto.randomBytes(32).toString('base64').replace(/\W/g, '')
  const METHOD = 'POST'
  const URL = 'https://api.x.com/2/tweets'

  const oauthParams = {
    oauth_consumer_key: apiKey,
    oauth_token: accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: '1.0',
  }

  const paramString = Object.keys(oauthParams)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key as keyof typeof oauthParams])}`)
    .join('&')
  
  const baseString = [
    METHOD,
    encodeURIComponent(URL),
    encodeURIComponent(paramString),
  ].join('&')
  
  const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`
  
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64')
    
  const oauthHeader = 'OAuth ' + Object.entries({
    ...oauthParams,
    oauth_signature: signature,
  }).map(([key, val]) => `${encodeURIComponent(key)}="${encodeURIComponent(val)}"`).join(', ')

  return oauthHeader
}