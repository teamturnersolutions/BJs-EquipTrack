import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function parseCsv(csvData: string) {
    const lines = csvData.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map((h) => h.trim());
    return lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim());
        const entry: any = {};
        headers.forEach((header, index) => {
            const value = values[index];
            entry[header] = value === '' || value === undefined ? null : value;
        });
        return entry;
    });
}

async function main() {
    const teamMembersPath = path.join(process.cwd(), 'team-members.csv');
    const inventoryPath = path.join(process.cwd(), 'inventory.csv');

    // Map to store Old String ID -> New Integer ID
    const memberIdMap = new Map<string, number>();

    if (fs.existsSync(teamMembersPath)) {
        console.log('--- Processing Team Members ---');
        const data = fs.readFileSync(teamMembersPath, 'utf-8');
        const members = parseCsv(data);

        for (const m of members) {
            if (!m.name) continue;

            const existing = await prisma.teamMember.findFirst({
                where: { name: m.name }
            });

            let memberId: number;
            if (existing) {
                memberId = existing.id;
                console.log(`- Member already exists: ${m.name} (ID: ${memberId})`);
            } else {
                const created = await prisma.teamMember.create({
                    data: { name: m.name }
                });
                memberId = created.id;
                console.log(`- Created Member: ${m.name} (ID: ${memberId})`);
            }

            if (m.id) {
                memberIdMap.set(m.id, memberId);
            }
        }
    }

    if (fs.existsSync(inventoryPath)) {
        console.log('\n--- Processing Inventory Items ---');
        const data = fs.readFileSync(inventoryPath, 'utf-8');
        const items = parseCsv(data);

        for (const i of items) {
            if (!i.name) continue;

            const newMemberId = i.checkedOutById ? memberIdMap.get(i.checkedOutById) : null;

            const existing = await prisma.inventoryItem.findFirst({
                where: { name: i.name }
            });

            const dataObj = {
                name: i.name,
                status: i.status || 'Available',
                checkedOutBy: i.checkedOutBy,
                checkedOutById: newMemberId,
                checkedOutDate: i.checkedOutDate,
                checkedInDate: i.checkedInDate,
            };

            if (existing) {
                await prisma.inventoryItem.update({
                    where: { id: existing.id },
                    data: dataObj
                });
                console.log(`- Updated Item: ${i.name}`);
            } else {
                await prisma.inventoryItem.create({
                    data: dataObj
                });
                console.log(`- Created Item: ${i.name}`);
            }
        }
    }

    console.log('\nMigration complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
