import React, { Component } from 'react';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import './custom.css'
import Layout from './components/Layout/Layout';
import MainPage from './components/MainPage/MainPage';
import Test from './components/Test';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Router>
                    <div>
                        <Switch>
                            <Route path="" component={MainPage} />
                            <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
                        </Switch>
                    </div>
                </Router>
                <div className="container">
                    <Test />
                </div>
            </Layout>
        );
    }
}
