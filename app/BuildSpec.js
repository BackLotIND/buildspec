"use client"

import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// BUILDSPEC v7 — Deep Knowledge Edition
// Junkyard Gold • Hidden Bolt-Ons • Sleeper Builds • Forum Lore
// ═══════════════════════════════════════════════════════════════

const MAKES = [
  { id:"honda",name:"Honda",accent:"#E63946",tagline:"JDM legacy — 30 years of junkyard swaps and hidden bolt-ons",icon:"🔴" },
  { id:"bmw",name:"BMW",accent:"#1890FF",tagline:"Euro cheap power — free tunes, OEM+ secrets, and cross-platform swaps",icon:"🔵" },
  { id:"subaru",name:"Subaru",accent:"#3F8EFC",tagline:"Rally DNA — STI parts on WRX budgets and hidden factory upgrades",icon:"⭐" },
];

const PLATFORMS = [
  // Honda
  {id:"eg",make:"honda",name:"Civic EG",gen:"1992–1995",hp:125,tq:106,tagline:"The lightweight legend",budget:"$1k–$8k",
    desc:"Under 2,300 lbs. B/K swaps documented for 30 years. Shells still $2-5k.",
    why:"The OG tuner Honda. Bottomless aftermarket, junkyard swaps for everything, and it weighs nothing.",
    warns:["Rust in rear wheel wells and rockers","Frame rails bend easy — check before buying","D-series head gaskets blow ~200k","Check for accident history — these get crashed and straightened constantly"],
    mistakes:["Buying eBay coilovers — they blow out in months on these light cars","Running a cold air intake without a bypass valve — hydrolocks in rain","Not checking motor mount condition — cracked mounts kill shift feel","Ignoring the distributor O-ring — causes mysterious misfires"],
    mod_order:"1. Fix all maintenance first (timing belt, water pump, distributor O-ring) → 2. Header (biggest gain) → 3. Intake → 4. Exhaust → 5. ECU tune → 6. Suspension → 7. Wheels/tires",
    buyer_checklist:["Compression test all 4 cylinders","Check for rust under rear seats and in wheel wells","Inspect frame rails for straightening marks","Verify VIN matches title (theft is rampant)","Check all motor mounts — rock the engine by hand","Look for oil leaks at distributor and valve cover","Test all electrical — gauges, lights, windows","Check for AC delete (many have been stripped)"] },
  {id:"ek",make:"honda",name:"Civic EK",gen:"1996–2000",hp:127,tq:107,tagline:"The golden era hatch",budget:"$1.5k–$10k",
    desc:"Refined EG chassis. EK hatch is the most desirable Honda body style ever.",
    why:"B/K swaps fully documented. The EK9 Type R is an icon. Massive junkyard swap potential.",
    warns:["Theft is rampant — kill switch mandatory","Rear trailing arm bushings wear out","Distributor O-ring leaks on every single one","Timing belt is interference — skipped belt = dead engine"],
    mistakes:["Buying a 'clean' EK without checking for hidden rust in the rear quarters","Running a B-series without upgrading the fuel system — stock fuel pump can't keep up","Not welding the subframe on swapped cars — the stock subframe flexes","Cheap eBay axles on swapped cars — they click and break within months"],
    mod_order:"Same as EG — header first, then intake, exhaust, tune. If swapping: engine swap → tune → suspension → wheels",
    buyer_checklist:["Same as EG plus:","Check rear quarter panels for bondo (peel back carpet in trunk)","Inspect trailing arm bushings (grab wheel and push/pull)","Verify the engine matches what's advertised (lots of swaps done poorly)","Check clutch master cylinder for leaks","Look under the car for welding quality if it's been swapped"] },
  {id:"8g",make:"honda",name:"Civic 8th Gen Si",gen:"2006–2011",hp:197,tq:139,tagline:"K20 NA perfection",budget:"$1.5k–$5k",
    desc:"K20Z3 revs to 8,000 RPM. Last NA VTEC Si. FA5/FG2 still $8-14k.",
    why:"Responds beautifully to bolt-ons, cams, header. Strong autocross community.",
    warns:["3rd gear synchro is weak","White paint clear coat fails","CMC (clutch master cylinder) leaks","Passenger door lock actuator fails"],
    mistakes:["Buying an automatic thinking you can swap to manual — you can't easily on 8th gen","Running a header without a tune — runs lean and causes knock","Ignoring the CMC leak — clutch pedal goes to the floor with no warning","Not checking the AC compressor — they seize and grenade the belt"],
    mod_order:"1. Intake → 2. FlashPro tune → 3. Header (tune required) → 4. Exhaust → 5. Suspension → 6. Wheels/tires",
    buyer_checklist:["Test 3rd gear specifically — shift hard into 3rd from 2nd, listen for grinding","Check paint condition on roof and hood (especially white)","Look for clutch fluid leak at the CMC (firewall, driver side)","Rev to 8000 RPM — it should pull clean with no hesitation","Check AC compressor — turn on AC, listen for noise","Inspect rear brake pads — these eat rears fast"] },
  {id:"9g",make:"honda",name:"Civic 9th Gen Si",gen:"2012–2015",hp:205,tq:174,tagline:"The underrated K24",budget:"$1k–$4k",
    desc:"K24Z7 makes more torque. Undervalued at $10-16k. 230+ WHP with bolt-ons.",
    why:"Intake + header + exhaust + FlashPro = transformed car. Excellent daily.",
    warns:["Same 3rd gear synchro issue","AC compressor fails 80-100k","Oil consumption on some examples","Rear motor mount fails causing shift clunk"],
    mistakes:["Same header-without-tune issue as 8th gen","Not replacing the rear motor mount — causes horrible clunking on shifts","Buying cheap header gaskets — they leak and cause ticking sounds","Ignoring the PCV valve — causes oil consumption issues"],
    mod_order:"Same as 8th gen — intake, tune, header, exhaust, suspension",
    buyer_checklist:["Same as 8th gen plus:","Check rear motor mount (grab the shifter and rock — clunk = bad mount)","Ask about oil consumption — check the dipstick carefully","Listen for AC compressor noise"] },
  {id:"10g",make:"honda",name:"Civic 10th Gen",gen:"2016–2021",hp:205,tq:192,tagline:"Turbocharged era",budget:"$2k–$5k",
    desc:"1.5T makes 280+ WHP on stock internals. Best bang-for-buck turbo platform.",
    why:"FlashPro + bolt-ons = different car. Massive community, everything documented.",
    warns:["Oil dilution on early 16-18 (fuel mixes with oil in cold weather)","Turbo feed line leaks ~60k","Rev hang is normal — tune fixes it","AC condenser gets hit by road debris"],
    mistakes:["Running a downpipe without a tune — this WILL damage the engine","Buying a 'Stage 2' intake from Amazon — it's just a cone filter with no airbox","Not doing an oil catch can — carbon buildup kills DI engines long-term","Ignoring the oil dilution bulletin — check your oil level and smell for gas"],
    mod_order:"1. FlashPro (fixes rev hang alone) → 2. Intake → 3. Intercooler → 4. Turbo inlet → 5. Downpipe (retune required) → 6. Exhaust → 7. Suspension",
    buyer_checklist:["Check oil level AND smell it — gasoline smell = oil dilution issue","Look for turbo feed line dampness near turbo","Check for aftermarket parts that were poorly installed and reverted","Verify the AC condenser isn't damaged (look through front grille)","Test drive in Sport mode — feel for boost delivery, any hesitation","Check for exhaust smoke on cold start (turbo seal issue)"] },
  // BMW
  {id:"e36",make:"bmw",name:"BMW E36",gen:"1992–1999",hp:240,tq:225,tagline:"The drift legend",budget:"$1k–$6k",
    desc:"M50/M52 I6 bulletproof. Non-M cars $2-5k. Best drift platform ever.",
    why:"Junkyard swaps from other BMWs, LS swap kits documented, massive parts interchangeability.",
    warns:["COOLING SYSTEM KILLS THESE CARS — replace everything","Rear subframe cracks at mounting points","Window regulators fail on every one","Rear shock tower mushrooming on drift cars"],
    mistakes:["Modding for power before fixing the cooling system — your engine will die","Buying Raceland coilovers for track use — they're street-only, they WILL blow out","Not reinforcing the rear subframe before drifting — it cracks and the rear end goes loose","Running spacers without extended studs — wheels can come off","Ignoring the VANOS seals on M50 engines — causes rough idle and power loss"],
    mod_order:"1. COOLING SYSTEM (radiator, expansion tank, thermostat, water pump, ALL hoses) → 2. Bushings and maintenance → 3. Sway bars → 4. Coilovers → 5. Tune/chip → 6. Intake → 7. Exhaust",
    buyer_checklist:["Ask when the cooling system was last serviced — if 'I don't know,' budget $500","Check for coolant residue around expansion tank (it's probably cracked)","Inspect rear subframe mounting points — rust or cracks = walk away or negotiate hard","Check for oil leaks at valve cover gasket and oil filter housing","Grab each wheel and rock it — clunking = worn control arm bushings","Check the window regulators (they all fail)","Look at the rear shock towers from inside the trunk — mushrooming = abused"] },
  {id:"e46",make:"bmw",name:"BMW E46",gen:"1999–2006",hp:225,tq:214,tagline:"The last analog BMW",budget:"$1.5k–$5k",
    desc:"Best-driving 3-series ever. M54 nearly indestructible. M3 S54 legendary.",
    why:"Already world-class handling. Tons of OEM+ upgrades from other E46 models.",
    warns:["COOLING — same as E36, replace everything","Rear subframe cracking is SERIOUS on every E46","VANOS seals wear — rattle on cold start","RTAB wear causes vague rear-end handling","M3 rod bearings need checking at 100k+"],
    mistakes:["Buying an E46 without inspecting the rear subframe — $2,000+ repair if cracked","Not replacing the RTAB (rear trailing arm bushings) — makes the car feel loose and scary at speed","Ignoring VANOS rattle thinking it's 'normal' — it gets worse and kills power","Running lowering springs on blown struts — terrible ride and handling","On M3: not checking rod bearing clearance — engine grenades with zero warning"],
    mod_order:"1. Cooling system → 2. RTAB and subframe inspection → 3. VANOS rebuild if needed → 4. Sway bars → 5. Springs or coilovers → 6. Tune → 7. Intake/exhaust",
    buyer_checklist:["Check rear subframe mounting points for cracks (lift car, look from underneath — inner fender area)","Listen for VANOS rattle on cold start — chain-like rattle that fades as oil warms","Check RTAB (rear trailing arm bushings) — grab rear wheel, push/pull laterally","Inspect all cooling system components and ask for service records","Check for oil leaks at valve cover and oil filter housing gasket","M3: ask if rod bearings have been checked or replaced — this is a deal-breaker item","Inspect the rear window — they delaminate and get cloudy"] },
  {id:"e9x",make:"bmw",name:"BMW E90/92 335i",gen:"2007–2013",hp:300,tq:300,tagline:"N54/N55 cheap power king",budget:"$2k–$8k",
    desc:"N54: $500 tune = 400HP. Full bolt-on = 500WHP. The JDM killer.",
    why:"Most tuneable engine BMW ever made. Free tunes exist. Cross-platform parts from 1-series and Z4.",
    warns:["N54: wastegate rattle, HPFP failure, injector failure, oil filter housing gasket","Charge pipe WILL crack with tune","Electric water pump fails 60-80k","N55 more reliable but less tuneable","Valve cover gasket leaks on both engines"],
    mistakes:["Tuning without replacing the charge pipe — it'll crack and you'll lose all boost suddenly","Not replacing the OFHG (oil filter housing gasket) — it leaks coolant into the oil and kills the engine","Running a catless downpipe without a proper tune — throws codes and runs like garbage","Buying an N54 without budgeting for the known failure items ($2-3k reserve recommended)","Ignoring the water pump — they fail without warning and the engine overheats in minutes"],
    mod_order:"1. Replace charge pipe (do with tune) → 2. Tune (MHD free or BM3) → 3. Intake → 4. Downpipes (retune required) → 5. Intercooler → 6. Suspension",
    buyer_checklist:["Ask if HPFP (high pressure fuel pump) has been replaced — covered by recall but check","Listen for wastegate rattle at idle (ticking from turbo area)","Check for oil leaks at valve cover and OFHG","Verify water pump and thermostat have been replaced (electric, fail 60-80k)","Look for injector staining on the intake manifold (white/tan residue = leaking injectors)","Check turbo wastegate actuator rods for play","N54: ask about index 12 injector upgrade — earlier indexes are failure-prone","Pull the charge pipe boot and look for cracks in the plastic pipe"] },
  {id:"f30",make:"bmw",name:"BMW F30 340i",gen:"2012–2019",hp:320,tq:330,tagline:"B58 modern masterpiece",budget:"$2k–$6k",
    desc:"B58: 400+ HP from tune. Shared with Supra — aftermarket exploding.",
    why:"'Reliable N54' — single turbo, massive potential, shared parts with MK5 Supra.",
    warns:["Charge pipe is plastic — upgrade with tune","Oil filter housing gasket leaks","Valve cover gasket ~80-100k","ZF transmission needs proper fluid changes"],
    mistakes:["Not upgrading the charge pipe before going Stage 2 — it WILL crack under boost","Ignoring the ZF 8-speed transmission fluid — needs changed every 60k despite BMW saying 'lifetime'","Buying cheap coilovers — the F30 chassis is sensitive to suspension quality, cheap = terrible ride","Running E85 without proper fuel system upgrades — stock LPFP can't keep up"],
    mod_order:"1. Tune (BM3 or MHD) → 2. Charge pipe + BOV → 3. Intake → 4. Intercooler → 5. Downpipe (retune) → 6. Suspension",
    buyer_checklist:["Check for oil leaks at OFHG and valve cover","Ask about transmission fluid service (should be every 60k)","Check charge pipe for cracks (remove intake boot and look)","Listen for turbo noises — whining or grinding = bearing failure","Check for coolant loss — could indicate head gasket or OFHG issue","Verify no active recalls outstanding"] },
  // Subaru
  {id:"gd",make:"subaru",name:"WRX/STI GD",gen:"2002–2007",hp:227,tq:217,tagline:"The rally legend",budget:"$2k–$8k",
    desc:"EJ turbo + AWD. The car that made Subaru famous. COBB AP is the gateway.",
    why:"Massive junkyard swap potential from STI parts. Cross-platform Subaru parts everywhere.",
    warns:["EJ ENGINES ARE FRAGILE — ringland, head gasket, rod bearing failure","ALWAYS get a Subaru-specific protune","Turbo failure common ~100k","Rust in quarter panels (NE cars)","The 5-speed WRX transmission is a glass box above 350WHP"],
    mistakes:["Running an aggressive tune on stock internals — the EJ will grenade","Using a generic dyno tuner instead of a Subaru specialist — bad tunes kill EJs fast","Not checking for boost leaks before tuning — causes lean conditions","Buying an STI without checking for spun rod bearings (common on tracked examples)","Running a BOV (blow-off valve) on the MAF-based EJ — causes stalling and rich idle","Not upgrading the up-pipe — the stock catted up-pipe cracks and leaks exhaust into the cabin"],
    mod_order:"1. Fix all maintenance (timing belt, water pump, cam seals, up-pipe) → 2. AccessPort Stage 1 → 3. Up-pipe (if stock catted) → 4. Downpipe → 5. Intake → 6. Intercooler → 7. Protune (MANDATORY) → 8. Suspension",
    buyer_checklist:["Compression test AND leak-down test all 4 cylinders — non-negotiable on EJs","Check for head gasket leaks (coolant smell, bubbles in overflow, milky oil)","Inspect turbo for shaft play (grab the compressor wheel, wiggle)","Check for boost leaks (listen for hissing under boost, check all intercooler couplings)","Look at the oil — dark and gritty = poor maintenance, milky = head gasket","Ask when timing belt was done — interference engine, belt snap = dead engine","Check the banjo bolt screen on turbo oil feed (common clog point that kills turbos)","Pull the up-pipe heat shield — look for cracks in the catted up-pipe","Inspect the clutch pedal feel — spongy = clutch master cylinder failing"] },
  {id:"gr",make:"subaru",name:"WRX/STI GR",gen:"2008–2014",hp:265,tq:244,tagline:"Widebody era — hatch life",budget:"$2k–$7k",
    desc:"GR hatch is one of the most desirable Subarus. STI = 305HP. Becoming a modern classic.",
    why:"Same junkyard swap potential as GD. STI parts bolt onto WRX. Hatch is incredibly practical.",
    warns:["Same EJ warnings as GD","STI DCCD center diff needs fluid changes","WRX 5-speed weak above 350WHP","Turbo inlet hose cracks cause boost leaks","Ring gear bolts on STI diff can back out"],
    mistakes:["Same EJ mistakes as GD","Not upgrading the turbo inlet hose — it cracks silently and causes lean conditions","Running the STI without changing DCCD fluid — the center diff wears out","Putting WRX wheels on STI without checking brake clearance — STI Brembos are bigger","Cheap aftermarket headers on EJ257 — unequal length is part of the character, equal length sounds wrong"],
    mod_order:"Same as GD — fix maintenance first, AP, up-pipe, downpipe, intake, intercooler, protune",
    buyer_checklist:["Same as GD plus:","Check the turbo inlet hose for cracks (silicone squeeze test)","STI: check DCCD operation — should feel different in Auto vs Manual mode","GR hatch: check rear hatch struts — they fail and the hatch drops on your head","Look for rust in the rear wheel wells and rocker panels","Check for rattles in the dashboard — common and annoying"] },
  {id:"va",make:"subaru",name:"WRX VA",gen:"2015–2021",hp:268,tq:258,tagline:"FA20DIT modern turbo",budget:"$1.5k–$5k",
    desc:"FA20 DI twin-scroll. 300WHP easy and safe. Best current-gen WRX value.",
    why:"COBB ecosystem is huge. STI brake swap is common. Cross-platform with BRZ for some parts.",
    warns:["Carbon buildup on intake valves (DI engine)","Throw-out bearing noise common","NEVER run bolt-ons without AP tune","Stock tune runs lean — even Stage 1 improves reliability","Rev hang is extreme stock"],
    mistakes:["Running any bolt-on without an AccessPort tune — the FA20 WILL run lean and knock","Not getting an AOS (air/oil separator) — carbon buildup kills FA20 engines over time","Buying a 'Stage 2' car without verifying it was protuned — COBB OTS Stage 2 maps are sketchy long-term","Not replacing the throw-out bearing during a clutch job — it'll fail 10k later","Using non-Subaru-specific oil — the FA20 needs 5W-30 that meets Subaru spec, not just any 5W-30"],
    mod_order:"1. AccessPort Stage 1 (fixes rev hang immediately) → 2. Intake (with AP Stage 1+ map) → 3. AOS or catch can → 4. Turbo inlet hose → 5. TMIC → 6. J-pipe/downpipe (Stage 2, protune MANDATORY) → 7. Exhaust → 8. Suspension",
    buyer_checklist:["Check if it's been tuned — ask about AccessPort history (APs are married to the car)","Listen for throw-out bearing noise (chirping/squealing with clutch pedal up, goes away when pressed)","Check for aftermarket parts — verify everything was tuned properly","Look for oil leaks at valve covers","Check the turbo inlet hose condition","Ask about maintenance schedule — FA20 needs oil changes every 3-5k","If modded: ask who tuned it and verify they're a reputable Subaru tuner"] },
];

