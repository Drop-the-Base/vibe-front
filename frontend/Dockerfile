# Use the latest LTS version of Node.js
FROM node:18-alpine

WORKDIR /app

# Szybsze cache: kopiuj tylko locki i instaluj
COPY package*.json ./
RUN npm ci || npm install

# Reszta źródeł
COPY . .

# Jeśli to Vite – słuchaj na wszystkich interfejsach
# (dla CRA niepotrzebne)
ENV HOST=0.0.0.0

# Vite: EXPOSE 5173 | CRA: 3000
EXPOSE 3000

# ⛏️ POPRAWKA TUTAJ: rozdzielone argumenty
# Vite:
 CMD ["npm", "run", "dev"]
# CRA:
#CMD ["npm", "start"]
