import { useContext, useEffect } from "react";
import AccountList from "./AccountList";
import AccountSummary from "./AccountSummary";
import { AuthContext } from "../Context/AuthContext/AuthContext";

const AccountDashboard = () => {
  const { profile, fetchProfileAction, error } = useContext(AuthContext);
  useEffect(() => {
    fetchProfileAction();
  }, []);
  return (
    <>
      {error ? (
        <>
          <div
            className="bg-red-100 border text-center border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error! {""}</strong>
            <span className="block sm:inline ">{error}</span>
          </div>{" "}
        </>
      ) : (
        <>
          <AccountSummary />
          <AccountList accountsList={profile?.accounts} />
        </>
      )}
    </>
  );
};

export default AccountDashboard;
