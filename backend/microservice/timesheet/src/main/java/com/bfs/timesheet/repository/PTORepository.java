package com.bfs.timesheet.repository;

import com.bfs.timesheet.domain.PTO;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PTORepository extends MongoRepository<PTO, String> {

}
