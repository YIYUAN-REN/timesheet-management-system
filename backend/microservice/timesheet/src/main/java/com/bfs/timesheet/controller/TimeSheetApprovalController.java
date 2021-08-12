package com.bfs.timesheet.controller;

import com.bfs.timesheet.service.TimesheetService;
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
	@Autowired
	TimesheetService timesheetService;
	
	// RabbitMQ setup  start
	private RabbitTemplate rabbitTemplate;
	
	@Autowired
	public void setRabbitTemplate(RabbitTemplate rabbitTemplate) {
		this.rabbitTemplate = rabbitTemplate;
	}
	// RabbitMQ setup  end 
	
	
	
	
	   // public void getTimesheet(@RequestParam Integer userId, @RequestParam String weekEnding) {

	// http://localhost:8082/timesheet/approvetimesheet?operation=...&userId=...&weekEnding=...
	@GetMapping("/approvetimesheet")  //userid //wweekending
	public void getTimesheet(@RequestParam String operation, @RequestParam Integer userId, @RequestParam String weekEnding) {
		Timesheet timesheet = timesheetService.getTimesheet(userId, weekEnding);
		if (operation.equals("approve")) {
			timesheet.setApprovalStatus("Approve");

			String testSend = "userid is:" + userId + ":and is:approved";   // testSend.split(":");
			rabbitTemplate.convertAndSend("timesheetapproval","status",testSend);

		} else if (operation.equals("deny")) {
			timesheet.setApprovalStatus("Deny");
			timesheet.setSubmissionStatus("Incomplete");
		}
		timesheetService.saveTimeSheet(timesheet);
	}

}
