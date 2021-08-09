package com.bfs.timesheet.controller;

import com.bfs.timesheet.domain.Timesheet;
import com.bfs.timesheet.service.TimesheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class TimesheetController {
    @Autowired
    private TimesheetService timesheetService;

    @GetMapping("/getAllTimesheets/{userID}")
    public ResponseEntity<List<Timesheet>> getAllTimesheets(@PathVariable String userID) {
        return timesheetService.getAllTimesheets(userID);
    }
}
