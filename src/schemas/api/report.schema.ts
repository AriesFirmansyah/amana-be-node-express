import { ReportCategory, ReportStatus } from "@prisma/client";
import { z } from "zod";

const index = z.object({
  query: z.object({
    keywords: z.string().optional(),
    category: z.string().optional(),
    status: z.string().optional(),
    page: z.preprocess(
      (v) => (typeof v === "string" ? parseInt(v as string, 10) : v),
      z
        .number()
        .min(1, { message: "Page must be at least 1." })
        .positive()
        .optional(),
    ),
    size: z.preprocess(
      (v) => (typeof v === "string" ? parseInt(v as string, 10) : v),
      z
        .number()
        .min(1, { message: "Size must be at least 1." })
        .positive()
        .max(100)
        .optional(),
    ),
  }),
});

const store = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Report title is required." })
      .trim()
      .min(5, { message: "Report title must be at least 5 characters." })
      .max(191, { message: "Report title must not exceed 191 characters." }),
    category: z.nativeEnum(ReportCategory, {
      errorMap: () => ({ message: "Please select a valid incident category." }),
    }),
    description: z
      .string({ required_error: "Incident description is required." })
      .trim()
      .min(10, {
        message: "Incident description must be at least 10 characters.",
      }),
    incidentDate: z
      .string({ required_error: "Incident date is required." })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Please provide a valid incident date.",
      }),
    status: z
      .enum([ReportStatus.DRAFT, ReportStatus.SUBMITTED])
      .optional(),
  }),
});

const detail = z.object({
  params: z.object({
    id: z.preprocess(
      (v) => (typeof v === "string" ? parseInt(v, 10) : v),
      z.number({ required_error: "Report ID is required." }).positive(),
    ),
  }),
});

const update = z.object({
  params: z.object({
    id: z.preprocess(
      (v) => (typeof v === "string" ? parseInt(v, 10) : v),
      z.number({ required_error: "Report ID is required." }).positive(),
    ),
  }),
  body: z.object({
    title: z
      .string()
      .trim()
      .min(5, { message: "Report title must be at least 5 characters." })
      .max(191, { message: "Report title must not exceed 191 characters." })
      .optional(),
    category: z
      .nativeEnum(ReportCategory, {
        errorMap: () => ({
          message: "Please select a valid incident category.",
        }),
      })
      .optional(),
    description: z
      .string()
      .trim()
      .min(10, {
        message: "Incident description must be at least 10 characters.",
      })
      .optional(),
    incidentDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Please provide a valid incident date.",
      })
      .optional(),
    status: z.nativeEnum(ReportStatus).optional(),
    adminNotes: z.string().optional(),
  }),
});

const remove = z.object({
  params: z.object({
    id: z.preprocess(
      (v) => (typeof v === "string" ? parseInt(v, 10) : v),
      z.number({ required_error: "Report ID is required." }).positive(),
    ),
  }),
});

export default {
  index,
  store,
  detail,
  update,
  remove,
};
