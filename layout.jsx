import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Notifications from '../ui/Notifications';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Notifications />
    </div>
  );
};

export default Layout;