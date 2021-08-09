package com.bfs.timesheet.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Document
public class Holiday {
    @Id
    private Integer id;
    private List<String> holidays;
}
