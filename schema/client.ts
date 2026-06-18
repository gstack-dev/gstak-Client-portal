import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.literal("user"),
  client_type: z.enum(["starter", "professional", "agency"], "Please select a client type"),
  image: z.null(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
