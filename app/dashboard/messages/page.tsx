import { getMessages } from '@/actions/messages';
import MessagesView from './_components/MessagesView';

export default async function MessagesPage() {
  const raw = await getMessages();
  const data = raw.map((m) => ({
    id: m.id,
    sender: m.fullName,
    email: m.email,
    organization: m.organizationType ?? null,
    subject: m.organizationType
      ? `[${m.organizationType}] ${m.message.slice(0, 50)}${m.message.length > 50 ? '…' : ''}`
      : m.message.slice(0, 60) + (m.message.length > 60 ? '…' : ''),
    body: m.message,
    status: m.isRead ? 'Read' : 'Unread',
    date: m.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }));
  return <MessagesView initialData={data} />;
}
