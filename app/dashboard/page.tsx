import { getDashboardStats } from '@/actions/dashboard';
import DashboardOverviewClient from './_components/DashboardOverviewClient';

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  return <DashboardOverviewClient stats={stats} />;
}
