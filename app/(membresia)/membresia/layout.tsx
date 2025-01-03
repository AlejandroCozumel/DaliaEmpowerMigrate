import React, { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
};

export default Layout;