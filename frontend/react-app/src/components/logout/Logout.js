import React, { Component } from "react";

export default class Logout extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		localStorage.removeItem('userId');
		localStorage.removeItem('token');
        window.location.href = "http://localhost:3001";
	}

    render() {
        return (<></>);
    }
}