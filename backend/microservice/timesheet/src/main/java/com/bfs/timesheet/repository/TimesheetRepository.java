package com.bfs.timesheet.repository;

import com.bfs.timesheet.domain.Timesheet;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TimesheetRepository extends MongoRepository<Timesheet, String> {

}
