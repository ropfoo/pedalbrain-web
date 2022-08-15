import { z } from "zod";

export const createPedalSchema = z.object({
  name: z.string().min(1),
});

export const deletePedalSchema = z.object({
  id: z.string().min(1),
});
