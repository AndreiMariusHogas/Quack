import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED
} from "../types";
import axios from "axios";
axios.defaults.baseURL =
  "https://europe-west1-quack-1d8e3.cloudfunctions.net/api";

//Login
export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
//GET User Data
export const getUserData = () => dispatch => {
  axios
    .get("/user")
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
export const logoutUser = () => dispatch => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

//Sign up User
export const signupUser = (newUserData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

const setAuthorizationHeader = token => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};
