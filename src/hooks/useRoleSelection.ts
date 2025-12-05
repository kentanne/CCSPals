import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { selectRoleAndNavigate } from '@/utils/navigationHelpers';

export function useRoleSelection() {
  const router = useRouter();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'learner' | 'mentor' | ''>('');

  const initiateSignUp = (role: 'learner' | 'mentor') => {
    setSelectedRole(role);
    setShowConfirmationModal(true);
  };

  const confirmSelection = () => {
    if (!selectedRole) return;
    
    setShowConfirmationModal(false);
    selectRoleAndNavigate(selectedRole, router);
  };

  const cancelSelection = () => {
    setShowConfirmationModal(false);
    setSelectedRole('');
  };

  return {
    showConfirmationModal,
    selectedRole,
    initiateSignUp,
    confirmSelection,
    cancelSelection,
  };
}
