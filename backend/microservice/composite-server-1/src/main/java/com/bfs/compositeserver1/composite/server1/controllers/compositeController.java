package com.bfs.compositeserver1.composite.server1.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.bfs.compositeserver1.composite.server1.domains.ProfileUser;
import com.bfs.compositeserver1.composite.server1.services.RemoteCallService;
import com.bfs.compositeserver1.domains.Timesheet;

 

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/comp")
public class compositeController {
	
	
	private  RestTemplate restTemplate;
	
	@Autowired
	private RemoteCallService feignRemoteCallService;
	
	@Autowired
	public void setRestTemplate(RestTemplateBuilder builder) {
		
		this.restTemplate = builder.build();
		
	}
	
    @GetMapping("/getTimesheet")
    public Timesheet getTimesheet(@RequestParam Integer userId, @RequestParam String weekEnding) {
    	
    	String url = "http://localhost:8082/timesheet/getTimesheet?userId=1&weekEnding=" + "01/09/2021" ;
    	
    	Timesheet timeSheet = restTemplate.getForObject(url, Timesheet.class);
    	
    	return timeSheet;
       
    }
    
    
    @GetMapping("/test")
    public void test() {
    	
//    	String url = "http://localhost:8082/timesheet/getTimesheet?userId=1&weekEnding=" + "01/09/2021" ;
//    	
//    	Timesheet timeSheet = restTemplate.getForObject(url, Timesheet.class);
//    	
//    	return timeSheet;
       
    }
    
    
    //feign client call
    @GetMapping("/getprofilefeign/{uid}")
    public ProfileUser getProfile(@PathVariable Integer uid) {
    	
    	return feignRemoteCallService.getProfile(uid);
    	
    }
    
    
    

}
