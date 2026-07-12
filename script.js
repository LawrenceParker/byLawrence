/* =========================================================
   DATA SOURCE
   -----------------------------------------------------------
   Right now this points at the local data.csv file bundled
   with the site, so you can preview everything immediately.

   When you're ready to go live, publish your Google Sheet as
   a CSV (File > Share > Publish to web > CSV) and paste that
   URL in below. The site will then always show your latest
   results automatically — no re-uploading needed.
   ========================================================= */
const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSVPgNQkP2k3JnPsAXIv_13VppervLlcAGcmXP6Ts2SqPcF69yokEvUI5vVTqIRuq1zzkTJGiVQt0s5/pub?gid=0&single=true&output=csv";

/* Local fallback copy of the data, used automatically whenever DATA_URL
   above is not a live http(s) link (e.g. still pointing at data.csv).
   Once you switch DATA_URL to your published Google Sheets URL, this
   is ignored and the live data is fetched instead. */
const EMBEDDED_CSV = `EventID,Date,Season,Round,Race,Race Name,Race Type,Team Name,Track,Driver,Car,Car Class,Start Pos,Finish Pos,FL,Penalties,Points,Quali Points,FL Points,Deductions,Total Points,Pos +/-,Quali Time,Race Fast Lap,Weather,Reverse Grid
GT-1,28/11/2023,Season 1,Round 1,Race 1,GT3 Cup,Individual,,Suzuka - Full Course,Alex Hoyle,Mercedes - AMG GT3 16,Gr.3,1,1,FL,,25,,2,0,27,0,,,,No
GT-1,28/11/2023,Season 1,Round 1,Race 1,GT3 Cup,Individual,,Suzuka - Full Course,Conor Roberts,Subaru - BRZ GT300 21,Gr.3,4,4,,,12,,,0,12,0,,,,No
GT-1,28/11/2023,Season 1,Round 1,Race 1,GT3 Cup,Individual,,Suzuka - Full Course,Harry Richards,DNS,Gr.3,DNS,DNS,,,0,,,0,0,0,,,,No
GT-1,28/11/2023,Season 1,Round 1,Race 1,GT3 Cup,Individual,,Suzuka - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,5,5,,,10,,,0,10,0,,,,No
GT-1,28/11/2023,Season 1,Round 1,Race 1,GT3 Cup,Individual,,Suzuka - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,2,3,,,15,,,0,15,-1,,,,No
GT-1,28/11/2023,Season 1,Round 1,Race 1,GT3 Cup,Individual,,Suzuka - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,3,2,,,18,,,0,18,1,,,,No
GT-2,28/11/2023,Season 1,Round 1,Race 2,GT3 Cup,Individual,,Suzuka - Full Course,Alex Hoyle,Mercedes - AMG GT3 16,Gr.3,4,2,FL,,18,,2,0,20,2,,,,Yes
GT-2,28/11/2023,Season 1,Round 1,Race 2,GT3 Cup,Individual,,Suzuka - Full Course,Conor Roberts,Subaru - BRZ GT300 21,Gr.3,2,5,,,10,,,0,10,-3,,,,Yes
GT-2,28/11/2023,Season 1,Round 1,Race 2,GT3 Cup,Individual,,Suzuka - Full Course,Harry Richards,DNS,Gr.3,DNS,DNS,,,0,,,0,0,0,,,,Yes
GT-2,28/11/2023,Season 1,Round 1,Race 2,GT3 Cup,Individual,,Suzuka - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,1,3,,,15,,,0,15,-2,,,,Yes
GT-2,28/11/2023,Season 1,Round 1,Race 2,GT3 Cup,Individual,,Suzuka - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,3,1,,,25,,,0,25,2,,,,Yes
GT-2,28/11/2023,Season 1,Round 1,Race 2,GT3 Cup,Individual,,Suzuka - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,5,4,,,12,,,0,12,1,,,,Yes
GT-3,5/12/2023,Season 1,Round 2,Race 1,GT3 Cup,Individual,,Mount Panorama - Full Course,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,2,2,,,18,,,0,18,0,,,,No
GT-3,5/12/2023,Season 1,Round 2,Race 1,GT3 Cup,Individual,,Mount Panorama - Full Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,3,3,,,15,,,0,15,0,,,,No
GT-3,5/12/2023,Season 1,Round 2,Race 1,GT3 Cup,Individual,,Mount Panorama - Full Course,Harry Richards,DNS,Gr.3,DNS,DNS,,,0,,,0,0,0,,,,No
GT-3,5/12/2023,Season 1,Round 2,Race 1,GT3 Cup,Individual,,Mount Panorama - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,5,4,,,12,,,0,12,1,,,,No
GT-3,5/12/2023,Season 1,Round 2,Race 1,GT3 Cup,Individual,,Mount Panorama - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,1,1,FL,,25,,2,0,27,0,,,,No
GT-3,5/12/2023,Season 1,Round 2,Race 1,GT3 Cup,Individual,,Mount Panorama - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,4,5,,,10,,,0,10,-1,,,,No
GT-5,5/12/2023,Season 1,Round 3,Race 2,GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Alex Hoyle,,Gr.3,DNS,DNS,,,0,,,0,0,0,,,,Yes
GT-5,5/12/2023,Season 1,Round 3,Race 2,GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,2,4,,,12,,,0,12,-2,,,,Yes
GT-5,5/12/2023,Season 1,Round 3,Race 2,GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Harry Richards,Dodge - Viper SRT GT3-R 15,Gr.3,1,5,,,10,,,0,10,-4,,,,Yes
GT-5,5/12/2023,Season 1,Round 3,Race 2,GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,4,3,,,15,,,0,15,1,,,,Yes
GT-5,5/12/2023,Season 1,Round 3,Race 2,GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,5,1,FL,,25,,2,0,27,4,,,,Yes
GT-5,5/12/2023,Season 1,Round 3,Race 2,GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Liam England,Porsche - 911 RSR (991) 17,Gr.3,3,2,,,18,,,0,18,1,,,,Yes
GT-6,12/12/2023,Season 1,Round 4,Race 1,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,1,1,FL,,25,,2,0,27,0,,,,No
GT-6,12/12/2023,Season 1,Round 4,Race 1,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,3,2,,,18,,,0,18,1,,,,No
GT-6,12/12/2023,Season 1,Round 4,Race 1,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Harry Richards,Dodge - Viper SRT GT3-R 15,Gr.3,6,4,,,12,,,0,12,2,,,,No
GT-6,12/12/2023,Season 1,Round 4,Race 1,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,4,6,,,8,,,0,8,-2,,,,No
GT-6,12/12/2023,Season 1,Round 4,Race 1,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,2,5,,,10,,,0,10,-3,,,,No
GT-6,12/12/2023,Season 1,Round 4,Race 1,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,5,3,,,15,,,0,15,2,,,,No
GT-7,12/12/2023,Season 1,Round 4,Race 2,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,6,1,FL,,25,,2,0,27,5,,,,Yes
GT-7,12/12/2023,Season 1,Round 4,Race 2,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,5,5,,,10,,,0,10,0,,,,Yes
GT-7,12/12/2023,Season 1,Round 4,Race 2,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Harry Richards,Dodge - Viper SRT GT3-R 15,Gr.3,3,2,,,18,,,0,18,1,,,,Yes
GT-7,12/12/2023,Season 1,Round 4,Race 2,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,1,3,,,15,,,0,15,-2,,,,Yes
GT-7,12/12/2023,Season 1,Round 4,Race 2,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,2,6,,,8,,,0,8,-4,,,,Yes
GT-7,12/12/2023,Season 1,Round 4,Race 2,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,4,4,,,12,,,0,12,0,,,,Yes
GT-8,19/12/2023,Season 1,Round 5,Race 1,GT3 Cup,Individual,,Road Atlanta - Full Course,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,1,1,FL,,25,,2,0,27,0,,,,No
GT-8,19/12/2023,Season 1,Round 5,Race 1,GT3 Cup,Individual,,Road Atlanta - Full Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,5,4,,,12,,,0,12,1,,,,No
GT-8,19/12/2023,Season 1,Round 5,Race 1,GT3 Cup,Individual,,Road Atlanta - Full Course,Harry Richards,Dodge - Viper SRT GT3-R 15,Gr.3,4,3,,,15,,,0,15,1,,,,No
GT-8,19/12/2023,Season 1,Round 5,Race 1,GT3 Cup,Individual,,Road Atlanta - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,6,2,,,18,,,0,18,4,,,,No
GT-8,19/12/2023,Season 1,Round 5,Race 1,GT3 Cup,Individual,,Road Atlanta - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,2,5,,,10,,,0,10,-3,,,,No
GT-8,19/12/2023,Season 1,Round 5,Race 1,GT3 Cup,Individual,,Road Atlanta - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,3,6,,,8,,,0,8,-3,,,,No
GT-9,19/12/2023,Season 1,Round 5,Race 2,GT3 Cup,Individual,,Road Atlanta - Full Course,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,6,1,FL,,25,,2,0,27,5,,,,Yes
GT-9,19/12/2023,Season 1,Round 5,Race 2,GT3 Cup,Individual,,Road Atlanta - Full Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,3,5,,,10,,,0,10,-2,,,,Yes
GT-9,19/12/2023,Season 1,Round 5,Race 2,GT3 Cup,Individual,,Road Atlanta - Full Course,Harry Richards,Dodge - Viper SRT GT3-R 15,Gr.3,4,6,,,8,,,0,8,-2,,,,Yes
GT-9,19/12/2023,Season 1,Round 5,Race 2,GT3 Cup,Individual,,Road Atlanta - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,5,3,,,15,,,0,15,2,,,,Yes
GT-9,19/12/2023,Season 1,Round 5,Race 2,GT3 Cup,Individual,,Road Atlanta - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,2,2,,,18,,,0,18,0,,,,Yes
GT-9,19/12/2023,Season 1,Round 5,Race 2,GT3 Cup,Individual,,Road Atlanta - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,1,4,,,12,,,0,12,-3,,,,Yes
GT-10,26/12/2023,Season 1,Round 6,Race 1,GT3 Cup,Individual,,Red Bull Ring - Full Course,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,2,2,FL,,18,,2,0,20,0,,,,No
GT-10,26/12/2023,Season 1,Round 6,Race 1,GT3 Cup,Individual,,Red Bull Ring - Full Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,4,4,,,12,,,0,12,0,,,,No
GT-10,26/12/2023,Season 1,Round 6,Race 1,GT3 Cup,Individual,,Red Bull Ring - Full Course,Harry Richards,Dodge - Viper SRT GT3-R 15,Gr.3,3,5,,,10,,,0,10,-2,,,,No
GT-10,26/12/2023,Season 1,Round 6,Race 1,GT3 Cup,Individual,,Red Bull Ring - Full Course,Joe McGhee,,Gr.3,DNS,DNS,,,0,,,0,0,0,,,,No
GT-10,26/12/2023,Season 1,Round 6,Race 1,GT3 Cup,Individual,,Red Bull Ring - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,1,1,,,25,,,0,25,0,,,,No
GT-10,26/12/2023,Season 1,Round 6,Race 1,GT3 Cup,Individual,,Red Bull Ring - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,5,3,,,15,,,0,15,2,,,,No
GT-11,26/12/2023,Season 1,Round 6,Race 2,GT3 Cup,Individual,,Red Bull Ring - Full Course,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,4,1,FL,,25,,2,0,27,3,,,,Yes
GT-11,26/12/2023,Season 1,Round 6,Race 2,GT3 Cup,Individual,,Red Bull Ring - Full Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,2,4,,,12,,,0,12,-2,,,,Yes
GT-11,26/12/2023,Season 1,Round 6,Race 2,GT3 Cup,Individual,,Red Bull Ring - Full Course,Harry Richards,Dodge - Viper SRT GT3-R 15,Gr.3,1,5,,,10,,,0,10,-4,,,,Yes
GT-11,26/12/2023,Season 1,Round 6,Race 2,GT3 Cup,Individual,,Red Bull Ring - Full Course,Joe McGhee,,Gr.3,DNS,DNS,,,0,,,0,0,0,,,,Yes
GT-11,26/12/2023,Season 1,Round 6,Race 2,GT3 Cup,Individual,,Red Bull Ring - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,5,2,,,18,,,0,18,3,,,,Yes
GT-11,26/12/2023,Season 1,Round 6,Race 2,GT3 Cup,Individual,,Red Bull Ring - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,3,3,,,15,,,0,15,0,,,,Yes
GT-12,2/1/2024,Season 1,Round 7,Race 1,GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,1,1,FL,,25,,2,0,27,0,,,,No
GT-12,2/1/2024,Season 1,Round 7,Race 1,GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,6,4,,,12,,,0,12,2,,,,No
GT-12,2/1/2024,Season 1,Round 7,Race 1,GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Harry Richards,Dodge - Viper SRT GT3-R 15,Gr.3,4,6,,,8,,,0,8,-2,,,,No
GT-12,2/1/2024,Season 1,Round 7,Race 1,GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,5,5,,,10,,,0,10,0,,,,No
GT-12,2/1/2024,Season 1,Round 7,Race 1,GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,2,2,,,18,,,0,18,0,,,,No
GT-12,2/1/2024,Season 1,Round 7,Race 1,GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Liam England,Porsche - 911 RSR (991) 17,Gr.3,3,3,,,15,,,0,15,0,,,,No
GT-13,2/1/2024,Season 1,Round 7,Race 2,GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,6,1,FL,,25,,2,0,27,5,,,,Yes
GT-13,2/1/2024,Season 1,Round 7,Race 2,GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,3,5,,,10,,,0,10,-2,,,,Yes
GT-13,2/1/2024,Season 1,Round 7,Race 2,GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Harry Richards,Dodge - Viper SRT GT3-R 15,Gr.3,1,6,,,8,,,0,8,-5,,,,Yes
GT-13,2/1/2024,Season 1,Round 7,Race 2,GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,2,4,,,12,,,0,12,-2,,,,Yes
GT-13,2/1/2024,Season 1,Round 7,Race 2,GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,5,2,,,18,,,0,18,3,,,,Yes
GT-13,2/1/2024,Season 1,Round 7,Race 2,GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Liam England,Porsche - 911 RSR (991) 17,Gr.3,4,3,,,15,,,0,15,1,,,,Yes
GT-14,9/1/2024,Season 1,Round 8,Race 1,GT3 Cup,Individual,,Nürburgring - Grand Prix,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,1,1,FL,,25,,2,0,27,0,,,,No
GT-14,9/1/2024,Season 1,Round 8,Race 1,GT3 Cup,Individual,,Nürburgring - Grand Prix,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,6,4,,,12,,,0,12,2,,,,No
GT-14,9/1/2024,Season 1,Round 8,Race 1,GT3 Cup,Individual,,Nürburgring - Grand Prix,Harry Richards,Audi - R8 LMS 15,Gr.3,5,5,,,10,,,0,10,0,,,,No
GT-14,9/1/2024,Season 1,Round 8,Race 1,GT3 Cup,Individual,,Nürburgring - Grand Prix,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,4,3,,,15,,,0,15,1,,,,No
GT-14,9/1/2024,Season 1,Round 8,Race 1,GT3 Cup,Individual,,Nürburgring - Grand Prix,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,2,6,,,8,,,0,8,-4,,,,No
GT-14,9/1/2024,Season 1,Round 8,Race 1,GT3 Cup,Individual,,Nürburgring - Grand Prix,Liam England,Porsche - 911 RSR (991) 17,Gr.3,3,2,,,18,,,0,18,1,,,,No
GT-15,9/1/2024,Season 1,Round 8,Race 2,GT3 Cup,Individual,,Nürburgring - Grand Prix,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,6,1,FL,,25,,2,0,27,5,,,,Yes
GT-15,9/1/2024,Season 1,Round 8,Race 2,GT3 Cup,Individual,,Nürburgring - Grand Prix,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,3,5,,,10,,,0,10,-2,,,,Yes
GT-15,9/1/2024,Season 1,Round 8,Race 2,GT3 Cup,Individual,,Nürburgring - Grand Prix,Harry Richards,Audi - R8 LMS 15,Gr.3,2,4,,,12,,,0,12,-2,,,,Yes
GT-15,9/1/2024,Season 1,Round 8,Race 2,GT3 Cup,Individual,,Nürburgring - Grand Prix,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,4,6,,,8,,,0,8,-2,,,,Yes
GT-15,9/1/2024,Season 1,Round 8,Race 2,GT3 Cup,Individual,,Nürburgring - Grand Prix,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,1,2,,,18,,,0,18,-1,,,,Yes
GT-15,16/1/2024,Season 1,Round 8,Race 2,GT3 Cup,Individual,,Nürburgring - Grand Prix,Liam England,Porsche - 911 RSR (991) 17,Gr.3,5,3,,,15,,,0,15,2,,,,Yes
GT-16,16/1/2024,Season 1,Round 9,Race 1,GT3 Cup,Individual,,Watkins Glen - Long Course,Alex Hoyle,,Gr.3,DNS,DNS,DNS,,0,,,0,0,0,,,,No
GT-16,16/1/2024,Season 1,Round 9,Race 1,GT3 Cup,Individual,,Watkins Glen - Long Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,5,4,,,12,,,0,12,1,,,,No
GT-16,16/1/2024,Season 1,Round 9,Race 1,GT3 Cup,Individual,,Watkins Glen - Long Course,Harry Richards,Audi - R8 LMS 15,Gr.3,4,5,,,10,,,0,10,-1,,,,No
GT-16,16/1/2024,Season 1,Round 9,Race 1,GT3 Cup,Individual,,Watkins Glen - Long Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,3,3,,,15,,,0,15,0,,,,No
GT-16,16/1/2024,Season 1,Round 9,Race 1,GT3 Cup,Individual,,Watkins Glen - Long Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,2,1,,,25,,,0,25,1,,,,No
GT-16,16/1/2024,Season 1,Round 9,Race 1,GT3 Cup,Individual,,Watkins Glen - Long Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,1,2,FL,,18,,2,0,20,-1,,,,No
GT-17,16/1/2024,Season 1,Round 9,Race 2,GT3 Cup,Individual,,Watkins Glen - Long Course,Alex Hoyle,,Gr.3,DNS,DNS,DNS,,0,,,0,0,0,,,,Yes
GT-17,16/1/2024,Season 1,Round 9,Race 2,GT3 Cup,Individual,,Watkins Glen - Long Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,2,3,,,15,,,0,15,-1,,,,Yes
GT-17,16/1/2024,Season 1,Round 9,Race 2,GT3 Cup,Individual,,Watkins Glen - Long Course,Harry Richards,Audi - R8 LMS 15,Gr.3,1,5,,,10,,,0,10,-4,,,,Yes
GT-17,16/1/2024,Season 1,Round 9,Race 2,GT3 Cup,Individual,,Watkins Glen - Long Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,3,2,,,18,,,0,18,1,,,,Yes
GT-17,16/1/2024,Season 1,Round 9,Race 2,GT3 Cup,Individual,,Watkins Glen - Long Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,5,1,FL,,25,,2,0,27,4,,,,Yes
GT-17,16/1/2024,Season 1,Round 9,Race 2,GT3 Cup,Individual,,Watkins Glen - Long Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,4,4,,,12,,,0,12,0,,,,Yes
GT-18,23/1/2024,Season 1,Round 10,Race 1,GT3 Cup,Individual,,Monza - Full Course,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,1,1,FL,,25,,2,0,27,0,,,,No
GT-18,23/1/2024,Season 1,Round 10,Race 1,GT3 Cup,Individual,,Monza - Full Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,4,5,,,10,,,0,10,-1,,,,No
GT-18,23/1/2024,Season 1,Round 10,Race 1,GT3 Cup,Individual,,Monza - Full Course,Harry Richards,Audi - R8 LMS 15,Gr.3,5,6,,,8,,,0,8,-1,,,,No
GT-18,23/1/2024,Season 1,Round 10,Race 1,GT3 Cup,Individual,,Monza - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,6,4,,,12,,,0,12,2,,,,No
GT-18,23/1/2024,Season 1,Round 10,Race 1,GT3 Cup,Individual,,Monza - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,2,3,,,15,,,0,15,-1,,,,No
GT-18,23/1/2024,Season 1,Round 10,Race 1,GT3 Cup,Individual,,Monza - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,3,2,,,18,,,0,18,1,,,,No
GT-19,23/1/2024,Season 1,Round 10,Race 2,GT3 Cup,Individual,,Monza - Full Course,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,6,2,,,18,,,0,18,4,,,,Yes
GT-19,23/1/2024,Season 1,Round 10,Race 2,GT3 Cup,Individual,,Monza - Full Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,2,4,,,12,,,0,12,-2,,,,Yes
GT-19,23/1/2024,Season 1,Round 10,Race 2,GT3 Cup,Individual,,Monza - Full Course,Harry Richards,Audi - R8 LMS 15,Gr.3,1,5,,,10,,,0,10,-4,,,,Yes
GT-19,23/1/2024,Season 1,Round 10,Race 2,GT3 Cup,Individual,,Monza - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,3,3,,,15,,,0,15,0,,,,Yes
GT-19,23/1/2024,Season 1,Round 10,Race 2,GT3 Cup,Individual,,Monza - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,4,1,FL,,25,,2,0,27,3,,,,Yes
GT-19,23/1/2024,Season 1,Round 10,Race 2,GT3 Cup,Individual,,Monza - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,5,4,,,12,,,0,12,1,,,,Yes
GT-20,30/1/2024,Season 1,Round 11,Race 1,GT3 Cup,Individual,,Daytona - Road Course,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,2,2,FL,,18,,2,0,20,0,,,,No
GT-20,30/1/2024,Season 1,Round 11,Race 1,GT3 Cup,Individual,,Daytona - Road Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,4,3,,,15,,,0,15,1,,,,No
GT-20,30/1/2024,Season 1,Round 11,Race 1,GT3 Cup,Individual,,Daytona - Road Course,Harry Richards,Audi - R8 LMS 15,Gr.3,3,6,,,8,,,0,8,-3,,,,No
GT-20,30/1/2024,Season 1,Round 11,Race 1,GT3 Cup,Individual,,Daytona - Road Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,6,5,,,10,,,0,10,1,,,,No
GT-20,30/1/2024,Season 1,Round 11,Race 1,GT3 Cup,Individual,,Daytona - Road Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,1,1,,,25,,,0,25,0,,,,No
GT-20,30/1/2024,Season 1,Round 11,Race 1,GT3 Cup,Individual,,Daytona - Road Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,5,4,,,12,,,0,12,1,,,,No
GT-21,30/1/2024,Season 1,Round 11,Race 2,GT3 Cup,Individual,,Daytona - Road Course,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,5,2,,,18,,,0,18,3,,,,Yes
GT-21,30/1/2024,Season 1,Round 11,Race 2,GT3 Cup,Individual,,Daytona - Road Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,4,3,,,15,,,0,15,1,,,,Yes
GT-21,30/1/2024,Season 1,Round 11,Race 2,GT3 Cup,Individual,,Daytona - Road Course,Harry Richards,Audi - R8 LMS 15,Gr.3,1,5,,,10,,,0,10,-4,,,,Yes
GT-21,30/1/2024,Season 1,Round 11,Race 2,GT3 Cup,Individual,,Daytona - Road Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,2,4,,,12,,,0,12,-2,,,,Yes
GT-21,30/1/2024,Season 1,Round 11,Race 2,GT3 Cup,Individual,,Daytona - Road Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,6,1,FL,,25,,2,0,27,5,,,,Yes
GT-21,30/1/2024,Season 1,Round 11,Race 2,GT3 Cup,Individual,,Daytona - Road Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,6,6,,,8,,,0,8,0,,,,Yes
GT-22,22/11/2023,Season 2,Round 1,Race 1,125 Racing Kart Cup,Individual,,Lago Maggiore - East End,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,3,1,FL,,25,,2,0,27,2,,,,No
GT-22,22/11/2023,Season 2,Round 1,Race 1,125 Racing Kart Cup,Individual,,Lago Maggiore - East End,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,DNS,DNS,,,0,,,0,0,0,,,,No
GT-22,22/11/2023,Season 2,Round 1,Race 1,125 Racing Kart Cup,Individual,,Lago Maggiore - East End,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,4,4,,,12,,,0,12,0,,,,No
GT-22,22/11/2023,Season 2,Round 1,Race 1,125 Racing Kart Cup,Individual,,Lago Maggiore - East End,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,1,5,,,10,,,0,10,-4,,,,No
GT-22,22/11/2023,Season 2,Round 1,Race 1,125 Racing Kart Cup,Individual,,Lago Maggiore - East End,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,5,3,,,15,,,0,15,2,,,,No
GT-22,22/11/2023,Season 2,Round 1,Race 1,125 Racing Kart Cup,Individual,,Lago Maggiore - East End,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,2,2,,,18,,,0,18,0,,,,No
GT-23,22/11/2023,Season 2,Round 1,Race 2,Road Car Rotator Challenge,Individual,,BB Raceway - Full Course,Lawrence Parker,Ford - F-150 SVT Raptor 11,Road,1,4,,,12,,,0,12,-3,,,,No
GT-23,22/11/2023,Season 2,Round 1,Race 2,Road Car Rotator Challenge,Individual,,BB Raceway - Full Course,Alex Hoyle,Ford - F-150 SVT Raptor 11,Road,DNS,DNS,,,0,,,0,0,0,,,,No
GT-23,22/11/2023,Season 2,Round 1,Race 2,Road Car Rotator Challenge,Individual,,BB Raceway - Full Course,Conor Roberts,Ford - F-150 SVT Raptor 11,Road,4,1,,,25,,,0,25,3,,,,No
GT-23,22/11/2023,Season 2,Round 1,Race 2,Road Car Rotator Challenge,Individual,,BB Raceway - Full Course,Liam England,Ford - F-150 SVT Raptor 11,Road,5,3,,,15,,,0,15,2,,,,No
GT-23,22/11/2023,Season 2,Round 1,Race 2,Road Car Rotator Challenge,Individual,,BB Raceway - Full Course,Harry Richards,Ford - F-150 SVT Raptor 11,Road,3,2,FL,,18,,2,0,20,1,,,,No
GT-23,22/11/2023,Season 2,Round 1,Race 2,Road Car Rotator Challenge,Individual,,BB Raceway - Full Course,Joe McGhee,Ford - F-150 SVT Raptor 11,Road,2,5,,,10,,,0,10,-3,,,,No
GT-24,22/11/2023,Season 2,Round 1,Race 3,GT3 Cup,Individual,,Tsukuba - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,2,4,,,12,,,0,12,-2,,,,Yes
GT-24,22/11/2023,Season 2,Round 1,Race 3,GT3 Cup,Individual,,Tsukuba - Full Course,Alex Hoyle,,Gr.3,0,DNS,,,0,,,0,0,0,,,,Yes
GT-24,22/11/2023,Season 2,Round 1,Race 3,GT3 Cup,Individual,,Tsukuba - Full Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,5,1,,,25,,,0,25,4,,,,Yes
GT-24,22/11/2023,Season 2,Round 1,Race 3,GT3 Cup,Individual,,Tsukuba - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,3,2,,,18,,,0,18,1,,,,Yes
GT-24,22/11/2023,Season 2,Round 1,Race 3,GT3 Cup,Individual,,Tsukuba - Full Course,Harry Richards,Lamborghini - Huracán GT3 15,Gr.3,4,5,,,10,,,0,10,-1,,,,Yes
GT-24,22/11/2023,Season 2,Round 1,Race 3,GT3 Cup,Individual,,Tsukuba - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,1,3,FL,,15,,2,0,17,-2,,,,Yes
GT-25,30/11/2023,Season 2,Round 2,Race 1,125 Racing Kart Cup,Individual,,Barcelona - National Layout,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,1,1,FL,,25,,2,0,27,0,,,,No
GT-25,30/11/2023,Season 2,Round 2,Race 1,125 Racing Kart Cup,Individual,,Barcelona - National Layout,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,2,4,,,12,,,0,12,-2,,,,No
GT-25,30/11/2023,Season 2,Round 2,Race 1,125 Racing Kart Cup,Individual,,Barcelona - National Layout,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,3,3,,,15,,,0,15,0,,,,No
GT-25,30/11/2023,Season 2,Round 2,Race 1,125 Racing Kart Cup,Individual,,Barcelona - National Layout,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,5,2,,,18,,,0,18,3,,,,No
GT-25,30/11/2023,Season 2,Round 2,Race 1,125 Racing Kart Cup,Individual,,Barcelona - National Layout,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,4,5,,,10,,,0,10,-1,,,,No
GT-25,30/11/2023,Season 2,Round 2,Race 1,125 Racing Kart Cup,Individual,,Barcelona - National Layout,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,6,6,,,8,,,0,8,0,,,,No
GT-26,30/11/2023,Season 2,Round 2,Race 2,Road Car Rotator Challenge,Individual,,Blue Moon Bay - Full Course,Lawrence Parker,Toyota - Himedic 21,Road,1,3,FL,,15,,2,0,17,-2,,,,No
GT-26,30/11/2023,Season 2,Round 2,Race 2,Road Car Rotator Challenge,Individual,,Blue Moon Bay - Full Course,Alex Hoyle,Toyota - Himedic 21,Road,4,4,,,12,,,0,12,0,,,,No
GT-26,30/11/2023,Season 2,Round 2,Race 2,Road Car Rotator Challenge,Individual,,Blue Moon Bay - Full Course,Conor Roberts,Toyota - Himedic 21,Road,3,2,,,18,,,0,18,1,,,,No
GT-26,30/11/2023,Season 2,Round 2,Race 2,Road Car Rotator Challenge,Individual,,Blue Moon Bay - Full Course,Liam England,Toyota - Himedic 21,Road,2,1,,,25,,,0,25,1,,,,No
GT-26,30/11/2023,Season 2,Round 2,Race 2,Road Car Rotator Challenge,Individual,,Blue Moon Bay - Full Course,Harry Richards,Toyota - Himedic 21,Road,5,5,,,10,,,0,10,0,,,,No
GT-26,30/11/2023,Season 2,Round 2,Race 2,Road Car Rotator Challenge,Individual,,Blue Moon Bay - Full Course,Joe McGhee,Toyota - Himedic 21,Road,6,6,,,8,,,0,8,0,,,,No
GT-27,30/11/2023,Season 2,Round 2,Race 3,GT3 Cup,Individual,,Fuji - Short Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,4,2,,,18,,,0,18,2,,,,Yes
GT-27,30/11/2023,Season 2,Round 2,Race 3,GT3 Cup,Individual,,Fuji - Short Course,Alex Hoyle,Toyota - GR Supra Racing Concept 18,Gr.3,3,1,FL,,25,,2,0,27,2,,,,Yes
GT-27,30/11/2023,Season 2,Round 2,Race 3,GT3 Cup,Individual,,Fuji - Short Course,Conor Roberts,Mercedes - AMG GT3 20,Gr.3,5,5,,,10,,,0,10,0,,,,Yes
GT-27,30/11/2023,Season 2,Round 2,Race 3,GT3 Cup,Individual,,Fuji - Short Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,6,4,,,12,,,0,12,2,,,,Yes
GT-27,30/11/2023,Season 2,Round 2,Race 3,GT3 Cup,Individual,,Fuji - Short Course,Harry Richards,Lamborghini - Huracán GT3 15,Gr.3,2,6,,,8,,,0,8,-4,,,,Yes
GT-27,30/11/2023,Season 2,Round 2,Race 3,GT3 Cup,Individual,,Fuji - Short Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,1,3,,,15,,,0,15,-2,,,,Yes
GT-28,05/12/2023,Season 2,Round 3,Race 1,125 Racing Kart Cup,Individual,,Willow Springs - Horse Thief Mile,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,1,1,FL,,25,,2,0,27,0,,,,No
GT-28,05/12/2023,Season 2,Round 3,Race 1,125 Racing Kart Cup,Individual,,Willow Springs - Horse Thief Mile,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,2,2,,,18,,,0,18,0,,,,No
GT-28,05/12/2023,Season 2,Round 3,Race 1,125 Racing Kart Cup,Individual,,Willow Springs - Horse Thief Mile,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,6,5,,,10,,,0,10,1,,,,No
GT-28,05/12/2023,Season 2,Round 3,Race 1,125 Racing Kart Cup,Individual,,Willow Springs - Horse Thief Mile,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,5,6,,,8,,,0,8,-1,,,,No
GT-28,05/12/2023,Season 2,Round 3,Race 1,125 Racing Kart Cup,Individual,,Willow Springs - Horse Thief Mile,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,4,4,,,12,,,0,12,0,,,,No
GT-28,05/12/2023,Season 2,Round 3,Race 1,125 Racing Kart Cup,Individual,,Willow Springs - Horse Thief Mile,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,3,3,,,15,,,0,15,0,,,,No
GT-29,05/12/2023,Season 2,Round 3,Race 2,Road Car Rotator Challenge,Individual,,Kyoto - Miyabi,Lawrence Parker,Porsche - Cayman GT4 16,Road,1,1,FL,,25,,2,0,27,0,,,,No
GT-29,05/12/2023,Season 2,Round 3,Race 2,Road Car Rotator Challenge,Individual,,Kyoto - Miyabi,Alex Hoyle,Porsche - Cayman GT4 16,Road,2,2,,,18,,,0,18,0,,,,No
GT-29,05/12/2023,Season 2,Round 3,Race 2,Road Car Rotator Challenge,Individual,,Kyoto - Miyabi,Conor Roberts,Porsche - Cayman GT4 16,Road,5,4,,,12,,,0,12,1,,,,No
GT-29,05/12/2023,Season 2,Round 3,Race 2,Road Car Rotator Challenge,Individual,,Kyoto - Miyabi,Liam England,Porsche - Cayman GT4 16,Road,6,6,,,8,,,0,8,0,,,,No
GT-29,05/12/2023,Season 2,Round 3,Race 2,Road Car Rotator Challenge,Individual,,Kyoto - Miyabi,Harry Richards,Porsche - Cayman GT4 16,Road,4,3,,,15,,,0,15,1,,,,No
GT-29,05/12/2023,Season 2,Round 3,Race 2,Road Car Rotator Challenge,Individual,,Kyoto - Miyabi,Joe McGhee,Porsche - Cayman GT4 16,Road,3,5,,,10,,,0,10,-2,,,,No
GT-30,05/12/2023,Season 2,Round 3,Race 3,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - 24h Layout,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,6,2,,,18,,,0,18,4,,,,Yes
GT-30,05/12/2023,Season 2,Round 3,Race 3,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - 24h Layout,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,5,1,FL,,25,,2,0,27,4,,,,Yes
GT-30,05/12/2023,Season 2,Round 3,Race 3,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - 24h Layout,Conor Roberts,Porsche - 911 RSR (991) 17,Gr.3,3,6,,,8,,,0,8,-3,,,,Yes
GT-30,05/12/2023,Season 2,Round 3,Race 3,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - 24h Layout,Liam England,Porsche - 911 RSR (991) 17,Gr.3,1,5,,,10,,,0,10,-4,,,,Yes
GT-30,05/12/2023,Season 2,Round 3,Race 3,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - 24h Layout,Harry Richards,Porsche - 911 RSR (991) 17,Gr.3,4,3,,,15,,,0,15,1,,,,Yes
GT-30,05/12/2023,Season 2,Round 3,Race 3,GT3 Cup,Individual,,Circuit de Spa-Francorchamps - 24h Layout,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,2,4,,,12,,,0,12,-2,,,,Yes
GT-31,14/12/2023,Season 2,Round 4,Race 1,125 Racing Kart Cup,Individual,,Lago Maggiore - West End,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,5,3,FL,,15,,2,0,17,2,,,,No
GT-31,14/12/2023,Season 2,Round 4,Race 1,125 Racing Kart Cup,Individual,,Lago Maggiore - West End,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,2,5,,,10,,,0,10,-3,,,,No
GT-31,14/12/2023,Season 2,Round 4,Race 1,125 Racing Kart Cup,Individual,,Lago Maggiore - West End,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,4,2,,,18,,,0,18,2,,,,No
GT-31,14/12/2023,Season 2,Round 4,Race 1,125 Racing Kart Cup,Individual,,Lago Maggiore - West End,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,1,1,,,25,,,0,25,0,,,,No
GT-31,14/12/2023,Season 2,Round 4,Race 1,125 Racing Kart Cup,Individual,,Lago Maggiore - West End,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,3,6,,,8,,,0,8,-3,,,,No
GT-31,14/12/2023,Season 2,Round 4,Race 1,125 Racing Kart Cup,Individual,,Lago Maggiore - West End,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,6,4,,,12,,,0,12,2,,,,No
GT-32,14/12/2023,Season 2,Round 4,Race 2,Road Car Rotator Challenge,Individual,,Grand Valley - Highway 1,Lawrence Parker,BMW - M2 Competition 18,Road,3,5,,,10,,,0,10,-2,,,,No
GT-32,14/12/2023,Season 2,Round 4,Race 2,Road Car Rotator Challenge,Individual,,Grand Valley - Highway 1,Alex Hoyle,BMW - M2 Competition 18,Road,5,1,FL,,25,,2,0,27,4,,,,No
GT-32,14/12/2023,Season 2,Round 4,Race 2,Road Car Rotator Challenge,Individual,,Grand Valley - Highway 1,Conor Roberts,BMW - M2 Competition 18,Road,2,2,,,18,,,0,18,0,,,,No
GT-32,14/12/2023,Season 2,Round 4,Race 2,Road Car Rotator Challenge,Individual,,Grand Valley - Highway 1,Liam England,BMW - M2 Competition 18,Road,1,3,,,15,,,0,15,-2,,,,No
GT-32,14/12/2023,Season 2,Round 4,Race 2,Road Car Rotator Challenge,Individual,,Grand Valley - Highway 1,Harry Richards,BMW - M2 Competition 18,Road,6,4,,,12,,,0,12,2,,,,No
GT-32,14/12/2023,Season 2,Round 4,Race 2,Road Car Rotator Challenge,Individual,,Grand Valley - Highway 1,Joe McGhee,BMW - M2 Competition 18,Road,4,6,,,8,,,0,8,-2,,,,No
GT-33,14/12/2023,Season 2,Round 4,Race 3,GT3 Cup,Individual,,Laguna Seca - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,2,3,,,15,,,0,15,-1,,,,Yes
GT-33,14/12/2023,Season 2,Round 4,Race 3,GT3 Cup,Individual,,Laguna Seca - Full Course,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,6,1,FL,,25,,2,0,27,5,,,,Yes
GT-33,14/12/2023,Season 2,Round 4,Race 3,GT3 Cup,Individual,,Laguna Seca - Full Course,Conor Roberts,Porsche - 911 RSR (991) 17,Gr.3,5,5,,,10,,,0,10,0,,,,Yes
GT-33,14/12/2023,Season 2,Round 4,Race 3,GT3 Cup,Individual,,Laguna Seca - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,4,2,,,18,,,0,18,2,,,,Yes
GT-33,14/12/2023,Season 2,Round 4,Race 3,GT3 Cup,Individual,,Laguna Seca - Full Course,Harry Richards,Porsche - 911 RSR (991) 17,Gr.3,3,4,,,12,,,0,12,-1,,,,Yes
GT-33,14/12/2023,Season 2,Round 4,Race 3,GT3 Cup,Individual,,Laguna Seca - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,1,6,,,8,,,0,8,-5,,,,Yes
GT-34,20/12/2023,Season 2,Round 5,Race 1,125 Racing Kart Cup,Individual,,Alsace - Test Course,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,1,1,,,25,,,0,25,0,,,,No
GT-34,20/12/2023,Season 2,Round 5,Race 1,125 Racing Kart Cup,Individual,,Alsace - Test Course,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,5,3,FL,,15,,2,0,17,2,,,,No
GT-34,20/12/2023,Season 2,Round 5,Race 1,125 Racing Kart Cup,Individual,,Alsace - Test Course,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,3,2,,,18,,,0,18,1,,,,No
GT-34,20/12/2023,Season 2,Round 5,Race 1,125 Racing Kart Cup,Individual,,Alsace - Test Course,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,2,4,,,12,,,0,12,-2,,,,No
GT-34,20/12/2023,Season 2,Round 5,Race 1,125 Racing Kart Cup,Individual,,Alsace - Test Course,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,6,6,,,8,,,0,8,0,,,,No
GT-34,20/12/2023,Season 2,Round 5,Race 1,125 Racing Kart Cup,Individual,,Alsace - Test Course,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,4,5,,,10,,,0,10,-1,,,,No
GT-35,20/12/2023,Season 2,Round 5,Race 2,Road Car Rotator Challenge,Individual,,Willow Springs - Big Willow,Lawrence Parker,Tesla Motors - Model 3 Performance 23,Road,1,5,,,10,,,0,10,-4,,,,No
GT-35,20/12/2023,Season 2,Round 5,Race 2,Road Car Rotator Challenge,Individual,,Willow Springs - Big Willow,Alex Hoyle,Tesla Motors - Model 3 Performance 23,Road,3,1,FL,,25,,2,0,27,2,,,,No
GT-35,20/12/2023,Season 2,Round 5,Race 2,Road Car Rotator Challenge,Individual,,Willow Springs - Big Willow,Conor Roberts,Tesla Motors - Model 3 Performance 23,Road,2,4,,,12,,,0,12,-2,,,,No
GT-35,20/12/2023,Season 2,Round 5,Race 2,Road Car Rotator Challenge,Individual,,Willow Springs - Big Willow,Liam England,Tesla Motors - Model 3 Performance 23,Road,4,6,,,8,,,0,8,-2,,,,No
GT-35,20/12/2023,Season 2,Round 5,Race 2,Road Car Rotator Challenge,Individual,,Willow Springs - Big Willow,Harry Richards,Tesla Motors - Model 3 Performance 23,Road,5,3,,,15,,,0,15,2,,,,No
GT-35,20/12/2023,Season 2,Round 5,Race 2,Road Car Rotator Challenge,Individual,,Willow Springs - Big Willow,Joe McGhee,Tesla Motors - Model 3 Performance 23,Road,6,2,,,18,,,0,18,4,,,,No
GT-36,20/12/2023,Season 2,Round 5,Race 3,GT3 Cup,Individual,,Blue Moon Bay - Infield A,Lawrence Parker,Porsche - 911 RSR (991) 17,Gr.3,2,2,,,18,,,0,18,0,,,,Yes
GT-36,20/12/2023,Season 2,Round 5,Race 3,GT3 Cup,Individual,,Blue Moon Bay - Infield A,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,6,1,FL,,25,,2,0,27,5,,,,Yes
GT-36,20/12/2023,Season 2,Round 5,Race 3,GT3 Cup,Individual,,Blue Moon Bay - Infield A,Conor Roberts,Porsche - 911 RSR (991) 17,Gr.3,3,3,,,15,,,0,15,0,,,,Yes
GT-36,20/12/2023,Season 2,Round 5,Race 3,GT3 Cup,Individual,,Blue Moon Bay - Infield A,Liam England,Porsche - 911 RSR (991) 17,Gr.3,1,6,,,8,,,0,8,-5,,,,Yes
GT-36,20/12/2023,Season 2,Round 5,Race 3,GT3 Cup,Individual,,Blue Moon Bay - Infield A,Harry Richards,Porsche - 911 RSR (991) 17,Gr.3,4,5,,,10,,,0,10,-1,,,,Yes
GT-36,20/12/2023,Season 2,Round 5,Race 3,GT3 Cup,Individual,,Blue Moon Bay - Infield A,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,5,4,,,12,,,0,12,1,,,,Yes
GT-37,27/12/2023,Season 2,Round 6,Race 1,125 Racing Kart Cup,Individual,,Brands Hatch - Indy Circuit,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,5,5,FL,,10,,2,0,12,0,,,,No
GT-37,27/12/2023,Season 2,Round 6,Race 1,125 Racing Kart Cup,Individual,,Brands Hatch - Indy Circuit,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,2,2,,,18,,,0,18,0,,,,No
GT-37,27/12/2023,Season 2,Round 6,Race 1,125 Racing Kart Cup,Individual,,Brands Hatch - Indy Circuit,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,3,1,,,25,,,0,25,2,,,,No
GT-37,27/12/2023,Season 2,Round 6,Race 1,125 Racing Kart Cup,Individual,,Brands Hatch - Indy Circuit,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,4,3,,,15,,,0,15,1,,,,No
GT-37,27/12/2023,Season 2,Round 6,Race 1,125 Racing Kart Cup,Individual,,Brands Hatch - Indy Circuit,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,1,4,,,12,,,0,12,-3,,,,No
GT-37,27/12/2023,Season 2,Round 6,Race 1,125 Racing Kart Cup,Individual,,Brands Hatch - Indy Circuit,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,DNS,DNS,,,0,,,0,0,0,,,,No
GT-38,27/12/2023,Season 2,Round 6,Race 2,Road Car Rotator Challenge,Individual,,Deep Forest - Full Course,Lawrence Parker,Volkswagen - Polo GTI 14,Road,5,3,,,15,,,0,15,2,,,,No
GT-38,27/12/2023,Season 2,Round 6,Race 2,Road Car Rotator Challenge,Individual,,Deep Forest - Full Course,Alex Hoyle,Volkswagen - Polo GTI 14,Road,2,1,FL,,25,,2,0,27,1,,,,No
GT-38,27/12/2023,Season 2,Round 6,Race 2,Road Car Rotator Challenge,Individual,,Deep Forest - Full Course,Conor Roberts,Volkswagen - Polo GTI 14,Road,1,2,,,18,,,0,18,-1,,,,No
GT-38,27/12/2023,Season 2,Round 6,Race 2,Road Car Rotator Challenge,Individual,,Deep Forest - Full Course,Liam England,Volkswagen - Polo GTI 14,Road,3,4,,,12,,,0,12,-1,,,,No
GT-38,27/12/2023,Season 2,Round 6,Race 2,Road Car Rotator Challenge,Individual,,Deep Forest - Full Course,Harry Richards,Volkswagen - Polo GTI 14,Road,4,5,,,10,,,0,10,-1,,,,No
GT-38,27/12/2023,Season 2,Round 6,Race 2,Road Car Rotator Challenge,Individual,,Deep Forest - Full Course,Joe McGhee,,Road,DNS,DNS,,,0,,,0,0,0,,,,No
GT-39,27/12/2023,Season 2,Round 6,Race 3,GT3 Cup,Individual,,Trial Mountain - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,3,4,,,12,,,0,12,-1,,,,Yes
GT-39,27/12/2023,Season 2,Round 6,Race 3,GT3 Cup,Individual,,Trial Mountain - Full Course,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,5,1,FL,,25,,2,0,27,4,,,,Yes
GT-39,27/12/2023,Season 2,Round 6,Race 3,GT3 Cup,Individual,,Trial Mountain - Full Course,Conor Roberts,Porsche - 911 RSR (991) 17,Gr.3,4,5,,,10,,,0,10,-1,,,,Yes
GT-39,27/12/2023,Season 2,Round 6,Race 3,GT3 Cup,Individual,,Trial Mountain - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,1,3,,,15,,,0,15,-2,,,,Yes
GT-39,27/12/2023,Season 2,Round 6,Race 3,GT3 Cup,Individual,,Trial Mountain - Full Course,Harry Richards,Porsche - 911 RSR (991) 17,Gr.3,2,2,,,18,,,0,18,0,,,,Yes
GT-39,27/12/2023,Season 2,Round 6,Race 3,GT3 Cup,Individual,,Trial Mountain - Full Course,Joe McGhee,,Gr.3,DNS,DNS,,,0,,,0,0,0,,,,Yes
GT-40,04/01/2024,Season 2,Round 7,Race 1,125 Racing Kart Cup,Individual,,Tsukuba - Full Course,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,5,4,,,12,,,0,12,1,,,,No
GT-40,04/01/2024,Season 2,Round 7,Race 1,125 Racing Kart Cup,Individual,,Tsukuba - Full Course,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,2,1,,,25,,,0,25,1,,,,No
GT-40,04/01/2024,Season 2,Round 7,Race 1,125 Racing Kart Cup,Individual,,Tsukuba - Full Course,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,3,3,FL,,15,,2,0,17,0,,,,No
GT-40,04/01/2024,Season 2,Round 7,Race 1,125 Racing Kart Cup,Individual,,Tsukuba - Full Course,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,1,2,,,18,,,0,18,-1,,,,No
GT-40,04/01/2024,Season 2,Round 7,Race 1,125 Racing Kart Cup,Individual,,Tsukuba - Full Course,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,4,5,,,10,,,0,10,-1,,,,No
GT-40,04/01/2024,Season 2,Round 7,Race 1,125 Racing Kart Cup,Individual,,Tsukuba - Full Course,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,6,6,,,8,,,0,8,0,,,,No
GT-41,04/01/2024,Season 2,Round 7,Race 2,Road Car Rotator Challenge,Individual,,Autopolis - Shortcut Course,Lawrence Parker,BMW - M4 14,Road,4,5,,,10,,,0,10,-1,,,,No
GT-41,04/01/2024,Season 2,Round 7,Race 2,Road Car Rotator Challenge,Individual,,Autopolis - Shortcut Course,Alex Hoyle,BMW - M4 14,Road,1,2,,,18,,,0,18,-1,,,,No
GT-41,04/01/2024,Season 2,Round 7,Race 2,Road Car Rotator Challenge,Individual,,Autopolis - Shortcut Course,Conor Roberts,BMW - M4 14,Road,3,1,,,25,,,0,25,2,,,,No
GT-41,04/01/2024,Season 2,Round 7,Race 2,Road Car Rotator Challenge,Individual,,Autopolis - Shortcut Course,Liam England,BMW - M4 14,Road,2,3,FL,,15,,2,0,17,-1,,,,No
GT-41,04/01/2024,Season 2,Round 7,Race 2,Road Car Rotator Challenge,Individual,,Autopolis - Shortcut Course,Harry Richards,BMW - M4 14,Road,5,4,,,12,,,0,12,1,,,,No
GT-41,04/01/2024,Season 2,Round 7,Race 2,Road Car Rotator Challenge,Individual,,Autopolis - Shortcut Course,Joe McGhee,BMW - M4 14,Road,6,6,,,8,,,0,8,0,,,,No
GT-42,04/01/2024,Season 2,Round 7,Race 3,GT3 Cup,Individual,,Mount Panorama - Full Course,Lawrence Parker,McLaren - 650S GT3 15,Gr.3,2,5,,,10,,,0,10,-3,,,,Yes
GT-42,04/01/2024,Season 2,Round 7,Race 3,GT3 Cup,Individual,,Mount Panorama - Full Course,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,5,1,FL,,25,,2,0,27,4,,,,Yes
GT-42,04/01/2024,Season 2,Round 7,Race 3,GT3 Cup,Individual,,Mount Panorama - Full Course,Conor Roberts,Porsche - 911 RSR (991) 17,Gr.3,6,2,,,18,,,0,18,4,,,,Yes
GT-42,04/01/2024,Season 2,Round 7,Race 3,GT3 Cup,Individual,,Mount Panorama - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,4,4,,,12,,,0,12,0,,,,Yes
GT-42,04/01/2024,Season 2,Round 7,Race 3,GT3 Cup,Individual,,Mount Panorama - Full Course,Harry Richards,Porsche - 911 RSR (991) 17,Gr.3,3,6,,,8,,,0,8,-3,,,,Yes
GT-42,04/01/2024,Season 2,Round 7,Race 3,GT3 Cup,Individual,,Mount Panorama - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,1,3,,,15,,,0,15,-2,,,,Yes
GT-43,10/01/2024,Season 2,Round 8,Race 1,125 Racing Kart Cup,Individual,,Suzuka - East Course,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,1,1,FL,,25,,2,0,27,0,,,,No
GT-43,10/01/2024,Season 2,Round 8,Race 1,125 Racing Kart Cup,Individual,,Suzuka - East Course,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,2,2,,,18,,,0,18,0,,,,No
GT-43,10/01/2024,Season 2,Round 8,Race 1,125 Racing Kart Cup,Individual,,Suzuka - East Course,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,4,3,,,15,,,0,15,1,,,,No
GT-43,10/01/2024,Season 2,Round 8,Race 1,125 Racing Kart Cup,Individual,,Suzuka - East Course,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,3,4,,,12,,,0,12,-1,,,,No
GT-43,10/01/2024,Season 2,Round 8,Race 1,125 Racing Kart Cup,Individual,,Suzuka - East Course,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,4,5,,,10,,,0,10,-1,,,,No
GT-43,10/01/2024,Season 2,Round 8,Race 1,125 Racing Kart Cup,Individual,,Suzuka - East Course,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,6,6,,,8,,,0,8,0,,,,No
GT-44,10/01/2024,Season 2,Round 8,Race 2,Road Car Rotator Challenge,Individual,,Monza - Full Course,Lawrence Parker,Mercedes - AMG C 63 S 15,Road,1,4,FL,,12,,2,0,14,-3,,,,No
GT-44,10/01/2024,Season 2,Round 8,Race 2,Road Car Rotator Challenge,Individual,,Monza - Full Course,Alex Hoyle,Mercedes - AMG C 63 S 15,Road,2,1,,,25,,,0,25,1,,,,No
GT-44,10/01/2024,Season 2,Round 8,Race 2,Road Car Rotator Challenge,Individual,,Monza - Full Course,Conor Roberts,Mercedes - AMG C 63 S 15,Road,3,2,,,18,,,0,18,1,,,,No
GT-44,10/01/2024,Season 2,Round 8,Race 2,Road Car Rotator Challenge,Individual,,Monza - Full Course,Liam England,Mercedes - AMG C 63 S 15,Road,4,3,,,15,,,0,15,1,,,,No
GT-44,10/01/2024,Season 2,Round 8,Race 2,Road Car Rotator Challenge,Individual,,Monza - Full Course,Harry Richards,Mercedes - AMG C 63 S 15,Road,5,5,,,10,,,0,10,0,,,,No
GT-44,10/01/2024,Season 2,Round 8,Race 2,Road Car Rotator Challenge,Individual,,Monza - Full Course,Joe McGhee,Mercedes - AMG C 63 S 15,Road,6,6,,,8,,,0,8,0,,,,No
GT-45,10/01/2024,Season 2,Round 8,Race 3,GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Lawrence Parker,Porsche - 911 RSR (991) 17,Gr.3,3,2,,,18,,,0,18,1,,,,Yes
GT-45,10/01/2024,Season 2,Round 8,Race 3,GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,6,1,FL,,25,,2,0,27,5,,,,Yes
GT-45,10/01/2024,Season 2,Round 8,Race 3,GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Conor Roberts,Porsche - 911 RSR (991) 17,Gr.3,5,4,,,12,,,0,12,1,,,,Yes
GT-45,10/01/2024,Season 2,Round 8,Race 3,GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Liam England,Porsche - 911 RSR (991) 17,Gr.3,4,3,,,15,,,0,15,1,,,,Yes
GT-45,10/01/2024,Season 2,Round 8,Race 3,GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Harry Richards,Porsche - 911 RSR (991) 17,Gr.3,2,6,,,8,,,0,8,-4,,,,Yes
GT-45,10/01/2024,Season 2,Round 8,Race 3,GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,1,5,,,10,,,0,10,-4,,,,Yes
GT-46,17/01/2024,Season 2,Round 9,Race 1,125 Racing Kart Cup,Individual,,Red Bull Ring - Short Track,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,1,5,FL,,10,,2,0,12,-4,,,,No
GT-46,17/01/2024,Season 2,Round 9,Race 1,125 Racing Kart Cup,Individual,,Red Bull Ring - Short Track,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,6,DNS,,,0,,,0,0,0,,,,No
GT-46,17/01/2024,Season 2,Round 9,Race 1,125 Racing Kart Cup,Individual,,Red Bull Ring - Short Track,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,5,3,,,15,,,0,15,2,,,,No
GT-46,17/01/2024,Season 2,Round 9,Race 1,125 Racing Kart Cup,Individual,,Red Bull Ring - Short Track,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,2,1,,,25,,,0,25,1,,,,No
GT-46,17/01/2024,Season 2,Round 9,Race 1,125 Racing Kart Cup,Individual,,Red Bull Ring - Short Track,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,3,4,,,12,,,0,12,-1,,,,No
GT-46,17/01/2024,Season 2,Round 9,Race 1,125 Racing Kart Cup,Individual,,Red Bull Ring - Short Track,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,4,2,,,18,,,0,18,2,,,,No
GT-47,17/01/2024,Season 2,Round 9,Race 2,Road Car Rotator Challenge,Individual,,Brands Hatch - Grand Prix Circuit,Lawrence Parker,Unknown,Road,5,5,,,10,,,0,10,0,,,,No
GT-47,17/01/2024,Season 2,Round 9,Race 2,Road Car Rotator Challenge,Individual,,Brands Hatch - Grand Prix Circuit,Alex Hoyle,Unknown,Road,6,1,FL,,25,,2,0,27,5,,,,No
GT-47,17/01/2024,Season 2,Round 9,Race 2,Road Car Rotator Challenge,Individual,,Brands Hatch - Grand Prix Circuit,Conor Roberts,Unknown,Road,3,4,,,12,,,0,12,-1,,,,No
GT-47,17/01/2024,Season 2,Round 9,Race 2,Road Car Rotator Challenge,Individual,,Brands Hatch - Grand Prix Circuit,Liam England,Unknown,Road,1,2,,,18,,,0,18,-1,,,,No
GT-47,17/01/2024,Season 2,Round 9,Race 2,Road Car Rotator Challenge,Individual,,Brands Hatch - Grand Prix Circuit,Harry Richards,Unknown,Road,4,6,,,8,,,0,8,-2,,,,No
GT-47,17/01/2024,Season 2,Round 9,Race 2,Road Car Rotator Challenge,Individual,,Brands Hatch - Grand Prix Circuit,Joe McGhee,Unknown,Road,2,3,,,15,,,0,15,-1,,,,No
GT-48,17/01/2024,Season 2,Round 9,Race 3,GT3 Cup,Individual,,Alsace - Village,Lawrence Parker,Ferrari - 458 Italia GT3 13,Gr.3,2,5,,,10,,,0,10,-3,,,,Yes
GT-48,17/01/2024,Season 2,Round 9,Race 3,GT3 Cup,Individual,,Alsace - Village,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,6,1,FL,,25,,2,0,27,5,,,,Yes
GT-48,17/01/2024,Season 2,Round 9,Race 3,GT3 Cup,Individual,,Alsace - Village,Conor Roberts,Porsche - 911 RSR (991) 17,Gr.3,3,3,,,15,,,0,15,0,,,,Yes
GT-48,17/01/2024,Season 2,Round 9,Race 3,GT3 Cup,Individual,,Alsace - Village,Liam England,Porsche - 911 RSR (991) 17,Gr.3,5,2,,,18,,,0,18,3,,,,Yes
GT-48,17/01/2024,Season 2,Round 9,Race 3,GT3 Cup,Individual,,Alsace - Village,Harry Richards,Porsche - 911 RSR (991) 17,Gr.3,1,4,,,12,,,0,12,-3,,,,Yes
GT-48,17/01/2024,Season 2,Round 9,Race 3,GT3 Cup,Individual,,Alsace - Village,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,4,6,,,8,,,0,8,-2,,,,Yes
GT-49,26/01/2024,Season 2,Round 10,Race 1,125 Racing Kart Cup,Individual,,Kyoto - Miyabi,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,3,4,,,12,,,0,12,-1,,,,No
GT-49,26/01/2024,Season 2,Round 10,Race 1,125 Racing Kart Cup,Individual,,Kyoto - Miyabi,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,2,2,FL,,18,,2,0,20,0,,,,No
GT-49,26/01/2024,Season 2,Round 10,Race 1,125 Racing Kart Cup,Individual,,Kyoto - Miyabi,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,5,3,,,15,,,0,15,2,,,,No
GT-49,26/01/2024,Season 2,Round 10,Race 1,125 Racing Kart Cup,Individual,,Kyoto - Miyabi,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,1,1,,,25,,,0,25,0,,,,No
GT-49,26/01/2024,Season 2,Round 10,Race 1,125 Racing Kart Cup,Individual,,Kyoto - Miyabi,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,6,6,,,8,,,0,8,0,,,,No
GT-49,26/01/2024,Season 2,Round 10,Race 1,125 Racing Kart Cup,Individual,,Kyoto - Miyabi,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,4,5,,,10,,,0,10,-1,,,,No
GT-50,26/01/2024,Season 2,Round 10,Race 2,Road Car Rotator Challenge,Individual,,Sardegna - Layout B,Lawrence Parker,Radical - SR3 SL 13,Road,4,5,,,10,,,0,10,-1,,,,No
GT-50,26/01/2024,Season 2,Round 10,Race 2,Road Car Rotator Challenge,Individual,,Sardegna - Layout B,Alex Hoyle,Radical - SR3 SL 13,Road,2,1,,,25,,,0,25,1,,,,No
GT-50,26/01/2024,Season 2,Round 10,Race 2,Road Car Rotator Challenge,Individual,,Sardegna - Layout B,Conor Roberts,Radical - SR3 SL 13,Road,3,2,,,18,,,0,18,1,,,,No
GT-50,26/01/2024,Season 2,Round 10,Race 2,Road Car Rotator Challenge,Individual,,Sardegna - Layout B,Liam England,Radical - SR3 SL 13,Road,1,6,,,8,,,0,8,-5,,,,No
GT-50,26/01/2024,Season 2,Round 10,Race 2,Road Car Rotator Challenge,Individual,,Sardegna - Layout B,Harry Richards,Radical - SR3 SL 13,Road,6,4,,,12,,,0,12,2,,,,No
GT-50,26/01/2024,Season 2,Round 10,Race 2,Road Car Rotator Challenge,Individual,,Sardegna - Layout B,Joe McGhee,Radical - SR3 SL 13,Road,5,3,,,15,,,0,15,2,,,,No
GT-51,26/01/2024,Season 2,Round 10,Race 3,GT3 Cup,Individual,,Dragon Trail - Gardens,Lawrence Parker,Porsche - 911 RSR (991) 17,Gr.3,1,2,FL,,18,,2,0,20,-1,,,,Yes
GT-51,26/01/2024,Season 2,Round 10,Race 3,GT3 Cup,Individual,,Dragon Trail - Gardens,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,5,1,,,25,,,0,25,4,,,,Yes
GT-51,26/01/2024,Season 2,Round 10,Race 3,GT3 Cup,Individual,,Dragon Trail - Gardens,Conor Roberts,Porsche - 911 RSR (991) 17,Gr.3,4,4,,,12,,,0,12,0,,,,Yes
GT-51,26/01/2024,Season 2,Round 10,Race 3,GT3 Cup,Individual,,Dragon Trail - Gardens,Liam England,,Gr.3,DNS,DNS,,,0,,,0,0,0,,,,Yes
GT-51,26/01/2024,Season 2,Round 10,Race 3,GT3 Cup,Individual,,Dragon Trail - Gardens,Harry Richards,McLaren - 650S GT3 15,Gr.3,2,5,,,10,,,0,10,-3,,,,Yes
GT-51,26/01/2024,Season 2,Round 10,Race 3,GT3 Cup,Individual,,Dragon Trail - Gardens,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,3,3,,,15,,,0,15,0,,,,Yes
GT-52,31/01/2024,Season 2,Round 11,Race 1,125 Racing Kart Cup,Individual,,Nürburgring - Sprint,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,6,6,FL,,8,,2,0,10,0,,,,No
GT-52,31/01/2024,Season 2,Round 11,Race 1,125 Racing Kart Cup,Individual,,Nürburgring - Sprint,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,1,4,,,12,,,0,12,-3,,,,No
GT-52,31/01/2024,Season 2,Round 11,Race 1,125 Racing Kart Cup,Individual,,Nürburgring - Sprint,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,4,2,,,18,,,0,18,2,,,,No
GT-52,31/01/2024,Season 2,Round 11,Race 1,125 Racing Kart Cup,Individual,,Nürburgring - Sprint,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,2,1,,,25,,,0,25,1,,,,No
GT-52,31/01/2024,Season 2,Round 11,Race 1,125 Racing Kart Cup,Individual,,Nürburgring - Sprint,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,5,5,,,10,,,0,10,0,,,,No
GT-52,31/01/2024,Season 2,Round 11,Race 1,125 Racing Kart Cup,Individual,,Nürburgring - Sprint,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,3,3,,,15,,,0,15,0,,,,No
GT-53,31/01/2024,Season 2,Round 11,Race 2,Road Car Rotator Challenge,Individual,,Brands Hatch - Indy Circuit,Lawrence Parker,MINI Cooper S 05,Road,6,5,,,10,,,0,10,1,,,,No
GT-53,31/01/2024,Season 2,Round 11,Race 2,Road Car Rotator Challenge,Individual,,Brands Hatch - Indy Circuit,Alex Hoyle,MINI Cooper S 05,Road,4,1,FL,,25,,2,0,27,3,,,,No
GT-53,31/01/2024,Season 2,Round 11,Race 2,Road Car Rotator Challenge,Individual,,Brands Hatch - Indy Circuit,Conor Roberts,MINI Cooper S 05,Road,2,2,,,18,,,0,18,0,,,,No
GT-53,31/01/2024,Season 2,Round 11,Race 2,Road Car Rotator Challenge,Individual,,Brands Hatch - Indy Circuit,Liam England,MINI Cooper S 05,Road,1,3,,,15,,,0,15,-2,,,,No
GT-53,31/01/2024,Season 2,Round 11,Race 2,Road Car Rotator Challenge,Individual,,Brands Hatch - Indy Circuit,Harry Richards,MINI Cooper S 05,Road,5,5,,,10,,,0,10,0,,,,No
GT-53,31/01/2024,Season 2,Round 11,Race 2,Road Car Rotator Challenge,Individual,,Brands Hatch - Indy Circuit,Joe McGhee,MINI Cooper S 05,Road,3,6,,,8,,,0,8,-3,,,,No
GT-54,31/01/2024,Season 2,Round 11,Race 3,GT3 Cup,Individual,,Kyoto - Yamagiwa + Miyabi,Lawrence Parker,Porsche - 911 RSR (991) 17,Gr.3,2,1,FL,,25,,2,0,27,1,,,,Yes
GT-54,31/01/2024,Season 2,Round 11,Race 3,GT3 Cup,Individual,,Kyoto - Yamagiwa + Miyabi,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,6,2,,,18,,,0,18,4,,,,Yes
GT-54,31/01/2024,Season 2,Round 11,Race 3,GT3 Cup,Individual,,Kyoto - Yamagiwa + Miyabi,Conor Roberts,Porsche - 911 RSR (991) 17,Gr.3,5,4,,,12,,,0,12,1,,,,Yes
GT-54,31/01/2024,Season 2,Round 11,Race 3,GT3 Cup,Individual,,Kyoto - Yamagiwa + Miyabi,Liam England,Porsche - 911 RSR (991) 17,Gr.3,4,3,,,15,,,0,15,1,,,,Yes
GT-54,31/01/2024,Season 2,Round 11,Race 3,GT3 Cup,Individual,,Kyoto - Yamagiwa + Miyabi,Harry Richards,McLaren - 650S GT3 15,Gr.3,1,5,,,10,,,0,10,-4,,,,Yes
GT-54,31/01/2024,Season 2,Round 11,Race 3,GT3 Cup,Individual,,Kyoto - Yamagiwa + Miyabi,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,3,6,,,8,,,0,8,-3,,,,Yes
GT-55,07/02/2024,Season 2,Round 12,Race 1,125 Racing Kart Cup,Individual,,Willow Springs - Streets of Willow Springs,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,4,4,,,12,,,0,12,0,,,,No
GT-55,07/02/2024,Season 2,Round 12,Race 1,125 Racing Kart Cup,Individual,,Willow Springs - Streets of Willow Springs,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,2,1,FL,,25,,2,0,27,1,,,,No
GT-55,07/02/2024,Season 2,Round 12,Race 1,125 Racing Kart Cup,Individual,,Willow Springs - Streets of Willow Springs,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,3,3,,,15,,,0,15,0,,,,No
GT-55,07/02/2024,Season 2,Round 12,Race 1,125 Racing Kart Cup,Individual,,Willow Springs - Streets of Willow Springs,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,1,2,,,18,,,0,18,-1,,,,No
GT-55,07/02/2024,Season 2,Round 12,Race 1,125 Racing Kart Cup,Individual,,Willow Springs - Streets of Willow Springs,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,5,DNS,,,0,,,0,0,0,,,,No
GT-55,07/02/2024,Season 2,Round 12,Race 1,125 Racing Kart Cup,Individual,,Willow Springs - Streets of Willow Springs,Joe McGhee,,Kart,DNS,DNS,,,0,,,0,0,0,,,,No
GT-56,07/02/2024,Season 2,Round 12,Race 2,Road Car Rotator Challenge,Individual,,Interlagos - Full Course,Lawrence Parker,Ford - Shelby GT350R 16,Road,4,4,,,12,,,0,12,0,,,,No
GT-56,07/02/2024,Season 2,Round 12,Race 2,Road Car Rotator Challenge,Individual,,Interlagos - Full Course,Alex Hoyle,Ford - Shelby GT350R 16,Road,1,1,FL,,25,,2,0,27,0,,,,No
GT-56,07/02/2024,Season 2,Round 12,Race 2,Road Car Rotator Challenge,Individual,,Interlagos - Full Course,Conor Roberts,Ford - Shelby GT350R 16,Road,3,3,,,15,,,0,15,0,,,,No
GT-56,07/02/2024,Season 2,Round 12,Race 2,Road Car Rotator Challenge,Individual,,Interlagos - Full Course,Liam England,Ford - Shelby GT350R 16,Road,2,2,,,18,,,0,18,0,,,,No
GT-56,07/02/2024,Season 2,Round 12,Race 2,Road Car Rotator Challenge,Individual,,Interlagos - Full Course,Harry Richards,Ford - Shelby GT350R 16,Road,5,5,,,10,,,0,10,0,,,,No
GT-56,07/02/2024,Season 2,Round 12,Race 2,Road Car Rotator Challenge,Individual,,Interlagos - Full Course,Joe McGhee,,Road,DNS,DNS,,,0,,,0,0,0,,,,No
GT-57,07/02/2024,Season 2,Round 12,Race 3,GT3 Cup,Individual,,Lago Maggiore - West,Lawrence Parker,Porsche - 911 RSR (991) 17,Gr.3,2,2,,,18,,,0,18,0,,,,Yes
GT-57,07/02/2024,Season 2,Round 12,Race 3,GT3 Cup,Individual,,Lago Maggiore - West,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,5,1,FL,,25,,2,0,27,4,,,,Yes
GT-57,07/02/2024,Season 2,Round 12,Race 3,GT3 Cup,Individual,,Lago Maggiore - West,Conor Roberts,Porsche - 911 RSR (991) 17,Gr.3,3,4,,,12,,,0,12,-1,,,,Yes
GT-57,07/02/2024,Season 2,Round 12,Race 3,GT3 Cup,Individual,,Lago Maggiore - West,Liam England,Porsche - 911 RSR (991) 17,Gr.3,4,3,,,15,,,0,15,1,,,,Yes
GT-57,07/02/2024,Season 2,Round 12,Race 3,GT3 Cup,Individual,,Lago Maggiore - West,Harry Richards,Nissan - GT-R NISMO GT3 18,Gr.3,1,5,,,10,,,0,10,-4,,,,Yes
GT-57,07/02/2024,Season 2,Round 12,Race 3,GT3 Cup,Individual,,Lago Maggiore - West,Joe McGhee,,DNS,DNS,DNS,,,0,,,0,0,0,,,,Yes
GT-58,21/02/2024,Season 3,Round 1,Race 1,Manufacturers Cup (Gr.4),Individual,,Watkins Glen - Long Course,Alex Hoyle,Porsche - Cayman GT4 Clubsport 16,Gr.4,1,1,FL,,25,,2,0,27,0,,,,No
GT-58,21/02/2024,Season 3,Round 1,Race 1,Manufacturers Cup (Gr.4),Individual,,Watkins Glen - Long Course,Conor Roberts,Nissan - Silvia spec-R Aero (S15) Touring Car,Gr.4,6,5,,,10,,,0,10,1,,,,No
GT-58,21/02/2024,Season 3,Round 1,Race 1,Manufacturers Cup (Gr.4),Individual,,Watkins Glen - Long Course,Harry Richards,Nissan - Silvia spec-R Aero (S15) Touring Car,Gr.4,2,3,,,15,,,0,15,-1,,,,No
GT-58,21/02/2024,Season 3,Round 1,Race 1,Manufacturers Cup (Gr.4),Individual,,Watkins Glen - Long Course,Joe McGhee,Audi - TT Cup 16,Gr.4,4,4,,,12,,,0,12,0,,,,No
GT-58,21/02/2024,Season 3,Round 1,Race 1,Manufacturers Cup (Gr.4),Individual,,Watkins Glen - Long Course,Lawrence Parker,Peugeot - RCZ Gr.4,Gr.4,3,6,,,8,,,0,8,-3,,,,No
GT-58,21/02/2024,Season 3,Round 1,Race 1,Manufacturers Cup (Gr.4),Individual,,Watkins Glen - Long Course,Liam England,Porsche - Cayman GT4 Clubsport 16,Gr.4,5,2,,,18,,,0,18,3,,,,No
GT-59,21/02/2024,Season 3,Round 1,Race 3,Manufacturers Cup (Gr.1),Individual,,Daytona - Road Course,Alex Hoyle,Porsche - 919 Hybrid 16,Gr.1,1,1,FL,,25,,2,0,27,0,,,,Yes
GT-59,21/02/2024,Season 3,Round 1,Race 3,Manufacturers Cup (Gr.1),Individual,,Daytona - Road Course,Conor Roberts,Nissan - GT-R LM NISMO 15,Gr.1,5,3,,,15,,,0,15,2,,,,Yes
GT-59,21/02/2024,Season 3,Round 1,Race 3,Manufacturers Cup (Gr.1),Individual,,Daytona - Road Course,Harry Richards,Nissan - GT-R LM NISMO 15,Gr.1,3,6,,,8,,,0,8,-3,,,,Yes
GT-59,21/02/2024,Season 3,Round 1,Race 3,Manufacturers Cup (Gr.1),Individual,,Daytona - Road Course,Joe McGhee,Audi - R8 LMS Evo 19,Gr.1,4,4,,,12,,,0,12,0,,,,Yes
GT-59,21/02/2024,Season 3,Round 1,Race 3,Manufacturers Cup (Gr.1),Individual,,Daytona - Road Course,Lawrence Parker,Peugeot - 908 HDi FAP 10,Gr.1,6,5,,,10,,,0,10,1,,,,Yes
GT-59,21/02/2024,Season 3,Round 1,Race 3,Manufacturers Cup (Gr.1),Individual,,Daytona - Road Course,Liam England,Porsche - 919 Hybrid 16,Gr.1,2,2,,,18,,,0,18,0,,,,Yes
GT-60,21/02/2024,Season 3,Round 1,Race 2,Manufacturers Cup (Gr.3),Individual,,Fuji - Short Course,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,6,4,FL,,12,,2,0,14,2,,,,No
GT-60,21/02/2024,Season 3,Round 1,Race 2,Manufacturers Cup (Gr.3),Individual,,Fuji - Short Course,Conor Roberts,??,Gr.3,4,2,,,18,,,0,18,2,,,,No
GT-60,21/02/2024,Season 3,Round 1,Race 2,Manufacturers Cup (Gr.3),Individual,,Fuji - Short Course,Harry Richards,??,Gr.3,1,1,,,25,,,0,25,0,,,,No
GT-60,21/02/2024,Season 3,Round 1,Race 2,Manufacturers Cup (Gr.3),Individual,,Fuji - Short Course,Joe McGhee,Audi - R18 16,Gr.3,3,6,,,8,,,0,8,-3,,,,No
GT-60,21/02/2024,Season 3,Round 1,Race 2,Manufacturers Cup (Gr.3),Individual,,Fuji - Short Course,Lawrence Parker,Toyota - GR Supra Racing Concept 18,Gr.3,2,3,,,15,,,0,15,-1,,,,No
GT-60,21/02/2024,Season 3,Round 1,Race 2,Manufacturers Cup (Gr.3),Individual,,Fuji - Short Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,5,5,,,10,,,0,10,0,,,,No
GT-61,28/02/2024,Season 3,Round 2,Race 1,Manufacturers Cup (Gr.4),Individual,,Alsace - Village,Alex Hoyle,Porsche - Cayman GT4 Clubsport 16,Gr.4,1,1,FL,,25,,2,0,27,0,,,,No
GT-61,28/02/2024,Season 3,Round 2,Race 1,Manufacturers Cup (Gr.4),Individual,,Alsace - Village,Conor Roberts,Nissan - Silvia spec-R Aero (S15) Touring Car,Gr.4,4,6,,,8,,,0,8,-2,,,,No
GT-61,28/02/2024,Season 3,Round 2,Race 1,Manufacturers Cup (Gr.4),Individual,,Alsace - Village,Harry Richards,Nissan - Silvia spec-R Aero (S15) Touring Car,Gr.4,5,5,,,10,,,0,10,0,,,,No
GT-61,28/02/2024,Season 3,Round 2,Race 1,Manufacturers Cup (Gr.4),Individual,,Alsace - Village,Joe McGhee,Audi - TT Cup 16,Gr.4,3,3,,,15,,,0,15,0,,,,No
GT-61,28/02/2024,Season 3,Round 2,Race 1,Manufacturers Cup (Gr.4),Individual,,Alsace - Village,Lawrence Parker,Peugeot - RCZ Gr.4,Gr.4,2,2,,,18,,,0,18,0,,,,No
GT-61,28/02/2024,Season 3,Round 2,Race 1,Manufacturers Cup (Gr.4),Individual,,Alsace - Village,Liam England,Porsche - Cayman GT4 Clubsport 16,Gr.4,6,4,,,12,,,0,12,2,,,,No
GT-62,28/02/2024,Season 3,Round 2,Race 2,Manufacturers Cup (Gr.3),Individual,,Autopolis - Full Course,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,1,1,FL,,25,,2,0,27,0,,,,No
GT-62,28/02/2024,Season 3,Round 2,Race 2,Manufacturers Cup (Gr.3),Individual,,Autopolis - Full Course,Conor Roberts,??,Gr.3,6,6,,,8,,,0,8,0,,,,No
GT-62,28/02/2024,Season 3,Round 2,Race 2,Manufacturers Cup (Gr.3),Individual,,Autopolis - Full Course,Harry Richards,??,Gr.3,5,4,,,12,,,0,12,1,,,,No
GT-62,28/02/2024,Season 3,Round 2,Race 2,Manufacturers Cup (Gr.3),Individual,,Autopolis - Full Course,Joe McGhee,Audi - R18 16,Gr.3,3,2,,,18,,,0,18,1,,,,No
GT-62,28/02/2024,Season 3,Round 2,Race 2,Manufacturers Cup (Gr.3),Individual,,Autopolis - Full Course,Lawrence Parker,Peugeot - RCZ Gr.3,Gr.3,2,5,,,10,,,0,10,-3,,,,No
GT-62,28/02/2024,Season 3,Round 2,Race 2,Manufacturers Cup (Gr.3),Individual,,Autopolis - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,4,3,,,15,,,0,15,1,,,,No
GT-63,28/02/2024,Season 3,Round 2,Race 3,Manufacturers Cup (Gr.1),Individual,,Mount Panorama - Full Course,Alex Hoyle,Porsche - 919 Hybrid 16,Gr.1,6,2,FL,,18,,2,0,20,4,,,,Yes
GT-63,28/02/2024,Season 3,Round 2,Race 3,Manufacturers Cup (Gr.1),Individual,,Mount Panorama - Full Course,Conor Roberts,Nissan - GT-R LM NISMO 15,Gr.1,1,4,,,12,,,0,12,-3,,,,Yes
GT-63,28/02/2024,Season 3,Round 2,Race 3,Manufacturers Cup (Gr.1),Individual,,Mount Panorama - Full Course,Harry Richards,Nissan - GT-R LM NISMO 15,Gr.1,3,5,,,10,,,0,10,-2,,,,Yes
GT-63,28/02/2024,Season 3,Round 2,Race 3,Manufacturers Cup (Gr.1),Individual,,Mount Panorama - Full Course,Joe McGhee,Audi - R8 LMS Evo 19,Gr.1,5,3,,,15,,,0,15,2,,,,Yes
GT-63,28/02/2024,Season 3,Round 2,Race 3,Manufacturers Cup (Gr.1),Individual,,Mount Panorama - Full Course,Lawrence Parker,Peugeot - 908 HDi FAP 10,Gr.1,2,6,,,8,,,0,8,-4,,,,Yes
GT-63,28/02/2024,Season 3,Round 2,Race 3,Manufacturers Cup (Gr.1),Individual,,Mount Panorama - Full Course,Liam England,Porsche - 919 Hybrid 16,Gr.1,4,1,,,25,,,0,25,3,,,,Yes
GT-64,06/03/2024,Season 3,Round 3,Race 1,Manufacturers Cup (Gr.4),Individual,,Lago Maggiore - East,Alex Hoyle,Porsche - Cayman GT4 Clubsport 16,Gr.4,1,1,FL,,25,,2,0,27,0,,,,No
GT-64,06/03/2024,Season 3,Round 3,Race 1,Manufacturers Cup (Gr.4),Individual,,Lago Maggiore - East,Conor Roberts,Audi - TT Cup 16,Gr.4,3,4,,,12,,,0,12,-1,,,,No
GT-64,06/03/2024,Season 3,Round 3,Race 1,Manufacturers Cup (Gr.4),Individual,,Lago Maggiore - East,Harry Richards,Toyota - GR Supra Race Car 19,Gr.4,5,5,,,10,,,0,10,0,,,,No
GT-64,06/03/2024,Season 3,Round 3,Race 1,Manufacturers Cup (Gr.4),Individual,,Lago Maggiore - East,Joe McGhee,Audi - TT Cup 16,Gr.4,4,3,,,15,,,0,15,1,,,,No
GT-64,06/03/2024,Season 3,Round 3,Race 1,Manufacturers Cup (Gr.4),Individual,,Lago Maggiore - East,Lawrence Parker,Peugeot - RCZ Gr.4,Gr.4,DNS,DNS,,,0,,,0,0,0,,,,No
GT-64,06/03/2024,Season 3,Round 3,Race 1,Manufacturers Cup (Gr.4),Individual,,Lago Maggiore - East,Liam England,Porsche - Cayman GT4 Clubsport 16,Gr.4,2,2,,,18,,,0,18,0,,,,No
GT-65,06/03/2024,Season 3,Round 3,Race 2,Manufacturers Cup (Gr.3),Individual,,Kyoto - Yamagiwa,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,1,1,FL,,25,,2,0,27,0,,,,No
GT-65,06/03/2024,Season 3,Round 3,Race 2,Manufacturers Cup (Gr.3),Individual,,Kyoto - Yamagiwa,Conor Roberts,Audi - R18 16,Gr.3,4,4,,,12,,,0,12,0,,,,No
GT-65,06/03/2024,Season 3,Round 3,Race 2,Manufacturers Cup (Gr.3),Individual,,Kyoto - Yamagiwa,Harry Richards,Toyota - GR Supra Racing Concept 18,Gr.3,5,3,,,15,,,0,15,2,,,,No
GT-65,06/03/2024,Season 3,Round 3,Race 2,Manufacturers Cup (Gr.3),Individual,,Kyoto - Yamagiwa,Joe McGhee,Audi - R18 16,Gr.3,3,5,,,10,,,0,10,-2,,,,No
GT-65,06/03/2024,Season 3,Round 3,Race 2,Manufacturers Cup (Gr.3),Individual,,Kyoto - Yamagiwa,Lawrence Parker,Peugeot - RCZ Gr.3,Gr.3,DNS,DNS,,,0,,,0,0,0,,,,No
GT-65,06/03/2024,Season 3,Round 3,Race 2,Manufacturers Cup (Gr.3),Individual,,Kyoto - Yamagiwa,Liam England,Porsche - 911 RSR (991) 17,Gr.3,2,2,,,18,,,0,18,0,,,,No
GT-66,06/03/2024,Season 3,Round 3,Race 3,Manufacturers Cup (Gr.1),Individual,,Circuit de Spa-Francorchamps - 24h Layout,Alex Hoyle,Porsche - 919 Hybrid 16,Gr.1,5,1,,,25,,,0,25,4,,,,Yes
GT-66,06/03/2024,Season 3,Round 3,Race 3,Manufacturers Cup (Gr.1),Individual,,Circuit de Spa-Francorchamps - 24h Layout,Conor Roberts,Audi - R8 LMS Evo 19,Gr.1,2,4,,,12,,,0,12,-2,,,,Yes
GT-66,06/03/2024,Season 3,Round 3,Race 3,Manufacturers Cup (Gr.1),Individual,,Circuit de Spa-Francorchamps - 24h Layout,Harry Richards,Toyota - TS050 - Hybrid 16,Gr.1,3,2,,,18,,,0,18,1,,,,Yes
GT-66,06/03/2024,Season 3,Round 3,Race 3,Manufacturers Cup (Gr.1),Individual,,Circuit de Spa-Francorchamps - 24h Layout,Joe McGhee,Audi - R8 LMS Evo 19,Gr.1,1,5,,,10,,,0,10,-4,,,,Yes
GT-66,06/03/2024,Season 3,Round 3,Race 3,Manufacturers Cup (Gr.1),Individual,,Circuit de Spa-Francorchamps - 24h Layout,Lawrence Parker,Peugeot - 908 HDi FAP 10,Gr.1,DNS,DNS,,,0,,,0,0,0,,,,Yes
GT-66,06/03/2024,Season 3,Round 3,Race 3,Manufacturers Cup (Gr.1),Individual,,Circuit de Spa-Francorchamps - 24h Layout,Liam England,Porsche - 919 Hybrid 16,Gr.1,4,3,FL,,15,,2,0,17,1,,,,Yes
GT-67,13/03/2024,Season 3,Round 4,Race 1,Manufacturers Cup (Gr.4),Individual,,Suzuka - Full Course,Alex Hoyle,Porsche - Cayman GT4 Clubsport 16,Gr.4,1,1,FL,,25,,2,0,27,0,,,,No
GT-67,13/03/2024,Season 3,Round 4,Race 1,Manufacturers Cup (Gr.4),Individual,,Suzuka - Full Course,Conor Roberts,Audi - TT Cup 16,Gr.4,4,2,,,18,,,0,18,2,,,,No
GT-67,13/03/2024,Season 3,Round 4,Race 1,Manufacturers Cup (Gr.4),Individual,,Suzuka - Full Course,Harry Richards,Toyota - GR Supra Race Car 19,Gr.4,6,6,,,8,,,0,8,0,,,,No
GT-67,13/03/2024,Season 3,Round 4,Race 1,Manufacturers Cup (Gr.4),Individual,,Suzuka - Full Course,Joe McGhee,Audi - TT Cup 16,Gr.4,5,3,,,15,,,0,15,2,,,,No
GT-67,13/03/2024,Season 3,Round 4,Race 1,Manufacturers Cup (Gr.4),Individual,,Suzuka - Full Course,Lawrence Parker,Peugeot - RCZ Gr.4,Gr.4,2,4,,,12,,,0,12,-2,,,,No
GT-67,13/03/2024,Season 3,Round 4,Race 1,Manufacturers Cup (Gr.4),Individual,,Suzuka - Full Course,Liam England,Porsche - Cayman GT4 Clubsport 16,Gr.4,3,5,,,10,,,0,10,-2,,,,No
GT-68,13/03/2024,Season 3,Round 4,Race 2,Manufacturers Cup (Gr.3),Individual,,Nürburgring - Grand Prix,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,1,1,FL,,25,,2,0,27,0,,,,No
GT-68,13/03/2024,Season 3,Round 4,Race 2,Manufacturers Cup (Gr.3),Individual,,Nürburgring - Grand Prix,Conor Roberts,Audi - R18 16,Gr.3,2,3,,,15,,,0,15,-1,,,,No
GT-68,13/03/2024,Season 3,Round 4,Race 2,Manufacturers Cup (Gr.3),Individual,,Nürburgring - Grand Prix,Harry Richards,Toyota - GR Supra Racing Concept 18,Gr.3,6,5,,,10,,,0,10,1,,,,No
GT-68,13/03/2024,Season 3,Round 4,Race 2,Manufacturers Cup (Gr.3),Individual,,Nürburgring - Grand Prix,Joe McGhee,Audi - R18 16,Gr.3,3,2,,,18,,,0,18,1,,,,No
GT-68,13/03/2024,Season 3,Round 4,Race 2,Manufacturers Cup (Gr.3),Individual,,Nürburgring - Grand Prix,Lawrence Parker,Peugeot - RCZ Gr.3,Gr.3,4,4,,,12,,,0,12,0,,,,No
GT-68,13/03/2024,Season 3,Round 4,Race 2,Manufacturers Cup (Gr.3),Individual,,Nürburgring - Grand Prix,Liam England,Porsche - 911 RSR (991) 17,Gr.3,5,6,,,8,,,0,8,-1,,,,No
GT-69,13/03/2024,Season 3,Round 4,Race 3,Manufacturers Cup (Gr.1),Individual,,Barcelona - Grand Prix Layout No Chicane,Alex Hoyle,Porsche - 919 Hybrid 16,Gr.1,6,1,FL,,25,,2,0,27,5,,,,Yes
GT-69,13/03/2024,Season 3,Round 4,Race 3,Manufacturers Cup (Gr.1),Individual,,Barcelona - Grand Prix Layout No Chicane,Conor Roberts,Audi - R8 LMS Evo 19,Gr.1,4,4,,,12,,,0,12,0,,,,Yes
GT-69,13/03/2024,Season 3,Round 4,Race 3,Manufacturers Cup (Gr.1),Individual,,Barcelona - Grand Prix Layout No Chicane,Harry Richards,Toyota - TS050 - Hybrid 16,Gr.1,2,6,,,8,,,0,8,-4,,,,Yes
GT-69,13/03/2024,Season 3,Round 4,Race 3,Manufacturers Cup (Gr.1),Individual,,Barcelona - Grand Prix Layout No Chicane,Joe McGhee,Audi - R8 LMS Evo 19,Gr.1,5,5,,,10,,,0,10,0,,,,Yes
GT-69,13/03/2024,Season 3,Round 4,Race 3,Manufacturers Cup (Gr.1),Individual,,Barcelona - Grand Prix Layout No Chicane,Lawrence Parker,Peugeot - 908 HDi FAP 10,Gr.1,3,3,,,15,,,0,15,0,,,,Yes
GT-69,13/03/2024,Season 3,Round 4,Race 3,Manufacturers Cup (Gr.1),Individual,,Barcelona - Grand Prix Layout No Chicane,Liam England,Porsche - 919 Hybrid 16,Gr.1,1,2,,,18,,,0,18,-1,,,,Yes
GT-70,20/03/2024,Season 3,Round 5,Race 1,Manufacturers Cup (Gr.4),Individual,,Blue Moon Bay - Infield A,Alex Hoyle,Porsche - Cayman GT4 Clubsport 16,Gr.4,1,1,FL,,25,,2,0,27,0,,,,No
GT-70,20/03/2024,Season 3,Round 5,Race 1,Manufacturers Cup (Gr.4),Individual,,Blue Moon Bay - Infield A,Conor Roberts,Audi - TT Cup 16,Gr.4,4,3,,,15,,,0,15,1,,,,No
GT-70,20/03/2024,Season 3,Round 5,Race 1,Manufacturers Cup (Gr.4),Individual,,Blue Moon Bay - Infield A,Harry Richards,Toyota - GR Supra Race Car 19,Gr.4,2,6,,,8,,,0,8,-4,,,,No
GT-70,20/03/2024,Season 3,Round 5,Race 1,Manufacturers Cup (Gr.4),Individual,,Blue Moon Bay - Infield A,Joe McGhee,Audi - TT Cup 16,Gr.4,3,4,,,12,,,0,12,-1,,,,No
GT-70,20/03/2024,Season 3,Round 5,Race 1,Manufacturers Cup (Gr.4),Individual,,Blue Moon Bay - Infield A,Lawrence Parker,Toyota - GR Supra Race Car 19,Gr.4,6,5,,,10,,,0,10,1,,,,No
GT-70,20/03/2024,Season 3,Round 5,Race 1,Manufacturers Cup (Gr.4),Individual,,Blue Moon Bay - Infield A,Liam England,Porsche - Cayman GT4 Clubsport 16,Gr.4,5,2,,,18,,,0,18,3,,,,No
GT-71,20/03/2024,Season 3,Round 5,Race 2,Manufacturers Cup (Gr.3),Individual,,Suzuka - Full Course,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,1,1,FL,,25,,2,0,27,0,,,,No
GT-71,20/03/2024,Season 3,Round 5,Race 2,Manufacturers Cup (Gr.3),Individual,,Suzuka - Full Course,Conor Roberts,Audi - R18 16,Gr.3,3,5,,,10,,,0,10,-2,,,,No
GT-71,20/03/2024,Season 3,Round 5,Race 2,Manufacturers Cup (Gr.3),Individual,,Suzuka - Full Course,Harry Richards,Toyota - GR Supra Racing Concept 18,Gr.3,6,4,,,12,,,0,12,2,,,,No
GT-71,20/03/2024,Season 3,Round 5,Race 2,Manufacturers Cup (Gr.3),Individual,,Suzuka - Full Course,Joe McGhee,Audi - R18 16,Gr.3,4,6,,,8,,,0,8,-2,,,,No
GT-71,20/03/2024,Season 3,Round 5,Race 2,Manufacturers Cup (Gr.3),Individual,,Suzuka - Full Course,Lawrence Parker,Toyota - GR Supra Racing Concept 18,Gr.3,5,3,,,15,,,0,15,2,,,,No
GT-71,20/03/2024,Season 3,Round 5,Race 2,Manufacturers Cup (Gr.3),Individual,,Suzuka - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,2,2,,,18,,,0,18,0,,,,No
GT-72,20/03/2024,Season 3,Round 5,Race 3,Manufacturers Cup (Gr.1),Individual,,Dragon Trail - Gardens,Alex Hoyle,Porsche - 919 Hybrid 16,Gr.1,6,1,FL,,25,,2,0,27,5,,,,Yes
GT-72,20/03/2024,Season 3,Round 5,Race 3,Manufacturers Cup (Gr.1),Individual,,Dragon Trail - Gardens,Conor Roberts,Audi - R8 LMS Evo 19,Gr.1,2,6,,,8,,,0,8,-4,,,,Yes
GT-72,20/03/2024,Season 3,Round 5,Race 3,Manufacturers Cup (Gr.1),Individual,,Dragon Trail - Gardens,Harry Richards,Toyota - TS050 - Hybrid 16,Gr.1,3,5,,,10,,,0,10,-2,,,,Yes
GT-72,20/03/2024,Season 3,Round 5,Race 3,Manufacturers Cup (Gr.1),Individual,,Dragon Trail - Gardens,Joe McGhee,Audi - R8 LMS Evo 19,Gr.1,1,4,,,12,,,0,12,-3,,,,Yes
GT-72,20/03/2024,Season 3,Round 5,Race 3,Manufacturers Cup (Gr.1),Individual,,Dragon Trail - Gardens,Lawrence Parker,Toyota - TS050 - Hybrid 16,Gr.1,4,2,,,18,,,0,18,2,,,,Yes
GT-72,20/03/2024,Season 3,Round 5,Race 3,Manufacturers Cup (Gr.1),Individual,,Dragon Trail - Gardens,Liam England,Porsche - 919 Hybrid 16,Gr.1,5,3,,,15,,,0,15,2,,,,Yes
GT-73,01/04/2024,Season 3,Round 6,Race 1,Manufacturers Cup (Gr.4),Individual,,Kyoto - Yamagiwa,Alex Hoyle,Porsche - Cayman GT4 Clubsport 16,Gr.4,3,1,FL,,25,,2,0,27,2,,,,No
GT-73,01/04/2024,Season 3,Round 6,Race 1,Manufacturers Cup (Gr.4),Individual,,Kyoto - Yamagiwa,Conor Roberts,Audi - TT Cup 16,Gr.4,5,4,,,12,,,0,12,1,,,,No
GT-73,01/04/2024,Season 3,Round 6,Race 1,Manufacturers Cup (Gr.4),Individual,,Kyoto - Yamagiwa,Harry Richards,Toyota - GR Supra Race Car 19,Gr.4,2,5,,,10,,,0,10,-3,,,,No
GT-73,01/04/2024,Season 3,Round 6,Race 1,Manufacturers Cup (Gr.4),Individual,,Kyoto - Yamagiwa,Joe McGhee,Audi - TT Cup 16,Gr.4,4,3,,,15,,,0,15,1,,,,No
GT-73,01/04/2024,Season 3,Round 6,Race 1,Manufacturers Cup (Gr.4),Individual,,Kyoto - Yamagiwa,Lawrence Parker,Toyota - GR Supra Race Car 19,Gr.4,6,6,,,8,,,0,8,0,,,,No
GT-73,01/04/2024,Season 3,Round 6,Race 1,Manufacturers Cup (Gr.4),Individual,,Kyoto - Yamagiwa,Liam England,Porsche - Cayman GT4 Clubsport 16,Gr.4,1,2,,,18,,,0,18,-1,,,,No
GT-74,01/04/2024,Season 3,Round 6,Race 2,Manufacturers Cup (Gr.3),Individual,,Red Bull Ring - Full Course,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,1,2,FL,,18,,2,0,20,-1,,,,No
GT-74,01/04/2024,Season 3,Round 6,Race 2,Manufacturers Cup (Gr.3),Individual,,Red Bull Ring - Full Course,Conor Roberts,Audi - R18 16,Gr.3,4,4,,,12,,,0,12,0,,,,No
GT-74,01/04/2024,Season 3,Round 6,Race 2,Manufacturers Cup (Gr.3),Individual,,Red Bull Ring - Full Course,Harry Richards,Toyota - GR Supra Racing Concept 18,Gr.3,5,1,,,25,,,0,25,4,,,,No
GT-74,01/04/2024,Season 3,Round 6,Race 2,Manufacturers Cup (Gr.3),Individual,,Red Bull Ring - Full Course,Joe McGhee,Audi - R18 16,Gr.3,3,6,,,8,,,0,8,-3,,,,No
GT-74,01/04/2024,Season 3,Round 6,Race 2,Manufacturers Cup (Gr.3),Individual,,Red Bull Ring - Full Course,Lawrence Parker,Toyota - GR Supra Racing Concept 18,Gr.3,6,3,,,15,,,0,15,3,,,,No
GT-74,01/04/2024,Season 3,Round 6,Race 2,Manufacturers Cup (Gr.3),Individual,,Red Bull Ring - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,2,5,,,10,,,0,10,-3,,,,No
GT-75,01/04/2024,Season 3,Round 6,Race 3,Manufacturers Cup (Gr.1),Individual,,Monza - Full Course,Alex Hoyle,Porsche - 919 Hybrid 16,Gr.1,5,1,FL,,25,,2,0,27,4,,,,Yes
GT-75,01/04/2024,Season 3,Round 6,Race 3,Manufacturers Cup (Gr.1),Individual,,Monza - Full Course,Conor Roberts,Audi - R8 LMS Evo 19,Gr.1,3,6,,,8,,,0,8,-3,,,,Yes
GT-75,01/04/2024,Season 3,Round 6,Race 3,Manufacturers Cup (Gr.1),Individual,,Monza - Full Course,Harry Richards,Toyota - TS050 - Hybrid 16,Gr.1,6,5,,,10,,,0,10,1,,,,Yes
GT-75,01/04/2024,Season 3,Round 6,Race 3,Manufacturers Cup (Gr.1),Individual,,Monza - Full Course,Joe McGhee,Audi - R8 LMS Evo 19,Gr.1,1,4,,,12,,,0,12,-3,,,,Yes
GT-75,01/04/2024,Season 3,Round 6,Race 3,Manufacturers Cup (Gr.1),Individual,,Monza - Full Course,Lawrence Parker,Toyota - TS050 - Hybrid 16,Gr.1,4,3,,,15,,,0,15,1,,,,Yes
GT-75,01/04/2024,Season 3,Round 6,Race 3,Manufacturers Cup (Gr.1),Individual,,Monza - Full Course,Liam England,Porsche - 919 Hybrid 16,Gr.1,2,2,,,18,,,0,18,0,,,,Yes
GT-76,04/04/2024,Season 3,Round 7,Race 1,Manufacturers Cup (Gr.4),Individual,,Sardegna - Layout C,Alex Hoyle,Porsche - Cayman GT4 Clubsport 16,Gr.4,1,1,,,25,,,0,25,0,,,,No
GT-76,04/04/2024,Season 3,Round 7,Race 1,Manufacturers Cup (Gr.4),Individual,,Sardegna - Layout C,Conor Roberts,Audi - TT Cup 16,Gr.4,6,5,,,10,,,0,10,1,,,,No
GT-76,04/04/2024,Season 3,Round 7,Race 1,Manufacturers Cup (Gr.4),Individual,,Sardegna - Layout C,Harry Richards,Toyota - GR Supra Race Car 19,Gr.4,5,6,,,8,,,0,8,-1,,,,No
GT-76,04/04/2024,Season 3,Round 7,Race 1,Manufacturers Cup (Gr.4),Individual,,Sardegna - Layout C,Joe McGhee,Audi - TT Cup 16,Gr.4,4,4,,,12,,,0,12,0,,,,No
GT-76,04/04/2024,Season 3,Round 7,Race 1,Manufacturers Cup (Gr.4),Individual,,Sardegna - Layout C,Lawrence Parker,Toyota - GR Supra Race Car 19,Gr.4,3,3,,,15,,,0,15,0,,,,No
GT-76,04/04/2024,Season 3,Round 7,Race 1,Manufacturers Cup (Gr.4),Individual,,Sardegna - Layout C,Liam England,Porsche - Cayman GT4 Clubsport 16,Gr.4,2,2,FL,,18,,2,0,20,0,,,,No
GT-77,04/04/2024,Season 3,Round 7,Race 2,Manufacturers Cup (Gr.3),Individual,,Dragon Trail - Gardens,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,1,3,,,15,,,0,15,-2,,,,No
GT-77,04/04/2024,Season 3,Round 7,Race 2,Manufacturers Cup (Gr.3),Individual,,Dragon Trail - Gardens,Conor Roberts,Audi - R18 16,Gr.3,5,2,,,18,,,0,18,3,,,,No
GT-77,04/04/2024,Season 3,Round 7,Race 2,Manufacturers Cup (Gr.3),Individual,,Dragon Trail - Gardens,Harry Richards,Toyota - GR Supra Racing Concept 18,Gr.3,6,6,,,8,,,0,8,0,,,,No
GT-77,04/04/2024,Season 3,Round 7,Race 2,Manufacturers Cup (Gr.3),Individual,,Dragon Trail - Gardens,Joe McGhee,Audi - R18 16,Gr.3,4,1,,,25,,,0,25,3,,,,No
GT-77,04/04/2024,Season 3,Round 7,Race 2,Manufacturers Cup (Gr.3),Individual,,Dragon Trail - Gardens,Lawrence Parker,Toyota - GR Supra Racing Concept 18,Gr.3,3,5,FL,,10,,2,0,12,-2,,,,No
GT-77,04/04/2024,Season 3,Round 7,Race 2,Manufacturers Cup (Gr.3),Individual,,Dragon Trail - Gardens,Liam England,Porsche - 911 RSR (991) 17,Gr.3,2,4,,,12,,,0,12,-2,,,,No
GT-78,04/04/2024,Season 3,Round 7,Race 3,Manufacturers Cup (Gr.1),Individual,,Sainte-Croix - Layout B,Alex Hoyle,Porsche - 919 Hybrid 16,Gr.1,4,5,,,10,,,0,10,-1,,,,Yes
GT-78,04/04/2024,Season 3,Round 7,Race 3,Manufacturers Cup (Gr.1),Individual,,Sainte-Croix - Layout B,Conor Roberts,Audi - R8 LMS Evo 19,Gr.1,5,6,,,8,,,0,8,-1,,,,Yes
GT-78,04/04/2024,Season 3,Round 7,Race 3,Manufacturers Cup (Gr.1),Individual,,Sainte-Croix - Layout B,Harry Richards,Toyota - TS050 - Hybrid 16,Gr.1,1,4,,,12,,,0,12,-3,,,,Yes
GT-78,04/04/2024,Season 3,Round 7,Race 3,Manufacturers Cup (Gr.1),Individual,,Sainte-Croix - Layout B,Joe McGhee,Audi - R8 LMS Evo 19,Gr.1,6,3,,,15,,,0,15,3,,,,Yes
GT-78,04/04/2024,Season 3,Round 7,Race 3,Manufacturers Cup (Gr.1),Individual,,Sainte-Croix - Layout B,Lawrence Parker,Toyota - TS050 - Hybrid 16,Gr.1,2,2,,,18,,,0,18,0,,,,Yes
GT-78,04/04/2024,Season 3,Round 7,Race 3,Manufacturers Cup (Gr.1),Individual,,Sainte-Croix - Layout B,Liam England,Porsche - 919 Hybrid 16,Gr.1,3,1,FL,,25,,2,0,27,2,,,,Yes
GT-79,10/04/2024,Season 3,Round 8,Race 1,Manufacturers Cup (Gr.4),Individual,,Lago Maggiore - East End,Alex Hoyle,Porsche - Cayman GT4 Clubsport 16,Gr.4,1,1,FL,,25,,2,0,27,0,,,,No
GT-79,10/04/2024,Season 3,Round 8,Race 1,Manufacturers Cup (Gr.4),Individual,,Lago Maggiore - East End,Conor Roberts,,Gr.4,DNS,DNS,,,0,,,0,0,0,,,,No
GT-79,10/04/2024,Season 3,Round 8,Race 1,Manufacturers Cup (Gr.4),Individual,,Lago Maggiore - East End,Harry Richards,Toyota - GR Supra Race Car 19,Gr.4,5,5,,,10,,,0,10,0,,,,No
GT-79,10/04/2024,Season 3,Round 8,Race 1,Manufacturers Cup (Gr.4),Individual,,Lago Maggiore - East End,Joe McGhee,Audi - TT Cup 16,Gr.4,3,3,,,15,,,0,15,0,,,,No
GT-79,10/04/2024,Season 3,Round 8,Race 1,Manufacturers Cup (Gr.4),Individual,,Lago Maggiore - East End,Lawrence Parker,Toyota - GR Supra Race Car 19,Gr.4,4,4,,,12,,,0,12,0,,,,No
GT-79,10/04/2024,Season 3,Round 8,Race 1,Manufacturers Cup (Gr.4),Individual,,Lago Maggiore - East End,Liam England,Porsche - Cayman GT4 Clubsport 16,Gr.4,2,2,,,18,,,0,18,0,,,,No
GT-80,10/04/2024,Season 3,Round 8,Race 2,Manufacturers Cup (Gr.3),Individual,,Tokyo - East Clockwise,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,1,3,,,15,,,0,15,-2,,,,No
GT-80,10/04/2024,Season 3,Round 8,Race 2,Manufacturers Cup (Gr.3),Individual,,Tokyo - East Clockwise,Conor Roberts,,Gr.3,DNS,DNS,,,0,,,0,0,0,,,,No
GT-80,10/04/2024,Season 3,Round 8,Race 2,Manufacturers Cup (Gr.3),Individual,,Tokyo - East Clockwise,Harry Richards,Toyota - GR Supra Racing Concept 18,Gr.3,5,5,,,10,,,0,10,0,,,,No
GT-80,10/04/2024,Season 3,Round 8,Race 2,Manufacturers Cup (Gr.3),Individual,,Tokyo - East Clockwise,Joe McGhee,Audi - R18 16,Gr.3,3,1,FL,,25,,2,0,27,2,,,,No
GT-80,10/04/2024,Season 3,Round 8,Race 2,Manufacturers Cup (Gr.3),Individual,,Tokyo - East Clockwise,Lawrence Parker,Toyota - GR Supra Racing Concept 18,Gr.3,4,4,,,12,,,0,12,0,,,,No
GT-80,10/04/2024,Season 3,Round 8,Race 2,Manufacturers Cup (Gr.3),Individual,,Tokyo - East Clockwise,Liam England,Porsche - 911 RSR (991) 17,Gr.3,2,2,,,18,,,0,18,0,,,,No
GT-81,10/04/2024,Season 3,Round 8,Race 3,Manufacturers Cup (Gr.1),Individual,,Trial Mountain - Full Course,Alex Hoyle,Porsche - 919 Hybrid 16,Gr.1,3,1,FL,,25,,2,0,27,2,,,,Yes
GT-81,10/04/2024,Season 3,Round 8,Race 3,Manufacturers Cup (Gr.1),Individual,,Trial Mountain - Full Course,Conor Roberts,,Gr.1,DNS,DNS,,,0,,,0,0,0,,,,Yes
GT-81,10/04/2024,Season 3,Round 8,Race 3,Manufacturers Cup (Gr.1),Individual,,Trial Mountain - Full Course,Harry Richards,Toyota - TS050 - Hybrid 16,Gr.1,1,4,,,12,,,0,12,-3,,,,Yes
GT-81,10/04/2024,Season 3,Round 8,Race 3,Manufacturers Cup (Gr.1),Individual,,Trial Mountain - Full Course,Joe McGhee,Audi - R8 LMS Evo 19,Gr.1,5,5,,,10,,,0,10,0,,,,Yes
GT-81,10/04/2024,Season 3,Round 8,Race 3,Manufacturers Cup (Gr.1),Individual,,Trial Mountain - Full Course,Lawrence Parker,Toyota - TS050 - Hybrid 16,Gr.1,2,3,,,15,,,0,15,-1,,,,Yes
GT-81,10/04/2024,Season 3,Round 8,Race 3,Manufacturers Cup (Gr.1),Individual,,Trial Mountain - Full Course,Liam England,Porsche - 919 Hybrid 16,Gr.1,4,2,,,18,,,0,18,2,,,,Yes
GT-82,17/04/2024,Season 3,Round 9,Race 1,Manufacturers Cup (Gr.4),Individual,,Tsukuba - Full Course,Alex Hoyle,Porsche - Cayman GT4 Clubsport 16,Gr.4,1,1,FL,,25,,2,0,27,0,,,,No
GT-82,17/04/2024,Season 3,Round 9,Race 1,Manufacturers Cup (Gr.4),Individual,,Tsukuba - Full Course,Conor Roberts,Audi - TT Cup 16,Gr.4,3,5,,,10,,,0,10,-2,,,,No
GT-82,17/04/2024,Season 3,Round 9,Race 1,Manufacturers Cup (Gr.4),Individual,,Tsukuba - Full Course,Harry Richards,Toyota - GR Supra Race Car 19,Gr.4,4,6,,,8,,,0,8,-2,,,,No
GT-82,17/04/2024,Season 3,Round 9,Race 1,Manufacturers Cup (Gr.4),Individual,,Tsukuba - Full Course,Joe McGhee,Audi - TT Cup 16,Gr.4,5,4,,,12,,,0,12,1,,,,No
GT-82,17/04/2024,Season 3,Round 9,Race 1,Manufacturers Cup (Gr.4),Individual,,Tsukuba - Full Course,Lawrence Parker,Toyota - GR Supra Race Car 19,Gr.4,2,2,,,18,,,0,18,0,,,,No
GT-82,17/04/2024,Season 3,Round 9,Race 1,Manufacturers Cup (Gr.4),Individual,,Tsukuba - Full Course,Liam England,Porsche - Cayman GT4 Clubsport 16,Gr.4,6,3,,,15,,,0,15,3,,,,No
GT-83,17/04/2024,Season 3,Round 9,Race 2,Manufacturers Cup (Gr.3),Individual,,Circuit de Spa-Francorchamps - Full Course,Alex Hoyle,Porsche - 911 RSR (991) 17,Gr.3,1,1,FL,,25,,2,0,27,0,,,,No
GT-83,17/04/2024,Season 3,Round 9,Race 2,Manufacturers Cup (Gr.3),Individual,,Circuit de Spa-Francorchamps - Full Course,Conor Roberts,Audi - R18 16,Gr.3,5,5,,,10,,,0,10,0,,,,No
GT-83,17/04/2024,Season 3,Round 9,Race 2,Manufacturers Cup (Gr.3),Individual,,Circuit de Spa-Francorchamps - Full Course,Harry Richards,Toyota - GR Supra Racing Concept 18,Gr.3,6,6,,,8,,,0,8,0,,,,No
GT-83,17/04/2024,Season 3,Round 9,Race 2,Manufacturers Cup (Gr.3),Individual,,Circuit de Spa-Francorchamps - Full Course,Joe McGhee,Audi - R18 16,Gr.3,4,4,,,12,,,0,12,0,,,,No
GT-83,17/04/2024,Season 3,Round 9,Race 2,Manufacturers Cup (Gr.3),Individual,,Circuit de Spa-Francorchamps - Full Course,Lawrence Parker,Toyota - GR Supra Racing Concept 18,Gr.3,2,2,,,18,,,0,18,0,,,,No
GT-83,17/04/2024,Season 3,Round 9,Race 2,Manufacturers Cup (Gr.3),Individual,,Circuit de Spa-Francorchamps - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,3,3,,,15,,,0,15,0,,,,No
GT-84,17/04/2024,Season 3,Round 9,Race 3,Manufacturers Cup (Gr.1),Individual,,Dragon Trail - Seaside,Alex Hoyle,Toyota - TS050 - Hybrid 16,Gr.1,6,1,FL,,25,,2,0,27,5,,,,Yes
GT-84,17/04/2024,Season 3,Round 9,Race 3,Manufacturers Cup (Gr.1),Individual,,Dragon Trail - Seaside,Conor Roberts,Audi - R8 LMS Evo 19,Gr.1,2,5,,,10,,,0,10,-3,,,,Yes
GT-84,17/04/2024,Season 3,Round 9,Race 3,Manufacturers Cup (Gr.1),Individual,,Dragon Trail - Seaside,Harry Richards,Toyota - TS050 - Hybrid 16,Gr.1,1,6,,,8,,,0,8,-5,,,,Yes
GT-84,17/04/2024,Season 3,Round 9,Race 3,Manufacturers Cup (Gr.1),Individual,,Dragon Trail - Seaside,Joe McGhee,Audi - R8 LMS Evo 19,Gr.1,3,4,,,12,,,0,12,-1,,,,Yes
GT-84,17/04/2024,Season 3,Round 9,Race 3,Manufacturers Cup (Gr.1),Individual,,Dragon Trail - Seaside,Lawrence Parker,Toyota - TS050 - Hybrid 16,Gr.1,5,2,,,18,,,0,18,3,,,,Yes
GT-84,17/04/2024,Season 3,Round 9,Race 3,Manufacturers Cup (Gr.1),Individual,,Dragon Trail - Seaside,Liam England,Porsche - 919 Hybrid 16,Gr.1,4,3,,,15,,,0,15,1,,,,Yes
GT-85,24/04/2024,Season 3,Round 10,Race 1,Manufacturers Cup (Gr.4),Individual,,Road Atlanta - Full Course,Alex Hoyle,,Gr.4,DNS,DNS,,,0,,,0,0,0,,,,No
GT-85,24/04/2024,Season 3,Round 10,Race 1,Manufacturers Cup (Gr.4),Individual,,Road Atlanta - Full Course,Conor Roberts,Audi - TT Cup 16,Gr.4,5,2,,,18,,,0,18,3,,,,No
GT-85,24/04/2024,Season 3,Round 10,Race 1,Manufacturers Cup (Gr.4),Individual,,Road Atlanta - Full Course,Harry Richards,Toyota - GR Supra Race Car 19,Gr.4,2,4,,,12,,,0,12,-2,,,,No
GT-85,24/04/2024,Season 3,Round 10,Race 1,Manufacturers Cup (Gr.4),Individual,,Road Atlanta - Full Course,Joe McGhee,Audi - TT Cup 16,Gr.4,3,1,FL,,25,,2,0,27,2,,,,No
GT-85,24/04/2024,Season 3,Round 10,Race 1,Manufacturers Cup (Gr.4),Individual,,Road Atlanta - Full Course,Lawrence Parker,Toyota - GR Supra Race Car 19,Gr.4,1,5,,,10,,,0,10,-4,,,,No
GT-85,24/04/2024,Season 3,Round 10,Race 1,Manufacturers Cup (Gr.4),Individual,,Road Atlanta - Full Course,Liam England,Porsche - Cayman GT4 Clubsport 16,Gr.4,4,3,,,15,,,0,15,1,,,,No
GT-86,24/04/2024,Season 3,Round 10,Race 2,Manufacturers Cup (Gr.3),Individual,,Le Mans - Full Course,Alex Hoyle,,Gr.3,DNS,DNS,,,0,,,0,0,0,,,,No
GT-86,24/04/2024,Season 3,Round 10,Race 2,Manufacturers Cup (Gr.3),Individual,,Le Mans - Full Course,Conor Roberts,Audi - R18 16,Gr.3,2,5,,,10,,,0,10,-3,,,,No
GT-86,24/04/2024,Season 3,Round 10,Race 2,Manufacturers Cup (Gr.3),Individual,,Le Mans - Full Course,Harry Richards,Toyota - GR Supra Racing Concept 18,Gr.3,4,4,,,12,,,0,12,0,,,,No
GT-86,24/04/2024,Season 3,Round 10,Race 2,Manufacturers Cup (Gr.3),Individual,,Le Mans - Full Course,Joe McGhee,Audi - R18 16,Gr.3,1,2,,,18,,,0,18,-1,,,,No
GT-86,24/04/2024,Season 3,Round 10,Race 2,Manufacturers Cup (Gr.3),Individual,,Le Mans - Full Course,Lawrence Parker,Toyota - GR Supra Racing Concept 18,Gr.3,5,1,,,25,,,0,25,4,,,,No
GT-86,24/04/2024,Season 3,Round 10,Race 2,Manufacturers Cup (Gr.3),Individual,,Le Mans - Full Course,Liam England,Porsche - 911 RSR (991) 17,Gr.3,3,3,FL,,15,,2,0,17,0,,,,No
GT-87,24/04/2024,Season 3,Round 10,Race 3,Manufacturers Cup (Gr.1),Individual,,Watkins Glen - Long Course,Alex Hoyle,,Gr.1,DNS,DNS,,,0,,,0,0,0,,,,Yes
GT-87,24/04/2024,Season 3,Round 10,Race 3,Manufacturers Cup (Gr.1),Individual,,Watkins Glen - Long Course,Conor Roberts,Audi - R8 LMS Evo 19,Gr.1,1,4,,,12,,,0,12,-3,,,,Yes
GT-87,24/04/2024,Season 3,Round 10,Race 3,Manufacturers Cup (Gr.1),Individual,,Watkins Glen - Long Course,Harry Richards,Toyota - TS050 - Hybrid 16,Gr.1,2,5,,,10,,,0,10,-3,,,,Yes
GT-87,24/04/2024,Season 3,Round 10,Race 3,Manufacturers Cup (Gr.1),Individual,,Watkins Glen - Long Course,Joe McGhee,Audi - R8 LMS Evo 19,Gr.1,4,3,,,15,,,0,15,1,,,,Yes
GT-87,24/04/2024,Season 3,Round 10,Race 3,Manufacturers Cup (Gr.1),Individual,,Watkins Glen - Long Course,Lawrence Parker,Toyota - TS050 - Hybrid 16,Gr.1,5,2,,,18,,,0,18,3,,,,Yes
GT-87,24/04/2024,Season 3,Round 10,Race 3,Manufacturers Cup (Gr.1),Individual,,Watkins Glen - Long Course,Liam England,Porsche - 919 Hybrid 16,Gr.1,3,1,FL,,25,,2,0,27,2,,,,Yes
GT-88,01/05/2024,Season 4,Round 1,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Laguna Seca - Full Course,Alex Hoyle,Mazda - Roadster Touring Car,Road,1,1,FL,,25,6,1,0,32,0,1:30:566,1:29:716,,No
GT-88,01/05/2024,Season 4,Round 1,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Laguna Seca - Full Course,Conor Roberts,Mazda - Roadster Touring Car,Road,5,3,,,15,2,,0,17,2,1:32:533,1:32:313,,No
GT-88,01/05/2024,Season 4,Round 1,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Laguna Seca - Full Course,Harry Richards,Mazda - Roadster Touring Car,Road,4,6,,,8,3,,0,11,-2,1:31:840,1:31:541,,No
GT-88,01/05/2024,Season 4,Round 1,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Laguna Seca - Full Course,Joe McGhee,Mazda - Roadster Touring Car,Road,3,4,,,12,4,,0,16,-1,1:31:803,1:31:609,,No
GT-88,01/05/2024,Season 4,Round 1,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Laguna Seca - Full Course,Lawrence Parker,Mazda - Roadster Touring Car,Road,2,2,,,18,5,,0,23,0,1:31:530,1:31:129,,No
GT-88,01/05/2024,Season 4,Round 1,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Laguna Seca - Full Course,Liam England,Mazda - Roadster Touring Car,Road,6,5,,,10,1,,0,11,1,1:32:628,1:31:318,,No
GT-89,01/05/2024,Season 4,Round 1,Race 2,Lamborghini GT3 Cup,Individual,,Suzuka - Full Course,Alex Hoyle,Lamborghini - Huracán GT3 15,Gr.3,5,DNF,,,0,2,,0,2,0,2:00:404,0:00:000,,No
GT-89,01/05/2024,Season 4,Round 1,Race 2,Lamborghini GT3 Cup,Individual,,Suzuka - Full Course,Conor Roberts,Lamborghini - Huracán GT3 15,Gr.3,4,3,,,15,3,,0,18,1,2:00:085,5:01:028,,No
GT-89,01/05/2024,Season 4,Round 1,Race 2,Lamborghini GT3 Cup,Individual,,Suzuka - Full Course,Harry Richards,Lamborghini - Huracán GT3 15,Gr.3,3,2,,,18,4,,0,22,1,1:58:995,1:59:048,,No
GT-89,01/05/2024,Season 4,Round 1,Race 2,Lamborghini GT3 Cup,Individual,,Suzuka - Full Course,Joe McGhee,Lamborghini - Huracán GT3 15,Gr.3,2,1,FL,,25,5,1,0,31,1,1:57:716,1:58:352,,No
GT-89,01/05/2024,Season 4,Round 1,Race 2,Lamborghini GT3 Cup,Individual,,Suzuka - Full Course,Lawrence Parker,Lamborghini - Huracán GT3 15,Gr.3,1,DNF,,,0,6,,0,6,0,1:57:314,1:59:671,,No
GT-89,01/05/2024,Season 4,Round 1,Race 2,Lamborghini GT3 Cup,Individual,,Suzuka - Full Course,Liam England,Lamborghini - Huracán GT3 15,Gr.3,6,4,,,12,1,,0,13,2,2:00:746,2:01:826,,No
GT-90,01/05/2024,Season 4,Round 1,Race 3,Formula 1500T-A Championship,Individual,,Red Bull Ring - Full Course,Alex Hoyle,Gran Turismo - F1500T-A,Formula,6,5,,,10,1,,0,11,1,1:16:131,1:15:833,,No
GT-90,01/05/2024,Season 4,Round 1,Race 3,Formula 1500T-A Championship,Individual,,Red Bull Ring - Full Course,Conor Roberts,Gran Turismo - F1500T-A,Formula,3,4,,,12,4,,0,16,-1,1:15:714,1:15:196,,No
GT-90,01/05/2024,Season 4,Round 1,Race 3,Formula 1500T-A Championship,Individual,,Red Bull Ring - Full Course,Harry Richards,Gran Turismo - F1500T-A,Formula,4,3,,,15,3,,0,18,1,1:15:772,1:15:124,,No
GT-90,01/05/2024,Season 4,Round 1,Race 3,Formula 1500T-A Championship,Individual,,Red Bull Ring - Full Course,Joe McGhee,Gran Turismo - F1500T-A,Formula,5,6,,,8,2,,0,10,-1,1:16:030,1:17:795,,No
GT-90,01/05/2024,Season 4,Round 1,Race 3,Formula 1500T-A Championship,Individual,,Red Bull Ring - Full Course,Lawrence Parker,Gran Turismo - F1500T-A,Formula,1,2,FL,,18,6,1,0,25,-1,1:14:299,1:14:089,,No
GT-90,01/05/2024,Season 4,Round 1,Race 3,Formula 1500T-A Championship,Individual,,Red Bull Ring - Full Course,Liam England,Gran Turismo - F1500T-A,Formula,2,1,,,25,5,,0,30,1,1:15:511,1:14:985,,No
GT-91,16/05/2024,Season 4,Round 2,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Brands Hatch - Indy Circuit,Alex Hoyle,Mazda - Roadster Touring Car,Road,1,1,FL,,25,6,1,0,32,0,,0:47:854,,No
GT-91,16/05/2024,Season 4,Round 2,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Brands Hatch - Indy Circuit,Conor Roberts,Mazda - Roadster Touring Car,Road,6,5,,,10,1,,0,11,1,,0:48:538,,No
GT-91,16/05/2024,Season 4,Round 2,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Brands Hatch - Indy Circuit,Harry Richards,Mazda - Roadster Touring Car,Road,3,2,,,18,4,,0,22,1,,0:48:373,,No
GT-91,16/05/2024,Season 4,Round 2,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Brands Hatch - Indy Circuit,Joe McGhee,Mazda - Roadster Touring Car,Road,4,4,,,12,3,,0,15,0,,0:48:988,,No
GT-91,16/05/2024,Season 4,Round 2,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Brands Hatch - Indy Circuit,Lawrence Parker,Mazda - Roadster Touring Car,Road,2,6,,,8,5,,0,13,-4,,0:48:408,,No
GT-91,16/05/2024,Season 4,Round 2,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Brands Hatch - Indy Circuit,Liam England,Mazda - Roadster Touring Car,Road,5,3,,,15,2,,0,17,2,,0:49:305,,No
GT-92,16/05/2024,Season 4,Round 2,Race 2,Lamborghini GT3 Cup,Individual,,Nürburgring - Grand Prix,Alex Hoyle,Lamborghini - Huracán GT3 15,Gr.3,1,1,FL,,25,6,1,0,32,0,,1:53:994,,No
GT-92,16/05/2024,Season 4,Round 2,Race 2,Lamborghini GT3 Cup,Individual,,Nürburgring - Grand Prix,Conor Roberts,Lamborghini - Huracán GT3 15,Gr.3,6,6,,,8,1,,0,9,0,,1:56:021,,No
GT-92,16/05/2024,Season 4,Round 2,Race 2,Lamborghini GT3 Cup,Individual,,Nürburgring - Grand Prix,Harry Richards,Lamborghini - Huracán GT3 15,Gr.3,5,4,,1,12,2,,-10,4,1,,1:56:473,,No
GT-92,16/05/2024,Season 4,Round 2,Race 2,Lamborghini GT3 Cup,Individual,,Nürburgring - Grand Prix,Joe McGhee,Lamborghini - Huracán GT3 15,Gr.3,3,3,,,15,4,,0,19,0,,1:55:189,,No
GT-92,16/05/2024,Season 4,Round 2,Race 2,Lamborghini GT3 Cup,Individual,,Nürburgring - Grand Prix,Lawrence Parker,Lamborghini - Huracán GT3 15,Gr.3,2,5,,,10,5,,0,15,-3,,1:54:892,,No
GT-92,16/05/2024,Season 4,Round 2,Race 2,Lamborghini GT3 Cup,Individual,,Nürburgring - Grand Prix,Liam England,Lamborghini - Huracán GT3 15,Gr.3,4,2,,,18,3,,0,21,2,,1:55:202,,No
GT-93,16/05/2024,Season 4,Round 2,Race 3,Formula 1500T-A Championship,Individual,,Tsukuba - Full Course,Alex Hoyle,Gran Turismo - F1500T-A,Formula,3,2,,2,18,4,,-20,2,1,0:47:812,,,No
GT-93,16/05/2024,Season 4,Round 2,Race 3,Formula 1500T-A Championship,Individual,,Tsukuba - Full Course,Conor Roberts,Gran Turismo - F1500T-A,Formula,5,5,,,10,2,,0,12,0,0:48:328,,,No
GT-93,16/05/2024,Season 4,Round 2,Race 3,Formula 1500T-A Championship,Individual,,Tsukuba - Full Course,Harry Richards,Gran Turismo - F1500T-A,Formula,6,6,,,8,1,,0,9,0,0:48:497,,,No
GT-93,16/05/2024,Season 4,Round 2,Race 3,Formula 1500T-A Championship,Individual,,Tsukuba - Full Course,Joe McGhee,Gran Turismo - F1500T-A,Formula,2,1,,,25,5,,0,30,1,0:47:646,,,No
GT-93,16/05/2024,Season 4,Round 2,Race 3,Formula 1500T-A Championship,Individual,,Tsukuba - Full Course,Lawrence Parker,Gran Turismo - F1500T-A,Formula,4,3,FL,,15,3,1,0,19,1,0:48:251,,,No
GT-93,16/05/2024,Season 4,Round 2,Race 3,Formula 1500T-A Championship,Individual,,Tsukuba - Full Course,Liam England,Gran Turismo - F1500T-A,Formula,1,4,,,12,6,,0,18,-3,0:47:293,,,No
GT-94,24/05/2024,Season 4,Round 3,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Tokyo - South Counterclockwise,Alex Hoyle,Mazda - Roadster Touring Car,Road,4,2,,,18,3,,0,21,2,2:14:178,2:12:439,,No
GT-94,24/05/2024,Season 4,Round 3,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Tokyo - South Counterclockwise,Conor Roberts,Mazda - Roadster Touring Car,Road,3,4,,,12,4,,0,16,-1,2:14:155,2:12:628,,No
GT-94,24/05/2024,Season 4,Round 3,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Tokyo - South Counterclockwise,Harry Richards,Mazda - Roadster Touring Car,Road,2,6,,,8,5,,0,13,-4,2:14:056,2:13:717,,No
GT-94,24/05/2024,Season 4,Round 3,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Tokyo - South Counterclockwise,Joe McGhee,Mazda - Roadster Touring Car,Road,4,3,,,15,3,,0,18,1,2:14:690,2:13:511,,No
GT-94,24/05/2024,Season 4,Round 3,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Tokyo - South Counterclockwise,Lawrence Parker,Mazda - Roadster Touring Car,Road,1,1,FL,,25,6,1,0,32,0,2:12:312,2:12:245,,No
GT-94,24/05/2024,Season 4,Round 3,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Tokyo - South Counterclockwise,Liam England,Mazda - Roadster Touring Car,Road,5,5,,,10,2,,0,12,0,2:15:086,2:13:646,,No
GT-95,24/05/2024,Season 4,Round 3,Race 2,Lamborghini GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Alex Hoyle,Lamborghini - Huracán GT3 15,Gr.3,1,4,FL,2,12,6,1,-20,0,-3,1:43:520,1:43:185,,No
GT-95,24/05/2024,Season 4,Round 3,Race 2,Lamborghini GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Conor Roberts,Lamborghini - Huracán GT3 15,Gr.3,6,6,,,8,1,,0,9,0,1:51:957,1:46:418,,No
GT-95,24/05/2024,Season 4,Round 3,Race 2,Lamborghini GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Harry Richards,Lamborghini - Huracán GT3 15,Gr.3,3,3,,,15,4,,0,19,0,1:44:102,1:44:612,,No
GT-95,24/05/2024,Season 4,Round 3,Race 2,Lamborghini GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Joe McGhee,Lamborghini - Huracán GT3 15,Gr.3,4,2,,,18,3,,0,21,2,1:45:383,1:43:714,,No
GT-95,24/05/2024,Season 4,Round 3,Race 2,Lamborghini GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Lawrence Parker,Lamborghini - Huracán GT3 15,Gr.3,2,1,,,25,5,,0,30,1,1:43:841,1:45:654,,No
GT-95,24/05/2024,Season 4,Round 3,Race 2,Lamborghini GT3 Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Liam England,Lamborghini - Huracán GT3 15,Gr.3,5,5,,,10,2,,0,12,0,1:45:998,1:43:714,,No
GT-96,24/05/2024,Season 4,Round 3,Race 3,Formula 1500T-A Championship,Individual,,Road Atlanta - Full Course,Alex Hoyle,Gran Turismo - F1500T-A,Formula,5,6,,,8,2,,0,10,-1,1:06:093,1:05:534,,No
GT-96,24/05/2024,Season 4,Round 3,Race 3,Formula 1500T-A Championship,Individual,,Road Atlanta - Full Course,Conor Roberts,Gran Turismo - F1500T-A,Formula,6,4,,,12,1,,0,13,2,1:09:208,1:07:368,,No
GT-96,24/05/2024,Season 4,Round 3,Race 3,Formula 1500T-A Championship,Individual,,Road Atlanta - Full Course,Harry Richards,Gran Turismo - F1500T-A,Formula,1,3,,,15,6,,0,21,-2,1:05:828,1:06:366,,No
GT-96,24/05/2024,Season 4,Round 3,Race 3,Formula 1500T-A Championship,Individual,,Road Atlanta - Full Course,Joe McGhee,Gran Turismo - F1500T-A,Formula,4,2,,,18,3,,0,21,2,1:06:006,1:05:831,,No
GT-96,24/05/2024,Season 4,Round 3,Race 3,Formula 1500T-A Championship,Individual,,Road Atlanta - Full Course,Lawrence Parker,Gran Turismo - F1500T-A,Formula,3,1,FL,,25,4,1,0,30,2,1:05:830,1:05:154,,No
GT-96,24/05/2024,Season 4,Round 3,Race 3,Formula 1500T-A Championship,Individual,,Road Atlanta - Full Course,Liam England,Gran Turismo - F1500T-A,Formula,1,5,,,10,6,,0,16,-4,1:05:828,1:06:335,,No
GT-97,29/05/2024,Season 4,Round 4,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Tsukuba - Full Course,Alex Hoyle,Mazda - Roadster Touring Car,Road,2,1,FL,,25,5,1,0,31,1,0:58:265,0:57:834,,No
GT-97,29/05/2024,Season 4,Round 4,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Tsukuba - Full Course,Conor Roberts,Mazda - Roadster Touring Car,Road,5,5,,,10,2,,0,12,0,0:59:193,0:58:855,,No
GT-97,29/05/2024,Season 4,Round 4,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Tsukuba - Full Course,Harry Richards,Mazda - Roadster Touring Car,Road,6,6,,,8,1,,0,9,0,0:59:383,0:58:911,,No
GT-97,29/05/2024,Season 4,Round 4,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Tsukuba - Full Course,Joe McGhee,Mazda - Roadster Touring Car,Road,3,2,,,18,4,,0,22,1,0:58:674,0:58:670,,No
GT-97,29/05/2024,Season 4,Round 4,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Tsukuba - Full Course,Lawrence Parker,Mazda - Roadster Touring Car,Road,1,3,,,15,6,,0,21,-2,0:58:077,0:58:162,,No
GT-97,29/05/2024,Season 4,Round 4,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Tsukuba - Full Course,Liam England,Mazda - Roadster Touring Car,Road,4,4,,,12,3,,0,15,0,0:58:840,0:58:855,,No
GT-98,29/05/2024,Season 4,Round 4,Race 2,Lamborghini GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Alex Hoyle,Lamborghini - Huracán GT3 15,Gr.3,1,1,,,25,6,,0,31,0,,2:26:886,Dry/Wet,No
GT-98,29/05/2024,Season 4,Round 4,Race 2,Lamborghini GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Conor Roberts,Lamborghini - Huracán GT3 15,Gr.3,2,2,,,18,5,,0,23,0,,2:29:826,Dry/Wet,No
GT-98,29/05/2024,Season 4,Round 4,Race 2,Lamborghini GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Harry Richards,Lamborghini - Huracán GT3 15,Gr.3,4,6,,,8,3,,0,11,-2,,2:29:785,Dry/Wet,No
GT-98,29/05/2024,Season 4,Round 4,Race 2,Lamborghini GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Joe McGhee,Lamborghini - Huracán GT3 15,Gr.3,6,3,,,15,1,,0,16,3,,2:26:643,Dry/Wet,No
GT-98,29/05/2024,Season 4,Round 4,Race 2,Lamborghini GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Lawrence Parker,Lamborghini - Huracán GT3 15,Gr.3,5,5,FL,,10,2,1,0,13,0,,2:23:776,Dry/Wet,No
GT-98,29/05/2024,Season 4,Round 4,Race 2,Lamborghini GT3 Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Liam England,Lamborghini - Huracán GT3 15,Gr.3,3,4,,,12,4,,0,16,-1,,2:29:465,Dry/Wet,No
GT-99,29/05/2024,Season 4,Round 4,Race 3,Formula 1500T-A Championship,Individual,,Autopolis - Full Course,Alex Hoyle,Gran Turismo - F1500T-A,Formula,4,3,,,15,3,,0,18,1,1:33:466,1:32:562,,No
GT-99,29/05/2024,Season 4,Round 4,Race 3,Formula 1500T-A Championship,Individual,,Autopolis - Full Course,Conor Roberts,Gran Turismo - F1500T-A,Formula,6,5,,,10,1,,0,11,1,1:34:818,1:34:572,,No
GT-99,29/05/2024,Season 4,Round 4,Race 3,Formula 1500T-A Championship,Individual,,Autopolis - Full Course,Harry Richards,Gran Turismo - F1500T-A,Formula,5,6,,,8,2,,0,10,-1,1:34:092,1:36:772,,No
GT-99,29/05/2024,Season 4,Round 4,Race 3,Formula 1500T-A Championship,Individual,,Autopolis - Full Course,Joe McGhee,Gran Turismo - F1500T-A,Formula,2,4,,,12,5,,0,17,-2,1:33:068,1:32:699,,No
GT-99,29/05/2024,Season 4,Round 4,Race 3,Formula 1500T-A Championship,Individual,,Autopolis - Full Course,Lawrence Parker,Gran Turismo - F1500T-A,Formula,3,1,FL,,25,4,1,0,30,2,1:33:325,1:31:689,,No
GT-99,29/05/2024,Season 4,Round 4,Race 3,Formula 1500T-A Championship,Individual,,Autopolis - Full Course,Liam England,Gran Turismo - F1500T-A,Formula,1,2,,,18,6,,0,24,-1,1:32:380,1:32:047,,No
GT-100,14/06/2024,Season 4,Round 5,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Lago Maggiore - West End,Alex Hoyle,Mazda - Roadster Touring Car,Road,1,1,FL,,25,6,1,0,32,0,,0:57:150,,No
GT-100,14/06/2024,Season 4,Round 5,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Lago Maggiore - West End,Conor Roberts,Mazda - Roadster Touring Car,Road,6,5,,,10,1,,0,11,1,,0:58:117,,No
GT-100,14/06/2024,Season 4,Round 5,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Lago Maggiore - West End,Harry Richards,Mazda - Roadster Touring Car,Road,2,2,,,18,5,,0,23,0,,0:57:376,,No
GT-100,14/06/2024,Season 4,Round 5,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Lago Maggiore - West End,Joe McGhee,Mazda - Roadster Touring Car,Road,4,6,,,8,3,,0,11,-2,,0:57:985,,No
GT-100,14/06/2024,Season 4,Round 5,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Lago Maggiore - West End,Lawrence Parker,Mazda - Roadster Touring Car,Road,3,3,,,15,4,,0,19,0,,0:57:720,,No
GT-100,14/06/2024,Season 4,Round 5,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Lago Maggiore - West End,Liam England,Mazda - Roadster Touring Car,Road,5,4,,,12,2,,0,14,1,,0:57:593,,No
GT-101,14/06/2024,Season 4,Round 5,Race 2,Lamborghini GT3 Cup,Individual,,Fuji - Full Course,Alex Hoyle,Lamborghini - Huracán GT3 15,Gr.3,2,2,FL,,18,5,1,0,24,0,1:36:828,1:63:452,,No
GT-101,14/06/2024,Season 4,Round 5,Race 2,Lamborghini GT3 Cup,Individual,,Fuji - Full Course,Conor Roberts,Lamborghini - Huracán GT3 15,Gr.3,4,5,,,10,3,,0,13,-1,1:38:869,1:38:949,,No
GT-101,14/06/2024,Season 4,Round 5,Race 2,Lamborghini GT3 Cup,Individual,,Fuji - Full Course,Harry Richards,Lamborghini - Huracán GT3 15,Gr.3,6,6,,,8,1,,0,9,0,1:40:260,1:38:447,,No
GT-101,14/06/2024,Season 4,Round 5,Race 2,Lamborghini GT3 Cup,Individual,,Fuji - Full Course,Joe McGhee,Lamborghini - Huracán GT3 15,Gr.3,1,1,,,25,6,,0,31,0,1:36:825,1:63:894,,No
GT-101,14/06/2024,Season 4,Round 5,Race 2,Lamborghini GT3 Cup,Individual,,Fuji - Full Course,Lawrence Parker,Lamborghini - Huracán GT3 15,Gr.3,3,3,,,15,4,,0,19,0,1:37:067,1:36:928,,No
GT-101,14/06/2024,Season 4,Round 5,Race 2,Lamborghini GT3 Cup,Individual,,Fuji - Full Course,Liam England,Lamborghini - Huracán GT3 15,Gr.3,5,4,,,12,2,,0,14,1,1:39:006,1:37:894,,No
GT-102,14/06/2024,Season 4,Round 5,Race 3,Formula 1500T-A Championship,Individual,,Barcelona - National Layout,Alex Hoyle,Gran Turismo - F1500T-A,Formula,4,DNF,,,0,3,,0,3,0,1:03:127,,,No
GT-102,14/06/2024,Season 4,Round 5,Race 3,Formula 1500T-A Championship,Individual,,Barcelona - National Layout,Conor Roberts,Gran Turismo - F1500T-A,Formula,6,5,,,10,1,,0,11,1,1:04:055,,,No
GT-102,14/06/2024,Season 4,Round 5,Race 3,Formula 1500T-A Championship,Individual,,Barcelona - National Layout,Harry Richards,Gran Turismo - F1500T-A,Formula,2,3,,,15,5,,0,20,-1,1:02:419,,,No
GT-102,14/06/2024,Season 4,Round 5,Race 3,Formula 1500T-A Championship,Individual,,Barcelona - National Layout,Joe McGhee,Gran Turismo - F1500T-A,Formula,5,4,,,12,2,,0,14,1,1:03:494,,,No
GT-102,14/06/2024,Season 4,Round 5,Race 3,Formula 1500T-A Championship,Individual,,Barcelona - National Layout,Lawrence Parker,Gran Turismo - F1500T-A,Formula,3,1,FL,,25,4,1,0,30,2,1:02:487,,,No
GT-102,14/06/2024,Season 4,Round 5,Race 3,Formula 1500T-A Championship,Individual,,Barcelona - National Layout,Liam England,Gran Turismo - F1500T-A,Formula,1,2,,,18,6,,0,24,-1,1:01:741,,,No
GT-103,19/06/2024,Season 4,Round 6,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Barcelona - National Layout,Alex Hoyle,Mazda - Roadster Touring Car,Road,1,1,FL,,25,6,1,0,32,0,1:17:037,1:16:790,,No
GT-103,19/06/2024,Season 4,Round 6,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Barcelona - National Layout,Conor Roberts,Mazda - Roadster Touring Car,Road,4,4,,,12,3,,0,15,0,1:20:175,1:18:341,,No
GT-103,19/06/2024,Season 4,Round 6,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Barcelona - National Layout,Harry Richards,Mazda - Roadster Touring Car,Road,6,5,,,10,1,,0,11,1,1:26:112,1:18:254,,No
GT-103,19/06/2024,Season 4,Round 6,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Barcelona - National Layout,Joe McGhee,Mazda - Roadster Touring Car,Road,5,3,,,15,2,,0,17,2,1:22:255,1:18:174,,No
GT-103,19/06/2024,Season 4,Round 6,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Barcelona - National Layout,Lawrence Parker,Mazda - Roadster Touring Car,Road,2,2,,,18,5,,0,23,0,1:17:645,1:16:794,,No
GT-103,19/06/2024,Season 4,Round 6,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Barcelona - National Layout,Liam England,Mazda - Roadster Touring Car,Road,3,6,,,8,4,,0,12,-3,1:17:911,1:18:348,,No
GT-104,19/06/2024,Season 4,Round 6,Race 2,Lamborghini GT3 Cup,Individual,,Red Bull Ring - Full Course,Alex Hoyle,Lamborghini - Huracán GT3 15,Gr.3,1,4,,,12,6,,0,18,-3,,1:26:943,,No
GT-104,19/06/2024,Season 4,Round 6,Race 2,Lamborghini GT3 Cup,Individual,,Red Bull Ring - Full Course,Conor Roberts,Lamborghini - Huracán GT3 15,Gr.3,6,6,,,8,1,,0,9,0,,1:26:857,,No
GT-104,19/06/2024,Season 4,Round 6,Race 2,Lamborghini GT3 Cup,Individual,,Red Bull Ring - Full Course,Harry Richards,Lamborghini - Huracán GT3 15,Gr.3,2,3,,,15,5,,0,20,-1,,1:26:826,,No
GT-104,19/06/2024,Season 4,Round 6,Race 2,Lamborghini GT3 Cup,Individual,,Red Bull Ring - Full Course,Joe McGhee,Lamborghini - Huracán GT3 15,Gr.3,3,2,,,18,4,,0,22,1,,1:26:824,,No
GT-104,19/06/2024,Season 4,Round 6,Race 2,Lamborghini GT3 Cup,Individual,,Red Bull Ring - Full Course,Lawrence Parker,Lamborghini - Huracán GT3 15,Gr.3,5,1,FL,,25,2,1,0,28,4,,1:26:262,,No
GT-104,19/06/2024,Season 4,Round 6,Race 2,Lamborghini GT3 Cup,Individual,,Red Bull Ring - Full Course,Liam England,Lamborghini - Huracán GT3 15,Gr.3,4,5,,,10,3,,0,13,-1,,1:27:140,,No
GT-105,19/06/2024,Season 4,Round 6,Race 3,Formula 1500T-A Championship,Individual,,Mount Panorama - Full Course,Alex Hoyle,Gran Turismo - F1500T-A,Formula,6,6,,,8,1,,0,9,0,1:53:122,1:43:353,,No
GT-105,19/06/2024,Season 4,Round 6,Race 3,Formula 1500T-A Championship,Individual,,Mount Panorama - Full Course,Conor Roberts,Gran Turismo - F1500T-A,Formula,5,5,,,10,2,,0,12,0,1:45:456,1:48:159,,No
GT-105,19/06/2024,Season 4,Round 6,Race 3,Formula 1500T-A Championship,Individual,,Mount Panorama - Full Course,Harry Richards,Gran Turismo - F1500T-A,Formula,4,4,,,12,3,,0,15,0,1:45:304,1:43:800,,No
GT-105,19/06/2024,Season 4,Round 6,Race 3,Formula 1500T-A Championship,Individual,,Mount Panorama - Full Course,Joe McGhee,Gran Turismo - F1500T-A,Formula,3,2,,,18,4,,0,22,1,1:44:300,1:45:457,,No
GT-105,19/06/2024,Season 4,Round 6,Race 3,Formula 1500T-A Championship,Individual,,Mount Panorama - Full Course,Lawrence Parker,Gran Turismo - F1500T-A,Formula,1,1,,,25,6,,0,31,0,1:42:418,1:43:310,,No
GT-105,19/06/2024,Season 4,Round 6,Race 3,Formula 1500T-A Championship,Individual,,Mount Panorama - Full Course,Liam England,Gran Turismo - F1500T-A,Formula,2,3,FL,,15,5,1,0,21,-1,1:42:718,1:43:134,,No
GT-106,26/06/2024,Season 4,Round 7,Race 2,Lamborghini GT3 Cup,Individual,,Daytona - Road Course,Alex Hoyle,Lamborghini - Huracán GT3 15,Gr.3,5,1,FL,,25,2,1,0,28,4,,1:42:957,,No
GT-106,26/06/2024,Season 4,Round 7,Race 2,Lamborghini GT3 Cup,Individual,,Daytona - Road Course,Conor Roberts,Lamborghini - Huracán GT3 15,Gr.3,3,5,,,10,4,,0,14,-2,,1:43:754,,No
GT-106,26/06/2024,Season 4,Round 7,Race 2,Lamborghini GT3 Cup,Individual,,Daytona - Road Course,Harry Richards,Lamborghini - Huracán GT3 15,Gr.3,4,3,,,15,3,,0,18,1,,1:44:619,,No
GT-106,26/06/2024,Season 4,Round 7,Race 2,Lamborghini GT3 Cup,Individual,,Daytona - Road Course,Joe McGhee,Lamborghini - Huracán GT3 15,Gr.3,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-106,26/06/2024,Season 4,Round 7,Race 2,Lamborghini GT3 Cup,Individual,,Daytona - Road Course,Lawrence Parker,Lamborghini - Huracán GT3 15,Gr.3,1,4,,,12,6,,0,18,-3,,1:43:355,,No
GT-106,26/06/2024,Season 4,Round 7,Race 2,Lamborghini GT3 Cup,Individual,,Daytona - Road Course,Liam England,Lamborghini - Huracán GT3 15,Gr.3,2,2,,,18,5,,0,23,0,,1:43:324,,No
GT-107,26/06/2024,Season 4,Round 7,Race 3,Formula 1500T-A Championship,Individual,,Watkins Glen - Long Course,Alex Hoyle,Gran Turismo - F1500T-A,Formula,1,3,FL,,15,6,1,0,22,-2,0:53:781,0:53:461,,No
GT-107,26/06/2024,Season 4,Round 7,Race 3,Formula 1500T-A Championship,Individual,,Watkins Glen - Long Course,Conor Roberts,Gran Turismo - F1500T-A,Formula,4,5,,,10,3,,0,13,-1,0:55:091,0:54:656,,No
GT-107,26/06/2024,Season 4,Round 7,Race 3,Formula 1500T-A Championship,Individual,,Watkins Glen - Long Course,Harry Richards,Gran Turismo - F1500T-A,Formula,2,4,,,12,5,,0,17,-2,0:55:251,0:55:744,,No
GT-107,26/06/2024,Season 4,Round 7,Race 3,Formula 1500T-A Championship,Individual,,Watkins Glen - Long Course,Joe McGhee,Gran Turismo - F1500T-A,Formula,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-107,26/06/2024,Season 4,Round 7,Race 3,Formula 1500T-A Championship,Individual,,Watkins Glen - Long Course,Lawrence Parker,Gran Turismo - F1500T-A,Formula,3,2,,,18,4,,0,22,1,0:54:616,0:53:684,,No
GT-107,26/06/2024,Season 4,Round 7,Race 3,Formula 1500T-A Championship,Individual,,Watkins Glen - Long Course,Liam England,Gran Turismo - F1500T-A,Formula,2,1,,,25,5,,0,30,1,0:54:559,0:54:091,,No
GT-108,11/07/2024,Season 4,Round 8,Race 2,Lamborghini GT3 Cup,Individual,,Le Mans - Full Course,Alex Hoyle,Lamborghini - Huracán GT3 15,Gr.3,DNS,DNS,,,0,,,0,0,0,,,,No
GT-108,11/07/2024,Season 4,Round 8,Race 2,Lamborghini GT3 Cup,Individual,,Le Mans - Full Course,Conor Roberts,Lamborghini - Huracán GT3 15,Gr.3,3,4,,,12,,,0,12,-1,,3:57:537,,No
GT-108,11/07/2024,Season 4,Round 8,Race 2,Lamborghini GT3 Cup,Individual,,Le Mans - Full Course,Harry Richards,Lamborghini - Huracán GT3 15,Gr.3,1,5,,,10,,,0,10,-4,,4:01:457,,No
GT-108,11/07/2024,Season 4,Round 8,Race 2,Lamborghini GT3 Cup,Individual,,Le Mans - Full Course,Joe McGhee,Lamborghini - Huracán GT3 15,Gr.3,2,1,,,25,,,0,25,1,,3:55:504,,No
GT-108,11/07/2024,Season 4,Round 8,Race 2,Lamborghini GT3 Cup,Individual,,Le Mans - Full Course,Lawrence Parker,Lamborghini - Huracán GT3 15,Gr.3,5,3,,,15,,,0,15,2,,3:56:791,,No
GT-108,11/07/2024,Season 4,Round 8,Race 2,Lamborghini GT3 Cup,Individual,,Le Mans - Full Course,Liam England,Lamborghini - Huracán GT3 15,Gr.3,4,2,FL,,18,,1,0,19,2,,3:54:211,,No
GT-109,11/07/2024,Season 4,Round 8,Race 3,Formula 1500T-A Championship,Individual,,Circuit de Spa-Francorchamps - Full Course,Alex Hoyle,Gran Turismo - F1500T-A,Formula,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-109,11/07/2024,Season 4,Round 8,Race 3,Formula 1500T-A Championship,Individual,,Circuit de Spa-Francorchamps - Full Course,Conor Roberts,Gran Turismo - F1500T-A,Formula,5,3,,,15,2,,0,17,2,,2:00:022,,No
GT-109,11/07/2024,Season 4,Round 8,Race 3,Formula 1500T-A Championship,Individual,,Circuit de Spa-Francorchamps - Full Course,Harry Richards,Gran Turismo - F1500T-A,Formula,3,5,,,10,4,,0,14,-2,,1:56:432,,No
GT-109,11/07/2024,Season 4,Round 8,Race 3,Formula 1500T-A Championship,Individual,,Circuit de Spa-Francorchamps - Full Course,Joe McGhee,Gran Turismo - F1500T-A,Formula,2,4,,,12,5,,0,17,-2,,1:57:955,,No
GT-109,11/07/2024,Season 4,Round 8,Race 3,Formula 1500T-A Championship,Individual,,Circuit de Spa-Francorchamps - Full Course,Lawrence Parker,Gran Turismo - F1500T-A,Formula,1,1,FL,,25,6,1,0,32,0,,1:54:923,,No
GT-109,11/07/2024,Season 4,Round 8,Race 3,Formula 1500T-A Championship,Individual,,Circuit de Spa-Francorchamps - Full Course,Liam England,Gran Turismo - F1500T-A,Formula,4,2,,,18,3,,0,21,2,,1:55:478,,No
GT-110,17/07/2024,Season 4,Round 9,Race 2,Lamborghini GT3 Cup,Individual,,Nürburgring - Nordschleife,Alex Hoyle,Lamborghini - Huracán GT3 15,Gr.3,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-110,17/07/2024,Season 4,Round 9,Race 2,Lamborghini GT3 Cup,Individual,,Nürburgring - Nordschleife,Conor Roberts,Lamborghini - Huracán GT3 15,Gr.3,1,2,,,18,6,,0,24,-1,7:08:066,7:25:434,Dry/Wet,No
GT-110,17/07/2024,Season 4,Round 9,Race 2,Lamborghini GT3 Cup,Individual,,Nürburgring - Nordschleife,Harry Richards,Lamborghini - Huracán GT3 15,Gr.3,4,5,,,10,3,,0,13,-1,7:24:099,7:35:075,Dry/Wet,No
GT-110,17/07/2024,Season 4,Round 9,Race 2,Lamborghini GT3 Cup,Individual,,Nürburgring - Nordschleife,Joe McGhee,Lamborghini - Huracán GT3 15,Gr.3,5,1,,,25,2,,0,27,4,9:01:376,7:25:751,Dry/Wet,No
GT-110,17/07/2024,Season 4,Round 9,Race 2,Lamborghini GT3 Cup,Individual,,Nürburgring - Nordschleife,Lawrence Parker,Lamborghini - Huracán GT3 15,Gr.3,3,3,FL,,15,4,1,0,20,0,7:22:295,7:23:731,Dry/Wet,No
GT-110,17/07/2024,Season 4,Round 9,Race 2,Lamborghini GT3 Cup,Individual,,Nürburgring - Nordschleife,Liam England,Lamborghini - Huracán GT3 15,Gr.3,2,4,,,12,5,,0,17,-2,7:11:496,7:25:321,Dry/Wet,No
GT-111,17/07/2024,Season 4,Round 9,Race 3,Formula 1500T-A Championship,Individual,,Laguna Seca - Full Course,Alex Hoyle,Gran Turismo - F1500T-A,Formula,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-111,17/07/2024,Season 4,Round 9,Race 3,Formula 1500T-A Championship,Individual,,Laguna Seca - Full Course,Conor Roberts,Gran Turismo - F1500T-A,Formula,3,4,,,12,4,,0,16,-1,1:12:891,1:13:142,,No
GT-111,17/07/2024,Season 4,Round 9,Race 3,Formula 1500T-A Championship,Individual,,Laguna Seca - Full Course,Harry Richards,Gran Turismo - F1500T-A,Formula,1,5,,,10,6,,0,16,-4,1:11:401,1:12:640,,No
GT-111,17/07/2024,Season 4,Round 9,Race 3,Formula 1500T-A Championship,Individual,,Laguna Seca - Full Course,Joe McGhee,Gran Turismo - F1500T-A,Formula,5,1,,,25,2,,0,27,4,1:14:115,1:12:514,,No
GT-111,17/07/2024,Season 4,Round 9,Race 3,Formula 1500T-A Championship,Individual,,Laguna Seca - Full Course,Lawrence Parker,Gran Turismo - F1500T-A,Formula,4,2,,,18,3,,0,21,2,1:13:508,1:11:423,,No
GT-111,17/07/2024,Season 4,Round 9,Race 3,Formula 1500T-A Championship,Individual,,Laguna Seca - Full Course,Liam England,Gran Turismo - F1500T-A,Formula,2,1,FL,,25,5,1,0,31,1,1:12:338,1:10:835,,No
GT-112,25/07/2024,Season 4,Round 10,Race 2,Lamborghini GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Alex Hoyle,Lamborghini - Huracán GT3 15,Gr.3,1,4,FL,,12,6,1,0,19,-3,1:21:966,1:22:858,,No
GT-112,25/07/2024,Season 4,Round 10,Race 2,Lamborghini GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Conor Roberts,Lamborghini - Huracán GT3 15,Gr.3,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-112,25/07/2024,Season 4,Round 10,Race 2,Lamborghini GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Harry Richards,Lamborghini - Huracán GT3 15,Gr.3,4,1,,,25,3,,0,28,3,1:23:017,1:23:816,,No
GT-112,25/07/2024,Season 4,Round 10,Race 2,Lamborghini GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Joe McGhee,Lamborghini - Huracán GT3 15,Gr.3,3,3,,,15,4,,0,19,0,1:22:889,1:24:466,,No
GT-112,25/07/2024,Season 4,Round 10,Race 2,Lamborghini GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Lawrence Parker,Lamborghini - Huracán GT3 15,Gr.3,2,5,,,10,5,,0,15,-3,1:22:450,1:24:981,,No
GT-112,25/07/2024,Season 4,Round 10,Race 2,Lamborghini GT3 Cup,Individual,,Brands Hatch - Grand Prix Circuit,Liam England,Lamborghini - Huracán GT3 15,Gr.3,5,2,,,18,2,,0,20,3,1:23:713,1:24:130,,No
GT-113,25/07/2024,Season 4,Round 10,Race 3,Formula 1500T-A Championship,Individual,,Monza - Full Course,Alex Hoyle,Gran Turismo - F1500T-A,Formula,4,1,FL,,25,3,1,0,29,3,1:32:861,1:31:494,,No
GT-113,25/07/2024,Season 4,Round 10,Race 3,Formula 1500T-A Championship,Individual,,Monza - Full Course,Conor Roberts,Gran Turismo - F1500T-A,Formula,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-113,25/07/2024,Season 4,Round 10,Race 3,Formula 1500T-A Championship,Individual,,Monza - Full Course,Harry Richards,Gran Turismo - F1500T-A,Formula,5,2,,,18,2,,0,20,3,1:33:035,1:34:127,,No
GT-113,25/07/2024,Season 4,Round 10,Race 3,Formula 1500T-A Championship,Individual,,Monza - Full Course,Joe McGhee,Gran Turismo - F1500T-A,Formula,3,5,,,10,4,,0,14,-2,1:32:200,1:31:902,,No
GT-113,25/07/2024,Season 4,Round 10,Race 3,Formula 1500T-A Championship,Individual,,Monza - Full Course,Lawrence Parker,Gran Turismo - F1500T-A,Formula,1,4,,,12,6,,0,18,-3,1:30:731,1:33:016,,No
GT-113,25/07/2024,Season 4,Round 10,Race 3,Formula 1500T-A Championship,Individual,,Monza - Full Course,Liam England,Gran Turismo - F1500T-A,Formula,2,3,,,15,5,,0,20,-1,1:31:991,1:32:031,,No
GT-114,31/07/2024,Season 4,Round 7,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Suzuka - East Course,Alex Hoyle,Mazda - Roadster Touring Car,Road,1,3,FL,,15,6,1,0,22,-2,,0:52:922,,No
GT-114,31/07/2024,Season 4,Round 7,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Suzuka - East Course,Conor Roberts,Mazda - Roadster Touring Car,Road,6,6,,,8,1,,0,9,0,,0:53:957,,No
GT-114,31/07/2024,Season 4,Round 7,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Suzuka - East Course,Harry Richards,Mazda - Roadster Touring Car,Road,3,2,,,18,4,,0,22,1,,0:53:062,,No
GT-114,31/07/2024,Season 4,Round 7,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Suzuka - East Course,Joe McGhee,Mazda - Roadster Touring Car,Road,4,5,,,10,3,,0,13,-1,,0:53:827,,No
GT-114,31/07/2024,Season 4,Round 7,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Suzuka - East Course,Lawrence Parker,Mazda - Roadster Touring Car,Road,2,1,,,25,5,,0,30,1,,0:53:042,,No
GT-114,31/07/2024,Season 4,Round 7,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Suzuka - East Course,Liam England,Mazda - Roadster Touring Car,Road,5,4,,,12,2,,0,14,1,,0:53:481,,No
GT-115,31/07/2024,Season 4,Round 8,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Nürburgring - Sprint,Alex Hoyle,Mazda - Roadster Touring Car,Road,1,1,FL,,25,6,1,0,32,0,1:34:933,1:33:996,,No
GT-115,31/07/2024,Season 4,Round 8,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Nürburgring - Sprint,Conor Roberts,Mazda - Roadster Touring Car,Road,5,6,,,8,2,,0,10,-1,1:38:028,1:36:795,,No
GT-115,31/07/2024,Season 4,Round 8,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Nürburgring - Sprint,Harry Richards,Mazda - Roadster Touring Car,Road,3,3,,,15,4,,0,19,0,1:37:174,1:36:493,,No
GT-115,31/07/2024,Season 4,Round 8,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Nürburgring - Sprint,Joe McGhee,Mazda - Roadster Touring Car,Road,4,5,,,10,3,,0,13,-1,1:37:635,1:37:488,,No
GT-115,31/07/2024,Season 4,Round 8,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Nürburgring - Sprint,Lawrence Parker,Mazda - Roadster Touring Car,Road,2,2,,,18,5,,0,23,0,1:35:748,1:35:843,,No
GT-115,31/07/2024,Season 4,Round 8,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Nürburgring - Sprint,Liam England,Mazda - Roadster Touring Car,Road,6,4,,,12,1,,0,13,2,1:40:982,1:37:436,,No
GT-116,31/07/2024,Season 4,Round 9,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Daytona - Road Course,Alex Hoyle,Mazda - Roadster Touring Car,Road,1,1,FL,,25,6,1,0,32,0,2:01:425,2:01:063,,No
GT-116,31/07/2024,Season 4,Round 9,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Daytona - Road Course,Conor Roberts,Mazda - Roadster Touring Car,Road,6,4,,,12,1,,0,13,2,2:05:059,2:02:004,,No
GT-116,31/07/2024,Season 4,Round 9,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Daytona - Road Course,Harry Richards,Mazda - Roadster Touring Car,Road,3,5,,,10,4,,0,14,-2,2:03:092,2:02:770,,No
GT-116,31/07/2024,Season 4,Round 9,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Daytona - Road Course,Joe McGhee,Mazda - Roadster Touring Car,Road,4,2,,,18,3,,0,21,2,2:03:475,2:02:886,,No
GT-116,31/07/2024,Season 4,Round 9,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Daytona - Road Course,Lawrence Parker,Mazda - Roadster Touring Car,Road,5,6,,,8,2,,0,10,-1,2:03:605,2:01:256,,No
GT-116,31/07/2024,Season 4,Round 9,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Daytona - Road Course,Liam England,Mazda - Roadster Touring Car,Road,2,3,,,15,5,,0,20,-1,2:03:079,2:02:103,,No
GT-117,31/07/2024,Season 4,Round 10,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Red Bull Ring - Full Course,Alex Hoyle,Mazda - Roadster Touring Car,Road,2,2,,,18,5,,0,23,0,1:42:493,,,No
GT-117,31/07/2024,Season 4,Round 10,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Red Bull Ring - Full Course,Conor Roberts,Mazda - Roadster Touring Car,Road,5,6,,,8,2,,0,10,-1,1:49:469,,,No
GT-117,31/07/2024,Season 4,Round 10,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Red Bull Ring - Full Course,Harry Richards,Mazda - Roadster Touring Car,Road,1,1,,,25,6,,0,31,0,1:42:024,,,No
GT-117,31/07/2024,Season 4,Round 10,Race 1,Mazda Roadster Cup,Team Race,Moyesy Motorsports,Red Bull Ring - Full Course,Joe McGhee,Mazda - Roadster Touring Car,Road,6,4,,,12,1,,0,13,2,,,,No
GT-117,31/07/2024,Season 4,Round 10,Race 1,Mazda Roadster Cup,Team Race,Barmouth Bridgestone Racing,Red Bull Ring - Full Course,Lawrence Parker,Mazda - Roadster Touring Car,Road,4,3,FL,,15,3,1,0,19,1,1:47:801,,,No
GT-117,31/07/2024,Season 4,Round 10,Race 1,Mazda Roadster Cup,Team Race,Special Factor Racing,Red Bull Ring - Full Course,Liam England,Mazda - Roadster Touring Car,Road,3,5,,,10,4,,0,14,-2,1:43:816,,,No
GT-118,21/08/2024,Season 5,Round 1,Race 1,Touring Car 600 Challenge,Individual,,Lake Louise - Short Track,Alex Hoyle,Subaru - Impreza Sedan WRX STi 04,Off-Road,1,1,FL,,25,6,1,0,32,0,1:06:768,1:05:240,,No
GT-118,21/08/2024,Season 5,Round 1,Race 1,Touring Car 600 Challenge,Individual,,Lake Louise - Short Track,Conor Roberts,Subaru - Impreza Sedan WRX STi 04,Off-Road,2,2,,,18,5,,0,23,0,1:07:183,1:06:099,,No
GT-118,21/08/2024,Season 5,Round 1,Race 1,Touring Car 600 Challenge,Individual,,Lake Louise - Short Track,Harry Richards,Subaru - Impreza Sedan WRX STi 04,Off-Road,6,4,,,12,1,,0,13,2,1:11:282,1:07:399,,No
GT-118,21/08/2024,Season 5,Round 1,Race 1,Touring Car 600 Challenge,Individual,,Lake Louise - Short Track,Joe McGhee,Subaru - Impreza Sedan WRX STi 04,Off-Road,5,5,,,10,2,,0,12,0,1:09:969,1:09:496,,No
GT-118,21/08/2024,Season 5,Round 1,Race 1,Touring Car 600 Challenge,Individual,,Lake Louise - Short Track,Lawrence Parker,Subaru - Impreza Sedan WRX STi 04,Off-Road,3,3,,,15,4,,0,19,0,1:07:797,1:07:009,,No
GT-118,21/08/2024,Season 5,Round 1,Race 1,Touring Car 600 Challenge,Individual,,Lake Louise - Short Track,Liam England,Subaru - Impreza Sedan WRX STi 04,Off-Road,4,6,,,8,3,,0,11,-2,1:09:810,1:08:596,,No
GT-119,21/08/2024,Season 5,Round 1,Race 2,Gr.2 Cup,Individual,,Daytona - Road Course,Alex Hoyle,Nissan - GT-R NISMO GT500 16,Gr.2,1,3,FL,,15,6,1,0,22,-2,1:40:025,1:40:242,,No
GT-119,21/08/2024,Season 5,Round 1,Race 2,Gr.2 Cup,Individual,,Daytona - Road Course,Conor Roberts,Audi - RS 5 Turbo DTM 19,Gr.2,6,5,,,10,1,,0,11,1,1:42:109,1:42:048,,No
GT-119,21/08/2024,Season 5,Round 1,Race 2,Gr.2 Cup,Individual,,Daytona - Road Course,Harry Richards,Audi - RS 5 Turbo DTM 19,Gr.2,4,2,,,18,3,,0,21,2,1:41:250,1:40:694,,No
GT-119,21/08/2024,Season 5,Round 1,Race 2,Gr.2 Cup,Individual,,Daytona - Road Course,Joe McGhee,Lexus - RC F GT500 16,Gr.2,5,6,,,8,2,,0,10,-1,1:41:975,1:40:828,,No
GT-119,21/08/2024,Season 5,Round 1,Race 2,Gr.2 Cup,Individual,,Daytona - Road Course,Lawrence Parker,Lexus - SC430 GT500 08,Gr.2,3,4,,,12,4,,0,16,-1,1:41:144,1:41:111,,No
GT-119,21/08/2024,Season 5,Round 1,Race 2,Gr.2 Cup,Individual,,Daytona - Road Course,Liam England,Audi - RS 5 Turbo DTM 19,Gr.2,2,1,,,25,5,,0,30,1,1:40:226,1:40:490,,No
GT-120,21/08/2024,Season 5,Round 1,Race 3,Super Formula Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Alex Hoyle,Super Formula - SF19 Super Formula / Toyota 19,Formula,1,1,FL,,25,6,1,0,32,0,1:23:674,,,No
GT-120,21/08/2024,Season 5,Round 1,Race 3,Super Formula Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Conor Roberts,Super Formula - SF19 Super Formula / Honda 19,Formula,5,5,,,10,2,,0,12,0,1:26:292,,,No
GT-120,21/08/2024,Season 5,Round 1,Race 3,Super Formula Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Harry Richards,Super Formula - SF19 Super Formula / Honda 19,Formula,6,4,,,12,1,,0,13,2,1:30:790,,,No
GT-120,21/08/2024,Season 5,Round 1,Race 3,Super Formula Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Joe McGhee,Super Formula - SF19 Super Formula / Honda 19,Formula,4,5,,,10,3,,0,13,-1,1:24:986,,,No
GT-120,21/08/2024,Season 5,Round 1,Race 3,Super Formula Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Lawrence Parker,Super Formula - SF19 Super Formula / Honda 19,Formula,2,3,,,15,5,,0,20,-1,1:24:017,,,No
GT-120,21/08/2024,Season 5,Round 1,Race 3,Super Formula Cup,Individual,,Barcelona - Grand Prix Layout No Chicane,Liam England,Super Formula - SF19 Super Formula / Toyota 19,Formula,3,2,,,18,4,,0,22,1,1:24:882,,,No
GT-121,28/08/2024,Season 5,Round 2,Race 1,Touring Car 600 Challenge,Individual,,Road Atlanta - Full Course,Alex Hoyle,Audi - R8 4.2 07,Road,1,1,FL,,25,6,1,0,32,0,1:27:530,1:26:793,,No
GT-121,28/08/2024,Season 5,Round 2,Race 1,Touring Car 600 Challenge,Individual,,Road Atlanta - Full Course,Conor Roberts,Audi - R8 4.2 07,Road,6,5,,,10,1,,0,11,1,1:33:043,1:28:511,,No
GT-121,28/08/2024,Season 5,Round 2,Race 1,Touring Car 600 Challenge,Individual,,Road Atlanta - Full Course,Harry Richards,Audi - R8 4.2 07,Road,2,4,,,12,5,,0,17,-2,1:28:790,1:28:072,,No
GT-121,28/08/2024,Season 5,Round 2,Race 1,Touring Car 600 Challenge,Individual,,Road Atlanta - Full Course,Joe McGhee,Audi - R8 4.2 07,Road,3,2,,,18,4,,0,22,1,1:28:876,1:29:158,,No
GT-121,28/08/2024,Season 5,Round 2,Race 1,Touring Car 600 Challenge,Individual,,Road Atlanta - Full Course,Lawrence Parker,Audi - R8 4.2 07,Road,5,6,,,8,2,,0,10,-1,1:31:747,0:01:297,,No
GT-121,28/08/2024,Season 5,Round 2,Race 1,Touring Car 600 Challenge,Individual,,Road Atlanta - Full Course,Liam England,Audi - R8 4.2 07,Road,4,3,,,15,3,,0,18,1,1:29:287,1:29:780,,No
GT-122,28/08/2024,Season 5,Round 2,Race 2,Gr.2 Cup,Individual,,Circuit de Spa-Francorchamps - 24h Layout,Alex Hoyle,Nissan - GT-R NISMO GT500 16,Gr.2,1,1,FL,,25,6,1,0,32,0,,,,No
GT-122,28/08/2024,Season 5,Round 2,Race 2,Gr.2 Cup,Individual,,Circuit de Spa-Francorchamps - 24h Layout,Conor Roberts,Audi - RS 5 Turbo DTM 19,Gr.2,4,5,,,10,3,,0,13,-1,,,,No
GT-122,28/08/2024,Season 5,Round 2,Race 2,Gr.2 Cup,Individual,,Circuit de Spa-Francorchamps - 24h Layout,Harry Richards,Audi - RS 5 Turbo DTM 19,Gr.2,3,4,,,12,4,,0,16,-1,,,,No
GT-122,28/08/2024,Season 5,Round 2,Race 2,Gr.2 Cup,Individual,,Circuit de Spa-Francorchamps - 24h Layout,Joe McGhee,Lexus - RC F GT500 16,Gr.2,2,3,,,15,5,,0,20,-1,,,,No
GT-122,28/08/2024,Season 5,Round 2,Race 2,Gr.2 Cup,Individual,,Circuit de Spa-Francorchamps - 24h Layout,Lawrence Parker,Lexus - SC430 GT500 08,Gr.2,5,6,,,8,2,,0,10,-1,,,,No
GT-122,28/08/2024,Season 5,Round 2,Race 2,Gr.2 Cup,Individual,,Circuit de Spa-Francorchamps - 24h Layout,Liam England,Audi - RS 5 Turbo DTM 19,Gr.2,6,2,,,18,1,,0,19,4,,,,No
GT-123,28/08/2024,Season 5,Round 2,Race 3,Super Formula Cup,Individual,,Monza - Full Course,Alex Hoyle,Super Formula - SF19 Super Formula / Toyota 19,Formula,1,1,FL,,25,6,1,0,32,0,,,,No
GT-123,28/08/2024,Season 5,Round 2,Race 3,Super Formula Cup,Individual,,Monza - Full Course,Conor Roberts,Super Formula - SF19 Super Formula / Honda 19,Formula,5,3,,,15,2,,0,17,2,,,,No
GT-123,28/08/2024,Season 5,Round 2,Race 3,Super Formula Cup,Individual,,Monza - Full Course,Harry Richards,Super Formula - SF19 Super Formula / Honda 19,Formula,3,5,,,10,4,,0,14,-2,,,,No
GT-123,28/08/2024,Season 5,Round 2,Race 3,Super Formula Cup,Individual,,Monza - Full Course,Joe McGhee,Super Formula - SF19 Super Formula / Honda 19,Formula,4,6,,,8,3,,0,11,-2,,,,No
GT-123,28/08/2024,Season 5,Round 2,Race 3,Super Formula Cup,Individual,,Monza - Full Course,Lawrence Parker,Super Formula - SF19 Super Formula / Honda 19,Formula,6,4,,,12,1,,0,13,2,,,,No
GT-123,28/08/2024,Season 5,Round 2,Race 3,Super Formula Cup,Individual,,Monza - Full Course,Liam England,Super Formula - SF19 Super Formula / Toyota 19,Formula,2,2,,,18,5,,0,23,0,,,,No
GT-124,04/09/2024,Season 5,Round 3,Race 1,Touring Car 600 Challenge,Individual,,Lago Maggiore - West,Alex Hoyle,Porsche - Cayman GT4 16,Road,1,1,FL,,25,6,1,0,32,0,,,,No
GT-124,04/09/2024,Season 5,Round 3,Race 1,Touring Car 600 Challenge,Individual,,Lago Maggiore - West,Conor Roberts,Porsche - Cayman GT4 16,Road,6,6,,,8,1,,0,9,0,,,,No
GT-124,04/09/2024,Season 5,Round 3,Race 1,Touring Car 600 Challenge,Individual,,Lago Maggiore - West,Harry Richards,Porsche - Cayman GT4 16,Road,4,4,,,12,3,,0,15,0,,,,No
GT-124,04/09/2024,Season 5,Round 3,Race 1,Touring Car 600 Challenge,Individual,,Lago Maggiore - West,Joe McGhee,Porsche - Cayman GT4 16,Road,5,5,,,10,2,,0,12,0,,,,No
GT-124,04/09/2024,Season 5,Round 3,Race 1,Touring Car 600 Challenge,Individual,,Lago Maggiore - West,Lawrence Parker,Porsche - Cayman GT4 16,Road,2,2,,1,18,5,,-10,13,0,,,,No
GT-124,04/09/2024,Season 5,Round 3,Race 1,Touring Car 600 Challenge,Individual,,Lago Maggiore - West,Liam England,Porsche - Cayman GT4 16,Road,3,3,,,15,4,,0,19,0,,,,No
GT-125,04/09/2024,Season 5,Round 3,Race 2,Gr.2 Cup,Individual,,Le Mans - Full Course,Alex Hoyle,Nissan - GT-R NISMO GT500 16,Gr.2,NA,1,FL,,25,0,1,0,26,0,,,,No
GT-125,04/09/2024,Season 5,Round 3,Race 2,Gr.2 Cup,Individual,,Le Mans - Full Course,Conor Roberts,Audi - RS 5 Turbo DTM 19,Gr.2,NA,5,,,10,0,,0,10,0,,,,No
GT-125,04/09/2024,Season 5,Round 3,Race 2,Gr.2 Cup,Individual,,Le Mans - Full Course,Harry Richards,Audi - RS 5 Turbo DTM 19,Gr.2,NA,6,,,8,0,,0,8,0,,,,No
GT-125,04/09/2024,Season 5,Round 3,Race 2,Gr.2 Cup,Individual,,Le Mans - Full Course,Joe McGhee,Lexus - RC F GT500 16,Gr.2,NA,4,,,12,0,,0,12,0,,,,No
GT-125,04/09/2024,Season 5,Round 3,Race 2,Gr.2 Cup,Individual,,Le Mans - Full Course,Lawrence Parker,Lexus - RC F GT500 16,Gr.2,NA,3,,,15,0,,0,15,0,,,,No
GT-125,04/09/2024,Season 5,Round 3,Race 2,Gr.2 Cup,Individual,,Le Mans - Full Course,Liam England,Audi - RS 5 Turbo DTM 19,Gr.2,NA,2,,,18,0,,0,18,0,,,,No
GT-126,04/09/2024,Season 5,Round 3,Race 3,Super Formula Cup,Individual,,Brands Hatch - Grand Prix Circuit,Alex Hoyle,Super Formula - SF19 Super Formula / Toyota 19,Formula,1,1,FL,1,25,6,1,-10,22,0,,,,No
GT-126,04/09/2024,Season 5,Round 3,Race 3,Super Formula Cup,Individual,,Brands Hatch - Grand Prix Circuit,Conor Roberts,Super Formula - SF19 Super Formula / Honda 19,Formula,5,5,,,10,2,,0,12,0,,,,No
GT-126,04/09/2024,Season 5,Round 3,Race 3,Super Formula Cup,Individual,,Brands Hatch - Grand Prix Circuit,Harry Richards,Super Formula - SF19 Super Formula / Honda 19,Formula,3,4,,,12,4,,0,16,-1,,,,No
GT-126,04/09/2024,Season 5,Round 3,Race 3,Super Formula Cup,Individual,,Brands Hatch - Grand Prix Circuit,Joe McGhee,Super Formula - SF19 Super Formula / Honda 19,Formula,6,DNF,,,0,1,,0,1,0,,,,No
GT-126,04/09/2024,Season 5,Round 3,Race 3,Super Formula Cup,Individual,,Brands Hatch - Grand Prix Circuit,Lawrence Parker,Super Formula - SF19 Super Formula / Honda 19,Formula,2,3,,,15,5,,0,20,-1,,,,No
GT-126,04/09/2024,Season 5,Round 3,Race 3,Super Formula Cup,Individual,,Brands Hatch - Grand Prix Circuit,Liam England,Super Formula - SF19 Super Formula / Toyota 19,Formula,4,2,,1,18,3,,-10,11,2,,,,No
GT-127,11/09/2024,Season 5,Round 4,Race 1,Touring Car 600 Challenge,Individual,,Watkins Glen - Short Course,Alex Hoyle,Radical - SR3 SL 13,Road,1,1,FL,,25,6,1,0,32,0,,,,No
GT-127,11/09/2024,Season 5,Round 4,Race 1,Touring Car 600 Challenge,Individual,,Watkins Glen - Short Course,Conor Roberts,Radical - SR3 SL 13,Road,5,6,,,8,2,,0,10,-1,,,,No
GT-127,11/09/2024,Season 5,Round 4,Race 1,Touring Car 600 Challenge,Individual,,Watkins Glen - Short Course,Harry Richards,Radical - SR3 SL 13,Road,2,4,,,12,5,,0,17,-2,,,,No
GT-127,11/09/2024,Season 5,Round 4,Race 1,Touring Car 600 Challenge,Individual,,Watkins Glen - Short Course,Joe McGhee,Radical - SR3 SL 13,Road,6,5,,,10,1,,0,11,1,,,,No
GT-127,11/09/2024,Season 5,Round 4,Race 1,Touring Car 600 Challenge,Individual,,Watkins Glen - Short Course,Lawrence Parker,Radical - SR3 SL 13,Road,3,2,,,18,4,,0,22,1,,,,No
GT-127,11/09/2024,Season 5,Round 4,Race 1,Touring Car 600 Challenge,Individual,,Watkins Glen - Short Course,Liam England,Radical - SR3 SL 13,Road,4,3,,,15,3,,0,18,1,,,,No
GT-128,11/09/2024,Season 5,Round 4,Race 2,Gr.2 Cup,Individual,,Fuji - Full Course,Alex Hoyle,Nissan - GT-R NISMO GT500 16,Gr.2,1,1,FL,,25,6,1,0,32,0,,,,No
GT-128,11/09/2024,Season 5,Round 4,Race 2,Gr.2 Cup,Individual,,Fuji - Full Course,Conor Roberts,Audi - RS 5 Turbo DTM 19,Gr.2,6,4,,,12,1,,0,13,2,,,,No
GT-128,11/09/2024,Season 5,Round 4,Race 2,Gr.2 Cup,Individual,,Fuji - Full Course,Harry Richards,Audi - RS 5 Turbo DTM 19,Gr.2,3,6,,,8,4,,0,12,-3,,,,No
GT-128,11/09/2024,Season 5,Round 4,Race 2,Gr.2 Cup,Individual,,Fuji - Full Course,Joe McGhee,Lexus - RC F GT500 16,Gr.2,4,5,,,10,3,,0,13,-1,,,,No
GT-128,11/09/2024,Season 5,Round 4,Race 2,Gr.2 Cup,Individual,,Fuji - Full Course,Lawrence Parker,Lexus - RC F GT500 16,Gr.2,2,3,,,15,5,,0,20,-1,,,,No
GT-128,11/09/2024,Season 5,Round 4,Race 2,Gr.2 Cup,Individual,,Fuji - Full Course,Liam England,Audi - RS 5 Turbo DTM 19,Gr.2,5,2,,,18,2,,0,20,3,,,,No
GT-129,11/09/2024,Season 5,Round 4,Race 3,Super Formula Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Alex Hoyle,Super Formula - SF19 Super Formula / Toyota 19,Formula,1,5,FL,,10,6,1,0,17,-4,1:57:200,1:55:595,,No
GT-129,11/09/2024,Season 5,Round 4,Race 3,Super Formula Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Conor Roberts,Super Formula - SF19 Super Formula / Honda 19,Formula,5,4,,,12,2,,0,14,1,2:01:591,2:00:189,,No
GT-129,11/09/2024,Season 5,Round 4,Race 3,Super Formula Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Harry Richards,Super Formula - SF19 Super Formula / Honda 19,Formula,4,3,,,15,3,,0,18,1,1:58:485,1:58:323,,No
GT-129,11/09/2024,Season 5,Round 4,Race 3,Super Formula Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Joe McGhee,Super Formula - SF19 Super Formula / Honda 19,Formula,DNS,DNS,,,DNS,DNS,,0,0,0,,,,No
GT-129,11/09/2024,Season 5,Round 4,Race 3,Super Formula Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Lawrence Parker,Super Formula - SF19 Super Formula / Honda 19,Formula,3,1,,,25,4,,0,29,2,1:58:065,1:56:024,,No
GT-129,11/09/2024,Season 5,Round 4,Race 3,Super Formula Cup,Individual,,Circuit de Spa-Francorchamps - Full Course,Liam England,Super Formula - SF19 Super Formula / Toyota 19,Formula,2,2,,,18,5,,0,23,0,1:57:507,1:58:263,,No
GT-130,18/09/2024,Season 5,Round 5,Race 1,Touring Car 600 Challenge,Individual,,Trial Mountain - Full Course,Alex Hoyle,Alfa Romeo - 4C 14,Road,DNS,DNS,,,DNS,DNS,,0,0,0,,,,No
GT-130,18/09/2024,Season 5,Round 5,Race 1,Touring Car 600 Challenge,Individual,,Trial Mountain - Full Course,Conor Roberts,Alfa Romeo - 4C 14,Road,3,3,,,15,4,,0,19,0,,,,No
GT-130,18/09/2024,Season 5,Round 5,Race 1,Touring Car 600 Challenge,Individual,,Trial Mountain - Full Course,Harry Richards,Alfa Romeo - 4C 14,Road,5,2,,,18,2,,0,20,3,,,,No
GT-130,18/09/2024,Season 5,Round 5,Race 1,Touring Car 600 Challenge,Individual,,Trial Mountain - Full Course,Joe McGhee,Alfa Romeo - 4C 14,Road,2,4,FL,,12,5,1,0,18,-2,,,,No
GT-130,18/09/2024,Season 5,Round 5,Race 1,Touring Car 600 Challenge,Individual,,Trial Mountain - Full Course,Lawrence Parker,Alfa Romeo - 4C 14,Road,4,5,,,10,3,,0,13,-1,,,,No
GT-130,18/09/2024,Season 5,Round 5,Race 1,Touring Car 600 Challenge,Individual,,Trial Mountain - Full Course,Liam England,Alfa Romeo - 4C 14,Road,1,1,,,25,6,,0,31,0,,,,No
GT-131,18/09/2024,Season 5,Round 5,Race 2,Gr.2 Cup,Individual,,Watkins Glen - Long Course,Alex Hoyle,Nissan - GT-R NISMO GT500 16,Gr.2,DNS,DNS,,,DNS,DNS,,0,0,0,,,,No
GT-131,18/09/2024,Season 5,Round 5,Race 2,Gr.2 Cup,Individual,,Watkins Glen - Long Course,Conor Roberts,Audi - RS 5 Turbo DTM 19,Gr.2,3,5,,,10,4,,0,14,-2,,,,No
GT-131,18/09/2024,Season 5,Round 5,Race 2,Gr.2 Cup,Individual,,Watkins Glen - Long Course,Harry Richards,Audi - RS 5 Turbo DTM 19,Gr.2,5,4,,,12,2,,0,14,1,,,,No
GT-131,18/09/2024,Season 5,Round 5,Race 2,Gr.2 Cup,Individual,,Watkins Glen - Long Course,Joe McGhee,Lexus - RC F GT500 16,Gr.2,2,1,,,25,5,,0,30,1,,,,No
GT-131,18/09/2024,Season 5,Round 5,Race 2,Gr.2 Cup,Individual,,Watkins Glen - Long Course,Lawrence Parker,Lexus - RC F GT500 16,Gr.2,1,2,FL,,18,6,1,0,25,-1,,,,No
GT-131,18/09/2024,Season 5,Round 5,Race 2,Gr.2 Cup,Individual,,Watkins Glen - Long Course,Liam England,Audi - RS 5 Turbo DTM 19,Gr.2,4,3,,,15,3,,0,18,1,,,,No
GT-132,18/09/2024,Season 5,Round 5,Race 3,Super Formula Cup,Individual,,Suzuka - Full Course,Alex Hoyle,Super Formula - SF19 Super Formula / Toyota 19,Formula,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-132,18/09/2024,Season 5,Round 5,Race 3,Super Formula Cup,Individual,,Suzuka - Full Course,Conor Roberts,Super Formula - SF19 Super Formula / Honda 19,Formula,2,4,,,12,5,,0,17,-2,,,,No
GT-132,18/09/2024,Season 5,Round 5,Race 3,Super Formula Cup,Individual,,Suzuka - Full Course,Harry Richards,Super Formula - SF19 Super Formula / Honda 19,Formula,3,3,,,15,4,,0,19,0,,,,No
GT-132,18/09/2024,Season 5,Round 5,Race 3,Super Formula Cup,Individual,,Suzuka - Full Course,Joe McGhee,Super Formula - SF19 Super Formula / Honda 19,Formula,1,5,,,10,6,,0,16,-4,,,,No
GT-132,18/09/2024,Season 5,Round 5,Race 3,Super Formula Cup,Individual,,Suzuka - Full Course,Lawrence Parker,Super Formula - SF19 Super Formula / Honda 19,Formula,5,2,FL,,18,2,1,0,21,3,,,,No
GT-132,18/09/2024,Season 5,Round 5,Race 3,Super Formula Cup,Individual,,Suzuka - Full Course,Liam England,Super Formula - SF19 Super Formula / Toyota 19,Formula,4,1,,,25,3,,0,28,3,,,,No
GT-133,25/09/2024,Season 5,Round 6,Race 1,Touring Car 600 Challenge,Individual,,Nürburgring - Nordschleife,Alex Hoyle,Honda - Civic Type R (EK) Touring Car,Road,N/A,1,FL,,25,0,1,0,26,0,,,,No
GT-133,25/09/2024,Season 5,Round 6,Race 1,Touring Car 600 Challenge,Individual,,Nürburgring - Nordschleife,Conor Roberts,Honda - Civic Type R (EK) Touring Car,Road,N/A,4,,,12,0,,0,12,0,,,,No
GT-133,25/09/2024,Season 5,Round 6,Race 1,Touring Car 600 Challenge,Individual,,Nürburgring - Nordschleife,Harry Richards,Honda - Civic Type R (EK) Touring Car,Road,N/A,6,,,8,0,,0,8,0,,,,No
GT-133,25/09/2024,Season 5,Round 6,Race 1,Touring Car 600 Challenge,Individual,,Nürburgring - Nordschleife,Joe McGhee,Honda - Civic Type R (EK) Touring Car,Road,N/A,3,,,15,0,,0,15,0,,,,No
GT-133,25/09/2024,Season 5,Round 6,Race 1,Touring Car 600 Challenge,Individual,,Nürburgring - Nordschleife,Lawrence Parker,Honda - Civic Type R (EK) Touring Car,Road,N/A,5,,,10,0,,0,10,0,,,,No
GT-133,25/09/2024,Season 5,Round 6,Race 1,Touring Car 600 Challenge,Individual,,Nürburgring - Nordschleife,Liam England,Honda - Civic Type R (EK) Touring Car,Road,N/A,2,,,18,0,,0,18,0,,,,No
GT-134,25/09/2024,Season 5,Round 6,Race 2,Gr.2 Cup,Individual,,Mount Panorama - Full Course,Alex Hoyle,Nissan - GT-R NISMO GT500 16,Gr.2,1,1,FL,,25,6,1,0,32,0,,,,No
GT-134,25/09/2024,Season 5,Round 6,Race 2,Gr.2 Cup,Individual,,Mount Panorama - Full Course,Conor Roberts,Audi - RS 5 Turbo DTM 19,Gr.2,6,6,,,8,1,,0,9,0,,,,No
GT-134,25/09/2024,Season 5,Round 6,Race 2,Gr.2 Cup,Individual,,Mount Panorama - Full Course,Harry Richards,Audi - RS 5 Turbo DTM 19,Gr.2,5,4,,,12,2,,0,14,1,,,,No
GT-134,25/09/2024,Season 5,Round 6,Race 2,Gr.2 Cup,Individual,,Mount Panorama - Full Course,Joe McGhee,Lexus - RC F GT500 16,Gr.2,4,2,,,18,3,,0,21,2,,,,No
GT-134,25/09/2024,Season 5,Round 6,Race 2,Gr.2 Cup,Individual,,Mount Panorama - Full Course,Lawrence Parker,Lexus - RC F GT500 16,Gr.2,2,3,,,15,5,,0,20,-1,,,,No
GT-134,25/09/2024,Season 5,Round 6,Race 2,Gr.2 Cup,Individual,,Mount Panorama - Full Course,Liam England,Audi - RS 5 Turbo DTM 19,Gr.2,3,5,,,10,4,,0,14,-2,,,,No
GT-135,25/09/2024,Season 5,Round 6,Race 3,Super Formula Cup,Individual,,Nürburgring - Grand Prix,Alex Hoyle,Super Formula - SF19 Super Formula / Toyota 19,Formula,1,2,FL,,18,6,1,0,25,-1,,,,No
GT-135,25/09/2024,Season 5,Round 6,Race 3,Super Formula Cup,Individual,,Nürburgring - Grand Prix,Conor Roberts,Super Formula - SF19 Super Formula / Honda 19,Formula,6,5,,,10,1,,0,11,1,,,,No
GT-135,25/09/2024,Season 5,Round 6,Race 3,Super Formula Cup,Individual,,Nürburgring - Grand Prix,Harry Richards,Super Formula - SF19 Super Formula / Honda 19,Formula,3,4,,,12,4,,0,16,-1,,,,No
GT-135,25/09/2024,Season 5,Round 6,Race 3,Super Formula Cup,Individual,,Nürburgring - Grand Prix,Joe McGhee,Super Formula - SF19 Super Formula / Honda 19,Formula,2,1,,,25,5,,0,30,1,,,,No
GT-135,25/09/2024,Season 5,Round 6,Race 3,Super Formula Cup,Individual,,Nürburgring - Grand Prix,Lawrence Parker,Super Formula - SF19 Super Formula / Honda 19,Formula,5,3,,,15,2,,0,17,2,,,,No
GT-135,25/09/2024,Season 5,Round 6,Race 3,Super Formula Cup,Individual,,Nürburgring - Grand Prix,Liam England,Super Formula - SF19 Super Formula / Toyota 19,Formula,4,6,,,8,3,,0,11,-2,,,,No
GT-136,02/10/2024,Season 6,Round 1,Race 1,Rainmaster (Karts),Individual,,Suzuka - Full Course,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,DNS,DNS,,,0,0,,0,0,0,,,Dry/Wet,No
GT-136,02/10/2024,Season 6,Round 1,Race 1,Rainmaster (Karts),Individual,,Suzuka - Full Course,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,5,5,,,10,2,,0,12,0,,,Dry/Wet,No
GT-136,02/10/2024,Season 6,Round 1,Race 1,Rainmaster (Karts),Individual,,Suzuka - Full Course,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,2,3,,,15,5,,0,20,-1,,,Dry/Wet,No
GT-136,02/10/2024,Season 6,Round 1,Race 1,Rainmaster (Karts),Individual,,Suzuka - Full Course,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,4,4,,,12,3,,0,15,0,,,Dry/Wet,No
GT-136,02/10/2024,Season 6,Round 1,Race 1,Rainmaster (Karts),Individual,,Suzuka - Full Course,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,3,1,FL,,25,4,1,0,30,2,,,Dry/Wet,No
GT-136,02/10/2024,Season 6,Round 1,Race 1,Rainmaster (Karts),Individual,,Suzuka - Full Course,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,1,2,,,18,6,,0,24,-1,,,Dry/Wet,No
GT-137,02/10/2024,Season 6,Round 1,Race 2,American Speedway Series,Individual,,Northern Isle - Full Course,Alex Hoyle,Dodge - Challenger SRT Demon 18,Road,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-137,02/10/2024,Season 6,Round 1,Race 2,American Speedway Series,Individual,,Northern Isle - Full Course,Conor Roberts,Dodge - Challenger SRT Demon 18,Road,2,3,,,15,5,,0,20,-1,,,,No
GT-137,02/10/2024,Season 6,Round 1,Race 2,American Speedway Series,Individual,,Northern Isle - Full Course,Harry Richards,Dodge - Challenger SRT Demon 18,Road,5,4,,,12,2,,0,14,1,,,,No
GT-137,02/10/2024,Season 6,Round 1,Race 2,American Speedway Series,Individual,,Northern Isle - Full Course,Joe McGhee,Dodge - Challenger SRT Demon 18,Road,1,1,,,25,6,,0,31,0,,,,No
GT-137,02/10/2024,Season 6,Round 1,Race 2,American Speedway Series,Individual,,Northern Isle - Full Course,Lawrence Parker,Dodge - Challenger SRT Demon 18,Road,4,5,,,10,3,,0,13,-1,,,,No
GT-137,02/10/2024,Season 6,Round 1,Race 2,American Speedway Series,Individual,,Northern Isle - Full Course,Liam England,Dodge - Challenger SRT Demon 18,Road,3,2,FL,,18,4,1,0,23,1,,,,No
GT-138,02/10/2024,Season 6,Round 1,Race 3,Ford vs Ferrari,Team Race,Team Ford,Monza - Full Course,Alex Hoyle,Ford GT Race Car 18,GT3,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-138,02/10/2024,Season 6,Round 1,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Monza - Full Course,Conor Roberts,Ferrari - 458 Italia GT3 13,GT3,5,4,,,12,2,,0,14,1,,,,No
GT-138,02/10/2024,Season 6,Round 1,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Monza - Full Course,Harry Richards,Ferrari - 458 Italia GT3 13,GT3,1,3,,,15,6,,0,21,-2,,,,No
GT-138,02/10/2024,Season 6,Round 1,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Monza - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,GT3,3,5,,1,10,4,,-10,4,-2,,,,No
GT-138,02/10/2024,Season 6,Round 1,Race 3,Ford vs Ferrari,Team Race,Team Ford,Monza - Full Course,Lawrence Parker,Ford GT Race Car 18,GT3,2,1,FL,1,25,5,1,-10,21,1,,,,No
GT-138,02/10/2024,Season 6,Round 1,Race 3,Ford vs Ferrari,Team Race,Team Ford,Monza - Full Course,Liam England,Ford GT Race Car 18,GT3,4,2,,,18,3,,0,21,2,,,,No
GT-139,13/11/2024,Season 6,Round 2,Race 1,Rainmaster (Karts),Individual,,Red Bull Ring - Full Course,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,DNS,DNS,,,0,0,,0,0,0,,,Dry/Wet,No
GT-139,13/11/2024,Season 6,Round 2,Race 1,Rainmaster (Karts),Individual,,Red Bull Ring - Full Course,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,4,5,,,10,3,,0,13,-1,,,Dry/Wet,No
GT-139,13/11/2024,Season 6,Round 2,Race 1,Rainmaster (Karts),Individual,,Red Bull Ring - Full Course,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,5,4,,,12,2,,0,14,1,,,Dry/Wet,No
GT-139,13/11/2024,Season 6,Round 2,Race 1,Rainmaster (Karts),Individual,,Red Bull Ring - Full Course,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,3,3,,,15,4,,0,19,0,,,Dry/Wet,No
GT-139,13/11/2024,Season 6,Round 2,Race 1,Rainmaster (Karts),Individual,,Red Bull Ring - Full Course,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,1,1,FL,,25,6,1,0,32,0,,,Dry/Wet,No
GT-139,13/11/2024,Season 6,Round 2,Race 1,Rainmaster (Karts),Individual,,Red Bull Ring - Full Course,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,2,2,,,18,5,,0,23,0,,,Dry/Wet,No
GT-140,13/11/2024,Season 6,Round 2,Race 2,American Speedway Series,Individual,,Daytona - Tri-Oval,Alex Hoyle,Dodge - Challenger SRT Demon 18,Road,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-140,13/11/2024,Season 6,Round 2,Race 2,American Speedway Series,Individual,,Daytona - Tri-Oval,Conor Roberts,Dodge - Challenger SRT Demon 18,Road,4,4,,,12,3,,0,15,0,,,,No
GT-140,13/11/2024,Season 6,Round 2,Race 2,American Speedway Series,Individual,,Daytona - Tri-Oval,Harry Richards,Dodge - Challenger SRT Demon 18,Road,5,3,,,15,2,,0,17,2,,,,No
GT-140,13/11/2024,Season 6,Round 2,Race 2,American Speedway Series,Individual,,Daytona - Tri-Oval,Joe McGhee,Dodge - Challenger SRT Demon 18,Road,1,5,,1,10,6,,-10,6,-4,,,,No
GT-140,13/11/2024,Season 6,Round 2,Race 2,American Speedway Series,Individual,,Daytona - Tri-Oval,Lawrence Parker,Dodge - Challenger SRT Demon 18,Road,2,2,FL,1,18,5,1,-10,14,0,,,,No
GT-140,13/11/2024,Season 6,Round 2,Race 2,American Speedway Series,Individual,,Daytona - Tri-Oval,Liam England,Dodge - Challenger SRT Demon 18,Road,3,1,,,25,4,,0,29,2,,,,No
GT-141,13/11/2024,Season 6,Round 2,Race 3,Ford vs Ferrari,Team Race,Team Ford,Suzuka - Full Course,Alex Hoyle,Ford GT Race Car 18,GT3,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-141,13/11/2024,Season 6,Round 2,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Suzuka - Full Course,Conor Roberts,Ferrari - 458 Italia GT3 13,GT3,4,2,,,18,3,,0,21,2,,,,No
GT-141,13/11/2024,Season 6,Round 2,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Suzuka - Full Course,Harry Richards,Ferrari - 458 Italia GT3 13,GT3,1,1,,1,25,6,,-10,21,0,,,,No
GT-141,13/11/2024,Season 6,Round 2,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Suzuka - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,GT3,5,5,,,10,2,,0,12,0,,,,No
GT-141,13/11/2024,Season 6,Round 2,Race 3,Ford vs Ferrari,Team Race,Team Ford,Suzuka - Full Course,Lawrence Parker,Ford GT Race Car 18,GT3,3,4,,,12,4,,0,16,-1,,,,No
GT-141,13/11/2024,Season 6,Round 2,Race 3,Ford vs Ferrari,Team Race,Team Ford,Suzuka - Full Course,Liam England,Ford GT Race Car 18,GT3,2,3,FL,,15,5,1,0,21,-1,,,,No
GT-142,26/11/2024,Season 6,Round 3,Race 1,Rainmaster (Karts),Individual,,Autopolis - Shortcut Course,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,DNS,DNS,,,0,0,,0,0,0,,,Dry/Wet,No
GT-142,26/11/2024,Season 6,Round 3,Race 1,Rainmaster (Karts),Individual,,Autopolis - Shortcut Course,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,3,4,,,12,4,,0,16,-1,,,Dry/Wet,No
GT-142,26/11/2024,Season 6,Round 3,Race 1,Rainmaster (Karts),Individual,,Autopolis - Shortcut Course,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,5,5,,,10,2,,0,12,0,,,Dry/Wet,No
GT-142,26/11/2024,Season 6,Round 3,Race 1,Rainmaster (Karts),Individual,,Autopolis - Shortcut Course,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,4,2,,,18,3,,0,21,2,,,Dry/Wet,No
GT-142,26/11/2024,Season 6,Round 3,Race 1,Rainmaster (Karts),Individual,,Autopolis - Shortcut Course,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,1,1,FL,,25,6,1,0,32,0,,,Dry/Wet,No
GT-142,26/11/2024,Season 6,Round 3,Race 1,Rainmaster (Karts),Individual,,Autopolis - Shortcut Course,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,2,3,,,15,5,,0,20,-1,,,Dry/Wet,No
GT-143,06/12/2024,Season 6,Round 3,Race 2,American Speedway Series,Individual,,Blue Moon Bay - Full Course,Alex Hoyle,Dodge - Challenger SRT Demon 18,Road,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-143,06/12/2024,Season 6,Round 3,Race 2,American Speedway Series,Individual,,Blue Moon Bay - Full Course,Conor Roberts,Dodge - Challenger SRT Demon 18,Road,2,4,,,12,5,,0,17,-2,,,,No
GT-143,06/12/2024,Season 6,Round 3,Race 2,American Speedway Series,Individual,,Blue Moon Bay - Full Course,Harry Richards,Dodge - Challenger SRT Demon 18,Road,5,5,,,10,2,,0,12,0,,,,No
GT-143,06/12/2024,Season 6,Round 3,Race 2,American Speedway Series,Individual,,Blue Moon Bay - Full Course,Joe McGhee,Dodge - Challenger SRT Demon 18,Road,3,2,,,18,4,,0,22,1,,,,No
GT-143,06/12/2024,Season 6,Round 3,Race 2,American Speedway Series,Individual,,Blue Moon Bay - Full Course,Lawrence Parker,Dodge - Challenger SRT Demon 18,Road,1,1,,,25,6,,0,31,0,,,,No
GT-143,06/12/2024,Season 6,Round 3,Race 2,American Speedway Series,Individual,,Blue Moon Bay - Full Course,Liam England,Dodge - Challenger SRT Demon 18,Road,4,3,FL,,15,3,1,0,19,1,,,,No
GT-144,26/11/2024,Season 6,Round 3,Race 3,Ford vs Ferrari,Team Race,Team Ford,Circuit de Spa-Francorchamps - Full Course,Alex Hoyle,Ford GT Race Car 18,GT3,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-144,26/11/2024,Season 6,Round 3,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Circuit de Spa-Francorchamps - Full Course,Conor Roberts,Ferrari - 458 Italia GT3 13,GT3,4,4,,,12,3,,0,15,0,,,,No
GT-144,26/11/2024,Season 6,Round 3,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Circuit de Spa-Francorchamps - Full Course,Harry Richards,Ferrari - 458 Italia GT3 13,GT3,1,1,FL,,25,6,1,0,32,0,,,,No
GT-144,26/11/2024,Season 6,Round 3,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Circuit de Spa-Francorchamps - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,GT3,5,5,,,10,2,,0,12,0,,,,No
GT-144,26/11/2024,Season 6,Round 3,Race 3,Ford vs Ferrari,Team Race,Team Ford,Circuit de Spa-Francorchamps - Full Course,Lawrence Parker,Ford GT Race Car 18,GT3,2,3,,,15,5,,0,20,-1,,,,No
GT-144,26/11/2024,Season 6,Round 3,Race 3,Ford vs Ferrari,Team Race,Team Ford,Circuit de Spa-Francorchamps - Full Course,Liam England,Ford GT Race Car 18,GT3,3,2,,,18,4,,0,22,1,,,,No
GT-145,06/12/2024,Season 6,Round 4,Race 1,Rainmaster (Karts),Individual,,Tokyo - Central Clockwise,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,DNS,DNS,,,0,0,,0,0,0,,,Dry/Wet,No
GT-145,06/12/2024,Season 6,Round 4,Race 1,Rainmaster (Karts),Individual,,Tokyo - Central Clockwise,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,3,4,,,12,4,,0,16,-1,,,Dry/Wet,No
GT-145,06/12/2024,Season 6,Round 4,Race 1,Rainmaster (Karts),Individual,,Tokyo - Central Clockwise,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,5,3,,,15,2,,0,17,2,,,Dry/Wet,No
GT-145,06/12/2024,Season 6,Round 4,Race 1,Rainmaster (Karts),Individual,,Tokyo - Central Clockwise,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,4,5,,,10,3,,0,13,-1,,,Dry/Wet,No
GT-145,06/12/2024,Season 6,Round 4,Race 1,Rainmaster (Karts),Individual,,Tokyo - Central Clockwise,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,2,2,FL,,18,5,1,0,24,0,,,Dry/Wet,No
GT-145,06/12/2024,Season 6,Round 4,Race 1,Rainmaster (Karts),Individual,,Tokyo - Central Clockwise,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,1,1,,,25,6,,0,31,0,,,Dry/Wet,No
GT-146,06/12/2024,Season 6,Round 4,Race 2,American Speedway Series,Individual,,BB Raceway - Full Course,Alex Hoyle,Dodge - Challenger SRT Demon 18,Road,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-146,06/12/2024,Season 6,Round 4,Race 2,American Speedway Series,Individual,,BB Raceway - Full Course,Conor Roberts,Dodge - Challenger SRT Demon 18,Road,3,4,,,12,4,,0,16,-1,,,,No
GT-146,06/12/2024,Season 6,Round 4,Race 2,American Speedway Series,Individual,,BB Raceway - Full Course,Harry Richards,Dodge - Challenger SRT Demon 18,Road,5,5,,,10,2,,0,12,0,,,,No
GT-146,06/12/2024,Season 6,Round 4,Race 2,American Speedway Series,Individual,,BB Raceway - Full Course,Joe McGhee,Dodge - Challenger SRT Demon 18,Road,4,3,,,15,3,,0,18,1,,,,No
GT-146,06/12/2024,Season 6,Round 4,Race 2,American Speedway Series,Individual,,BB Raceway - Full Course,Lawrence Parker,Dodge - Challenger SRT Demon 18,Road,2,2,,,18,5,,0,23,0,,,,No
GT-146,06/12/2024,Season 6,Round 4,Race 2,American Speedway Series,Individual,,BB Raceway - Full Course,Liam England,Dodge - Challenger SRT Demon 18,Road,1,1,FL,,25,6,1,0,32,0,,,,No
GT-147,06/12/2024,Season 6,Round 4,Race 3,Ford vs Ferrari,Team Race,Team Ford,Red Bull Ring - Full Course,Alex Hoyle,Ford GT Race Car '18,GT3,DNS,DNS,,,0,0,,0,0,0,,,Wet/Dry,No
GT-147,06/12/2024,Season 6,Round 4,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Red Bull Ring - Full Course,Conor Roberts,Ferrari - 458 Italia GT3 13,GT3,5,4,,,12,2,,0,14,1,,,Wet/Dry,No
GT-147,06/12/2024,Season 6,Round 4,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Red Bull Ring - Full Course,Harry Richards,Ferrari - 458 Italia GT3 13,GT3,2,2,,,18,5,,0,23,0,,,Wet/Dry,No
GT-147,06/12/2024,Season 6,Round 4,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Red Bull Ring - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,GT3,1,5,,,10,6,,0,16,-4,,,Wet/Dry,No
GT-147,06/12/2024,Season 6,Round 4,Race 3,Ford vs Ferrari,Team Race,Team Ford,Red Bull Ring - Full Course,Lawrence Parker,Ford GT Race Car 18,GT3,4,1,FL,1,25,3,1,-10,19,3,,,Wet/Dry,No
GT-147,06/12/2024,Season 6,Round 4,Race 3,Ford vs Ferrari,Team Race,Team Ford,Red Bull Ring - Full Course,Liam England,Ford GT Race Car '18,GT3,3,3,,,15,4,,0,19,0,,,Wet/Dry,No
GT-148,20/12/2024,Season 6,Round 5,Race 1,Rainmaster (Karts),Individual,,Nürburgring - Sprint,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,DNS,DNS,,,0,0,,0,0,0,,,Dry/Wet,No
GT-148,20/12/2024,Season 6,Round 5,Race 1,Rainmaster (Karts),Individual,,Nürburgring - Sprint,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,4,3,,,15,3,,0,18,1,,,Dry/Wet,No
GT-148,20/12/2024,Season 6,Round 5,Race 1,Rainmaster (Karts),Individual,,Nürburgring - Sprint,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,5,5,,,10,2,,0,12,0,,,Dry/Wet,No
GT-148,20/12/2024,Season 6,Round 5,Race 1,Rainmaster (Karts),Individual,,Nürburgring - Sprint,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,3,4,,,12,4,,0,16,-1,,,Dry/Wet,No
GT-148,20/12/2024,Season 6,Round 5,Race 1,Rainmaster (Karts),Individual,,Nürburgring - Sprint,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,1,1,,,25,6,,0,31,0,,,Dry/Wet,No
GT-148,20/12/2024,Season 6,Round 5,Race 1,Rainmaster (Karts),Individual,,Nürburgring - Sprint,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,2,2,FL,,18,5,1,0,24,0,,,Dry/Wet,No
GT-149,20/12/2024,Season 6,Round 5,Race 2,American Speedway Series,Individual,,BB Raceway - Full Course,Alex Hoyle,Dodge - Challenger SRT Demon 18,Road,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-149,20/12/2024,Season 6,Round 5,Race 2,American Speedway Series,Individual,,BB Raceway - Full Course,Conor Roberts,Dodge - Challenger SRT Demon 18,Road,5,3,,,15,2,,0,17,2,,,,No
GT-149,20/12/2024,Season 6,Round 5,Race 2,American Speedway Series,Individual,,BB Raceway - Full Course,Harry Richards,Dodge - Challenger SRT Demon 18,Road,3,5,,,10,4,,0,14,-2,,,,No
GT-149,20/12/2024,Season 6,Round 5,Race 2,American Speedway Series,Individual,,BB Raceway - Full Course,Joe McGhee,Dodge - Challenger SRT Demon 18,Road,2,2,,,18,5,,0,23,0,,,,No
GT-149,20/12/2024,Season 6,Round 5,Race 2,American Speedway Series,Individual,,BB Raceway - Full Course,Lawrence Parker,Dodge - Challenger SRT Demon 18,Road,4,1,,,25,3,,0,28,3,,,,No
GT-149,20/12/2024,Season 6,Round 5,Race 2,American Speedway Series,Individual,,BB Raceway - Full Course,Liam England,Dodge - Challenger SRT Demon 18,Road,1,4,FL,1,12,6,1,-10,9,-3,,,,No
GT-150,20/12/2024,Season 6,Round 5,Race 3,Ford vs Ferrari,Team Race,Team Ford,Le Mans - Full Course,Alex Hoyle,Ford GT Race Car '18,GT3,DNS,DNS,,,0,0,,0,0,0,,,Wet/Dry,No
GT-150,20/12/2024,Season 6,Round 5,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Le Mans - Full Course,Conor Roberts,Ferrari - 458 Italia GT3 13,GT3,4,5,,1,10,3,,-10,3,-1,,,Wet/Dry,No
GT-150,20/12/2024,Season 6,Round 5,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Le Mans - Full Course,Harry Richards,Ferrari - 458 Italia GT3 13,GT3,1,2,,,18,6,,0,24,-1,,,Wet/Dry,No
GT-150,20/12/2024,Season 6,Round 5,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Le Mans - Full Course,Joe McGhee,Ferrari - 458 Italia GT3 13,GT3,3,1,,,25,4,,0,29,2,,,Wet/Dry,No
GT-150,20/12/2024,Season 6,Round 5,Race 3,Ford vs Ferrari,Team Race,Team Ford,Le Mans - Full Course,Lawrence Parker,Ford GT Race Car 18,GT3,5,3,FL,,15,2,1,0,18,2,,,Wet/Dry,No
GT-150,20/12/2024,Season 6,Round 5,Race 3,Ford vs Ferrari,Team Race,Team Ford,Le Mans - Full Course,Liam England,Ford GT Race Car '18,GT3,2,4,,,12,5,,0,17,-2,,,Wet/Dry,No
GT-151,20/12/2024,Season 6,Round 6,Race 1,Rainmaster (Karts),Individual,,Tsukuba - Full Course,Alex Hoyle,Gran Turismo - Racing Kart 125 Shifter,Kart,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-151,20/12/2024,Season 6,Round 6,Race 1,Rainmaster (Karts),Individual,,Tsukuba - Full Course,Conor Roberts,Gran Turismo - Racing Kart 125 Shifter,Kart,2,5,,,10,5,,0,15,-3,,,,No
GT-151,20/12/2024,Season 6,Round 6,Race 1,Rainmaster (Karts),Individual,,Tsukuba - Full Course,Harry Richards,Gran Turismo - Racing Kart 125 Shifter,Kart,3,2,,,18,4,,0,22,1,,,,No
GT-151,20/12/2024,Season 6,Round 6,Race 1,Rainmaster (Karts),Individual,,Tsukuba - Full Course,Joe McGhee,Gran Turismo - Racing Kart 125 Shifter,Kart,5,3,,,15,2,,0,17,2,,,,No
GT-151,20/12/2024,Season 6,Round 6,Race 1,Rainmaster (Karts),Individual,,Tsukuba - Full Course,Lawrence Parker,Gran Turismo - Racing Kart 125 Shifter,Kart,4,1,FL,,25,3,1,0,29,3,,,,No
GT-151,20/12/2024,Season 6,Round 6,Race 1,Rainmaster (Karts),Individual,,Tsukuba - Full Course,Liam England,Gran Turismo - Racing Kart 125 Shifter,Kart,1,4,,,12,6,,0,18,-3,,,,No
GT-152,20/12/2024,Season 6,Round 6,Race 2,American Speedway Series,Individual,,Blue Moon Bay - Full Course,Alex Hoyle,Dodge - Challenger SRT Demon 18,Road,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-152,20/12/2024,Season 6,Round 6,Race 2,American Speedway Series,Individual,,Blue Moon Bay - Full Course,Conor Roberts,Dodge - Challenger SRT Demon 18,Road,1,3,,,15,6,,0,21,-2,,,,No
GT-152,20/12/2024,Season 6,Round 6,Race 2,American Speedway Series,Individual,,Blue Moon Bay - Full Course,Harry Richards,Dodge - Challenger SRT Demon 18,Road,4,5,FL,,10,3,1,0,14,-1,,,,No
GT-152,20/12/2024,Season 6,Round 6,Race 2,American Speedway Series,Individual,,Blue Moon Bay - Full Course,Joe McGhee,Dodge - Challenger SRT Demon 18,Road,2,1,,,25,5,,0,30,1,,,,No
GT-152,20/12/2024,Season 6,Round 6,Race 2,American Speedway Series,Individual,,Blue Moon Bay - Full Course,Lawrence Parker,Dodge - Challenger SRT Demon 18,Road,5,2,,,18,2,,0,20,3,,,,No
GT-152,20/12/2024,Season 6,Round 6,Race 2,American Speedway Series,Individual,,Blue Moon Bay - Full Course,Liam England,Dodge - Challenger SRT Demon 18,Road,3,4,,,12,4,,0,16,-1,,,,No
GT-153,20/12/2024,Season 6,Round 6,Race 3,Ford vs Ferrari,Team Race,Team Ford,Daytona - Road Course,Alex Hoyle,Ford GT Race Car '18,Gr.3,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-153,20/12/2024,Season 6,Round 6,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Daytona - Road Course,Conor Roberts,Ferrari - 458 Italia GT3 13,Gr.3,5,5,,1,10,2,,-10,2,0,,,,No
GT-153,20/12/2024,Season 6,Round 6,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Daytona - Road Course,Harry Richards,Ferrari - 458 Italia GT3 13,Gr.3,1,3,,,15,6,,0,21,-2,,,,No
GT-153,20/12/2024,Season 6,Round 6,Race 3,Ford vs Ferrari,Team Race,Team Ferrari,Daytona - Road Course,Joe McGhee,Ferrari - 458 Italia GT3 13,Gr.3,4,4,,,12,3,,0,15,0,,,,No
GT-153,20/12/2024,Season 6,Round 6,Race 3,Ford vs Ferrari,Team Race,Team Ford,Daytona - Road Course,Lawrence Parker,Ford GT Race Car 18,Gr.3,3,1,FL,,25,4,1,0,30,2,,,,No
GT-153,20/12/2024,Season 6,Round 6,Race 3,Ford vs Ferrari,Team Race,Team Ford,Daytona - Road Course,Liam England,Ford GT Race Car '18,Gr.3,2,2,,,18,5,,0,23,0,,,,No
GT-154,10/01/2025,Season 7,Round 1,Race 1,Megane Cup,Individual,,Road Atlanta - Full Course,Alex Hoyle,Renault - Mégane R.S. Trophy '11,Gr.4,5,2,FL,,18,2,1,0,21,3,,,,No
GT-154,10/01/2025,Season 7,Round 1,Race 1,Megane Cup,Individual,,Road Atlanta - Full Course,Conor Roberts,Renault - Mégane R.S. Trophy '11,Gr.4,6,6,,,8,1,,0,9,0,,,,No
GT-154,10/01/2025,Season 7,Round 1,Race 1,Megane Cup,Individual,,Road Atlanta - Full Course,Harry Richards,Renault - Mégane R.S. Trophy '11,Gr.4,2,1,,,25,5,,0,30,1,,,,No
GT-154,10/01/2025,Season 7,Round 1,Race 1,Megane Cup,Individual,,Road Atlanta - Full Course,Joe McGhee,Renault - Mégane R.S. Trophy '11,Gr.4,4,5,,,10,3,,0,13,-1,,,,No
GT-154,10/01/2025,Season 7,Round 1,Race 1,Megane Cup,Individual,,Road Atlanta - Full Course,Lawrence Parker,Renault - Mégane R.S. Trophy '11,Gr.4,1,4,,1,12,6,,-10,8,-3,,,,No
GT-154,10/01/2025,Season 7,Round 1,Race 1,Megane Cup,Individual,,Road Atlanta - Full Course,Liam England,Renault - Mégane R.S. Trophy '11,Gr.4,3,3,,,15,4,,0,19,0,,,,No
GT-155,10/01/2025,Season 7,Round 1,Race 2,Megane Cup,Individual,,Road Atlanta - Full Course,Alex Hoyle,Renault - Mégane R.S. Trophy '11,Gr.4,6,1,FL,,25,,1,0,26,5,,,,Yes
GT-155,10/01/2025,Season 7,Round 1,Race 2,Megane Cup,Individual,,Road Atlanta - Full Course,Conor Roberts,Renault - Mégane R.S. Trophy '11,Gr.4,1,6,,,8,,,0,8,-5,,,,Yes
GT-155,10/01/2025,Season 7,Round 1,Race 2,Megane Cup,Individual,,Road Atlanta - Full Course,Harry Richards,Renault - Mégane R.S. Trophy '11,Gr.4,4,3,,,15,,,0,15,1,,,,Yes
GT-155,10/01/2025,Season 7,Round 1,Race 2,Megane Cup,Individual,,Road Atlanta - Full Course,Joe McGhee,Renault - Mégane R.S. Trophy '11,Gr.4,2,5,,,10,,,0,10,-3,,,,Yes
GT-155,10/01/2025,Season 7,Round 1,Race 2,Megane Cup,Individual,,Road Atlanta - Full Course,Lawrence Parker,Renault - Mégane R.S. Trophy '11,Gr.4,5,2,,,18,,,0,18,3,,,,Yes
GT-155,10/01/2025,Season 7,Round 1,Race 2,Megane Cup,Individual,,Road Atlanta - Full Course,Liam England,Renault - Mégane R.S. Trophy '11,Gr.4,3,4,,,12,,,0,12,-1,,,,Yes
GT-156,17/01/2025,Season 7,Round 2,Race 1,Megane Cup,Individual,,Watkins Glen - Short Course,Alex Hoyle,Renault - Mégane R.S. Trophy '11,Gr.4,2,3,,,15,5,,0,20,-1,,,,No
GT-156,17/01/2025,Season 7,Round 2,Race 1,Megane Cup,Individual,,Watkins Glen - Short Course,Conor Roberts,Renault - Mégane R.S. Trophy '11,Gr.4,5,6,,,8,2,,0,10,-1,,,,No
GT-156,17/01/2025,Season 7,Round 2,Race 1,Megane Cup,Individual,,Watkins Glen - Short Course,Harry Richards,Renault - Mégane R.S. Trophy '11,Gr.4,6,4,,,12,1,,0,13,2,,,,No
GT-156,17/01/2025,Season 7,Round 2,Race 1,Megane Cup,Individual,,Watkins Glen - Short Course,Joe McGhee,Renault - Mégane R.S. Trophy '11,Gr.4,1,5,,,10,6,,0,16,-4,,,,No
GT-156,17/01/2025,Season 7,Round 2,Race 1,Megane Cup,Individual,,Watkins Glen - Short Course,Lawrence Parker,Renault - Mégane R.S. Trophy '11,Gr.4,3,2,FL,,18,4,1,0,23,1,,,,No
GT-156,17/01/2025,Season 7,Round 2,Race 1,Megane Cup,Individual,,Watkins Glen - Short Course,Liam England,Renault - Mégane R.S. Trophy '11,Gr.4,4,1,,,25,3,,0,28,3,,,,No
GT-157,17/01/2025,Season 7,Round 2,Race 2,Megane Cup,Individual,,Watkins Glen - Short Course,Alex Hoyle,Renault - Mégane R.S. Trophy '11,Gr.4,3,4,,,12,,,0,12,-1,,,,Yes
GT-157,17/01/2025,Season 7,Round 2,Race 2,Megane Cup,Individual,,Watkins Glen - Short Course,Conor Roberts,Renault - Mégane R.S. Trophy '11,Gr.4,4,3,,,15,,,0,15,1,,,,Yes
GT-157,17/01/2025,Season 7,Round 2,Race 2,Megane Cup,Individual,,Watkins Glen - Short Course,Harry Richards,Renault - Mégane R.S. Trophy '11,Gr.4,6,1,,,25,,,0,25,5,,,,Yes
GT-157,17/01/2025,Season 7,Round 2,Race 2,Megane Cup,Individual,,Watkins Glen - Short Course,Joe McGhee,Renault - Mégane R.S. Trophy '11,Gr.4,1,6,,,8,,,0,8,-5,,,,Yes
GT-157,17/01/2025,Season 7,Round 2,Race 2,Megane Cup,Individual,,Watkins Glen - Short Course,Lawrence Parker,Renault - Mégane R.S. Trophy '11,Gr.4,2,5,FL,,10,,1,0,11,-3,,,,Yes
GT-157,17/01/2025,Season 7,Round 2,Race 2,Megane Cup,Individual,,Watkins Glen - Short Course,Liam England,Renault - Mégane R.S. Trophy '11,Gr.4,5,2,,,18,,,0,18,3,,,,Yes
GT-158,22/01/2025,Season 7,Round 3,Race 1,Megane Cup,Individual,,Brands Hatch - Indy Circuit,Alex Hoyle,Renault - Mégane R.S. Trophy '11,Gr.4,DNS,DNS,,,0,0,,0,0,0,,,,No
GT-158,22/01/2025,Season 7,Round 3,Race 1,Megane Cup,Individual,,Brands Hatch - Indy Circuit,Conor Roberts,Renault - Mégane R.S. Trophy '11,Gr.4,5,4,,,12,2,,0,14,1,,,,No
GT-158,22/01/2025,Season 7,Round 3,Race 1,Megane Cup,Individual,,Brands Hatch - Indy Circuit,Harry Richards,Renault - Mégane R.S. Trophy '11,Gr.4,2,2,,,18,5,,0,23,0,,,,No
GT-158,22/01/2025,Season 7,Round 3,Race 1,Megane Cup,Individual,,Brands Hatch - Indy Circuit,Joe McGhee,Renault - Mégane R.S. Trophy '11,Gr.4,4,5,,,10,3,,0,13,-1,,,,No
GT-158,22/01/2025,Season 7,Round 3,Race 1,Megane Cup,Individual,,Brands Hatch - Indy Circuit,Lawrence Parker,Renault - Mégane R.S. Trophy '11,Gr.4,1,1,FL,,25,6,1,0,32,0,,,,No
GT-158,22/01/2025,Season 7,Round 3,Race 1,Megane Cup,Individual,,Brands Hatch - Indy Circuit,Liam England,Renault - Mégane R.S. Trophy '11,Gr.4,3,3,,,15,4,,0,19,0,,,,No
GT-159,22/01/2025,Season 7,Round 3,Race 2,Megane Cup,Individual,,Brands Hatch - Indy Circuit,Alex Hoyle,Renault - Mégane R.S. Trophy '11,Gr.4,DNS,DNS,,,0,,,0,0,0,,,,Yes
GT-159,22/01/2025,Season 7,Round 3,Race 2,Megane Cup,Individual,,Brands Hatch - Indy Circuit,Conor Roberts,Renault - Mégane R.S. Trophy '11,Gr.4,3,4,,,12,,,0,12,-1,,,,Yes
GT-159,22/01/2025,Season 7,Round 3,Race 2,Megane Cup,Individual,,Brands Hatch - Indy Circuit,Harry Richards,Renault - Mégane R.S. Trophy '11,Gr.4,5,2,,,18,,,0,18,3,,,,Yes
GT-159,22/01/2025,Season 7,Round 3,Race 2,Megane Cup,Individual,,Brands Hatch - Indy Circuit,Joe McGhee,Renault - Mégane R.S. Trophy '11,Gr.4,2,5,,,10,,,0,10,-3,,,,Yes
GT-159,22/01/2025,Season 7,Round 3,Race 2,Megane Cup,Individual,,Brands Hatch - Indy Circuit,Lawrence Parker,Renault - Mégane R.S. Trophy '11,Gr.4,6,1,FL,1,25,,1,-10,16,5,,,,Yes
GT-159,22/01/2025,Season 7,Round 3,Race 2,Megane Cup,Individual,,Brands Hatch - Indy Circuit,Liam England,Renault - Mégane R.S. Trophy '11,Gr.4,4,3,,,15,,,0,15,1,,,,Yes
GT-160,28/01/2025,Season 7,Round 4,Race 1,Megane Cup,Individual,,Goodwood - Full Course,Alex Hoyle,Renault - Mégane R.S. Trophy '11,Gr.4,3,5,,,10,4,,0,14,-2,,,,No
GT-160,28/01/2025,Season 7,Round 4,Race 1,Megane Cup,Individual,,Goodwood - Full Course,Conor Roberts,Renault - Mégane R.S. Trophy '11,Gr.4,6,4,,,12,1,,0,13,2,,,,No
GT-160,28/01/2025,Season 7,Round 4,Race 1,Megane Cup,Individual,,Goodwood - Full Course,Harry Richards,Renault - Mégane R.S. Trophy '11,Gr.4,2,2,,,18,5,,0,23,0,,,,No
GT-160,28/01/2025,Season 7,Round 4,Race 1,Megane Cup,Individual,,Goodwood - Full Course,Joe McGhee,Renault - Mégane R.S. Trophy '11,Gr.4,5,6,,,8,2,,0,10,-1,,,,No
GT-160,28/01/2025,Season 7,Round 4,Race 1,Megane Cup,Individual,,Goodwood - Full Course,Lawrence Parker,Renault - Mégane R.S. Trophy '11,Gr.4,1,1,FL,,25,6,1,0,32,0,,,,No
GT-160,28/01/2025,Season 7,Round 4,Race 1,Megane Cup,Individual,,Goodwood - Full Course,Liam England,Renault - Mégane R.S. Trophy '11,Gr.4,4,3,,,15,3,,0,18,1,,,,No
GT-161,28/01/2025,Season 7,Round 4,Race 2,Megane Cup,Individual,,Goodwood - Full Course,Alex Hoyle,Renault - Mégane R.S. Trophy '11,Gr.4,5,2,,,18,,,0,18,3,,,,Yes
GT-161,28/01/2025,Season 7,Round 4,Race 2,Megane Cup,Individual,,Goodwood - Full Course,Conor Roberts,Renault - Mégane R.S. Trophy '11,Gr.4,2,5,,,10,,,0,10,-3,,,,Yes
GT-161,28/01/2025,Season 7,Round 4,Race 2,Megane Cup,Individual,,Goodwood - Full Course,Harry Richards,Renault - Mégane R.S. Trophy '11,Gr.4,4,3,,,15,,,0,15,1,,,,Yes
GT-161,28/01/2025,Season 7,Round 4,Race 2,Megane Cup,Individual,,Goodwood - Full Course,Joe McGhee,Renault - Mégane R.S. Trophy '11,Gr.4,DNS,DNS,,1,0,,,-10,0,0,,,,Yes
GT-161,28/01/2025,Season 7,Round 4,Race 2,Megane Cup,Individual,,Goodwood - Full Course,Lawrence Parker,Renault - Mégane R.S. Trophy '11,Gr.4,6,1,FL,,25,,1,0,26,5,,,,Yes
GT-161,28/01/2025,Season 7,Round 4,Race 2,Megane Cup,Individual,,Goodwood - Full Course,Liam England,Renault - Mégane R.S. Trophy '11,Gr.4,3,4,,,12,,,0,12,-1,,,,Yes
GT-162,04/02/2025,Season 7,Round 5,Race 1,Megane Cup,Individual,,Barcelona - National Layout,Alex Hoyle,Renault - Mégane R.S. Trophy '11,Gr.4,3,6,,,8,4,,0,12,-3,,,,No
GT-162,04/02/2025,Season 7,Round 5,Race 1,Megane Cup,Individual,,Barcelona - National Layout,Conor Roberts,Renault - Mégane R.S. Trophy '11,Gr.4,5,5,,,10,2,,0,12,0,,,,No
GT-162,04/02/2025,Season 7,Round 5,Race 1,Megane Cup,Individual,,Barcelona - National Layout,Harry Richards,Renault - Mégane R.S. Trophy '11,Gr.4,2,2,,,18,5,,0,23,0,,,,No
GT-162,04/02/2025,Season 7,Round 5,Race 1,Megane Cup,Individual,,Barcelona - National Layout,Joe McGhee,Renault - Mégane R.S. Trophy '11,Gr.4,4,4,,,12,3,,0,15,0,,,,No
GT-162,04/02/2025,Season 7,Round 5,Race 1,Megane Cup,Individual,,Barcelona - National Layout,Lawrence Parker,Renault - Mégane R.S. Trophy '11,Gr.4,1,1,FL,,25,6,1,0,32,0,,,,No
GT-162,04/02/2025,Season 7,Round 5,Race 1,Megane Cup,Individual,,Barcelona - National Layout,Liam England,Renault - Mégane R.S. Trophy '11,Gr.4,6,3,,,15,1,,0,16,3,,,,No
GT-163,04/02/2025,Season 7,Round 5,Race 2,Megane Cup,Individual,,Barcelona - National Layout,Alex Hoyle,Renault - Mégane R.S. Trophy '11,Gr.4,2,5,FL,,10,,1,0,11,-3,,,,Yes
GT-163,04/02/2025,Season 7,Round 5,Race 2,Megane Cup,Individual,,Barcelona - National Layout,Conor Roberts,Renault - Mégane R.S. Trophy '11,Gr.4,3,4,,,12,,,0,12,-1,,,,Yes
GT-163,04/02/2025,Season 7,Round 5,Race 2,Megane Cup,Individual,,Barcelona - National Layout,Harry Richards,Renault - Mégane R.S. Trophy '11,Gr.4,6,1,,,25,,,0,25,5,,,,Yes
GT-163,04/02/2025,Season 7,Round 5,Race 2,Megane Cup,Individual,,Barcelona - National Layout,Joe McGhee,Renault - Mégane R.S. Trophy '11,Gr.4,1,6,,,8,,,0,8,-5,,,,Yes
GT-163,04/02/2025,Season 7,Round 5,Race 2,Megane Cup,Individual,,Barcelona - National Layout,Lawrence Parker,Renault - Mégane R.S. Trophy '11,Gr.4,5,2,,,18,,,0,18,3,,,,Yes
GT-163,04/02/2025,Season 7,Round 5,Race 2,Megane Cup,Individual,,Barcelona - National Layout,Liam England,Renault - Mégane R.S. Trophy '11,Gr.4,4,3,,,15,,,0,15,1,,,,Yes
GT-164,19/02/2025,Season 7,Round 6,Race 1,Megane Cup,Individual,,Red Bull Ring - Short Track,Alex Hoyle,Renault - Mégane R.S. Trophy '11,Gr.4,1,3,FL,,15,6,1,0,22,-2,,,,No
GT-164,19/02/2025,Season 7,Round 6,Race 1,Megane Cup,Individual,,Red Bull Ring - Short Track,Conor Roberts,Renault - Mégane R.S. Trophy '11,Gr.4,5,6,,,8,2,,0,10,-1,,,,No
GT-164,19/02/2025,Season 7,Round 6,Race 1,Megane Cup,Individual,,Red Bull Ring - Short Track,Harry Richards,Renault - Mégane R.S. Trophy '11,Gr.4,3,2,,,18,4,,0,22,1,,,,No
GT-164,19/02/2025,Season 7,Round 6,Race 1,Megane Cup,Individual,,Red Bull Ring - Short Track,Joe McGhee,Renault - Mégane R.S. Trophy '11,Gr.4,6,4,,,12,1,,0,13,2,,,,No
GT-164,19/02/2025,Season 7,Round 6,Race 1,Megane Cup,Individual,,Red Bull Ring - Short Track,Lawrence Parker,Renault - Mégane R.S. Trophy '11,Gr.4,2,1,,,25,5,,0,30,1,,,,No
GT-164,19/02/2025,Season 7,Round 6,Race 1,Megane Cup,Individual,,Red Bull Ring - Short Track,Liam England,Renault - Mégane R.S. Trophy '11,Gr.4,4,5,,,10,3,,0,13,-1,,,,No
GT-165,19/02/2025,Season 7,Round 6,Race 2,Megane Cup,Individual,,Red Bull Ring - Short Track,Alex Hoyle,Renault - Mégane R.S. Trophy '11,Gr.4,6,1,,,25,,,0,25,5,,,,Yes
GT-165,19/02/2025,Season 7,Round 6,Race 2,Megane Cup,Individual,,Red Bull Ring - Short Track,Conor Roberts,Renault - Mégane R.S. Trophy '11,Gr.4,3,4,,,12,,,0,12,-1,,,,Yes
GT-165,19/02/2025,Season 7,Round 6,Race 2,Megane Cup,Individual,,Red Bull Ring - Short Track,Harry Richards,Renault - Mégane R.S. Trophy '11,Gr.4,4,3,,,15,,,0,15,1,,,,Yes
GT-165,19/02/2025,Season 7,Round 6,Race 2,Megane Cup,Individual,,Red Bull Ring - Short Track,Joe McGhee,Renault - Mégane R.S. Trophy '11,Gr.4,1,6,,,8,,,0,8,-5,,,,Yes
GT-165,19/02/2025,Season 7,Round 6,Race 2,Megane Cup,Individual,,Red Bull Ring - Short Track,Lawrence Parker,Renault - Mégane R.S. Trophy '11,Gr.4,5,2,FL,,18,,1,0,19,3,,,,Yes
GT-165,19/02/2025,Season 7,Round 6,Race 2,Megane Cup,Individual,,Red Bull Ring - Short Track,Liam England,Renault - Mégane R.S. Trophy '11,Gr.4,2,5,,,10,,,0,10,-3,,,,Yes
GT-166,15/03/2025,Season 8,Round 1,Race 1,National Gr.4,Individual,,Kyoto - Miyabi,Alex Hoyle,Ferrari - 458 Italia Gr.4,Gr.4,1,2,FL,,18,6,1,0,25,-1,,,,No
GT-166,15/03/2025,Season 8,Round 1,Race 1,National Gr.4,Individual,,Kyoto - Miyabi,Conor Roberts,Porsche - Cayman GT4 Clubsport '16,Gr.4,5,1,,,25,2,,0,27,4,,,,No
GT-166,15/03/2025,Season 8,Round 1,Race 1,National Gr.4,Individual,,Kyoto - Miyabi,Harry Richards,Bugatti - Veyron Gr.4,Gr.4,4,5,,,10,3,,0,13,-1,,,,No
GT-166,15/03/2025,Season 8,Round 1,Race 1,National Gr.4,Individual,,Kyoto - Miyabi,Joe McGhee,Chevrolet - Corvette C7 Gr.4,Gr.4,3,4,,,12,4,,0,16,-1,,,,No
GT-166,15/03/2025,Season 8,Round 1,Race 1,National Gr.4,Individual,,Kyoto - Miyabi,Lawrence Parker,Hyundai - Genesis Gr.4,Gr.4,2,3,,,15,5,,0,20,-1,,,,No
GT-166,15/03/2025,Season 8,Round 1,Race 1,National Gr.4,Individual,,Kyoto - Miyabi,Liam England,McLaren - 650S GT3 '15,Gr.4,6,6,,,8,1,,0,9,0,,,,No
GT-167,15/03/2025,Season 8,Round 1,Race 2,National Gr.3,Individual,,Sainte-Croix - Layout A,Alex Hoyle,Ferrari - 458 Italia GT3 '13,Gr.4,1,4,FL,,12,6,1,0,19,-3,,,,No
GT-167,15/03/2025,Season 8,Round 1,Race 2,National Gr.3,Individual,,Sainte-Croix - Layout A,Conor Roberts,Porsche - 911 RSR (991) '17,Gr.4,3,3,,,15,4,,0,19,0,,,,No
GT-167,15/03/2025,Season 8,Round 1,Race 2,National Gr.3,Individual,,Sainte-Croix - Layout A,Harry Richards,Renault - R.S.01 GT3 '16,Gr.4,5,5,,,10,2,,0,12,0,,,,No
GT-167,15/03/2025,Season 8,Round 1,Race 2,National Gr.3,Individual,,Sainte-Croix - Layout A,Joe McGhee,Ford GT Race Car '18,Gr.4,2,2,,,18,5,,0,23,0,,,,No
GT-167,15/03/2025,Season 8,Round 1,Race 2,National Gr.3,Individual,,Sainte-Croix - Layout A,Lawrence Parker,Hyundai - Genesis Gr.3,Gr.4,4,1,,,25,3,,0,28,3,,,,No
GT-167,15/03/2025,Season 8,Round 1,Race 2,National Gr.3,Individual,,Sainte-Croix - Layout A,Liam England,McLaren - 650S GT3 '15,Gr.4,6,6,,,8,1,,0,9,0,,,,No
GT-168,17/03/2025,Season 8,Round 2,Race 1,National Gr.4,Individual,,Sardegna - Layout C,Alex Hoyle,Ferrari - 458 Italia Gr.4,Gr.4,2,1,,1,25,5,,-10,20,1,,,,No
GT-168,17/03/2025,Season 8,Round 2,Race 1,National Gr.4,Individual,,Sardegna - Layout C,Conor Roberts,Porsche - Cayman GT4 Clubsport '16,Gr.4,6,5,,,10,1,,0,11,1,,,,No
GT-168,17/03/2025,Season 8,Round 2,Race 1,National Gr.4,Individual,,Sardegna - Layout C,Harry Richards,Renault - Mégane Trophy '11,Gr.4,4,6,FL,,8,3,1,0,12,-2,,,,No
GT-168,17/03/2025,Season 8,Round 2,Race 1,National Gr.4,Individual,,Sardegna - Layout C,Joe McGhee,Chevrolet - Corvette C7 Gr.4,Gr.4,5,4,,,12,2,,0,14,1,,,,No
GT-168,17/03/2025,Season 8,Round 2,Race 1,National Gr.4,Individual,,Sardegna - Layout C,Lawrence Parker,Hyundai - Genesis Gr.4,Gr.4,1,3,,,15,6,,0,21,-2,,,,No
GT-168,17/03/2025,Season 8,Round 2,Race 1,National Gr.4,Individual,,Sardegna - Layout C,Liam England,McLaren - 650S GT3 '15,Gr.4,3,2,,,18,4,,0,22,1,,,,No
GT-169,17/03/2025,Season 8,Round 2,Race 2,National Gr.3,Individual,,Lago Maggiore - West,Alex Hoyle,Ferrari - 458 Italia Gr.4,Gr.4,3,6,FL,,8,4,1,0,13,-3,,,,No
GT-169,17/03/2025,Season 8,Round 2,Race 2,National Gr.3,Individual,,Lago Maggiore - West,Conor Roberts,Porsche - Cayman GT4 Clubsport '16,Gr.4,4,3,,,15,3,,0,18,1,,,,No
GT-169,17/03/2025,Season 8,Round 2,Race 2,National Gr.3,Individual,,Lago Maggiore - West,Harry Richards,Renault - Mégane Trophy '11,Gr.4,5,2,,,18,2,,0,20,3,,,,No
GT-169,17/03/2025,Season 8,Round 2,Race 2,National Gr.3,Individual,,Lago Maggiore - West,Joe McGhee,Chevrolet - Corvette C7 Gr.4,Gr.4,6,4,,,12,1,,0,13,2,,,,No
GT-169,17/03/2025,Season 8,Round 2,Race 2,National Gr.3,Individual,,Lago Maggiore - West,Lawrence Parker,Hyundai - Genesis Gr.4,Gr.4,1,5,,,10,6,,0,16,-4,,,,No
GT-169,17/03/2025,Season 8,Round 2,Race 2,National Gr.3,Individual,,Lago Maggiore - West,Liam England,McLaren - 650S GT3 '15,Gr.4,2,1,,,25,5,,0,30,1,,,,No
GT-170,02/04/2025,Season 8,Round 3,Race 1,National Gr.4,Individual,,Dragon Trail - Gardens,Alex Hoyle,Ferrari - 458 Italia Gr.4,Gr.4,4,5,,1,10,3,,-10,3,-1,,,,No
GT-170,02/04/2025,Season 8,Round 3,Race 1,National Gr.4,Individual,,Dragon Trail - Gardens,Conor Roberts,Porsche - Cayman GT4 Clubsport '16,Gr.4,5,4,,,12,2,,0,14,1,,,,No
GT-170,02/04/2025,Season 8,Round 3,Race 1,National Gr.4,Individual,,Dragon Trail - Gardens,Harry Richards,Renault - Mégane Trophy '11,Gr.4,6,2,,,18,1,,0,19,4,,,,No
GT-170,02/04/2025,Season 8,Round 3,Race 1,National Gr.4,Individual,,Dragon Trail - Gardens,Joe McGhee,Chevrolet - Corvette C7 Gr.4,Gr.4,3,3,,,15,4,,0,19,0,,,,No
GT-170,02/04/2025,Season 8,Round 3,Race 1,National Gr.4,Individual,,Dragon Trail - Gardens,Lawrence Parker,Hyundai - Genesis Gr.4,Gr.4,1,1,FL,,25,6,1,0,32,0,,,,No
GT-170,02/04/2025,Season 8,Round 3,Race 1,National Gr.4,Individual,,Dragon Trail - Gardens,Liam England,McLaren - 650S GT3 '15,Gr.4,2,6,,,8,5,,0,13,-4,,,,No
GT-171,02/04/2025,Season 8,Round 3,Race 2,National Gr.3,Individual,,Blue Moon Bay - Infield A,Alex Hoyle,Ferrari - 458 Italia Gr.4,Gr.4,2,5,,,10,5,,0,15,-3,,,,No
GT-171,02/04/2025,Season 8,Round 3,Race 2,National Gr.3,Individual,,Blue Moon Bay - Infield A,Conor Roberts,Porsche - Cayman GT4 Clubsport '16,Gr.4,6,3,,,15,1,,0,16,3,,,,No
GT-171,02/04/2025,Season 8,Round 3,Race 2,National Gr.3,Individual,,Blue Moon Bay - Infield A,Harry Richards,Renault - Mégane Trophy '11,Gr.4,3,1,,,25,4,,0,29,2,,,,No
GT-171,02/04/2025,Season 8,Round 3,Race 2,National Gr.3,Individual,,Blue Moon Bay - Infield A,Joe McGhee,Chevrolet - Corvette C7 Gr.4,Gr.4,4,6,,,8,3,,0,11,-2,,,,No
GT-171,02/04/2025,Season 8,Round 3,Race 2,National Gr.3,Individual,,Blue Moon Bay - Infield A,Lawrence Parker,Hyundai - Genesis Gr.4,Gr.4,1,4,FL,,12,6,1,0,19,-3,,,,No
GT-171,02/04/2025,Season 8,Round 3,Race 2,National Gr.3,Individual,,Blue Moon Bay - Infield A,Liam England,McLaren - 650S GT3 '15,Gr.4,5,2,,,18,2,,0,20,3,,,,No
GT-172,09/04/2025,Season 8,Round 4,Race 1,National Gr.4,Individual,,Alsace - Village,Alex Hoyle,Ferrari - 458 Italia Gr.4,Gr.4,3,1,FL,,25,4,1,0,30,2,,,,No
GT-172,09/04/2025,Season 8,Round 4,Race 1,National Gr.4,Individual,,Alsace - Village,Conor Roberts,Porsche - Cayman GT4 Clubsport '16,Gr.4,5,4,,,12,2,,0,14,1,,,,No
GT-172,09/04/2025,Season 8,Round 4,Race 1,National Gr.4,Individual,,Alsace - Village,Harry Richards,Renault - Mégane Trophy '11,Gr.4,1,2,,,18,6,,0,24,-1,,,,No
GT-172,09/04/2025,Season 8,Round 4,Race 1,National Gr.4,Individual,,Alsace - Village,Joe McGhee,Chevrolet - Corvette C7 Gr.4,Gr.4,4,3,,,15,3,,0,18,1,,,,No
GT-172,09/04/2025,Season 8,Round 4,Race 1,National Gr.4,Individual,,Alsace - Village,Lawrence Parker,Hyundai - Genesis Gr.4,Gr.4,2,5,,,10,5,,0,15,-3,,,,No
GT-172,09/04/2025,Season 8,Round 4,Race 1,National Gr.4,Individual,,Alsace - Village,Liam England,McLaren - 650S GT3 '15,Gr.4,6,6,,,8,1,,0,9,0,,,,No
GT-173,09/04/2025,Season 8,Round 4,Race 2,National Gr.3,Individual,,Dragon Trail - Seaside,Alex Hoyle,Ferrari - 458 Italia Gr.4,Gr.4,1,2,,,18,6,,0,24,-1,,,,No
GT-173,09/04/2025,Season 8,Round 4,Race 2,National Gr.3,Individual,,Dragon Trail - Seaside,Conor Roberts,Porsche - Cayman GT4 Clubsport '16,Gr.4,3,1,,,25,4,,0,29,2,,,,No
GT-173,09/04/2025,Season 8,Round 4,Race 2,National Gr.3,Individual,,Dragon Trail - Seaside,Harry Richards,Renault - Mégane Trophy '11,Gr.4,4,6,,,8,3,,0,11,-2,,,,No
GT-173,09/04/2025,Season 8,Round 4,Race 2,National Gr.3,Individual,,Dragon Trail - Seaside,Joe McGhee,Chevrolet - Corvette C7 Gr.4,Gr.4,2,3,,,15,5,,0,20,-1,,,,No
GT-173,09/04/2025,Season 8,Round 4,Race 2,National Gr.3,Individual,,Dragon Trail - Seaside,Lawrence Parker,Hyundai - Genesis Gr.4,Gr.4,5,5,FL,1,10,2,1,-10,3,0,,,,No
GT-173,09/04/2025,Season 8,Round 4,Race 2,National Gr.3,Individual,,Dragon Trail - Seaside,Liam England,McLaren - 650S GT3 '15,Gr.4,6,4,,,12,1,,0,13,2,,,,No
GT-174,17/04/2025,Season 8,Round 5,Race 1,National Gr.4,Individual,,Eiger Nordwand - Full Course,Alex Hoyle,Ferrari - 458 Italia Gr.4,Gr.4,6,6,,,8,1,,0,9,0,,,,No
GT-174,17/04/2025,Season 8,Round 5,Race 1,National Gr.4,Individual,,Eiger Nordwand - Full Course,Conor Roberts,Porsche - Cayman GT4 Clubsport '16,Gr.4,2,2,,,18,5,,0,23,0,,,,No
GT-174,17/04/2025,Season 8,Round 5,Race 1,National Gr.4,Individual,,Eiger Nordwand - Full Course,Harry Richards,Renault - Mégane Trophy '11,Gr.4,1,1,FL,,25,6,1,0,32,0,,,,No
GT-174,17/04/2025,Season 8,Round 5,Race 1,National Gr.4,Individual,,Eiger Nordwand - Full Course,Joe McGhee,Chevrolet - Corvette C7 Gr.4,Gr.4,3,3,,,15,4,,0,19,0,,,,No
GT-174,17/04/2025,Season 8,Round 5,Race 1,National Gr.4,Individual,,Eiger Nordwand - Full Course,Lawrence Parker,Hyundai - Genesis Gr.4,Gr.4,4,4,,,12,3,,0,15,0,,,,No
GT-174,17/04/2025,Season 8,Round 5,Race 1,National Gr.4,Individual,,Eiger Nordwand - Full Course,Liam England,McLaren - 650S GT3 '15,Gr.4,5,5,,,10,2,,0,12,0,,,,No
GT-175,17/04/2025,Season 8,Round 5,Race 2,National Gr.3,Individual,,Kyoto - Yamagiwa,Alex Hoyle,Ferrari - 458 Italia Gr.4,Gr.4,6,6,,,8,1,,0,9,0,,,,No
GT-175,17/04/2025,Season 8,Round 5,Race 2,National Gr.3,Individual,,Kyoto - Yamagiwa,Conor Roberts,Porsche - Cayman GT4 Clubsport '16,Gr.4,3,4,,,12,4,,0,16,-1,,,,No
GT-175,17/04/2025,Season 8,Round 5,Race 2,National Gr.3,Individual,,Kyoto - Yamagiwa,Harry Richards,Renault - Mégane Trophy '11,Gr.4,5,3,,,15,2,,0,17,2,,,,No
GT-175,17/04/2025,Season 8,Round 5,Race 2,National Gr.3,Individual,,Kyoto - Yamagiwa,Joe McGhee,Chevrolet - Corvette C7 Gr.4,Gr.4,4,5,,,10,3,,0,13,-1,,,,No
GT-175,17/04/2025,Season 8,Round 5,Race 2,National Gr.3,Individual,,Kyoto - Yamagiwa,Lawrence Parker,Hyundai - Genesis Gr.4,Gr.4,1,1,FL,,25,6,1,0,32,0,,,,No
GT-175,17/04/2025,Season 8,Round 5,Race 2,National Gr.3,Individual,,Kyoto - Yamagiwa,Liam England,McLaren - 650S GT3 '15,Gr.4,2,2,,,18,5,,0,23,0,,,,No
GT-176,17/04/2025,Season 8,Round 6,Race 1,National Gr.4,Individual,,Road Atlanta - Full Course,Alex Hoyle,Ferrari - 458 Italia Gr.4,Gr.4,2,1,FL,,25,5,1,0,31,1,,,,No
GT-176,17/04/2025,Season 8,Round 6,Race 1,National Gr.4,Individual,,Road Atlanta - Full Course,Conor Roberts,Porsche - Cayman GT4 Clubsport '16,Gr.4,3,3,,,15,4,,0,19,0,,,,No
GT-176,17/04/2025,Season 8,Round 6,Race 1,National Gr.4,Individual,,Road Atlanta - Full Course,Harry Richards,Renault - Mégane Trophy '11,Gr.4,1,5,,,10,6,,0,16,-4,,,,No
GT-176,17/04/2025,Season 8,Round 6,Race 1,National Gr.4,Individual,,Road Atlanta - Full Course,Joe McGhee,Chevrolet - Corvette C7 Gr.4,Gr.4,6,6,,,8,1,,0,9,0,,,,No
GT-176,17/04/2025,Season 8,Round 6,Race 1,National Gr.4,Individual,,Road Atlanta - Full Course,Lawrence Parker,Hyundai - Genesis Gr.4,Gr.4,5,2,,,18,2,,0,20,3,,,,No
GT-176,17/04/2025,Season 8,Round 6,Race 1,National Gr.4,Individual,,Road Atlanta - Full Course,Liam England,McLaren - 650S GT3 '15,Gr.4,4,4,,,12,3,,0,15,0,,,,No
GT-177,17/04/2025,Season 8,Round 6,Race 2,National Gr.3,Individual,,Trial Mountain - Full Course,Alex Hoyle,Ferrari - 458 Italia Gr.4,Gr.4,1,1,FL,,25,6,1,0,32,0,,,,No
GT-177,17/04/2025,Season 8,Round 6,Race 2,National Gr.3,Individual,,Trial Mountain - Full Course,Conor Roberts,Porsche - Cayman GT4 Clubsport '16,Gr.4,4,3,,,15,3,,0,18,1,,,,No
GT-177,17/04/2025,Season 8,Round 6,Race 2,National Gr.3,Individual,,Trial Mountain - Full Course,Harry Richards,Renault - Mégane Trophy '11,Gr.4,3,2,,1,18,4,,-10,12,1,,,,No
GT-177,17/04/2025,Season 8,Round 6,Race 2,National Gr.3,Individual,,Trial Mountain - Full Course,Joe McGhee,Chevrolet - Corvette C7 Gr.4,Gr.4,6,6,,,8,1,,0,9,0,,,,No
GT-177,17/04/2025,Season 8,Round 6,Race 2,National Gr.3,Individual,,Trial Mountain - Full Course,Lawrence Parker,Hyundai - Genesis Gr.4,Gr.4,2,4,,,12,5,,0,17,-2,,,,No
GT-177,17/04/2025,Season 8,Round 6,Race 2,National Gr.3,Individual,,Trial Mountain - Full Course,Liam England,McLaren - 650S GT3 '15,Gr.4,5,5,,,10,2,,0,12,0,,,,No`;

