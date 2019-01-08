import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStar,faSearch } from '@fortawesome/free-solid-svg-icons'
import Main from './Main'

library.add(faStar, faSearch)

class App extends Component {
  render() {
    return (
      <div className="App">
       <Main/>
      </div>
    );
  }
}

export default App;
