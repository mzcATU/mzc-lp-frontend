"use client";

import * as React from "react";
import { Check, type LucideIcon } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
  orientation?: "horizontal" | "vertical";
  allowClickNavigation?: boolean;
}

function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
  orientation = "horizontal",
  allowClickNavigation = false,
}: StepperProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        isHorizontal ? "flex items-center" : "flex flex-col",
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isClickable = allowClickNavigation && index <= currentStep;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                "flex items-center gap-3",
                isHorizontal ? "flex-col" : "flex-row",
                isClickable && "cursor-pointer"
              )}
              onClick={() => isClickable && onStepClick?.(index)}
            >
              {/* Step indicator */}
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : isActive
                    ? "border-primary text-primary"
                    : "border-muted-foreground/25 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : Icon ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Step label */}
              <div
                className={cn(
                  isHorizontal ? "text-center" : "text-left"
                )}
              >
                <p
                  className={cn(
                    "text-sm font-medium",
                    isActive
                      ? "text-foreground"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  isHorizontal
                    ? "flex-1 h-[2px] mx-4"
                    : "w-[2px] h-8 ml-5 my-2",
                  isCompleted ? "bg-primary" : "bg-muted-foreground/25"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Stepper with content panels
interface StepperWithContentProps extends StepperProps {
  children: React.ReactNode;
}

function StepperWithContent({
  steps,
  currentStep,
  children,
  ...props
}: StepperWithContentProps) {
  const panels = React.Children.toArray(children);

  return (
    <div className="space-y-8">
      <Stepper steps={steps} currentStep={currentStep} {...props} />
      <div>{panels[currentStep]}</div>
    </div>
  );
}

// Stepper navigation buttons
interface StepperNavigationProps {
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

function StepperNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onComplete,
  isNextDisabled = false,
  previousLabel = "Previous",
  nextLabel = "Next",
  completeLabel = "Complete",
  className,
}: StepperNavigationProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className={cn("flex justify-between", className)}>
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirst}
      >
        {previousLabel}
      </Button>
      {isLast ? (
        <Button onClick={onComplete} disabled={isNextDisabled}>
          {completeLabel}
        </Button>
      ) : (
        <Button onClick={onNext} disabled={isNextDisabled}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
}

export { Stepper, StepperWithContent, StepperNavigation };
export type { Step, StepperProps, StepperWithContentProps, StepperNavigationProps };
