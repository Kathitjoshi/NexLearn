package ooadproject.ooadproject.controllers;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ooadproject.ooadproject.dto.*;
import ooadproject.ooadproject.models.Users;
import ooadproject.ooadproject.repository.UserRepository;
import ooadproject.ooadproject.services.JwtService;
import java.util.Map;

// UC-01: User Registration  UC-02: Login/Logout
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authManager,
                          UserRepository userRepository,
                          JwtService jwtService) {
        this.authenticationManager = authManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // UC-02: Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String token = jwtService.generateToken(userDetails);
            Users user = userRepository.findByUsername(request.getUsername()).orElseThrow();
            UserDTO userDTO = new UserDTO(user.getId(), user.getUsername(), user.getEmail(),
                    user.getFirstName(), user.getLastName(), user.getRole());
            return ResponseEntity.ok(new AuthResponse(token, userDTO));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        }
    }

    // UC-01: Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Check duplicate username
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already in use"));
        }
        // Check duplicate email
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already in use"));
        }
        Users user = new Users(request.getUsername(), request.getEmail(),
                request.getPassword(), request.getRole(),
                request.getFirstName(), request.getLastName());
        userRepository.save(user);
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername()).password(user.getPassword())
                .authorities("ROLE_" + user.getRole()).build();
        String token = jwtService.generateToken(userDetails);
        UserDTO userDTO = new UserDTO(user.getId(), user.getUsername(), user.getEmail(),
                user.getFirstName(), user.getLastName(), user.getRole());
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token, userDTO));
    }
}
