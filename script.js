/* =========================================================================
   AREA HASAN — Dashboard 2025 vs 2026
   Web recreation of the Android (Kotlin/Compose) "Area Hasan" app.
   Data model, initial seed data, and business logic mirror the original
   Room database / Repository / ViewModel 1:1. LocalStorage replaces Room.
   ========================================================================= */

const STORAGE_KEY = "area_hasan_db_v1";

/* ---------------------------------------------------------------------
   1. INITIAL DATA (mirrors InitialDataProvider.kt exactly)
   --------------------------------------------------------------------- */

const DEFAULT_CONFIG = {
  salesUrl: "https://docs.google.com/spreadsheets/d/1TncTWqwnrwf5NkC2EwhV393pw9oAnKw8pzzyS2-_rRQ/edit?usp=sharing",
  kpiUrl: "https://docs.google.com/spreadsheets/d/114oNs89h6cYUY1jdyLh6RY7-HrCPIogkuhF-8bwdgtc/edit?usp=sharing",
  iktUrl: "https://docs.google.com/spreadsheets/d/1wbfkuUrgLvrTzWAGo2NXytLgRovOrpa6hgzI-p7wTMA/edit?gid=1225896800#gid=1225896800",
  appsScriptUrl: "",
  lastSyncTimestamp: Date.now()
};

const INITIAL_STORES = [
  { code: "Y200", name: "KALISAT JBR" },
  { code: "Y038", name: "LETJEND SUPRAPTO 2" },
  { code: "Y073", name: "SUPRIYADI JBR" },
  { code: "Y144", name: "A.YANI JBR" },
  { code: "Y141", name: "SUKOWONO 3 JBR" },
  { code: "Y116", name: "CUMEDAK JEMBER" },
  { code: "Y469", name: "TAMANAN" },
  { code: "Y196", name: "GRUJUGAN BONDOWOSO" },
  { code: "Y136", name: "ARJASA JBR" },
  { code: "Y247", name: "SUMBER JAMBE JBR" },
  { code: "Y142", name: "PANCORAN BONDOWOSO" },
  { code: "Y214", name: "DR.WAHIDIN KALISAT" },
  { code: "Y222", name: "SUMBER JERUK JBR" },
  { code: "Y457", name: "DADAPAN BONDOWOSO" },
  { code: "Y140", name: "SUKOWONO 2 JBR" },
  { code: "Y015", name: "MAESAN BONDOWOSO" },
  { code: "Y207", name: "BARATAN JBR" },
  { code: "Y549", name: "GRUJUGAN LOR" }
].map(s => ({ ...s, area: "HASAN BASRI", am: "WDW", jhk: 26, isCustomAdded: false }));

// storeCode, storeName, jhk, targetNetSales, actualNetSales, spdTarget, spdActual,
// targetGmRp, actualGmRp, apcPoint, pwpPoint, psmPoint, sertisPoint, memberPoint
const INITIAL_IKT = [
  ["Y200","KALISAT JBR",26,330215936.65,272401764.75,10652126.98,10476990.95,49500000.0,41200000.0,25.0,25.0,20.0,30.0,50.0],
  ["Y038","LETJEND SUPRAPTO 2",26,286283337.27,223256619.09,9234946.36,8586793.04,42900000.0,33400000.0,22.5,20.0,18.0,25.0,42.0],
  ["Y073","SUPRIYADI JBR",26,749950348.65,574330099.71,24191946.73,22089619.21,112000000.0,86100000.0,24.0,21.0,19.0,28.0,48.0],
  ["Y144","A.YANI JBR",26,365882000.47,280674092.17,11802645.17,10795157.39,54800000.0,42100000.0,23.0,22.0,17.5,26.0,45.0],
  ["Y141","SUKOWONO 3 JBR",26,333711715.08,250972240.43,10764894.03,9652778.47,50000000.0,37600000.0,21.0,19.5,16.0,24.0,40.0],
  ["Y116","CUMEDAK JEMBER",26,535465614.75,401573343.28,17273084.34,15445128.58,80300000.0,60200000.0,20.5,18.0,15.5,22.0,38.0],
  ["Y469","TAMANAN",26,334662100.31,245838733.87,10795551.62,9455335.91,50100000.0,36800000.0,20.0,17.5,15.0,21.0,37.0],
  ["Y196","GRUJUGAN BONDOWOSO",26,220852233.34,163140335.77,7124265.59,6274628.29,33100000.0,24400000.0,21.5,18.5,16.5,23.0,39.0],
  ["Y136","ARJASA JBR",26,217931266.82,161074811.84,7030040.86,6195185.07,32600000.0,24100000.0,22.0,19.0,17.0,24.0,41.0],
  ["Y247","SUMBER JAMBE JBR",26,350421396.45,252543145.40,11303916.01,9713197.90,52500000.0,37800000.0,19.5,16.5,14.5,20.0,35.0],
  ["Y142","PANCORAN BONDOWOSO",26,174321793.91,124982066.20,5623283.67,4807002.54,26100000.0,18700000.0,19.0,16.0,14.0,19.5,34.0],
  ["Y214","DR.WAHIDIN KALISAT",26,858238524.59,624158629.33,27685113.69,24006101.12,128700000.0,93600000.0,20.0,17.0,15.0,22.0,36.0],
  ["Y222","SUMBER JERUK JBR",26,363918665.85,260783106.26,11739311.80,10030119.47,54500000.0,39100000.0,18.5,15.5,13.5,19.0,33.0],
  ["Y457","DADAPAN BONDOWOSO",26,228499165.42,164594317.68,7370940.82,6330550.68,34200000.0,24600000.0,19.0,16.0,14.0,20.0,34.0],
  ["Y140","SUKOWONO 2 JBR",26,399598553.46,285653345.60,12890275.91,10986667.13,59900000.0,42800000.0,18.0,15.0,13.0,18.5,32.0],
  ["Y015","MAESAN BONDOWOSO",26,573388013.11,413760943.29,18496387.52,15913882.43,86000000.0,62000000.0,18.5,15.2,13.2,18.0,31.0],
  ["Y207","BARATAN JBR",26,654511176.54,462184677.30,21113263.76,17776333.74,98100000.0,69300000.0,17.5,14.5,12.5,17.5,30.0],
  ["Y549","GRUJUGAN LOR",26,229124613.69,159615668.70,7391116.57,6139064.18,34300000.0,23900000.0,17.0,14.0,12.0,17.0,29.0]
].map(r => ({
  storeCode:r[0], storeName:r[1], jhk:r[2], targetNetSales:r[3], actualNetSales:r[4],
  spdTarget:r[5], spdActual:r[6], targetGmRp:r[7], actualGmRp:r[8],
  apcPoint:r[9], pwpPoint:r[10], psmPoint:r[11], sertisPoint:r[12], memberPoint:r[13]
}));

