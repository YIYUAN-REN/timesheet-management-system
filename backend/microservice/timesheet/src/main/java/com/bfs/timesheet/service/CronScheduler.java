package com.bfs.timesheet.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class CronScheduler {

	@Scheduled(cron = "* * * * * SAT")
	public void updateTemplate() {
		
		final String uri = "http://localhost:8082/timesheet/postScheduleTimesheet";

	    RestTemplate restTemplate = new RestTemplate();
	    
	    
	   // String test = 
	    		restTemplate.getForObject(uri, String.class);

	     
	
	
	
	System.out.println(" Update Weekly Template ");
		
	}
	
}
