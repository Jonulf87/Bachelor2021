import React from 'react';
import { Route } from 'react-router'; //Behov for denne med funksoner?
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import './custom.css'
import Test from './components/Test';
import SeatMapBackdrop from './components/SeatMap/SeatMapBackdrop';

function App() {
    //static displayName = App.name;

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

export default App;
