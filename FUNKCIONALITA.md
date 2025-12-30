# Dental-Lite - Přehled funkcionality aplikace

## 🏥 Základní informace

Moderní webová aplikace pro správu zubní ordinace s důrazem na **jednoduchost a efektivitu**.

**Verze:** LEAN 1.0.0 (28. prosince 2025)  
**Technologie:** Next.js 16, React, TypeScript, TailwindCSS, Radix UI  
**Cílová skupina:** Malá ordinace (lékař + sestra)

---

## 📋 Hlavní funkce

### 1. **Tier systém (Balíčky služeb)** - LEAN distribuce

Aplikace podporuje 3 cenové tier optimalizované pro postupný růst:

#### **BASIC** - Plně funkční pro malou ordinaci 🎯
- Veřejný web s kontaktem a informacemi
- **Admin přístup s plnou funkcionalitou**
- Kalendář/Diář s termíny
- Správa pacientů (zjednodušená)
- Dashboard (dnešní přehled)
- Ordinační hodiny
- Základní nastavení
- **Urgentní termíny** 🚨
- **Patient Quick View tooltip** 💡

#### **BUSINESS** - Rozšíření pro větší provoz
- Vše z BASIC +
- **API dostupnost termínů** (pro online rezervace)
- **Čekatelna** (waiting list)
- SMS připomínky
- Export dat
- Základní statistiky

#### **PROFI** - Profesionální řešení
- Vše z BUSINESS +
- **Multi-user** (více lékařů)
- Správa uživatelů
- Notifikace a automatizace
- Pokročilé statistiky
- Integrace třetích stran
- Více křesel/pokojů
- Pokročilé nastavení

**Funkce tier systému:**
- Přepínání mezi tier pomocí URL parametru `?tier=basic|business|profi`
- Perzistence výběru v localStorage
- Zobrazení zamčených funkcí s 🔒 ikonou
- UpgradeModal pro propagaci vyšších tier
- TierSelector komponenta (floating badge vpravo nahoře)

---

### 2. **📅 Kalendář/Diář (Admin → Kalendář)**

Kompletní systém pro správu termínů a rezervací.

#### Zobrazení:
- **Týdenní pohled** (Po-Pá, 7:00-19:00)
- **Denní pohled** (zobrazení pouze jeden den)
- Hodinové sloty po 60 minutách (výška 80px)
- Barevné označení statusů termínů
- Integrace s ordinačními hodinami (šedé sloty mimo pracovní dobu)

#### Barvy statusů:
- 🟢 **Zelená** = Potvrzeno (confirmed)
- 🟡 **Žlutá** = Čeká na potvrzení (pending)
- 🔵 **Modrá** = Dokončeno (completed)
- ⚫ **Šedá** = Zrušeno (cancelled)
- 🔴 **Červená** = Nedostavil se (no-show)
- 🟣 **Fialová** = Neordinuje se / Blokace (blocked)

#### Funkce:
- **Navigace:** Předchozí/Další týden, Tlačítko "Dnes"
- **Přepínání zobrazení:** Týden / Jen dnes
- **Klik na prázdný slot** → Otevře modal pro přidání termínu
- **Klik na obsazený slot** → Otevře detail termínu
- **Hover na termín** → Zobrazí Patient Quick View tooltip 💡
- **Automatické akce v kartách:**
  - "Potvrdit" tlačítko pro pending termíny
  - "Dokončit" tlačítko pro confirmed termíny

#### Nové LEAN funkce:
- **Patient Quick View Tooltip** - Najetí myši na termín zobrazí:
  - Jméno pacienta, věk, pohlaví
  - Telefon (klikatelný)
  - **Alergie** (červeně zvýrazněno) ⚠️
  - Poslední návštěva
  - Doktorova poznámka
  - Počet celkových návštěv
- **Urgentní termíny** - Červená ikona 🚨 u prioritních termínů

#### Délky termínů:
- ✅ 30 minut (40px)
- ✅ 45 minut (60px)
- ✅ 60 minut (80px)
- ✅ 90 minut (120px) - přesahuje přes sloty
- ✅ 120 minut (160px) - přes 2 sloty

