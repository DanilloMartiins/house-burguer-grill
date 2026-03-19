const WEEKDAY_LABELS = {
  0: 'domingo',
  1: 'segunda',
  2: 'terça',
  3: 'quarta',
  4: 'quinta',
  5: 'sexta',
  6: 'sábado',
};

function getBusinessDateParts(timeZone) {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date());
  const weekdayLabel = parts.find((part) => part.type === 'weekday')?.value?.replace('.', '') ?? '';
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);

  const weekdayMap = {
    dom: 0,
    seg: 1,
    ter: 2,
    qua: 3,
    qui: 4,
    sex: 5,
    sab: 6,
  };

  return {
    weekday: weekdayMap[weekdayLabel.slice(0, 3).toLowerCase()] ?? 0,
    minutes: hour * 60 + minute,
  };
}

function getNextOpenLabel(currentWeekday, openDays) {
  for (let offset = 0; offset < 7; offset += 1) {
    const weekday = (currentWeekday + offset) % 7;
    if (openDays.includes(weekday)) {
      if (offset === 0) {
        return 'hoje às 17h';
      }

      return `${WEEKDAY_LABELS[weekday]} às 17h`;
    }
  }

  return 'em breve';
}

export function getStoreStatus(businessConfig) {
  const { weekday, minutes } = getBusinessDateParts(businessConfig.timeZone);
  const openMinutes = businessConfig.openHour * 60;
  const closeMinutes = businessConfig.closeHour * 60;
  const isOpenToday = businessConfig.openDays.includes(weekday);
  const isOpenNow = isOpenToday && minutes >= openMinutes && minutes < closeMinutes;

  const nextOpenLabel = isOpenNow
    ? 'até 22h'
    : getNextOpenLabel(
        isOpenToday && minutes < openMinutes ? weekday : (weekday + 1) % 7,
        businessConfig.openDays
      );

  return {
    isOpenNow,
    statusLabel: isOpenNow ? 'Aberto agora' : 'Fechado agora',
    detailLabel: isOpenNow ? `Atendendo hoje ${nextOpenLabel}` : `Abre ${nextOpenLabel}`,
  };
}
