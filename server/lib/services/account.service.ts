/**
 * Service layer for Account business logic
 * Handles user account operations and sync with Clerk
 */

import { db } from "../drizzle";
import { account } from "../../db/schema";
import { eq } from "drizzle-orm";

export interface CreateAccountInput {
  userId: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

export interface UpdateAccountInput {
  name?: string;
  email?: string;
  image?: string;
  role?: string;
}

export class AccountService {
  /**
   * Find account by Clerk userId
   */
  static async findByUserId(userId: string) {
    const [result] = await db
      .select()
      .from(account)
      .where(eq(account.userId, userId))
      .limit(1);
    return result || null;
  }

  /**
   * Find account by ID
   */
  static async findById(id: string) {
    const [result] = await db
      .select()
      .from(account)
      .where(eq(account.id, id))
      .limit(1);
    return result || null;
  }

  /**
   * Create a new account
   */
  static async create(data: CreateAccountInput) {
    const [newAccount] = await db
      .insert(account)
      .values({
        userId: data.userId,
        name: data.name,
        email: data.email,
        image: data.image,
        role: data.role || "user",
      })
      .returning();
    return newAccount;
  }

  /**
   * Update account by userId
   */
  static async updateByUserId(userId: string, data: UpdateAccountInput) {
    const [updated] = await db
      .update(account)
      .set(data)
      .where(eq(account.userId, userId))
      .returning();
    return updated;
  }

  /**
   * Upsert account - create if not exists, update if exists
   */
  static async upsert(data: CreateAccountInput) {
    const existing = await this.findByUserId(data.userId);
    if (existing) {
      return this.updateByUserId(data.userId, {
        name: data.name,
        email: data.email,
        image: data.image,
      });
    }
    return this.create(data);
  }
}
