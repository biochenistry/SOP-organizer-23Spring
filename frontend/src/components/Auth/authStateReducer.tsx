import { Reducer } from "react";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

export type AuthState = {
  user: User | null;
}

export type AuthAction =
  | {
    type: "LOGOUT"
  }
  | {
    type: "LOGIN"
    payload: User
  }

export const authStateReducer: Reducer<AuthState, AuthAction> = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGOUT": {
      return {
        user: null,
      }
    }
    case "LOGIN": {
      return {
        user: action.payload
      }
    }

    default:
      return state
  }
}

export const initialState = {
  user: null,
}

export function logout(): AuthAction {
  return {
    type: "LOGOUT"
  }
}

export function login(user: User): AuthAction {
  return {
    type: "LOGIN",
    payload: user
  }
}