'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import notify from '@/lib/toast';
import api from '@/lib/axios';
import AuthHeader from '@/components/molecules/Authentication/forgotpassword/AuthHeader';
import Step1Form from '@/components/molecules/Authentication/forgotpassword/Step1Form';
import Step2Form from '@/components/molecules/Authentication/forgotpassword/Step2Form';
import styles from "@/app/pages/Authentication/forgot-password/ForgotPassword.module.css";

export default function ForgotPasswordLayout() {
  const router = useRouter();

  // State declarations
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Step 1 data
  const [identifier, setIdentifier] = useState("");
  
  // Step 2 data
  const [verificationData, setVerificationData] = useState({
    pre_cred: "",
    id: "",
    name: "",
    email: "",
    role: "",
  });

  // Constants
  const roles = ["learner", "mentor"];

  // Handler functions
  const handleStep1 = async () => {
    if (!identifier) {
      setError("Please enter your email, ID number, or account name");
      return;
    }

    setLoading(true);
    setError("");

    setVerificationData((prev) => ({ ...prev, pre_cred: identifier }));

    setStep(2);
    setLoading(false);
  };

  const handleStep2 = async () => {
    const required = ["id", "name", "email", "role"];
    const missing = required.filter(
      (f) => !verificationData[f as keyof typeof verificationData]
    );

    if (missing.length > 0) {
      setError(`Please fill in all required fields: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/forgot-password", verificationData);
      if (response.status === 200) {
        console.log("Password reset link sent:", response.data);
      }
      notify.success("Password reset link sent!");

      setSuccess("Password reset link sent!");
      router.push("/auth/login");
    } catch (err) {
      notify.error("Verification failed");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <AuthHeader />
      
      <div className={styles.formWrapper}>
        {/* Step 1 */}
        {step === 1 && (
          <Step1Form
            identifier={identifier}
            setIdentifier={setIdentifier}
            onSubmit={handleStep1}
            loading={loading}
          />
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Step2Form
            verificationData={verificationData}
            setVerificationData={setVerificationData}
            onSubmit={handleStep2}
            loading={loading}
            roles={roles}
          />
        )}

        {/* Error and Success Messages */}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
      </div>
    </div>
  );
}