package ooadproject.ooadproject.dto;
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    public UserDTO() {}
    public UserDTO(String id, String username, String email, String firstName, String lastName, String role) {
        this.id = id; this.username = username; this.email = email;
        this.firstName = firstName; this.lastName = lastName; this.role = role;
    }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String u) { this.username = u; }
    public String getEmail() { return email; }
    public void setEmail(String e) { this.email = e; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String f) { this.firstName = f; }
    public String getLastName() { return lastName; }
    public void setLastName(String l) { this.lastName = l; }
    public String getRole() { return role; }
    public void setRole(String r) { this.role = r; }
}
