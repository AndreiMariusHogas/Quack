import {
  SET_QUACKS,
  LOADING_DATA,
  LIKE_QUACK,
  UNLIKE_QUACK,
  DELETE_QUACK,
  LOADING_UI,
  POST_QUACK,
  SET_ERRORS,
  CLEAR_ERRORS,
  SET_QUACK,
  STOP_LOADING_UI,
  SUBMIT_COMMENT
} from "../types";
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
//Get post
export const getQuack = quackId => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/quack/${quackId}`)
    .then(res => {
      dispatch({
        type: SET_QUACK,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => console.log(err));
};
//Add a post
export const postQuack = newQuack => dispatch => {
  dispatch({
    type: LOADING_UI
  });
  axios
    .post("/quack", newQuack)
    .then(res => {
      dispatch({
        type: POST_QUACK,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch(err =>
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      })
    );
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
//Leave a comment
export const submitComment = (quackId, commentData) => dispatch => {
  axios
    .post(`/quack/${quackId}/comment`, commentData)
    .then(res => {
      dispatch({ type: SUBMIT_COMMENT, payload: res.data });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({ type: SET_ERRORS, payload: err.response.data });
      console.log(err);
    });
};
//Delete post
export const deleteQuack = quackId => dispatch => {
  axios
    .delete(`/quack/${quackId}`)
    .then(() => {
      dispatch({ type: DELETE_QUACK, payload: quackId });
    })
    .catch(err => console.log(err));
};
//Get User Profile
export const getUserProfile = userNN => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userNN}`)
    .then(res => {
      dispatch({ type: SET_QUACKS, payload: res.data.quacks });
    })
    .catch(err => {
      dispatch({
        type: SET_QUACKS,
        payload: null
      });
    });
};

//Clear errors
export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};
