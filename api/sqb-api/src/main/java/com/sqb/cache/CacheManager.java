package com.sqb.cache;

import org.apache.commons.collections4.MapUtils;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class CacheManager {

    private Map<String, String> onboardedApps;

    public Map<String, String> getOnboardedApps() {
        if (MapUtils.isEmpty(onboardedApps)) {
            onboardedApps = new HashMap<>();
        }
        if (!onboardedApps.containsKey("ecommerce-app")) {
            onboardedApps.put("ecommerce-app", "Sample e-commerce app");
        }
        return onboardedApps;
    }

    public void addApp(String appId, String appName) {
        if (MapUtils.isEmpty(onboardedApps)) {
            onboardedApps = new HashMap<>();
        }
        onboardedApps.put(appId, appName);
    }

}
