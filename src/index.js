import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// if (localStorage['apollo3-cache-persist']) {
//     let cacheData = JSON.parse(localStorage['apollo3-cache-persist']);
//     cache.restore(cacheData);
// }

ReactDOM.render(<App />, document.getElementById('root'));
