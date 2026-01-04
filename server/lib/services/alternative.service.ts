/**
 * Service layer for Alternatives business logic
 * Separates business logic from HTTP handling
 */

import { 
  insertAlternative, 
  insertToolToAlternative
} from "../../utils/insert";
import { 
  updateAlternative
} from "../../utils/update";
import { 
  deleteAlternative
} from "../../utils/delete";
import { 
  getPaginatedAlternatives, 
  getAlternativeById 
} from "../../utils/queries";
import { 
  CreateAlternativeInput, 
  UpdateAlternativeInput, 
  PaginatedResponse 
} from "../../types";

export class AlternativeService {
  /**
   * Create a new alternative
   */
  static async create(data: CreateAlternativeInput) {
    return await insertAlternative(data);
  }

  /**
   * Get paginated list of alternatives
   */
  static async findMany(params: {
    page?: number;
    limit?: number;
    q?: string;
  }): Promise<PaginatedResponse> {
    return await getPaginatedAlternatives({
      page: params.page || 1,
      limit: params.limit || 20,
      q: params.q,
    });
  }

  /**
   * Get alternative by ID
   */
  static async findById(id: string) {
    return await getAlternativeById(id);
  }

  /**
   * Update alternative by ID
   */
  static async update(id: string, data: UpdateAlternativeInput) {
    return await updateAlternative(id, data);
  }

  /**
   * Delete alternative by ID
   */
  static async delete(id: string) {
    return await deleteAlternative(id);
  }

  /**
   * Link a tool to an alternative
   */
  static async linkTool(toolId: string, alternativeId: string) {
    return await insertToolToAlternative(toolId, alternativeId);
  }
}