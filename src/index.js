import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import thunk from 'redux-thunk';

import reducers from './reducers';
import App from './App';
import './index.css';

const setInhancers = () => {

};
const store = createStore(reducers, composeWithDevTools(compose(applyMiddleware(thunk))));

ReactDom.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
