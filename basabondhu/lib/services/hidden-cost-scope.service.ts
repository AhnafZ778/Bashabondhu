import { ParsedListing, Listing, AreaProfile, SearchProfile } from "../types";
import { HiddenCostSource, HiddenCostStatus, HiddenCostSeriousness } from "../domain/hidden-cost-sources";

export function detectHiddenCostScopes(input: {
  parsedListing: ParsedListing;
  listing?: Listing;
  areaProfile?: AreaProfile;
  searchProfile?: SearchProfile;
}): HiddenCostSource[] {
  const scopes: HiddenCostSource[] = [];
  const p = input.parsedListing;
  const l = input.listing;
  const hm = p.hiddenCostMentions || {};
  const rawText = (l?.rawText || "").toLowerCase();
  
  // Helper to push a scope
  const addScope = (scope: Omit<HiddenCostSource, "category"> & { category?: any }) => {
    // Basic category mapping if missing
    let category: any = "monthly_recurring";
    if (scope.id === "advance_terms" || scope.id === "broker_fee") category = "move_in_cash";
    if (scope.id === "gas_type" || scope.id === "electricity_billing" || scope.id === "water_billing") category = "utility_living";
    if (scope.id === "road_access" || scope.id === "moving_access") category = "access_transport";
    if (scope.id === "waterlogging" || scope.id === "tenant_restriction") category = "tenant_fit";
    if (scope.id === "agreement_receipt_terms" || scope.id === "rent_increase_terms") category = "legal_terms";
    
    scopes.push({ ...scope, category } as HiddenCostSource);
  };

  // 1. Advance Terms
  if (!p.advanceMonths && !hm.advanceTerms) {
    addScope({
      id: "advance_terms",
      label: "Advance payment terms missing",
      status: "missing",
      seriousness: "medium",
      detectedFrom: [],
      whyItMatters: "Most rentals require an advance. Missing terms can lead to surprise cash requirements.",
      userImpact: "You might need to arrange a large sum of cash suddenly.",
      askBeforeVisit: [
        "How many months advance is required?",
        "Is the advance adjustable or refundable?",
        "Will this be written in the rental agreement?"
      ],
      proofToRequest: ["Written agreement draft", "Message confirming advance terms"]
    });
  } else if (p.advanceMonths && p.advanceMonths >= 2 && !hm.agreementReceiptTerms) {
    addScope({
      id: "advance_terms",
      label: "High advance without written agreement",
      status: "unclear",
      seriousness: "critical",
      detectedFrom: ["High advance months"],
      whyItMatters: "Paying a high advance without an agreement poses a legal and financial risk.",
      userImpact: "You could lose your deposit if the owner denies it later.",
      askBeforeVisit: [
        "Will there be a written rental agreement?",
        "Will I receive a receipt for the advance?"
      ],
      proofToRequest: ["Written agreement draft", "Payment receipt confirmation"]
    });
  } else if (hm.advanceTerms) {
    addScope({
      id: "advance_terms",
      label: "Advance terms unclear",
      status: "unclear",
      seriousness: "high",
      detectedFrom: [hm.advanceTerms],
      whyItMatters: "Unclear advance terms might mean negotiable or variable deposits.",
      userImpact: "You may have to negotiate hard before moving in.",
      askBeforeVisit: ["How many months advance is required?", "Is it adjustable?"],
      proofToRequest: ["Message confirming advance terms"]
    });
  }

  // 2. Service Charge
  const scMention = hm.serviceCharge || p.serviceCharge;
  if (!scMention) {
    addScope({
      id: "service_charge",
      label: "Service charge missing",
      status: "missing",
      seriousness: "high",
      detectedFrom: [],
      whyItMatters: "Service charge can add a significant amount to your monthly budget.",
      userImpact: "You may only discover the actual building charge after calling.",
      askBeforeVisit: ["What is the exact monthly service charge?", "What does it include?"],
      proofToRequest: ["Service charge breakdown"]
    });
  } else if (scMention.toLowerCase().includes("discuss") || scMention.toLowerCase().includes("pore bola")) {
    addScope({
      id: "service_charge",
      label: "Service charge unclear",
      status: "unclear",
      seriousness: "high",
      detectedFrom: [scMention],
      whyItMatters: "Negotiable or hidden service charges create monthly uncertainty.",
      userImpact: "You might face unexpected monthly expenses.",
      askBeforeVisit: ["What is the exact service charge?", "Are lift, generator, and security included?"],
      proofToRequest: ["Service charge breakdown", "Written message from owner/broker"]
    });
  }

  // 3. Broker Fee
  const isDirectOwner = (hm.brokerFee && hm.brokerFee.toLowerCase().includes("direct owner")) || l?.sourceType === "direct";
  const isBroker = l?.sourceType === "broker" || l?.sourceType === "bproperty" || (hm.brokerFee && hm.brokerFee.toLowerCase().includes("broker"));
  
  if (isDirectOwner) {
    // Clear, low seriousness, we can skip or add as 'clear'
  } else if (isBroker && !l?.brokerFeeKnown) {
    addScope({
      id: "broker_fee",
      label: "Broker fee unclear",
      status: "unclear",
      seriousness: "high",
      detectedFrom: [hm.brokerFee || l?.sourceType || "Broker"],
      whyItMatters: "Broker fees can be up to a full month's rent. Not knowing the exact amount is risky.",
      userImpact: "You might have to pay a large hidden commission.",
      askBeforeVisit: ["Is there any broker or agent fee?", "How much is the fee?"],
      proofToRequest: ["Written broker fee confirmation"]
    });
  } else if (!hm.brokerFee && l?.sourceType !== "direct") {
    addScope({
      id: "broker_fee",
      label: "Broker fee not mentioned",
      status: "missing",
      seriousness: "high",
      detectedFrom: [],
      whyItMatters: "If the source is unknown, a broker might show up and demand a fee.",
      userImpact: "Risk of surprise commission payment.",
      askBeforeVisit: ["Is the owner available for direct confirmation?", "Is there any broker fee?"],
      proofToRequest: ["No-fee confirmation message"]
    });
  }

  // 4. Gas Type
  if (p.gasType?.toLowerCase().includes("titas") || p.gasType?.toLowerCase().includes("line")) {
    // Clear
  } else if (p.gasType?.toLowerCase().includes("cylinder") || hm.gasType?.toLowerCase().includes("cylinder")) {
    addScope({
      id: "gas_type",
      label: "Cylinder gas mentioned",
      status: "mentioned",
      seriousness: "high",
      detectedFrom: [hm.gasType || "cylinder"],
      whyItMatters: "Cylinder gas requires manual refill and varies in monthly cost.",
      userImpact: "You will have to manage refills and variable gas expenses.",
      askBeforeVisit: ["Who arranges the cylinder refill?", "Is the gas cost separate?"],
      proofToRequest: ["Short kitchen video", "Written gas responsibility confirmation"]
    });
  } else if (!p.gasType) {
    addScope({
      id: "gas_type",
      label: "Gas type missing",
      status: "missing",
      seriousness: "high",
      detectedFrom: [],
      whyItMatters: "Gas is essential. Missing info means it could be cylinder or completely absent.",
      userImpact: "Risk of high recurring utility cost.",
      askBeforeVisit: ["Is there Titas gas or cylinder gas?"],
      proofToRequest: ["Photo of gas connection"]
    });
  }

  // 5. Electricity Billing
  if (!hm.electricityBilling && rawText.indexOf("meter") === -1) {
    addScope({
      id: "electricity_billing",
      label: "Electricity meter type missing",
      status: "missing",
      seriousness: "high",
      detectedFrom: [],
      whyItMatters: "Prepaid and postpaid meters have different payment logistics. Shared meters can cause disputes.",
      userImpact: "You might be sharing a meter and paying for others.",
      askBeforeVisit: ["Is there a separate electricity meter?", "Is it prepaid or postpaid?"],
      proofToRequest: ["Meter photo", "Prepaid meter photo"]
    });
  } else if (hm.electricityBilling?.toLowerCase().includes("shared") || rawText.includes("shared meter")) {
    addScope({
      id: "electricity_billing",
      label: "Shared electricity meter",
      status: "mentioned",
      seriousness: "high",
      detectedFrom: [hm.electricityBilling || "shared meter"],
      whyItMatters: "Shared meters often lead to unfair billing and neighbor disputes.",
      userImpact: "You could end up paying a higher share of the electricity bill.",
      askBeforeVisit: ["How is the shared electricity bill calculated?", "Is generator electricity billed separately?"],
      proofToRequest: ["Sample bill if available"]
    });
  }

  // 6. Water Billing
  if (hm.waterBilling?.toLowerCase().includes("problem") || rawText.includes("pani problem")) {
    addScope({
      id: "water_billing",
      label: "Water problem detected",
      status: "mentioned",
      seriousness: "high",
      detectedFrom: [hm.waterBilling || "pani problem"],
      whyItMatters: "Water shortages severely impact daily living quality.",
      userImpact: "You may face daily water shortages or extra pump charges.",
      askBeforeVisit: ["Is there any water supply problem?", "Is pump used for water?"],
      proofToRequest: ["Written statement about water availability", "Building caretaker confirmation"]
    });
  } else if (!hm.waterBilling) {
    addScope({
      id: "water_billing",
      label: "Water billing missing",
      status: "missing",
      seriousness: "medium",
      detectedFrom: [],
      whyItMatters: "Water bills are sometimes separate from service charges.",
      userImpact: "Slight chance of extra monthly utility payment.",
      askBeforeVisit: ["Is water bill included in service charge?", "Is there any separate water payment?"],
      proofToRequest: ["Water bill confirmation"]
    });
  }

  // 7. Lift and Generator Charge
  const hasLiftGen = p.lift || p.generator || hm.liftGeneratorCharge;
  if (hasLiftGen && !scMention) {
    addScope({
      id: "generator_lift_charge",
      label: "Lift/Generator charge unclear",
      status: "unclear",
      seriousness: "medium",
      detectedFrom: [hm.liftGeneratorCharge || "lift/generator"],
      whyItMatters: "If not included in the service charge, these can be heavy hidden fees.",
      userImpact: "You may pay extra for basic building facilities.",
      askBeforeVisit: ["Is lift charge included in service charge?", "Does generator cover the flat too?"],
      proofToRequest: ["Service charge breakdown"]
    });
  } else if (l?.bedrooms && l.bedrooms >= 3 && !p.lift && rawText.includes("4th floor")) {
     // A bit heuristic based on prompt rules
     addScope({
      id: "generator_lift_charge",
      label: "High-floor flat and no lift",
      status: "mentioned",
      seriousness: "high",
      detectedFrom: ["4th floor", "no lift"],
      whyItMatters: "Daily climb can be exhausting and cause issues for moving heavy furniture.",
      userImpact: "Physical strain and extra moving-in costs.",
      askBeforeVisit: ["Are there wide stairs for moving furniture?"],
      proofToRequest: ["Building facility confirmation"]
    });
  }

  // 8. Maintenance / Caretaker
  if (hm.maintenanceSecurityCleaning && !scMention) {
    addScope({
      id: "maintenance_security_cleaning",
      label: "Maintenance fees unclear",
      status: "unclear",
      seriousness: "medium",
      detectedFrom: [hm.maintenanceSecurityCleaning],
      whyItMatters: "Additional fees for security or garbage collection can pop up.",
      userImpact: "You might be asked for random building funds.",
      askBeforeVisit: ["Are security, cleaning, caretaker, and waste collection included?", "Is there any building fund?"],
      proofToRequest: ["Service charge breakdown", "Written inclusion confirmation"]
    });
  }

  // 9. Parking
  const needsParking = input.searchProfile?.ownsCar;
  if (needsParking && !p.missingFields?.includes("parking") && !hm.parking && !rawText.includes("parking")) {
    addScope({
      id: "parking",
      label: "Parking missing",
      status: "missing",
      seriousness: "high",
      detectedFrom: [],
      whyItMatters: "Since you own a car, lack of parking is a dealbreaker.",
      userImpact: "You might have to park on the street unsafely.",
      askBeforeVisit: ["Is parking available?", "Is parking included or separate?"],
      proofToRequest: ["Parking slot photo", "Written parking confirmation"]
    });
  } else if (!needsParking && !hm.parking) {
    addScope({
      id: "parking",
      label: "Parking not applicable",
      status: "not_applicable",
      seriousness: "low",
      detectedFrom: [],
      whyItMatters: "You don't need parking, so this doesn't affect you.",
      userImpact: "No impact.",
      askBeforeVisit: [],
      proofToRequest: []
    });
  }

  // 10. Repair / Paint
  if (!hm.repairCleaningPaint && !rawText.includes("paint") && !rawText.includes("ready flat")) {
    addScope({
      id: "repair_cleaning_paint",
      label: "Flat condition & repair missing",
      status: "missing",
      seriousness: "medium",
      detectedFrom: [],
      whyItMatters: "Owners sometimes hand over dirty or damaged flats expecting tenants to fix them.",
      userImpact: "You might have to pay for painting or deep cleaning out of pocket.",
      askBeforeVisit: ["Will the flat be cleaned before handover?", "Who pays for repair or paint before move-in?"],
      proofToRequest: ["Recent room video", "Written repair responsibility confirmation"]
    });
  }

  // 11. Road Access
  if (hm.roadAccess && (hm.roadAccess.includes("inside") || hm.roadAccess.includes("narrow") || hm.roadAccess.includes("goli") || hm.roadAccess.includes("lane"))) {
    addScope({
      id: "road_access",
      label: "Weak road access",
      status: "mentioned",
      seriousness: "high",
      detectedFrom: [hm.roadAccess],
      whyItMatters: "Narrow roads make moving furniture difficult and daily commute a hassle.",
      userImpact: "Moving trucks might not reach your gate. Extra transport costs.",
      askBeforeVisit: ["Can a small moving truck reach the building?", "Can rickshaw/CNG reach the gate?"],
      proofToRequest: ["10-second video from main road to building gate", "Google Maps pin"]
    });
  } else if (!hm.roadAccess) {
    addScope({
      id: "road_access",
      label: "Road access not mentioned",
      status: "missing",
      seriousness: "medium",
      detectedFrom: [],
      whyItMatters: "Sometimes listings hide the fact that they are deep inside a narrow alley.",
      userImpact: "Risk of daily transport hassle.",
      askBeforeVisit: ["How far is the building from the main road?"],
      proofToRequest: ["Google Maps pin", "Building entrance photo"]
    });
  }

  // 12. Waterlogging
  const userWaterloggingConcern = input.searchProfile?.dealBreakers?.includes("heavy-waterlogging");
  if (hm.waterlogging || rawText.includes("waterlogging") || rawText.includes("pani jome")) {
    addScope({
      id: "waterlogging",
      label: "Waterlogging detected",
      status: "mentioned",
      seriousness: userWaterloggingConcern ? "critical" : "high",
      detectedFrom: [hm.waterlogging || "waterlogging"],
      whyItMatters: "Waterlogging severely disrupts daily life and damages property.",
      userImpact: "You might be stuck at home during heavy rains.",
      askBeforeVisit: ["Does waterlogging happen during rain?", "Does water enter the building entrance?"],
      proofToRequest: ["Rainy-day road video", "Caretaker confirmation"]
    });
  }

  // 13. Tenant Restriction
  const userType = input.searchProfile?.householdType;
  const isMismatch = (userType === "bachelor" && rawText.includes("family only")) || 
                     (userType === "family" && rawText.includes("bachelor only"));
  
  if (isMismatch) {
    addScope({
      id: "tenant_restriction",
      label: "Tenant type mismatch",
      status: "contradictory",
      seriousness: "critical",
      detectedFrom: [hm.tenantRestriction || "family only"],
      whyItMatters: "The owner explicitly forbids your household type.",
      userImpact: "You will be rejected during the visit or face constant harassment.",
      askBeforeVisit: ["Are bachelors allowed?", "Are students allowed?"],
      proofToRequest: ["Written tenant eligibility confirmation", "Owner confirmation"]
    });
  } else if (!hm.tenantRestriction && !p.tenantPreference) {
    addScope({
      id: "tenant_restriction",
      label: "Tenant preference missing",
      status: "missing",
      seriousness: "medium",
      detectedFrom: [],
      whyItMatters: "Owners often have unwritten restrictions on guests, timings, or bachelors.",
      userImpact: "You might face sudden restrictions after moving in.",
      askBeforeVisit: ["Are there any guest restrictions?", "Are there any cooking, timing, or visitor rules?"],
      proofToRequest: ["Building rules photo"]
    });
  }

  // 14. Agreement
  if (rawText.includes("booking money") || rawText.includes("pay first")) {
    addScope({
      id: "agreement_receipt_terms",
      label: "Payment before visit requested",
      status: "contradictory",
      seriousness: "critical",
      detectedFrom: ["pay first / booking money"],
      whyItMatters: "This is a classic scam indicator. Never pay before visiting and signing an agreement.",
      userImpact: "High risk of losing your money entirely.",
      askBeforeVisit: ["Will there be a written rental agreement?", "Are advance and deposit terms written?"],
      proofToRequest: ["Agreement draft"]
    });
  } else if (!hm.agreementReceiptTerms && !rawText.includes("agreement") && !rawText.includes("contract")) {
    addScope({
      id: "agreement_receipt_terms",
      label: "Agreement & receipt not mentioned",
      status: "missing",
      seriousness: "high",
      detectedFrom: [],
      whyItMatters: "Verbal agreements offer no legal protection. You need written terms for rent and notice periods.",
      userImpact: "Owner could increase rent unpredictably or deny deposits.",
      askBeforeVisit: ["Will there be a written rental agreement?", "Will I receive monthly rent receipts?"],
      proofToRequest: ["Agreement draft", "Receipt sample"]
    });
  }

  return scopes;
}
