import { Router } from 'express';
import { FeeController } from './controller';
import { FeeReportsController } from './reports.controller';
import { FeeExportController } from './export.controller';
import { FeeBulkController } from './bulk.controller';
import { authenticate, requireRole, ensureTenantMatch } from '../../middleware/auth';

const router: Router = Router();

router.use(authenticate);
router.use(ensureTenantMatch);

// ── Bulk operations (must come before /invoices/:id) ──
router.post(
  '/invoices/bulk-generate',
  requireRole('admin'),
  FeeBulkController.bulkGenerateInvoices,
);
router.post(
  '/reminders/bulk-send',
  requireRole('admin'),
  FeeBulkController.bulkSendReminders,
);

// ── Reports ──
router.get(
  '/reports/collection',
  requireRole('admin'),
  FeeReportsController.getCollection,
);
router.get(
  '/reports/defaulters',
  requireRole('admin'),
  FeeReportsController.getDefaulters,
);
router.get(
  '/reports/daybook',
  requireRole('admin'),
  FeeReportsController.getDaybook,
);
router.get(
  '/reports/students/:studentId/fees',
  requireRole('admin', 'teacher'),
  FeeReportsController.getStudentFeeHistory,
);

// ── Exports ──
router.get(
  '/invoices/export',
  requireRole('admin'),
  FeeExportController.exportInvoices,
);
router.get(
  '/payments/export',
  requireRole('admin'),
  FeeExportController.exportPayments,
);

// ── Fee Structures ──
router.get('/structures', requireRole('admin'), FeeController.getFeeStructures);
router.post('/structures', requireRole('admin'), FeeController.createFeeStructure);
router.get('/structures/:id', requireRole('admin'), FeeController.getFeeStructureById);
router.put('/structures/:id', requireRole('admin'), FeeController.updateFeeStructure);
router.delete('/structures/:id', requireRole('admin'), FeeController.deleteFeeStructure);

// ── Invoices ──
router.get('/invoices', requireRole('admin', 'teacher'), FeeController.getInvoices);
router.post('/invoices', requireRole('admin'), FeeController.generateInvoice);
router.get('/invoices/:id', requireRole('admin', 'teacher'), FeeController.getInvoiceById);
router.put('/invoices/:id/status', requireRole('admin'), FeeController.updateInvoiceStatus);

// ── Payments ──
router.get('/payments', requireRole('admin', 'teacher'), FeeController.getPayments);
router.post('/payments', requireRole('admin'), FeeController.recordPayment);
router.get('/payments/:id', requireRole('admin', 'teacher'), FeeController.getPaymentById);

// ── Discounts ──
router.get('/discounts', requireRole('admin'), FeeController.getDiscounts);
router.post('/discounts', requireRole('admin'), FeeController.createDiscount);
router.get('/discounts/validate/:code', requireRole('admin'), FeeController.validateDiscount);
router.put('/discounts/:id', requireRole('admin'), FeeController.updateDiscount);
router.delete('/discounts/:id', requireRole('admin'), FeeController.deleteDiscount);

// ── Legacy + Reports ──
router.get('/reports', requireRole('admin'), FeeController.getFeeReport);
router.get('/students/:studentId/summary', requireRole('admin', 'teacher'), FeeController.getStudentFeeSummary);
router.post('/reminders', requireRole('admin'), FeeController.sendReminders);

export default router;