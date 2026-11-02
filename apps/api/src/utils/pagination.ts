import { AppError } from '../middleware/error-handler';

export function parsePagination(
  page: unknown,
  limit: unknown,
  defaultLimit = 20,
  maxLimit = 100,
) {
  const parsedPage = page === undefined ? 1 : Number(page);
  const parsedLimit = limit === undefined ? defaultLimit : Number(limit);

  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1 ||
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1 ||
    parsedLimit > maxLimit
  ) {
    throw new AppError(`page must be >= 1 and limit must be between 1 and ${maxLimit}`, 400);
  }

  return { page: parsedPage, limit: parsedLimit };
}
