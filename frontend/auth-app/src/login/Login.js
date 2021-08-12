import React, { Component } from "react"
import axios from "axios"

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',

			usernameEnable: false,
			passwordEnable: false,
			message: ""
		};
	}

	componentDidMount() {
		if (localStorage.getItem("token") != null) {
			localStorage.removeItem('userId');
			localStorage.removeItem('token');
			localStorage.removeItem('weekEnding');
		}
	}

	// MM/DD/YYYY
	getWeekEnding(date) {
		let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		let year = date.getFullYear();
		return month + "/" + day + "/" + year;
	}

	onSubmit = (e) => {
		e.preventDefault();
		axios
			.post("http://localhost:9999/auth/login", {
				username: this.state.username,
				password: this.state.password
			})
			.then((response) => {
				if (response.data.token != undefined && response.data.user != undefined) {
					localStorage.setItem("token", response.data.token);
					localStorage.setItem("userId", response.data.user.id);
					localStorage.setItem("weekEnding", this.getWeekEnding(new Date()));
					this.setState({ message: "" });
					window.location.href ="http://localhost:3000/summary?userId=" + localStorage.getItem("userId") + 
						"&token=" + localStorage.getItem("token") + "&weekEnding=" + localStorage.getItem("weekEnding");
				} else {
					this.setState({ message: "Fail!" });
				}
			})
	};

	render() {
		return (
			<>
				<h3>Welcome to Timesheet Management</h3>
				<div>
					<input type="text" id="username" placeholder="username" value={this.state.username} onChange={(e) => {
						this.setState({
							username: e.target.value,
							usernameEnable: e.target.value.length == 0 ? false : true
						})
					}} />
					<br /><br />
					<input type="password" id="password" placeholder="password" value={this.state.password} onChange={(e) => {
						this.setState({
							password: e.target.value,
							passwordEnable: e.target.value.length == 0 ? false : true
						})
					}} />
				</div>
				<br />
				<button onClick={this.onSubmit} disabled={!this.state.usernameEnable || !this.state.passwordEnable}>Login</button>
				<span>{this.state.message}</span>
			</>
		)
	}
}
