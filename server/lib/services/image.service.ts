/**
 * Service layer for Images business logic
 * Separates business logic from HTTP handling
 */

import { 
  insertImage
} from "../../utils/insert";
import { 
  updateImage
} from "../../utils/update";
import { 
  deleteImage
} from "../../utils/delete";
import { 
  getPaginatedImages, 
  getImageById 
} from "../../utils/queries";
import { 
  CreateImageInput, 
  UpdateImageInput, 
  PaginatedResponse 
} from "../../types";

export class ImageService {
  /**
   * Create a new image
   */
  static async create(data: CreateImageInput) {
    return await insertImage(data);
  }

  /**
   * Get paginated list of images
   */
  static async findMany(params: {
    page?: number;
    limit?: number;
    q?: string;
  }): Promise<PaginatedResponse> {
    return await getPaginatedImages({
      page: params.page || 1,
      limit: params.limit || 20,
      q: params.q,
    });
  }

  /**
   * Get image by ID
   */
  static async findById(id: string) {
    return await getImageById(id);
  }

  /**
   * Update image by ID
   */
  static async update(id: string, data: UpdateImageInput) {
    return await updateImage(id, data);
  }

  /**
   * Delete image by ID
   */
  static async delete(id: string) {
    return await deleteImage(id);
  }
}