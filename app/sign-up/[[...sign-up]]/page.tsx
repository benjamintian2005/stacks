import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 dark:bg-slate-950">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Stacks</h1>
      <SignUp />
    </div>
  );
}
