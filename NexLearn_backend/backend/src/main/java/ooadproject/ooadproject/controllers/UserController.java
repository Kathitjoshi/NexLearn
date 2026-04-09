package ooadproject.ooadproject.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import ooadproject.ooadproject.dto.*;
import ooadproject.ooadproject.models.Users;
import ooadproject.ooadproject.services.UserService;
import java.util.*;

// UC-09: User Profile Management
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/users")
public class UserController {
    @Autowired private UserService userService;

    @GetMapping
    public List<Users> getAllUsers() { return userService.getAllUsers(); }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Users user = userService.getUserById(id);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    // UC-09: Update profile (name and/or password)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id,
                                        @RequestBody UpdateProfileRequest request) {
        Users user = userService.getUserById(id);
        if (user == null) return ResponseEntity.notFound().build();
        if (request.getFirstName() != null && !request.getFirstName().isBlank())
            user.setFirstName(request.getFirstName());
        if (request.getLastName() != null && !request.getLastName().isBlank())
            user.setLastName(request.getLastName());
        if (request.getPassword() != null && !request.getPassword().isBlank())
            user.setPassword(request.getPassword());
        Users updated = userService.updateUser(user);
        UserDTO dto = new UserDTO(updated.getId(), updated.getUsername(), updated.getEmail(),
                updated.getFirstName(), updated.getLastName(), updated.getRole());
        return ResponseEntity.ok(dto);
    }
}
