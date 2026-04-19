import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UpdateStoreSettingsRequest } from '../../core/models/store.models';
import { StoreSettingsService } from '../../core/services/store-settings.service';

@Component({
  selector: 'app-admin-store-settings-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <article class="card">
      <h2>Configuracoes da loja</h2>

      <form [formGroup]="form" (ngSubmit)="save()">
        <label>
          Nome da loja
          <input type="text" formControlName="storeName" />
        </label>

        <label>
          WhatsApp
          <input type="text" formControlName="whatsappNumber" />
        </label>

        <label>
          Label do horario
          <input type="text" formControlName="scheduleLabel" />
        </label>

        <label>
          Timezone
          <input type="text" formControlName="timeZone" />
        </label>

        <label>
          Dias de abertura (0-6, separado por virgula)
          <input type="text" formControlName="openDaysCsv" />
        </label>

        <div class="inline-grid">
          <label>
            Hora de abertura
            <input type="number" min="0" max="23" formControlName="openHour" />
          </label>

          <label>
            Hora de fechamento
            <input type="number" min="1" max="23" formControlName="closeHour" />
          </label>
        </div>

        <p class="success" *ngIf="successMessage()">{{ successMessage() }}</p>
        <p class="error" *ngIf="errorMessage()">{{ errorMessage() }}</p>

        <button type="submit" [disabled]="form.invalid || saving()">
          {{ saving() ? 'Salvando...' : 'Salvar configuracoes' }}
        </button>
      </form>
    </article>
  `,
  styles: [
    `
      .card {
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 14px;
        background: rgba(9, 11, 17, 0.8);
        padding: 1rem;
      }

      form {
        display: grid;
        gap: 0.85rem;
      }

      label {
        display: grid;
        gap: 0.3rem;
      }

      input {
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(7, 9, 14, 0.65);
        color: #f7f9ff;
        padding: 0.55rem 0.65rem;
      }

      .inline-grid {
        display: grid;
        gap: 0.8rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      button {
        border: 0;
        border-radius: 999px;
        padding: 0.55rem 0.85rem;
        background: #f9bd44;
        color: #2c2217;
        font-weight: 700;
        cursor: pointer;
      }

      .success {
        margin: 0;
        color: #8ee0b2;
      }

      .error {
        margin: 0;
        color: #ff9f9f;
      }

      @media (max-width: 720px) {
        .inline-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class AdminStoreSettingsPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly storeSettingsService = inject(StoreSettingsService);

  readonly saving = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    storeName: ['', [Validators.required]],
    whatsappNumber: ['', [Validators.required]],
    scheduleLabel: ['', [Validators.required]],
    timeZone: ['America/Recife', [Validators.required]],
    openDaysCsv: ['0,2,3,4,5,6', [Validators.required]],
    openHour: [17, [Validators.required, Validators.min(0), Validators.max(23)]],
    closeHour: [22, [Validators.required, Validators.min(1), Validators.max(23)]],
  });

  ngOnInit(): void {
    this.storeSettingsService.getAdminStoreSettings().subscribe({
      next: (settings) => {
        this.form.patchValue({
          storeName: settings.storeName,
          whatsappNumber: settings.whatsappNumber,
          scheduleLabel: settings.scheduleLabel,
          timeZone: settings.timeZone,
          openDaysCsv: settings.openDays.join(','),
          openHour: settings.openHour,
          closeHour: settings.closeHour,
        });
      },
      error: () => {
        this.errorMessage.set('Nao foi possivel carregar configuracoes da loja.');
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();
    const payload: UpdateStoreSettingsRequest = {
      storeName: value.storeName,
      whatsappNumber: value.whatsappNumber,
      scheduleLabel: value.scheduleLabel,
      timeZone: value.timeZone,
      openHour: value.openHour,
      closeHour: value.closeHour,
      openDays: value.openDaysCsv
        .split(',')
        .map((item) => Number(item.trim()))
        .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6),
    };

    this.storeSettingsService.updateAdminStoreSettings(payload).subscribe({
      next: () => {
        this.successMessage.set('Configuracoes salvas com sucesso.');
      },
      error: () => {
        this.errorMessage.set('Nao foi possivel salvar configuracoes.');
      },
      complete: () => {
        this.saving.set(false);
      },
    });
  }
}
