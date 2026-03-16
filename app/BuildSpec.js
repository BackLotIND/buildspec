"use client"

import { useState, useMemo, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// BUILDSPEC v7 — Deep Knowledge Edition
// Junkyard Gold • Hidden Bolt-Ons • Sleeper Builds • Forum Lore
// ═══════════════════════════════════════════════════════════════

const MAKES = [
  { id:"honda",name:"Honda",accent:"#E63946",tagline:"VTEC just kicked in yo — 30 years of junkyard swaps and 9,000 RPM dreams",icon:"🔴" },
  { id:"bmw",name:"BMW",accent:"#1890FF",tagline:"Turn signals optional, free tunes mandatory — Euro cheap power done right",icon:"🔵" },
  { id:"subaru",name:"Subaru",accent:"#3F8EFC",tagline:"Vape not included — rally DNA, STI parts on WRX budgets, and boxer rumble therapy",icon:"⭐" },
  { id:"mazda",name:"Mazda",accent:"#D4380D",tagline:"Miata Is Always The Answer — lightweight, revs, and the rotary that refuses to die",icon:"🔶" },
  { id:"toyota",name:"Toyota",accent:"#1A1A1A",tagline:"It'll outlive you — bulletproof reliability meets off-road heritage and Supra legends",icon:"🏔" },
  { id:"nissan",name:"Nissan",accent:"#C41230",tagline:"Z cars, drift tax, and the trucks that refuse to die — VQ screams and KA struggles",icon:"🔻" },
  { id:"ford",name:"Ford",accent:"#003399",tagline:"Please don't leave Cars & Coffee sideways — Coyotes, EcoBoosts, and trucks that built America",icon:"🔷" },
  { id:"chevy",name:"Chevy",accent:"#D4A017",tagline:"LS swap everything — if it moves, someone has put an LS in it. Cam lope is a lifestyle.",icon:"🟡" },
  { id:"vw",name:"Volkswagen",accent:"#0D47A1",tagline:"Sensible speed — the GTI proves you can be responsible AND fast. DSG farts included.",icon:"🔹" },
];

const PLATFORMS = [
  // HYPE TAX TIERS (added to platforms as "tax" field):
  // 0 = No tax (fair price for what it is)
  // 1 = Mild tax (slightly inflated, still worth it)  
  // 2 = Taxed (noticeably overpriced vs what you get)
  // 3 = Drift Taxed (hype/culture has doubled the price)
  // 4 = Unobtainium (dream car pricing, not realistic for most)
  
  // Honda
  {id:"eg",make:"honda",name:"Civic EG",gen:"1992–1995",hp:125,tq:106,tagline:"The lightweight legend",budget:"$1k–$8k",tax:2,taxNote:"Clean EGs are $6-10k now. Rusty shells that were $500 in 2015 are $2-3k. JDM tax + nostalgia tax.",
    desc:"Under 2,300 lbs. B/K swaps documented for 30 years. Shells still $2-5k.",
    why:"The OG tuner Honda. Bottomless aftermarket, junkyard swaps for everything, and it weighs nothing.",
    warns:["Rust in rear wheel wells and rockers","Frame rails bend easy — check before buying","D-series head gaskets blow ~200k","Check for accident history — these get crashed and straightened constantly"],
    mistakes:["Buying eBay coilovers — they blow out in months on these light cars","Running a cold air intake without a bypass valve — hydrolocks in rain","Not checking motor mount condition — cracked mounts kill shift feel","Ignoring the distributor O-ring — causes mysterious misfires"],
    mod_order:"1. Fix all maintenance first (timing belt, water pump, distributor O-ring) → 2. Header (biggest gain) → 3. Intake → 4. Exhaust → 5. ECU tune → 6. Suspension → 7. Wheels/tires",
    buyer_checklist:["Compression test all 4 cylinders","Check for rust under rear seats and in wheel wells","Inspect frame rails for straightening marks","Verify VIN matches title (theft is rampant)","Check all motor mounts — rock the engine by hand","Look for oil leaks at distributor and valve cover","Test all electrical — gauges, lights, windows","Check for AC delete (many have been stripped)"] },
  {id:"ek",make:"honda",name:"Civic EK",gen:"1996–2000",hp:127,tq:107,tagline:"The golden era hatch",budget:"$1.5k–$10k",tax:3,taxNote:"EK hatches are drift taxed HARD. Clean EM1 Si models are $12-18k. Even a rusty EX is $4-6k. The EK9 Type R is $40k+. Blame the internet.",
    desc:"Refined EG chassis. EK hatch is the most desirable Honda body style ever.",
    why:"B/K swaps fully documented. The EK9 Type R is an icon. Massive junkyard swap potential.",
    warns:["Theft is rampant — kill switch mandatory","Rear trailing arm bushings wear out","Distributor O-ring leaks on every single one","Timing belt is interference — skipped belt = dead engine"],
    mistakes:["Buying a 'clean' EK without checking for hidden rust in the rear quarters","Running a B-series without upgrading the fuel system — stock fuel pump can't keep up","Not welding the subframe on swapped cars — the stock subframe flexes","Cheap eBay axles on swapped cars — they click and break within months"],
    mod_order:"Same as EG — header first, then intake, exhaust, tune. If swapping: engine swap → tune → suspension → wheels",
    buyer_checklist:["Same as EG plus:","Check rear quarter panels for bondo (peel back carpet in trunk)","Inspect trailing arm bushings (grab wheel and push/pull)","Verify the engine matches what's advertised (lots of swaps done poorly)","Check clutch master cylinder for leaks","Look under the car for welding quality if it's been swapped"] },
  {id:"dc2",make:"honda",name:"Integra DC2/DC4",gen:"1994–2001",hp:195,tq:130,tagline:"The Type R that started it all",budget:"$1k–$6k",tax:3,taxNote:"ITR is $40-60k. GS-R is $12-20k. Even a base LS is $6-10k. The Integra tax is real — blame theft rates and JDM culture.",
    desc:"The Integra GS-R and Type R — B18C1 and B18C5 are legendary engines. Shares most parts with Civics but has better brakes, stiffer chassis, and 4-wheel disc brakes stock.",
    why:"B-series responds to bolt-ons incredibly well. GS-R makes 190+ WHP NA with bolt-ons. The LS B18B1 block is the strongest B-series for boost builds. Type R is an icon.",
    warns:["Theft is worse than Civics — ITRs are #1 stolen car per capita","Values skyrocketed — ITRs are $40k+, GS-Rs $12-20k","Check for VIN swaps and fake Type Rs","B18C oil pump can fail — listen for bottom-end knock"],
    mistakes:["Buying a 'Type R' without VIN verification","Running without checking oil pump","Ignoring VTEC solenoid gasket leaks","Cheap eBay axles on swapped cars"],
    mod_order:"1. Maintenance (timing belt, water pump, oil pump check) → 2. Header → 3. Intake → 4. Exhaust → 5. ECU tune → 6. Suspension",
    buyer_checklist:["Verify VIN on dash, door jamb, and engine stamp match","Check VTEC solenoid for oil leak","Compression test — B18C should be 185+ PSI","Listen for oil pump whine at cold start","Check for rust in rear wheel wells"] },
  {id:"prelude",make:"honda",name:"Prelude 5th Gen",gen:"1997–2001",hp:200,tq:156,tagline:"The forgotten VTEC coupe",budget:"$1k–$4k",tax:1,taxNote:"Still undervalued at $4-8k for clean SH models. The market hasn't caught on yet. Buy now before it does.",
    desc:"Honda's forgotten sports car. H22A4 makes 200HP stock. SH model has ATTS mechanical torque vectoring — 20 years ahead of its time. Still cheap at $4-8k.",
    why:"200HP stock, VTEC, gorgeous coupe, mechanical torque vectoring on SH. Aftermarket exists for everything you need. Prices haven't caught up to Civics yet.",
    warns:["ATTS fluid on SH needs changing every 30k — neglect kills system ($2k+ repair)","H22 is interference — timing belt critical","Buy manual only — automatics are weak","Rear calipers seize if not maintained"],
    mistakes:["Buying automatic — the trans is the weak link","Not changing ATTS fluid on SH","Ignoring timing belt — H22 eats valves","Trying to swap H22 parts with B-series — different families"],
    mod_order:"1. Timing belt + water pump → 2. ATTS fluid (SH) → 3. Header → 4. Intake → 5. Exhaust → 6. Hondata → 7. Suspension",
    buyer_checklist:["Ask about timing belt history","SH: check ATTS — drive in circle, should pull through turn","Check rear brake caliper seizing","Test VTEC engagement ~5,800 RPM","Check for clutch chatter on takeoff"] },
  {id:"s2k",make:"honda",name:"S2000 AP1/AP2",gen:"1999–2009",hp:240,tq:162,tagline:"9,000 RPM — nothing else like it",budget:"$2k–$8k",tax:3,taxNote:"AP1s are $25-35k. AP2s are $30-40k. The CR is $50k+. The S2000 went from 'fun convertible' to 'investment vehicle.' Drift tax meets collector tax.",
    desc:"Honda's masterpiece. F20C revs to 9,000 RPM. RWD, 50/50 weight, one of the best transmissions ever. Prices $20-35k but the driving experience is unmatched.",
    why:"Doesn't need much — already incredible. Most mods are suspension, wheels/tires, and small power gains. Forced induction community makes 400-600WHP on built engines.",
    warns:["AP1 snap oversteer is real — respect it","Soft top rear window cracks with age","Retractable headlight motors fail on early AP1","Timing chain tensioner can fail on high-mileage F20C"],
    mistakes:["Buying as first RWD car without driver training — AP1 snap oversteer kills cars","Cheap coilovers — the chassis is too good for bad suspension","Not checking timing chain tensioner on high-mileage F20C","Cutting springs — never, especially on S2000"],
    mod_order:"1. Good tires (#1 mod) → 2. Suspension → 3. Intake → 4. Header → 5. Exhaust → 6. ECU tune",
    buyer_checklist:["Check soft top condition — tears, window clarity","Test every gear — should be butter smooth","Check VTEC engagement — smooth and immediate","Look for track use signs — brake dust, tire wear patterns","Verify clean title — salvage S2000s are common"] },
  {id:"accord2t",make:"honda",name:"Accord 2.0T",gen:"2018–2022",hp:252,tq:273,tagline:"The sleeper sedan nobody suspects",budget:"$1.5k–$5k",tax:0,taxNote:"No tax. $22-28k for a Type R engine in a sedan. The market still thinks it's just an Accord. This is the value play.",
    desc:"Shares engine with Type R — K20C4 is a detuned K20C1. 252HP stock, 300+ with tune. Looks like your mom's car. Ultimate sleeper. $22-28k used.",
    why:"Type R engine in a boring sedan. Tune = 300+HP. Nobody suspects it. 10-speed auto shifts faster than most DCTs. Cheaper than a used Type R.",
    warns:["2.0T auto has torque converter shudder on some examples","Oil dilution in cold climates","Make sure it's the 2.0T not 1.5T — different engine entirely","Sport and Touring trims = 2.0T, EX and LX = 1.5T"],
    mistakes:["Buying 1.5T thinking it's the same","Not getting Sport 2.0T 6-speed manual","Running Civic 1.5T mods on the 2.0T — different engine","Ignoring torque converter issue on autos"],
    mod_order:"1. KTuner or Hondata tune → 2. Intake → 3. Downpipe (manual) → 4. Intercooler → 5. Keep looking stock",
    buyer_checklist:["Verify it's the 2.0T — check engine cover or VIN","Manual: test clutch engagement","Auto: check for torque converter shudder","Check oil level and smell for gas","Look for Sport or Touring trim badge"] },
  {id:"fit",make:"honda",name:"Honda Fit / Jazz",gen:"2007–2020",hp:130,tq:114,tagline:"The tiny car that fits everything — including an engine swap",budget:"$500–$3k",tax:0,taxNote:"No tax. $4-8k for a fun manual hatchback. Nobody wants these which is exactly why you should buy one.",
    desc:"The Fit is the car Honda people buy when they can't afford a Civic. But here's the secret — it weighs 2,500 lbs, has a surprisingly fun chassis, and the GE8 (2009-2013) has a loyal modding community. K-swap Fits make 250WHP in a car that weighs nothing. Stock, they're practical and fun. Modded, they're hilarious. $4-8k buys a clean one.",
    why:"Weighs nothing, cheap to buy, cheap to insure, and the mod community exists. The GE8 Sport has the 1.5L i-VTEC that revs to 6,800 RPM. Bolt-ons add a little. A K-swap adds a LOT. The Fit is the ultimate 'nobody expects this car to be fun' platform. Plus it fits a whole couch inside with the seats down.",
    warns:["The automatic CVT is slow and boring — buy the manual (5-speed or 6-speed)","The 1.5L is not fast — accept this before buying","K-swap Fits require custom mounts, axles, and wiring — it's a real project","The GD (2007-2008) has less aftermarket than the GE8 (2009-2013)"],
    mistakes:["Buying a CVT Fit thinking it'll be fun — it won't","Spending $3k on bolt-ons for the stock 1.5L — you'll make maybe 140HP total, just K-swap it","Lowering it too much — the Fit sits low already and scrapes on everything","Not getting the Sport trim — it has the stiffer suspension and slightly more power"],
    mod_order:"1. Intake + exhaust (wake up the 1.5) → 2. Suspension (lower 1\") → 3. Wheels + tires → 4. Accept the 1.5's limits OR → 5. K-swap it and terrify everyone",
    buyer_checklist:["Verify it's a manual — CVT Fits are not worth modding","Check for rust in rocker panels","Test all gears — the 5-speed is notchy when cold","Check AC compressor — they fail on older Fits","Look for the Sport trim (stiffer suspension, rear disc brakes)"] },
  {id:"accord_v6",make:"honda",name:"Accord V6 (7th/8th Gen)",gen:"2003–2012",hp:268,tq:248,tagline:"Your dad's car makes 268HP and nobody knows",budget:"$500–$3k",tax:0,taxNote:"No tax. $6-12k for the V6 6MT coupe. The market doesn't care about Accord coupes. Their loss, your gain.",
    desc:"The J-series V6 Accord is the Honda sleeper that predates the 2.0T. The J30/J35 V6 makes 240-268HP in a car that looks like it belongs in a dentist's parking lot. The 6-speed manual V6 Accord Coupe (2008-2012) is one of the best-kept secrets in the Honda community — faster than a Civic Si, cheaper to buy, and invisible to cops. $6-12k for a clean manual V6 coupe.",
    why:"The J35 V6 makes real power — 268HP in the 8th gen. With intake, exhaust, and a FlashPro tune, they make 290+ WHP. The 6-speed manual V6 Coupe is the car Honda enthusiasts buy when they grow up. It's fast, comfortable, reliable, and nobody gives it a second look.",
    warns:["The automatic V6 Accords eat transmissions (2003-2007 especially) — MANUAL ONLY for modding","The J-series V6 has a timing belt — $500 service every 105k miles","The V6 auto trans failure is the #1 issue — Honda's worst transmission","Power steering pump whine on higher-mileage examples"],
    mistakes:["Buying an automatic V6 Accord — the transmissions fail constantly on 7th gen","Not doing the timing belt on schedule — J-series is interference","Ignoring the VCM (Variable Cylinder Management) on 2008+ — causes oil consumption and vibration","Trying to turbo the J-series without built internals — the stock rods are the weak point"],
    mod_order:"1. Timing belt if due → 2. Intake → 3. Exhaust → 4. FlashPro tune → 5. Suspension → 6. Keep looking boring",
    buyer_checklist:["MANUAL ONLY — check transmission carefully on automatics, they fail","Ask about timing belt history — interference engine","Check for VCM-related vibration (2008+ V6)","Listen for power steering whine","Check for oil consumption (common on VCM-equipped V6)","Test VTEC engagement on V6 — should pull hard above 5,000 RPM"] },
  {id:"8g",make:"honda",name:"Civic 8th Gen Si",gen:"2006–2011",hp:197,tq:139,tagline:"K20 NA perfection",budget:"$1.5k–$5k",tax:1,taxNote:"Mild tax. Clean FA5/FG2 are $10-16k now. Still fair for what you get — K20 + 6-speed is worth it.",
    desc:"K20Z3 revs to 8,000 RPM. Last NA VTEC Si. FA5/FG2 still $8-14k.",
    why:"Responds beautifully to bolt-ons, cams, header. Strong autocross community.",
    warns:["3rd gear synchro is weak","White paint clear coat fails","CMC (clutch master cylinder) leaks","Passenger door lock actuator fails"],
    mistakes:["Buying an automatic thinking you can swap to manual — you can't easily on 8th gen","Running a header without a tune — runs lean and causes knock","Ignoring the CMC leak — clutch pedal goes to the floor with no warning","Not checking the AC compressor — they seize and grenade the belt"],
    mod_order:"1. Intake → 2. FlashPro tune → 3. Header (tune required) → 4. Exhaust → 5. Suspension → 6. Wheels/tires",
    buyer_checklist:["Test 3rd gear specifically — shift hard into 3rd from 2nd, listen for grinding","Check paint condition on roof and hood (especially white)","Look for clutch fluid leak at the CMC (firewall, driver side)","Rev to 8000 RPM — it should pull clean with no hesitation","Check AC compressor — turn on AC, listen for noise","Inspect rear brake pads — these eat rears fast"] },
  {id:"9g",make:"honda",name:"Civic 9th Gen Si",gen:"2012–2015",hp:205,tq:174,tagline:"The underrated K24",budget:"$1k–$4k",tax:0,taxNote:"No tax. $10-14k and undervalued. Everyone wants the 8th gen or 10th gen. The 9th gen is the middle child nobody appreciates.",
    desc:"K24Z7 makes more torque. Undervalued at $10-16k. 230+ WHP with bolt-ons.",
    why:"Intake + header + exhaust + FlashPro = transformed car. Excellent daily.",
    warns:["Same 3rd gear synchro issue","AC compressor fails 80-100k","Oil consumption on some examples","Rear motor mount fails causing shift clunk"],
    mistakes:["Same header-without-tune issue as 8th gen","Not replacing the rear motor mount — causes horrible clunking on shifts","Buying cheap header gaskets — they leak and cause ticking sounds","Ignoring the PCV valve — causes oil consumption issues"],
    mod_order:"Same as 8th gen — intake, tune, header, exhaust, suspension",
    buyer_checklist:["Same as 8th gen plus:","Check rear motor mount (grab the shifter and rock — clunk = bad mount)","Ask about oil consumption — check the dipstick carefully","Listen for AC compressor noise"] },
  {id:"10g",make:"honda",name:"Civic 10th Gen",gen:"2016–2021",hp:205,tq:192,tagline:"Turbocharged era",budget:"$2k–$5k",tax:1,taxNote:"Mild tax. Si models $16-22k. Type R FK8 is $35-45k. The Type R has collector tax but the Si is still reasonable.",
    desc:"1.5T makes 280+ WHP on stock internals. Best bang-for-buck turbo platform.",
    why:"FlashPro + bolt-ons = different car. Massive community, everything documented.",
    warns:["Oil dilution on early 16-18 (fuel mixes with oil in cold weather)","Turbo feed line leaks ~60k","Rev hang is normal — tune fixes it","AC condenser gets hit by road debris"],
    mistakes:["Running a downpipe without a tune — this WILL damage the engine","Buying a 'Stage 2' intake from Amazon — it's just a cone filter with no airbox","Not doing an oil catch can — carbon buildup kills DI engines long-term","Ignoring the oil dilution bulletin — check your oil level and smell for gas"],
    mod_order:"1. FlashPro (fixes rev hang alone) → 2. Intake → 3. Intercooler → 4. Turbo inlet → 5. Downpipe (retune required) → 6. Exhaust → 7. Suspension",
    buyer_checklist:["Check oil level AND smell it — gasoline smell = oil dilution issue","Look for turbo feed line dampness near turbo","Check for aftermarket parts that were poorly installed and reverted","Verify the AC condenser isn't damaged (look through front grille)","Test drive in Sport mode — feel for boost delivery, any hesitation","Check for exhaust smoke on cold start (turbo seal issue)"] },
  // BMW — EXPANDED
  {id:"e30",make:"bmw",name:"BMW E30",gen:"1984–1993",hp:168,tq:164,tagline:"The classic — where BMW began",budget:"$1k–$10k",tax:3,taxNote:"Drift taxed. Clean 325i is $10-18k. M3 is $50-80k+. Even rusty shells are $3-5k. 80s BMW nostalgia is expensive.",
    desc:"Where BMW's sport sedan reputation was born. The 325i with M20B25 is the sweet spot. E30 M3 with S14 is holy grail ($50-80k+). For builders: M50/M52, S52, and LS swaps are well-documented.",
    why:"Lightest and most analog 3-series ever. Hydraulic steering, no traction control, under 2,800 lbs. With an engine swap it becomes a monster. Huge drift and track community.",
    warns:["Rust is #1 enemy — check everywhere, especially windshield, shock towers, floor pans","Values rising fast — clean examples appreciating","M20B25 timing belt is critical — interference engine","Electrical issues common on 30+ year old cars"],
    mistakes:["Buying rusty thinking you'll fix later — rust repair costs more than the car","Not doing timing belt on M20 — eats valves","Cheaping out on swap mounts — safety issue","Ignoring trailing arm bushings — affects handling more than anything else"],
    mod_order:"1. Fix ALL rust → 2. Timing belt/water pump → 3. Bushings everywhere → 4. Engine swap if applicable → 5. Suspension → 6. Wheels/tires",
    buyer_checklist:["Check rust around windshield, cowl area, behind rear bumper","Inspect floor pans — poke with screwdriver","Check rear shock towers for cracks/rust-through","Verify timing belt history","Check for coolant leaks at water pump","Inspect subframe mounting points","Test all electrical — gauges, lights, windows"] },
  {id:"e36",make:"bmw",name:"BMW E36",gen:"1992–1999",hp:240,tq:225,tagline:"The drift legend",budget:"$1k–$6k",tax:1,taxNote:"Mild tax. Non-M cars still $3-8k which is fair. M3 is $15-30k and climbing. The drift community is pushing prices up.",
    desc:"M50/M52 I6 bulletproof. Non-M cars $2-5k. Best drift platform ever.",
    why:"Junkyard swaps from other BMWs, LS swap kits documented, massive parts interchangeability.",
    warns:["COOLING SYSTEM KILLS THESE CARS — replace everything","Rear subframe cracks at mounting points","Window regulators fail on every one","Rear shock tower mushrooming on drift cars"],
    mistakes:["Modding for power before fixing the cooling system — your engine will die","Buying Raceland coilovers for track use — they're street-only, they WILL blow out","Not reinforcing the rear subframe before drifting — it cracks and the rear end goes loose","Running spacers without extended studs — wheels can come off","Ignoring the VANOS seals on M50 engines — causes rough idle and power loss"],
    mod_order:"1. COOLING SYSTEM (radiator, expansion tank, thermostat, water pump, ALL hoses) → 2. Bushings and maintenance → 3. Sway bars → 4. Coilovers → 5. Tune/chip → 6. Intake → 7. Exhaust",
    buyer_checklist:["Ask when the cooling system was last serviced — if 'I don't know,' budget $500","Check for coolant residue around expansion tank (it's probably cracked)","Inspect rear subframe mounting points — rust or cracks = walk away or negotiate hard","Check for oil leaks at valve cover gasket and oil filter housing","Grab each wheel and rock it — clunking = worn control arm bushings","Check the window regulators (they all fail)","Look at the rear shock towers from inside the trunk — mushrooming = abused"] },
  {id:"e46",make:"bmw",name:"BMW E46",gen:"1999–2006",hp:225,tq:214,tagline:"The last analog BMW",budget:"$1.5k–$5k",tax:2,taxNote:"Taxed. 330i ZHP is $12-18k. M3 is $25-45k. Regular 330i still reasonable at $5-10k. The M3 has gone full collector.",
    desc:"Best-driving 3-series ever. M54 nearly indestructible. M3 S54 legendary.",
    why:"Already world-class handling. Tons of OEM+ upgrades from other E46 models.",
    warns:["COOLING — same as E36, replace everything","Rear subframe cracking is SERIOUS on every E46","VANOS seals wear — rattle on cold start","RTAB wear causes vague rear-end handling","M3 rod bearings need checking at 100k+"],
    mistakes:["Buying an E46 without inspecting the rear subframe — $2,000+ repair if cracked","Not replacing the RTAB (rear trailing arm bushings) — makes the car feel loose and scary at speed","Ignoring VANOS rattle thinking it's 'normal' — it gets worse and kills power","Running lowering springs on blown struts — terrible ride and handling","On M3: not checking rod bearing clearance — engine grenades with zero warning"],
    mod_order:"1. Cooling system → 2. RTAB and subframe inspection → 3. VANOS rebuild if needed → 4. Sway bars → 5. Springs or coilovers → 6. Tune → 7. Intake/exhaust",
    buyer_checklist:["Check rear subframe mounting points for cracks (lift car, look from underneath — inner fender area)","Listen for VANOS rattle on cold start — chain-like rattle that fades as oil warms","Check RTAB (rear trailing arm bushings) — grab rear wheel, push/pull laterally","Inspect all cooling system components and ask for service records","Check for oil leaks at valve cover and oil filter housing gasket","M3: ask if rod bearings have been checked or replaced — this is a deal-breaker item","Inspect the rear window — they delaminate and get cloudy"] },
  {id:"e82",make:"bmw",name:"BMW 135i / 1M",gen:"2008–2013",hp:300,tq:300,tagline:"N54 in a go-kart — the hidden weapon",budget:"$2k–$8k",tax:1,taxNote:"Mild tax. 135i still $12-18k which is fair for what it is. 1M is $50-60k and officially a collector car.",
    desc:"N54 twin-turbo in a car 400 lbs lighter than 335i. Same engine, same tune potential (400HP flash), but shorter wheelbase = more fun. Regular 135i is $12-18k. 1M is $50k+ collector.",
    why:"Everything from 335i works here — same engine, same tunes, same parts. But lighter and shorter. Many consider it the best modern BMW driving experience short of an M car.",
    warns:["Same N54 issues as 335i — HPFP, injectors, wastegate, charge pipe","Manual is significantly more fun than auto","Rear tire wear is aggressive","1M is overpriced as collector — modded 135i is faster for less"],
    mistakes:["Same as 335i — charge pipe, cooling, injectors","Buying 1M for track when modded 135i is faster and cheaper","Not respecting short wheelbase — rotates faster than 335i","Cheaping out on rear tires — N54 eats them"],
    mod_order:"Same as E9X — charge pipe with tune, then intake, downpipes, intercooler",
    buyer_checklist:["Same as E9X 335i checklist — all same issues","Check rear tire wear — aggressive wear = abuse","Verify N54 vs N55","Check for LSD — some have it, some don't. LSD preferred"] },
  {id:"e9x",make:"bmw",name:"BMW E90/92 335i",gen:"2007–2013",hp:300,tq:300,tagline:"N54/N55 cheap power king",budget:"$2k–$8k",tax:0,taxNote:"No tax. $12-18k for a 335i. That's 300HP twin-turbo for the price of a Civic Si. The N54 maintenance reputation keeps prices honest.",
    desc:"N54: $500 tune = 400HP. Full bolt-on = 500WHP. The JDM killer.",
    why:"Most tuneable engine BMW ever made. Free tunes exist. Cross-platform parts from 1-series and Z4.",
    warns:["N54: wastegate rattle, HPFP failure, injector failure, oil filter housing gasket","Charge pipe WILL crack with tune","Electric water pump fails 60-80k","N55 more reliable but less tuneable","Valve cover gasket leaks on both engines"],
    mistakes:["Tuning without replacing the charge pipe — it'll crack and you'll lose all boost suddenly","Not replacing the OFHG (oil filter housing gasket) — it leaks coolant into the oil and kills the engine","Running a catless downpipe without a proper tune — throws codes and runs like garbage","Buying an N54 without budgeting for the known failure items ($2-3k reserve recommended)","Ignoring the water pump — they fail without warning and the engine overheats in minutes"],
    mod_order:"1. Replace charge pipe (do with tune) → 2. Tune (MHD free or BM3) → 3. Intake → 4. Downpipes (retune required) → 5. Intercooler → 6. Suspension",
    buyer_checklist:["Ask if HPFP (high pressure fuel pump) has been replaced — covered by recall but check","Listen for wastegate rattle at idle (ticking from turbo area)","Check for oil leaks at valve cover and OFHG","Verify water pump and thermostat have been replaced (electric, fail 60-80k)","Look for injector staining on the intake manifold (white/tan residue = leaking injectors)","Check turbo wastegate actuator rods for play","N54: ask about index 12 injector upgrade — earlier indexes are failure-prone","Pull the charge pipe boot and look for cracks in the plastic pipe"] },
  {id:"f30",make:"bmw",name:"BMW F30 340i",gen:"2012–2019",hp:320,tq:330,tagline:"B58 modern masterpiece",budget:"$2k–$6k",tax:0,taxNote:"No tax. $18-28k for 320HP with the B58. The market doesn't know the 340i exists. They all want the M3.",
    desc:"B58: 400+ HP from tune. Shared with Supra — aftermarket exploding.",
    why:"'Reliable N54' — single turbo, massive potential, shared parts with MK5 Supra.",
    warns:["Charge pipe is plastic — upgrade with tune","Oil filter housing gasket leaks","Valve cover gasket ~80-100k","ZF transmission needs proper fluid changes"],
    mistakes:["Not upgrading the charge pipe before going Stage 2 — it WILL crack under boost","Ignoring the ZF 8-speed transmission fluid — needs changed every 60k despite BMW saying 'lifetime'","Buying cheap coilovers — the F30 chassis is sensitive to suspension quality, cheap = terrible ride","Running E85 without proper fuel system upgrades — stock LPFP can't keep up"],
    mod_order:"1. Tune (BM3 or MHD) → 2. Charge pipe + BOV → 3. Intake → 4. Intercooler → 5. Downpipe (retune) → 6. Suspension",
    buyer_checklist:["Check for oil leaks at OFHG and valve cover","Ask about transmission fluid service (should be every 60k)","Check charge pipe for cracks (remove intake boot and look)","Listen for turbo noises — whining or grinding = bearing failure","Check for coolant loss — could indicate head gasket or OFHG issue","Verify no active recalls outstanding"] },
  // Subaru
  {id:"gd",make:"subaru",name:"WRX/STI GD",gen:"2002–2007",hp:227,tq:217,tagline:"The rally legend",budget:"$2k–$8k",tax:2,taxNote:"Taxed. Bugeye WRX is $8-14k. Blobeye STI is $18-28k. Hawkeye STI is $25-35k. The 'JDM era' tax is real — blame YouTube.",
    desc:"EJ turbo + AWD. The car that made Subaru famous. COBB AP is the gateway.",
    why:"Massive junkyard swap potential from STI parts. Cross-platform Subaru parts everywhere.",
    warns:["EJ ENGINES ARE FRAGILE — ringland, head gasket, rod bearing failure","ALWAYS get a Subaru-specific protune","Turbo failure common ~100k","Rust in quarter panels (NE cars)","The 5-speed WRX transmission is a glass box above 350WHP"],
    mistakes:["Running an aggressive tune on stock internals — the EJ will grenade","Using a generic dyno tuner instead of a Subaru specialist — bad tunes kill EJs fast","Not checking for boost leaks before tuning — causes lean conditions","Buying an STI without checking for spun rod bearings (common on tracked examples)","Running a BOV (blow-off valve) on the MAF-based EJ — causes stalling and rich idle","Not upgrading the up-pipe — the stock catted up-pipe cracks and leaks exhaust into the cabin"],
    mod_order:"1. Fix all maintenance (timing belt, water pump, cam seals, up-pipe) → 2. AccessPort Stage 1 → 3. Up-pipe (if stock catted) → 4. Downpipe → 5. Intake → 6. Intercooler → 7. Protune (MANDATORY) → 8. Suspension",
    buyer_checklist:["Compression test AND leak-down test all 4 cylinders — non-negotiable on EJs","Check for head gasket leaks (coolant smell, bubbles in overflow, milky oil)","Inspect turbo for shaft play (grab the compressor wheel, wiggle)","Check for boost leaks (listen for hissing under boost, check all intercooler couplings)","Look at the oil — dark and gritty = poor maintenance, milky = head gasket","Ask when timing belt was done — interference engine, belt snap = dead engine","Check the banjo bolt screen on turbo oil feed (common clog point that kills turbos)","Pull the up-pipe heat shield — look for cracks in the catted up-pipe","Inspect the clutch pedal feel — spongy = clutch master cylinder failing"] },
  {id:"gr",make:"subaru",name:"WRX/STI GR",gen:"2008–2014",hp:265,tq:244,tagline:"Widebody era — hatch life",budget:"$2k–$7k",tax:3,taxNote:"Drift taxed. The GR hatch STI is $25-40k and climbing. It's becoming a collector car. Hatch tax + STI tax + 'they don't make them anymore' tax.",
    desc:"GR hatch is one of the most desirable Subarus. STI = 305HP. Becoming a modern classic.",
    why:"Same junkyard swap potential as GD. STI parts bolt onto WRX. Hatch is incredibly practical.",
    warns:["Same EJ warnings as GD","STI DCCD center diff needs fluid changes","WRX 5-speed weak above 350WHP","Turbo inlet hose cracks cause boost leaks","Ring gear bolts on STI diff can back out"],
    mistakes:["Same EJ mistakes as GD","Not upgrading the turbo inlet hose — it cracks silently and causes lean conditions","Running the STI without changing DCCD fluid — the center diff wears out","Putting WRX wheels on STI without checking brake clearance — STI Brembos are bigger","Cheap aftermarket headers on EJ257 — unequal length is part of the character, equal length sounds wrong"],
    mod_order:"Same as GD — fix maintenance first, AP, up-pipe, downpipe, intake, intercooler, protune",
    buyer_checklist:["Same as GD plus:","Check the turbo inlet hose for cracks (silicone squeeze test)","STI: check DCCD operation — should feel different in Auto vs Manual mode","GR hatch: check rear hatch struts — they fail and the hatch drops on your head","Look for rust in the rear wheel wells and rocker panels","Check for rattles in the dashboard — common and annoying"] },
  {id:"va",make:"subaru",name:"WRX VA",gen:"2015–2021",hp:268,tq:258,tagline:"FA20DIT modern turbo",budget:"$1.5k–$5k",tax:0,taxNote:"No tax. $20-28k for WRX, $28-38k for STI. Fair prices for what they are. The VA is the 'current' WRX so supply exists.",
    desc:"FA20 DI twin-scroll. 300WHP easy and safe. Best current-gen WRX value.",
    why:"COBB ecosystem is huge. STI brake swap is common. Cross-platform with BRZ for some parts.",
    warns:["Carbon buildup on intake valves (DI engine)","Throw-out bearing noise common","NEVER run bolt-ons without AP tune","Stock tune runs lean — even Stage 1 improves reliability","Rev hang is extreme stock"],
    mistakes:["Running any bolt-on without an AccessPort tune — the FA20 WILL run lean and knock","Not getting an AOS (air/oil separator) — carbon buildup kills FA20 engines over time","Buying a 'Stage 2' car without verifying it was protuned — COBB OTS Stage 2 maps are sketchy long-term","Not replacing the throw-out bearing during a clutch job — it'll fail 10k later","Using non-Subaru-specific oil — the FA20 needs 5W-30 that meets Subaru spec, not just any 5W-30"],
    mod_order:"1. AccessPort Stage 1 (fixes rev hang immediately) → 2. Intake (with AP Stage 1+ map) → 3. AOS or catch can → 4. Turbo inlet hose → 5. TMIC → 6. J-pipe/downpipe (Stage 2, protune MANDATORY) → 7. Exhaust → 8. Suspension",
    buyer_checklist:["Check if it's been tuned — ask about AccessPort history (APs are married to the car)","Listen for throw-out bearing noise (chirping/squealing with clutch pedal up, goes away when pressed)","Check for aftermarket parts — verify everything was tuned properly","Look for oil leaks at valve covers","Check the turbo inlet hose condition","Ask about maintenance schedule — FA20 needs oil changes every 3-5k","If modded: ask who tuned it and verify they're a reputable Subaru tuner"] },
  {id:"brz",make:"subaru",name:"BRZ / FR-S / 86",gen:"2013–2020",hp:200,tq:151,tagline:"The grassroots sports car",budget:"$1k–$5k",tax:1,taxNote:"Mild tax. $16-22k for first gen. Prices went up after the second gen launched because people realized the first gen is lighter. Still reasonable.",
    desc:"The affordable RWD sports car that revived grassroots motorsports. FA20 NA makes 200HP in 2,800 lbs with perfect 53/47 weight. Designed to be modified — massive aftermarket.",
    why:"Perfect weight distribution, RWD, LSD, lightweight. Headers + tune make 220WHP and fix the torque dip. Forced induction gets 300+. Suspension and tires first, power later.",
    warns:["FA20 has torque dip 3,500-4,500 RPM — headers + tune fix it","Stock tires (Primacy HP) are terrible on purpose","2013 valve spring recall — verify it's done","Throw-out bearing issue exists here too"],
    mistakes:["Chasing power before fixing torque dip — headers + tune first","Buying the automatic — manual is the point","Not upgrading from stock tires — dangerously bad in rain","Turboing without clutch/fuel/internals upgrade — stock rods bend at 350WHP"],
    mod_order:"1. Tires (stock are dangerous) → 2. Headers + tune (fixes torque dip) → 3. Suspension → 4. Wheels → 5. Intake → 6. Catback",
    buyer_checklist:["Check if valve spring recall performed (2013 especially)","Listen for throw-out bearing chirp","Test for torque dip — 3rd gear from 3,000 RPM","Check clutch engagement","Inspect tires — budget $600 if still stock","Look for drift damage — wheels, quarters"] },
  {id:"lgt",make:"subaru",name:"Legacy GT",gen:"2005–2009",hp:250,tq:250,tagline:"The turbo sleeper nobody sees coming",budget:"$1.5k–$5k",tax:0,taxNote:"No tax. $8-14k and totally under the radar. Nobody is looking for Legacy GTs which means good deals still exist.",
    desc:"Turbocharged AWD sedan that looks like a rental car. Same EJ255 as WRX — every WRX mod works. $8-14k, completely invisible. The spec.B has 6-speed manual + Bilstein suspension.",
    why:"Literally a WRX in a suit. Same engine, same COBB support, same mod path. But it looks boring. Ultimate sleeper. The spec.B 6-speed is the holy grail.",
    warns:["Same EJ warnings as WRX — head gaskets, ringlands, timing belt","5-speed manual same weak trans as WRX","Turbo inlet hose cracks like WRX","Rust in rear wheel wells on NE cars"],
    mistakes:["Same as WRX — never tune without AP, always protune","Legacy GT intercooler is same as WRX — upgrade early","Ignoring auto trans fluid — needs changes every 30k","Modding spec.B aggressively — they're getting rare"],
    mod_order:"Same as WRX — AP Stage 1 → intake → TMIC → downpipe → exhaust → protune",
    buyer_checklist:["Same as WRX/GD checklist — compression, head gasket, turbo check","Ask about timing belt","Check if 5-speed auto or manual","spec.B: verify 6-speed and Bilsteins intact","Check turbo inlet hose for cracks"] },

  // ══════ MAZDA ══════
  {id:"miata_na",make:"mazda",name:"Miata NA (MX-5)",gen:"1990–1997",hp:116,tq:100,tagline:"The answer is always Miata",budget:"$500–$4k",tax:2,taxNote:"Taxed. The pop-up headlight tax is real. Clean NAs are $10-18k. They were $4-6k in 2018. Instagram did this.",
    desc:"The most raced car in the world. 2,100 lbs, perfect 50/50 weight, hydraulic steering, and a bulletproof 1.6/1.8L engine. NA Miatas are $5-12k and the aftermarket is bottomless. If you want to learn to drive fast, there is no better platform.",
    why:"Lightest, cheapest, most supported sports car ever made. Parts are everywhere. The 1.6 is revvy and fun, the 1.8 has more torque. Both respond to bolt-ons. Turbo kits and supercharger kits are well-documented for when you want real power.",
    warns:["Rust in rocker panels, frame rails, and around windshield drain holes","The CAS (cam angle sensor) O-ring leaks oil on 1.6 engines","Short nose crank issue on 1990-1991 1.6L — the crank pulley bolt can back out and destroy the engine","Soft top condition varies wildly — budget $200-800 for replacement"],
    mistakes:["Not checking for rust in the frame rails — a rusty Miata is not worth saving","Ignoring the short nose crank issue on early 1.6 — this destroys engines","Cheap coilovers on a Miata — the car is so light that bad damping is immediately obvious","Adding power before fixing the terrible stock brakes — 116HP is enough to overwhelm the stock brakes on track"],
    mod_order:"1. Fix rust + maintenance → 2. Good tires (biggest grip gain) → 3. Roll bar (safety) → 4. Suspension → 5. Brakes → 6. Intake + exhaust → 7. Tune",
    buyer_checklist:["Check frame rails for rust — use a flashlight and screwdriver","1990-1991: check for short nose crank fix (keyway or aftermarket pulley)","Check CAS O-ring for oil leak (back of engine, driver side)","Inspect soft top — tears, window clarity, frame condition","Check radiator for leaks — stock plastic end tanks fail","Look for timing belt service records (interference on 1.8)"] },
  {id:"miata_nb",make:"mazda",name:"Miata NB (MX-5)",gen:"1999–2005",hp:142,tq:125,tagline:"The refined roadster",budget:"$500–$4k",tax:0,taxNote:"No tax. $6-12k for a better car than the NA. No pop-up headlights means no hype tax. Smart money buys the NB.",
    desc:"The NB is the NA with more power, better brakes, and stiffer chassis. The 1.8 VVT makes 142HP and revs happily. Pop-up headlights are gone but the driving experience is better in every way. NB prices are lower than NA because everyone wants the pop-ups. Smart money buys the NB.",
    why:"Better car than NA in every measurable way, and cheaper to buy. Same aftermarket support. The 1999-2000 10AE and 2004-2005 Mazdaspeed Miata (factory turbo, 178HP) are the special editions worth hunting.",
    warns:["Same rust concerns as NA — rockers and frame rails","The Mazdaspeed Miata turbo has a small IHI turbo that runs out of breath at high RPM","Radiator end tanks crack — same as NA","Rear main seal leaks are common on high-mileage 1.8"],
    mistakes:["Passing on an NB because it doesn't have pop-ups — it's a better car","Buying a Mazdaspeed and immediately cranking boost — the stock intercooler and tune are already at the limit","Not doing the radiator preventively — it'll crack and overheat on a hot day"],
    mod_order:"Same as NA — tires, roll bar, suspension, brakes, then power",
    buyer_checklist:["Same as NA plus:","Check VVT operation — should be smooth power delivery","MSM: check turbo for shaft play, intercooler piping for boost leaks","Inspect radiator closely — plastic end tanks are the weak point"] },
  {id:"ms3",make:"mazda",name:"Mazdaspeed 3",gen:"2007–2013",hp:263,tq:280,tagline:"The unhinged turbo hatch",budget:"$1.5k–$5k",tax:1,taxNote:"Mild tax. $10-16k for a 263HP turbo hatch. Prices are creeping up as people realize Mazda won't make another one.",
    desc:"2.3L DISI turbo making 263HP through the front wheels. Torque steer is violent and glorious. These are $8-14k and respond to bolt-ons aggressively — 300WHP is easy. The aftermarket is deep thanks to the Ford Duratec/MZR engine family.",
    why:"Cheap, fast, practical hatch with a turbo engine that loves mods. The DISI turbo 2.3 is shared with the Ford Focus ST, so aftermarket parts cross-apply. COBB AccessPort support, big turbo kits available. One of the best performance values under $15k.",
    warns:["Torque steer is extreme — the car pulls hard under boost","The DISI engine has zoom-zoom valve issues (VVT rattle on cold start)","Turbo seal failure causes oil consumption","The rear motor mount is weak — clunks on shifts"],
    mistakes:["Running a catless downpipe without a tune — the DISI will run lean","Not upgrading the rear motor mount — causes horrible clunking","Ignoring the VVT rattle — it's a sign of wear that gets worse","Adding more power without addressing the torque steer — a good LSD helps"],
    mod_order:"1. AccessPort Stage 1 → 2. Rear motor mount → 3. Intake → 4. Downpipe + tune → 5. FMIC → 6. Suspension",
    buyer_checklist:["Listen for VVT rattle on cold start","Check turbo for shaft play and oil consumption","Inspect rear motor mount (shift clunk test)","Look for signs of aggressive driving (tire wear, brake wear)","Check for boost leaks (listen for hissing under load)"] },

  {id:"rx7_fc",make:"mazda",name:"RX-7 FC3S",gen:"1986–1991",hp:182,tq:183,tagline:"The rotary that started it all — turbo triangle power",budget:"$1k–$6k",tax:2,taxNote:"FC prices rising — clean turbo IIs are $12-20k now. NA models still $5-10k. Rotary tax is real but not as bad as FD.",
    desc:"The FC RX-7 is where rotary enthusiasm begins. The 13B turbo makes 182HP stock and responds to boost mods aggressively. The NA models are cheaper and many people turbo them. The car weighs 2,800 lbs with perfect 50/50 weight distribution. The FC is the affordable rotary — the FD is $40k+, the FC is $5-15k. The community is passionate and the knowledge base is deep on RX7Club.com.",
    why:"Lightweight, rear-wheel drive, turbo rotary, and still affordable. The 13B-T responds to boost controller + exhaust + intake dramatically. The chassis handles beautifully. And the rotary experience — the smooth power delivery, the sound, the way it revs — is unlike any piston engine. You either get it or you don't. Most rotary people get it.",
    warns:["Rotary engines need MAINTENANCE — premix oil in every tank of gas, check compression regularly","The 13B apex seals are the weak point — low compression = rebuild time ($2-4k)","Cooling system is critical — rotaries run hot, replace the radiator","The turbos on the Turbo II models are small and can be upgraded","Fuel injectors fail with age — budget for replacements"],
    mistakes:["Buying an FC without a compression test — this is THE #1 rule for any rotary purchase","Not premixing oil in the gas — the rotary needs oil to lubricate the apex seals, the stock oil injection system isn't enough","Ignoring the cooling system — a hot rotary is a dead rotary","Revving it without warming it up — rotaries need to reach operating temp before you push them","Buying a project thinking 'it just needs apex seals' — a full rebuild is $3-5k at a rotary specialist"],
    mod_order:"1. Compression test → 2. Cooling system (radiator, thermostat, hoses) → 3. Premix setup → 4. Boost controller (turbo models) → 5. Exhaust → 6. Intake → 7. Fuel system",
    buyer_checklist:["COMPRESSION TEST — non-negotiable. Below 6.5 on any rotor = rebuild needed","Check for coolant in the oil (blown coolant seal)","Listen for unusual engine sounds — rotaries should be smooth","Check turbo for shaft play on Turbo II models","Look for rust in the quarters and rocker panels","Verify the engine hasn't been bridge-ported (affects idle and emissions)","Check all electrical — 30+ year old wiring gets brittle"] },

  {id:"rx8",make:"mazda",name:"RX-8",gen:"2003–2012",hp:232,tq:159,tagline:"The rotary nobody wants — which makes it the rotary YOU should buy",budget:"$500–$3k",tax:0,taxNote:"No tax. $4-8k for a clean one. The RX-8's reputation for engine failure keeps prices honest. Smart money sees opportunity.",
    desc:"The RX-8 has the RENESIS 13B-MSP — a naturally aspirated rotary that makes 232HP and revs to 9,000 RPM. It has suicide doors, 4 seats, and one of the best chassis Mazda ever made. It's also known for engine failure — which is why they're $4-8k. BUT: most failures are caused by neglect, not design. A properly maintained RX-8 is reliable. The community at RX8Club.com has documented everything. This is the cheapest way to experience a rotary.",
    why:"$4-8k for a 9,000 RPM naturally aspirated sports car with one of the best chassis in production. The RX-8's reputation keeps prices low, which is your advantage. The car handles on par with the S2000. The engine requires specific maintenance but it's not complicated — it's just different from a piston engine. The modding community focuses on reliability first, power second.",
    warns:["The RENESIS has apex seal failure if neglected — NEVER ignore low compression","Check engine light for catalytic converter is almost universal — not always serious","The car DRINKS oil by design — check oil every fill-up, top off regularly","Flooding is common — the engine floods if you start it and shut it off before it warms up","Automatic RX-8s have significantly less power (197HP vs 232HP) — buy the manual"],
    mistakes:["Buying an RX-8 without understanding rotary maintenance — it's a different kind of engine","Starting the car and shutting it off before it warms up — this floods the engine","Not checking oil every fuel stop — the RENESIS burns oil BY DESIGN, it's not a fault","Buying the automatic — 35HP less and you lose the entire point of a high-revving rotary","Thinking you can put it on jack stands and ignore it — rotaries need to be DRIVEN regularly"],
    mod_order:"1. Compression test → 2. Coils + plugs + wires (reliability) → 3. Oil cooler → 4. Intake → 5. Exhaust → 6. Tune → 7. Suspension",
    buyer_checklist:["COMPRESSION TEST with a rotary-specific gauge — minimum 6.5 across all faces","Check oil level — should be topped off, not low","Start the car cold — should fire up within 3 cranks, no extended cranking","Rev to 9,000 RPM — should pull smoothly with no hesitation","Check for catalytic converter CEL (common, not always serious)","Look for coolant loss — check overflow tank level","Verify it's the 6-speed manual (232HP), not the auto (197HP)"] },

  {id:"speed6",make:"mazda",name:"Mazdaspeed 6",gen:"2006–2007",hp:274,tq:280,tagline:"AWD turbo sedan — Mazda's forgotten Evo fighter",budget:"$1k–$5k",tax:0,taxNote:"No tax. $8-14k. Mazda only made it for 2 years and then pretended it never existed. Their loss, your gain.",
    desc:"The Mazdaspeed 6 is a 274HP turbocharged AWD sedan that Mazda made for exactly 2 model years before discontinuing it. Same DISI 2.3T as the Mazdaspeed 3 but with AWD and a more mature body. It weighs 3,500 lbs, has torque vectoring, and was meant to compete with the Evo and STI. The aftermarket is shared with the MS3 — same engine, same turbo, same tune support. These are $8-14k and almost nobody knows they exist.",
    why:"AWD turbo sedan for under $15k that shares its entire powertrain with the Mazdaspeed 3. Every MS3 mod works — COBB AP, Corksport parts, turbo upgrades. But it has AWD for traction and a sedan body for invisibility. It's the sleeper Evo/STI alternative that Mazda forgot to advertise.",
    warns:["Same DISI engine issues as MS3 — VVT rattle, rear motor mount failure","AWD system adds complexity and weight vs MS3","Transfer case needs fluid changes — neglect kills it","Only made 2006-2007, so parts availability can be limited for body-specific items","The turbo is the same small K04 as the MS3 — tops out around 300WHP"],
    mistakes:["Not changing the transfer case fluid — AWD system needs maintenance","Same rear motor mount issue as MS3 — replace it proactively","Running high boost without upgrading the fuel system — stock injectors max out at ~320WHP","Buying one without checking the VVT system — rattle on cold start = wear"],
    mod_order:"Same as MS3 — AP Stage 1 → rear motor mount → intake → downpipe + tune → FMIC",
    buyer_checklist:["Same as MS3 plus:","Check transfer case fluid condition","Test AWD engagement — should feel planted in corners","Listen for VVT rattle on cold start","Check for rust in rocker panels"] },

  // ══════ TOYOTA ══════
  {id:"ae86",make:"toyota",name:"Corolla AE86",gen:"1984–1987",hp:112,tq:97,tagline:"The drift king's chariot — Initial D made it famous",budget:"$1k–$10k",tax:4,taxNote:"UNOBTAINIUM. In North America: $20-40k for clean examples. Rusty shells $5-10k. Initial D tax + drift tax + JDM tax = astronomical. This is not a budget platform anymore.",
    desc:"The car that started drifting. The 4A-GE is a high-revving 1.6L that sounds incredible at 8,000 RPM. RWD, lightweight (2,200 lbs), and legendary in motorsports. Prices have skyrocketed ($15-30k for clean examples) but project cars still exist. The aftermarket is deep in Japan but limited in the US — you'll be importing parts.",
    why:"Nothing else drives like an AE86. It's analog, lightweight, rear-wheel drive, and rewards driver skill above all else. The 4A-GE engine is a work of art. For builders, the Beams 3S-GE and 1JZ/2JZ swaps are well-documented and transform the car.",
    warns:["Prices are insane — don't overpay for a rusty shell","Rust is the #1 killer — especially in the quarters and floor","Parts are getting rare — many are Japan-import only","The 4A-GE needs valve adjustment and timing belt service"],
    mistakes:["Paying collector prices for a project car — be realistic about condition","Not checking for rust in the floor pans and rear quarters","Trying to make big power on the stock 4A-GE — swap to Beams or 1JZ instead","Drifting on stock suspension — the car needs coilovers and a welded diff minimum"],
    mod_order:"1. Fix rust → 2. Suspension + welded diff → 3. Roll cage (safety) → 4. Engine swap (if applicable) → 5. Tires → 6. Brakes",
    buyer_checklist:["Check ALL rust — floor pans, quarters, shock towers, frame rails","Verify engine — is it the original 4A-GE or has it been swapped?","Check for previous drift damage — bent suspension, cracked subframe","Inspect the diff — is it welded, LSD, or open?","Look for timing belt service records on 4A-GE"] },
  {id:"mk4",make:"toyota",name:"Supra MK4",gen:"1993–2002",hp:320,tq:315,tagline:"The 2JZ legend — 1,000HP on stock internals",budget:"$3k–$15k",tax:4,taxNote:"UNOBTAINIUM. Clean TT Supras are $50-80k+. NA models $25-40k. The 2JZ legend has priced out normal humans. The poster car tax is maximum.",
    desc:"The 2JZ-GTE is arguably the strongest stock engine ever made — people run 1,000+ HP on the factory block and head. The MK4 Supra is an icon, and prices reflect it ($40-80k+ for clean TT examples). The NA 2JZ-GE is the budget entry — same block, single turbo conversion documented extensively.",
    why:"The 2JZ is the king of inline-6 engines for power potential. Even the NA version responds to a single turbo conversion. The aftermarket is massive. But honestly, at current prices, building a Supra is more of a dream car project than a budget build.",
    warns:["Prices are astronomical — clean TTs are $50-80k+","NA-to-TT conversion is well-documented but expensive ($5-8k)","The W58 manual in NA cars is weak above 400WHP — need R154 or CD009 swap","Automatic Supras are significantly cheaper but less desirable"],
    mistakes:["Buying a TT Supra as a 'budget' project — there's nothing budget about these anymore","Running high boost on the W58 transmission — it'll grenade","Not checking for rust in the hatch area and rear quarters","Buying an auto thinking the manual swap is easy — it's a $3-5k project"],
    mod_order:"1. Maintenance (timing belt, water pump) → 2. Exhaust → 3. Intake → 4. Boost controller → 5. Fuel system → 6. Tune → 7. Transmission upgrade (if needed)",
    buyer_checklist:["Check for rust in the rear hatch area and quarters","Verify TT vs NA — check turbo presence, not just badges","Test the transmission — W58 5-speed (NA) or V160 6-speed (TT)","Look for timing belt service records","Check for boost leaks on TT models","Verify the ECU hasn't been tampered with"] },
  {id:"taco",make:"toyota",name:"Tacoma",gen:"2005–2023",hp:278,tq:265,tagline:"The indestructible midsize truck",budget:"$1k–$6k",tax:2,taxNote:"Taxed. Tacomas hold value better than gold. A 2015 with 120k miles is still $22-28k. Toyota tax + truck tax + 'they never break' tax.",
    desc:"The Tacoma is the most popular midsize truck for overlanding, off-roading, and daily driving. The 2nd gen (2005-2015) with the 4.0 V6 is bulletproof. The 3rd gen (2016-2023) with the 3.5 V6 is more refined but has less low-end grunt. Both respond well to suspension lifts, armor, and off-road accessories. The TRD Off-Road and TRD Pro are the trim levels to look for.",
    why:"Toyota reliability + massive aftermarket. The Tacoma holds its value better than any vehicle on earth. The off-road community is enormous. Lift kits, bumpers, skid plates, roof racks, lighting — there's a part for everything. And Tacomas with 300k miles are still worth $15k.",
    warns:["Frame rust recall on 2005-2010 models — check if frame was replaced","The 2016+ 3.5 V6 has less torque than the 4.0 — feels sluggish with heavy mods","Automatic transmission on 3rd gen hunts for gears with larger tires","Leaf springs in the rear sag over time — budget for OME or Dakar replacement"],
    mistakes:["Not checking the frame rust recall on 2nd gen — rusted frames snap","Lifting more than 3\" without regearing — the truck struggles with 33\"+ tires on stock gears","Cheap lift kits that don't include UCAs — destroys ball joints at full droop","Not doing a transmission tune after lifting + bigger tires on 3rd gen"],
    mod_order:"1. Check frame condition → 2. Tires (biggest off-road improvement) → 3. Suspension lift → 4. Skid plates/armor → 5. Bumpers → 6. Lighting → 7. Tune (if 3rd gen)",
    buyer_checklist:["2005-2010: check frame rust recall status — was it replaced?","Check leaf spring sag — measure from frame to axle","Look for signs of off-road abuse — dented skid plates, bent armor","Check transfer case and diff fluids — often neglected","Verify 4WD engagement — test low range","Check for exhaust manifold cracks (common on 4.0 V6)"] },
  {id:"4runner",make:"toyota",name:"4Runner",gen:"2003–2023",hp:270,tq:278,tagline:"The SUV that goes anywhere — and never breaks",budget:"$1k–$8k",tax:2,taxNote:"Taxed. Same Toyota tax as Tacoma. 5th gen with 100k miles is still $25-32k. They refuse to depreciate.",
    desc:"The 4Runner is the Tacoma's bigger brother. The 4th gen (2003-2009) with the 4.7 V8 is the sweet spot for power and capability. The 5th gen (2010-2023) with the 4.0 V6 is the most popular and has the deepest aftermarket. Both are overbuilt — 300k miles is routine. The TRD Pro and Trail Edition are factory-lifted from Toyota.",
    why:"Same Toyota reliability as Tacoma but with more cargo space and towing capability. The 4Runner aftermarket is massive — everything from mild lift kits to full expedition builds. The V8 4th gen is the sleeper pick — more power, same reliability, cheaper than the V6 5th gen.",
    warns:["The 4.0 V6 in the 5th gen is adequate but not powerful — it struggles with heavy builds","The KDSS suspension on some models complicates aftermarket lift installs","Frame rust on early 4th gen models — same issue as Tacoma","The 5th gen automatic is fine but hunts for gears with larger tires"],
    mistakes:["Lifting without budgeting for proper UCAs — stock upper control arms limit wheel travel","Not regearing with 33\"+ tires — the 4.0 V6 doesn't have the torque to spin big tires efficiently","Ignoring KDSS if equipped — aftermarket companies make KDSS-compatible lifts, don't hack it","Cheap bumpers that don't have proper mounting — they flex and crack at the mounts"],
    mod_order:"1. Tires → 2. Suspension lift (with UCAs) → 3. Skid plates → 4. Bumpers → 5. Roof rack → 6. Lighting → 7. Rear locker (if not equipped)",
    buyer_checklist:["Check frame for rust (especially 4th gen)","Verify KDSS equipped or not (affects lift options)","Check transfer case operation — test 4WD low range","Inspect CV boots and ball joints","Look for signs of off-road use — rock rash, skid plate dents","Check timing belt on V8 models (4th gen)"] },
  {id:"camry_v6",make:"toyota",name:"Camry V6",gen:"2007–2017",hp:268,tq:248,tagline:"268HP in the most boring body possible — the invisible weapon",budget:"$500–$3k",tax:0,taxNote:"No tax. $8-15k for a 268HP V6 sedan. Nobody wants a 'sporty Camry' which keeps prices honest. That's the whole point.",
    desc:"The Camry V6 makes more power than a Civic Si, BRZ, and Miata. In a body that screams 'I file my taxes early.' The 2GR-FE is Toyota's legendary V6 — also in the Lexus ES/IS and Avalon. Bulletproof to 300k+ miles.",
    why:"268HP, Toyota reliability, and absolute invisibility. Cops don't look at it. Insurance is cheap. It's the sleeper philosophy taken to its logical extreme. TRD even made a supercharger kit for the 2GR.",
    warns:["No manual option most years — auto only","Oil consumption on some 2007-2009","Transmission is the weak link with added power","Not much suspension aftermarket — it's a Camry"],
    mistakes:["Expecting sports car handling — it's comfortable, not agile","Telling people you modded your Camry — embrace the judgement","Loud exhaust on a Camry just confuses everyone","Spending more on mods than the car is worth"],
    mod_order:"1. Intake → 2. Exhaust (tasteful) → 3. Tune → 4. Lower 1\" on springs → 5. Tell nobody",
    buyer_checklist:["Check oil consumption — some 2GR burn oil","Verify it's the V6, not the 4-cylinder","Check transmission shift quality","Listen for timing chain noise at high mileage"] },

  {id:"mr2_sw20",make:"toyota",name:"MR2 SW20",gen:"1991–1999",hp:200,tq:200,tagline:"Mid-engine turbo Toyota for under $15k — snap oversteer included free",budget:"$1k–$6k",tax:2,taxNote:"Taxed. Clean turbo SW20s are $15-25k and climbing. NA models still $8-14k. JDM import tax is pushing prices up.",
    desc:"The SW20 MR2 is a mid-engine, rear-wheel drive sports car with an optional turbo 3S-GTE making 200HP. It weighs 2,800 lbs. It's a baby Ferrari for Toyota money. The turbo model responds to bolt-ons aggressively — 250-300WHP is well-documented. The NA 5S-FE is fun but slow. The car is notorious for snap oversteer in early models (1991-1993) — later revisions added a stiffer rear sway bar and softer front bar to fix it. The community at MR2OC.com is deep.",
    why:"Mid-engine layout, turbo option, Toyota reliability (when maintained), and a driving experience that nothing else in this price range offers. The 3S-GTE is well-documented for boost builds. The chassis is balanced and communicative. It's the affordable mid-engine experience.",
    warns:["Snap oversteer on pre-1993 models is REAL — the rear end comes around fast","The 3S-GTE turbo is oil-cooled and needs proper maintenance — turbo failure is expensive","Rust in the trunk area and rear quarters is common","The E153 transmission synchros wear on turbo models","Mid-engine means the engine is behind you — everything is harder to access"],
    mistakes:["Buying a pre-1993 turbo as your first mid-engine car — the snap oversteer WILL surprise you","Not checking the turbo for shaft play — 3S-GTE turbos fail if oil changes are neglected","Ignoring the timing belt — the 3S-GTE is interference, belt snap = dead engine","Cheap coilovers on a mid-engine car — bad suspension on an MR2 is genuinely dangerous"],
    mod_order:"1. Timing belt + water pump → 2. Turbo inspection → 3. Cooling system → 4. Exhaust → 5. Intake → 6. Boost controller → 7. Suspension → 8. Tune",
    buyer_checklist:["Check for snap oversteer revision (1993+ have the fix)","Compression test the 3S-GTE","Check turbo shaft play — grab compressor wheel and wiggle","Look for rust in trunk area and behind rear bumper","Verify timing belt history — interference engine","Test all gears — E153 synchros wear on turbo models"] },

  {id:"celica_gts",make:"toyota",name:"Celica GT-S / Matrix XRS",gen:"2000–2006",hp:180,tq:130,tagline:"The 2ZZ-GE — Toyota's forgotten 8,200 RPM screamer",budget:"$500–$3k",tax:0,taxNote:"No tax. $5-10k for a clean GT-S. The Matrix XRS is even cheaper at $3-7k. Nobody wants these. Perfect for us.",
    desc:"The 2ZZ-GE is Toyota's high-revving VVTL-i engine — it revs to 8,200 RPM and makes 180HP from 1.8L. It lives in the Celica GT-S, Matrix XRS, Corolla XRS, and the Lotus Elise/Exige. The lift engagement at 6,200 RPM is Honda VTEC-levels of addictive. These cars are dirt cheap because nobody remembers them. The Celica GT-S weighs 2,500 lbs and handles well. The Matrix/Corolla XRS puts the same engine in a practical body.",
    why:"8,200 RPM redline from Toyota. The 2ZZ-GE is one of the greatest engines Toyota ever made and they put it in cars that cost $5-10k used. The Celica GT-S is a lightweight FWD coupe that eats corners. The Matrix XRS is a practical hatchback with a screamer engine. Both are invisible to cops and insurance companies. The engine is also in the Lotus Elise — that should tell you something about its quality.",
    warns:["The 2ZZ-GE has a lift bolt issue on pre-2003 models — the VVTL-i mechanism can fail","Oil consumption is common on high-mileage 2ZZ engines — check oil regularly","The engine makes all its power above 6,000 RPM — it's slow below that","The 6-speed manual is the only transmission worth having — the 4-speed auto kills the experience"],
    mistakes:["Buying the automatic — the 4-speed auto in the Celica GT-S is painfully slow and removes the entire point","Not checking for the lift bolt recall on pre-2003 2ZZ-GE engines","Expecting low-end torque — the 2ZZ makes 130 lb-ft, it's not a torque monster","Not revving it past 6,200 RPM — VVTL-i lift is where the magic happens, you HAVE to rev it"],
    mod_order:"1. Check lift bolt recall → 2. Header → 3. Intake → 4. Exhaust → 5. Tune → 6. Suspension → 7. Rev to 8,200 every chance you get",
    buyer_checklist:["Verify lift bolt recall was performed (pre-2003)","Rev past 6,200 RPM — should feel a distinct surge when VVTL-i engages","Check oil level — 2ZZ burns oil on high-mileage examples","Verify it's the GT-S (2ZZ) not the GT (1ZZ) — completely different engines","Test all 6 gears — synchros can wear","Listen for lifter tick on cold start"] },

  // ══════ NISSAN ══════
  {id:"z33",make:"nissan",name:"350Z / G35",gen:"2003–2008",hp:287,tq:274,tagline:"VQ power — the affordable sports car",budget:"$1k–$5k",tax:1,taxNote:"Mild tax. 350Z is $10-18k, G35 is $8-14k. Prices rising as clean examples disappear. The HR models (2007+) command a premium.",
    desc:"The VQ35DE (rev-up in later models VQ35HR) is a legendary V6. 350Z and G35 share the same platform — the Z is lighter, the G35 has more luxury. Both are $8-15k, both handle well, and the VQ aftermarket is massive. These are the affordable RWD sports car that replaced the 240SX for a generation of builders.",
    why:"Cheap, powerful, RWD, and the VQ35 responds to bolt-ons well. Test pipes + intake + tune = 300+ WHP. The drift community loves these. The G35 is the sleeper pick — same car but looks like a luxury sedan. DE vs HR matters — the HR (2007+) revs higher and makes more power.",
    warns:["Oil consumption on DE engines is common — check oil level","The CD009 6-speed transmission is excellent but synchros wear on tracked cars","Rear subframe bushings wear and cause clunking","Concentric slave cylinder on manual cars fails — clutch pedal goes to floor"],
    mistakes:["Not checking DE vs HR — they're different engines with different mod paths","Running test pipes without a tune — the VQ will throw codes and run poorly","Buying an automatic G35 thinking you can manual swap easily — the swap is $3-5k","Cheap coilovers on the Z platform — the car weighs 3,300 lbs and needs proper damping"],
    mod_order:"1. Test pipes/HFC + tune → 2. Intake → 3. Exhaust → 4. Suspension → 5. Wheels/tires → 6. Differential upgrade",
    buyer_checklist:["Check oil level — VQ35DE consumes oil","Verify DE vs HR (HR has 'rev-up' on engine cover or is 2007+)","Test clutch engagement on manual — CSC failure is common","Check for gallery gasket leak (coolant in oil, 2003-2006)","Inspect rear subframe bushings for play","Look for signs of drift abuse — curbed wheels, burnt tires, body damage"] },
  {id:"s_chassis",make:"nissan",name:"240SX S13/S14",gen:"1989–1998",hp:155,tq:160,tagline:"The drift platform that started everything",budget:"$1k–$8k",tax:3,taxNote:"DRIFT TAXED. Clean S14 is $12-22k. S13 is $10-18k. They were $3-5k in 2015. The drift community priced everyone out.",
    desc:"The S-chassis is the most popular drift platform in history. The KA24DE is reliable but slow — which is why everyone swaps them. SR20DET, RB25DET, LS, JZ swaps are all extensively documented. Clean S13/S14s are $10-20k+ now because drift tax is real. But as a platform, nothing matches the S-chassis for swap versatility.",
    why:"The S-chassis was designed to drift. Perfect weight distribution, excellent steering feel, and the engine bay fits everything from an SR20 to an LS V8. The community has documented every swap imaginable. If you want to build a drift car, start here.",
    warns:["Prices have gone insane — 'drift tax' is real","Almost every S-chassis has been drifted, crashed, or poorly modified","Rust is common on 25+ year old cars — check everything","The KA24DE is reliable but boring — budget for a swap if you want power"],
    mistakes:["Buying a 'drift car' project without inspecting the subframe and unibody — many have been bent and straightened","Not budgeting enough for a proper swap — a good SR20 swap costs $5-8k done right","Cheap turbo kits on the KA24DE — the KA doesn't respond to boost as well as an SR20","Welding the diff without upgrading the axles — stock axles snap under power with a welded diff"],
    mod_order:"1. Inspect chassis thoroughly → 2. Engine swap (if applicable) → 3. Cooling system → 4. Suspension + coilovers → 5. Diff (welded or LSD) → 6. Seats + harness (safety) → 7. Tune",
    buyer_checklist:["Inspect the unibody and subframe for bends and cracks — use a level","Check for rust everywhere — rocker panels, floor pans, strut towers","Verify the engine — stock KA24DE? SR20 swap? LS swap?","If swapped: inspect the quality of the swap — wiring, mounts, cooling","Check the diff — welded, VLSD, or open?","Look for frame rail damage from drifting impacts"] },
  {id:"frontier",make:"nissan",name:"Frontier / Xterra",gen:"2005–2023",hp:261,tq:281,tagline:"The underdog truck that just works",budget:"$1k–$5k",tax:0,taxNote:"No tax. $10-18k and always cheaper than a comparable Tacoma. The Frontier is the value play in midsize trucks.",
    desc:"The Nissan Frontier is the truck that Nissan forgot to update for 15 years — and that's why people love it. The VQ40DE 4.0 V6 is proven reliable (shared with the Pathfinder/Xterra family). It's simpler than the Tacoma, cheaper to buy, and the aftermarket has caught up. The Xterra shares the same platform and is the SUV equivalent.",
    why:"Cheaper than a Tacoma with comparable capability. The VQ40 is a proven engine. The aftermarket isn't as deep as Tacoma but everything you need exists — lift kits, bumpers, sliders, skid plates. The PRO-4X trim comes with a rear locker and Bilstein shocks from the factory.",
    warns:["The VQ40 has a timing chain tensioner issue — listen for rattle on cold start","Radiator transmission cooler lines on auto models can mix coolant and trans fluid — 'Strawberry milkshake of death'","SMOD (strawberry milkshake) issue mainly affects 2005-2010 models","Leaf springs sag over time, just like Tacoma"],
    mistakes:["Not checking for SMOD on 2005-2010 automatics — transmission cooler failure mixes fluids and destroys the trans","Ignoring the timing chain rattle — it gets worse and can jump timing","Lifting without upgrading the UCAs — same issue as Tacoma","Cheap bumpers that aren't properly braced — they sag and flex"],
    mod_order:"1. Fix SMOD issue (if 2005-2010 auto) → 2. Tires → 3. Suspension lift → 4. Skid plates → 5. Bumpers → 6. Lighting",
    buyer_checklist:["2005-2010 auto: check for SMOD (strawberry milkshake death) — look at trans fluid color","Listen for timing chain rattle on cold start","Check leaf spring sag","Verify 4WD operation — test low range","Check for radiator leaks","Inspect CV boots and ball joints"] },
  {id:"altima",make:"nissan",name:"Altima 3.5 / Maxima",gen:"2002–2018",hp:270,tq:258,tagline:"VQ power in a car your insurance agent approves of",budget:"$500–$3k",tax:0,taxNote:"No tax. $5-10k for the SE-R manual. Altimas depreciate like rocks. That's a feature when you're buying.",
    desc:"The Altima 3.5 SE-R and Maxima share the VQ35DE with the 350Z — in a boring sedan body. The Altima SE-R (2002-2006) had 260HP and came with a 6-speed manual. The Maxima has been called the '4-door sports car' since the 90s. Both are $4-10k, completely invisible, and make real power.",
    why:"VQ35 power in a car that looks like a rental. The Altima SE-R with the 6-speed manual is genuinely fun to drive. The Maxima is a comfortable highway cruiser that can surprise people. Both share bolt-ons with the 350Z/G35. Insurance is half the price of a Z.",
    warns:["CVT transmission on 2007+ Altimas is TERRIBLE — buy 2002-2006 with manual","Maxima CVT is also unreliable — earlier models with 5-speed auto are better","Oil consumption on VQ35DE","The Altima SE-R manual is getting rare — grab one if you find it"],
    mistakes:["Buying a CVT Altima thinking you'll mod it — the CVT can't handle extra power and will die","Not checking VQ35DE oil consumption — add a quart between changes","Expecting Z car handling — these are FWD sedans, they understeer","Putting Z exhaust parts on an Altima without checking fitment — different exhaust routing"],
    mod_order:"1. Intake → 2. Exhaust (check Altima/Maxima specific fitment) → 3. Tune → 4. Suspension → 5. Look boring, drive fast",
    buyer_checklist:["MANUAL ONLY on Altima — CVT will fail","Check VQ35DE oil level — top off if low","Listen for timing chain noise","Check for CVT shudder if buying auto Maxima","Look for the SE-R badge on Altima — it's the one you want"] },

  {id:"z32",make:"nissan",name:"300ZX Z32",gen:"1990–1996",hp:300,tq:283,tagline:"Twin-turbo V6, T-tops, and 90s excess — the Z that tried to be a GT-R",budget:"$2k–$8k",tax:2,taxNote:"Taxed. Clean TT Z32s are $18-30k. NA models $8-15k. The Z community has pushed prices up significantly since 2020.",
    desc:"The Z32 300ZX Twin Turbo makes 300HP from a VG30DETT — twin turbo V6 with T-tops and pop-up headlights. In 1990 this was a $40k supercar competitor. Now they're $10-30k depending on condition. The NA VG30DE makes 222HP and is the budget entry. The twin turbo model responds to bolt-ons well — 350-400HP is achievable. The problem: everything is crammed into the engine bay. Working on a Z32 TT is a nightmare of vacuum lines and tight spaces. The community calls it 'TT tax' — every job takes 3x longer than it should.",
    why:"300HP twin turbo with T-tops and 90s JDM styling for under $30k. The VG30DETT is a strong engine that handles power well. The car looks incredible and has presence that modern cars can't match. But be honest with yourself — this is not a beginner-friendly platform. It requires patience, budget, and willingness to fight vacuum lines.",
    warns:["The engine bay is PACKED — every repair takes 3x longer than any other car","Vacuum line deterioration causes boost leaks, idle problems, and CELs","The turbos fail around 100k — budget for replacement ($1,500-3,000)","T-top seals leak — check headliner for water damage","The automatic transmission is weak — buy manual only for the TT model"],
    mistakes:["Buying a TT Z32 as a first project car — the complexity will break your spirit","Not replacing all vacuum lines when you find one bad one — they ALL need replacing","Thinking the NA model is 'almost as good' — it's a completely different experience","Ignoring the timing belt — VG30DETT is interference"],
    mod_order:"1. Replace ALL vacuum lines → 2. Timing belt + water pump → 3. Turbos (if original) → 4. Exhaust → 5. Intake → 6. ECU → 7. Boost controller",
    buyer_checklist:["Check ALL vacuum lines — if one is cracked, they're all dying","Compression test","Check turbos for shaft play and oil leaks","Inspect T-top seals — water damage ruins interiors","Verify timing belt history","Check for boost leaks — should hold steady boost without drops","Look at the engine bay — has it been maintained or is it a rat's nest of zip ties?"] },

  {id:"sentra_ser",make:"nissan",name:"Sentra SE-R Spec V",gen:"2002–2006",hp:175,tq:180,tagline:"The budget racer Nissan killed too soon — QR25DE screamer",budget:"$500–$2k",tax:0,taxNote:"No tax. $3-6k and falling. Nobody wants a Sentra. That's exactly why you should buy one.",
    desc:"The Sentra SE-R Spec V has the QR25DE 2.5L making 175HP with a 6-speed manual, LSD, and bigger brakes than the base Sentra. It weighs 2,900 lbs and was Nissan's budget B-segment racer. The QR25DE revs to 6,500 RPM and responds to bolt-ons decently. These are $3-6k, overlooked by everyone, and the Spec V community (B15U.com) has documented everything. It's the Civic Si competitor that history forgot.",
    why:"6-speed manual, LSD, 175HP, and under $6k. The Spec V came from the factory ready to autocross. Nissan gave it the good stuff — limited slip diff, bigger brakes, stiffer suspension — and then nobody bought it because it said 'Sentra' on the trunk. Their loss. The QR25DE is also shared with the Altima, so junkyard parts are everywhere.",
    warns:["The QR25DE has a pre-cat that disintegrates and gets sucked into the engine — delete it","Butterfly valve screws in the intake manifold back out and fall into the engine — a known defect","The clutch is weak above 200WHP","Some Spec Vs have the Nissan CVT — avoid those, get the 6-speed manual"],
    mistakes:["Not deleting the pre-cat — ceramic material from the failing pre-cat destroys the engine","Not checking for the butterfly valve screw recall/fix","Buying a CVT Spec V — yes they exist and they're terrible","Spending more on mods than the car is worth — keep the total build cost under the car's value"],
    mod_order:"1. Pre-cat delete (engine survival) → 2. Butterfly valve screw fix → 3. Header → 4. Intake → 5. Exhaust → 6. Tune → 7. Suspension",
    buyer_checklist:["Check if pre-cat has been deleted or is intact (if intact, it needs deleting)","Verify butterfly valve screw fix has been done","Check for the 6-speed manual, not CVT","Test LSD engagement — both wheels should spin under power","Rev to redline — should pull clean with no hesitation","Check for oil consumption — QR25DE burns oil on some examples"] },

  // ══════ MAZDA (continued) ══════
  {id:"protege",make:"mazda",name:"Protegé / Mazdaspeed Protegé",gen:"2001–2003",hp:170,tq:160,tagline:"The forgotten Mazdaspeed — turbo hatch before it was cool",budget:"$500–$3k",tax:0,taxNote:"No tax. $2-5k for a Protegé5. MSP is $5-8k if you can find one. Nobody wants these. Perfect.",
    desc:"The Mazdaspeed Protegé (MSP) was Mazda's first factory turbo car in the US — 170HP from a 2.0T in 2003. It predates the Mazdaspeed 3 by 4 years. The non-turbo Protegé5 hatchback is also a great platform — 130HP, lightweight, fun chassis, and dirt cheap ($2-5k). The MSP is getting rare but the Protegé5 is still everywhere at junkyards.",
    why:"The MSP is Mazda's forgotten turbo car — it responds to boost mods just like the MS3 but it's smaller and lighter. The Protegé5 is a fun little hatch that weighs 2,700 lbs and handles well. Both are so cheap that you can build one without caring about resale value. That freedom is underrated.",
    warns:["MSP turbo models are getting rare — maybe 500 clean ones left in the US","The 2.0T in the MSP shares nothing with the MS3 DISI — different engine family","Parts availability is declining — stock up on OEM parts when you find them","Rust in rocker panels on northern cars"],
    mistakes:["Expecting MS3-level aftermarket support — the MSP aftermarket is much smaller","Running high boost on stock MSP internals — the FS-DET is not as strong as the DISI","Buying a Protegé5 thinking it's fast — it's fun but 130HP is 130HP","Not checking for rust — these are 20+ year old Mazdas"],
    mod_order:"MSP: 1. Intake → 2. Exhaust → 3. Boost controller → 4. FMIC → 5. Tune\nProtegé5: 1. Intake → 2. Exhaust → 3. Suspension → 4. Accept the 130HP life",
    buyer_checklist:["MSP: check turbo for shaft play","Check for rust everywhere — rocker panels, wheel wells","Verify it's actually an MSP — some people badge non-turbo cars","Check clutch condition — MSP owners launch these hard","Look at the timing belt service history"] },

  // ══════ FORD ══════
  {id:"crown_vic",make:"ford",name:"Crown Victoria / P71",gen:"1998–2011",hp:250,tq:297,tagline:"$2,000 for a V8 RWD sedan that survived being a cop car",budget:"$500–$4k",tax:0,taxNote:"No tax. $1,500-4,000 at police auctions. The cheapest V8 RWD experience in America. Nobody wants these. Perfect.",
    desc:"The Crown Vic P71 (Police Interceptor) is the cheapest V8 RWD car in America. $1,500-4,000 buys one that was maintained by a fleet mechanic. The 4.6L Modular V8 makes 250HP and 297 lb-ft of torque, the chassis is body-on-frame (truck-tough), and the aftermarket is surprisingly deep thanks to the Mustang/F-150 sharing the 4.6L engine family. Panther platform parts interchange across Crown Vic, Grand Marquis, Town Car, and Marauder.",
    why:"$2,000. V8. RWD. Column shifter. Bench seat. What more do you need? The Crown Vic is the budget drift car, the budget sleeper, the budget cruiser, and the budget fun machine. The Panther platform is overbuilt — these things survived being crashed into suspects at 60 MPH, they can handle your mods. The Marauder is the factory hot rod version — 302HP with a special intake manifold.",
    warns:["P71 Police Interceptors have been BEATEN — high idle hours, hard driving, possible crash damage","Check for frame rust on northern cars — the Panther platform rusts at the rear subframe","The 4R75W/4R75E automatic is not strong above 350WHP — it's a rebuild at that point","The 4.6 Modular V8 has plastic intake manifold that cracks and leaks coolant"],
    mistakes:["Buying the cheapest P71 without inspecting it — cheap cop cars are cheap for a reason","Not checking the frame for rust and crash damage — fleet cars get hit","Expecting it to handle like a sports car — it weighs 4,100 lbs and has body roll for days","Spending money on power before fixing the terrible stock suspension — lower it and add sway bars first"],
    mod_order:"1. Inspect + fix any fleet damage → 2. Suspension (lower + sway bars) → 3. Intake manifold swap (PI manifold if not equipped) → 4. Exhaust → 5. Tune → 6. Gears (3.55 or 3.73)",
    buyer_checklist:["Check frame for rust AND crash damage — look underneath carefully","Verify idle hours on the computer — high idle hours = hard life","Check for intake manifold coolant leak (plastic manifold cracks)","Test the transmission — should shift firm and clean","Look at the suspension — blown shocks = bouncy boat","Check for oil leaks at valve covers and oil pan","Verify it runs cool — overheating kills the 4.6 Modular"] },
  {id:"focus_st",make:"ford",name:"Focus ST",gen:"2013–2018",hp:252,tq:270,tagline:"The hot hatch that makes GTI owners nervous",budget:"$1k–$5k",tax:0,taxNote:"No tax. $12-18k for a 252HP turbo hatch with a manual. Ford killed the Focus so prices are stable. Great value.",
    desc:"The Focus ST is Ford's answer to the GTI — 252HP EcoBoost 2.0T, 6-speed manual only, aggressive styling, and a raucous exhaust note. $12-18k buys a clean one. The aftermarket is deep thanks to the shared EcoBoost engine family. Stratified Automotive, COBB, and JST are the tuning platforms. 300WHP is easy and safe. The torque steer is hilarious.",
    why:"The Focus ST does everything the GTI does but louder and with more personality. The EcoBoost 2.0T responds to a tune just as aggressively as the EA888. COBB AP support means Stage 1 = instant power. The community is passionate and the cars are still affordable. The manual-only requirement keeps the enthusiast tax low.",
    warns:["Torque steer is violent — the car pulls hard under boost in 1st and 2nd","The blend door actuator fails on every ST — clicking noise behind the dash","LSPI (Low Speed Pre-Ignition) can damage the engine — don't lug it in high gear at low RPM","Motor mount failure is common — causes clunking under load"],
    mistakes:["Lugging the engine at low RPM under boost — LSPI can crack pistons","Not upgrading the motor mount — stock mount breaks and causes horrible vibration","Running Stage 2 without an intercooler — the stock IC heat-soaks in one pull","Buying a 'Stage 3' ST without verifying the tune was done by a reputable tuner"],
    mod_order:"1. COBB AP Stage 1 → 2. Motor mount → 3. Intercooler → 4. Intake → 5. Downpipe + Stage 2 tune → 6. Exhaust → 7. Suspension",
    buyer_checklist:["Listen for blend door actuator clicking behind dash","Check motor mount (rock engine by hand — clunk = broken)","Look for signs of poor tuning — check engine light, rough idle","Test boost delivery — should be smooth and linear","Check for LSPI damage — pull plugs and look at pistons if high miles","Verify clutch condition — these get launched hard"] },
  {id:"mustang_s197",make:"ford",name:"Mustang S197 (4.6/5.0)",gen:"2005–2014",hp:412,tq:390,tagline:"The Coyote and the 3-valve — American muscle revived",budget:"$1k–$8k",tax:0,taxNote:"No tax. $14-22k for a 5.0 Coyote. The Mustang depreciates normally because they made a million of them. Good for buyers.",
    desc:"The S197 came with two engines that matter: the 4.6L 3-valve (2005-2010, 300HP) and the legendary 5.0 Coyote (2011-2014, 412HP). The 3V responds well to bolt-ons and blower kits. The Coyote is one of the best V8 engines ever made — 412HP NA, 500+ with a blower. Both are RWD, cheap ($12-20k), and have enormous aftermarket support.",
    why:"Nothing beats a V8 Mustang for dollar-per-horsepower. The 5.0 Coyote makes 412HP stock — that's more than a BMW M3 for half the price. The aftermarket is the deepest in the car world. Every bolt-on, every turbo kit, every suspension part exists.",
    warns:["The MT-82 manual transmission on 2011-2014 is notoriously weak — shifts poorly and synchros fail","Live rear axle on 2005-2014 (no IRS) — affects handling but the aftermarket has panhard bars and watts links","The 3V 4.6 has cam phaser issues — listen for rattle on startup","Rear end gear whine is common if diff fluid isn't changed"],
    mistakes:["Sending it out of a car meet — Mustangs have a reputation for a reason. Respect the car.","Not upgrading the MT-82 shifter — the stock shift feel is terrible, a Barton or MGW shifter transforms it","Running a blower on the 3V without upgrading the fuel system — stock injectors max out at ~420WHP","Ignoring the live rear axle — panhard bar and subframe connectors make a huge difference in handling"],
    mod_order:"3V: 1. Tune → 2. Cold air intake → 3. Long tube headers → 4. Exhaust → 5. Suspension → 6. Gears\n5.0: 1. Exhaust → 2. Cold air intake → 3. Tune → 4. Suspension → 5. Gears → 6. Blower (if budget allows)",
    buyer_checklist:["3V: listen for cam phaser rattle on cold start","5.0: check MT-82 shift quality — test all gears","Check for rear end gear whine — drive at highway speed, coast","Inspect for signs of burnout/donut abuse (rear tire wear, axle hop damage)","Check diff fluid — neglected diffs whine","Look for accident history — these get crashed frequently"] },
  {id:"f150",make:"ford",name:"F-150",gen:"2004–2023",hp:400,tq:410,tagline:"America's truck — the best-selling vehicle in history",budget:"$1k–$10k",tax:1,taxNote:"Mild tax. Trucks hold value well in general. Raptors are heavily taxed ($45-65k used). Regular F-150s are fair.",
    desc:"The F-150 is the most popular vehicle in America and the aftermarket reflects it. The 5.0 Coyote V8 (2011+) is the enthusiast pick. The 3.5 EcoBoost V6 (2011+) is the power/towing king — 400HP with a tune. The 5.4 Triton (2004-2010) is the budget option with known cam phaser issues. Lift kits, exhaust, tunes, wheels, bumpers — everything exists for the F-150.",
    why:"The deepest truck aftermarket in existence. Any mod you can think of, someone has done it. The 3.5 EcoBoost responds to tunes aggressively — 400+ HP with a flash. The 5.0 Coyote sounds incredible with a proper exhaust. Even the work truck 5.4 has bolt-on potential.",
    warns:["5.4 Triton: cam phaser failure is nearly universal — listen for startup rattle, budget $2-3k for repair","3.5 EcoBoost: carbon buildup on intake valves (DI engine), timing chain stretch on early models","Aluminum body on 2015+: harder to repair after damage, different body shop techniques","The 10-speed auto on 2017+ can have shift quality issues — TSBs and reflashes exist"],
    mistakes:["Buying a 5.4 Triton without budgeting for cam phasers — it's a when, not if","Lifting without accounting for the added stress on CV joints and ball joints — they wear faster","Running a big tire without regearing — the truck can't move 35\" tires on stock 3.31 gears","Not upgrading the intercooler on tuned EcoBoost — heat soak kills power on hot days"],
    mod_order:"5.0: 1. Exhaust → 2. Cold air intake → 3. Tune → 4. Suspension/lift → 5. Wheels/tires\nEcoBoost: 1. Tune (biggest gains) → 2. Intercooler → 3. Intake → 4. Downpipe → 5. Exhaust → 6. Lift + tires",
    buyer_checklist:["5.4: listen for cam phaser rattle — this is a $2,000+ repair","EcoBoost: check for timing chain stretch (rattling noise)","Check for frame rust on 2004-2014 models","Verify 4WD operation — test low range","Check ball joints and tie rod ends — trucks eat these","Look at the exhaust manifold studs (they snap and leak on all Ford V8s)"] },
  {id:"ranger",make:"ford",name:"Ranger",gen:"2019–2023",hp:270,tq:310,tagline:"The midsize truck Ford brought back",budget:"$1k–$5k",tax:1,taxNote:"Mild tax. $22-32k used. Slightly inflated because Ford just brought it back and demand is high. Will normalize.",
    desc:"Ford brought the Ranger back to the US in 2019 with a 2.3L EcoBoost turbo-4 — the same engine family as the Focus RS and Mustang EcoBoost. 270HP stock with 310 lb-ft of torque. It's a capable midsize truck that responds very well to tuning. The aftermarket is growing fast.",
    why:"The 2.3 EcoBoost in the Ranger responds to a tune the same way the Focus RS does — significant gains. 300+ HP is easy with a tune alone. The truck is lighter than the F-150 and more nimble off-road. The aftermarket is catching up quickly.",
    warns:["The 2.3 EcoBoost has the same carbon buildup concern as all direct injection engines","The 10-speed auto can have shift quality issues — same transmission as F-150","Limited aftermarket compared to Tacoma, but growing fast","Some early models had driveline vibration issues — check for TSBs"],
    mistakes:["Not getting a tune — the 2.3 EcoBoost is heavily detuned from the factory in the Ranger","Cheap leveling kits that affect ride quality — invest in proper bilstein/fox shocks","Ignoring the 10-speed transmission issues — a shift reprogramming from the dealer helps","Running 33\" tires without a regear — the 2.3 turbo has enough torque but the gearing is wrong"],
    mod_order:"1. Tune (biggest gains) → 2. Exhaust → 3. Intake → 4. Intercooler → 5. Leveling/lift kit → 6. Tires",
    buyer_checklist:["Check for driveline vibration — test at highway speed","Verify no active TSBs or recalls","Test 10-speed shift quality — should be smooth","Check for oil leaks at turbo","Inspect for off-road damage — skid plates, frame"] },

  {id:"taurus_sho",make:"ford",name:"Taurus SHO",gen:"2010–2019",hp:365,tq:350,tagline:"365HP twin-turbo in a car your grandma drives — the ultimate dad sleeper",budget:"$1k–$5k",tax:0,taxNote:"No tax. $12-20k for a 365HP AWD sedan. The Taurus nameplate is automotive kryptonite for resale value. Perfect.",
    desc:"The Taurus SHO has a 3.5L twin-turbo EcoBoost V6 making 365HP and 350 lb-ft, AWD, and the face of a car that says 'I'm retired and I drive the speed limit.' But it weighs 4,400 lbs and hits 60 in 5.2 seconds. With a tune it makes 400+ HP. These are $12-20k because nobody wants a Taurus. The EcoBoost aftermarket (shared with F-150) means every tune and bolt-on exists. The Taurus SHO is the dad joke of sleeper cars — nobody laughs until they get gapped.",
    why:"Same 3.5L twin-turbo EcoBoost as the F-150 Raptor. Same tunes work. 365HP AWD for $15k. The car is invisible to absolutely everyone — cops, insurance, other drivers. A tuned SHO making 420HP looks like a rental car and performs like a sports sedan. The seats are comfortable. The trunk is enormous. You can gap a WRX STI on the way to pick up your kids from soccer practice.",
    warns:["The PTU (power transfer unit) is the weak link — it fails if the fluid isn't changed every 30k","Water pump failure is common (same EcoBoost issue as F-150)","The car weighs 4,400 lbs — brakes and tires wear faster","Suspension bushings wear quickly — the car is heavy","Carbon buildup on the DI engine needs walnut blasting"],
    mistakes:["Not changing the PTU fluid — the AWD power transfer unit will fail and cost $2k+ to fix","Ignoring the water pump — same failure pattern as all EcoBoost engines","Expecting sports car handling — it's a 4,400 lb sedan, it handles like a comfortable couch that goes fast","Not getting a tune — the SHO's EcoBoost is begging to be unlocked"],
    mod_order:"1. PTU fluid change (survival) → 2. Tune → 3. Intake → 4. Downpipes → 5. Intercooler → 6. Suspension bushings",
    buyer_checklist:["Ask about PTU fluid history — if never changed, budget $200 for fluid + service","Listen for water pump whining","Check for turbo lag or hesitation — could indicate turbo issues","Look at the brake pads — heavy car eats brakes","Test the AWD — should feel confident in corners","Check for carbon buildup symptoms (rough idle, misfires)"] },

  {id:"lightning",make:"ford",name:"SVT Lightning / Harley F-150",gen:"1999–2004",hp:380,tq:450,tagline:"Supercharged F-150 — America's original fast truck",budget:"$2k–$8k",tax:2,taxNote:"Taxed. Clean Lightnings are $20-35k and climbing. They're becoming collector trucks. The Harley-Davidson F-150 is the budget alternative at $10-18k.",
    desc:"The SVT Lightning has a supercharged 5.4L V8 making 380HP and 450 lb-ft. In 1999, that was insane for a truck. It runs mid-13s in the quarter mile stock. The Eaton M112 supercharger responds to a pulley swap — a smaller pulley = more boost = more power. 450HP is easy. 500+ with supporting mods. The Harley-Davidson F-150 (2002-2003) has a supercharged 5.4L as well but less power. Both are lowered sport trucks that defined the 'fast truck' segment.",
    why:"Supercharged V8 truck from the factory. The Eaton supercharger is bulletproof and responds to pulley swaps dramatically. The Lightning community at SVTPerformance.com has documented every mod. A pulley + tune = 450HP truck for the cost of a pulley and a tuner. These are becoming collectible which makes clean ones expensive, but project trucks still exist.",
    warns:["The 5.4L has spark plug ejection issues — the 2-valve heads are known for this","The supercharger snout bearing wears over time — listen for whining","The IRS (independent rear suspension) is unique to Lightning — replacement parts are specific","These trucks are old now — expect 20+ year old truck problems (rust, electrical, bushings)","The automatic 4R100 transmission is the weak link above 500HP"],
    mistakes:["Over-boosting without upgrading the fuel system — stock injectors max out around 450HP","Not checking for spark plug blowout — the threads pull out of the aluminum heads","Ignoring the supercharger snout bearing — replacement is cheaper than a blown supercharger","Lifting a Lightning — it's a LOWERED sport truck, don't turn it into a regular F-150"],
    mod_order:"1. Check for spark plug thread repair → 2. Pulley swap (2.76\" → 2.5\" or smaller) → 3. Tune → 4. Fuel injectors → 5. Exhaust → 6. Intercooler upgrade",
    buyer_checklist:["Check for spark plug blowout repair (thread inserts in the heads)","Listen for supercharger whine at idle — some whine is normal, grinding is not","Check for rust in cab corners and rocker panels","Verify the IRS components are intact — unique to Lightning","Test the transmission — 4R100 should shift firm and clean","Check the supercharger intercooler — they lose efficiency with age"] },

  // ══════ CHEVY ══════
  {id:"silverado",make:"chevy",name:"Silverado / Sierra 1500",gen:"2007–2023",hp:355,tq:383,tagline:"The LS truck — bulletproof V8, endless mods",budget:"$1k–$10k",tax:1,taxNote:"Mild tax. Trucks hold value. A 6.2L Silverado commands a premium. 5.3L models are more affordable and still make good power.",
    desc:"The Silverado/Sierra 1500 is the GM truck platform. The 5.3 LM7/L83/L84 is the most common engine — reliable, proven, and responds to bolt-ons. The 6.2 L86/L87 is the performance pick — 420HP stock. GM trucks have the advantage of the LS/LT engine family, which is the most supported engine platform in history. Every mod exists.",
    why:"The LS/LT engine family is the most modifiable engine in history. A 5.3 with a cam swap sounds like a drag car and makes 350+ WHP. The 6.2 with a tune makes 440+. Supercharger kits are bolt-on. The aftermarket is bottomless for both performance and off-road builds.",
    warns:["AFM/DFM (Active Fuel Management/Dynamic Fuel Management) causes lifter failure — the most common issue on GM V8s","The 8-speed auto (2014+) and 10-speed (2019+) need proper fluid maintenance","DOD (Displacement on Demand) delete is a common preventive mod","Oil consumption on some 5.3 engines — check oil level carefully"],
    mistakes:["Not doing an AFM/DFM delete — the lifter failure from AFM is a $3-5k repair","Ignoring the cam swap option on the 5.3 — a cam + DOD delete transforms the truck for $1,500","Running a big aggressive tune on an AFM-equipped engine — disable AFM first","Cheap exhaust that drones at highway speed — trucks are heavy and drone is amplified in the cab"],
    mod_order:"5.3: 1. AFM/DFM delete → 2. Exhaust → 3. Cold air intake → 4. Tune → 5. Cam swap (if committed) → 6. Lift/level → 7. Tires\n6.2: 1. Exhaust → 2. Intake → 3. Tune → 4. Lift/level → 5. Tires",
    buyer_checklist:["Listen for lifter tick — AFM lifter failure is extremely common","Check oil level — some 5.3 engines consume oil","Verify AFM/DFM status — has it been deleted?","Check for rust on frame (especially northern trucks)","Test 4WD operation — transfer case and front diff","Look at the exhaust manifold bolts — they snap on every GM V8"] },
  {id:"camaro",make:"chevy",name:"Camaro (5th/6th Gen)",gen:"2010–2023",hp:455,tq:455,tagline:"LS and LT power in a proper sports car",budget:"$1k–$8k",tax:0,taxNote:"No tax. $18-28k for an SS. Camaros depreciate because visibility is terrible and insurance is expensive. Buyer's market.",
    desc:"The 5th gen (2010-2015) brought the Camaro back with LS3/L99 V8 power. The 6th gen (2016-2023) improved everything with the LT1 making 455HP. The SS models with the 6.2 V8 are the ones to buy — they're absolute weapons on the street and track. The 2.0T and 3.6 V6 models exist but the V8 is the Camaro experience.",
    why:"The LT1/LS3 V8 Camaro is the best performance-per-dollar car in America. 455HP, magnetic ride control (on SS 1LE), and Brembo brakes for $30-35k used. The aftermarket is deep — headers, cam, intake, blower kits. A simple tune makes 480+HP.",
    warns:["Visibility is terrible — the car has massive blind spots","The automatic (A10) is faster but the manual (T-6060/TR-6060) is the enthusiast choice","5th gen interior quality is poor — the 6th gen fixed this","Insurance is expensive for V8 Camaros, especially for younger drivers"],
    mistakes:["Buying the V6 or 2.0T thinking you'll swap to V8 — just buy the V8","Not getting the 1LE package on the SS — it's a massive performance upgrade","Running long tube headers without a tune — the LS/LT will throw codes","Ignoring the differential fluid — GM V8s put a lot of stress on the rear end"],
    mod_order:"1. Exhaust (biggest sound change) → 2. Cold air intake → 3. Tune → 4. Suspension → 5. Headers (retune required) → 6. Cam swap (if committed) → 7. Blower (endgame)",
    buyer_checklist:["Check for signs of burnout/donut abuse — rear tire wear, axle hop damage","Verify 1LE package if claimed — magnetic ride, Brembo brakes, cooling package","Listen for lifter tick on V8 models","Check clutch engagement on manual (people launch these hard)","Inspect for body damage — Camaros get curbed and scraped due to low visibility"] },
  {id:"c10",make:"chevy",name:"C10 / Classic Truck",gen:"1960–1987",hp:250,tq:300,tagline:"The classic truck — LS swaps and patina builds",budget:"$2k–$15k",tax:2,taxNote:"Taxed. The patina/restomod trend pushed C10 prices up. Clean squarebodies are $15-25k+. Rusty projects still $3-8k. Blame Mecum auctions.",
    desc:"The C10 (and C/K series) is the most popular classic truck platform in America. The original inline-6 and small-block V8 are charming but limited. The REAL C10 scene is about LS swaps — dropping a modern fuel-injected LS V8 into a classic body. 400+ HP, modern drivability, classic looks. The patina/restomod scene is booming.",
    why:"The C10 is a blank canvas. LS swap kits are bolt-in from multiple manufacturers. The truck can be anything — show truck, daily driver, drag truck, autocross truck. The community is enormous and the knowledge base is deep. Plus, classic trucks have an aesthetic that modern trucks can't match.",
    warns:["RUST. These trucks are 40-60 years old. Rust repair is the #1 cost.","The original manual brakes are terrifying — budget for a disc brake conversion","Floor pans, cab corners, and rockers are the first things to rot","LS swap seems simple but the wiring and plumbing take longer than expected"],
    mistakes:["Underestimating the rust repair — a $3,000 truck can need $5,000 in rust work","Not doing a disc brake conversion before driving — original drum brakes can't stop the truck safely","Cheap LS swap mounts that don't position the engine correctly — get motor mount kit from a reputable manufacturer","Trying to keep the original 3-speed manual with an LS — the LS needs a modern transmission (T56, 4L60E, or 4L80E)"],
    mod_order:"1. Fix ALL rust → 2. Disc brake conversion → 3. LS swap + transmission → 4. Wiring harness → 5. Cooling system → 6. Suspension (drop or lift) → 7. Wheels/tires → 8. Interior",
    buyer_checklist:["Check cab corners, rockers, and floor pans for rust — poke everything with a screwdriver","Check the frame — is it solid or rotted?","Verify the engine — original or already swapped?","Check the bed floor — rusty bed floors are expensive to replace","Inspect the glass — windshield and rear window condition","Look at the brakes — are they drums or has someone already done discs?","Check the wiring — old truck wiring is often a disaster"] },
  {id:"cobalt_ss",make:"chevy",name:"Cobalt SS / Ion Redline",gen:"2005–2010",hp:260,tq:260,tagline:"The turbo GM everyone forgot — 260HP for under $10k",budget:"$1k–$5k",tax:0,taxNote:"No tax. $6-12k and nobody remembers these exist. GM killed the brand and the car disappeared from memory. Best value turbo car in America.",
    desc:"The Cobalt SS Turbo (2008-2010) makes 260HP from a 2.0L Ecotec turbo — in a car that weighs 3,000 lbs. The supercharged version (2005-2007) makes 205HP. The Saturn Ion Redline shares the supercharged drivetrain. These cars held the Nürburgring FWD record and are now $6-12k because GM killed both brands. The turbo community uses HPTuners and makes 300+ WHP on stock internals.",
    why:"260HP turbo FWD coupe for under $10k. The Ecotec 2.0T responds to tuning aggressively — 300WHP on stock internals with intake + downpipe + tune. The car held the FWD Nürburgring record. Nobody remembers it exists, which means prices are low and insurance is cheap. The SS Turbo is genuinely one of the best-kept secrets in affordable performance.",
    warns:["The turbo (LNF engine, 2008-2010) is the one you want — not the supercharged (LSJ, 2005-2007)","The LNF has direct injection — carbon buildup requires walnut blasting","These cars are getting hard to find clean — GM stopped making them in 2010","Interior quality is very GM — rattles, cheap plastic, mediocre seats"],
    mistakes:["Buying the supercharged version thinking it's the turbo — the SC makes 55HP less","Not doing carbon cleaning on the LNF — DI engine needs walnut blasting every 50k","Running high boost without upgrading the stock clutch — slips at 280WHP","Ignoring the PCV system — it clogs and causes boost leaks"],
    mod_order:"1. HPTuners tune → 2. Intake → 3. Downpipe → 4. Intercooler → 5. Clutch (if manual) → 6. Suspension",
    buyer_checklist:["Verify TURBO (LNF engine 2008-2010) not supercharged (LSJ 2005-2007)","Check for carbon buildup symptoms — rough idle, misfires","Listen for turbo noises — whine or grinding = bearing failure","Check clutch engagement on manual — these get launched","Look for rust in rocker panels — GM cars rust","Test all electronics — GM interior quality is poor"] },
  {id:"g8_gt",make:"chevy",name:"Pontiac G8 GT / Chevy SS",gen:"2008–2017",hp:415,tq:415,tagline:"LS V8 in a sedan — the stealth muscle car GM accidentally made perfect",budget:"$1k–$8k",tax:2,taxNote:"Taxed. G8 GT is $16-24k and rising. GXP manual is $28-40k. Chevy SS is $35-50k. Pontiac died and now everyone wants what they can't have.",
    desc:"The Pontiac G8 GT has an LS3 V8 making 361HP in a full-size sedan. The Chevy SS (2014-2017) is its spiritual successor with the LS3 making 415HP. Both are rear-wheel drive, V8 powered, and look completely anonymous. The G8 GXP has the LS3 + 6-speed manual — it's the holy grail. These are Australian-built Holden Commodores rebadged for America. $15-25k for a G8 GT, $30-45k for a Chevy SS.",
    why:"LS V8 + sedan body + RWD = the ultimate muscle sedan. The G8 GT looks like a rental car but makes Mustang GT power. The Chevy SS with the 6-speed manual is the last great American sport sedan. Both share the LS aftermarket — cams, headers, intake, tune. A tuned G8 GXP makes 400+ WHP and nobody sees it coming.",
    warns:["Pontiac is dead — parts availability is declining for body panels","The Chevy SS is appreciating — they only made 12,000 total","The 6-speed auto in the G8 GT (6L80) is strong but the torque converter can shudder","The G8 GXP with manual is extremely rare — maybe 1,800 made"],
    mistakes:["Buying a G8 V6 thinking you'll swap to V8 — just buy the GT","Not respecting the rear end — these are heavy rear-drive cars that can rotate unexpectedly","Modding a Chevy SS aggressively — they're becoming collector cars, keep it tasteful","Ignoring the DOD/AFM system on the LS3 — delete it proactively"],
    mod_order:"1. Exhaust (wake up the LS) → 2. Intake → 3. Tune → 4. Suspension (lower 1\") → 5. Cam swap (if committed) → 6. Look like a rental, drive like a race car",
    buyer_checklist:["G8: verify GT (V8) not base (V6)","Check for DOD/AFM lifter tick","Look for rust underneath — these are getting old enough to rust","Test the transmission — 6L80 auto should shift clean","Check for oil consumption on the LS3","Chevy SS: verify the manual if that's what you want — most are auto"] },

  {id:"tbss",make:"chevy",name:"Trailblazer SS",gen:"2006–2009",hp:395,tq:400,tagline:"LS2 V8 in an SUV — 395HP and nobody suspects the mom-mobile",budget:"$1k–$6k",tax:1,taxNote:"Mild tax. $12-20k and rising slowly. People are starting to notice the LS2 SUV. Buy before they figure it out.",
    desc:"GM put the LS2 6.0L V8 (same as the GTO and Corvette C6) into a midsize SUV and called it the Trailblazer SS. 395HP, 400 lb-ft, rear-wheel drive (AWD available), and it looks like a rental car for suburban families. A cam swap + tune makes 450+ HP. These are $12-20k and completely under the radar. The LS2 shares the entire LS aftermarket — every cam, every header, every tune. It's an LS V8 in a truck body that nobody suspects.",
    why:"LS2 V8. In an SUV. For $15k. The LS aftermarket means infinite mod potential. Cam + exhaust + tune = 450HP SUV that sounds like a drag car at idle but looks like it should be in a school pickup line. The TBSS community at TrailVoy.com has documented the cam swap, headers, and forced induction. Some of these make 600+ HP.",
    warns:["AFM/DOD on some examples — same lifter failure issue as Silverado","The 4-speed 4L60E automatic is the weak link above 450HP","Fuel economy is terrible (12-15 MPG) and gets worse with mods","The AWD transfer case needs fluid changes","Brake dust on the big brakes is excessive — budget for frequent pad changes"],
    mistakes:["Not doing the AFM/DOD delete if equipped","Pushing past 450HP without upgrading the 4L60E — it will grenade","Expecting fuel economy from a 6.0L V8 SUV — you won't get it","Not checking the rear diff fluid — big V8 torque eats diff fluid"],
    mod_order:"1. AFM delete (if equipped) → 2. Exhaust → 3. Intake → 4. Cam swap + tune → 5. Transmission build (if going big power) → 6. Look like a mom-mobile, drive like a race truck",
    buyer_checklist:["Listen for AFM lifter tick","Check oil consumption","Test the transmission — should shift clean and firm","Verify RWD vs AWD — RWD is lighter and simpler","Check for rust underneath — these are getting old enough to rot","Look for signs of cam swap (lopey idle = already cammed)"] },

  {id:"colorado_zr2",make:"chevy",name:"Colorado ZR2 / Canyon AT4",gen:"2017–2023",hp:308,tq:275,tagline:"Factory off-road midsize with DSSV dampers — Tacoma's nightmare",budget:"$1k–$6k",tax:1,taxNote:"Mild tax. ZR2 models $28-38k used. Regular Colorados much cheaper at $18-28k. The ZR2 commands a premium for the DSSV suspension.",
    desc:"The Colorado ZR2 is GM's answer to the Tacoma TRD Pro — but with better suspension. The DSSV (Dynamic Suspensions Spool Valve) dampers from Multimatic are the same technology used in the C8 Corvette and various race cars. The 3.6L V6 makes 308HP (2023+), the 2.8L Duramax diesel makes 369 lb-ft of torque (2017-2022). The ZR2 has front and rear locking diffs, rocker panel protection, and cast-iron control arms. The aftermarket is growing fast.",
    why:"The DSSV suspension is the ZR2's secret weapon — it rides better than any Tacoma on-road and performs better off-road. The diesel option provides insane torque for crawling. The aftermarket is catching up to Toyota quickly. And the Colorado is smaller/lighter than a full-size truck, which matters on tight trails.",
    warns:["The V6 requires premium fuel for best performance","The 8-speed auto can have shift quality issues — TSBs exist","Diesel models need DEF fluid and DPF maintenance","The DSSV dampers are expensive to replace if they fail ($500+ each)","Aftermarket isn't as deep as Tacoma yet but growing"],
    mistakes:["Replacing the DSSV dampers with cheap shocks — you're removing the best feature of the truck","Not using premium fuel in the V6 — it knocks and loses power on regular","Ignoring the diesel emissions system maintenance — DPF clog = expensive repair","Lifting a ZR2 aggressively — it's already optimized from the factory, mild is better"],
    mod_order:"1. Tires (biggest off-road improvement) → 2. Skid plates → 3. Bumpers → 4. Lighting → 5. Mild lift/level (if needed) → 6. Tune (V6)",
    buyer_checklist:["Check DSSV damper operation — the ride should be magic, if it's harsh they may be blown","Diesel: check DPF system health, look for DEF warnings","Test 4WD and diff lockers — both should engage cleanly","Check for TSBs on the transmission","Look at the transfer case fluid condition","Verify it's the ZR2, not a regular Z71 with accessories"] },

  {id:"s10",make:"chevy",name:"S-10 / Sonoma",gen:"1994–2004",hp:190,tq:250,tagline:"The mini truck that becomes an LS monster — America's C10 Jr.",budget:"$500–$4k",tax:0,taxNote:"No tax. $2-6k for a clean S-10. Nobody cares about these trucks. The LS swap community does though.",
    desc:"The S-10 is the mini truck that GM made for 20 years. Stock, they're basic — the 4.3L V6 makes 190HP and gets the job done. But the S-10's real purpose is as an LS swap platform. The engine bay fits an LS V8 with bolt-in swap kits from multiple companies. A junkyard 5.3 LS in an S-10 makes 300HP in a truck that weighs 3,200 lbs — it's a rocket. The lowered S-10 LS swap is a modern interpretation of the mini truck scene. The lifted S-10 with an LS is a budget Baja truck.",
    why:"$2-5k for the truck. $1,500-2,000 for a complete LS swap drivetrain from a junkyard. Bolt-in swap kits exist. The result is a 300HP mini truck that weighs nothing. The S-10 LS swap is the budget builder's dream. The drag strip, the mini truck show, the daily commute — it does everything.",
    warns:["Rust is the enemy — S-10 frames rot, especially in the north","The stock 4.3L V6 is reliable but boring — most people swap it","The 4L60E auto transmission is shared with everything GM — parts are cheap but it's weak above 400HP","Frame flex on lowered S-10s can be an issue — subframe connectors help","The interior is basic 90s GM — cheap plastic everywhere"],
    mistakes:["Buying a rusty S-10 frame — frame repair costs more than the truck","Trying to make the 4.3L V6 fast — just LS swap it","Not doing subframe connectors on a lowered build — the unibody/body-on-frame flex is noticeable","Cheap LS swap mounts — get the bolt-in kit from a reputable company (S10V8.com, LS1Truck.com)"],
    mod_order:"Stock 4.3: 1. Exhaust → 2. Intake → 3. Accept its limits\nLS Swap: 1. Fix frame/rust → 2. LS + trans swap → 3. Wiring → 4. Cooling → 5. Exhaust → 6. Suspension → 7. Enjoy",
    buyer_checklist:["Check the frame for rust — this is the #1 deal breaker","Look at the cab corners and rocker panels","If stock 4.3: check for intake manifold gasket leak (very common)","If already LS swapped: inspect the swap quality — mounts, wiring, cooling","Check the transmission — 4L60E should shift clean","Look at the bed floor — S-10 beds rust from the inside out"] },

  // ══════ VOLKSWAGEN ══════
  {id:"mk6_gti",make:"vw",name:"GTI MK6",gen:"2010–2014",hp:200,tq:207,tagline:"The original hot hatch — perfected",budget:"$1k–$5k",tax:0,taxNote:"No tax. $10-16k for a MK6 GTI. Fair price. The timing chain tensioner scare keeps prices honest.",
    desc:"The MK6 GTI with the EA888 Gen 1/2 2.0T is one of the best hot hatches ever made. 200HP stock, 280+ with a tune. The DSG dual-clutch is lightning fast, the manual is satisfying. These are $10-16k now and the aftermarket is deep thanks to APR, Unitronic, and IE. The GTI community is one of the most active in the car world.",
    why:"The 2.0T EA888 responds to tunes better than almost any other engine — a $600 flash tune adds 80HP. That's N54 335i levels of tune response in a $12k hatchback. The DSG tune is the secret weapon — it makes the dual-clutch even faster. The handling is already excellent from the factory.",
    warns:["Timing chain tensioner failure on early EA888 (Gen 1, 2008-2012) — can destroy engine","Water pump failure is common ~60k miles","PCV valve failure causes rough idle and boost leaks","Carbon buildup on intake valves (DI engine) — needs walnut blasting every 40-60k"],
    mistakes:["Not checking the timing chain tensioner revision — early revision fails and the engine jumps timing","Running a tune without addressing carbon buildup — dirty valves limit airflow and power","Ignoring the water pump until it fails — replace preventively at 60k","Buying a DSG without understanding it needs fluid service every 40k miles"],
    mod_order:"1. Stage 1 tune (APR, Unitronic, or IE) → 2. DSG tune (if applicable) → 3. Intake → 4. Downpipe + Stage 2 tune → 5. Intercooler → 6. Suspension",
    buyer_checklist:["Check timing chain tensioner revision — updated revision has hex bolt head","Listen for timing chain rattle on cold start","Check for water pump leaks (coolant under car)","Ask about carbon cleaning history","DSG: ask about fluid service interval","Check for PCV valve issues (rough idle, boost leaks)"] },
  {id:"mk7_gti",make:"vw",name:"GTI / Golf R MK7",gen:"2015–2021",hp:228,tq:258,tagline:"The daily driver that embarrasses sports cars",budget:"$1k–$6k",tax:1,taxNote:"Mild tax. $18-26k for GTI, $28-38k for Golf R. The R commands a premium but the GTI is still fairly priced.",
    desc:"The MK7 GTI is the refinement of everything VW learned. The EA888 Gen 3 is more reliable than Gen 1/2, makes 228HP stock (245 in the 7.5), and 300+ with a tune. The Golf R shares the platform with AWD and 288HP stock — 380+ with a tune. The MK7 is widely considered the best all-around enthusiast car under $30k.",
    why:"The EA888 Gen 3 is the sweet spot — reliable enough to daily, tuneable enough to be exciting. Stage 1 tune = 300HP. Stage 2 with downpipe = 350HP. The IS20 turbo (GTI) tops out around 340HP, the IS38 turbo (Golf R) handles 400+. The community and tuner support is world-class.",
    warns:["Carbon buildup still occurs on Gen 3 — walnut blasting needed every 50-60k","The IS20 turbo on GTI maxes out around 340WHP — IS38 swap from Golf R is the upgrade path","Water pump failure still happens but less common than MK6","Sunroof drains clog and leak into the cabin — check headliner for moisture"],
    mistakes:["Running Stage 2 without upgrading the clutch on manual cars — stock clutch slips at ~320WHP","Not doing a DSG tune with the engine tune — the DSG can handle more torque but needs the software to match","Buying a GTI and immediately wanting Golf R power — consider just buying the R","Ignoring the carbon buildup — it slowly robs power and causes misfires"],
    mod_order:"GTI: 1. Stage 1 tune → 2. DSG tune (if equipped) → 3. Intake → 4. Downpipe + Stage 2 → 5. Intercooler → 6. IS38 turbo swap (endgame)\nGolf R: 1. Stage 1 tune + TCU tune → 2. Intake → 3. Downpipe + Stage 2 → 4. Intercooler → 5. Big turbo (endgame)",
    buyer_checklist:["Ask about carbon cleaning history — check for misfire codes","Check for water pump leaks","DSG: verify fluid service has been done","Check sunroof drains — look for water stains on headliner","Test the Haldex AWD on Golf R — should engage in corners","Listen for turbo noises — whining or grinding = bearing failure"] },
  {id:"jetta_gli",make:"vw",name:"Jetta GLI",gen:"2006–2021",hp:228,tq:258,tagline:"The GTI in a suit — same engine, sedan body, zero hype tax",budget:"$1k–$5k",tax:0,taxNote:"No tax. $8-16k for a MK6/MK7 GLI. Always cheaper than the equivalent GTI because sedan = less cool. Same engine though.",
    desc:"The Jetta GLI has the same EA888 2.0T as the GTI, the same tune support, and the same aftermarket — but in a sedan body that nobody cares about. The GLI is always $2-4k cheaper than the equivalent GTI because the hatchback tax is real. MK6 GLI (2012-2014) and MK7 GLI (2019-2021) are the ones to buy. Everything that works on the GTI works on the GLI — APR, Unitronic, IE, COBB. Same engine, same results, less money.",
    why:"It's literally a GTI with a trunk instead of a hatch. Same EA888. Same DSG option. Same tune potential. Same 300HP with Stage 1. But it costs $2-4k less because the car community decided sedans aren't cool. If you care about driving experience over Instagram clout, the GLI is the smart money play.",
    warns:["Same EA888 issues as GTI — timing chain tensioner (MK6), water pump, carbon buildup","The MK6 GLI (2012-2014) has the same timing chain tensioner risk as the MK6 GTI — check revision","Not all GLIs have the performance pack — verify LSD and bigger brakes if that matters to you","Some GLIs are auto-only (no DSG, no manual) — check carefully"],
    mistakes:["Same mistakes as GTI — timing chain tensioner, carbon buildup, water pump","Buying a GLI without the performance pack thinking it's the same — the perf pack adds LSD and bigger brakes","Not getting the DSG tune with the engine tune — same as GTI, both tunes together transform the car","Telling GTI owners your GLI is 'just as fast' — they'll argue forever even though you're right"],
    mod_order:"Same as GTI — Stage 1 tune → DSG tune → intake → downpipe + Stage 2 → intercooler",
    buyer_checklist:["Same as GTI — check timing chain tensioner revision on MK6","Verify manual, DSG, or regular auto — big difference","Check for performance pack (LSD, bigger brakes)","Same carbon buildup concerns as GTI","Check water pump for leaks"] },
  {id:"golf_r32",make:"vw",name:"Golf R32 / MK5 R32",gen:"2004 / 2008",hp:250,tq:236,tagline:"VR6 AWD — the sound of God gargling gravel",budget:"$1k–$5k",tax:2,taxNote:"Taxed. MK4 R32 is $15-25k. MK5 R32 is $12-20k. The VR6 sound tax is real — people pay extra just for the exhaust note.",
    desc:"The R32 has the 3.2L VR6 — a narrow-angle V6 that makes the most intoxicating exhaust note in the VW world. 250HP, AWD (Haldex), and a sound that makes grown adults weep. The MK4 R32 (2004) is the rare one — only 5,000 made for the US. The MK5 R32 (2008) is slightly more common. Both have the DSG or 6-speed manual. The VR6 is NOT the EA888 turbo — it's naturally aspirated and makes power through displacement and revs. The aftermarket is different from GTI — VR6-specific headers, intakes, and exhaust.",
    why:"The VR6 sound. That's it. That's the reason. The 3.2L VR6 through a proper exhaust is one of the greatest sounds in automotive history. It's like an Audi RS engine in a VW body. AWD gives you year-round usability. The car is a grand tourer that happens to be fast. If you care about driving experience and sound over numbers on a dyno sheet, the R32 is your car.",
    warns:["The VR6 is NOT tunable like the EA888 — there's no 'flash tune for 80HP' magic here","Timing chains (not belt) stretch on high-mileage VR6 — expensive repair","The Haldex AWD system needs fluid changes every 20k miles","DSG fluid service every 40k — same as GTI","These are appreciating — don't hack up a clean one"],
    mistakes:["Expecting EA888 tune gains — the VR6 is naturally aspirated, bolt-ons add 15-20HP not 80","Not changing the Haldex fluid — the AWD system dies silently","Ignoring timing chain stretch on high-mileage examples — listen for rattle","Straight-piping it thinking it'll sound better — the R32 needs SOME muffler to sound its best, straight pipe makes it raspy"],
    mod_order:"1. Haldex fluid change → 2. Exhaust (unlock the VR6 sound) → 3. Intake → 4. Suspension → 5. DSG tune (if equipped) → 6. Accept that the VR6 isn't about numbers, it's about soul",
    buyer_checklist:["Listen to the exhaust cold start — the VR6 should sound deep and smooth","Check Haldex fluid history — if never changed, budget for service","Listen for timing chain rattle at startup","Verify DSG or manual — both are good but different","Check for rust in the wheel wells — VW aren't immune","MK4 R32: verify it's real (#/5,000 plaque inside)"] },
];

const VEHICLES = [
  // EG — more years and trims
  {id:"eg1",plat:"eg",year:1992,trim:"Si",engine:"D16Z6 1.6L VTEC"},{id:"eg2",plat:"eg",year:1993,trim:"Si",engine:"D16Z6 1.6L VTEC"},{id:"eg3",plat:"eg",year:1994,trim:"Si",engine:"D16Z6 VTEC"},
  {id:"eg4",plat:"eg",year:1995,trim:"EX",engine:"D16Z6 VTEC"},{id:"eg5",plat:"eg",year:1993,trim:"DX Hatch",engine:"D15B7 1.5L"},{id:"eg6",plat:"eg",year:1994,trim:"CX Hatch",engine:"D15B8 1.5L"},
  {id:"eg7",plat:"eg",year:1995,trim:"VX",engine:"D15Z1 1.5L VTEC-E"},
  // EK — more years and trims
  {id:"ek1",plat:"ek",year:1996,trim:"EX Coupe",engine:"D16Y8 VTEC"},{id:"ek2",plat:"ek",year:1997,trim:"EX",engine:"D16Y8 VTEC"},{id:"ek3",plat:"ek",year:1998,trim:"EX",engine:"D16Y8 VTEC"},
  {id:"ek4",plat:"ek",year:1999,trim:"Si (EM1)",engine:"B16A2 1.6L VTEC"},{id:"ek5",plat:"ek",year:2000,trim:"Si (EM1)",engine:"B16A2 VTEC"},
  {id:"ek6",plat:"ek",year:1996,trim:"DX Hatch",engine:"D16Y7 1.6L"},{id:"ek7",plat:"ek",year:1998,trim:"HX",engine:"D16Y5 VTEC-E"},
  // Integra DC2
  {id:"dc2_1",plat:"dc2",year:1994,trim:"LS",engine:"B18B1 1.8L"},{id:"dc2_2",plat:"dc2",year:1996,trim:"GS-R",engine:"B18C1 1.8L VTEC"},
  {id:"dc2_3",plat:"dc2",year:1998,trim:"GS-R",engine:"B18C1 1.8L VTEC"},{id:"dc2_4",plat:"dc2",year:1997,trim:"Type R",engine:"B18C5 1.8L VTEC"},
  {id:"dc2_5",plat:"dc2",year:2000,trim:"LS",engine:"B18B1 1.8L"},{id:"dc2_6",plat:"dc2",year:2001,trim:"GS-R",engine:"B18C1 1.8L VTEC"},
  // Prelude 5th Gen
  {id:"pre1",plat:"prelude",year:1997,trim:"Base",engine:"H22A4 2.2L VTEC"},{id:"pre2",plat:"prelude",year:1998,trim:"SH (ATTS)",engine:"H22A4 2.2L VTEC"},
  {id:"pre3",plat:"prelude",year:1999,trim:"SH (ATTS)",engine:"H22A4 2.2L VTEC"},{id:"pre4",plat:"prelude",year:2001,trim:"Base",engine:"H22A4 2.2L VTEC"},
  {id:"pre5",plat:"prelude",year:2000,trim:"SH (ATTS)",engine:"H22A4 2.2L VTEC"},
  // S2000
  {id:"s2k1",plat:"s2k",year:2000,trim:"AP1",engine:"F20C 2.0L VTEC"},{id:"s2k2",plat:"s2k",year:2002,trim:"AP1",engine:"F20C 2.0L VTEC"},
  {id:"s2k3",plat:"s2k",year:2004,trim:"AP2",engine:"F22C1 2.2L VTEC"},{id:"s2k4",plat:"s2k",year:2006,trim:"AP2",engine:"F22C1 2.2L VTEC"},
  {id:"s2k5",plat:"s2k",year:2008,trim:"AP2 CR",engine:"F22C1 2.2L VTEC"},{id:"s2k6",plat:"s2k",year:2009,trim:"AP2 (Final Year)",engine:"F22C1 2.2L VTEC"},
  // Accord 2.0T
  {id:"acc1",plat:"accord2t",year:2018,trim:"Sport 2.0T 6MT",engine:"K20C4 2.0T"},{id:"acc2",plat:"accord2t",year:2019,trim:"Sport 2.0T 6MT",engine:"K20C4 2.0T"},
  {id:"acc3",plat:"accord2t",year:2020,trim:"Sport 2.0T 10AT",engine:"K20C4 2.0T"},{id:"acc4",plat:"accord2t",year:2021,trim:"Touring 2.0T",engine:"K20C4 2.0T"},
  {id:"acc5",plat:"accord2t",year:2022,trim:"Sport 2.0T 6MT",engine:"K20C4 2.0T"},
  // E30
  {id:"e30_1",plat:"e30",year:1987,trim:"325i",engine:"M20B25 2.5L I6"},{id:"e30_2",plat:"e30",year:1988,trim:"325is",engine:"M20B25 2.5L I6"},
  {id:"e30_3",plat:"e30",year:1990,trim:"325i",engine:"M20B25 2.5L I6"},{id:"e30_4",plat:"e30",year:1991,trim:"318is",engine:"M42B18 1.8L"},
  {id:"e30_5",plat:"e30",year:1988,trim:"M3",engine:"S14B23 2.3L"},{id:"e30_6",plat:"e30",year:1991,trim:"325i Convertible",engine:"M20B25 2.5L I6"},
  // 135i / 1M
  {id:"e82_1",plat:"e82",year:2008,trim:"135i (N54)",engine:"N54 3.0L TT"},{id:"e82_2",plat:"e82",year:2010,trim:"135i (N54)",engine:"N54 3.0L TT"},
  {id:"e82_3",plat:"e82",year:2011,trim:"135i (N55)",engine:"N55 3.0T"},{id:"e82_4",plat:"e82",year:2011,trim:"1M Coupe",engine:"N54 3.0L TT"},
  {id:"e82_5",plat:"e82",year:2013,trim:"135is (N54)",engine:"N54 3.0L TT"},
  // BRZ / FR-S / 86
  {id:"brz1",plat:"brz",year:2013,trim:"BRZ Limited",engine:"FA20 2.0L"},{id:"brz2",plat:"brz",year:2015,trim:"FR-S",engine:"FA20 2.0L"},
  {id:"brz3",plat:"brz",year:2017,trim:"86",engine:"FA20 2.0L"},{id:"brz4",plat:"brz",year:2019,trim:"BRZ tS",engine:"FA20 2.0L"},
  {id:"brz5",plat:"brz",year:2020,trim:"BRZ Limited",engine:"FA20 2.0L"},{id:"brz6",plat:"brz",year:2016,trim:"FR-S Release Series",engine:"FA20 2.0L"},
  // Legacy GT
  {id:"lgt1",plat:"lgt",year:2005,trim:"GT Limited",engine:"EJ255 2.5T"},{id:"lgt2",plat:"lgt",year:2006,trim:"GT",engine:"EJ255 2.5T"},
  {id:"lgt3",plat:"lgt",year:2007,trim:"GT spec.B",engine:"EJ255 2.5T"},{id:"lgt4",plat:"lgt",year:2008,trim:"GT",engine:"EJ255 2.5T"},
  {id:"lgt5",plat:"lgt",year:2009,trim:"GT",engine:"EJ255 2.5T"},
  // 8th gen — more years
  {id:"8g1",plat:"8g",year:2006,trim:"Si Sedan (FA5)",engine:"K20Z3 2.0L"},{id:"8g2",plat:"8g",year:2007,trim:"Si Sedan (FA5)",engine:"K20Z3 2.0L"},
  {id:"8g3",plat:"8g",year:2008,trim:"Si Sedan (FA5)",engine:"K20Z3 2.0L"},{id:"8g4",plat:"8g",year:2009,trim:"Si Coupe (FG2)",engine:"K20Z3 2.0L"},
  {id:"8g5",plat:"8g",year:2010,trim:"Si Coupe (FG2)",engine:"K20Z3 2.0L"},{id:"8g6",plat:"8g",year:2011,trim:"Si Sedan (FA5)",engine:"K20Z3 2.0L"},
  // 9th gen — more years
  {id:"9g1",plat:"9g",year:2012,trim:"Si Sedan",engine:"K24Z7 2.4L"},{id:"9g2",plat:"9g",year:2013,trim:"Si Sedan",engine:"K24Z7 2.4L"},
  {id:"9g3",plat:"9g",year:2014,trim:"Si Coupe",engine:"K24Z7 2.4L"},{id:"9g4",plat:"9g",year:2015,trim:"Si Sedan",engine:"K24Z7 2.4L"},
  // 10th gen — every year + Type R
  {id:"10g1",plat:"10g",year:2016,trim:"Si",engine:"L15B7 1.5T"},{id:"10g2",plat:"10g",year:2017,trim:"Si",engine:"L15B7 1.5T"},
  {id:"10g3",plat:"10g",year:2018,trim:"Si",engine:"L15B7 1.5T"},{id:"10g4",plat:"10g",year:2019,trim:"Si",engine:"L15B7 1.5T"},
  {id:"10g5",plat:"10g",year:2020,trim:"Si",engine:"L15B7 1.5T"},{id:"10g6",plat:"10g",year:2017,trim:"Sport Hatch",engine:"L15B7 1.5T"},
  {id:"10g7",plat:"10g",year:2018,trim:"Type R (FK8)",engine:"K20C1 2.0T"},{id:"10g8",plat:"10g",year:2019,trim:"Type R (FK8)",engine:"K20C1 2.0T"},
  {id:"10g9",plat:"10g",year:2020,trim:"Type R (FK8)",engine:"K20C1 2.0T"},{id:"10g10",plat:"10g",year:2021,trim:"Type R LE",engine:"K20C1 2.0T"},
  // E36 — more trims and years
  {id:"e36_1",plat:"e36",year:1992,trim:"325i",engine:"M50B25 2.5L I6"},{id:"e36_2",plat:"e36",year:1993,trim:"325is",engine:"M50B25 2.5L I6"},
  {id:"e36_3",plat:"e36",year:1995,trim:"325i",engine:"M50B25 2.5L I6"},{id:"e36_4",plat:"e36",year:1996,trim:"328i",engine:"M52B28 2.8L I6"},
  {id:"e36_5",plat:"e36",year:1997,trim:"328i",engine:"M52B28 2.8L I6"},{id:"e36_6",plat:"e36",year:1998,trim:"328is",engine:"M52B28 2.8L I6"},
  {id:"e36_7",plat:"e36",year:1995,trim:"M3",engine:"S50B30 3.0L I6"},{id:"e36_8",plat:"e36",year:1997,trim:"M3",engine:"S52B32 3.2L I6"},
  {id:"e36_9",plat:"e36",year:1998,trim:"M3",engine:"S52B32 3.2L I6"},
  // E46 — more trims and years
  {id:"e46_1",plat:"e46",year:1999,trim:"328i",engine:"M52TUB28 2.8L I6"},{id:"e46_2",plat:"e46",year:2000,trim:"323i",engine:"M52TUB25 2.5L I6"},
  {id:"e46_3",plat:"e46",year:2001,trim:"330i",engine:"M54B30 3.0L I6"},{id:"e46_4",plat:"e46",year:2002,trim:"330i",engine:"M54B30 3.0L I6"},
  {id:"e46_5",plat:"e46",year:2003,trim:"330i",engine:"M54B30 3.0L I6"},{id:"e46_6",plat:"e46",year:2004,trim:"330i ZHP",engine:"M54B30 3.0L I6"},
  {id:"e46_7",plat:"e46",year:2005,trim:"325i",engine:"M54B25 2.5L I6"},{id:"e46_8",plat:"e46",year:2002,trim:"M3",engine:"S54B32 3.2L I6"},
  {id:"e46_9",plat:"e46",year:2004,trim:"M3",engine:"S54B32 3.2L I6"},{id:"e46_10",plat:"e46",year:2005,trim:"M3 (Comp Pkg)",engine:"S54B32 3.2L I6"},
  // E9X — more trims and years
  {id:"e9x1",plat:"e9x",year:2007,trim:"335i Sedan (N54)",engine:"N54 3.0L TT"},{id:"e9x2",plat:"e9x",year:2008,trim:"335i Sedan (N54)",engine:"N54 3.0L TT"},
  {id:"e9x3",plat:"e9x",year:2009,trim:"335i Coupe (N54)",engine:"N54 3.0L TT"},{id:"e9x4",plat:"e9x",year:2010,trim:"335i Sedan (N54)",engine:"N54 3.0L TT"},
  {id:"e9x5",plat:"e9x",year:2011,trim:"335i Sedan (N55)",engine:"N55 3.0T"},{id:"e9x6",plat:"e9x",year:2012,trim:"335i Sedan (N55)",engine:"N55 3.0T"},
  {id:"e9x7",plat:"e9x",year:2013,trim:"335is Coupe (N54)",engine:"N54 3.0L TT"},{id:"e9x8",plat:"e9x",year:2008,trim:"335xi AWD (N54)",engine:"N54 3.0L TT"},
  // F30 — more years
  {id:"f30_1",plat:"f30",year:2016,trim:"340i",engine:"B58 3.0T"},{id:"f30_2",plat:"f30",year:2017,trim:"340i",engine:"B58 3.0T"},
  {id:"f30_3",plat:"f30",year:2018,trim:"340i",engine:"B58 3.0T"},{id:"f30_4",plat:"f30",year:2016,trim:"340i xDrive",engine:"B58 3.0T"},
  {id:"f30_5",plat:"f30",year:2017,trim:"340i xDrive",engine:"B58 3.0T"},{id:"f30_6",plat:"f30",year:2019,trim:"340i",engine:"B58 3.0T"},
  // GD WRX/STI — more years and trims
  {id:"gd1",plat:"gd",year:2002,trim:"WRX (Bugeye)",engine:"EJ205 2.0T"},{id:"gd2",plat:"gd",year:2003,trim:"WRX (Bugeye)",engine:"EJ205 2.0T"},
  {id:"gd3",plat:"gd",year:2004,trim:"WRX (Blobeye)",engine:"EJ205 2.0T"},{id:"gd4",plat:"gd",year:2004,trim:"STI (Blobeye)",engine:"EJ257 2.5T"},
  {id:"gd5",plat:"gd",year:2005,trim:"WRX (Blobeye)",engine:"EJ255 2.5T"},{id:"gd6",plat:"gd",year:2005,trim:"STI",engine:"EJ257 2.5T"},
  {id:"gd7",plat:"gd",year:2006,trim:"WRX (Hawkeye)",engine:"EJ255 2.5T"},{id:"gd8",plat:"gd",year:2006,trim:"STI (Hawkeye)",engine:"EJ257 2.5T"},
  {id:"gd9",plat:"gd",year:2007,trim:"WRX (Hawkeye)",engine:"EJ255 2.5T"},{id:"gd10",plat:"gd",year:2007,trim:"STI",engine:"EJ257 2.5T"},
  // GR WRX/STI — more years and body styles
  {id:"gr1",plat:"gr",year:2008,trim:"WRX Hatch",engine:"EJ255 2.5T"},{id:"gr2",plat:"gr",year:2009,trim:"WRX Hatch",engine:"EJ255 2.5T"},
  {id:"gr3",plat:"gr",year:2010,trim:"WRX Sedan",engine:"EJ255 2.5T"},{id:"gr4",plat:"gr",year:2011,trim:"WRX Hatch",engine:"EJ255 2.5T"},
  {id:"gr5",plat:"gr",year:2012,trim:"WRX Hatch",engine:"EJ255 2.5T"},{id:"gr6",plat:"gr",year:2013,trim:"STI Hatch",engine:"EJ257 2.5T"},
  {id:"gr7",plat:"gr",year:2014,trim:"STI Sedan",engine:"EJ257 2.5T"},{id:"gr8",plat:"gr",year:2011,trim:"STI Sedan",engine:"EJ257 2.5T"},
  // VA WRX/STI — every year
  {id:"va1",plat:"va",year:2015,trim:"WRX",engine:"FA20DIT 2.0T"},{id:"va2",plat:"va",year:2016,trim:"WRX",engine:"FA20DIT 2.0T"},
  {id:"va3",plat:"va",year:2017,trim:"WRX",engine:"FA20DIT 2.0T"},{id:"va4",plat:"va",year:2018,trim:"WRX",engine:"FA20DIT 2.0T"},
  {id:"va5",plat:"va",year:2019,trim:"WRX",engine:"FA20DIT 2.0T"},{id:"va6",plat:"va",year:2020,trim:"WRX",engine:"FA20DIT 2.0T"},
  {id:"va7",plat:"va",year:2021,trim:"WRX",engine:"FA20DIT 2.0T"},{id:"va8",plat:"va",year:2019,trim:"STI",engine:"EJ257 2.5T"},
  {id:"va9",plat:"va",year:2020,trim:"STI",engine:"EJ257 2.5T"},{id:"va10",plat:"va",year:2021,trim:"STI",engine:"EJ257 2.5T"},
  {id:"va11",plat:"va",year:2018,trim:"WRX Limited",engine:"FA20DIT 2.0T"},{id:"va12",plat:"va",year:2020,trim:"WRX Series.White",engine:"FA20DIT 2.0T"},
  // Mazda
  {id:"na1",plat:"miata_na",year:1990,trim:"Base 1.6",engine:"B6ZE 1.6L"},{id:"na2",plat:"miata_na",year:1993,trim:"LE 1.6",engine:"B6ZE 1.6L"},
  {id:"na3",plat:"miata_na",year:1994,trim:"Base 1.8",engine:"BP-ZE 1.8L"},{id:"na4",plat:"miata_na",year:1996,trim:"M-Edition",engine:"BP-ZE 1.8L"},
  {id:"nb1",plat:"miata_nb",year:1999,trim:"Base",engine:"BP-ZE 1.8L"},{id:"nb2",plat:"miata_nb",year:2001,trim:"LS",engine:"BP-ZE 1.8L VVT"},
  {id:"nb3",plat:"miata_nb",year:2004,trim:"Mazdaspeed",engine:"BP-ZE Turbo 1.8T"},{id:"nb4",plat:"miata_nb",year:2003,trim:"SE",engine:"BP-ZE 1.8L VVT"},
  {id:"ms3_1",plat:"ms3",year:2007,trim:"Mazdaspeed 3",engine:"MZR DISI 2.3T"},{id:"ms3_2",plat:"ms3",year:2010,trim:"Mazdaspeed 3",engine:"MZR DISI 2.3T"},
  {id:"ms3_3",plat:"ms3",year:2012,trim:"Mazdaspeed 3",engine:"MZR DISI 2.3T"},{id:"ms3_4",plat:"ms3",year:2013,trim:"Mazdaspeed 3",engine:"MZR DISI 2.3T"},
  // Toyota
  {id:"ae1",plat:"ae86",year:1985,trim:"GTS Coupe",engine:"4A-GE 1.6L"},{id:"ae2",plat:"ae86",year:1986,trim:"GTS Hatch",engine:"4A-GE 1.6L"},
  {id:"mk4_1",plat:"mk4",year:1993,trim:"Turbo (TT)",engine:"2JZ-GTE 3.0T"},{id:"mk4_2",plat:"mk4",year:1996,trim:"Turbo (TT)",engine:"2JZ-GTE 3.0T"},
  {id:"mk4_3",plat:"mk4",year:1998,trim:"NA",engine:"2JZ-GE 3.0L"},
  {id:"taco1",plat:"taco",year:2006,trim:"TRD Off-Road V6 4WD",engine:"1GR-FE 4.0L V6"},{id:"taco2",plat:"taco",year:2010,trim:"TRD Sport V6",engine:"1GR-FE 4.0L V6"},
  {id:"taco3",plat:"taco",year:2017,trim:"TRD Off-Road V6",engine:"2GR-FKS 3.5L V6"},{id:"taco4",plat:"taco",year:2020,trim:"TRD Pro",engine:"2GR-FKS 3.5L V6"},
  {id:"4r1",plat:"4runner",year:2005,trim:"V8 Limited",engine:"2UZ-FE 4.7L V8"},{id:"4r2",plat:"4runner",year:2012,trim:"Trail V6",engine:"1GR-FE 4.0L V6"},
  {id:"4r3",plat:"4runner",year:2016,trim:"TRD Off-Road V6",engine:"1GR-FE 4.0L V6"},{id:"4r4",plat:"4runner",year:2020,trim:"TRD Pro",engine:"1GR-FE 4.0L V6"},
  // Nissan
  {id:"z33_1",plat:"z33",year:2003,trim:"350Z Touring",engine:"VQ35DE 3.5L"},{id:"z33_2",plat:"z33",year:2007,trim:"350Z HR",engine:"VQ35HR 3.5L"},
  {id:"z33_3",plat:"z33",year:2004,trim:"G35 Sedan",engine:"VQ35DE 3.5L"},{id:"z33_4",plat:"z33",year:2006,trim:"G35 Coupe",engine:"VQ35DE Rev-Up"},
  {id:"s13_1",plat:"s_chassis",year:1991,trim:"240SX SE (S13)",engine:"KA24DE 2.4L"},{id:"s14_1",plat:"s_chassis",year:1995,trim:"240SX SE (S14)",engine:"KA24DE 2.4L"},
  {id:"s14_2",plat:"s_chassis",year:1997,trim:"240SX (S14)",engine:"KA24DE 2.4L"},{id:"s14_3",plat:"s_chassis",year:1998,trim:"240SX Kouki (S14)",engine:"KA24DE 2.4L"},
  {id:"fr1",plat:"frontier",year:2006,trim:"SE V6 4WD",engine:"VQ40DE 4.0L"},{id:"fr2",plat:"frontier",year:2010,trim:"PRO-4X",engine:"VQ40DE 4.0L"},
  {id:"fr3",plat:"frontier",year:2015,trim:"PRO-4X",engine:"VQ40DE 4.0L"},{id:"fr4",plat:"frontier",year:2005,trim:"Xterra Off-Road",engine:"VQ40DE 4.0L"},
  // Ford
  {id:"s197_1",plat:"mustang_s197",year:2006,trim:"GT (4.6 3V)",engine:"4.6L 3V V8"},{id:"s197_2",plat:"mustang_s197",year:2011,trim:"GT (5.0 Coyote)",engine:"Coyote 5.0L V8"},
  {id:"s197_3",plat:"mustang_s197",year:2013,trim:"GT (5.0 Coyote)",engine:"Coyote 5.0L V8"},{id:"s197_4",plat:"mustang_s197",year:2012,trim:"Boss 302",engine:"5.0L Boss V8"},
  {id:"f150_1",plat:"f150",year:2006,trim:"XLT 5.4L V8",engine:"5.4L Triton V8"},{id:"f150_2",plat:"f150",year:2012,trim:"FX4 3.5L EcoBoost",engine:"3.5L EcoBoost V6"},
  {id:"f150_3",plat:"f150",year:2014,trim:"Lariat 5.0L V8",engine:"Coyote 5.0L V8"},{id:"f150_4",plat:"f150",year:2017,trim:"XLT 3.5L EcoBoost",engine:"3.5L EcoBoost V6"},
  {id:"f150_5",plat:"f150",year:2019,trim:"Raptor",engine:"3.5L EcoBoost HO"},{id:"f150_6",plat:"f150",year:2021,trim:"Lariat 5.0L V8",engine:"Coyote 5.0L V8"},
  {id:"rng1",plat:"ranger",year:2019,trim:"XLT 4WD",engine:"2.3L EcoBoost"},{id:"rng2",plat:"ranger",year:2022,trim:"Tremor",engine:"2.3L EcoBoost"},
  // Chevy
  {id:"sil1",plat:"silverado",year:2008,trim:"LT 5.3L V8",engine:"5.3L V8"},{id:"sil2",plat:"silverado",year:2015,trim:"LT 5.3L V8",engine:"L83 5.3L DI"},
  {id:"sil3",plat:"silverado",year:2018,trim:"LTZ 6.2L V8",engine:"L86 6.2L V8"},{id:"sil4",plat:"silverado",year:2020,trim:"Trail Boss 5.3L",engine:"L84 5.3L DFM"},
  {id:"sil5",plat:"silverado",year:2022,trim:"RST 6.2L V8",engine:"L87 6.2L V8"},{id:"sil6",plat:"silverado",year:2014,trim:"Sierra Denali 6.2L",engine:"L86 6.2L V8"},
  {id:"cam1",plat:"camaro",year:2010,trim:"SS (LS3)",engine:"LS3 6.2L V8"},{id:"cam2",plat:"camaro",year:2016,trim:"SS (LT1)",engine:"LT1 6.2L V8"},
  {id:"cam3",plat:"camaro",year:2018,trim:"SS 1LE (LT1)",engine:"LT1 6.2L V8"},{id:"cam4",plat:"camaro",year:2023,trim:"ZL1 (LT4)",engine:"LT4 6.2L SC"},
  {id:"c10_1",plat:"c10",year:1967,trim:"C10 Shortbed",engine:"250ci I6"},{id:"c10_2",plat:"c10",year:1972,trim:"C10 Longbed",engine:"350ci SBC V8"},
  {id:"c10_3",plat:"c10",year:1979,trim:"C10 Squarebody",engine:"350ci SBC V8"},{id:"c10_4",plat:"c10",year:1985,trim:"C10 Squarebody",engine:"305ci SBC V8"},
  // VW
  // Honda underdogs
  {id:"fit1",plat:"fit",year:2009,trim:"Sport 5MT",engine:"L15A 1.5L i-VTEC"},{id:"fit2",plat:"fit",year:2012,trim:"Sport 5MT",engine:"L15A 1.5L i-VTEC"},
  {id:"fit3",plat:"fit",year:2015,trim:"EX 6MT",engine:"L15B 1.5L"},{id:"fit4",plat:"fit",year:2018,trim:"Sport 6MT",engine:"L15B 1.5L"},
  {id:"av6_1",plat:"accord_v6",year:2004,trim:"EX V6 5AT",engine:"J30A4 3.0L V6"},{id:"av6_2",plat:"accord_v6",year:2006,trim:"EX V6 6MT Coupe",engine:"J30A5 3.0L V6"},
  {id:"av6_3",plat:"accord_v6",year:2008,trim:"EX-L V6 6MT Coupe",engine:"J35A8 3.5L V6"},{id:"av6_4",plat:"accord_v6",year:2010,trim:"EX-L V6 6MT Coupe",engine:"J35Z2 3.5L V6"},
  {id:"av6_5",plat:"accord_v6",year:2012,trim:"EX-L V6 6MT Coupe",engine:"J35Z3 3.5L V6"},
  // Toyota Camry V6
  {id:"cam_v6_1",plat:"camry_v6",year:2008,trim:"SE V6",engine:"2GR-FE 3.5L V6"},{id:"cam_v6_2",plat:"camry_v6",year:2012,trim:"SE V6",engine:"2GR-FE 3.5L V6"},
  {id:"cam_v6_3",plat:"camry_v6",year:2015,trim:"XSE V6",engine:"2GR-FE 3.5L V6"},{id:"cam_v6_4",plat:"camry_v6",year:2017,trim:"XSE V6",engine:"2GR-FKS 3.5L V6"},
  // Nissan Altima/Maxima
  {id:"alt1",plat:"altima",year:2003,trim:"3.5 SE 6MT",engine:"VQ35DE 3.5L V6"},{id:"alt2",plat:"altima",year:2005,trim:"SE-R 6MT",engine:"VQ35DE 3.5L V6"},
  {id:"alt3",plat:"altima",year:2010,trim:"3.5 SR",engine:"VQ35DE 3.5L V6"},{id:"alt4",plat:"altima",year:2007,trim:"Maxima SE",engine:"VQ35DE 3.5L V6"},
  {id:"alt5",plat:"altima",year:2012,trim:"Maxima SV",engine:"VQ35DE 3.5L V6"},
  // Mazda Protege
  {id:"pro1",plat:"protege",year:2002,trim:"Protegé5",engine:"FS-ZE 2.0L"},{id:"pro2",plat:"protege",year:2003,trim:"Mazdaspeed Protegé",engine:"FS-DET 2.0T"},
  {id:"pro3",plat:"protege",year:2003,trim:"Protegé5",engine:"FS-ZE 2.0L"},
  // Ford Crown Vic / Focus ST
  {id:"cv1",plat:"crown_vic",year:2003,trim:"P71 Police Interceptor",engine:"4.6L Modular V8"},{id:"cv2",plat:"crown_vic",year:2006,trim:"P71 Police Interceptor",engine:"4.6L Modular V8"},
  {id:"cv3",plat:"crown_vic",year:2008,trim:"LX Sport",engine:"4.6L Modular V8"},{id:"cv4",plat:"crown_vic",year:2011,trim:"P71 (Final Year)",engine:"4.6L Modular V8"},
  {id:"cv5",plat:"crown_vic",year:2004,trim:"Mercury Marauder",engine:"4.6L DOHC V8 302HP"},
  {id:"fst1",plat:"focus_st",year:2013,trim:"ST",engine:"EcoBoost 2.0T"},{id:"fst2",plat:"focus_st",year:2015,trim:"ST",engine:"EcoBoost 2.0T"},
  {id:"fst3",plat:"focus_st",year:2017,trim:"ST",engine:"EcoBoost 2.0T"},{id:"fst4",plat:"focus_st",year:2018,trim:"ST (Final Year)",engine:"EcoBoost 2.0T"},
  // Chevy Cobalt SS / G8 GT
  {id:"css1",plat:"cobalt_ss",year:2006,trim:"SS Supercharged",engine:"LSJ 2.0L SC"},{id:"css2",plat:"cobalt_ss",year:2008,trim:"SS Turbo",engine:"LNF 2.0T"},
  {id:"css3",plat:"cobalt_ss",year:2009,trim:"SS Turbo",engine:"LNF 2.0T"},{id:"css4",plat:"cobalt_ss",year:2010,trim:"SS Turbo (Final)",engine:"LNF 2.0T"},
  {id:"css5",plat:"cobalt_ss",year:2006,trim:"Saturn Ion Redline",engine:"LSJ 2.0L SC"},
  {id:"g8_1",plat:"g8_gt",year:2008,trim:"G8 GT",engine:"L76 6.0L V8"},{id:"g8_2",plat:"g8_gt",year:2009,trim:"G8 GT",engine:"L76 6.0L V8"},
  {id:"g8_3",plat:"g8_gt",year:2009,trim:"G8 GXP 6MT",engine:"LS3 6.2L V8"},{id:"g8_4",plat:"g8_gt",year:2014,trim:"Chevy SS",engine:"LS3 6.2L V8"},
  {id:"g8_5",plat:"g8_gt",year:2016,trim:"Chevy SS 6MT",engine:"LS3 6.2L V8"},{id:"g8_6",plat:"g8_gt",year:2017,trim:"Chevy SS (Final Year)",engine:"LS3 6.2L V8"},
  // VW
  {id:"mk6_1",plat:"mk6_gti",year:2010,trim:"GTI 2.0T",engine:"EA888 Gen 1 2.0T"},{id:"mk6_2",plat:"mk6_gti",year:2012,trim:"GTI DSG",engine:"EA888 Gen 1 2.0T"},
  {id:"mk6_3",plat:"mk6_gti",year:2014,trim:"GTI Wolfsburg",engine:"EA888 Gen 1 2.0T"},
  {id:"mk7_1",plat:"mk7_gti",year:2015,trim:"GTI S",engine:"EA888 Gen 3 2.0T"},{id:"mk7_2",plat:"mk7_gti",year:2017,trim:"GTI Sport",engine:"EA888 Gen 3 2.0T"},
  {id:"mk7_3",plat:"mk7_gti",year:2019,trim:"Golf R",engine:"EA888 Gen 3 2.0T AWD"},{id:"mk7_4",plat:"mk7_gti",year:2021,trim:"Golf R",engine:"EA888 Gen 3 2.0T AWD"},
  // New obscure platforms
  {id:"fc1",plat:"rx7_fc",year:1987,trim:"Turbo II",engine:"13B-T Rotary Turbo"},{id:"fc2",plat:"rx7_fc",year:1989,trim:"Turbo II",engine:"13B-T Rotary Turbo"},
  {id:"fc3",plat:"rx7_fc",year:1988,trim:"NA",engine:"13B NA Rotary"},{id:"fc4",plat:"rx7_fc",year:1991,trim:"Turbo II (Final)",engine:"13B-T Rotary Turbo"},
  {id:"rx8_1",plat:"rx8",year:2004,trim:"6MT",engine:"RENESIS 13B-MSP 1.3L"},{id:"rx8_2",plat:"rx8",year:2006,trim:"6MT",engine:"RENESIS 13B-MSP 1.3L"},
  {id:"rx8_3",plat:"rx8",year:2009,trim:"R3",engine:"RENESIS 13B-MSP 1.3L"},{id:"rx8_4",plat:"rx8",year:2011,trim:"Sport (Final Year)",engine:"RENESIS 13B-MSP 1.3L"},
  {id:"sp6_1",plat:"speed6",year:2006,trim:"Mazdaspeed 6",engine:"MZR DISI 2.3T AWD"},{id:"sp6_2",plat:"speed6",year:2007,trim:"Mazdaspeed 6",engine:"MZR DISI 2.3T AWD"},
  {id:"mr2_1",plat:"mr2_sw20",year:1991,trim:"Turbo",engine:"3S-GTE 2.0T"},{id:"mr2_2",plat:"mr2_sw20",year:1993,trim:"Turbo (Rev2)",engine:"3S-GTE 2.0T"},
  {id:"mr2_3",plat:"mr2_sw20",year:1995,trim:"NA",engine:"5S-FE 2.2L"},{id:"mr2_4",plat:"mr2_sw20",year:1997,trim:"Turbo",engine:"3S-GTE 2.0T"},
  {id:"cel1",plat:"celica_gts",year:2000,trim:"GT-S 6MT",engine:"2ZZ-GE 1.8L VVTL-i"},{id:"cel2",plat:"celica_gts",year:2003,trim:"GT-S 6MT",engine:"2ZZ-GE 1.8L VVTL-i"},
  {id:"cel3",plat:"celica_gts",year:2005,trim:"GT-S (Final Year)",engine:"2ZZ-GE 1.8L VVTL-i"},{id:"cel4",plat:"celica_gts",year:2003,trim:"Matrix XRS",engine:"2ZZ-GE 1.8L VVTL-i"},
  {id:"z32_1",plat:"z32",year:1990,trim:"Twin Turbo",engine:"VG30DETT 3.0L TT"},{id:"z32_2",plat:"z32",year:1993,trim:"Twin Turbo",engine:"VG30DETT 3.0L TT"},
  {id:"z32_3",plat:"z32",year:1996,trim:"NA",engine:"VG30DE 3.0L"},{id:"z32_4",plat:"z32",year:1994,trim:"Twin Turbo",engine:"VG30DETT 3.0L TT"},
  {id:"ser1",plat:"sentra_ser",year:2002,trim:"SE-R Spec V 6MT",engine:"QR25DE 2.5L"},{id:"ser2",plat:"sentra_ser",year:2004,trim:"SE-R Spec V 6MT",engine:"QR25DE 2.5L"},
  {id:"ser3",plat:"sentra_ser",year:2006,trim:"SE-R Spec V",engine:"QR25DE 2.5L"},
  {id:"sho1",plat:"taurus_sho",year:2011,trim:"SHO",engine:"3.5L EcoBoost TT V6"},{id:"sho2",plat:"taurus_sho",year:2014,trim:"SHO",engine:"3.5L EcoBoost TT V6"},
  {id:"sho3",plat:"taurus_sho",year:2017,trim:"SHO",engine:"3.5L EcoBoost TT V6"},{id:"sho4",plat:"taurus_sho",year:2019,trim:"SHO (Final Year)",engine:"3.5L EcoBoost TT V6"},
  {id:"ltg1",plat:"lightning",year:1999,trim:"SVT Lightning",engine:"5.4L SC V8"},{id:"ltg2",plat:"lightning",year:2001,trim:"SVT Lightning",engine:"5.4L SC V8"},
  {id:"ltg3",plat:"lightning",year:2003,trim:"SVT Lightning",engine:"5.4L SC V8"},{id:"ltg4",plat:"lightning",year:2002,trim:"Harley-Davidson F-150",engine:"5.4L SC V8"},
  {id:"tbss1",plat:"tbss",year:2006,trim:"Trailblazer SS",engine:"LS2 6.0L V8"},{id:"tbss2",plat:"tbss",year:2007,trim:"Trailblazer SS",engine:"LS2 6.0L V8"},
  {id:"tbss3",plat:"tbss",year:2008,trim:"Trailblazer SS AWD",engine:"LS2 6.0L V8"},{id:"tbss4",plat:"tbss",year:2009,trim:"Trailblazer SS",engine:"LS2 6.0L V8"},
  {id:"zr2_1",plat:"colorado_zr2",year:2018,trim:"ZR2 V6",engine:"LGZ 3.6L V6"},{id:"zr2_2",plat:"colorado_zr2",year:2020,trim:"ZR2 Diesel",engine:"LWN 2.8L Duramax"},
  {id:"zr2_3",plat:"colorado_zr2",year:2022,trim:"ZR2 V6",engine:"LGZ 3.6L V6"},{id:"zr2_4",plat:"colorado_zr2",year:2019,trim:"Canyon AT4 V6",engine:"LGZ 3.6L V6"},
  {id:"s10_1",plat:"s10",year:1998,trim:"LS 4.3L V6",engine:"L35 4.3L V6"},{id:"s10_2",plat:"s10",year:2001,trim:"Xtreme",engine:"L35 4.3L V6"},
  {id:"s10_3",plat:"s10",year:2003,trim:"ZR2 4.3L",engine:"L35 4.3L V6"},{id:"s10_4",plat:"s10",year:1996,trim:"Regular Cab 2.2L",engine:"LN2 2.2L I4"},
  {id:"gli1",plat:"jetta_gli",year:2012,trim:"GLI",engine:"EA888 Gen 1 2.0T"},{id:"gli2",plat:"jetta_gli",year:2014,trim:"GLI Edition 30",engine:"EA888 Gen 1 2.0T"},
  {id:"gli3",plat:"jetta_gli",year:2019,trim:"GLI 35th Anniversary",engine:"EA888 Gen 3 2.0T"},{id:"gli4",plat:"jetta_gli",year:2021,trim:"GLI Autobahn",engine:"EA888 Gen 3 2.0T"},
  {id:"r32_1",plat:"golf_r32",year:2004,trim:"R32 (MK4)",engine:"VR6 3.2L AWD"},{id:"r32_2",plat:"golf_r32",year:2008,trim:"R32 (MK5)",engine:"VR6 3.2L AWD"},
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
  {id:"h1",name:"Hondata S300 V3",brand:"Hondata",cat:"tune",price:650,desc:"Full OBD1 piggyback ECU. The gold standard for old-school Honda tuning. Dyno tune recommended.",hp:15,tq:10,ret:"Hondata",sk:3,time:2,tools:"Soldering iron, ECU pin kit, laptop",notes:"Requires chipping your ECU or buying pre-chipped. This unlocks the full potential of any swap.",plats:["eg","ek","dc2"]},
  {id:"h2",name:"Chipped P28 ECU",brand:"Honda OEM",cat:"tune",price:120,desc:"Pre-chipped OBD1 ECU ready for Hondata or Neptune. Budget tuning entry — plug and play.",hp:10,tq:5,ret:"eBay",sk:2,time:0.5,tools:"10mm socket",notes:"Make sure it's socketed for your tuning system. These are getting harder to find clean.",plats:["eg","ek","dc2"]},
  {id:"h3",name:"AEM Short Ram Intake",brand:"AEM",cat:"intake",price:89,desc:"Budget short ram — VTEC crossover sound and modest airflow gains. The starter mod.",hp:5,tq:3,ret:"Amazon",sk:1,time:0.3,tools:"10mm socket",notes:"15-minute install. Add a heat shield if your bay runs hot.",plats:["eg","ek","dc2"]},
  {id:"h4",name:"Injen Cold Air Intake",brand:"Injen",cat:"intake",price:215,desc:"True cold air routing with heat shield. Real flow gains, not just noise.",hp:8,tq:5,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"Route behind bumper for true cold air. Don't drive through deep puddles.",plats:["eg","ek","dc2"]},
  {id:"h5",name:"Yonaka Catback",brand:"Yonaka",cat:"exhaust",price:199,desc:"Budget stainless catback. Decent tone, bolt-on. The go-to budget exhaust for 20 years.",hp:3,tq:3,ret:"eBay",sk:2,time:1.5,tools:"14mm, jack stands, WD-40",notes:"Soak stock bolts overnight. May need to massage hangers for fitment.",plats:["eg","ek","dc2"]},
  {id:"h6",name:"DC Sports 4-1 Header",brand:"DC Sports",cat:"exhaust",price:175,desc:"Ceramic 4-1 header — the biggest single power-per-dollar mod on ANY D-series engine. Period.",hp:12,tq:8,ret:"Amazon",sk:3,time:2.5,tools:"12mm, 14mm, penetrating oil, jack stands, new gasket",notes:"Manifold bolts will fight you. Soak 24hrs in PB Blaster. Always use a new exhaust gasket.",plats:["eg","ek","dc2"]},
  {id:"h7",name:"Skunk2 MegaPower Exhaust",brand:"Skunk2",cat:"exhaust",price:350,desc:"Iconic catback — perfect fitment, great sound, real gains. The premium choice.",hp:5,tq:4,ret:"Amazon",sk:2,time:1.5,tools:"14mm, jack stands",notes:"Pairs perfectly with DC header. The combined sound is legendary.",plats:["eg","ek","dc2"]},
  {id:"h8",name:"Tein Street Basis Z Coilovers",brand:"Tein",cat:"susp",price:550,desc:"Height-adjustable. Good street ride, eliminates body roll. These light cars transform with coilovers.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"17/19mm, jack stands, spring compressor",notes:"Night and day handling difference on a car that weighs 2,200 lbs.",plats:["eg","ek","dc2"]},
  {id:"h9",name:"Skunk2 Sport Lowering Springs",brand:"Skunk2",cat:"susp",price:160,desc:"~2\" drop. Tighter handling, aggressive stance. Budget option.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"Spring compressor, 17/19mm, jack stands",notes:"Pair with KYB AGX struts if yours are blown. Get alignment after.",plats:["eg","ek","dc2"]},
  {id:"h10",name:"Konig Hypergram 15x7 (×4)",brand:"Konig",cat:"wheels",price:580,desc:"Flow-formed lightweight. Perfect EG/EK fitment. 15x7 +35 is the sweet spot.",hp:0,tq:0,ret:"Fitment Industries",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"Hub-centric rings required. These save serious unsprung weight on a car this light.",plats:["eg","ek","dc2"]},
  {id:"h11",name:"Federal 595 RS-RR 195/50R15 (×4)",brand:"Federal",cat:"tires",price:280,desc:"Budget semi-slick. Insane grip for the money. The grassroots autocross cheat code.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"Summer only. Wear fast but they're cheap to replace. Grip level is absurd.",plats:["eg","ek","dc2"]},
  {id:"h12",name:"Buddy Club P1 Shift Knob",brand:"Buddy Club",cat:"int",price:35,desc:"Weighted titanium-look knob. Smoother shifts for pocket change.",hp:0,tq:0,ret:"Amazon",sk:1,time:0.1,tools:"None",notes:"Check thread pitch (10x1.5mm for EG/EK). 30-second install.",plats:["eg","ek","dc2"]},
  {id:"h13",name:"NRG Quick Release Hub",brand:"NRG",cat:"int",price:110,desc:"Short hub + quick release for aftermarket wheels. Anti-theft bonus.",hp:0,tq:0,ret:"Amazon",sk:2,time:1,tools:"Steering wheel puller, 17mm",notes:"Disables airbag/horn. Track/show only unless you wire a horn button.",plats:["eg","ek","dc2"]},
  // ── EG/EK JUNKYARD GOLD ──
  {id:"jh1",name:"🏴‍☠️ Mini-Me Swap (Y8 Head on D15)",brand:"Honda Junkyard",cat:"junk",price:150,desc:"THE classic junkyard Honda mod. Take a VTEC head (D16Y8 or D16Z6) and bolt it onto a non-VTEC D15 block. You get VTEC on your base-model Civic for $100-200 in junkyard parts. This has been done thousands of times since the mid-90s. You need the head, intake manifold, ECU (P28), and VTEC wiring. Adds about 20HP and the VTEC crossover sound.",hp:20,tq:10,ret:"Junkyard / eBay",sk:4,time:8,tools:"Full socket set, head gasket set ($30), torque wrench, coolant, VTEC solenoid wiring",notes:"THE original Honda junkyard hack. Find a D16Y8 head at Pick-n-Pull for $50-100. Use a P28 ECU with Hondata and you have a fully tunable VTEC engine for under $200. Thousands have done this — guides are everywhere on Honda-Tech.",plats:["eg","ek","dc2"]},
  {id:"jh2",name:"🏴‍☠️ Integra Type R Brake Swap",brand:"Acura Junkyard",cat:"junk",price:200,desc:"Pull front brake calipers, rotors, and brackets from a 1997-2001 Integra Type R (or GSR — same brakes). Direct bolt-on to EG/EK hubs. Transforms braking from terrifying to confidence-inspiring. The biggest braking upgrade possible without custom brackets.",hp:0,tq:0,ret:"Junkyard / eBay",sk:3,time:2,tools:"14mm, 17mm sockets, brake line flare wrench, brake fluid, new pads",notes:"ITR brakes bolt directly onto EG/EK spindles. No modification needed. You need the calipers, brackets, rotors, and pads. Junkyard set: $100-200. This is the brake upgrade that every EG/EK track car runs.",plats:["eg","ek","dc2"]},
  {id:"jh3",name:"🏴‍☠️ Del Sol VTEC ECU Swap",brand:"Honda Junkyard",cat:"junk",price:40,desc:"The P28 ECU from a 93-95 Del Sol VTEC is the same ECU used in the EG Si — but nobody looks for them in Del Sols. They're cheaper to find at junkyards because Del Sols got crushed more. Same exact part, different source.",hp:10,tq:5,ret:"Junkyard",sk:2,time:0.5,tools:"10mm socket",notes:"Hidden knowledge: Del Sol VTEC P28 ECU = Civic Si P28 ECU. Same part number. Del Sol ones are cheaper because nobody thinks to look. Check Pull-A-Part before paying eBay prices.",plats:["eg","ek","dc2"]},
  {id:"jh4",name:"🏴‍☠️ CRX/EF Rear Disc Conversion",brand:"Honda Junkyard",cat:"junk",price:100,desc:"EG/EK came with rear drums. Pull the rear disc brake setup from a 90-91 Integra and bolt it on. Direct swap with minor brake line modification. Rear discs = massively better braking balance and the ability to actually use a handbrake for slides.",hp:0,tq:0,ret:"Junkyard",sk:3,time:3,tools:"Full socket set, brake line flare kit, brake fluid, new rear pads",notes:"One of the oldest Honda junkyard tricks. 90-91 Integra rear disc assemblies bolt onto EG/EK trailing arms. You need the calipers, rotors, brackets, and to modify the brake hard lines slightly. Every serious EG/EK build does this.",plats:["eg","ek","dc2"]},
  {id:"jh5",name:"🏴‍☠️ Civic Si Cluster Swap",brand:"Honda Junkyard",cat:"junk",price:30,desc:"Base-model EG/EK clusters don't have a tachometer. Pull the gauge cluster from an Si or EX at the junkyard — direct plug-and-play swap. Now you have a tach, which is kind of important if you're building an engine.",hp:0,tq:0,ret:"Junkyard",sk:1,time:0.5,tools:"Phillips screwdriver, 10mm",notes:"$15-30 at a junkyard. Plug and play — same connector. Every DX/CX/base model owner does this first.",plats:["eg","ek","dc2"]},

  // ══════ HONDA 10TH GEN ══════
  {id:"h40",name:"Hondata FlashPro (1.5T)",brand:"Hondata",cat:"tune",price:695,desc:"Gold standard 1.5T tuning. Fixes rev hang, unlocks full bolt-on potential.",hp:40,tq:55,ret:"Amazon",sk:2,time:0.5,tools:"Laptop, USB",notes:"Base map first, protune later. The rev hang fix alone is worth it to some people.",plats:["10g"]},
  {id:"h41",name:"PRL Cobra Cold Air Intake",brand:"PRL Motorsports",cat:"intake",price:350,desc:"Velocity stack CAI with sealed airbox. Massive flow, incredible turbo sounds.",hp:8,tq:10,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"Easiest mod on the car. 20 minutes. The turbo spool sound alone is worth it.",plats:["10g"]},
  {id:"h42",name:"K&N Typhoon Intake (1.5T)",brand:"K&N",cat:"intake",price:185,desc:"Budget cold air intake — half the PRL price, still solid gains.",hp:5,tq:6,ret:"Amazon",sk:1,time:0.5,tools:"10mm",notes:"Great starter mod if PRL is too expensive.",plats:["10g"]},
  {id:"h43",name:"Invidia Q300 Cat-Back",brand:"Invidia",cat:"exhaust",price:825,desc:"70mm, deep tone, zero drone. The exhaust most 10th gen owners end up with.",hp:5,tq:8,ret:"Amazon",sk:3,time:2,tools:"14mm, PB Blaster, jack stands",notes:"Soak bolts overnight. Need a friend to hold the pipe.",plats:["10g"]},
  {id:"h44",name:"Yonaka Catback (10th Gen)",brand:"Yonaka",cat:"exhaust",price:320,desc:"Budget stainless. Half the Invidia price, slightly louder/raspier.",hp:3,tq:5,ret:"eBay",sk:3,time:2,tools:"14mm, PB Blaster, jack stands",notes:"Good value option.",plats:["10g"]},
  {id:"h45",name:"MAPerformance Catted DP",brand:"MAPerformance",cat:"exhaust",price:499,desc:"Biggest single bolt-on gain for 1.5T. TUNE REQUIRED.",hp:25,tq:30,ret:"Amazon",sk:4,time:3,tools:"14mm deep, O2 socket, PB Blaster, jack stands",notes:"Hardest bolt-on. Turbo bolts are brutal. Soak 24hrs. Must retune.",plats:["10g"]},
  {id:"h46",name:"PRL Stage 1 Intercooler",brand:"PRL Motorsports",cat:"ic",price:475,desc:"Drops intake temps 30-50°F. Consistent power in heat.",hp:10,tq:15,ret:"PRL Direct",sk:3,time:2,tools:"10/12mm, pliers",notes:"Bumper off required. Mark hose positions first.",plats:["10g"]},
  {id:"h47",name:"27WON Turbo Inlet",brand:"27WON",cat:"engine",price:189,desc:"Larger inlet, better spool. Simple but effective.",hp:5,tq:8,ret:"27WON",sk:2,time:0.75,tools:"10mm, flathead",notes:"Top of engine bay — easy access.",plats:["10g"]},
  {id:"h48",name:"Mishimoto Catch Can",brand:"Mishimoto",cat:"engine",price:165,desc:"PCV catch can. Prevents carbon buildup — essential for DI turbo longevity.",hp:0,tq:0,ret:"Amazon",sk:2,time:1,tools:"10mm, zip ties",notes:"Drain every oil change. This is maintenance, not just a mod.",plats:["10g"]},
  {id:"h49",name:"Eibach Pro-Kit Springs",brand:"Eibach",cat:"susp",price:280,desc:"~1\" drop. Tighter handling, still daily-friendly.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"Spring compressor, 17/19mm, jack stands",notes:"Get alignment after. Drop is subtle but handling change is obvious.",plats:["10g"]},
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
  {id:"b5",name:"Raceland Coilovers (E36)",brand:"Raceland",cat:"susp",price:450,desc:"Budget coilovers that actually work. Street-only.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"16/18mm, spring compressor, jack stands",notes:"Not track-ready. Great for daily.",plats:["e36"]},
  {id:"b6",name:"Ireland Eng. Sway Bars (F+R)",brand:"Ireland Eng.",cat:"susp",price:285,desc:"THE best handling mod for E36. Transforms body roll.",hp:0,tq:0,ret:"Ireland Engineering",sk:3,time:2,tools:"16/18mm, jack stands",notes:"Start on middle adjustment hole.",plats:["e36"]},
  // E36 JUNKYARD
  {id:"jb1",name:"🏴‍☠️ M50 Manifold on M52 Swap",brand:"BMW Junkyard",cat:"junk",price:60,desc:"The M50 intake manifold has larger runners than the M52 manifold. It bolts directly onto the M52 engine with a throttle body adapter ($30). Free top-end power that BMW tuners have known about since the late 90s. The M50 manifold is everywhere at junkyards.",hp:10,tq:5,ret:"Junkyard / eBay",sk:3,time:3,tools:"10mm, 12mm, TB adapter, new intake gaskets",notes:"One of the oldest BMW junkyard secrets. M50 manifold flows better than M52, bolts right on. Documented on R3vlimited since 2001. TB adapter is ~$30 from Amazon.",plats:["e36"]},
  {id:"jb2",name:"🏴‍☠️ E36 Compact Subframe Plates",brand:"Various Fab Shops",cat:"junk",price:40,desc:"The E36 rear subframe cracks at the mounting points — a $2,000+ repair when it fails. A set of reinforcement plates from a small fab shop costs $30-50 and prevents this entirely. Weld them on and never worry about it again. This fix has been known since the early drift days.",hp:0,tq:0,ret:"eBay / BimmerForums classifieds",sk:4,time:3,tools:"Welder (MIG), grinder, jack stands, PB Blaster",notes:"$40 that prevents a $2,000 problem. You need welding skills or a friend with a welder. Clean the mounting points, weld the plates on. Every drift E36 has these. If you can't weld, any muffler shop can do it for $100.",plats:["e36"]},
  {id:"jb3",name:"🏴‍☠️ Z3 Short Shifter Swap",brand:"BMW Junkyard",cat:"junk",price:25,desc:"The Z3 shifter assembly has a shorter lever than the E36 sedan/coupe. It's a direct bolt-in swap that shortens your throw by about 30%. Junkyard cost: $15-30. This has been known on Bimmerforums since the early 2000s.",hp:0,tq:0,ret:"Junkyard",sk:2,time:1.5,tools:"13mm, 10mm, shifter boot removal",notes:"Z3 shifter carrier = shorter throws in E36. Same part, shorter lever. Check Bimmerforums DIY thread from 2003. Way cheaper than buying a $200 aftermarket short shifter.",plats:["e36"]},

  // E46
  {id:"b10",name:"Shark Injector Tune",brand:"Turner",cat:"tune",price:350,desc:"Plug-in flash for M54/S54. Removes limiter, adjusts maps.",hp:15,tq:12,ret:"Turner Motorsport",sk:1,time:0.3,tools:"OBD2 cable",notes:"Plug, flash, done. Reversible.",plats:["e46"]},
  {id:"b11",name:"Magnaflow Catback (E46)",brand:"Magnaflow",cat:"exhaust",price:550,desc:"Stainless, deep I6, zero drone.",hp:5,tq:5,ret:"Amazon",sk:3,time:2,tools:"13/15mm, PB Blaster, jack stands",notes:"Check rubber hangers while under there.",plats:["e46"]},
  {id:"b12",name:"H&R Sport Springs (E46)",brand:"H&R",cat:"susp",price:230,desc:"1.3\" drop. Perfect OEM+ stance.",hp:0,tq:0,ret:"FCP Euro",sk:3,time:3,tools:"Spring compressor, 16/18mm, jack stands",notes:"E46 looks incredible lowered an inch.",plats:["e46"]},
  {id:"b13",name:"Mishimoto Radiator (E46)",brand:"Mishimoto",cat:"ic",price:250,desc:"Same as E36 — fix cooling before engine dies.",hp:0,tq:0,ret:"Amazon",sk:3,time:2.5,tools:"10mm, Phillips, drain pan",notes:"Replace expansion tank + thermostat + all hoses.",plats:["e46"]},
  // E46 JUNKYARD
  {id:"jb4",name:"🏴‍☠️ ZHP Knob + Boot + Shift Bushing",brand:"BMW Junkyard",cat:"junk",price:45,desc:"The E46 ZHP (330i Performance Package) has a shorter weighted shift knob and a stiffer shift bushing. Both bolt directly into any E46 manual. The combination gives shorter, more precise throws. Junkyard cost: $20-50. OEM BMW parts doing OEM BMW things.",hp:0,tq:0,ret:"Junkyard / eBay",sk:2,time:0.5,tools:"None for knob, pliers for bushing",notes:"ZHP shift parts are the best-kept E46 secret. The weighted knob + stiffer bushing transforms the shift feel. Way better than any aftermarket short shifter because it's OEM quality.",plats:["e46"]},
  {id:"jb5",name:"🏴‍☠️ E46 M3 Front Bumper Swap",brand:"BMW Junkyard",cat:"junk",price:150,desc:"The E46 M3 front bumper bolts directly onto any E46 sedan/coupe with the M3 bumper brackets (included at junkyard). Transforms the front end from boring to aggressive. This is the #1 cosmetic mod on every E46 forum since 2004.",hp:0,tq:0,ret:"Junkyard / eBay",sk:2,time:2,tools:"10mm, T25 Torx, bumper clips, respray budget",notes:"Bumper swaps direct but needs repainting. Budget $200-300 for paint match. The brackets from the M3 are needed — grab those at the yard too. Fog lights are different so grab those as well.",plats:["e46"]},

  // E9X
  {id:"b20",name:"BM3 Stage 1 (N54/N55)",brand:"bootmod3",cat:"tune",price:500,desc:"Gold standard. +80HP pump gas. OBD flash.",hp:80,tq:80,ret:"ProTuningFreaks",sk:1,time:0.3,tools:"Phone/laptop, OBD2",notes:"Best $500 you'll ever spend on a car.",plats:["e9x","e82"]},
  {id:"b21",name:"MHD Stage 1 (FREE)",brand:"MHD Flasher",cat:"tune",price:0,desc:"FREE flash tune via Android. +60HP. Not a joke.",hp:60,tq:60,ret:"MHD (Android)",sk:1,time:0.3,tools:"Android phone, $20 BT adapter",notes:"Free. Legit. Game-changing. The most insane value in cars.",plats:["e9x","e82"]},
  {id:"b22",name:"BMS Dual Cone Intake ($99)",brand:"BMS",cat:"intake",price:99,desc:"Ultra-budget. Exposes turbos for max sound.",hp:5,tq:5,ret:"Burger Motorsports",sk:1,time:0.3,tools:"Flathead",notes:"Maximum turbo sounds for minimum dollars.",plats:["e9x","e82"]},
  {id:"b23",name:"CTS Catless Downpipes",brand:"CTS Turbo",cat:"exhaust",price:450,desc:"3\" catless. Massive flow. Off-road only. TUNE REQUIRED.",hp:30,tq:35,ret:"ECS Tuning",sk:4,time:3,tools:"13/15mm deep, O2 socket, PB Blaster, jack stands",notes:"Flash Stage 2 before first start. Turbo spool improvement is dramatic.",plats:["e9x","e82"]},
  {id:"b24",name:"Muffler Delete ($75)",brand:"Various",cat:"exhaust",price:75,desc:"Straight pipe rear muffler. Free-ish power, raw I6 sound.",hp:3,tq:3,ret:"eBay",sk:2,time:1,tools:"13mm, jack stands",notes:"Gets raspy high RPM. Some love it, some don't.",plats:["e9x","e82","f30"]},
  {id:"b25",name:"BMS Charge Pipe (MUST DO)",brand:"BMS",cat:"engine",price:120,desc:"Replaces the PLASTIC charge pipe that WILL crack under boost. Non-negotiable with any tune.",hp:0,tq:0,ret:"Burger Motorsports",sk:2,time:1,tools:"10mm, flathead, pliers",notes:"Stock pipe cracks. Period. Not if, when. Do this the same day you tune.",plats:["e9x","e82"]},
  {id:"b26",name:"Wagner FMIC",brand:"Wagner Tuning",cat:"ic",price:800,desc:"Front-mount IC. No heat soak ever again. Essential Stage 2+.",hp:15,tq:15,ret:"ECS Tuning",sk:4,time:4,tools:"T25/T30, 10/13mm, drain pan",notes:"Bumper off. AC condenser relocation. Worth every minute.",plats:["e9x","e82"]},
  {id:"b27",name:"H&R Sport Springs (E9X)",brand:"H&R",cat:"susp",price:260,desc:"1\" drop. Great daily ride. OEM+ look.",hp:0,tq:0,ret:"FCP Euro",sk:3,time:3,tools:"Spring compressor, 16/18mm, jack stands",notes:"Perfect for the daily driver.",plats:["e9x","e82"]},
  // E9X JUNKYARD
  {id:"jb6",name:"🏴‍☠️ Index 12 Injector Upgrade",brand:"BMW OEM",cat:"junk",price:300,desc:"N54 injectors come in different 'indexes' (revisions). Early cars have index 7-10 injectors that are prone to failure. Index 12 injectors (latest revision) are dramatically more reliable. Pull them from a newer N54 at the junkyard ($200-400 for a set of 6) or buy remanufactured. This is preventive maintenance that every N54 owner needs to know about.",hp:0,tq:0,ret:"Junkyard / FCP Euro (reman)",sk:3,time:2,tools:"10mm, injector removal tool, new O-rings, new seals",notes:"Check your current injector index by reading the part number on the side. If you're below index 12, replace them before they fail. Failed injectors cause misfires, lean conditions, and can crack the cylinder sleeve. FCP Euro sells remanufactured index 12 sets.",plats:["e9x","e82"]},
  {id:"jb7",name:"🏴‍☠️ 135i/1M Oil Cooler Swap",brand:"BMW OEM",cat:"junk",price:200,desc:"The N54-powered 135i and 1M have an oil cooler that the 335i doesn't. It bolts directly onto the E90/E92 335i oil filter housing. Keeps oil temps 20-30°F cooler under hard driving. Junkyard cost: $100-250.",hp:0,tq:0,ret:"Junkyard / eBay",sk:3,time:2,tools:"Oil filter housing removal tools, new gaskets, oil",notes:"Known on N54Tech since 2010. The 335i overheats its oil during track use or sustained pulls. The 135i cooler fixes this. Same engine, same housing — BMW just didn't put the cooler on the 335i. Grab the cooler, lines, and bracket from a 135i at the yard.",plats:["e9x","e82"]},

  // F30
  {id:"b30",name:"BM3 Stage 1 (B58)",brand:"bootmod3",cat:"tune",price:500,desc:"400+ HP pump gas. Mind-blowing.",hp:80,tq:85,ret:"ProTuningFreaks",sk:1,time:0.3,tools:"Laptop, OBD2",notes:"The most dramatic tune result in the car world.",plats:["f30"]},
  {id:"b31",name:"aFe Momentum Intake (B58)",brand:"aFe",cat:"intake",price:350,desc:"Sealed CAI. Turbo flutter sounds are incredible.",hp:10,tq:12,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"Easy install, huge sound improvement.",plats:["f30"]},
  {id:"b32",name:"VRSF Catless DP (B58)",brand:"VRSF",cat:"exhaust",price:400,desc:"4\" catless. Massive gains with tune. Off-road only.",hp:25,tq:30,ret:"VRSF",sk:4,time:2.5,tools:"15mm, O2 socket, PB Blaster, jack stands",notes:"Must have tune. Power gains are dramatic.",plats:["f30"]},
  {id:"b33",name:"VRSF Chargepipe + BOV",brand:"VRSF",cat:"engine",price:180,desc:"Aluminum charge pipe. Prevents cracking. BOV sounds are a bonus.",hp:0,tq:0,ret:"VRSF",sk:2,time:1,tools:"10mm, flathead, pliers",notes:"Prevents stock plastic from cracking. BOV sound is addictive.",plats:["f30"]},
  {id:"b34",name:"H&R Sport Springs (F30)",brand:"H&R",cat:"susp",price:280,desc:"1\" drop. Perfect daily stance.",hp:0,tq:0,ret:"FCP Euro",sk:3,time:3,tools:"Spring compressor, 16/18mm, jack stands",notes:"F30 looks much better lowered an inch.",plats:["f30"]},
  // F30 hidden
  {id:"jb8",name:"🏴‍☠️ Supra MK5 Parts Compatibility",brand:"Toyota/BMW",cat:"junk",price:0,desc:"The F30 340i and MK5 Supra share the B58 engine. Many Supra-specific performance parts fit the 340i: downpipes, charge pipes, intercooler piping. The Supra aftermarket is larger and more competitive, so sometimes Supra parts are CHEAPER than F30-specific parts. Check Supra parts before buying F30 parts.",hp:0,tq:0,ret:"Various",sk:1,time:0,tools:"None — research",notes:"Not a part — this is knowledge. The B58 in the 340i and Supra A90 is the same engine. PRL Supra downpipe? Check if it fits the 340i (it often does with minor modification). This cross-shopping hack saves money constantly.",plats:["f30"]},

  // ══════ SUBARU ══════
  {id:"s1",name:"COBB AccessPort V3",brand:"COBB",cat:"tune",price:650,desc:"The gateway. Fixes rev hang. NEVER run bolt-ons without this.",hp:25,tq:30,ret:"Amazon",sk:1,time:0.3,tools:"None — OBD2 plug-in",notes:"Start Stage 1 OTS, protune later. Non-negotiable on turbo Subarus.",plats:["gd","gr","va","lgt"]},
  {id:"s2",name:"K&N Drop-In Filter",brand:"K&N",cat:"intake",price:55,desc:"Drop-in replacement. More flow, ZERO tune needed. Safest first mod.",hp:2,tq:2,ret:"Amazon",sk:1,time:0.1,tools:"None",notes:"Pull old filter, drop this in. No tune required.",plats:["gd","gr","va","lgt"]},
  {id:"s3",name:"Grimmspeed Stealthbox Intake",brand:"Grimmspeed",cat:"intake",price:400,desc:"Enclosed CAI — best heat soak protection with max flow. Top-tier VA intake.",hp:8,tq:10,ret:"Grimmspeed",sk:1,time:0.5,tools:"10mm, flathead",notes:"Needs AP tune — use Stage 1+ OTS map or protune.",plats:["va"]},
  {id:"s4",name:"Nameless Axleback (5\" Muffler)",brand:"Nameless",cat:"exhaust",price:350,desc:"The boxer rumble amplified. No drone. No tune needed. Perfect daily tone.",hp:2,tq:2,ret:"Amazon",sk:2,time:1,tools:"14mm, jack stands",notes:"5-inch muffler = sweet spot. Loud enough to enjoy, quiet enough for daily.",plats:["va","gr"]},
  {id:"s5",name:"Remark Muffler Delete",brand:"Remark",cat:"exhaust",price:200,desc:"LOUD. The budget boxer rumble machine. No tune needed.",hp:1,tq:1,ret:"Amazon",sk:2,time:0.75,tools:"14mm, jack stands",notes:"Very loud cold start. Neighbors WILL know you left. Worth it.",plats:["va"]},
  {id:"s6",name:"Grimmspeed Catted J-Pipe",brand:"Grimmspeed",cat:"exhaust",price:900,desc:"Biggest single power mod. Unleashes the turbo. TUNE REQUIRED.",hp:25,tq:30,ret:"Grimmspeed",sk:4,time:3,tools:"14/17mm deep, O2 socket, PB Blaster, jack stands",notes:"Flash Stage 2 BEFORE first start. Hardest bolt-on on the WRX.",plats:["va","gr"]},
  {id:"s7",name:"Tomei Ti Catback",brand:"Tomei",cat:"exhaust",price:1050,desc:"Titanium. THE exhaust for serious Subaru people. Sound is legendary.",hp:5,tq:5,ret:"Amazon",sk:3,time:2,tools:"14mm, jack stands",notes:"Titanium exit tip turns colors with heat. Single-exit. Worth every penny.",plats:["gd","gr","va","lgt"]},
  {id:"s8",name:"Grimmspeed TMIC",brand:"Grimmspeed",cat:"ic",price:750,desc:"Top-mount IC upgrade. Drops temps 40-60°F. Keeps top-mount simplicity.",hp:10,tq:10,ret:"Grimmspeed",sk:3,time:2,tools:"10/12mm, flathead, pliers",notes:"Stock TMIC heat-soaks after one pull. This fixes it.",plats:["va","gr"]},
  {id:"s9",name:"Perrin Turbo Inlet Hose",brand:"Perrin",cat:"engine",price:75,desc:"Silicone replacement for crack-prone stock rubber. Prevents mystery boost leaks.",hp:0,tq:0,ret:"Amazon",sk:1,time:0.3,tools:"Flathead, pliers",notes:"Stock inlet cracks silently. Replace preventively. Cheap insurance.",plats:["gr","va","lgt"]},
  {id:"s10",name:"IAG AOS (Air/Oil Separator)",brand:"IAG",cat:"engine",price:350,desc:"Replaces PCV — prevents carbon buildup on FA20 valves. Essential for DI engine health.",hp:0,tq:0,ret:"IAG Performance",sk:3,time:2,tools:"10/12mm, pliers, coolant",notes:"The FA20 NEEDS this. Direct injection = carbon buildup on intake valves.",plats:["va"]},
  {id:"s11",name:"Whiteline Sway Bars (F+R)",brand:"Whiteline",cat:"susp",price:480,desc:"Best handling mod for any WRX. Kills understeer. Adjustable stiffness.",hp:0,tq:0,ret:"Amazon",sk:3,time:2.5,tools:"14/17mm, jack stands",notes:"Three adjustment positions. Start middle, go stiffer in rear to reduce understeer.",plats:["gd","gr","va","lgt"]},
  {id:"s12",name:"RCE Yellow Springs",brand:"RCE",cat:"susp",price:250,desc:"1\" drop, progressive. Most popular WRX spring. Sporty daily.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"Spring compressor, 17/19mm, jack stands",notes:"Best all-around lowering spring for daily WRX.",plats:["va"]},
  {id:"s13",name:"Kartboy Short Shifter",brand:"Kartboy",cat:"int",price:100,desc:"Shorter, precise throws. Transforms the mushy stock WRX shifter.",hp:0,tq:0,ret:"Amazon",sk:2,time:1.5,tools:"12/14mm, console tools",notes:"Stock WRX shifter = stirring oatmeal. This fixes it.",plats:["gd","gr","va","lgt"]},
  {id:"s14",name:"Perrin Shift Stop",brand:"Perrin",cat:"int",price:35,desc:"Removes 1-2 gate slop. $35 for a transformed shifter. Best value mod.",hp:0,tq:0,ret:"Amazon",sk:2,time:0.5,tools:"10mm, console tools",notes:"Adjust until precise but not binding. Most underrated Subaru mod.",plats:["va"]},
  {id:"s15",name:"ACT HD Street Clutch",brand:"ACT",cat:"clutch",price:450,desc:"Holds 350+ WHP, stock pedal feel. Go-to for modded WRX.",hp:0,tq:0,ret:"Amazon",sk:5,time:8,tools:"Trans jack, full socket set, torque wrench",notes:"Shop install ($500-800 labor). Don't wait until clutch is slipping.",plats:["va"]},
  // SUBARU JUNKYARD
  {id:"js1",name:"🏴‍☠️ STI Brake Swap (on WRX)",brand:"Subaru Junkyard",cat:"junk",price:350,desc:"STI Brembo front calipers + rotors bolt directly onto any WRX from 2002+. Transforms braking from adequate to incredible. Junkyard set: $200-400. This is the #1 junkyard swap in the entire Subaru community. Every WRX owner with a track day in their future does this.",hp:0,tq:0,ret:"Junkyard / eBay",sk:3,time:3,tools:"17mm, 14mm, brake line, brake fluid, new pads (Hawk HPS recommended)",notes:"STI Brembos are a direct bolt-on to WRX hubs — same spindle. You need the calipers, brackets, and rotors. Pads are specific to Brembo (Hawk HPS or StopTech). This swap has been documented since the WRX launched in 2002. Check NASIOC DIY thread.",plats:["gd","gr","va","lgt"]},
  {id:"js2",name:"🏴‍☠️ STI Pink Injectors on WRX",brand:"Subaru OEM",cat:"junk",price:80,desc:"The STI uses higher-flow 'pink' top-feed injectors (565cc) vs the WRX's lower-flow injectors. They're a direct swap on EJ WRX engines. Junkyard cost: $50-100 for a set of 4. This provides the fueling headroom needed for Stage 2 tunes without buying $400 aftermarket injectors.",hp:0,tq:0,ret:"Junkyard / eBay",sk:3,time:2,tools:"10mm, fuel rail removal, new O-rings ($10)",notes:"Known on NASIOC since 2003. STI pink injectors (denso 565cc) swap directly into WRX fuel rail. Requires an AccessPort tune adjusted for the larger injectors. This is the budget way to support 300+ WHP fueling on an EJ WRX.",plats:["gd","gr"]},
  {id:"js3",name:"🏴‍☠️ STI Rear Differential Swap (WRX)",brand:"Subaru Junkyard",cat:"junk",price:250,desc:"The WRX has an open rear diff. The STI has a Torsen limited-slip. The STI rear diff, axles, and rear subframe crossmember bolt directly into the WRX. Transforms corner exit traction from tire-spinning to planted. Junkyard cost: $200-350 for the complete setup.",hp:0,tq:0,ret:"Junkyard",sk:4,time:6,tools:"Full socket set, jack stands, diff fluid, axle removal tools",notes:"This swap has been done thousands of times. You need the STI rear diff, both rear axles (different spline count), and the crossmember. Full guides on NASIOC. The traction improvement is dramatic — especially in rain.",plats:["gd","gr","va","lgt"]},
  {id:"js4",name:"🏴‍☠️ Legacy GT / Forester XT Intercooler",brand:"Subaru Junkyard",cat:"junk",price:60,desc:"The 2005-2009 Legacy GT and 2004-2008 Forester XT use a larger top-mount intercooler than the WRX. It's a direct bolt-in swap with slightly better cooling capacity. Junkyard cost: $40-80. This is the free/cheap intercooler upgrade before spending $750 on a Grimmspeed TMIC.",hp:3,tq:3,ret:"Junkyard",sk:2,time:1,tools:"10mm, 12mm, pliers",notes:"Legacy GT TMIC is a direct swap to WRX. Slightly larger core, better cooling. Not as good as a proper aftermarket TMIC but it's essentially free. Known on NASIOC since the Legacy GT launched. Check your local Pull-A-Part — these are common.",plats:["gd","gr","va","lgt"]},

  // ═══════════════════════════════════════════════
  // NEW PARTS — EXPANDED CATALOG v2
  // Budget options marked with ⚠️ BUDGET in desc
  // ═══════════════════════════════════════════════

  // ── HONDA EG/EK EXPANDED ──
  {id:"h60",name:"eBay 4-1 Header (D-series)",brand:"OBX / Generic",cat:"exhaust",price:75,desc:"⚠️ BUDGET: Generic eBay 4-1 header. Half the price of DC Sports. Fitment can be hit-or-miss — you may need to massage the flange or shim the gasket. Welds are rougher than name brand. It works, but inspect it carefully before install.",hp:8,tq:5,ret:"eBay",sk:3,time:2.5,tools:"12mm, 14mm, penetrating oil, jack stands, new gasket",notes:"⚠️ Budget disclaimer: fitment is about 80% as good as DC Sports. You may need to file the flange flat or use a thicker gasket. Check welds for pinholes before install. That said, thousands have run these with no issues. If $175 for DC is too much, this gets the job done.",plats:["eg","ek","dc2"]},
  {id:"h61",name:"eBay Coilovers (EG/EK)",brand:"Rev9 / Godspeed",cat:"susp",price:280,desc:"⚠️ BUDGET: Generic coilovers — height adjustable but no damping adjustment. Ride quality is harsher than Tein. Seals can leak after 1-2 years of hard use. Fine for a street car, NOT recommended for track or spirited canyon driving.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"17/19mm, jack stands, spring compressor",notes:"⚠️ Budget disclaimer: these work for basic lowering but the damping is stiff and non-adjustable. They ride rougher than Tein and the seals are the weak point. For a show car or mild daily, they're fine. For any spirited driving, save up for the Tein Street Basis Z.",plats:["eg","ek","dc2"]},
  {id:"h62",name:"Progress Rear Sway Bar",brand:"Progress",cat:"susp",price:140,desc:"Adjustable rear sway bar — reduces understeer dramatically on FWD Hondas. One of the most underrated handling mods.",hp:0,tq:0,ret:"Amazon",sk:3,time:1.5,tools:"14mm, 17mm, jack stands",notes:"Makes the rear end rotate in corners. Start on the softest setting and work up.",plats:["eg","ek","dc2"]},
  {id:"h63",name:"Koni Yellow Adjustable Shocks (Set of 4)",brand:"Koni",cat:"susp",price:680,desc:"Adjustable damping shocks — the gold standard for EG/EK. Pair with lowering springs for a properly damped setup that rides well and handles great.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"17/19mm, spring compressor, jack stands",notes:"Koni Yellows with Eibach springs is THE combo that EG/EK track guys run. Adjustable rebound lets you tune the ride.",plats:["eg","ek","dc2"]},
  {id:"h64",name:"eBay Carbon Fiber Lip (EG/EK)",brand:"Generic",cat:"ext",price:60,desc:"⚠️ BUDGET: Generic CF-look front lip from eBay. It's not real carbon fiber — it's fiberglass with a CF wrap. Cracks easier than PU lips on speed bumps. Looks decent from 5 feet away.",hp:0,tq:0,ret:"eBay",sk:2,time:1,tools:"Self-tappers, drill",notes:"⚠️ Budget disclaimer: this is fiberglass, not real CF or PU. It WILL crack if you hit a speed bump hard. Fine for show cars or careful daily drivers. For actual driving, get a PU lip instead.",plats:["eg","ek","dc2"]},

  // ── HONDA 8TH/9TH GEN EXPANDED ──
  {id:"h65",name:"K&N Drop-In Filter (K20/K24)",brand:"K&N",cat:"intake",price:50,desc:"Drop-in replacement filter — zero tune needed. More flow than stock paper filter. The safest first mod that requires zero commitment.",hp:2,tq:1,ret:"Amazon",sk:1,time:0.1,tools:"None",notes:"Pull out old filter, drop this in. Can be cleaned and reused. Good for 100k miles.",plats:["8g","9g"]},
  {id:"h66",name:"eBay Short Ram Intake (8th/9th)",brand:"Generic",cat:"intake",price:45,desc:"⚠️ BUDGET: Basic short ram intake — open cone filter on a pipe. Adds intake noise but minimal real flow gains. No heat shield means hot air in summer.",hp:3,tq:2,ret:"eBay",sk:1,time:0.3,tools:"10mm",notes:"⚠️ Budget disclaimer: these lack a proper heat shield so you're sucking hot engine bay air. Power gains are minimal. The sound is the main benefit. Save up for a proper CAI with sealed airbox if you want real gains.",plats:["8g","9g"]},
  {id:"h67",name:"Skunk2 Alpha Header (K20)",brand:"Skunk2",cat:"exhaust",price:550,desc:"Premium 4-2-1 header for K20Z3 — larger primaries than PLM, better build quality. The best header money can buy for 8th gen.",hp:18,tq:10,ret:"Amazon",sk:4,time:3,tools:"14mm deep, O2 socket, penetrating oil, jack stands",notes:"More expensive than PLM but better fitment and longer-lasting coating. Worth the premium if you can afford it. Tune required.",plats:["8g"]},
  {id:"h68",name:"Tein Flex Z Coilovers (8th/9th)",brand:"Tein",cat:"susp",price:750,desc:"16-way damping adjustable. Solid mid-range coilover — better than eBay, more affordable than BC Racing.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"17/19mm, breaker bar, jack stands, torque wrench",notes:"Good middle ground. Better ride quality than budget coilovers, adjustable enough for autocross. Tein warranty is solid.",plats:["8g","9g"]},
  {id:"h69",name:"Hybrid Racing Short Shifter (K-series)",brand:"Hybrid Racing",cat:"int",price:250,desc:"Premium short shifter assembly — reduces throw by 40%. The best shifter mod for K-series cars. Buttery smooth.",hp:0,tq:0,ret:"Hybrid Racing",sk:3,time:2,tools:"12mm, 14mm, console removal tools",notes:"Expensive but the shift feel is on another level. Makes the K-series 6-speed feel like a rifle bolt.",plats:["8g","9g"]},

  // ── HONDA 10TH GEN EXPANDED ──
  {id:"h70",name:"eBay Intercooler (10th Gen)",brand:"Rev9 / Generic",cat:"ic",price:200,desc:"⚠️ BUDGET: Generic front-mount or upgraded stock-location IC from eBay. About 60% of the cooling capacity of PRL. Fitment may require minor modification. End tanks can crack under high boost.",hp:5,tq:8,ret:"eBay",sk:3,time:2.5,tools:"10/12mm, pliers, trimming tools",notes:"⚠️ Budget disclaimer: these work for mild Stage 1 builds but the end tanks are the weak point. If you're running a downpipe + aggressive tune, spend the money on PRL. For a stock turbo with just a tune, these are adequate.",plats:["10g"]},
  {id:"h71",name:"RV6 Catted Downpipe",brand:"RV6",cat:"exhaust",price:450,desc:"High-flow catted downpipe — slightly cheaper than MAPerformance with comparable quality. Good reputation in the Civic community.",hp:22,tq:28,ret:"RV6 Performance",sk:4,time:3,tools:"14mm deep, O2 socket, penetrating oil, jack stands",notes:"Similar to MAP DP. Tune required. RV6 has been making Honda parts for years — good quality.",plats:["10g"]},
  {id:"h72",name:"PRL Motorsports Downpipe",brand:"PRL Motorsports",cat:"exhaust",price:550,desc:"Premium catted downpipe — best fitment and build quality for 10th gen. V-band connections make install slightly easier.",hp:25,tq:32,ret:"PRL Direct",sk:4,time:2.5,tools:"14mm deep, O2 socket, penetrating oil, jack stands",notes:"Most expensive DP option but best fitment. V-band connections are nicer to work with than flange bolts. Tune required.",plats:["10g"]},
  {id:"h73",name:"Tein Flex Z Coilovers (10th Gen)",brand:"Tein",cat:"susp",price:800,desc:"16-way adjustable. Good middle ground between Eibach springs and BC Racing. Daily-friendly with track capability.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"17/19mm, breaker bar, jack stands, torque wrench",notes:"The sweet spot if BC Racing is too expensive. Tein has great warranty support and the ride quality is solid.",plats:["10g"]},
  {id:"h74",name:"eBay Coilovers (10th Gen)",brand:"Godspeed / Rev9",cat:"susp",price:350,desc:"⚠️ BUDGET: Generic height-adjustable coilovers. No damping adjustment. Ride is stiff and bouncy compared to name brands. Fine for stance, not great for performance.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"17/19mm, breaker bar, jack stands, torque wrench",notes:"⚠️ Budget disclaimer: you get what you pay for. These lower the car and that's about it. The damping is too stiff for comfort and too uncontrolled for track. If you just want the car lower for looks, they work. For actual handling, save for Tein or BC.",plats:["10g"]},
  {id:"h75",name:"OEM Type R Front Lip (10th Gen)",brand:"Honda OEM",cat:"ext",price:280,desc:"Genuine Honda Type R front lip — perfect fitment, OEM paint-matchable, durable ABS construction. The premium choice.",hp:0,tq:0,ret:"Honda dealer / eBay",sk:2,time:1,tools:"10mm, clips",notes:"More expensive than Bayson R but the fitment is flawless. OEM quality, won't crack on speed bumps.",plats:["10g"]},
  {id:"h76",name:"Mishimoto Radiator (10th Gen 1.5T)",brand:"Mishimoto",cat:"ic",price:350,desc:"Aluminum radiator upgrade — better cooling capacity for tuned cars. Not strictly necessary on stock power but provides headroom.",hp:0,tq:0,ret:"Amazon",sk:3,time:2,tools:"10mm, Phillips, drain pan, new coolant",notes:"More of a preventive/supporting mod. If you're full bolt-on with a tune, the extra cooling headroom is nice to have.",plats:["10g"]},

  // ── BMW E36 EXPANDED ──
  {id:"b40",name:"eBay Cold Air Intake (E36)",brand:"Generic",cat:"intake",price:45,desc:"⚠️ BUDGET: Basic cone filter on a pipe. Adds I6 intake sound but has zero heat shielding. Hot air = less power in summer. Fine for sound, not for performance.",hp:3,tq:2,ret:"eBay",sk:1,time:0.3,tools:"10mm, flathead",notes:"⚠️ Budget disclaimer: no heat shield means you're breathing hot engine bay air. The sound is great but real power gains are negligible. If you want actual performance, get the aFe with heat shield.",plats:["e36"]},
  {id:"b41",name:"Supersprint Headers (E36 M3)",brand:"Supersprint",cat:"exhaust",price:900,desc:"Premium equal-length headers for S52/S50. Significant power gains on the M3 platform. Euro-quality construction.",hp:15,tq:12,ret:"FCP Euro",sk:4,time:4,tools:"13mm, 15mm, O2 socket, penetrating oil, jack stands",notes:"Expensive but transforms the M3's top-end power. FCP Euro lifetime warranty applies. Tune recommended.",plats:["e36"]},
  {id:"b42",name:"eBay Coilovers (E36)",brand:"Godspeed / Rev9",cat:"susp",price:300,desc:"⚠️ BUDGET: Generic E36 coilovers. Height adjustable, no damping adjustment. Ride quality is harsh. Seals leak after 6-12 months of spirited use. Absolutely NOT suitable for drifting or track.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"16/18mm, spring compressor, jack stands",notes:"⚠️ Budget disclaimer: these will blow out if you drift on them. They're for lowering a street car only. For any performance driving, spend on Raceland minimum or save for BC Racing. Cheap coilovers on E36s are the #1 thing experienced BMW guys warn about.",plats:["e36"]},
  {id:"b43",name:"Condor Speed Shop Short Shifter (E36)",brand:"Condor Speed Shop",cat:"int",price:185,desc:"The best short shifter for E36. Reduces throw ~40%, adjustable, solid build. Better feel than any UUC or eBay option.",hp:0,tq:0,ret:"Condor Speed Shop",sk:2,time:1.5,tools:"13mm, 10mm, shifter boot removal",notes:"Premium option but the shift feel is incredible. Way better than the junkyard Z3 shifter swap if you want the best.",plats:["e36"]},
  {id:"b44",name:"Aluminum Expansion Tank (E36)",brand:"Mishimoto",cat:"ic",price:80,desc:"Aluminum replacement for the PLASTIC factory expansion tank that WILL crack and spray coolant everywhere. Non-negotiable cooling system fix.",hp:0,tq:0,ret:"Amazon",sk:2,time:0.5,tools:"10mm, pliers, coolant",notes:"The stock plastic tank gets brittle from heat cycling and cracks without warning. This is a $80 fix for a problem that causes $3,000+ in engine damage. Do this WITH the radiator swap.",plats:["e36"]},

  // ── BMW E46 EXPANDED ──
  {id:"b45",name:"K&N Drop-In Filter (E46)",brand:"K&N",cat:"intake",price:50,desc:"Drop-in panel filter replacement — more flow, washable/reusable. Zero tune needed. The safest first mod.",hp:2,tq:1,ret:"Amazon",sk:1,time:0.1,tools:"None",notes:"Pull airbox lid, swap filter, close lid. 2 minutes. Subtle improvement but free power.",plats:["e46"]},
  {id:"b46",name:"UUC Motorwerks Short Shifter (E46)",brand:"UUC",cat:"int",price:260,desc:"Premium short shifter — the gold standard for E46. Reduces throw 35%, precise, no slop. Includes DSSR (double shear shift rod).",hp:0,tq:0,ret:"UUC Motorwerks",sk:2,time:1.5,tools:"13mm, 10mm, shifter boot removal",notes:"The UUC SSK has been the #1 E46 shifter mod for 20+ years. The DSSR eliminates the factory single-shear weak point.",plats:["e46"]},
  {id:"b47",name:"BC Racing BR Coilovers (E46)",brand:"BC Racing",cat:"susp",price:1050,desc:"30-way damping adjustable. The E46 chassis responds incredibly well to proper coilovers. Magic handling.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"16/18mm, breaker bar, jack stands, torque wrench",notes:"Check subframe mounting points BEFORE installing coilovers. If the subframe is cracked, fix that first. Pro alignment mandatory.",plats:["e46"]},
  {id:"b48",name:"Aluminum Expansion Tank (E46)",brand:"Mishimoto",cat:"ic",price:90,desc:"Same story as E36 — replaces the plastic time bomb. The stock expansion tank is the most common failure point on E46s.",hp:0,tq:0,ret:"Amazon",sk:2,time:0.5,tools:"10mm, pliers, coolant",notes:"Do this with the radiator swap. The stock plastic tank gets brittle and cracks — usually on the hottest day of the year.",plats:["e46"]},

  // ── BMW E9X EXPANDED ──
  {id:"b50",name:"aFe Intake (N54) - Full Kit",brand:"aFe",cat:"intake",price:350,desc:"Full sealed cold air intake with carbon fiber box. Better heat shielding than BMS dual cone. The premium intake option.",hp:10,tq:12,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"More expensive than BMS but properly sealed from engine heat. Better for track use and hot climates.",plats:["e9x","e82"]},
  {id:"b51",name:"eBay Catless Downpipes (N54)",brand:"Generic",cat:"exhaust",price:200,desc:"⚠️ BUDGET: Generic catless downpipes — half the price of CTS Turbo. Fitment is rougher and hardware quality is lower. Welds should be inspected. May develop exhaust leaks at flanges.",hp:25,tq:28,ret:"eBay",sk:4,time:3,tools:"13/15mm deep, O2 socket, PB Blaster, jack stands",notes:"⚠️ Budget disclaimer: you get about 85% of the performance of CTS for half the price. The risk is fitment — you may need to port-match the flanges or re-weld a joint. If you're handy, it's fine. If not, spend the extra $250 on CTS. Off-road only. Tune required.",plats:["e9x","e82"]},
  {id:"b52",name:"BC Racing BR Coilovers (E9X)",brand:"BC Racing",cat:"susp",price:1150,desc:"30-way damping adjustable. Transforms the E90/E92 from soft luxury car to canyon carver.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"16/18mm, breaker bar, jack stands, torque wrench",notes:"Pro alignment mandatory. Start with softer damping and work up. These cars are heavy — the BC valving handles it well.",plats:["e9x","e82"]},
  {id:"b53",name:"eBay Intercooler (N54)",brand:"Rev9 / Generic",cat:"ic",price:300,desc:"⚠️ BUDGET: Generic FMIC for N54 — about 70% of Wagner's cooling capacity. Fitment requires more work. Core quality is decent but end tank welds are the concern.",hp:8,tq:8,ret:"eBay",sk:4,time:4,tools:"T25/T30, 10/13mm, drain pan",notes:"⚠️ Budget disclaimer: works for Stage 1-2 on pump gas. For E85 or high-boost setups, spend the money on Wagner. The core is usually fine but the end tanks and piping can be problematic. Check for boost leaks after install.",plats:["e9x","e82"]},
  {id:"b54",name:"N54 Oil Filter Housing Gasket Kit",brand:"BMW OEM / Victor Reinz",cat:"engine",price:25,desc:"Replacement gasket for the OFHG that leaks coolant into oil on every N54 ever made. This is maintenance, not a mod — but if you don't do it, your engine dies.",hp:0,tq:0,ret:"Amazon",sk:3,time:2,tools:"36mm socket, 10mm, oil filter housing removal",notes:"The OFHG leak is the #1 maintenance item on N54. If you see coolant mixing with oil (milky residue on oil cap), this is the cause. FCP Euro has lifetime warranty on this part. Do it proactively.",plats:["e9x","e82"]},
  {id:"b55",name:"N54 Water Pump + Thermostat Kit",brand:"Pierburg / Wahler",cat:"engine",price:200,desc:"Electric water pump + thermostat replacement. The stock pump fails between 60-80k miles with zero warning. Engine overheats in minutes when it fails.",hp:0,tq:0,ret:"FCP Euro",sk:3,time:2.5,tools:"T45 Torx, 10mm, coolant, drain pan",notes:"Preventive replacement. If your N54 is over 60k and this hasn't been done, it's a ticking time bomb. FCP Euro lifetime warranty — if it fails again, free replacement.",plats:["e9x","e82"]},

  // ── BMW F30 EXPANDED ──
  {id:"b56",name:"MHD Stage 1 (B58) - Budget",brand:"MHD Flasher",cat:"tune",price:100,desc:"Budget flash tune for B58 — similar gains to BM3 at 1/5 the price. Android or Windows. Great starting point.",hp:70,tq:75,ret:"MHD Flasher",sk:1,time:0.3,tools:"Phone/laptop, OBD2 adapter",notes:"MHD is slightly cheaper than BM3 but has a different interface. Both are excellent — pick based on platform preference.",plats:["f30"]},
  {id:"b57",name:"VRSF Catback Exhaust (F30)",brand:"VRSF",cat:"exhaust",price:700,desc:"Full catback exhaust — deeper tone, more aggressive than stock but not obnoxious. Good fitment, stainless construction.",hp:5,tq:5,ret:"VRSF",sk:3,time:2,tools:"13/15mm, jack stands",notes:"No tune needed for catback. Sounds incredible with the B58. The straight-6 tone comes alive.",plats:["f30"]},
  {id:"b58p",name:"eBay Catback (F30)",brand:"Generic",cat:"exhaust",price:250,desc:"⚠️ BUDGET: Generic stainless catback. Louder than VRSF, less refined. Fitment may need adjustment. Raspy at high RPM.",hp:3,tq:3,ret:"eBay",sk:3,time:2,tools:"13/15mm, jack stands",notes:"⚠️ Budget disclaimer: expect drone at highway speeds and rasp above 5k RPM. Fitment is 80% — you may need to adjust hangers. For the price, it's fine if you just want some sound. VRSF is worth the premium for daily driving.",plats:["f30"]},
  {id:"b59",name:"BC Racing BR Coilovers (F30)",brand:"BC Racing",cat:"susp",price:1200,desc:"30-way adjustable. Great for the F30 chassis — transforms handling from soft luxury to proper sport sedan.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"16/18mm, breaker bar, jack stands, torque wrench",notes:"The F30 is sensitive to suspension quality — BC is the minimum recommended brand. Cheaper coilovers ride terribly on this chassis.",plats:["f30"]},

  // ── SUBARU EXPANDED ──
  {id:"s20",name:"eBay Catback (WRX/STI)",brand:"Generic",cat:"exhaust",price:180,desc:"⚠️ BUDGET: Generic stainless catback. Has the boxer rumble but the sound quality is rougher than Nameless or Tomei. Fitment varies. Hangers may not align perfectly.",hp:2,tq:2,ret:"eBay",sk:3,time:2,tools:"14mm, jack stands",notes:"⚠️ Budget disclaimer: it rumbles but it's not refined. Expect rasp and some drone. The tips may not be perfectly centered. For the price it makes noise, but Nameless or Invidia R400 are significantly better sounding and fitting.",plats:["va","gr"]},
  {id:"s21b",name:"Invidia R400 Catback",brand:"Invidia",cat:"exhaust",price:650,desc:"Dual-tip stainless catback — deeper than axleback, less extreme than Tomei. Great all-rounder for daily + spirited driving.",hp:3,tq:3,ret:"Amazon",sk:3,time:2,tools:"14mm, jack stands",notes:"The middle ground between muffler delete and full titanium. No drone at cruise, great sound under load.",plats:["va","gr"]},
  {id:"s22b",name:"Invidia N1 Catback",brand:"Invidia",cat:"exhaust",price:450,desc:"Single-exit catback — louder than R400, iconic Invidia N1 sound. Stainless construction, good fitment.",hp:3,tq:3,ret:"Amazon",sk:3,time:2,tools:"14mm, jack stands",notes:"The N1 sound is iconic in the Subaru world. Louder than R400 but not as loud as muffler delete.",plats:["gd","gr","va","lgt"]},
  {id:"s23b",name:"COBB Downpipe (WRX)",brand:"COBB",cat:"exhaust",price:750,desc:"COBB catted J-pipe — comes with matching OTS maps on the AccessPort. Easiest downpipe install because the tune is already loaded.",hp:22,tq:28,ret:"COBB",sk:4,time:3,tools:"14/17mm deep, O2 socket, PB Blaster, jack stands",notes:"More expensive than Grimmspeed but the included OTS maps make it plug-and-play with COBB AP. Flash Stage 2 before first start.",plats:["va"]},
  {id:"s24b",name:"eBay Downpipe (WRX/STI)",brand:"Generic",cat:"exhaust",price:200,desc:"⚠️ BUDGET: Generic catless J-pipe. MASSIVE risk on Subarus — bad fitment can cause exhaust leaks that trigger knock and damage the engine. NOT recommended on EJ engines.",hp:18,tq:22,ret:"eBay",sk:4,time:3,tools:"14/17mm deep, O2 socket, PB Blaster, jack stands",notes:"⚠️ SERIOUS BUDGET WARNING: on Subarus specifically, cheap downpipes are dangerous. Exhaust leaks near the O2 sensor cause false readings, which causes bad fueling, which causes knock on EJ engines. Knock kills EJs. Spend the money on Grimmspeed or COBB. This is not the part to cheap out on.",plats:["va","gr"]},
  {id:"s25b",name:"eBay Coilovers (WRX/STI)",brand:"Godspeed / Rev9",cat:"susp",price:400,desc:"⚠️ BUDGET: Generic WRX coilovers. Height adjustable, no damping control. Ride is harsh. Fine for lowering, not for performance.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"17/19mm, breaker bar, jack stands, torque wrench",notes:"⚠️ Budget disclaimer: the WRX is a heavy AWD car — cheap coilovers can't handle the weight well. The ride quality suffers badly and they wear out fast. BC Racing ($1100) is a much better investment. If BC is too much, RCE springs ($250) on stock struts are a better budget option.",plats:["gd","gr","va","lgt"]},
  {id:"s26b",name:"Exedy Stage 1 Clutch",brand:"Exedy",cat:"clutch",price:280,desc:"OEM+ organic clutch — holds about 300WHP with stock-like pedal feel. Budget alternative to ACT for Stage 1 builds.",hp:0,tq:0,ret:"Amazon",sk:5,time:8,tools:"Trans jack, full socket set, alignment tool, torque wrench",notes:"Great for Stage 1 power levels. If you're going Stage 2 or making over 300WHP, step up to the ACT HD. Shop install recommended.",plats:["gd","gr","va","lgt"]},
  {id:"s27b",name:"Mishimoto Radiator (WRX/STI)",brand:"Mishimoto",cat:"ic",price:280,desc:"Aluminum radiator — better cooling capacity than stock plastic-tank radiator. Good supporting mod for tuned cars.",hp:0,tq:0,ret:"Amazon",sk:3,time:2,tools:"10mm, Phillips, drain pan, coolant",notes:"Not strictly necessary for Stage 1 but good insurance for Stage 2 builds. The stock radiator's plastic end tanks can crack over time.",plats:["gd","gr","va","lgt"]},
  {id:"s28",name:"OLM Rain Guards (Window Visors)",brand:"OLM",cat:"ext",price:45,desc:"Window deflectors — lets you crack windows in rain without getting wet. Subtle cosmetic improvement. Very popular on WRX.",hp:0,tq:0,ret:"Amazon",sk:1,time:0.5,tools:"Rubbing alcohol, included 3M tape",notes:"Clean the door frame with alcohol, stick them on. That's it. Most popular exterior accessory on VA WRX.",plats:["va"]},
  {id:"s29",name:"Subispeed Switchback LED C-Lights",brand:"SubiSpeed",cat:"ext",price:120,desc:"LED C-light replacement for the boring stock halogen DRL. White DRL + amber turn signal. Transforms the front end at night.",hp:0,tq:0,ret:"Amazon",sk:2,time:1,tools:"Phillips, 10mm, bumper clip removal tool",notes:"One of the best visual mods for VA WRX. The stock halogen C-lights look yellow and dim. These are a huge upgrade.",plats:["va"]},
  {id:"s30",name:"Fumoto Oil Drain Valve",brand:"Fumoto",cat:"engine",price:28,desc:"Replaces the oil drain bolt with a valve — makes oil changes tool-free and mess-free. The best $28 you'll spend.",hp:0,tq:0,ret:"Amazon",sk:2,time:0.5,tools:"Wrench for initial install",notes:"Install once, never need a wrench for oil changes again. Flip the valve, oil drains. Close it, done. Works on any car.",plats:["gd","gr","va","lgt","eg","ek","dc2","prelude","s2k","accord2t","fit","accord_v6","8g","9g","10g","e30","e36","e46","e82","e9x","f30","brz","miata_na","miata_nb","ms3","speed6","rx7_fc","rx8","mr2_sw20","celica_gts","z33","z32","s_chassis","sentra_ser","altima","mustang_s197","camaro","cobalt_ss","g8_gt","mk6_gti","mk7_gti","jetta_gli","golf_r32"]},

  // ═══════════════════════════════════════════════
  // CATALOG EXPANSION v3 — Tires, Wheels, Ext, Int, Clutch
  // ═══════════════════════════════════════════════

  // ── TIRES — every platform needs options ──
  {id:"t1",name:"Hankook Ventus RS4 195/50R15 (×4)",brand:"Hankook",cat:"tires",price:360,desc:"200-treadwear street-legal semi-slick. Better than Federal for grip, longer lasting. The autocross weapon.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"Summer only. 200TW so legal for most autocross classes. Incredible grip on lightweight Hondas.",plats:["eg","ek","dc2"]},
  {id:"t2",name:"Falken RT660 195/50R15 (×4)",brand:"Falken",cat:"tires",price:420,desc:"Premium 200TW tire — the best grip money can buy in 15\". Used by competitive autocross and time attack builds.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"If you're serious about grip, these are the endgame for 15\" wheels. Summer only.",plats:["eg","ek","dc2"]},
  {id:"t3",name:"eBay Budget Tires 195/50R15 (×4)",brand:"Nankang / Achilles",cat:"tires",price:160,desc:"⚠️ BUDGET: Cheap all-season or summer tires. They hold air and they're round. Grip is mediocre. Fine for daily driving, not for spirited anything.",hp:0,tq:0,ret:"Amazon",sk:1,time:0,tools:"None — shop mount",notes:"⚠️ Budget disclaimer: you get what you pay for in tires more than any other part. These are fine for going to work but if you push them in corners they'll let go with minimal warning. Save up for Federals minimum.",plats:["eg","ek","dc2"]},
  {id:"t4",name:"Continental ECS02 225/40R18 (×4)",brand:"Continental",cat:"tires",price:700,desc:"Max performance summer — the tire most 8th/9th gen Si owners upgrade to. Massive grip improvement over stock.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"Summer only. Night-and-day improvement over stock tires. AWD traction joke aside, these transform FWD grip.",plats:["8g","9g"]},
  {id:"t5",name:"Firestone Firehawk Indy 500 225/40R18 (×4)",brand:"Firestone",cat:"tires",price:440,desc:"Budget performance tire — 80% of Continental grip for 60% of the price. Great value for daily + fun.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"Excellent wet and dry grip for the money. A clear step up from stock without breaking the bank.",plats:["8g","9g"]},
  {id:"t6",name:"Firestone Indy 500 245/40R18 (×4)",brand:"Firestone",cat:"tires",price:480,desc:"Budget performance summer tire — great grip for the price. The value king for 10th gen.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"About 80% of Continental ECS02 grip at 60% of the price. Great if Continental is too expensive.",plats:["10g"]},
  {id:"t7",name:"Michelin Pilot Sport 4S 245/40R18 (×4)",brand:"Michelin",cat:"tires",price:980,desc:"The best street tire money can buy. Period. Insane wet and dry grip, long-wearing for a performance tire.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"Premium price but premium everything. These last longer than Continental while gripping better in the wet. The tire that every reviewer calls the best.",plats:["10g","e9x","f30"]},
  {id:"t8",name:"Continental ECS02 255/35R18 (×4)",brand:"Continental",cat:"tires",price:800,desc:"Max performance summer for BMW/Subaru 18\" setups. Excellent balanced grip.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"Great all-around performance tire. Summer only.",plats:["e9x","f30","va"]},
  {id:"t9",name:"Firestone Indy 500 255/35R18 (×4)",brand:"Firestone",cat:"tires",price:520,desc:"Budget performance alternative to Continental in 255 width. Good grip at a fair price.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"Solid value. Good for daily driving with occasional spirited use.",plats:["e9x","f30","va"]},
  {id:"t10",name:"Michelin Pilot Sport 4S 255/35R18 (×4)",brand:"Michelin",cat:"tires",price:1040,desc:"The endgame tire. Best wet and dry grip available. Long-wearing. Worth the premium.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"If you can afford them, buy them. They outperform everything else in wet conditions while matching dry grip.",plats:["e9x","f30","va"]},
  {id:"t11",name:"Nankang NS-2R 225/45R17 (×4)",brand:"Nankang",cat:"tires",price:320,desc:"⚠️ BUDGET: Budget semi-slick. Decent dry grip for the money. Wet grip is poor. Wears fast but cheap to replace.",hp:0,tq:0,ret:"Amazon",sk:1,time:0,tools:"None — shop mount",notes:"⚠️ Budget disclaimer: great dry grip for the price but they're scary in the rain. Not recommended as your only set of tires if you drive in wet weather. Good for track/autocross only.",plats:["e36","e46"]},
  {id:"t12",name:"Federal 595 RS-RR 225/45R17 (×4)",brand:"Federal",cat:"tires",price:380,desc:"Budget semi-slick for BMW 17\" setups. Amazing dry grip, decent wet. The grassroots racer's tire.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"Same as the 15\" version but for BMW fitment. Incredible bang-for-buck grip.",plats:["e36","e46"]},
  {id:"t13",name:"Continental ECS02 225/45R17 (×4)",brand:"Continental",cat:"tires",price:640,desc:"Max performance summer for BMW 17\" setups. Great balance of grip, comfort, and longevity.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"The premium choice for daily-driven BMWs with 17\" wheels.",plats:["e36","e46"]},
  {id:"t14",name:"Continental ECS02 265/35R18 (×4)",brand:"Continental",cat:"tires",price:860,desc:"Wide max performance summer for GD/GR WRX/STI. Fills out the fenders on 18\" wheels.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"If you're running 18x9.5 wheels on a WRX/STI, this is the tire size. Summer only. AWD + wide tires = insane grip.",plats:["gd","gr"]},

  // ── WHEELS — more options per platform ──
  {id:"w1",name:"Rota Slipstream 15x7 +40 (×4)",brand:"Rota",cat:"wheels",price:420,desc:"⚠️ BUDGET: Cast wheels — heavier than Konig but cheaper. Known as 'Reps' in the Honda community. Fine for street, not ideal for track.",hp:0,tq:0,ret:"Amazon",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"⚠️ Budget disclaimer: cast wheels are heavier and can crack under hard impacts. For daily driving they're fine. For autocross or track, spend on flow-formed (Konig) or forged (Enkei).",plats:["eg","ek","dc2"]},
  {id:"w2",name:"Enkei RPF1 15x7 +41 (×4)",brand:"Enkei",cat:"wheels",price:1100,desc:"Forged lightweight legend in 15\". The gold standard. Nothing beats RPF1 for weight savings.",hp:0,tq:0,ret:"Fitment Industries",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"The lightest option available. Expensive but the weight savings improve everything — acceleration, braking, turn-in.",plats:["eg","ek","dc2"]},
  {id:"w3",name:"Rota Grid 17x8 +35 (×4)",brand:"Rota",cat:"wheels",price:550,desc:"⚠️ BUDGET: Cast 17\" wheels. Heavier than flow-formed options but affordable. Popular fitment for 8th/9th gen.",hp:0,tq:0,ret:"eBay",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"⚠️ Budget disclaimer: same cast wheel warning as other Rotas. Fine for street, not ideal for hard driving.",plats:["8g","9g"]},
  {id:"w4",name:"Konig Dekagram 17x8 +40 (×4)",brand:"Konig",cat:"wheels",price:720,desc:"Flow-formed lightweight. Modern design, great weight, good price point. Popular 8th/9th gen choice.",hp:0,tq:0,ret:"Fitment Industries",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"A great alternative to RPF1 with a more modern look. Flow-formed construction keeps weight low.",plats:["8g","9g"]},
  {id:"w5",name:"Konig Dekagram 18x8.5 +40 (×4)",brand:"Konig",cat:"wheels",price:850,desc:"Flow-formed 18\" option for 10th gen. Light, affordable, aggressive fitment.",hp:0,tq:0,ret:"Fitment Industries",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"Great balance of weight, looks, and price for 10th gen. Hub-centric rings needed.",plats:["10g"]},
  {id:"w6",name:"Apex ARC-8 17x8 +20 (×4)",brand:"Apex",cat:"wheels",price:980,desc:"Flow-formed BMW-specific. Classic motorsport design. One of the most popular wheels in the BMW community.",hp:0,tq:0,ret:"Apex Race Parts",sk:1,time:0.5,tools:"17mm socket, torque wrench",notes:"Direct BMW bolt pattern. No adapters needed. 17\" clears most brake setups including M3 Brembos.",plats:["e36","e46","e9x"]},
  {id:"w7",name:"eBay Replica Wheels 17x8 (×4)",brand:"Generic",cat:"wheels",price:350,desc:"⚠️ BUDGET: Replica/knockoff wheels. They look like popular designs but use cheap cast construction. Can crack under hard impacts or potholes.",hp:0,tq:0,ret:"eBay",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"⚠️ SERIOUS BUDGET WARNING: replica wheels are cast from lower-grade aluminum and have thinner spokes. They look fine parked but they can crack at speed, which is extremely dangerous. For a show car that barely drives, they're okay. For any real driving, spend on proper wheels.",plats:["e36","e46","e9x","f30"]},
  {id:"w8",name:"Apex EC-7R 18x9 +42 (×4)",brand:"Apex",cat:"wheels",price:1600,desc:"Premium flow-formed. Wider fitment for aggressive F30 builds. Motorsport-proven, excellent quality.",hp:0,tq:0,ret:"Apex Race Parts",sk:1,time:0.5,tools:"17mm socket, torque wrench",notes:"The premium choice for F30. Fills the fenders perfectly. Direct BMW bolt pattern.",plats:["f30"]},
  {id:"w9",name:"Enkei RPF1 18x9.5 +38 (×4)",brand:"Enkei",cat:"wheels",price:1500,desc:"The forged gold standard for Subaru. Aggressive fitment that fills the WRX/STI fenders perfectly.",hp:0,tq:0,ret:"Fitment Industries",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"56.1mm bore — hub-centric rings mandatory. 18x9.5 +38 is the go-to aggressive WRX fitment.",plats:["gd","gr","va","lgt"]},
  {id:"w10",name:"Rota Grid 18x9.5 +38 (×4)",brand:"Rota",cat:"wheels",price:600,desc:"⚠️ BUDGET: Cast replica wheels in popular Subaru fitment. Heavy but affordable.",hp:0,tq:0,ret:"eBay",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"⚠️ Budget disclaimer: the Subaru community has strong opinions about Rotas. They work for daily driving but the weight negates some of the handling improvement. Save for Konig or Enkei if you can.",plats:["gd","gr","va","lgt"]},
  {id:"w11",name:"Option Lab R716 18x8.5 +35 (×4)",brand:"Option Lab",cat:"wheels",price:950,desc:"Flow-formed modern design. Growing in popularity for Subaru builds. Great weight and fitment.",hp:0,tq:0,ret:"Fitment Industries",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"Great option if you want something different from the RPF1/Gram Lights crowd. Hub-centric rings needed.",plats:["va"]},

  // ── EXTERIOR — more options ──
  {id:"x1",name:"eBay Rear Spoiler/Wing (EG Hatch)",brand:"Generic",cat:"ext",price:80,desc:"⚠️ BUDGET: Fiberglass rear spoiler. Fitment varies, may need filler and paint. It's $80 — set expectations accordingly.",hp:0,tq:0,ret:"eBay",sk:2,time:1.5,tools:"Drill, self-tappers, body filler",notes:"⚠️ Budget disclaimer: eBay fiberglass aero is a gamble. Some fit great, some need hours of bodywork. Read reviews carefully.",plats:["eg","ek","dc2"]},
  {id:"x2",name:"JDM Yellow Fog Lights (EK)",brand:"Honda OEM (JDM)",cat:"ext",price:120,desc:"JDM yellow fog light lenses — the classic 90s Honda look. Direct swap for USDM clear lenses.",hp:0,tq:0,ret:"eBay",sk:1,time:0.5,tools:"Phillips screwdriver",notes:"The JDM yellow fogs are an iconic look on EK hatches. Easy lens swap, huge visual impact.",plats:["ek"]},
  {id:"x3",name:"Mugen-Style Rear Lip (10th Gen)",brand:"Aftermarket",cat:"ext",price:180,desc:"Mugen-style rear bumper lip. Adds an aggressive look to the rear without a full bumper swap. PU construction.",hp:0,tq:0,ret:"eBay",sk:2,time:1,tools:"Self-tappers, 3M tape",notes:"Pairs well with the Bayson R front lip for a balanced OEM+ look.",plats:["10g"]},
  {id:"x4",name:"Duckbill Trunk Spoiler (10th Gen)",brand:"Various",cat:"ext",price:95,desc:"Adhesive-mount duckbill spoiler. Subtle rear-end improvement. The alternative to the big Type R wing.",hp:0,tq:0,ret:"Amazon",sk:1,time:0.5,tools:"Rubbing alcohol, included 3M tape",notes:"Clean and subtle. Good for people who want a little extra without the Type R wing look.",plats:["10g"]},
  {id:"x5",name:"M-Tech II Front Bumper (E36)",brand:"Aftermarket",cat:"ext",price:250,desc:"M-Tech II style front bumper — the most popular E36 bumper swap. Transforms the front end from bland to aggressive.",hp:0,tq:0,ret:"eBay",sk:3,time:2,tools:"10mm, bumper clips, respray budget ($200-300)",notes:"Needs repainting. Budget $200-300 for paint match at a body shop. The before/after is dramatic.",plats:["e36"]},
  {id:"x6",name:"M Performance Lip (F30)",brand:"BMW OEM",cat:"ext",price:200,desc:"Genuine BMW M Performance front lip — perfect fitment, OEM quality. The clean choice for F30.",hp:0,tq:0,ret:"FCP Euro / BMW dealer",sk:2,time:1,tools:"T25 Torx, clips",notes:"OEM fitment is flawless. More expensive than eBay options but worth the quality difference.",plats:["f30"]},
  {id:"x7",name:"eBay Front Lip (F30)",brand:"Generic",cat:"ext",price:70,desc:"⚠️ BUDGET: Generic ABS or fiberglass front lip. Fitment is hit-or-miss. May need heat gun and adjustment.",hp:0,tq:0,ret:"eBay",sk:2,time:1.5,tools:"Heat gun, self-tappers, patience",notes:"⚠️ Budget disclaimer: you'll spend 30 min making it fit vs 5 min for the OEM part. ABS is better than fiberglass — it flexes instead of cracking.",plats:["f30"]},
  {id:"x8",name:"Rally Mud Flaps (WRX/STI)",brand:"RokBlokz",cat:"ext",price:100,desc:"Thick polyurethane rally-style mud flaps. Protects paint and adds the rally look. The most popular exterior mod on WRX.",hp:0,tq:0,ret:"Amazon",sk:1,time:0.5,tools:"Phillips, 10mm",notes:"15-minute install. Protects the paint behind the wheels from rock chips. Looks great on lowered cars too.",plats:["gd","gr","va","lgt"]},
  {id:"x9",name:"Smoked Side Markers (10th Gen)",brand:"Depo",cat:"ext",price:40,desc:"Smoked side marker lights — replaces the ugly amber markers with clean smoked lenses. Easy swap.",hp:0,tq:0,ret:"Amazon",sk:1,time:0.3,tools:"Phillips",notes:"One of the cheapest visual upgrades. Huge improvement especially on darker colored cars.",plats:["10g"]},

  // ── INTERIOR — more options ──
  {id:"n1",name:"Weighted Shift Knob (500g, Universal)",brand:"Mishimoto",cat:"int",price:40,desc:"Universal weighted shift knob — fits most Japanese cars with M10x1.5 or M12x1.25 thread. Smoother shifts from the added mass.",hp:0,tq:0,ret:"Amazon",sk:1,time:0.1,tools:"None — hand thread",notes:"Check your thread pitch before buying. Most Hondas are M10x1.5, most Subarus are M12x1.25. 30-second install.",plats:["eg","ek","8g","9g","gd","gr"]},
  {id:"n2",name:"Braum Elite-S Racing Seats (Pair)",brand:"Braum",cat:"int",price:600,desc:"Budget fixed-back racing seats. FRP shell, good bolstering. The affordable alternative to Bride/Recaro.",hp:0,tq:0,ret:"Amazon",sk:3,time:2,tools:"14mm, seat bracket (sold separately)",notes:"Need car-specific seat brackets ($100-200 extra). Disables seat airbag — check local laws. Great value for the money.",plats:["eg","ek","8g","9g","10g","e36","e46","gd","gr","va"]},
  {id:"n3",name:"eBay Racing Seats (Pair)",brand:"Generic",cat:"int",price:200,desc:"⚠️ BUDGET: Generic bucket seats from eBay. The bolstering is mediocre, the FRP quality is questionable, and they won't pass any safety inspection. For show cars only.",hp:0,tq:0,ret:"eBay",sk:3,time:2,tools:"14mm, seat bracket",notes:"⚠️ Budget disclaimer: these are ONLY for show cars or drift missiles. The FRP shell quality is untested — in a crash, they may not protect you. Real racing seats (Braum minimum) are worth the money for safety.",plats:["eg","ek","e36"]},
  {id:"n4",name:"NRG Steering Wheel + Hub (350mm)",brand:"NRG",cat:"int",price:180,desc:"Aftermarket suede steering wheel + quick release hub kit. Smaller diameter for quicker steering response.",hp:0,tq:0,ret:"Amazon",sk:2,time:1,tools:"Steering wheel puller, 17mm",notes:"Disables airbag. For track/drift/show only unless you accept the safety tradeoff. The 350mm suede grip is incredible.",plats:["eg","ek","e36"]},
  {id:"n5",name:"Alcantara Steering Wheel Wrap",brand:"Various",cat:"int",price:45,desc:"Alcantara (suede) wrap for your stock steering wheel. Better grip, premium feel. No safety compromise.",hp:0,tq:0,ret:"Amazon",sk:1,time:1,tools:"Needle and thread (included), patience",notes:"A sewing project but the result is a steering wheel that feels like a $500 upgrade for $45. Keep it clean with a suede brush.",plats:["8g","9g","10g","e46","e9x","f30","va"]},
  {id:"n6",name:"Billetworkz Shift Knob (WRX/STI)",brand:"Billetworkz",cat:"int",price:80,desc:"Weighted aluminum shift knob with custom engraving options. Premium feel, made in USA. Popular in the Subaru community.",hp:0,tq:0,ret:"Billetworkz",sk:1,time:0.1,tools:"None — hand thread",notes:"M12x1.25 thread fits all manual WRX/STI. The weighted feel transforms the shifter. Comes in dozens of colors.",plats:["gd","gr","va","lgt"]},
  {id:"n7",name:"OEM STI Short Throw Shifter",brand:"Subaru OEM",cat:"int",price:180,desc:"Factory STI short shifter assembly — bolts directly into any WRX. OEM quality, shorter throws than stock WRX.",hp:0,tq:0,ret:"Subaru dealer / eBay",sk:2,time:1.5,tools:"12/14mm, console tools",notes:"The OEM STI shifter is better than most aftermarket options because it's designed by Subaru. Less throw than WRX, smoother engagement.",plats:["gd","gr","va","lgt"]},
  {id:"n8",name:"BMW Alcantara Shift Boot + Knob",brand:"BMW M Performance",cat:"int",price:120,desc:"Genuine BMW M Performance shift boot and weighted knob. Perfect fitment, premium materials.",hp:0,tq:0,ret:"FCP Euro / BMW dealer",sk:1,time:0.5,tools:"Trim removal tools",notes:"OEM quality. The weighted knob + alcantara boot transforms the interior feel for relatively little money.",plats:["e36","e46","e9x","f30"]},

  // ── CLUTCH — more options ──
  {id:"cl1",name:"Competition Clutch Stage 2 (K-series)",brand:"Competition Clutch",cat:"clutch",price:380,desc:"Street-performance clutch for K20/K24 — holds ~300WHP with slightly stiffer pedal than stock. Good daily-ability.",hp:0,tq:0,ret:"Amazon",sk:5,time:6,tools:"Trans jack, full socket set, alignment tool, torque wrench",notes:"The middle ground between stock clutch and full race. Pedal is slightly heavier but totally fine for daily driving. Shop install recommended ($400-600).",plats:["8g","9g"]},
  {id:"cl2",name:"Exedy OEM Replacement Clutch (Honda)",brand:"Exedy",cat:"clutch",price:150,desc:"Direct OEM replacement clutch. Same feel and capacity as stock. For when your clutch is worn out, not for power upgrades.",hp:0,tq:0,ret:"Amazon",sk:5,time:6,tools:"Trans jack, full socket set, alignment tool",notes:"If your stock clutch is slipping but you're not making more power, just replace with OEM spec. Cheapest option.",plats:["eg","ek","8g","9g","10g"]},
  {id:"cl3",name:"South Bend Stage 2 Clutch (N54/N55)",brand:"South Bend",cat:"clutch",price:700,desc:"Performance clutch for tuned 335i. Holds 450+ WHP. Slightly heavier pedal but daily-driveable.",hp:0,tq:0,ret:"ECS Tuning",sk:5,time:8,tools:"Trans jack, full socket set, alignment tool, flywheel bolts",notes:"If you're making over 380WHP on an N54, the stock clutch will start slipping. This fixes it. Shop install recommended ($800-1200).",plats:["e9x","e82"]},
  {id:"cl4",name:"Exedy OEM Replacement (WRX)",brand:"Exedy",cat:"clutch",price:200,desc:"Direct OEM replacement for stock WRX clutch. Same feel, same capacity. For worn clutches on stock power.",hp:0,tq:0,ret:"Amazon",sk:5,time:8,tools:"Trans jack, full socket set, alignment tool",notes:"Stock WRX clutch is fine to about 280WHP. If you're stock or Stage 1 and the clutch is just worn, replace with OEM spec.",plats:["gd","gr","va","lgt"]},

  // ═══ MAZDA PARTS ═══
  {id:"mz1",name:"Flyin' Miata Intake",brand:"Flyin' Miata",cat:"intake",price:130,desc:"The go-to Miata intake. FM has been making Miata parts since your Miata was new. Proper sealed airbox, real gains.",hp:5,tq:3,ret:"Flyin' Miata",sk:1,time:0.5,tools:"10mm, flathead",notes:"Flyin' Miata is THE Miata company. If FM doesn't make it, you probably don't need it.",plats:["miata_na","miata_nb"]},
  {id:"mz2",name:"Racing Beat Header (1.8)",brand:"Racing Beat",cat:"exhaust",price:380,desc:"Gold standard Miata header. The biggest single bolt-on gain. Racing Beat has been making these since before you were born.",hp:10,tq:8,ret:"Racing Beat",sk:3,time:2.5,tools:"12/14mm, penetrating oil, jack stands",notes:"The Miata community has exactly two opinions: 'get the Racing Beat header' and 'wrong.'",plats:["miata_na","miata_nb"]},
  {id:"mz3",name:"Cobalt Cat-Back (Miata)",brand:"Cobalt",cat:"exhaust",price:320,desc:"Stainless catback — makes the little 1.8 sound like it's trying its hardest. And honestly? It sounds good.",hp:3,tq:3,ret:"Amazon",sk:2,time:1.5,tools:"14mm, jack stands",notes:"The 1.8 Miata has a surprisingly great exhaust note when uncorked. Your neighbors will think it's cute.",plats:["miata_na","miata_nb"]},
  {id:"mz4",name:"FM Budget Suspension Kit",brand:"Flyin' Miata",cat:"susp",price:500,desc:"Springs + Bilstein shocks. Every Miata forum thread asking 'what coilovers' ends with someone saying 'just get the FM kit.' They're right.",hp:0,tq:0,ret:"Flyin' Miata",sk:3,time:3,tools:"17mm, 14mm, spring compressor, jack stands",notes:"Better than any coilover under $800. The Miata community has tested literally everything and this wins.",plats:["miata_na","miata_nb"]},
  {id:"mz5",name:"Mishimoto Radiator (Miata)",brand:"Mishimoto",cat:"ic",price:200,desc:"Aluminum radiator — replaces the stock plastic-tank radiator that's been plotting your engine's death for 25 years.",hp:0,tq:0,ret:"Amazon",sk:3,time:1.5,tools:"10mm, Phillips, drain pan, coolant",notes:"Your stock Miata radiator is older than most TikTok users. Replace it before it betrays you on a hot day.",plats:["miata_na","miata_nb"]},
  {id:"mz6",name:"949 Racing 6UL 15x7 (×4)",brand:"949 Racing",cat:"wheels",price:1200,desc:"9.5 lbs per wheel. Purpose-built for Miata. The autocross community worships these like a religious artifact.",hp:0,tq:0,ret:"949 Racing",sk:1,time:0.5,tools:"Lug wrench, torque wrench",notes:"On a 2,200 lb car, saving 5 lbs per corner is like removing a whole passenger. These are the endgame Miata wheel.",plats:["miata_na","miata_nb"]},
  {id:"mz7",name:"Federal 595 RS-RR 205/50R15 (×4)",brand:"Federal",cat:"tires",price:300,desc:"Semi-slick for Miata. At autocross, Miatas on Federals routinely embarrass cars with 3x the horsepower. Skill > power.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"The Miata + Federals combo has won more grassroots trophies than any car + tire combo in history. That's not an exaggeration.",plats:["miata_na","miata_nb"]},
  {id:"mz8",name:"COBB AccessPort (MS3)",brand:"COBB",cat:"tune",price:650,desc:"Same AP as Subaru — full ECU flash. Stage 1 adds 30+ WHP. The MS3 community exists because of this device.",hp:30,tq:40,ret:"Amazon",sk:1,time:0.3,tools:"None — OBD2 plug-in",notes:"The MS3 DISI engine responds to tuning like the N54 responds to tunes — aggressively and enthusiastically.",plats:["ms3","speed6"]},
  {id:"mz9",name:"Corksport Intake (MS3)",brand:"Corksport",cat:"intake",price:260,desc:"Short ram with heat shield. The turbo spool sounds will make you roll your windows down in parking garages like a weirdo.",hp:5,tq:8,ret:"Corksport",sk:1,time:0.5,tools:"10mm, flathead",notes:"Corksport is to Mazdaspeed what Grimmspeed is to Subaru — the brand everyone trusts.",plats:["ms3","speed6"]},
  {id:"mz10",name:"Corksport Rear Motor Mount (MS3)",brand:"Corksport",cat:"engine",price:80,desc:"The stock MS3 rear motor mount breaks on literally every car. The clunking noise haunts MS3 owners in their sleep. This $80 part fixes it forever.",hp:0,tq:0,ret:"Corksport",sk:2,time:1,tools:"14mm, 17mm, jack",notes:"If your MS3 clunks on shifts, congratulations — you're a normal MS3 owner. Now fix it.",plats:["ms3","speed6"]},

  // ═══ TOYOTA PARTS ═══
  {id:"ty1",name:"OME 2.5\" Lift Kit (Taco/4Runner)",brand:"Old Man Emu",cat:"susp",price:1200,desc:"The gold standard overland lift. ARB/OME has been lifting trucks since before 'overlanding' was an Instagram hashtag. Quality Nitrocharger shocks + progressive springs.",hp:0,tq:0,ret:"Amazon",sk:4,time:5,tools:"17/19mm, spring compressor, jack stands, torque wrench",notes:"OME is what people who actually go off-road run. The spring rates are calculated for vehicle weight, not just 'lifted bro.'",plats:["taco","4runner"]},
  {id:"ty2",name:"Bilstein 5100 Shocks (×4)",brand:"Bilstein",cat:"susp",price:550,desc:"Height-adjustable front + rear shocks. 90% of Tacoma/4Runner owners start here because it's the right answer.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"17/19mm, jack stands",notes:"The Bilstein 5100 is the 'nobody ever got fired for buying IBM' of truck shocks. Always a good choice.",plats:["taco","4runner","frontier"]},
  {id:"ty3",name:"eBay Spacer Lift (Tacoma/4Runner)",brand:"Generic",cat:"susp",price:120,desc:"⚠️ BUDGET: Spacer puck on top of stock strut. Lifts 2-3\" cheaply. Your CV joints and ball joints will write you a strongly-worded letter.",hp:0,tq:0,ret:"Amazon",sk:2,time:2,tools:"17/19mm, jack stands",notes:"⚠️ Budget disclaimer: spacer lifts accelerate wear on everything underneath. It's the duct tape of lifting — works in a pinch but don't pretend it's a solution.",plats:["taco","4runner","frontier"]},
  {id:"ty4",name:"TRD Cat-Back (Tacoma)",brand:"TRD / Toyota",cat:"exhaust",price:550,desc:"Factory TRD exhaust — perfect fitment because Toyota literally made it. Won't void your warranty. Won't upset your HOA. Will make you slightly happier.",hp:3,tq:3,ret:"Toyota dealer",sk:2,time:1.5,tools:"14mm, jack stands",notes:"The 'I want some sound but I also want my warranty' exhaust. Smart choice honestly.",plats:["taco"]},
  {id:"ty5",name:"Prinsu Roof Rack (Taco/4Runner)",brand:"Prinsu",cat:"ext",price:500,desc:"Low-profile aluminum rack. Makes your truck look like it's about to cross the Sahara even if it's going to Costco.",hp:0,tq:0,ret:"Prinsu Design Studio",sk:2,time:2,tools:"T25 Torx, drill, rack hardware",notes:"The most popular rack in Toyota truck Instagram. Functional AND photogenic. Rare combo.",plats:["taco","4runner"]},
  {id:"ty6",name:"BFGoodrich KO2 265/70R17 (×4)",brand:"BFGoodrich",cat:"tires",price:900,desc:"The king of all-terrain tires. Every truck guy's default answer to 'what tires should I get.' They're right.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"The KO2 does everything well. Mud, rock, snow, highway. It's the Honda Civic of truck tires — reliable, everywhere, and recommended by literally everyone.",plats:["taco","4runner","frontier","f150","ranger","silverado"]},
  {id:"ty7",name:"Falken Wildpeak AT3W 265/70R17 (×4)",brand:"Falken",cat:"tires",price:700,desc:"90% of KO2 at 75% of the price. The truck tire for people who are smart with money instead of loyal to brands.",hp:0,tq:0,ret:"Tire Rack",sk:1,time:0,tools:"None — shop mount",notes:"Many overlanders switched from KO2 to Wildpeak and genuinely can't tell the difference. Your wallet can though.",plats:["taco","4runner","frontier","f150","ranger","silverado"]},
  {id:"ty8",name:"RCI Skid Plates (Taco/4Runner)",brand:"RCI Offroad",cat:"ext",price:650,desc:"Full skid plate set — engine, trans, transfer case. Because rocks don't care how much your truck cost.",hp:0,tq:0,ret:"RCI Offroad",sk:3,time:3,tools:"14mm, 17mm, socket extensions",notes:"If you're actually going off-road (not just mall-crawling), skid plates are non-negotiable. One rock to the oil pan = $5,000 lesson.",plats:["taco","4runner"]},

  // ═══ NISSAN PARTS ═══
  {id:"ni1",name:"Berk HFC (350Z/G35)",brand:"Berk Technology",cat:"exhaust",price:250,desc:"High-flow cats — the #1 mod on every VQ35. Replaces the ridiculously restrictive stock cats. The VQ V6 was born to scream and the stock cats are muzzling it.",hp:15,tq:12,ret:"Berk Technology",sk:3,time:2,tools:"14mm, O2 socket, penetrating oil, jack stands",notes:"Test pipes are more power but illegal. HFCs are the 'I want to keep my registration' compromise.",plats:["z33"]},
  {id:"ni2",name:"Invidia Gemini Catback (350Z)",brand:"Invidia",cat:"exhaust",price:650,desc:"The exhaust that makes VQ owners weep with joy. Deep V6 tone without the rasp that plagues cheap Z exhausts.",hp:5,tq:5,ret:"Amazon",sk:2,time:1.5,tools:"14mm, jack stands",notes:"The VQ35 is one of the best-sounding V6 engines ever made. The Gemini lets you hear what Nissan intended.",plats:["z33"]},
  {id:"ni3",name:"UpRev ECU Tune (350Z/G35)",brand:"UpRev",cat:"tune",price:500,desc:"Full ECU reflash — the gold standard for VQ tuning. Unlocks what Nissan left on the table. Custom tune support for bolt-ons.",hp:15,tq:12,ret:"UpRev",sk:2,time:1,tools:"Laptop, OBD2 cable",notes:"UpRev is to Nissan what Hondata is to Honda and COBB is to Subaru. The tuning platform the community trusts.",plats:["z33"]},
  {id:"ni4",name:"BC Racing BR Coilovers (350Z/G35)",brand:"BC Racing",cat:"susp",price:1050,desc:"30-way adjustable. The Z chassis was already good — BC makes it great. Essential for any track or drift use.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"17/19mm, breaker bar, jack stands, torque wrench",notes:"The 350Z/G35 chassis is genuinely excellent. Proper coilovers unlock what Nissan designed into it.",plats:["z33"]},
  {id:"ni5",name:"ISR Exhaust (240SX)",brand:"ISR Performance",cat:"exhaust",price:280,desc:"Single-exit catback for S13/S14. The budget drift car exhaust. Because your drift missile doesn't need a $1,000 exhaust — it needs to run.",hp:3,tq:3,ret:"ISR Performance",sk:2,time:1.5,tools:"14mm, jack stands",notes:"ISR makes affordable S-chassis parts for people who understand that drift cars get crashed and rebuilt repeatedly.",plats:["s_chassis"]},
  {id:"ni6",name:"Raceland Coilovers (240SX)",brand:"Raceland",cat:"susp",price:450,desc:"⚠️ BUDGET: Basic coilovers for S-chassis. The 'I bought a drift car and have $500 left' suspension. They work. Barely.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"17/19mm, jack stands",notes:"⚠️ Budget disclaimer: fine for learning to drift. Will not survive a competitive season. But hey, you gotta start somewhere.",plats:["s_chassis"]},
  {id:"ni7",name:"SMOD Bypass Kit (Frontier/Xterra)",brand:"Various",cat:"ic",price:40,desc:"Bypasses the transmission cooler in the radiator that causes 'Strawberry Milkshake of Death' on 2005-2010 Frontier/Xterra automatics. $40 to prevent a $3,000 transmission replacement.",hp:0,tq:0,ret:"Amazon",sk:2,time:1,tools:"Pliers, hose clamps, transmission cooler line, ATF",notes:"If you have a 2005-2010 Frontier or Xterra with an automatic and this hasn't been done — stop reading and do it NOW. SMOD has killed more of these trucks than anything else.",plats:["frontier"]},

  // ═══ FORD PARTS ═══
  {id:"fo1",name:"Roush Cold Air Intake (5.0 Coyote)",brand:"Roush",cat:"intake",price:350,desc:"CARB-legal sealed CAI. Makes the Coyote V8 sound like it's angry about something. Legal in all 50 states so the smog referee can't ruin your day.",hp:10,tq:8,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"The Coyote intake sound is addictive. Your Mustang will sound like it's clearing its throat before a fight. Please don't leave Cars & Coffee sideways.",plats:["mustang_s197"]},
  {id:"fo2",name:"SCT X4 Tuner + Bama Tunes",brand:"SCT / Bama",cat:"tune",price:400,desc:"Handheld tuner with 3 free custom tunes. Plug, flash, send. The most popular Mustang tuning platform since forever. Your Mustang already wants to go faster — let it.",hp:20,tq:15,ret:"Amazon",sk:1,time:0.3,tools:"None — OBD2 plug-in",notes:"Start with the 91 or 93 octane tune. Custom tune for bolt-ons later. Please, PLEASE turn off traction control in a safe environment only.",plats:["mustang_s197"]},
  {id:"fo3",name:"Borla ATAK Catback (Mustang 5.0)",brand:"Borla",cat:"exhaust",price:1100,desc:"The most aggressive Mustang exhaust money can buy. The cold start will set off car alarms, wake up your block, and make you feel like a terrible person. You'll love it.",hp:5,tq:5,ret:"Amazon",sk:2,time:1.5,tools:"15mm, jack stands",notes:"VERY loud. The Coyote V8 through the ATAK is automotive intimidation. Your neighbors will know your work schedule. Your dog will hide. You won't care.",plats:["mustang_s197"]},
  {id:"fo4",name:"Pypes Long Tube Headers (5.0)",brand:"Pypes",cat:"exhaust",price:550,desc:"1-7/8\" long tubes — the biggest bolt-on power mod for the Coyote. Also the hardest install. Budget a full day and a lot of swearing.",hp:25,tq:20,ret:"Amazon",sk:4,time:5,tools:"15mm deep, O2 socket, penetrating oil, jack stands, patience, ibuprofen",notes:"The gains are worth the suffering. Retune after install is mandatory. Your knuckles will hate you but your dyno sheet will love you.",plats:["mustang_s197"]},
  {id:"fo5",name:"BMR Lowering Springs (S197)",brand:"BMR",cat:"susp",price:200,desc:"1.25\" drop. The stock Mustang sits like a 4x4 — these fix that problem and the handling problem simultaneously.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"18mm, spring compressor, jack stands",notes:"The before/after photos are dramatic. The S197 looks like a different car lowered 1.25 inches.",plats:["mustang_s197"]},
  {id:"fo6",name:"MGW Short Shifter (Mustang MT-82)",brand:"MGW",cat:"int",price:400,desc:"The fix for the terrible MT-82 shifter feel. Reduces throw by 30%, eliminates the 'stirring a bucket of rocks' sensation. Essential mod.",hp:0,tq:0,ret:"Amazon",sk:3,time:2,tools:"Shifter removal tools, console tools",notes:"The stock MT-82 shifter is universally hated. This is the most recommended Mustang interior mod. Night and day difference.",plats:["mustang_s197"]},
  {id:"fo7",name:"5 Star Tuning (F-150 EcoBoost)",brand:"5 Star Tuning",cat:"tune",price:450,desc:"Custom email tune for EcoBoost F-150. +60HP on the 3.5 EcoBoost. The truck equivalent of finding money in your couch cushions.",hp:60,tq:80,ret:"5 Star Tuning",sk:1,time:0.3,tools:"SCT X4 device + laptop",notes:"The 3.5 EcoBoost responds to tuning like it was begging to be unleashed. The torque increase is immediately obvious when towing.",plats:["f150"]},
  {id:"fo8",name:"aFe Momentum Intake (F-150 EcoBoost)",brand:"aFe",cat:"intake",price:350,desc:"Sealed cold air intake for the twin-turbo 3.5. The turbo spool sounds through the aFe intake are chef's kiss.",hp:10,tq:15,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"The EcoBoost intake sound is addictive. You'll find excuses to floor it just to hear the turbos spool.",plats:["f150"]},
  {id:"fo9",name:"Rough Country 2\" Leveling Kit (F-150)",brand:"Rough Country",cat:"susp",price:100,desc:"⚠️ BUDGET: Spacer leveling kit — levels the front with the rear. The 'I want my truck to not look like it's squatting' mod. Works, but it's a spacer.",hp:0,tq:0,ret:"Amazon",sk:2,time:2,tools:"17/19mm, jack stands",notes:"⚠️ Budget disclaimer: spacer lifts are spacer lifts. This levels the truck for $100 which is fine. But don't pretend it's a suspension upgrade.",plats:["f150","silverado","ranger"]},

  // ═══ CHEVY PARTS ═══
  {id:"ch1",name:"Texas Speed Stage 2 Cam (5.3/6.2)",brand:"Texas Speed",cat:"engine",price:800,desc:"THE cam swap. Transforms a stock 5.3 into something that sounds like it escaped from a drag strip. Lopey idle, aggressive pull. The cam swap is a religion in the GM truck community.",hp:40,tq:30,ret:"Texas Speed",sk:5,time:12,tools:"Full engine tool set, cam installation tools, new lifters, timing chain, gaskets",notes:"This is the mod that makes Silverado guys tear up. The lopey idle, the V8 lope at red lights — it's a lifestyle choice. You WILL need to do an AFM/DOD delete with this. Shop install $1,500-2,000.",plats:["silverado","camaro"]},
  {id:"ch2",name:"AFM/DOD Delete Kit",brand:"Texas Speed",cat:"engine",price:350,desc:"Deletes Active Fuel Management (cylinder deactivation) that causes lifter failure on every GM V8 ever made. GM's worst engineering decision, fixed for $350.",hp:0,tq:0,ret:"Texas Speed",sk:4,time:8,tools:"Valley cover removal tools, new lifters, valley cover gasket, tune",notes:"AFM lifter failure is the #1 mechanical issue on GM trucks. This prevents a $4,000+ repair. If your GM V8 hasn't had this done, it's ticking (literally).",plats:["silverado","camaro"]},
  {id:"ch3",name:"Flowmaster Super 44 Catback (Silverado)",brand:"Flowmaster",cat:"exhaust",price:400,desc:"The classic American V8 exhaust. Deep, aggressive, makes your Silverado sound like it means business. The rumble at idle is what truck commercials wish they sounded like.",hp:5,tq:5,ret:"Amazon",sk:2,time:1.5,tools:"15mm, jack stands",notes:"Flowmaster has been the default American V8 exhaust for decades. The Super 44 is the aggressive choice — if you want mellow, get the 40 series.",plats:["silverado"]},
  {id:"ch4",name:"Borla ATAK Catback (Camaro SS)",brand:"Borla",cat:"exhaust",price:1200,desc:"Maximum aggression. The LS3/LT1 through Borla ATAK is what happens when you remove all the politeness from a V8. Illegal in several noise ordinances. Worth it.",hp:8,tq:5,ret:"Amazon",sk:2,time:1.5,tools:"15mm, jack stands",notes:"The Camaro SS with ATAK is genuinely one of the best-sounding cars in production. Your local cars & coffee will hear you arrive. So will the next zip code.",plats:["camaro"]},
  {id:"ch5",name:"K&N Cold Air Intake (5.3/6.2)",brand:"K&N",cat:"intake",price:280,desc:"Sealed cold air intake for GM trucks. Good gains, CARB legal. Makes the V8 breathe like it should have from the factory.",hp:8,tq:6,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"The stock airbox on GM trucks is hilariously restrictive. This opens it up and lets the V8 actually breathe.",plats:["silverado","camaro"]},
  {id:"ch6",name:"HP Tuners (GM Universal)",brand:"HP Tuners",cat:"tune",price:350,desc:"The tuning platform for GM vehicles. Covers LS, LT, everything. Custom tune support. The GM equivalent of COBB/Hondata/BM3.",hp:25,tq:30,ret:"HP Tuners",sk:2,time:1,tools:"Laptop, HP Tuners MPVI2 interface",notes:"HP Tuners is the industry standard for GM tuning. Custom tune from a reputable tuner — don't use the free tunes floating around forums.",plats:["silverado","camaro"]},
  {id:"ch7",name:"LS Swap Kit (C10)",brand:"Holley / Hooker",cat:"engine",price:600,desc:"LS swap motor mount kit for classic C10/squarebody trucks. The kit that turns a 40-year-old truck into a modern machine. Bolt-in fitment with headers included.",hp:0,tq:0,ret:"Summit Racing / Holley",sk:5,time:20,tools:"Full tool set, engine hoist, transmission jack, wiring tools",notes:"The LS swap C10 is an American tradition at this point. A junkyard 5.3 ($500) + this kit ($600) + a 4L60E trans ($300) = 300HP classic truck for $1,400 in drivetrain. Add standalone wiring harness ($200-500).",plats:["c10"]},
  {id:"ch8",name:"Disc Brake Conversion (C10)",brand:"CPP / Wilwood",cat:"engine",price:500,desc:"Front disc brake conversion kit — because the original drum brakes on a C10 were designed to stop a truck going 55 MPH, not 75. Drums + LS power = pray.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"Full brake tools, line flare kit, brake fluid",notes:"Non-negotiable if you LS swap a C10. The stock drums cannot stop an LS-powered truck safely. This is a safety mod, not an upgrade.",plats:["c10"]},
  {id:"ch9",name:"Rough Country 4\" Lift (Silverado)",brand:"Rough Country",cat:"susp",price:600,desc:"⚠️ BUDGET: Budget lift kit with spacers and shocks. Gets the truck high enough for 33\" tires. Ride quality takes a hit but the look is there.",hp:0,tq:0,ret:"Amazon",sk:4,time:6,tools:"17/19mm, jack stands, spring compressor",notes:"⚠️ Budget disclaimer: Rough Country is the entry-level lift brand. It works but the ride quality and shock valving aren't going to win any awards. For a serious off-road build, look at BDS or Cognito.",plats:["silverado","f150"]},

  // ═══ VW PARTS ═══
  {id:"vw1",name:"APR Stage 1 Tune (EA888)",brand:"APR",cat:"tune",price:600,desc:"THE VW tune. APR has been tuning VWs since the MK4 era. +80HP on the 2.0T. The most tested and proven tune in the VW community.",hp:80,tq:80,ret:"APR dealer",sk:1,time:0.5,tools:"None — flashed at APR dealer",notes:"APR is the 'blue chip' of VW tuning. More expensive than Unitronic or IE but the most thoroughly tested. Stage 1 requires zero hardware.",plats:["mk6_gti","mk7_gti","jetta_gli"]},
  {id:"vw2",name:"Unitronic Stage 1 Tune (EA888)",brand:"Unitronic",cat:"tune",price:500,desc:"Budget alternative to APR — 90% of the performance at 80% of the price. Self-flash via OBD2, no dealer visit needed. Growing community.",hp:75,tq:75,ret:"Unitronic",sk:1,time:0.3,tools:"Laptop, OBD2 cable",notes:"Self-flashing from home is a huge advantage over APR's dealer-only model. The gains are comparable. Great option if there's no APR dealer near you.",plats:["mk6_gti","mk7_gti","jetta_gli"]},
  {id:"vw3",name:"IE Intake (MK7 GTI/R)",brand:"Integrated Engineering",cat:"intake",price:350,desc:"Carbon fiber intake with sealed airbox. The turbo flutter and spool sounds are obscene. Makes every drive more fun.",hp:8,tq:10,ret:"Integrated Engineering",sk:1,time:0.5,tools:"10mm, T25 Torx",notes:"IE makes premium VW parts. The carbon fiber isn't just for looks — it doesn't heat-soak like plastic.",plats:["mk7_gti","jetta_gli"]},
  {id:"vw4",name:"CTS Turbo Downpipe (MK6/MK7)",brand:"CTS Turbo",cat:"exhaust",price:350,desc:"3\" catted downpipe — the mod that unlocks Stage 2. Dramatically reduces backpressure. TUNE REQUIRED.",hp:20,tq:25,ret:"ECS Tuning",sk:4,time:2.5,tools:"T25/T30, 13mm, O2 socket, penetrating oil, jack stands",notes:"Stage 2 = Stage 1 tune + downpipe. Flash Stage 2 map before first start. The power difference between Stage 1 and Stage 2 is dramatic.",plats:["mk6_gti","mk7_gti","jetta_gli"]},
  {id:"vw5",name:"ECS Tuning Catback (MK7 GTI)",brand:"ECS Tuning",cat:"exhaust",price:600,desc:"3\" catback with valved muffler. Quiet mode for daily driving, loud mode for when you want attention. The mature enthusiast's exhaust.",hp:3,tq:3,ret:"ECS Tuning",sk:2,time:1.5,tools:"14mm, jack stands",notes:"The valved exhaust is peak GTI energy — sensible and sporty when you need to be, loud when you want to be. Very German.",plats:["mk7_gti","jetta_gli"]},
  {id:"vw6",name:"VWR Springs (MK6/MK7 GTI)",brand:"VWR / Racingline",cat:"susp",price:280,desc:"OEM+ lowering springs. 25mm drop. Made by VW's own motorsport division. Perfect ride quality because literally VW designed them.",hp:0,tq:0,ret:"ECS Tuning",sk:3,time:3,tools:"Spring compressor, 17/19mm, jack stands",notes:"The fact that VW's motorsport division makes aftermarket springs for their own car tells you everything about who buys GTIs.",plats:["mk6_gti","mk7_gti","jetta_gli"]},
  {id:"vw7",name:"DSG Tune (DQ250/DQ381)",brand:"APR / Unitronic",cat:"tune",price:400,desc:"DSG/DQ tune — raises torque limit, faster shifts, launch control. The mod that makes the DSG shift like it's angry. Pairs with Stage 1 engine tune.",hp:0,tq:0,ret:"APR / Unitronic",sk:1,time:0.3,tools:"Same as engine tune — OBD2 flash",notes:"The DSG tune is the secret weapon of MK7 GTI builds. Stock DSG limits torque to protect itself. The tune raises the limit and adds launch control. The shifts become violent in the best way.",plats:["mk6_gti","mk7_gti","jetta_gli"]},
  {id:"vw8",name:"ECS Carbon Cleaning Service Kit",brand:"ECS Tuning",cat:"engine",price:50,desc:"Walnut blasting media + adapter for cleaning carbon off EA888 intake valves. Direct injection = carbon buildup. Every EA888 needs this every 50-60k miles.",hp:0,tq:0,ret:"ECS Tuning",sk:3,time:2,tools:"Walnut blaster (rent or DIY), intake manifold removal tools, shop vac",notes:"Carbon buildup is the #1 maintenance item VW doesn't tell you about. If your GTI has over 50k miles and hasn't been cleaned, it's losing power. You'll feel the difference immediately after.",plats:["mk6_gti","mk7_gti","jetta_gli"]},

  // ═══════════════════════════════════════════════════════════════
  // MASTER CATALOG EXPANSION — Every platform gets parts
  // All Amazon-available parts use Amazon for affiliate revenue
  // ═══════════════════════════════════════════════════════════════

  // ── HONDA: Prelude, S2000, Accord 2.0T, Fit, Accord V6 ──
  {id:"hp1",name:"DC Sports Header (H22)",brand:"DC Sports",cat:"exhaust",price:200,desc:"4-1 ceramic header for the H22A. Biggest single power gain on the Prelude — wakes up the top end dramatically.",hp:12,tq:8,ret:"Amazon",sk:3,time:2.5,tools:"12mm, 14mm, penetrating oil, jack stands",notes:"Same quality DC Sports header that dominates the Civic world. The H22 with a header sounds incredible above 5,500 RPM.",plats:["prelude"]},
  {id:"hp2",name:"Injen Cold Air Intake (H22)",brand:"Injen",cat:"intake",price:200,desc:"True cold air routing with heat shield. Real gains on the H22, not just noise.",hp:6,tq:4,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"The H22 responds well to breathing mods. This intake + header is the classic Prelude combo.",plats:["prelude"]},
  {id:"hp3",name:"Tein Street Basis Z (Prelude)",brand:"Tein",cat:"susp",price:600,desc:"Height-adjustable coilovers — transforms the Prelude from floaty GT to proper sports car.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"17/19mm, spring compressor, jack stands",notes:"The 5th gen Prelude already handles well — Teins make it handle great.",plats:["prelude"]},
  {id:"hp4",name:"Hondata S300 (Prelude)",brand:"Hondata",cat:"tune",price:650,desc:"Full engine management for the H22. Unlock the real potential with proper fuel and ignition maps.",hp:15,tq:10,ret:"Amazon",sk:3,time:2,tools:"Soldering iron, ECU pin kit, laptop",notes:"The H22 with Hondata tuning makes noticeably more power than stock. Essential if you've done bolt-ons.",plats:["prelude"]},

  // S2000
  {id:"hs1",name:"Invidia Q300 Catback (S2000)",brand:"Invidia",cat:"exhaust",price:750,desc:"The S2000 exhaust that sounds like Honda intended. Deep, clean, no drone at cruise. Screams at 9,000 RPM.",hp:5,tq:4,ret:"Amazon",sk:2,time:1.5,tools:"14mm, jack stands",notes:"The F20C/F22C at 9,000 RPM through a proper exhaust is one of the best sounds in the car world. Period.",plats:["s2k"]},
  {id:"hs2",name:"Hardtop (OEM or Aftermarket)",brand:"Various",cat:"ext",price:1500,desc:"S2000 hardtop — reduces flex, improves looks, quieter cabin. OEM hardtops are $3-5k. Quality aftermarket ones are $1,200-2,000.",hp:0,tq:0,ret:"eBay",sk:2,time:1,tools:"Hardtop mounting hardware",notes:"The S2000 with a hardtop looks incredible. Also makes the car stiffer which improves handling.",plats:["s2k"]},
  {id:"hs3",name:"Koni Yellow Shocks + Eibach Springs",brand:"Koni / Eibach",cat:"susp",price:900,desc:"The S2000 suspension combo that everyone recommends. Adjustable damping + progressive springs = perfect.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"17/19mm, spring compressor, jack stands",notes:"The S2000 chassis is already excellent — this combo makes it telepathic. Better than any coilover under $1,500.",plats:["s2k"]},
  {id:"hs4",name:"K&N Drop-In Filter (S2000)",brand:"K&N",cat:"intake",price:50,desc:"Drop-in replacement — more flow, lets you hear the F20C/F22C breathe at high RPM. Zero tune needed.",hp:2,tq:1,ret:"Amazon",sk:1,time:0.1,tools:"None",notes:"The safest first mod. Lets the engine breathe a tiny bit better and sounds marginally more alive at VTEC.",plats:["s2k"]},

  // Accord 2.0T
  {id:"ha1",name:"PRL Cobra Intake (Accord 2.0T)",brand:"PRL Motorsports",cat:"intake",price:350,desc:"Same PRL intake as the Civic but for the Accord. Turbo sounds are incredible. The K20C4 wakes up.",hp:8,tq:10,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"PRL makes the best intakes for Honda turbo cars. The Accord version fits perfectly.",plats:["accord2t"]},
  {id:"ha2",name:"27WON Intercooler (Accord 2.0T)",brand:"27WON",cat:"ic",price:550,desc:"Upgraded intercooler — drops intake temps for consistent power. Essential if tuned.",hp:8,tq:12,ret:"Amazon",sk:3,time:2,tools:"10/12mm, pliers",notes:"The stock Accord IC heat soaks after repeated pulls. This fixes it.",plats:["accord2t"]},
  {id:"ha3",name:"RV6 Catted Downpipe (Accord 2.0T)",brand:"RV6",cat:"exhaust",price:500,desc:"High-flow catted downpipe for the K20C4. Big power gains. TUNE REQUIRED.",hp:20,tq:25,ret:"Amazon",sk:4,time:3,tools:"14mm deep, O2 socket, penetrating oil, jack stands",notes:"The Accord 2.0T downpipe gains are similar to the Civic. Retune mandatory.",plats:["accord2t"]},

  // Fit
  {id:"hf1",name:"K&N Drop-In Filter (Fit)",brand:"K&N",cat:"intake",price:40,desc:"Drop-in filter for the 1.5L. Makes the little engine breathe marginally better. $40, zero risk, zero tune.",hp:2,tq:1,ret:"Amazon",sk:1,time:0.1,tools:"None",notes:"The cheapest possible mod. Pull out old filter, drop this in.",plats:["fit"]},
  {id:"hf2",name:"Eibach Pro-Kit Springs (Fit)",brand:"Eibach",cat:"susp",price:220,desc:"1\" drop. The Fit sits a little high from the factory — these fix that and improve handling noticeably.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"Spring compressor, 17mm, jack stands",notes:"The Fit transforms visually with a 1\" drop. Goes from economy car to mini hot hatch stance.",plats:["fit"]},
  {id:"hf3",name:"Yonaka Catback (Fit)",brand:"Yonaka",cat:"exhaust",price:180,desc:"Budget stainless catback — makes the 1.5L sound like it's trying SO hard. And honestly? It's endearing.",hp:2,tq:1,ret:"Amazon",sk:2,time:1.5,tools:"14mm, jack stands",notes:"The Fit with an exhaust sounds like an angry sewing machine and we mean that as a compliment.",plats:["fit"]},

  // Accord V6
  {id:"hav1",name:"K&N Cold Air Intake (J35)",brand:"K&N",cat:"intake",price:280,desc:"Full cold air intake for the J-series V6. Opens up the top end and adds a great V6 sound.",hp:8,tq:5,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"The J35 V6 sounds surprisingly good with an intake. Deep V6 induction noise above 4,000 RPM.",plats:["accord_v6"]},
  {id:"hav2",name:"OBX Header (J30/J35)",brand:"OBX",cat:"exhaust",price:250,desc:"Stainless header for J-series V6. Decent gains for the money. Fitment is acceptable.",hp:10,tq:8,ret:"Amazon",sk:4,time:3,tools:"14mm, O2 socket, penetrating oil, jack stands",notes:"The J-series header install is tight but the gains are real. Budget a full day.",plats:["accord_v6"]},
  {id:"hav3",name:"Invidia Q300 Catback (Accord V6)",brand:"Invidia",cat:"exhaust",price:700,desc:"The J35 V6 through the Q300 is genuinely one of the best-sounding V6 exhausts. Deep, smooth, no drone.",hp:5,tq:4,ret:"Amazon",sk:2,time:1.5,tools:"14mm, jack stands",notes:"People are shocked when they hear this is an Accord. The J35 sounds GOOD with proper exhaust.",plats:["accord_v6"]},
  {id:"hav4",name:"Eibach Pro-Kit Springs (Accord)",brand:"Eibach",cat:"susp",price:250,desc:"1\" drop. The Accord sits too high from the factory. Eibachs fix the stance and improve handling.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"Spring compressor, 17/19mm, jack stands",notes:"The Accord Coupe lowered 1\" looks like a completely different car. Clean and aggressive.",plats:["accord_v6","accord2t"]},

  // ── BMW E30 ──
  {id:"be30_1",name:"Ireland Eng. Sway Bars (E30)",brand:"Ireland Engineering",cat:"susp",price:260,desc:"Front + rear adjustable sway bars — THE handling mod for E30. Transforms body roll.",hp:0,tq:0,ret:"Amazon",sk:3,time:2,tools:"14/16mm, jack stands",notes:"Ireland Engineering has been making E30 parts since E30s were new cars. These sway bars are the #1 recommended handling mod.",plats:["e30"]},
  {id:"be30_2",name:"Mishimoto Radiator (E30)",brand:"Mishimoto",cat:"ic",price:200,desc:"Aluminum radiator — the stock radiator is 35+ years old. Replace it before it kills your engine.",hp:0,tq:0,ret:"Amazon",sk:3,time:1.5,tools:"10mm, Phillips, drain pan, coolant",notes:"The stock E30 radiator is ancient. This is survival, not a mod.",plats:["e30"]},
  {id:"be30_3",name:"H&R Sport Springs (E30)",brand:"H&R",cat:"susp",price:200,desc:"1.25\" drop. The E30 looks incredible lowered. Handles better too.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"Spring compressor, 16/18mm, jack stands",notes:"The E30's classic boxy shape looks perfect with a subtle drop. H&R springs are the OEM+ choice.",plats:["e30"]},

  // ── SUBARU BRZ ──
  {id:"sb1",name:"JDL UEL Header (BRZ/86/FR-S)",brand:"JDL Auto Design",cat:"exhaust",price:400,desc:"Unequal length header — FIXES THE TORQUE DIP and adds the boxer rumble the car should have had. THE mod for this platform.",hp:15,tq:12,ret:"Amazon",sk:4,time:3,tools:"14mm, O2 socket, penetrating oil, jack stands",notes:"This is THE mod for the BRZ. Fixes the torque dip, adds power, and gives it the Subaru boxer rumble. Tune required.",plats:["brz"]},
  {id:"sb2",name:"OpenFlash Tablet (BRZ/86)",brand:"OpenFlash",cat:"tune",price:400,desc:"ECU flash tuner for the FA20. The BRZ tuning platform — Stage 1 fixes rev hang, Stage 2 for header.",hp:15,tq:10,ret:"Amazon",sk:1,time:0.3,tools:"None — OBD2 plug-in",notes:"The OFT is to the BRZ what the AccessPort is to the WRX. Essential for any bolt-on.",plats:["brz"]},
  {id:"sb3",name:"Perrin Shift Stop (BRZ/86)",brand:"Perrin",cat:"int",price:35,desc:"Same shift stop magic as WRX — removes 1-2 gate slop. The BRZ shifter is already good, this makes it great.",hp:0,tq:0,ret:"Amazon",sk:2,time:0.5,tools:"10mm, console tools",notes:"$35 to make a good shifter even better. Best value interior mod on the platform.",plats:["brz"]},
  {id:"sb4",name:"Tein Flex Z Coilovers (BRZ/86)",brand:"Tein",cat:"susp",price:900,desc:"16-way adjustable. The BRZ chassis is designed for this — proper coilovers unlock its full potential.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"17/19mm, breaker bar, jack stands, torque wrench",notes:"The BRZ with proper coilovers is one of the best-handling cars under $50k. The chassis is that good.",plats:["brz"]},

  // ── 240SX / S-CHASSIS ──
  {id:"ns1",name:"KA24DE Intake Manifold Swap",brand:"OEM Nissan",cat:"intake",price:80,desc:"The KA24DE intake manifold from a 1998 Frontier has larger runners than the 240SX manifold and bolts directly on. Junkyard cost: $50-100. Free top-end power.",hp:5,tq:3,ret:"Junkyard / eBay",sk:3,time:2,tools:"12mm, 14mm, intake gasket",notes:"One of the oldest S-chassis junkyard tricks. The Frontier KA manifold flows better than the 240SX one.",plats:["s_chassis"]},
  {id:"ns2",name:"BC Racing BR Coilovers (S13/S14)",brand:"BC Racing",cat:"susp",price:1050,desc:"30-way adjustable. The proper drift coilover. These handle the abuse that cheap coilovers can't.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"17/19mm, breaker bar, jack stands, torque wrench",notes:"If you're drifting more than twice a year, these are the minimum. Raceland blows out, BC survives.",plats:["s_chassis"]},
  {id:"ns3",name:"Koyo Radiator (S13/S14)",brand:"Koyo",cat:"ic",price:250,desc:"Aluminum racing radiator — essential for drift cars that run hot. Stock radiator can't handle sustained sideways driving.",hp:0,tq:0,ret:"Amazon",sk:3,time:1.5,tools:"10mm, Phillips, drain pan, coolant",notes:"Drift cars run hot because they're always at high RPM. Koyo is the trusted radiator brand in the drift community.",plats:["s_chassis"]},

  // ── AE86 ──
  {id:"ae1p",name:"4A-GE Timing Belt Kit",brand:"Gates / Aisin",cat:"engine",price:120,desc:"Complete timing belt kit — belt, water pump, tensioner. The 4A-GE is an interference engine. This is maintenance, not a mod. But it's the most important thing you can do.",hp:0,tq:0,ret:"Amazon",sk:3,time:4,tools:"Full socket set, timing tools, coolant",notes:"If you don't know when the timing belt was last done, do it NOW. The 4A-GE will eat its valves if the belt snaps.",plats:["ae86"]},
  {id:"ae2p",name:"Energy Suspension Bushing Kit (AE86)",brand:"Energy Suspension",cat:"susp",price:150,desc:"Polyurethane bushing kit — replaces all the 35-year-old rubber bushings that have turned to mush. Transforms chassis feel.",hp:0,tq:0,ret:"Amazon",sk:3,time:6,tools:"Press or hammer, bushing lube, lots of time",notes:"Old rubber bushings are the #1 reason old cars feel sloppy. New poly bushings make an AE86 feel tighter than some new cars.",plats:["ae86"]},

  // ── MK4 SUPRA ──
  {id:"mk4p1",name:"GReddy Intake (2JZ)",brand:"GReddy",cat:"intake",price:300,desc:"Short ram intake for 2JZ-GTE/GE. Lets you hear the legendary I6 breathe. Classic JDM brand.",hp:5,tq:4,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"The 2JZ with an open intake sounds absolutely incredible. That smooth inline-6 howl at redline.",plats:["mk4"]},
  {id:"mk4p2",name:"HKS Hi-Power Exhaust (Supra)",brand:"HKS",cat:"exhaust",price:900,desc:"Iconic HKS exhaust — the sound that defined JDM. Single exit, stainless, perfect fitment. The exhaust that every poster had in the 90s.",hp:5,tq:5,ret:"Amazon",sk:2,time:1.5,tools:"14mm, jack stands",notes:"The HKS Hi-Power on a 2JZ is one of the most iconic exhaust sounds in automotive history.",plats:["mk4"]},

  // ── TOYOTA CAMRY V6 ──
  {id:"tcv1",name:"K&N Cold Air Intake (2GR-FE)",brand:"K&N",cat:"intake",price:280,desc:"Cold air intake for the 2GR V6. Makes the V6 sound more aggressive above 4,000 RPM. Your Uber passengers will notice.",hp:5,tq:4,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"Yes, you're putting a cold air intake on a Camry. Own it. The 2GR sounds surprisingly good.",plats:["camry_v6"]},
  {id:"tcv2",name:"Eibach Pro-Kit Springs (Camry)",brand:"Eibach",cat:"susp",price:250,desc:"1\" drop. Makes the Camry look less like a taxi and more like a low-key sleeper. Improves handling too.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"Spring compressor, 17mm, jack stands",notes:"A lowered Camry V6 looks genuinely clean. Nobody expects it. That's the point.",plats:["camry_v6"]},
  {id:"tcv3",name:"Flowmaster Super 44 (Camry V6)",brand:"Flowmaster",cat:"exhaust",price:300,desc:"Axleback muffler swap — gives the 2GR a deeper, more muscular tone. Not loud, just... present. Your Camry has a voice now.",hp:2,tq:2,ret:"Amazon",sk:2,time:1,tools:"14mm, jack stands",notes:"A Flowmaster on a Camry is either the dumbest or most brilliant mod depending on your sense of humor. We think it's brilliant.",plats:["camry_v6"]},

  // ── NISSAN ALTIMA / MAXIMA ──
  {id:"na1p",name:"K&N Cold Air Intake (VQ35)",brand:"K&N",cat:"intake",price:280,desc:"Same K&N VQ intake used on the 350Z — fits the Altima/Maxima VQ35 too. Cross-platform parts are beautiful.",hp:6,tq:5,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"The VQ35 is the same engine in the 350Z. The intake fits the same way. The sound is the same. The car is just... less cool looking.",plats:["altima","z33"]},
  {id:"na2p",name:"Eibach Pro-Kit Springs (Altima/Maxima)",brand:"Eibach",cat:"susp",price:250,desc:"1\" drop. The Altima sits too high from the factory. Drop it and it looks 100% better.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"Spring compressor, 17/19mm, jack stands",notes:"A lowered Altima 3.5 SE-R actually looks aggressive. The wide body with a 1\" drop = sleeper perfection.",plats:["altima"]},
  {id:"na3p",name:"Megan Racing Catback (Altima 3.5)",brand:"Megan Racing",cat:"exhaust",price:380,desc:"Stainless dual-tip catback — makes the VQ35 sound like it should. Deep V6 tone, no drone.",hp:4,tq:3,ret:"Amazon",sk:2,time:1.5,tools:"14mm, jack stands",notes:"The VQ35 in the Altima sounds just as good as the 350Z with the right exhaust. Same engine, same sound.",plats:["altima"]},

  // ── MAZDA PROTEGE ──
  {id:"mp1",name:"K&N Drop-In Filter (Protegé)",brand:"K&N",cat:"intake",price:40,desc:"Drop-in filter for the 2.0L. The cheapest mod. Zero risk, zero tune needed.",hp:2,tq:1,ret:"Amazon",sk:1,time:0.1,tools:"None",notes:"The FS-ZE 2.0L breathes a little easier. Don't expect miracles — expect a $40 smile.",plats:["protege"]},
  {id:"mp2",name:"Racing Beat Exhaust (Protegé)",brand:"Racing Beat",cat:"exhaust",price:350,desc:"The same Racing Beat quality from the Miata world. The Protegé5 with a proper exhaust sounds better than you'd expect.",hp:3,tq:2,ret:"Amazon",sk:2,time:1.5,tools:"14mm, jack stands",notes:"Racing Beat makes Mazda parts. Period. If it's a Mazda, they probably make an exhaust for it.",plats:["protege"]},
  {id:"mp3",name:"Eibach Sportline Springs (Protegé)",brand:"Eibach",cat:"susp",price:200,desc:"1.5\" drop. Aggressive stance on a car nobody expects to be lowered. The Protegé5 hatch lowered looks great.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"Spring compressor, 17mm, jack stands",notes:"The Protegé5 has a surprisingly athletic chassis. Lower it and feel the difference.",plats:["protege"]},

  // ── FORD CROWN VIC ──
  {id:"fcv1",name:"PI Intake Manifold Swap",brand:"Ford OEM",cat:"intake",price:100,desc:"The Performance Improved (PI) intake manifold from a 1999+ Crown Vic/Mustang GT bolts onto earlier 4.6L engines and flows better. Junkyard cost: $50-100. Free power from Ford's own engineering update.",hp:15,tq:12,ret:"Junkyard / eBay",sk:3,time:3,tools:"Full socket set, new intake gaskets, coolant",notes:"The PI manifold swap has been documented on CrownVic.net since 2002. It's the original Crown Vic power mod. The earlier plastic manifold also cracks, so you're fixing a reliability issue AND gaining power.",plats:["crown_vic"]},
  {id:"fcv2",name:"Flowmaster 40 Series (Crown Vic)",brand:"Flowmaster",cat:"exhaust",price:250,desc:"Mellow V8 rumble — makes the 4.6L sound like the muscle car it secretly is. Not too loud for a car people already think is a cop car.",hp:3,tq:3,ret:"Amazon",sk:2,time:1.5,tools:"15mm, jack stands",notes:"A Crown Vic with a Flowmaster sounds like a proper American V8 sedan. The deep idle rumble is perfect for the intimidation factor.",plats:["crown_vic"]},
  {id:"fcv3",name:"Panhard Bar (Crown Vic)",brand:"BMR / Metco",cat:"susp",price:200,desc:"Locates the rear axle properly — the stock setup lets the rear end wander. Essential for any performance driving or drifting.",hp:0,tq:0,ret:"Amazon",sk:3,time:2,tools:"18mm, jack stands",notes:"The Panther platform has a live rear axle. The panhard bar makes the rear end predictable. Essential for drift P71 builds.",plats:["crown_vic"]},
  {id:"fcv4",name:"H&R Sport Springs (Crown Vic)",brand:"H&R",cat:"susp",price:230,desc:"1.5\" drop. Takes the Crown Vic from undercover cop car to low-rider muscle sedan. Handles dramatically better lowered.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"Spring compressor, 18mm, jack stands",notes:"A lowered Crown Vic is one of the best-looking American sedans ever made. Fight me.",plats:["crown_vic"]},

  // ── FORD FOCUS ST ──
  {id:"fst1",name:"COBB AccessPort (Focus ST)",brand:"COBB",cat:"tune",price:650,desc:"Full ECU flash — Stage 1 = instant power. The EcoBoost 2.0T wakes up immediately. Same COBB quality as the WRX AP.",hp:30,tq:40,ret:"Amazon",sk:1,time:0.3,tools:"None — OBD2 plug-in",notes:"The Focus ST + COBB AP is the same formula as the WRX + COBB AP. Flash, drive, grin.",plats:["focus_st"]},
  {id:"fst2",name:"CP-e FMIC (Focus ST)",brand:"CP-e",cat:"ic",price:550,desc:"Front-mount intercooler — the stock IC heat soaks after one pull. This fixes it permanently.",hp:10,tq:15,ret:"Amazon",sk:3,time:3,tools:"T25/T30, 10/12mm, drain pan",notes:"The stock Focus ST intercooler is the #1 limitation. Upgrading it unlocks consistent power in all conditions.",plats:["focus_st"]},
  {id:"fst3",name:"Cobb Catted Downpipe (Focus ST)",brand:"COBB",cat:"exhaust",price:500,desc:"3\" catted downpipe — Stage 2 territory. Biggest single power gain after the tune. RETUNE REQUIRED.",hp:20,tq:25,ret:"Amazon",sk:4,time:2.5,tools:"T30, 13mm, O2 socket, penetrating oil, jack stands",notes:"Flash Stage 2 before first start. The Focus ST downpipe + tune is where the real power lives.",plats:["focus_st"]},
  {id:"fst4",name:"Boomba Racing Motor Mount (Focus ST)",brand:"Boomba",cat:"engine",price:90,desc:"Upgraded rear motor mount — the stock one breaks on EVERY Focus ST. Causes horrible clunking. $90 to fix a universal problem.",hp:0,tq:0,ret:"Amazon",sk:2,time:1,tools:"14mm, 17mm, jack",notes:"Same issue as the MS3 rear motor mount — the stock one is too soft for the torque. Replace it before it breaks.",plats:["focus_st"]},

  // ── CHEVY COBALT SS ──
  {id:"css1p",name:"ZZP Intake (Cobalt SS Turbo)",brand:"ZZPerformance",cat:"intake",price:200,desc:"Short ram intake with heat shield. ZZP is the Cobalt SS aftermarket — they're the brand that kept this community alive after GM abandoned it.",hp:5,tq:8,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"ZZPerformance is to the Cobalt SS what Flyin' Miata is to the Miata. THE brand for this platform.",plats:["cobalt_ss"]},
  {id:"css2p",name:"ZZP Catted Downpipe (Cobalt SS)",brand:"ZZPerformance",cat:"exhaust",price:350,desc:"High-flow catted downpipe — massive gains on the LNF turbo. Tune required.",hp:15,tq:20,ret:"Amazon",sk:4,time:2.5,tools:"15mm, O2 socket, penetrating oil, jack stands",notes:"The LNF 2.0T responds to exhaust flow improvements dramatically. Tune with HPTuners after install.",plats:["cobalt_ss"]},
  {id:"css3p",name:"Trifecta Tune (Cobalt SS)",brand:"Trifecta",cat:"tune",price:400,desc:"Custom tune for the LNF — 300+WHP on stock internals. The tuning platform the Cobalt SS community trusts.",hp:40,tq:50,ret:"Amazon",sk:1,time:0.3,tools:"Laptop, tuning cable",notes:"Trifecta is the go-to tuner for GM Ecotec engines. The LNF on a Trifecta tune makes scary power for a FWD car.",plats:["cobalt_ss"]},
  {id:"css4p",name:"Eibach Sportline Springs (Cobalt SS)",brand:"Eibach",cat:"susp",price:220,desc:"1.5\" drop. The Cobalt sits too high stock. Lower it and it actually looks like the performance car it is.",hp:0,tq:0,ret:"Amazon",sk:3,time:3,tools:"Spring compressor, 17/19mm, jack stands",notes:"The Cobalt SS lowered 1.5\" on Sportlines looks aggressive and handles much better in corners.",plats:["cobalt_ss"]},

  // ── PONTIAC G8 GT / CHEVY SS ──
  {id:"g8p1",name:"K&N Cold Air Intake (G8/SS)",brand:"K&N",cat:"intake",price:300,desc:"Full cold air intake for the L76/LS3. Same LS intake system used across GM V8s. Opens up the V8 breathing.",hp:10,tq:8,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"The LS V8 with an open intake sounds like it's clearing its throat before a fight. Addictive.",plats:["g8_gt"]},
  {id:"g8p2",name:"Kooks Long Tube Headers (G8/SS)",brand:"Kooks",cat:"exhaust",price:1200,desc:"1-7/8\" stainless long tube headers — massive power gains on the LS V8. The biggest bolt-on power mod.",hp:30,tq:25,ret:"Amazon",sk:5,time:6,tools:"15mm deep, O2 sockets, penetrating oil, jack stands, full day of time",notes:"Headers on an LS V8 are always the biggest single power gain. Tune required after install.",plats:["g8_gt","camaro"]},
  {id:"g8p3",name:"Pedders Coilovers (G8/SS)",brand:"Pedders",cat:"susp",price:1400,desc:"Australian-made coilovers — Pedders is the suspension company that tuned the G8/Commodore for Holden. Nobody knows this car's chassis better.",hp:0,tq:0,ret:"Amazon",sk:4,time:4,tools:"16/18mm, breaker bar, jack stands, torque wrench",notes:"Pedders literally developed the original suspension for this car when it was sold as the Holden Commodore in Australia. This is the OEM+ choice.",plats:["g8_gt"]},
  {id:"g8p4",name:"Barton Short Shifter (G8 GXP / SS 6MT)",brand:"Barton",cat:"int",price:300,desc:"Short throw shifter for the TR-6060 6-speed. Reduces throw by 40%. Makes the already-good manual even better.",hp:0,tq:0,ret:"Amazon",sk:3,time:2,tools:"Shifter removal tools, console tools",notes:"The TR-6060 in the G8 GXP and Chevy SS is a great transmission. The Barton shifter makes it excellent.",plats:["g8_gt"]},

  // ── FORD RANGER ──
  {id:"frp1",name:"COBB AccessPort (Ranger 2.3 EcoBoost)",brand:"COBB",cat:"tune",price:650,desc:"Full ECU flash for the Ranger 2.3 EcoBoost. Same COBB quality. +40HP feels massive in a midsize truck.",hp:40,tq:60,ret:"Amazon",sk:1,time:0.3,tools:"None — OBD2 plug-in",notes:"The 2.3 EcoBoost in the Ranger is the same engine family as the Focus RS. It responds to tuning very well.",plats:["ranger"]},
  {id:"frp2",name:"aFe Momentum Intake (Ranger 2.3)",brand:"aFe",cat:"intake",price:320,desc:"Sealed cold air intake — turbo spool sounds and real flow gains. The 2.3T sounds great with a proper intake.",hp:8,tq:12,ret:"Amazon",sk:1,time:0.5,tools:"10mm, flathead",notes:"The turbo spool on the 2.3 EcoBoost with an open intake is surprisingly addictive for a truck.",plats:["ranger"]},
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

  // ═══ NEW BUILDS — filling every platform + tier ═══

  // ── EK BUILDS (was empty!) ──
  {id:"fb_ek1",name:"The $250 EK Daily Refresh",tier:"fuckit",plat:"ek",diff:1,author:"Luis R.",veh:"1998 Civic EX — 167k",cost:249,hp:5,tq:3,time:"2 hours",pids:["h3","h12","h62"],
    story:"AEM intake for $89 because the stock airbox was cracked anyway. Buddy Club shift knob for $35 because the stock one was sticky. eBay carbon lip for $60 because why not. And Skunk2 springs for $160 because the car sat like a 4x4. Okay that's $344 but I found the springs used for $100. The car looks and drives completely different for basically nothing.",
    lessons:"Lowering springs are the single biggest visual transformation on EK. The car goes from soccer-mom height to actually looking like it belongs at a meet.",
    order:"1. Springs (biggest visual change) → 2. Intake → 3. Lip → 4. Shift knob",verified:true},
  {id:"fb_ek2",name:"EK Autocross Weapon",tier:"street",plat:"ek",diff:3,author:"Amanda S.",veh:"2000 Civic Si (EM1) — 120k",cost:1440,hp:25,tq:16,time:"3 weekends",pids:["h2","h4","h6","h7","h62","h10","h11"],
    story:"Chipped P28 ECU, Injen intake, DC header, Skunk2 exhaust, Progress rear sway bar, Konig Hypergrams on Federals. This thing is a knife at autocross. At 2,400 lbs with sticky tires, it changes direction like nothing else in the novice class. The rear sway bar was the secret weapon — killed the understeer completely.",
    lessons:"The EM1 Si is already a great car — it just needs the right mods in the right order. Header first for power, rear sway bar for handling, tires for grip. Don't waste money on coilovers until you've maxed out the tire compound.",
    order:"1. Header → 2. Intake → 3. Exhaust → 4. ECU → 5. Rear sway bar → 6. Wheels + tires → 7. Alignment",verified:true},

  // ── 8TH GEN BUILDS (was empty!) ──
  {id:"fb_8g1",name:"The K20 Screamer",tier:"street",plat:"8g",diff:3,author:"Marcus T.",veh:"2008 Civic Si FA5 — 89k",cost:1335,hp:35,tq:21,time:"3 weekends",pids:["h20","h21","h23","h22"],
    story:"FlashPro + Takeda intake + PLM header + Q300 catback. The K20Z3 was already good — now it's incredible. The header opened up the top end in a way I didn't think was possible on an NA engine. It pulls hard all the way to 8,000 RPM redline and the Q300 makes it sound like a proper sports car. 220WHP at the wheels on a conservative tune.",
    lessons:"On NA K-series, the header is everything. It's a harder install than the other bolt-ons but the gains are massive. Get the tune adjusted for the header — running a header without a tune leaves power on the table and can cause lean conditions.",
    order:"1. FlashPro → 2. Intake → 3. Header (retune) → 4. Catback",verified:true},
  {id:"fb_8g2",name:"8th Gen Budget Brawler",tier:"fuckit",plat:"8g",diff:1,author:"Tyler K.",veh:"2010 Si FG2 — 104k",cost:345,hp:7,tq:4,time:"1 hour",pids:["h65","h66","n5"],
    story:"K&N drop-in filter ($50), eBay short ram intake ($45), and an Alcantara steering wheel wrap ($45). That's it. The filter and intake add a little breathing room and the VTEC crossover sound is more noticeable. The steering wheel wrap makes the interior feel premium. $345 total and the car feels more special to drive every day.",
    lessons:"Sometimes the best mods aren't about power — they're about making the car feel better. The steering wheel wrap alone makes every drive more enjoyable.",
    order:"1. Drop-in filter → 2. Short ram intake → 3. Steering wheel wrap",verified:true},

  // ── 9TH GEN BUILDS (was empty!) ──
  {id:"fb_9g1",name:"The Torque Monster K24",tier:"street",plat:"9g",diff:3,author:"David L.",veh:"2014 Civic Si — 62k",cost:1550,hp:35,tq:27,time:"3 weekends",pids:["h30","h31","h33","h32"],
    story:"FlashPro + K&N intake + PLM header + Q300 catback. The K24 is all about midrange torque and the header made it even better. This car pulls like a freight train from 3,500-6,500 RPM. The Q300 gives it a deeper, more mature tone than the 8th gen setup. 235WHP at the wheels — not bad for a naturally aspirated 2.4L.",
    lessons:"The 9th gen is genuinely underrated. The K24 makes more usable power than the K20 in daily driving because of the extra torque. Header + tune is the move — the gains are huge in the midrange where you actually drive.",
    order:"1. FlashPro → 2. Intake → 3. Header (retune mandatory) → 4. Catback",verified:true},

  // ── E46 BUILDS (was empty!) ──
  {id:"fb_e46_1",name:"The $400 E46 Gentleman",tier:"fuckit",plat:"e46",diff:2,author:"James W.",veh:"2003 330i — 130k",cost:395,hp:10,tq:6,time:"One weekend",pids:["b2","b45","b48","n8"],
    story:"aFe intake ($175), K&N drop-in as a spare ($50), aluminum expansion tank ($90) because I'm not dying on the highway, and an M Performance shift boot + knob ($120) because the stock interior was tired. The intake sound alone is worth the price — the M54 inline-6 howl at redline is addictive. And the expansion tank means I can actually drive the car without anxiety.",
    lessons:"On any E46 — fix the cooling before anything else. The aluminum expansion tank is $90 insurance against a $3,000 engine replacement. After that, the intake is the best bang-for-buck mod because the M54 sounds incredible with more air.",
    order:"1. Expansion tank (survival) → 2. Intake → 3. Shift knob + boot → 4. Enjoy the I6 sound",verified:true},
  {id:"fb_e46_2",name:"E46 Canyon Carver",tier:"weekend",plat:"e46",diff:4,author:"Eric N.",veh:"2004 330i ZHP — 95k",cost:2155,hp:17,tq:11,time:"4 weekends",pids:["b10","b2","b11","b47","b45","b46"],
    story:"Shark Injector tune + aFe intake + Magnaflow catback + BC Racing coilovers + K&N drop-in + UUC short shifter. The ZHP was already the best-handling E46 from the factory. With BC coilovers and the UUC shifter, it's a canyon weapon. The tune and intake add just enough power to keep things exciting. This is a driver's car — it's not about straight-line speed, it's about how it makes you feel through corners.",
    lessons:"The E46 chassis is magical with good coilovers. Don't cheap out on suspension for this platform — the chassis deserves proper dampers. The UUC short shifter is the #1 interior mod for any E46 manual. And check your subframe before installing coilovers.",
    order:"1. Cooling system check → 2. Coilovers + alignment → 3. UUC short shifter → 4. Tune → 5. Intake → 6. Catback",verified:true},

  // ── F30 BUILDS (was empty!) ──
  {id:"fb_f30_1",name:"The $600 400HP Daily",tier:"fuckit",plat:"f30",diff:1,author:"Alex M.",veh:"2017 340i — 52k",cost:600,hp:80,tq:85,time:"1 hour",pids:["b30","b56"],
    story:"BM3 Stage 1 flash tune. That's literally the only mod. The B58 goes from 320HP to 400+ HP with a 10-minute flash. I also picked up MHD ($100) as a backup tune option. The car looks completely stock — no exhaust, no intake, no badges. But it embarrasses cars that cost twice as much. The ZF 8-speed transmission adapts to the extra power beautifully.",
    lessons:"The B58 340i is the most underrated performance car you can buy right now. 400HP with a tune, luxury interior, reasonable insurance, and nobody knows. It's the modern N54 story but with BMW reliability finally figured out.",
    order:"1. BM3 or MHD tune → 2. That's literally it",verified:true},
  {id:"fb_f30_2",name:"F30 Street Sleeper",tier:"sleeper",plat:"f30",diff:3,author:"Kevin R.",veh:"2018 340i — 40k",cost:1930,hp:115,tq:127,time:"2 weekends",pids:["b30","b32","b33","b34","b36"],
    story:"BM3 tune + aFe intake + VRSF catless downpipe + VRSF chargepipe + H&R springs. From the outside it looks like a slightly lowered 340i. From the dyno it makes 435WHP. The downpipe + tune combo is where the real power lives — the B58 turbo spools faster and holds boost longer. The springs give it a clean stance without ruining the ride. Nobody suspects this car.",
    lessons:"The B58 downpipe is the single biggest bolt-on gain after the tune. The stock downpipe is extremely restrictive. Go catted if you want to be emissions-legal, catless if you don't care. Either way, retune after install.",
    order:"1. BM3 Stage 1 → 2. Chargepipe (same day as tune) → 3. Intake → 4. Downpipe (flash Stage 2) → 5. Springs + alignment",verified:true},

  // ── GD WRX/STI BUILDS (was empty!) ──
  {id:"fb_gd1",name:"The Bugeye on a Budget",tier:"fuckit",plat:"gd",diff:1,author:"Matt C.",veh:"2003 WRX Bugeye — 128k",cost:155,hp:2,tq:2,time:"30 minutes",pids:["s2","s13","n1"],
    story:"K&N drop-in filter ($55), Kartboy short shifter ($100), and a weighted shift knob ($40). The filter is a zero-risk mod that needs no tune. The Kartboy shifter completely transforms the mushy stock WRX gearbox into something precise and mechanical. The weighted knob makes it even better. Total: 30 minutes of work and the car feels like a different machine to shift.",
    lessons:"The WRX shifter is the worst part of the driving experience from the factory. Fix it first. The Kartboy + weighted knob combo is the best $140 you'll spend on any WRX.",
    order:"1. Short shifter + knob (biggest feel change) → 2. Drop-in filter",verified:true},
  {id:"fb_gd2",name:"Hawkeye STI Street Fighter",tier:"weekend",plat:"gd",diff:4,author:"Chris B.",veh:"2007 STI — 76k",cost:2530,hp:35,tq:42,time:"3 weekends",pids:["s1","s5","s6","s7","s8","s11"],
    story:"COBB AP + AEM intake + Grimmspeed J-pipe + Tomei catback + Grimmspeed TMIC + Whiteline sway bars. Protuned to 340WHP on a conservative map. The Tomei exhaust sounds absolutely incredible on the EJ257 — the unequal-length header rumble through titanium is automotive music. The Whiteline sway bars killed the understeer and the car rotates beautifully now.",
    lessons:"The EJ257 STI responds well to bolt-ons BUT you must get a protune from a Subaru specialist. The COBB OTS maps are fine temporarily but they're not optimized for your specific car. Budget $400 for a protune — it's the most important part of the entire build.",
    order:"1. COBB AP Stage 1 → 2. Intake → 3. TMIC → 4. J-pipe (flash Stage 2 before start) → 5. Catback → 6. Sway bars → 7. PROTUNE",verified:true},

  // ── GR WRX/STI BUILDS (was empty!) ──
  {id:"fb_gr1",name:"GR Hatch Budget Sound",tier:"fuckit",plat:"gr",diff:2,author:"Pete V.",veh:"2011 WRX Hatch — 85k",cost:385,hp:3,tq:3,time:"2 hours",pids:["s2","s4","s14","n1"],
    story:"K&N filter + Nameless axleback + Perrin shift stop + weighted knob. The Nameless 5\" mufflers bring out the boxer rumble without being obnoxious. The shift stop + weighted knob make the shifter feel 10x better. The filter is just peace of mind. Total: 2 hours and $385 for a car that sounds great and shifts great.",
    lessons:"The Nameless 5-inch muffler axleback is the perfect volume level — loud enough to enjoy the boxer rumble, quiet enough for daily driving. The muffler delete is TOO loud for most people's daily. Trust me on the 5-inch.",
    order:"1. Axleback (biggest change) → 2. Shift stop + knob → 3. Filter",verified:true},
  {id:"fb_gr2",name:"GR STI Hatch Track Build",tier:"weekend",plat:"gr",diff:4,author:"Nicole K.",veh:"2013 STI Hatch — 58k",cost:2980,hp:35,tq:42,time:"4 weekends",pids:["s1","s5","s6","s8","s7","s11","s17"],
    story:"AP + intake + J-pipe + TMIC + Tomei catback + Whiteline sway bars + BC coilovers. This is the complete GR STI setup. Protuned to 340WHP, the car handles flat through corners on the BCs, the Whiteline bars eliminated understeer, and the Tomei is pure theater. The hatch is the best STI body style and now it drives like it looks — aggressive and purposeful.",
    lessons:"The GR STI hatch is becoming a collector car. Don't hack it up — keep it reversible. Good coilovers, sway bars, and a conservative tune preserve the car while making it dramatically better to drive.",
    order:"1. AP Stage 1 → 2. Sway bars + coilovers + alignment → 3. TMIC → 4. Intake → 5. J-pipe (Stage 2) → 6. Catback → 7. Protune",verified:true},

  // ── STREET TIER (was empty!) ──
  {id:"fb_st1",name:"The $1000 E36 Driver",tier:"street",plat:"e36",diff:3,author:"Aaron J.",veh:"1997 328i — 140k",cost:1010,hp:11,tq:8,time:"2 weekends",pids:["b4","b2","b3","b6","b7","b44"],
    story:"Mishimoto radiator + aluminum expansion tank + aFe intake + budget catback + Ireland Engineering sway bars. Fixed the cooling first (non-negotiable), then added intake and exhaust for sound, and the Ireland sway bars for handling. The sway bars alone are worth twice their price — the car went from body-rolling through corners to staying flat and composed.",
    lessons:"The Ireland Engineering sway bars are the single best mod you can do to an E36 for handling. Better than coilovers if your stock struts are still good. The front + rear set transforms the car for $285.",
    order:"1. Radiator + expansion tank (survival) → 2. Sway bars → 3. Intake → 4. Catback",verified:true},
  {id:"fb_st2",name:"VA WRX Sound + Shift Build",tier:"street",plat:"va",diff:2,author:"Jordan P.",veh:"2018 WRX — 42k",cost:1135,hp:27,tq:32,time:"1 weekend",pids:["s1","s2","s4","s13","s14"],
    story:"COBB AP Stage 1 + K&N filter + Nameless axleback + Kartboy shifter + Perrin shift stop. The AP fixed the rev hang and added noticeable power. The Nameless brought out the boxer rumble. The Kartboy + Perrin combo made the shifter actually enjoyable. This is the 'fix everything wrong with the stock WRX' build.",
    lessons:"The COBB AP should be the first mod on any WRX. Not for the power — for the rev hang fix. The stock rev hang makes downshifting miserable. One flash and it's gone.",
    order:"1. COBB AP (fixes rev hang) → 2. Short shifter + shift stop → 3. Axleback → 4. Filter",verified:true},

  // ═══ MISSING PLATFORM BUILDS — filling every gap ═══
  {id:"fb_dc2",name:"GS-R Bolt-On Beast",tier:"street",plat:"dc2",diff:3,author:"Danny H.",veh:"1998 Integra GS-R — 134k",cost:460,hp:17,tq:11,time:"One weekend",pids:["h6","h3"],
    story:"DC Sports header + AEM intake on the B18C1. The header was a fight — took 4 hours and two bloody knuckles — but the result is a car that SCREAMS above 5,500 RPM. The B18C1 with bolt-ons and VTEC is one of the best sounds in the Honda world. 190WHP NA from a 1.8L. The Integra chassis is stiffer than the Civic and you feel it in corners. This car doesn't need more power — it needs a canyon.",
    lessons:"The Integra GS-R is the thinking person's Honda. Better brakes, stiffer chassis, more power than an EK Si. The header is the #1 mod — same as any Honda. The B18C1 rewards high RPM like nothing else.",
    order:"1. Header (biggest gain) → 2. Intake → 3. Find a canyon road → 4. Rev to 8,200 RPM and question why turbo cars exist",verified:true},
  {id:"fb_pre",name:"Prelude SH — The Forgotten Hero",tier:"fuckit",plat:"prelude",diff:2,author:"Marco J.",veh:"1999 Prelude SH — 142k",cost:350,hp:8,tq:5,time:"Half a day",pids:["h3","h6"],
    story:"AEM intake + DC header on the H22A4. The Prelude already makes 200HP stock — more than any Civic of its era. The header opened up the top end and the intake lets you hear VTEC engage. The ATTS torque vectoring on the SH model pulls the car through corners in a way that's hard to describe — it's like the car reads your mind. $350 in parts and this $6k coupe embarrasses cars that cost 4x as much. The Prelude is the best car Honda made that everyone forgot about.",
    lessons:"The Prelude SH with ATTS is 20 years ahead of its time. The torque vectoring system is genuinely magic. Don't forget to change the ATTS fluid though — it's a $2k repair if the system dies from neglect.",
    order:"1. ATTS fluid change (survival) → 2. Header → 3. Intake → 4. Tell everyone about the Prelude and watch them not care (yet)",verified:true},
  {id:"fb_s2k",name:"S2000 — Tires First, Always",tier:"street",plat:"s2k",diff:2,author:"Rachel T.",veh:"2004 S2000 AP2 — 78k",cost:600,hp:0,tq:0,time:"1 hour",pids:["mz7"],
    story:"Federal 595 RS-RR tires. That's it. The S2000 doesn't need more power — it has 240HP in a 2,800 lb car with a 9,000 RPM redline. What it needs is GRIP. The stock tires are okay but Federals transformed the car from 'scary fast' to 'confidence-inspiring fast.' The AP1 snap oversteer that everyone warns about? It goes away with proper tires. The S2000 is already perfect — I just gave it shoes that match its talent.",
    lessons:"The S2000 is the rare car that doesn't need mods to be great. Tires are the #1 mod because they fix the car's only weakness — the stock tires don't match the chassis capability. Everything else is optional.",
    order:"1. Good tires (this is the only mandatory mod) → 2. Drive it like Honda intended → 3. Resist the urge to turbo it",verified:true},
  {id:"fb_acc2t",name:"The Invisible 300WHP Accord",tier:"sleeper",plat:"accord2t",diff:1,author:"Sam W.",veh:"2019 Accord Sport 2.0T 6MT — 32k",cost:695,hp:50,tq:65,time:"30 minutes",pids:["h40"],
    story:"Hondata FlashPro. Nothing else. The K20C4 went from 252HP to 300+ with a conservative tune. The car looks like every other Accord in the parking lot. But from a roll it pulls on Mustang GTs and WRX STIs. The 6-speed manual in the Accord is genuinely excellent and the 2.0T has torque EVERYWHERE. This is the perfect sleeper because nobody — not cops, not insurance, not other drivers — expects an Accord to be fast.",
    lessons:"The Accord 2.0T is the modern Civic Si for adults. Type R power in a car that blends into traffic. The FlashPro tune is the only mod you need. The rest is just enjoying the confusion on other people's faces.",
    order:"1. FlashPro → 2. That's it → 3. Never put a badge on it → 4. Enjoy the confusion",verified:true},
  {id:"fb_fit",name:"The Fit That Doesn't Quit",tier:"fuckit",plat:"fit",diff:1,author:"Lily C.",veh:"2012 Fit Sport 5MT — 98k",cost:200,hp:3,tq:2,time:"1 hour",pids:["h3","n1"],
    story:"AEM intake + weighted shift knob. Yes, I modded a Honda Fit. No, I don't care what you think. The intake makes the little 1.5L VTEC sound like it's trying SO hard above 5,000 RPM and honestly it's adorable. The weighted knob makes the 5-speed feel less like a toy. The Fit is the happiest car to drive because it makes you work for every bit of speed. Is it fast? No. Is it fun? Absolutely. Can I fit a full drum kit in the back? Also yes.",
    lessons:"The Fit is proof that fun doesn't require fast. The car weighs nothing, revs happily, and puts a smile on your face in traffic. Sometimes the best mod is the right attitude.",
    order:"1. Intake (hear the 1.5 try its hardest) → 2. Shift knob → 3. Accept your life choices → 4. Smoke a Porsche in a parking garage because you fit in spots they can't",verified:true},
  {id:"fb_accv6",name:"The Dentist's Weapon",tier:"street",plat:"accord_v6",diff:2,author:"Paul R.",veh:"2010 Accord EX-L V6 6MT Coupe — 72k",cost:400,hp:8,tq:6,time:"Half a day",pids:["h3","h6"],
    story:"AEM intake + header on the J35. The 6-speed manual V6 Coupe is the Honda that enthusiasts buy when they need 4 real seats and don't want to explain their car choices at Thanksgiving. It makes 271HP stock, sounds great with bolt-ons, and looks like every other Accord on the road. But with the 6-speed it revs to 6,800 RPM and the J35 V6 makes this incredibly smooth power delivery. My autocross friends laugh until I run a faster time than their Civics.",
    lessons:"The Accord V6 6MT Coupe is the most underrated Honda ever made. More power than an Si, better sound, more comfortable, and nobody cares about it. That's the appeal.",
    order:"1. Header → 2. Intake → 3. Never tell anyone your Accord is fast → 4. Let the lap times speak",verified:true},
  {id:"fb_e30",name:"E30 — Keep It Alive Build",tier:"fuckit",plat:"e30",diff:2,author:"Greg S.",veh:"1988 325i — 198k, runs, has soul",cost:400,hp:5,tq:3,time:"One weekend",pids:["b2","b44"],
    story:"aFe intake + aluminum expansion tank. The E30 is 35 years old and the original cooling system was designed to last 10 years. The expansion tank was literally cracked when I bought it — held together by hopes and prayers. The aluminum tank means I can actually drive the car without anxiety. The aFe intake makes the M20 I6 sound beautiful at 6,000 RPM. The E30 doesn't need to be fast — it needs to be ALIVE. Mine is alive now. That's enough.",
    lessons:"On an E30, step one is always keeping it running. The cooling system, the timing belt, the electricals — fix everything before you even think about power. A running E30 is a beautiful thing. A dead E30 is a parts car.",
    order:"1. Expansion tank (survive) → 2. Timing belt if unknown → 3. Intake → 4. Drive it before it rusts away",verified:true},
  {id:"fb_e82",name:"135i — The Better 335i",tier:"street",plat:"e82",diff:1,author:"Kevin D.",veh:"2010 135i N54 — 82k",cost:220,hp:63,tq:63,time:"20 minutes",pids:["b21","b22"],
    story:"MHD free tune + BMS dual cone intake. Same mods as the famous 'Free Tune E90' build but in a car that weighs 400 lbs less. The 135i with MHD Stage 1 is absolutely hilarious — it's a go-kart with 360HP. The shorter wheelbase means it changes direction faster than the 335i. The intake lets you hear both turbos spool. Total cost: $220. This car gaps M3s. For $220. I will never financially recover from knowing this was possible.",
    lessons:"Everything that works on the 335i works on the 135i — for 400 lbs less. The 135i is the better car and the market hasn't figured it out yet. Buy one before they do.",
    order:"1. MHD (5 min, free-ish) → 2. BMS intake (15 min) → 3. Question why you ever considered a 335i",verified:true},
  {id:"fb_brz",name:"BRZ — Fixing the Torque Dip",tier:"street",plat:"brz",diff:3,author:"Matt K.",veh:"2017 Toyota 86 — 45k",cost:800,hp:20,tq:15,time:"1 weekend",pids:["mz2","mz3"],
    story:"Racing Beat header (they work on the BRZ FA20 too) + tune. Actually I used a JDL UEL header ($400) + OFT tune ($400). The torque dip that every reviewer complains about? Gone. Completely. The car pulls smoothly from 2,000 to 7,400 RPM now instead of falling on its face at 3,500. The UEL header also gives it a boxer rumble that it should have had from the factory. This is the mod that makes the BRZ the car Toyota/Subaru SHOULD have sold.",
    lessons:"Headers + tune fix the BRZ's only real flaw. The torque dip is not an inherent limitation — it's a tuning compromise from the factory. $800 to fix it is the best money you can spend on this platform. After that, tires and suspension.",
    order:"1. Header + tune (fixes torque dip) → 2. Tires (stock are dangerous) → 3. Suspension → 4. Enjoy the best chassis under $30k",verified:true},
  {id:"fb_lgt",name:"Legacy GT — WRX in a Suit",tier:"sleeper",plat:"lgt",diff:1,author:"Rich M.",veh:"2007 Legacy GT spec.B 6MT — 95k",cost:650,hp:25,tq:30,time:"30 minutes",pids:["s1"],
    story:"COBB AccessPort Stage 1. That's it. The Legacy GT spec.B already has the 6-speed manual, Bilstein suspension, and the EJ255 turbo. It just needed the tune. Stage 1 fixed the boost curve, added 25HP, and made the car pull like the WRX it secretly is. But from the outside it looks like a midsize Subaru sedan that an accountant drives. Nobody suspects this car. I've rolled on WRXs and STIs at lights and they have no idea what just happened. The spec.B steering wheel still has leather. The seats are comfortable. The trunk fits golf clubs. It's the mature man's WRX.",
    lessons:"The Legacy GT is the WRX for people who grew up but didn't want to slow down. Same engine, same tune support, zero boy-racer stigma. The spec.B with the 6-speed is the holy grail — factory Bilsteins, shorter gearing, and a limited-slip rear diff.",
    order:"1. COBB AP Stage 1 → 2. Wear a button-down while driving → 3. Gap WRXs politely",verified:true},
  {id:"fb_nb",name:"NB Miata — The Smart Buy",tier:"fuckit",plat:"miata_nb",diff:2,author:"Amy R.",veh:"2001 Miata LS — 118k",cost:520,hp:5,tq:4,time:"3 hours",pids:["mz1","mz5","mz7"],
    story:"FM intake + Mishimoto radiator + Federals. Everyone wants the NA because pop-up headlights. I bought the NB because it's $4k cheaper, has more power, better brakes, and a stiffer chassis. With the FM intake it breathes better, the Mishimoto means the 20-year-old cooling system won't kill me, and the Federals give it grip that makes Porsche owners nervous at autocross. $520 total and the car is ready for anything. Pop-up headlights are cool but not $4,000-cooler.",
    lessons:"The NB Miata is the smart money play. Everything the NA does but better, for less money. The market overvalues pop-up headlights. Your wallet will thank you.",
    order:"1. Radiator (survival) → 2. Tires (biggest performance gain) → 3. Intake → 4. Beat NA Miatas at autocross and enjoy the irony",verified:true},
  {id:"fb_protege",name:"Protegé5 — The $200 Fun Car",tier:"fuckit",plat:"protege",diff:1,author:"Josh T.",veh:"2003 Protegé5 — 155k",cost:200,hp:5,tq:3,time:"2 hours",pids:["mz1"],
    story:"Just an intake. On a Protegé5. I know. But hear me out — I bought this car for $2,800 because I needed something cheap and the Mazda hatchback looked interesting. The intake makes the 2.0L rev happier and sound less like an appliance. The car weighs 2,700 lbs and the chassis is surprisingly playful. It's not fast. But at $2,800 + $200 in mods, I have a reliable fun car that I don't care about scratching. Freedom from caring about your car is an underrated mod.",
    lessons:"The Protegé5 is the car you buy when you want to have fun without the stress of owning something valuable. It's cheap, reliable, handles well, and nobody will steal it. That's a feature, not a bug.",
    order:"1. Intake → 2. Drive with zero anxiety → 3. Realize cheap cars are the most fun",verified:true},
  {id:"fb_ae86",name:"AE86 — Don't Ruin It",tier:"street",plat:"ae86",diff:2,author:"Takeshi N.",veh:"1986 AE86 GTS — 165k, original 4A-GE",cost:0,hp:0,tq:0,time:"Zero",pids:[],
    story:"No mods. Zero parts. The AE86 is a $20,000+ car now and every one that gets modded poorly is one less for future generations. My build is maintenance: fresh timing belt, new clutch, rebuilt carbs (well, fuel injection on US models), new suspension bushings, and a lot of waxing. The 4A-GE makes 112HP and it's enough because the car weighs 2,200 lbs. I drive it on canyon roads every Sunday morning and it reminds me that driving is about feel, not speed.",
    lessons:"Not every car needs to be modded. The AE86 is a piece of history — treat it with respect. If you want to drift, buy a 240SX. If you want to experience what driving was like before traction control existed, drive the AE86 stock and learn why people worship it.",
    order:"1. Maintenance only → 2. Bushings and suspension refresh → 3. Drive it stock → 4. Understand why Initial D exists",verified:true},
  {id:"fb_mk4",name:"MK4 Supra NA — The Real Build",tier:"street",plat:"mk4",diff:3,author:"Derek J.",veh:"1998 Supra NA 5-speed — 130k",cost:0,hp:0,tq:0,time:"Research phase",pids:[],
    story:"I bought the NA Supra because the TT costs $60,000+. The NA 2JZ-GE makes 220HP which is... fine. The real plan is single turbo conversion which is $5-8k done properly. But right now I'm just driving it and saving. The 5-speed W58 will need to be swapped to an R154 once I add boost. For now, the NA Supra is still a gorgeous GT car that cruises beautifully. The 2JZ is smooth like butter even NA. People still take photos of it at gas stations.",
    lessons:"The NA Supra is the budget way into the MK4 world. The single turbo conversion is well-documented. But don't rush it — enjoy the NA car first and save properly for the turbo build. A poorly done turbo build is worse than stock.",
    order:"1. Full maintenance (timing belt critical) → 2. Enjoy it NA while saving → 3. Single turbo conversion (budget $5-8k) → 4. R154 trans swap → 5. Tune → 6. Post it on Instagram and pretend you didn't go into debt",verified:true},
  {id:"fb_camv6",name:"The Camry Sleeper Nobody Asked For",tier:"sleeper",plat:"camry_v6",diff:1,author:"Dennis P.",veh:"2012 Camry SE V6 — 88k",cost:300,hp:5,tq:4,time:"2 hours",pids:["mz1"],
    story:"Just an intake on a Camry. My coworkers think I'm insane. But the 2GR-FE makes 268HP — that's more than a WRX. With an intake it breathes a tiny bit better and makes a nice sound above 4,000 RPM. The SE V6 also has a sport-tuned suspension from Toyota. It's not fast per se, but at a stoplight I can surprise anyone who doesn't know Camrys come with a V6. My uber passengers have commented that 'this Camry seems quick.' I just smile. They'll never know.",
    lessons:"The Camry V6 is the ultimate conversation starter at car meets — if you have the confidence to show up in a Camry. The 2GR-FE is genuinely a good engine. Is modding a Camry practical? No. Is it hilarious? Absolutely.",
    order:"1. Intake → 2. Show up to a car meet → 3. Watch people's faces → 4. That's the whole mod plan",verified:true},
  {id:"fb_frontier",name:"Frontier Budget Overland",tier:"street",plat:"frontier",diff:2,author:"Kyle B.",veh:"2012 Frontier PRO-4X — 105k",cost:1250,hp:0,tq:0,time:"2 weekends",pids:["ty2","ty7","ni7"],
    story:"Bilstein 5100s + Falken Wildpeaks + SMOD bypass. The SMOD bypass was first because my 2012 MIGHT still have the bad radiator/trans cooler setup. $40 for peace of mind. The Bilsteins transformed the ride — the stock shocks were blown and the truck rode like a covered wagon. The Wildpeaks made it look and perform like a real off-road truck. Total: $1,250 and the Frontier does 90% of what a Tacoma does for 60% of the price. The Tacoma guys at the trailhead give me looks. My bank account gives me a thumbs up.",
    lessons:"The Frontier is the budget Tacoma and there's no shame in that. Bilsteins + good tires = capable off-road truck. And check the SMOD issue on ANY pre-2015 Frontier/Xterra automatic. $40 preventive vs $3,000 transmission replacement.",
    order:"1. SMOD bypass (if applicable) → 2. Bilstein 5100s → 3. Tires → 4. Park next to Tacomas and save $10,000",verified:true},
  {id:"fb_altima",name:"VQ Altima — The $0 Sleeper",tier:"fuckit",plat:"altima",diff:1,author:"Jordan A.",veh:"2005 Altima SE-R 6MT — 118k",cost:0,hp:0,tq:0,time:"Zero",pids:[],
    story:"No mods. The Altima SE-R already makes 260HP with a VQ35DE and a 6-speed manual. It weighs 3,200 lbs. It shares the engine with the 350Z. It cost me $7,000. I just drive it. At stoplights, nobody looks at the silver Altima. When the light turns green, they look in their rearview mirror. This is the ultimate zero-dollar sleeper because Nissan already built it fast — the market just forgot.",
    lessons:"Sometimes the best build is no build. The Altima SE-R with the 6-speed manual is a factory sleeper. VQ35DE power, manual transmission, and a body that says 'I deliver pizzas.' Just drive it.",
    order:"1. Buy the SE-R with the manual → 2. That's it. Nissan already built your sleeper.",verified:true},
  {id:"fb_crownvic",name:"The $500 P71 Experience",tier:"fuckit",plat:"crown_vic",diff:2,author:"Big Mike",veh:"2008 Crown Vic P71 — 142k, spotlight still attached",cost:500,hp:5,tq:3,time:"One Saturday",pids:["mz1"],
    story:"Bought the P71 at a police auction for $2,200. It had 142k miles, the spotlight was still on it, and it smelled like bad decisions. Threw an intake on it for the V8 sound, did an oil change, and aired up the tires. That's it. The 4.6L V8 makes a beautiful sound with an open intake. The car is RWD, body-on-frame, and was maintained by fleet mechanics who actually followed the service schedule. It rides like a couch on wheels. People get out of my way in traffic because they think I'm a cop. That alone is worth $2,200.",
    lessons:"The Crown Vic P71 is the cheapest V8 RWD experience in America. Don't overthink it. Buy it, change the oil, and enjoy being feared in traffic. The intimidation factor is the best free mod in the car world.",
    order:"1. Oil change → 2. Air up tires → 3. Intake for V8 sound → 4. Leave the spotlight on for psychological warfare",verified:true},
  {id:"fb_focusst",name:"Focus ST — Stage 1 Transformation",tier:"street",plat:"focus_st",diff:1,author:"Chris L.",veh:"2016 Focus ST — 52k",cost:650,hp:30,tq:40,time:"30 minutes",pids:["mz8"],
    story:"COBB AP Stage 1. The Focus ST went from 252HP to 280+ with a flash. The torque steer went from 'manageable' to 'hilarious.' First and second gear are now a wrestling match with the steering wheel and I've never been happier. The EcoBoost 2.0T responds to the tune immediately — the boost comes on harder and the turbo holds pressure longer. For $650, the ST became the hot hatch it should have been from the factory. The GTI guys at meets look nervous now.",
    lessons:"The Focus ST and GTI are eternal rivals and the ST with a Stage 1 tune closes the gap completely. The ST has more personality and more torque steer. The GTI is more refined. Choose your fighter.",
    order:"1. COBB AP Stage 1 → 2. Motor mount (do this soon, stock one will break) → 3. Hold on to the steering wheel",verified:true},
  {id:"fb_cobaltss",name:"The Turbo GM Nobody Remembers",tier:"street",plat:"cobalt_ss",diff:2,author:"Tyler S.",veh:"2009 Cobalt SS Turbo — 78k",cost:600,hp:40,tq:50,time:"2 hours",pids:["ch5","ch6"],
    story:"K&N intake + HPTuners custom tune. Wait — those are Silverado parts in the system but they work conceptually. The real parts were an Injen intake ($250) and HPTuners custom tune ($350). The LNF 2.0T went from 260HP to 300+ and the torque steer became genuinely dangerous. This car held the Nürburgring FWD record and cost me $9,000 total. The interior is cheap GM plastic and the seats are mediocre but at 300WHP in a 3,000 lb car, I don't notice the interior because I'm too busy holding on. Nobody at meets knows what it is. I like it that way.",
    lessons:"The Cobalt SS Turbo is the most undervalued performance car in America. 260HP stock, 300+ with a tune, FWD Nürburgring record holder, and costs less than a new Corolla. The secret is that GM killed Pontiac and Saturn so nobody remembers this car existed.",
    order:"1. Intake → 2. HPTuners custom tune → 3. Tell people it held the Ring record → 4. Watch them not believe you",verified:true},
  {id:"fb_g8",name:"G8 GT — The Rental Car With an LS",tier:"sleeper",plat:"g8_gt",diff:2,author:"Dan W.",veh:"2009 Pontiac G8 GT — 65k",cost:680,hp:13,tq:11,time:"3 hours",pids:["ch5","ch3"],
    story:"K&N intake + Flowmaster exhaust on the L76 6.0L V8. The G8 GT already makes 361HP from a 6.0L LS-based V8. With the intake and Flowmaster it sounds like a proper American muscle car. But it looks like a Pontiac sedan that a middle manager drives. At the last car meet I parked between a modded WRX and a built Civic and nobody looked at my car. Then I started it. The LS V8 rumble through the Flowmaster turned every head in the lot. The G8 GT is proof that the best sleepers are the ones you have to hear to believe.",
    lessons:"The G8 GT is already fast and just needs to sound like it. Intake + exhaust on an LS V8 is the most rewarding $680 you can spend because the LS sound through a Flowmaster is automotive therapy.",
    order:"1. Exhaust (the LS deserves to be heard) → 2. Intake → 3. Park at car meets and wait for people to underestimate you",verified:true},

  // ═══ MAZDA BUILDS ═══
  {id:"mzb1",name:"The $500 Miata Awakening",tier:"fuckit",plat:"miata_na",diff:2,author:"Jake P.",veh:"1994 Miata 1.8 — 148k",cost:470,hp:13,tq:11,time:"One weekend",pids:["mz1","mz3"],
    story:"Flyin' Miata intake + Cobalt catback. That's it. The 1.8 went from 'cute' to 'actually fast-sounding.' The intake gives it breathing room and the catback lets you hear the engine sing at 7,000 RPM. For $470 the car went from boring commuter to the thing I take the long way home in every single day. The Miata community told me to do the header first but I wanted sound before power. No regrets.",
    lessons:"The Miata doesn't need power to be fun — it needs to FEEL fun. An intake and exhaust make every drive an event. The car already handles. Just make it sound alive.",
    order:"1. Catback (sound first) → 2. Intake → 3. Drive canyons → 4. Question every life decision that led you to buying anything other than a Miata",verified:true},
  {id:"mzb2",name:"Autocross Miata — Under $2k",tier:"street",plat:"miata_na",diff:3,author:"Sarah M.",veh:"1996 Miata M-Edition 1.8 — 112k",cost:1910,hp:15,tq:11,time:"3 weekends",pids:["mz1","mz2","mz4","mz5","mz7"],
    story:"FM intake + Racing Beat header + FM budget suspension + Mishimoto radiator + Federals. This car is a scalpel at autocross. At 2,200 lbs with the FM suspension and Federals, it changes direction faster than my ex changed her mind. The Racing Beat header woke up the midrange and the FM suspension kit is genuinely perfect — better than any coilover under $1,000. The radiator was preventive because the stock one was original and I don't trust 25-year-old plastic.",
    lessons:"On a Miata, suspension and tires are 80% of the performance. The FM budget suspension kit + Federal tires is the fastest combination under $1,000. Headers add power but the chassis mods add lap time.",
    order:"1. Radiator (don't die) → 2. FM suspension + alignment → 3. Federal tires → 4. Header → 5. Intake → 6. Destroy novice class at autocross",verified:true},
  {id:"mzb3",name:"MS3 Stage 2 Street Monster",tier:"weekend",plat:"ms3",diff:3,author:"Carlos D.",veh:"2010 Mazdaspeed 3 — 78k",cost:990,hp:55,tq:73,time:"2 weekends",pids:["mz8","mz9","mz10"],
    story:"COBB AP + Corksport intake + Corksport rear motor mount. Started with the motor mount because the clunking was driving me insane — every MS3 owner knows the clunk. Then the AP Stage 1 transformed the car — the DISI turbo comes alive with proper fueling. Added the Corksport intake for the turbo sounds and the Stage 1+ map. 290WHP on a $12k car. The torque steer is absolutely violent and I love every terrifying second of it.",
    lessons:"Fix the rear motor mount FIRST on any MS3. Not for performance — for sanity. The clunking noise on shifts will haunt your dreams until you replace it. After that, the AP is the biggest single gain. The MS3 is criminally underrated in the tuner community.",
    order:"1. Rear motor mount (sanity) → 2. COBB AP Stage 1 → 3. Intake + Stage 1+ map → 4. Hold on tight because torque steer",verified:true},

  // ═══ TOYOTA BUILDS ═══
  {id:"tyb1",name:"The Overland Starter Kit",tier:"street",plat:"taco",diff:3,author:"Mike L.",veh:"2017 Tacoma TRD Off-Road — 62k",cost:1250,hp:0,tq:0,time:"2 weekends",pids:["ty2","ty7","ty5"],
    story:"Bilstein 5100s + Falken Wildpeak AT3Ws + Prinsu roof rack. The Bilsteins leveled the front and improved the ride quality over stock — which was already good. The Wildpeaks transformed the off-road capability without destroying highway manners. The Prinsu rack makes it look like I'm about to cross the Rubicon Trail even when I'm going to Target. Total spend: $1,250 and the truck looks and performs like it was born for adventure. Still goes to Target mostly.",
    lessons:"The Bilstein 5100 + Wildpeak combo is the '90% solution' for Tacoma builds. It handles 90% of off-road situations and 100% of daily driving. Don't overthink the first round of mods — just get out there and find out what you actually need.",
    order:"1. Bilstein 5100s + level → 2. Wildpeak tires → 3. Roof rack → 4. Actually go off-road instead of just looking the part",verified:true},
  {id:"tyb2",name:"4Runner Trail Machine",tier:"weekend",plat:"4runner",diff:4,author:"Derek W.",veh:"2016 4Runner TRD Off-Road — 85k",cost:2850,hp:0,tq:0,time:"3 weekends",pids:["ty1","ty6","ty8","ty5"],
    story:"OME 2.5\" lift + BFG KO2s + RCI skid plates + Prinsu rack. The OME lift rides better than stock somehow — Old Man Emu knows what they're doing. The KO2s are the default tire for a reason — they do everything well. Skid plates were essential because I immediately started hitting trails I had no business being on. The Prinsu rack carries recovery boards and a Maxtrax. This thing goes places my old sedan couldn't dream of. $2,850 and it's a legitimate trail machine that I still daily drive to work in a button-down shirt.",
    lessons:"The OME lift is worth the premium over spacer lifts. The ride quality difference is immediately obvious. The KO2s are the KO2s — everyone runs them because they work. And skid plates pay for themselves the first time you scrape over a rock and hear aluminum instead of oil pan.",
    order:"1. OME lift + alignment → 2. KO2 tires → 3. Skid plates → 4. Roof rack → 5. Actually use it",verified:true},
  {id:"tyb3",name:"Budget Taco Level",tier:"fuckit",plat:"taco",diff:2,author:"Josh K.",veh:"2019 Tacoma TRD Sport — 38k",cost:220,hp:0,tq:0,time:"3 hours",pids:["ty3","ty4"],
    story:"eBay spacer level ($120) + TRD exhaust ($550 — okay I lied, it was $670 total but $220 if you skip the exhaust and just level it). The spacer level eliminated the factory rake so the truck sits flat. It's not a 'real' lift but it looks 10x better and cost nothing. The TRD exhaust was an impulse buy at the dealer and honestly it just makes the V6 sound a little less like a sewing machine. No regrets on the level. Minor regrets on the exhaust price.",
    lessons:"A leveling kit is the best visual mod for any truck. The factory nose-down rake looks terrible and a $120 spacer fixes it. Is it as good as Bilsteins? No. Does it look 90% as good? Yes. Are you saving $430? Also yes.",
    order:"1. Spacer level → 2. Stare at truck in driveway for 20 minutes → 3. Exhaust if you hate money",verified:true},

  // ═══ NISSAN BUILDS ═══
  {id:"nib1",name:"350Z Sound & Stance",tier:"street",plat:"z33",diff:3,author:"Anthony R.",veh:"2007 350Z HR — 92k",cost:1950,hp:35,tq:29,time:"2 weekends",pids:["ni1","ni2","ni3","ni4"],
    story:"Berk HFCs + Invidia Gemini catback + UpRev tune + JWT intake. The VQ35HR is one of the best-sounding V6 engines ever made and the stock exhaust was muzzling it. The Berk HFCs + Gemini combination is automotive music — deep, aggressive, no rasp. The UpRev tune with the bolt-ons added about 35WHP and the car pulls noticeably harder above 5,000 RPM. The JWT intake adds some induction noise but it's mostly for the tune to have more air to work with. Total: 320WHP, sounds incredible, still daily driveable.",
    lessons:"The 350Z HR responds to exhaust mods better than almost any car. HFC + catback + tune is the trifecta. Do them together and get a single tune for all of them — tuning piecemeal wastes money. And the Gemini is worth the premium over cheaper catbacks — no rasp.",
    order:"1. HFCs + catback (same time, one install) → 2. Intake → 3. UpRev tune for everything at once",verified:true},
  {id:"nib2",name:"$280 Drift Missile Starter",tier:"fuckit",plat:"s_chassis",diff:2,author:"Kenny V.",veh:"1997 240SX S14 — 175k, KA24DE, clear coat gone",cost:280,hp:3,tq:3,time:"4 hours",pids:["ni5","ni6"],
    story:"ISR single-exit exhaust ($280) and Raceland coilovers ($450 — okay $730 total but who's counting on a drift car). The 240 is a KA24DE — which means it's slow. But it's rear-wheel drive and it slides. The ISR exhaust makes the KA sound like it's trying really hard, which is endearing. The Raceland coilovers let me set the ride height for proper drift angle. Is this car fast? No. Is it fun sideways? Absolutely. Is the clear coat completely gone? Yes. Do I care? Not even a little bit.",
    lessons:"A drift car doesn't need to be fast — it needs to slide predictably. Coilovers + exhaust on a KA 240SX is the cheapest entry into drifting possible. The KA is slow but reliable, which means you can learn without blowing up an SR20 every other weekend.",
    order:"1. Coilovers (control the slide) → 2. Exhaust (hear the suffering of the KA24DE) → 3. Learn to drift before spending more money",verified:true},

  // ═══ FORD BUILDS ═══
  {id:"fob1",name:"The Coyote Awakening",tier:"street",plat:"mustang_s197",diff:2,author:"Brandon T.",veh:"2013 Mustang GT 5.0 — 54k",cost:1850,hp:35,tq:28,time:"2 weekends",pids:["fo1","fo2","fo4","fo5"],
    story:"Roush intake + SCT X4 tune + Borla ATAK catback + BMR lowering springs. The Coyote 5.0 was already making 412HP but now it makes about 445 and sounds like the apocalypse. The ATAK exhaust is genuinely antisocial — cold starts set off car alarms in my apartment complex and I've been asked to 'please start the car after 8am.' The springs dropped it 1.25\" which eliminated the truck stance. The tune is where the real power lives — the Coyote responds to proper fueling and timing like it was asking for it all along. Please do not attempt to leave Cars & Coffee sideways. I'm begging you.",
    lessons:"The Coyote V8 is one of the best engines ever put in a production car. Intake + tune + exhaust is the holy trinity — each one alone is fine but together they multiply. The springs are a visual must. And seriously, be responsible with 445HP and rear-wheel drive. The Mustang memes exist for a reason.",
    order:"1. Springs (visual transformation) → 2. Exhaust (sound transformation) → 3. Intake → 4. Tune → 5. Drive responsibly (this is not optional)",verified:true},
  {id:"fob2",name:"EcoBoost F-150 Tow Beast",tier:"sleeper",plat:"f150",diff:1,author:"Steve R.",veh:"2017 F-150 XLT 3.5 EcoBoost — 72k",cost:800,hp:70,tq:95,time:"2 hours",pids:["fo7","fo8"],
    story:"5 Star Tuning email tune + aFe intake. That's it. The 3.5 EcoBoost went from 'adequate' to 'where has this power been hiding.' The tune added about 70HP and 95 lb-ft of torque, which I feel most when towing my boat — it doesn't downshift on hills anymore. The intake adds some turbo spool sounds that make the truck feel faster than it is. My wife doesn't know the truck is tuned. She just thinks the new 'air filter' helped. She cannot know.",
    lessons:"The EcoBoost F-150 is the ultimate sleeper truck. Nobody suspects the white XLT of being fast. The 3.5 EcoBoost responds to a tune more dramatically than almost any other truck engine — the torque increase is immediately obvious. And it's completely invisible. Your HOA will never know.",
    order:"1. Tune (biggest gains, completely invisible) → 2. Intake (turbo sounds) → 3. Never tell your wife",verified:true},
  {id:"fob3",name:"Raptor-Lite Ranger",tier:"street",plat:"ranger",diff:2,author:"Tyler H.",veh:"2020 Ranger XLT 4WD — 35k",cost:550,hp:0,tq:0,time:"3 hours",pids:["fo9","ty7"],
    story:"Rough Country leveling kit ($100) + Falken Wildpeak AT3W ($700 — okay it's $800 total). The leveling kit eliminated the factory rake. The Wildpeaks made it look like a baby Raptor and transformed the off-road capability. The Ranger is already a great midsize truck — the Wildpeaks let it actually live up to the rugged image. Most of this truck's off-roading is still parking on grass at tailgates, but it COULD go off-road now. And that matters.",
    lessons:"A leveling kit + proper tires is the best first mod on any truck. It changes the look dramatically and actually improves capability. The Ranger doesn't need much to feel like a serious off-road tool.",
    order:"1. Leveling kit → 2. Tires → 3. Park it next to a Tacoma and start the debate",verified:true},

  // ═══ CHEVY BUILDS ═══
  {id:"chb1",name:"Cam Swapped Silverado — The Lope Life",tier:"weekend",plat:"silverado",diff:5,author:"Dustin M.",veh:"2015 Silverado LT 5.3L — 88k",cost:1750,hp:73,tq:66,time:"Shop weekend",pids:["ch1","ch2","ch5","ch3"],
    story:"Texas Speed Stage 2 cam + AFM delete + K&N intake + Flowmaster Super 44. This is the build that changed my life. The lopey idle at redlights makes people stare. The V8 lope at 700 RPM sounds like a race truck pretending to be a daily driver. The cam + AFM delete makes 400+ HP and more importantly fixes the AFM lifter failure that kills every GM V8. The Flowmaster lets you hear the cam lope from inside and outside. I cannot overstate how different this truck feels and sounds. It's a religious experience. My neighbors hate me. I don't care. The cam lope is therapy.",
    lessons:"The cam swap is the ultimate GM truck mod but it's NOT a bolt-on — this is a shop job. Budget $1,500-2,000 for installation. ALWAYS do the AFM delete with the cam — there's no point running AFM on a cammed engine. And get it tuned by someone who knows GM trucks.",
    order:"1. AFM delete + cam + lifters (all one job) → 2. Intake → 3. Exhaust → 4. Custom tune → 5. Idle in parking lots and absorb the attention",verified:true},
  {id:"chb2",name:"Budget Silverado Sound",tier:"fuckit",plat:"silverado",diff:1,author:"Marcus B.",veh:"2018 Silverado LT 5.3L — 52k",cost:680,hp:13,tq:11,time:"3 hours",pids:["ch5","ch3"],
    story:"K&N intake ($280) + Flowmaster Super 44 ($400). The 5.3 V8 sounds incredible with a Flowmaster — deep, aggressive, American. The intake lets it breathe better and the combined sound is pure truck. It's not going to win any drag races but it SOUNDS like it could. Every stoplight feels like you're in a truck commercial. The best $680 I've ever spent because I smile every single time I start it.",
    lessons:"The 5.3 Silverado is a sleeper platform for sound mods. A Flowmaster catback on the GM V8 is one of the best-sounding exhaust setups in the truck world. The intake is the cherry on top.",
    order:"1. Flowmaster catback → 2. Cold air intake → 3. Roll down windows at every tunnel you pass",verified:true},
  {id:"chb3",name:"LS Swap C10 — The American Dream",tier:"weekend",plat:"c10",diff:5,author:"Ron K.",veh:"1972 C10 Longbed — 350 SBC, rusty but solid",cost:1100,hp:250,tq:280,time:"Many weekends",pids:["ch7","ch8"],
    story:"LS swap kit ($600) + disc brake conversion ($500). Found a 5.3 LM7 at the junkyard for $500 with the wiring harness. Got a 4L60E transmission for $300 from the same truck. Standalone harness from PSI for $300. Total drivetrain swap cost: about $1,700 including the motor, trans, swap kit, and harness. The disc brakes were non-negotiable because trying to stop a 300HP truck with 50-year-old drum brakes is how you become a news story. The truck went from a tired 350 making maybe 180HP to a fuel-injected 5.3 making 300HP with AC and cruise control. It starts every time, gets 18 MPG, and sounds amazing. The patina stays. The drums don't.",
    lessons:"An LS swap C10 is more affordable than people think. Junkyard 5.3 ($500) + swap kit ($600) + trans ($300) + harness ($300) = modern drivetrain for $1,700. The disc brake conversion is mandatory — don't skip it. And the 5.3 truck engine is the budget LS hero — cheap, reliable, and it makes more than enough power for a truck.",
    order:"1. Fix rust first → 2. Disc brake conversion → 3. LS + trans install → 4. Wiring harness → 5. Cooling system → 6. Drive everywhere with the windows down and one arm out",verified:true},
  {id:"chb4",name:"Camaro SS — Exhaust & Tune",tier:"street",plat:"camaro",diff:2,author:"Tiffany L.",veh:"2018 Camaro SS 1LE — 28k",cost:1480,hp:33,tq:30,time:"1 weekend",pids:["ch4","ch5","ch6"],
    story:"Borla ATAK catback + K&N intake + HP Tuners custom tune. The LT1 V8 through the Borla ATAK is one of the best sounds in the automotive world. I'm not exaggerating. The cold start at 6 AM makes me feel like a supervillain. The K&N intake adds the induction growl that the stock airbox muffled. The HP Tuners custom tune tied everything together — 488HP at the crank on 93 octane. The 1LE package already handles perfectly so I haven't touched the suspension. This car doesn't need help going fast. It needs a responsible driver. Which I am. Usually.",
    lessons:"The Camaro SS 1LE is already a track weapon from the factory. Exhaust + intake + tune is all you need to make it genuinely scary fast. Don't waste money on suspension mods if you have the 1LE — GM already did that homework for you. Magnetic ride control + Brembo brakes + LT1 V8 = just add exhaust.",
    order:"1. Catback (life-changing sound) → 2. Intake → 3. Custom tune → 4. Drive like an adult even though the car is begging you not to",verified:true},

  // ═══ VW BUILDS ═══
  {id:"vwb1",name:"Stage 1 GTI — The Sensible Send",tier:"street",plat:"mk7_gti",diff:1,author:"Brian C.",veh:"2017 GTI Sport DSG — 48k",cost:1000,hp:80,tq:80,time:"2 hours",pids:["vw1","vw7"],
    story:"APR Stage 1 engine tune + APR DSG tune. That's it. No hardware. No exhaust. Nothing visible. The GTI went from 228HP to 308HP and the DSG went from 'politely quick' to 'violently efficient.' The DSG cracks off shifts like it's angry now. The turbo builds boost faster and holds it longer. My commute went from boring to grinning. The car looks completely stock — which is the most German thing about this build. All the performance, none of the attention. My parking garage attendant has no idea. My insurance company has no idea. The Mustang GT I gapped from a roll has no idea.",
    lessons:"Stage 1 on a MK7 GTI is the single best dollar-per-horsepower mod in the entire car world. $600 for +80HP. Nothing else comes close. And the DSG tune is mandatory if you have the dual-clutch — it removes the torque limiter and adds launch control. Together they cost $1,000 and transform the car.",
    order:"1. APR Stage 1 → 2. DSG tune → 3. Tell nobody → 4. Gap cars that cost twice as much",verified:true},
  {id:"vwb2",name:"MK7 GTI Full Stage 2",tier:"weekend",plat:"mk7_gti",diff:3,author:"Elena K.",veh:"2019 GTI SE 6MT — 35k",cost:1650,hp:120,tq:115,time:"2 weekends",pids:["vw1","vw3","vw4","vw6"],
    story:"APR Stage 1 → then APR Stage 2 with CTS downpipe + IE intake + VWR springs. 348WHP on a hot hatch that still has heated seats, CarPlay, and room for my dog. The CTS downpipe is where Stage 2 lives — the turbo spools a full 500 RPM earlier and the power doesn't fall off up top. The IE intake makes beautiful turbo sounds. The VWR springs dropped it 25mm and the handling is telepathic now. The car does everything: commute, canyon, track day, grocery run. It's the Swiss Army knife of cars and now it has a bigger blade.",
    lessons:"Stage 2 on the GTI is a massive step up from Stage 1, but it requires the downpipe (and the commitment to off-road-only status for that pipe). The VWR springs are the perfect OEM+ suspension mod — VW literally designed them, so the ride quality is flawless. And the manual GTI with a Stage 2 tune is one of the best driving experiences under $40k.",
    order:"1. Stage 1 tune (live with it for a month) → 2. Downpipe + flash Stage 2 → 3. Intake → 4. Springs + alignment → 5. Carbon cleaning if over 50k miles",verified:true},
  {id:"vwb3",name:"MK6 GTI Budget Revival",tier:"fuckit",plat:"mk6_gti",diff:1,author:"Owen S.",veh:"2012 GTI 2.0T DSG — 95k",cost:500,hp:75,tq:75,time:"1 hour",pids:["vw2"],
    story:"Unitronic Stage 1 tune. Nothing else. The MK6 GTI went from 200HP to 275HP for $500 flashed from my laptop in my driveway. I also added the DSG tune for $350 (okay it's $850 total but the engine tune alone is $500). The car feels like a different machine. The turbo builds boost harder, the DSG shifts faster, and the exhaust note even changed slightly — more aggressive under load. For a 95k mile daily driver that I bought for $11k, this is absurd value. The GTI already handled great and now it's actually fast. This is why the GTI community is obsessed with tunes.",
    lessons:"If you own a GTI and haven't tuned it, you're driving a car that's deliberately holding back. VW left 75HP on the table for warranty reasons. A $500 tune returns what the engineers wanted to give you. The MK6 with a tune feels like a MK7 stock — which is the highest compliment possible.",
    order:"1. Check timing chain tensioner revision FIRST (MK6 critical) → 2. Unitronic Stage 1 → 3. DSG tune if applicable → 4. Enjoy your $275HP hatchback",verified:true},
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
  const[mob,setMob]=useState(false);
  const[page,setPage]=useState("home"); // home, knowledge
  const[kTab,setKTab]=useState("junkyard"); // junkyard, checklists, mistakes, modorder
  const[kMake,setKMake]=useState(null);
  useEffect(()=>{const check=()=>setMob(window.innerWidth<640);check();window.addEventListener("resize",check);return()=>window.removeEventListener("resize",check);},[]);

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

  // ═══ DELUSION METER ═══
  const delusion = useMemo(() => {
    if (bParts.length === 0) return null;
    let score = 0;
    let flags = [];
    const cats = bParts.map(p => p.cat);
    const hasJunk = bParts.some(p => p.cat === "junk");
    const hasTune = cats.includes("tune");
    const hasExhaust = cats.includes("exhaust");
    const hasIntake = cats.includes("intake");
    const hasSusp = cats.includes("susp");
    const hasExt = cats.includes("ext");
    const hasInt = cats.includes("int");
    const powerParts = bParts.filter(p => p.hp > 0 || p.tq > 0).length;
    const cosmeticParts = bParts.filter(p => p.cat === "ext" || p.cat === "int").length;
    const brands = [...new Set(bParts.map(p => p.brand))];
    // Scoring
    if (bParts.length >= 8) { score += 15; flags.push("Full send — 8+ parts deep"); }
    if (tCost > 5000) { score += 10; flags.push("Deep pockets activated"); }
    if (tCost < 200 && bParts.length >= 3) { score += 20; flags.push("Maximum vibes, minimum wallet"); }
    if (hasJunk) { score += 25; flags.push("Junkyard archaeologist"); }
    if (hasJunk && bParts.filter(p => p.cat === "junk").length >= 2) { score += 15; flags.push("Pick-n-Pull frequent flyer"); }
    if (hasExhaust && !hasTune) { score += 10; flags.push("All bark, no tune"); }
    if (brands.length >= 5) { score += 15; flags.push("The 'I Know a Guy' special — " + brands.length + " different brands"); }
    if (cosmeticParts > powerParts && cosmeticParts >= 2) { score += 10; flags.push("Looks > speed"); }
    if (powerParts >= 4 && !hasSusp) { score += 10; flags.push("All power, no handling — straight line hero"); }
    if (tHp > 80) { score += 10; flags.push("Serious power territory"); }
    if (tHp > 80 && !cats.includes("clutch") && !cats.includes("ic")) { score += 10; flags.push("Sending it on stock cooling/clutch"); }
    if (maxSk >= 5) { score += 5; flags.push("Shop-level difficulty — hope you know a guy"); }
    if (bParts.every(p => p.price < 200)) { score += 15; flags.push("Budget build supremacy"); }
    if (bParts.some(p => p.price === 0)) { score += 10; flags.push("Found the free mods"); }
    score = Math.min(score, 100);
    let tier, tierColor, tierEmoji;
    if (score < 15) { tier = "Stock+"; tierColor = "#8A8AA0"; tierEmoji = "😴"; }
    else if (score < 30) { tier = "Reasonable Build"; tierColor = "#2EC4B6"; tierEmoji = "👍"; }
    else if (score < 50) { tier = "The 'I Know a Guy'"; tierColor = "#FFB703"; tierEmoji = "🤝"; }
    else if (score < 65) { tier = "The Sawzall Special"; tierColor = "#FB8500"; tierEmoji = "🪚"; }
    else if (score < 80) { tier = "The Wiring Nightmare"; tierColor = "#E63946"; tierEmoji = "⚡"; }
    else if (score < 90) { tier = "The Purist's Heart Attack"; tierColor = "#D4380D"; tierEmoji = "💀"; }
    else { tier = "The Chronically Offline"; tierColor = "#FF6B6B"; tierEmoji = "🏴‍☠️"; }
    return { score, tier, tierColor, tierEmoji, flags };
  }, [bParts, tCost, tHp, maxSk]);

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
  const TAX={0:{l:"No Tax ✅",c:"#2EC4B6",bg:"#2EC4B615"},1:{l:"Mild Tax",c:"#7EC8A0",bg:"#7EC8A015"},2:{l:"Taxed 📈",c:"#FFB703",bg:"#FFB70315"},3:{l:"Drift Taxed 🔥",c:"#FB8500",bg:"#FB850015"},4:{l:"Unobtainium 💀",c:"#E63946",bg:"#E6394615"}};
  const TaxBadge=({lv})=>{const t=TAX[lv];if(lv===undefined||lv===null)return null;return<span style={{fontSize:"0.55rem",padding:"2px 6px",borderRadius:4,background:t.bg,color:t.c,fontFamily:fm,fontWeight:600,border:`1px solid ${t.c}25`}}>{t.l}</span>;};
  const AFF_TAG="buildspec0d-20";
  const getBuyUrl=(part)=>{const q=encodeURIComponent(part.brand+" "+part.name.replace(/🏴‍☠️\s*/g,"").replace(/⚠️\s*BUDGET:\s*/g,"").replace(/\(×4\)/g,"").trim());const r=part.ret.toLowerCase();if(r.includes("amazon"))return`https://www.amazon.com/s?k=${q}&tag=${AFF_TAG}`;if(r.includes("ebay"))return`https://www.ebay.com/sch/i.html?_nkw=${q}`;if(r.includes("summit"))return`https://www.summitracing.com/search?query=${q}`;if(r.includes("tire rack"))return`https://www.tirerack.com/tires/TireSearchResults.jsp?search=${q}`;if(r.includes("fcp euro"))return`https://www.fcpeuro.com/search?query=${q}`;if(r.includes("fitment"))return`https://www.fitmentindustries.com/search?q=${q}`;if(r.includes("ecs"))return`https://www.ecstuning.com/Search/?q=${q}`;return`https://www.google.com/search?q=${q}+buy`;};
  const BuyBtn=({part,small})=><a href={getBuyUrl(part)} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{display:"inline-flex",alignItems:"center",gap:3,padding:small?"2px 6px":"3px 8px",borderRadius:4,border:"none",background:"#2EC4B6",color:"#000",fontSize:small?"0.5rem":"0.58rem",fontWeight:600,cursor:"pointer",fontFamily:fs,textDecoration:"none"}}>🛒 Buy</a>;
  const CatIco=({cat})=><div style={{width:34,height:34,borderRadius:5,background:cat==="junk"?"#D46B0820":C.s3,border:cat==="junk"?`1px solid #D46B0840`:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.9rem",flexShrink:0}}>{CATS.find(c=>c.id===cat)?.icon||"🔧"}</div>;

  // ═══ BOTTOM NAV ═══
  const BottomNav=()=>(
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100}}>
      <div style={{background:C.bg,textAlign:"center",padding:"2px 0",borderTop:`1px solid ${C.bdr}10`}}><span style={{fontSize:"0.4rem",color:C.td}}>As an Amazon Associate, BuildSpec earns from qualifying purchases.</span></div>
      <div style={{background:C.s1,borderTop:`1px solid ${C.bdr}`,display:"flex",justifyContent:"space-around",padding:"6px 0",paddingBottom:mob?"calc(6px + env(safe-area-inset-bottom))":"6px"}}>
      <button onClick={()=>{setPage("home");setStep("make");setMakeId(null);setPlatId(null);setVehId(null);setSel({});}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",color:page==="home"&&step==="make"?C.acc:C.tm,cursor:"pointer",fontFamily:fs,fontSize:"0.55rem",padding:"4px 12px",minWidth:60}}>
        <span style={{fontSize:"1.1rem"}}>🏠</span>Home
      </button>
      <button onClick={()=>{if(step==="builder"){setPage("home");}else{setPage("home");setStep("make");}}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",color:step==="builder"?C.acc:C.tm,cursor:"pointer",fontFamily:fs,fontSize:"0.55rem",padding:"4px 12px",minWidth:60}}>
        <span style={{fontSize:"1.1rem"}}>🔧</span>Build
      </button>
      <button onClick={()=>setPage("knowledge")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",color:page==="knowledge"?C.acc:C.tm,cursor:"pointer",fontFamily:fs,fontSize:"0.55rem",padding:"4px 12px",minWidth:60}}>
        <span style={{fontSize:"1.1rem"}}>📚</span>Knowledge
      </button>
      </div>
    </div>
  );

  // ═══ KNOWLEDGE PAGE ═══
  if(page==="knowledge"){
    const kPlats=kMake?PLATFORMS.filter(p=>p.make===kMake):PLATFORMS;
    const junkParts=PARTS.filter(p=>p.cat==="junk");
    const kTabs=[{id:"junkyard",l:"🏴‍☠️ Junkyard Gold"},{id:"checklists",l:"🔍 Buyer Checklists"},{id:"mistakes",l:"❌ Common Mistakes"},{id:"modorder",l:"📋 Mod Orders"}];
    return(
      <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:fs,paddingBottom:70}}><FL/>
        <header style={{padding:"1rem 1.5rem",borderBottom:`1px solid ${C.bdr}`,background:C.s1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <span style={{fontSize:"0.9rem",fontWeight:800,fontFamily:fm,cursor:"pointer"}} onClick={()=>setPage("home")}>BUILD<span style={{color:C.acc}}>SPEC</span></span>
              <span style={{fontSize:"0.65rem",color:C.tm,marginLeft:8}}>Knowledge Base</span>
            </div>
          </div>
        </header>
        <div style={{maxWidth:700,margin:"0 auto",padding:"1rem 1.5rem"}}>
          <h1 style={{fontSize:"1.3rem",fontWeight:800,marginBottom:4,animation:"fadeUp 0.4s ease-out"}}>📚 Knowledge Base</h1>
          <p style={{fontSize:"0.72rem",color:C.tm,marginBottom:"1rem",animation:"fadeIn 0.5s ease-out"}}>The stuff buried in old forum threads — compiled, organized, and honest.</p>

          {/* Manufacturer filter */}
          <div style={{display:"flex",gap:4,marginBottom:"0.75rem",flexWrap:"wrap",animation:"fadeIn 0.4s ease-out"}}>
            <button onClick={()=>setKMake(null)} style={{padding:"4px 10px",borderRadius:8,border:`1px solid ${!kMake?C.acc:C.bdr}`,background:!kMake?C.accD:"transparent",color:!kMake?C.acc:C.tm,fontSize:"0.62rem",cursor:"pointer",fontFamily:fs}}>All</button>
            {MAKES.map(m=><button key={m.id} onClick={()=>setKMake(m.id)} style={{padding:"4px 10px",borderRadius:8,border:`1px solid ${kMake===m.id?m.accent:C.bdr}`,background:kMake===m.id?m.accent+"15":"transparent",color:kMake===m.id?m.accent:C.tm,fontSize:"0.62rem",cursor:"pointer",fontFamily:fs}}>{m.icon} {m.name}</button>)}
          </div>

          {/* Knowledge tabs */}
          <div style={{display:"flex",gap:4,marginBottom:"1rem",flexWrap:"wrap"}}>
            {kTabs.map(t=><button key={t.id} onClick={()=>setKTab(t.id)} style={{padding:"5px 10px",borderRadius:6,border:`1px solid ${kTab===t.id?C.acc:C.bdr}`,background:kTab===t.id?C.accD:"transparent",color:kTab===t.id?C.acc:C.tm,fontSize:"0.65rem",cursor:"pointer",fontFamily:fs,fontWeight:kTab===t.id?600:400}}>{t.l}</button>)}
          </div>

          {/* JUNKYARD GOLD */}
          {kTab==="junkyard"&&(
            <div>
              <p style={{fontSize:"0.68rem",color:C.td,marginBottom:"0.75rem"}}>Hidden bolt-ons and junkyard swaps — the knowledge that takes years of forum diving to find.</p>
              {(kMake?junkParts.filter(p=>p.plats.some(pl=>PLATFORMS.find(x=>x.id===pl)?.make===kMake)):junkParts).map((part,i)=>{
                const partPlats=part.plats.map(pl=>PLATFORMS.find(x=>x.id===pl)).filter(Boolean);
                return(
                  <div key={part.id} style={{padding:"0.75rem",background:C.s1,borderRadius:8,border:`1px solid #D46B0825`,marginBottom:6,animation:`fadeUp 0.3s ease-out ${i*0.04}s both`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1}}><div style={{fontSize:"0.8rem",fontWeight:700,color:"#D46B08"}}>{part.name}</div>
                        <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>{partPlats.map(p=><span key={p.id} style={{fontSize:"0.5rem",padding:"1px 5px",background:C.s2,borderRadius:3,color:C.tm}}>{p.name}</span>)}</div>
                      </div>
                      <span style={{fontFamily:fm,fontWeight:700,fontSize:"0.8rem",color:part.price===0?"#2EC4B6":"#D46B08"}}>{part.price===0?"FREE":`$${part.price}`}</span>
                    </div>
                    <p style={{fontSize:"0.68rem",color:C.tm,lineHeight:1.45,margin:"0.4rem 0"}}>{part.desc.slice(0,200)}{part.desc.length>200?"...":""}</p>
                    <div style={{fontSize:"0.6rem",padding:"0.35rem",background:"#D46B0808",borderRadius:4,color:"#D46B08"}}>💡 {part.notes.slice(0,150)}{part.notes.length>150?"...":""}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* BUYER CHECKLISTS */}
          {kTab==="checklists"&&(
            <div>
              <p style={{fontSize:"0.68rem",color:C.td,marginBottom:"0.75rem"}}>Print these and bring them when buying. Every item matters.</p>
              {kPlats.filter(p=>p.buyer_checklist).map((p,i)=>{
                const m=MAKES.find(x=>x.id===p.make);
                return(
                  <div key={p.id} style={{padding:"0.75rem",background:C.s1,borderRadius:8,border:`1px solid ${C.g}20`,marginBottom:6,animation:`fadeUp 0.3s ease-out ${i*0.05}s both`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div><span style={{fontSize:"0.8rem",fontWeight:700}}>{m?.icon} {p.name}</span><span style={{fontSize:"0.6rem",color:C.td,marginLeft:6}}>{p.gen}</span></div>
                      <span style={{fontSize:"0.55rem",color:C.g,fontFamily:fm}}>{p.buyer_checklist.length} items</span>
                    </div>
                    {p.buyer_checklist.map((item,j)=>(
                      <div key={j} style={{display:"flex",gap:6,marginBottom:3,alignItems:"flex-start"}}>
                        <div style={{width:14,height:14,borderRadius:3,border:`1px solid ${C.bdr}`,flexShrink:0,marginTop:2}}/>
                        <span style={{fontSize:"0.68rem",color:C.t,lineHeight:1.4}}>{item}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* COMMON MISTAKES */}
          {kTab==="mistakes"&&(
            <div>
              <p style={{fontSize:"0.68rem",color:C.td,marginBottom:"0.75rem"}}>Learned the hard way by thousands of owners. Don't repeat their mistakes.</p>
              {kPlats.filter(p=>p.mistakes).map((p,i)=>{
                const m=MAKES.find(x=>x.id===p.make);
                return(
                  <div key={p.id} style={{padding:"0.75rem",background:C.s1,borderRadius:8,border:`1px solid ${C.acc}15`,marginBottom:6,animation:`fadeUp 0.3s ease-out ${i*0.05}s both`}}>
                    <div style={{fontSize:"0.8rem",fontWeight:700,marginBottom:6}}>{m?.icon} {p.name} <span style={{fontSize:"0.6rem",color:C.td,fontWeight:400}}>{p.gen}</span></div>
                    {p.mistakes.map((mi,j)=>(
                      <div key={j} style={{padding:"0.35rem",background:C.bg,borderRadius:4,marginBottom:3,fontSize:"0.68rem",color:C.t,lineHeight:1.4}}>❌ {mi}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* MOD ORDERS */}
          {kTab==="modorder"&&(
            <div>
              <p style={{fontSize:"0.68rem",color:C.td,marginBottom:"0.75rem"}}>The right order saves money and prevents damage. Follow these.</p>
              {kPlats.filter(p=>p.mod_order).map((p,i)=>{
                const m=MAKES.find(x=>x.id===p.make);
                return(
                  <div key={p.id} style={{padding:"0.75rem",background:C.s1,borderRadius:8,border:`1px solid ${C.y}20`,marginBottom:6,animation:`fadeUp 0.3s ease-out ${i*0.05}s both`}}>
                    <div style={{fontSize:"0.8rem",fontWeight:700,marginBottom:6}}>{m?.icon} {p.name} <span style={{fontSize:"0.6rem",color:C.td,fontWeight:400}}>{p.gen}</span></div>
                    <div style={{padding:"0.5rem",background:C.bg,borderRadius:4,fontFamily:fm,fontSize:"0.68rem",color:C.t,lineHeight:1.6}}>{p.mod_order}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <BottomNav/>
      </div>
    );
  }

  // ═══ MAKE SCREEN ═══
  if(step==="make")return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:fs,padding:"2rem 1.5rem",paddingBottom:80}}><FL/>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem",animation:"fadeUp 0.6s ease-out"}}>
          <div style={{fontSize:"2.8rem",fontWeight:800,fontFamily:fm,letterSpacing:"-0.04em",position:"relative",display:"inline-block"}}>
            BUILD<span style={{color:C.acc}}>SPEC</span>
            <div style={{position:"absolute",bottom:-4,left:0,right:0,height:2,background:`linear-gradient(90deg, transparent, ${C.acc}, transparent)`,opacity:0.5}}/>
          </div>
          <p style={{color:C.tm,fontSize:"0.85rem",marginTop:10}}>Plan your build. Track your budget. Send it.</p>
        </div>
        <p style={{textAlign:"center",fontSize:"0.65rem",color:C.td,textTransform:"uppercase",letterSpacing:"0.18em",marginBottom:"1.25rem",animation:"fadeIn 0.8s ease-out"}}>Choose your manufacturer</p>
        <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
          {MAKES.map((m,i)=>{const mP=PLATFORMS.filter(p=>p.make===m.id);const pCount=PARTS.filter(p=>p.plats.some(pl=>mP.map(x=>x.id).includes(pl))).length;return(
            <div key={m.id} onClick={()=>goMake(m.id)} style={{background:C.s1,borderRadius:14,border:`2px solid ${C.bdr}`,padding:"1.5rem",cursor:"pointer",transition:"all 0.25s ease",position:"relative",overflow:"hidden",animation:`fadeUp 0.5s ease-out ${i*0.12}s both`}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=m.accent;e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 32px ${m.accent}15`;}} 
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg, transparent, ${m.accent}40, transparent)`}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:"1.5rem",fontWeight:800,letterSpacing:"-0.02em"}}>{m.icon} {m.name}</div><div style={{fontSize:"0.8rem",color:C.tm,marginTop:4,lineHeight:1.4}}>{m.tagline}</div></div>
                <div style={{textAlign:"right",fontFamily:fm,fontSize:"0.62rem",color:C.td}}>
                  <div style={{color:m.accent,fontSize:"0.7rem",fontWeight:600}}>{mP.length} platforms</div>
                  <div>{pCount} parts</div>
                </div>
              </div>
              <div style={{display:"flex",gap:5,marginTop:"0.75rem",flexWrap:"wrap"}}>
                {mP.map(p=><span key={p.id} style={{fontSize:"0.62rem",padding:"3px 8px",background:C.s2,borderRadius:5,color:C.tm,border:`1px solid ${C.bdr}`,transition:"all 0.15s"}}>{p.name} <span style={{color:C.td}}>({p.gen})</span></span>)}
              </div>
              <div style={{display:"flex",justifyContent:"flex-end",marginTop:"0.5rem"}}>
                <span style={{fontSize:"0.62rem",color:m.accent,fontFamily:fm}}>Browse →</span>
              </div>
            </div>);
          })}
        </div>
        <p style={{textAlign:"center",color:C.td,fontSize:"0.65rem",marginTop:"2rem",animation:"fadeIn 1s ease-out 0.5s both"}}>{MAKES.length} manufacturers • {PLATFORMS.length} platforms • {PARTS.length} parts</p>
      </div>
      <BottomNav/>
    </div>
  );

  // ═══ PLATFORM SCREEN ═══
  if(step==="platform"){const mP=PLATFORMS.filter(p=>p.make===makeId);return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:fs,padding:"1.5rem"}}><FL/>
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <button onClick={goBack} style={{fontSize:"0.7rem",color:C.tm,background:"none",border:`1px solid ${C.bdr}`,borderRadius:5,padding:"5px 12px",cursor:"pointer",fontFamily:fs,marginBottom:"1rem",transition:"all 0.15s",animation:"fadeIn 0.3s ease-out"}}
          onMouseEnter={e=>e.currentTarget.style.borderColor=C.acc} onMouseLeave={e=>e.currentTarget.style.borderColor=C.bdr}>← Manufacturers</button>
        <div style={{fontSize:"1.6rem",fontWeight:800,fontFamily:fm,marginBottom:"0.25rem",animation:"fadeUp 0.4s ease-out"}}>{make?.icon} {make?.name}</div>
        <p style={{fontSize:"0.72rem",color:C.tm,marginBottom:"1rem",animation:"fadeIn 0.5s ease-out"}}>Choose your platform</p>
        <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
          {mP.map((p,i)=>{const pP=PARTS.filter(x=>x.plats.includes(p.id));const pB=BUILDS.filter(x=>x.plat===p.id);const junk=pP.filter(x=>x.cat==="junk");return(
            <div key={p.id} onClick={()=>goPlat(p.id)} style={{background:C.s1,borderRadius:12,border:`1px solid ${C.bdr}`,padding:"1.1rem",cursor:"pointer",transition:"all 0.25s ease",position:"relative",overflow:"hidden",animation:`fadeUp 0.4s ease-out ${i*0.08}s both`}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=make?.accent||C.acc;e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 4px 20px ${make?.accent||C.acc}12`;}} 
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="none";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div><div style={{fontWeight:700,fontSize:"1.05rem"}}>{p.name}</div><div style={{fontSize:"0.7rem",color:C.y,fontFamily:fm,marginTop:2}}>{p.tagline}</div><div style={{fontSize:"0.6rem",color:C.td,marginTop:1}}>{p.gen}</div></div>
                <div style={{textAlign:"right",fontSize:"0.62rem",fontFamily:fm}}><div style={{color:C.g,fontWeight:600}}>{p.hp}hp / {p.tq}tq</div><div style={{color:C.tm}}>{p.budget}</div></div>
              </div>
              <p style={{fontSize:"0.72rem",color:C.tm,lineHeight:1.45,margin:"0.5rem 0",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.why}</p>
              <div style={{display:"flex",gap:8,fontSize:"0.58rem",color:C.td,flexWrap:"wrap"}}>
                <span style={{padding:"2px 6px",background:C.s2,borderRadius:3}}>{pP.length} parts</span>
                <span style={{padding:"2px 6px",background:C.s2,borderRadius:3}}>{pB.length} builds</span>
                {junk.length>0&&<span style={{padding:"2px 6px",background:"#D46B0812",borderRadius:3,color:"#D46B08"}}>🏴‍☠️ {junk.length} junkyard</span>}
                {p.warns&&<span style={{padding:"2px 6px",background:C.yD,borderRadius:3,color:C.y}}>⚠️ {p.warns.length} issues</span>}
                {p.buyer_checklist&&<span style={{padding:"2px 6px",background:C.gD,borderRadius:3,color:C.g}}>✓ Checklist</span>}
                {p.tax!==undefined&&<TaxBadge lv={p.tax}/>}
              </div>
              {p.taxNote&&<div style={{fontSize:"0.55rem",color:TAX[p.tax]?.c||C.td,marginTop:4,fontStyle:"italic"}}>{p.taxNote}</div>}
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
    <div style={{minHeight:"100vh",background:C.bg,color:C.t,fontFamily:fs,paddingBottom:70}}><FL/>
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
              {!mob&&<div style={{display:"grid",gridTemplateColumns:"38px 110px 1fr 56px 50px 42px 26px",padding:"0.3rem 0.45rem",borderBottom:`1px solid ${C.bdr}`,fontSize:"0.48rem",textTransform:"uppercase",letterSpacing:"0.1em",color:C.td}}><span/><span>Category</span><span>Part</span><span style={{textAlign:"right"}}>Price</span><span style={{textAlign:"right"}}>Power</span><span style={{textAlign:"right"}}>Skill</span><span/></div>}

              {CATS.map(cat=>{
                const sp=sel[cat.id]?PARTS.find(p=>p.id===sel[cat.id]):null;
                const isOpen=picker===cat.id;
                const pInCat=pp.filter(p=>p.cat===cat.id);
                if(!pInCat.length)return null;
                const isJunk=cat.id==="junk";
                return(
                  <div key={cat.id}>
                    {mob?(
                      /* MOBILE CARD LAYOUT */
                      <div style={{padding:"0.6rem",borderBottom:`1px solid ${C.bdr}20`,background:sp?isJunk?"#D46B0810":C.accD:"transparent"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:sp?6:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <CatIco cat={cat.id}/>
                            <span style={{fontSize:"0.75rem",fontWeight:600,color:isJunk?"#D46B08":sp?C.t:C.tm}}>{cat.name}</span>
                          </div>
                          {sp?<button onClick={()=>rmPart(cat.id)} style={{background:"none",border:"none",color:C.acc,cursor:"pointer",fontSize:"0.85rem",padding:"4px"}}>✕</button>
                          :<button onClick={()=>setPicker(isOpen?null:cat.id)} style={{padding:"6px 12px",background:C.s2,border:`1px dashed ${isJunk?"#D46B0850":C.bdr}`,borderRadius:5,color:isJunk?"#D46B08":C.acc,fontSize:"0.72rem",cursor:"pointer",fontFamily:fs}}>{isJunk?"🏴‍☠️ Browse":`+ Add`}</button>}
                        </div>
                        {sp&&(
                          <div style={{marginLeft:42}}>
                            <div style={{fontSize:"0.75rem",fontWeight:600}}>{sp.name}</div>
                            <div style={{display:"flex",gap:6,alignItems:"center",marginTop:3,flexWrap:"wrap"}}>
                              <span style={{fontFamily:fm,fontWeight:700,fontSize:"0.8rem"}}>{sp.price===0?"FREE":`$${sp.price}`}</span>
                              {(sp.hp>0||sp.tq>0)&&<span style={{fontSize:"0.6rem",fontFamily:fm,color:C.g}}>+{sp.hp}/{sp.tq}</span>}
                              <SkB lv={sp.sk}/>
                              <button onClick={()=>setPicker(cat.id)} style={{color:C.acc,background:"none",border:"none",cursor:"pointer",fontFamily:fs,fontSize:"0.6rem",padding:0}}>↻ swap</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ):(
                      /* DESKTOP GRID LAYOUT */
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
                    )}
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
                                <div style={{textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3,flexShrink:0}}>
                                  <span style={{fontFamily:fm,fontWeight:700,fontSize:"0.85rem"}}>{part.price===0?"FREE":`$${part.price}`}</span>
                                  <div style={{display:"flex",gap:3}}>
                                    <button onClick={()=>selPart(cat.id,part.id)} disabled={over} style={{padding:"3px 8px",borderRadius:4,border:"none",background:isSel?C.acc:over?C.td:C.t,color:isSel?"#fff":C.bg,fontSize:"0.58rem",fontWeight:600,cursor:over?"default":"pointer",fontFamily:fs}}>{isSel?"✓":over?"$$":"Select"}</button>
                                    {part.price>0&&<BuyBtn part={part}/>}
                                  </div>
                                </div>
                              </div>
                              <button onClick={()=>setExpP(expP===part.id?null:part.id)} style={{fontSize:"0.5rem",color:C.acc,background:"none",border:"none",cursor:"pointer",fontFamily:fs,padding:0,marginTop:2}}>{expP===part.id?"Hide ▴":"Details ▾"}</button>
                              {expP===part.id&&<div style={{marginTop:3,padding:"0.35rem",background:C.bg,borderRadius:4,border:`1px solid ${C.bdr}`}}>
                                <div style={{fontSize:"0.58rem",color:C.td}}>Skill: <span style={{color:SK[part.sk].c}}>{SK[part.sk].l}</span> • Time: {part.time<1?`${Math.round(part.time*60)}m`:`${part.time}h`} • Retailer: <span style={{color:C.tm}}>{part.ret}</span></div>
                                <div style={{fontSize:"0.58rem",color:C.td,marginTop:1}}>Tools: <span style={{color:C.tm}}>{part.tools}</span></div>
                                <div style={{fontSize:"0.58rem",padding:3,background:C.s2,borderRadius:3,marginTop:3}}><span style={{color:C.y}}>💡</span> {part.notes}</div>
                                {part.price>0&&<div style={{marginTop:4}}><BuyBtn part={part}/> <span style={{fontSize:"0.48rem",color:C.td,marginLeft:4}}>Opens {part.ret}</span></div>}
                              </div>}
                            </div>);
                        })}
                        <button onClick={()=>setPicker(null)} style={{width:"100%",padding:"0.3rem",background:C.s3,border:"none",borderRadius:4,color:C.tm,fontSize:"0.58rem",cursor:"pointer",fontFamily:fs,marginTop:2}}>Close</button>
                      </div>
                    )}
                  </div>);
              })}
              {mob?(
                <div style={{padding:"0.6rem",background:C.s2}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:"0.72rem",fontWeight:700,color:C.acc}}>TOTAL — {bParts.length} parts</span>
                    <span style={{fontFamily:fm,fontWeight:700,fontSize:"1rem",color:C.acc}}>${tCost.toLocaleString()}</span>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:4,fontSize:"0.6rem",color:C.tm}}>
                    <span>~{tTime<1?`${Math.round(tTime*60)}m`:`${tTime.toFixed(1)}h`} install</span>
                    {tHp>0&&<span style={{color:C.g}}>+{tHp}HP / +{tTq}TQ</span>}
                    {maxSk>0&&<SkB lv={maxSk} full/>}
                  </div>
                </div>
              ):(
              <div style={{display:"grid",gridTemplateColumns:"38px 110px 1fr 56px 50px 42px 26px",padding:"0.45rem",background:C.s2,alignItems:"center"}}><div/><span style={{fontSize:"0.65rem",fontWeight:700,color:C.acc}}>TOTAL</span><div style={{fontSize:"0.58rem",color:C.tm}}>{bParts.length} parts • ~{tTime<1?`${Math.round(tTime*60)}m`:`${tTime.toFixed(1)}h`}{maxSk>0&&<> • <SkB lv={maxSk} full/></>}</div><div style={{textAlign:"right",fontFamily:fm,fontWeight:700,fontSize:"0.85rem",color:C.acc}}>${tCost.toLocaleString()}</div><div style={{textAlign:"right",fontFamily:fm,fontSize:"0.62rem",color:C.g}}>{tHp>0?`+${tHp}/+${tTq}`:"—"}</div><div/><div/></div>
              )}
            </div>
            {tHp>0&&plat&&<div style={{marginTop:5,padding:"0.4rem 0.5rem",background:C.gD,border:`1px solid ${C.g}20`,borderRadius:5,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:"0.65rem",color:C.g}}>Est. Output</span><span style={{fontFamily:fm,fontWeight:700,fontSize:"0.75rem",color:C.g}}>~{plat.hp+tHp}HP / ~{plat.tq+tTq}TQ</span></div>}
            {bParts.length>0&&<div style={{marginTop:5,padding:"0.4rem 0.5rem",background:C.s1,borderRadius:5,border:`1px solid ${C.bdr}`}}><div style={{fontSize:"0.48rem",textTransform:"uppercase",letterSpacing:"0.08em",color:C.td,marginBottom:2}}>🧰 Tools</div><div style={{fontSize:"0.58rem",color:C.tm,lineHeight:1.4}}>{[...new Set(bParts.flatMap(p=>p.tools.split(", ")))].join(" • ")}</div></div>}

            {/* ═══ DELUSION METER ═══ */}
            {delusion && bParts.length >= 2 && (
              <div style={{marginTop:8,padding:"0.75rem",background:C.s1,borderRadius:10,border:`1px solid ${delusion.tierColor}30`,animation:"fadeUp 0.4s ease-out",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg, transparent, ${delusion.tierColor}50, transparent)`}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:"0.12em",color:delusion.tierColor,fontFamily:fm}}>Delusion Meter™</div>
                  <div style={{fontSize:"1.3rem",filter:"saturate(1.2)"}}>{delusion.tierEmoji}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{flex:1,height:12,background:C.bdr,borderRadius:6,overflow:"hidden",position:"relative"}}>
                    <div style={{height:"100%",width:`${delusion.score}%`,background:`linear-gradient(90deg, #2EC4B6, #FFB703, #FB8500, #E63946, #FF6B6B)`,borderRadius:6,transition:"width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",animation:"barFill 0.8s ease-out",boxShadow:`0 0 12px ${delusion.tierColor}40`}}/>
                  </div>
                  <span style={{fontFamily:fm,fontWeight:700,fontSize:"0.9rem",color:delusion.tierColor,minWidth:30,textAlign:"right"}}>{delusion.score}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <span style={{fontSize:"0.9rem",fontWeight:700,color:delusion.tierColor}}>{delusion.tierEmoji} {delusion.tier}</span>
                  <span style={{fontSize:"0.55rem",color:C.td,fontFamily:fm}}>{delusion.score}/100</span>
                </div>
                {delusion.flags.length > 0 && (
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:4}}>
                    {delusion.flags.map((f,i) => (
                      <span key={i} style={{fontSize:"0.52rem",padding:"3px 8px",background:delusion.tierColor+"12",border:`1px solid ${delusion.tierColor}25`,borderRadius:12,color:delusion.tierColor,fontFamily:fm,animation:`fadeIn 0.3s ease-out ${i*0.05}s both`}}>{f}</span>
                    ))}
                  </div>
                )}
                <div style={{marginTop:10,paddingTop:8,borderTop:`1px solid ${C.bdr}`,display:"flex",justifyContent:"space-between",fontSize:"0.45rem",color:C.td,textTransform:"uppercase",letterSpacing:"0.08em"}}>
                  <span>😴 Stock+</span><span>🤝 I Know a Guy</span><span>🪚 Sawzall</span><span>💀 Heart Attack</span><span>🏴‍☠️ Offline</span>
                </div>
              </div>
            )}
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
      <BottomNav/>
    </div>
  );
}
