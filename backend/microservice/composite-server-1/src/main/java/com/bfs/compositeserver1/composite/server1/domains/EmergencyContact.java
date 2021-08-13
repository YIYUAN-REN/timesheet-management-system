package com.bfs.compositeserver1.composite.server1.domains;

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
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyContact {
	
	private String firstName;
	 
	 private String lastName;
	 
	 private String phone;

}
