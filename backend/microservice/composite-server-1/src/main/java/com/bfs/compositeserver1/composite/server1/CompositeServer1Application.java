package com.bfs.compositeserver1.composite.server1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
 

@SpringBootApplication
@EnableEurekaClient
@EnableAutoConfiguration
public class CompositeServer1Application {

	public static void main(String[] args) {
		SpringApplication.run(CompositeServer1Application.class, args);
	}

}