const VEHICLES = [
  {id:"eg1",plat:"eg",year:1993,trim:"Si",engine:"D16Z6 1.6L VTEC"},{id:"eg2",plat:"eg",year:1995,trim:"EX",engine:"D16Z6 VTEC"},{id:"eg3",plat:"eg",year:1994,trim:"DX Hatch",engine:"D15B7 1.5L"},
  {id:"ek1",plat:"ek",year:1999,trim:"Si (EM1)",engine:"B16A2 VTEC"},{id:"ek2",plat:"ek",year:2000,trim:"Si",engine:"B16A2 VTEC"},{id:"ek3",plat:"ek",year:1998,trim:"EX",engine:"D16Y8 VTEC"},
  {id:"8g1",plat:"8g",year:2008,trim:"Si Sedan (FA5)",engine:"K20Z3 2.0L"},{id:"8g2",plat:"8g",year:2010,trim:"Si Coupe (FG2)",engine:"K20Z3 2.0L"},
  {id:"9g1",plat:"9g",year:2013,trim:"Si",engine:"K24Z7 2.4L"},{id:"9g2",plat:"9g",year:2015,trim:"Si",engine:"K24Z7 2.4L"},
  {id:"10g1",plat:"10g",year:2017,trim:"Si",engine:"L15B7 1.5T"},{id:"10g2",plat:"10g",year:2019,trim:"Si",engine:"L15B7 1.5T"},{id:"10g3",plat:"10g",year:2018,trim:"Type R",engine:"K20C1 2.0T"},
  {id:"e36_1",plat:"e36",year:1997,trim:"328i",engine:"M52B28 2.8L I6"},{id:"e36_2",plat:"e36",year:1998,trim:"M3",engine:"S52 3.2L I6"},{id:"e36_3",plat:"e36",year:1995,trim:"325i",engine:"M50 2.5L I6"},
  {id:"e46_1",plat:"e46",year:2003,trim:"330i",engine:"M54 3.0L I6"},{id:"e46_2",plat:"e46",year:2004,trim:"M3",engine:"S54 3.2L I6"},{id:"e46_3",plat:"e46",year:2002,trim:"330i ZHP",engine:"M54 3.0L"},
  {id:"e9x1",plat:"e9x",year:2008,trim:"335i (N54)",engine:"N54 3.0L TT"},{id:"e9x2",plat:"e9x",year:2011,trim:"335i (N55)",engine:"N55 3.0T"},{id:"e9x3",plat:"e9x",year:2009,trim:"335i Coupe",engine:"N54 3.0L TT"},
  {id:"f30_1",plat:"f30",year:2016,trim:"340i",engine:"B58 3.0T"},{id:"f30_2",plat:"f30",year:2018,trim:"340i",engine:"B58 3.0T"},
  {id:"gd1",plat:"gd",year:2004,trim:"WRX",engine:"EJ205 2.0T"},{id:"gd2",plat:"gd",year:2006,trim:"STI",engine:"EJ257 2.5T"},{id:"gd3",plat:"gd",year:2005,trim:"WRX",engine:"EJ255 2.5T"},
  {id:"gr1",plat:"gr",year:2011,trim:"WRX Hatch",engine:"EJ255 2.5T"},{id:"gr2",plat:"gr",year:2013,trim:"STI Hatch",engine:"EJ257 2.5T"},
  {id:"va1",plat:"va",year:2016,trim:"WRX",engine:"FA20DIT 2.0T"},{id:"va2",plat:"va",year:2019,trim:"WRX",engine:"FA20DIT 2.0T"},{id:"va3",plat:"va",year:2020,trim:"STI",engine:"EJ257 2.5T"},
];

const CATS = [
  {id:"tune",name:"ECU / Tune",icon:"⚡"},{id:"intake",name:"Intake",icon:"💨"},{id:"exhaust",name:"Exhaust",icon:"🔥"},
  {id:"ic",name:"Intercooler / Cooling",icon:"❄️"},{id:"engine",name:"Engine",icon:"🔩"},{id:"susp",name:"Suspension",icon:"🔧"},
  {id:"wheels",name:"Wheels",icon:"◎"},{id:"tires",name:"Tires",icon:"⬤"},{id:"ext",name:"Exterior",icon:"🏎"},
  {id:"int",name:"Interior / Shifter",icon:"🪑"},{id:"clutch",name:"Clutch / Drivetrain",icon:"⚙️"},
  {id:"junk",name:"🏴‍☠️ Junkyard Gold",icon:"🏴‍☠️"}, // THE SECRET SAUCE
];

const SK={1:{l:"Bolt-On",c:"#2EC4B6"},2:{l:"Easy DIY",c:"#7EC8A0"},3:{l:"Intermediate",c:"#FFB703"},4:{l:"Advanced",c:"#FB8500"},5:{l:"Shop Rec.",c:"#E63946"}};

