import type { LucideIcon } from 'lucide-react';

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  allowClickNavigation?: boolean;
}

export interface StepperWithContentProps extends StepperProps {
  children: React.ReactNode;
}

export interface StepperNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete?: () => void;
  isNextDisabled?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  completeLabel?: string;
  className?: string;
}
