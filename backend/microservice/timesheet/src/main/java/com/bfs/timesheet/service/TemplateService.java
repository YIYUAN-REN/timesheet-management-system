package com.bfs.timesheet.service;

import com.bfs.timesheet.domain.Template;
import com.bfs.timesheet.repository.TemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TemplateService {
    @Autowired
    TemplateRepository templateRepository;

    public Template getTemplate(int userId){
        if(templateRepository.findByUserId(userId) == null){
            return templateRepository.findByUserId(0);
        }
        else return templateRepository.findByUserId(userId);
    }

    public Template saveTemplate(Template template){
        return templateRepository.save(template);
    }
}
