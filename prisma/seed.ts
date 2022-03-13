import { PrismaClient } from '@prisma/client';
import { interests } from './seeds/interest';
const prisma = new PrismaClient()

async function main() {
    for (let interest of interests) {
        await prisma.interest.create({
            data: interest
        });
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })