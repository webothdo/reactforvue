export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  const account = await getAccountByUserId(auth.userId);
  if (!account || account.role !== "admin") {
    throw createError({
      statusCode: 403,
      message: "Forbidden: Admin access required",
    });
  }
});
