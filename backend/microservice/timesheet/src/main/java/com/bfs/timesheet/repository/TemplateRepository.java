package com.bfs.timesheet.repository;

import com.bfs.timesheet.domain.Template;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TemplateRepository extends MongoRepository<Template, String> {
    Template findByUserId(Integer userId);
}