/* ---------- CSV PARSING ---------- */
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  text = text.replace(/\r\n/g, "\n");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ""; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(cell => cell.trim() !== ""));
}

function num(v) {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

/* ---------- LOAD + TRANSFORM ---------- */
let RACES = []; // array of race result objects
let SEASONS = [];

async function loadData() {
  let text;
  if (/^https?:\/\//i.test(DATA_URL)) {
    const res = await fetch(DATA_URL);
    text = await res.text();
  } else {
    text = EMBEDDED_CSV;
  }
  const rows = parseCSV(text);
  const header = rows[0].map(h => h.trim());
  const idx = name => header.indexOf(name);

  const iDate = idx("Date"), iSeason = idx("Season"), iRound = idx("Round"),
        iRace = idx("Race"), iRaceName = idx("Race Name"), iTrack = idx("Track"),
        iDriver = idx("Driver"), iStart = idx("Start Pos"), iFinish = idx("Finish Pos"),
        iFL = idx("FL"), iTotal = idx("Total Points"), iPosDelta = idx("Pos +/-"),
        iPenalties = idx("Penalties"), iQualiPoints = idx("Quali Points"), iDeductions = idx("Deductions"),
        iReverseGrid = idx("Reverse Grid");

  RACES = rows.slice(1).map(r => ({
    date: r[iDate],
    season: r[iSeason],
    round: r[iRound],
    race: r[iRace],
    raceName: r[iRaceName],
    track: r[iTrack],
    driver: r[iDriver],
    start: r[iStart],
    finish: r[iFinish],
    fl: r[iFL] === "FL",
    points: num(r[iTotal]),
    posDelta: r[iPosDelta],
    penalties: (r[iPenalties] || "").trim(),
    qualiPoints: (r[iQualiPoints] || "").trim(),
    deductions: (r[iDeductions] || "").trim(),
    reverseGrid: (r[iReverseGrid] || "").trim().toLowerCase() === "yes"
  })).filter(r => r.driver && r.driver.trim() !== "");

  SEASONS = [...new Set(RACES.map(r => r.season))].sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, "")) || 0;
    const nb = parseInt(b.replace(/\D/g, "")) || 0;
    return na - nb;
  });
}

