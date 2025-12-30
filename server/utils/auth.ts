import { H3Event, createError } from "h3";
import { clerkClient } from "@clerk/nuxt/server";
import { AccountService } from "../lib/services/account.service";

/**
 * Get authenticated user or throw 401
 */
export const requireAuth = async (event: H3Event) => {
  const auth = event.context.auth();
  if (!auth?.userId) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  return auth;
};

/**
 * Get account from database by Clerk userId
 */
export const getAccountByUserId = async (userId: string) => {
  return AccountService.findByUserId(userId);
};

/**
 * Get admin user or throw 403 (requires account lookup)
 */
export const requireAdmin = async (event: H3Event) => {
  const auth = await requireAuth(event);
  const account = await getAccountByUserId(auth.userId);
  if (!account || account.role !== "admin") {
    throw createError({
      statusCode: 403,
      message: "Forbidden: Admin access required",
    });
  }
  return { auth, account };
};

/**
 * Get Clerk user details
 */
export const getClerkUser = async (event: H3Event, userId: string) => {
  return clerkClient(event).users.getUser(userId);
};
