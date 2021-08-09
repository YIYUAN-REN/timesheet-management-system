package com.bfs.profileservice.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.bfs.profileservice.domains.ProfileUser;
 

 

public interface ProfileRepository extends MongoRepository<ProfileUser, Integer>{
	
	
	ProfileUser findById(int id);
	

}
