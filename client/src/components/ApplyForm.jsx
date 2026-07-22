// client/src/components/ApplyForm.jsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import FileUploader from './FileUploader';

// Zod schema matching backend validation (required agreements & optional fields)
const schema = z.object({
  programId: z.string().min(1, 'Program ID is required'),
  answers: z.record(z.any()).optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  medicalConditions: z.string().optional(),
  backgroundCheckConsent: z.boolean().optional(),
  codeOfConductAgreement: z.literal(true, { errorMap: () => ({ message: 'Code of Conduct must be accepted' }) }),
  mediaConsent: z.boolean().optional(),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: 'Terms must be accepted' }) }),
  privacyAccepted: z.literal(true, { errorMap: () => ({ message: 'Privacy policy must be accepted' }) }),
});

const ApplyForm = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { answers: {} },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      // Append primitive fields (excluding files)
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'documents' && typeof value !== 'object') {
          formData.append(key, value);
        }
      });
      // Append uploaded files
      if (data.documents && data.documents.length) {
        data.documents.forEach((file) => {
          formData.append('documents', file);
        });
      }
      await api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      reset();
      alert('Application submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit application');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="apply-form" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Apply to Program</h2>

      <div className="form-group">
        <label htmlFor="programId">Program ID</label>
        <Controller
          name="programId"
          control={control}
          render={({ field }) => <input id="programId" {...field} className="input" />}
        />
        {errors.programId && <p className="error">{errors.programId.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="answers">Answers (JSON)</label>
        <Controller
          name="answers"
          control={control}
          render={({ field }) => (
            <textarea id="answers" rows={4} {...field} className="textarea" placeholder='{"question1":"answer"}' />
          )}
        />
        {errors.answers && <p className="error">{errors.answers.message}</p>}
      </div>

      {/* Custom fields */}
      <div className="form-group">
        <label htmlFor="emergencyContactName">Emergency Contact Name</label>
        <Controller name="emergencyContactName" control={control} render={({ field }) => <input id="emergencyContactName" {...field} className="input" />} />
      </div>
      <div className="form-group">
        <label htmlFor="emergencyContactPhone">Emergency Contact Phone</label>
        <Controller name="emergencyContactPhone" control={control} render={({ field }) => <input id="emergencyContactPhone" {...field} className="input" />} />
      </div>
      <div className="form-group">
        <label htmlFor="medicalConditions">Medical Conditions</label>
        <Controller name="medicalConditions" control={control} render={({ field }) => <input id="medicalConditions" {...field} className="input" />} />
      </div>
      <div className="form-group">
        <label>
          <Controller name="backgroundCheckConsent" control={control} render={({ field }) => <input type="checkbox" {...field} checked={field.value || false} />} />
          Background Check Consent
        </label>
      </div>
      <div className="form-group">
        <label>
          <Controller name="codeOfConductAgreement" control={control} render={({ field }) => <input type="checkbox" {...field} checked={field.value || false} />} />
          I agree to the Code of Conduct *
        </label>
        {errors.codeOfConductAgreement && <p className="error">{errors.codeOfConductAgreement.message}</p>}
      </div>
      <div className="form-group">
        <label>
          <Controller name="mediaConsent" control={control} render={({ field }) => <input type="checkbox" {...field} checked={field.value || false} />} />
          Media Consent
        </label>
      </div>
      <div className="form-group">
        <label>
          <Controller name="termsAccepted" control={control} render={({ field }) => <input type="checkbox" {...field} checked={field.value || false} />} />
          I accept the Terms of Service *
        </label>
        {errors.termsAccepted && <p className="error">{errors.termsAccepted.message}</p>}
      </div>
      <div className="form-group">
        <label>
          <Controller name="privacyAccepted" control={control} render={({ field }) => <input type="checkbox" {...field} checked={field.value || false} />} />
          I accept the Privacy Policy *
        </label>
        {errors.privacyAccepted && <p className="error">{errors.privacyAccepted.message}</p>}
      </div>

      {/* File uploader */}
      <div className="form-group">
        <label>Upload Documents (max 5, 5 MB each)</label>
        <Controller
          name="documents"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <FileUploader files={field.value} setFiles={(files) => field.onChange(files)} />
          )}
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="submit-btn">
        {isSubmitting ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  );
};

export default ApplyForm;
