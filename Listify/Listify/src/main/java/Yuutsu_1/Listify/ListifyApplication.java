package Yuutsu_1.Listify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ListifyApplication {

	public static void main(String[] args) {
		SpringApplication.run(ListifyApplication.class, args);
	}
}
