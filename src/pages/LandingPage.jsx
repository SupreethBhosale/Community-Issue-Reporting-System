import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, Phone, User, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { registerWithEmail, loginWithEmail, loginWithGoogle, setupRecaptcha, sendOTP, verifyOTP } from '../services/auth';
import { auth } from '../services/firebase';

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState('email'); // email, phone
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authMethod === 'phone') {
      setupRecaptcha('recaptcha-container');
    }
  }, [authMethod, isLogin]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (auth.app.options.apiKey === "YOUR_KEY") {
      toast.error("⚠️ Setup Required: Please add your real Firebase API Key in src/services/firebase.js to enable authentication.");
      setLoading(false);
      return;
    }
    
    try {
      if (isAdminLogin) {
        // Admin uses standard email/password (in reality, check role in Firestore later)
        await loginWithEmail(email, password);
        toast.success('Admin logged in successfully!');
        navigate('/admin');
      } else if (authMethod === 'email') {
        if (isLogin) {
          await loginWithEmail(email, password);
          toast.success('Successfully logged in!');
        } else {
          await registerWithEmail(email, password, name);
          toast.success('Account created successfully!');
        }
        
        if (email.trim().toLowerCase() === 'admin@sevakendra.com') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else if (authMethod === 'phone') {
        if (!otpSent) {
          await sendOTP(phoneNumber);
          setOtpSent(true);
          toast.success('OTP sent to your phone!');
          setLoading(false);
          return;
        } else {
          await verifyOTP(otp);
          toast.success('Phone verified successfully!');
          navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
    
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    if (auth.app.options.apiKey === "YOUR_KEY") {
      toast.error("⚠️ Setup Required: Please add your real Firebase API Key in src/services/firebase.js to enable Google login.");
      return;
    }

    try {
      await loginWithGoogle();
      toast.success('Successfully logged in with Google!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="glass-panel" style={{ margin: '16px', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.5rem' }}>
          <Leaf size={28} />
          Seva Kendra
        </div>
        <div style={{ display: 'flex', gap: '32px' }}>
          <a href="#about" style={{ fontWeight: 600 }}>About Us</a>
          <a href="#contact" style={{ fontWeight: 600 }}>Contact Us</a>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', padding: '0 16px', gap: '16px', marginBottom: '16px' }}>
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel" 
          style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px', maxWidth: '500px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '8px' }}>
              {isLogin ? (isAdminLogin ? 'Admin Portal' : 'Welcome Back') : 'Join Us'}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>
              {isLogin ? 'Sign in to access your dashboard' : 'Create an account to report issues'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'rgba(0,0,0,0.05)', padding: '4px', borderRadius: '12px' }}>
            <button 
              onClick={() => { setIsLogin(true); setIsAdminLogin(false); setAuthMethod('email'); }}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: isLogin && !isAdminLogin ? 'white' : 'transparent', fontWeight: 600, cursor: 'pointer', boxShadow: isLogin && !isAdminLogin ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
            >
              User Login
            </button>
            <button 
              onClick={() => { setIsLogin(false); setIsAdminLogin(false); setAuthMethod('email'); }}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: !isLogin ? 'white' : 'transparent', fontWeight: 600, cursor: 'pointer', boxShadow: !isLogin ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
            >
              Sign Up
            </button>
            <button 
              onClick={() => { setIsLogin(true); setIsAdminLogin(true); setAuthMethod('email'); }}
              style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: isAdminLogin ? 'white' : 'transparent', fontWeight: 600, cursor: 'pointer', boxShadow: isAdminLogin ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
            >
              Admin
            </button>
          </div>

          {!isAdminLogin && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              <button 
                onClick={() => setAuthMethod('email')}
                className={authMethod === 'email' ? 'glass-button' : 'glass-button-outline'}
                style={{ flex: 1 }}
              >
                <Mail size={16} /> Email
              </button>
              <button 
                onClick={() => setAuthMethod('phone')}
                className={authMethod === 'phone' ? 'glass-button' : 'glass-button-outline'}
                style={{ flex: 1 }}
                id="recaptcha-container"
              >
                <Phone size={16} /> Phone
              </button>
            </div>
          )}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && authMethod === 'email' && (
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="glass-input" style={{ paddingLeft: '40px' }} placeholder="John Doe" required />
                </div>
              </div>
            )}

            {authMethod === 'email' || isAdminLogin ? (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="glass-input" style={{ paddingLeft: '40px' }} placeholder="you@example.com" required />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                    {isLogin && <a href="#" style={{ fontSize: '0.75rem' }}>Forgot password?</a>}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="glass-input" style={{ paddingLeft: '40px' }} placeholder="••••••••" required />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500 }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                    <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} disabled={otpSent} className="glass-input" style={{ paddingLeft: '40px' }} placeholder="+1 234 567 8900" required />
                  </div>
                </div>
                {otpSent && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: 500 }}>OTP</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                      <input type="text" value={otp} onChange={e => setOtp(e.target.value)} className="glass-input" style={{ paddingLeft: '40px' }} placeholder="Enter 6-digit OTP" required />
                    </div>
                  </div>
                )}
              </>
            )}

            <button type="submit" disabled={loading} className="glass-button" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
              {loading ? 'Processing...' : (authMethod === 'phone' && !otpSent ? 'Send OTP' : (isLogin ? 'Sign In' : 'Create Account'))}
            </button>

            {isLogin && !isAdminLogin && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#9ca3af' }}>
                  <div style={{ flex: 1, height: '1px', background: '#d1d5db' }}></div>
                  <span style={{ padding: '0 8px', fontSize: '0.875rem' }}>or continue with</span>
                  <div style={{ flex: 1, height: '1px', background: '#d1d5db' }}></div>
                </div>
                <button type="button" onClick={handleGoogleLogin} className="glass-button-outline" style={{ width: '100%', padding: '12px', color: 'var(--text-main)', borderColor: '#d1d5db' }}>
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68,2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
              </>
            )}
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel" 
          style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--primary-color)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2 }}></div>
          <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', background: 'var(--secondary-color)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.2 }}></div>
          
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Smart City Management
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '600px', marginBottom: '48px' }}>
            Join Seva Kendra to report issues, track resolutions, and help build a better community together.
          </p>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center', width: '200px' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary-color)' }}>
                <ExternalLink size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Quick Reports</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Report civic issues in seconds</p>
            </div>
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center', width: '200px' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary-color)' }}>
                <Leaf size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Sustainable</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Build a cleaner greener city</p>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="glass-panel" style={{ margin: '0 16px 16px', padding: '16px', textAlign: 'center' }}>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '8px' }}>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Twitter</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Facebook</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>LinkedIn</a>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>&copy; {new Date().getFullYear()} Seva Kendra.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
