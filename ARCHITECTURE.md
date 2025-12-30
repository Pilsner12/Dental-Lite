# 🏗️ Architecture: Undo/Redo System

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CALENDAR COMPONENT                        │
│  app/admin/calendar/page.tsx                                │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ handleDragStart│  │  handleDrop    │  │handleDragEnd │  │
│  │                │  │                │  │              │  │
│  │ • Store        │  │ • Validate     │  │ • Rollback   │  │
│  │   original     │  │ • Update or    │  │   if needed  │  │
│  │   position     │  │   rollback     │  │              │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│                            │                                 │
│                            ▼                                 │
│                  ┌────────────────────┐                      │
│                  │  handleResizeStart │                      │
│                  │                    │                      │
│                  │  • Track resize    │                      │
│                  │  • Update on end   │                      │
│                  └────────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              APPOINTMENT CONTEXT (State Manager)             │
│  lib/appointment-context.tsx                                │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  updateAppointment(id, updates, action)             │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │ 1. Get oldData (current state)                │  │   │
│  │  │ 2. Apply updates → newData                    │  │   │
│  │  │ 3. Generate description                       │  │   │
│  │  │ 4. addToHistory(action, id, old, new, desc)   │  │   │
│  │  │ 5. Update state                               │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  undoChange(historyId)                              │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │ 1. Find entry in history                      │  │   │
│  │  │ 2. Restore oldData                            │  │   │
│  │  │ 3. Update state                               │  │   │
│  │  │ 4. Add "undo" to history                      │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  State:                                                      │
│  • appointments: Appointment[]                               │
│  • history: HistoryEntry[]                                   │
└─────────────────────────────────────────────────────────────┘
                 │                        │
                 │ (persist)              │ (notify)
                 ▼                        ▼
    ┌─────────────────────┐   ┌────────────────────────┐
    │   LOCAL STORAGE     │   │   TOAST NOTIFICATION   │
    │                     │   │  components/ui/toast   │
    │ dental_appointments │   │                        │
    │ dental_history      │   │  • Auto-dismiss 5s     │
    └─────────────────────┘   │  • "Vrátit zpět" btn   │
                              │  • Stack multiple      │
                              └────────────────────────┘
```

## 🔄 State Machine: Drag & Drop

```
┌──────────────┐
│   IDLE       │
│  (normal)    │
└──────────────┘
       │
       │ onDragStart(appointment)
       ▼
┌──────────────────────┐
│   DRAGGING           │
│ • originalPosition   │ ──────────────┐
│   stored             │               │
│ • dragOffset set     │               │
└──────────────────────┘               │
       │                               │
       │ onDrop(valid position)        │ onDragEnd(no drop)
       │                               │
       ▼                               │
┌──────────────────────┐               │
│  VALIDATE POSITION   │               │
│ • Check hours        │               │
│ • Check boundaries   │               │
└──────────────────────┘               │
       │            │                  │
  VALID│            │INVALID           │
       │            │                  │
       ▼            ▼                  │
┌────────┐    ┌──────────┐            │
│ UPDATE │    │ ROLLBACK │◄───────────┘
│        │    │          │
│ • Save │    │ • Restore│
│ • Toast│    │ • Toast  │
└────────┘    └──────────┘
       │            │
       │            │
       ▼            ▼
    ┌───────────────────┐
    │   HISTORY ENTRY   │
    │   • Timestamp     │
    │   • Action        │
    │   • Old/New Data  │
    │   • Description   │
    └───────────────────┘
              │
              ▼
         ┌─────────┐
         │  IDLE   │
         └─────────┘
