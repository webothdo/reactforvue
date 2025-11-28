# API Migration Guide

This guide helps you transition from the old individual endpoint structure to the new RESTful API structure.

## Overview

The API has been completely restructured to follow RESTful conventions with proper TypeScript typing. All endpoints are now grouped by resource type and use standard HTTP methods.

## New API Structure

### Alternatives
- **Create**: `POST /api/alternatives`
- **List**: `GET /api/alternatives`
- **Get Single**: `GET /api/alternatives/:id`
- **Update**: `PATCH /api/alternatives/:id`
- **Delete**: `DELETE /api/alternatives/:id`

### Categories
- **Create**: `POST /api/categories`
- **List**: `GET /api/categories`
- **Get Single**: `GET /api/categories/:id`
- **Update**: `PATCH /api/categories/:id`
- **Delete**: `DELETE /api/categories/:id`

### Tools
- **Create**: `POST /api/tools`
- **List**: `GET /api/tools`
- **Get Single**: `GET /api/tools/:id`
- **Get by Slug**: `GET /api/tools/slug/:slug`
- **Update**: `PATCH /api/tools/:id`
- **Delete**: `DELETE /api/tools/:id`

### Images
- **Create**: `POST /api/images`
- **List**: `GET /api/images`
- **Get Single**: `GET /api/images/:id`
- **Update**: `PATCH /api/images/:id`
- **Delete**: `DELETE /api/images/:id`

## Migration Steps

### 1. Update API Calls in Composables

The composables have been updated to use the new API structure. Here are the key changes:

#### Old: useAlternativesApi.js
```javascript
// CREATE Alternative
const createAlternative = async (payload) => {
  return await useFetch("/api/create-alternative", {
    method: "POST",
    body: payload,
  });
};

// UPDATE Alternative
const updateAlternative = async (id, payload) => {
  return await useFetch(`/api/update-alternative?id=${id}`, {
    method: "PATCH",
    body: payload,
  });
};

// DELETE Alternative
const deleteAlternative = async (id) => {
  return await useFetch(`/api/delete-alternative?id=${id}`, {
    method: "DELETE",
  });
};

// GET Alternatives with pagination and search
const getAlternatives = async ({ page = 1, limit = 20, q = "" } = {}) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (q) params.append("q", q);
  return await useFetch(`/api/get-alternatives?${params.toString()}`);
};
```

#### New: useAlternativesApi.ts
```typescript
// CREATE Alternative
const createAlternative = async (payload: CreateAlternativeInput) => {
  return await useFetch("/api/alternatives", {
    method: "POST",
    body: payload,
  });
};

// UPDATE Alternative
const updateAlternative = async (id: string, payload: UpdateAlternativeInput) => {
  return await useFetch(`/api/alternatives/${id}`, {
    method: "PATCH",
    body: payload,
  });
};

// DELETE Alternative
const deleteAlternative = async (id: string) => {
  return await useFetch(`/api/alternatives/${id}`, {
    method: "DELETE",
  });
};

// GET Alternatives with pagination and search
const getAlternatives = async ({ page = 1, limit = 20, q = "" }: { page?: number; limit?: number; q?: string } = {}) => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (q) params.append("q", q);
  return await useFetch(`/api/alternatives?${params.toString()}`);
};
```

### 2. Update Frontend Components

Update your components to use the new composable functions. The main changes are:

1. **Import the updated composables**:
   ```typescript
   import { useAlternativesApi } from "@/composables/useAlternativesApi";
   ```

2. **Update API call patterns**:
   - Old: `createAlternative(payload)`
   - New: `createAlternative(payload)`

3. **Handle the new response format**:
   - Old response: `{ data: any }`
   - New response: `{ success: boolean, data: any, message?: string }`

### 3. Update Error Handling

The new API uses standardized error responses:

```typescript
// Example error handling
const { data, error } = await getAlternatives({ page: 1, limit: 10 });

if (error.value) {
  console.error("API Error:", error.value);
  // Handle error (show toast, etc.)
} else if (data.value && !data.value.success) {
  console.error("API Error:", data.value.message);
  // Handle error (show toast, etc.)
}
```

### 4. Special Notes

#### Tools API
The tools API now has an additional endpoint for getting tools by slug:
```typescript
const getToolBySlug = async (slug: string) => {
  return await useFetch(`/api/tools/slug/${slug}`);
};
```

#### Image Upload
The image upload endpoint (`/api/upload-image`) remains unchanged as it's a special case.

## TypeScript Support

All composables now have proper TypeScript typing. You can import the types from `server/types`:

```typescript
import type {
  Alternative,
  Category,
  Tool,
  Image,
  CreateAlternativeInput,
  UpdateAlternativeInput,
  // ... other types
} from "@/types";
```

## Testing the New API

Before fully migrating, test the new API endpoints:

1. **Test each endpoint** with tools like Postman or cURL
2. **Verify responses** match the expected format
3. **Check error handling** by sending invalid data
4. **Test pagination** with different page sizes and search queries

## Cleanup

After verifying everything works correctly:

1. Remove old individual endpoint files (already done)
2. Update any remaining references to old endpoints
3. Verify all frontend functionality works as expected