---

### 3. **➕ Přidání termínu (AddAppointmentModal)**

Modal s **3 způsoby** přidání pacienta:

#### Tab 1: Existující pacient
- Vyhledávání podle jména nebo telefonu
- Výběr ze seznamu 30 pacientů
- Zobrazení základních údajů (telefon, email, věk)

#### Tab 2: Nový pacient
- Formulář: Jméno, Příjmení, Telefon, Email, Datum narození
- Validace povinných polí (jméno, příjmení, telefon)

#### Tab 3: Rychlá rezervace ⚡
- Minimalistický formulář: jen Jméno a Telefon
- Pro rychlé vytvoření termínu s doplněním údajů později

#### Společné pole pro všechny:
- **Datum a čas** (předvyplněno z kliknutého slotu)
- **Typ ošetření** (10 typů služeb)
- **Délka** (30/45/60/90/120 minut)
- **Status** (Čeká/Potvrzeno/Dokončeno/Zrušeno)
- **🚨 Urgentní** (checkbox pro prioritní termíny) - LEAN feature
- **Poznámky** (volitelné)

#### Validace:
- ✅ Kontrola povinných polí
- ✅ Detekce konfliktů (overlapping appointments)
- ✅ Zobrazení chybových hlášek

---

### 4. **📋 Detail termínu (AppointmentDetailModal)**

Modal zobrazující kompletní informace o termínu.

#### Zobrazené informace:
- **Status badge** s barevným označením a ikonou
- **Pacient:** Jméno, telefon (klikatelný tel: link)
- **Datum a čas:** Celý čas včetně konce (08:00 - 09:30)
- **Typ ošetření:** Název služby
- **Poznámky:** Pokud existují
- **Metadata:** Čas vytvoření a poslední úpravy

#### Akce:
- **"Přejít do karty pacienta"** → Navigace na `/admin/patients?id={patientId}`
  - Zavře modal termínu
  - Otevře seznam pacientů
  - Automaticky otevře detail konkrétního pacienta
- **"Historie"** tlačítko → Zobrazí minulé návštěvy pacienta (z diáře)
- **"Upravit termín"** → Přepne do editačního režimu
- **"Smazat termín"** → Smaže termín po potvrzení

#### Editační režim:
- Všechna pole jsou editovatelná
- Validace konfliktů při uložení
- Možnost zrušit změny
- Tlačítko "Uložit změny"

#### Quick akce:
- **"Potvrdit termín"** (pro pending status) → Přepne na confirmed
- **Telefon pacient** - přímý link na volání

---

### 5. **👥 Správa pacientů (Admin → Pacienti)**

Kompletní databáze 30 mock pacientů s detailními údaji.

#### Seznam pacientů - 8 sloupců:
1. **Pacient** - Jméno, příjmení, věk, foto
2. **Kontakt** - Telefon, email
3. **Poslední návštěva** - Relativní čas
4. **Další termín** - Počet nadcházejících návštěv
5. **Celkem** - Počet všech návštěv
6. **Utraceno** - Celková částka v Kč
7. **Status** - Aktivní/Neaktivní/Archivován
8. **Akce** - Tlačítko "Zobrazit detail"

#### Filtrace a vyhledávání:
- **Vyhledávání** - Podle jména, telefonu, emailu
- **Filter statusu** - Aktivní/Neaktivní/Archivovaní
- **Filter tagů** - VIP/Pravidelný/Nový/Rizikový
- **Třídění** - Podle jména/poslední návštěvy/celkové útraty

#### Detail pacienta (Modal):
**LEAN verze - 3 záložky (zjednodušeno):**

1. **Osobní údaje**
   - Jméno, příjmení, datum narození, věk, pohlaví
   - Telefon, email
   - Adresa (ulice, město, PSČ)

2. **Zdravotní informace**
   - **Alergie** (zvýrazněné)
   - Chronická onemocnění
   - Užívané léky
   - Poznámky lékaře

