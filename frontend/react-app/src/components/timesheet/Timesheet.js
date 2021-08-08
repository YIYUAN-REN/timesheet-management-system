import React, {Component} from "react";
import "./Timesheet.css";

class Timesheet extends Component {
  render() {
    return (
		<>
			<div>
				<label for="weekEnding">Week Ending</label>
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