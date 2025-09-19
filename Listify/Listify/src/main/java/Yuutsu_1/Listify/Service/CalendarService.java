package Yuutsu_1.Listify.Service;

import Yuutsu_1.Listify.Entity.CalendarEntity;
import Yuutsu_1.Listify.Entity.TaskEntity;
import Yuutsu_1.Listify.Repository.TaskRepository;
import Yuutsu_1.Listify.Repository.CalendarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class CalendarService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CalendarRepository calendarRepository;

    // Method to fetch all tasks
    public List<TaskEntity> getAllTasks() {
        return taskRepository.findAll(); // Fetch all tasks from the repository
    }

    // Method to assign a task to a specific date in the calendar
 // Method to assign a task to a specific date in the calendar
    public CalendarEntity assignTaskToDate(Long taskId, String date) {
        Optional<TaskEntity> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            TaskEntity task = taskOpt.get();
            LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE);

            CalendarEntity calendarEntry = new CalendarEntity();
            calendarEntry.setDate(localDate);
            calendarEntry.setTask(task); // Set the task reference

            return calendarRepository.save(calendarEntry);
        }
        throw new IllegalArgumentException("Task not found.");
    }

}
