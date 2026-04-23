const http = require('http');

async function testLogin() {
  try {
    // 1. Get CSRF Token
    const res1 = await fetch('http://localhost:3000/api/auth/csrf');
    const csrfData = await res1.json();
    const csrfToken = csrfData.csrfToken;
    const setCookie = res1.headers.get('set-cookie');
    
    // 2. Post login
    const formData = new URLSearchParams();
    formData.append('email', 'admin@admin.com');
    formData.append('password', 'Aakriti_Safe_Admin2026');
    formData.append('csrfToken', csrfToken);
    formData.append('callbackUrl', '/dashboard');
    formData.append('json', 'true');
    
    const res2 = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': setCookie
      },
      body: formData.toString()
    });
    
    const loginData = await res2.json();
    console.log("Login Response:", loginData);
    
    // 3. Fetch Dashboard
    if (loginData.url) {
      const loginCookies = res2.headers.get('set-cookie');
      console.log("Got Cookies for session.");
      const res3 = await fetch('http://localhost:3000/dashboard', {
        headers: { 'Cookie': loginCookies }
      });
      console.log("Dashboard Status:", res3.status);
      const html = await res3.text();
      if (res3.status === 500) {
        console.log("DASHBOARD CRASHED. snippet:", html.substring(0, 500));
      } else if (res3.status === 302 || res3.status === 307) {
        console.log("DASHBOARD REDIRECTED to:", res3.headers.get('location'));
        // 4. Fetch Admin Dashboard
        const res4 = await fetch('http://localhost:3000/admin/dashboard', {
          headers: { 'Cookie': loginCookies }
        });
        console.log("Admin Dashboard Status:", res4.status);
        if (res4.status === 500) {
           console.log("ADMIN DASH CRASHED.", (await res4.text()).substring(0, 300));
        }
      }
    }
  } catch(e) { console.error(e) }
}
testLogin();
