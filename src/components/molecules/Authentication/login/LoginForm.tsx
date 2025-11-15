'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import api, { setAuthToken } from '@/lib/axios';
import { AuthInput } from '@/components/atoms/Authentication/AuthInputs';
import { AuthButton } from '@/components/atoms/Authentication/AuthButtons';
import { useNavigation } from '@/hooks/Authentication/useNavigation';
import styles from '@/app/pages/Authentication/loginpage/login.module.css';

export default function LoginForm() {
  const router = useRouter();

  // State declarations
  const [iniCred, setIniCred] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  // Use the navigation hook
  const { handleKeyDown, registerRef } = useNavigation(4);

  // Helper functions
  const setButtonActive = (active: boolean) => {
    if (!isLoading) {
      setIsButtonActive(active);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const login = async () => {
    if (isLoading) return;
    // Basic client-side validation
    if (!iniCred.trim() || !password.trim()) {
      toast.error("Please enter your login and password.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post("/api/auth/login", {
        iniCred: iniCred.trim(),
        password: password,
      });

      const { token, userRole, user } = response.data || {};
      if (!token) {
        toast.error(response.data?.message || "Login failed. Please try again.");
        return;
      }

      setAuthToken(token);

      const role = userRole || user?.role;
      // Success toast
      const who = user?.username ? `, ${user.username}` : "";
      toast.success(`Welcome back${who}!`);

      if (!role || role === "user" || role === "") {
        toast.info("Please complete your profile to continue.");
        router.replace("/auth/signup");
        return;
      }

      switch (role) {
        case "learner":
          toast.success("Logged in as learner. Redirecting...");
          router.replace("/learner");
          break;
        case "mentor":
          toast.success("Logged in as mentor. Redirecting...");
          router.replace("/mentor");
          break;
        case "admin":
          toast.success("Logged in as admin. Redirecting...");
          router.replace("/admin");
          break;
        default:
          router.replace("/signup");
      }
    } catch (error: unknown) {
      // Use server message when available (401/403/etc), else fallback
      if (axios.isAxiosError(error)) {
        const msg =
          error.response?.data?.message ||
          (error.response?.status === 401
            ? "Invalid credentials. Please try again."
            : error.message);
        toast.error(msg);
        console.error("Login failed:", {
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Login failed:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.mainContent}>
      <h1>Login</h1>
      <div role="form" aria-label="Login form" className={styles.form}>
        <AuthInput
          type="text"
          label="DOMAIN LOGIN"
          value={iniCred}
          onChange={setIniCred}
          onKeyDown={(e) => handleKeyDown(e, 0)}
          onFocus={() => {}}
          placeholder="Enter your email, username, or Student ID"
          disabled={isLoading}
          ref={(el) => registerRef(0, el)}
          icon="user"
        />

        <AuthInput
          type="password"
          label="PASSWORD"
          value={password}
          onChange={setPassword}
          onKeyDown={(e) => handleKeyDown(e, 1)}
          onFocus={() => {}}
          placeholder="Enter your password"
          disabled={isLoading}
          ref={(el) => registerRef(1, el)}
          showPasswordToggle
          passwordVisible={passwordVisible}
          onTogglePassword={togglePasswordVisibility}
        />

        <p className={styles.switchLink}>
          <a
            href="/pages/Authentication/forgot-password"
            ref={(el) => registerRef(3, el)}
            onKeyDown={(e) => handleKeyDown(e, 3)}
          >
            Forgot Password?
          </a>
        </p>

        <AuthButton
          onClick={login}
          disabled={isLoading}
          isLoading={isLoading}
          isActive={isButtonActive}
          onMouseDown={() => setButtonActive(true)}
          onMouseUp={() => setButtonActive(false)}
          onMouseLeave={() => setButtonActive(false)}
          onKeyDown={(e) => handleKeyDown(e, 2)}
          onFocus={() => {}}
          ref={(el) => registerRef(2, el)}
        >
          {isLoading ? "Logging in..." : "Login"}
        </AuthButton>
      </div>
    </div>
  );
}