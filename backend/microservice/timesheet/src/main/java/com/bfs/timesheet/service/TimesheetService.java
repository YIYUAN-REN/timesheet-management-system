package com.bfs.timesheet.service;

import com.bfs.timesheet.domain.Day;
import com.bfs.timesheet.domain.Template;
import com.bfs.timesheet.domain.Timesheet;
import com.bfs.timesheet.domain.User;
import com.bfs.timesheet.repository.TemplateRepository;
import com.bfs.timesheet.repository.TimesheetRepository;
import com.bfs.timesheet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class TimesheetService {
    @Autowired
    private TimesheetRepository timesheetRepository;

    @Autowired
    private TemplateRepository templateRepository;

    @Autowired
    private UserRepository userRepository;

    public void postTimesheet(String date) {
        // get all users
        List<User> users = userRepository.findAll();

        for (User user : users) {
            // get template for the user
            Template template = templateRepository.findByUserId(user.getId());
            // set seven days timesheets for the user
            Timesheet timesheet = new Timesheet();
            List<Day> detailedDays = getInitialDetailedDays(template.getDays(), date);
            timesheet.setUserId(user.getId());
            timesheet.setWeekEnding(date);
            timesheet.setDays(detailedDays);
            timesheet.setTotalBillingHours(getInitialHours(detailedDays));
            timesheet.setTotalCompensatedHours(getInitialHours(detailedDays));
            timesheet.setSubmissionStatus("Not Started");
            timesheet.setApprovalStatus("N/A");
            timesheet.setComment("");
            timesheetRepository.save(timesheet);
        }
    }

    private List<Day> getInitialDetailedDays(List<Day> originalDays, String date) {
        List<Day> days = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            Day day = new Day();
            day.setDay(originalDays.get(i).getDay());
            day.setDate(getInitialDate(i - 6, date));
            day.setStartTime(originalDays.get(i).getStartTime());
            day.setEndTime(originalDays.get(i).getEndTime());
            day.setIsFloating(false);
            day.setIsHoliday(false);
            day.setIsVacation(false);
            days.add(day);
        }
        return days;
    }

    private String getInitialDate(int offset, String dateStr) {
        Date date= null;
        try {
            date = new SimpleDateFormat("MM/dd/yyyy").parse(dateStr);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(calendar.DATE, offset);
        date=calendar.getTime();
        SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
        String dateString = formatter.format(date);

        return dateString;
    }

    public void postScheduleTimesheet() {
        // get all users
        List<User> users = userRepository.findAll();
        System.out.println("users size: " + users.size());

        for (User user : users) {
            // get template for the user
            Template template = templateRepository.findByUserId(user.getId());
            // set seven days timesheets for the user
            Timesheet timesheet = new Timesheet();
            List<Day> detailedDays = getDetailedDays(template.getDays());
            timesheet.setUserId(user.getId());
            timesheet.setWeekEnding(getDate(7));
            timesheet.setDays(detailedDays);
            timesheet.setTotalBillingHours(getInitialHours(detailedDays));
            timesheet.setTotalCompensatedHours(getInitialHours(detailedDays));
            timesheet.setSubmissionStatus("Not Started");
            timesheet.setApprovalStatus("N/A");
            timesheet.setComment("");
            timesheetRepository.save(timesheet);
        }
    }

    private List<Day> getDetailedDays(List<Day> originalDays) {
        List<Day> days = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            Day day = new Day();
            day.setDay(originalDays.get(i).getDay());
            day.setDate(getDate(i + 1));
            day.setStartTime(originalDays.get(i).getStartTime());
            day.setEndTime(originalDays.get(i).getEndTime());
            day.setIsFloating(false);
            day.setIsHoliday(false);
            day.setIsVacation(false);
            days.add(day);
        }
        return days;
    }

    private String getDate(int offset) {
        Date date=new Date();
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(date);
        calendar.add(calendar.DATE, offset);
        date=calendar.getTime();
        SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
        String dateString = formatter.format(date);

        return dateString;
    }

    private int getInitialHours(List<Day> days) {
        int hours = 0;
        for (Day day : days) {
            if (day.getIsFloating() || day.getIsHoliday() || day.getIsVacation()) {
                continue;
            }
            if (day.getEndTime().equals("N/A") || day.getStartTime().equals("N/A") || getNumberTime(day.getEndTime()) - getNumberTime(day.getStartTime()) < 0) {
                continue;
            }
            hours += getNumberTime(day.getEndTime()) - getNumberTime(day.getStartTime());
        }
        return hours;
    }

    private double getNumberTime(String time) {
        if (time.equals("N/A")) {
            return 0;
        }

        String[] array = time.split(" ");
        String slice = array[0];
        String suffix = array[1];

        array = slice.split(":");
        String hourString = array[0];
        String minuteString = array[1];
        double hour = Double.parseDouble(hourString);
        double minute = Double.parseDouble(minuteString) / 60;

        int addition = suffix.equals("PM") && hour != 12 ? 12 : 0;

        return hour + minute + addition;
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
