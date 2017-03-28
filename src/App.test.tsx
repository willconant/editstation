import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

import Store from './Model/Store';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App store={new Store()}/>, div);
});
