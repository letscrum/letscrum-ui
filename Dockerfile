FROM node:20 as build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
