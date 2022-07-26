import React from "react";
import Header from "./Header";

interface Props {
  children: React.ReactNode;
}

function Layout(props: Props) {
  const { children } = props;
  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default Layout;
