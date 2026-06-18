import { z } from "zod";

export const projectStatuses = [
  "planning",
  "in_progress",
  "review",
  "completed",
  "on_hold",
  "cancelled",
] as const;

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(projectStatuses),
  progressPercentage: z.number().min(0).max(100),
  deadline: z.string().min(1, "Deadline is required"),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
