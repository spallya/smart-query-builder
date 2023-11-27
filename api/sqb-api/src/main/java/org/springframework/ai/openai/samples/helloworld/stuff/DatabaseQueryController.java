package org.springframework.ai.openai.samples.helloworld.stuff;

import org.springframework.ai.client.AiClient;
import org.springframework.ai.client.AiResponse;
import org.springframework.ai.prompt.Prompt;
import org.springframework.ai.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DatabaseQueryController {

    private final AiClient aiClient;

    @Value("classpath:/schemas/db-schema.txt")
    private Resource dbSchemaDetails;

    @Value("classpath:/prompts/dba-prompt.st")
    private Resource dbaPromptResource;

    @Autowired
    public DatabaseQueryController(AiClient aiClient) {
        this.aiClient = aiClient;
    }

    @PostMapping("/ai/dbquery")
    public Completion completion(@RequestBody MessageRequest request) {
        PromptTemplate promptTemplate = new PromptTemplate(dbaPromptResource);
        Map<String, Object> map = new HashMap<>();
        map.put("question", request.getUserMessage());
        map.put("context", dbSchemaDetails);
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
