import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

async function main() {
  const newUser = await prisma.user.create({
    data: {
      firstName: "Alice",
      lastName: "White",
      email: "alice@prisma.io",
      bio: "",
      passwordHash: "1234",
      roles: [UserRole.AUTHOR],
    },
  });
  console.log(newUser);
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
