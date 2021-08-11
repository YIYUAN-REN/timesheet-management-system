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
	 
	 public PTO getPTO(Integer userid ) {
		 
		 PTO pto = ptoRepository.findByUserId(userid);
		 
		 return pto;
		 
	 }
	 
	 
	 
	public PTO savePTO(Integer userid, List<String> floatings, List<String> vacations) {
		 
		 PTO pto = ptoRepository.findByUserId(userid);
		 
		 System.out.println(pto);
		 if(pto==null) {
			 
			 pto = new PTO();
			 pto.setUserId(userid);
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
