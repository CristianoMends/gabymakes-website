import { useEffect } from 'react';
import LoginPopup from "../components/login";
import HeaderVariant from '../components/header-variant';
import Breadcrumb from '../components/breadcrumb';
import Footer from '../components/footer';

export default function LoginPage() {
  useEffect(() => {
    document.title = "Faça login na sua conta";
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <HeaderVariant />
      <Breadcrumb/>
      <LoginPopup />
      <Footer/>
    </div>
  );
}
