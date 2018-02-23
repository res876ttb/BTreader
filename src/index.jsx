// index.jsx
//  Program entry.

'use strict';
// ============================================
// React packages
import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import {Provider} from 'react-redux';
import {createStore, combineReducers, compose, applyMiddleware} from 'redux';

// ============================================
// import react components
import Main from 'components/Main.jsx';

// ============================================
// import react redux-reducers
import {main} from 'states/mainState.js';
import {setting} from 'states/settingState.js';
import {library} from 'states/libraryState.js';

// ============================================
// import apis

// ============================================
// import css file
import '../node_modules/bootstrap/dist/css/bootstrap.css';

// ============================================
// load component
window.onload = function() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(combineReducers({
    main,
    setting,
    library,
  }), composeEnhancers(applyMiddleware(thunkMiddleware)));

  ReactDOM.render(
    <Provider store={store}>
      <Main />
    </Provider>,
    document.getElementById('root')
  );
};
