package com.sqb.database;

public enum DatabaseProviders {

    ORACLE("", "", ""),
    MY_SQL(
            "jdbc:mysql://",
            "com.mysql.cj.jdbc.Driver",
    "SELECT table_name, column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = "),
    MS_SQL("", "", "");

    private String baseUrl;
    private String driverName;

    public String getMetadataQuery() {
        return metadataQuery;
    }

    private String metadataQuery;

    public String getBaseUrl() {
        return baseUrl;
    }

    public String getDriverName() {
        return driverName;
    }

    DatabaseProviders(String baseUrl, String driverName, String metadataQuery) {
        this.baseUrl = baseUrl;
        this.driverName = driverName;
        this.metadataQuery = metadataQuery;
    }
}

