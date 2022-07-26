import React, {
  useReducer,
  useCallback,
  ChangeEventHandler,
  ChangeEvent,
  useEffect,
} from "react";
import LoginPresenter from "./LoginPresenter";

interface LoginState {
  email: string;
  password: string;
}

const initialState = {
  email: "",
  password: "",
};

type LoginAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string };

const loginDispatcher = (state: LoginState, action: LoginAction) => {
  switch (action.type) {
    case "SET_EMAIL":
      return {
        ...state,
        email: action.payload,
      };
    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload,
      };
    default:
      return state;
  }
};

function LoginContainer() {
  const [loginState, dispatch] = useReducer(loginDispatcher, initialState);

  const handleEmail = useCallback<ChangeEventHandler>(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "SET_EMAIL", payload: event.currentTarget.value });
    },
    []
  );

  const handlePassword = useCallback<ChangeEventHandler>(
    (event: ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "SET_PASSWORD", payload: event.currentTarget.value });
    },
    []
  );

  useEffect(() => {
    console.log(loginState);
  }, [loginState]);

  return (
    <LoginPresenter
      email={loginState.email}
      password={loginState.password}
      handleEmail={handleEmail}
      handlePassword={handlePassword}
    />
  );
}

export default React.memo(LoginContainer);
