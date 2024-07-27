import { createContext, useReducer } from "react";
import {
  ACCOUNT_DETAILS_SUCCESS,
  ACCOUNT_DETAILS_FAIL,
  ACCOUNT_CREATION_SUCCES,
  ACCOUNT_CREATION_FAIL,
} from "./accountActionTypes";
import { apiURL_ACCOUNT } from "../../../utils/apiURL";
import axios from "axios";

export const AccountContext = createContext();

//INITIAL

const INITIAL_STATE = {
  userAuth: JSON.parse(localStorage.getItem("userAuth")),
  account: null,
  accounts: [],
  loading: false,
  error: null,
};

const accountReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACCOUNT_CREATION_SUCCES:
      return {
        ...state,
        account: payload,
        loading: false,
        accounts: [],
        error: null,
      };

    case ACCOUNT_CREATION_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
        accounts: [],
        account: null,
      };
    case ACCOUNT_DETAILS_SUCCESS:
      return {
        ...state,
        account: payload,
        loading: false,
        error: null,
      };

    case ACCOUNT_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload,
        account: null,
      };

    default:
      return state;
  }
};

export const AccountContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, INITIAL_STATE);

  //1.get account details
  const getAccountDetailsAction = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state?.userAuth?.token}`,
        },
      };
      const res = await axios.get(`${apiURL_ACCOUNT}/${id}`, config);
      if (res?.data?.status === "success" || res?.data?.status === "Success") {
        dispatch({
          type: ACCOUNT_DETAILS_SUCCESS,
          payload: res?.data,
        });
      }
    } catch (error) {
      dispatch({
        type: ACCOUNT_DETAILS_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  //2. account create

  const createAccountAction = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state?.userAuth?.token}`,
        },
      };
      const res = await axios.post(`${apiURL_ACCOUNT}`, formData, config);
      if (res?.data?.status === "success" || res?.data?.status === "Success") {
        //redirect to dashboard
        window.location.href = "/dashboard";
      }
      dispatch({
        type: ACCOUNT_CREATION_SUCCES,
        payload: res?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: ACCOUNT_CREATION_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  return (
    <AccountContext.Provider
      value={{
        state,
        account: state?.account?.data,
        getAccountDetailsAction,
        createAccountAction,
        error: state?.error,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
