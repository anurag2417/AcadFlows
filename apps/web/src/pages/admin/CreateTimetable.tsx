import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { Card, CardTitle, Button, Input, Label, Select, Textarea } from '../../components/ui';
import { DashboardLayout, PageHeader } from '../../components/layout';

type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
type Entry = {
  _id?: string;
  dayOfWeek: Day;
  startTime: string;
  endTime: string;
  subjectId?: string;
  teacherId?: string;
  roomNumber?: string;
  isBreak: boolean;
  breakType?: 'short' | 'lunch' | 'recess';
};

const DAYS: { value: Day; label: string }[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
];

const emptyEntry = (day: Day): Entry => ({
  dayOfWeek: day,
  startTime: '08:00',
  endTime: '08:45',
  isBreak: false,
});

export default function CreateTimetablePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'regular',
    academicYearId: '',
    gradeId: '',
    sectionId: '',
    startDate: '',
    endDate: '',
  });
  const [entries, setEntries] = useState<Entry[]>([]);
  const [originalEntryIds, setOriginalEntryIds] = useState<string[]>([]);

  const classSubjects = useMemo(
    () => subjects.filter(subject => subject.gradeId === form.gradeId),
    [subjects, form.gradeId],
  );

  useEffect(() => {
    void loadOptions();
    if (id) void loadTimetable(id);
  }, [id]);

  async function loadOptions() {
    try {
      const [years, gradesResponse, subjectsResponse, teachersResponse] = await Promise.all([
        api.get('/academic/academic-years'),
        api.get('/academic/grades'),
        api.get('/academic/subjects'),
        api.get('/teachers?status=active&limit=200'),
      ]);
      const yearItems = years.data.data || [];
      setAcademicYears(yearItems);
      setGrades(gradesResponse.data.data || []);
      setSubjects(subjectsResponse.data.data || []);
      setTeachers(teachersResponse.data.data?.items || teachersResponse.data.data || []);
      const current = yearItems.find((year: any) => year.isCurrent && year.status === 'active')
        || yearItems.find((year: any) => year.status === 'active')
        || yearItems[0];
      if (current && !id) setForm(previous => ({ ...previous, academicYearId: current._id }));
    } catch {
      setError('Failed to load timetable options');
    }
  }

  async function loadTimetable(timetableId: string) {
    try {
      const response = await api.get(`/timetable/${timetableId}`);
      const data = response.data.data;
      const sectionResponse = await api.get(`/academic/sections?gradeId=${data.gradeId}`);
      setSections(sectionResponse.data.data || []);
      setForm({
        name: data.name,
        description: data.description || '',
        type: data.type,
        academicYearId: data.academicYearId,
        gradeId: data.gradeId,
        sectionId: data.sectionId,
        startDate: data.startDate.split('T')[0],
        endDate: data.endDate.split('T')[0],
      });
      const loadedEntries = (data.entries || []).map((entry: any) => ({
        _id: entry._id,
        dayOfWeek: entry.dayOfWeek,
        startTime: entry.startTime,
        endTime: entry.endTime,
        subjectId: entry.subjectId?._id || entry.subjectId,
        teacherId: entry.teacherId?._id || entry.teacherId,
        roomNumber: entry.roomNumber || '',
        isBreak: entry.isBreak,
        breakType: entry.breakType,
      }));
      setEntries(loadedEntries);
      setOriginalEntryIds(loadedEntries.map((entry: Entry) => entry._id).filter(Boolean) as string[]);
    } catch {
      setError('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  }

  async function handleGradeChange(gradeId: string) {
    setForm(previous => ({ ...previous, gradeId, sectionId: '' }));
    setEntries([]);
    if (!gradeId) {
      setSections([]);
      return;
    }
    try {
      const response = await api.get(`/academic/sections?gradeId=${gradeId}`);
      setSections(response.data.data || []);
    } catch {
      setError('Failed to load sections for the selected class');
    }
  }

  function updateEntry(index: number, patch: Partial<Entry>) {
    setEntries(previous => previous.map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, ...patch } : entry,
    ));
  }

  function addEntry(day: Day) {
    setEntries(previous => [...previous, emptyEntry(day)]);
  }

  function removeEntry(index: number) {
    setEntries(previous => previous.filter((_, entryIndex) => entryIndex !== index));
  }

  async function saveEntry(timetableId: string, entry: Entry) {
    const payload = {
      ...entry,
      gradeId: form.gradeId,
      sectionId: form.sectionId,
      subjectId: entry.isBreak ? undefined : entry.subjectId,
      teacherId: entry.isBreak ? undefined : entry.teacherId,
    };
    if (entry._id) {
      await api.put(`/timetable/entries/${entry._id}`, payload);
    } else {
      await api.post(`/timetable/${timetableId}/entries`, payload);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (!form.name || !form.academicYearId || !form.gradeId || !form.sectionId || !form.startDate || !form.endDate) {
        throw new Error('Complete the timetable details before saving');
      }
      const payload = {
        ...form,
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
      };
      const response = isEditMode
        ? await api.put(`/timetable/${id}`, payload)
        : await api.post('/timetable', payload);
      const timetableId = id || response.data.data._id;
      const keptEntryIds = new Set(entries.map(entry => entry._id).filter(Boolean));
      for (const entryId of originalEntryIds) {
        if (!keptEntryIds.has(entryId)) {
          await api.delete(`/timetable/entries/${entryId}`);
        }
      }
      for (const entry of entries) await saveEntry(timetableId, entry);
      navigate(`/timetable/${timetableId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to save timetable');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-[60vh]">Loading timetable...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={isEditMode ? 'Edit Timetable' : 'Create Timetable'}
        description="Build the complete weekly timetable for one class-section"
        breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Timetables', path: '/timetable' }, { label: isEditMode ? 'Edit' : 'Create' }]}
        actions={<Button variant="outline" onClick={() => navigate('/timetable')}>Cancel</Button>}
      />
      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardTitle className="mb-4">1. Timetable details</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label required>Name</Label><Input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Class 5 A Weekly Timetable" required /></div>
            <div><Label required>Type</Label><Select value={form.type} onChange={event => setForm({ ...form, type: event.target.value })}><option value="regular">Regular</option><option value="exam">Exam</option><option value="special">Special</option></Select></div>
            <div><Label required>Academic Year</Label><Select value={form.academicYearId} onChange={event => setForm({ ...form, academicYearId: event.target.value })} required><option value="">Select Academic Year</option>{academicYears.map(year => <option key={year._id} value={year._id}>{year.name}</option>)}</Select></div>
            <div><Label required>Class</Label><Select value={form.gradeId} onChange={event => void handleGradeChange(event.target.value)} required><option value="">Select Class</option>{grades.map(grade => <option key={grade._id} value={grade._id}>{grade.name}</option>)}</Select></div>
            <div><Label required>Section</Label><Select value={form.sectionId} onChange={event => setForm({ ...form, sectionId: event.target.value })} disabled={!form.gradeId} required><option value="">Select Section</option>{sections.map(section => <option key={section._id} value={section._id}>{section.name}</option>)}</Select></div>
            <div className="md:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} rows={2} placeholder="Optional notes" /></div>
            <div><Label required>Start Date</Label><Input type="date" value={form.startDate} onChange={event => setForm({ ...form, startDate: event.target.value })} required /></div>
            <div><Label required>End Date</Label><Input type="date" value={form.endDate} onChange={event => setForm({ ...form, endDate: event.target.value })} required /></div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><CardTitle>2. Weekly periods</CardTitle><p className="text-sm text-muted mt-1">Add every period and break for this class-section.</p></div>
            <span className="text-sm text-muted">{entries.length} period{entries.length === 1 ? '' : 's'}</span>
          </div>
          {!form.gradeId || !form.sectionId ? (
            <p className="mt-6 rounded-lg bg-elevated p-4 text-sm text-muted">Select a class and section first to start building the timetable.</p>
          ) : (
            <div className="mt-6 space-y-6">
              {DAYS.map(day => {
                const dayEntries = entries.map((entry, index) => ({ entry, index })).filter(item => item.entry.dayOfWeek === day.value);
                return <section key={day.value} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between"><h3 className="font-semibold">{day.label}</h3><Button type="button" size="sm" variant="outline" onClick={() => addEntry(day.value)}>Add period</Button></div>
                  {dayEntries.length === 0 && <p className="mt-3 text-sm text-muted">No periods added.</p>}
                  <div className="mt-3 space-y-3">
                    {dayEntries.map(({ entry, index }) => <div key={entry._id || index} className="grid grid-cols-1 gap-3 rounded-lg bg-elevated p-3 md:grid-cols-[110px_110px_130px_1fr_1fr_130px_auto] md:items-end">
                      <div><Label required>Start</Label><Input type="time" value={entry.startTime} onChange={event => updateEntry(index, { startTime: event.target.value })} required /></div>
                      <div><Label required>End</Label><Input type="time" value={entry.endTime} onChange={event => updateEntry(index, { endTime: event.target.value })} required /></div>
                      <div><Label>Period type</Label><Select value={entry.isBreak ? 'break' : 'class'} onChange={event => updateEntry(index, { isBreak: event.target.value === 'break', subjectId: undefined, teacherId: undefined })}><option value="class">Class</option><option value="break">Break</option></Select></div>
                      {entry.isBreak ? <div><Label>Break</Label><Select value={entry.breakType || 'short'} onChange={event => updateEntry(index, { breakType: event.target.value as Entry['breakType'] })}><option value="short">Short break</option><option value="lunch">Lunch</option><option value="recess">Recess</option></Select></div> : <><div><Label required>Subject</Label><Select value={entry.subjectId || ''} onChange={event => updateEntry(index, { subjectId: event.target.value })} required><option value="">Select subject</option>{classSubjects.map(subject => <option key={subject._id} value={subject._id}>{subject.name}</option>)}</Select></div><div><Label required>Teacher</Label><Select value={entry.teacherId || ''} onChange={event => updateEntry(index, { teacherId: event.target.value })} required><option value="">Select teacher</option>{teachers.map(teacher => <option key={teacher._id} value={teacher._id}>{teacher.firstName} {teacher.lastName}</option>)}</Select></div></>}
                      <div><Label>Room</Label><Input value={entry.roomNumber || ''} onChange={event => updateEntry(index, { roomNumber: event.target.value })} placeholder="Optional" /></div>
                      <Button type="button" variant="ghost" className="text-danger" onClick={() => removeEntry(index)}>Remove</Button>
                    </div>)}
                  </div>
                </section>;
              })}
            </div>
          )}
        </Card>
        <div className="flex justify-end gap-3 border-t border-border pt-4"><Button type="button" variant="outline" onClick={() => navigate('/timetable')}>Cancel</Button><Button type="submit" variant="primary" loading={saving}>{saving ? 'Saving periods...' : isEditMode ? 'Save timetable' : 'Create timetable'}</Button></div>
      </form>
    </DashboardLayout>
  );
}
