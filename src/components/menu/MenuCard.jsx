import { FoodIllustration } from './FoodIllustration.jsx';
import { formatCurrency } from '../../utils/currency.js';

export function MenuCard({ item, onSelect }) {
  return (
    <article
      className="menu-card menu-card--interactive"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(item);
        }
      }}
    >
      <div className="menu-card-media">
        <FoodIllustration item={item} />
      </div>
      <div className="menu-card-body">
        <div className="menu-card-glow" aria-hidden="true"></div>
        <span className="menu-card-tag">{item.tag}</span>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="menu-card-footer">
          <strong>{formatCurrency(item.price)}</strong>
          <span className="menu-card-link" aria-hidden="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14"></path>
              <path d="m13 6 6 6-6 6"></path>
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
