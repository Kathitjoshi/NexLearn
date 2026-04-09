package ooadproject.ooadproject.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import ooadproject.ooadproject.models.ContactMessage;
import ooadproject.ooadproject.services.ContactService;
import java.util.Map;

// UC-10: Contact & Support
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/contact")
public class ContactController {
    @Autowired private ContactService contactService;

    @PostMapping
    public ResponseEntity<?> submitContact(@RequestBody ContactMessage message) {
        if (message.getName() == null || message.getName().isBlank() ||
            message.getEmail() == null || message.getEmail().isBlank() ||
            message.getSubject() == null || message.getSubject().isBlank() ||
            message.getMessage() == null || message.getMessage().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "All fields are required"));
        }
        ContactMessage saved = contactService.save(message);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Message received successfully", "id", saved.getId()));
    }
}
