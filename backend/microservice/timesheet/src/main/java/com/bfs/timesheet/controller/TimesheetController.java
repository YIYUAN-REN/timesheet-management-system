package com.bfs.timesheet.controller;

import com.bfs.timesheet.domain.Timesheet;
import com.bfs.timesheet.service.TimesheetService;
import org.bouncycastle.util.Times;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/timesheet")
public class TimesheetController {
    @Autowired
    TimesheetService timesheetService;

    // default: userId=0
    @PostMapping("/postInitialTemplate")
    public void postInitialTemplate() {
        timesheetService.postInitialTemplate();
    }

    // userId=1
    @PostMapping("/postTimesheet")
    public void postTimesheet(@RequestParam Integer id) {
        timesheetService.postTimesheet(id);
    }

    @GetMapping("/getTimesheet")
    public Timesheet getTimesheet(@RequestParam Integer userId, @RequestParam String weekEnding) {
        return timesheetService.getTimesheet(userId, weekEnding);
    }

    @GetMapping("/getAllTimesheets/{userId}")
    public ResponseEntity<List<Timesheet>> getAllTimesheets(@PathVariable String userId) {
        return timesheetService.getAllTimesheets(userId);
    }
}
