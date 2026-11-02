import { Router } from 'express';
import { TimetableController } from './controller';
import { requireRole } from '../../middleware/auth';

const router: Router = Router();

// Auth + tenant match are applied in app.ts.

router.get('/', TimetableController.getTimetables);
router.post('/', requireRole('admin'), TimetableController.createTimetable);
router.get('/stats', TimetableController.getStats);

router.get('/rooms', TimetableController.getRooms);
router.post('/rooms', requireRole('admin'), TimetableController.createRoom);
router.get('/rooms/:id', TimetableController.getRoomById);
router.put('/rooms/:id', requireRole('admin'), TimetableController.updateRoom);
router.delete('/rooms/:id', requireRole('admin'), TimetableController.deleteRoom);

router.get('/time-slots', TimetableController.getTimeSlots);
router.post('/time-slots', requireRole('admin'), TimetableController.createTimeSlot);
router.put('/time-slots/:id', requireRole('admin'), TimetableController.updateTimeSlot);
router.delete('/time-slots/:id', requireRole('admin'), TimetableController.deleteTimeSlot);

router.get('/sections/:sectionId', TimetableController.getSectionTimetable);
router.get('/teachers/:teacherId', TimetableController.getTeacherTimetable);

router.put('/entries/:entryId', requireRole('admin'), TimetableController.updateEntry);
router.delete('/entries/:entryId', requireRole('admin'), TimetableController.deleteEntry);

router.post('/:timetableId/entries', requireRole('admin'), TimetableController.addEntry);
router.get('/:id', TimetableController.getTimetableById);
router.put('/:id', requireRole('admin'), TimetableController.updateTimetable);
router.delete('/:id', requireRole('admin'), TimetableController.deleteTimetable);

export default router;