/* ---------- AGGREGATION ---------- */
function isFinisher(r) {
  return r.finish && r.finish !== "DNS" && r.finish !== "DNF" && !isNaN(parseInt(r.finish));
}

function parseDate(d) {
  if (!d) return null;
  const parts = d.split("/").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [day, month, year] = parts;
  return new Date(year, month - 1, day);
}

function computeStandingsFromRows(rows) {
  const byDriver = {};
  rows.forEach(r => {
    if (!byDriver[r.driver]) {
      byDriver[r.driver] = {
        driver: r.driver, points: 0, wins: 0, podiums: 0, poles: 0, fl: 0,
        starts: 0, finishes: 0, finishSum: 0,
        firstWinDate: null, firstWinRace: null, lastWinDate: null, lastWinRace: null
      };
    }
    const d = byDriver[r.driver];
    d.points += r.points;
    d.starts += 1;
    if (r.fl) d.fl += 1;
    if (r.start === "1" && !r.reverseGrid) d.poles += 1;
    if (isFinisher(r)) {
      const pos = parseInt(r.finish);
      d.finishes += 1;
      d.finishSum += pos;
      if (pos === 1) {
        d.wins += 1;
        const wd = parseDate(r.date);
        if (wd) {
          if (!d.firstWinDate || wd < d.firstWinDate) { d.firstWinDate = wd; d.firstWinRace = r; }
          if (!d.lastWinDate || wd > d.lastWinDate) { d.lastWinDate = wd; d.lastWinRace = r; }
        }
      }
      if (pos <= 3 && pos > 1) d.podiums += 1;
    }
  });
  return Object.values(byDriver).sort((a, b) => b.points - a.points);
}

