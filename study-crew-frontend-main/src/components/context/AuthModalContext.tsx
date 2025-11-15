import { createContext, useContext, useState, ReactNode } from 'react';

type ModalType = 'login' | 'register' | null;
type AuthIntent = 'user' | 'assistant' | null;

interface AuthModalContextValue {
  open: boolean;
  type: ModalType;
  intent: AuthIntent;
  openModal: (type: ModalType, intent?: AuthIntent) => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ModalType>(null);
  const [intent, setIntent] = useState<AuthIntent>(null);

  const openModal = (modalType: ModalType, modalIntent?: AuthIntent) => {
    setType(modalType);
    setOpen(true);
    setIntent(modalIntent || null);
  };
  const closeModal = () => {
    setOpen(false);
    setType(null);
    setIntent(null);
  };

  return (
    <AuthModalContext.Provider value={{ open, type, intent, openModal, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider');
  return ctx;
}
