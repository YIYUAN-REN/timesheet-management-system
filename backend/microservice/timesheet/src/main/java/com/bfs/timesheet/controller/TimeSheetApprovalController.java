package com.bfs.timesheet.controller;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bfs.timesheet.domain.Timesheet;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/timesheet")
public class TimeSheetApprovalController {
	
	// RabbitMQ setup  start
	private RabbitTemplate rabbitTemplate;
	
	@Autowired
	public void setRabbitTemplate(RabbitTemplate rabbitTemplate) {
		this.rabbitTemplate = rabbitTemplate;
	}
	// RabbitMQ setup  end 
	
	
	
	
	   // public void getTimesheet(@RequestParam Integer userId, @RequestParam String weekEnding) {
	 
	 @GetMapping("/approvetimesheet")  //userid //wweekending
	 	public void getTimesheet(@RequestParam Integer userId, @RequestParam String weekEnding) {
		 	
		 		
		 	  
		 
		 		
		 
			  String testSend = "userid is:1:and is:approved";   // testSend.split(":");
		  	  rabbitTemplate.convertAndSend("timesheetapproval","status",testSend);
	          return; 
	    }

}
