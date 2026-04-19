import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { CartService } from '../core/services/cart.service';

@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="page-shell">
      <header class="topbar">
        <a class="brand" routerLink="/">House Burguer Grill</a>

        <nav class="menu-links">
          <a routerLink="/" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: true }"
            >Cardapio</a
          >
          <a routerLink="/orders" routerLinkActive="is-active">Meus pedidos</a>
          <a *ngIf="authService.isAdmin()" routerLink="/admin" routerLinkActive="is-active"
            >Admin</a
          >
        </nav>

        <div class="topbar-actions">
          <a class="cart-chip" routerLink="/checkout">
            Carrinho <strong>{{ cartService.totalItems() }}</strong>
          </a>

          <ng-container *ngIf="authService.isAuthenticated(); else authButtons">
            <span class="user-email">{{ authService.email() }}</span>
            <button type="button" class="btn ghost" (click)="logout()">Sair</button>
          </ng-container>

          <ng-template #authButtons>
            <a class="btn ghost" routerLink="/login">Entrar</a>
            <a class="btn solid" routerLink="/register">Criar conta</a>
          </ng-template>
        </div>
      </header>

      <main class="content-wrap">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
    .page-shell {
      min-height: 100vh;
    }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 20;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: rgba(18, 20, 31, 0.85);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .brand {
      color: #fef3d0;
      text-decoration: none;
      font-weight: 700;
      letter-spacing: 0.4px;
      font-size: 1.1rem;
    }

    .menu-links {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }

    .menu-links a {
      color: #d4d9f2;
      text-decoration: none;
      font-size: 0.95rem;
      padding: 0.3rem 0.5rem;
      border-radius: 999px;
    }

    .menu-links a.is-active {
      background: rgba(249, 189, 68, 0.2);
      color: #ffd574;
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .cart-chip {
      text-decoration: none;
      color: #ffffff;
      background: #a23b1f;
      padding: 0.4rem 0.75rem;
      border-radius: 999px;
      font-size: 0.85rem;
    }

    .user-email {
      color: #cbd1ee;
      font-size: 0.85rem;
      max-width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .btn {
      border: 1px solid transparent;
      border-radius: 999px;
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      text-decoration: none;
      cursor: pointer;
    }

    .btn.ghost {
      color: #f8f0d7;
      background: transparent;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .btn.solid {
      color: #231b10;
      background: #f9bd44;
    }

    .content-wrap {
      width: min(1150px, 100% - 2rem);
      margin: 1.5rem auto 2.5rem;
    }

    @media (max-width: 900px) {
      .topbar {
        position: static;
      }

      .menu-links {
        order: 3;
        width: 100%;
        justify-content: flex-start;
        overflow-x: auto;
      }

      .topbar-actions {
        margin-left: auto;
      }
    }
  `,
  ],
})
export class PublicShellComponent {
  readonly authService = inject(AuthService);
  readonly cartService = inject(CartService);

  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        void this.router.navigateByUrl('/');
      },
    });
  }
}
