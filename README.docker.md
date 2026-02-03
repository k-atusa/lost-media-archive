# Docker Setup

## Build & Run

```bash
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3001
- IPFS Gateway: http://localhost:8081
- IPFS API: http://localhost:5001

## Notes

- SQLite data persists in Docker volume `backend-data`.
- IPFS data persists in Docker volume `ipfs-data`.
- The backend uses `ipfs` CLI. In this Docker setup, IPFS runs as a separate container. You may also install the `ipfs` CLI inside the backend container if needed.
