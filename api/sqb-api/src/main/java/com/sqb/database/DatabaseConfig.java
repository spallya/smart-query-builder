package com.sqb.database;

import java.sql.*;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConfig {
    private static final Logger LOG = LoggerFactory.getLogger(DatabaseConfig.class);

    public String testConnection(DatabaseConnectionDto connectionDto) {
        try {
            Connection connection = getConnection(connectionDto);
            connection.close();
            return "Connection Successful!!";
        } catch (ClassNotFoundException | SQLException e) {
            LOG.error(e.getMessage());
            return "Connection Failed!! Error: " + e.getMessage();
        }
    }

    public Map<String, Set<String>> getSchemaMetadata(DatabaseConnectionDto connectionDto) {
        Map<String, Set<String>> schemaMetadata = new HashMap<>();
        try {
            Connection connection = getConnection(connectionDto);
            ResultSet resultSet;
            try (PreparedStatement preparedStatement = connection.prepareStatement(DatabaseProviders.valueOf(
                    connectionDto.getDatabaseProvider()).getMetadataQuery() +
                    "'" +
                    connectionDto.getSchemaName() +
                    "'")) {
                resultSet = preparedStatement.executeQuery();
                while (resultSet.next()) {
                    String tableName = resultSet.getString(1);
                    String columnName = resultSet.getString(2);
                    if (schemaMetadata.containsKey(tableName)) {
                        schemaMetadata.get(tableName).add(columnName);
                    } else {
                        Set<String> columns = new HashSet<>();
                        columns.add(columnName);
                        schemaMetadata.put(tableName, columns);
                    }
                }
            }
            connection.close();
            return schemaMetadata;
        } catch (ClassNotFoundException | SQLException e) {
            LOG.error(e.getMessage());
        }
        return Collections.emptyMap();
    }

    private Connection getConnection(DatabaseConnectionDto connectionDto) throws ClassNotFoundException, SQLException {
        Class.forName(DatabaseProviders.valueOf(connectionDto.getDatabaseProvider()).getDriverName());
        String url = DatabaseProviders.valueOf(connectionDto.getDatabaseProvider()).getBaseUrl() +
                connectionDto.getHost() +
                ":" +
                connectionDto.getPort() +
                "/" +
                connectionDto.getSchemaName();

        return DriverManager.getConnection(url, connectionDto.getUserName(), connectionDto.getPassword());
    }
}