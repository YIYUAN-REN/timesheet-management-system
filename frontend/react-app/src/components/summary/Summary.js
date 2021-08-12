import React, { Component } from 'react';
import axios from 'axios';
import {OverlayTrigger, Table, Tooltip} from 'react-bootstrap';
import { Link } from 'react-router-dom';


class Summary extends Component {
    // userId= "1";

    state = {
        timeList: [],
        count: 5,
        show: "Show More",
    };

    renderTableData() {
        return this.state.timeList.
            slice(0, this.state.count).map((summary, ) => {
            const {
                id,
                weekEnding,
                totalBillingHours,
                submissionStatus,
                approvalStatus,
                comment,

            } = summary;
            let option = "";
            // let timesheetUrl = "http://localhost:8082/timesheet/getTimesheet?userId=" + this.userId + "&weekEnding=" + weekEnding;
            if(approvalStatus === "Approved"){
                option = (
                    <a href="/viewTimesheet" onClick={this.handleOption(summary)}>
                        View
                    </a>
                );
            }
            else {
                option = (
                    <a href="/timesheet" onClick={this.handleOption(summary)}>
                        Edit
                    </a>
                );
            }
            return (
                <tr key={id}>
                    <td>{weekEnding}</td>
                    <td>{totalBillingHours}</td>
                    <td>{submissionStatus}
                        {['right'].map((placement) => (
                            <OverlayTrigger
                                key={placement}
                                placement={placement}
                                overlay={
                                    <Tooltip id={`tooltip-${placement}`}>
                                        Items due: Proof of Approved TimeSheet
                                    </Tooltip>
                                }
                            >
                                <button
                                    type="button"
                                    hidden = {approvalStatus != "Approved" && submissionStatus != "Not Started"}
                                >
                                    i
                                </button>
                            </OverlayTrigger>
                        ))}
                    </td>
                    <td>{approvalStatus}</td>
                    <td>{option}</td>
                    <td>{comment}</td>
                </tr>
            );
        })

    }

    componentDidMount() {
        // get token from 3001 port
        if (localStorage.getItem("token") == null && this.props.location.search != "") {
            const query = this.props.location.search; // ?userId=...&token=...
            const array = query.split("&");
            const userId = array[0].substr(8);
            const token = array[1].substr(6);
            const weekEnding = array[2].substr(11);
            localStorage.setItem("userId", userId);
            localStorage.setItem("token", token);
            localStorage.setItem("weekEnding", weekEnding);
            localStorage.setItem("weekEnding", "01/09/2021");
            window.location.href = "http://localhost:3000/summary";
        }
        // redirected to 3001
        if (localStorage.getItem("token") == null && this.props.location.search == "") {
            window.location.href = "http://localhost:3001";
        }

        console.log(this.props.location);

        let userId = localStorage.getItem("userID");
        this.userId = 1;
        axios.get(`http://localhost:8082/timesheet/getAllTimesheets/` + this.userId)
            .then(res => {
                console.log(res.data)
                this.setState({ timeList: res.data })
            })
    }

    handleOption = (summary) => (event) => {
        console.log(summary.weekEnding);
        localStorage.setItem("userId", 1);
        localStorage.setItem("weekEnding", summary.weekEnding);
        // axios
        // axios
        //     .get("http://localhost:8082/timesheet/getTimesheet?userId=" + this.userId + "&weekEnding=" + this.weekEnding)
        //     .then((res) => { console.log("redirected to timesheet"); });
    };

    handleShowMore = () => {
        if (this.state.count === 5) {
            this.setState({
                count: this.state.timeList.length,
                show: "Show Less",
            });
        } else {
            this.setState({
                count: 5,
                show: "Show More",
            });
        }
    };


    render() {
        const count = this.count;

        return (
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>WeekEnding</th>
                            <th>TotalHours</th>
                            <th>SubmissionStatus</th>
                            <th>ApprovalStatus</th>
                            <th>Option</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    {/*<tbody>{tableRows()}</tbody>*/}
                    <tbody>{this.renderTableData()}</tbody>
                </Table>
                <button
                    type="button"
                    className="button-time"
                    button-time
                    onClick={this.handleShowMore}
                >
                    {this.state.show}
                </button>
            </div>

        )
    }
}

export default Summary;
