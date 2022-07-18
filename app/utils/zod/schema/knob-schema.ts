import { z } from "zod";
import { numString } from "../helper/num-string";

export const updateKnobGeneralSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  size: numString,
});

export const updateKnobPositionSchema = z.object({
  id: z.string(),
  posX: numString,
  posY: numString,
});

export const createKnobSchema = z.object({
  name: z.string().min(1, { message: "Type in a knob name" }),
  size: numString,
  posX: numString,
  posY: numString,
  rotation: numString,
  pedalId: z.string().min(1),
});
