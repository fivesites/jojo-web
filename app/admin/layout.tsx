import React from "react";
import AdminHeaderNav from "@/components/AdminHeaderNav";
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
      <AdminHeaderNav />
      {children}
      {modal}
    </>
  );
}
