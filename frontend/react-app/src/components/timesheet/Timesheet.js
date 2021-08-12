import React, { Component, useState } from "react";
import axios from "axios";
import "./Timesheet.css";
import { Holidays } from './Holidays'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
class Timesheet extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: 0,
			weekEnding: "",

			days: [],

			totalBillingHours: 0,
			totalCompensatedHours: 0,
			submissionStatus: "",
			approvalStatus: "Not Started",
			comment: "",
			weekEndingFormat: "",
			weekEndingChecks: [],

			floatingsTaken: [],
			vacationsTaken: [],

			fileUploaded: false,


		}



	}
	//---------holidays


	componentDidMount() {
		// redirected to 3001
		if (localStorage.getItem("token") == null && this.props.location.search == "") {
			window.location.href = "http://localhost:3001";
		}

		let userId = localStorage.getItem("userId");
		let weekEnding = localStorage.getItem("weekEnding");
		// let weekEnding = "01/09/2021";
		// let userId = localStorage.getItem("userId");
		// let weekEnding = localStorage.getItem("weekEnding");
		axios
			.get("http://localhost:8082/timesheet/getTimesheet?userId=" + userId + "&weekEnding=" + weekEnding)
			.then((response) => {
				const timesheet = response.data;

				//toby holiday logic start
				let tempDays = timesheet.days;


				for (let i = 0; i < tempDays.length; i++) {

					let curDate = tempDays[i]['date'];

					for (let j = 0; j < Holidays.length; j++) {

						if (curDate.includes(Holidays[j])) {
							tempDays[i]['isHoliday'] = true;
						}

					}


				}


				//toby holiday logic end
				this.setState({
					userId: timesheet.userId,
					weekEnding: timesheet.weekEnding,
					days: timesheet.days,   //<<<<<<<<<
					totalBillingHours: timesheet.totalBillingHours,
					totalCompensatedHours: timesheet.totalCompensatedHours,
					submissionStatus: timesheet.submissionStatus,
					approvalStatus: timesheet.approvalStatus
				});


			});

		let newWeekEndingFormat = this.getWeekEndingFormat(new Date(weekEnding));	// YYYY-MM-DD
		let newWeekEndingChecks = this.getWeekEndingChecks();
		this.setState({
			weekEndingFormat: newWeekEndingFormat,
			weekEndingChecks: newWeekEndingChecks
		})

		//-------------Toby's B5 initialization -------------------------

		axios
			.get("http://localhost:8082/timesheet/getpto?userId=" + userId)
			.then((response) => {

				console.log(response);

				this.setState({ floatingsTaken: response.data.floatings });
				this.setState({ vacationsTaken: response.data.vacations });
			});

		//-------------Toby's B5 initialization END-------------------------

	}

	// check disabled weekEnding
	getWeekEndingChecks() {
		// get today's week number		
		let nowDate = new Date();
		let firstDay = new Date();
		firstDay.setMonth(0);// JAN
		firstDay.setDate(3);// 3
		let diffDays = Math.ceil((nowDate - firstDay) / (24 * 60 * 60 * 1000)) + 1;
		let week = Math.ceil(diffDays / 7);
		let weekNumber = week === 0 ? 1 : week;

		// update weekEndingChecks
		let newWeekEndingChecks = [];
		for (let i = 0; i < 51; i++) {
			newWeekEndingChecks.push(i <= weekNumber - 1 ? true : false);
		}

		console.log(nowDate);
		console.log(week);

		return newWeekEndingChecks;
	}

	// MM/DD/YYYY
	getWeekEnding(date) {
		let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		let year = date.getFullYear();
		return month + "/" + day + "/" + year;
	}

	// YYYY-MM-DD
	getWeekEndingFormat(date) {
		let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		let year = date.getFullYear();
		return year + "-" + month + "-" + day;
	}

	handleWeekEndingChange = (e) => {
		// change weekEnding
		let dateTime = new Date(e.target.value);
		dateTime = dateTime.setDate(dateTime.getDate() + 1);
		dateTime = new Date(dateTime);

		let newWeekEnding = this.getWeekEnding(dateTime);
		let newWeekEndingFormat = this.getWeekEndingFormat(dateTime);
		this.setState({
			weekEnding: newWeekEnding,
			weekEndingFormat: newWeekEndingFormat
		});
		localStorage.setItem("weekEnding", newWeekEnding);

		// get new timesheet
		let userId = 1;
		// let userId = localStorage.getItem("userId");
		axios
			.get("http://localhost:8082/timesheet/getTimesheet?userId=" + userId + "&weekEnding=" + newWeekEnding)
			.then((response) => {
				const timesheet = response.data;
				this.setState({
					userId: timesheet.userId,
					weekEnding: timesheet.weekEnding,
					days: timesheet.days,
					totalBillingHours: timesheet.totalBillingHours,
					totalCompensatedHours: timesheet.totalCompensatedHours,
					submissionStatus: timesheet.submissionStatus,
					approvalStatus: timesheet.approvalStatus,
					comment: timesheet.comment
				});
			});
	}

	// e.g) 9:00 AM => 9, 6:00 PM => 18
	getNumberTime(time) {
		if (time == "N/A") {
			return 0;
		}

		let [slice, suffix] = time.split(" ");
		let [hour, minute] = slice.split(":");
		hour = parseFloat(hour);
		minute = parseFloat(minute) / 60;
		let addition = suffix == "PM" && hour != 12 ? 12 : 0;
		return hour + minute + addition;
	}

	getTotalBillingHours(days) {
		let hours = 0;
		for (let i = 0; i < days.length; i++) {
			if (days[i].isFloating || days[i].isHoliday || days[i].isVacation) {
				continue;
			}
			if (days[i].endTime == "N/A" || days[i].startTime == "N/A" || this.getNumberTime(days[i].endTime) - this.getNumberTime(days[i].startTime) < 0) {
				continue;
			}
			hours += this.getNumberTime(days[i].endTime) - this.getNumberTime(days[i].startTime);
		}
		return hours;
	}

	getTotalCompensatedHours(days) {
		let hours = 0;
		for (let i = 0; i < days.length; i++) {
			if (days[i].isFloating || days[i].isHoliday || days[i].isVacation) {

				hours += days[i].isFloating * 8 + days[i].isHoliday * 8 + days[i].isVacation * 8;
				continue;
			}

			if (days[i].endTime == "N/A" || days[i].startTime == "N/A" || this.getNumberTime(days[i].endTime) - this.getNumberTime(days[i].startTime) < 0) {
				continue;
			}
			hours += this.getNumberTime(days[i].endTime) - this.getNumberTime(days[i].startTime);
		}
		return hours;
	}

	handleStartTimeChange = (index, e) => {
		// change startTime
		let newDays = this.state.days;
		newDays[index].startTime = e.target.value;
		this.setState({
			days: newDays
		});

		// change hours
		let newTotalBillingHours = this.getTotalBillingHours(newDays);
		let newTotalCompensatedHours = this.getTotalCompensatedHours(newDays);
		this.setState({
			totalBillingHours: newTotalBillingHours,
			totalCompensatedHours: newTotalCompensatedHours
		});
	};

	handleEndTimeChange = (index, e) => {
		// change endTime
		let newDays = this.state.days;
		newDays[index].endTime = e.target.value;
		this.setState({
			days: newDays
		});

		//	console.log(this.state.days);

		// change hours
		let newTotalBillingHours = this.getTotalBillingHours(newDays);
		let newTotalCompensatedHours = this.getTotalCompensatedHours(newDays);
		this.setState({
			totalBillingHours: newTotalBillingHours,
			totalCompensatedHours: newTotalCompensatedHours
		});
	};

	handleDefault = (event) => {
		event.preventDefault();

		const newTemplate = {
			userId: this.state.userId,
			days: this.state.days,
		};

		axios
			.put("http://localhost:8082/timesheet/updateDefault", newTemplate)
			.then((res) => { console.log("Success updated Template"); });
	}

	handleSave = (event) => {
		event.preventDefault();

		const body = {

			userId: this.state.userId,
			floatings: this.state.floatingsTaken,
			vacations: this.state.vacationsTaken

		}

		const file = new FormData()
		file.append('title', 'timesheet');
		file.append('userId', 1);
		file.append('file', this.state.selectedFile);
		this.state.fileUploaded = true;
		console.log(file);
		console.log("file upload: " + this.state.fileUploaded);

		axios.post("http://localhost:9090/file/uploadfile", file, {  	 //------------url needs to be changed later
			// receive two    parameter endpoint url ,form data
		})
			.then(res => { // then print response status


				console.log(res);
			})

		var status = document.getElementById("timesheet-select")
		if (status.value == "approved" && this.state.fileUploaded == true) this.state.submissionStatus = "Complete";
		else this.state.submissionStatus = "Incomplete"
		console.log(status.value);
		console.log(this.state.fileUploaded);
		// this.state.approvalStatus = "Approved";
		console.log(this.state.submissionStatus);
		const newTimesheet = {
			userId: this.state.userId,
			weekEnding: this.state.weekEnding,
			days: this.state.days,
			totalBillingHours: this.state.totalBillingHours,
			totalCompensatedHours: this.state.totalCompensatedHours,
			submissionStatus: this.state.submissionStatus,
			approvalStatus: this.state.approvalStatus,
			comment: this.state.comment
		};
		// const newPTO = {
		// 	userId: this.state.userId,
		// 	floatings: this.state.floatingsTaken,
		// 	vacations: this.state.vacationsTaken
		// }


		axios({
			method: "post",
			url: "http://localhost:8082/timesheet/savepto",
			data: body,//JSON.stringify(stateCopy),
			headers: { "Content-Type": "application/json" },
		})
			.then(function (response) {

				console.log(response);
			})
			.catch(function (response) {
				//handle error
				console.log(response);
			});

		axios
			.put("http://localhost:8082/timesheet/updateTimesheet", newTimesheet)
			.then((res) => { console.log("Success updated TimeSheet"); });
		// axios
		// 	.post("http://localhost:8082/timesheet/savepto", newPTO)
		// 	.then((res) => {});



	}


	//-------------------------------Toby's file upload start--------------

	onFileChangeHandler = event => {

		console.log(event.target.files[0])

		this.setState({
			selectedFile: event.target.files[0],
			loaded: 0,
		})

	}



	// onFileClickHandler = () => {
	// 	const data = new FormData()
	// 	data.append('title', 'timesheet');
	// 	data.append('userId', 1);
	// 	data.append('file', this.state.selectedFile);
	// 	this.state.fileUploaded = true;
	// 	console.log(data);
	//
	// 	axios.post("http://localhost:9090/file/uploadfile", data, {  	 //------------url needs to be changed later
	// 		// receive two    parameter endpoint url ,form data
	// 	})
	// 		.then(res => { // then print response status
	//
	//
	// 			console.log(res);
	// 		})
	//
	// }

	//-------------------------------Toby's  fileupload end----------------


	//-------Toby B5 Start

	togglePTO(currentindex, currenttype) {

		console.log('b5 toggled index is ' + currentindex + 'type is ' + currenttype);

		let stateCopy = this.state; //



		// if(this.state.floatingsTaken.length >= 3 && currenttype == 'floating'){
		// 	alert(" You have taken all of your 3 floating days " );
		// }

		if (currenttype == 'floating' && this.state.floatingsTaken.length < 3 && !stateCopy.days[currentindex]['isHoliday']) {//
			stateCopy.days[currentindex]['isFloating'] = !stateCopy.days[currentindex]['isFloating'];
			stateCopy.days[currentindex]['isHoliday'] = false;
			stateCopy.days[currentindex]['isVacation'] = false;



			// floatings logic

			if (stateCopy.days[currentindex]['isFloating'] == true) {

				let vactionsarr = this.state.vacationsTaken;
				var index = vactionsarr.indexOf(stateCopy.days[currentindex]['date']);

				if (index > -1) {
					vactionsarr.splice(index, 1);
				}
				this.setState({ ...this.state, vacationsTaken: vactionsarr })

				let floatingsarr = this.state.floatingsTaken;
				floatingsarr.push(stateCopy.days[currentindex]['date']);
				this.setState({ ...this.state, floatingsTaken: floatingsarr })


				// setting days
				let tempDays = this.state.days;
				tempDays[currentindex]['isFloating'] = true;
				tempDays[currentindex]['startTime'] = 'N/A';//
				tempDays[currentindex]['endTime'] = 'N/A';




				stateCopy.totalBillingHours = this.getTotalBillingHours(tempDays);
				stateCopy.totalCompensatedHours = this.getTotalCompensatedHours(tempDays);

				this.setState({ days: tempDays });
				//this.handleEndTimeChangeToby(currentindex,tempDays );

				console.log(this.state.totalBillingHours)
				//	this.handleStartTimeChangeToby(currentindex , tempDays).then(data=>{console.log(data)});
				console.log(this.state.days)

			}

			if (stateCopy.days[currentindex]['isFloating'] == false) {

				let floatingsarr = this.state.floatingsTaken;
				var index = floatingsarr.indexOf(stateCopy.days[currentindex]['date']);

				if (index > -1) {
					floatingsarr.splice(index, 1);
				}
				this.setState({ ...this.state, floatingsTaken: floatingsarr })

				//setting days
				// setting days
				let tempDays = this.state.days;
				tempDays[currentindex]['isFloating'] = false;
				stateCopy.totalBillingHours = this.getTotalBillingHours(tempDays);
				stateCopy.totalCompensatedHours = this.getTotalCompensatedHours(tempDays);
				this.setState({ days: tempDays });

			}
			// work hours logic
		}
		else if (stateCopy.days[currentindex]['isFloating'] && currenttype == "floating") {

			stateCopy.days[currentindex]['isFloating'] = false;
			let floatingsarr = this.state.floatingsTaken;

			var index = floatingsarr.indexOf(stateCopy.days[currentindex]['date']);

			if (index > -1) {
				floatingsarr.splice(index, 1);
			}

			this.setState({ ...this.state, floatingsTaken: floatingsarr })


			// setting days
			let tempDays = this.state.days;
			tempDays[currentindex]['isFloating'] = false;
			stateCopy.totalBillingHours = this.getTotalBillingHours(tempDays);
			stateCopy.totalCompensatedHours = this.getTotalCompensatedHours(tempDays);
			this.setState({ days: tempDays });



		}
		else if (this.state.floatingsTaken.length >= 3 && currenttype == "floating") {
			alert(" You have taken all of your 3 floating days ");
		}


		if (currenttype == 'holiday') {//
			stateCopy.days[currentindex]['isFloating'] = false;
			stateCopy.days[currentindex]['isHoliday'] = !stateCopy.days[currentindex]['isHoliday'];
			stateCopy.days[currentindex]['isVacation'] = false;
		}

		// if(this.state.vacationsTaken.length >= 3 && currenttype == 'vacation'){
		// 	alert(" You have taken all of your 3 floating days " );
		// }


		if (currenttype == 'vacation' && this.state.vacationsTaken.length < 3 && !stateCopy.days[currentindex]['isHoliday']) {//



			stateCopy.days[currentindex]['isFloating'] = false;
			stateCopy.days[currentindex]['isHoliday'] = false;
			stateCopy.days[currentindex]['isVacation'] = !stateCopy.days[currentindex]['isVacation'];

			//vacations logic
			if (stateCopy.days[currentindex]['isVacation'] == true) {

				let floatingsarr = this.state.floatingsTaken;
				var index = floatingsarr.indexOf(stateCopy.days[currentindex]['date']);

				if (index > -1) {
					floatingsarr.splice(index, 1);
				}

				let vactionsarr = this.state.vacationsTaken;
				vactionsarr.push(stateCopy.days[currentindex]['date']);
				this.setState({ ...this.state, vacationsTaken: vactionsarr })
				this.setState({ ...this.state, floatingsTaken: floatingsarr })

				// setting days
				let tempDays = this.state.days;
				tempDays[currentindex]['isVacation'] = true;
				tempDays[currentindex]['startTime'] = 'N/A';//
				tempDays[currentindex]['endTime'] = 'N/A';
				stateCopy.totalBillingHours = this.getTotalBillingHours(tempDays);
				stateCopy.totalCompensatedHours = this.getTotalCompensatedHours(tempDays);
				this.setState({ days: tempDays });

			}

			if (stateCopy.days[currentindex]['isVacation'] == false) {

				let vactionsarr = this.state.vacationsTaken;
				var index = vactionsarr.indexOf(stateCopy.days[currentindex]['date']);

				if (index > -1) {
					vactionsarr.splice(index, 1);
				}
				this.setState({ ...this.state, vacationsTaken: vactionsarr })

				// setting days
				let tempDays = this.state.days;
				tempDays[currentindex]['isVacation'] = false;
				stateCopy.totalBillingHours = this.getTotalBillingHours(tempDays);
				stateCopy.totalCompensatedHours = this.getTotalCompensatedHours(tempDays);
				this.setState({ days: tempDays });

			}
		}
		else if (stateCopy.days[currentindex]['isVacation'] && currenttype == "vacation") {

			stateCopy.days[currentindex]['isVacation'] = false;
			let vactionsarr = this.state.vacationsTaken;

			var index = vactionsarr.indexOf(stateCopy.days[currentindex]['date']);

			if (index > -1) {
				vactionsarr.splice(index, 1);
			}

			this.setState({ ...this.state, vacationsTaken: vactionsarr })

			// setting days
			let tempDays = this.state.days;
			tempDays[currentindex]['isVacation'] = false;
			stateCopy.totalBillingHours = this.getTotalBillingHours(tempDays);
			stateCopy.totalCompensatedHours = this.getTotalCompensatedHours(tempDays);
			this.setState({ days: tempDays });

		}
		else if (this.state.vacationsTaken.length >= 3 && currenttype == "vacation") {
			alert(" You have taken all of your 3 Vacation days ");
		}

		this.setState(stateCopy);//

	}



	// savePTO(){
	//
	// 	  var body = {
	//
	// 			userId: this.state.userId,
	// 			floatings: this.state.floatingsTaken,
	// 			vacations: this.state.vacationsTaken
	//
	// 		}
	//
	// 	  axios({
	// 		method: "post",
	// 		url: "http://localhost:8082/timesheet/savepto",
	// 		data: body ,//JSON.stringify(stateCopy),
	// 		headers: { "Content-Type": "application/json" },
	// 	  })
	// 		.then(function (response) {
	//
	//
	// 		  console.log(response);
	// 		})
	// 		.catch(function (response) {
	// 		  //handle error
	// 		  console.log(response);
	// 		});
	//
	// }


	//-------Toby B5 -------------------------End

	render() {

		return (
			<>
				<div>
					<label htmlFor="weekEnding">Week Ending</label>
					{/* <input id="weekEnding" type="date" value={this.state.weekEndingFormat} onChange={this.handleWeekEndingChange} /> */}
					<select value={this.state.weekEndingFormat} onChange={this.handleWeekEndingChange}>
						<option value="2021-01-09" disabled={!this.state.weekEndingChecks[0]}>2021-01-09</option>
						<option value="2021-01-16" disabled={!this.state.weekEndingChecks[1]}>2021-01-16</option>
						<option value="2021-01-23" disabled={!this.state.weekEndingChecks[2]}>2021-01-23</option>
						<option value="2021-01-30" disabled={!this.state.weekEndingChecks[3]}>2021-01-30</option>
						<option value="2021-02-06" disabled={!this.state.weekEndingChecks[4]}>2021-02-06</option>
						<option value="2021-02-13" disabled={!this.state.weekEndingChecks[5]}>2021-02-13</option>
						<option value="2021-02-20" disabled={!this.state.weekEndingChecks[6]}>2021-02-20</option>
						<option value="2021-02-27" disabled={!this.state.weekEndingChecks[7]}>2021-02-27</option>
						<option value="2021-03-06" disabled={!this.state.weekEndingChecks[8]}>2021-03-06</option>
						<option value="2021-03-13" disabled={!this.state.weekEndingChecks[9]}>2021-03-13</option>
						<option value="2021-03-20" disabled={!this.state.weekEndingChecks[10]}>2021-03-20</option>
						<option value="2021-03-27" disabled={!this.state.weekEndingChecks[11]}>2021-03-27</option>
						<option value="2021-04-03" disabled={!this.state.weekEndingChecks[12]}>2021-04-03</option>
						<option value="2021-04-10" disabled={!this.state.weekEndingChecks[13]}>2021-04-10</option>
						<option value="2021-04-17" disabled={!this.state.weekEndingChecks[14]}>2021-04-17</option>
						<option value="2021-04-24" disabled={!this.state.weekEndingChecks[15]}>2021-04-24</option>
						<option value="2021-05-01" disabled={!this.state.weekEndingChecks[16]}>2021-05-01</option>
						<option value="2021-05-08" disabled={!this.state.weekEndingChecks[17]}>2021-05-08</option>
						<option value="2021-05-15" disabled={!this.state.weekEndingChecks[18]}>2021-05-15</option>
						<option value="2021-05-22" disabled={!this.state.weekEndingChecks[19]}>2021-05-22</option>
						<option value="2021-05-29" disabled={!this.state.weekEndingChecks[20]}>2021-05-29</option>
						<option value="2021-06-05" disabled={!this.state.weekEndingChecks[21]}>2021-06-05</option>
						<option value="2021-06-12" disabled={!this.state.weekEndingChecks[22]}>2021-06-12</option>
						<option value="2021-06-19" disabled={!this.state.weekEndingChecks[23]}>2021-06-19</option>
						<option value="2021-06-26" disabled={!this.state.weekEndingChecks[24]}>2021-06-26</option>
						<option value="2021-07-03" disabled={!this.state.weekEndingChecks[25]}>2021-07-03</option>
						<option value="2021-07-10" disabled={!this.state.weekEndingChecks[26]}>2021-07-10</option>
						<option value="2021-07-17" disabled={!this.state.weekEndingChecks[27]}>2021-07-17</option>
						<option value="2021-07-24" disabled={!this.state.weekEndingChecks[28]}>2021-07-24</option>
						<option value="2021-07-31" disabled={!this.state.weekEndingChecks[29]}>2021-07-31</option>
						<option value="2021-08-07" disabled={!this.state.weekEndingChecks[30]}>2021-08-07</option>
						<option value="2021-08-14" disabled={!this.state.weekEndingChecks[31]}>2021-08-14</option>
						<option value="2021-08-21" disabled={!this.state.weekEndingChecks[32]}>2021-08-21</option>
						<option value="2021-08-28" disabled={!this.state.weekEndingChecks[33]}>2021-08-28</option>
						<option value="2021-09-04" disabled={!this.state.weekEndingChecks[34]}>2021-09-04</option>
						<option value="2021-09-11" disabled={!this.state.weekEndingChecks[35]}>2021-09-11</option>
						<option value="2021-09-18" disabled={!this.state.weekEndingChecks[36]}>2021-09-18</option>
						<option value="2021-09-25" disabled={!this.state.weekEndingChecks[37]}>2021-09-25</option>
						<option value="2021-10-02" disabled={!this.state.weekEndingChecks[38]}>2021-10-02</option>
						<option value="2021-10-09" disabled={!this.state.weekEndingChecks[39]}>2021-10-09</option>
						<option value="2021-10-16" disabled={!this.state.weekEndingChecks[40]}>2021-10-16</option>
						<option value="2021-10-23" disabled={!this.state.weekEndingChecks[41]}>2021-10-23</option>
						<option value="2021-10-30" disabled={!this.state.weekEndingChecks[42]}>2021-10-30</option>
						<option value="2021-11-06" disabled={!this.state.weekEndingChecks[43]}>2021-11-06</option>
						<option value="2021-11-13" disabled={!this.state.weekEndingChecks[44]}>2021-11-13</option>
						<option value="2021-11-20" disabled={!this.state.weekEndingChecks[45]}>2021-11-20</option>
						<option value="2021-11-27" disabled={!this.state.weekEndingChecks[46]}>2021-11-27</option>
						<option value="2021-12-04" disabled={!this.state.weekEndingChecks[47]}>2021-12-04</option>
						<option value="2021-12-11" disabled={!this.state.weekEndingChecks[48]}>2021-12-11</option>
						<option value="2021-12-18" disabled={!this.state.weekEndingChecks[49]}>2021-12-18</option>
						<option value="2021-12-25" disabled={!this.state.weekEndingChecks[50]}>2021-12-25</option>
					</select>

					<label htmlFor="billingHours">Total Billing Hours</label>
					<textarea id="billingHours" value={this.state.totalBillingHours} rows="1" cols="10" disabled />
					<label htmlFor="compensatedHours">Total Compensated Hours</label>
					<textarea id="compensatedHours" value={this.state.totalCompensatedHours} rows="1" cols="10" disabled />
					<button
						type="button"
						onClick={this.handleDefault}
					>
						Set Default
					</button>
					{['right'].map((placement) => (
						<OverlayTrigger
							key={placement}
							placement={placement}
							overlay={
								<Tooltip id={`tooltip-${placement}`}>
									Save daily hours as default;
									future weekly timesheet will show same hours.
								</Tooltip>
							}
						>
							<img src="https://img.icons8.com/color/25/000000/info--v1.png"/>
						</OverlayTrigger>
					))}

				</div>

				<div>
					<table>
						<thead>
							<tr>
								<th>Day</th>
								<th>Date</th>
								<th>Starting Time</th>
								<th>Ending Time</th>
								<th>Total Hours</th>
								<th>Floating Day</th>
								<th>Holiday</th>
								<th>Vacation</th>
							</tr>
						</thead>

						<tbody>
							{this.state.days.map((item, index) => (
								<tr key={index}>
									<td>{item.day}</td>
									<td>{item.date}</td>

									<td>
										<select value={item.startTime} disabled={item.isFloating || item.isHoliday || item.isVacation ? `disabled` : ''} onChange={(e) => this.handleStartTimeChange(index, e)}>
											<option value="N/A">N/A</option>
											<option value="0:00 AM">0:00 AM</option>
											<option value="1:00 AM">1:00 AM</option>
											<option value="2:00 AM">2:00 AM</option>
											<option value="3:00 AM">3:00 AM</option>
											<option value="4:00 AM">4:00 AM</option>
											<option value="5:00 AM">5:00 AM</option>
											<option value="6:00 AM">6:00 AM</option>
											<option value="7:00 AM">7:00 AM</option>
											<option value="8:00 AM">8:00 AM</option>
											<option value="9:00 AM">9:00 AM</option>
											<option value="10:00 AM">10:00 AM</option>
											<option value="11:00 AM">11:00 AM</option>
											<option value="12:00 PM">12:00 PM</option>
											<option value="1:00 PM">1:00 PM</option>
											<option value="2:00 PM">2:00 PM</option>
											<option value="3:00 PM">3:00 PM</option>
											<option value="4:00 PM">4:00 PM</option>
											<option value="5:00 PM">5:00 PM</option>
											<option value="6:00 PM">6:00 PM</option>
											<option value="7:00 PM">7:00 PM</option>
											<option value="8:00 PM">8:00 PM</option>
											<option value="9:00 PM">9:00 PM</option>
											<option value="10:00 PM">10:00 PM</option>
											<option value="11:00 PM">11:00 PM</option>
										</select>
									</td>

									<td>
										<select value={item.endTime} disabled={item.isFloating || item.isHoliday || item.isVacation ? `disabled` : ''} onChange={(e) => this.handleEndTimeChange(index, e)}>
											<option value="N/A">N/A</option>
											<option value="0:00 AM">0:00 AM</option>
											<option value="1:00 AM">1:00 AM</option>
											<option value="2:00 AM">2:00 AM</option>
											<option value="3:00 AM">3:00 AM</option>
											<option value="4:00 AM">4:00 AM</option>
											<option value="5:00 AM">5:00 AM</option>
											<option value="6:00 AM">6:00 AM</option>
											<option value="7:00 AM">7:00 AM</option>
											<option value="8:00 AM">8:00 AM</option>
											<option value="9:00 AM">9:00 AM</option>
											<option value="10:00 AM">10:00 AM</option>
											<option value="11:00 AM">11:00 AM</option>
											<option value="12:00 PM">12:00 PM</option>
											<option value="1:00 PM">1:00 PM</option>
											<option value="2:00 PM">2:00 PM</option>
											<option value="3:00 PM">3:00 PM</option>
											<option value="4:00 PM">4:00 PM</option>
											<option value="5:00 PM">5:00 PM</option>
											<option value="6:00 PM">6:00 PM</option>
											<option value="7:00 PM">7:00 PM</option>
											<option value="8:00 PM">8:00 PM</option>
											<option value="9:00 PM">9:00 PM</option>
											<option value="10:00 PM">10:00 PM</option>
											<option value="11:00 PM">11:00 PM</option>
										</select>
									</td>

									<td>{
										item.endTime == "N/A" || item.startTime == "N/A" || this.getNumberTime(item.endTime) - this.getNumberTime(item.startTime) < 0 ?
											0 : this.getNumberTime(item.endTime) - this.getNumberTime(item.startTime)
									}</td>
									{/* //-------Toby B5 Start */}
									{/* 
									<td>{item.isFloating ? <span onClick={ ()=> this.togglePTO(index, 'floating') } >[X]</span>  : <span onClick={()=> this.togglePTO(index, 'floating')}>[_]</span>}</td>
									<td>{item.isHoliday ?  <span onClick={()=> this.togglePTO(index, 'holiday') }>[X]</span>  : <span onClick={()=> this.togglePTO(index, 'holiday')}>[_]</span>}</td>
									<td>{item.isVacation ?  <span onClick={()=> this.togglePTO(index, 'vacation')}>[X]</span>  : <span onClick={()=> this.togglePTO(index, 'vacation')}>[_]</span>}</td> */}


									<td>{item.isFloating ? <span onClick={() => this.togglePTO(index, 'floating')} >[X]</span> : <span onClick={() => this.togglePTO(index, 'floating')}>[_]</span>}</td>
									<td>{item.isHoliday ? '[X]' : '[_]'}</td>
									<td>{item.isVacation ? <span onClick={() => this.togglePTO(index, 'vacation')}>[X]</span> : <span onClick={() => this.togglePTO(index, 'vacation')}>[_]</span>}</td>

									{/* //-------Toby B5 end		 */}
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div>
					<select id="timesheet-select">
						<option value="">--Please choose an option--</option>
						<option value="approved">Approved Timesheet</option>
						<option value="unapproved">Unapproved Timesheet</option>
					</select>



					{/* Toby's file upload start */}
					{/*<input type="file" name="file" onChange={this.onFileChangeHandler} /> <button type="button" class="btn btn-success btn-block" onClick={this.onFileClickHandler}>Upload</button>*/}
					{/* Toby's file upload end */}


					{/*<button type="button" onClick={ ()=>this.savePTO() }> Save PTO</button>	*/}

					<input type="file" name="file" onChange={this.onFileChangeHandler} /><button type="button" onClick={this.handleSave}>Save</button>
					{/*<button type="button" onClick={this.handleSave}>Save</button>*/}
				</div>
			</>

		)
	}
}

export default Timesheet;




