package com.sqb.dbquery;

import org.springframework.ai.client.AiClient;
import org.springframework.ai.client.AiResponse;
import org.springframework.ai.prompt.Prompt;
import org.springframework.ai.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class DatabaseQueryController {

    private final AiClient aiClient;

    @Value("classpath:/schemas/sample-app-1.txt")
    private Resource dbSchemaDetails;

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
        PromptTemplate promptTemplate = new PromptTemplate(dbaPromptResource);
        Resource schema = resourceLoader.getResource("classpath:/schemas/" +
                request.getAppId() + ".txt");
        Map<String, Object> map = new HashMap<>();
        map.put("question", request.getUserMessage());
        map.put("context", schema);
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
