package ooadproject.ooadproject.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ooadproject.ooadproject.models.ContactMessage;
import ooadproject.ooadproject.repository.ContactMessageRepository;
@Service
public class ContactService {
    @Autowired private ContactMessageRepository contactMessageRepository;
    public ContactMessage save(ContactMessage msg) { return contactMessageRepository.save(msg); }
}
