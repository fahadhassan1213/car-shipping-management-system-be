import { PrismaClient } from '@prisma/client';
import { Roles } from './data/UsersRole';
const prisma = new PrismaClient();

async function main() {
  // Seed user roles
  for (const role of Roles) {
    await prisma.roleDescription.upsert({
      where: { name: role.name },
      update: {},
      create: {
        name: role.name,
        description: role.description,
      },
    });
  }

  const adminRoleId = await prisma.roleDescription.findUnique({
    where: { name: 'admin' },
  });
  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      name: 'Admin',
      password: '$2b$10$btodHpHti0d4gEB2zd1LdueFA1lJLISmdvNxOVuvQda5DfJDnHD1u',
      roles: {
        create: {
          role: {
            connect: {
              id: adminRoleId.id,
            },
          },
        },
      },
    },
  });

  const userRoleId = await prisma.roleDescription.findUnique({
    where: { name: 'user' },
  });
  const fahad = await prisma.user.upsert({
    where: { email: 'fahad@gmail.com' },
    update: {},
    create: {
      email: 'fahad@gmail.com',
      name: 'Fahad Hassan',
      password: '$2b$10$btodHpHti0d4gEB2zd1LdueFA1lJLISmdvNxOVuvQda5DfJDnHD1u',
      roles: {
        create: {
          role: {
            connect: {
              id: userRoleId.id,
            },
          },
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
