package com.sqb.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class DatabaseConnectionController {

    @Autowired
    private DatabaseConfig databaseConfig;

    @PostMapping("/connectivity/db")
    public ResponseEntity<Boolean> testConnectivity(@RequestBody DatabaseConnectionDto connectionDto) {
        boolean testConnection = databaseConfig.testConnection(connectionDto);
        return new ResponseEntity<>(testConnection, HttpStatus.OK);
    }
}
