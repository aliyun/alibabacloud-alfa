import React from 'react';
import Home from './Home';
import About from './About';
import Dashboard from './Dashboard';
import { mount } from '@alicloud/console-os-react-portal';
import './index.less';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const LOGO_SRC = 'https://img.alicdn.com/tfs/TB1Ly5oS3HqK1RjSZFPXXcwapXa-238-54.png';

window.title = '🤹FAKE ALIYUN FOR REACT';

const AppContainer = () => {

}

const App = (props) => {
  return (
    <Router>
      <div className="container">
        <img src={ props.src ? props.src : LOGO_SRC} />

        <p>注释掉 externalsVars 可以看到沙箱效果🤪</p>

        <p>window.title is : <b>{ window.title }</b></p>

        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>

        <hr />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default mount(App, document.getElementById('app'), 'os-example')


