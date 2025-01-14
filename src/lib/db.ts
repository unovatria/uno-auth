import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

//eğer development modda değilde production modda olsaydı bu yeterli oluyordu.
//export const db = new PrismaClient();