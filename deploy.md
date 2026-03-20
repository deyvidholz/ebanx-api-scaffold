# Deployment Guide

The API is deployed to a Linux server via GitHub Actions using SSH. Traefik (already running on the VPS) handles HTTPS and routing via the shared `web` Docker network.

Live URL: `https://ebanx-test.deyvidholz.dev`

---

## Prerequisites

### Server setup (one-time)

1. Clone the repository to the deploy path on the server:
   ```bash
   git clone <repo-url> /path/to/deploy
   ```

2. Create a `.env` file in the deploy path from the example:
   ```bash
   cp .env.example .env
   # then edit .env and fill in the values
   ```

3. Start the stack for the first time:
   ```bash
   docker compose up -d
   ```

### GitHub secrets

Add the following secrets to the GitHub repository under **Settings → Environments → `prod`**:

| Secret | Description |
|---|---|
| `SSH_PRIVATE_KEY` | Base64-encoded private SSH key (`base64 -w0 ~/.ssh/id_rsa`) |
| `SSH_HOST` | Server hostname or IP |
| `SSH_USER` | SSH username |
| `PROD_DEPLOY_PATH` | Absolute path to the cloned repo on the server |

---

## Deploying

1. Go to the repository on GitHub.
2. Navigate to **Actions → Deploy to Production**.
3. Click **Run workflow**.
4. Type `deploy` in the confirmation field and click **Run workflow**.

The workflow will:
- SSH into the server
- Pull and merge the latest `main` branch
- Run `scripts/deploy-prod.sh`, which rebuilds and restarts the containers
- Fail and print logs if any container ends up unhealthy

---

## Rollback

If a deployment breaks the service, SSH into the server and roll back to the previous commit:

```bash
cd /path/to/deploy
git log --oneline -5          # find the commit to roll back to
git checkout <commit-hash>
bash scripts/deploy-prod.sh
```

---

## Checking logs

```bash
# All services
docker compose logs -f

# API only
docker compose logs -f api

# Traefik (shared, not managed by this stack)
docker logs traefik
```
