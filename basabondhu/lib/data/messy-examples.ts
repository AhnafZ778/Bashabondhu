export type MessyExample = {
  id: string;
  title: string;
  text: string;
  tags: string[];
};

export const messyExamples: MessyExample[] = [
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
  }
];
