package com.beaconfire.authserver.repository;

import com.beaconfire.authserver.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {
    List<User> findByUsernameAndPassword(String username, String password);
}
