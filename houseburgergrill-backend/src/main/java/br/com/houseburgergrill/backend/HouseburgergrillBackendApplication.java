package br.com.houseburgergrill.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class HouseburgergrillBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HouseburgergrillBackendApplication.class, args);
    }
}
