package Yuutsu_1.Listify.Contrtoller;

import Yuutsu_1.Listify.Entity.NotificationEntity;
import Yuutsu_1.Listify.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationEntity>> getNotifications() {
        List<NotificationEntity> notifications = notificationService.getNotifications();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationEntity>> getUnreadNotifications() {
        List<NotificationEntity> unreadNotifications = notificationService.getUnreadNotifications();
        return ResponseEntity.ok(unreadNotifications);
    }

    @PutMapping("/{id}/read")
public ResponseEntity<String> markAsRead(@PathVariable Long id) {
    try {
        notificationService.markAsRead(id); // Delegate the logic to the service layer
        return ResponseEntity.ok("Notification marked as read.");
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
}


    @PostMapping("/generate")
    public ResponseEntity<String> generateNotifications() {
        notificationService.generateNotifications();
        return ResponseEntity.ok("Notifications checked and generated.");
    }
}
