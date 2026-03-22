'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getEmployees(visible?: boolean) {
  return prisma.employee.findMany({
    where: visible !== undefined ? { isVisible: visible } : {},
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });
}

export async function createEmployee(data: {
  name: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  order?: number;
}) {
  const employee = await prisma.employee.create({ data });
  revalidatePath('/company');
  revalidatePath('/dashboard/employees');
  return employee;
}

export async function updateEmployee(
  id: number,
  data: Partial<{ name: string; role: string; department: string; email: string; phone: string; avatar: string; bio: string; order: number; isVisible: boolean }>
) {
  const employee = await prisma.employee.update({ where: { id }, data });
  revalidatePath('/company');
  revalidatePath('/dashboard/employees');
  return employee;
}

export async function deleteEmployee(id: number) {
  await prisma.employee.delete({ where: { id } });
  revalidatePath('/company');
  revalidatePath('/dashboard/employees');
}
