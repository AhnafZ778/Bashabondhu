import { AreaProfile } from "../types";

export const areas: AreaProfile[] = [
  {
    id: "banasree",
    name: "Banasree",
    rentRange: "৳15,000 - ৳35,000",
    rentLow: 15000,
    rentHigh: 35000,
    bestFor: ["Families", "Couples", "Budget Seekers"],
    avoidIf: ["You need zero commute to Gulshan/Banani", "You absolute hate local waterlogging"],
    commuteNotes: "Decent access to Rampura, Badda and Tejgaon. Direct bus to Gulshan available, but traffic on Rampura road can be severe.",
    affordability: "high",
    familySuitability: 8,
    bachelorSuitability: 6,
    femaleSuitability: 7,
    schoolAccess: 9,
    waterloggingRisk: "high",
    utilityReliability: "medium",
    mainTradeoff: "Lower rent & spacious flats, but risk of flooding during heavy rain and high peak-hour commute times.",
    latitude: 23.7634,
    longitude: 90.4321,
    hiddenCostProfile: {
      commonHiddenCostScopes: [
        "service_charge",
        "gas_type",
        "road_access",
        "waterlogging",
        "broker_fee"
      ],
      highAttentionScopes: [
        "gas_type",
        "waterlogging",
        "road_access"
      ],
      commonListingAmbiguities: [
        "service_charge",
        "gas_type",
        "broker_fee"
      ],
      rainyDayRisk: "medium",
      roadAccessRisk: "medium",
      utilityClarityRisk: "medium",
      brokerPresence: "medium",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Inside-lane road access should be verified before visiting.",
        "Gas type and service charge are often important to confirm.",
        "Rainy-day access can change the visit decision."
      ]
    },
    topSchools: ["Ideal School & College", "Banasree National Ideal", "Al-Rajhi High School"],
    topHospitals: ["Al-Raji Hospital", "Farazy Hospital Badda"]
  },
  {
    id: "badda",
    name: "Badda",
    rentRange: "৳12,000 - ৳28,000",
    rentLow: 12000,
    rentHigh: 28000,
    bestFor: ["Students", "Young Professionals", "Budget Renters"],
    avoidIf: ["You want planned wide roads", "Quiet residential vibe is a must"],
    commuteNotes: "Adjacent to Gulshan-1 and Hatirjheel. Extremely close to office hubs but highly congested inner alleys.",
    affordability: "high",
    familySuitability: 5,
    bachelorSuitability: 8,
    femaleSuitability: 6,
    schoolAccess: 6,
    waterloggingRisk: "medium",
    utilityReliability: "medium",
    mainTradeoff: "Very close to Gulshan-1 offices and low rents, but chaotic streets and high density.",
    latitude: 23.7805,
    longitude: 90.4266,
    hiddenCostProfile: {
      commonHiddenCostScopes: [
        "service_charge",
        "gas_type",
        "road_access",
        "waterlogging",
        "broker_fee"
      ],
      highAttentionScopes: [
        "gas_type",
        "waterlogging",
        "road_access"
      ],
      commonListingAmbiguities: [
        "service_charge",
        "gas_type",
        "broker_fee"
      ],
      rainyDayRisk: "medium",
      roadAccessRisk: "medium",
      utilityClarityRisk: "medium",
      brokerPresence: "medium",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Inside-lane road access should be verified before visiting.",
        "Gas type and service charge are often important to confirm.",
        "Rainy-day access can change the visit decision."
      ]
    },
    topSchools: ["Sir John Wilson School", "Cambrian School & College"],
    topHospitals: ["Universal Medical College", "Amz Hospital"]
  },
  {
    id: "mohakhali",
    name: "Mohakhali",
    rentRange: "৳25,000 - ৳50,000",
    rentLow: 25000,
    rentHigh: 50000,
    bestFor: ["Corporate Employees", "Working Professionals", "Small Families"],
    avoidIf: ["You are looking for low budget sublets", "You hate sound pollution near transit lanes"],
    commuteNotes: "Major transit point. Direct access to Banani, Gulshan, and Tejgaon. Ideal for saving commute times.",
    affordability: "low",
    familySuitability: 7,
    bachelorSuitability: 7,
    femaleSuitability: 8,
    schoolAccess: 7,
    waterloggingRisk: "low",
    utilityReliability: "high",
    mainTradeoff: "Excellent office connectivity and reliable utility services, but rents are steep and noisy.",
    latitude: 23.7788,
    longitude: 90.4002,
    hiddenCostProfile: {
      commonHiddenCostScopes: [
        "service_charge",
        "gas_type",
        "road_access",
        "waterlogging",
        "broker_fee"
      ],
      highAttentionScopes: [
        "gas_type",
        "waterlogging",
        "road_access"
      ],
      commonListingAmbiguities: [
        "service_charge",
        "gas_type",
        "broker_fee"
      ],
      rainyDayRisk: "medium",
      roadAccessRisk: "medium",
      utilityClarityRisk: "medium",
      brokerPresence: "medium",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Inside-lane road access should be verified before visiting.",
        "Gas type and service charge are often important to confirm.",
        "Rainy-day access can change the visit decision."
      ]
    },
    topSchools: ["South Breeze School", "BAF Shaheen College"],
    topHospitals: ["ICDDR,B Hospital", "Metropolitan Hospital"]
  },
  {
    id: "tejgaon",
    name: "Tejgaon",
    rentRange: "৳20,000 - ৳40,000",
    rentLow: 20000,
    rentHigh: 40000,
    bestFor: ["Office Employees", "Dhk University Students", "Couples"],
    avoidIf: ["You want green parks or open spaces", "Industrial scenery feels depressing"],
    commuteNotes: "Central location. Quick access to Kawran Bazar, Mohakhali, Farmgate, and Gulshan via Hatirjheel.",
    affordability: "medium",
    familySuitability: 6,
    bachelorSuitability: 7,
    femaleSuitability: 7,
    schoolAccess: 7,
    waterloggingRisk: "low",
    utilityReliability: "high",
    mainTradeoff: "Superb central transit connection and robust utility flow, but heavily industrial and lacks quiet streets.",
    latitude: 23.7596,
    longitude: 90.3996,
    hiddenCostProfile: {
      commonHiddenCostScopes: [
        "service_charge",
        "gas_type",
        "road_access",
        "waterlogging",
        "broker_fee"
      ],
      highAttentionScopes: [
        "gas_type",
        "waterlogging",
        "road_access"
      ],
      commonListingAmbiguities: [
        "service_charge",
        "gas_type",
        "broker_fee"
      ],
      rainyDayRisk: "medium",
      roadAccessRisk: "medium",
      utilityClarityRisk: "medium",
      brokerPresence: "medium",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Inside-lane road access should be verified before visiting.",
        "Gas type and service charge are often important to confirm.",
        "Rainy-day access can change the visit decision."
      ]
    },
    topSchools: ["St. Joseph School", "Tejgaon Govt. High School"],
    topHospitals: ["National Institute of ENT", "Samorita Hospital"]
  },
  {
    id: "mohammadpur",
    name: "Mohammadpur",
    rentRange: "৳14,000 - ৳30,000",
    rentLow: 14000,
    rentHigh: 30000,
    bestFor: ["Medium Families", "Students", "Traditional Food Lovers"],
    avoidIf: ["You need to travel to Gulshan daily", "Security in outer sectors is a concern"],
    commuteNotes: "Direct bus routes to all over Dhaka. Central to Mirpur and Dhanmondi. Far from Gulshan/Banani zone.",
    affordability: "high",
    familySuitability: 8,
    bachelorSuitability: 6,
    femaleSuitability: 6,
    schoolAccess: 8,
    waterloggingRisk: "medium",
    utilityReliability: "medium",
    mainTradeoff: "Rich community feel, close to Dhanmondi schools and moderate rents, but far from north office districts.",
    latitude: 23.7542,
    longitude: 90.3601,
    hiddenCostProfile: {
      commonHiddenCostScopes: [
        "service_charge",
        "gas_type",
        "road_access",
        "waterlogging",
        "broker_fee"
      ],
      highAttentionScopes: [
        "gas_type",
        "waterlogging",
        "road_access"
      ],
      commonListingAmbiguities: [
        "service_charge",
        "gas_type",
        "broker_fee"
      ],
      rainyDayRisk: "medium",
      roadAccessRisk: "medium",
      utilityClarityRisk: "medium",
      brokerPresence: "medium",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Inside-lane road access should be verified before visiting.",
        "Gas type and service charge are often important to confirm.",
        "Rainy-day access can change the visit decision."
      ]
    },
    topSchools: ["Residential Model College", "St. Joseph School", "Mohammadpur Preparatory"],
    topHospitals: ["Bangladesh Specialized Hospital", "Care Medical College Hospital"]
  },
  {
    id: "lalmatia",
    name: "Lalmatia",
    rentRange: "৳22,000 - ৳45,000",
    rentLow: 22000,
    rentHigh: 45000,
    bestFor: ["Families", "Working Women", "Academics"],
    avoidIf: ["You want cheap shared apartments", "You prefer lively street life"],
    commuteNotes: "Very close to Dhanmondi. Connected to Farmgate and Tejgaon. Quiet, secure residential blocks.",
    affordability: "low",
    familySuitability: 9,
    bachelorSuitability: 5,
    femaleSuitability: 9,
    schoolAccess: 9,
    waterloggingRisk: "low",
    utilityReliability: "high",
    mainTradeoff: "Safe, highly planned, and serene with top tier schools nearby, but strict landlords and premium rents.",
    latitude: 23.7561,
    longitude: 90.3703,
    hiddenCostProfile: {
      commonHiddenCostScopes: [
        "service_charge",
        "gas_type",
        "road_access",
        "waterlogging",
        "broker_fee"
      ],
      highAttentionScopes: [
        "gas_type",
        "waterlogging",
        "road_access"
      ],
      commonListingAmbiguities: [
        "service_charge",
        "gas_type",
        "broker_fee"
      ],
      rainyDayRisk: "medium",
      roadAccessRisk: "medium",
      utilityClarityRisk: "medium",
      brokerPresence: "medium",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Inside-lane road access should be verified before visiting.",
        "Gas type and service charge are often important to confirm.",
        "Rainy-day access can change the visit decision."
      ]
    },
    topSchools: ["Sunnydale", "Lalmatia Housing Society School", "SFX Greenherald"],
    topHospitals: ["City Hospital Lalmatia", "Al-Manar Hospital"]
  },
  {
    id: "mirpur",
    name: "Mirpur",
    rentRange: "৳10,000 - ৳25,000",
    rentLow: 10000,
    rentHigh: 25000,
    bestFor: ["Bachelors", "Students", "Large Families on Budget"],
    avoidIf: ["You want to avoid metro traffic jams", "You want upscale dining at your doorstep"],
    commuteNotes: "Excellent connectivity now due to Metro Rail (MRT-6). You can reach Motijheel/Tejgaon in 15-20 mins.",
    affordability: "high",
    familySuitability: 7,
    bachelorSuitability: 9,
    femaleSuitability: 7,
    schoolAccess: 8,
    waterloggingRisk: "medium",
    utilityReliability: "medium",
    mainTradeoff: "Extremely affordable rents and direct Metro connectivity, but heavily populated and busy.",
    latitude: 23.8056,
    longitude: 90.3697,
    hiddenCostProfile: {
      commonHiddenCostScopes: [
        "service_charge",
        "gas_type",
        "road_access",
        "waterlogging",
        "broker_fee"
      ],
      highAttentionScopes: [
        "gas_type",
        "waterlogging",
        "road_access"
      ],
      commonListingAmbiguities: [
        "service_charge",
        "gas_type",
        "broker_fee"
      ],
      rainyDayRisk: "medium",
      roadAccessRisk: "medium",
      utilityClarityRisk: "medium",
      brokerPresence: "medium",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Inside-lane road access should be verified before visiting.",
        "Gas type and service charge are often important to confirm.",
        "Rainy-day access can change the visit decision."
      ]
    },
    topSchools: ["Monipur High School", "SOS Hermann Gmeiner School", "Scholastica (Mirpur)"],
    topHospitals: ["National Heart Foundation", "Kidney Foundation Hospital"]
  },
  {
    id: "uttara",
    name: "Uttara",
    rentRange: "৳15,000 - ৳35,000",
    rentLow: 15000,
    rentHigh: 35000,
    bestFor: ["Families", "Airport/Airline Staff", "Suburban Lovers"],
    avoidIf: ["Your office is in Motijheel or Dhanmondi", "You hate suburban isolation"],
    commuteNotes: "Planned sectors. Connected via Airport Road and Metro Rail (from north Uttara). Airport adjacent.",
    affordability: "medium",
    familySuitability: 9,
    bachelorSuitability: 6,
    femaleSuitability: 8,
    schoolAccess: 8,
    waterloggingRisk: "low",
    utilityReliability: "high",
    mainTradeoff: "Highly planned, green, silent, and very clean with great utilities, but far from central Dhaka city centers.",
    latitude: 23.8759,
    longitude: 90.3795,
    hiddenCostProfile: {
      commonHiddenCostScopes: [
        "service_charge",
        "gas_type",
        "road_access",
        "waterlogging",
        "broker_fee"
      ],
      highAttentionScopes: [
        "gas_type",
        "waterlogging",
        "road_access"
      ],
      commonListingAmbiguities: [
        "service_charge",
        "gas_type",
        "broker_fee"
      ],
      rainyDayRisk: "medium",
      roadAccessRisk: "medium",
      utilityClarityRisk: "medium",
      brokerPresence: "medium",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Inside-lane road access should be verified before visiting.",
        "Gas type and service charge are often important to confirm.",
        "Rainy-day access can change the visit decision."
      ]
    },
    topSchools: ["Scholastica (Uttara)", "Aga Khan School", "Sunnydale (Uttara)"],
    topHospitals: ["Kuwait Bangladesh Friendship Hospital", "Uttara Adhunik Medical College"]
  },
  {
    id: "bashundhara",
    name: "Bashundhara",
    rentRange: "৳12,000 - ৳30,000",
    rentLow: 12000,
    rentHigh: 30000,
    bestFor: ["Students", "NSU/IUB/AIUB", "Young Couples"],
    avoidIf: ["You hate rickshaw-only local transit", "You want easy public bus access"],
    commuteNotes: "Near Kuril Flyover. Easy access to Airport Road, Gulshan, and Badda. Strict security gates.",
    affordability: "medium",
    familySuitability: 8,
    bachelorSuitability: 9,
    femaleSuitability: 9,
    schoolAccess: 9,
    waterloggingRisk: "low",
    utilityReliability: "high",
    mainTradeoff: "Extremely safe, planned residential area with student sublets, but costly internal transport and gate curfews.",
    latitude: 23.8151,
    longitude: 90.4255,
    hiddenCostProfile: {
      commonHiddenCostScopes: [
        "service_charge",
        "gas_type",
        "road_access",
        "waterlogging",
        "broker_fee"
      ],
      highAttentionScopes: [
        "gas_type",
        "waterlogging",
        "road_access"
      ],
      commonListingAmbiguities: [
        "service_charge",
        "gas_type",
        "broker_fee"
      ],
      rainyDayRisk: "medium",
      roadAccessRisk: "medium",
      utilityClarityRisk: "medium",
      brokerPresence: "medium",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Inside-lane road access should be verified before visiting.",
        "Gas type and service charge are often important to confirm.",
        "Rainy-day access can change the visit decision."
      ]
    },
    topSchools: ["International School Dhaka (ISD)", "Hurdco International School", "Playpen"],
    topHospitals: ["Evercare Hospital Dhaka", "Asgar Ali Hospital"]
  },
  {
    id: "dhanmondi",
    name: "Dhanmondi",
    rentRange: "৳25,000 - ৳55,000",
    rentLow: 25000,
    rentHigh: 55000,
    bestFor: ["Families", "Students (DU/DMC)", "Culture & Food Seekers"],
    avoidIf: ["You want traffic-free school zones", "You want low cost of living"],
    commuteNotes: "Lively central area. Great access to Farmgate, Kawran Bazar, Mohammadpur. Beautiful lake side.",
    affordability: "low",
    familySuitability: 9,
    bachelorSuitability: 6,
    femaleSuitability: 8,
    schoolAccess: 10,
    waterloggingRisk: "low",
    utilityReliability: "high",
    mainTradeoff: "Amazing parks, food culture, elite schools, and lake vibes, but permanent traffic congestion and high rents.",
    latitude: 23.7461,
    longitude: 90.3742,
    hiddenCostProfile: {
      commonHiddenCostScopes: [
        "service_charge",
        "gas_type",
        "road_access",
        "waterlogging",
        "broker_fee"
      ],
      highAttentionScopes: [
        "gas_type",
        "waterlogging",
        "road_access"
      ],
      commonListingAmbiguities: [
        "service_charge",
        "gas_type",
        "broker_fee"
      ],
      rainyDayRisk: "medium",
      roadAccessRisk: "medium",
      utilityClarityRisk: "medium",
      brokerPresence: "medium",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Inside-lane road access should be verified before visiting.",
        "Gas type and service charge are often important to confirm.",
        "Rainy-day access can change the visit decision."
      ]
    },
    topSchools: ["Sunnydale", "Scholastica (Dhanmondi)", "Maple Leaf International"],
    topHospitals: ["Labaid Specialized Hospital", "Bangladesh Medical College Hospital", "Ibn Sina Hospital"]
  },
  {
    id: "banani",
    name: "Banani",
    rentRange: "৳35,000 - ৳90,000",
    rentLow: 35000,
    rentHigh: 90000,
    bestFor: ["Expats", "Corporate Executives", "High Budget Renters"],
    avoidIf: ["You are looking for cheap budget housing", "You hate commercial hustle-bustle"],
    commuteNotes: "Excellent access via Kemal Ataturk Avenue. Close to Gulshan and Mohakhali. Direct metro access nearby.",
    affordability: "low",
    familySuitability: 9,
    bachelorSuitability: 7,
    femaleSuitability: 9,
    schoolAccess: 9,
    waterloggingRisk: "low",
    utilityReliability: "high",
    mainTradeoff: "High rent and premium costs, but unbeatable security, infrastructure, and upscale dining/amenities.",
    latitude: 23.7937,
    longitude: 90.4066,
    hiddenCostProfile: {
      commonHiddenCostScopes: ["service_charge", "gas_type", "road_access", "broker_fee"],
      highAttentionScopes: ["gas_type", "broker_fee"],
      commonListingAmbiguities: ["service_charge", "broker_fee"],
      rainyDayRisk: "low",
      roadAccessRisk: "low",
      utilityClarityRisk: "low",
      brokerPresence: "high",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Premium apartments usually require standard security clearance.",
        "Gas line connection is common, but cylinder gas is present in newer high-rises."
      ]
    },
    topSchools: ["Banani International School", "South Breeze School", "AISD"],
    topHospitals: ["Premium Dental Clinic", "Banani Clinic Ltd", "Kurmitola General Hospital"]
  },
  {
    id: "gulshan",
    name: "Gulshan",
    rentRange: "৳45,000 - ৳120,000",
    rentLow: 45000,
    rentHigh: 120000,
    bestFor: ["Expats", "Diplomats", "Corporate Leaders"],
    avoidIf: ["You have a tight budget under ৳40k", "You hate heavily guarded check-posts"],
    commuteNotes: "Excellent access. Heart of the diplomatic zone. Close to Banani and Baridhara.",
    affordability: "low",
    familySuitability: 9,
    bachelorSuitability: 6,
    femaleSuitability: 9,
    schoolAccess: 9,
    waterloggingRisk: "low",
    utilityReliability: "high",
    mainTradeoff: "Premium living standards and diplomatic security, but extremely high rent, high deposit, and peak traffic hours.",
    latitude: 23.7925,
    longitude: 90.4178,
    hiddenCostProfile: {
      commonHiddenCostScopes: ["service_charge", "gas_type", "road_access", "broker_fee"],
      highAttentionScopes: ["gas_type", "broker_fee"],
      commonListingAmbiguities: ["service_charge", "broker_fee"],
      rainyDayRisk: "low",
      roadAccessRisk: "low",
      utilityClarityRisk: "low",
      brokerPresence: "high",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Check-posts restrict commercial vehicle entry at night.",
        "Gas line is present in almost all older buildings; newer blocks use central LPG."
      ]
    },
    topSchools: ["Scholastica", "Sir John Wilson School", "International School Dhaka"],
    topHospitals: ["United Hospital", "Square Hospital Gulshan", "Aesthetics Clinic"]
  },
  {
    id: "merul-badda",
    name: "Merul Badda",
    rentRange: "৳15,000 - ৳32,000",
    rentLow: 15000,
    rentHigh: 32000,
    bestFor: ["Families", "Couples", "Budget Renters"],
    avoidIf: ["You need zero commute to Gulshan/Banani", "You hate high traffic on DIT Road"],
    commuteNotes: "Located south of Badda. Excellent commute access to Gulshan-1 and Hatirjheel.",
    affordability: "high",
    familySuitability: 8,
    bachelorSuitability: 7,
    femaleSuitability: 7,
    schoolAccess: 8,
    waterloggingRisk: "medium",
    utilityReliability: "medium",
    mainTradeoff: "Spacious apartments at very affordable rates, but suffers from peak-hour traffic bottleneck near Hatirjheel.",
    latitude: 23.7686,
    longitude: 90.4258,
    hiddenCostProfile: {
      commonHiddenCostScopes: ["service_charge", "gas_type", "road_access", "waterlogging", "broker_fee"],
      highAttentionScopes: ["gas_type", "waterlogging", "road_access"],
      commonListingAmbiguities: ["service_charge", "gas_type", "broker_fee"],
      rainyDayRisk: "medium",
      roadAccessRisk: "medium",
      utilityClarityRisk: "medium",
      brokerPresence: "medium",
      tenantRestrictionFrequency: "medium",
      localNotes: [
        "Inside lane road access is narrow and should be verified.",
        "Water supply is a common local check point."
      ]
    },
    topSchools: ["Ideal School & College", "Merul Badda High School", "Scholastica (Merul Branch)"],
    topHospitals: ["Labaid Clinic Badda", "Farazy Hospital Badda"]
  }
];
