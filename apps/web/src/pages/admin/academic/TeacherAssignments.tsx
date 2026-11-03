import React, { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { Card, Button, Label, Select, Badge } from '../../../components/ui';
import { DashboardLayout, PageHeader } from '../../../components/layout';
import { cn } from '../../../lib/cn';

interface Assignment {
  _id: string;
  teacherId: any;
  subjectId: any;
  sectionId?: any;
  gradeId?: any;
  academicYearId: string;
  status: string;
}

interface AssignmentGroup {
  key: string;
  teacher: any;
  grade: any;
  section: any;
  academicYearId: string;
  assignments: Assignment[];
}

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchAssignments(),
      fetchTeachers(),
      fetchSubjects(),
      fetchSections(),
      fetchGrades(),
      fetchYears(),
    ]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/academic/teacher-subjects');
      setAssignments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeachers = async () => {
    const res = await api.get('/teachers?limit=200');
    setTeachers(res.data.data.items || []);
  };

  const fetchSubjects = async () => {
    const res = await api.get('/academic/subjects');
    setSubjects(res.data.data);
  };

  const fetchSections = async () => {
    const res = await api.get('/academic/sections');
    setSections(res.data.data);
  };

  const fetchGrades = async () => {
    const res = await api.get('/academic/grades');
    setGrades(res.data.data);
  };

  const fetchYears = async () => {
    const res = await api.get('/academic/academic-years');
    setAcademicYears(res.data.data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this assignment?')) return;
    try {
      await api.delete(`/academic/teacher-subjects/${id}`);
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  const teacherName = (id: string) => {
    const teacher = teachers.find(item => item._id === id);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : id;
  };
  const subjectDetails = (id: string) => subjects.find(item => item._id === id);
  const sectionName = (id?: string) => {
    if (!id) return 'All Sections';
    return sections.find(item => item._id === id)?.name || id;
  };
  const groupedAssignments = assignments.reduce<AssignmentGroup[]>((groups, assignment) => {
    const teacherId = assignment.teacherId?._id || assignment.teacherId;
    const gradeId = assignment.gradeId?._id || assignment.gradeId || '';
    const sectionId = assignment.sectionId?._id || assignment.sectionId || '';
    const key = `${teacherId}-${gradeId}-${sectionId}-${assignment.academicYearId}`;
    const existing = groups.find(group => group.key === key);
    if (existing) {
      existing.assignments.push(assignment);
    } else {
      groups.push({
        key,
        teacher: assignment.teacherId,
        grade: assignment.gradeId,
        section: assignment.sectionId,
        academicYearId: assignment.academicYearId,
        assignments: [assignment],
      });
    }
    return groups;
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title="Teacher Assignments"
        description="Assign teachers to multiple subjects. Class teachers are assigned separately on the Classes & Sections page."
        breadcrumb={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Teacher Assignments' },
        ]}
        actions={
          <Button
            variant="primary"
            leftIcon="➕"
            onClick={() => setShowModal(true)}
          >
            New Assignment
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-border border-t-primary-500" />
        </div>
      ) : assignments.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-5xl mb-3">👥</p>
          <p className="text-sm text-muted">No assignments yet</p>
          <p className="text-xs text-muted mt-1">
            Assign teachers to subjects so they can create assignments and grade students
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {groupedAssignments.map(group => (
            <Card key={group.key}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-foreground">
                    {group.teacher?.firstName
                      ? `${group.teacher.firstName} ${group.teacher.lastName}`
                      : teacherName(group.teacher)}
                  </p>
                  <p className="text-sm text-muted">
                    {group.grade?.name || group.grade || 'Class'} · Section {group.section?.name || sectionName(group.section)}
                  </p>
                </div>
                <Badge variant="success" dot>Active</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.assignments.map(assignment => (
                  <span key={assignment._id} className="inline-flex items-center gap-2 rounded-full bg-elevated px-3 py-1.5 text-sm text-foreground">
                    {assignment.subjectId?.name || subjectDetails(assignment.subjectId)?.name || assignment.subjectId}
                    <button
                      type="button"
                      className="text-danger hover:text-red-700"
                      aria-label="Remove assignment"
                      onClick={() => handleDelete(assignment._id)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <AssignmentModal
          teachers={teachers}
          subjects={subjects}
          grades={grades}
          sections={sections}
          academicYears={academicYears}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchAssignments();
          }}
        />
      )}
    </DashboardLayout>
  );
}

function AssignmentModal({
  teachers,
  subjects,
  grades,
  sections,
  academicYears,
  onClose,
  onSuccess,
}: any) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    teacherId: '',
    subjectIds: [] as string[],
    gradeId: '',
    sectionId: '',
    academicYearId: '',
  });

  const classSubjects = subjects.filter((subject: any) => subject.gradeId === form.gradeId);
  const eligibleTeachers = teachers.filter((teacher: any) =>
    form.subjectIds.length > 0 &&
    form.subjectIds.every((subjectId: string) => teacher.subjects?.includes(subjectId)),
  );

  useEffect(() => {
    if (!form.academicYearId && academicYears.length > 0) {
      const currentYear = academicYears.find((year: any) => year.isCurrent) || academicYears[0];
      setForm(previous => ({ ...previous, academicYearId: currentYear._id }));
    }
  }, [academicYears, form.academicYearId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (form.subjectIds.length === 0) {
        setError('Select at least one subject');
        setSaving(false);
        return;
      }
      await Promise.all(
        form.subjectIds.map(subjectId =>
          api.post('/academic/teacher-subjects', {
            ...form,
            subjectId,
          }),
        ),
      );
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card padding="lg" className="max-w-md w-full animate-scale-in">
        <h3 className="text-xl font-bold text-foreground mb-5">
          Assign Teacher to Subject
        </h3>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label required>Academic year</Label>
            <Select
              value={form.academicYearId}
              onChange={e => setForm({ ...form, academicYearId: e.target.value })}
              required
            >
              <option value="">Select academic year</option>
              {academicYears.map((year: any) => (
                <option key={year._id} value={year._id}>
                  {year.name}{year.isCurrent ? ' (Current)' : ''}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label required>Class</Label>
            <Select
              value={form.gradeId}
              onChange={e => setForm({ ...form, gradeId: e.target.value, sectionId: '', subjectIds: [], teacherId: '' })}
              required
            >
              <option value="">Select Class</option>
              {grades.map((grade: any) => <option key={grade._id} value={grade._id}>{grade.name}</option>)}
            </Select>
          </div>
          <div>
            <Label>Section</Label>
            <Select
              value={form.sectionId}
              onChange={e => setForm({ ...form, sectionId: e.target.value })}
              disabled={!form.gradeId}
              required
            >
              <option value="">{form.gradeId ? 'Select Section' : 'Select class first'}</option>
              {sections.filter((section: any) => section.gradeId === form.gradeId).map((section: any) => (
                <option key={section._id} value={section._id}>{section.name}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label required>Subjects for this class</Label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {classSubjects.map((subject: any) => {
                const selected = form.subjectIds.includes(subject._id);
                return (
                  <button
                    key={subject._id}
                    type="button"
                    onClick={() =>
                      setForm(previous => ({
                        ...previous,
                        subjectIds: selected
                          ? previous.subjectIds.filter(id => id !== subject._id)
                          : [...previous.subjectIds, subject._id],
                          teacherId: '',
                        }))
                    }
                    className={cn(
                      'rounded-lg border px-3 py-2 text-left text-sm',
                      selected
                        ? 'border-primary-500 bg-primary-500/10 text-primary-700'
                        : 'border-border bg-surface hover:border-primary-300',
                    )}
                  >
                    {subject.name} ({subject.code})
                  </button>
                );
              })}
            </div>
            {form.gradeId && classSubjects.length === 0 && <p className="mt-2 text-xs text-muted">Create subjects for this class first.</p>}
          </div>
          <div>
            <Label required>Eligible teacher</Label>
            <Select
              value={form.teacherId}
              onChange={e => setForm({ ...form, teacherId: e.target.value })}
              required
              disabled={form.subjectIds.length === 0}
            >
              <option value="">{form.subjectIds.length ? 'Select Teacher' : 'Select subjects first'}</option>
              {eligibleTeachers.map((teacher: any) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.firstName} {teacher.lastName} ({teacher.employeeId})
                </option>
              ))}
            </Select>
            {form.subjectIds.length > 0 && eligibleTeachers.length === 0 && (
              <p className="mt-2 text-xs text-muted">No teacher is qualified for all selected subjects.</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Assign
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}