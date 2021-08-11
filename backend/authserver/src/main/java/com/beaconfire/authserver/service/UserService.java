package com.beaconfire.authserver.service;

import com.beaconfire.authserver.domain.User;
import com.beaconfire.authserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public void postUser() {
        User user = new User();
        user.setId(1);
        user.setUsername("user1");
        user.setPassword("password1");
        userRepository.save(user);
    }

    public Map<String, Object> getUser(String username, String password) {
        List<User> users = userRepository.findByUsernameAndPassword(username, password);
        Map<String, Object> response = new HashMap<>();
        if(users.isEmpty()){
            response.put("result", "Fail!");
            return response;
        }
        response.put("result", "Success!");
        response.put("user", users.get(0));

        return response;
    }

}
