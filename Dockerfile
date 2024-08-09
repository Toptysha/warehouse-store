# Используйте официальный образ Node.js
FROM node:18

# Установите рабочий каталог
WORKDIR /usr/src/app

# Скопируйте все файлы в рабочий каталог
COPY . .

# Установите зависимости для клиентской части и соберите клиент
WORKDIR /usr/src/app/client
RUN npm install
RUN npm run build

# Установите зависимости для серверной части
WORKDIR /usr/src/app/server
RUN npm install

# Запустите миграции Prisma
RUN npx prisma generate
RUN npx prisma migrate deploy

# Откройте порт 7000
EXPOSE 7000

# Запустите приложение
CMD ["node", "app.js"]