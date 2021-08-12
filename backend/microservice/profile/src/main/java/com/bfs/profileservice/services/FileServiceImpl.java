package com.bfs.profileservice.services;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import javax.ws.rs.GET;
import javax.ws.rs.core.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.bfs.profileservice.config.BucketName;
import com.bfs.profileservice.domains.ProfileUser;
import com.bfs.profileservice.repository.ProfileRepository;

import lombok.AllArgsConstructor;
import static org.apache.http.entity.ContentType.*;

@Service
@AllArgsConstructor
public class FileServiceImpl implements FileService{
	private final FileStore fileStore;
	
	
 
	@Autowired
	ProfileRepository profileRepository;
	 
	
	@Override
	public String saveDocument(String title , MultipartFile file, int userid ) {
	

						 
					 if (file.isEmpty()) {
				         throw new IllegalStateException("Cannot upload empty file");
				     }
					 
				     //Check if the file is valid format  * already done in front end
//				     if (!Arrays.asList(IMAGE_PNG.getMimeType(),
//				             IMAGE_BMP.getMimeType(),
//				             IMAGE_GIF.getMimeType(),
//				             IMAGE_JPEG.getMimeType()).contains(file.getContentType())) {
//				         throw new IllegalStateException("FIle uploaded is not an image");
//				     }
				     
				     Map<String, String> metadata = new HashMap<>();
				     metadata.put("Content-Type", file.getContentType());
				     metadata.put("Content-Length", String.valueOf(file.getSize()));
				     
//				     String path = String.format("%s/%s", BucketName.TODO_IMAGE.getBucketName(), UUID.randomUUID());
				     
				     String path = String.format("%s/%s", BucketName.TODO_IMAGE.getBucketName(), "avatar"+userid);
				     
				     String fileName = String.format("%s", file.getOriginalFilename());
				     
				     try {
				         fileStore.upload(path, fileName, Optional.of(metadata), file.getInputStream());
				     } catch (IOException e) {
				         throw new IllegalStateException("Failed to upload file", e);
				     }
				     
				     
				     	Date date = new Date();
			        	String createdDate= new SimpleDateFormat("yyyy-MM-dd").format(date);
			        	 
			   
			        ProfileUser pu =  profileRepository.findByUserId(userid);
			          System.out.println(pu);
			          if(file.getContentType().contains("image")  ) {
			        	  
			        	 pu.setProfilePicturePath(path+"/"+fileName);
			        	 profileRepository.save(pu);
			        	  
			        	  
			          }

				        return path+"/"+fileName;
	
	
	}

	@Override
	public byte[] downloadDocument(Integer id) {
        
		String path = null;
		String filename = null;
		
		 return fileStore.download(path, filename);
	}
 



}
