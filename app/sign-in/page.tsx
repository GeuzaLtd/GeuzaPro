import type { Metadata } from 'next';
import SignInView from './_components/SignInView';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Geuza account to manage orders, track donations, and stay connected with our community.',
};

export default function SignInPage() {
  return <SignInView />;
}