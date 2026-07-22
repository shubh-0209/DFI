import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import WizardStepper from './WizardStepper';
import ContributionInfoStep from './ContributionInfoStep';
import ContributionFilesStep from './ContributionFilesStep';
import ContributionReviewStep from './ContributionReviewStep';
import DraftSaveButton from './DraftSaveButton';
import SubmitButton from './SubmitButton';
import { createDraft, saveDraft, uploadFiles, submitContribution, getDraft } from '../../services/contributionWizardService';
import { contributionInfoSchema, contributionFilesSchema, fullContributionSchema } from '../../utils/contributionValidation';


const STORAGE_KEY = 'contribution_wizard_draft';

const defaultFormData = {
  title: '',
  description: '',
  category: '',
  contributionType: 'other',
  skillsUsed: [],
  hoursWorked: 0,
  tags: [],
  files: [],
  githubUrl: '',
  figmaUrl: '',
  canvaUrl: '',
  googleDriveUrl: '',
  notes: '',
};

const ContributionWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultFormData;
    } catch {
      return defaultFormData;
    }
  });
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contributionId, setContributionId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.contributionId || null;
      }
    } catch {}
    return null;
  });
  const [stepErrors, setStepErrors] = useState({});

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchDraft = async () => {
        try {
          const res = await getDraft(id);
          if (res?.success && res?.data?.contribution) {
            const contrib = res.data.contribution;
            const formattedFiles = (contrib.currentVersion?.files || []).map((f) => ({
              name: f.originalName || f.name,
              size: f.size,
              type: f.mimeType || f.type,
              publicUrl: f.publicUrl,
              isPrimary: f.isPrimary,
              status: 'completed',
              progress: 100,
            }));

            const draftData = {
              title: contrib.title || '',
              description: contrib.description || '',
              category: contrib.category || '',
              contributionType: contrib.contributionType || 'other',
              skillsUsed: contrib.skillsUsed || [],
              hoursWorked: contrib.hoursWorked || 0,
              tags: contrib.tags || [],
              files: formattedFiles,
              githubUrl: contrib.currentVersion?.githubUrl || '',
              figmaUrl: contrib.currentVersion?.figmaUrl || '',
              canvaUrl: contrib.currentVersion?.canvaUrl || '',
              googleDriveUrl: contrib.currentVersion?.googleDriveUrl || '',
              notes: contrib.currentVersion?.notes || '',
            };

            setFormData(draftData);
            setContributionId(contrib._id);
          }
        } catch {
          toast.error('Failed to load draft details');
        }
      };
      fetchDraft();
    }
  }, [id]);

  useForm({
    resolver: zodResolver(fullContributionSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...formData, contributionId }));
    } catch {}
  }, [formData, contributionId]);

  const updateFormData = useCallback((updates) => {
    setFormData((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...next, contributionId }));
      } catch {}
      return next;
    });
  }, [contributionId]);

  const validateStep = async (step) => {
    let isValid = false;
    let errors = {};

    if (step === 1) {
      const result = await contributionInfoSchema.safeParseAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        contributionType: formData.contributionType,
        skillsUsed: formData.skillsUsed,
        hoursWorked: formData.hoursWorked,
        tags: formData.tags,
      });
      if (!result.success) {
        errors = result.error.flatten().fieldErrors;
      }
      isValid = result.success;
    } else if (step === 2) {
      const result = await contributionFilesSchema.safeParseAsync({
        files: formData.files || [],
        githubUrl: formData.githubUrl || '',
        figmaUrl: formData.figmaUrl || '',
        canvaUrl: formData.canvaUrl || '',
        googleDriveUrl: formData.googleDriveUrl || '',
        notes: formData.notes || '',
      });
      if (!result.success) {
        errors = result.error.flatten().fieldErrors;
      }
      isValid = result.success;
    }

    setStepErrors(errors);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) {
      toast.error('Please fix the errors before proceeding');
      return;
    }

    setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
    setCurrentStep((prev) => Math.min(prev + 1, 3));
    setStepErrors({});
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setStepErrors({});
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      let draftId = contributionId;
      if (!draftId) {
        const res = await createDraft(formData);
        if (res?.success && res?.data?.contribution?._id) {
          draftId = res.data.contribution._id;
          setContributionId(draftId);
        } else {
          throw new Error(res?.message || 'Failed to create draft');
        }
      } else {
        const res = await saveDraft(draftId, formData);
        if (!res?.success) {
          throw new Error(res?.message || 'Failed to save draft');
        }
      }
      toast.success('Draft saved successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitContribution = async () => {
    const isValid = await validateStep(2);
    if (!isValid) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setSubmitting(true);
    try {
      let draftId = contributionId;

      // Step 1: Create draft if not yet saved
      if (!draftId) {
        const res = await createDraft(formData);
        if (res?.success && res?.data?.contribution?._id) {
          draftId = res.data.contribution._id;
          setContributionId(draftId);
        } else {
          throw new Error(res?.message || 'Failed to create draft');
        }
      }

      // Step 2: Upload any local File objects to Cloudinary
      const localFiles = (formData.files || []).filter((f) => f.file instanceof File);
      if (localFiles.length > 0) {
        const uploadRes = await uploadFiles(draftId, localFiles);
        if (!uploadRes?.success) {
          throw new Error(uploadRes?.message || 'File upload failed');
        }
      }

      // Step 3: Save links/notes as a draft version (if any external links or notes)
      const hasLinks = !!(formData.githubUrl || formData.figmaUrl || formData.canvaUrl || formData.googleDriveUrl || formData.notes);
      if (hasLinks || localFiles.length === 0) {
        // Always save metadata (links, title updates, etc.) before submit
        await saveDraft(draftId, formData);
      }

      // Step 4: Submit for review
      const res = await submitContribution(draftId);
      if (res?.success) {
        toast.success('Contribution submitted successfully!');
        localStorage.removeItem(STORAGE_KEY);
        navigate('/contributions', { state: { successMessage: 'Your contribution has been submitted for review.' } });
      } else {
        throw new Error(res?.message || 'Failed to submit contribution');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit contribution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  const handleStartOver = () => {
    setFormData(defaultFormData);
    setCurrentStep(1);
    setCompletedSteps([]);
    setContributionId(null);
    setStepErrors({});
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formData.title || formData.description || (formData.files && formData.files.length > 0)) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(1rem, 3vw, 2rem) clamp(1rem, 3vw, 1.5rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(1rem, 3vw, 2rem)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)' }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>
              New Contribution
            </h1>
            <p style={{ color: 'var(--color-body)' }}>
              Share your work with the community and earn recognition.
            </p>
          </div>

          <WizardStepper currentStep={currentStep} completedSteps={completedSteps} />

          <form onSubmit={(e) => e.preventDefault()} aria-live="polite">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <ContributionInfoStep
                  key="step1"
                  data={formData}
                  onChange={updateFormData}
                  errors={stepErrors}
                />
              )}
              {currentStep === 2 && (
                <ContributionFilesStep
                  key="step2"
                  data={formData}
                  onChange={updateFormData}
                  errors={stepErrors}
                />
              )}
              {currentStep === 3 && (
                <ContributionReviewStep
                  key="step3"
                  data={formData}
                  onBack={handleBack}
                  onSubmit={handleSubmitContribution}
                  loading={submitting}
                />
              )}
            </AnimatePresence>
          </form>

          {currentStep < 3 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
              <div>
                {currentStep > 1 && (
                  <button type="button" onClick={handleBack} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ChevronLeft size={18} /> Back
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <DraftSaveButton onClick={handleSaveDraft} loading={saving} />
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
              <DraftSaveButton onClick={handleSaveDraft} loading={saving} />
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button type="button" onClick={handleBack} className="btn btn-secondary">
                  Back
                </button>
                <SubmitButton onClick={handleSubmitContribution} loading={submitting} />
              </div>
            </div>
          )}
        </motion.div>

        {contributionId && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={handleStartOver}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-body)',
                cursor: 'pointer',
                textDecoration: 'underline' }}
            >
              Start a new contribution
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionWizard;
