// Simple test to run in browser console after login
export const testAfterLogin = () => {
  console.log('=== POST-LOGIN DIAGNOSTICS ===');
  
  // 1. Check cookies
  console.log('🍪 All cookies:', document.cookie);
  
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  console.log('🍪 Parsed cookies:', cookies);
  
  // 2. Check specific auth cookies
  const authCookieStatus = {
    access_token: cookies['access_token'] ? '✅ EXISTS' : '❌ MISSING',
    refresh_token: cookies['refresh_token'] ? '✅ EXISTS' : '❌ MISSING',
    session_id: cookies['session_id'] ? '✅ EXISTS' : '❌ MISSING'
  };
  
  console.log('🔐 Auth cookies status:', authCookieStatus);
  
  // 3. Check localStorage
  const authState = localStorage.getItem('auth');
  console.log('💾 localStorage auth:', authState ? JSON.parse(authState) : 'EMPTY');
  
  // 4. Test a simple authenticated request
  console.log('🧪 Testing authenticated request to /auth/me...');
  
  return fetch('https://adwar-backend-project.onrender.com/auth/me', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    console.log('🧪 /auth/me status:', response.status);
    return response.json().then(data => {
      console.log('🧪 /auth/me response:', data);
      return { status: response.status, data };
    });
  })
  .catch(error => {
    console.error('🧪 /auth/me error:', error);
    return { error };
  });
};

// Add to window
if (typeof window !== 'undefined') {
  (window as any).testAfterLogin = testAfterLogin;
  console.log('🔧 Run window.testAfterLogin() after logging in to diagnose the issue');
}
