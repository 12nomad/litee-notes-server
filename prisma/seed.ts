import prisma from "../src/utils/prisma.util";
import { hash } from "../src/utils/argon2.util";
import { faker } from "@faker-js/faker";

// Other types will be generated by prisma including the relations (ex: posts Post[])
interface User {
  username: string;
  email: string;
  password: string;
}

const getUsersArr = async (): Promise<User[]> => {
  const userArr: User[] = [];

  for (let i = 0; i < 3; i++) {
    userArr.push({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: await hash(faker.internet.password()),
    });
  }

  return userArr;
};

const main = async () => {
  // FIXME:
  // await prisma.user.deleteMany();
  // FIXME:
  // await prisma.user.createMany({
  //   data: await getUsersArr(),
  //   skipDuplicates: true,
  // });
  // (await getUsersArr()).forEach(
  //   async ({ email, password, username }) =>
  //     await prisma.user.create({ data: { email, password, username } })
  // );
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
