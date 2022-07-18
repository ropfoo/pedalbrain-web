import { z } from "zod";
import { numString } from "../helper/num-string";

export const updateKnobSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  posX: numString,
  posY: numString,
  size: numString,
});

export const createKnobSchema = z.object({
  name: z.string().min(1, { message: "Type in a knob name" }),
  size: numString,
  posX: numString,
  posY: numString,
  rotation: numString,
  pedalId: z.string().min(1),
});
