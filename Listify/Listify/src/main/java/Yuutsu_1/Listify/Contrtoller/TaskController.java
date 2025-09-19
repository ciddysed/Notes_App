package Yuutsu_1.Listify.Contrtoller;

import Yuutsu_1.Listify.Entity.TaskEntity;
import Yuutsu_1.Listify.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/getAllTasks")
    public ResponseEntity<List<TaskEntity>> getAllTasks() {
        List<TaskEntity> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/posttask")
    public ResponseEntity<TaskEntity> createTask(@RequestBody TaskEntity taskEntity) {
        try {
            TaskEntity savedTask = taskService.postTask(taskEntity);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/putTaskDetails/{id}")
    public ResponseEntity<TaskEntity> updateTask(@PathVariable Long id, @RequestBody TaskEntity updatedTask) {
        try {
            TaskEntity savedTask = taskService.putTaskDetails(id, updatedTask);
            return ResponseEntity.ok(savedTask);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/deleteTask/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // New endpoint to record a task with a date
    @PostMapping("/recordTask/{date}/{taskId}")
    public ResponseEntity<String> recordTask(@PathVariable String date, @PathVariable Long taskId) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            taskService.recordTaskWithDate(localDate, taskId);
            return ResponseEntity.ok("Task recorded successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while recording the task");
        }
    }

    // New endpoint to remove the date from a task
    @PostMapping("/removeDate/{taskId}")
    public ResponseEntity<String> removeDateFromTask(@PathVariable Long taskId) {
        try {
            taskService.removeDateFromTask(taskId);
            return ResponseEntity.ok("Date removed from task successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while removing the date from the task");
        }
    }

    
}
