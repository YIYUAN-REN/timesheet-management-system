package com.bfs.timesheet.controller;

import com.bfs.timesheet.domain.Template;
import com.bfs.timesheet.domain.Timesheet;
import com.bfs.timesheet.repository.TimesheetRepository;
import com.bfs.timesheet.service.TemplateService;
import com.bfs.timesheet.service.TimesheetService;
import org.bouncycastle.util.Times;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/timesheet")
public class TimesheetController {
    @Autowired
    TimesheetService timesheetService;

    @Autowired
    TemplateService templateService;

    @Autowired
    TimesheetRepository timesheetRepository;

    // initiallize all users from 01/09/2021 to 08/14/2021
    @PostMapping("postTimesheet")
    public void postTimesheet() {
        timesheetRepository.deleteAll();

        Date date= null;
        try {
            date = new SimpleDateFormat("MM/dd/yyyy").parse("01/02/2021");
        } catch (ParseException e) {
            e.printStackTrace();
        }

        Calendar calendar = new GregorianCalendar();
        for (int i = 0; i < 32; i++) {
            calendar.setTime(date);
            calendar.add(calendar.DATE, 7);
            date=calendar.getTime();
            SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
            String dateString = formatter.format(date);
            timesheetService.postTimesheet(dateString);
        }
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
