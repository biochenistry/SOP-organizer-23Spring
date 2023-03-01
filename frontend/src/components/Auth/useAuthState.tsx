import React, { Dispatch } from 'react';
import { AuthStateContext } from './AuthStateProvider';
import { AuthAction, AuthState } from './authStateReducer';

export default function useAuthState(): { state: AuthState, dispatch: Dispatch<AuthAction> } {
  const { state, dispatch } = React.useContext(AuthStateContext);
  return { state, dispatch };
}