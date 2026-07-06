// types/auth.ts
import { z } from 'zod';

// Build the runtime evaluation schema using Zod
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid administrative email layout string"),
  password: z.string().min(6, "Administrative password keys require a minimum of 6 characters"),
});

// Infer the static TypeScript contract type from our schema definition
export type LoginCredentials = z.infer<typeof loginSchema>;