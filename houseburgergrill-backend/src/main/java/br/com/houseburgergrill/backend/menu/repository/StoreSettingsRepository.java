package br.com.houseburgergrill.backend.menu.repository;

import br.com.houseburgergrill.backend.menu.model.StoreSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreSettingsRepository extends JpaRepository<StoreSettings, Integer> {
}
