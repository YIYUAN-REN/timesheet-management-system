package com.bfs.timesheet.service;

import com.bfs.timesheet.domain.Day;
import com.bfs.timesheet.domain.Template;
import com.bfs.timesheet.repository.TemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemplateService {
    @Autowired
    TemplateRepository templateRepository;

    public Template getTemplate(int userId){
        return templateRepository.findByUserId(userId);
    }

    public Template saveTemplate(Integer userId, List<Day> days) {
        Template originalTemp = getTemplate(userId);
        if (originalTemp == null) {
            originalTemp = new Template();
            originalTemp.setUserId(userId);
            originalTemp.setDays(days);
            return templateRepository.save(originalTemp);
        }
        else {
//            originalTemp.setUserId(userId);
            originalTemp.setDays(days);
            return templateRepository.save(originalTemp);
        }
    }
}
