import { css, StyleSheet } from 'aphrodite';
import React, { createContext, Dispatch, useEffect, useState } from 'react';
import { AuthAction, AuthState, authStateReducer, initialState, login, logout } from './authStateReducer';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const GET_CURRENT_USER = `
query getCurrentUser {
  me {
    id
    firstName
    lastName
    email
    isAdmin
  }
}
`;

type AuthStateContextProps = {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}

type AuthStateProviderProps = {
  children: React.ReactNode;
}

export const AuthStateContext = createContext<AuthStateContextProps>({} as AuthStateContextProps);

/**
 * AuthStateProvider wraps an entire application and is used to provide information about the current user and their permissions.
 * 
 * You can then use the `useAuthState` hook from any child component to access the global user object.
 */
export const AuthStateProvider = ({ children }: AuthStateProviderProps) => {
  const [state, dispatch] = React.useReducer(authStateReducer, initialState);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // A util for making a network request with a JSON response
  const request = async (method: "GET" | "POST" | "PUT" | "DELETE", path: string, bodyData?: object) => {
    const response = await fetch(path, (method === "GET") ? undefined : {
      method,
      body: JSON.stringify(bodyData),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  };

  useEffect(() => {
    // Determine the appropriate API gateway
    let gateway = '/api';
    if (window.location.href.includes('localhost')) {
      gateway = 'http://localhost:8080/api';
    }

    request('POST', gateway, {
      query: GET_CURRENT_USER,
      operationName: "getCurrentUser",
    }).then((d) => {
      if (d.data?.me) {
        dispatch(login(d.data.me));
      } else {
        dispatch(logout());
      }

      setIsLoading(false);
    });
  }, []);

  const styles = StyleSheet.create({
    loadingContainer: {
      alignContent: 'center',
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
  });

  if (isLoading) {
    return (
      <div className={css(styles.loadingContainer)}>
        <LoadingSpinner size='large' />
      </div>
    );
  }

  return (
    <AuthStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthStateContext.Provider>
  )
}