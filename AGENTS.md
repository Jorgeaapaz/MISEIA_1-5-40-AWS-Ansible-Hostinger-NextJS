<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Overview

Professional landing page promoting an Artificial Intelligence training program, deployed to AWS EC2 via GitHub Actions CI/CD.

## Tech Stack

- **Framework:** Next.js (latest — see note above)
- **CI/CD:** GitHub Actions
- **Hosting:** AWS EC2 (Ubuntu)

## Repository

Push to: `Jorgeaapaz/gh-aws`

## Deployment

- **Target server:** `ubuntu@3.235.47.30`
- **SSH key:** `C:/ubuntuiso/.ssh/vboxuser`
- **Deploy method:** SSH into EC2 after GitHub Actions build
- **Service:** Create and manage a systemd service on the EC2 instance to run the Next.js app

## CI/CD Pipeline (GitHub Actions)

1. Build the Next.js app on GitHub runners
2. SSH into the EC2 instance using a stored secret key
3. Pull the latest build / transfer artifacts
4. Restart the systemd service

## Required GitHub Secrets

| Secret name              | Value                                      |
|--------------------------|--------------------------------------------|
| `EC2_SSH_KEY`            | Contents of `vboxuser` private key         |
| `EC2_HOST`               | `3.235.47.30`                              |
| `EC2_USER`               | `ubuntu`                                   |
| `MONGO_ROOT_USERNAME`    | MongoDB root username (`admin`)            |
| `MONGO_ROOT_PASSWORD`    | MongoDB root password                      |
| `JWT_SECRET`             | Signing secret for user session JWTs       |

## Tasks

- [x] Build landing page (professional AI training promotion)
- [x] Push repo to `Jorgeaapaz/gh-aws`
- [x] Configure GitHub Actions workflow (build + deploy)
- [ ] Run `scripts/setup-ec2.sh` on the EC2 instance (one-time bootstrap)
- [x] Set GitHub repository secrets (`EC2_SSH_KEY`, `EC2_HOST`, `EC2_USER`, `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`, `JWT_SECRET`)
- [x] Add MongoDB + Express users API to the CI/CD pipeline and `docker-compose.yml`