// nik, name, gender, position, storeCode, storeName, area, am, pwp, psm, serbaGratis, member, contribPct, bobot, status
const INITIAL_PERSONNEL = [
  ["13114726","M. WASIL","Male","Chief Of Store","Y015","SAT MAESAN BONDOWOSO","HASAN BASRI","WDW",0.0,6.09,0.92,8.25,24.5,15.26,"TIDAK PRODUKTIF"],
  ["20060407","MUHAMMAD RIKI","Male","Assistant Chief Of Store","Y015","SAT MAESAN BONDOWOSO","HASAN BASRI","WDW",7.15,2.81,0.31,10.75,18.2,21.02,"TIDAK PRODUKTIF"],
  ["21044941","M. NUR ILHAM ILAHY","Male","Assistant Chief Of Store","Y015","SAT MAESAN BONDOWOSO","HASAN BASRI","WDW",7.15,9.73,0.61,8.75,22.1,26.25,"KURANG PRODUKTIF"],
  ["22011234","FAUZI RAHMAN","Male","Crew","Y015","SAT MAESAN BONDOWOSO","HASAN BASRI","WDW",15.5,18.2,14.0,12.5,20.2,60.2,"PRODUKTIF"],
  ["22015678","SITI AISYAH","Female","Crew","Y015","SAT MAESAN BONDOWOSO","HASAN BASRI","WDW",18.0,19.5,16.5,14.0,21.0,69.0,"SANGAT PRODUKTIF"],
  ["15011998","BAMBANG HERMANTO","Male","Chief Of Store","Y200","KALISAT JBR","HASAN BASRI","WDW",19.2,18.5,17.0,13.5,26.5,74.7,"SANGAT PRODUKTIF"],
  ["21022334","LIA NOVITA","Female","Assistant Chief Of Store","Y200","KALISAT JBR","HASAN BASRI","WDW",16.0,17.0,14.5,11.0,22.0,68.5,"PRODUKTIF"],
  ["23033445","ANDI SAPUTRA","Male","Crew","Y200","KALISAT JBR","HASAN BASRI","WDW",14.0,15.0,12.0,10.0,18.5,59.0,"PRODUKTIF"],
  ["23044556","DEWI LESTARI","Female","Crew","Y200","KALISAT JBR","HASAN BASRI","WDW",8.0,9.0,6.0,7.0,12.0,32.0,"TIDAK PRODUKTIF"],
  ["16022111","RUDI HARTONO","Male","Chief Of Store","Y038","LETJEND SUPRAPTO 2","HASAN BASRI","WDW",18.5,19.0,15.0,13.0,25.0,70.5,"SANGAT PRODUKTIF"],
  ["20033222","ANISA PUTRI","Female","Assistant Chief Of Store","Y038","LETJEND SUPRAPTO 2","HASAN BASRI","WDW",12.0,14.0,11.0,9.5,19.0,55.5,"PRODUKTIF"],
  ["22044333","HENDRA WIJAYA","Male","Crew","Y038","LETJEND SUPRAPTO 2","HASAN BASRI","WDW",6.0,8.5,5.0,6.0,11.5,27.0,"TIDAK PRODUKTIF"],
  ["14099888","AGUS SETIAWAN","Male","Chief Of Store","Y073","SUPRIYADI JBR","HASAN BASRI","WDW",19.5,20.0,18.0,15.0,28.0,80.5,"SANGAT PRODUKTIF"],
  ["19088777","RINA MARLIANA","Female","Assistant Chief Of Store","Y073","SUPRIYADI JBR","HASAN BASRI","WDW",17.0,18.0,16.0,12.0,23.0,66.0,"PRODUKTIF"],
  ["21077666","DONI PRASETYO","Male","Crew","Y073","SUPRIYADI JBR","HASAN BASRI","WDW",13.0,12.0,10.0,8.0,16.0,49.0,"KURANG PRODUKTIF"],
  ["22066555","MAYA INDAH","Female","Crew","Y073","SUPRIYADI JBR","HASAN BASRI","WDW",11.0,10.0,9.0,7.5,14.0,41.5,"KURANG PRODUKTIF"],
  ["17055444","EKO PURWANTO","Male","Chief Of Store","Y144","A.YANI JBR","HASAN BASRI","WDW",17.5,16.0,14.0,12.0,24.0,63.5,"PRODUKTIF"],
  ["20044334","NURUL HIDAYAH","Female","Assistant Chief Of Store","Y144","A.YANI JBR","HASAN BASRI","WDW",15.0,14.5,13.0,10.0,20.0,52.5,"PRODUKTIF"],
  ["22033224","BAYU PRATAMA","Male","Crew","Y144","A.YANI JBR","HASAN BASRI","WDW",7.0,6.0,5.5,5.0,10.0,23.5,"TIDAK PRODUKTIF"],
  ["18011222","SLANET RIYADI","Male","Chief Of Store","Y141","SUKOWONO 3 JBR","HASAN BASRI","WDW",16.0,15.0,13.5,11.0,22.0,55.5,"PRODUKTIF"],
  ["21022333","TITA ROSITA","Female","Crew","Y141","SUKOWONO 3 JBR","HASAN BASRI","WDW",14.0,13.0,11.0,9.0,18.0,47.0,"KURANG PRODUKTIF"],
  ["16033444","ARIS MUNANDAR","Male","Chief Of Store","Y116","CUMEDAK JEMBER","HASAN BASRI","WDW",18.0,17.5,15.0,12.5,25.0,68.0,"PRODUKTIF"],
  ["20022111","YULIA FITRI","Female","Assistant Chief Of Store","Y116","CUMEDAK JEMBER","HASAN BASRI","WDW",12.5,11.0,9.5,8.0,17.0,41.0,"KURANG PRODUKTIF"],
  ["19011999","DEDIK IRAWAN","Male","Chief Of Store","Y469","TAMANAN","HASAN BASRI","WDW",15.0,14.0,12.0,10.0,21.0,51.0,"PRODUKTIF"],
  ["22088777","TRI WAHYUNI","Female","Crew","Y469","TAMANAN","HASAN BASRI","WDW",8.0,7.0,6.0,6.0,12.0,27.0,"TIDAK PRODUKTIF"],
  ["17077888","IRWAN SYAH","Male","Chief Of Store","Y196","GRUJUGAN BONDOWOSO","HASAN BASRI","WDW",17.0,16.5,14.0,11.5,23.0,62.0,"PRODUKTIF"],
  ["21066555","SITI RAHMAH","Female","Crew","Y196","GRUJUGAN BONDOWOSO","HASAN BASRI","WDW",13.0,12.0,10.5,9.0,17.0,44.5,"KURANG PRODUKTIF"],
  ["18099000","ARIF BUDIMAN","Male","Chief Of Store","Y136","ARJASA JBR","HASAN BASRI","WDW",18.5,18.0,16.0,13.0,26.0,71.5,"SANGAT PRODUKTIF"],
  ["22011999","MEGA WATI","Female","Crew","Y136","ARJASA JBR","HASAN BASRI","WDW",10.0,9.0,8.0,7.0,14.0,34.0,"TIDAK PRODUKTIF"],
  ["19022333","HARIYANTO","Male","Chief Of Store","Y247","SUMBER JAMBE JBR","HASAN BASRI","WDW",14.0,13.0,11.0,9.0,19.0,47.0,"KURANG PRODUKTIF"],
  ["22033444","DIAN ANGGRAENI","Female","Crew","Y247","SUMBER JAMBE JBR","HASAN BASRI","WDW",9.0,8.0,7.0,6.5,13.0,30.5,"TIDAK PRODUKTIF"],
  ["18044555","SIGIT PURNOMO","Male","Chief Of Store","Y142","PANCORAN BONDOWOSO","HASAN BASRI","WDW",15.0,14.0,12.0,9.5,20.0,50.5,"PRODUKTIF"],
  ["21055666","RATNA SARI","Female","Crew","Y142","PANCORAN BONDOWOSO","HASAN BASRI","WDW",8.5,7.5,6.5,6.0,12.5,28.5,"TIDAK PRODUKTIF"],
  ["15033222","SUHARTO","Male","Chief Of Store","Y214","DR.WAHIDIN KALISAT","HASAN BASRI","WDW",16.5,15.5,13.5,11.0,22.5,56.5,"PRODUKTIF"],
  ["20044555","DESI PERMATA","Female","Assistant Chief Of Store","Y214","DR.WAHIDIN KALISAT","HASAN BASRI","WDW",11.0,10.0,8.5,7.5,15.0,37.0,"TIDAK PRODUKTIF"],
  ["17088999","NANANG KOSIM","Male","Chief Of Store","Y222","SUMBER JERUK JBR","HASAN BASRI","WDW",14.5,13.5,11.5,9.5,19.5,49.0,"KURANG PRODUKTIF"],
  ["19033444","LUQMAN HAKIM","Male","Chief Of Store","Y457","DADAPAN BONDOWOSO","HASAN BASRI","WDW",15.5,14.5,12.5,10.0,20.5,52.5,"PRODUKTIF"],
  ["18022111","M. ROFIQ","Male","Chief Of Store","Y140","SUKOWONO 2 JBR","HASAN BASRI","WDW",14.0,13.0,11.0,9.0,18.5,47.0,"KURANG PRODUKTIF"],
  ["16044333","WAHYU HIDAYAT","Male","Chief Of Store","Y207","BARATAN JBR","HASAN BASRI","WDW",13.5,12.5,10.5,8.5,18.0,45.0,"KURANG PRODUKTIF"],
  ["19055666","GUNTUR ALAMS YAH","Male","Chief Of Store","Y549","GRUJUGAN LOR","HASAN BASRI","WDW",13.0,12.0,10.0,8.0,17.5,43.0,"KURANG PRODUKTIF"]
].map(r => ({
  nik:r[0], name:r[1], gender:r[2], position:r[3], storeCode:r[4], storeName:r[5],
  area:r[6], am:r[7], pwpScore:r[8], psmScore:r[9], serbaGratisScore:r[10],
  memberScore:r[11], storeSalesContributionPct:r[12], grandTotalBobot:r[13], statusKet:r[14]
}));

