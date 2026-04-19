import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MenuCategoryResponse, ProductResponse } from '../../core/models/menu.models';
import { StoreStatusSnapshot } from '../../core/models/store.models';
import { CartService } from '../../core/services/cart.service';
import { MenuService } from '../../core/services/menu.service';
import { StoreSettingsService } from '../../core/services/store-settings.service';
import { buildStoreStatus } from '../../core/utils/store-status.util';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <section class="status-banner" [class.open]="storeStatus()?.isOpenNow">
      <h2>{{ storeStatus()?.statusLabel ?? 'Carregando status...' }}</h2>
      <p>{{ storeStatus()?.detailLabel ?? 'Aguarde um instante.' }}</p>
    </section>

    <section class="hero-copy">
      <h1>Cardapio online da House Burguer Grill</h1>
      <p>
        Monte seu pedido, acompanhe historico e finalize no fluxo novo da plataforma.
      </p>
      <a routerLink="/checkout" class="checkout-link">Ir para checkout</a>
    </section>

    <section *ngIf="loading()" class="loading-state">Carregando cardapio...</section>
    <section *ngIf="errorMessage()" class="error-state">{{ errorMessage() }}</section>

    <ng-container *ngFor="let category of menuCategories(); trackBy: trackCategory">
      <section class="category-wrap">
        <h3>{{ category.title }}</h3>

        <div class="product-grid">
          <article *ngFor="let item of category.items; trackBy: trackProduct" class="product-card">
            <img *ngIf="item.imageUrl" [src]="item.imageUrl" [alt]="item.name" loading="lazy" />
            <div class="product-info">
              <p class="tag" *ngIf="item.tag">{{ item.tag }}</p>
              <h4>{{ item.name }}</h4>
              <p class="description">{{ item.description }}</p>
              <div class="card-footer">
                <strong>{{ item.price | currency: 'BRL' }}</strong>
                <button type="button" (click)="addToCart(item)">Adicionar</button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </ng-container>
  `,
  styles: [
    `
      .status-banner {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 1rem 1.2rem;
        background: rgba(115, 23, 24, 0.55);
        margin-bottom: 1.25rem;
      }

      .status-banner.open {
        background: rgba(34, 97, 57, 0.45);
      }

      .status-banner h2 {
        margin: 0;
        font-size: 1.05rem;
      }

      .status-banner p {
        margin: 0.3rem 0 0;
        color: #dce2f8;
      }

      .hero-copy {
        margin-bottom: 1.25rem;
      }

      .hero-copy h1 {
        margin: 0;
        font-size: clamp(1.4rem, 3vw, 2rem);
      }

      .hero-copy p {
        color: #c4cbe8;
        margin: 0.5rem 0 1rem;
        max-width: 58ch;
      }

      .checkout-link {
        display: inline-flex;
        text-decoration: none;
        color: #2b1e0e;
        background: #f9bd44;
        border-radius: 999px;
        padding: 0.45rem 0.9rem;
        font-weight: 600;
      }

      .loading-state,
      .error-state {
        margin: 1rem 0;
        padding: 0.8rem;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.06);
      }

      .error-state {
        border: 1px solid rgba(248, 112, 112, 0.5);
      }

      .category-wrap {
        margin: 1.6rem 0;
      }

      .category-wrap h3 {
        margin: 0 0 0.8rem;
      }

      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 0.8rem;
      }

      .product-card {
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        background: rgba(10, 12, 19, 0.8);
        overflow: hidden;
      }

      .product-card img {
        width: 100%;
        height: 148px;
        object-fit: cover;
        background: rgba(0, 0, 0, 0.2);
      }

      .product-info {
        padding: 0.9rem;
      }

      .tag {
        margin: 0;
        color: #f8c86b;
        font-size: 0.75rem;
      }

      .product-info h4 {
        margin: 0.25rem 0;
      }

      .description {
        color: #c4cae4;
        min-height: 2.8rem;
        font-size: 0.9rem;
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.8rem;
      }

      .card-footer button {
        border: 0;
        border-radius: 999px;
        padding: 0.35rem 0.7rem;
        cursor: pointer;
        color: #fefefe;
        background: #a23b1f;
      }
    `,
  ],
})
export class HomePageComponent implements OnInit {
  private readonly menuService = inject(MenuService);
  private readonly storeSettingsService = inject(StoreSettingsService);
  private readonly cartService = inject(CartService);

  readonly menuCategories = signal<MenuCategoryResponse[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly storeStatus = signal<StoreStatusSnapshot | null>(null);

  ngOnInit(): void {
    this.loadMenu();
    this.loadStoreStatus();
  }

  addToCart(product: ProductResponse): void {
    this.cartService.addProduct(product);
  }

  trackCategory(_index: number, category: MenuCategoryResponse): number {
    return category.id;
  }

  trackProduct(_index: number, product: ProductResponse): number {
    return product.id;
  }

  private loadMenu(): void {
    this.menuService.getPublicMenu().subscribe({
      next: (categories) => {
        this.menuCategories.set(categories);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Nao foi possivel carregar o cardapio agora.');
        this.loading.set(false);
      },
    });
  }

  private loadStoreStatus(): void {
    this.storeSettingsService.getPublicStoreSettings().subscribe({
      next: (settings) => {
        this.storeStatus.set(buildStoreStatus(settings));
      },
      error: () => {
        this.storeStatus.set({
          isOpenNow: false,
          statusLabel: 'Status indisponivel',
          detailLabel: 'Nao conseguimos obter o horario agora.',
        });
      },
    });
  }
}
