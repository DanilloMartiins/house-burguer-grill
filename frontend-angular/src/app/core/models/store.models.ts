export interface StoreSettingsResponse {
  id: number;
  storeName: string;
  whatsappNumber: string;
  scheduleLabel: string;
  timeZone: string;
  openDays: number[];
  openHour: number;
  closeHour: number;
}

export interface UpdateStoreSettingsRequest {
  storeName: string;
  whatsappNumber: string;
  scheduleLabel: string;
  timeZone: string;
  openDays: number[];
  openHour: number;
  closeHour: number;
}

export interface StoreStatusSnapshot {
  isOpenNow: boolean;
  statusLabel: string;
  detailLabel: string;
}
