import z from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "name must be at least 3 chars"),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
