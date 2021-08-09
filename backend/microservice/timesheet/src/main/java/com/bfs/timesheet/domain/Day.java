package com.bfs.timesheet.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Day {
    String day;
    String date;
    String startTime;
    String endTime;
    Double totalHours;
    Boolean isFloating;
    Boolean isHoliday;
    Boolean isVacation;
}
