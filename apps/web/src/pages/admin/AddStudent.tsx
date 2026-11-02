import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { Card, CardTitle, CardDescription, Button, Input, Select, PhoneInput, Field } from '../../components/ui';
import { DashboardLayout, PageHeader } from '../../components/layout';
import { getErrorMessage } from '../../lib/errors';
import TempPasswordModal from '../../components/TempPasswordModal';

interface StudentForm {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  grade: string;
  gradeId: string;
  section: string;
  sectionId: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianRelationship: string;
  city: string;
  state: string;
  postalCode: string;
}

const emptyForm: StudentForm = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  gender: 'other',
  grade: '',
  gradeId: '',
  section: '',
  sectionId: '',
  guardianName: '',
  guardianPhone: '',
  guardianEmail: '',
  guardianRelationship: 'guardian',
  city: '',
  state: '',
  postalCode: '',
};

export default function AddStudentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const [grades, setGrades] = useState<{ _id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ _id: string; name: string; gradeId: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tempPassword, setTempPassword] = useState<{ email: string; password: string; name: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [gradesRes, sectionsRes] = await Promise.all([
          api.get('/academic/grades'),
          api.get('/academic/sections'),
        ]);
        if (cancelled) return;
        const nextGrades = gradesRes.data.data || [];
        setGrades(nextGrades);
        setSections(sectionsRes.data.data || []);
        if (id) {
          const { data } = await api.get(`/students/${id}`);
          const student = data.data;
          const grade = nextGrades.find((item: { name: string }) => item.name === student.grade);
          const guardian = student.guardians?.[0] || {};
          setForm({
            firstName: student.firstName || '',
            lastName: student.lastName || '',
            email: student.userId?.email || '',
            dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
            gender: student.gender || 'other',
            grade: student.grade || '',
            gradeId: grade?._id || '',
            section: student.section || '',
            sectionId: student.sectionId || '',
            guardianName: guardian.name || student.emergencyContact?.name || '',
            guardianPhone: guardian.phone || student.emergencyContact?.phone || '',
            guardianEmail: guardian.email || '',
            guardianRelationship: guardian.relationship || student.emergencyContact?.relationship || 'guardian',
            city: student.address?.city || '',
            state: student.address?.state || '',
            postalCode: student.address?.postalCode || '',
          });
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const update = (key: keyof StudentForm, value: string) =>
    setForm(previous => ({ ...previous, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    if (!form.sectionId && !isEditMode) {
      setError('Select a section so attendance can be tracked.');
      setSaving(false);
      return;
    }
    if (!form.guardianName.trim() || !form.guardianPhone.trim()) {
      setError('Guardian name and phone are required.');
      setSaving(false);
      return;
    }
    try {
      const guardian = {
        name: form.guardianName.trim(),
        phone: form.guardianPhone.trim(),
        email: form.guardianEmail.trim() || undefined,
        relationship: form.guardianRelationship,
      };
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        dateOfBirth: new Date(form.dateOfBirth),
        gender: form.gender,
        grade: form.grade,
        section: form.section || undefined,
        sectionId: form.sectionId || undefined,
        guardians: [guardian],
        emergencyContact: {
          name: guardian.name,
          phone: guardian.phone,
          relationship: guardian.relationship,
        },
        address: { street: '', city: form.city.trim(), state: form.state.trim(), country: 'India', postalCode: form.postalCode.trim() },
      };
      if (isEditMode) {
        await api.put(`/students/${id}`, payload);
        navigate('/students');
        return;
      }
      const response = await api.post('/students', payload);
      const generated = response.data?.meta?.tempPassword;
      if (generated) {
        setTempPassword({ email: form.email.trim(), password: generated, name: `${form.firstName} ${form.lastName}`.trim() });
        setSaving(false);
      } else {
        navigate('/students');
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  const availableSections = sections.filter(section => !form.gradeId || section.gradeId === form.gradeId);

  if (loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-[3px] border-border border-t-primary-500" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={isEditMode ? 'Edit Student' : 'Add Student'}
        description="Enter only the information needed to create the student account."
        breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Students', path: '/students' }, { label: isEditMode ? 'Edit' : 'Add' }]}
        actions={<Button variant="outline" onClick={() => navigate('/students')} leftIcon="←">Back to Students</Button>}
      />
      {error && <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-sm">{error}</div>}
      <form onSubmit={submit} className="space-y-6 max-w-4xl">
        <Card>
          <CardTitle>Student details</CardTitle>
          <CardDescription>Name, login, and date of birth</CardDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <Field label="First name" required><Input value={form.firstName} onChange={event => update('firstName', event.target.value)} required /></Field>
            <Field label="Last name" required><Input value={form.lastName} onChange={event => update('lastName', event.target.value)} required /></Field>
            <Field label="Login email" required><Input type="email" value={form.email} onChange={event => update('email', event.target.value)} required placeholder="student@school.com" /></Field>
            <Field label="Date of birth" required><Input type="date" value={form.dateOfBirth} onChange={event => update('dateOfBirth', event.target.value)} required /></Field>
            <Field label="Gender" required><Select value={form.gender} onChange={event => update('gender', event.target.value)}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></Select></Field>
          </div>
        </Card>
        <Card>
          <CardTitle>Class assignment</CardTitle>
          <CardDescription>Assign the student to the current grade and section.</CardDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <Field label="Grade" required><Select value={form.gradeId} required onChange={event => { const selected = grades.find(item => item._id === event.target.value); setForm(previous => ({ ...previous, gradeId: event.target.value, grade: selected?.name || '', sectionId: '', section: '' })); }}><option value="">Select grade</option>{grades.map(grade => <option key={grade._id} value={grade._id}>{grade.name}</option>)}</Select></Field>
            <Field label="Section" required={!isEditMode}><Select value={form.sectionId} disabled={!form.gradeId} onChange={event => { const selected = availableSections.find(item => item._id === event.target.value); setForm(previous => ({ ...previous, sectionId: event.target.value, section: selected?.name || '' })); }}><option value="">Select section</option>{availableSections.map(section => <option key={section._id} value={section._id}>{section.name}</option>)}</Select></Field>
          </div>
        </Card>
        <Card>
          <CardTitle>Guardian contact</CardTitle>
          <CardDescription>This contact is also used as the emergency contact.</CardDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <Field label="Name" required><Input value={form.guardianName} onChange={event => update('guardianName', event.target.value)} required /></Field>
            <Field label="Phone" required><PhoneInput value={form.guardianPhone} onChange={value => update('guardianPhone', value)} required /></Field>
            <Field label="Relationship" required><Select value={form.guardianRelationship} onChange={event => update('guardianRelationship', event.target.value)}><option value="father">Father</option><option value="mother">Mother</option><option value="guardian">Guardian</option><option value="other">Other</option></Select></Field>
            <Field label="Email"><Input type="email" value={form.guardianEmail} onChange={event => update('guardianEmail', event.target.value)} placeholder="Optional" /></Field>
          </div>
        </Card>
        <Card>
          <CardTitle>Address</CardTitle>
          <CardDescription>Used for school records.</CardDescription>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <Field label="City" required><Input value={form.city} onChange={event => update('city', event.target.value)} required /></Field>
            <Field label="State" required><Input value={form.state} onChange={event => update('state', event.target.value)} required /></Field>
            <Field label="Postal code" required><Input value={form.postalCode} onChange={event => update('postalCode', event.target.value)} required /></Field>
          </div>
        </Card>
        <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => navigate('/students')}>Cancel</Button><Button type="submit" variant="primary" loading={saving}>{isEditMode ? 'Save changes' : 'Add student'}</Button></div>
      </form>
      {tempPassword && <TempPasswordModal userName={tempPassword.name} email={tempPassword.email} password={tempPassword.password} role="student" onClose={() => { setTempPassword(null); navigate('/students'); }} />}
    </DashboardLayout>
  );
}