const ITEM_SPECS = [
  ["2012","SAPA ROLL PACKAGING (S)",-18.5],
  ["2022","SAPA ROLL PACKAGING (M)",-25.0],
  ["2002","SAPA KABEL TIES",-12.0],
  ["2342","DJI SAM SOE 12",-32.0],
  ["2442","GG SURYA 12",-15.4],
  ["3101","INDOMIE GORENG 85G",-8.2],
  ["3105","MIE SEDAAP GORENG 90G",12.0],
  ["4020","AQUA AIR MINERAL 600ML",-22.1],
  ["4055","MINYAK GORENG TROPICAL 2L",-14.0],
  ["5110","MILO REFILL 300G",-28.5]
];
const MONTHS = ["JAN","FEB","MAR","APR","MEI","JUN"];

function randInt(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }

function createInitialSalesItems(){
  const items = [];
  let idSeq = 1;
  for (const store of INITIAL_STORES){
    for (const month of MONTHS){
      for (const [plu, descp, pct] of ITEM_SPECS){
        const baseQty2025 = randInt(50, 400);
        const basePrice = randInt(5000, 50000);
        const sales2025 = baseQty2025 * basePrice;
        const margin2025 = sales2025 * 0.12;

        items.push({
          id: idSeq++, storeCode: store.code, storeName: store.name, plu, descp,
          month, year: 2025, struk: Math.trunc(baseQty2025 * 0.8), qty: baseQty2025,
          margin: margin2025, netSales: sales2025
        });

        const factor = 1.0 + (pct / 100.0);
        const storeSeverity = (store.code === "Y207" || store.code === "Y549" || store.code === "Y140") ? 0.75 : 1.0;
        const qty2026 = Math.max(1, Math.trunc(baseQty2025 * factor * storeSeverity));
        const sales2026 = qty2026 * basePrice;
        const margin2026 = sales2026 * 0.12;

        items.push({
          id: idSeq++, storeCode: store.code, storeName: store.name, plu, descp,
          month, year: 2026, struk: Math.trunc(qty2026 * 0.8), qty: qty2026,
          margin: margin2026, netSales: sales2026
        });
      }
    }
  }
  return items;
}

/* ---------------------------------------------------------------------
   2. "DATABASE" — localStorage-backed store (mirrors AppDatabase/DAOs)
   --------------------------------------------------------------------- */

const DB = {
  stores: [], salesItems: [], personnel: [], ikt: [], config: null,

  load(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw){
      try {
        const parsed = JSON.parse(raw);
        this.stores = parsed.stores || [];
        this.salesItems = parsed.salesItems || [];
        this.personnel = parsed.personnel || [];
        this.ikt = parsed.ikt || [];
        this.config = parsed.config || null;
        if (this.stores.length > 0) return;
      } catch(e){ /* fall through to seed */ }
    }
    this.seed();
  },

  seed(){
    this.stores = JSON.parse(JSON.stringify(INITIAL_STORES));
    this.salesItems = createInitialSalesItems();
    this.personnel = JSON.parse(JSON.stringify(INITIAL_PERSONNEL));
    this.ikt = JSON.parse(JSON.stringify(INITIAL_IKT));
    this.config = { ...DEFAULT_CONFIG, lastSyncTimestamp: Date.now() };
    this.persist();
  },

  persist(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      stores: this.stores, salesItems: this.salesItems,
      personnel: this.personnel, ikt: this.ikt, config: this.config
    }));
  },

  resetToDefault(){
    this.seed();
  },

  updateSheetLinks(salesUrl, kpiUrl, iktUrl, appsScriptUrl){
    this.config = { ...(this.config || DEFAULT_CONFIG), salesUrl, kpiUrl, iktUrl, appsScriptUrl, lastSyncTimestamp: Date.now() };
    this.persist();
  },

  addCustomStore({ code, name, targetIkt, actualIkt, crewName, crewPos, salesContribPct }){
    code = code.toUpperCase();
    name = name.toUpperCase();

    this.stores.push({ code, name, area: "HASAN BASRI", am: "WDW", jhk: 26, isCustomAdded: true });

    this.ikt.push({
      storeCode: code, storeName: name, jhk: 26,
      targetNetSales: targetIkt, actualNetSales: actualIkt,
      spdTarget: targetIkt / 26, spdActual: actualIkt / 26,
      targetGmRp: targetIkt * 0.15, actualGmRp: actualIkt * 0.15,
      apcPoint: 20.0, pwpPoint: 18.0, psmPoint: 16.0, sertisPoint: 20.0, memberPoint: 35.0
    });

    const status = salesContribPct >= 20.0 ? "SANGAT PRODUKTIF" : (salesContribPct >= 10.0 ? "PRODUKTIF" : "KURANG PRODUKTIF");
    this.personnel.push({
      nik: String(randInt(10000000, 99999999)), name: crewName.toUpperCase(), gender: "Male",
      position: crewPos, storeCode: code, storeName: "SAT " + name, area: "HASAN BASRI", am: "WDW",
      pwpScore: 15.0, psmScore: 16.0, serbaGratisScore: 12.0, memberScore: 10.0,
      storeSalesContributionPct: salesContribPct, grandTotalBobot: salesContribPct * 2.5, statusKet: status
    });

    let nextId = Math.max(0, ...this.salesItems.map(i => i.id)) + 1;
    const sample = [
      { plu:"2012", descp:"SAPA ROLL PACKAGING (S)", month:"JUN", year:2025, struk:120, qty:150, margin:500000.0, netSales:4500000.0 },
      { plu:"2012", descp:"SAPA ROLL PACKAGING (S)", month:"JUN", year:2026, struk:80, qty:95, margin:320000.0, netSales:2850000.0 },
      { plu:"2342", descp:"DJI SAM SOE 12", month:"JUN", year:2025, struk:200, qty:250, margin:1200000.0, netSales:12000000.0 },
      { plu:"2342", descp:"DJI SAM SOE 12", month:"JUN", year:2026, struk:150, qty:180, margin:850000.0, netSales:8600000.0 }
    ];
    for (const s of sample){
      this.salesItems.push({ id: nextId++, storeCode: code, storeName: name, ...s });
    }

    this.persist();
  },

  deleteAllSales(){ this.salesItems = []; },

  insertSalesItems(items){
    let nextId = Math.max(0, ...this.salesItems.map(i => i.id), 0) + 1;
    for (const it of items){ this.salesItems.push({ id: nextId++, ...it }); }
    this.persist();
  },

  // Upsert = update kalau kunci sudah ada, tambah baris baru kalau belum.
  // Dipakai oleh sinkron via Apps Script supaya sync berulang tidak menumpuk duplikat.
  upsertSalesItems(items){
    let nextId = Math.max(0, ...this.salesItems.map(i => i.id), 0) + 1;
    for (const it of items){
      const key = `${it.storeCode}_${it.plu}_${it.month}_${it.year}`;
      const idx = this.salesItems.findIndex(x => `${x.storeCode}_${x.plu}_${x.month}_${x.year}` === key);
      if (idx >= 0){ this.salesItems[idx] = { ...this.salesItems[idx], ...it }; }
      else { this.salesItems.push({ id: nextId++, ...it }); }
    }
    this.persist();
  },

  upsertPersonnel(list){
    for (const p of list){
      const idx = this.personnel.findIndex(x => x.nik === p.nik);
      if (idx >= 0){ this.personnel[idx] = { ...this.personnel[idx], ...p }; }
      else { this.personnel.push(p); }
    }
    this.persist();
  },

  upsertIkt(list){
    for (const r of list){
      const idx = this.ikt.findIndex(x => x.storeCode === r.storeCode);
      if (idx >= 0){ this.ikt[idx] = { ...this.ikt[idx], ...r }; }
      else { this.ikt.push(r); }
    }
    this.persist();
  }
};

