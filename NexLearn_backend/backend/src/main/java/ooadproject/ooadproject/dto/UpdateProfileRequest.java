package ooadproject.ooadproject.dto;
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String password;
    public String getFirstName() { return firstName; }
    public void setFirstName(String f) { this.firstName = f; }
    public String getLastName() { return lastName; }
    public void setLastName(String l) { this.lastName = l; }
    public String getPassword() { return password; }
    public void setPassword(String p) { this.password = p; }
}
