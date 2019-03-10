import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import { mount } from 'enzyme';
import App from '../../App';
import reducers from '../../reducers';
import sagas from '../../sagas';
import { RESET } from '../../constants';

class TestApp extends React.Component {
  componentDidMount() {
    const { store } = this.props;
    this.setState({ store });
  }

  componentWillUnmount() {
    const { store } = this.state;
    store.dispatch({ type: RESET });
  }

  render() {
    const { store, history } = this.props;

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );
  }
}

TestApp.propTypes = {
  store: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

const mountApp = ({ path = '/' } = {}) => {
  const history = createMemoryHistory({ initialEntries: [path] });
  const sagaMiddleware = createSagaMiddleware();
  const routingMiddleware = routerMiddleware(history);
  const appliedMiddleware = applyMiddleware(sagaMiddleware, routingMiddleware);
  const enhancedReducers = combineReducers({
    ...reducers,
    router: connectRouter(history),
  });
  const enhancer = compose(appliedMiddleware);
  const store = createStore(enhancedReducers, enhancer);

  sagas.forEach(saga => sagaMiddleware.run(saga));

  const app = mount(<TestApp store={store} history={history} />);

  return { app, store };
};

export default mountApp;
