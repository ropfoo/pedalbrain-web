import { z } from "zod";

export const numString = z
  .string()
  .min(1, { message: "bla error" })
  .transform((input) => parseFloat(input));
