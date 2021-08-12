package com.bfs.profileservice.services;

import java.util.List;

import javax.ws.rs.core.Response;

import org.springframework.web.multipart.MultipartFile;

 

public interface FileService {
	
	String saveDocument(String title,  MultipartFile file , int userId );

    byte[] downloadDocument(Integer id);

   // List<PersonalDocument> getAllDocument();
    
   

}
