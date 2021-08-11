package com.beaconfire.authserver.controller;

import com.beaconfire.authserver.domain.User;
import com.beaconfire.authserver.security.JwtUtil;
import com.beaconfire.authserver.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/auth")
public class LoginController {
    @Autowired
    private UserService userService;

    // userId=1
    @PostMapping("/postUser")
    public void postUser() {
        userService.postUser();
    }

    @PostMapping(value="/login")
    public Map<String, Object> login(@RequestBody User request){
        Map<String, Object> response =  userService.getUser(String.valueOf(request.getUsername()), String.valueOf(request.getPassword()));
        User user = (User)response.get("user");
        if(user != null){
            String token = JwtUtil.generateToken("HappyGroup6", user.getUsername());
            response.put("token", token);
        }
        return response;
    }

}
