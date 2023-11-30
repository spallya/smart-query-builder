package com.sqb.dbquery;

import io.micrometer.common.util.StringUtils;
import org.springframework.ai.client.AiClient;
import org.springframework.ai.client.AiResponse;
import org.springframework.ai.prompt.Prompt;
import org.springframework.ai.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DatabaseQueryController {

    private final AiClient aiClient;

    @Value("classpath:/prompts/dba-prompt.st")
    private Resource dbaPromptResource;

    @Autowired
    public DatabaseQueryController(AiClient aiClient) {
        this.aiClient = aiClient;
    }

    @Autowired
    private ResourceLoader resourceLoader;

    @PostMapping("/ai/dbquery")
    public Completion completion(@RequestBody MessageRequest request) {
        if (StringUtils.isEmpty(request.getAppId())) {
            request.setAppId("ecommerce-app");
        }
        PromptTemplate promptTemplate = new PromptTemplate(dbaPromptResource);
        FileSystemResource shcemaResources = new FileSystemResource("/Users/spallyaomar/Documents/Wells Fargo POC/github/smart-query-builder/api/sqb-api/src/main/resources/schemas/" +
                request.getAppId() + ".txt");
        Map<String, Object> map = new HashMap<>();
        map.put("question", request.getUserMessage());
        map.put("context", shcemaResources);
        Prompt prompt = promptTemplate.create(map);
        AiResponse aiResponse = aiClient.generate(prompt);
        return new Completion(aiResponse.getGeneration().getText());
    }

    @GetMapping("/user/authenticated")
    public ResponseEntity<Boolean> userAuthenticated(@RequestParam(name = "uuid", required = false) String uuid,
                                                     @RequestParam(name = "system", required = false) String system) {
        System.out.println("Received request for: " + uuid + " " + system);
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

}
