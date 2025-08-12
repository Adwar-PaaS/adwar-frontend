// Debug function to check if cookies are being set
export const debugCookiesAfterLogin = () => {
  console.log('🍪 COOKIE DEBUG AFTER LOGIN:');
  console.log('🍪 document.cookie:', document.cookie);
  
  // Check for specific auth cookies
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  console.log('🍪 Parsed cookies:', cookies);
  
  // Check for auth-related cookies
  const authCookieNames = ['access_token', 'refresh_token', 'session_id', 'accessToken', 'refreshToken', 'sessionId'];
  const foundAuthCookies = authCookieNames.filter(name => cookies[name]);
  
  console.log('🔐 Auth cookies found:', foundAuthCookies);
  console.log('🔐 Auth cookie values:', foundAuthCookies.reduce((acc, name) => {
    acc[name] = cookies[name];
    return acc;
  }, {} as Record<string, string>));
  
  return cookies;
};

// Function to make a test request and see what headers are sent
export const testRequest = async () => {
  try {
    console.log('🧪 Making test request to /tenants...');
    debugCookiesAfterLogin();
    
    const response = await fetch('https://adwar-backend-project.onrender.com/tenants', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('🧪 Test response status:', response.status);
    console.log('🧪 Test response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('🧪 Test response data:', data);
    } else {
      console.log('🧪 Test response failed:', response.statusText);
    }
    
    return response;
  } catch (error) {
    console.error('🧪 Test request error:', error);
    return error;
  }
};

// Add to window for manual testing
if (typeof window !== 'undefined') {
  (window as any).debugCookiesAfterLogin = debugCookiesAfterLogin;
  (window as any).testRequest = testRequest;
}
