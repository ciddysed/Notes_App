package Yuutsu_1.Listify.Contrtoller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import Yuutsu_1.Listify.Entity.StudentEntity;
import Yuutsu_1.Listify.Entity.AdminEntity;
import Yuutsu_1.Listify.Service.StudentService;

import Yuutsu_1.Listify.Service.AdminService;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private StudentService userService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private JavaMailSender mailSender;

    private final Map<Long, String> verificationCodes = new HashMap<>();

    // Endpoint to register a new student user
    @PostMapping("/register/user")
    public ResponseEntity<?> registerUser(@RequestBody StudentEntity user) {
        try {
            StudentEntity registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User registration failed: " + e.getMessage());
        }
    }

    // Endpoint to register a new admin
    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody AdminEntity admin) {
        try {
            AdminEntity registeredAdmin = adminService.registerAdmin(admin);
            return ResponseEntity.ok(registeredAdmin);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Admin registration failed: " + e.getMessage());
        }
    }

    // Endpoint to login a student user
    @PostMapping("/login/user")
    public ResponseEntity<?> loginUser(@RequestBody StudentEntity user) {
        return userService.loginUser(user.getEmail(), user.getPassword())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials"));
    }

    // Endpoint to login an admin
    @PostMapping("/login/admin")
    public ResponseEntity<?> loginAdmin(@RequestBody AdminEntity admin) {
        return adminService.loginAdmin(admin.getEmail(), admin.getPassword())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials"));
    }

        @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailExists(@RequestParam String email) {
        boolean exists = userService.checkEmailExists(email);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<?> getStudentDetails(@PathVariable Long id) {
        try {
            StudentEntity student = userService.getStudentById(id);
            return ResponseEntity.ok(student);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found: " + e.getMessage());
        }
    }

    // Endpoint to update student details
    @PutMapping("/student/{id}")
    public ResponseEntity<?> updateStudentDetails(@PathVariable Long id, @RequestBody StudentEntity updatedStudent) {
        try {
            StudentEntity student = userService.updateStudent(id, updatedStudent);
            return ResponseEntity.ok(student);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update student: " + e.getMessage());
        }
    }
    @PostMapping("/send-verification-code")
    public ResponseEntity<?> sendVerificationCode(@RequestParam Long userId, @RequestParam String email) {
    String code = String.valueOf(new Random().nextInt(899999) + 100000); // 6-digit code
    verificationCodes.put(userId, code);

    try {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your Verification Code");
        message.setText("Your code is: " + code);
        mailSender.send(message);
        return ResponseEntity.ok("Verification code sent.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email.");
    }
}
@PostMapping("/update-email")
public ResponseEntity<?> updateEmail(
    @RequestParam Long userId,
    @RequestParam String newEmail,
    @RequestParam String code
) {
    String expected = verificationCodes.get(userId);
    if (expected == null || !expected.equals(code)) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid verification code.");
    }

    StudentEntity student = userService.getStudentById(userId);
    student.setEmail(newEmail);
    userService.registerUser(student);
    verificationCodes.remove(userId);
    return ResponseEntity.ok("Email updated.");
}
@PostMapping("/update-password")
public ResponseEntity<?> updatePassword(
    @RequestParam Long userId,
    @RequestParam String newPassword,
    @RequestParam String code
) {
    String expected = verificationCodes.get(userId);
    if (expected == null || !expected.equals(code)) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid verification code.");
    }

    StudentEntity student = userService.getStudentById(userId);
    student.setPassword(newPassword);
    userService.registerUser(student);
    verificationCodes.remove(userId);
    return ResponseEntity.ok("Password updated.");
}
}