3. **Historie návštěv**
   - První návštěva
   - Poslední návštěva
   - Celkem návštěv
   - Nadcházející termíny
   - Nedostavení (no-shows)
   - Zrušení

**Poznámka:** Finance, marketing, preference a metadata byly skryty pro zjednodušení. Data zůstávají uložená.

#### URL parametr pro přímý přístup:
- `/admin/patients?id=1` → Automaticky otevře detail pacienta s ID=1
- Funguje z odkazu "Přejít do karty pacienta" v detailu termínu

---

### 6. **⏰ Ordinační hodiny (Office Hours)**

Systém správy pracovní doby ordinace.

#### Funkce:
- **7 dní v týdnu** (Po-Ne)
- **Více časových bloků** na jeden den (např. 8-12 + 13-16)
- **Volitelné zapnutí/vypnutí** každého dne
- **Validace překrývání** časových bloků
- **localStorage perzistence**
- **Kompaktní zobrazení** v hlavičce kalendáře

#### Formát času:
- Zobrazení bez leading zeros: "7-11 12-15" (místo 07:00-11:00)
- Celé hodiny bez minut: "8" (místo 8:00)
- Minuty jen pokud ≠ :00: "7.30" (místo 7:30)

#### Editor (Admin → Nastavení → Ordinační doba):
- Switch On/Off pro každý den
- Přidání/odebrání časových bloků
- Time picker pro start a end
- Validace duplicit a překryvů

#### Integrace do kalendáře:
- Sloty mimo ordinační dobu = šedé + neaktivní
- Sloty v ordinační době = bílé + klikatelné
- Zobrazení v hlavičce: "Po 8-11 12-15, Út 8-11 12.30-15..."

---

### 7. **🎯 Dashboard (Admin → Dashboard)** - LEAN verze

Zjednodušený přehled zaměřený **pouze na dnešní operace**.

#### Urgentní termíny (pokud existují) 🚨
- Červeně zvýrazněná sekce
- Termíny označené jako urgentní
- Zobrazení času, pacienta, služby
- Klikatelný telefon (rychlé volání)
- Tlačítko "Zobrazit detail"

#### Dnešní termíny
- Seznam všech termínů na dnešek
- Seřazeno podle času
- Barevné označení statusu
- Jméno pacienta + typ ošetření
- Čas a poznámky
- Klikatelný telefon (tel: link)
- Klik na kartu → detail termínu ✅
- Urgentní ikona u prioritních termínů

#### Čekající na potvrzení
- Seznam termínů se statusem "pending"
- Datum, čas, pacient, služba
- Tlačítko "Potvrdit" pro rychlou akci
- Žlutě zvýrazněno

**Co bylo odstraněno:** Statistické karty, grafy, trendy, týdenní přehledy

---

### 8. **📊 Statistiky (Admin → Statistiky)**

Vizualizace dat ordinace.

#### Metriky:
- **Dnešní pacienti** - Počet + trend
- **Tento měsíc** - Počet pacientů
- **Příjmy** - Celková částka
- **Průměrná návštěvnost** - Pacienti/den

#### Grafy a přehledy:
- Top služby (s progress bary)
- Výnosnost služeb
- Trend návštěvnosti
- Další statistiky

---

### 9. **⏱️ Čekatelna (Admin → Čekatelna)** 🔒 BUSINESS+

Správa čekací listiny pro volné termíny.

#### Funkce:
- Seznam pacientů čekajících na termín
- Prioritní označení (Vysoká/Střední/Nízká)
- Preferovaný typ ošetření
- Preferovaný čas
- Kontaktní údaje
- Datum přidání na seznam

#### Akce:
- Přidat nového pacienta na čekatelnu
- Odebrat ze seznamu
- Kontaktovat pacienta (email/telefon)
- Přiřadit volný termín

---

### 10. **⚙️ Nastavení (Admin → Nastavení)** 

Konfigurace ordinace s **9 záložkami**:

