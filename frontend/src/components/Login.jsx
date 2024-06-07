import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userName, setUserName] = useState('');
  const [userCi, setUserCi] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userSeqNo, setUserSeqNo] = useState('');

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { accessToken, userSeqNo } = location.state;
      setAccessToken(accessToken);
      setUserSeqNo(userSeqNo);
    }
  }, [location.state]);

  const handleAuth = () => {
    const clientId = '5a78ffbe-2e0a-466f-8305-f6cfaa603fb9';
    const redirectUri = 'http://localhost:8000/callback';
    const scope = 'login inquiry transfer';
    const state = '12345678901234567890123456789012';
    const authType = '0';
    const cellphoneCertYn = 'Y';
    const authorizedCertYn = 'Y';

    const authUrl = `https://testapi.openbanking.or.kr/oauth/2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&auth_type=${authType}&cellphone_cert_yn=${cellphoneCertYn}&authorized_cert_yn=${authorizedCertYn}`;
    
    window.location.href = authUrl;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const userData = {
      user_name: userName,
      user_ci: userCi,
      user_email: userEmail
    };

    try {
      const response = await fetch('http://localhost:8000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('User registration failed');
      }

      const data = await response.json();
      console.log('User registered:', data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUp}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-github"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
          <input type="text" placeholder="CI" value={userCi} onChange={(e) => setUserCi(e.target.value)} />
          <input type="email" placeholder="Email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
          <button type="submit">Sign Up</button>
          <input type="hidden" id="userAccessToken" value={accessToken} />
          <input type="hidden" id="userSeqNo" value={userSeqNo} />
        </form>
        <button onClick={handleAuth}>Authorize</button>
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
          <a href="#">Forgot your password?</a>
          <button type="submit">Sign In</button>
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
};

export default Login;