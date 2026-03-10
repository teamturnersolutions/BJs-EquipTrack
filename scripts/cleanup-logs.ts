import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const days = parseInt(process.argv[2]) || 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    console.log(`Cleaning up inventory logs older than ${days} days (before ${cutoff.toISOString()})...`);

    try {
        const deleted = await prisma.inventoryLog.deleteMany({
            where: {
                timestamp: {
                    lt: cutoff,
                },
            },
        });

        console.log(`Successfully deleted ${deleted.count} log entries.`);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
