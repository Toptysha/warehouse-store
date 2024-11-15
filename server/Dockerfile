# Используйте официальный образ Node.js
FROM node:18

# Установите рабочий каталог
WORKDIR /usr/src/app

# Скопируйте файлы сервера в контейнер
COPY . .

# Установите зависимости
RUN npm install

# Запустите миграции Prisma
RUN npx prisma generate
RUN npx prisma migrate deploy

# Экспонируйте порт сервера
EXPOSE 7000

# Запустите серверное приложение
CMD ["node", "app.js"]