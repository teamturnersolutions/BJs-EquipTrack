#!/bin/sh
set -e

echo "Starting container..."

# Check if Prisma directory is mounted and if dev.db exists. 
# If not, and we have the initialized db stashed, copy it over.
if [ ! -f "/app/prisma/dev.db" ] && [ -f "/app/prisma-init/dev.db" ]; then
  echo "Database not found in mounted volume. Copying initialized 'dev.db' to '/app/prisma/'..."
  cp /app/prisma-init/dev.db /app/prisma/dev.db
fi

# We must ensure the nextjs user owns the /app/prisma directory so
# that SQLite can generate the necessary .db-journal and .db-wal files during runtime.
echo "Setting permissions for /app/prisma..."
chown -R nextjs:nodejs /app/prisma || true

echo "Handing over execution to nextjs user..."
# Drop root privileges and execute the main container command as `nextjs`
exec su-exec nextjs "$@"
