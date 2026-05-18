import { getLocalStorageItem } from "../utility";

export const LOGIN          = 'LOGIN';
export const LOGOUT         = 'LOGOUT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

export const initialState = {
  user              : getLocalStorageItem('user'),
  token             : getLocalStorageItem('token'),
};

const AuthReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token             : action.payload.token,
        user              : action.payload.user,
      };
    case LOGOUT:
      return {
        ...state,
        token             : undefined,
        user              : undefined,
      };
    case UPDATE_ACCOUNT:
      return {
        ...state,
        user  : action.payload.user,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export default AuthReducer;