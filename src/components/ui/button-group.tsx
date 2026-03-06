"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { tv, type VariantProps } from "@/utils/tv";
import { recursiveCloneChildren } from "@/utils/recursive-clone-children";

const BUTTON_GROUP_ROOT_NAME = "ButtonGroupRoot";
const BUTTON_GROUP_ITEM_NAME = "ButtonGroupItem";
const BUTTON_GROUP_ICON_NAME = "ButtonGroupIcon";

export const buttonGroupVariants = tv({
  slots: {
    root: "flex -space-x-px",
    item: [
      "group relative inline-flex items-center justify-center whitespace-nowrap border border-[var(--scaffold-line)] bg-[color-mix(in_oklab,var(--scaffold-surface)_96%,var(--scaffold-bg))] text-[color-mix(in_oklab,var(--scaffold-ruler)_82%,var(--scaffold-toggle-text-active))] outline-none transition-colors duration-200",
      "hover:bg-[color-mix(in_oklab,var(--scaffold-toggle-track)_88%,var(--scaffold-surface))] hover:text-[var(--scaffold-toggle-text-active)]",
      "focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)] focus-visible:ring-offset-0",
      "data-[state=on]:z-[1] data-[state=on]:bg-[color-mix(in_oklab,var(--scaffold-toggle-thumb)_92%,var(--scaffold-surface))] data-[state=on]:text-[var(--scaffold-toggle-text-active)]",
      "disabled:pointer-events-none disabled:opacity-50",
      "[font-family:var(--font-geist-pixel-circle)]",
    ],

    icon: "shrink-0",
  },
  variants: {
    size: {
      small: {
        item: "h-9 gap-2.5 px-4 text-[11px] tracking-[0.16em] first:rounded-l-lg last:rounded-r-lg",
        icon: "size-4",
      },
      xsmall: {
        item: "h-8 gap-2 px-3.5 text-[10px] tracking-[0.16em] first:rounded-l-lg last:rounded-r-lg",
        icon: "size-4",
      },
      xxsmall: {
        item: "h-6 gap-1.5 px-2.5 text-[9px] tracking-[0.14em] first:rounded-l-md last:rounded-r-md",
        icon: "size-3.5",
      },
    },
  },
  defaultVariants: {
    size: "small",
  },
});

type ButtonGroupSharedProps = VariantProps<typeof buttonGroupVariants>;

type ButtonGroupRootProps = ButtonGroupSharedProps &
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
  };

const ButtonGroupRoot = React.forwardRef<HTMLDivElement, ButtonGroupRootProps>(
  ({ asChild, children, className, size, ...rest }, forwardedRef) => {
    const Component = asChild ? Slot : "div";
    const { root } = buttonGroupVariants({ size });

    const sharedProps: ButtonGroupSharedProps = { size };
    const extendedChildren = recursiveCloneChildren(children, sharedProps, [
      BUTTON_GROUP_ITEM_NAME,
      BUTTON_GROUP_ICON_NAME,
    ]);

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        {...rest}
        data-oid="hg:essy"
      >
        {extendedChildren}
      </Component>
    );
  },
);
ButtonGroupRoot.displayName = BUTTON_GROUP_ROOT_NAME;

type ButtonGroupItemProps = ButtonGroupSharedProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  };

const ButtonGroupItem = React.forwardRef<
  HTMLButtonElement,
  ButtonGroupItemProps
>(({ children, className, size, asChild, ...rest }, forwardedRef) => {
  const Component = asChild ? Slot : "button";
  const { item } = buttonGroupVariants({ size });

  return (
    <Component ref={forwardedRef} {...rest} data-oid=":koke.7">
      {children}
    </Component>
  );
});
ButtonGroupItem.displayName = BUTTON_GROUP_ITEM_NAME;

type ButtonGroupIconProps = ButtonGroupSharedProps & {
  as?: React.ElementType;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<"div">, "children">;

function ButtonGroupIcon({
  className,
  size,
  as,
  ...rest
}: ButtonGroupIconProps) {
  const Component = as ?? "div";
  const { icon } = buttonGroupVariants({ size });

  return (
    <Component
      className={icon({ class: className })}
      {...rest}
      data-oid="6_gmr8q"
    />
  );
}
ButtonGroupIcon.displayName = BUTTON_GROUP_ICON_NAME;

export {
  ButtonGroupRoot as Root,
  ButtonGroupItem as Item,
  ButtonGroupIcon as Icon,
};
