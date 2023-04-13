import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { AuthStateProvider } from './components/Auth';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import './index.css'
import { BrowserRouter } from 'react-router-dom';

export const ROOT_FOLDER_ID = '1TjRQ-ZVMcAFc7rCg8O2uG6tQOVmrFTbD';

TimeAgo.addDefaultLocale(en)

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
    <BrowserRouter>
      <ApolloProvider client={client}>
        <AuthStateProvider>
          <App />
        </AuthStateProvider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);