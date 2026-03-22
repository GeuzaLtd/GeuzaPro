import { getEmployees } from '@/actions/employees';
import EmployeesView from './_components/EmployeesView';

export default async function EmployeesPage() {
  const raw = await getEmployees();
  const data = raw.map((e) => ({
    id: e.id,
    name: e.name,
    role: e.role,
    department: e.bio ?? null,
    email: null as string | null,
    phone: null as string | null,
    status: e.isVisible ? 'Active' : 'Inactive',
    joined: e.createdAt.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
    avatar: e.avatar ?? null,
  }));
  return <EmployeesView initialData={data} />;
}
