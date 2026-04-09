package ooadproject.ooadproject.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ooadproject.ooadproject.models.Users;
import ooadproject.ooadproject.repository.UserRepository;
import java.util.List;
@Service
public class UserService {
    @Autowired private UserRepository userRepository;
    public List<Users> getAllUsers() { return userRepository.findAll(); }
    public Users getUserById(String id) { return userRepository.findById(id).orElse(null); }
    public Users updateUser(Users user) { return userRepository.save(user); }
}
