/**
 * DPRO 中古車買取・販売 LINE
 * PRODUCT READY R2 / authoritative safe adapter boundary
 */
window.DPRO_CAR_CONFIG = Object.freeze({
  version: "CAR-25-PRODUCT-READY-R2-20260824",
  apiBase: "https://cbknucemarcpbscirzyv.supabase.co/functions/v1/used-car-product-ready-adapter",
  legacyApiBase: "https://dpro-used-car-line-api.dpromstk2000.workers.dev",
  adapterVersion: "DPRO-CONTROL-ADAPTER-1.0-USED_CAR-R2-20260824",
  databaseVersion: "CAR-DB-PRODUCT-READY-R2-20260824",
  lineIdentity: "server_verified_id_token",
  lineCustomerBinding: "deferred_until_contract",
  ownerBinding: "deferred_until_contract",
  staffBinding: "deferred_until_contract",
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
  publicInventoryPageSize: 24,
  publicInventoryMaxPageSize: 48,
  publicInventoryUrlState: true,
  publicInventoryAdvancedFilters: true,
  publicVehicleShare: true,
  ownerInventoryPublishReadiness: true,
  ownerInventoryPublicPreview: true,
  ownerSalesJourney360: true,
  ownerSalesLeadEdit: true,
  ownerSalesContractAutocreate: true,
  ownerSalesNextActionTask: true,
  ownerSalesLostReason: true,
  ownerSaleContractDelivery360: true,
  ownerSaleContractEdit: true,
  ownerDeliveryTaskSync: true,
  ownerDeliveryCompletionGuard: true,
  ownerDeliveryFollowupAutocreate: true,
  ownerAftercareOverview: true,
  ownerAftercare360: true,
  ownerAftercareProfileEdit: true,
  ownerAftercarePlanSync: true,
  ownerServiceHistory: true,
  ownerReplacementProspect: true,
  memberAftercareSchedule: true,
  memberServiceHistory: true,
  ownerManagementDashboard: true,
  ownerManagementTargets: true,
  ownerInventoryTurnover: true,
  ownerGrossProfit: true,
  ownerConversionMetrics: true,
  ownerStaffPerformance: true,
  ownerCommunicationOverview: true,
  ownerCommunicationTemplates: true,
  ownerCommunicationSchedule: true,
  ownerCommunicationHistory: true,
  memberCommunicationHistory: true,
  communicationAutoSend: false,
  ownerPaymentOverview: true,
  ownerReceivableManagement: true,
  ownerPayableManagement: true,
  ownerCashflow: true,
  paymentBankAutoSync: false,
  ownerFinancialDocuments: true,
  memberFinancialDocuments: true,
  financialDocumentBrowserPrintPdf: true,
  financialDocumentServerPdfGeneration: false,
  ownerDataMigration: true,
  customerCsvImport: true,
  customerVehicleCsvImport: true,
  inventoryCsvImport: true,
  dataMigrationPreviewBeforeCommit: true,
  dataMigrationAutomaticCommit: false,
  ownerProductionReadiness: true,
  releaseAutomaticQualityGate: true,
  releaseManualSignoff: true,
  releaseDemoGuard: true,
  releaseEnvironmentAutoMutation: false,
});

/* R2 bridge: for /api/member the authoritative adapter receives a LIFF ID Token,
 * not the access token requested by the legacy page code. */
(() => {
  "use strict";
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const rawUrl = typeof input === "string" ? input : input?.url || "";
    const demo = new URL(location.href).searchParams.get("demo") === "1";
    if (rawUrl.includes("/api/member") && !demo) {
      const idToken = window.liff && typeof window.liff.getIDToken === "function" ? window.liff.getIDToken() : "";
      if (idToken) {
        const headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));
        headers.set("Authorization", `Bearer ${idToken}`);
        init = { ...init, headers };
      }
    }
    const response = await nativeFetch(input, init);
    if (rawUrl.includes("/api/admin/system-check") && response.headers.get("content-type")?.includes("application/json")) {
      try {
        const data = await response.clone().json();
        if (data?.company && !data.company.company_name) {
          data.company.company_name = "DPRO中古車センター";
          return new Response(JSON.stringify(data), { status: response.status, headers: response.headers });
        }
      } catch {}
    }
    return response;
  };

  const removeTechnicalCopy = () => {
    document.querySelectorAll("body *").forEach((node) => {
      if (node.children.length === 0 && node.textContent && node.textContent.includes("Supabase")) {
        node.textContent = node.textContent.replace(/Supabase/g, "システム");
      }
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", removeTechnicalCopy, { once: true });
  else removeTechnicalCopy();
})();
