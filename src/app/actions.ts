'use server';

import { revalidatePath } from 'next/cache';
import { getTeamMemberById, getInventoryItems, updateInventory } from '@/lib/data';
import { prisma } from '@/lib/prisma';

export async function addTeamMember(name: string) {
  try {
    await prisma.teamMember.create({
      data: { name },
    });
    revalidatePath('/');
    revalidatePath('/checkout');
    revalidatePath('/history');
    return { success: true, message: 'Team member added successfully!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}

export async function addInventoryItem(name: string) {
  try {
    await prisma.inventoryItem.create({
      data: {
        name,
        status: 'Available',
      },
    });
    revalidatePath('/');
    revalidatePath('/inventory');
    revalidatePath('/checkout');
    revalidatePath('/history');
    return { success: true, message: 'Inventory item added successfully!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}

export async function checkOutEquipment(teamMemberId: number, itemIds: number[]) {
  try {
    const teamMember = await getTeamMemberById(teamMemberId);
    if (!teamMember) {
      throw new Error('Team member not found.');
    }

    const allItems = await getInventoryItems();
    const itemsToUpdate = allItems.filter(item => itemIds.includes(item.id));

    if (itemsToUpdate.some(item => item.status === 'Checked Out')) {
      throw new Error('One or more selected items are already checked out.');
    }

    const updatedItems = itemsToUpdate.map(item => ({
      id: item.id,
      status: 'Checked Out' as const,
      checkedOutBy: teamMember.name,
      checkedOutById: teamMember.id,
      checkedOutDate: new Date().toISOString(),
      checkedInDate: undefined,
    }));

    await prisma.$transaction([
      ...updatedItems.map(item =>
        prisma.inventoryItem.update({
          where: { id: item.id },
          data: {
            status: item.status,
            checkedOutBy: item.checkedOutBy,
            checkedOutById: item.checkedOutById,
            checkedOutDate: item.checkedOutDate,
          }
        })
      ),
      ...updatedItems.map(item =>
        prisma.inventoryLog.create({
          data: {
            itemId: item.id,
            itemName: itemsToUpdate.find(i => i.id === item.id)?.name || 'Unknown',
            action: 'CHECKOUT',
            teamMemberId: teamMember.id,
            teamMemberName: teamMember.name,
          }
        })
      )
    ]);

    revalidatePath('/inventory');
    revalidatePath('/checkout');
    revalidatePath('/');
    revalidatePath('/history');

    return { success: true, message: 'Equipment checked out successfully!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}

export async function checkInEquipment(itemIds: number[]) {
  try {
    const allItems = await getInventoryItems();

    const itemsToUpdate = allItems.filter(item => itemIds.includes(item.id));

    if (itemsToUpdate.some(item => item.status === 'Available')) {
      throw new Error('One or more selected items are already available.');
    }

    const updatedItems = itemsToUpdate.map(item => ({
      id: item.id,
      status: 'Available' as const,
      checkedOutBy: null,
      checkedOutById: null,
      checkedOutDate: null,
      checkedInDate: new Date().toISOString(),
      // Keep track of who had it for the log
      prevMemberId: item.checkedOutById,
      prevMemberName: item.checkedOutBy,
    }));

    await prisma.$transaction([
      ...updatedItems.map(item =>
        prisma.inventoryItem.update({
          where: { id: item.id },
          data: {
            status: item.status,
            checkedOutBy: null,
            checkedOutById: null,
            checkedOutDate: null,
            checkedInDate: item.checkedInDate,
          }
        })
      ),
      ...updatedItems.map(item =>
        prisma.inventoryLog.create({
          data: {
            itemId: item.id,
            itemName: itemsToUpdate.find(i => i.id === item.id)?.name || 'Unknown',
            action: 'CHECKIN',
            teamMemberId: item.prevMemberId,
            teamMemberName: item.prevMemberName,
          }
        })
      )
    ]);

    revalidatePath('/inventory');
    revalidatePath('/checkin');
    revalidatePath('/');
    revalidatePath('/history');

    return { success: true, message: 'Equipment checked in successfully!' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message };
  }
}

export async function bulkAddTeamMembers(members: { name: string }[]) {
  try {
    for (const m of members) {
      if (!m.name) continue;
      const existing = await prisma.teamMember.findFirst({
        where: { name: m.name }
      });
      if (!existing) {
        await prisma.teamMember.create({ data: { name: m.name } });
      }
    }
    revalidatePath('/');
    revalidatePath('/checkout');
    revalidatePath('/history');
    return { success: true, message: 'Team members imported successfully!' };
  } catch (error) {
    return { success: false, message: 'Failed to import team members.' };
  }
}

export async function bulkAddInventoryItems(items: { name: string, status?: string }[]) {
  try {
    for (const i of items) {
      if (!i.name) continue;
      const existing = await prisma.inventoryItem.findFirst({
        where: { name: i.name }
      });
      if (!existing) {
        await prisma.inventoryItem.create({
          data: {
            name: i.name,
            status: i.status || 'Available',
          }
        });
      }
    }
    revalidatePath('/');
    revalidatePath('/inventory');
    revalidatePath('/history');
    return { success: true, message: 'Inventory items imported successfully!' };
  } catch (error) {
    return { success: false, message: 'Failed to import inventory items.' };
  }
}
