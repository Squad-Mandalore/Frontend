FROM node:latest as node
# npm build in docker, can be removed when building the application made in workflow
WORKDIR /app
COPY . .
RUN npm install
RUN npm run apigen-f
RUN npm run build --prod

# Main Image
# extracts the application from the Step above. Pipeline Configuration -> Expose 80:80
FROM nginx:alpine
COPY --from=node /app/dist/squad-mandalore-frontend/browser /usr/share/nginx/html

