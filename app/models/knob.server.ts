import { prisma } from "~/db.server";

export async function updateKnob(id: string, posX: number, posY: number) {
  return prisma.knob.update({ where: { id }, data: { posX, posY } });
}
