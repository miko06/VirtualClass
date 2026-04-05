import { User, usersApi } from '../../api/client';
import AuthCard, { SignInValues } from './AuthCard';

type UserRole = 'teacher' | 'student' | 'admin';

interface AuthScreenProps {
  onAuth: (role: UserRole, user?: User) => void;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const handleSignIn = async (values: SignInValues) => {
    const user = await usersApi.login(values.email, values.password);
    localStorage.setItem('currentUserId', String(user.id));
    onAuth(user.role as UserRole, user);
  };

  return <AuthCard onSignIn={handleSignIn} />;
}
