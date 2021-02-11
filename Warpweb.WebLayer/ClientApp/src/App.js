import React from 'react';
import { Route } from 'react-router'; //Behov for denne med funksoner?
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
import SeatMapBackdrop from './components/SeatMap/SeatMapBackdrop';

export default class App extends Component {
    static displayName = App.name;

    return (
        <div className="container">
            <Test />
            <SeatMapBackdrop />
        </div>
              //<Layout>
      //  <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
      //</Layout>
    );
    
}
