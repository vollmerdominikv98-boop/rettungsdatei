// admin.js
import { getData, saveData } from './storage.js';

export function initAdmin(onCloseCallback) {
    const openBtn = document.getElementById('openAdminBtn');
    if (openBtn) {
        openBtn.onclick = () => renderAdminModal(onCloseCallback);
    }
}

function renderAdminModal(onCloseCallback) {
    let db = getData();
    let activeTab = 'machines';

    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'adminModalOverlay';
    modalOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;';

    const updateContent = () => {
        db = getData();
        const contentBox = modalOverlay.querySelector('#adminContentBox');
        if (contentBox) {
            contentBox.innerHTML = getAdminTabContent(activeTab, db);
            attachAdminListeners(modalOverlay, onCloseCallback, updateContent);
        }
    };

    modalOverlay.innerHTML = `
        <div style="background: #ffffff; width: 100%; max-width: 800px; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); display: flex; flex-direction: column; overflow: hidden; max-height: 90vh; font-family: system-ui, -apple-system, sans-serif;">
            <div style="padding: 20px 24px; background: #0f172a; color: #fff; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 700;">⚙️ Admin & Stammdatenverwaltung</h3>
                <button id="closeAdminModal" style="background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; font-weight: 700;">&times;</button>
            </div>
            
            <div style="display: flex; background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 0 24px; gap: 8px;">
                <button class="admin-tab" data-tab="machines" style="padding: 12px 16px; background: ${activeTab === 'machines' ? '#fff' : 'transparent'}; border: none; border-bottom: 2px solid ${activeTab === 'machines' ? '#2563eb' : 'transparent'}; font-weight: ${activeTab === 'machines' ? '700' : '500'}; color: ${activeTab === 'machines' ? '#2563eb' : '#64748b'}; cursor: pointer;">Maschinen</button>
                <button class="admin-tab" data-tab="materials" style="padding: 12px 16px; background: ${activeTab === 'materials' ? '#fff' : 'transparent'}; border: none; border-bottom: 2px solid ${activeTab === 'materials' ? '#2563eb' : 'transparent'}; font-weight: ${activeTab === 'materials' ? '700' : '500'}; color: ${activeTab === 'materials' ? '#2563eb' : '#64748b'}; cursor: pointer;">Werkstoffe</button>
                <button class="admin-tab" data-tab="tools" style="padding: 12px 16px; background: ${activeTab === 'tools' ? '#fff' : 'transparent'}; border: none; border-bottom: 2px solid ${activeTab === 'tools' ? '#2563eb' : 'transparent'}; font-weight: ${activeTab === 'tools' ? '700' : '500'}; color: ${activeTab === 'tools' ? '#2563eb' : '#64748b'}; cursor: pointer;">Werkzeuge</button>
                <button class="admin-tab" data-tab="profiles" style="padding: 12px 16px; background: ${activeTab === 'profiles' ? '#fff' : 'transparent'}; border: none; border-bottom: 2px solid ${activeTab === 'profiles' ? '#2563eb' : 'transparent'}; font-weight: ${activeTab === 'profiles' ? '700' : '500'}; color: ${activeTab === 'profiles' ? '#2563eb' : '#64748b'}; cursor: pointer;">Profile</button>
            </div>

            <div id="adminContentBox" style="padding: 24px; overflow-y: auto; flex: 1; background: #f8fafc;">
                ${getAdminTabContent(activeTab, db)}
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    modalOverlay.querySelectorAll('.admin-tab').forEach(tabBtn => {
        tabBtn.onclick = () => {
            activeTab = tabBtn.dataset.tab;
            modalOverlay.querySelectorAll('.admin-tab').forEach(b => {
                const isActive = b.dataset.tab === activeTab;
                b.style.background = isActive ? '#fff' : 'transparent';
                b.style.borderBottomColor = isActive ? '#2563eb' : 'transparent';
                b.style.fontWeight = isActive ? '700' : '500';
                b.style.color = isActive ? '#2563eb' : '#64748b';
            });
            updateContent();
        };
    });

    modalOverlay.querySelector('#closeAdminModal').onclick = () => {
        modalOverlay.remove();
        if (onCloseCallback) onCloseCallback();
    };

    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
            if (onCloseCallback) onCloseCallback();
        }
    };

    attachAdminListeners(modalOverlay, onCloseCallback, updateContent);
}

function getAdminTabContent(tab, db) {
    if (tab === 'machines') {
        return `
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 1.05rem;">Neue Maschine hinzufügen</h4>
                <form id="addMachineForm" style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; align-items: end;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Bezeichnung</label>
                        <input type="text" name="name" required placeholder="z.B. DMG Mori CMX" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Max. Drehzahl (U/min)</label>
                        <input type="number" name="maxRpm" required placeholder="12000" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Leistung (kW)</label>
                        <input type="number" name="powerKw" required placeholder="15" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <button type="submit" style="background: #2563eb; color: #fff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.85rem;">Hinzufügen</button>
                </form>
            </div>

            <h4 style="margin: 20px 0 10px 0; color: #0f172a; font-size: 1.05rem;">Vorhandene Maschinen</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${db.machines.length === 0 ? '<div style="color: #64748b; font-style: italic; font-size: 0.85rem;">Keine Maschinen vorhanden.</div>' : ''}
                ${db.machines.map(m => `
                    <div style="background: #fff; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem;">${m.name}</div>
                            <div style="font-size: 0.8rem; color: #64748b;">Max. Drehzahl: ${m.maxRpm} U/min | Leistung: ${m.powerKw} kW</div>
                        </div>
                        <button class="delete-machine-btn" data-id="${m.id}" style="background: #ffeeef; color: #dc2626; border: 1px solid #fecaca; padding: 6px 10px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.75rem;">Löschen</button>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'materials') {
        return `
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 1.05rem;">Neuen Werkstoff hinzufügen</h4>
                <form id="addMaterialForm" style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; align-items: end;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Bezeichnung</label>
                        <input type="text" name="name" required placeholder="z.B. Automatenstahl" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">ISO-Gruppe</label>
                        <select name="isoGroup" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem; background: #fff;">
                            <option value="P">ISO P</option>
                            <option value="M">ISO M</option>
                            <option value="K">ISO K</option>
                            <option value="N">ISO N</option>
                            <option value="S">ISO S</option>
                            <option value="H">ISO H</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Schnittgeschwindigkeit vc</label>
                        <input type="number" name="vc" required placeholder="200" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <button type="submit" style="background: #2563eb; color: #fff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.85rem;">Hinzufügen</button>
                </form>
            </div>

            <h4 style="margin: 20px 0 10px 0; color: #0f172a; font-size: 1.05rem;">Vorhandene Werkstoffe</h4>
            <div style="display: flex; flex-direction: column; gap: 8px; max-height: 350px; overflow-y: auto;">
                ${db.materials.map(mat => `
                    <div style="background: #fff; padding: 10px 16px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="font-weight: 700; color: #0f172a; font-size: 0.9rem;">${mat.name}</span>
                            <span style="background: #e2e8f0; color: #334155; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; margin-left: 8px;">ISO ${mat.isoGroup}</span>
                            <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">Schnittgeschwindigkeit vc: ${mat.vc} m/min</div>
                        </div>
                        <button class="delete-material-btn" data-id="${mat.id}" style="background: #ffeeef; color: #dc2626; border: 1px solid #fecaca; padding: 5px 10px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.75rem;">Löschen</button>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'tools') {
        return `
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 1.05rem;">Neues Werkzeug hinzufügen</h4>
                <form id="addToolForm" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto; gap: 10px; align-items: end;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Bezeichnung</label>
                        <input type="text" name="name" required placeholder="z.B. VHM Schaftfräser" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Durchmesser D</label>
                        <input type="number" step="0.1" name="d" required placeholder="10" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Zähne Z</label>
                        <input type="number" name="z" required placeholder="4" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Länge L</label>
                        <input type="number" name="l" required placeholder="72" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <button type="submit" style="background: #2563eb; color: #fff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.85rem;">Hinzufügen</button>
                </form>
            </div>

            <h4 style="margin: 20px 0 10px 0; color: #0f172a; font-size: 1.05rem;">Vorhandene Werkzeuge</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${db.tools.map(t => `
                    <div style="background: #fff; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem;">${t.name}</div>
                            <div style="font-size: 0.8rem; color: #64748b;">Durchmesser: ${t.d} mm | Zähne: ${t.z} | Länge: ${t.l} mm</div>
                        </div>
                        <button class="delete-tool-btn" data-id="${t.id}" style="background: #ffeeef; color: #dc2626; border: 1px solid #fecaca; padding: 6px 10px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.75rem;">Löschen</button>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (tab === 'profiles') {
        return `
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 1.05rem;">Neues Profil hinzufügen</h4>
                <form id="addProfileForm" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto; gap: 10px; align-items: end;">
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Bezeichnung</label>
                        <input type="text" name="name" required placeholder="z.B. Schruppen" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Zahnvorschub fz</label>
                        <input type="number" step="0.01" name="fz" required placeholder="0.08" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Schnitttiefe ap</label>
                        <input type="number" step="0.1" name="ap" required placeholder="15" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Schnittbreite ae (%)</label>
                        <input type="number" name="aeValue" required placeholder="40" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.85rem;">
                    </div>
                    <button type="submit" style="background: #2563eb; color: #fff; border: none; padding: 9px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.85rem;">Hinzufügen</button>
                </form>
            </div>

            <h4 style="margin: 20px 0 10px 0; color: #0f172a; font-size: 1.05rem;">Vorhandene Profile</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                ${db.profiles.map(p => `
                    <div style="background: #fff; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem;">${p.name}</div>
                            <div style="font-size: 0.8rem; color: #64748b;">Zahnvorschub: ${p.fz} mm | ap: ${p.ap} mm | ae: ${p.aeValue}%</div>
                        </div>
                        <button class="delete-profile-btn" data-id="${p.id}" style="background: #ffeeef; color: #dc2626; border: 1px solid #fecaca; padding: 6px 10px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 0.75rem;">Löschen</button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    return '';
}

function attachAdminListeners(modalOverlay, onCloseCallback, updateContent) {
    const addMachineForm = modalOverlay.querySelector('#addMachineForm');
    if (addMachineForm) {
        addMachineForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(addMachineForm);
            const db = getData();
            db.machines.push({
                id: 'm_' + Date.now(),
                name: formData.get('name'),
                maxRpm: Number(formData.get('maxRpm')),
                powerKw: Number(formData.get('powerKw'))
            });
            saveData(db);
            updateContent();
        };
    }

    modalOverlay.querySelectorAll('.delete-machine-btn').forEach(btn => {
        btn.onclick = () => {
            const db = getData();
            db.machines = db.machines.filter(m => m.id !== btn.dataset.id);
            saveData(db);
            updateContent();
        };
    });

    const addMaterialForm = modalOverlay.querySelector('#addMaterialForm');
    if (addMaterialForm) {
        addMaterialForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(addMaterialForm);
            const db = getData();
            db.materials.push({
                id: 'mat_' + Date.now(),
                name: formData.get('name'),
                isoGroup: formData.get('isoGroup'),
                vc: Number(formData.get('vc'))
            });
            saveData(db);
            updateContent();
        };
    }

    modalOverlay.querySelectorAll('.delete-material-btn').forEach(btn => {
        btn.onclick = () => {
            const db = getData();
            db.materials = db.materials.filter(m => m.id !== btn.dataset.id);
            saveData(db);
            updateContent();
        };
    });

    const addToolForm = modalOverlay.querySelector('#addToolForm');
    if (addToolForm) {
        addToolForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(addToolForm);
            const db = getData();
            db.tools.push({
                id: 't_' + Date.now(),
                name: formData.get('name'),
                d: Number(formData.get('d')),
                z: Number(formData.get('z')),
                l: Number(formData.get('l'))
            });
            saveData(db);
            updateContent();
        };
    }

    modalOverlay.querySelectorAll('.delete-tool-btn').forEach(btn => {
        btn.onclick = () => {
            const db = getData();
            db.tools = db.tools.filter(t => t.id !== btn.dataset.id);
            saveData(db);
            updateContent();
        };
    });

    const addProfileForm = modalOverlay.querySelector('#addProfileForm');
    if (addProfileForm) {
        addProfileForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(addProfileForm);
            const db = getData();
            db.profiles.push({
                id: 'p_' + Date.now(),
                name: formData.get('name'),
                fz: Number(formData.get('fz')),
                ap: Number(formData.get('ap')),
                aeType: 'percent',
                aeValue: Number(formData.get('aeValue'))
            });
            saveData(db);
            updateContent();
        };
    }

    modalOverlay.querySelectorAll('.delete-profile-btn').forEach(btn => {
        btn.onclick = () => {
            const db = getData();
            db.profiles = db.profiles.filter(p => p.id !== btn.dataset.id);
            saveData(db);
            updateContent();
        };
    });
}
