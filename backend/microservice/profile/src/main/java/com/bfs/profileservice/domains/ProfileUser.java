package com.bfs.profileservice.domains;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

 
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@Document(collection = "profiles")
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUser {
	
	  	@Id
	    private Integer id;
	  	
	  	private Integer userid;
		
		private String phoneNumber;	
		  
		  private String email;
		  
		  private String fullAddress;
 
		  
		  private String profilePicturePath;
		  
		  
		  EmergencyContact[] emergencyContacts;

}
