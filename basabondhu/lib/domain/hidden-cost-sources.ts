export type HiddenCostSourceId =
  | "advance_terms"
  | "service_charge"
  | "broker_fee"
  | "gas_type"
  | "electricity_billing"
  | "water_billing"
  | "generator_lift_charge"
  | "maintenance_security_cleaning"
  | "parking"
  | "internet_setup"
  | "repair_cleaning_paint"
  | "moving_access"
  | "road_access"
  | "waterlogging"
  | "tenant_restriction"
  | "agreement_receipt_terms"
  | "rent_increase_terms"
  | "furnishing_appliance_terms"
  | "shared_meter_or_shared_utility"
  | "building_rules";

export type HiddenCostStatus =
  | "clear"
  | "mentioned"
  | "missing"
  | "unclear"
  | "contradictory"
  | "not_applicable";

export type HiddenCostSeriousness =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type HiddenCostCategory =
  | "move_in_cash"
  | "monthly_recurring"
  | "utility_living"
  | "access_transport"
  | "legal_terms"
  | "tenant_fit"
  | "maintenance_living"
  | "documentation";

export type HiddenCostSource = {
  id: HiddenCostSourceId;
  label: string;
  category: HiddenCostCategory;
  status: HiddenCostStatus;
  seriousness: HiddenCostSeriousness;
  detectedFrom: string[];
  whyItMatters: string;
  userImpact: string;
  askBeforeVisit: string[];
  proofToRequest: string[];
};
