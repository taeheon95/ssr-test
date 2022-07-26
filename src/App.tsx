import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import loadable from "@loadable/component";

const Login = loadable(() => import("./pages/Login"));

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route index element={<div>index 페이지</div>} />
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<div>로그아웃 페이지</div>} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