#### 1. **Obecné** (všechny tier)
- Název ordinace
- Adresa
- Telefonní číslo
- Email
- Web

#### 2. **Ordinační doba** (všechny tier)
- Editor pracovních hodin
- Správa časových bloků
- Zapnutí/vypnutí dnů

#### 3-9. **Zamčené pro PROFI** 🔒:
- **Notifikace** - Email, SMS nastavení
- **Platby** - Způsoby plateb, faktury
- **Personál** - Správa zaměstnanců
- **Služby** - Katalog služeb a ceník
- **Integrace** - API klíče, webhooks
- **Zabezpečení** - 2FA, zálohy
- **Pokročilé** - Experimentální funkce

---

### 11. **👨‍⚕️ Uživatelé (Admin → Uživatelé)** 🔒 PROFI

Správa přístupů do systému (multi-user).

#### Funkce:
- Seznam uživatelů (lékaři, recepce, admin)
- Role a oprávnění
- Přidání/odebrání uživatele
- Aktivace/deaktivace účtu

---

## 🆕 LEAN Features (nové v 1.0.0)

### **Patient Quick View Tooltip** 💡
Hover tooltip zobrazující klíčové informace o pacientovi přímo v kalendáři.

**Kde:** Kalendář - najetí myši na termín  
**Zobrazuje:**
- Hlavička: Jméno, věk, pohlaví
- Telefon (klikatelný modrý odkaz)
- **Alergie** - červeně zvýrazněno ⚠️
- Poslední návštěva (relativní čas)
- Doktorova poznámka (pokud existuje)
- Celkem návštěv

**Výhoda:** Rychlý přehled bez otevírání detailu pacienta

### **Urgentní termíny** 🚨
Označení prioritních termínů pro rychlou identifikaci.

**Kde:**
- Checkbox v Add/Edit Appointment modal
- Červená ikona `AlertCircle` v kalendáři
- Samostatná sekce v dashboardu (nahoře)

**Databáze:** `Appointment.isUrgent: boolean`

**Use case:** Akutní bolest, emergency návštěvy, VIP pacienti

### **Drag & Drop (připraveno)** 🎯
Hook pro přesun termínů v kalendáři.

**Status:** Disabled pro BASIC tier  
**Aktivace:** BUSINESS+ tier  
**Soubor:** `lib/hooks/use-drag-drop.ts`

**Funkce:**
- Přetažení termínu na jiný slot
- Validace konfliktů
- Validace ordinačních hodin
- Automatická aktualizace

### **API Availability** 📡
Mock endpoint pro zjištění volných termínů (BUSINESS+ feature).

