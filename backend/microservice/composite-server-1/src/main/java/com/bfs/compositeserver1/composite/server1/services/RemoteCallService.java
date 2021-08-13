package com.bfs.compositeserver1.composite.server1.services;

 
 

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.bfs.compositeserver1.composite.server1.domains.ProfileUser;

 @FeignClient(name="profile-service", url="http://localhost:9090/profile")
public interface RemoteCallService {
	
	
	 
	//	@RequestMapping(method=RequestMethod.GET, value="/getcontact/{uid}")
	 
	 	@RequestMapping(method=RequestMethod.GET, value="/getcontact/{uid}")
		public ProfileUser getProfile(@PathVariable Integer uid);

 

}
