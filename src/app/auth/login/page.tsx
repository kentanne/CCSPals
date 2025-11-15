'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { useLogin } from '@/hooks/useLogin';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { LOGIN_CONSTANTS } from '@/constants/loginConstants';
import './login.css';

export default function Login() {
  // State declarations
  const [iniCred, setIniCred] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  // Refs
  const iniCredRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const forgotPasswordRef = useRef<HTMLAnchorElement>(null);

  // Custom hooks
  const { isLoading, error, login, clearError } = useLogin();
  
  const focusableElements = [
    { ref: iniCredRef, type: 'input' },
    { ref: passwordRef, type: 'input' },
    { ref: loginButtonRef, type: 'button' },
    { ref: forgotPasswordRef, type: 'link' }
  ];
  
  const { handleKeyDown, handleElementFocus } = useKeyboardNavigation(focusableElements);

  // Event handlers
  const setButtonActive = (active: boolean) => {
    if (!isLoading) {
      setIsButtonActive(active);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ iniCred, password });
  };

  const handleInputChange = () => {
    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  // Effects
  useEffect(() => {
    iniCredRef.current?.focus();
  }, []);

  return (
    <div className="login-container">
      <Navbar />

      <main>
        <div className="main-image">
          <Image
            src="/img/logo_gccoed.png"
            alt="MindMates Logo"
            width={400}
            height={300}
            priority
          />
        </div>

        <div className="main-content">
          <h1>Login</h1>
          
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="input-field">
              <label htmlFor="iniCred">{LOGIN_CONSTANTS.LABELS.INI_CRED}</label>
              <div className="input-with-icon">
                <input
                  ref={iniCredRef}
                  id="iniCred"
                  type="text"
                  value={iniCred}
                  onChange={(e) => {
                    setIniCred(e.target.value);
                    handleInputChange();
                  }}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                  onFocus={() => handleElementFocus(0)}
                  placeholder={LOGIN_CONSTANTS.PLACEHOLDERS.INI_CRED}
                  disabled={isLoading}
                  required
                  aria-describedby="iniCred-description"
                />
                <i className="fas fa-user input-icon"></i>
              </div>
              <span id="iniCred-description" className="sr-only">
                {LOGIN_CONSTANTS.DESCRIPTIONS.INI_CRED}
              </span>
            </div>

            <div className="input-field">
              <label htmlFor="password">{LOGIN_CONSTANTS.LABELS.PASSWORD}</label>
              <div className="input-with-icon">
                <input
                  ref={passwordRef}
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleInputChange();
                  }}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                  onFocus={() => handleElementFocus(1)}
                  placeholder={LOGIN_CONSTANTS.PLACEHOLDERS.PASSWORD}
                  disabled={isLoading}
                  required
                  aria-describedby="password-description"
                />
                <i
                  className={`fas ${
                    passwordVisible ? 'fa-eye' : 'fa-eye-slash'
                  } input-icon password-toggle`}
                  onClick={togglePasswordVisibility}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      togglePasswordVisibility();
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={passwordVisible ? 
                    LOGIN_CONSTANTS.ARIA_LABELS.PASSWORD_TOGGLE_HIDE : 
                    LOGIN_CONSTANTS.ARIA_LABELS.PASSWORD_TOGGLE_SHOW
                  }
                  aria-controls="password"
                ></i>
              </div>
              <span id="password-description" className="sr-only">
                {LOGIN_CONSTANTS.DESCRIPTIONS.PASSWORD}
              </span>
              <p className="switch-link">
                <a 
                  href={LOGIN_CONSTANTS.ROUTES.FORGOT_PASSWORD}
                  ref={forgotPasswordRef}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                  onFocus={() => handleElementFocus(3)}
                >
                  Forgot Password?
                </a>
              </p>
            </div>

            <button
              ref={loginButtonRef}
              type="submit"
              className={`${isLoading ? 'loading' : ''} ${
                isButtonActive ? 'active' : ''
              }`}
              onMouseDown={() => setButtonActive(true)}
              onMouseUp={() => setButtonActive(false)}
              onMouseLeave={() => setButtonActive(false)}
              onKeyDown={(e) => handleKeyDown(e, 2)}
              onFocus={() => handleElementFocus(2)}
              disabled={isLoading}
            >
              {isLoading && <span className="loading-spinner"></span>}
              {isLoading ? LOGIN_CONSTANTS.ARIA_LABELS.LOADING : 'Login'}
            </button>
          </form>
        </div>
      </main>

      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}