import type { ComponentPropsWithoutRef, ElementType } from "react";

type AsChildProps = {
  asChild?: boolean;
};

type PropsToOmit<P> = keyof (AsChildProps & P);

export type PolymorphicComponentProps<
  T extends ElementType,
  P = Record<string, never>,
> = P & AsChildProps & Omit<ComponentPropsWithoutRef<T>, PropsToOmit<P>>;
