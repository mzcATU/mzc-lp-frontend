import type { ComponentProps } from 'react';

export type AlertVariant = 'default' | 'destructive' | 'info';

export interface AlertProps extends ComponentProps<'div'> {
  variant?: AlertVariant;
}

export type AlertTitleProps = ComponentProps<'div'>;

export type AlertDescriptionProps = ComponentProps<'div'>;
