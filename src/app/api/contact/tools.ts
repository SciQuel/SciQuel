import prisma from "@/lib/prisma";
import { type Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function isEditor() {
  const session = await getServerSession();
  console.log(session);
  const user = await prisma.user.findUnique({
    where: { email: session?.user.email ?? "noemail" },
  });

  if (!user || !user.roles.includes("EDITOR")) {
    return false;
  }
  return true;
}

export async function checkSpam(useEmail: boolean, data: string) {
  // see if too many messages have been left in the past 48 hours?
  // useEmail checks if we fallback to an email
  // ip should be default

  // data should be the email or ip address

  const time = new Date();
  const maxEmails = 35;
  // 1000ms/s * 60 s/min * 60 min/hour * 24 hr/day * 2 days
  const past = 1000 * 60 * 60 * 24 * 2;
  time.setTime(time.getTime() - past);
  try {
    if (useEmail) {
      const emailCount = await prisma.contactMessage.count({
        where: {
          AND: [
            {
              email: data,
            },
            {
              createdAt: {
                gt: time,
              },
            },
          ],
        },
      });

      if (emailCount >= maxEmails) {
        const newBanDate = new Date();
        const cooldown = 1000 * 60 * 60 * 24 * 7;
        newBanDate.setTime(newBanDate.getTime() + cooldown);
        // 1000 ms/s * 60 s/min * 60 min/hour * 24 hours/day * 7 days

        const newTempBan = await prisma.blockedUser.create({
          data: {
            email: data,
            reason: "automated ban from contact box spam",
            banEndTime: newBanDate,
            lastUpdated: new Date(),
          },
        });
        return true;
      } else {
        return false;
      }
    } else {
      const ipCount = await prisma.contactMessage.count({
        where: {
          AND: [
            {
              senderIp: data,
            },
            {
              createdAt: {
                gt: time,
              },
            },
          ],
        },
      });

      if (ipCount >= maxEmails) {
        const newBanDate = new Date();
        const cooldown = 1000 * 60 * 60 * 24 * 7;
        newBanDate.setTime(newBanDate.getTime() + cooldown);
        // 1000 ms/s * 60 s/min * 60 min/hour * 24 hours/day * 7 days

        const newTempBan = await prisma.blockedUser.create({
          data: {
            ip: data,
            reason: "automated ban from contact box spam",
            banEndTime: newBanDate,
            lastUpdated: new Date(),
          },
        });
        return true;
      } else {
        return false;
      }
    }
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function checkBans(email: string, ip?: string) {
  // check if user is on ban list

  // email first
  const data: Prisma.BlockedUserFindFirstArgs = {
    where: {
      email: {
        equals: email,
      },
    },
  };

  try {
    const foundEmail = await prisma.blockedUser.findFirst({
      ...data,
    });
    if (foundEmail) {
      return true;
    } else {
      if (ip) {
        const ipData: Prisma.BlockedUserFindFirstArgs = {
          where: {
            ip: {
              equals: ip,
            },
          },
        };

        const foundIp = await prisma.blockedUser.findFirst({
          ...ipData,
        });
        if (foundIp) {
          return true;
        }
        return false;
      }
    }
  } catch (err) {
    return undefined;
  }
}
