package com.bfs.timesheet.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bfs.timesheet.domain.PTO;
import com.bfs.timesheet.domain.Timesheet;
import com.bfs.timesheet.service.PTOService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/timesheet")
public class PtoManagementController {
	
	
	@Autowired
	PTOService ptoService;
	
    @GetMapping("/getpto")
    public PTO getPto(@RequestParam Integer userId ) {
    	
    	
    	return ptoService.getPTO(userId);
    	
    }
    
    @PostMapping("/savepto")
     public PTO savePto(@RequestBody PTO pto ) {
     	
    	
    	return ptoService.savePTO(pto.getUserId(), pto.getFloatings(), pto.getVacations());
    	
        
    	
     }
    
    
    

}
