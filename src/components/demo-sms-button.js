"use client";

import { useActionState, useEffect } from "react";
import { sendDemoSmsAction } from "@/app/actions";

const initialState = {
  status: "idle",
  message: "",
};

export function DemoSmsButton({ sessionId, messageType, label }) {
  const [state, formAction, pending] = useActionState(
    sendDemoSmsAction,
    initialState,
  );

  useEffect(() => {
    if (state.status === "success" || state.status === "error") {
      window.alert(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="vehicle_session_id" value={sessionId} />
      <input type="hidden" name="message_type" value={messageType} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-2xl border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending..." : label}
      </button>
    </form>
  );
}
