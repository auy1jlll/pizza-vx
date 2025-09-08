## Running the Project with Docker

This project provides Docker and Docker Compose configurations for building and running a Next.js (TypeScript) application.

### Project-Specific Docker Requirements
- **Node.js Version:** Uses `node:22.13.1-slim` (set via `ARG NODE_VERSION=22.13.1` in the Dockerfile).
- **Build Process:**
  - Installs dependencies with `npm ci`.
  - Builds the Next.js app (`npm run build`).
  - Removes dev dependencies for production (`npm ci --production`).
- **Production User:** Runs as a non-root user (`appuser`) for security.

### Environment Variables
- The Docker Compose file references an optional `.env` file (`env_file: ./.env`).
- Example environment files are provided:
  - `.env.example`, `.env.local`, `.env.production`, `.env.production.template`, `.env.staging`, etc.
- **Required:** Ensure you have a valid `.env` file in the project root with all necessary variables for your environment. See `.env.example` for guidance.

### Build and Run Instructions
1. **Prepare Environment Variables:**
   - Copy `.env.example` to `.env` and update values as needed.
2. **Build and Start the App:**
   - Run the following command from the project root:
     ```sh
     docker compose up --build
     ```
   - This will build the Docker image and start the Next.js app in a container.

### Special Configuration
- **No External Services:** The provided Docker Compose file does not include database or cache services. If your app requires a database, you must extend the compose file and configure networking/volumes accordingly.
- **Source Files:** The Dockerfile copies the full source, including `src/`, `prisma/`, and configuration files (`next.config.ts`, `postcss.config.mjs`, `tailwind.config.ts`).
- **Security:** The container runs as a non-root user for improved security.

### Ports
- **Next.js App:**
  - Exposes port `3000` (mapped to host `3000` by default).
  - Access the app at [http://localhost:3000](http://localhost:3000).

---
_If you add a database or other services, update the Docker Compose file and this section accordingly._
