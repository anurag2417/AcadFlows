import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';
import { Card, CardTitle, CardDescription, Button, Input, Select, PhoneInput, Field } from '../../components/ui';
import { DashboardLayout, PageHeader } from '../../components/layout';
import { getErrorMessage } from '../../lib/errors';
import TempPasswordModal from '../../components/TempPasswordModal';

interface TeacherForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  joiningDate: string;
  subjects: string[];
  city: string;
  state: string;
  postalCode: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
}

const emptyForm: TeacherForm = {
  firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
  gender: 'other', joiningDate: new Date().toISOString().split('T')[0] || '',
  subjects: [], city: '', state: '', postalCode: '',
  emergencyName: '', emergencyPhone: '', emergencyRelationship: '',
};

export default function AddTeacherPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [form, setForm] = useState<TeacherForm>(emptyForm);
  const [subjects, setSubjects] = useState<{ _id: string; name: string; code: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tempPassword, setTempPassword] = useState<{ email: string; password: string; name: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const subjectsRes = await api.get('/academic/subjects');
        if (cancelled) return;
        setSubjects(subjectsRes.data.data || []);
        if (id) {
          const { data } = await api.get(`/teachers/${id}`);
          const teacher = data.data;
          setForm({
            firstName: teacher.firstName || '',
            lastName: teacher.lastName || '',
            email: teacher.email || '',
            phone: teacher.phone || '',
            dateOfBirth: teacher.dateOfBirth ? teacher.dateOfBirth.split('T')[0] : '',
            gender: teacher.gender || 'other',
            joiningDate: teacher.joiningDate ? teacher.joiningDate.split('T')[0] : emptyForm.joiningDate,
            subjects: teacher.subjects || [],
            city: teacher.address?.city || '',
            state: teacher.address?.state || '',
            postalCode: teacher.address?.postalCode || '',
            emergencyName: teacher.emergencyContact?.name || '',
            emergencyPhone: teacher.emergencyContact?.phone || '',
            emergencyRelationship: teacher.emergencyContact?.relationship || '',
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

  const update = (key: keyof TeacherForm, value: string) =>
    setForm(previous => ({ ...previous, [key]: value }));

  const toggleSubject = (subjectId: string) =>
    setForm(previous => ({ ...previous, subjects: previous.subjects.includes(subjectId) ? previous.subjects.filter(idValue => idValue !== subjectId) : [...previous.subjects, subjectId] }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    if (form.subjects.length === 0) {
      setError('Select at least one subject.');
      setSaving(false);
      return;
    }
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        dateOfBirth: new Date(form.dateOfBirth),
        gender: form.gender,
        joiningDate: new Date(form.joiningDate),
        subjects: form.subjects,
        address: { street: '', city: form.city.trim(), state: form.state.trim(), country: 'India', postalCode: form.postalCode.trim() },
        emergencyContact: { name: form.emergencyName.trim(), phone: form.emergencyPhone.trim(), relationship: form.emergencyRelationship.trim() },
      };
      if (isEditMode) {
        await api.put(`/teachers/${id}`, payload);
        navigate('/teachers');
        return;
      }
      const response = await api.post('/teachers', payload);
      const generated = response.data?.meta?.tempPassword;
      if (generated) {
        setTempPassword({ email: form.email.trim(), password: generated, name: `${form.firstName} ${form.lastName}`.trim() });
        setSaving(false);
      } else {
        navigate('/teachers');
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  if (loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-[3px] border-border border-t-primary-500" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={isEditMode ? 'Edit Teacher' : 'Add Teacher'}
        description="Enter only the information needed to create the teacher account."
        breadcrumb={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Teachers', path: '/teachers' }, { label: isEditMode ? 'Edit' : 'Add' }]}
        actions={<Button variant="outline" onClick={() => navigate('/teachers')} leftIcon="←">Back to Teachers</Button>}
      />
      {error && <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-sm">{error}</div>}
      <form onSubmit={submit} className="space-y-6 max-w-4xl">
        <Card>
          <CardTitle>Teacher details</CardTitle>
          <CardDescription>Name, login, and contact information</CardDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <Field label="First name" required><Input value={form.firstName} onChange={event => update('firstName', event.target.value)} required /></Field>
            <Field label="Last name" required><Input value={form.lastName} onChange={event => update('lastName', event.target.value)} required /></Field>
            <Field label="Login email" required><Input type="email" value={form.email} onChange={event => update('email', event.target.value)} required /></Field>
            <Field label="Phone" required><PhoneInput value={form.phone} onChange={value => update('phone', value)} required /></Field>
            <Field label="Date of birth" required><Input type="date" value={form.dateOfBirth} onChange={event => update('dateOfBirth', event.target.value)} required /></Field>
            <Field label="Gender" required><Select value={form.gender} onChange={event => update('gender', event.target.value)}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></Select></Field>
            <Field label="Joining date" required><Input type="date" value={form.joiningDate} onChange={event => update('joiningDate', event.target.value)} required /></Field>
          </div>
        </Card>
        <Card>
          <CardTitle>Subjects</CardTitle>
          <CardDescription>Select the subjects this teacher can teach.</CardDescription>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-5">
            {subjects.map(subject => <button key={subject._id} type="button" onClick={() => toggleSubject(subject._id)} className={`px-3 py-2.5 rounded-lg border text-left text-sm ${form.subjects.includes(subject._id) ? 'border-primary-500 bg-primary-500/10 text-primary-700' : 'border-border bg-surface hover:border-primary-300'}`}><span className="font-medium">{subject.name}</span><span className="block text-xs text-muted">{subject.code}</span></button>)}
          </div>
          {subjects.length === 0 && <p className="text-sm text-muted mt-5">Create subjects in Academics before adding teachers.</p>}
        </Card>
        <Card>
          <CardTitle>Address</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <Field label="City" required><Input value={form.city} onChange={event => update('city', event.target.value)} required /></Field>
            <Field label="State" required><Input value={form.state} onChange={event => update('state', event.target.value)} required /></Field>
            <Field label="Postal code" required><Input value={form.postalCode} onChange={event => update('postalCode', event.target.value)} required /></Field>
          </div>
        </Card>
        <Card>
          <CardTitle>Emergency contact</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <Field label="Name" required><Input value={form.emergencyName} onChange={event => update('emergencyName', event.target.value)} required /></Field>
            <Field label="Phone" required><PhoneInput value={form.emergencyPhone} onChange={value => update('emergencyPhone', value)} required /></Field>
            <Field label="Relationship" required><Input value={form.emergencyRelationship} onChange={event => update('emergencyRelationship', event.target.value)} required placeholder="e.g. Spouse" /></Field>
          </div>
        </Card>
        <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => navigate('/teachers')}>Cancel</Button><Button type="submit" variant="primary" loading={saving}>{isEditMode ? 'Save changes' : 'Add teacher'}</Button></div>
      </form>
      {tempPassword && <TempPasswordModal userName={tempPassword.name} email={tempPassword.email} password={tempPassword.password} role="teacher" onClose={() => { setTempPassword(null); navigate('/teachers'); }} />}
    </DashboardLayout>
  );
}
