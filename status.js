(() => {
  const statusElements = document.querySelectorAll('[data-store-status]');
  if (!statusElements.length) {
    return;
  }

  const DEFAULT_OPEN_HOUR = 17;
  const DEFAULT_CLOSE_HOUR = 22;
  const OPEN_DAYS = new Set([0, 2, 3, 4, 5, 6]); // Domingo e de terça a sábado.

  function getScheduleTextFromFooter() {
    const footerParagraphs = document.querySelectorAll('footer p');

    for (const paragraph of footerParagraphs) {
      const text = paragraph.textContent ? paragraph.textContent.trim() : '';
      if (/ter\s*a\s*dom/i.test(text)) {
        return text;
      }
    }

    return 'Ter a Dom: 17h às 22h';
  }

  function parseHours(scheduleText) {
    const match = scheduleText.match(/(\d{1,2})\s*h\s*(?:às|as|a)\s*(\d{1,2})\s*h/i);

    if (!match) {
      return { openHour: DEFAULT_OPEN_HOUR, closeHour: DEFAULT_CLOSE_HOUR };
    }

    const openHour = Number(match[1]);
    const closeHour = Number(match[2]);
    const validOpenHour = Number.isInteger(openHour) && openHour >= 0 && openHour <= 23;
    const validCloseHour = Number.isInteger(closeHour) && closeHour >= 0 && closeHour <= 23;

    if (!validOpenHour || !validCloseHour) {
      return { openHour: DEFAULT_OPEN_HOUR, closeHour: DEFAULT_CLOSE_HOUR };
    }

    return { openHour, closeHour };
  }

  const scheduleText = getScheduleTextFromFooter();
  const { openHour, closeHour } = parseHours(scheduleText);
  const openMinutes = openHour * 60;
  const closeMinutes = closeHour * 60;

  function isStoreOpen(date) {
    const day = date.getDay();
    const minutes = date.getHours() * 60 + date.getMinutes();
    return OPEN_DAYS.has(day) && minutes >= openMinutes && minutes < closeMinutes;
  }

  function updateStoreStatus() {
    const isOpen = isStoreOpen(new Date());
    const label = isOpen ? 'Aberto agora' : 'Fechado agora';

    for (const element of statusElements) {
      const labelElement = element.querySelector('.status-label');

      if (labelElement) {
        labelElement.textContent = label;
      } else {
        element.textContent = label;
      }

      element.classList.toggle('is-open', isOpen);
      element.classList.toggle('is-closed', !isOpen);
      element.setAttribute('title', `Horário: ${scheduleText}`);
    }
  }

  updateStoreStatus();
  window.setInterval(updateStoreStatus, 60000);
})();
