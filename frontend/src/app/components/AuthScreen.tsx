import { User, usersApi } from '../../api/client';
import AuthCard, { SignInValues, SignUpValues } from './AuthCard';

type UserRole = 'teacher' | 'student';

interface AuthScreenProps {
  onAuth: (role: UserRole, user?: User) => void;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const handleSignIn = async (values: SignInValues) => {
    const users = await usersApi.list();
    const found = users.find((u) => u.email === values.email);
    if (!found) {
      throw new Error('User not found');
    }
    onAuth(found.role as UserRole, found);
  };

  const handleSignUp = async (values: SignUpValues) => {
    const createdUser = await usersApi.create({
      name: values.name,
      email: values.email,
      password: values.password,
      role: 'student',
    });
    onAuth('student', createdUser);
  };

  return <AuthCard onSignIn={handleSignIn} onSignUp={handleSignUp} />;
}
