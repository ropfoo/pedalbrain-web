import { prisma } from "~/db.server";

export type EditorPedal = Awaited<ReturnType<typeof getPedal>>;

export async function getPedal(id: string) {
  return prisma.pedal.findFirst({
    where: { id },
    include: { knobs: true },
  });
}

export async function getPedals() {
  return prisma.pedal.findMany({
    include: { knobs: true },
  });
}

export async function updatePedalSize({
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

export async function updatePedalName({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return prisma.pedal.update({ where: { id }, data: { name } });
}

export async function createPedal({ name }: { name: string }) {
  return prisma.pedal.create({
    data: { name, color: "orange", width: 300, height: 400 },
  });
}

export async function deletePedal({ id }: { id: string }) {
  return prisma.pedal.delete({ where: { id } });
}