function computeStandings(seasonFilter) {
  const rows = seasonFilter === "ALL" ? RACES : RACES.filter(r => r.season === seasonFilter);
  return computeStandingsFromRows(rows);
}

function winLabel(race) {
  if (!race) return "–";
  return `${race.season.replace("Season ", "S")} · ${race.round.replace("Round ", "R")}`;
}

/* ---------- RENDER: HERO ---------- */
function renderHero() {
  const drivers = new Set(RACES.map(r => r.driver));
  const dated = RACES.filter(r => r.date).map(r => r.date);
  document.getElementById("statSeasons").textContent = SEASONS.length;
  document.getElementById("statRaces").textContent = new Set(RACES.map(r => r.season + "-" + r.round + "-" + r.race)).size;
  document.getElementById("statDrivers").textContent = drivers.size;
  document.getElementById("statUpdated").textContent = dated.length ? dated[dated.length - 1] : "–";
  document.getElementById("footerCount").textContent = RACES.length;
}

/* ---------- RENDER: STANDINGS TAB ---------- */
let currentSeason = "ALL";

function renderSeasonChips() {
  const wrap = document.getElementById("seasonChips");
  wrap.innerHTML = "";
  const options = ["ALL", ...SEASONS];
  options.forEach(s => {
    const chip = document.createElement("button");
    chip.className = "chip" + (s === currentSeason ? " is-active" : "");
    chip.textContent = s === "ALL" ? "All-Time" : s.replace("Season ", "S");
    chip.addEventListener("click", () => { currentSeason = s; renderSeasonChips(); renderTower(); });
    wrap.appendChild(chip);
  });
}

