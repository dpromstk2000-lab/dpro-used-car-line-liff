/**
 * DPRO 中古車買取・販売 LINE
 * STEP CAR-12 オーナーPC NEXT共通設定
 */
window.DPRO_CAR_CONFIG = Object.freeze({
  version: "CAR-12-OWNER-PC-NEXT-20260722",
  apiBase: "https://dpro-used-car-line-api.dpromstk2000.workers.dev",
  companyCode: "dpro_used_car_demo",
  liffId: "",
  defaultLineUserId: "demo_car_line_001",
  reservationDaysAhead: 60,
  slotMinutes: 30,
  maxPhotoCount: 8,
  maxPhotoSizeBytes: 5 * 1024 * 1024,
  appraisalPhotoMaxCount: 8,
  listingPhotoMaxCount: 12,
  ownerSimpleMode: true,
  ownerDetailPanel: true,
  ownerLazyRender: true,
});
