package com.bfs.profileservice.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.bfs.profileservice.domains.ProfileUser;
 

 

public interface ProfileRepository extends MongoRepository<ProfileUser, ObjectId>{
	
	
	ProfileUser findById(int id);
	
	ProfileUser findByUserId(int id);
	

}
