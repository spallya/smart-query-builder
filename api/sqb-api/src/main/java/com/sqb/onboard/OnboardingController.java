package com.sqb.onboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class OnboardingController {

    @Autowired
    private OnboardingService onboardingService;

    @PostMapping("/onboard")
    public ResponseEntity<String> onboardApp(@RequestBody AppOnboardingDto onboardingDto) {
        String message = onboardingService.onboardApp(onboardingDto);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }

}
