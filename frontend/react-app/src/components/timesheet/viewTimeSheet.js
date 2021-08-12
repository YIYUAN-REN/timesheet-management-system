import React, { Component } from "react";
import axios from "axios";
import "./Timesheet.css";
import { Holidays } from './Holidays'

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
            approvalStatus: "Incomplete",
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
        // let userId = 1;
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
        let diffDays = Math.ceil((nowDate - firstDay) / (24 * 60 * 60 * 1000));
        let week = Math.ceil(diffDays / 7);
        let weekNumber = week === 0 ? 1 : week;

        // update weekEndingChecks
        let newWeekEndingChecks = [];
        for (let i = 0; i < 51; i++) {
            newWeekEndingChecks.push(i <= weekNumber - 1 ? true : false);
        }

        console.log(nowDate);

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




    render() {
        return (
            <>
                <div>
                    <label htmlFor="weekEnding">Week Ending</label>
                    {/* <input id="weekEnding" type="date" value={this.state.weekEndingFormat} onChange={this.handleWeekEndingChange} /> */}
                    <label htmlFor="billingHours">Total Billing Hours</label>
                    <textarea id="billingHours" value={this.state.totalBillingHours} rows="1" cols="10" disabled />
                    <label htmlFor="compensatedHours">Total Compensated Hours</label>
                    <textarea id="compensatedHours" value={this.state.totalCompensatedHours} rows="1" cols="10" disabled />
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

                        {this.state.days.map((item, index) => (
                            <tr key={index}>
                                <td>{item.day}</td>
                                <td>{item.date}</td>
                                <td>{item.startTime}</td>
                                <td>{item.endTime}</td>
                                <td>{
                                    item.endTime == "N/A" || item.startTime == "N/A" || this.getNumberTime(item.endTime) - this.getNumberTime(item.startTime) < 0 ?
                                        0 : this.getNumberTime(item.endTime) - this.getNumberTime(item.startTime)
                                }</td>
                                <td>{item.isFloating ? '[X]' : '[_]'}</td>
                                <td>{item.isHoliday ? '[X]' : '[_]'}</td>
                                <td>{item.isVacation ? '[X]' : '[_]'}</td>
                            </tr>
                        ))}
                    </table>
                </div>
            </>

        )
    }
}

export default Timesheet;
