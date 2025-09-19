package Yuutsu_1.Listify.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Yuutsu_1.Listify.Entity.AdminEntity;
import Yuutsu_1.Listify.Repository.AdminRepository;

import java.util.Optional;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    public AdminEntity registerAdmin(AdminEntity admin) {
        return adminRepository.save(admin);
    }

    public Optional<AdminEntity> loginAdmin(String email, String password) {
        return adminRepository.findByEmailAndPassword(email, password);
    }
}
