import { z } from "zod";

const index = z.object({
  query: z.object({
    role: z.string().optional(),
    keywords: z.string().optional(),
    page: z.preprocess(
      (v) => (typeof v === "string" ? parseInt(v as string, 10) : v),
      z
        .number()
        .min(1, { message: "Please insert page at least 1." })
        .positive()
        .optional(),
    ),
    size: z.preprocess(
      (v) => (typeof v === "string" ? parseInt(v as string, 10) : v),
      z
        .number()
        .min(1, { message: "Please insert size at least 1." })
        .positive()
        .max(100)
        .optional(),
    ),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
  }),
});

export default {
  index,
};
