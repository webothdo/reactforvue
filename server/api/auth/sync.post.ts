/**
 * POST /api/auth/sync
 * Sync Clerk user to database account table
 * Called on sign-up and sign-in to ensure user exists in database
 */

import { requireAuth, getClerkUser } from "../../utils/auth";
import { AccountService } from "../../lib/services/account.service";
import { createSuccessResponse } from "../../lib/utils/api";
import { handleApiError } from "../../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    const auth = await requireAuth(event);

    // Get Clerk user details
    const clerkUser = await getClerkUser(event, auth.userId);

    // Build name from Clerk user data
    const firstName = clerkUser.firstName || "";
    const lastName = clerkUser.lastName || "";
    const name = `${firstName} ${lastName}`.trim() || "User";

    // Get primary email
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";

    // Upsert account in database
    const account = await AccountService.upsert({
      userId: auth.userId,
      name,
      email,
      image: clerkUser.imageUrl,
    });

    return createSuccessResponse(account, "User synced successfully");
  } catch (error) {
    throw handleApiError(error, "syncUser");
  }
});
