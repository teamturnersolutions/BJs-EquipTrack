import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing all team members from TeamMember table...');

    try {
        const deleted = await prisma.teamMember.deleteMany({});
        console.log(`Successfully cleared ${deleted.count} team members.`);
        console.log('Team member list is now empty.');
    } catch (error) {
        console.error('Error clearing team members:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
