# RECURSOS VISUALES: ARQUITECTURA DE SOFTWARE

## 1. Arquitectura Hexagonal (Ports & Adapters)

Muestra cómo el Dominio está aislado del exterior.

```mermaid
graph TD
    subgraph Infrastructure
        MySQL[(MySQL Adapter)]
        REST[REST Controller Adapter]
    end

    subgraph Core Domain
        P1(<I> UserRepo Port)
        P2(<I> UserService Port)
        Logic[User Domain Logic]
    end

    REST --> P2
    P2 --> Logic
    Logic --> P1
    MySQL -.->|Implements| P1

    classDef core fill:#aaffaa,stroke:#333;
    classDef infra fill:#ffaaaa,stroke:#333;
    class Logic,P1,P2 core;
    class MySQL,REST infra;
```

## 2. Monolito vs Microservicios vs Monolito Distribuido

```mermaid
graph TD
    subgraph Monolith
        UI1[UI] --> App1[App Core]
        App1 --> DB1[(Unified DB)]
    end

    subgraph Microservices
        S1[Service A] --> DB2[(DB A)]
        S2[Service B] --> DB3[(DB B)]
        S1 -.->|Async Event| S2
    end

    subgraph DistributedMonolith
        DM1[Service A] --> DB4[(Shared DB)]
        DM2[Service B] --> DB4
        DM1 -->|Sync Call| DM2
    end
```

## 3. CQRS (Command Query Responsibility Segregation)

```mermaid
graph LR
    User((User))

    subgraph Command Side
        API_W[Write API]
        DB_W[(SQL Write DB)]
    end

    subgraph Query Side
        API_R[Read API]
        DB_R[(Redis Read DB)]
    end

    User -->|POST /buy| API_W
    API_W --> DB_W
    DB_W -.->|Event: ItemBought| SyncWorker[Sync Worker]
    SyncWorker --> DB_R
    User -->|GET /products| API_R
    API_R --> DB_R
```

## 4. Patrón SAGA (Compensación)

```mermaid
sequenceDiagram
    participant O as Orchestrator
    participant F as FlightService
    participant H as HotelService
    participant C as CarService

    O->>F: Reserve Flight
    F-->>O: Success
    O->>H: Reserve Hotel
    H-->>O: Success
    O->>C: Reserve Car
    C-->>O: FAILED (No Cars)
    
    Note over O,C: Start Compensation (Rollback)
    
    O->>H: Cancel Hotel (Compensate)
    H-->>O: Cancelled OK
    O->>F: Cancel Flight (Compensate)
    F-->>O: Cancelled OK
    
    O-->>User: Booking Failed (Clean State)
```
