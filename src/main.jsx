import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthContextProvider from "./Components/Context/AuthContext/AuthContext.jsx";
import { AccountContextProvider } from "./Components/Context/AccountContext/AccountContext.jsx";
import { TransactionContextProvider } from "./Components/Context/TransactionContext/TransactionContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <AccountContextProvider>
      <TransactionContextProvider>
        <App />
      </TransactionContextProvider>
    </AccountContextProvider>
  </AuthContextProvider>
);
