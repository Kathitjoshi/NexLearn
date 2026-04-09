package ooadproject.ooadproject.dto;
public class AuthResponse {
    private String token;
    private UserDTO user;
    public AuthResponse(String token, UserDTO user) { this.token = token; this.user = user; }
    public String getToken() { return token; }
    public void setToken(String t) { this.token = t; }
    public UserDTO getUser() { return user; }
    public void setUser(UserDTO u) { this.user = u; }
}
