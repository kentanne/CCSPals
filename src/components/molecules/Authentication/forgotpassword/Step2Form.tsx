import styles from "@/app/pages/Authentication/forgot-password/ForgotPassword.module.css";
import { ForgotPasswordStep2Data } from '@/interfaces/Authentication/authInterfaces';

interface Step2FormProps {
  verificationData: ForgotPasswordStep2Data;
  setVerificationData: (data: ForgotPasswordStep2Data) => void;
  onSubmit: () => void;
  loading: boolean;
  roles: string[];
}

export default function Step2Form({ verificationData, setVerificationData, onSubmit, loading, roles }: Step2FormProps) {
  // Create handler functions for each field
  const handleIdChange = (value: string) => {
    setVerificationData({
      ...verificationData,
      id: value
    });
  };

  const handleNameChange = (value: string) => {
    setVerificationData({
      ...verificationData,
      name: value
    });
  };

  const handleEmailChange = (value: string) => {
    setVerificationData({
      ...verificationData,
      email: value
    });
  };

  const handleRoleChange = (value: string) => {
    setVerificationData({
      ...verificationData,
      role: value
    });
  };

  return (
    <div className={styles.stepContainer}>
      <h2>Forgot Password</h2>
      <p>Please verify your identity</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className={styles.formGroup}>
          <div className={styles.inputWithIcon}>
            <input
              value={verificationData.id}
              onChange={(e) => handleIdChange(e.target.value)}
              placeholder="ID Number"
              type="text"
              required
            />
            <span className={styles.inputIcon}>🇮🇩</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWithIcon}>
            <input
              value={verificationData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Full Name"
              type="text"
              required
            />
            <span className={styles.inputIcon}>👤</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWithIcon}>
            <input
              value={verificationData.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="Email"
              type="email"
              required
            />
            <span className={styles.inputIcon}>🖂</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWithIcon}>
            <label htmlFor="roleSelect">Primary Role</label>
            <select
              id="roleSelect"
              name="role"
              value={verificationData.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              required
            >
              <option value="">Select Primary Role</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify Identity"}
        </button>
      </form>
    </div>
  );
}