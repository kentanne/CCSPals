import styles from "@/app/pages/Authentication/forgot-password/ForgotPassword.module.css";

export default function AuthHeader() {
  return (
    <header className={styles.brandHeader}>
      <img
        src="/img/logo_gccoed.png"
        alt="GCCoed Logo"
        className={styles.logoImg}
      />
      <span className={styles.brandName}>MindMates</span>
    </header>
  );
}