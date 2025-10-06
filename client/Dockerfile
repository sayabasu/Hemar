FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY vite.config.js .
COPY index.html .
COPY src ./src
COPY .eslintrc.json .
COPY .prettierrc.json .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
