export type MessyExample = {
  id: string;
  title: string;
  text: string;
  tags: string[];
};

export const messyExamples: MessyExample[] = [
  // --- Original 8 ---
  {
    id: "banasree-family",
    title: "Banasree 2-bed flat (Family preferred, cylinder gas)",
    text: "Banasree te 2 bed flat rent 28k, family preferred, 2 month advance, lift ase, gas cylinder, service charge extra, available from July.",
    tags: ["Family Preferred", "Cylinder Gas", "Banasree"]
  },
  {
    id: "bashundhara-sublet",
    title: "Bashundhara student sublet (No lift, direct owner)",
    text: "Bashundhara block C student sublet rent 9000tk, single room attach bath. No lift, gas cylinder, only for university students. 1 month advance, direct owner post, no media/broker fee. available from June 1st.",
    tags: ["Student Sublet", "No Broker", "Bashundhara"]
  },
  {
    id: "mohakhali-bachelor",
    title: "Mohakhali flat (Bachelor allowed, high advance)",
    text: "Mohakhali flat for rent. 3 bed 3 bath, drawing dining. Rent 35k fixed. Service charge 4000tk, utilities separate. Bachelor allowed. 3 months advance required. Titas gas connection active. Generator + Lift available. Media fee one month rent.",
    tags: ["Bachelor Allowed", "High Deposit", "Mohakhali"]
  },
  {
    id: "mohammadpur-waterlog",
    title: "Mohammadpur low budget (Waterlogging risk, gas line)",
    text: "Mohammadpur shekhertek ground floor flat rent 15000. 2 room, 1 bath, kitchen. Gas line active (titas). SC 1500. Road floods slightly during heavy rain, but rent is cheap. Family or job holders allowed.",
    tags: ["Budget", "Waterlogging Risk", "Mohammadpur"]
  },
  {
    id: "dhanmondi-female",
    title: "Dhanmondi female sublet (Secure block, strict timing)",
    text: "Dhanmondi road 15 female sublet. Single room with attach balcony. Rent 11k inclusive of all utilities (gas, electricity, wifi, maid). Cylinder gas. Generator backup active. Strictly female student or job holder. Security gates close at 10 PM. 1 month advance.",
    tags: ["Female Sublet", "All Inclusive", "Dhanmondi"]
  },
  {
    id: "mirpur-cheap-broker",
    title: "Mirpur cheap flat (Broker post, no details)",
    text: "Mirpur 10 low cost flat. 3 bed 2 bath. Rent 18,000. Lift line ready but not working. Utility separate. Call broker at 017xxxxxxxx. Urgent shifting. Shobar jonne shubidhabadi.",
    tags: ["Broker", "Vague Details", "Mirpur"]
  },
  {
    id: "lalmatia-premium",
    title: "Lalmatia family flat (Direct owner, premium)",
    text: "Lalmatia block D family apartment rent 45000, 3 bed 4 bath, huge drawing dining, lift, generator, gas line (Government), service charge 5000, no brokers allowed. 2 months advance. Decent environment.",
    tags: ["Premium", "Family Only", "Lalmatia"]
  },
  {
    id: "uttara-couple",
    title: "Uttara sector 4 flat (Generator backup, planned block)",
    text: "Uttara sector 4 flat for rent. 2 bed 2 bath. Rent 25k. Service charge 3500. Gas line active. Lift + Generator backup for all flats. New married couple preferred. 2 months advance. Contact directly.",
    tags: ["Couple Preferred", "Utilities Clear", "Uttara"]
  },

  // --- 5 more Banglish Facebook-style posts ---
  {
    id: "fb-badda-urgent",
    title: "Badda flat urgent (Facebook post, Banglish)",
    text: "🏠 URGENT RENT!! Badda link road er pashe 2 bed flat rent korbo. Rent matro 16000 taka. Bachelors allowed. Gas cylinder. Lift nai but 3rd floor so thik ache. 1 month advance. Kono broker nai. Inbox me for details. 🔑",
    tags: ["Facebook", "Banglish", "Badda", "Bachelor"]
  },
  {
    id: "fb-mirpur-family-only",
    title: "Mirpur DOHS flat (Facebook, family only)",
    text: "Mirpur DOHS e beautiful 3 bed flat vacant hoyeche. Rent 32000, SC 4500. Titas gas connection active. Lift generator duitai ache. ONLY family, no bachelor. 2 months advance lagbe. Direct owner, broker fee nai. Interested hole call korun.",
    tags: ["Facebook", "Family Only", "Mirpur", "Premium"]
  },
  {
    id: "fb-tejgaon-bachelor-mess",
    title: "Tejgaon bachelor mess room (Facebook)",
    text: "tejgaon industrial area te bachelor seat available. rent per seat 5500. shared bath and kitchen. gas cylinder use kori. lift nai, 2nd floor. current bill share. wifi ache. job holder preferred. 1 month advance. no female.",
    tags: ["Facebook", "Bachelor Mess", "Tejgaon", "Budget"]
  },
  {
    id: "fb-dhanmondi-expensive",
    title: "Dhanmondi luxury flat (Facebook, high rent)",
    text: "EXCLUSIVE!! Dhanmondi 27 number road, fully furnished 3 bed apartment. Rent 65,000 negotiable. Service charge 8000. Gas line + IPS backup. Lift and generator 24/7. Only small family or diplomat. 3 months advance. No pets, no subletting.",
    tags: ["Facebook", "Luxury", "Dhanmondi", "Furnished"]
  },
  {
    id: "fb-bashundhara-new-building",
    title: "Bashundhara R/A new building (Facebook)",
    text: "Brand new building Bashundhara R/A block F. 2 bed 2 bath 1100 sqft. Rent 22000. SC 2500. Titas gas. Lift ache but generator nai ekhon, ashbe soon InshAllah. Couple or small family ok. 2 month advance. Direct malik er post. Available from next month.",
    tags: ["Facebook", "New Building", "Bashundhara", "Couple"]
  },

  // --- 5 WhatsApp broker messages (vague, urgent) ---
  {
    id: "whatsapp-broker-1",
    title: "WhatsApp broker (vague, Gulshan area)",
    text: "Assalamu Alaikum bhai, Gulshan 2 er side e ekta valo flat ache. 3 bed. Rent 40 er moddhe hobe. Advance 2 month. Details er jonno call korun. Jodi interested thaken ajkei dekhe jaite paren. Media fee applicable.",
    tags: ["WhatsApp", "Broker", "Vague", "Gulshan"]
  },
  {
    id: "whatsapp-broker-2",
    title: "WhatsApp broker (urgent shifting, Banasree)",
    text: "URGENT flat khali hocche 1st July!! Banasree block B. 2bed 1bath. Rent 17k theke 19k er moddhe. Gas cylinder. Lift ache. SC jani na exact, owner ke jiggesh korte hobe. Bachelor o family duijone ok. Call me 017XXXXXXXX.",
    tags: ["WhatsApp", "Broker", "Urgent", "Banasree"]
  },
  {
    id: "whatsapp-broker-3",
    title: "WhatsApp broker (multiple options, Uttara)",
    text: "bhai Uttara te multiple flat available. sector 3, 7, 11. rent range 20k-35k. family and bachelor both option ache. kono kono te gas line, kono te cylinder. advance 1-2 month. beshi details er jonno office e ashun. media fee lagbe.",
    tags: ["WhatsApp", "Broker", "Multiple Options", "Uttara"]
  },
  {
    id: "whatsapp-broker-4",
    title: "WhatsApp broker (pushy, Mohammadpur)",
    text: "Mohammadpur Tajmahal road e excellent flat!! 3 bed rent 25000 ONLY. SC inclusive. Ekhoni decision nin nahole gone! Advance just 1 month. Gas line. No lift but ground floor. Owner desperate to rent. Media fee 50% rent. Jaldi korun!",
    tags: ["WhatsApp", "Broker", "Pushy", "Mohammadpur"]
  },
  {
    id: "whatsapp-broker-5",
    title: "WhatsApp broker (incomplete info, Badda)",
    text: "flat ache Badda. cheap rent. bachelor ok. call koren details er jonno. advance lage. 017XXXXXXXX",
    tags: ["WhatsApp", "Broker", "Minimal Info", "Badda"]
  },

  // --- 3 Bikroy-style formatted posts ---
  {
    id: "bikroy-uttara-family",
    title: "Bikroy listing (Uttara, well-formatted)",
    text: "Title: 1350 sqft Apartment for Rent in Uttara Sector 10\nBedrooms: 3\nBathrooms: 2\nFloor: 5th (Lift Available)\nRent: BDT 28,000/month\nService Charge: BDT 3,000/month\nAdvance: 2 months\nGas: Titas Line\nGenerator: Yes\nPreference: Family Only\nContact: Owner Direct\nAvailable: Immediately",
    tags: ["Bikroy", "Formatted", "Uttara", "Family"]
  },
  {
    id: "bikroy-mirpur-bachelor",
    title: "Bikroy listing (Mirpur, bachelor flat)",
    text: "Title: 750 sqft Bachelor Friendly Flat at Mirpur 12\nBedrooms: 2\nBathrooms: 1\nFloor: 3rd (No Lift)\nRent: BDT 14,000/month\nService Charge: N/A\nAdvance: 1 month\nGas: Cylinder\nGenerator: No\nPreference: Bachelor / Job Holder\nBroker Fee: 1 month rent\nAvailable: July 2025",
    tags: ["Bikroy", "Bachelor", "Mirpur", "Broker"]
  },
  {
    id: "bikroy-banasree-sublet",
    title: "Bikroy listing (Banasree, sublet room)",
    text: "Title: Single Room Sublet Available in Banasree Block D\nRoom Type: Single with Attached Bathroom\nFloor: 6th (Lift Available)\nRent: BDT 8,500/month (all inclusive)\nAdvance: 1 month\nGas: Shared Cylinder\nWifi: Included\nPreference: Male Student or Job Holder\nContact: Current Tenant\nNote: Seat available in shared flat",
    tags: ["Bikroy", "Sublet", "Banasree", "Budget"]
  },

  // --- 3 Bproperty-style posts ---
  {
    id: "bproperty-dhanmondi",
    title: "Bproperty listing (Dhanmondi, premium)",
    text: "Property ID: BP-DHN-4521\nLocation: Dhanmondi Road 8/A, Dhaka\nType: Apartment for Rent\nSize: 1800 sq ft\nBedrooms: 3 | Bathrooms: 3\nMonthly Rent: ৳55,000\nService Charge: ৳6,000/month\nSecurity Deposit: 3 months rent\nAmenities: Lift, Generator, Gas Line (Govt), Guard, CCTV, Covered Parking\nTenant Type: Family\nPet Policy: No pets\nAvailability: From 1st August 2025\nListed by: Bproperty Verified Agent",
    tags: ["Bproperty", "Premium", "Dhanmondi", "Verified"]
  },
  {
    id: "bproperty-bashundhara-new",
    title: "Bproperty listing (Bashundhara, new flat)",
    text: "Property ID: BP-BSH-7830\nLocation: Bashundhara R/A Block E, Dhaka\nType: Apartment for Rent\nSize: 1200 sq ft\nBedrooms: 2 | Bathrooms: 2\nMonthly Rent: ৳20,000\nService Charge: ৳2,000/month\nSecurity Deposit: 2 months rent\nAmenities: Lift, Gas Cylinder, Security Guard\nGenerator: Under installation\nTenant Type: Family / Couple\nAvailability: Immediately\nListed by: Owner",
    tags: ["Bproperty", "Bashundhara", "Couple", "New"]
  },
  {
    id: "bproperty-tejgaon-commercial",
    title: "Bproperty listing (Tejgaon, mixed use area)",
    text: "Property ID: BP-TEJ-2109\nLocation: Tejgaon Industrial Area, Dhaka\nType: Apartment for Rent (Residential use in commercial zone)\nSize: 900 sq ft\nBedrooms: 2 | Bathrooms: 1\nMonthly Rent: ৳16,000\nService Charge: Not applicable\nSecurity Deposit: 1 month rent\nAmenities: None (no lift, no generator)\nGas: Cylinder only\nTenant Type: Bachelor / Job holder\nNote: Noisy during daytime due to industrial activity\nAvailability: From July 15, 2025\nListed by: Bproperty Agent",
    tags: ["Bproperty", "Tejgaon", "Bachelor", "Commercial Zone"]
  },

  // --- 3 "To-let" sign style (minimal info) ---
  {
    id: "tolet-mirpur-minimal",
    title: "To-let sign (Mirpur, barely any info)",
    text: "TO-LET. Mirpur 2. 2 bed. Family. Call: 018XXXXXXXX.",
    tags: ["To-Let Sign", "Minimal", "Mirpur"]
  },
  {
    id: "tolet-mohammadpur-basic",
    title: "To-let sign (Mohammadpur, basic info)",
    text: "FLAT RENT. Mohammadpur Town Hall. 3 bed 2 bath, 4th floor. Rent 22000. Family preferred. Contact owner.",
    tags: ["To-Let Sign", "Basic", "Mohammadpur"]
  },
  {
    id: "tolet-badda-cryptic",
    title: "To-let sign (Badda, cryptic abbreviations)",
    text: "2B/1B flat avlbl Badda, nr Natun Bazar. Rnt 13k. Adv 1m. Bchlr ok. Cylndr gas. No lft. Immd. 019XXXXXXXX",
    tags: ["To-Let Sign", "Cryptic", "Badda"]
  },

  // --- 3 Mixed Bangla-numeral posts ---
  {
    id: "bangla-numeral-1",
    title: "Bangla numerals (Uttara, mixed script)",
    text: "উত্তরা সেক্টর ৭ এ ৩ বেডরুম ফ্ল্যাট ভাড়া হবে। ভাড়া ৳২৮,০০০। সার্ভিস চার্জ ৳৩,৫০০। লিফট ও জেনারেটর আছে। তিতাস গ্যাস। ২ মাস অগ্রিম। শুধু পরিবার। ব্রোকার নেই। যোগাযোগ: ০১৭XXXXXXXX",
    tags: ["Bangla Script", "Bangla Numerals", "Uttara"]
  },
  {
    id: "bangla-numeral-2",
    title: "Bangla numerals (Banasree, mixed Bangla-English)",
    text: "Banasree Block A te flat ache. ৳১৮,০০০ rent. 2 bed 1 bath. Gas cylinder. Lift নেই। SC ৳১,৫০০। Bachelor ও family দুজনেই পারবে। 1 month advance. Direct owner.",
    tags: ["Mixed Script", "Bangla Numerals", "Banasree"]
  },
  {
    id: "bangla-numeral-3",
    title: "Bangla script (Lalmatia, full Bangla post)",
    text: "লালমাটিয়া ব্লক সি-তে ৩ বেড ২ বাথ ফ্ল্যাট ভাড়া। ভাড়া ৩৮,০০০ টাকা। সার্ভিস চার্জ ৪,০০০ টাকা। সরকারি গ্যাস লাইন। লিফট আছে, জেনারেটর নেই। শুধুমাত্র পরিবার। ২ মাস অগ্রিম জমা দিতে হবে। ব্রোকার ফি নেই।",
    tags: ["Full Bangla", "Lalmatia", "Family Only"]
  },
  
  // --- 5 Hidden Cost Ambiguous Examples ---
  {
    id: "hidden-banasree",
    title: "Banasree hidden-cost ambiguity",
    text: "Banasree 3 bed flat rent 32k, lift ase, family preferred, school er kache, gas cylinder, service charge discuss, road inside, advance 2 month, broker fee lagbe.",
    tags: ["Hidden Cost", "Ambiguous", "Banasree"]
  },
  {
    id: "hidden-badda",
    title: "Badda incomplete terms",
    text: "Badda notun flat 2 bed 25k, service charge pore bola hobe, gas nai cylinder use korte hobe, bachelor possible but owner er sathe kotha bolte hobe.",
    tags: ["Hidden Cost", "Incomplete", "Badda"]
  },
  {
    id: "hidden-mohammadpur",
    title: "Mohammadpur utility risk",
    text: "Mohammadpur 3 room family flat, rent 30k, direct owner, Titas gas, lift nai, 4th floor, advance negotiable, pani bill included kina confirm korte hobe.",
    tags: ["Hidden Cost", "Utility Risk", "Mohammadpur"]
  },
  {
    id: "hidden-bashundhara",
    title: "Bashundhara broker & charge",
    text: "Bashundhara R/A 2 bed furnished, rent 45k, service charge separate, generator, lift, parking available, agreement hobe, broker commission applicable.",
    tags: ["Hidden Cost", "Broker", "Bashundhara"]
  },
  {
    id: "hidden-mirpur",
    title: "Mirpur access limit",
    text: "Mirpur 2 bed 22k, family/bachelor both, prepaid meter, cylinder gas, no lift, inside goli, truck dhukte parbe na.",
    tags: ["Hidden Cost", "Access", "Mirpur"]
  }
];
