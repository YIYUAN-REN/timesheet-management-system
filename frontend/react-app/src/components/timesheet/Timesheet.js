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
			comment: ""
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
	}

	handleWeekEndingChange = (e) => {
		
	}

  render() {
    return (
		<>
			<div>
				<label for="weekEnding" onChange={this.handleWeekEndingChange}>Week Ending</label>
				<input id="weekEnding" type="date" min="2021-01-01" max="2021-12-31" />
				<label for="billingHours">Total Billing Hours</label>
				<input id="billingHours" type="text" />
				<label for="compensatedHours">Total Compensated Hours</label>
				<input id="compensatedHours" type="text" />
			</div>

			<div>
				<table>
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
					<tr>
						<td>1</td>
						<td>1</td>
						<td>1</td>
						<td>1</td>
						<td>1</td>
						<td>1</td>
						<td>1</td>
						<td>1</td>
					</tr>
					<tr>
						<td>2</td>
						<td>2</td>
						<td>2</td>
						<td>2</td>
						<td>2</td>
						<td>2</td>
						<td>2</td>
						<td>2</td>
					</tr>
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