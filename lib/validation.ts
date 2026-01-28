/**
 * Input validation schemas using Zod
 */

import { z } from 'zod';

/**
 * Schema for creating a paste
 */
export const createPasteSchema = z.object({
  content: z.string().min(1, 'Content is required and must be non-empty'),
  ttl_seconds: z.number().int().min(1, 'TTL must be at least 1 second').optional(),
  max_views: z.number().int().min(1, 'Max views must be at least 1').optional(),
});

export type CreatePasteInput = z.infer<typeof createPasteSchema>;

/**
 * Validate and parse create paste input
 */
export function validateCreatePaste(data: unknown): { 
  success: true; 
  data: CreatePasteInput 
} | { 
  success: false; 
  error: string 
} {
  try {
    const parsed = createPasteSchema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { 
        success: false, 
        error: firstError.message 
      };
    }
    return { 
      success: false, 
      error: 'Invalid input' 
    };
  }
}