```

## 📦 Component Hierarchy

```
app/layout.tsx
  └── AppointmentProvider
        │
        └── app/admin/layout.tsx
              ├── AdminSidebar
              ├── {children}
              └── ToastContainer ← Globální toast listener
                    │
                    └── app/admin/calendar/page.tsx
                          ├── Header
                          │    ├── "Historie" button
                          │    └── "Přidat" button
                          │
                          ├── Calendar Grid
                          │    └── Appointment Cards
                          │          ├── Drag Handle (top center)
                          │          └── Resize Handle (bottom)
                          │
                          ├── AddAppointmentModal
                          ├── AppointmentDetailModal
                          │
                          └── History Modal
                                └── HistoryEntry List
                                      └── "Obnovit" buttons
```

## 💾 Data Structures

### HistoryEntry
```typescript
{
  id: "history-1234567890",
  timestamp: Date,
  action: "drag" | "resize" | "create" | "update" | "delete",
  appointmentId: "apt-123",
  oldData: {
    date: Date(2024-01-15),
    time: "10:00",
    duration: 30
  },
  newData: {
    date: Date(2024-01-15),
    time: "14:30",
    duration: 30
  },
  description: "Přesunut termín: Jan Novák z 15.1.2024 10:00 na 15.1.2024 14:30"
}
```

### Toast
```typescript
{
  id: "toast-1234567890",
  message: "Přesunut termín: Jan Novák...",
  historyId?: "history-1234567890",
  onUndo?: (historyId) => { /* callback */ }
}
```

## 🎨 UI States

### Calendar Drag States
1. **Normal**: No dragging, normal hover effects
2. **Drag Start**: Original position stored, drag image created
3. **Dragging**: Visual preview, dragOverSlot updated
4. **Drop Valid**: Update + toast with undo
5. **Drop Invalid**: Rollback + toast notification
6. **Drag End (no drop)**: Rollback to original

### History Modal States
1. **Closed**: Hidden
2. **Open Empty**: "Zatím žádné změny" message
3. **Open with entries**: Scrollable list, "Obnovit" buttons

### Toast States
1. **Appear**: Slide-in animation from right
2. **Visible**: 5s countdown to auto-dismiss
3. **Dismiss**: Fade out, remove from DOM
4. **Undo clicked**: Trigger callback, dismiss immediately

## 🔐 Safety Mechanisms

### 1. Validation Layer
```
User Action
    ↓
Validation
    ├─ Valid? → Execute + History
    └─ Invalid? → Rollback + Toast
```

### 2. Rollback Points
- **onDragEnd**: If no valid drop occurred
- **onDrop**: If position validation fails
- **History**: Manual undo from user

### 3. Data Integrity
- Always store oldData before update
- Atomic updates (all or nothing)
- LocalStorage sync after each change
- Max 100 history entries (prevents memory leak)

## 📊 Performance Considerations

### Optimizations
1. **History limit**: Max 100 entries
2. **LocalStorage**: Debounced writes
3. **Toast auto-dismiss**: Prevents toast stack overflow
4. **Event handlers**: Proper cleanup on unmount

### Memory Management
```
History Array (FIFO)
┌───────────────────────────────┐
│ [0]  Most recent (newest)     │ ← New entries push here
│ [1]                           │
│ [2]                           │
│ ...                           │
│ [98]                          │
│ [99] Oldest                   │ ← .slice(0, 100) removes beyond
└───────────────────────────────┘
```

## 🎯 Success Criteria

✅ **No data loss**: Appointments always return to valid state  
✅ **Transparency**: Every change tracked and visible  
✅ **User control**: Undo from toast OR history modal  
✅ **Good UX**: Clear feedback, auto-dismiss, intuitive UI  
✅ **Persistence**: Survives page refresh  
✅ **Performance**: < 100ms response, max 100 entries  

## 🚀 Extension Points

### Future Enhancements
1. **Redo stack**: Implement redo after undo
2. **Bulk operations**: Undo multiple changes at once
3. **Export**: Download history as CSV/JSON
4. **Advanced filtering**: By patient, by date range, by action type
5. **Diff view**: Visual before/after comparison
6. **Conflict resolution**: Handle concurrent edits
