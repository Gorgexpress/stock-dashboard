import { z } from "zod";


export const bodySymbolsSchema = z.object({
  symbols: z.string().min(1).array().nonempty()
})

export const querySymbolsSchema = z.object({
  symbols: z.string()
    .transform((value) => value.split(','))
    .pipe(z.string().trim().min(1).array())});