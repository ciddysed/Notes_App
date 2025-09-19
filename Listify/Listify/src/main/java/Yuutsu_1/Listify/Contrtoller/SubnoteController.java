package Yuutsu_1.Listify.Contrtoller; // Corrected spelling of the package name

import Yuutsu_1.Listify.Entity.SubnoteEntity;
import Yuutsu_1.Listify.Service.SubnoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subnotes")
public class SubnoteController {

    private final SubnoteService subnoteService;

    @Autowired
    public SubnoteController(SubnoteService subnoteService) {
        this.subnoteService = subnoteService;
    }

    // Get All Subnotes
    @GetMapping
    public List<SubnoteEntity> getAllSubnotes() {
        return subnoteService.getAllSubnotes();
    }

    // Get Subnotes by Task ID
    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<SubnoteEntity>> getSubnotesByTaskId(@PathVariable Long taskId) {
        List<SubnoteEntity> subnotes = subnoteService.getSubnotesByTaskId(taskId);
        return ResponseEntity.ok(subnotes);
    }

    // Create Subnote for a Specific Task
    @PostMapping("/task/{taskId}")
    public ResponseEntity<SubnoteEntity> createSubnote(@PathVariable Long taskId, @RequestBody SubnoteEntity subnote) {
        SubnoteEntity createdSubnote = subnoteService.createSubnote(taskId, subnote);
        return ResponseEntity.status(201).body(createdSubnote); // Return created response
    }

    // Update Subnote
    @PutMapping("/{id}")
    public ResponseEntity<SubnoteEntity> updateSubnote(@PathVariable Long id, @RequestBody SubnoteEntity subnoteDetails) {
        SubnoteEntity updatedSubnote = subnoteService.updateSubnote(id, subnoteDetails);
        return ResponseEntity.ok(updatedSubnote);
    }

    // Delete Subnote
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubnote(@PathVariable Long id) {
        subnoteService.deleteSubnote(id);
        return ResponseEntity.noContent().build();
    }
}
