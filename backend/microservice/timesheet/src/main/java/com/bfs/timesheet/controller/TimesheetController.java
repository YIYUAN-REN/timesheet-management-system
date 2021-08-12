package com.bfs.timesheet.controller;

import com.bfs.timesheet.domain.Template;
import com.bfs.timesheet.domain.Timesheet;
import com.bfs.timesheet.service.TemplateService;
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

    @Autowired
    TemplateService templateService;

    // userId=1
    @PostMapping("postTimesheet")
    public void postTimesheet(@RequestParam Integer id) {
        timesheetService.postTimesheet(id);
    }

    @PostMapping("postScheduleTimesheet")
    public void postScheduleTimesheet() {
        timesheetService.postScheduleTimesheet();
    }

    @GetMapping("/getTimesheet")
    public Timesheet getTimesheet(@RequestParam Integer userId, @RequestParam String weekEnding) {
        return timesheetService.getTimesheet(userId, weekEnding);
    }

    @GetMapping("/getAllTimesheets/{userId}")
    public ResponseEntity<List<Timesheet>> getAllTimesheets(@PathVariable String userId) {
        return timesheetService.getAllTimesheets(userId);
    }

    @PutMapping("/updateDefault")
    public ResponseEntity<String> updateTemplate(@RequestBody Template template){
//        Template originalTemp = templateService.getTemplate(template.getUserId());
//        originalTemp.setDays(template.getDays());
        templateService.saveTemplate(template.getUserId(), template.getDays());
        return ResponseEntity.ok("Update Default Template");
    }

    @PutMapping("/updateTimesheet")
    public ResponseEntity<String> updateTimesheet(@RequestBody Timesheet timesheet) {
        Timesheet originalTime = timesheetService.getTimesheet(timesheet.getUserId(),timesheet.getWeekEnding());
        originalTime.setTotalBillingHours(timesheet.getTotalBillingHours());
        originalTime.setTotalCompensatedHours(timesheet.getTotalCompensatedHours());
        originalTime.setSubmissionStatus(timesheet.getSubmissionStatus());
        originalTime.setApprovalStatus(timesheet.getApprovalStatus());
        originalTime.setComment(timesheet.getComment());
        originalTime.setDays(timesheet.getDays());
        timesheetService.saveTimeSheet(originalTime);
        return ResponseEntity.ok("Update timesheet");
    }

}
