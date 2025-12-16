import React from "react";
import AdminSidebar from "@/components/AdminSideBar";
import HeaderNav from "@/components/HeaderNav";

export default function AdminLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <HeaderNav />
      <AdminSidebar />
      {children}
      {modal}
    </>
  );
}
