package com.bfs.timesheet.repository;

import com.bfs.timesheet.domain.Holiday;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HolidayRepository extends MongoRepository<Holiday, String> {

}
