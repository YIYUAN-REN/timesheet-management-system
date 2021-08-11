package com.bfs.timesheet.service;

import com.bfs.timesheet.domain.Day;
import com.bfs.timesheet.domain.Template;
import com.bfs.timesheet.domain.Timesheet;
import com.bfs.timesheet.repository.TemplateRepository;
import com.bfs.timesheet.repository.TimesheetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TimesheetService {
    @Autowired
    private TimesheetRepository timesheetRepository;

    public void postTimesheet(Integer id) {
        Timesheet timesheet = new Timesheet();
        List<Day> days = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            Day day = new Day();
            if (i == 0) {
                day.setDay("Sunday");
                day.setDate("01/03/2021");
                day.setStartTime("N/A");
                day.setEndTime("N/A");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            } else if (i == 1) {
                day.setDay("Monday");
                day.setDate("01/04/2021");
                day.setStartTime("9:00 AM");
                day.setEndTime("6:00 PM");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            } else if (i == 2) {
                day.setDay("Tuesday");
                day.setDate("01/05/2021");
                day.setStartTime("9:00 AM");
                day.setEndTime("6:00 PM");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            }  else if (i == 3) {
                day.setDay("Wednesday");
                day.setDate("01/06/2021");
                day.setStartTime("9:00 AM");
                day.setEndTime("6:00 PM");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            }  else if (i == 4) {
                day.setDay("Thursday");
                day.setDate("01/07/2021");
                day.setStartTime("9:00 AM");
                day.setEndTime("6:00 PM");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            }  else if (i == 5) {
                day.setDay("Friday");
                day.setDate("01/08/2021");
                day.setStartTime("9:00 AM");
                day.setEndTime("6:00 PM");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            } else {
                day.setDay("Saturday");
                day.setDate("01/09/2021");
                day.setStartTime("N/A");
                day.setEndTime("N/A");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            }
            days.add(day);
        }

        timesheet.setId(id);
        timesheet.setUserId(1);
        timesheet.setWeekEnding("01/09/2021");
        timesheet.setDays(days);
        timesheet.setTotalBillingHours(8);
        timesheet.setTotalCompensatedHours(0);
        timesheet.setSubmissionStatus("Not Started");
        timesheet.setApprovalStatus("N/A");
        timesheet.setComment("");
        timesheetRepository.save(timesheet);
    }

    public Timesheet getTimesheet(int userId, String weekEnding) {
        return timesheetRepository.findByUserIdAndWeekEnding(userId, weekEnding);
    }

    public ResponseEntity<List<Timesheet>> getAllTimesheets(String userId){
        List<Timesheet> list = timesheetRepository.findByUserId(Integer.parseInt(userId));
        return ResponseEntity.status(HttpStatus.CREATED).body(list);
    }

    public Timesheet saveTimeSheet(Timesheet timesheet){
        return timesheetRepository.save(timesheet);
    }
}
