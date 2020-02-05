import { SET_QUACKS, LOADING_DATA, LIKE_QUACK, UNLIKE_QUACK } from "../types";

const initialState = {
  quacks: [],
  quack: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_QUACKS:
      return {
        ...state,
        quacks: action.payload,
        loading: false
      };
    case LIKE_QUACK:
    case UNLIKE_QUACK:
      let index = state.quacks.findIndex(
        quack => quack.quackId === action.payload.quackId
      );
      state.quacks[index] = action.payload;
      return {
        ...state
      };
    default:
      return state;
  }
}
