import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const JWT_SECRET = process.env.JWT_SECRET;

  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const BASE_URL = `${protocol}://${host}`;

  const { code, state, error } = req.query;

    if (error) {
    // Parse state to get redirect URI even for errors
    const stateParts = (state || '').split('|');
    const [platform, clientRedirectUri] = stateParts;
    
    let redirectUrl;
    if (platform === 'mobile' && clientRedirectUri) {
      redirectUrl = `${clientRedirectUri}?error=${encodeURIComponent(error)}`;
    } else {
      // Fallback to custom scheme
      redirectUrl = `networth://auth?error=${encodeURIComponent(error)}`;
    }
    
    return res.send(generateRedirectHTML(redirectUrl));
  }

  if (!code) {
    return res.status(400).json({ error: 'No authorization code' });
  }

  try {
    const callbackUrl = `${BASE_URL}/api/auth/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }).toString(),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      throw new Error(tokens.error_description || 'Token exchange failed');
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await userResponse.json();

    // Create JWT session token
    const sessionToken = jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

            // Parse state to get platform and client redirect URI
    const stateParts = (state || '').split('|');
    const [platform, clientRedirectUri] = stateParts;

    console.log('Callback state parsed:', { platform, clientRedirectUri, fullState: state });

    let redirectUrl;
    
    if (platform === 'mobile' && clientRedirectUri) {
      // Use the exact redirect URI that the client sent
      // This works for both development (exp://) and production (networth://)
      redirectUrl = `${clientRedirectUri}?token=${sessionToken}`;
      console.log('Using client redirect URI');
    } else if (platform === 'mobile') {
      // Fallback: Use custom scheme for production standalone app
      // This will work in production APK
      redirectUrl = `networth://auth?token=${sessionToken}`;
      console.log('Using fallback custom scheme');
    } else {
      // Web platform
      const FRONTEND_URL = process.env.EXPO_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
      redirectUrl = `${FRONTEND_URL}?token=${sessionToken}`;
      console.log('Using web redirect');
    }
    
    console.log('Final redirect URL:', redirectUrl);
    
    // Return HTML page that will auto-redirect
    res.send(generateRedirectHTML(redirectUrl));

    } catch (error) {
    console.error('OAuth error:', error);
    
    // Parse state for error redirect too
    const stateParts = (state || '').split('|');
    const [platform, clientRedirectUri] = stateParts;
    
    let redirectUrl;
    if (platform === 'mobile' && clientRedirectUri) {
      redirectUrl = `${clientRedirectUri}?error=${encodeURIComponent(error.message)}`;
    } else if (platform === 'mobile') {
      // Fallback to custom scheme for production
      redirectUrl = `networth://auth?error=${encodeURIComponent(error.message)}`;
    } else {
      const FRONTEND_URL = process.env.EXPO_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
      redirectUrl = `${FRONTEND_URL}?error=${encodeURIComponent(error.message)}`;
    }
    
    res.send(generateRedirectHTML(redirectUrl));
  }
}

function generateRedirectHTML(redirectUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Authentication Successful</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          text-align: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        .success-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
        }
        p {
          margin: 10px 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 3px solid white;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .manual-link {
          margin-top: 20px;
          padding: 12px 24px;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 8px;
          display: inline-block;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success-icon">✓</div>
        <h1>Authentication Successful!</h1>
        <p>Redirecting you back to the app...</p>
        <div class="spinner"></div>
        <p style="font-size: 14px; margin-top: 20px;">
          If you're not redirected automatically,<br>
          <a href="${redirectUrl}" class="manual-link">Click here to open the app</a>
        </p>
      </div>
      <script>
        // Multiple redirect strategies for better compatibility
        
        // Strategy 1: Immediate redirect
        window.location.href = '${redirectUrl}';
        
        // Strategy 2: Try after a short delay
        setTimeout(function() {
          window.location.replace('${redirectUrl}');
        }, 500);
        
        // Strategy 3: Try opening in a new window (for some browsers)
        setTimeout(function() {
          window.open('${redirectUrl}', '_self');
        }, 1000);
        
        // Strategy 4: Close the browser after redirect attempt
        setTimeout(function() {
          window.close();
        }, 2000);
      </script>
    </body>
    </html>
  `;
}
