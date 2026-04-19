import { StoreSettingsResponse, StoreStatusSnapshot } from '../models/store.models';

const WEEKDAY_LABELS: Record<number, string> = {
  0: 'domingo',
  1: 'segunda',
  2: 'terca',
  3: 'quarta',
  4: 'quinta',
  5: 'sexta',
  6: 'sabado',
};

export function buildStoreStatus(settings: StoreSettingsResponse | null): StoreStatusSnapshot {
  if (!settings) {
    return {
      isOpenNow: false,
      statusLabel: 'Indisponivel',
      detailLabel: 'Sem dados de funcionamento.',
    };
  }

  const now = new Date();
  const localWeekday = Number(
    new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: settings.timeZone })
      .format(now)
      .replace('.', '')
      .toLowerCase()
      .slice(0, 3)
      .replace('sab', '6')
      .replace('dom', '0')
      .replace('seg', '1')
      .replace('ter', '2')
      .replace('qua', '3')
      .replace('qui', '4')
      .replace('sex', '5'),
  );

  const hour = Number(new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', hour12: false, timeZone: settings.timeZone }).format(now));
  const minute = Number(new Intl.DateTimeFormat('pt-BR', { minute: '2-digit', timeZone: settings.timeZone }).format(now));
  const minutes = hour * 60 + minute;
  const openMinutes = settings.openHour * 60;
  const closeMinutes = settings.closeHour * 60;

  const isOpenToday = settings.openDays.includes(localWeekday);
  const isOpenNow = isOpenToday && minutes >= openMinutes && minutes < closeMinutes;

  if (isOpenNow) {
    return {
      isOpenNow,
      statusLabel: 'Aberto agora',
      detailLabel: `Atendendo ate ${settings.closeHour}h`,
    };
  }

  const nextOpenDay = findNextOpenDay(localWeekday, settings.openDays);
  const nextOpenLabel = nextOpenDay === localWeekday ? 'hoje' : WEEKDAY_LABELS[nextOpenDay] ?? 'em breve';

  return {
    isOpenNow,
    statusLabel: 'Fechado agora',
    detailLabel: `Abre ${nextOpenLabel} as ${settings.openHour}h`,
  };
}

function findNextOpenDay(currentDay: number, openDays: number[]): number {
  for (let offset = 0; offset <= 7; offset += 1) {
    const candidate = (currentDay + offset) % 7;
    if (openDays.includes(candidate)) {
      return candidate;
    }
  }

  return currentDay;
}
