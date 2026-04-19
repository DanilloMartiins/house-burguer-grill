import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <section class="admin-shell">
      <header class="admin-header">
        <h1>Painel Admin</h1>
        <nav>
          <a routerLink="/admin/products" routerLinkActive="active">Produtos</a>
          <a routerLink="/admin/settings" routerLinkActive="active">Loja</a>
          <a routerLink="/admin/orders" routerLinkActive="active">Pedidos</a>
          <a routerLink="/">Voltar ao site</a>
        </nav>
      </header>

      <router-outlet />
    </section>
  `,
  styles: [
    `
      .admin-shell {
        display: grid;
        gap: 1rem;
      }

      .admin-header {
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(10, 12, 18, 0.8);
        border-radius: 14px;
        padding: 1rem;
      }

      .admin-header h1 {
        margin: 0 0 0.6rem;
      }

      .admin-header nav {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }

      .admin-header a {
        color: #f1f4ff;
        text-decoration: none;
        border-radius: 999px;
        padding: 0.35rem 0.65rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .admin-header a.active {
        border-color: transparent;
        background: #f9bd44;
        color: #2a2014;
      }
    `,
  ],
})
export class AdminShellComponent {}
