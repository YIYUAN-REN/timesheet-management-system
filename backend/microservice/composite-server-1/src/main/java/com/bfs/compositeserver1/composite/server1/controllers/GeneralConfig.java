package com.bfs.compositeserver1.composite.server1.controllers;

import java.util.Properties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
 
import org.springframework.scheduling.annotation.EnableScheduling;

 

@Configuration
@ComponentScan(basePackages = {"com.bfs.compositeserver1"})
@EnableScheduling
public class GeneralConfig {
	 
	
}
