import React from "react";

type NamedType = {
  displayName?: string;
  name?: string;
};

type CloneProps = {
  children?: React.ReactNode;
} & Record<string, unknown>;

export const recursiveCloneChildren = (
  children: React.ReactNode,
  additionalProps: Record<string, unknown>,
  displayNames: string[]
): React.ReactNode => {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
      return child;
    }

    const childType = child.type as NamedType;
    const childDisplayName = childType.displayName ?? childType.name;

    const shouldInjectProps = !!childDisplayName && displayNames.includes(childDisplayName);

    const nextProps: CloneProps = shouldInjectProps
      ? { ...additionalProps }
      : {};

    if (child.props?.children) {
      nextProps.children = recursiveCloneChildren(
        child.props.children,
        additionalProps,
        displayNames
      );
    }

    return React.cloneElement(child, nextProps);
  });
};
