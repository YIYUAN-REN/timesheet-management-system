package com.bfs.timesheet.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bfs.timesheet.domain.PTO;
import com.bfs.timesheet.repository.PTORepository;
import com.bfs.timesheet.repository.TimesheetRepository;

@Service
public class PTOService {
	
	 @Autowired
	 private PTORepository ptoRepository;
	 
	 public PTO getPTO(Integer userId ) {
		 
		 PTO pto = ptoRepository.findByUserId(userId);
		 
		 return pto;
		 
	 }
	 
	 
	 
	public PTO savePTO(Integer userId, List<String> floatings, List<String> vacations) {
		 
		 PTO pto = ptoRepository.findByUserId(userId);
		 
		 System.out.println(pto);
		 if(pto==null) {
			 
			 pto = new PTO();
			 pto.setUserId(userId);
			 pto.setFloatings(floatings);
			 pto.setVacations(vacations);
			 ptoRepository.save(pto);
		 }
		 
		 if(pto != null) {
			 
			 pto.setFloatings(floatings);
			 pto.setVacations(vacations);
			 ptoRepository.save(pto);
			 
		 }
		 
		 
		 
		 return pto;
		 
	 }
	 
	 

}
