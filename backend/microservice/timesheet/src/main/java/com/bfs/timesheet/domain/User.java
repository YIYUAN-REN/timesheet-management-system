package com.bfs.timesheet.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@Document
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class User {
	  	@Id
	    private Integer id;
	  	private String username;
		private String password;
}