/* ---------------------------------------------------------------------
   3. GOOGLE SHEETS SYNC (mirrors GoogleSheetsFetcher.kt)
   --------------------------------------------------------------------- */

function convertToCsvUrl(url, gid){
  const base = url.split("/edit")[0].split("/export")[0];
  return gid ? `${base}/export?format=csv&gid=${gid}` : `${base}/export?format=csv`;
}
function extractGid(url){
  const m = url.match(/gid=([0-9]+)/);
  return m ? m[1] : null;
}
function parseCsvLine(line){
  const tokens = []; let sb = ""; let inQuotes = false;
  for (const ch of line){
    if (ch === '"'){ inQuotes = !inQuotes; }
    else if (ch === "," && !inQuotes){ tokens.push(sb.trim().replace(/^"|"$/g,"")); sb = ""; }
    else { sb += ch; }
  }
  tokens.push(sb.trim().replace(/^"|"$/g,""));
  return tokens;
}
function parseSalesSheet(csvData){
  const result = [];
  const lines = csvData.split(/\r?\n/);
  if (lines.length < 2) return result;
  const header = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g,""));
  const idxOf = (pred) => header.findIndex(pred);
  const codeIdx = idxOf(h => /KODE/i.test(h) || /STORE/i.test(h));
  const nameIdx = idxOf(h => /NAMA/i.test(h));
  const pluIdx = idxOf(h => /PLU/i.test(h));
  const descpIdx = idxOf(h => /DESCP/i.test(h) || /ITEM/i.test(h));
  const qtyIdx = idxOf(h => /QTY/i.test(h));
  const salesIdx = idxOf(h => /NET_SALES/i.test(h) || /SALES/i.test(h));

  for (let i = 1; i < lines.length; i++){
    if (!lines[i].trim()) continue;
    const cols = parseCsvLine(lines[i]);
    const maxIdx = Math.max(codeIdx, nameIdx, pluIdx, descpIdx, qtyIdx, salesIdx);
    if (cols.length > maxIdx && codeIdx >= 0){
      const storeCode = cols[codeIdx];
      if (!storeCode || storeCode === "KODE_TOKO") continue;
      const storeName = cols[nameIdx] || `Toko ${storeCode}`;
      const plu = cols[pluIdx] || `PLU-${i}`;
      const descp = cols[descpIdx] || `Barang ${plu}`;
      const qty = parseInt(cols[qtyIdx]) || 0;
      const sales = parseFloat(cols[salesIdx]) || 0.0;
      result.push({
        storeCode, storeName, plu, descp, month: "JUN", year: 2026,
        struk: Math.trunc(qty * 0.8), qty, margin: sales * 0.1, netSales: sales
      });
    }
  }
  return result;
}

async function fetchCsvContent(sheetUrl){
  try {
    const csvUrl = convertToCsvUrl(sheetUrl, extractGid(sheetUrl));
    const res = await fetch(csvUrl, { mode: "cors" });
    if (!res.ok) return null;
    return await res.text();
  } catch(e){
    console.error("Error fetching CSV from sheet", e);
    return null;
  }
}

/* ---- Helpers for flexible header matching on JSON rows from Apps Script ---- */
function findKey(row, patterns){
  const keys = Object.keys(row);
  for (const k of keys){
    for (const p of patterns){ if (p.test(k)) return k; }
  }
  return null;
}
function numOf(row, key){ const v = row[key]; const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[^0-9.-]/g,"")); return isNaN(n) ? 0 : n; }
function strOf(row, key, fallback){ const v = row[key]; return (v===undefined||v===null||v==="") ? fallback : String(v).trim(); }

function parseSalesFromRows(rows){
  if (!rows || rows.length === 0) return [];
  const sample = rows[0];
  const codeKey = findKey(sample, [/KODE/i, /STORE/i]);
  const nameKey = findKey(sample, [/NAMA_TOKO/i, /NAMA/i]);
  const pluKey = findKey(sample, [/PLU/i]);
  const descKey = findKey(sample, [/DESCP/i, /ITEM/i, /NAMA_BARANG/i]);
  const qtyKey = findKey(sample, [/QTY/i]);
  const salesKey = findKey(sample, [/NET_SALES/i, /SALES/i]);
  const monthKey = findKey(sample, [/BULAN/i, /MONTH/i]);
  const yearKey = findKey(sample, [/TAHUN/i, /YEAR/i]);
  if (!codeKey || !pluKey) return [];

  const out = [];
  for (const row of rows){
    const storeCode = strOf(row, codeKey, "");
    if (!storeCode || storeCode === "KODE_TOKO") continue;
    const qty = qtyKey ? numOf(row, qtyKey) : 0;
    const sales = salesKey ? numOf(row, salesKey) : 0;
    out.push({
      storeCode,
      storeName: strOf(row, nameKey, `Toko ${storeCode}`),
      plu: strOf(row, pluKey, ""),
      descp: strOf(row, descKey, `Barang ${strOf(row, pluKey, "")}`),
      month: (monthKey ? strOf(row, monthKey, "JUN") : "JUN").toUpperCase(),
      year: yearKey ? Math.round(numOf(row, yearKey)) || 2026 : 2026,
      struk: Math.trunc(qty * 0.8), qty, margin: sales * 0.1, netSales: sales
    });
  }
  return out;
}

function parseKpiFromRows(rows){
  if (!rows || rows.length === 0) return [];
  const sample = rows[0];
  const nikKey = findKey(sample, [/NIK/i]);
  const nameKey = findKey(sample, [/NAMA/i]);
  const genderKey = findKey(sample, [/GENDER/i, /JK/i]);
  const posKey = findKey(sample, [/JABATAN/i, /POSITION/i, /POSISI/i]);
  const codeKey = findKey(sample, [/KODE_TOKO/i, /KODE/i]);
  const storeNameKey = findKey(sample, [/NAMA_TOKO/i]);
  const pwpKey = findKey(sample, [/PWP/i]);
  const psmKey = findKey(sample, [/PSM/i]);
  const serbaKey = findKey(sample, [/SERBA/i, /GRATIS/i]);
  const memberKey = findKey(sample, [/MEMBER/i]);
  const contribKey = findKey(sample, [/KONTRIBUSI/i, /CONTRIB/i]);
  const bobotKey = findKey(sample, [/BOBOT/i, /GRAND_TOTAL/i]);
  const statusKey = findKey(sample, [/STATUS/i, /KET/i]);
  if (!nikKey) return [];

  const out = [];
  for (const row of rows){
    const nik = strOf(row, nikKey, "");
    if (!nik) continue;
    out.push({
      nik, name: strOf(row, nameKey, ""), gender: strOf(row, genderKey, "Male"),
      position: strOf(row, posKey, "Crew"), storeCode: strOf(row, codeKey, ""),
      storeName: strOf(row, storeNameKey, ""), area: "HASAN BASRI", am: "WDW",
      pwpScore: pwpKey ? numOf(row, pwpKey) : 0, psmScore: psmKey ? numOf(row, psmKey) : 0,
      serbaGratisScore: serbaKey ? numOf(row, serbaKey) : 0, memberScore: memberKey ? numOf(row, memberKey) : 0,
      storeSalesContributionPct: contribKey ? numOf(row, contribKey) : 0,
      grandTotalBobot: bobotKey ? numOf(row, bobotKey) : 0,
      statusKet: strOf(row, statusKey, "KURANG PRODUKTIF").toUpperCase()
    });
  }
  return out;
}

