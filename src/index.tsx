import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

let querystring = require('querystring');

import Store from './Model/Store';

let store = new Store();
store.loadPosts();

window.onpopstate = event => {
    store.handlePopState(event.state);
};

if (window.location.search.length > 1) {
    store.restoreState(querystring.parse(window.location.search.substr(1)));
}

ReactDOM.render(
    <App store={store}/>,
    document.getElementById('root') as HTMLElement
);
