# Weather App

Веб-приложение для отображения прогноза погоды с графиками.  
Использует [Open-Meteo API](https://open-meteo.com/) для получения данных о погоде и визуализирует их с помощью [Chart.js](https://www.chartjs.org/).

## ✨ Возможности

- 🌡️ Получение прогноза температуры по дням и часам  
- 📊 Визуализация данных в виде красивых графиков  
- 📅 Автоматическая группировка значений по дням  
- ⚡ Кэширование через встроенный Redis (поднимается внутри Node.js, без ручного запуска) 

![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge)
![TypeScript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF&style=for-the-badge)
![TypeScript](https://shields.io/badge/Chart.js-v4.2.0-F7E7E8?logo=chartjs&color=F7E7E8&labelColor=303030&style=for-the-badge)

## 📷 Демонстрация

![Пример интерфейса](./assets/screenshot.png)

## 🚀 Установка и запуск

1. Клонируйте репозиторий
```bash
git clone https://github.com/acidless/weather-app.git
cd weather-app
```
2. Установите зависимости
```bash
npm install
```
3. Вы можете настроить окружение, создав файл .env в корне проекта<br>
Параметры окружения по умолчанию:
```.env
PORT=3000
CACHE_MINS=15
```
4. Запуск сервера
```bash
npm start
```

## 📜 Лицензия
MIT License © 2025

