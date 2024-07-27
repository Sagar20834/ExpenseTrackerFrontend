import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Forms/Login";
import HomePage from "./Components/Homepage/HomePage";
import Register from "./Components/Register/Register";
import Navbar from "./Components/Navbar/Navbar";
import AddTransaction from "./Components/AddTransaction/AddTransaction";
import AccountDashboard from "./Components/Dashboard/AccountDashboard";
import AccountDetails from "./Components/Dashboard/AccountDetails";
import AddAccount from "./Components/AddAccount/AddAccount";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addtransaction/:f" element={<AddTransaction />} />
          <Route path="/dashboard" element={<AccountDashboard />} />
          <Route
            path="/account-details/:accountId"
            element={<AccountDetails />}
          />
          <Route path="/dashboard/accounts/create" element={<AddAccount />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
