package com.bfs.timesheet.domain;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document
public class Timesheet {
    @Id
    private ObjectId id;
    private Integer userId;
    private String weekEnding;
    private List<Day> days;
    private Integer totalBillingHours;
    private Integer totalCompensatedHours;
    private String submissionStatus;
    private String approvalStatus;
    private String comment;
}
