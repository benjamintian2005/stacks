import NewListForm from '@/components/NewListForm';

export default function NewListPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">New list</h1>
      <NewListForm />
    </div>
  );
}
