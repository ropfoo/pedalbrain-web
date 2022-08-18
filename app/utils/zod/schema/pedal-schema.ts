import { z } from "zod";

export const createPedalSchema = z.object({
  name: z.string().min(1, { message: "Type in a pedal name" }),
});

export const deletePedalSchema = z.object({
  id: z.string().min(1),
});

export const updatePedalNameSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, { message: "Type in a pedal name" }),
});
