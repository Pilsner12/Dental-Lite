# 🔄 Systém undo/redo a historie změn

## 📋 Přehled

Implementovaný systém zabraňuje ztrátě dat při práci s kalendářem a poskytuje možnost vrátit zpět jakoukoliv změnu.

## 🎯 Klíčové funkce

### 1. **Automatické sledování změn**
Každá operace s termínem je zaznamenána do historie:
- ✅ Vytvoření termínu
- ✅ Úprava termínu
- ✅ Smazání termínu
- ✅ Přesunutí termínu (drag & drop)
- ✅ Změna délky termínu (resize)

### 2. **Bezpečný drag & drop**
- **Backup pozice**: Při začátku tažení se uloží původní pozice
- **Validace**: Kontrola, zda je nová pozice v pracovní době
- **Rollback**: Při pusení mimo platnou oblast se termín vrátí zpět
- **Toast notifikace**: Po úspěšném přesunutí s možností "Vrátit zpět"

### 3. **Toast notifikace**
Každá změna zobrazí notifikaci:
- Auto-dismiss po 5 sekundách
- Tlačítko "Vrátit zpět" pro undo
- Popisná zpráva co se změnilo
- Možnost manuálně zavřít

### 4. **Historie změn**
Detailní přehled všech změn v kalendáři:
- Tlačítko "Historie" v hlavičce kalendáře
- Chronologický seznam změn
- Barevné rozlišení typů akcí
- Tlačítko "Obnovit" u každé položky
- Ukládá posledních 100 změn

## 🔧 Technická implementace

### Context API rozšíření

**lib/appointment-context.tsx**
```typescript
interface HistoryEntry {
  id: string
  timestamp: Date
  action: "create" | "update" | "delete" | "drag" | "resize"
  appointmentId: string
  oldData?: Partial<Appointment>
  newData?: Partial<Appointment>
  description: string
}

// Nové funkce v kontextu:
- history: HistoryEntry[]
- updateAppointment(id, updates, action?)
- undoChange(historyId)
- clearHistory()
```

### Toast komponenta

**components/ui/toast.tsx**
- Custom event listener pro globální toast
- Automatické zavírání po 5s
- Podpora undo callback
- Z-index 9999 pro overlay nad vším

### Kalendář změny

**app/admin/calendar/page.tsx**

**Drag & Drop s rollback:**
```typescript
// handleDragStart
- Uložení originalPosition

// handleDrop
- Validace nové pozice
- Rollback pokud neplatná
- Toast s undo možností

// handleDragEnd
- Rollback pokud nebyl drop
```

**Resize s historií:**
```typescript
// handleResizeStart
- Tracking během resize
- Toast po dokončení s undo
```

## 📊 Persistence

### LocalStorage
- `dental_appointments`: Všechny termíny
- `dental_history`: Historie změn (max 100)

### Automatické ukládání
- Při každé změně appointment
- Při přidání do historie
- Načítání při mount

## 🎨 UI Komponenty

### History Modal
- Otevře se tlačítkem "Historie"
- Scrollovatelný seznam
- Barevné badges pro typy akcí:
  - 🟢 Zelená: create
  - 🔵 Modrá: update
  - 🔴 Červená: delete
  - 🟣 Fialová: drag
  - 🟠 Oranžová: resize

### Toast Notifications
- Pravý horní roh
- Slide-in animace
- Stack více toastů
- Click na "Vrátit zpět" = undo + close

## 🔐 Bezpečnost dat

### Prevence ztráty
1. **Při drag outside**: Termín se vrátí na původní místo
2. **Při invalid drop**: Validace + rollback
3. **Při dragEnd bez drop**: Restore original

### Validace
- Čas v rozmezí 7:00-19:00
- Pouze 15min intervaly (0, 15, 30, 45)
- Clamp hodnot (0-1 pro percentage, 0-45 pro minuty)

## 📝 User Flow

### Přesunutí termínu
1. Začni táhnout termín → Uloží se original pozice
2. Pusť na platnou pozici → Uloží změnu + toast "Vrátit zpět"
3. Pusť mimo platnou oblast → Rollback + toast "Vráceno"
4. Pusť mimo kalendář → handleDragEnd rollback

### Undo z notifikace
1. Toast se zobrazí po změně
2. Click "Vrátit zpět" během 5s
3. Restore oldData z historie
4. Nový toast "Změna byla vrácena zpět"

### Undo z historie
1. Otevři "Historie" v hlavičce
2. Najdi změnu v seznamu
3. Click "Obnovit"
4. Restore + toast potvrzení

## 🚀 Budoucí rozšíření

### Možnosti
- [ ] Redo funkce (obnovit vrácené změny)
- [ ] Bulk undo (vrátit více změn najednou)
- [ ] Export historie do CSV
- [ ] Filtrování historie (jen drag, jen delete, atd.)
- [ ] Search v historii (podle jména pacienta)
- [ ] Diff view (porovnání old vs new)

### Optimalizace
- [ ] Virtualizace seznamu historie (react-window)
- [ ] Pagination historie
- [ ] Debounce pro resize tracking
- [ ] IndexedDB místo localStorage

## 🐛 Řešené problémy

### ❌ Problém: Zmizí termín při drag outside
**✅ Řešení**: 
- Backup original pozice
- handleDragEnd rollback
- Validace v handleDrop

### ❌ Problém: Nelze vrátit zpět změny
**✅ Řešení**:
- History tracking v context
- Toast s undo button
- Historie modal s obnovením

### ❌ Problém: Uživatel neví o změnách
**✅ Řešení**:
- Toast notifikace každé změny
- Popisné zprávy (kdo, kdy, co)
- Viditelná historie

## 📖 Závěr

Systém poskytuje:
- **Bezpečnost**: Žádná ztráta dat
- **Transparentnost**: Vše sledováno a viditelné
- **Control**: Možnost vrátit jakoukoliv změnu
- **UX**: Toast feedback + detailní historie
