import { ConfirmationModalProps } from '@/interfaces/session';

interface ConfirmationModalExtendedProps extends ConfirmationModalProps {
  styles: any; // Pass the CSS module object
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  styles
}: ConfirmationModalExtendedProps) {
  if (!isOpen) return null;

  const variantClasses = {
    default: styles.sessionModalButtonConfirm,
    danger: `${styles.sessionModalButtonConfirm} ${styles.sessionModalButtonConfirmDanger}`,
    warning: `${styles.sessionModalButtonConfirm} ${styles.sessionModalButtonConfirmWarning}`
  };

  return (
    <div className={styles.sessionModalOverlay}>
      <div className={styles.sessionModalContent}>
        <div className={styles.sessionModalHeader}>
          <h3>{title}</h3>
        </div>
        <div className={styles.sessionModalBody}>
          <p dangerouslySetInnerHTML={{ __html: message }} />
          {variant === 'danger' && (
            <p className={styles.sessionWarningText}>This action cannot be undone.</p>
          )}
        </div>
        <div className={styles.sessionModalFooter}>
          <button
            className={`${styles.sessionModalButton} ${styles.sessionModalButtonCancel}`}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`${styles.sessionModalButton} ${variantClasses[variant]}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}