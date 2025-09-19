package Yuutsu_1.Listify.Repository;

import Yuutsu_1.Listify.Entity.CalendarEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface CalendarRepository extends JpaRepository<CalendarEntity, Long> {
    Optional<CalendarEntity> findByDate(LocalDate date);
}
