import { createContext, useEffect, useReducer } from "react";
import { setLocalStorageItem } from "../utility";
import AuthReducer, { initialState } from "../reducer/AuthReducer";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  useEffect(() => {
    if (state.token || state.user) {
      setLocalStorageItem('token', state.token);
      setLocalStorageItem('user', state.user);
    } else {
      localStorage.clear();      
    }
  }, [state.token, state.user, state.user?.roles]);

  return (
    <AuthContext.Provider value={{state, dispatch}}>
      {
        children
      }
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;