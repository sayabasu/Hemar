FROM node:18-alpine

# Prisma requires OpenSSL to be available when generating the client.
# The alpine variant does not ship it by default, so we install it
# explicitly to avoid runtime errors when the schema engine boots up.
RUN apk add --no-cache openssl
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
