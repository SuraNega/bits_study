import { useAuthModal } from './AuthModalContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import LoginCard from '@/components/auth/LoginCard';
import RegisterCard from '@/components/auth/RegisterCard';

export function AuthModalRoot() {
  const { open, type, closeModal } = useAuthModal();

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent>
        {type === 'login' && <LoginCard />}
        {type === 'register' && <RegisterCard />}
      </DialogContent>
    </Dialog>
  );
}
