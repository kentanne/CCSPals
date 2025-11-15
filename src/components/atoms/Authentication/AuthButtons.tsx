import styles from '@/app/pages/Authentication/loginpage/login.module.css';

interface AuthButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
  ref: React.Ref<HTMLButtonElement>;
  children: React.ReactNode;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  isActive = false,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onKeyDown,
  onFocus,
  ref,
  children
}) => {
  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.button} ${isLoading ? styles.loading : ""} ${
        isActive ? styles.active : ""
      }`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      onClick={onClick}
      aria-label="Login to your account"
    >
      {isLoading && <span className={styles.loadingSpinner}></span>}
      {children}
    </button>
  );
};