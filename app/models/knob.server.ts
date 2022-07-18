import type { Knob } from "@prisma/client";
import { prisma } from "~/db.server";

export async function updateKnobPosition(
  data: Pick<Knob, "id" | "posX" | "posY">
) {
  return prisma.knob.update({ where: { id: data.id }, data });
}

export async function updateKnobGeneral(
  data: Pick<Knob, "id" | "name" | "size">
) {
  return prisma.knob.update({ where: { id: data.id }, data });
}

export async function createKnob(data: Omit<Knob, "id" | "Pedal">) {
  return prisma.knob.create({ data });
}

export async function deleteKnob(id: string) {
  return prisma.knob.delete({ where: { id } });
}
