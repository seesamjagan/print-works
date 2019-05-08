import React from 'react';
import ReactDOM from 'react-dom';
import BusinessCardApp from './business-card-app';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BusinessCardApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
