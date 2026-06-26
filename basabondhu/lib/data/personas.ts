import { SearchProfile } from "../types";

export const personas: (SearchProfile & { name: string; description: string; avatar: string; iconId: string; imageUrl: string })[] = [
  {
    id: "rafi-mita",
    name: "Rafi & Mita (Demo Couple)",
    description: "Moving from Cumilla to Dhaka. Rafi works in Banani, Mita works from home. Seeking a safe, family-friendly flat.",
    avatar: "",
    iconId: "couple",
    imageUrl: "/DhakaImages/images.jpg",
    mode: "plan",
    rentingOrBuying: "renting",
    householdType: "couple",
    lookingFor: "full-flat",
    budgetMonthly: 35000,
    maxFirstMonthCash: 100000,
    commuteAnchors: [
      { label: "Rafi's Office", area: "Banani" }
    ],
    priorities: ["commute", "family-friendly", "lift", "rent"],
    dealBreakers: ["broker", "high-advance", "heavy-waterlogging"],
    hiddenCostSensitivity: {
      advanceTerms: "high",
      serviceChargeClarity: "high",
      gasClarity: "high",
      brokerFeeAvoidance: "high",
      utilityBillingClarity: "medium",
      roadAccessConcern: "high",
      waterloggingConcern: "high",
      agreementReceiptImportance: "medium"
    }
  },
  {
    id: "nusrat-student",
    name: "Nusrat (Female Student)",
    description: "University student looking for a secure female-only sublet room or hostel near Dhanmondi. Extremely budget-conscious.",
    avatar: "",
    iconId: "student",
    imageUrl: "/DhakaImages/8images.jpg",
    mode: "plan",
    rentingOrBuying: "renting",
    householdType: "student",
    lookingFor: "room-sublet",
    budgetMonthly: 12000,
    maxFirstMonthCash: 25000,
    commuteAnchors: [
      { label: "University", area: "Dhanmondi" }
    ],
    priorities: ["safety", "rent", "bachelor-friendly"],
    dealBreakers: ["family-only", "heavy-waterlogging"]
  },
  {
    id: "abrar-bachelor",
    name: "Abrar (Single Professional)",
    description: "Software engineer working in Mohakhali, looking for a bachelor-friendly shared room or small flat. Prefers direct owners.",
    avatar: "",
    iconId: "professional",
    imageUrl: "/DhakaImages/im88ages.jpg",
    mode: "plan",
    rentingOrBuying: "renting",
    householdType: "bachelor",
    lookingFor: "room-sublet",
    budgetMonthly: 15000,
    maxFirstMonthCash: 40000,
    commuteAnchors: [
      { label: "Tech Office", area: "Mohakhali" }
    ],
    priorities: ["commute", "rent", "bachelor-friendly"],
    dealBreakers: ["family-only", "broker"]
  },
  {
    id: "haque-family",
    name: "Haque Family (4 Members)",
    description: "Shifting to be closer to their children's school in Mohammadpur. High importance on gas line and school access.",
    avatar: "",
    iconId: "family",
    imageUrl: "/DhakaImages/im99ages.jpg",
    mode: "plan",
    rentingOrBuying: "renting",
    householdType: "family",
    lookingFor: "full-flat",
    budgetMonthly: 28000,
    maxFirstMonthCash: 90000,
    commuteAnchors: [
      { label: "School", area: "Mohammadpur" }
    ],
    priorities: ["school", "gas", "family-friendly", "no-waterlogging"],
    dealBreakers: ["no-gas", "heavy-waterlogging"]
  },
  {
    id: "tasnim-woman",
    name: "Tasnim (Working Woman)",
    description: "Corporate manager relocated to Gulshan/Banani. Security, generator backup, late-night entry access, and lift are absolute priorities.",
    avatar: "",
    iconId: "executive",
    imageUrl: "/DhakaImages/ima9ges.jpg",
    mode: "plan",
    rentingOrBuying: "renting",
    householdType: "working-woman",
    lookingFor: "full-flat",
    budgetMonthly: 45000,
    maxFirstMonthCash: 150000,
    commuteAnchors: [
      { label: "Gulshan Office", area: "Tejgaon" }
    ],
    priorities: ["safety", "generator", "lift", "commute"],
    dealBreakers: ["no-lift", "heavy-waterlogging"]
  },
  {
    id: "sabbir-relocating",
    name: "Sabbir (Relocating Professional)",
    description: "Moving from Chittagong for a new job near Gulshan. Doesn't know Dhaka areas well. Needs area guidance and a reliable flat.",
    avatar: "",
    iconId: "relocating",
    imageUrl: "/DhakaImages/imag22es.jpg",
    mode: "plan",
    rentingOrBuying: "renting",
    householdType: "single-professional",
    lookingFor: "full-flat",
    budgetMonthly: 30000,
    maxFirstMonthCash: 80000,
    commuteAnchors: [
      { label: "Gulshan Office", area: "Mohakhali" }
    ],
    priorities: ["commute", "rent", "quiet-area", "lift"],
    dealBreakers: ["high-advance", "heavy-waterlogging"]
  },
  {
    id: "maliha-roommates",
    name: "Maliha & Roommates (Female Group)",
    description: "3 working women sharing a flat. Need a female-friendly building with security and late-night access in Uttara or Bashundhara.",
    avatar: "",
    iconId: "group",
    imageUrl: "/DhakaImages/imag999es.jpg",
    mode: "plan",
    rentingOrBuying: "renting",
    householdType: "group",
    lookingFor: "full-flat",
    budgetMonthly: 18000,
    maxFirstMonthCash: 50000,
    commuteAnchors: [
      { label: "Uttara Office Zone", area: "Uttara" }
    ],
    priorities: ["safety", "rent", "lift", "generator"],
    dealBreakers: ["family-only", "no-lift", "heavy-waterlogging"]
  },
  {
    id: "kamal-budget",
    name: "Kamal (Budget Bachelor)",
    description: "Just graduated, first job in Tejgaon industrial area. Extremely tight budget, needs cheapest sublet possible. Open to shared rooms.",
    avatar: "",
    iconId: "bachelor",
    imageUrl: "/DhakaImages/imag9es.jpg",
    mode: "plan",
    rentingOrBuying: "renting",
    householdType: "bachelor",
    lookingFor: "room-sublet",
    budgetMonthly: 10000,
    maxFirstMonthCash: 25000,
    commuteAnchors: [
      { label: "Factory Office", area: "Tejgaon" }
    ],
    priorities: ["rent", "commute", "bachelor-friendly"],
    dealBreakers: ["family-only", "broker", "high-advance"]
  }
];
