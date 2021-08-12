package com.bfs.timesheet.service;

import com.bfs.timesheet.domain.Day;
import com.bfs.timesheet.domain.Timesheet;
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

    public void postTimesheet() {
        Timesheet timesheet = new Timesheet();
        List<Day> days = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            Day day = new Day();
            if (i == 0) {
                day.setDay("Sunday");
                day.setDate("01/17/2021");
                day.setStartTime("N/A");
                day.setEndTime("N/A");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            } else if (i == 1) {
                day.setDay("Monday");
                day.setDate("01/18/2021");
                day.setStartTime("9:00 AM");
                day.setEndTime("6:00 PM");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            } else if (i == 2) {
                day.setDay("Tuesday");
                day.setDate("01/19/2021");
                day.setStartTime("9:00 AM");
                day.setEndTime("6:00 PM");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            }  else if (i == 3) {
                day.setDay("Wednesday");
                day.setDate("01/20/2021");
                day.setStartTime("9:00 AM");
                day.setEndTime("6:00 PM");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            }  else if (i == 4) {
                day.setDay("Thursday");
                day.setDate("01/21/2021");
                day.setStartTime("9:00 AM");
                day.setEndTime("6:00 PM");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            }  else if (i == 5) {
                day.setDay("Friday");
                day.setDate("01/22/2021");
                day.setStartTime("9:00 AM");
                day.setEndTime("6:00 PM");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            } else {
                day.setDay("Saturday");
                day.setDate("01/23/2021");
                day.setStartTime("N/A");
                day.setEndTime("N/A");
                day.setIsFloating(false);
                day.setIsHoliday(false);
                day.setIsVacation(false);
            }
            days.add(day);
        }

        timesheet.setUserId(1);
        timesheet.setWeekEnding("01/23/2021");
        timesheet.setDays(days);
        timesheet.setTotalBillingHours(45);
        timesheet.setTotalCompensatedHours(45);
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
