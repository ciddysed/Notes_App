package Yuutsu_1.Listify.Contrtoller;

import Yuutsu_1.Listify.Entity.TaskEntity; // Ensure this imports the TaskEntity correctly
import Yuutsu_1.Listify.Service.CalendarService; // Ensure this imports the correct service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "http://localhost:5173") // Adjust according to your React app's URL
public class CalendarController {

    @Autowired
    private CalendarService calendarService; // Injecting the CalendarService

    @GetMapping("/getAllTasks")
    public ResponseEntity<List<TaskEntity>> getAllTasks() {
        // Fetch all tasks from the service/repository
        List<TaskEntity> tasks = calendarService.getAllTasks(); // Adjust to use a method that fetches tasks
        return ResponseEntity.ok(tasks); // Return the list wrapped in a ResponseEntity
    }

    @PostMapping("/recordTask/{date}/{taskId}")
    public ResponseEntity<String> recordTask(@PathVariable String date, @PathVariable Long taskId) {
        // Log the received parameters
        System.out.println("Received request to record task with ID: " + taskId + " for date: " + date);
        
        try {
            // Call the service method to record the task with the specified date
            calendarService.assignTaskToDate(taskId, date); // Assuming assignTaskToDate is the correct method
            return ResponseEntity.ok("Task recorded successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while recording the task");
        }
    }
}
