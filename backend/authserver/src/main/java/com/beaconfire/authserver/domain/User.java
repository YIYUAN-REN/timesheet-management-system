package com.beaconfire.authserver.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Document
public class User {
    @Id
    private Integer id;
    private String username;
    private String password;
}
