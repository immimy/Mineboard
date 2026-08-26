# BoardDragDropArea flow

```mermaid
flowchart TD
    A[Receive serverLayout] --> B[Initialize local layout state]
    B --> C[Render children from local layout]

    A --> D{Server layout effect}
    D --> E{Drag active or server object already applied?}
    E -->|Yes| C
    E -->|No| F[Copy server layout into local and last-saved state]
    F --> C

    C --> G{Drag event}
    G -->|Start| H{Sortable card or list?}
    H -->|No| C
    H -->|Yes| I[Mark drag active and clear save timer]
    I --> J[Snapshot local layout]
    J --> C

    G -->|Over| K{Sortable list?}
    K -->|No| C
    K -->|Yes| L[Use dnd-kit move on listIdsByCard]
    L --> M[Update local layout when grouped lists changed]
    M --> C

    G -->|End| N{Source type}
    N -->|Card| O{Canceled or invalid card target?}
    O -->|Yes| P[Restore drag-start snapshot]
    O -->|No| Q[Use dnd-kit move on cardIds]
    Q --> R{Card IDs changed?}
    R -->|Yes| S[Update local layout and record save job]
    R -->|No| T[Finish drag]

    N -->|List| U{Canceled or invalid list target?}
    U -->|Yes| P
    U -->|No| V[Use dnd-kit move on final list position]
    V --> W[Update local layout if needed]
    W --> X{Grouped lists differ from drag-start snapshot?}
    X -->|Yes| S
    X -->|No| T

    N -->|Other| T
    P --> T
    S --> T
    T --> Y[Mark drag inactive]
    Y --> Z[Schedule latest save after debounce]
    Z --> C
```

## Save and restoration effects

```mermaid
flowchart TD
    A[Record save request] --> B[Increment save version]
    B --> C[Replace debounced job with latest full layout]
    C --> D[Clear older failure state]
    D --> E[Wait until drag is idle for 1000 ms]
    E --> F[Move job to pending slot]
    F --> G{Worker already running?}
    G -->|Yes| H[Running worker later consumes pending job]
    G -->|No| I[Start worker]
    I --> J{Pending job exists?}
    J -->|No| K[Stop worker]
    J -->|Yes| L[Save full board layout]

    L -->|Success| M[Update lastSavedLayoutRef]
    M --> N[Clear failure up to saved version]
    N --> J

    L -->|Failure| O{Failed job is latest version?}
    O -->|No| J
    O -->|Yes| P[Set failedSaveVersion state]
    P --> Q{Restoration effect: drag active?}
    Q -->|Yes| R[Wait for drag state to become inactive]
    Q -->|No| S{Failure is still latest version?}
    R --> Q
    S -->|No| T[Clear stale failure]
    S -->|Yes| U[Restore local layout from lastSavedLayoutRef]
    U --> V[Clear failure and show error toast]
    T --> J
    V --> J
```

The local `layout` state is the only layout rendered by the component. The refs have narrower responsibilities:

- `dragStartLayoutRef` restores canceled or invalid drag gestures.
- `lastSavedLayoutRef` restores the latest successfully saved layout after a request failure.
- `appliedServerLayoutRef` prevents an unchanged server snapshot from replacing optimistic local order when a drag ends.

The worker calls the `saveBoardLayout` Server Action, which validates the full layout and sends one atomic `save_board_layout` RPC request. An action error is handled by the same latest-version rollback flow shown above.
