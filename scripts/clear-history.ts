import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing all transaction history from InventoryLog table...');

    try {
        const deleted = await prisma.inventoryLog.deleteMany({});
        console.log(`Successfully cleared ${deleted.count} log entries.`);
        console.log('The database is now ready for a fresh start.');
    } catch (error) {
        console.error('Error clearing history:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
