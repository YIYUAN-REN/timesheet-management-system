package com.bfs.timesheet.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Document(collection ="PTO")
public class PTO {
    @Id
    private ObjectId id;
    private Integer userId;
    private List<String> floatings;
    private List<String> vacations;
}
