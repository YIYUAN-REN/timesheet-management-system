package com.bfs.timesheet.service;

import com.bfs.timesheet.domain.Timesheet;
import com.bfs.timesheet.repository.TimesheetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimesheetService {
    @Autowired
    private TimesheetRepository timesheetRepository;

    public Timesheet getTimesheet(int userId, String weekEnding) {
        return timesheetRepository.findByUserIdAndWeekEnding(userId, weekEnding);
    }

    public ResponseEntity<List<Timesheet>> getAllTimesheets(String userId){
        List<Timesheet> list = timesheetRepository.findByUserId(Integer.parseInt(userId));
        return ResponseEntity.status(HttpStatus.CREATED).body(list);
    }
}
