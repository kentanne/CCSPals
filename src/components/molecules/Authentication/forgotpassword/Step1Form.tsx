import styles from "@/app/pages/Authentication/forgot-password/ForgotPassword.module.css";

interface Step1FormProps {
  identifier: string;
  setIdentifier: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function Step1Form({ identifier, setIdentifier, onSubmit, loading }: Step1FormProps) {
  return (
    <div className={styles.stepContainer}>
      <h2>Forgot Password</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className={styles.formGroup}>
          <div className={styles.inputWithIcon}>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your Login Credential"
              type="text"
              required
            />
            <span className={styles.inputIcon}>👤</span>
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Continue"}
        </button>
      </form>
    </div>
  );
}