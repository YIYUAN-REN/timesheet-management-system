package com.bfs.timesheet.service;

import com.bfs.timesheet.domain.Timesheet;
import com.bfs.timesheet.repository.TimesheetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TimesheetService {
    @Autowired
    private TimesheetRepository timesheetRepository;

    public Timesheet getTimesheet(int userId, String weekEnding) {
        return timesheetRepository.findByUserIdAndWeekEnding(userId, weekEnding);
    }

}
