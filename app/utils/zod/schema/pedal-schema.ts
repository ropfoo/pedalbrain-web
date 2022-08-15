import { z } from "zod";

export const createPedalSchema = z.object({
  name: z.string().min(1),
});
