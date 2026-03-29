# MedEdu System

![Status](https://img.shields.io/badge/status-learning--project-blue)
![Progress](https://img.shields.io/badge/progress-40%25-brightgreen)

Система управления клиникой, электронными медицинскими картами и записью пациентов.

![React](https://img.shields.io/badge/React-18.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
**Проект в разработке.**
Я использую его для изучения продвинутых техник React и работы с формами. Здесь могут встречаться баги или временные заглушки.

## Что уже можно посмотреть:

1. Сверстанную страницу логина.
2. Список врачей (данные берутся из JSON-файла).
3. Адаптивное меню навигации.

## Features

- **Панель врача:** Управление расписанием, просмотр истории болезни.
- **Личный кабинет пациента:** Запись на прием, просмотр результатов анализов.
- **Электронные карты (EHR):** Безопасное хранение и редактирование данных пациентов.
- **Админ-панель:** Управление персоналом, филиалами и отчетностью.
- **Безопасность:** Ролевая модель доступа (RBAC) и шифрование данных.

## Tech Stack

- **Frontend:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Язык:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Формы:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Иконки:** [Lucide React](https://lucide.dev/)

## Установка и запуск

### Предварительные требования

- Node.js (версия 18 или выше)
- npm / yarn / pnpm

### Структура проекта

src/
├── api/ # Запросы к API (axios)
├── assets/ # Статические файлы (изображения, шрифты)
├── components/ # Общие UI-компоненты
├── hooks/ # Кастомные React хуки
├── pages/ # Страницы приложения (Dashboard, Patients, Login)
├── types/ # TypeScript интерфейсы и типы
