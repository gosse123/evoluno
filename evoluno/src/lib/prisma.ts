import { PrismaClient } from "@prisma/client";

// Singleton Prisma pour éviter l'épuisement des connexions en dev
// (hot-reload Next.js crée sinon un nouveau client par rechargement).
// Référence : specs/001-auth-profile/plan.md §5, tâche T002.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
