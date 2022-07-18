import type { Knob } from "@prisma/client";
import { prisma } from "~/db.server";

export async function updateKnob(data: Omit<Knob, "pedalId" | "Pedal">) {
  return prisma.knob.update({ where: { id: data.id }, data });
}

export async function createKnob(data: Omit<Knob, "id" | "Pedal">) {
  return prisma.knob.create({ data });
}

export async function deleteKnob(id: string) {
  return prisma.knob.delete({ where: { id } });
}
