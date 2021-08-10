import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
// import ProfileEdit from '../profile/Profile';
import TimeSheet from '../timesheet/Timesheet';
import Summary from '../summary/Summary';

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
                        <li className="nav-item" role="presentation">
                            <Link to={'/'} className="nav-link"> Summary </Link>
                        </li>
                        <li className="nav-item" role="presentation">
                            <Link to={'/timesheet'} className="nav-link">TimeSheet</Link>
                        </li>
                        {/*<li className="nav-item" role="presentation">*/}
                        {/*   <Link to={'/profile'} className="nav-link">Profile</Link>*/}
                        {/*</li>*/}
                    </ul>
                    <Switch>
                        <Route exact path='/' component={Summary} />
                        <Route path='/timesheet' component={TimeSheet} />
                        {/*<Route path='/profile' component={ProfileEdit} />*/}
                    </Switch>
                </div>
            </Router>
        )
    }
}
