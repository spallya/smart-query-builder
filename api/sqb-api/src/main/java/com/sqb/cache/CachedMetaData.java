package com.sqb.cache;

import com.sqb.database.DatabaseProviders;

import java.util.List;
import java.util.Map;

public record CachedMetaData(
        List<DatabaseProviders> databaseProviders,
        Map<String, String> onboardedApps
) {

}
