import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TYPING_TEXT = 'Welcome to Murang\'a Project Tracker!';
const EMOJIS = {
  happy: '🤖',
  sad: '😢',
  neutral: '🤔',
  success: '🎉',
};

const SignupLogin: React.FC = () => {
  const [activeForm, setActiveForm] = useState<'login' | 'register'>('login');
  const [typingIndex, setTypingIndex] = useState(0);
  const [headerText, setHeaderText] = useState('');
  const [avatar, setAvatar] = useState(EMOJIS.neutral);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: false });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '', remember: false });
  const [loginErrors, setLoginErrors] = useState<{ [key: string]: string }>({});
  const [registerErrors, setRegisterErrors] = useState<{ [key: string]: string }>({});
  const [loginTouched, setLoginTouched] = useState<{ [key: string]: boolean }>({});
  const [registerTouched, setRegisterTouched] = useState<{ [key: string]: boolean }>({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Typing effect for header
  useEffect(() => {
    if (typingIndex < TYPING_TEXT.length) {
      typingTimeout.current = setTimeout(() => {
        setHeaderText((prev) => prev + TYPING_TEXT[typingIndex]);
        setTypingIndex((i) => i + 1);
      }, 60);
    } else if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [typingIndex]);

  // Animated form switch
  const handleSwitch = (form: 'login' | 'register') => {
    setActiveForm(form);
    setAvatar(EMOJIS.neutral);
  };

  // Inline validation
  const validateRegister = () => {
    const errors: { [key: string]: string } = {};
    if (!registerForm.name.trim()) errors.name = 'Name is required';
    if (!registerForm.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errors.email = 'Invalid email';
    if (registerForm.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (registerForm.password !== registerForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };
  const validateLogin = () => {
    const errors: { [key: string]: string } = {};
    if (!loginForm.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errors.email = 'Invalid email';
    if (!loginForm.password) errors.password = 'Password is required';
    return errors;
  };

  // Handle input changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
    setRegisterTouched({ ...registerTouched, [e.target.name]: true });
  };
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
    setLoginTouched({ ...loginTouched, [e.target.name]: true });
  };

  // Handle form submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterTouched({ name: true, email: true, password: true, confirmPassword: true });
    const errors = validateRegister();
    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) {
      setAvatar(EMOJIS.sad);
      return;
    }
    setSubmitting(true);
    setAvatar(EMOJIS.happy);
    setTimeout(() => {
      setAvatar(EMOJIS.success);
      setSubmitting(false);
      setActiveForm('login');
    }, 1200);
  };
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginTouched({ email: true, password: true });
    const errors = validateLogin();
    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) {
      setAvatar(EMOJIS.sad);
      return;
    }
    setSubmitting(true);
    setAvatar(EMOJIS.happy);
    setTimeout(() => {
      setAvatar(EMOJIS.success);
      setSubmitting(false);
      navigate('/');
    }, 1200);
  };

  // Animated background (simple gradient + optional particles)
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
      {/* Animated particles/parallax (optional, simple demo) */}
      <div className="absolute inset-0 pointer-events-none z-0 animate-pulse" style={{ background: 'radial-gradient(circle at 20% 30%, #fff7, transparent 60%), radial-gradient(circle at 80% 70%, #fff5, transparent 60%)' }} />
      <div className="relative z-10 w-full max-w-md p-8 bg-white/90 rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center">
        {/* Typing header */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-2 tracking-tight flex items-center justify-center min-h-[2.5em]">
          <span className="mr-2 animate-bounce text-3xl">{avatar}</span>
          <span className="typing-text" style={{ minHeight: '1em' }}>{headerText}</span>
        </h1>
        {/* Animated toggle/tab */}
        <div className="flex w-full mb-6 mt-2">
          <button
            className={`flex-1 py-2 rounded-l-xl font-semibold transition-all duration-300 ${activeForm === 'login' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-green-100'}`}
            onClick={() => handleSwitch('login')}
            disabled={activeForm === 'login'}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-r-xl font-semibold transition-all duration-300 ${activeForm === 'register' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-green-100'}`}
            onClick={() => handleSwitch('register')}
            disabled={activeForm === 'register'}
          >
            Register
          </button>
        </div>
        {/* Forms with animated transitions */}
        <div className="w-full">
          <div className={`transition-all duration-500 ${activeForm === 'login' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'} absolute w-full`}>
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  onBlur={() => setLoginTouched({ ...loginTouched, email: true })}
                  className={`w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none ${loginTouched.email && loginErrors.email ? 'border-red-400 animate-bounce' : 'border-gray-200 focus:border-green-400'}`}
                  autoComplete="email"
                />
                {loginTouched.email && loginErrors.email && (
                  <div className="text-red-500 text-xs mt-1 animate-fadeInDown">{loginErrors.email}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  onBlur={() => setLoginTouched({ ...loginTouched, password: true })}
                  className={`w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none ${loginTouched.password && loginErrors.password ? 'border-red-400 animate-bounce' : 'border-gray-200 focus:border-green-400'}`}
                  autoComplete="current-password"
                />
                {loginTouched.password && loginErrors.password && (
                  <div className="text-red-500 text-xs mt-1 animate-fadeInDown">{loginErrors.password}</div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={loginForm.remember}
                    onChange={handleLoginChange}
                    className="mr-2 rounded border-gray-300 focus:ring-green-400"
                  />
                  Remember Me
                </label>
                <button type="button" className="text-green-500 text-xs hover:underline focus:outline-none transition-colors duration-200">Forgot Password?</button>
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-green-500 text-white font-bold shadow-md hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={submitting}
              >
                {submitting ? 'Logging in...' : 'Login'}
              </button>
              <div className="text-center text-sm mt-2">
                Not a user?{' '}
                <span className="text-green-600 font-semibold cursor-pointer hover:underline" onClick={() => handleSwitch('register')}>
                  Please register
                </span>
              </div>
            </form>
          </div>
          <div className={`transition-all duration-500 ${activeForm === 'register' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'} absolute w-full`}>
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  onBlur={() => setRegisterTouched({ ...registerTouched, name: true })}
                  className={`w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none ${registerTouched.name && registerErrors.name ? 'border-red-400 animate-bounce' : 'border-gray-200 focus:border-green-400'}`}
                  autoComplete="name"
                />
                {registerTouched.name && registerErrors.name && (
                  <div className="text-red-500 text-xs mt-1 animate-fadeInDown">{registerErrors.name}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  onBlur={() => setRegisterTouched({ ...registerTouched, email: true })}
                  className={`w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none ${registerTouched.email && registerErrors.email ? 'border-red-400 animate-bounce' : 'border-gray-200 focus:border-green-400'}`}
                  autoComplete="email"
                />
                {registerTouched.email && registerErrors.email && (
                  <div className="text-red-500 text-xs mt-1 animate-fadeInDown">{registerErrors.email}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  onBlur={() => setRegisterTouched({ ...registerTouched, password: true })}
                  className={`w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none ${registerTouched.password && registerErrors.password ? 'border-red-400 animate-bounce' : 'border-gray-200 focus:border-green-400'}`}
                  autoComplete="new-password"
                />
                {registerTouched.password && registerErrors.password && (
                  <div className="text-red-500 text-xs mt-1 animate-fadeInDown">{registerErrors.password}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  onBlur={() => setRegisterTouched({ ...registerTouched, confirmPassword: true })}
                  className={`w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none ${registerTouched.confirmPassword && registerErrors.confirmPassword ? 'border-red-400 animate-bounce' : 'border-gray-200 focus:border-green-400'}`}
                  autoComplete="new-password"
                />
                {registerTouched.confirmPassword && registerErrors.confirmPassword && (
                  <div className="text-red-500 text-xs mt-1 animate-fadeInDown">{registerErrors.confirmPassword}</div>
                )}
              </div>
              <div className="flex items-center">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={registerForm.remember}
                    onChange={handleRegisterChange}
                    className="mr-2 rounded border-gray-300 focus:ring-green-400"
                  />
                  Remember Me
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-green-500 text-white font-bold shadow-md hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={submitting}
              >
                {submitting ? 'Registering...' : 'Register'}
              </button>
              <div className="text-center text-sm mt-2">
                Already have an account?{' '}
                <span className="text-green-600 font-semibold cursor-pointer hover:underline" onClick={() => handleSwitch('login')}>
                  Login here
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Responsive absolute container for forms */}
      <style>{`
        .animate-fadeInDown {
          animation: fadeInDown 0.5s;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .typing-text {
          border-right: 2px solid #222;
          white-space: pre;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default SignupLogin; 