// ═══ PARTS (90+ including junkyard swaps and hidden bolt-ons) ═══
const PARTS = [
  // ══════ HONDA EG/EK — Regular + JUNKYARD GOLD ══════
  {id:"h1",name:"Hondata S300 V3",brand:"Hondata",cat:"tune",price:650,desc:"Full OBD1 piggyback ECU. The gold standard for old-school Honda tuning. Dyno tune recommended.",hp:15,tq:10,ret:"Hondata",sk:3,time:2,tools:"Soldering iron, ECU pin kit, laptop",notes:"Requires chipping your ECU or buying pre-chipped. This unlocks the full potential of any swap.",plats:["eg","ek"]},
  {id:"h2",name:"Chipped P28 ECU",brand:"Honda OEM",cat:"tune",price:120,desc:"Pre-chipped OBD1 ECU ready for Hondata or Neptune. Budget tuning entry — plug and play.",hp:10,tq:5,ret:"eBay",sk:2,time:0.5,tools:"10mm socket",notes:"Make sure it's socketed for your tuning system. These are getting harder to find clean.",plats:["eg","ek"]},
  {id:"h3",name:"AEM Short Ram Intake",brand:"AEM",cat:"intake",price:89,desc:"Budget short ram — VTEC crossover sound and modest airflow gains. The starter mod.",hp:5,tq:3,ret:"Amazon",sk:1,time:0.3,tools:"10mm socket",notes:"15-minute install. Add a heat shield if your bay runs hot.",plats:["eg","ek"]},
  {id:"h4",name:"Injen Cold Air Intake",brand:"Injen",cat:"intake",price:215,desc:"True cold air routing with heat shield. Real flow gains, not just noise.",hp:8,tq:5,ret:"Summit Racing",sk:1,time:0.5,tools:"10mm, flathead",notes:"Route behind bumper for true cold air. Don't drive through deep puddles.",plats:["eg","ek"]},
  {id:"h5",name:"Yonaka Catback",brand:"Yonaka",cat:"exhaust",price:199,desc:"Budget stainless catback. Decent tone, bolt-on. The go-to budget exhaust for 20 years.",hp:3,tq:3,ret:"eBay",sk:2,time:1.5,tools:"14mm, jack stands, WD-40",notes:"Soak stock bolts overnight. May need to massage hangers for fitment.",plats:["eg","ek"]},
  {id:"h6",name:"DC Sports 4-1 Header",brand:"DC Sports",cat:"exhaust",price:175,desc:"Ceramic 4-1 header — the biggest single power-per-dollar mod on ANY D-series engine. Period.",hp:12,tq:8,ret:"Amazon",sk:3,time:2.5,tools:"12mm, 14mm, penetrating oil, jack stands, new gasket",notes:"Manifold bolts will fight you. Soak 24hrs in PB Blaster. Always use a new exhaust gasket.",plats:["eg","ek"]},
  {id:"h7",name:"Skunk2 MegaPower Exhaust",brand:"Skunk2",cat:"exhaust",price:350,desc:"Iconic catback — perfect fitment, great sound, real gains. The premium choice.",hp:5,tq:4,ret:"Summit Racing",sk:2,time:1.5,tools:"14mm, jack stands",notes:"Pairs perfectly with DC header. The combined sound is legendary.",plats:["eg","ek"]},
  {id:"h8",name:"Tein Street Basis Z Coilovers",brand:"Tein",cat:"susp",price:550,desc:"Height-adjustable. Good street ride, eliminates body roll. These light cars transform with coilovers.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"17/19mm, jack stands, spring compressor",notes:"Night and day handling difference on a car that weighs 2,200 lbs.",plats:["eg","ek"]},
  {id:"h9",name:"Skunk2 Sport Lowering Springs",brand:"Skunk2",cat:"susp",price:160,desc:"~2\" drop. Tighter handling, aggressive stance. Budget option.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"Spring compressor, 17/19mm, jack stands",notes:"Pair with KYB AGX struts if yours are blown. Get alignment after.",plats:["eg","ek"]},
  {id:"h10",name:"Konig Hypergram 15x7 (×4)",brand:"Konig",cat:"wheels",price:580,desc:"Flow-formed lightweight. Perfect EG/EK fitment. 15x7 +35 is the sweet spot.",hp:0,tq:0,ret:"Fitment Industries",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"Hub-centric rings required. These save serious unsprung weight on a car this light.",plats:["eg","ek"]},
  {id:"h11",name:"Federal 595 RS-RR 195/50R15 (×4)",brand:"Federal",cat:"tires",price:280,desc:"Budget semi-slick. Insane grip for the money. The grassroots autocross cheat code.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"Summer only. Wear fast but they're cheap to replace. Grip level is absurd.",plats:["eg","ek"]},
  {id:"h12",name:"Buddy Club P1 Shift Knob",brand:"Buddy Club",cat:"int",price:35,desc:"Weighted titanium-look knob. Smoother shifts for pocket change.",hp:0,tq:0,ret:"Amazon",sk:1,time:0.1,tools:"None",notes:"Check thread pitch (10x1.5mm for EG/EK). 30-second install.",plats:["eg","ek"]},
  {id:"h13",name:"NRG Quick Release Hub",brand:"NRG",cat:"int",price:110,desc:"Short hub + quick release for aftermarket wheels. Anti-theft bonus.",hp:0,tq:0,ret:"Amazon",sk:2,time:1,tools:"Steering wheel puller, 17mm",notes:"Disables airbag/horn. Track/show only unless you wire a horn button.",plats:["eg","ek"]},
  // ── EG/EK JUNKYARD GOLD ──
  {id:"jh1",name:"🏴‍☠️ Mini-Me Swap (Y8 Head on D15)",brand:"Honda Junkyard",cat:"junk",price:150,desc:"THE classic junkyard Honda mod. Take a VTEC head (D16Y8 or D16Z6) and bolt it onto a non-VTEC D15 block. You get VTEC on your base-model Civic for $100-200 in junkyard parts. This has been done thousands of times since the mid-90s. You need the head, intake manifold, ECU (P28), and VTEC wiring. Adds about 20HP and the VTEC crossover sound.",hp:20,tq:10,ret:"Junkyard / eBay",sk:4,time:8,tools:"Full socket set, head gasket set ($30), torque wrench, coolant, VTEC solenoid wiring",notes:"THE original Honda junkyard hack. Find a D16Y8 head at Pick-n-Pull for $50-100. Use a P28 ECU with Hondata and you have a fully tunable VTEC engine for under $200. Thousands have done this — guides are everywhere on Honda-Tech.",plats:["eg","ek"]},
  {id:"jh2",name:"🏴‍☠️ Integra Type R Brake Swap",brand:"Acura Junkyard",cat:"junk",price:200,desc:"Pull front brake calipers, rotors, and brackets from a 1997-2001 Integra Type R (or GSR — same brakes). Direct bolt-on to EG/EK hubs. Transforms braking from terrifying to confidence-inspiring. The biggest braking upgrade possible without custom brackets.",hp:0,tq:0,ret:"Junkyard / eBay",sk:3,time:2,tools:"14mm, 17mm sockets, brake line flare wrench, brake fluid, new pads",notes:"ITR brakes bolt directly onto EG/EK spindles. No modification needed. You need the calipers, brackets, rotors, and pads. Junkyard set: $100-200. This is the brake upgrade that every EG/EK track car runs.",plats:["eg","ek"]},
  {id:"jh3",name:"🏴‍☠️ Del Sol VTEC ECU Swap",brand:"Honda Junkyard",cat:"junk",price:40,desc:"The P28 ECU from a 93-95 Del Sol VTEC is the same ECU used in the EG Si — but nobody looks for them in Del Sols. They're cheaper to find at junkyards because Del Sols got crushed more. Same exact part, different source.",hp:10,tq:5,ret:"Junkyard",sk:2,time:0.5,tools:"10mm socket",notes:"Hidden knowledge: Del Sol VTEC P28 ECU = Civic Si P28 ECU. Same part number. Del Sol ones are cheaper because nobody thinks to look. Check Pull-A-Part before paying eBay prices.",plats:["eg","ek"]},
  {id:"jh4",name:"🏴‍☠️ CRX/EF Rear Disc Conversion",brand:"Honda Junkyard",cat:"junk",price:100,desc:"EG/EK came with rear drums. Pull the rear disc brake setup from a 90-91 Integra and bolt it on. Direct swap with minor brake line modification. Rear discs = massively better braking balance and the ability to actually use a handbrake for slides.",hp:0,tq:0,ret:"Junkyard",sk:3,time:3,tools:"Full socket set, brake line flare kit, brake fluid, new rear pads",notes:"One of the oldest Honda junkyard tricks. 90-91 Integra rear disc assemblies bolt onto EG/EK trailing arms. You need the calipers, rotors, brackets, and to modify the brake hard lines slightly. Every serious EG/EK build does this.",plats:["eg","ek"]},
  {id:"jh5",name:"🏴‍☠️ Civic Si Cluster Swap",brand:"Honda Junkyard",cat:"junk",price:30,desc:"Base-model EG/EK clusters don't have a tachometer. Pull the gauge cluster from an Si or EX at the junkyard — direct plug-and-play swap. Now you have a tach, which is kind of important if you're building an engine.",hp:0,tq:0,ret:"Junkyard",sk:1,time:0.5,tools:"Phillips screwdriver, 10mm",notes:"$15-30 at a junkyard. Plug and play — same connector. Every DX/CX/base model owner does this first.",plats:["eg","ek"]},

  // ══════ HONDA 10TH GEN ══════
  {id:"h40",name:"Hondata FlashPro (1.5T)",brand:"Hondata",cat:"tune",price:695,desc:"Gold standard 1.5T tuning. Fixes rev hang, unlocks full bolt-on potential.",hp:40,tq:55,ret:"Summit Racing",sk:2,time:0.5,tools:"Laptop, USB",notes:"Base map first, protune later. The rev hang fix alone is worth it to some people.",plats:["10g"]},
  {id:"h41",name:"PRL Cobra Cold Air Intake",brand:"PRL Motorsports",cat:"intake",price:350,desc:"Velocity stack CAI with sealed airbox. Massive flow, incredible turbo sounds.",hp:8,tq:10,ret:"Summit Racing",sk:1,time:0.5,tools:"10mm, flathead",notes:"Easiest mod on the car. 20 minutes. The turbo spool sound alone is worth it.",plats:["10g"]},
  {id:"h42",name:"K&N Typhoon Intake (1.5T)",brand:"K&N",cat:"intake",price:185,desc:"Budget cold air intake — half the PRL price, still solid gains.",hp:5,tq:6,ret:"Amazon",sk:1,time:0.5,tools:"10mm",notes:"Great starter mod if PRL is too expensive.",plats:["10g"]},
  {id:"h43",name:"Invidia Q300 Cat-Back",brand:"Invidia",cat:"exhaust",price:825,desc:"70mm, deep tone, zero drone. The exhaust most 10th gen owners end up with.",hp:5,tq:8,ret:"Amazon",sk:3,time:2,tools:"14mm, PB Blaster, jack stands",notes:"Soak bolts overnight. Need a friend to hold the pipe.",plats:["10g"]},
  {id:"h44",name:"Yonaka Catback (10th Gen)",brand:"Yonaka",cat:"exhaust",price:320,desc:"Budget stainless. Half the Invidia price, slightly louder/raspier.",hp:3,tq:5,ret:"eBay",sk:3,time:2,tools:"14mm, PB Blaster, jack stands",notes:"Good value option.",plats:["10g"]},
  {id:"h45",name:"MAPerformance Catted DP",brand:"MAPerformance",cat:"exhaust",price:499,desc:"Biggest single bolt-on gain for 1.5T. TUNE REQUIRED.",hp:25,tq:30,ret:"MAPerformance",sk:4,time:3,tools:"14mm deep, O2 socket, PB Blaster, jack stands",notes:"Hardest bolt-on. Turbo bolts are brutal. Soak 24hrs. Must retune.",plats:["10g"]},
  {id:"h46",name:"PRL Stage 1 Intercooler",brand:"PRL Motorsports",cat:"ic",price:475,desc:"Drops intake temps 30-50°F. Consistent power in heat.",hp:10,tq:15,ret:"PRL Direct",sk:3,time:2,tools:"10/12mm, pliers",notes:"Bumper off required. Mark hose positions first.",plats:["10g"]},
  {id:"h47",name:"27WON Turbo Inlet",brand:"27WON",cat:"engine",price:189,desc:"Larger inlet, better spool. Simple but effective.",hp:5,tq:8,ret:"27WON",sk:2,time:0.75,tools:"10mm, flathead",notes:"Top of engine bay — easy access.",plats:["10g"]},
  {id:"h48",name:"Mishimoto Catch Can",brand:"Mishimoto",cat:"engine",price:165,desc:"PCV catch can. Prevents carbon buildup — essential for DI turbo longevity.",hp:0,tq:0,ret:"Amazon",sk:2,time:1,tools:"10mm, zip ties",notes:"Drain every oil change. This is maintenance, not just a mod.",plats:["10g"]},
  {id:"h49",name:"Eibach Pro-Kit Springs",brand:"Eibach",cat:"susp",price:280,desc:"~1\" drop. Tighter handling, still daily-friendly.",hp:0,tq:0,ret:"Summit Racing",sk:3,time:3,tools:"Spring compressor, 17/19mm, jack stands",notes:"Get alignment after. Drop is subtle but handling change is obvious.",plats:["10g"]},
  {id:"h50",name:"BC Racing BR Coilovers",brand:"BC Racing",cat:"susp",price:1095,desc:"30-way adjustable. Street to track in one kit.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"17/19mm, breaker bar, jack stands, torque wrench",notes:"Pro alignment mandatory. Pre-set height before install.",plats:["10g"]},
  {id:"h51",name:"Enkei RPF1 18x8.5 (×4)",brand:"Enkei",cat:"wheels",price:1380,desc:"Forged lightweight legend. ~15 lbs total unsprung savings.",hp:0,tq:0,ret:"Fitment Industries",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"Hub rings needed (73.1→64.1mm). Re-torque at 50 mi.",plats:["10g"]},
  {id:"h52",name:"Konig Hypergram 17x8 (×4)",brand:"Konig",cat:"wheels",price:780,desc:"Budget RPF1 alternative — similar weight, half the price.",hp:0,tq:0,ret:"Fitment Industries",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"Great value. Same hub ring requirement.",plats:["10g"]},
  {id:"h53",name:"Bayson R CS Front Lip",brand:"Bayson R",cat:"ext",price:135,desc:"PU front lip. Flexible, survives daily driving.",hp:0,tq:0,ret:"eBay",sk:2,time:1,tools:"Self-tappers, drill",notes:"Warm in sun before fitting. Test fit first.",plats:["10g"]},
  {id:"h54",name:"Acuity POCO Shift Knob",brand:"Acuity",cat:"int",price:99,desc:"490g weighted — transforms shift feel.",hp:0,tq:0,ret:"Acuity",sk:1,time:0.1,tools:"None",notes:"Reverse thread (lefty-tighty). 30 seconds.",plats:["10g"]},
  {id:"h55",name:"GrimmSpeed Shift Stop",brand:"GrimmSpeed",cat:"int",price:40,desc:"Removes 1-2 gate slop. $40 for a transformed shifter.",hp:0,tq:0,ret:"Amazon",sk:2,time:0.5,tools:"10mm, console tools",notes:"Adjust until snug but not binding.",plats:["10g"]},
  // 10th gen hidden
  {id:"jh10",name:"🏴‍☠️ Accord 2.0T Intercooler Swap",brand:"Honda OEM",cat:"junk",price:80,desc:"The 2018+ Accord 2.0T intercooler is physically larger than the Si intercooler and bolts into the 10th gen Si with minor modifications. Junkyard cost: $50-100. It's 80% of a PRL intercooler for 15% of the price. This swap has been documented on CivicX forums since 2019.",hp:5,tq:8,ret:"Junkyard / eBay",sk:3,time:2.5,tools:"10/12mm, flathead, pliers, minor trimming tools",notes:"The Accord 2.0T IC core is larger and flows better than stock Si IC. Requires slight bumper bracket trimming. Full guides on CivicX. This is the budget move before buying a $475 PRL intercooler.",plats:["10g"]},

  // ══════ BMW ══════
  {id:"b1",name:"Turner Chip (E36)",brand:"Turner",cat:"tune",price:299,desc:"Performance chip — adjusts fuel, removes limiter.",hp:15,tq:10,ret:"Turner Motorsport",sk:2,time:1,tools:"Torx set",notes:"Swap chip in glovebox ECU. 30 min.",plats:["e36"]},
  {id:"b2",name:"aFe Intake (E36/E46)",brand:"aFe",cat:"intake",price:175,desc:"CAI with heat shield. I6 intake sound is addictive.",hp:8,tq:5,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"Easy install. The I6 howl at redline is incredible.",plats:["e36","e46"]},
  {id:"b3",name:"Budget eBay Catback (E36)",brand:"Generic",cat:"exhaust",price:180,desc:"Budget stainless catback. It works and it's cheap.",hp:3,tq:3,ret:"eBay",sk:3,time:2,tools:"13/15mm, jack stands",notes:"Fitment varies. Budget extra time.",plats:["e36"]},
  {id:"b4",name:"Mishimoto Radiator (E36)",brand:"Mishimoto",cat:"ic",price:220,desc:"PRIORITY #1. Fix cooling before it kills your engine.",hp:0,tq:0,ret:"Amazon",sk:3,time:2,tools:"10mm, Phillips, drain pan",notes:"Replace expansion tank + thermostat + water pump + ALL hoses while you're in there. This is survival.",plats:["e36"]},
  {id:"b5",name:"Raceland Coilovers (E36)",brand:"Raceland",cat:"susp",price:450,desc:"Budget coilovers that actually work. Street-only.",hp:0,tq:0,ret:"Raceland",sk:3,time:3,tools:"16/18mm, spring compressor, jack stands",notes:"Not track-ready. Great for daily.",plats:["e36"]},
  {id:"b6",name:"Ireland Eng. Sway Bars (F+R)",brand:"Ireland Eng.",cat:"susp",price:285,desc:"THE best handling mod for E36. Transforms body roll.",hp:0,tq:0,ret:"Ireland Engineering",sk:3,time:2,tools:"16/18mm, jack stands",notes:"Start on middle adjustment hole.",plats:["e36"]},
  // E36 JUNKYARD
  {id:"jb1",name:"🏴‍☠️ M50 Manifold on M52 Swap",brand:"BMW Junkyard",cat:"junk",price:60,desc:"The M50 intake manifold has larger runners than the M52 manifold. It bolts directly onto the M52 engine with a throttle body adapter ($30). Free top-end power that BMW tuners have known about since the late 90s. The M50 manifold is everywhere at junkyards.",hp:10,tq:5,ret:"Junkyard / eBay",sk:3,time:3,tools:"10mm, 12mm, TB adapter, new intake gaskets",notes:"One of the oldest BMW junkyard secrets. M50 manifold flows better than M52, bolts right on. Documented on R3vlimited since 2001. TB adapter is ~$30 from Amazon.",plats:["e36"]},
  {id:"jb2",name:"🏴‍☠️ E36 Compact Subframe Plates",brand:"Various Fab Shops",cat:"junk",price:40,desc:"The E36 rear subframe cracks at the mounting points — a $2,000+ repair when it fails. A set of reinforcement plates from a small fab shop costs $30-50 and prevents this entirely. Weld them on and never worry about it again. This fix has been known since the early drift days.",hp:0,tq:0,ret:"eBay / BimmerForums classifieds",sk:4,time:3,tools:"Welder (MIG), grinder, jack stands, PB Blaster",notes:"$40 that prevents a $2,000 problem. You need welding skills or a friend with a welder. Clean the mounting points, weld the plates on. Every drift E36 has these. If you can't weld, any muffler shop can do it for $100.",plats:["e36"]},
  {id:"jb3",name:"🏴‍☠️ Z3 Short Shifter Swap",brand:"BMW Junkyard",cat:"junk",price:25,desc:"The Z3 shifter assembly has a shorter lever than the E36 sedan/coupe. It's a direct bolt-in swap that shortens your throw by about 30%. Junkyard cost: $15-30. This has been known on Bimmerforums since the early 2000s.",hp:0,tq:0,ret:"Junkyard",sk:2,time:1.5,tools:"13mm, 10mm, shifter boot removal",notes:"Z3 shifter carrier = shorter throws in E36. Same part, shorter lever. Check Bimmerforums DIY thread from 2003. Way cheaper than buying a $200 aftermarket short shifter.",plats:["e36"]},

  // E46
  {id:"b10",name:"Shark Injector Tune",brand:"Turner",cat:"tune",price:350,desc:"Plug-in flash for M54/S54. Removes limiter, adjusts maps.",hp:15,tq:12,ret:"Turner Motorsport",sk:1,time:0.3,tools:"OBD2 cable",notes:"Plug, flash, done. Reversible.",plats:["e46"]},
  {id:"b11",name:"Magnaflow Catback (E46)",brand:"Magnaflow",cat:"exhaust",price:550,desc:"Stainless, deep I6, zero drone.",hp:5,tq:5,ret:"Summit Racing",sk:3,time:2,tools:"13/15mm, PB Blaster, jack stands",notes:"Check rubber hangers while under there.",plats:["e46"]},
  {id:"b12",name:"H&R Sport Springs (E46)",brand:"H&R",cat:"susp",price:230,desc:"1.3\" drop. Perfect OEM+ stance.",hp:0,tq:0,ret:"FCP Euro",sk:3,time:3,tools:"Spring compressor, 16/18mm, jack stands",notes:"E46 looks incredible lowered an inch.",plats:["e46"]},
  {id:"b13",name:"Mishimoto Radiator (E46)",brand:"Mishimoto",cat:"ic",price:250,desc:"Same as E36 — fix cooling before engine dies.",hp:0,tq:0,ret:"Amazon",sk:3,time:2.5,tools:"10mm, Phillips, drain pan",notes:"Replace expansion tank + thermostat + all hoses.",plats:["e46"]},
  // E46 JUNKYARD
  {id:"jb4",name:"🏴‍☠️ ZHP Knob + Boot + Shift Bushing",brand:"BMW Junkyard",cat:"junk",price:45,desc:"The E46 ZHP (330i Performance Package) has a shorter weighted shift knob and a stiffer shift bushing. Both bolt directly into any E46 manual. The combination gives shorter, more precise throws. Junkyard cost: $20-50. OEM BMW parts doing OEM BMW things.",hp:0,tq:0,ret:"Junkyard / eBay",sk:2,time:0.5,tools:"None for knob, pliers for bushing",notes:"ZHP shift parts are the best-kept E46 secret. The weighted knob + stiffer bushing transforms the shift feel. Way better than any aftermarket short shifter because it's OEM quality.",plats:["e46"]},
  {id:"jb5",name:"🏴‍☠️ E46 M3 Front Bumper Swap",brand:"BMW Junkyard",cat:"junk",price:150,desc:"The E46 M3 front bumper bolts directly onto any E46 sedan/coupe with the M3 bumper brackets (included at junkyard). Transforms the front end from boring to aggressive. This is the #1 cosmetic mod on every E46 forum since 2004.",hp:0,tq:0,ret:"Junkyard / eBay",sk:2,time:2,tools:"10mm, T25 Torx, bumper clips, respray budget",notes:"Bumper swaps direct but needs repainting. Budget $200-300 for paint match. The brackets from the M3 are needed — grab those at the yard too. Fog lights are different so grab those as well.",plats:["e46"]},

  // E9X
  {id:"b20",name:"BM3 Stage 1 (N54/N55)",brand:"bootmod3",cat:"tune",price:500,desc:"Gold standard. +80HP pump gas. OBD flash.",hp:80,tq:80,ret:"ProTuningFreaks",sk:1,time:0.3,tools:"Phone/laptop, OBD2",notes:"Best $500 you'll ever spend on a car.",plats:["e9x"]},
  {id:"b21",name:"MHD Stage 1 (FREE)",brand:"MHD Flasher",cat:"tune",price:0,desc:"FREE flash tune via Android. +60HP. Not a joke.",hp:60,tq:60,ret:"MHD (Android)",sk:1,time:0.3,tools:"Android phone, $20 BT adapter",notes:"Free. Legit. Game-changing. The most insane value in cars.",plats:["e9x"]},
  {id:"b22",name:"BMS Dual Cone Intake ($99)",brand:"BMS",cat:"intake",price:99,desc:"Ultra-budget. Exposes turbos for max sound.",hp:5,tq:5,ret:"Burger Motorsports",sk:1,time:0.3,tools:"Flathead",notes:"Maximum turbo sounds for minimum dollars.",plats:["e9x"]},
  {id:"b23",name:"CTS Catless Downpipes",brand:"CTS Turbo",cat:"exhaust",price:450,desc:"3\" catless. Massive flow. Off-road only. TUNE REQUIRED.",hp:30,tq:35,ret:"ECS Tuning",sk:4,time:3,tools:"13/15mm deep, O2 socket, PB Blaster, jack stands",notes:"Flash Stage 2 before first start. Turbo spool improvement is dramatic.",plats:["e9x"]},
  {id:"b24",name:"Muffler Delete ($75)",brand:"Various",cat:"exhaust",price:75,desc:"Straight pipe rear muffler. Free-ish power, raw I6 sound.",hp:3,tq:3,ret:"eBay",sk:2,time:1,tools:"13mm, jack stands",notes:"Gets raspy high RPM. Some love it, some don't.",plats:["e9x","f30"]},
  {id:"b25",name:"BMS Charge Pipe (MUST DO)",brand:"BMS",cat:"engine",price:120,desc:"Replaces the PLASTIC charge pipe that WILL crack under boost. Non-negotiable with any tune.",hp:0,tq:0,ret:"Burger Motorsports",sk:2,time:1,tools:"10mm, flathead, pliers",notes:"Stock pipe cracks. Period. Not if, when. Do this the same day you tune.",plats:["e9x"]},
  {id:"b26",name:"Wagner FMIC",brand:"Wagner Tuning",cat:"ic",price:800,desc:"Front-mount IC. No heat soak ever again. Essential Stage 2+.",hp:15,tq:15,ret:"ECS Tuning",sk:4,time:4,tools:"T25/T30, 10/13mm, drain pan",notes:"Bumper off. AC condenser relocation. Worth every minute.",plats:["e9x"]},
  {id:"b27",name:"H&R Sport Springs (E9X)",brand:"H&R",cat:"susp",price:260,desc:"1\" drop. Great daily ride. OEM+ look.",hp:0,tq:0,ret:"FCP Euro",sk:3,time:3,tools:"Spring compressor, 16/18mm, jack stands",notes:"Perfect for the daily driver.",plats:["e9x"]},
  // E9X JUNKYARD
  {id:"jb6",name:"🏴‍☠️ Index 12 Injector Upgrade",brand:"BMW OEM",cat:"junk",price:300,desc:"N54 injectors come in different 'indexes' (revisions). Early cars have index 7-10 injectors that are prone to failure. Index 12 injectors (latest revision) are dramatically more reliable. Pull them from a newer N54 at the junkyard ($200-400 for a set of 6) or buy remanufactured. This is preventive maintenance that every N54 owner needs to know about.",hp:0,tq:0,ret:"Junkyard / FCP Euro (reman)",sk:3,time:2,tools:"10mm, injector removal tool, new O-rings, new seals",notes:"Check your current injector index by reading the part number on the side. If you're below index 12, replace them before they fail. Failed injectors cause misfires, lean conditions, and can crack the cylinder sleeve. FCP Euro sells remanufactured index 12 sets.",plats:["e9x"]},
  {id:"jb7",name:"🏴‍☠️ 135i/1M Oil Cooler Swap",brand:"BMW OEM",cat:"junk",price:200,desc:"The N54-powered 135i and 1M have an oil cooler that the 335i doesn't. It bolts directly onto the E90/E92 335i oil filter housing. Keeps oil temps 20-30°F cooler under hard driving. Junkyard cost: $100-250.",hp:0,tq:0,ret:"Junkyard / eBay",sk:3,time:2,tools:"Oil filter housing removal tools, new gaskets, oil",notes:"Known on N54Tech since 2010. The 335i overheats its oil during track use or sustained pulls. The 135i cooler fixes this. Same engine, same housing — BMW just didn't put the cooler on the 335i. Grab the cooler, lines, and bracket from a 135i at the yard.",plats:["e9x"]},

  // F30
  {id:"b30",name:"BM3 Stage 1 (B58)",brand:"bootmod3",cat:"tune",price:500,desc:"400+ HP pump gas. Mind-blowing.",hp:80,tq:85,ret:"ProTuningFreaks",sk:1,time:0.3,tools:"Laptop, OBD2",notes:"The most dramatic tune result in the car world.",plats:["f30"]},
  {id:"b31",name:"aFe Momentum Intake (B58)",brand:"aFe",cat:"intake",price:350,desc:"Sealed CAI. Turbo flutter sounds are incredible.",hp:10,tq:12,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"Easy install, huge sound improvement.",plats:["f30"]},
  {id:"b32",name:"VRSF Catless DP (B58)",brand:"VRSF",cat:"exhaust",price:400,desc:"4\" catless. Massive gains with tune. Off-road only.",hp:25,tq:30,ret:"VRSF",sk:4,time:2.5,tools:"15mm, O2 socket, PB Blaster, jack stands",notes:"Must have tune. Power gains are dramatic.",plats:["f30"]},
  {id:"b33",name:"VRSF Chargepipe + BOV",brand:"VRSF",cat:"engine",price:180,desc:"Aluminum charge pipe. Prevents cracking. BOV sounds are a bonus.",hp:0,tq:0,ret:"VRSF",sk:2,time:1,tools:"10mm, flathead, pliers",notes:"Prevents stock plastic from cracking. BOV sound is addictive.",plats:["f30"]},
  {id:"b34",name:"H&R Sport Springs (F30)",brand:"H&R",cat:"susp",price:280,desc:"1\" drop. Perfect daily stance.",hp:0,tq:0,ret:"FCP Euro",sk:3,time:3,tools:"Spring compressor, 16/18mm, jack stands",notes:"F30 looks much better lowered an inch.",plats:["f30"]},
  // F30 hidden
  {id:"jb8",name:"🏴‍☠️ Supra MK5 Parts Compatibility",brand:"Toyota/BMW",cat:"junk",price:0,desc:"The F30 340i and MK5 Supra share the B58 engine. Many Supra-specific performance parts fit the 340i: downpipes, charge pipes, intercooler piping. The Supra aftermarket is larger and more competitive, so sometimes Supra parts are CHEAPER than F30-specific parts. Check Supra parts before buying F30 parts.",hp:0,tq:0,ret:"Various",sk:1,time:0,tools:"None — research",notes:"Not a part — this is knowledge. The B58 in the 340i and Supra A90 is the same engine. PRL Supra downpipe? Check if it fits the 340i (it often does with minor modification). This cross-shopping hack saves money constantly.",plats:["f30"]},

  // ══════ SUBARU ══════
  {id:"s1",name:"COBB AccessPort V3",brand:"COBB",cat:"tune",price:650,desc:"The gateway. Fixes rev hang. NEVER run bolt-ons without this.",hp:25,tq:30,ret:"MAPerformance",sk:1,time:0.3,tools:"None — OBD2 plug-in",notes:"Start Stage 1 OTS, protune later. Non-negotiable on turbo Subarus.",plats:["gd","gr","va"]},
  {id:"s2",name:"K&N Drop-In Filter",brand:"K&N",cat:"intake",price:55,desc:"Drop-in replacement. More flow, ZERO tune needed. Safest first mod.",hp:2,tq:2,ret:"Amazon",sk:1,time:0.1,tools:"None",notes:"Pull old filter, drop this in. No tune required.",plats:["gd","gr","va"]},
  {id:"s3",name:"Grimmspeed Stealthbox Intake",brand:"Grimmspeed",cat:"intake",price:400,desc:"Enclosed CAI — best heat soak protection with max flow. Top-tier VA intake.",hp:8,tq:10,ret:"Grimmspeed",sk:1,time:0.5,tools:"10mm, flathead",notes:"Needs AP tune — use Stage 1+ OTS map or protune.",plats:["va"]},
  {id:"s4",name:"Nameless Axleback (5\" Muffler)",brand:"Nameless",cat:"exhaust",price:350,desc:"The boxer rumble amplified. No drone. No tune needed. Perfect daily tone.",hp:2,tq:2,ret:"Nameless Performance",sk:2,time:1,tools:"14mm, jack stands",notes:"5-inch muffler = sweet spot. Loud enough to enjoy, quiet enough for daily.",plats:["va","gr"]},
  {id:"s5",name:"Remark Muffler Delete",brand:"Remark",cat:"exhaust",price:200,desc:"LOUD. The budget boxer rumble machine. No tune needed.",hp:1,tq:1,ret:"Amazon",sk:2,time:0.75,tools:"14mm, jack stands",notes:"Very loud cold start. Neighbors WILL know you left. Worth it.",plats:["va"]},
  {id:"s6",name:"Grimmspeed Catted J-Pipe",brand:"Grimmspeed",cat:"exhaust",price:900,desc:"Biggest single power mod. Unleashes the turbo. TUNE REQUIRED.",hp:25,tq:30,ret:"Grimmspeed",sk:4,time:3,tools:"14/17mm deep, O2 socket, PB Blaster, jack stands",notes:"Flash Stage 2 BEFORE first start. Hardest bolt-on on the WRX.",plats:["va","gr"]},
  {id:"s7",name:"Tomei Ti Catback",brand:"Tomei",cat:"exhaust",price:1050,desc:"Titanium. THE exhaust for serious Subaru people. Sound is legendary.",hp:5,tq:5,ret:"Amazon",sk:3,time:2,tools:"14mm, jack stands",notes:"Titanium exit tip turns colors with heat. Single-exit. Worth every penny.",plats:["gd","gr","va"]},
  {id:"s8",name:"Grimmspeed TMIC",brand:"Grimmspeed",cat:"ic",price:750,desc:"Top-mount IC upgrade. Drops temps 40-60°F. Keeps top-mount simplicity.",hp:10,tq:10,ret:"Grimmspeed",sk:3,time:2,tools:"10/12mm, flathead, pliers",notes:"Stock TMIC heat-soaks after one pull. This fixes it.",plats:["va","gr"]},
  {id:"s9",name:"Perrin Turbo Inlet Hose",brand:"Perrin",cat:"engine",price:75,desc:"Silicone replacement for crack-prone stock rubber. Prevents mystery boost leaks.",hp:0,tq:0,ret:"Amazon",sk:1,time:0.3,tools:"Flathead, pliers",notes:"Stock inlet cracks silently. Replace preventively. Cheap insurance.",plats:["gr","va"]},
  {id:"s10",name:"IAG AOS (Air/Oil Separator)",brand:"IAG",cat:"engine",price:350,desc:"Replaces PCV — prevents carbon buildup on FA20 valves. Essential for DI engine health.",hp:0,tq:0,ret:"IAG Performance",sk:3,time:2,tools:"10/12mm, pliers, coolant",notes:"The FA20 NEEDS this. Direct injection = carbon buildup on intake valves.",plats:["va"]},
  {id:"s11",name:"Whiteline Sway Bars (F+R)",brand:"Whiteline",cat:"susp",price:480,desc:"Best handling mod for any WRX. Kills understeer. Adjustable stiffness.",hp:0,tq:0,ret:"Amazon",sk:3,time:2.5,tools:"14/17mm, jack stands",notes:"Three adjustment positions. Start middle, go stiffer in rear to reduce understeer.",plats:["gd","gr","va"]},
  {id:"s12",name:"RCE Yellow Springs",brand:"RCE",cat:"susp",price:250,desc:"1\" drop, progressive. Most popular WRX spring. Sporty daily.",hp:0,tq:0,ret:"RCE Suspension",sk:3,time:3,tools:"Spring compressor, 17/19mm, jack stands",notes:"Best all-around lowering spring for daily WRX.",plats:["va"]},
  {id:"s13",name:"Kartboy Short Shifter",brand:"Kartboy",cat:"int",price:100,desc:"Shorter, precise throws. Transforms the mushy stock WRX shifter.",hp:0,tq:0,ret:"Amazon",sk:2,time:1.5,tools:"12/14mm, console tools",notes:"Stock WRX shifter = stirring oatmeal. This fixes it.",plats:["gd","gr","va"]},
  {id:"s14",name:"Perrin Shift Stop",brand:"Perrin",cat:"int",price:35,desc:"Removes 1-2 gate slop. $35 for a transformed shifter. Best value mod.",hp:0,tq:0,ret:"Amazon",sk:2,time:0.5,tools:"10mm, console tools",notes:"Adjust until precise but not binding. Most underrated Subaru mod.",plats:["va"]},
  {id:"s15",name:"ACT HD Street Clutch",brand:"ACT",cat:"clutch",price:450,desc:"Holds 350+ WHP, stock pedal feel. Go-to for modded WRX.",hp:0,tq:0,ret:"Amazon",sk:5,time:8,tools:"Trans jack, full socket set, torque wrench",notes:"Shop install ($500-800 labor). Don't wait until clutch is slipping.",plats:["va"]},
  // SUBARU JUNKYARD
  {id:"js1",name:"🏴‍☠️ STI Brake Swap (on WRX)",brand:"Subaru Junkyard",cat:"junk",price:350,desc:"STI Brembo front calipers + rotors bolt directly onto any WRX from 2002+. Transforms braking from adequate to incredible. Junkyard set: $200-400. This is the #1 junkyard swap in the entire Subaru community. Every WRX owner with a track day in their future does this.",hp:0,tq:0,ret:"Junkyard / eBay",sk:3,time:3,tools:"17mm, 14mm, brake line, brake fluid, new pads (Hawk HPS recommended)",notes:"STI Brembos are a direct bolt-on to WRX hubs — same spindle. You need the calipers, brackets, and rotors. Pads are specific to Brembo (Hawk HPS or StopTech). This swap has been documented since the WRX launched in 2002. Check NASIOC DIY thread.",plats:["gd","gr","va"]},
  {id:"js2",name:"🏴‍☠️ STI Pink Injectors on WRX",brand:"Subaru OEM",cat:"junk",price:80,desc:"The STI uses higher-flow 'pink' top-feed injectors (565cc) vs the WRX's lower-flow injectors. They're a direct swap on EJ WRX engines. Junkyard cost: $50-100 for a set of 4. This provides the fueling headroom needed for Stage 2 tunes without buying $400 aftermarket injectors.",hp:0,tq:0,ret:"Junkyard / eBay",sk:3,time:2,tools:"10mm, fuel rail removal, new O-rings ($10)",notes:"Known on NASIOC since 2003. STI pink injectors (denso 565cc) swap directly into WRX fuel rail. Requires an AccessPort tune adjusted for the larger injectors. This is the budget way to support 300+ WHP fueling on an EJ WRX.",plats:["gd","gr"]},
  {id:"js3",name:"🏴‍☠️ STI Rear Differential Swap (WRX)",brand:"Subaru Junkyard",cat:"junk",price:250,desc:"The WRX has an open rear diff. The STI has a Torsen limited-slip. The STI rear diff, axles, and rear subframe crossmember bolt directly into the WRX. Transforms corner exit traction from tire-spinning to planted. Junkyard cost: $200-350 for the complete setup.",hp:0,tq:0,ret:"Junkyard",sk:4,time:6,tools:"Full socket set, jack stands, diff fluid, axle removal tools",notes:"This swap has been done thousands of times. You need the STI rear diff, both rear axles (different spline count), and the crossmember. Full guides on NASIOC. The traction improvement is dramatic — especially in rain.",plats:["gd","gr","va"]},
  {id:"js4",name:"🏴‍☠️ Legacy GT / Forester XT Intercooler",brand:"Subaru Junkyard",cat:"junk",price:60,desc:"The 2005-2009 Legacy GT and 2004-2008 Forester XT use a larger top-mount intercooler than the WRX. It's a direct bolt-in swap with slightly better cooling capacity. Junkyard cost: $40-80. This is the free/cheap intercooler upgrade before spending $750 on a Grimmspeed TMIC.",hp:3,tq:3,ret:"Junkyard",sk:2,time:1,tools:"10mm, 12mm, pliers",notes:"Legacy GT TMIC is a direct swap to WRX. Slightly larger core, better cooling. Not as good as a proper aftermarket TMIC but it's essentially free. Known on NASIOC since the Legacy GT launched. Check your local Pull-A-Part — these are common.",plats:["gd","gr","va"]},
];

// ═══ BUILDS ═══
const TIERS = {
  fuckit:{l:"F*ck It",c:"#FF6B6B",d:"Under $700 — send it",icon:"🔥",r:"$0–$700"},
  street:{l:"Street",c:"#2EC4B6",d:"Daily bolt-ons",icon:"🛣",r:"$1k–$2k"},
  weekend:{l:"Weekend",c:"#FFB703",d:"Spirited + track days",icon:"🏁",r:"$3k–$5k"},
  sleeper:{l:"Sleeper",c:"#722ED1",d:"Looks stock, isn't stock",icon:"🥷",r:"Varies"},
  junkyard:{l:"Junkyard Build",c:"#D46B08",d:"Built from junkyard swaps",icon:"🏴‍☠️",r:"$200–$800"},
};

const BUILDS = [
  // F*CK IT
  {id:"b1",name:"$300 EG Awakening",tier:"fuckit",plat:"eg",diff:2,author:"Tommy V.",veh:"1994 Civic DX — 180k",cost:299,hp:20,tq:14,time:"One afternoon",pids:["h3","h6","h12"],
    story:"$2k car, $300 in parts. AEM intake + DC header + shift knob. The header woke this car up above 4k RPM.",
    lessons:"DC header = best dollar-per-HP on D-series. Always header first.",order:"1. Header → 2. Intake → 3. Knob",verified:true},
  {id:"b2",name:"Free Tune E90",tier:"fuckit",plat:"e9x",diff:1,author:"Jake S.",veh:"2008 335i N54 — 95k",cost:174,hp:68,tq:68,time:"30 minutes",pids:["b21","b22","b24"],
    story:"MHD free tune + $99 intake + $75 muffler delete. 30 minutes. +68HP for $174. The most insane value in cars.",
    lessons:"If you own an N54 and haven't downloaded MHD, you're leaving 60 free HP on the table.",order:"1. MHD (5 min) → 2. Intake (15 min) → 3. Muffler delete (10 min)",verified:true},
  {id:"b3",name:"$90 WRX Fix",tier:"fuckit",plat:"va",diff:1,author:"Alex T.",veh:"2017 WRX — 55k",cost:90,hp:2,tq:2,time:"20 min",pids:["s2","s14"],
    story:"K&N filter + Perrin shift stop. $90 total. Filter is zero-risk, shift stop fixes the worst part of the WRX.",
    lessons:"Perrin shift stop is the most underrated mod. $35 to fix the shifter.",order:"1. Filter (2 min) → 2. Shift stop (15 min)",verified:true},
  {id:"b4",name:"$500 E36 Survival",tier:"fuckit",plat:"e36",diff:2,author:"Mike D.",veh:"1997 328i — 160k",cost:575,hp:11,tq:8,time:"One weekend",pids:["b2","b3","b4"],
    story:"Radiator first (survival), then intake + budget catback. I6 sounds incredible. Engine won't overheat now.",
    lessons:"Fix cooling FIRST on any E36. Every dead E36 died from overheating.",order:"1. Radiator + cooling → 2. Intake → 3. Catback",verified:true},

  // JUNKYARD BUILDS (new tier!)
  {id:"jb1",name:"The $400 EG Junkyard Special",tier:"junkyard",plat:"eg",diff:4,author:"Dave K.",veh:"1994 Civic CX Hatch — 210k",cost:405,hp:30,tq:15,time:"2 weekends",pids:["jh1","jh5","h3","jh4"],
    story:"Mini-me swap (Y8 VTEC head on D15 block) for $150 at Pick-n-Pull. Si cluster swap for $30 so I could actually see a tachometer. AEM intake for $89. Rear disc brake conversion from a 90 Integra for $100. Total spend: $405. The car gained 30HP, got VTEC, has rear disc brakes, and a tachometer. All from the junkyard. This is how Hondas were built in the 90s and it still works.",
    lessons:"The junkyard is your parts catalog. Every Honda part interchanges with something. The mini-me swap is the best bang-for-buck mod in Honda history — you're essentially building a VTEC engine for $150.",
    order:"1. Mini-me swap (biggest job) → 2. Si cluster (need tach for VTEC) → 3. Rear disc conversion → 4. Intake",verified:true},
  {id:"jb2",name:"E36 Junkyard Handler",tier:"junkyard",plat:"e36",diff:3,author:"Chris M.",veh:"1997 328i — 145k",cost:410,hp:10,tq:5,time:"3 weekends",pids:["jb1","jb3","jb2","b4"],
    story:"M50 manifold swap from a junkyard 325i ($60), Z3 short shifter swap ($25), subframe reinforcement plates ($40), and a Mishimoto radiator ($220) because I'm not dying on the side of the road. The M50 manifold breathes better up top, the Z3 shifter cuts throw by 30%, the subframe plates prevent a $2k problem, and the radiator keeps me alive. All from BMW junkyards and eBay. Total: $410 for a car that handles better, shifts better, makes more power, and won't overheat.",
    lessons:"BMW parts interchange across models more than any other manufacturer. The E36/E46/Z3/Z4 share an insane amount of parts. Learn the interchange list and you'll never pay retail.",
    order:"1. Radiator (priority) → 2. Subframe plates (prevention) → 3. M50 manifold → 4. Z3 shifter",verified:true},
  {id:"jb3",name:"WRX → STI Brakes + Diff",tier:"junkyard",plat:"va",diff:4,author:"Ryan L.",veh:"2017 WRX — 62k",cost:690,hp:0,tq:0,time:"2 weekends",pids:["js1","js3","s14"],
    story:"STI Brembo front brakes ($350 at junkyard including pads) + STI rear limited-slip diff swap ($250 complete from a wrecked 2016 STI) + Perrin shift stop ($35). The brakes are night-and-day — the stock WRX brakes were terrifying at the track. The LSD transforms corner exit from wheel-spinning to planted. I basically have STI running gear for $600 instead of paying $10k more for the STI. The shift stop was just because I was in there anyway.",
    lessons:"Every WRX owner should do the STI Brembo swap. It's the single best safety and performance upgrade. The LSD swap is more involved but the traction improvement is worth the effort, especially if you autocross or track the car.",
    order:"1. STI Brembo brake swap → 2. STI rear diff swap → 3. Shift stop",verified:true},

  // SLEEPER BUILDS (new tier!)
  {id:"sl1",name:"The Invisible 280WHP Si",tier:"sleeper",plat:"10g",diff:2,author:"Kevin P.",veh:"2019 Civic Si — 35k",cost:1170,hp:55,tq:78,time:"2 weekends",pids:["h40","h46","jh10"],
    story:"FlashPro + PRL intercooler + Accord 2.0T intercooler swap. That's it. From the outside: completely stock Civic Si. From the dyno: 260WHP at the wheels. Nobody suspects anything. No exhaust, no intake sticking out, no visual mods at all. The Accord intercooler swap is the hidden gem — $80 at a junkyard for 80% of a $475 PRL intercooler's performance. The FlashPro with a conservative protune is safe on stock internals. This car embarrasses Mustang GTs at lights and they have no idea what happened.",
    lessons:"The best sleeper is one where NOTHING looks different. No intake sounds, no exhaust note change. Just a stock-looking Si that pulls way harder than it should. The Accord intercooler swap is the move that makes this affordable.",
    order:"1. FlashPro (fixes rev hang) → 2. Accord IC swap (junkyard) → 3. Protune for the IC → 4. Smile at confused Mustang owners",verified:true},
  {id:"sl2",name:"Grandpa's 400HP Sedan",tier:"sleeper",plat:"e9x",diff:1,author:"Tom R.",veh:"2009 335i — 78k, bone stock appearance",cost:500,hp:80,tq:80,time:"10 minutes",pids:["b20"],
    story:"BM3 Stage 1. Nothing else. The 335i already looks like a normal 3-series that your accountant drives. But with BM3 it makes 380HP. It runs low 12s in the quarter mile. People in modded cars have no idea until you gap them from a roll. The best $500 I've ever spent on anything.",
    lessons:"The N54 335i is the ultimate sleeper platform. It looks completely anonymous and makes M3-beating power with just a tune. No one will ever suspect the silver sedan.",
    order:"1. BM3 Stage 1 (10 min flash) → 2. That's it. You're done. You have a 400HP sedan.",verified:true},

  // HIGHER TIER
  {id:"b8",name:"Full Bolt-On Si",tier:"weekend",plat:"10g",diff:4,author:"Sarah K.",veh:"2019 Si — 42k",cost:3079,hp:98,tq:134,time:"3-4 weekends",pids:["h40","h46","h41","h47","h45","h43","h48"],
    story:"Full bolt-on 1.5T. 280 WHP protune. Different car.",
    lessons:"Downpipe is the hardest install. Get protuned after. IC should have been mod #2.",
    order:"1. FlashPro → 2. Intake → 3. IC → 4. Inlet → 5. DP (protune) → 6. Catback → 7. Catch can",verified:true},
  {id:"b9",name:"N54 Bolt-On Monster",tier:"weekend",plat:"e9x",diff:3,author:"Sarah L.",veh:"2009 335i — 72k",cost:1769,hp:118,tq:125,time:"2-3 weekends",pids:["b20","b22","b23","b25","b26"],
    story:"BM3 + intake + DPs + charge pipe + FMIC. ~420WHP stock turbos.",
    lessons:"Charge pipe is non-negotiable. FMIC essential Stage 2.",
    order:"1. BM3 → 2. Charge pipe → 3. Intake → 4. DPs (Stage 2) → 5. FMIC",verified:true},
  {id:"b10",name:"VA WRX Stage 2",tier:"weekend",plat:"va",diff:4,author:"Ryan M.",veh:"2018 WRX — 45k",cost:2960,hp:50,tq:55,time:"3 weekends",pids:["s1","s3","s6","s4","s8","s9","s10"],
    story:"AP + Grimmspeed intake + J-pipe + Nameless axleback + TMIC + inlet + AOS. 300WHP protuned.",
    lessons:"GET A PROTUNE. Budget $400. Most important part of the build.",
    order:"1. AP Stage 1 → 2. Intake → 3. Inlet → 4. TMIC → 5. J-pipe (Stage 2 before start) → 6. Axleback → 7. AOS → 8. Protune",verified:true},
];

// ═══ COMPONENT ═══
export default function App(){
  const[step,setStep]=useState("make");
  const[makeId,setMakeId]=useState(null);
  const[platId,setPlatId]=useState(null);
  const[vehId,setVehId]=useState(null);
  const[tab,setTab]=useState("build");
  const[bName,setBName]=useState("My Build");
  const[sel,setSel]=useState({});
  const[budget,setBudget]=useState(2000);
  const[budgetOn,setBudgetOn]=useState(false);
  const[picker,setPicker]=useState(null);
  const[expP,setExpP]=useState(null);
  const[expB,setExpB]=useState(null);
  const[tierF,setTierF]=useState(null);
  const[sortBy,setSortBy]=useState("default");
  const[showWarn,setShowWarn]=useState(true);
  const[aboutTab,setAboutTab]=useState("overview"); // overview, checklist, mistakes, modorder

  const make=MAKES.find(m=>m.id===makeId);
  const plat=PLATFORMS.find(p=>p.id===platId);
  const veh=VEHICLES.find(v=>v.id===vehId);
  const platVehs=VEHICLES.filter(v=>v.plat===platId);
  const pp=useMemo(()=>PARTS.filter(p=>p.plats.includes(platId)),[platId]);
  const pBuilds=useMemo(()=>{let b=BUILDS.filter(x=>x.plat===platId);if(tierF)b=b.filter(x=>x.tier===tierF);return b;},[platId,tierF]);

  const bParts=useMemo(()=>Object.values(sel).map(pid=>PARTS.find(p=>p.id===pid)).filter(Boolean),[sel]);
  const tCost=bParts.reduce((s,p)=>s+p.price,0);
  const tHp=bParts.reduce((s,p)=>s+(p.hp||0),0);
  const tTq=bParts.reduce((s,p)=>s+(p.tq||0),0);
  const tTime=bParts.reduce((s,p)=>s+(p.time||0),0);
  const maxSk=bParts.length?Math.max(...bParts.map(p=>p.sk)):0;
  const bLeft=budget-tCost;
  const bPct=budget>0?Math.min((tCost/budget)*100,100):0;

  const pickParts=useMemo(()=>{if(!picker)return[];let pts=pp.filter(p=>p.cat===picker);switch(sortBy){case"price-asc":return[...pts].sort((a,b)=>a.price-b.price);case"price-desc":return[...pts].sort((a,b)=>b.price-a.price);case"power":return[...pts].sort((a,b)=>(b.hp+b.tq)-(a.hp+a.tq));case"skill":return[...pts].sort((a,b)=>a.sk-b.sk);default:return pts;}},[picker,pp,sortBy]);

  const goMake=id=>{setMakeId(id);setStep("platform");};
  const goPlat=id=>{setPlatId(id);setStep("vehicle");};
  const goVeh=id=>{setVehId(id);setStep("builder");setTab("build");setSel({});setShowWarn(true);const p=PLATFORMS.find(x=>x.id===VEHICLES.find(v=>v.id===id)?.plat);setBName("My "+(p?.name||"")+" Build");};
  const goBack=()=>{if(step==="builder"){setStep("vehicle");setVehId(null);setSel({});}else if(step==="vehicle"){setStep("platform");setPlatId(null);}else if(step==="platform"){setStep("make");setMakeId(null);}};
  const selPart=(cid,pid)=>{setSel(p=>({...p,[cid]:pid}));setPicker(null);};
  const rmPart=cid=>{setSel(p=>{const n={...p};delete n[cid];return n;});};
  const loadBuild=b=>{const s={};b.pids.forEach(pid=>{const p=PARTS.find(x=>x.id===pid);if(p)s[p.cat]=p.id;});setSel(s);setBName(b.name);setTab("build");setPicker(null);};

  const C={bg:"#08080B",s1:"#111117",s2:"#19191F",s3:"#222230",bdr:"#2A2A38",acc:"#E63946",accD:"#E6394615",g:"#2EC4B6",gD:"#2EC4B615",y:"#FFB703",yD:"#FFB70315",o:"#FB8500",t:"#EEEEF2",tm:"#8A8AA0",td:"#55556A"};
  const fm="'IBM Plex Mono',monospace",fs="'DM Sans',sans-serif";
  const FL=()=><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>;
  const SkB=({lv,full})=>{const s=SK[lv];return<span style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:"0.55rem",fontFamily:fm,color:s.c,background:s.c+"14",padding:"1px 5px",borderRadius:3,whiteSpace:"nowrap"}}>{"●".repeat(lv)}<span style={{opacity:.2}}>{"●".repeat(5-lv)}</span>{full&&<span>{s.l}</span>}</span>;};
  const CatIco=({cat})=><div style={{width:34,height:34,borderRadius:5,background:cat==="junk"?"#D46B0820":C.s3,border:cat==="junk"?`1px solid #D46B0840`:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",flexShrink:0}}>{CATS.find(c=>c.id===cat)?.icon||"🔧"}</div>;

  // ═══ MAKE SCREEN ═══
  if(step==="make")return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:fs,padding:"2rem 1.5rem"}}><FL/>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <div style={{fontSize:"2.8rem",fontWeight:800,fontFamily:fm,letterSpacing:"-0.04em"}}>BUILD<span style={{color:C.acc}}>SPEC</span></div>
          <p style={{color:C.tm,fontSize:"0.85rem",marginTop:6}}>Plan your build. Track your budget. Send it.</p>
        </div>
        <p style={{textAlign:"center",fontSize:"0.7rem",color:C.td,textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:"1rem"}}>Choose your manufacturer</p>
        <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
          {MAKES.map(m=>{const mP=PLATFORMS.filter(p=>p.make===m.id);return(
            <div key={m.id} onClick={()=>goMake(m.id)} style={{background:C.s1,borderRadius:12,border:`2px solid ${C.bdr}`,padding:"1.5rem",cursor:"pointer",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=m.accent;e.currentTarget.style.background=m.accent+"08";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.background=C.s1;}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:"1.5rem",fontWeight:800}}>{m.icon} {m.name}</div><div style={{fontSize:"0.8rem",color:C.tm,marginTop:4}}>{m.tagline}</div></div>
                <div style={{textAlign:"right",fontFamily:fm,fontSize:"0.65rem",color:C.td}}><div>{mP.length} platforms</div></div>
              </div>
              <div style={{display:"flex",gap:5,marginTop:"0.6rem",flexWrap:"wrap"}}>
                {mP.map(p=><span key={p.id} style={{fontSize:"0.62rem",padding:"2px 7px",background:C.s2,borderRadius:4,color:C.tm,border:`1px solid ${C.bdr}`}}>{p.name} <span style={{color:C.td}}>({p.gen})</span></span>)}
              </div>
            </div>);
          })}
        </div>
      </div>
    </div>
  );

  // ═══ PLATFORM SCREEN ═══
  if(step==="platform"){const mP=PLATFORMS.filter(p=>p.make===makeId);return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:fs,padding:"1.5rem"}}><FL/>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <button onClick={goBack} style={{fontSize:"0.7rem",color:C.tm,background:"none",border:`1px solid ${C.bdr}`,borderRadius:5,padding:"4px 10px",cursor:"pointer",fontFamily:fs,marginBottom:"1rem"}}>← Manufacturers</button>
        <div style={{fontSize:"1.6rem",fontWeight:800,fontFamily:fm,marginBottom:"1rem"}}>{make?.icon} {make?.name}</div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
          {mP.map(p=>{const pP=PARTS.filter(x=>x.plats.includes(p.id));const pB=BUILDS.filter(x=>x.plat===p.id);const junk=pP.filter(x=>x.cat==="junk");return(
            <div key={p.id} onClick={()=>goPlat(p.id)} style={{background:C.s1,borderRadius:10,border:`1px solid ${C.bdr}`,padding:"1rem",cursor:"pointer"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=make?.accent||C.acc} onMouseLeave={e=>e.currentTarget.style.borderColor=C.bdr}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div><div style={{fontWeight:700,fontSize:"1.02rem"}}>{p.name}</div><div style={{fontSize:"0.7rem",color:C.y,fontFamily:fm,marginTop:2}}>{p.tagline}</div><div style={{fontSize:"0.62rem",color:C.td}}>{p.gen}</div></div>
                <div style={{textAlign:"right",fontSize:"0.62rem",fontFamily:fm}}><div style={{color:C.g}}>{p.hp}hp / {p.tq}tq</div><div style={{color:C.tm}}>{p.budget}</div></div>
              </div>
              <p style={{fontSize:"0.7rem",color:C.tm,lineHeight:1.4,margin:"0.4rem 0",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.why}</p>
              <div style={{display:"flex",gap:8,fontSize:"0.58rem",color:C.td,flexWrap:"wrap"}}>
                <span>{pP.length} parts</span><span>{pB.length} builds</span>
                {junk.length>0&&<span style={{color:"#D46B08"}}>🏴‍☠️ {junk.length} junkyard swaps</span>}
                {p.warns&&<span style={{color:C.y}}>⚠️ {p.warns.length} known issues</span>}
                {p.buyer_checklist&&<span style={{color:C.g}}>✓ Pre-purchase checklist</span>}
              </div>
            </div>);
          })}
        </div>
      </div>
    </div>
  );}

  // ═══ VEHICLE SCREEN ═══
  if(step==="vehicle")return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:fs,padding:"1.5rem"}}><FL/>
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <button onClick={goBack} style={{fontSize:"0.7rem",color:C.tm,background:"none",border:`1px solid ${C.bdr}`,borderRadius:5,padding:"4px 10px",cursor:"pointer",fontFamily:fs,marginBottom:"1rem"}}>← {make?.name} Platforms</button>
        <div style={{marginBottom:"1rem"}}><div style={{fontSize:"1.3rem",fontWeight:800}}>{plat?.name}</div><div style={{fontSize:"0.72rem",color:C.y,fontFamily:fm}}>{plat?.tagline}</div><p style={{fontSize:"0.72rem",color:C.tm,marginTop:6}}>{plat?.desc}</p></div>
        <p style={{fontSize:"0.62rem",color:C.td,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.5rem"}}>Select your vehicle</p>
        {platVehs.map(v=>(
          <button key={v.id} onClick={()=>goVeh(v.id)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",textAlign:"left",padding:"0.65rem 0.85rem",marginBottom:4,background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:6,color:C.t,cursor:"pointer",fontFamily:fs,fontSize:"0.82rem"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.acc} onMouseLeave={e=>e.currentTarget.style.borderColor=C.bdr}>
            <span style={{fontWeight:600}}>{v.year} {v.trim}</span><span style={{color:C.tm,fontFamily:fm,fontSize:"0.7rem"}}>{v.engine}</span>
          </button>))}
      </div>
    </div>
  );

  // ═══ BUILDER ═══
  const TABS=[{id:"build",label:`Build (${bParts.length})`},{id:"diy",label:"DIY Builds"},{id:"about",label:"About / Guides"}];

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:fs}}><FL/>
      <header style={{borderBottom:`1px solid ${C.bdr}`,padding:"0.5rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",background:C.s1,flexWrap:"wrap",gap:4}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:"0.9rem",fontWeight:800,fontFamily:fm,cursor:"pointer"}} onClick={()=>{setStep("make");setMakeId(null);setPlatId(null);setVehId(null);setSel({});}}>BUILD<span style={{color:C.acc}}>SPEC</span></span>
          <span style={{fontSize:"0.62rem",color:C.tm,padding:"2px 6px",background:C.accD,borderRadius:4}}>{veh?.year} {veh?.trim}</span>
          <span style={{fontSize:"0.55rem",color:C.td,fontFamily:fm}}>{veh?.engine}</span>
        </div>
        <button onClick={goBack} style={{fontSize:"0.58rem",color:C.tm,background:"none",border:`1px solid ${C.bdr}`,borderRadius:4,padding:"2px 7px",cursor:"pointer",fontFamily:fs}}>← Change</button>
      </header>

      <div style={{display:"flex",borderBottom:`1px solid ${C.bdr}`,background:C.s1}}>
        {TABS.map(t=><button key={t.id} onClick={()=>{setTab(t.id);setPicker(null);}} style={{padding:"0.55rem 0.85rem",background:"none",border:"none",borderBottom:tab===t.id?`2px solid ${C.acc}`:"2px solid transparent",color:tab===t.id?C.t:C.tm,fontFamily:fs,fontSize:"0.72rem",fontWeight:tab===t.id?600:400,cursor:"pointer"}}>{t.label}</button>)}
      </div>

      {plat?.warns&&showWarn&&tab==="build"&&(
        <div style={{margin:"0.5rem 1rem 0",padding:"0.45rem 0.65rem",background:"#FFB70308",border:`1px solid ${C.y}20`,borderRadius:6,fontSize:"0.65rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
            <span style={{color:C.y,fontWeight:600}}>⚠️ {plat.name} — Known Issues</span>
            <button onClick={()=>setShowWarn(false)} style={{color:C.td,background:"none",border:"none",cursor:"pointer",fontSize:"0.55rem"}}>dismiss</button>
          </div>
          {plat.warns.map((w,i)=><div key={i} style={{color:C.tm,marginBottom:1,paddingLeft:10}}>• {w}</div>)}
        </div>
      )}

      <div style={{maxWidth:940,margin:"0 auto",padding:"1rem"}}>

        {/* ═══ BUILD ═══ */}
        {tab==="build"&&(
          <div>
            <div style={{display:"flex",gap:5,marginBottom:5,alignItems:"center",flexWrap:"wrap"}}>
              <input type="text" value={bName} onChange={e=>setBName(e.target.value)} style={{flex:"1 1 180px",padding:"0.4rem 0.6rem",background:C.s1,border:`1px solid ${C.bdr}`,borderRadius:5,color:C.t,fontSize:"0.92rem",fontWeight:700,fontFamily:fs,outline:"none"}}/>
              <div style={{display:"flex",alignItems:"center",gap:3}}>
                <button onClick={()=>setBudgetOn(!budgetOn)} style={{padding:"2px 8px",borderRadius:10,border:"none",background:budgetOn?C.g:C.bdr,color:budgetOn?"#000":C.tm,fontSize:"0.55rem",fontWeight:600,cursor:"pointer"}}>{budgetOn?"BUDGET ON":"BUDGET"}</button>
                {budgetOn&&<><span style={{fontFamily:fm,color:C.tm,fontSize:"0.72rem"}}>$</span><input type="number" value={budget} onChange={e=>setBudget(+e.target.value||0)} style={{width:60,padding:"2px 4px",background:C.s2,border:`1px solid ${C.bdr}`,borderRadius:3,color:C.t,fontFamily:fm,fontWeight:700,fontSize:"0.72rem",outline:"none"}}/></>}
              </div>
            </div>
            {budgetOn&&<div style={{display:"flex",gap:3,marginBottom:5,flexWrap:"wrap"}}>{[200,500,700,1000,1500,2000,3000,5000].map(a=><button key={a} onClick={()=>setBudget(a)} style={{padding:"2px 6px",borderRadius:3,border:`1px solid ${budget===a?C.acc:C.bdr}`,background:budget===a?C.accD:"transparent",color:budget===a?C.acc:C.tm,fontSize:"0.58rem",fontFamily:fm,cursor:"pointer"}}>${a>=1000?`${a/1000}k`:a}</button>)}</div>}
            {budgetOn&&<div style={{marginBottom:5,padding:"0.3rem 0.5rem",background:C.s1,borderRadius:5,border:`1px solid ${C.bdr}`,display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:"0.58rem",color:C.tm}}>${tCost.toLocaleString()}</span><div style={{flex:1,height:4,background:C.bdr,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${bPct}%`,background:bLeft>=0?C.g:C.acc,borderRadius:2,transition:"width 0.3s"}}/></div><span style={{fontSize:"0.58rem",fontFamily:fm,color:bLeft>=0?C.g:C.acc}}>{bLeft>=0?`$${bLeft.toLocaleString()} left`:`-$${Math.abs(bLeft).toLocaleString()}`}</span></div>}

            {/* TABLE */}
            <div style={{background:C.s1,borderRadius:8,border:`1px solid ${C.bdr}`,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"38px 110px 1fr 56px 50px 42px 26px",padding:"0.3rem 0.45rem",borderBottom:`1px solid ${C.bdr}`,fontSize:"0.48rem",textTransform:"uppercase",letterSpacing:"0.1em",color:C.td}}><span/><span>Category</span><span>Part</span><span style={{textAlign:"right"}}>Price</span><span style={{textAlign:"right"}}>Power</span><span style={{textAlign:"right"}}>Skill</span><span/></div>

              {CATS.map(cat=>{
                const sp=sel[cat.id]?PARTS.find(p=>p.id===sel[cat.id]):null;
                const isOpen=picker===cat.id;
                const pInCat=pp.filter(p=>p.cat===cat.id);
                if(!pInCat.length)return null;
                const isJunk=cat.id==="junk";
                return(
                  <div key={cat.id}>
                    <div style={{display:"grid",gridTemplateColumns:"38px 110px 1fr 56px 50px 42px 26px",padding:"0.4rem 0.45rem",borderBottom:`1px solid ${C.bdr}12`,alignItems:"center",background:sp?isJunk?"#D46B0810":C.accD:"transparent"}}>
                      <CatIco cat={cat.id}/>
                      <div style={{fontSize:"0.65rem",fontWeight:600,color:isJunk?"#D46B08":sp?C.t:C.tm}}>{cat.name}</div>
                      {sp?<div><div style={{fontSize:"0.7rem",fontWeight:600}}>{sp.name}</div><div style={{fontSize:"0.55rem",color:C.tm}}>{sp.brand} • <button onClick={()=>setPicker(cat.id)} style={{color:C.acc,background:"none",border:"none",cursor:"pointer",fontFamily:fs,fontSize:"0.55rem",padding:0}}>↻ swap</button></div></div>
                        :<button onClick={()=>setPicker(isOpen?null:cat.id)} style={{padding:"4px 9px",background:C.s2,border:`1px dashed ${isJunk?"#D46B0850":C.bdr}`,borderRadius:4,color:isJunk?"#D46B08":C.acc,fontSize:"0.65rem",cursor:"pointer",fontFamily:fs,textAlign:"left"}}>{isJunk?"🏴‍☠️ Browse Junkyard Swaps":`+ Choose ${cat.name}`}</button>}
                      <div style={{textAlign:"right",fontFamily:fm,fontWeight:600,fontSize:"0.75rem"}}>{sp?sp.price===0?"FREE":`$${sp.price}`:"—"}</div>
                      <div style={{textAlign:"right",fontFamily:fm,fontSize:"0.58rem"}}>{sp&&(sp.hp>0||sp.tq>0)?<span style={{color:C.g}}>+{sp.hp}/{sp.tq}</span>:""}</div>
                      <div style={{textAlign:"right"}}>{sp&&<SkB lv={sp.sk}/>}</div>
                      <div style={{textAlign:"center"}}>{sp?<button onClick={()=>rmPart(cat.id)} style={{background:"none",border:"none",color:C.acc,cursor:"pointer",fontSize:"0.72rem"}}>✕</button>:<button onClick={()=>setPicker(isOpen?null:cat.id)} style={{background:"none",border:"none",color:C.tm,cursor:"pointer",fontSize:"0.62rem"}}>{isOpen?"▴":"▾"}</button>}</div>
                    </div>
                    {isOpen&&(
                      <div style={{background:isJunk?"#D46B0808":C.s2,borderBottom:`1px solid ${C.bdr}`,padding:"0.4rem 0.45rem"}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <span style={{fontSize:"0.58rem",color:isJunk?"#D46B08":C.tm}}>{pInCat.length} options {isJunk&&"— hidden knowledge from forums & junkyards"}</span>
                          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:"1px 4px",background:C.s3,border:`1px solid ${C.bdr}`,borderRadius:3,color:C.tm,fontSize:"0.55rem",fontFamily:fs,outline:"none"}}><option value="default">Default</option><option value="price-asc">Price ↑</option><option value="price-desc">Price ↓</option><option value="power">Power</option><option value="skill">Easiest</option></select>
                        </div>
                        {pickParts.map(part=>{
                          const isSel=sel[cat.id]===part.id;
                          const swp=sel[cat.id]?(PARTS.find(p=>p.id===sel[cat.id])?.price||0):0;
                          const over=budgetOn&&!isSel&&(tCost+part.price-swp)>budget;
                          return(
                            <div key={part.id} style={{padding:"0.45rem",marginBottom:3,background:isSel?isJunk?"#D46B0815":C.accD:C.s1,border:`1px solid ${isSel?isJunk?"#D46B0840":C.acc+"40":C.bdr}`,borderRadius:6,opacity:over?0.4:1}}>
                              <div style={{display:"flex",gap:7,alignItems:"flex-start"}}>
                                <CatIco cat={part.cat}/>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{fontWeight:600,fontSize:"0.7rem"}}>{part.name}</div>
                                  <div style={{fontSize:"0.55rem",color:C.tm}}>{part.brand} • {part.ret}</div>
                                  <div style={{fontSize:"0.6rem",color:C.td,marginTop:2,lineHeight:1.3,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{part.desc}</div>
                                  <div style={{display:"flex",gap:4,marginTop:3,alignItems:"center",flexWrap:"wrap"}}>
                                    {part.hp>0&&<span style={{fontSize:"0.5rem",fontFamily:fm,color:C.g,background:C.gD,padding:"1px 4px",borderRadius:2}}>+{part.hp}HP</span>}
                                    {part.tq>0&&<span style={{fontSize:"0.5rem",fontFamily:fm,color:C.y,background:C.yD,padding:"1px 4px",borderRadius:2}}>+{part.tq}TQ</span>}
                                    <SkB lv={part.sk}/><span style={{fontSize:"0.5rem",fontFamily:fm,color:C.tm}}>⏱{part.time<1?`${Math.round(part.time*60)}m`:`${part.time}h`}</span>
                                  </div>
                                </div>
                                <div style={{textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:2,flexShrink:0}}>
                                  <span style={{fontFamily:fm,fontWeight:700,fontSize:"0.85rem"}}>{part.price===0?"FREE":`$${part.price}`}</span>
                                  <button onClick={()=>selPart(cat.id,part.id)} disabled={over} style={{padding:"3px 8px",borderRadius:4,border:"none",background:isSel?C.acc:over?C.td:C.t,color:isSel?"#fff":C.bg,fontSize:"0.58rem",fontWeight:600,cursor:over?"default":"pointer",fontFamily:fs}}>{isSel?"✓":over?"$$":"Select"}</button>
                                </div>
                              </div>
                              <button onClick={()=>setExpP(expP===part.id?null:part.id)} style={{fontSize:"0.5rem",color:C.acc,background:"none",border:"none",cursor:"pointer",fontFamily:fs,padding:0,marginTop:2}}>{expP===part.id?"Hide ▴":"Details ▾"}</button>
                              {expP===part.id&&<div style={{marginTop:3,padding:"0.35rem",background:C.bg,borderRadius:4,border:`1px solid ${C.bdr}`}}>
                                <div style={{fontSize:"0.58rem",color:C.td}}>Skill: <span style={{color:SK[part.sk].c}}>{SK[part.sk].l}</span> • Time: {part.time<1?`${Math.round(part.time*60)}m`:`${part.time}h`}</div>
                                <div style={{fontSize:"0.58rem",color:C.td,marginTop:1}}>Tools: <span style={{color:C.tm}}>{part.tools}</span></div>
                                <div style={{fontSize:"0.58rem",padding:3,background:C.s2,borderRadius:3,marginTop:3}}><span style={{color:C.y}}>💡</span> {part.notes}</div>
                              </div>}
                            </div>);
                        })}
                        <button onClick={()=>setPicker(null)} style={{width:"100%",padding:"0.3rem",background:C.s3,border:"none",borderRadius:4,color:C.tm,fontSize:"0.58rem",cursor:"pointer",fontFamily:fs,marginTop:2}}>Close</button>
                      </div>
                    )}
                  </div>);
              })}
              <div style={{display:"grid",gridTemplateColumns:"38px 110px 1fr 56px 50px 42px 26px",padding:"0.45rem",background:C.s2,alignItems:"center"}}><div/><span style={{fontSize:"0.65rem",fontWeight:700,color:C.acc}}>TOTAL</span><div style={{fontSize:"0.58rem",color:C.tm}}>{bParts.length} parts • ~{tTime<1?`${Math.round(tTime*60)}m`:`${tTime.toFixed(1)}h`}{maxSk>0&&<> • <SkB lv={maxSk} full/></>}</div><div style={{textAlign:"right",fontFamily:fm,fontWeight:700,fontSize:"0.85rem",color:C.acc}}>${tCost.toLocaleString()}</div><div style={{textAlign:"right",fontFamily:fm,fontSize:"0.62rem",color:C.g}}>{tHp>0?`+${tHp}/+${tTq}`:"—"}</div><div/><div/></div>
            </div>
            {tHp>0&&plat&&<div style={{marginTop:5,padding:"0.4rem 0.5rem",background:C.gD,border:`1px solid ${C.g}20`,borderRadius:5,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:"0.65rem",color:C.g}}>Est. Output</span><span style={{fontFamily:fm,fontWeight:700,fontSize:"0.75rem",color:C.g}}>~{plat.hp+tHp}HP / ~{plat.tq+tTq}TQ</span></div>}
            {bParts.length>0&&<div style={{marginTop:5,padding:"0.4rem 0.5rem",background:C.s1,borderRadius:5,border:`1px solid ${C.bdr}`}}><div style={{fontSize:"0.48rem",textTransform:"uppercase",letterSpacing:"0.08em",color:C.td,marginBottom:2}}>🧰 Tools</div><div style={{fontSize:"0.58rem",color:C.tm,lineHeight:1.4}}>{[...new Set(bParts.flatMap(p=>p.tools.split(", ")))].join(" • ")}</div></div>}
          </div>
        )}

        {/* ═══ DIY ═══ */}
        {tab==="diy"&&(
          <div>
            <h2 style={{fontSize:"1.05rem",fontWeight:800,margin:"0 0 0.1rem"}}>DIY Builds — {plat?.name}</h2>
            <p style={{color:C.tm,fontSize:"0.68rem",margin:"0 0 0.6rem"}}>Proven builds + junkyard specials + sleeper builds.</p>
            <div style={{display:"flex",gap:3,marginBottom:"0.6rem",flexWrap:"wrap"}}>
              <button onClick={()=>setTierF(null)} style={{padding:"3px 7px",borderRadius:12,border:`1px solid ${!tierF?C.acc:C.bdr}`,background:!tierF?C.accD:"transparent",color:!tierF?C.acc:C.tm,fontSize:"0.58rem",cursor:"pointer",fontFamily:fs}}>All</button>
              {Object.entries(TIERS).map(([k,t])=><button key={k} onClick={()=>setTierF(k)} style={{padding:"3px 7px",borderRadius:12,border:`1px solid ${tierF===k?t.c:C.bdr}`,background:tierF===k?t.c+"15":"transparent",color:tierF===k?t.c:C.tm,fontSize:"0.58rem",cursor:"pointer",fontFamily:fs}}>{t.icon} {t.l} <span style={{opacity:.5,fontFamily:fm,fontSize:"0.5rem"}}>{t.r}</span></button>)}
            </div>
            {!pBuilds.length&&<p style={{color:C.td,textAlign:"center",padding:"2rem"}}>No builds match</p>}
            {pBuilds.map(build=>{const tier=TIERS[build.tier];const open=expB===build.id;const bps=build.pids.map(pid=>PARTS.find(p=>p.id===pid)).filter(Boolean);return(
              <div key={build.id} style={{background:C.s1,borderRadius:7,border:`1px solid ${C.bdr}`,marginBottom:4,overflow:"hidden"}}>
                <div style={{padding:"0.55rem"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:2}}><span style={{fontSize:"0.5rem",padding:"1px 5px",borderRadius:8,background:tier.c+"15",color:tier.c,fontWeight:600,fontFamily:fm}}>{tier.icon} {tier.l}</span>{build.verified&&<span style={{fontSize:"0.45rem",color:C.g,fontFamily:fm}}>✓</span>}</div>
                      <h3 style={{margin:"2px 0 1px",fontSize:"0.88rem",fontWeight:700}}>{build.name}</h3>
                      <div style={{fontSize:"0.58rem",color:C.tm}}>{build.veh} • by {build.author}</div>
                    </div>
                    <div style={{textAlign:"right"}}><div style={{fontFamily:fm,fontWeight:700,fontSize:"0.92rem"}}>${build.cost}</div><div style={{fontSize:"0.55rem",fontFamily:fm,color:C.g}}>+{build.hp}hp/+{build.tq}tq</div></div>
                  </div>
                  <div style={{display:"flex",gap:7,fontSize:"0.55rem",color:C.tm,marginTop:3}}><span>⏱ {build.time}</span><SkB lv={build.diff}/><span>🔧 {build.pids.length} parts</span></div>
                  <div style={{display:"flex",gap:4,marginTop:5}}>
                    <button onClick={()=>setExpB(open?null:build.id)} style={{padding:"3px 7px",borderRadius:4,border:`1px solid ${C.bdr}`,background:"transparent",color:C.t,fontSize:"0.58rem",cursor:"pointer",fontFamily:fs}}>{open?"Hide ▴":"Details ▾"}</button>
                    <button onClick={()=>loadBuild(build)} style={{padding:"3px 7px",borderRadius:4,border:"none",background:C.acc,color:"#fff",fontSize:"0.58rem",fontWeight:600,cursor:"pointer",fontFamily:fs}}>Load Build</button>
                  </div>
                </div>
                {open&&(
                  <div style={{padding:"0 0.55rem 0.55rem",borderTop:`1px solid ${C.bdr}`}}>
                    <div style={{padding:"0.4rem 0"}}><div style={{fontSize:"0.48rem",textTransform:"uppercase",letterSpacing:"0.08em",color:C.acc,marginBottom:2}}>Story</div><p style={{fontSize:"0.65rem",color:C.tm,lineHeight:1.4,margin:0}}>{build.story}</p></div>
                    <div style={{padding:"0.4rem",background:C.bg,borderRadius:4,marginBottom:4}}><div style={{fontSize:"0.48rem",textTransform:"uppercase",letterSpacing:"0.08em",color:C.y,marginBottom:2}}>Install Order</div><p style={{fontSize:"0.58rem",color:C.t,lineHeight:1.4,margin:0,fontFamily:fm}}>{build.order}</p></div>
                    <div style={{marginBottom:4}}>{bps.map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:5,padding:"2px 0",borderBottom:`1px solid ${C.bdr}10`,fontSize:"0.62rem"}}><CatIco cat={p.cat}/><span style={{flex:1}}>{p.name} <span style={{color:C.td}}>({p.brand})</span></span><SkB lv={p.sk}/><span style={{fontFamily:fm,fontWeight:600}}>{p.price===0?"FREE":`$${p.price}`}</span></div>)}</div>
                    <div style={{padding:"0.4rem",background:C.gD,borderRadius:4,border:`1px solid ${C.g}15`}}><div style={{fontSize:"0.48rem",textTransform:"uppercase",letterSpacing:"0.08em",color:C.g,marginBottom:2}}>Lessons</div><p style={{fontSize:"0.65rem",color:C.t,lineHeight:1.4,margin:0}}>{build.lessons}</p></div>
                  </div>
                )}
              </div>);
            })}
          </div>
        )}

        {/* ═══ ABOUT / GUIDES (with sub-tabs) ═══ */}
        {tab==="about"&&plat&&(
          <div>
            <div style={{display:"flex",gap:3,marginBottom:"0.75rem",flexWrap:"wrap"}}>
              {[{id:"overview",l:"Overview"},{id:"checklist",l:"🔍 Buyer Checklist"},{id:"mistakes",l:"❌ Common Mistakes"},{id:"modorder",l:"📋 Mod Order"}].map(t=>
                <button key={t.id} onClick={()=>setAboutTab(t.id)} style={{padding:"4px 9px",borderRadius:5,border:`1px solid ${aboutTab===t.id?C.acc:C.bdr}`,background:aboutTab===t.id?C.accD:"transparent",color:aboutTab===t.id?C.acc:C.tm,fontSize:"0.65rem",cursor:"pointer",fontFamily:fs}}>{t.l}</button>
              )}
            </div>

            {aboutTab==="overview"&&(
              <div style={{padding:"1rem",background:C.s1,borderRadius:8,border:`1px solid ${C.bdr}`}}>
                <h2 style={{fontSize:"1.05rem",fontWeight:800,margin:"0 0 2px"}}>{plat.name} <span style={{fontSize:"0.72rem",color:C.td,fontWeight:400}}>{plat.gen}</span></h2>
                <p style={{color:C.y,fontFamily:fm,fontSize:"0.65rem",margin:"0 0 0.5rem"}}>{plat.tagline}</p>
                <p style={{fontSize:"0.75rem",color:C.tm,lineHeight:1.5,margin:"0 0 0.6rem"}}>{plat.desc}</p>
                <div style={{padding:"0.55rem",background:C.bg,borderRadius:5,marginBottom:5}}>
                  <div style={{fontSize:"0.48rem",textTransform:"uppercase",letterSpacing:"0.1em",color:C.acc,marginBottom:2}}>Why People Mod This Car</div>
                  <p style={{fontSize:"0.72rem",color:C.t,lineHeight:1.5,margin:0}}>{plat.why}</p>
                </div>
                {plat.warns&&<div style={{padding:"0.55rem",background:"#FFB70308",borderRadius:5,border:`1px solid ${C.y}15`}}>
                  <div style={{fontSize:"0.48rem",textTransform:"uppercase",letterSpacing:"0.1em",color:C.y,marginBottom:3}}>⚠️ Known Issues</div>
                  {plat.warns.map((w,i)=><div key={i} style={{fontSize:"0.65rem",color:C.t,marginBottom:2,paddingLeft:8}}>• {w}</div>)}
                </div>}
              </div>
            )}

            {aboutTab==="checklist"&&plat.buyer_checklist&&(
              <div style={{padding:"1rem",background:C.s1,borderRadius:8,border:`1px solid ${C.g}20`}}>
                <h2 style={{fontSize:"1.05rem",fontWeight:800,margin:"0 0 0.2rem",color:C.g}}>🔍 Pre-Purchase Checklist</h2>
                <p style={{color:C.tm,fontSize:"0.68rem",margin:"0 0 0.75rem"}}>Check every item before buying a {plat.name}. Print this and bring it to the seller.</p>
                {plat.buyer_checklist.map((item,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:5}}>
                    <div style={{width:16,height:16,borderRadius:3,border:`1px solid ${C.bdr}`,flexShrink:0,marginTop:1}}/>
                    <span style={{fontSize:"0.72rem",color:C.t,lineHeight:1.4}}>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {aboutTab==="mistakes"&&plat.mistakes&&(
              <div style={{padding:"1rem",background:C.s1,borderRadius:8,border:`1px solid ${C.acc}20`}}>
                <h2 style={{fontSize:"1.05rem",fontWeight:800,margin:"0 0 0.2rem",color:C.acc}}>❌ Common Mistakes</h2>
                <p style={{color:C.tm,fontSize:"0.68rem",margin:"0 0 0.75rem"}}>Avoid these — learned the hard way by thousands of {plat.name} owners before you.</p>
                {plat.mistakes.map((m,i)=>(
                  <div key={i} style={{padding:"0.5rem",background:C.bg,borderRadius:5,marginBottom:4,border:`1px solid ${C.bdr}`}}>
                    <span style={{fontSize:"0.72rem",color:C.t,lineHeight:1.4}}>❌ {m}</span>
                  </div>
                ))}
              </div>
            )}

            {aboutTab==="modorder"&&plat.mod_order&&(
              <div style={{padding:"1rem",background:C.s1,borderRadius:8,border:`1px solid ${C.y}20`}}>
                <h2 style={{fontSize:"1.05rem",fontWeight:800,margin:"0 0 0.2rem",color:C.y}}>📋 Recommended Mod Order</h2>
                <p style={{color:C.tm,fontSize:"0.68rem",margin:"0 0 0.75rem"}}>Order matters — doing things wrong wastes money or damages your engine.</p>
                <div style={{padding:"0.65rem",background:C.bg,borderRadius:5,fontFamily:fm,fontSize:"0.72rem",color:C.t,lineHeight:1.6}}>{plat.mod_order}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