**Soubor:** `lib/hooks/use-availability-api.ts`  
**Použití:** Externí rezervační systémy, online booking

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-12-29",
      "time": "09:00",
      "available": true,
      "duration": 30
    }
  ],
  "count": 24,
  "date_from": "2025-12-29",
  "date_to": "2025-12-31"
}
```

---

## 🎨 Design systém

### Barvy:
- **Primární:** Modrá (#3B82F6)
- **Úspěch:** Zelená (#10B981)
- **Varování:** Žlutá/Amber (#F59E0B)
- **Chyba:** Červená (#EF4444)
- **Neutrální:** Šedá paleta

### Komponenty:
- **shadcn/ui** - Button, Input, Select, Dialog, Card, Badge, Tabs
- **Radix UI** - Dialog, Tooltip primitives
- **Lucide React** - Ikony

### Styl:
- Čisté rozhraní bez gradientů
- Jednoduché tabulky s hover efekty
- Minimalistický design
- Responzivní layout

---

## 💾 Datová architektura

### Contexts (React Context API):
1. **TierContext** - Správa tier/balíčků
2. **OfficeHoursContext** - Ordinační hodiny
3. **AppointmentContext** - Termíny a rezervace
4. **UserContext** - Uživatelská data

### localStorage klíče:
- `dental-tier` - Vybraný tier
- `dental_office_hours` - Pracovní hodiny
- `dental_appointments` - Všechny termíny
- `dental_user` - Údaje o přihlášeném uživateli

### Mock data:
- **30 pacientů** (`MOCK_PATIENTS`) - Kompletní profily
- **~20 termínů** (generované dynamicky pro aktuální týden)

---

## 🔄 Workflow příkladů

### Scénář 1: Přidání termínu pro existujícího pacienta
1. Admin → Kalendář
2. Klik na prázdný slot (např. Út 9:00)
3. Modal "Přidat termín" se otevře
4. Tab "Existující pacient"
5. Vyhledej "Jana" → Vyber "Jana Svobodová"
6. Vyber typ: "Kontrola", délka: 30 minut
7. Přidej poznámku (volitelné)
8. Klik "Přidat termín"
9. ✅ Termín se zobrazí v kalendáři (žlutá = čeká na potvrzení)

### Scénář 2: Potvrzení čekajícího termínu
1. Klik na žlutý termín v kalendáři
2. Detail se otevře
3. Klik "Potvrdit termín" (v status badge)
4. ✅ Status se změní na zelený (potvrzeno)

### Scénář 3: Přechod z termínu do karty pacienta
1. Klik na termín v kalendáři
2. Detail termínu se otevře
3. Klik "Přejít do karty pacienta"
4. Modal se zavře
5. Navigace na `/admin/patients?id=1`
6. ✅ Automaticky se otevře detail pacienta

### Scénář 4: Rychlá rezervace
1. Kalendář → Klik na slot
2. Tab "Rychlá rezervace" ⚡
3. Zadej: "Petr Novotný", "+420 123 456 789"
4. Vyber typ: "Plomba", 60 minut
5. Klik "Přidat termín"
6. ✅ Termín vytvořen, údaje pacienta doplníš později

### Scénář 5: Urgentní termín (LEAN) 🚨
1. Kalendář → Klik na slot
2. Vyber pacienta
3. **Zaškrtni "Urgentní termín"**
4. Vyber typ a čas
5. Přidej poznámku (např. "Akutní bolest")
6. ✅ Termín se zobrazí s červenou ikonou
7. Dashboard → Urgentní sekce zobrazí termín nahoře

### Scénář 6: Patient Quick View (LEAN) 💡
1. Kalendář → Najeď myší na termín
2. ✅ Tooltip se zobrazí s info o pacientovi
3. Zobrazí: jméno, věk, telefon, **alergie**, poznámku
4. Klik na telefon → Zavolání pacienta
5. Klik na termín → Detail termínu

---

## 🚀 Technické detaily

### Routování:
- `/` - Veřejná prezentace ordinace
- `/v1`, `/v2`, `/v3` - Demo verze
- `/admin/calendar` - Kalendář
- `/admin/dashboard` - Dashboard
- `/admin/patients` - Seznam pacientů
- `/admin/patients?id=1` - Detail pacienta
- `/admin/waitlist` - Čekatelna
- `/admin/users` - Uživatelé
- `/admin/settings` - Nastavení
- `/admin/stats` - Statistiky

### Klíčové features:
- ✅ Server-side rendering (Next.js)
- ✅ Client-side routing
- ✅ localStorage persistence
- ✅ URL query params pro deep linking
- ✅ Validace formulářů
- ✅ Konflikty termínů
- ✅ Responzivní design
- ✅ TypeScript type safety
- ✅ **Patient Quick View tooltip** (LEAN)
- ✅ **Urgentní termíny** (LEAN)
- ✅ **Hover info v kalendáři** (LEAN)

### Výkon:
- Fast Refresh pro vývoj
- Turbopack bundler
- Optimalizované komponenty
- Lazy loading (kde je to možné)

---

## 📝 TODO / Možná vylepšení

### LEAN verze - Připraveno
- [✅] Patient Quick View tooltip
- [✅] Urgentní termíny s ikonou
- [✅] Zjednodušený Dashboard
- [✅] Zjednodušený Patient Detail (3 záložky)
- [✅] Drag & drop hook (připraveno, disabled)
- [✅] API availability mock (připraveno)
- [✅] Tier redistribuce (BASIC plně funkční)

### V plánu
- [ ] Aktivovat drag & drop pro BUSINESS tier
- [ ] Skutečný API endpoint `/api/availability`
- [ ] Export termínů do PDF/Excel
- [ ] Email notifikace pacientům
- [ ] SMS připomínky (integrace)
- [ ] Platební brána integrace
- [ ] Multi-doktor podpora (PROFI)
- [ ] Mobilní aplikace
- [ ] Online rezervační systém pro pacienty
- [ ] Integrované videohovory (telemedicína)
- [ ] Elektronická zdravotní dokumentace

---

## 🎯 Stav projektu

**Status:** ✅ LEAN 1.0.0 - Optimalizováno pro malou kliniku

**Co funguje:**
- ✅ Kalendář s přidáváním/editací/mazáním termínů
- ✅ Detail pacienta (LEAN - 3 záložky)
- ✅ Navigace termín → karta pacienta
- ✅ Ordinační hodiny s validací
- ✅ Tier systém s LEAN distribucí
- ✅ Mock data pro testování
- ✅ **Patient Quick View tooltip** 💡
- ✅ **Urgentní termíny** 🚨
- ✅ **LEAN Dashboard** (pouze dnes)
- ✅ **Drag & drop hook** (připravený)
- ✅ **API availability** (mock)

**LEAN vylepšení:**
- ✅ BASIC tier je plně funkční (ne jen demo)
- ✅ Dashboard zaměřený na dnešek
- ✅ Patient info při hover (tooltip)
- ✅ Urgentní označení termínů
- ✅ Zjednodušený patient detail
- ✅ Tier redistribuce (postupný upgrade)

**Známé problémy:**
- ⚠️ Inline styles warnings (minor CSS issue)
- ⚠️ Markdown lint warnings (dokumentace)
- ✅ Accessibility fixes done

**Připravené features (disabled):**
- 🎯 Drag & drop termínů (BUSINESS+)
- 📡 API dostupnost (BUSINESS+)
- 👥 Multi-user (PROFI)

---

## 📦 Instalace a spuštění

```bash
# Instalace závislostí
npm install

