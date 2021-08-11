import React, { Component } from "react";
import axios from "axios";
import "./Timesheet.css";

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
			approvalStatus: "",
			comment: "",

			weekEndingFormat: ""
		}
	}

	componentDidMount() {
		let userId = 1;
		let weekEnding = "01/09/2021";
		// let userId = localStorage.getItem("userId");
		// let weekEnding = localStorage.getItem("weekEnding");
		axios
			.get("http://localhost:8082/timesheet/getTimesheet?userId=" + userId + "&weekEnding=" + weekEnding)
			.then((response) => {
				const timesheet = response.data;
				this.setState({
					userId: timesheet.userId,
					weekEnding: timesheet.weekEnding,
					days: timesheet.days,
					totalBillingHours: timesheet.totalBillingHours,
					totalCompensatedHours: timesheet.totalCompensatedHours,
					submissionStatus: timesheet.submissionStatus,
					approvalStatus: timesheet.approvalStatus
				});
			});

		let newWeekEndingFormat = this.getWeekEndingFormat(new Date(weekEnding));	// YYYY-MM-DD
		this.setState({
			weekEndingFormat: newWeekEndingFormat
		})

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
			.then((res) => {});
	}

	handleSave = (event) => {
		event.preventDefault();
		const newTimesheet = {
			userId: this.state.userId,
			weekEnding: this.state.weekEnding,
			days: this.state.days,
			totalBillingHour: this.state.totalBillingHour,
			totalCompensatedHour: this.state.totalCompensatedHour,
			submissionStatus: "Incomplete",
			approvalStatus: this.state.approvalStatus,
			comment: this.state.comment
		};

		axios
			.put("http://localhost:8082/timesheet/updateTimesheet", newTimesheet)
			.then((res) => {});
		console.log("Success updated TimeSheet");
	}


	//-------------------------------Toby's file upload start--------------

	onFileChangeHandler = event => {

		console.log(event.target.files[0])

		this.setState({
			selectedFile: event.target.files[0],
			loaded: 0,
		})
	}




	onFileClickHandler = () => {
		const data = new FormData()
		data.append('title', 'timesheet');
		data.append('userid', "0");
		data.append('file', this.state.selectedFile);

		console.log(data);

		axios.post("http://localhost:9090/file/uploadfile", data, {  	 //------------url needs to be changed later
			// receive two    parameter endpoint url ,form data
		})
			.then(res => { // then print response status

				console.log(res);
			})

	}

	//-------------------------------Toby's  fileupload end----------------


	//-------Toby B5 Start

	togglePTO(currentindex, currenttype) {

		console.log('b5 toggled index is ' + currentindex + 'type is ' + currenttype);

		let stateCopy = this.state; //



		if (currenttype == 'floating') {//

			stateCopy.days[currentindex]['isFloating'] = !stateCopy.days[currentindex]['isFloating'];



		}



		this.setState(stateCopy);//

	}

	//-------Toby B5 End

	render() {
		return (
			<>
				<div>
					<label htmlFor="weekEnding">Week Ending</label>
					<input id="weekEnding" type="date" value={this.state.weekEndingFormat} onChange={this.handleWeekEndingChange} />
					<label htmlFor="billingHours">Total Billing Hours</label>
					<textarea id="billingHours" value={this.state.totalBillingHours} rows="1" cols="10" disabled />
					<label htmlFor="compensatedHours">Total Compensated Hours</label>
					<textarea id="compensatedHours" value={this.state.totalCompensatedHours} rows="1" cols="10" disabled />
				</div>
				<button
					type="button"
					onClick={this.handleDefault}
				>
					Set Default
				</button>
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
										<select value={item.startTime} onChange={(e) => this.handleStartTimeChange(index, e)}>
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
										<select value={item.endTime} onChange={(e) => this.handleEndTimeChange(index, e)}>
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

									<td>{item.isFloating ? <span onClick={() => this.togglePTO(index, 'floating')} >[X]</span> : <span onClick={() => this.togglePTO(index, 'floating')}>[_]</span>}</td>
									<td>{item.isHoliday ? <span onClick={this.togglePTO}>[X]</span> : <span onClick={this.togglePTO}>[_]</span>}</td>
									<td>{item.isVacation ? <span onClick={this.togglePTO}>[X]</span> : <span onClick={this.togglePTO}>[_]</span>}</td>

									{/* //-------Toby B5 end		 */}
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div>
					<select>
						<option value="approved">Approved Timesheet</option>
						<option value="unapproved">Unapproved Timesheet</option>
					</select>



					{/* Toby's file upload start */}
					<input type="file" name="file" onChange={this.onFileChangeHandler} /> <button type="button" class="btn btn-success btn-block" onClick={this.onFileClickHandler}>Upload</button>
					{/* Toby's file upload end */}



					<button type="button"
					onClick={this.handleSave}>Save</button>
				</div>
			</>

		)
	}
}

export default Timesheet;
