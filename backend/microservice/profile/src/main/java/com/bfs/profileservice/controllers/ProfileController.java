package com.bfs.profileservice.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bfs.profileservice.domains.ProfileUser;
import com.bfs.profileservice.repository.ProfileRepository;
 

 

@RestController()
@RequestMapping("/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

	
	@Autowired
	ProfileRepository profileRepository;
	
	
    @PostMapping("editcontact")
    public ProfileUser editContact(@RequestBody ProfileUser request) {
    	
    	
    	ProfileUser pu = new ProfileUser();
     
    	pu.setId(100);
    	pu.setEmail(request.getEmail());
    	System.out.println("bug check email " + request.getEmail());
    	pu.setEmergencyContacts(request.getEmergencyContacts());
    	pu.setFullAddress(request.getFullAddress());
    	pu.setPhoneNumber(request.getPhoneNumber());
    	pu.setProfilePicturePath(request.getProfilePicturePath());
    	profileRepository.save(pu);
    	return pu;
    }
    
    @GetMapping("getcontact/{uid}")
    public  Optional<ProfileUser>  getContact( @PathVariable Integer uid) {
    	
    	return profileRepository.findById(uid);
    	
    }
    
    
    
    
    
	
	
}
