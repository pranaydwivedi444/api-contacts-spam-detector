var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import prisma from "../db/db.js";
import { formatResults } from "../lib/helper.js";
export function markAsSpam(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { phoneNumber } = req.body;
        console.log(phoneNumber);
        try {
            const result = yield prisma.$transaction([
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred", error });
        }
    });
}
export function searchContacts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, phoneNumber } = req.query;
        const userId = (req === null || req === void 0 ? void 0 : req.userId) || null;
        if (name === undefined && phoneNumber === undefined) {
            return res
                .status(400)
                .json({ message: "Please provide either name or phoneNumber" });
        }
        try {
            let contacts = [];
            //If User has given name only 
            if (name) {
                const contactsStartingWith = yield prisma.contact.findMany({
                    where: { name: { startsWith: name, mode: "insensitive" } },
                });
                const contactsContaining = yield prisma.contact.findMany({
                    where: { name: { contains: name, mode: "insensitive" } },
                    orderBy: { name: "asc" },
                });
                //   contacts = [...contactsStartingWith, ...contactsContaining];
                const contacts = [...contactsStartingWith, ...contactsContaining];
                const filtercontacts = formatResults(contacts, userId);
                return res.status(200).json({ filtercontacts });
            }
            else if (phoneNumber) {
                let isSpam = false;
                let spamReports = 0;
                const user = yield prisma.user.findFirst({
                    where: { phoneNumber: phoneNumber },
                });
                if (user) {
                    //if ownedby user , then show the email of the person if OWNUSERID == USERID
                    const spam = yield prisma.spam.findFirst({
                        where: { phoneNumber: phoneNumber },
                    });
                    //if found spam then mark isSpam as true , spam.reports return them ;
                    if (spam) {
                        isSpam = true;
                        spamReports = spam.reports;
                    }
                    let email = user.id == userId ? user.email : null;
                    return res.status(200).json({ name: user.name, isSpam, spamReports, email });
                }
                else {
                    console.log(phoneNumber);
                    contacts = yield prisma.contact.findMany({
                        where: {
                            phoneNumber: phoneNumber,
                        },
                    });
                    console.log(contacts);
                    const formattedContacts = formatResults(contacts, userId);
                    res.json({ formattedContacts });
                }
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "An error occurred" });
        }
    });
}
