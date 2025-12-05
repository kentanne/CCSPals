export interface ConfirmationModalProps {
  show: boolean;
  selectedRole: string;
  onConfirm: () => void;
  onCancel: () => void;
  cancelButtonRef: React.RefObject<HTMLButtonElement>;
  confirmButtonRef: React.RefObject<HTMLButtonElement>;
  styles: any;
}

export interface RoleCardProps {
  role: 'learner' | 'mentor';
  onFocus: () => void;
  onClick: () => void;
  cardRef: React.RefObject<HTMLDivElement>;
  styles: any;
}
