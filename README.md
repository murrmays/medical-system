# MedEdu System

![Status](https://img.shields.io/badge/status-learning--project-blue)
![Progress](https://img.shields.io/badge/progress-70%25-brightgreen)

Система управления клиникой, электронными медицинскими картами и записью пациентов.

![React](https://img.shields.io/badge/React-18.x-blue)
![Vite](https://img.shields.io/badge/Vite-3.x-646CFF)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)

**Проект в разработке. Этот файл будет обновляться.**

Данный проект разрабатывается для отработки следующих навыков:

- Проектирование сложных интерфейсов на **React**.
- Работа с типизацией в **TypeScript**.
- Организация архитектуры фронтенда.
- Интеграция с API и обработка состояний (TanStack Query).
- Аутентификация + авторизация (без ролевой модели).
- Роутинг.
- Работа с формами. Валидация форм (react-hook-form, zod).
- Линтинг.
- Пагинации и фильтрация. Квери-параметры.

## Что уже можно посмотреть:

1. Сверстанную страницу авторизации.
2. Личный кабинет врача.
3. Список пациентов с фильтрацией + создание нового пациента.
4. Список осмотров конкретного пациента с фильтрацией.
5. Создание осмотра конкретному пациенту.

## Roadmap

- [x] Инициализация проекта
- [x] Настройка роутинга
- [x] Авторизация и регистрация
- [x] Личный кабинет врача
- [x] Интеграция с бэкендом
- [x] Список пациентов
- [x] Список осмотров
- [ ] Детали осмотра (в процессе)
- [ ] Список консультаций
- [ ] Создание и просмотр консультации
- [ ] Создание отчетов
- [ ] Создание системы комментариев

## Features

- **Панель врача:** Просмотр списка пациентов, создание осмотров и консультаций.
- **Электронные карты:** Удобное ранение и редактирование данных пациентов.
- **Отчеты:** Систематизация данных.

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

### Шаги для локального запуска

To be added...

### Структура проекта

```text
src/
├── api/ # Запросы к API (axios)
├── assets/ # Статические файлы (изображения, шрифты)
├── components/ # Общие UI-компоненты
├── hooks/ # Кастомные React хуки
├── pages/ # Страницы приложения (Dashboard, Patients, Login)
├── types/ # TypeScript интерфейсы и типы
```

## Скриншоты

<table>
  <tr>
    <td width="50%" align="center">
      <img src="https://github.com/user-attachments/assets/4b3183d0-b4f7-4f72-8174-71eb67c43fcf"" alt="Авторизация"/>
      <br />
      <b>Страница входа</b>
    </td>
    <td width="50%" align="center">
      <img src="https://github.com/user-attachments/assets/c074b0a7-dcbc-42c5-9173-ec3563ae51aa" alt="Список пациентов"/>
      <br />
      <b>Реестр пациентов</b>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="https://github.com/user-attachments/assets/2aa5fdc1-cb3c-4685-82df-22b25a36a7ff" alt="Медкарта"/>
      <br />
      <b>Медицинская карта пациента</b>
    </td>
    <td width="50%" align="center">
      <img src="https://github.com/user-attachments/assets/38706d0b-aeb6-4808-9bb1-2593d4f20878" alt="Профиль врача"/>
      <br />
      <b>Личный кабинет врача</b>
    </td>
  </tr>
</table>

## Контакты

Мой телеграмм: @murrmays

Почта: maria40va@gmail.com
