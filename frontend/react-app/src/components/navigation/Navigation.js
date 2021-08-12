import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import ProfileEdit from '../profile/Profile';
import TimeSheet from '../timesheet/Timesheet';
import Summary from '../summary/Summary';
import viewTimeSheet from '../timesheet/viewTimeSheet';
import Logout from '../logout/Logout';

export default class Navigation extends Component {
    state = {
        show: true,
    };
    render() {
        const show = this.state.show;
        return (
            <Router>
                <div className="container">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        {/* <li className="nav-item" role="presentation">
                            <Link to={'/'} className="nav-link"> Summary </Link>
                        </li> */}
                        <li className="nav-item" role="presentation">
                            <Link to={'/summary'} className="nav-link">Summary</Link>
                        </li>
                        <li className="nav-item" role="presentation">
                            <Link to={'/timesheet'} className="nav-link">TimeSheet</Link>
                        </li>
                        <li className="nav-item" role="presentation">
                          <Link to={'/profile'} className="nav-link">Profile</Link>
                        </li>
                        <li className="nav-item" role="presentation">
                          <Link to={'/logout'} className="nav-link">Logout</Link>
                        </li>
                    </ul>
                    <Switch>
                        <Route exact path='/' component={Summary} />
                        <Route path='/summary' component={Summary} />
                        <Route path='/timesheet' component={TimeSheet} />
                        <Route path='/profile' component={ProfileEdit} />
                        <Route path='/logout' component={Logout} />
                        <Route path='/viewTimesheet' component={viewTimeSheet} />
                    </Switch>
                </div>
            </Router>
        )
    }
}
