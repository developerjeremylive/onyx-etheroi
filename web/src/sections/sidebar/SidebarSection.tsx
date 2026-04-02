"use client";

import React from "react";
import Text from "@/refresh-components/texts/Text";
import { Disabled, Hoverable } from "@opal/core";

export interface SidebarSectionProps {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  disabled?: boolean;
}

export default function SidebarSection({
  title,
  children,
  action,
  disabled,
}: SidebarSectionProps) {
  return (
    <Hoverable.Root group="sidebar-section">
      {/* Title */}
      <Disabled disabled={disabled}>
        <div className="pl-2 pr-1 py-1 sticky top-[0rem] bg-background-tint-02 z-10 flex flex-row items-center justify-between">
          <div className="p-0.5 w-full flex flex-col justify-center">
            <Text secondaryBody text02>
              {title}
            </Text>
          </div>
          {action && (
            <Hoverable.Item group="sidebar-section">{action}</Hoverable.Item>
          )}
        </div>
      </Disabled>

      {/* Contents */}
      {children}
    </Hoverable.Root>
  );
}
