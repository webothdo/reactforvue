/**
 * Service layer for Tools business logic
 * Separates business logic from HTTP handling
 */

import { 
  insertTool, 
  insertToolToAlternative
} from "../../utils/insert";
import { 
  updateTool
} from "../../utils/update";
import { 
  deleteTool
} from "../../utils/delete";
import { 
  getPaginatedTools, 
  getToolById,
  getToolBySlug
} from "../../utils/queries";
import { 
  CreateToolInput, 
  UpdateToolInput, 
  PaginatedResponse 
} from "../../types";

export class ToolService {
  /**
   * Create a new tool
   */
  static async create(data: CreateToolInput) {
    const newTool = await insertTool(data);
    
    // Handle the alternativeId if it's present
    if (data.alternativeId) {
      await insertToolToAlternative(newTool.id, data.alternativeId);
    }
    
    return newTool;
  }

  /**
   * Get paginated list of tools
   */
  static async findMany(params: {
    page?: number;
    limit?: number;
    q?: string;
  }): Promise<PaginatedResponse> {
    return await getPaginatedTools({
      page: params.page || 1,
      limit: params.limit || 20,
      q: params.q,
    });
  }

  /**
   * Get tool by ID
   */
  static async findById(id: string) {
    return await getToolById(id);
  }

  /**
   * Get tool by slug
   */
  static async findBySlug(slug: string) {
    return await getToolBySlug({ slug });
  }

  /**
   * Update tool by ID
   */
  static async update(id: string, data: UpdateToolInput) {
    return await updateTool(id, data);
  }

  /**
   * Delete tool by ID
   */
  static async delete(id: string) {
    return await deleteTool(id);
  }

  /**
   * Link a tool to an alternative
   */
  static async linkToolToAlternative(toolId: string, alternativeId: string) {
    return await insertToolToAlternative(toolId, alternativeId);
  }
}