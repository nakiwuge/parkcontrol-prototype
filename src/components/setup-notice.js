import { SectionCard } from "@/components/section-card";

export function SetupNotice() {
  return (
    <SectionCard
      title="Supabase Setup Needed"
      subtitle="This prototype is wired for Supabase, but the environment variables are not set in this deployment yet."
    >
      <div className="space-y-3 text-sm leading-7 text-foreground/65">
        <p>Add these environment variables to run the live demo flow:</p>
        <div className="rounded-2xl border border-line bg-surface-muted p-4 font-mono text-xs">
          NEXT_PUBLIC_SUPABASE_URL
          <br />
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
        </div>
        <p>
          After that, run the SQL schema in <code>supabase/schema.sql</code> and
          reload the app.
        </p>
      </div>
    </SectionCard>
  );
}
