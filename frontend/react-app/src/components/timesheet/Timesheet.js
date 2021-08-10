import React, {Component} from "react";
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
          approvalStatus: timesheet.approvalStatus,
					comment: timesheet.comment
        });
      });

		let newWeekEndingFormat  = this.getWeekEndingFormat(new Date(weekEnding));	// YYYY-MM-DD
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
		dateTime=dateTime.setDate(dateTime.getDate() + 1);
 		dateTime=new Date(dateTime);	

		let newWeekEnding = this.getWeekEnding(dateTime);
		let newWeekEndingFormat  = this.getWeekEndingFormat(dateTime);
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

	handleStartTimeChange = (index, e) => {
    // start time
  };

	handleEndTimeChange = (index, e) => {
    // end time
  };

  render() {
    return (
		<>
			<div>
				<label htmlFor="weekEnding">Week Ending</label>
				<input id="weekEnding" type="date" value={this.state.weekEndingFormat} onChange={this.handleWeekEndingChange} />
				<label htmlFor="billingHours">Total Billing Hours</label>
				<textarea id="billingHours" rows="1" cols="10" disabled></textarea>
				<label htmlFor="compensatedHours">Total Compensated Hours</label>
				<textarea id="compensatedHours" rows="1" cols="10" disabled></textarea>
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
								<th>{item.day}</th>
								<th>{item.date}</th>
								
								<th>
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
                </th>

								<th>
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
                </th>

	              <th>{item.totalHours}</th>
                <th>{item.isFloating ? "[X]" : "[_]"}</th>
                <th>{item.isHoliday ? "[X]" : "[_]"}</th>
                <th>{item.isVacation ? "[X]" : "[_]"}</th>
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
			<input type="file" />
			<button type="button">Save</button>
			</div>
		</>

    )
  }
}

export default Timesheet;