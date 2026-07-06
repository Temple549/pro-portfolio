import { z } from 'zod';

// ============================================
// BLOG POST SCHEMA
// ============================================
export const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(200, "Title exceeds 200 character limit"),
  slug: z.string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  excerpt: z.string().max(500, "Excerpt exceeds 500 character limit").optional().default(""),
  content: z.string().min(1, "Content body is required"),
  coverImage: z.string().optional().default(""),
  published: z.boolean().default(false),
  tags: z.array(z.string().max(30)).max(10, "Maximum 10 tags allowed").default([]),
  author: z.string().default("Admin"),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Form-specific schema to prevent React Hook Form type mismatches
export const blogPostFormSchema = blogPostSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export type BlogPost = z.infer<typeof blogPostSchema>;
export type BlogPostInput = z.infer<typeof blogPostFormSchema>;

// ============================================
// EXPERIENCE SCHEMA
// ============================================
export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, "Company name is required").max(100),
  role: z.string().min(1, "Role/title is required").max(100),
  description: z.string().min(1, "Description is required").max(2000),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Use YYYY-MM format"),
  endDate: z.string().regex(/^\d{4}-\d{2}$/, "Use YYYY-MM format").optional().default(""),
  current: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  technologies: z.array(z.string().max(30)).max(20).default([]),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).refine(
  (data) => {
    if (!data.current && !data.endDate) return false;
    return true;
  },
  { message: "End date required when not current position", path: ["endDate"] }
).refine(
  (data) => {
    if (data.current && data.endDate) return false;
    return true;
  },
  { message: "Remove end date when marking as current", path: ["endDate"] }
);

export type Experience = z.infer<typeof experienceSchema>;
export type ExperienceInput = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>;

// ============================================
// CONTACT ENTRY SCHEMA
// ============================================
export const contactEntrySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Valid email required"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  read: z.boolean().default(false),
  archived: z.boolean().default(false),
  createdAt: z.coerce.date().optional(),
});

export type ContactEntry = z.infer<typeof contactEntrySchema>;
export type ContactEntryInput = Omit<ContactEntry, 'id' | 'read' | 'archived' | 'createdAt'>;

// ============================================
// COLLECTION CONSTANTS
// ============================================
export const COLLECTIONS = {
  BLOG_POSTS: 'blog_posts' as const,
  EXPERIENCES: 'experiences' as const,
  CONTACT_ENTRIES: 'contact_entries' as const,
} satisfies Record<string, string>;

// ============================================
// UTILITY: SLUG GENERATOR
// ============================================
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ============================================
// QUERY FILTER TYPES
// ============================================
export interface QueryFilter {
  field: string;
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'array-contains-any';
  value: unknown;
}

export interface QueryOptions {
  filters?: QueryFilter[];
  orderBy?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
}

// ============================================
// ABOUT ME SCHEMA
// ============================================
export const aboutSchema = z.object({
  headline: z.string().min(1, "Headline is required").max(100),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(2000),
  profileImage: z.string().optional().default(""),
  resumeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")).default(""),
});

export type AboutData = z.infer<typeof aboutSchema>;
export type AboutInput = z.infer<typeof aboutSchema>;