function buildTowerGroupHTML(title, standings) {
  const rows = standings.map((d, i) => `
    <div class="tower__row">
      <span class="col-pos ${i === 0 ? "pos-1" : ""}">${i + 1}</span>
      <span class="col-driver">${d.driver}</span>
      <span class="col-num">${d.points}</span>
      <span class="col-num">${d.wins}</span>
      <span class="col-num">${d.podiums}</span>
      <span class="col-num">${d.poles}</span>
      <span class="col-num">${d.fl}</span>
    </div>
  `).join("");

  return `
    <div class="tower-group">
      ${title ? `<h3 class="tower-group__title">${title}</h3>` : ""}
      <div class="tower">
        <div class="tower__row tower__row--head">
          <span class="col-pos">POS</span>
          <span class="col-driver">DRIVER</span>
          <span class="col-num">PTS</span>
          <span class="col-num">WINS</span>
          <span class="col-num">Podiums</span>
          <span class="col-num">POLES</span>
          <span class="col-num">FL</span>
        </div>
        <div class="tower__body">${rows}</div>
      </div>
    </div>
  `;
}

function renderTower() {
  const container = document.getElementById("standingsContainer");
  let html = "";

  const overall = computeStandings(currentSeason);
  html += buildTowerGroupHTML(currentSeason === "ALL" ? "Overall — All-Time" : "Overall Standings", overall);

  if (currentSeason !== "ALL") {
    const seasonRows = RACES.filter(r => r.season === currentSeason);
    const raceNames = [...new Set(seasonRows.map(r => r.raceName).filter(Boolean))];
    raceNames.forEach(name => {
      const subset = seasonRows.filter(r => r.raceName === name);
      const standings = computeStandingsFromRows(subset);
      html += buildTowerGroupHTML(name, standings);
    });
  }

  container.innerHTML = html;
}

