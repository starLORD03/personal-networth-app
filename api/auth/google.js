export default function handler(req, res) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const BASE_URL = `${protocol}://${host}`;
  
  if (!GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: 'Missing GOOGLE_CLIENT_ID' });
  }

  const { redirect_uri, state, scope } = req.query;
  
  // Detect platform from redirect_uri or state
  let platform = 'web';
  let clientRedirectUri = redirect_uri;
  
  if (redirect_uri && (redirect_uri.startsWith('exp://') || redirect_uri.startsWith('networth://'))) {
    platform = 'mobile';
  } else if (state && state.startsWith('mobile|')) {
    platform = 'mobile';
  }
  
  // Store the client's redirect URI in state for callback
  const fullState = `${platform}|${clientRedirectUri || ''}|${state || ''}`;
  
  const callbackUrl = `${BASE_URL}/api/auth/callback`;
  
  console.log('OAuth init:', { platform, clientRedirectUri, fullState });
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: scope || 'profile email openid',
    state: fullState,
    prompt: 'select_account',
    hl: 'en'
  });
  
  res.redirect(302, `https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}