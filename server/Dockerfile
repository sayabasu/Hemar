FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY prisma ./prisma
COPY src ./src
COPY seed ./seed
COPY jest.config.js .
COPY .eslintrc.json .
COPY .prettierrc.json .
RUN npx prisma generate
CMD ["npm", "run", "start"]
