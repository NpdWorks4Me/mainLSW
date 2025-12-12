import React from 'react';
    import { Dialog, DialogContent } from '@/components/ui/dialog';
    import { useAuthModal } from '@/contexts/AuthModalContext';
    import LoginForm from './LoginForm';
    import SignUpForm from './SignUpForm';
    
    const AuthModal = () => {
      const { isAuthModalOpen, closeAuthModal, authModalView, switchToLogin, switchToSignup } = useAuthModal();
    
      return (
        <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
          <DialogContent>
            {authModalView === 'login' ? (
              <LoginForm onSuccess={closeAuthModal} onSwitchToSignup={switchToSignup} />
            ) : (
              <SignUpForm onSuccess={closeAuthModal} onSwitchToLogin={switchToLogin} />
            )}
          </DialogContent>
        </Dialog>
      );
    };
    
    export default AuthModal;