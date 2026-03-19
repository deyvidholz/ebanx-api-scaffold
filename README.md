# Banking API

A simple banking REST API supporting account creation, deposits, withdrawals, and transfers.

## Architecture

The project is organized around a clear separation of concerns:

```
src/
├── domain/           # Core types and domain errors
├── repositories/     # Data access interface + in-memory implementation
├── services/         # Business logic (AccountService)
├── http/
│   ├── controllers/  # HTTP request/response handling
│   └── router.ts     # Route definitions
├── app.ts            # Dependency wiring (composition root)
└── main.ts           # Entry point
```

**Key design decisions:**

- **Domain layer** (`domain/`) holds plain types and errors — no framework dependencies.
- **Repository pattern** decouples business logic from the storage mechanism. Swapping to a database requires only a new repository implementation.
- **Service layer** (`services/`) contains all business logic and knows nothing about HTTP.
- **HTTP layer** (`http/`) handles request parsing and response formatting, delegating all logic to services. Domain errors are mapped to HTTP status codes here, not in the service.
- **Composition root** (`app.ts`) wires dependencies together, making it easy to inject different implementations (e.g., for testing).

## Requirements

- Node.js 20+
- Docker (optional)

## Running locally

```bash
npm install
npm run dev
```

## Running with Docker

```bash
docker compose up
```

The API will be available at `http://localhost:8080`.
Swagger UI is available at `http://localhost:8080/docs`.

## API

| Method | Path       | Description               |
|--------|------------|---------------------------|
| POST   | `/reset`   | Reset all account state   |
| GET    | `/balance` | Get balance by account ID |
| POST   | `/event`   | Process a banking event   |

### Event types

**Deposit**
```json
{ "type": "deposit", "destination": "100", "amount": 10 }
```

**Withdraw**
```json
{ "type": "withdraw", "origin": "100", "amount": 5 }
```

**Transfer**
```json
{ "type": "transfer", "origin": "100", "destination": "300", "amount": 15 }
```
