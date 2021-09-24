import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { GithubProvider } from './context/context';
import { Auth0Provider } from '@auth0/auth0-react';

//dev--lzx2dw2.us.auth0.com
//de67CqddqUXDcu3fgCyhaamUhYWm3XTi
//_27JZxbdpES1Mof1SQsCTKAt111CVkIvZhA12zbKylf0L-05wojExKkIvga0mF67
ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider domain="dev--lzx2dw2.us.auth0.com"
    clientId="de67CqddqUXDcu3fgCyhaamUhYWm3XTi"
    redirectUri={window.location.origin}
    cacheLocation="localstorage"
  >
      <GithubProvider>
            <App />

      </GithubProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
