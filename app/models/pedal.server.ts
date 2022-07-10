import { prisma } from "~/db.server";

export async function getPedal() {
  return prisma.pedal.findFirst({
    where: { name: "The Gainer 3" },
    include: { knobs: true },
  });
}
