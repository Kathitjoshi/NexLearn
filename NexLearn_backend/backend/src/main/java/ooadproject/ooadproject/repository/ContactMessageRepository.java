package ooadproject.ooadproject.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import ooadproject.ooadproject.models.ContactMessage;
public interface ContactMessageRepository extends MongoRepository<ContactMessage, String> {}
