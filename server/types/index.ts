/**
 * TypeScript interfaces for the API
 */

// Base types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Alternative types
export interface Alternative {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  description?: string | null;
  faviconUrl?: string | null;
  isFeatured?: boolean;
  isOpenSource?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAlternativeInput {
  name: string;
  slug: string;
  websiteUrl: string;
  description?: string;
  faviconUrl?: string;
  isFeatured?: boolean;
  isOpenSource?: boolean;
}

export interface UpdateAlternativeInput {
  name?: string;
  slug?: string;
  websiteUrl?: string;
  description?: string;
  faviconUrl?: string;
  isFeatured?: boolean;
  isOpenSource?: boolean;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  label?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  label?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  label?: string;
}

// Tool types
export interface Tool {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  description?: string | null;
  content?: string | null;
  screenshotUrl?: string | null;
  faviconUrl?: string | null;
  submitterName?: string | null;
  submitterEmail?: string | null;
  categoryId?: string | null;
  isOpenSource?: boolean;
  isFeatured?: boolean;
  pageViews?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateToolInput {
  name: string;
  slug: string;
  websiteUrl: string;
  description?: string;
  content?: string;
  screenshotUrl?: string;
  submitterName?: string;
  submitterEmail?: string;
  categoryId?: string;
  alternativeId?: string;
  isOpenSource?: boolean;
  isFeatured?: boolean;
}

export interface UpdateToolInput {
  name?: string;
  slug?: string;
  websiteUrl?: string;
  description?: string;
  content?: string;
  screenshotUrl?: string;
  submitterName?: string;
  submitterEmail?: string;
  categoryId?: string;
  isOpenSource?: boolean;
  isFeatured?: boolean;
  pageViews?: number;
}

// Image types
export interface Image {
  id: string;
  url: string;
  thumbnailUrl?: string;
  fileId?: string;
  filename?: string;
  originalName?: string;
  size?: number;
  mimeType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateImageInput {
  url: string;
  thumbnailUrl?: string;
  fileId?: string;
  filename?: string;
  originalName?: string;
  size?: number;
  mimeType?: string;
}

export interface UpdateImageInput {
  url?: string;
  thumbnailUrl?: string;
  fileId?: string;
  filename?: string;
  originalName?: string;
  size?: number;
  mimeType?: string;
}

// Query parameters
export interface PaginationQuery {
  page?: number;
  limit?: number;
  q?: string;
}
