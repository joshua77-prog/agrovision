import { Outlet } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Logo from '../components/layout/Logo';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Outlet />
      <Footer />
    </div>
  );
}
