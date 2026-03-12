// Ported from AlignUI Badge v0.0.0 — adapted to local utilities

import * as React from "react";
import { tv, type VariantProps } from "@/utils/tv";
import { recursiveCloneChildren } from "@/utils/recursive-clone-children";

const BADGE_ROOT_NAME = "BadgeRoot";
const BADGE_ICON_NAME = "BadgeIcon";

export const badgeVariants = tv({
  slots: {
    root: "inline-flex items-center justify-center rounded-full leading-none transition duration-200 ease-out",
    icon: "shrink-0",
  },
  variants: {
    size: {
      small: {
        root: "h-4 gap-1.5 px-2 text-[10px] font-medium tracking-[0.06em] uppercase",
        icon: "-mx-1 size-3",
      },
      medium: {
        root: "h-5 gap-1.5 px-2 text-[11px] font-medium",
        icon: "-mx-1 size-4",
      },
    },
    variant: {
      filled: { root: "text-static-white" },
      light: {},
      stroke: { root: "ring-1 ring-inset ring-current" },
    },
    color: {
      gray: {},
      blue: {},
      orange: {},
      red: {},
      green: {},
      yellow: {},
      purple: {},
      sky: {},
      pink: {},
      teal: {},
    },
  },
  compoundVariants: [
    // filled
    { variant: "filled", color: "gray",   class: { root: "bg-faded-base" } },
    { variant: "filled", color: "blue",   class: { root: "bg-information-base" } },
    { variant: "filled", color: "orange", class: { root: "bg-warning-base" } },
    { variant: "filled", color: "red",    class: { root: "bg-error-base" } },
    { variant: "filled", color: "green",  class: { root: "bg-success-base" } },
    { variant: "filled", color: "yellow", class: { root: "bg-away-base" } },
    { variant: "filled", color: "purple", class: { root: "bg-feature-base" } },
    { variant: "filled", color: "sky",    class: { root: "bg-verified-base" } },
    { variant: "filled", color: "pink",   class: { root: "bg-highlighted-base" } },
    { variant: "filled", color: "teal",   class: { root: "bg-stable-base" } },
    // light
    { variant: "light", color: "gray",   class: { root: "bg-faded-light text-faded-dark" } },
    { variant: "light", color: "blue",   class: { root: "bg-information-light text-information-dark" } },
    { variant: "light", color: "orange", class: { root: "bg-warning-light text-warning-dark" } },
    { variant: "light", color: "red",    class: { root: "bg-error-light text-error-dark" } },
    { variant: "light", color: "green",  class: { root: "bg-success-light text-success-dark" } },
    { variant: "light", color: "yellow", class: { root: "bg-away-light text-away-dark" } },
    { variant: "light", color: "purple", class: { root: "bg-feature-light text-feature-dark" } },
    { variant: "light", color: "sky",    class: { root: "bg-verified-light text-verified-dark" } },
    { variant: "light", color: "pink",   class: { root: "bg-highlighted-light text-highlighted-dark" } },
    { variant: "light", color: "teal",   class: { root: "bg-stable-light text-stable-dark" } },
    // stroke
    { variant: "stroke", color: "gray",   class: { root: "text-faded-base" } },
    { variant: "stroke", color: "blue",   class: { root: "text-information-base" } },
    { variant: "stroke", color: "orange", class: { root: "text-warning-base" } },
    { variant: "stroke", color: "red",    class: { root: "text-error-base" } },
    { variant: "stroke", color: "green",  class: { root: "text-success-base" } },
    { variant: "stroke", color: "yellow", class: { root: "text-away-base" } },
    { variant: "stroke", color: "purple", class: { root: "text-feature-base" } },
    { variant: "stroke", color: "sky",    class: { root: "text-verified-base" } },
    { variant: "stroke", color: "pink",   class: { root: "text-highlighted-base" } },
    { variant: "stroke", color: "teal",   class: { root: "text-stable-base" } },
  ],
  defaultVariants: {
    variant: "light",
    size: "small",
    color: "gray",
  },
});

type BadgeSharedProps = VariantProps<typeof badgeVariants>;

type BadgeRootProps = VariantProps<typeof badgeVariants> &
  React.HTMLAttributes<HTMLDivElement>;

const BadgeRoot = React.forwardRef<HTMLDivElement, BadgeRootProps>(
  ({ size, variant, color, children, className, ...rest }, ref) => {
    const { root } = badgeVariants({ size, variant, color });
    const sharedProps: BadgeSharedProps = { size, variant, color };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [BADGE_ICON_NAME],
    );

    return (
      <div ref={ref} className={root({ class: className })} {...rest}>
        {extendedChildren}
      </div>
    );
  },
);
BadgeRoot.displayName = BADGE_ROOT_NAME;

type BadgeIconProps = BadgeSharedProps & {
  as: React.ElementType;
  className?: string;
};

function BadgeIcon({ as: Component, className, size, variant, color, ...rest }: BadgeIconProps) {
  const { icon } = badgeVariants({ size, variant, color });
  return <Component className={icon({ class: className })} {...rest} />;
}
BadgeIcon.displayName = BADGE_ICON_NAME;

export { BadgeRoot as Root, BadgeIcon as Icon };
