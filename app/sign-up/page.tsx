import type { Metadata } from 'next';
import SignUpView from './_components/SignUpView';

export const metadata: Metadata = {
  title: 'Create Account | Geuza',
  description: 'Join Geuza — create a free account to shop assistive devices, track your donations, and support our mission of sustainable mobility.',
};

export default function SignUpPage() {
  return <SignUpView />;
}
