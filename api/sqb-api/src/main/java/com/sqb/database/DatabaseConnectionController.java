package com.sqb.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DatabaseConnectionController {

    @Autowired
    private DatabaseConfig databaseConfig;

    @PostMapping("/connectivity/db")
    public ResponseEntity<String> testConnectivity(@RequestBody DatabaseConnectionDto connectionDto) {
        String testConnection = databaseConfig.testConnection(connectionDto);
        if ("Connection Successful!!".equalsIgnoreCase(testConnection)) {
            return new ResponseEntity<>(testConnection, HttpStatus.OK);
        }
        return new ResponseEntity<>(testConnection, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
