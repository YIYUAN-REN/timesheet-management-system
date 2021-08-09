import React, { Component } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Summary extends Component {
    userID= "1";

    state = {
        timeList:[]
    };

    componentDidMount() {
        axios.get(`http://localhost:8082/getAllTimesheets?userID=`+this.userID)
            .then(res => {
                console.log(res.data)
                this.setState({timeList: res.data})
            })
    }


    render() {
        const tableRows = () => {
            return this.state.timeList.map((person) => {
                return (
                    <tr key={person.endDate}>
                        <td>{person.endDate}</td>
                        <td>{person.totalHours}</td>
                        <td>{person.submissionStatus}</td>
                        <td>{person.approveStatus}</td>
                        <td>
                            {' '}
                            <Link to={`/timesheet/${person.endDate}`}>
                                {person.approvedStatus === 'Approved' ? 'Edit' : 'View'}
                            </Link>
                        </td>
                        <td>{person.comment}</td>
                    </tr>
                );
            });
        };

        return (
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
                <tbody>{tableRows()}</tbody>
            </Table>
        )
    }
}

export default Summary;
