"use client";

import { useState } from "react";
import { loginAdminAction } from "@/app/admin/actions";
import { FormField } from "@/components/form-field";
import { SubmitButton } from "@/components/submit-button";

function inputClassName() {
  return "w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent";
}

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={loginAdminAction} className="space-y-5">
      <FormField label="Email address">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClassName()}
        />
      </FormField>

      <FormField label="Password">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            className={`${inputClassName()} pr-24`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-line bg-surface-muted px-3 py-1 text-xs font-semibold text-foreground hover:text-accent"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? "Hide" : "View"}
          </button>
        </div>
      </FormField>

      <SubmitButton
        type="submit"
        className="rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-white hover:bg-foreground/90"
      >
        Sign In
      </SubmitButton>
    </form>
  );
}
