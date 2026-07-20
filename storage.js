// storage.js

const STORAGE_KEY = 'shopfloor_calc_db_v6';

const defaultData = {
    machines: [
        { id: 'm1', name: 'DMG Mori CMX 50U', maxRpm: 12000, powerKw: 13 },
        { id: 'm2', name: 'Mazak Variaxis i-700', maxRpm: 18000, powerKw: 25 }
    ],
    materials: [
        // --- ISO P: Stahl ---
        { id: 'mat_p1', name: 'Baustahl S235JR (1.0038)', isoGroup: 'P', vc: 220 },
        { id: 'mat_p2', name: 'Vergütungsstahl C45 (1.0503)', isoGroup: 'P', vc: 180 },
        { id: 'mat_p3', name: 'Hochlegierter Stahl 42CrMo4 (1.7225)', isoGroup: 'P', vc: 150 },
        { id: 'mat_p4', name: 'Einsatzstahl 16MnCr5 (1.7131)', isoGroup: 'P', vc: 190 },

        // --- ISO M: Rostfreier Stahl ---
        { id: 'mat_m1', name: 'Edelstahl X5CrNi18-10 (1.4301 / 304)', isoGroup: 'M', vc: 120 },
        { id: 'mat_m2', name: 'Säurebeständiger Edelstahl X5CrNiMo17-12-2 (1.4404)', isoGroup: 'M', vc: 100 },
        { id: 'mat_m3', name: 'Duplex-Stahl X2CrNiMoN22-5-3 (1.4462)', isoGroup: 'M', vc: 80 },

        // --- ISO K: Gusseisen ---
        { id: 'mat_k1', name: 'Grauguss EN-GJL-250 (GG-25)', isoGroup: 'K', vc: 200 },
        { id: 'mat_k2', name: 'Kugelgraphitguss EN-GJS-400-15 (GGG-40)', isoGroup: 'K', vc: 180 },

        // --- ISO N: Nichteisenmetalle ---
        { id: 'mat_n1', name: 'Aluminium AlMgSi1 (EN AW-6082)', isoGroup: 'N', vc: 450 },
        { id: 'mat_n2', name: 'Aluminium-Knetlegierung AlCuMgPb (EN AW-2007)', isoGroup: 'N', vc: 500 },
        { id: 'mat_n3', name: 'Messing CuZn39Pb3 (Ms58)', isoGroup: 'N', vc: 350 },
        { id: 'mat_n4', name: 'Kupfer, Elektrolytkupfer E-Cu57', isoGroup: 'N', vc: 300 },

        // --- ISO S: Warmfeste Legierungen & Titan ---
        { id: 'mat_s1', name: 'Nickelbasislegierung Inconel 718 (2.4668)', isoGroup: 'S', vc: 35 },
        { id: 'mat_s2', name: 'Titanlegierung TiAl6V4 (3.7165)', isoGroup: 'S', vc: 60 },
        { id: 'mat_s3', name: 'Cobaltbasislegierung Stellite', isoGroup: 'S', vc: 25 },

        // --- ISO H: Gehärtete Werkstoffe ---
        { id: 'mat_h1', name: 'Gehärteter Werkzeugstahl (ca. 55 HRC)', isoGroup: 'H', vc: 45 },
        { id: 'mat_h2', name: 'Hartguss / Chill Cast Iron (ca. 60 HRC)', isoGroup: 'H', vc: 30 }
    ],
    tools: [
        { id: 't1', name: 'VHM Schaftfräser ⌀10 (Z=4)', d: 10, z: 4, l: 72 },
        { id: 't2', name: 'VHM Schaftfräser ⌀12 (Z=4)', d: 12, z: 4, l: 83 },
        { id: 't3', name: 'VHM Schruppfräser ⌀16 (Z=3)', d: 16, z: 3, l: 92 },
        { id: 't4', name: 'VHM Mikrofräser ⌀6 (Z=2)', d: 6, z: 2, l: 57 }
    ],
    profiles: [
        { id: 'p1', name: 'Schruppen (Standard)', fz: 0.08, ap: 15.0, aeType: 'percent', aeValue: 40 },
        { id: 'p2', name: 'Schlichten (Fein)', fz: 0.04, ap: 25.0, aeType: 'percent', aeValue: 10 },
        { id: 'p3', name: 'HSC / High-Feed', fz: 0.12, ap: 1.5, aeType: 'percent', aeValue: 15 }
    ]
};

export function getData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        saveData(defaultData);
        return defaultData;
    }
    try {
        const parsed = JSON.parse(data);
        return {
            machines: parsed.machines?.length ? parsed.machines : defaultData.machines,
            materials: parsed.materials?.length ? parsed.materials : defaultData.materials,
            tools: parsed.tools?.length ? parsed.tools : defaultData.tools,
            profiles: parsed.profiles?.length ? parsed.profiles : defaultData.profiles
        };
    } catch (e) {
        return defaultData;
    }
}

export function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