function parseIktFromRows(rows){
  if (!rows || rows.length === 0) return [];
  const sample = rows[0];
  const codeKey = findKey(sample, [/KODE_TOKO/i, /KODE/i]);
  const nameKey = findKey(sample, [/NAMA_TOKO/i, /NAMA/i]);
  const jhkKey = findKey(sample, [/JHK/i]);
  const targetSalesKey = findKey(sample, [/TARGET_NET_SALES/i, /TARGET_SALES/i, /TARGET.*SALES/i]);
  const actualSalesKey = findKey(sample, [/ACTUAL_NET_SALES/i, /ACTUAL_SALES/i, /ACTUAL.*SALES/i]);
  const spdTargetKey = findKey(sample, [/SPD_TARGET/i, /SPD.*TARGET/i]);
  const spdActualKey = findKey(sample, [/SPD_ACTUAL/i, /SPD.*ACTUAL/i]);
  const targetGmKey = findKey(sample, [/TARGET_GM/i, /TARGET.*GM/i]);
  const actualGmKey = findKey(sample, [/ACTUAL_GM/i, /ACTUAL.*GM/i]);
  const apcKey = findKey(sample, [/APC/i]);
  const pwpKey = findKey(sample, [/PWP/i]);
  const psmKey = findKey(sample, [/PSM/i]);
  const sertisKey = findKey(sample, [/SERTIS/i]);
  const memberKey = findKey(sample, [/MEMBER/i]);
  if (!codeKey) return [];

  const out = [];
  for (const row of rows){
    const storeCode = strOf(row, codeKey, "");
    if (!storeCode) continue;
    out.push({
      storeCode, storeName: strOf(row, nameKey, `Toko ${storeCode}`),
      jhk: jhkKey ? Math.round(numOf(row, jhkKey)) : 26,
      targetNetSales: targetSalesKey ? numOf(row, targetSalesKey) : 0,
      actualNetSales: actualSalesKey ? numOf(row, actualSalesKey) : 0,
      spdTarget: spdTargetKey ? numOf(row, spdTargetKey) : 0,
      spdActual: spdActualKey ? numOf(row, spdActualKey) : 0,
      targetGmRp: targetGmKey ? numOf(row, targetGmKey) : 0,
      actualGmRp: actualGmKey ? numOf(row, actualGmKey) : 0,
      apcPoint: apcKey ? numOf(row, apcKey) : 0,
      pwpPoint: pwpKey ? numOf(row, pwpKey) : 0,
      psmPoint: psmKey ? numOf(row, psmKey) : 0,
      sertisPoint: sertisKey ? numOf(row, sertisKey) : 0,
      memberPoint: memberKey ? numOf(row, memberKey) : 0
    });
  }
  return out;
}

/**
 * Mode A — Sinkron via Apps Script (disarankan): membaca ketiga link
 * (Sales, KPI, IKT) sekaligus lewat satu Web App Apps Script yang jadi
 * jembatan server-side, sehingga tidak kena batasan CORS browser.
 */
