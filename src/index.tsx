import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import Store from './Model/Store';

let store = new Store();
store.loadPosts();

ReactDOM.render(
    <App store={store}/>,
    document.getElementById('root') as HTMLElement
);