# Vývojový server
npm run dev

# Build pro produkci
npm run build

# Start produkční build
npm start
```

**URL:** http://localhost:3000 (nebo :3001 pokud je 3000 obsazený)

---

## 📊 LEAN verze - Změny oproti původní

### Co bylo přidáno:
- ✅ Patient Quick View tooltip (hover v kalendáři)
- ✅ Urgentní termíny s červenou ikonou
- ✅ LEAN Dashboard (focus na dnes)
- ✅ Zjednodušený Patient Detail (3 záložky)
- ✅ Drag & drop hook (připravený, disabled)
- ✅ API availability hook (BUSINESS+)
- ✅ Nová tier distribuce (BASIC plně funkční)

### Co bylo zjednodušeno:
- ⚙️ Dashboard: Pouze dnešní operace (bez statistik a grafů)
- ⚙️ Patient Detail: 3 záložky místo 5 (skryto: finance, marketing)
- ⚙️ Tier BASIC: Nyní plně funkční admin (ne jen web)

### Co zůstalo zachováno:
- ✅ Veškerá data (nic se nesmazalo)
- ✅ Všechny původní funkce kalendáře
- ✅ Add/Edit/Delete termínů
- ✅ Navigace termín → pacient
- ✅ Ordinační hodiny
- ✅ Tier systém

### Nové komponenty:
1. `components/patient-quick-view.tsx` - Hover tooltip
2. `lib/hooks/use-drag-drop.ts` - Drag & drop hook
3. `lib/hooks/use-availability-api.ts` - API availability

### Cílová skupina:
- **Primární:** Malá ordinace (1 lékař + 1 sestra)
- **Benefit:** Úspora 30-60 minut denně
- **Focus:** Rychlý přehled, jednoduchost, efektivita

---

*Dokumentace aktualizována: 28. prosince 2025*  
*Verze: LEAN 1.0.0*
