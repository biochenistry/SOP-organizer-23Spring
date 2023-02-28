import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { AuthStateProvider } from './components/Auth';

import './index.css'

let url = '/api';
if (window.location.href.includes('localhost')) {
  url = 'http://localhost:8080/api';
}

const client = new ApolloClient({
  uri: url,
  cache: new InMemoryCache(),
  credentials: 'include',
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthStateProvider>
        <App />
      </AuthStateProvider>
    </ApolloProvider>
  </React.StrictMode>
);