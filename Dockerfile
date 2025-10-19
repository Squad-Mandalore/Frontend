FROM oven/bun:1 AS builder

# Install Java (required for OpenAPI Generator)
RUN apt-get update && apt-get install -y default-jre

WORKDIR /app

# Copy necessary files
COPY package.json .
COPY bun.lock .
COPY openapitools.json .
COPY angular.json .
COPY tsconfig.json .
COPY tsconfig.app.json .

# Copy source files
COPY /src ./src/

# Install dependencies, generate API client, and build the application
RUN bun install
RUN bun run apigen-f
RUN bun run build

# Main Image
# extracts the application from the Step above. Serves it using nginx
FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/squad-mandalore-frontend/browser /usr/share/nginx/html
