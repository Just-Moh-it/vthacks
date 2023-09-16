"use client";

import { cn } from "~/lib/utils";
import * as React from "react";
import classes from "./index.module.css";

export interface GrowingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rootProps?: React.HTMLAttributes<HTMLDivElement>;
}

const GrowingTextarea = React.forwardRef<
  HTMLTextAreaElement,
  GrowingTextareaProps
>(({ rootProps, ...props }, ref) => {
  const parentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const { current } = parentRef;

    if (!current) return;

    current.dataset.replicatedValue = props?.value as string;
  }, [props?.value]);

  return (
    <div
      {...rootProps}
      className={cn(
        rootProps?.className,
        classes.growText,
        "grid after:pointer-events-none after:invisible after:select-none after:overflow-hidden after:whitespace-pre-wrap",
      )}
      data-replicated-value={props?.value}
      ref={parentRef}
    >
      <textarea
        {...props}
        ref={ref}
        placeholder={props?.placeholder}
        onChange={(e, ...args) => {
          e.preventDefault();
          const { current } = parentRef;
          const actualText = e.target.value.replace(/\n/g, "");

          if (!current) return;

          current.dataset.replicatedValue = actualText;

          props?.onChange?.(
            { ...e, target: { ...e.target, value: actualText } },
            ...args,
          );
        }}
        className={cn(
          props?.className,
          "resize-none overflow-hidden focus:outline-none",
        )}
      />
    </div>
  );
});
GrowingTextarea.displayName = "GrowingTextarea";

export default GrowingTextarea;
