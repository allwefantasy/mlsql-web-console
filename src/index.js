import React from 'react';
import ReactDOM from 'react-dom';
import './mlsql.css';
import './index.css';
import {
  BrowserRouter,
  Route,
  Link
} from 'react-router-dom';

import App from './App';
import MLSQLQueryApp from './components/MLSQLQueryApp';
import {Navbar,Button,Alignment} from "@blueprintjs/core";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<BrowserRouter>
  <div>
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>MLSQL Web Console</Navbar.Heading>
        <Navbar.Divider />
        <Button className="bp3-minimal" icon="home" text="Home" />
        <Button className="bp3-minimal" icon="document" text="Files" />
      </Navbar.Group>
    </Navbar>
    <Route exact path="/" component={App} />
    <Route exact path="/query" component={MLSQLQueryApp} />
  </div>
</BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
