package com.sqb.cache;

import com.sqb.database.DatabaseProviders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class CacheMetadataController {

    @Autowired
    private CacheManager cacheManager;

    @GetMapping("/cached/metadata")
    public ResponseEntity<CachedMetaData> getCachedMetadata() {
        Map<String, String> onboardedApps = cacheManager.getOnboardedApps();
        return new ResponseEntity<>(new CachedMetaData(List.of(DatabaseProviders.values()), onboardedApps), HttpStatus.OK);
    }
}
