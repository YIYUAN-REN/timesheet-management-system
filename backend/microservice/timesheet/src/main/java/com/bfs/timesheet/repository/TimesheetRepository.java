package com.bfs.timesheet.repository;

import com.bfs.timesheet.domain.Timesheet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimesheetRepository extends MongoRepository<Timesheet, String> {
    List<Timesheet> findByUserId(Integer userId);
}
