// Test utility to check cookies
export const debugCookies = () => {
  console.log('🍪 All cookies:', document.cookie);
  
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  console.log('🍪 Parsed cookies:', cookies);
  
  // Check for auth-related cookies
  const authCookies = Object.keys(cookies).filter(key => 
    key.includes('access') || 
    key.includes('refresh') || 
    key.includes('session')
  );
  
  console.log('🔐 Auth cookies found:', authCookies);
  console.log('🔐 Auth cookie values:', {
    access_token: cookies['access_token'] ? 'EXISTS' : 'MISSING',
    refresh_token: cookies['refresh_token'] ? 'EXISTS' : 'MISSING', 
    session_id: cookies['session_id'] ? 'EXISTS' : 'MISSING'
  });
  
  return cookies;
};

// Function to manually test the auth/me endpoint
export const testAuthMe = async () => {
  try {
    console.log('🧪 Testing /auth/me endpoint...');
    debugCookies();
    
    const response = await fetch('https://adwar-backend-project.onrender.com/auth/me', {
      method: 'GET',
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('🧪 /auth/me response status:', response.status);
    console.log('🧪 /auth/me response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('🧪 /auth/me response data:', data);
      return { status: response.status, data };
    } else {
      const errorData = await response.text();
      console.log('🧪 /auth/me error data:', errorData);
      return { status: response.status, error: errorData };
    }
  } catch (error) {
    console.error('🧪 /auth/me test error:', error);
    return { error };
  }
};

// Function to test tenants endpoint
export const testTenants = async () => {
  try {
    console.log('🧪 Testing /tenants endpoint...');
    debugCookies();
    
    const response = await fetch('https://adwar-backend-project.onrender.com/tenants', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('🧪 /tenants response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('🧪 /tenants response data:', data);
      return { status: response.status, data };
    } else {
      const errorData = await response.text();
      console.log('🧪 /tenants error data:', errorData);
      return { status: response.status, error: errorData };
    }
  } catch (error) {
    console.error('🧪 /tenants test error:', error);
    return { error };
  }
};

// Add to window for debugging
if (typeof window !== 'undefined') {
  (window as any).debugAuth = {
    debugCookies,
    testAuthMe,
    testTenants,
  };
  
  console.log('🔧 Debug functions available: window.debugAuth.debugCookies(), window.debugAuth.testAuthMe(), window.debugAuth.testTenants()');
}
