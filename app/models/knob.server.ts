import type { Knob } from "@prisma/client";
import { prisma } from "~/db.server";

export async function updateKnob(id: string, posX: number, posY: number) {
  return prisma.knob.update({ where: { id }, data: { posX, posY } });
}

export async function createKnob(newKnob: Omit<Knob, "id" | "Pedal">) {
  return prisma.knob.create({ data: newKnob });
}
