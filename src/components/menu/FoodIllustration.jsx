const INGREDIENT_STYLES = [
  { match: /pão/i, fill: '#e8b76a', stroke: '#c88f44', height: 22, type: 'bun-top' },
  {
    match: /hambúrguer|hamburguer|carne|cupim|calabresa|salsicha|presunto/i,
    fill: '#6b3521',
    stroke: '#4a2112',
    height: 18,
  },
  { match: /frango/i, fill: '#d38f3a', stroke: '#9a6321', height: 18 },
  { match: /queijo|cheddar|cream cheese/i, fill: '#f2c94c', stroke: '#d6a72b', height: 12 },
  { match: /alface|cenoura|ervilha/i, fill: '#69b34c', stroke: '#4b8b36', height: 10 },
  { match: /tomate/i, fill: '#d94b45', stroke: '#ad302b', height: 10 },
  { match: /cebola/i, fill: '#c7995f', stroke: '#9e713d', height: 10 },
  { match: /barbecue|molho/i, fill: '#8d3d2b', stroke: '#692816', height: 8 },
  { match: /ovo/i, fill: '#f8f0cf', stroke: '#d7c88c', height: 12 },
  { match: /batata/i, fill: '#f5cf67', stroke: '#cfa73f', height: 8 },
  {
    match: /água|suco|refrigerante/i,
    fill: '#61b7ff',
    stroke: '#3c8bce',
    height: 42,
    type: 'drink',
  },
];

function getIngredientStyle(ingredient) {
  return INGREDIENT_STYLES.find((style) => style.match.test(ingredient));
}

export function FoodIllustration({ item }) {
  if (item.image) {
    return (
      <img
        className="product-illustration product-photo"
        src={item.image}
        alt={item.name}
        loading="lazy"
      />
    );
  }

  const visibleIngredients = item.ingredients.slice(0, 6);
  const drinkStyle = visibleIngredients
    .map(getIngredientStyle)
    .find((style) => style?.type === 'drink');

  if (drinkStyle) {
    return (
      <svg className="product-illustration" viewBox="0 0 320 240" role="img" aria-label={item.name}>
        <defs>
          <linearGradient id="drink-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a1608" />
            <stop offset="100%" stopColor="#120b05" />
          </linearGradient>
          <linearGradient id="drink-liquid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#86d0ff" />
            <stop offset="100%" stopColor="#2f84d6" />
          </linearGradient>
        </defs>
        <rect width="320" height="240" rx="32" fill="url(#drink-bg)" />
        <circle cx="92" cy="56" r="34" fill="rgba(246,190,59,0.16)" />
        <circle cx="252" cy="188" r="48" fill="rgba(246,190,59,0.12)" />
        <rect x="118" y="42" width="84" height="18" rx="9" fill="#f0db99" />
        <rect x="132" y="30" width="10" height="48" rx="5" fill="#f4e7bf" />
        <path
          d="M102 62h116l-16 128a18 18 0 0 1-18 16h-48a18 18 0 0 1-18-16Z"
          fill="rgba(255,255,255,0.14)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="4"
        />
        <path
          d="M114 76h92l-11 95a12 12 0 0 1-12 10h-46a12 12 0 0 1-12-10Z"
          fill="url(#drink-liquid)"
        />
        <text
          x="160"
          y="222"
          textAnchor="middle"
          fill="#ffd05a"
          fontFamily="Barlow, sans-serif"
          fontSize="18"
          fontWeight="700"
        >
          {item.tag}
        </text>
      </svg>
    );
  }

  const layers = visibleIngredients.map((ingredient, index) => {
    const style = getIngredientStyle(ingredient) ?? {
      fill: '#915c2f',
      stroke: '#74451e',
      height: 10,
    };
    return {
      ingredient,
      y: 152 - index * 13,
      width: 176 - index * 4,
      ...style,
    };
  });

  return (
    <svg className="product-illustration" viewBox="0 0 320 240" role="img" aria-label={item.name}>
      <defs>
        <linearGradient id="bg-burger" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#241307" />
          <stop offset="100%" stopColor="#110904" />
        </linearGradient>
        <linearGradient id="bun-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0c97d" />
          <stop offset="100%" stopColor="#d79c4a" />
        </linearGradient>
      </defs>

      <rect width="320" height="240" rx="32" fill="url(#bg-burger)" />
      <circle cx="68" cy="58" r="34" fill="rgba(246,190,59,0.14)" />
      <circle cx="256" cy="186" r="48" fill="rgba(246,190,59,0.12)" />

      <ellipse cx="160" cy="194" rx="92" ry="14" fill="rgba(0,0,0,0.35)" />
      <path
        d="M88 160c8 0 136 0 144 0 9 0 16 7 16 16 0 10-8 18-18 18H90c-10 0-18-8-18-18 0-9 7-16 16-16Z"
        fill="#c1843e"
        stroke="#9b6029"
        strokeWidth="4"
      />

      {layers.reverse().map((layer, index) => (
        <rect
          key={`${layer.ingredient}-${index}`}
          x={160 - layer.width / 2}
          y={layer.y}
          width={layer.width}
          height={layer.height}
          rx={layer.height / 2}
          fill={layer.type === 'bun-top' ? 'url(#bun-top)' : layer.fill}
          stroke={layer.stroke}
          strokeWidth="3"
        />
      ))}

      <path
        d="M90 82c8-22 30-34 70-34 42 0 66 13 74 34l6 26H84Z"
        fill="url(#bun-top)"
        stroke="#b97c31"
        strokeWidth="4"
      />
      <circle cx="124" cy="78" r="2.4" fill="#fff3cb" />
      <circle cx="152" cy="68" r="2.4" fill="#fff3cb" />
      <circle cx="178" cy="82" r="2.4" fill="#fff3cb" />
      <circle cx="204" cy="73" r="2.4" fill="#fff3cb" />

      <text
        x="160"
        y="224"
        textAnchor="middle"
        fill="#ffd05a"
        fontFamily="Barlow, sans-serif"
        fontSize="18"
        fontWeight="700"
      >
        {item.tag}
      </text>
    </svg>
  );
}
