# Используйте официальный образ Node.js для сборки
FROM node:18 AS builder

# Установите рабочий каталог
WORKDIR /usr/src/app

# Скопируйте все файлы клиента в контейнер
COPY . .

# Установите зависимости и соберите клиент
RUN npm install
RUN npm run build

# Используйте минимальный образ для раздачи статических файлов
FROM nginx:alpine

# Скопируйте собранные файлы из предыдущего этапа
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Экспонируйте порт для Nginx
EXPOSE 80

# Запустите Nginx
CMD ["nginx", "-g", "daemon off;"]
