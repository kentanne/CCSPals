import { useState } from "react";
import { useRouter } from "next/navigation";
import notify from '@/lib/toast';
import { passwordService } from '@/services/Authentication/passwordService';

export const useForgotPassword = () => {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [verificationData, setVerificationData] = useState({
    pre_cred: "",
    id: "",
    name: "",
    email: "",
    role: "",
  });

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
      await passwordService.sendResetLink(verificationData);
      notify.success("Password reset link sent!");
      setSuccess("Password reset link sent!");
      router.push("/pages/Authentication/loginpage");
    } catch (err) {
      notify.error("Verification failed");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    loading,
    error,
    success,
    identifier,
    verificationData,
    setIdentifier,
    setVerificationData,
    handleStep1,
    handleStep2,
    setError,
    setSuccess
  };
};