import * as React from "react";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

export type ChartContextProps = {
  config: ChartConfig;
};

export interface ChartContainerProps extends React.ComponentProps<"div"> {
  config: ChartConfig;
  children: React.ReactNode;
}

export interface ChartStyleProps {
  id: string;
  config: ChartConfig;
}

export interface PayloadItem {
  value?: number | string;
  name?: string;
  dataKey?: string | number;
  color?: string;
  payload?: Record<string, unknown>;
}

export interface ChartTooltipContentProps extends React.ComponentProps<"div"> {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string;
  labelFormatter?: (label: string, payload: PayloadItem[]) => React.ReactNode;
  formatter?: (
    value: number,
    name: string,
    item: PayloadItem,
    index: number,
    payload: Record<string, unknown>
  ) => React.ReactNode;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
  labelKey?: string;
  labelClassName?: string;
  color?: string;
}

export interface LegendPayloadItem {
  value?: string;
  dataKey?: string;
  color?: string;
}

export interface ChartLegendContentProps extends React.ComponentProps<"div"> {
  payload?: LegendPayloadItem[];
  verticalAlign?: "top" | "bottom";
  hideIcon?: boolean;
  nameKey?: string;
}
