import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 1, label: 'Contribution Info', description: 'Title, description, category' },
  { id: 2, label: 'Files & Links', description: 'Upload files and add links' },
  { id: 3, label: 'Review & Submit', description: 'Review and submit' },
];

const WizardStepper = ({ currentStep, completedSteps }) => {
  return (
    <div style={{ width: '100%', marginBottom: '2rem' }} role="navigation" aria-label="Contribution wizard steps">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '24px',
            left: '10%',
            right: '10%',
            height: 2,
            background: 'var(--color-border)',
            zIndex: 0 }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '24px',
            left: '10%',
            height: 2,
            background: 'var(--color-primary)',
            zIndex: 0,
            width: `${((currentStep - 1) / (steps.length - 1)) * 80}%`,
            transition: 'width 0.4s ease' }}
        />

        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'relative',
                zIndex: 1,
                flex: 1 }}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isCurrent ? 'var(--color-primary)' : isCompleted ? 'var(--color-secondary)' : 'white',
                  border: `2px solid ${isCurrent ? 'var(--color-primary)' : isCompleted ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                  color: isCurrent || isCompleted ? 'white' : 'var(--color-body)',
                  transition: 'all 0.3s ease',
                  boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none' }}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <span >{step.id}</span>
                )}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    color: isCurrent ? 'var(--color-primary)' : 'var(--color-heading)',
                    marginBottom: '0.15rem' }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    color: 'var(--color-body)',
                    maxWidth: '120px' }}
                >
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WizardStepper;
