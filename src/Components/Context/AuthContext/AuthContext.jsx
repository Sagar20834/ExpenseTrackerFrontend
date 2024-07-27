import { createContext, useReducer } from "react";
import axios from "axios";
import {
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
} from "./authActionTypes";
import { apiURL_USER } from "../../../utils/apiURL";

export const AuthContext = createContext();

//initial state
const INITIAL_STATE = {
  userAuth: JSON.parse(localStorage.getItem("userAuth")),
  error: null,
  loading: false,
  profile: null,
};

const userReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        userAuth: payload,
        error: null,
        loading: false,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        userAuth: null,
        error: payload,
        loading: false,
      };

    case LOGIN_SUCCESS:
      //add to local storage
      localStorage.setItem("userAuth", JSON.stringify(payload));

      return {
        ...state,
        userAuth: payload,
        error: null,
        loading: false,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        userAuth: null,
        error: payload,
        loading: false,
      };

    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        profile: payload,
      };

    case FETCH_PROFILE_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null,
      };

    case LOGOUT:
      // localStorage.removeItem("userAuth");
      return {
        ...state,
        userAuth: null,
        error: null,
        loading: false,
        profile: null,
      };

    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);

  //actions
  //1.  login action
  const loginUserAction = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(`${apiURL_USER}/login`, formData, config);
      console.log(res);
      if (res?.data?.status === "success" || res?.data?.status === "Success") {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        });
      }
      //rediect
      window.location.href = "/dashboard";
    } catch (error) {
      dispatch({
        type: LOGIN_FAILED,
        payload: error?.response?.data?.message,
      });
    }
  };

  //2. profile action

  const fetchProfileAction = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state?.userAuth?.token}`,
        },
      };
      const res = await axios.get(`${apiURL_USER}/profile`, config);
      if (res?.data?.status === "success" || res?.data?.status === "Success") {
        dispatch({
          type: FETCH_PROFILE_SUCCESS,
          payload: res.data.user,
        });
      }
    } catch (error) {
      dispatch({
        type: FETCH_PROFILE_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  //3. logout action

  const logoutUserAction = () => {
    dispatch({ type: LOGOUT, payload: null });
    localStorage.removeItem("userAuth");
    window.location.href = "/";
  };

  //4. registerUserAction

  const registerUserAction = async (formData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(`${apiURL_USER}/register`, formData, config);
      if (res?.data?.status === "success" || res?.data?.status === "Success") {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
      }
      //rediect
      window.location.href = "/login";
    } catch (error) {
      dispatch({
        type: REGISTER_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        loginUserAction,
        userAuth: state,
        fetchProfileAction,
        profile: state?.profile,
        error: state?.error,
        logoutUserAction,
        token: state?.userAuth?.token,
        registerUserAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
