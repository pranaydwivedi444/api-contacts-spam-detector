import { Request, Response } from "express";
import prisma from "../db/db.js";
import {  formatResults } from "../lib/helper.js";

export  async function markAsSpam(
  req: Request,
  res: Response
): Promise<Response | void> {
  const { phoneNumber } = req.body;
 console.log(phoneNumber);
  try {
    const result = await prisma.$transaction([
      prisma.spam.create({
        data: {
          phoneNumber,
        },
      }),
      prisma.contact.updateMany({
        where: {
          phoneNumber
        },
        data: {
          isSpam: true,
        },
      }),
    ]);
    res.json({ message: "Number marked as spam", spam: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
}
interface AuthenticatedRequest extends Request {
  userId?: string;
}
export async function searchContacts(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response | void> {
  const { name, phoneNumber} = req.query;
  const userId = req?.userId || null;
  if (name === undefined && phoneNumber === undefined) {
    return res
      .status(400)
      .json({ message: "Please provide either name or phoneNumber" });
  }
  try {
    let contacts = [];
    //If User has given name only 
    if (name) {
        contacts = await searchByName(name as string, userId);
        return res.status(200).json({  contacts });
    } else if (phoneNumber) {
        const contactInfo = await searchByPhoneNumber(
          phoneNumber as string,
          userId
        );
        return res.status(200).json(contactInfo);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred"});
  }
  
}

async function searchByName(name: string, userId: string | null) {
  const contactsStartingWith = await prisma.contact.findMany({
    where: { name: { startsWith: name, mode: "insensitive" } },
  });

  const contactsContaining = await prisma.contact.findMany({
    where: { name: { contains: name, mode: "insensitive" } },
    orderBy: { name: "asc" },
  });
//it will include the relevant results first
  const combinedContacts = [...contactsStartingWith, ...contactsContaining];
  return formatResults(combinedContacts, userId);
}

async function searchByPhoneNumber(phoneNumber: string, userId: string | null) {
  const user = await prisma.user.findFirst({ where: { phoneNumber } });

  if (user) {
    const spam = await prisma.spam.findFirst({ where: { phoneNumber } });
    const isSpam = Boolean(spam);
    const spamReports = isSpam ? spam.reports : 0;
    const email = user.id === userId ? user.email : null;
    //if user has contacts then only show the email
    return { name: user.name, isSpam, spamReports, email };
  } else {
    const contacts = await prisma.contact.findMany({ where: { phoneNumber } });
    const formattedContacts = formatResults(contacts, userId);
    return { formattedContacts };
  }
}