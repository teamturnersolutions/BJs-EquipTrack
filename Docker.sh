#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Starting Docker installation..."

# 1. Prep: update and install dependencies
echo "📦 Updating system and installing dependencies..."
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

# 2. Add Docker’s official GPG key
echo "🔑 Adding Docker's GPG key..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 3. Add the Docker APT repository
echo "📂 Adding Docker repository to APT sources..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Install Docker Engine, CLI, Containerd & Compose plugin
echo "📥 Installing Docker Engine and plugins..."
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Enable and start Docker
echo "⚙️  Enabling and starting Docker service..."
sudo systemctl enable docker
sudo systemctl start docker

# 6. (Optional) Use Docker without sudo
echo "👤 Setting up user permissions for Docker..."
sudo groupadd docker 2>/dev/null || true
sudo usermod -aG docker "$USER"

# 7. Test Docker & Compose
echo "✅ Testing installation..."
sudo docker run --rm hello-world
docker compose version

# 8. Build and run the application
echo "📦 Building and running the application..."
docker compose up -d

echo "------------------------------------------------------"
echo "🎉 Installation complete!"
echo "⚠️  IMPORTANT: Please log out and log back in (or restart) for group changes to take effect."
echo "------------------------------------------------------"
