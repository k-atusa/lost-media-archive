# Lost Media Archive

A decentralized archive platform that preserves lost media permanently on IPFS.

## 🌟 Highlights

- **IPFS storage**: All media is stored on a distributed network
- **Hidden CIDs**: Content identifiers are kept private to protect privacy
- **Zero-disk uploads**: Files stream directly to IPFS without touching server disk
- **Modern UI**: A premium interface built with React and Tailwind CSS

## 📁 Project Structure

```
lost-media-archive/
├── backend/               # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── db/           # SQLite database
│   │   ├── routes/       # API routes
│   │   ├── services/     # IPFS, media services
│   │   └── index.ts      # Server entry
│   └── package.json
│
└── frontend/              # Vite + React + TypeScript
    ├── src/
    │   ├── components/   # UI components
    │   ├── pages/        # Pages
    │   ├── lib/          # API client, utilities
    │   └── types/        # TypeScript types
    └── package.json
```

## 🚀 Getting Started

### Requirements

- Node.js 25.x
- IPFS daemon (go-ipfs)

### Install & Run IPFS

```bash
# macOS (Homebrew)
brew install ipfs
ipfs init
ipfs daemon
```

### Backend Setup

```bash
cd backend
npm install

# Environment variables
cp .env.example .env

# Start dev server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Start dev server
npm run dev
```

## 🔧 API Endpoints

### Media

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/media/upload` | Upload media (IPFS pipe) |
| GET | `/api/media` | List media (pagination) |
| GET | `/api/media/:id` | Media details |
| GET | `/api/media/:id/stream` | Stream media |
| GET | `/api/media/recent` | Recent media |
| GET | `/api/media/popular` | Popular media |
| GET | `/api/media/stats` | Stats |

### Collections

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/collections` | List collections |
| POST | `/api/collections` | Create collection |
| GET | `/api/collections/:id` | Collection details |

## 💡 Upload Flow

The server never stores files on disk. It streams directly to IPFS:

```typescript
// Client → Server → IPFS (no disk write)
req.pipe(ipfs.stdin);
```

Benefits:
- Server disk usage: 0 bytes
- No residual files after upload
- Reduced legal/operational risk

## 🔐 Security

- CIDs are stored only in the database and never exposed via API
- Only internal IDs (e.g., `/view/abc123`) are public
- Media is streamed only through the server

## 📝 License

MIT License