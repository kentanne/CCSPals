import { useForgotPassword } from '@/hooks/Authentication/useForgotPassword';
import Step1Form from './Step1Form';
import Step2Form from './Step2Form';
import styles from "@/app/pages/Authentication/forgot-password/ForgotPassword.module.css";

export default function ForgotPasswordForm() {
  const {
    step,
    loading,
    error,
    success,
    identifier,
    verificationData,
    setIdentifier,
    setVerificationData,
    handleStep1,
    handleStep2
  } = useForgotPassword();

  const roles = ["learner", "mentor"];

  return (
    <div className={styles.formWrapper}>
      {step === 1 && (
        <Step1Form
          identifier={identifier}
          setIdentifier={setIdentifier}
          onSubmit={handleStep1}
          loading={loading}
        />
      )}

      {step === 2 && (
        <Step2Form
          verificationData={verificationData}
          setVerificationData={setVerificationData}
          onSubmit={handleStep2}
          loading={loading}
          roles={roles}
        />
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}
    </div>
  );
}