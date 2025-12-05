"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import("@/components/organisms/Navbar"), {
  loading: () => <div style={{ height: '80px' }} />,
  ssr: false
});
import { useLogin } from "@/hooks/useLogin";
import { handlePasswordToggleKeyDown } from "@/helpers";
import styles from "./login.module.css";

export default function Login() {
  const { login, isLoading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const forgotPasswordRef = useRef<HTMLAnchorElement>(null);

  // Effects
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Event handlers
  const setButtonActive = (active: boolean) => {
    if (!isLoading) {
      setIsButtonActive(active);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = () => {
    if (!isLoading) {
      login(email, password);
    }
  };

  // JSX Return
  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.mainImage}>
          <Image
            src="/img/logo_gccoed.png"
            alt="CCSPals Logo"
            width={400}
            height={300}
            priority
          />
        </div>

        <div className={styles.mainContent}>
          <h1>Login</h1>
          <div role="form" aria-label="Login form" className={styles.form}>
            <div className={styles.inputField}>
              <label htmlFor="email">EMAIL</label>
              <div className={styles.inputWithIcon}>
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                  aria-describedby="email-description"
                />
                <i className={`fas fa-user ${styles.inputIcon}`}></i>
              </div>
              <span id="email-description" className={styles.srOnly}>
                Enter your email address
              </span>
            </div>

            <div className={styles.inputField}>
              <label htmlFor="password">PASSWORD</label>
              <div className={styles.inputWithIcon}>
                <input
                  ref={passwordRef}
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  required
                  aria-describedby="password-description"
                />
                <i
                  className={`${styles.inputIcon} ${styles.passwordToggle} fas ${
                    passwordVisible ? "fa-eye" : "fa-eye-slash"
                  }`}
                  onClick={togglePasswordVisibility}
                  onKeyDown={(e) => handlePasswordToggleKeyDown(e, togglePasswordVisibility)}
                  tabIndex={0}
                  role="button"
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                  aria-controls="password"
                ></i>
              </div>
              <span id="password-description" className={styles.srOnly}>
                Enter your password. Use Tab to navigate to next field.
              </span>
              <p className={styles.switchLink}>
                <a
                  href="/auth/forgot-password"
                  ref={forgotPasswordRef}
                >
                  Forgot Password?
                </a>
              </p>
            </div>

            <button
              ref={loginButtonRef}
              type="button"
              className={`${styles.button} ${isLoading ? styles.loading : ""} ${
                isButtonActive ? styles.active : ""
              }`}
              onMouseDown={() => setButtonActive(true)}
              onMouseUp={() => setButtonActive(false)}
              onMouseLeave={() => setButtonActive(false)}
              disabled={isLoading}
              aria-busy={isLoading}
              onClick={handleLogin}
              aria-label="Login to your account"
            >
              {isLoading && <span className={styles.loadingSpinner}></span>}
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}