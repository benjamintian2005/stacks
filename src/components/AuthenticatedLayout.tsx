import { Outlet } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import NavBar from './NavBar';

export default function AuthenticatedLayout() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <NavBar />
        <main>
          <Outlet />
        </main>
      </div>
    </RequireAuth>
  );
}
