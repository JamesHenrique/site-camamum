import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PropertyGrid from './components/PropertyGrid';
import Gallery from './components/Gallery';
import About from './components/About';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import { PropertyProvider } from './contexts/PropertyContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Create a wrapper component to handle auth state
const AdminRoute: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!session) {
    return <Login onBack={onBack} />;
  }

  return <AdminPanel onBack={onBack} />;
};

const AppContent: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);

  if (isAdminView) {
    return <AdminRoute onBack={() => setIsAdminView(false)} />;
  }

  return (
    <div className="min-h-screen bg-brand-white text-brand-black font-sans selection:bg-brand-orange selection:text-white">
      <Header />
      <main>
        <Hero />
        <PropertyGrid />
        <Gallery />
        <About />
        <CallToAction />
      </main>
      <Footer onAdminClick={() => setIsAdminView(true)} />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <PropertyProvider>
        <AppContent />
      </PropertyProvider>
    </AuthProvider>
  );
};

export default App;