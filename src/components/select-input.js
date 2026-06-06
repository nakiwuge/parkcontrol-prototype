"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function normalizeOption(option) {
  if (typeof option === "string") {
    return { label: option, value: option };
  }

  return option;
}

export function SelectInput({
  name,
  value,
  defaultValue,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
}) {
  const normalizedOptions = useMemo(
    () => options.map(normalizeOption),
    [options],
  );
  const initialValue =
    value ?? defaultValue ?? normalizedOptions[0]?.value ?? "";
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectedOption =
    normalizedOptions.find((option) => option.value === selectedValue) ?? null;

  function handleSelect(nextValue) {
    setSelectedValue(nextValue);
    setOpen(false);
    onChange?.({ target: { value: nextValue } });
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <input type="hidden" name={name} value={selectedValue} />

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 text-left text-base text-foreground outline-none focus:border-accent sm:text-sm"
      >
        <span className={selectedOption ? "text-foreground" : "text-foreground/45"}>
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-foreground/48 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-64 overflow-y-auto rounded-[1.25rem] border border-line bg-white p-2 shadow-[0_18px_45px_rgba(31,41,55,0.12)]">
          <div className="space-y-1">
            {normalizedOptions.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm ${
                    isSelected
                      ? "bg-surface-muted font-semibold text-foreground"
                      : "text-foreground/72 hover:bg-surface-muted hover:text-foreground"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected ? (
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                      Selected
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
