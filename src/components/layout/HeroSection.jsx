import { useState } from 'react';
import { MENU_CATEGORIES } from '../../data/menu.js';
import { FoodIllustration } from '../menu/FoodIllustration.jsx';

const FEATURED_ITEMS = MENU_CATEGORIES[0].items.slice(0, 3);

export function HeroSection({ onSelectItem }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = FEATURED_ITEMS[activeIndex];

  return (
    <section className="hero" id="inicio">
      <div className="overlay"></div>
      <div className="container hero-content">
        <div className="hero-announcement">
          <span className="hero-announcement-dot"></span>
          <span>Burgers artesanais montados na hora e pedido fechado em poucos toques</span>
        </div>
        <p className="hero-tag">Chapa quente, queijo derretendo e muito sabor</p>
        <h1>Seu hambúrguer da noite está aqui, alto, suculento e com cara de vício</h1>
        <p>
          Do clássico bem montado ao bacon crocante com cheddar puxando, cada burguer foi pensado
          para dar fome no olhar e satisfação de verdade na primeira mordida.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#cardapio">
            Ver cardápio completo
          </a>
          <a className="btn btn-outline" href="#localizacao">
            Onde estamos
          </a>
        </div>

        <div className="hero-proof-grid">
          <article className="hero-proof-card">
            <strong>Pão tostado e montagem caprichada</strong>
            <p>Visual bonito, altura certa e recheio bem distribuído em cada lanche.</p>
          </article>
          <article className="hero-proof-card">
            <strong>Bacon, cheddar e carne no ponto</strong>
            <p>Os favoritos da casa aparecem com força no sabor e na textura.</p>
          </article>
          <article className="hero-proof-card">
            <strong>Pedido direto no WhatsApp</strong>
            <p>Você escolhe, ajusta e finaliza rápido sem fluxo enrolado.</p>
          </article>
        </div>

        <div className="hero-highlight-bar">
          <div className="hero-highlight-item">
            <span className="hero-highlight-value">Classic Burguer</span>
            <span className="hero-highlight-label">
              maionese da casa, salada fresca e equilíbrio perfeito
            </span>
          </div>
          <div className="hero-highlight-item">
            <span className="hero-highlight-value">Bacon Burguer</span>
            <span className="hero-highlight-label">
              bacon crocante e barbecue para quem quer mais pegada
            </span>
          </div>
          <div className="hero-highlight-item">
            <span className="hero-highlight-value">Explosão Burguer</span>
            <span className="hero-highlight-label">
              camadas generosas para matar a fome de verdade
            </span>
          </div>
        </div>

        <div className="hero-desktop-feature">
          <button
            className="hero-desktop-feature-card"
            type="button"
            onClick={() => onSelectItem(activeItem)}
          >
            <div className="hero-desktop-feature-copy">
              <span>{activeItem.tag}</span>
              <strong>{activeItem.name}</strong>
              <p>{activeItem.pitch}</p>
            </div>
            <div className="hero-desktop-feature-art">
              <FoodIllustration item={activeItem} />
            </div>
          </button>
        </div>

        <div className="hero-slider hero-mobile-slider">
          <div className="hero-slider-head">
            <p className="hero-slider-label">Mais pedidos da casa</p>
            <span className="hero-slider-caption">Toque em um burger para abrir os detalhes</span>
          </div>
          <div className="hero-slider-shell">
            <button
              className="hero-featured-card"
              type="button"
              onClick={() => onSelectItem(activeItem)}
            >
              <div className="hero-featured-media">
                <FoodIllustration item={activeItem} />
                <div className="hero-featured-overlay">
                  <span>{activeItem.tag}</span>
                  <strong>{activeItem.name}</strong>
                </div>
              </div>
              <div className="hero-featured-footer">
                <p>{activeItem.pitch}</p>
                <div className="hero-featured-dots" aria-hidden="true">
                  {FEATURED_ITEMS.map((item, index) => (
                    <span
                      key={item.name}
                      className={index === activeIndex ? 'is-active' : ''}
                    ></span>
                  ))}
                </div>
              </div>
            </button>

            <div className="hero-slider-track" aria-label="Vitrine de hambúrgueres em destaque">
              {FEATURED_ITEMS.map((item, index) => (
                <button
                  className={`hero-burger-card${index === activeIndex ? ' is-active' : ''}`}
                  type="button"
                  key={item.name}
                  onClick={() => setActiveIndex(index)}
                >
                  <FoodIllustration item={item} />
                  <div className="hero-burger-copy">
                    <strong>{item.name}</strong>
                    <span>{item.tag}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
