/**
 * Core Type Definitions
 * 
 * These are foundational types used throughout the application.
 * All domain-specific types reference back to these core definitions.
 */

// ─── ──── ENUMS ─── ────

/// <reference types="vite/client" />

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export enum UserRole {
  AUTHOR = 'author',
  ADMIN = 'admin',
}

// ─── ──── USER TYPES ─── ────

/** Represents a user registered in the system */
export interface User {
  uid: string;           // Firebase Auth UID (auto-generated)
  email: string;         // User's email address
  displayName?: string;  // Display name (may be empty on signup)
  photoURL?: string;     // Profile picture URL (from Firebase Storage)
  role: UserRole;        // Access level
  createdAt: Date | null; // Timestamp or null for backwards compat

  /** Serialized version stored in Firestore */
  toFirestore(): Record<string, unknown>;
}

// ─── ──── POST TYPES ─── ────

/** Represents a blog post document in Firestore */
export interface Post {
  id: string;                          // Document ID (auto-generated)
  title: string;                       // Full post title
  slug: string;                        // URL-friendly identifier
  authorId: string;                    // Reference to users.uid
  categoryIds: string[];              // References to categories doc IDs
  tagIds: string[];                   // References to tags doc IDs
  content: string;                     // TipTap editor JSON structure (serialized)
  excerpt: string;                     // Short description for card previews
  coverImage: string | null;          // Storage path (e.g., "covers/post123.jpg") or null
  status: PostStatus;                  // Draft vs published state
  views: number;                      // Read count counter
  likes: number;                      // Like count
  createdAt: Date | null;             // Creation timestamp
  updatedAt: Date | null;              // Last modification timestamp

  /** Serialized version stored in Firestore */
  toFirestore(): Record<string, unknown>;
}

// ─── ──── CATEGORY TYPES ─── ────

/** Represents a blog category */
export interface Category {
  id: string;            // Document ID (auto-generated)
  name: string;          // Human-readable name (e.g., "Technology")
  slug: string;          // URL-friendly identifier for filtering
  description?: string;  // Optional brief description
}

// ─── ──── TAG TYPES ─── ────

/** Represents a blog tag */
export interface Tag {
  id: string;        // Document ID (auto-generated)
  name: string;      // Human-readable tag (e.g., "React", "TypeScript")
}

// ─── ──── COMMENT TYPES ─── ────

/** Represents a comment on a blog post */
export interface Comment {
  id: string;         // Document ID (auto-generated)
  authorId: string;   // Reference to users.uid
  content: string;    // Text or markdown content
  createdAt: Date | null;
}

// ─── ──── RESPONSE TYPES ─── ────

/** Blog post with additional metadata for API responses */
export interface PostResponse extends Omit<Post, 'toFirestore'> {
  author?: User;     // Hydrated author data (optional)
  categories?: Category[];
  tags?: Tag[];
}

// ─── ──── PAGINATION TYPES ─── ────

/** Pagination parameters for list queries */
export interface PaginationParams {
  page: number;      // Current page (1-based)
  limit: number;     // Items per page
  sort?: string;     // Sort field ('createdAt', 'views')
  direction?: 'asc' | 'desc';
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── ──── EDITOR TYPES ─── ────

/** TipTap editor content structure (serialized) */
export interface EditorContent {
  type: string;       // 'doc' for root document
  content: unknown[]; // Array of nodes (headings, paragraphs, images, etc.)
}

// ─── ──── FIREBASE CONFIG TYPES ─── ────

/** Firebase configuration object */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  // Optional OAuth config (Google Sign-In)
  googleOAuthClientId?: string;
}

// ─── ──── UTILITY TYPES ─── ────

/** Date formatting options */
export interface DateDisplayOptions {
  format?: string;    // date-fns format string (e.g., 'MMM dd, yyyy')
  showTime?: boolean; // Include time component
}

// ─── ──── IMAGE UPLOAD TYPES ─── ────

/** File upload metadata */
export interface UploadFile {
  name: string;          // Original file name
  type: string;          // MIME type (e.g., 'image/jpeg')
  size: number;          // File size in bytes
  storagePath?: string;  // Storage path after upload
}

// ─── ──── API RESPONSE TYPES ─── ────

/** Generic API response structure */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

/** Error response for failed operations */
export interface ApiError {
  code: string;       // Error code (e.g., 'NOT_FOUND', 'UNAUTHORIZED')
  message: string;    // Human-readable error message
  statusCode?: number;
}