async function syncViaAppsScript(config){
  try {
    const params = new URLSearchParams({
      salesUrl: config.salesUrl || "",
      kpiUrl: config.kpiUrl || "",
      iktUrl: config.iktUrl || ""
    });
    const res = await fetch(`${config.appsScriptUrl}?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "Apps Script mengembalikan error");

    const counts = [];
    if (json.data.sales && json.data.sales.length){
      const items = parseSalesFromRows(json.data.sales);
      if (items.length){ DB.upsertSalesItems(items); counts.push(`${items.length} baris Sales`); }
    }
    if (json.data.kpi && json.data.kpi.length){
      const list = parseKpiFromRows(json.data.kpi);
      if (list.length){ DB.upsertPersonnel(list); counts.push(`${list.length} Personil`); }
    }
    if (json.data.ikt && json.data.ikt.length){
      const list = parseIktFromRows(json.data.ikt);
      if (list.length){ DB.upsertIkt(list); counts.push(`${list.length} Toko IKT`); }
    }

    DB.config.lastSyncTimestamp = Date.now();
    DB.persist();
    return {
      ok: true,
      message: counts.length
        ? `Sinkron via Apps Script berhasil: ${counts.join(", ")}.`
        : "Terhubung ke Apps Script, tapi tidak ada baris baru yang cocok formatnya."
    };
  } catch(e){
    return { ok: false, message: `Gagal sync via Apps Script: ${e.message}. Menggunakan cache data. Pastikan Web App di-deploy dengan akses "Anyone".` };
  }
}

/**
 * Mode B — Sinkron langsung dari browser (fallback lama): hanya sheet
 * Sales yang disinkron, dan sheet harus public ("Anyone with the link")
 * karena fetch CSV dilakukan langsung dari JavaScript browser (kena CORS
 * kalau sheet tidak public).
 */
async function syncViaDirectCsv(config){
  try {
    const csvSales = await fetchCsvContent(config.salesUrl);
    if (csvSales && csvSales.trim()){
      const parsed = parseSalesSheet(csvSales);
      if (parsed.length > 0){ DB.upsertSalesItems(parsed); }
    }
    DB.config.lastSyncTimestamp = Date.now();
    DB.persist();
    return { ok: true, message: "Data Sales berhasil disinkronkan langsung dari Google Sheets. (Mode terbatas — hanya Sales. Isi Link Web App Apps Script untuk sinkron KPI & IKT juga.)" };
  } catch(e){
    return { ok: false, message: `Gagal sync: ${e.message}. Menggunakan cache data. Pastikan sheet dibagikan "Anyone with the link" agar CORS mengizinkan akses dari browser.` };
  }
}

async function syncDataFromSheets(){
  const config = DB.config || DEFAULT_CONFIG;
  if (config.appsScriptUrl && config.appsScriptUrl.trim()){
    return await syncViaAppsScript(config);
  }
  return await syncViaDirectCsv(config);
}

/* ---------------------------------------------------------------------
   4. FORMATTERS (mirrors Formatters.kt)
   --------------------------------------------------------------------- */

const Formatters = {
  formatRupiah(amount){
    try {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
    } catch(e){ return `Rp ${Math.trunc(amount)}`; }
  },
  formatNumber(n){
    try { return new Intl.NumberFormat("id-ID").format(n); } catch(e){ return String(n); }
  },
  formatPercent(pct){
    const sign = pct > 0 ? "+" : "";
    return `${sign}${pct.toFixed(1)}%`;
  }
};

/* ---------------------------------------------------------------------
   5. STATE (mirrors DashboardViewModel filters)
   --------------------------------------------------------------------- */

const state = {
  selectedTab: 0,
  selectedStoreCode: "ALL",
  selectedMonth: "ALL",
  searchQuery: "",
  remainingDays: 15,
  isSyncing: false,
  syncMessage: null
};

/* ---------------------------------------------------------------------
   6. DERIVED DATA COMPUTATION (mirrors the combine{} block in ViewModel)
   --------------------------------------------------------------------- */

function computeDerived(){
  const filters = state;

  // ---- Tab 0: Sales comparison ----
  const filteredSales = DB.salesItems.filter(item =>
    (filters.selectedStoreCode === "ALL" || item.storeCode.toUpperCase() === filters.selectedStoreCode.toUpperCase()) &&
    (filters.selectedMonth === "ALL" || item.month.toUpperCase() === filters.selectedMonth.toUpperCase())
  );

  const grouped = new Map();
  for (const item of filteredSales){
    const key = `${item.storeCode}_${item.plu}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  }

  const comparisonRows = [];
  for (const [, items] of grouped){
    const first = items[0];
    const item2025 = items.filter(i => i.year === 2025);
    const item2026 = items.filter(i => i.year === 2026);
    const qty25 = item2025.reduce((s,i)=>s+i.qty,0);
    const sales25 = item2025.reduce((s,i)=>s+i.netSales,0);
    const qty26 = item2026.reduce((s,i)=>s+i.qty,0);
    const sales26 = item2026.reduce((s,i)=>s+i.netSales,0);
    const deltaQty = qty26 - qty25;
    const deltaSales = sales26 - sales25;
    const pct = sales25 > 0 ? ((sales26 - sales25) / sales25) * 100 : 0.0;

    const q = filters.searchQuery;
    if (!q || first.descp.toLowerCase().includes(q.toLowerCase()) ||
        first.plu.toLowerCase().includes(q.toLowerCase()) ||
        first.storeName.toLowerCase().includes(q.toLowerCase())){
      comparisonRows.push({
        storeCode:first.storeCode, storeName:first.storeName, plu:first.plu, descp:first.descp,
        qty2025:qty25, sales2025:sales25, qty2026:qty26, sales2026:sales26,
        deltaQty, deltaSales, pctChange:pct, isDrop: deltaSales < 0
      });
    }
  }

  const totalS25 = comparisonRows.reduce((s,r)=>s+r.sales2025,0);
  const totalS26 = comparisonRows.reduce((s,r)=>s+r.sales2026,0);
  const totalQ25 = comparisonRows.reduce((s,r)=>s+r.qty2025,0);
  const totalQ26 = comparisonRows.reduce((s,r)=>s+r.qty2026,0);
  const netDelta = totalS26 - totalS25;
  const pctChange = totalS25 > 0 ? ((totalS26 - totalS25) / totalS25) * 100 : 0.0;
  const itemsDropped = comparisonRows.filter(r=>r.isDrop);

  const dropMap = new Map();
  for (const r of comparisonRows.filter(r=>r.isDrop)){
    if (!dropMap.has(r.storeCode)) dropMap.set(r.storeCode, []);
    dropMap.get(r.storeCode).push(r);
  }
  const storeDrops = [...dropMap.entries()].map(([code, rows]) => ({
    storeCode: code, storeName: rows[0].storeName,
    totalSalesDrop: rows.reduce((s,r)=>s+r.deltaSales,0),
    totalQtyDrop: rows.reduce((s,r)=>s+r.deltaQty,0),
    worstItems: [...rows].sort((a,b)=>a.deltaSales-b.deltaSales).slice(0,5)
  })).sort((a,b)=>a.totalSalesDrop-b.totalSalesDrop);
  const worstStore = storeDrops[0] || null;

  // ---- Tab 1: Personnel KPI ----
  const filteredPersonnel = DB.personnel.filter(p =>
    (filters.selectedStoreCode === "ALL" || p.storeCode.toUpperCase() === filters.selectedStoreCode.toUpperCase()) &&
    (!filters.searchQuery ||
      p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      p.nik.includes(filters.searchQuery) ||
      p.storeName.toLowerCase().includes(filters.searchQuery.toLowerCase()))
  );
  const countStatus = (s) => filteredPersonnel.filter(p=>p.statusKet.toUpperCase()===s).length;
  const sangatPCount = countStatus("SANGAT PRODUKTIF");
  const pCount = countStatus("PRODUKTIF");
  const kurangPCount = countStatus("KURANG PRODUKTIF");
  const tidakPCount = countStatus("TIDAK PRODUKTIF");

  // ---- Tab 2: IKT ----
  const filteredIkt = DB.ikt.filter(ikt =>
    (filters.selectedStoreCode === "ALL" || ikt.storeCode.toUpperCase() === filters.selectedStoreCode.toUpperCase()) &&
    (!filters.searchQuery ||
      ikt.storeName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      ikt.storeCode.toLowerCase().includes(filters.searchQuery.toLowerCase()))
  );
  const sortedIkt = [...filteredIkt].sort((a,b) => {
    const ra = a.targetNetSales > 0 ? a.actualNetSales/a.targetNetSales : 0;
    const rb = b.targetNetSales > 0 ? b.actualNetSales/b.targetNetSales : 0;
    return rb - ra;
  });
  const iktRows = sortedIkt.map((ikt, idx) => {
    const achPct = ikt.targetNetSales > 0 ? (ikt.actualNetSales/ikt.targetNetSales)*100 : 0.0;
    const def = Math.max(0.0, ikt.targetNetSales - ikt.actualNetSales);
    const dailyNeeded = filters.remainingDays > 0 ? def/filters.remainingDays : 0.0;
    return {
      rank: idx+1, storeCode: ikt.storeCode, storeName: ikt.storeName,
      targetNetSales: ikt.targetNetSales, actualNetSales: ikt.actualNetSales,
      achievementPct: achPct, deficit: def, dailyTargetNeeded: dailyNeeded,
      apcPoint: ikt.apcPoint, pwpPoint: ikt.pwpPoint, psmPoint: ikt.psmPoint, memberPoint: ikt.memberPoint
    };
  });
  const iktTTarget = iktRows.reduce((s,r)=>s+r.targetNetSales,0);
  const iktTActual = iktRows.reduce((s,r)=>s+r.actualNetSales,0);
  const iktOverallAch = iktTTarget > 0 ? (iktTActual/iktTTarget)*100 : 0.0;
  const iktTDeficit = iktRows.reduce((s,r)=>s+r.deficit,0);
  const iktTDailyNeeded = filters.remainingDays > 0 ? iktTDeficit/filters.remainingDays : 0.0;

  return {
    totalSales2025:totalS25, totalSales2026:totalS26, totalQty2025:totalQ25, totalQty2026:totalQ26,
    netSalesDelta:netDelta, pctSalesChange:pctChange, totalItemsDroppedCount:itemsDropped.length,
    topDroppingStore:worstStore, comparisonList: [...comparisonRows].sort((a,b)=>a.deltaSales-b.deltaSales),
    totalPersonnelCount: filteredPersonnel.length, sangatProduktifCount:sangatPCount, produktifCount:pCount,
    kurangProduktifCount:kurangPCount, tidakProduktifCount:tidakPCount, filteredPersonnelList:filteredPersonnel,
    iktTotalTarget:iktTTarget, iktTotalActual:iktTActual, iktOverallAchievementPct:iktOverallAch,
    iktTotalDeficit:iktTDeficit, iktDailyCatchUpTotal:iktTDailyNeeded, iktStoreRows:iktRows
  };
}

/* ---------------------------------------------------------------------
   7. RENDERING
   --------------------------------------------------------------------- */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function renderChipRow(container, options, selectedValue, onSelect){
  container.innerHTML = "";
  for (const opt of options){
    const chip = document.createElement("button");
    chip.className = "chip" + (opt.value === selectedValue ? " selected" : "");
    chip.textContent = opt.label;
    chip.addEventListener("click", () => onSelect(opt.value));
    container.appendChild(chip);
  }
}

function renderStoreCountLabels(){
  $$(".storeCountLabel").forEach(el => el.textContent = DB.stores.length);
}

function renderFilters(){
  const months = ["ALL", ...MONTHS];
  renderChipRow($("#monthFilterRow"), months.map(m=>({label:m,value:m})), state.selectedMonth, (v)=>{
    state.selectedMonth = v; render();
  });

  const storeOptions = [{label:"Semua Toko", value:"ALL"}, ...DB.stores.map(s=>({label:`${s.code} - ${s.name}`, value:s.code}))];
  renderChipRow($("#storeFilterRowSales"), storeOptions, state.selectedStoreCode, (v)=>{ state.selectedStoreCode=v; render(); });

  const d = computeDerived();
  const kpiStoreOptions = [{label:`Semua Crew (${d.totalPersonnelCount})`, value:"ALL"}, ...DB.stores.map(s=>({label:`${s.code} - ${s.name}`, value:s.code}))];
  renderChipRow($("#storeFilterRowKpi"), kpiStoreOptions, state.selectedStoreCode, (v)=>{ state.selectedStoreCode=v; render(); });

  renderChipRow($("#storeFilterRowIkt"), storeOptions, state.selectedStoreCode, (v)=>{ state.selectedStoreCode=v; render(); });
}

function renderTabPanels(){
  $$(".tab").forEach(t => t.classList.toggle("active", Number(t.dataset.tab) === state.selectedTab));
  $$(".tab-panel").forEach(p => p.classList.toggle("active", p.id === `panel-${state.selectedTab}`));
  const indicator = $("#tabIndicator");
  indicator.style.transform = `translateX(${state.selectedTab * 100}%)`;
}

function renderSalesTab(d){
  $("#totalSales2025").textContent = Formatters.formatRupiah(d.totalSales2025);
  $("#totalSales2026").textContent = Formatters.formatRupiah(d.totalSales2026);
  $("#totalQty2025").textContent = `Qty: ${Formatters.formatNumber(d.totalQty2025)}`;
  $("#totalQty2026").textContent = `Qty: ${Formatters.formatNumber(d.totalQty2026)}`;

  const deltaBox = $("#deltaBox");
  const negative = d.netSalesDelta < 0;
  deltaBox.classList.toggle("negative", negative);
  $("#deltaArrow").innerHTML = negative
    ? '<path d="M12 20l-7-7h4V4h6v9h4z"/>'
    : '<path d="M12 4l7 7h-4v9h-6v-9H5z"/>';
  $("#deltaText").textContent = `Selisih Sales Net: ${Formatters.formatRupiah(d.netSalesDelta)}`;
  $("#pctPill").textContent = Formatters.formatPercent(d.pctSalesChange);

  const topDropCard = $("#topDropCard");
  if (d.topDroppingStore){
    topDropCard.hidden = false;
    const s = d.topDroppingStore;
    $("#topDropStoreName").textContent = `${s.storeCode} - ${s.storeName}`;
    $("#topDropSales").textContent = `Total Penurunan Sales: ${Formatters.formatRupiah(s.totalSalesDrop)}`;
    $("#topDropQty").textContent = `Drop Qty: ${Formatters.formatNumber(s.totalQtyDrop)}`;
    const itemsEl = $("#topDropItems");
    itemsEl.innerHTML = "";
    for (const item of s.worstItems){
      const row = document.createElement("div");
      row.className = "drop-item-row";
      row.innerHTML = `
        <div style="flex:1;">
          <div class="drop-item-title">[${item.plu}] ${escapeHtml(item.descp)}</div>
          <div class="drop-item-sub">2025: Qty ${item.qty2025} (${Formatters.formatRupiah(item.sales2025)}) &rarr; 2026: Qty ${item.qty2026} (${Formatters.formatRupiah(item.sales2026)})</div>
        </div>
        <div>
          <div class="drop-item-value">${Formatters.formatRupiah(item.deltaSales)}</div>
          <div class="drop-item-qty">${item.deltaQty} Qty</div>
        </div>`;
      itemsEl.appendChild(row);
    }
  } else {
    topDropCard.hidden = true;
  }

  $("#salesListHeader").textContent = `Daftar Perbandingan Item (${d.comparisonList.length})`;
  $("#dropCountLabel").textContent = `Turun: ${d.totalItemsDroppedCount} Item`;

  const list = $("#salesList");
  list.innerHTML = "";
  if (d.comparisonList.length === 0){
    list.innerHTML = `<div class="empty-state">Tidak ada data untuk filter ini.</div>`;
  }
  for (const item of d.comparisonList){
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="top-row">
        <div style="flex:1;">
          <div class="item-title">${escapeHtml(item.descp)}</div>
          <div class="item-sub">PLU: ${item.plu} | ${item.storeCode} - ${escapeHtml(item.storeName)}</div>
        </div>
        <span class="badge ${item.isDrop ? "down" : "up"}">${item.isDrop ? "TURUN" : "NAIK"}</span>
      </div>
      <hr class="divider">
      <div class="item-metrics">
        <div class="metric-col">
          <div class="lbl">2025 Sales</div>
          <div class="val">${Formatters.formatRupiah(item.sales2025)}</div>
          <div class="lbl">Qty: ${item.qty2025}</div>
        </div>
        <div class="metric-col">
          <div class="lbl">2026 Sales</div>
          <div class="val">${Formatters.formatRupiah(item.sales2026)}</div>
          <div class="lbl">Qty: ${item.qty2026}</div>
        </div>
        <div class="metric-col end">
          <div class="lbl">Penurunan / Selisih</div>
          <div class="delta ${item.isDrop ? "down" : "up"}">${Formatters.formatRupiah(item.deltaSales)}</div>
          <div class="delta ${item.isDrop ? "down" : "up"}">${item.deltaQty} Qty (${Formatters.formatPercent(item.pctChange)})</div>
        </div>
      </div>`;
    list.appendChild(card);
  }
}

function renderKpiTab(d){
  const pillsEl = $("#productivityPills");
  pillsEl.innerHTML = "";
  const pills = [
    { label:"Sangat", count:d.sangatProduktifCount, color:"var(--emerald-green)", bg:"var(--emerald-light)" },
    { label:"Produktif", count:d.produktifCount, color:"var(--teal-accent)", bg:"var(--sky-light)" },
    { label:"Kurang", count:d.kurangProduktifCount, color:"var(--amber-alert)", bg:"var(--amber-light)" },
    { label:"Tidak", count:d.tidakProduktifCount, color:"var(--rose-drop)", bg:"var(--rose-light)" }
  ];
  for (const p of pills){
    const el = document.createElement("div");
    el.className = "prod-pill";
    el.style.background = p.bg;
    el.innerHTML = `<span class="count" style="color:${p.color}">${p.count}</span><span class="label" style="color:${p.color}">${p.label}</span>`;
    pillsEl.appendChild(el);
  }

  const list = $("#personnelList");
  list.innerHTML = "";
  if (d.filteredPersonnelList.length === 0){
    list.innerHTML = `<div class="empty-state">Tidak ada personil untuk filter ini.</div>`;
  }
  for (const p of d.filteredPersonnelList){
    let statusBg = "var(--rose-light)", statusFg = "var(--rose-drop)";
    const s = p.statusKet.toUpperCase();
    if (s.includes("SANGAT")) { statusBg = "var(--emerald-light)"; statusFg = "var(--emerald-green)"; }
    else if (s === "PRODUKTIF") { statusBg = "var(--sky-light)"; statusFg = "var(--teal-accent)"; }
    else if (s.includes("KURANG")) { statusBg = "var(--amber-light)"; statusFg = "var(--amber-alert)"; }

    const card = document.createElement("div");
    card.className = "personnel-card";
    card.innerHTML = `
      <div class="top-row">
        <div class="row center">
          <div class="avatar"><svg viewBox="0 0 24 24"><path d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-8 8v-2.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20H4Z"/></svg></div>
          <div style="margin-left:10px;">
            <div class="p-name">${escapeHtml(p.name)}</div>
            <div class="p-sub">NIK: ${p.nik} | ${escapeHtml(p.position)}</div>
            <div class="p-store">${p.storeCode} - ${escapeHtml(p.storeName)}</div>
          </div>
        </div>
        <span class="status-badge" style="background:${statusBg};color:${statusFg};">${p.statusKet}</span>
      </div>
      <hr class="divider">
      <div class="p-metrics">
        <div class="p-metric"><div class="lbl">Kontribusi Sales</div><div class="val">${Formatters.formatNumber(p.storeSalesContributionPct)}%</div></div>
        <div class="p-metric"><div class="lbl">PWP Score</div><div class="val">${Formatters.formatNumber(p.pwpScore)}</div></div>
        <div class="p-metric"><div class="lbl">PSM Score</div><div class="val">${Formatters.formatNumber(p.psmScore)}</div></div>
        <div class="p-metric"><div class="lbl">Member Score</div><div class="val">${Formatters.formatNumber(p.memberScore)}</div></div>
      </div>`;
    list.appendChild(card);
  }
}

function renderIktTab(d){
  $("#iktTotalTarget").textContent = Formatters.formatRupiah(d.iktTotalTarget);
  $("#iktTotalActual").textContent = Formatters.formatRupiah(d.iktTotalActual);
  $("#iktTotalActual").style.color = d.iktOverallAchievementPct >= 80 ? "var(--emerald-green)" : "var(--amber-alert)";

  const progress = Math.min(1, Math.max(0, d.iktOverallAchievementPct / 100));
  const fill = $("#iktProgressFill");
  fill.style.width = `${progress*100}%`;
  fill.classList.toggle("warn", d.iktOverallAchievementPct < 80);

  $("#iktAchievementLabel").textContent = `Achievement: ${Formatters.formatPercent(d.iktOverallAchievementPct)}`;
  $("#iktAchievementLabel").style.color = d.iktOverallAchievementPct >= 80 ? "var(--emerald-green)" : "var(--amber-alert)";
  $("#iktDeficitLabel").textContent = `Kekurangan: ${Formatters.formatRupiah(d.iktTotalDeficit)}`;

  $("#remainingDaysPill").textContent = `Sisa: ${state.remainingDays} Hari`;
  $("#iktDailyCatchUp").textContent = Formatters.formatRupiah(d.iktDailyCatchUpTotal);

  const list = $("#iktList");
  list.innerHTML = "";
  if (d.iktStoreRows.length === 0){
    list.innerHTML = `<div class="empty-state">Tidak ada data untuk filter ini.</div>`;
  }
  for (const row of d.iktStoreRows){
    let rankClass = "";
    if (row.rank === 1) rankClass = "gold";
    else if (row.rank === 2) rankClass = "silver";
    else if (row.rank === 3) rankClass = "bronze";
    const rankStyle = rankClass ? "" : "background:var(--navy-primary);";

    const card = document.createElement("div");
    card.className = "ikt-card";
    card.innerHTML = `
      <div class="top-row">
        <div class="row center">
          <div class="rank-badge ${rankClass}" style="${rankStyle}">#${row.rank}</div>
          <div style="margin-left:10px;">
            <div class="ikt-name">${row.storeCode} - ${escapeHtml(row.storeName)}</div>
            <div class="ikt-achiev ${row.achievementPct >= 80 ? "good" : "warn"}">Achiev: ${Formatters.formatPercent(row.achievementPct)}</div>
          </div>
        </div>
        <span class="status-badge" style="background:${row.deficit===0?"var(--emerald-light)":"var(--rose-light)"};color:${row.deficit===0?"var(--emerald-green)":"var(--rose-drop)"};">
          ${row.deficit===0 ? "Tercapai" : "Kurang: " + Formatters.formatRupiah(row.deficit)}
        </span>
      </div>
      <hr class="divider">
      <div class="ikt-metrics">
        <div class="ikt-metric"><div class="lbl">Target Sales</div><div class="val">${Formatters.formatRupiah(row.targetNetSales)}</div></div>
        <div class="ikt-metric"><div class="lbl">Actual Sales</div><div class="val">${Formatters.formatRupiah(row.actualNetSales)}</div></div>
        <div class="ikt-metric end"><div class="lbl">Kejar / Hari (${state.remainingDays} Hari)</div><div class="val">${Formatters.formatRupiah(row.dailyTargetNeeded)}</div></div>
      </div>
      <div class="chip-points">
        <span class="point-chip">APC: ${Formatters.formatNumber(row.apcPoint)}</span>
        <span class="point-chip">PWP: ${Formatters.formatNumber(row.pwpPoint)}</span>
        <span class="point-chip">PSM: ${Formatters.formatNumber(row.psmPoint)}</span>
        <span class="point-chip">Member: ${Formatters.formatNumber(row.memberPoint)}</span>
      </div>`;
    list.appendChild(card);
  }
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function render(){
  renderStoreCountLabels();
  renderFilters();
  renderTabPanels();
  const d = computeDerived();
  renderSalesTab(d);
  renderKpiTab(d);
  renderIktTab(d);

  $("#syncProgress").classList.toggle("active", state.isSyncing);
  const toast = $("#syncToast");
  if (state.syncMessage){
    toast.hidden = false;
    $("#syncToastText").textContent = state.syncMessage;
  } else {
    toast.hidden = true;
  }
}

/* ---------------------------------------------------------------------
   8. EVENT WIRING
   --------------------------------------------------------------------- */

function init(){
  DB.load();

  $$(".tab").forEach(tab => {
    tab.addEventListener("click", () => { state.selectedTab = Number(tab.dataset.tab); render(); });
  });

  $("#salesSearch").addEventListener("input", (e) => { state.searchQuery = e.target.value; render(); });
  $("#kpiSearch").addEventListener("input", (e) => { state.searchQuery = e.target.value; render(); });
  $("#iktSearch").addEventListener("input", (e) => { state.searchQuery = e.target.value; render(); });

  $("#remainingDaysSlider").addEventListener("input", (e) => {
    state.remainingDays = Math.min(31, Math.max(1, Number(e.target.value)));
    render();
  });

  $("#syncToastClose").addEventListener("click", () => { state.syncMessage = null; render(); });

  // Sheet config dialog
  $("#btnSheetConfig").addEventListener("click", () => {
    $("#inputSalesUrl").value = DB.config.salesUrl;
    $("#inputKpiUrl").value = DB.config.kpiUrl;
    $("#inputIktUrl").value = DB.config.iktUrl;
    $("#inputAppsScriptUrl").value = DB.config.appsScriptUrl || "";
    $("#dlgSheetOverlay").hidden = false;
  });
  $("#dlgSheetOverlay").addEventListener("click", (e) => { if (e.target.id === "dlgSheetOverlay") $("#dlgSheetOverlay").hidden = true; });
  $("#btnResetData").addEventListener("click", () => {
    DB.resetToDefault();
    state.syncMessage = "Data berhasil direset ke standar Area Hasan Basri.";
    $("#dlgSheetOverlay").hidden = true;
    render();
  });
  $("#btnSaveSync").addEventListener("click", async () => {
    const salesUrl = $("#inputSalesUrl").value.trim();
    const kpiUrl = $("#inputKpiUrl").value.trim();
    const iktUrl = $("#inputIktUrl").value.trim();
    const appsScriptUrl = $("#inputAppsScriptUrl").value.trim();
    DB.updateSheetLinks(salesUrl, kpiUrl, iktUrl, appsScriptUrl);
    $("#dlgSheetOverlay").hidden = true;
    state.isSyncing = true;
    state.syncMessage = "Menghubungkan ke Google Sheets...";
    render();
    const result = await syncDataFromSheets();
    state.isSyncing = false;
    state.syncMessage = result.message;
    render();
  });

  render();
}

document.addEventListener("DOMContentLoaded", init);
