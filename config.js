/**
 * DPRO 中古車買取・販売 LINE
 * STEP CAR-14 査定・買取契約・販売在庫ライフサイクル
 */
window.DPRO_CAR_CONFIG = Object.freeze({
  version: "CAR-14-APPRAISAL-PURCHASE-INVENTORY-LIFECYCLE-20260723",
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
  ownerCustomerVehicle360: true,
  ownerCustomerEdit: true,
  ownerCustomerVehicleEdit: true,
  ownerDuplicateCandidateCheck: true,
  ownerAppraisalLifecycle: true,
  ownerPurchaseContractAutocreate: true,
  ownerInventoryConversion: true,
  ownerInventoryTaskAutocreate: true,
  privateAppraisalPhotoAutoPublish: false,
});
