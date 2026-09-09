import { z } from "zod";

export const consultingInquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid work email.").max(320),
  organization: z.string().trim().max(160).optional(),
  topic: z.string().trim().min(2, "Please select a consulting topic.").max(120),
  message: z.string().trim().min(20, "Please share a little more detail so Kannan can prepare.").max(2000),
  website: z.string().max(0).optional(),
});

export type ConsultingInquiry = z.infer<typeof consultingInquirySchema>;

export function formatConsultingInquiry(inquiry: ConsultingInquiry) {
  return [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Organization: ${inquiry.organization || "Not supplied"}`,
    `Topic: ${inquiry.topic}`,
    "",
    "Message:",
    inquiry.message,
  ].join("\n");
}
