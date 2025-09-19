package Yuutsu_1.Listify.Service;

import Yuutsu_1.Listify.Entity.SubnoteEntity;
import Yuutsu_1.Listify.Entity.TaskEntity;
import Yuutsu_1.Listify.Repository.SubnoteRepository;
import Yuutsu_1.Listify.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubnoteService {

    private final SubnoteRepository subnoteRepository;
    private final TaskRepository taskRepository;

    @Autowired
    public SubnoteService(SubnoteRepository subnoteRepository, TaskRepository taskRepository) {
        this.subnoteRepository = subnoteRepository;
        this.taskRepository = taskRepository;
    }

    // Get all subnotes
    public List<SubnoteEntity> getAllSubnotes() {
        return subnoteRepository.findAll();
    }

    // Get subnotes by task ID
    public List<SubnoteEntity> getSubnotesByTaskId(Long taskId) { // Change int to Long
        return subnoteRepository.findByTaskId(taskId);
    }

    // Create subnote for a specific task
    public SubnoteEntity createSubnote(Long taskId, SubnoteEntity subnote) { // Change int to Long
        Optional<TaskEntity> taskOpt = taskRepository.findById(taskId);
        if (taskOpt.isPresent()) {
            subnote.setTask(taskOpt.get());
            return subnoteRepository.save(subnote);
        } else {
            throw new RuntimeException("Task ID not found");
        }
    }

    // Update an existing subnote
    public SubnoteEntity updateSubnote(Long id, SubnoteEntity subnoteDetails) { // Change int to Long
        SubnoteEntity existingSubnote = subnoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subnote ID not found"));

        existingSubnote.setSubnote(subnoteDetails.getSubnote());
        return subnoteRepository.save(existingSubnote);
    }

    // Delete a subnote by ID
    public void deleteSubnote(Long id) { // Change int to Long
        if (subnoteRepository.existsById(id)) {
            subnoteRepository.deleteById(id);
        } else {
            throw new RuntimeException("Subnote ID not found");
        }
    }
}
