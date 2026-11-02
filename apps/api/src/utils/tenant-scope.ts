import mongoose from 'mongoose';
import { AppError } from '../middleware/error-handler';

export function assertValidObjectId(id: string | undefined, label = 'ID'): string {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${label} format`, 400);
  }
  return id;
}

export function tenantDocFilter(id: string, tenantId: string, label = 'ID') {
  return { _id: assertValidObjectId(id, label), tenantId };
}

export async function findOneForTenant<T>(
  model: mongoose.Model<T>,
  id: string,
  tenantId: string,
  notFound = 'Record not found',
  label = 'ID',
) {
  const doc = await model.findOne(tenantDocFilter(id, tenantId, label));
  if (!doc) {
    throw new AppError(notFound, 404);
  }
  return doc;
}
