import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:pl-60 pt-14 lg:pt-0 min-h-screen dash-area">
        <div className="p-6 sm:p-8 max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
