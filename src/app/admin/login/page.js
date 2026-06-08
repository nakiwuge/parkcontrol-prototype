import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { FlashMessage } from "@/components/flash-message";
import { SectionCard } from "@/components/section-card";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminLoginPage({ searchParams }) {
  const filters = await searchParams;
  const session = await getAdminSession();

  if (session?.role === "admin") {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl space-y-6">
        <section className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Rompact Admin
          </p>

          <p className="max-w-lg text-sm leading-7 text-foreground/65">
            This access is reserved for the Rompact team.
          </p>
        </section>

        <FlashMessage message={filters?.message} error={filters?.error} />

        <SectionCard
          title="Login"
          subtitle="Use your admin email and password to continue."
          surface="white"
        >
          <AdminLoginForm />
        </SectionCard>
      </div>
    </main>
  );
}
