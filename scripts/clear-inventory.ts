import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing all items from InventoryItem table...');

    try {
        const deleted = await prisma.inventoryItem.deleteMany({});
        console.log(`Successfully cleared ${deleted.count} inventory items.`);
        console.log('Inventory is now empty.');
    } catch (error) {
        console.error('Error clearing inventory:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
