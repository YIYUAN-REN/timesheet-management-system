package com.bfs.profileservice.config;

import java.util.Properties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
 
import org.springframework.scheduling.annotation.EnableScheduling;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

@Configuration
@ComponentScan(basePackages = {"com.bfs.profileservice"})
@EnableScheduling
public class GeneralConfig {
	@Bean
    public AmazonS3 s3() {
        AWSCredentials awsCredentials =
                new BasicAWSCredentials("AKIA5DURWOTLOJJM454X", "NNJQ7ohZ/w3arR1wg0gmKYl6b2Krhe4/OtgPUtt7");
        return AmazonS3ClientBuilder
                .standard()
                .withRegion("us-east-1")
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();

    }

 
	
	
}
