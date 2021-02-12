import React, { Component } from 'react';
import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom";

import './custom.css'
import MainPage from './components/MainPage/MainPage';

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <MainPage />
                </div>
            </BrowserRouter>
        );
    }
}
