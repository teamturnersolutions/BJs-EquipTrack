import { prisma } from './prisma';
import { type TeamMember, type InventoryItem } from './types';

// --- Data Access API ---

export async function getTeamMembers(): Promise<TeamMember[]> {
  return prisma.teamMember.findMany();
}

export async function getTeamMemberById(id: number): Promise<TeamMember | undefined> {
  const member = await prisma.teamMember.findUnique({
    where: { id },
  });
  return member || undefined;
}

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const items = await prisma.inventoryItem.findMany();
  return items.map((item: any) => ({
    ...item,
    status: item.status as 'Available' | 'Checked Out',
    checkedOutBy: item.checkedOutBy || undefined,
    checkedOutById: item.checkedOutById || undefined,
    checkedOutDate: item.checkedOutDate || undefined,
    checkedInDate: item.checkedInDate || undefined,
  }));
}

export async function getInventoryItemsByTeamMember(teamMemberId: number): Promise<InventoryItem[]> {
  const items = await prisma.inventoryItem.findMany({
    where: {
      status: 'Checked Out',
      checkedOutById: teamMemberId,
    },
  });
  return items.map((item: any) => ({
    ...item,
    status: item.status as 'Available' | 'Checked Out',
    checkedOutBy: item.checkedOutBy || undefined,
    checkedOutById: item.checkedOutById || undefined,
    checkedOutDate: item.checkedOutDate || undefined,
    checkedInDate: item.checkedInDate || undefined,
  }));
}

export async function getAvailableInventoryItems(): Promise<InventoryItem[]> {
  const items = await prisma.inventoryItem.findMany({
    where: { status: 'Available' },
  });
  return items.map((item: any) => ({
    ...item,
    status: item.status as 'Available' | 'Checked Out',
    checkedOutBy: item.checkedOutBy || undefined,
    checkedOutById: item.checkedOutById || undefined,
    checkedOutDate: item.checkedOutDate || undefined,
    checkedInDate: item.checkedInDate || undefined,
  }));
}

export async function getCheckedOutInventoryItems(): Promise<InventoryItem[]> {
  const items = await prisma.inventoryItem.findMany({
    where: { status: 'Checked Out' },
  });
  return items.map((item: any) => ({
    ...item,
    status: item.status as 'Available' | 'Checked Out',
    checkedOutBy: item.checkedOutBy || undefined,
    checkedOutById: item.checkedOutById || undefined,
    checkedOutDate: item.checkedOutDate || undefined,
    checkedInDate: item.checkedInDate || undefined,
  }));
}

export async function updateInventory(updatedItems: Partial<InventoryItem>[]) {
  const updates = updatedItems.map(item => {
    if (!item.id) return Promise.resolve();
    return prisma.inventoryItem.update({
      where: { id: item.id },
      data: {
        status: item.status,
        checkedOutBy: item.checkedOutBy,
        checkedOutById: item.checkedOutById,
        checkedOutDate: item.checkedOutDate,
        checkedInDate: item.checkedInDate,
      },
    });
  });

  await Promise.all(updates);
}