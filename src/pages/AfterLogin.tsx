import React, { useEffect } from 'react';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const AfterLogin = () => {
  useEffect(() => {
    try {
      const location = window.location.search;
      const params = new URLSearchParams(location);
      let token = params.get('token');
      if (token) {
        if (token.charAt(token.length - 1) === '#') {
          token = token.slice(0, token.length - 2);
        }
        localStorage.setItem('access_token', token);
        history.push({ pathname: '/' });
        if (process.env.NODE_ENV === 'production') window.location.href = `https://sgsg.name`;
        else window.location.href = `http://localhost:3000/`;
      }
    } catch (e) {
      history.push('/login');
    }
  }, []);
  return <></>;
};

export default AfterLogin;
