import { MenuCategoryResponse } from '../models/menu.models';
import { StoreSettingsResponse } from '../models/store.models';

export const PUBLIC_STORE_SETTINGS_MOCK: StoreSettingsResponse = {
  id: 1,
  storeName: 'House Burguer Grill',
  whatsappNumber: '5581989543788',
  scheduleLabel: 'Ter, Qua, Qui, Sex, Sab e Dom - 17h as 22h',
  timeZone: 'America/Recife',
  openDays: [2, 3, 4, 5, 6, 0],
  openHour: 17,
  closeHour: 22,
};

export const PUBLIC_MENU_MOCK: MenuCategoryResponse[] = [
  {
    id: 1,
    title: 'Artesanais',
    items: [
      {
        id: 101,
        categoryId: 1,
        categoryTitle: 'Artesanais',
        name: 'Classic Burguer',
        description:
          'Hamburguer artesanal 100g, queijo mussarela, alface, tomate e maionese da casa.',
        price: 17,
        imageUrl: '/assets/images/classic_burguer.png',
        tag: 'Classico da casa',
        pitch: 'Equilibrio entre suculencia, frescor e cremosidade.',
      },
      {
        id: 102,
        categoryId: 1,
        categoryTitle: 'Artesanais',
        name: 'Bacon Burguer',
        description:
          'Hamburguer artesanal 100g, bacon crocante, queijo mussarela, cebola caramelizada e molho barbecue.',
        price: 19,
        imageUrl: '/assets/images/bacon_burguer.png',
        tag: 'Mais pedido',
        pitch: 'Defumado e intenso para quem curte uma mordida marcante.',
      },
      {
        id: 103,
        categoryId: 1,
        categoryTitle: 'Artesanais',
        name: 'Burguer da Casa',
        description:
          'Hamburguer artesanal 100g, cream cheese, queijo coalho, cebola caramelizada e tomate.',
        price: 15,
        imageUrl: '/assets/images/burguer_da_asa.png',
        tag: 'Receita exclusiva',
        pitch: 'Cremoso na medida e com identidade da casa.',
      },
      {
        id: 104,
        categoryId: 1,
        categoryTitle: 'Artesanais',
        name: 'Cupim Burguer',
        description:
          'Hamburguer, cupim desfiado, queijo cheddar, bacon, cebola caramelizada e alface.',
        price: 28,
        imageUrl: '/assets/images/houseBurguerAlberto.png',
        tag: 'Premium',
        pitch: 'Recheio robusto para quem quer lanche pesado.',
      },
    ],
  },
  {
    id: 2,
    title: 'Tradicionais e Lanches',
    items: [
      {
        id: 201,
        categoryId: 2,
        categoryTitle: 'Tradicionais e Lanches',
        name: 'Frango Burguer',
        description:
          'Frango desfiado, batata palha, molho barbecue, cenoura, queijo mussarela e alface.',
        price: 18,
        tag: 'Leve e crocante',
        pitch: 'Frango bem temperado com textura crocante.',
      },
      {
        id: 202,
        categoryId: 2,
        categoryTitle: 'Tradicionais e Lanches',
        name: 'Tradicional Carpina',
        description: 'Hamburguer, queijo mussarela, alface, cebola e tomate.',
        price: 8,
        tag: 'Preco amigo',
        pitch: 'Lanche simples, direto e eficiente.',
      },
      {
        id: 203,
        categoryId: 2,
        categoryTitle: 'Tradicionais e Lanches',
        name: 'Chicken Burguer',
        description: 'Empanado de frango, cream cheese, cebola, alface e tomate.',
        price: 8,
        tag: 'Crosta dourada',
        pitch: 'Frango empanado com frescor e cremosidade.',
      },
    ],
  },
  {
    id: 3,
    title: 'Bebidas',
    items: [
      {
        id: 301,
        categoryId: 3,
        categoryTitle: 'Bebidas',
        name: 'Refrigerante lata',
        description: 'Bebida gelada em lata.',
        price: 6,
        tag: 'Geladinho',
      },
      {
        id: 302,
        categoryId: 3,
        categoryTitle: 'Bebidas',
        name: 'Agua Mineral',
        description: 'Agua mineral sem gas.',
        price: 3,
        tag: 'Essencial',
      },
      {
        id: 303,
        categoryId: 3,
        categoryTitle: 'Bebidas',
        name: 'Suco copo 300ml',
        description: 'Suco natural em copo de 300ml.',
        price: 4,
        tag: 'Refrescante',
      },
    ],
  },
  {
    id: 4,
    title: 'Acompanhamentos',
    items: [
      {
        id: 401,
        categoryId: 4,
        categoryTitle: 'Acompanhamentos',
        name: 'Batata Frita (P)',
        description: 'Porcao pequena de batata frita crocante.',
        price: 8,
        tag: 'Crocrancia extra',
      },
      {
        id: 402,
        categoryId: 4,
        categoryTitle: 'Acompanhamentos',
        name: 'Batata cheddar e bacon',
        description: 'Batata frita coberta com cheddar e bacon.',
        price: 15,
        tag: 'Irresistivel',
      },
      {
        id: 403,
        categoryId: 4,
        categoryTitle: 'Acompanhamentos',
        name: 'Aneis de cebola',
        description: 'Porcao de aneis de cebola empanados.',
        price: 8,
        tag: 'Douradinho',
      },
    ],
  },
];
