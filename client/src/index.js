import 'typeface-metropolis';
import './scss/custom.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import sagas from './sagas';
import App from './App';
import * as serviceWorker from './serviceWorker';

const sagaMiddleware = createSagaMiddleware();

const history = createBrowserHistory();

/* eslint-disable-next-line no-underscore-dangle */
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancedReducers = combineReducers({
  ...reducers,
  router: connectRouter(history),
});

const appliedMiddleware = applyMiddleware(sagaMiddleware, routerMiddleware(history));

const store = createStore(
  enhancedReducers,
  composeEnhancer(appliedMiddleware),
);

sagas.forEach(saga => sagaMiddleware.run(saga));

const Tranquill = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(
  <Tranquill store={store} />,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
