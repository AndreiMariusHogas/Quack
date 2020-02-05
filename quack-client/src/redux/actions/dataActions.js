import { SET_QUACKS, LOADING_DATA, LIKE_QUACK, UNLIKE_QUACK } from "../types";
import axios from "axios";

axios.defaults.baseURL =
  "https://europe-west1-quack-1d8e3.cloudfunctions.net/api";

//Get all posts
export const getQuacks = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/quacks")
    .then(res => {
      dispatch({
        type: SET_QUACKS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        dispatch: SET_QUACKS,
        payload: []
      });
    });
};
//Like a post
export const likeQuack = quackId => dispatch => {
  axios
    .get(`/quack/${quackId}/like`)
    .then(res => {
      dispatch({
        type: LIKE_QUACK,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
//Remove Like from post
export const unlikeQuack = quackId => dispatch => {
  axios
    .post(`/quack/${quackId}/unlike`)
    .then(res => {
      dispatch({
        type: UNLIKE_QUACK,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
