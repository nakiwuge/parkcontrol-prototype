"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className,
  pendingLabel = "Saving...",
  ...props
}) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      disabled={pending || props.disabled}
      className={className}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
