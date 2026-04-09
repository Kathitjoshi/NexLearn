package ooadproject.ooadproject.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import ooadproject.ooadproject.models.Users;
import java.util.Optional;
public interface UserRepository extends MongoRepository<Users, String> {
    Optional<Users> findByUsername(String username);
    Optional<Users> findByEmail(String email);
}
