import { createContext, useReducer } from "react";
import {
  TRANSACTION_CREATION_FAIL,
  TRANSACTION_CREATION_STARTED,
  TRANSACTION_CREATION_SUCCES,
} from "./transactionsActionTypes";
import axios from "axios";
import { apiURL_TRANSACTION } from "../../../utils/apiURL";

export const TransactionContext = createContext();
const INITIAL_STATE = {
  transaction: null,
  transactions: [],
  loading: false,
  error: null,
  userAuth: JSON.parse(localStorage.getItem("userAuth")),
};

const transactionReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case TRANSACTION_CREATION_STARTED:
      return {
        ...state,
        loading: true,
      };
    case TRANSACTION_CREATION_SUCCES:
      return {
        ...state,
        transaction: payload,
        loading: false,
        error: null,
      };
    case TRANSACTION_CREATION_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export const TransactionContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, INITIAL_STATE);

  // 1. create transaction action
  const createTransactionAction = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state?.userAuth?.token}`,
        },
      };
      const res = await axios.post(`${apiURL_TRANSACTION}`, formData, config);
      console.log(res);
      if (res?.data?.status === "success" || res?.data?.status === "Success") {
        dispatch({
          type: TRANSACTION_CREATION_SUCCES,
          payload: res?.data,
        });
        console.log(res?.data?.data?.account);
      }
      window.location.href = `/account-details/${res?.data?.data?.account}`;
    } catch (error) {
      dispatch({
        type: TRANSACTION_CREATION_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transaction: state.transaction,
        transactions: state.transactions,
        createTransactionAction,
        error: state?.error,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
