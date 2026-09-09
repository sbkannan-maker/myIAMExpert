import { z } from "zod";

export const newsletterSubscriptionSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address.").max(320),
  website: z.string().max(0).optional(),
});
