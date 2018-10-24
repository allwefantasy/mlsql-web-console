import React from 'react';
import ReactDOM from 'react-dom';
import './mlsql.scss';
import './index.scss';
import {
    BrowserRouter,
    Route,
    Link
} from 'react-router-dom';

import Register from './user/MLSQLRegister'
import MLSQLQueryApp from './components/MLSQLQueryApp';
import {Navbar, Button, Alignment} from "@blueprintjs/core";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Navbar>
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading>MLSQL Web Console</Navbar.Heading>
                    <Navbar.Divider/>
                    <Button className="bp3-minimal" icon="home" text="Console"/>
                    <Button className="bp3-minimal" icon="document" text="Jobs"/>
                </Navbar.Group>
            </Navbar>
            <Route exact path="/" component={Register}/>
            <Route exact path="/query" component={MLSQLQueryApp}/>
        </div>

    </BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