/* ---------- RENDER: DRIVERS TAB ---------- */
function renderDriverGrid() {
  const standings = computeStandings("ALL");
  const grid = document.getElementById("driverGrid");
  grid.innerHTML = "";
  standings.forEach(d => {
    const avgFinish = d.finishes ? (d.finishSum / d.finishes).toFixed(1) : "–";
    const winRate = d.starts ? Math.round((d.wins / d.starts) * 100) : 0;
    const card = document.createElement("div");
    card.className = "driver-card";
    card.innerHTML = `
      <h3 class="driver-card__name">${d.driver}</h3>
      <div class="driver-card__points">${d.points}<span class="driver-card__points-label">Career Points</span></div>
      <div class="driver-card__grid">
        <div class="driver-card__metric"><span>Starts</span><span>${d.starts}</span></div>
        <div class="driver-card__metric"><span>Wins</span><span>${d.wins}</span></div>
        <div class="driver-card__metric"><span>Podiums</span><span>${d.podiums}</span></div>
        <div class="driver-card__metric"><span>Poles</span><span>${d.poles}</span></div>
        <div class="driver-card__metric"><span>Fastest Laps</span><span>${d.fl}</span></div>
        <div class="driver-card__metric"><span>Win Rate</span><span>${winRate}%</span></div>
        <div class="driver-card__metric"><span>Avg Finish</span><span>${avgFinish}</span></div>
        <div class="driver-card__metric"><span>First Win</span><span>${winLabel(d.firstWinRace)}</span></div>
        <div class="driver-card__metric"><span>Last Win</span><span>${winLabel(d.lastWinRace)}</span></div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ---------- RENDER: RACE LOG TAB ---------- */
let currentRaceSeason = "ALL";

function renderRaceSeasonChips() {
  const wrap = document.getElementById("raceSeasonChips");
  wrap.innerHTML = "";
  const options = ["ALL", ...SEASONS];
  options.forEach(s => {
    const chip = document.createElement("button");
    chip.className = "chip" + (s === currentRaceSeason ? " is-active" : "");
    chip.textContent = s === "ALL" ? "All-Time" : s.replace("Season ", "S");
    chip.addEventListener("click", () => { currentRaceSeason = s; renderRaceSeasonChips(); renderRaceTable(); });
    wrap.appendChild(chip);
  });
}

function groupRaces(rows) {
  const groups = {};
  rows.forEach(r => {
    const key = `${r.season}__${r.round}__${r.race}`;
    if (!groups[key]) {
      groups[key] = { season: r.season, round: r.round, race: r.race, raceName: r.raceName, track: r.track, date: r.date, results: [] };
    }
    groups[key].results.push(r);
  });
  return Object.values(groups).map(g => {
    g.results.sort((a, b) => {
      const fa = isFinisher(a) ? parseInt(a.finish) : 999;
      const fb = isFinisher(b) ? parseInt(b.finish) : 999;
      return fa - fb;
    });
    g.winner = g.results.find(r => r.finish === "1");
    return g;
  }).sort((a, b) => {
    if (a.season !== b.season) return a.season.localeCompare(b.season);
    if (a.round !== b.round) return a.round.localeCompare(b.round);
    return a.race.localeCompare(b.race);
  });
}

function renderRaceTable() {
  const rows = currentRaceSeason === "ALL" ? RACES : RACES.filter(r => r.season === currentRaceSeason);
  const groups = groupRaces(rows);
  const wrap = document.getElementById("raceAccordion");
  wrap.innerHTML = "";

  groups.forEach((g, gi) => {
    const rowId = `race-detail-${gi}`;

    const row = document.createElement("button");
    row.className = "race-row";
    row.setAttribute("aria-expanded", "false");
    row.innerHTML = `
      <span class="chevron">▸</span>
      <span class="r-round">${g.season.replace("Season ", "S")}</span>
      <span class="r-round">${g.round.replace("Round ", "R")}</span>
      <span>${g.race}</span>
      <span>${g.raceName || "–"}</span>
      <span>${g.track || "–"}</span>
      <span class="r-winner">${g.winner ? g.winner.driver : "–"}</span>
    `;

    const detail = document.createElement("div");
    detail.className = "race-detail";
    detail.id = rowId;

    const tableRows = g.results.map(r => `
      <tr>
        <td>${r.driver}</td>
        <td>${r.start || "–"}</td>
        <td class="${r.finish === "1" ? "win-flag" : ""}">${r.finish || "–"}</td>
        <td>${r.posDelta || "–"}</td>
        <td>${r.points}</td>
        <td class="${r.fl ? "fl-flag" : ""}">${r.fl ? "FL" : "–"}</td>
        <td>${r.penalties || "–"}</td>
        <td>${r.qualiPoints || "–"}</td>
        <td>${r.deductions || "–"}</td>
      </tr>
    `).join("");

    detail.innerHTML = `
      <div class="race-detail-inner">
        <table class="race-table">
          <thead>
            <tr><th>Driver</th><th>Start</th><th>Finish</th><th>+/-</th><th>Pts</th><th>FL</th><th>Penalties</th><th>Quali Pts</th><th>Deductions</th></tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
    `;

    row.addEventListener("click", () => {
      const isOpen = row.classList.toggle("is-open");
      detail.classList.toggle("is-open", isOpen);
      row.setAttribute("aria-expanded", String(isOpen));
    });

    wrap.appendChild(row);
    wrap.appendChild(detail);
  });
}

/* ---------- TABS ---------- */
function setupTabs() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("is-active"));
      document.querySelectorAll(".panel").forEach(p => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      document.getElementById("panel-" + tab.dataset.tab).classList.add("is-active");
    });
  });
}

/* ---------- INIT ---------- */
async function init() {
  await loadData();
  renderHero();
  renderSeasonChips();
  renderTower();
  renderDriverGrid();
  renderRaceSeasonChips();
  renderRaceTable();
  setupTabs();
}

init();
