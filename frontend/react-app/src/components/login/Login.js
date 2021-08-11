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
			this.props.history.push("/summary");
		}
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
					this.setState({ message: "" });
					this.props.history.push("/summary");
				}
				this.setState({ message: "Fail!" });
			})
	};

	render() {
		return (
			<>
				<h3>Welcome to Timesheet Management</h3>
				<div>
					{this.state.username}
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
