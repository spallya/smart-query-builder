package org.springframework.ai.openai.samples.helloworld.stuff;

public class MessageRequest {

    private String userMessage;

    public String getUserMessage() {
        return userMessage;
    }

    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }
}
