package com.sqb.onboard;

import com.sqb.database.DatabaseConnectionDto;

public class AppOnboardingDto {

    private String appId;
    private String appName;
    private DatabaseConnectionDto dbConnectionDetails;

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public DatabaseConnectionDto getDbConnectionDetails() {
        return dbConnectionDetails;
    }

    public void setDbConnectionDetails(DatabaseConnectionDto dbConnectionDetails) {
        this.dbConnectionDetails = dbConnectionDetails;
    }

}
