import { css, StyleSheet } from 'aphrodite';
import { gql, useLazyQuery } from "@apollo/client";
import React, { createContext, Dispatch, useEffect } from 'react';
import { AuthAction, AuthState, authStateReducer, initialState, login, logout, User } from './authStateReducer';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const GET_CURRENT_USER = gql`
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

type GetCurrentUserResponse = {
  me: User | null;
}

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
  const [getUser, { data, loading }] = useLazyQuery<GetCurrentUserResponse>(GET_CURRENT_USER);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (data?.me && !state.user) {
    dispatch(login(data.me));
  } else if (!data?.me && state.user) {
    dispatch(logout());
  }

  const styles = StyleSheet.create({
    loadingContainer: {
      alignContent: 'center',
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
  });

  if (loading) {
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