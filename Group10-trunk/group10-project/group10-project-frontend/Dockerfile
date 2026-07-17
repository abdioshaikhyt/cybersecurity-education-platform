FROM node:20

WORKDIR /app

COPY group10-project-frontend/package.json group10-project-frontend/package-lock.json ./
RUN npm install

COPY group10-project-frontend .

ENV NEXT_SERVER_API_URL=http://backend:8000/api/
ENV NEXT_PUBLIC_API_URL=/api/

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "dev"]