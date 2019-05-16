import ArtistMaint from '../app/ArtistMaint.jsx';
import React from 'react';
import {render} from 'react-dom';

// Used by index.html:
import "../images/favicon.ico";


class App extends React.Component {
  render () {
    return (
      <div>
        <ArtistMaint
          parent={this}
        />
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));