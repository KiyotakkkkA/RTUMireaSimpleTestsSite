# 🧾 Testix — сервис для создания и прохождения тестов

> Данный сервис был разработан командой студентов РТУ МИРЭА как средство для подготовки к экзаменам, вполне возможно что в будущем он будет использоваться и в течение обычного семестрового учебного процесса, кто знает).

<div align="center">

![Testix](https://img.shields.io/badge/Testix-education%20platform-6366F1?style=for-the-badge)

</div>

## 🔧 Стек и инструменты

### Backend

[![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=fff)](#)
[![PHP](https://img.shields.io/badge/PHP-777BB4?logo=php&logoColor=fff)](#)
[![Laravel](https://img.shields.io/badge/Laravel-FC3F19?logo=laravel&logoColor=fff)](#)
[![Laravel Sanctum](https://img.shields.io/badge/Laravel:Sanctum-FC3F50?logo=laravel&logoColor=fff)](#)
[![Laravel Spatie](https://img.shields.io/badge/Laravel:Spatie-FC3F80?logo=laravel&logoColor=fff)](#)
[![Composer](https://img.shields.io/badge/Composer-888888?logo=composer&logoColor=fff)](#)

Dev‑версии инструментов:

```json
{
  "php": "^8.3.9",
  "composer": "^2.7.7"
}
```

### Frontend

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
[![MobX](https://img.shields.io/badge/MobX-FFAF00?logo=mobx&logoColor=000)](#)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000)](#)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=fff)](#)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?logo=prettier&logoColor=fff)](#)
[![nvm](https://img.shields.io/badge/nvm-026E00?logo=nvm&logoColor=fff)](#)
[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff)](#)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=fff)](#)

Dev‑версии инструментов:

```json
{
  "nvm": "^1.2.2",
  "npm": "^10.2.4",
  "node": "^20.11.0"
}
```

### Общие

[![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=fff)](#)
[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=fff)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](#)
[![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=fff)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)

Dev‑версии инструментов:

```json
{
  "docker": "^29.1.3"
}
```

### AI Интеграции

[![Ollama](https://img.shields.io/badge/Ollama-ffffff?logo=ollama&logoColor=000)](#)

## 🚀 Локальный запуск проекта

> В репозитории есть папки backend и frontend. Запускайте их отдельно или через Docker.

### Backend

```bash
cd backend
composer install
cp .env.example .env # После копирования - настройте .env файл под вашу среду
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm start
cp .env.example .env # После копирования - настройте .env файл под вашу среду
npm run start
```

### Docker (опционально)

```bash
docker compose up --build
```

## 🚀 Деплой на Production

```bash
git clone https://github.com/KiyotakkkkA/RTUMireaSimpleTestsSite.git
cd RTUMireaSimpleTestsSite

cp backend/.env.example backend/.env # После копирования - настройте .env файл под вашу среду
cp frontend/.env.example frontend/.env # После копирования - настройте .env файл под вашу среду
cp .env.example .env # После копирования - настройте .env файл под вашу среду

docker compose up --build -d
```

## 🛠 Настройка .env (самое важное)

### Global (.env)

> Настраиваем только в том случае, если запускаем через Docker на локалке либо настраиваем продакшн

```bash
NODE_VERSION=23.1-alpine

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_PORT_FROM=33036
DB_DATABASE= # Название базы данных для докер-контейнера (настраиваем и тут и в backend/.env)
DB_PASSWORD= # Пароль базы данных для докер-контейнера (настраиваем и тут и в backend/.env)
DB_USERNAME= # Имя пользователя базы данных для докер-контейнера (настраиваем и тут и в backend/.env)

NGINX_PORT_FROM=80
NGINX_PORT_TO=80

REACT_APP_FULL_ANSWER_CORRECT_FROM_PERCENT=70 # Процент правильных ответов для установления правильности при проверке ответа AI (устанавливаем и тут и в frontend/.env)

OLLAMA_BASE_URL=https://ollama.com # Хост для интеграции с Ollama (настраиваем и тут и в backend/.env)
OLLAMA_MODEL=gpt-oss:20b # Модель Ollama для использования (настраиваем и тут и в backend/.env)
OLLAMA_TOKEN= # Токен доступа к Ollama (настраиваем и тут и в backend/.env)
```

### Frontend (frontend/.env)

```bash
REACT_APP_ENV_TYPE=dev # dev или prod

REACT_APP_FULL_ANSWER_CORRECT_FROM_PERCENT=70 # Процент правильных ответов для установления правильности при проверке ответа AI (устанавливаем и тут и в глобальном .env)
```

### Backend (backend/.env)

> Laravel создаёт очень много параметров в .env, здесь будут только ключевые

```bash
APP_KEY= # Сгенерировать командой php artisan key:generate
APP_TIMEZONE=Europe/Moscow # Часовой пояс приложения (По умолчанию - Москва)

OLLAMA_BASE_URL=https://ollama.com # Хост для интеграции с Ollama (настраиваем и тут и в глобальном .env)
OLLAMA_MODEL=gpt-oss:20b # Модель Ollama для использования (настраиваем и тут и в глобальном .env)
OLLAMA_TOKEN= # Токен доступа к Ollama (настраиваем и тут и в глобальном .env)

CORS_ALLOWED_ORIGINS= # Устанавливаем домен либо ip своего приложения если используем веб-сервер nginx на 80 порту, либо ip:port если используем нестандартный порт nginx, либо работаем на локалке (например http://localhost:3000)

DB_CONNECTION=mysql # Используемый драйвер базы данных
DB_HOST=mysql # Хост базы данных (если через докер - mysql, если локально - localhost либо ip сервера)
DB_PORT=3306 # Порт базы данных
DB_DATABASE= # Название базы данных (настраиваем и тут и в глобальном .env)
DB_USERNAME= # Имя пользователя базы данных (настраиваем и тут и в глобальном .env)
DB_PASSWORD= # Пароль базы данных (настраиваем и тут и в глобальном .env)

MAIL_HOST=127.0.0.1 # SMTP хост почтового сервиса
MAIL_PORT=2525 # SMTP порт почтового сервиса
MAIL_USERNAME=null # SMTP юзер почтового сервиса (можно оставить такой же как MAIL_FROM_ADDRESS)
MAIL_PASSWORD=null # SMTP пароль почтового сервиса (выдаётся на почтовом сервисе)
MAIL_FROM_ADDRESS="hello@example.com" # Адрес отправителя почты
MAIL_FROM_NAME="${APP_NAME}" # Имя отправителя почты (по умолчанию - название приложения, но можно поменять на своё)

```
