import React, { useState, useEffect } from 'react';
import './Login.css';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [token, setToken] = useState(null);
  let query = useQuery();

  useEffect(() => {
    const token = query.get('token');
    if (token) {
      setToken(token);
    }
  }, [query]);

  const handleAuth = () => {
    const clientId = '5a78ffbe-2e0a-466f-8305-f6cfaa603fb9';
    const redirectUri = 'http://localhost:8000/callback';  // 백엔드의 콜백 URL
    const scope = 'login inquiry transfer';
    const state = '12345678901234567890123456789012';
    const authType = '0';
    const cellphoneCertYn = 'Y';
    const authorizedCertYn = 'Y';

    const authUrl = `https://testapi.openbanking.or.kr/oauth/2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&auth_type=${authType}&cellphone_cert_yn=${cellphoneCertYn}&authorized_cert_yn=${authorizedCertYn}`;
    
    window.location.href = authUrl;
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container">
        <form>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-github"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          {token && <input type="text" value={token} readOnly placeholder="Token" />} {/* 토큰 표시 */}
          <button type="button" className="verify-button" onClick={handleAuth}>인증 받기</button>
          <button>Sign Up</button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form>
          <h1>Sign In</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-github"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for login</span>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          {token && <input type="text" value={token} readOnly placeholder="Token" />} {/* 토큰 표시 */}
          <a href="#">Forgot your password?</a>
          <button>Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={() => setIsSignUp(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" onClick={() => setIsSignUp(true)}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
