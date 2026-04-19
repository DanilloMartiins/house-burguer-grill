package br.com.houseburgergrill.backend.config.properties;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    @NotNull
    private final Security security = new Security();

    @NotNull
    private final Cors cors = new Cors();

    @Getter
    @Setter
    public static class Security {

        @NotNull
        private final Jwt jwt = new Jwt();
    }

    @Getter
    @Setter
    public static class Jwt {

        @NotBlank
        private String secret;

        @NotNull
        private Duration accessTokenExpiration = Duration.ofMinutes(15);

        @NotNull
        private Duration refreshTokenExpiration = Duration.ofDays(7);
    }

    @Getter
    @Setter
    public static class Cors {

        private List<String> allowedOrigins = new ArrayList<>(List.of("http://localhost:4200"));
    }
}
