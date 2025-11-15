import styles from '@/app/pages/Authentication/loginpage/login.module.css';

interface AuthInputProps {
  type: 'text' | 'password' | 'email';
  label: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
  placeholder: string;
  disabled?: boolean;
  ref: React.Ref<HTMLInputElement>;
  showPasswordToggle?: boolean;
  passwordVisible?: boolean;
  onTogglePassword?: () => void;
  icon?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  type,
  label,
  value,
  onChange,
  onKeyDown,
  onFocus,
  placeholder,
  disabled = false,
  ref,
  showPasswordToggle = false,
  passwordVisible = false,
  onTogglePassword,
  icon = "user"
}) => {
  return (
    <div className={styles.inputField}>
      <label htmlFor={label.toLowerCase().replace(' ', '-')}>{label}</label>
      <div className={styles.inputWithIcon}>
        <input
          ref={ref}
          id={label.toLowerCase().replace(' ', '-')}
          type={type === 'password' && passwordVisible ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          required
          aria-describedby={`${label.toLowerCase().replace(' ', '-')}-description`}
        />
        {showPasswordToggle && onTogglePassword && (
          <i
            className={`${styles.inputIcon} ${styles.passwordToggle} fas ${
              passwordVisible ? "fa-eye" : "fa-eye-slash"
            }`}
            onClick={onTogglePassword}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTogglePassword();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            aria-controls="password"
          ></i>
        )}
        {!showPasswordToggle && (
          <i className={`fas fa-${icon} ${styles.inputIcon}`}></i>
        )}
      </div>
      <span id={`${label.toLowerCase().replace(' ', '-')}-description`} className={styles.srOnly}>
        {placeholder}
      </span>
    </div>
  );
};