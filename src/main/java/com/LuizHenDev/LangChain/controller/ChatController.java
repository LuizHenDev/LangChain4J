package com.LuizHenDev.LangChain.controller;

import com.LuizHenDev.LangChain.Service.AssisantAiService;
import dev.langchain4j.service.Result;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final AssisantAiService assistant;

    public ChatController(AssisantAiService assistant) {
        this.assistant = assistant;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        Result<String> result = assistant.handleRequest(request.message());
        return new ChatResponse(result.content());
    }

    public record ChatRequest(String message) {
    }

    public record ChatResponse(String reply) {
    }
}
