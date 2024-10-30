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
       const contactsStartingWith = await prisma.contact.findMany({
         where: { name: { startsWith: name as string, mode: "insensitive" } },         
       });
       const contactsContaining = await prisma.contact.findMany({
         where: { name: { contains: name as string, mode: "insensitive" } },         
         orderBy: { name: "asc" },
       });
    //   contacts = [...contactsStartingWith, ...contactsContaining];
    const contacts = [...contactsStartingWith, ...contactsContaining];
    const filtercontacts =  formatResults(contacts,userId);
     return res.status(200).json({filtercontacts});
    } else if (phoneNumber) {
      let isSpam = false;
      let spamReports = 0;
      const user = await prisma.user.findFirst({
        where: { phoneNumber: phoneNumber as string },
      });
      if (user) {
        //if ownedby user , then show the email of the person if OWNUSERID == USERID
        const spam = await prisma.spam.findFirst({
          where: { phoneNumber: phoneNumber as string },
        });
        //if found spam then mark isSpam as true , spam.reports return them ;
        if (spam) {
          isSpam = true;
          spamReports = spam.reports;
        }
        let email = user.id == userId ? user.email : null;
         return res.status(200).json({name:user.name,isSpam,spamReports,email});
      } else {
        console.log( phoneNumber);
        contacts = await prisma.contact.findMany({
          where: {
            phoneNumber: phoneNumber as string,
          },
        });
        console.log(contacts);
        const formattedContacts =  formatResults(contacts,userId);
        res.json({formattedContacts});
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred"});
  }
  
}