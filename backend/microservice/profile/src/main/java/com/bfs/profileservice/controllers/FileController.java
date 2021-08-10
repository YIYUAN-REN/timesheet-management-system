package com.bfs.profileservice.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.bfs.profileservice.services.FileService;
 

@RestController()
@RequestMapping("/file")
@CrossOrigin(origins = "*")
public class FileController {
	
	 	@Autowired
		FileService service;
		
	    @PostMapping(
	            path = "uploadfile",
	            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
	            produces = MediaType.APPLICATION_JSON_VALUE
	    )
	    public ResponseEntity<String> saveTodo(@RequestParam("title") String title,
	                                         @RequestParam("userid") String userid,
	                                         @RequestParam("file") MultipartFile file
	                                       ) {
	    	
	    	System.out.println("bug check file title  " + title);
	    	System.out.println("bug check file userid  " + userid);
	    	System.out.println("bug check file  " + file.isEmpty());
	        return new ResponseEntity<String>(service.saveDocument(title, file , Integer.parseInt(userid) ), HttpStatus.OK);
	    }
	    
	    
	    @GetMapping(value = "/getfile")
	    
	    public byte[] downloadTodoImage(@PathVariable("id") int id) {
	        return service.downloadDocument(id);
	        
	    }
	    

}
