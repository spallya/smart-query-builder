package com.sqb.onboard;

import com.sqb.cache.CacheManager;
import com.sqb.database.DatabaseConfig;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class OnboardingService {

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private DatabaseConfig databaseConfig;

    @Autowired
    private ResourceLoader resourceLoader;


    public String onboardApp(AppOnboardingDto onboardingDto) {
        Map<String, Set<String>> schemaMetadata = new HashMap<>();
        if (onboardingDto.getDbConnectionDetails() != null) {
            schemaMetadata = databaseConfig.getSchemaMetadata(onboardingDto.getDbConnectionDetails());
        }
        if (MapUtils.isNotEmpty(schemaMetadata)) {
            try {
                buildAndStoreSchemaDetails(schemaMetadata, onboardingDto.getAppId());
            } catch (IOException e) {
                System.out.println(e.getMessage());
            }
        }
        cacheManager.addApp(onboardingDto.getAppId(), onboardingDto.getAppName());
        return "App onboarded successfully!!";
    }

    private void buildAndStoreSchemaDetails(Map<String, Set<String>> schemaMetadata, String appId) throws IOException {
        StringBuilder content = new StringBuilder();
        schemaMetadata.forEach((tableName, columns) -> {
            content.append("Table: ")
                    .append(tableName);
            if (CollectionUtils.isNotEmpty(columns)) {
                content.append(" has columns: ");
                columns.forEach(column -> content.append(column).append(", "));
            }
            content.append("\n");
        });
        if (StringUtils.isNotEmpty(content.toString())) {
            Path path = Paths.get("/Users/spallyaomar/Documents/Wells Fargo POC/github/smart-query-builder/api/sqb-api/src/main/resources/schemas/" + appId + ".txt");
            try (OutputStream outputStream = Files.newOutputStream(path)) {
                outputStream.write(content.toString().getBytes());
            }
        }
    }

}
