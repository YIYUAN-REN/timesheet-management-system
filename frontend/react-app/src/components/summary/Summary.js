import React, { Component } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Summary extends Component {
    userId= "1";

    state = {
        timeList:[],
        count: 5,
        show: "Show More",
    };

    renderTableData(){
        return this.state.timeList.
            slice(0, this.state.count).map((person, ) => {
            return (
                <tr key={person.endDate}>
                    <td>{person.weekEnding}</td>
                    <td>{person.totalBillingHours}</td>
                    <td>{person.submissionStatus}</td>
                    <td>{person.approvalStatus}</td>
                    <td>
                        {' '}
                        <Link to={`/timesheet}`}>
                            {person.approvalStatus === 'Approved' ? 'Edit' : 'View'}
                        </Link>
                    </td>
                    <td>{person.comment}</td>
                </tr>
            );
        })

    }

    componentDidMount() {
        axios.get(`http://localhost:8082/timesheet/getAllTimesheets/`+this.userId)
            .then(res => {
                console.log(res.data)
                this.setState({timeList: res.data})
            })
    }

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
