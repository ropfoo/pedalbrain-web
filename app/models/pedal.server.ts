import { prisma } from "~/db.server";

export async function getPedal(id: string) {
  return prisma.pedal.findFirst({
    where: { id },
    include: { knobs: true },
  });
}

export async function getPedalListing() {
  return prisma.pedal.findMany({
    select: {
      id: true,
      name: true,
      color: true,
      createdAt: true,
    },
  });
}

export async function updatePedal({
  id,
  width,
  height,
}: {
  id: string;
  width: number;
  height: number;
}) {
  return prisma.pedal.update({ where: { id }, data: { width, height } });
}
