# Документация проекта

## Обзор проекта
Wander Wonder WoW
Этот проект представляет собой полнофункциональное приложение, созданное с использованием Next.js для клиентской части и NestJS для серверной части. Его цель — предоставить эффективное и масштабируемое решение для управления пользовательскими взаимодействиями и данными.

## Лицензия

Этот проект лицензирован по лицензии **ExtremXil Best License Yield Again (EBLYA)**.

### Условия лицензии:
- ✅ **Вы бесплатно пишете код и гордитесь собой.**
- ✅ **Я беру ваш код, пихаю рекламу и забираю все деньги.**

Выгодно и справедливо! Всё по заветам капитализма и open source одновременно.
Ваш вклад поможет мне стать богаче, а вы получите удовольствие от процесса.
Добро пожаловать в настоящее Open Source-сообщество.

## Документация клиентской части
- **Фреймворк**: клиентская часть создается с использованием [Next.js](https://nextjs.org/), инициализированного с помощью [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
- **Начало работы**:
- Чтобы запустить сервер разработки, используйте одну из следующих команд:
```bash
npm run dev
# или
yarn dev
# или
pnpm dev
# или
bun dev
```
- Откройте [http://localhost:3000](http://localhost:3000) в браузере, чтобы просмотреть приложение.
- Главную страницу можно редактировать, изменив `app/page.tsx`, и она будет автоматически обновляться по мере внесения изменений.
- **Оптимизация шрифтов**: проект использует [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) для автоматической оптимизации и загрузки шрифта Inter.
- **Учебные ресурсы**:
- [Документация Next.js](https://nextjs.org/docs)
- [Изучить Next.js](https://nextjs.org/learn)
- [Репозиторий Next.js GitHub](https://github.com/vercel/next.js/)
- **Развертывание**: Рекомендуемая платформа для развертывания — [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Документация на стороне сервера
- **Фреймворк**: Сторона сервера создана с использованием фреймворка [NestJS](https://nestjs.com/).
- **Установка**:
- Чтобы установить зависимости, запустите:
```bash
$ yarn install
```
- **Запуск приложения**:
- Чтобы запустить приложение в разных режимах:
```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
### Архитектура проекта:
```mermaid
graph TB
%% Клиентская часть
subgraph "🖥️ Client-Side (Next.js 14)"
UI[🎨 UI Components<br/>Radix UI + Tailwind CSS]
Pages[📄 Pages & Routes<br/>App Router]
Store[🗃️ State Management<br/>Redux Toolkit + Persist]
Services[🔧 Services Layer<br/>API Calls]
Hooks[🪝 Custom Hooks<br/>React Query]

UI --> Pages
Pages --> Store
Pages --> Services
Services --> Hooks
end

%% API слой
subgraph "🌐 API Layer"
Axios[📡 Axios Client<br/>+ Interceptors]
Auth[🔐 Auth Service]
ProductAPI[🛍️ Product Service]
OrderAPI[📦 Order Service]
UserAPI[👤 User Service]

Services --> Axios
Axios --> Auth
Axios --> ProductAPI
Axios --> OrderAPI
Axios --> UserAPI
end

%% Серверная часть
subgraph "⚙️ Server-Side (NestJS)"
Gateway[🚪 API Gateway<br/>CORS + Cookies]

subgraph "📋 Controllers & Modules"
AuthCtrl[🔐 Auth Module<br/>JWT + OAuth]
UserCtrl[👤 User Module]
StoreCtrl[🏪 Store Module]
ProductCtrl[🛍️ Product Module]
OrderCtrl[📦 Order Module]
CategoryCtrl[📂 Category Module]
ColorCtrl[🎨 Color Module]
ReviewCtrl[⭐ Review Module]
StatsCtrl[📊 Statistics Module]
FileCtrl[📁 File Module]
end

Gateway --> AuthCtrl
Gateway --> UserCtrl
Gateway --> StoreCtrl
Gateway --> ProductCtrl
Gateway --> OrderCtrl
Gateway --> CategoryCtrl
Gateway --> ColorCtrl
Gateway --> ReviewCtrl
Gateway --> StatsCtrl
Gateway --> FileCtrl
end

%% База данных
subgraph "🗄️ Database Layer (PostgreSQL)"
Prisma[🔧 Prisma ORM]

subgraph "📊 Database Models"
UserModel[(👤 User)]
StoreModel[(🏪 Store)]
ProductModel[(🛍️ Product)]
CategoryModel[(📂 Category)]
ColorModel[(🎨 Color)]
ReviewModel[(⭐ Review)]
OrderModel[(📦 Order)]
OrderItemModel[(📋 OrderItem)]
end

AuthCtrl --> Prisma
UserCtrl --> Prisma
StoreCtrl --> Prisma
ProductCtrl --> Prisma
OrderCtrl --> Prisma
CategoryCtrl --> Prisma
ColorCtrl --> Prisma
ReviewCtrl --> Prisma
StatsCtrl --> Prisma

Prisma --> UserModel
Prisma --> StoreModel
Prisma --> ProductModel
Prisma --> CategoryModel
Prisma --> ColorModel
Prisma --> ReviewModel
Prisma --> OrderModel
Prisma --> OrderItemModel
end

%% Внешние сервисы
subgraph "🌍 External Services"
OAuth[🔐 OAuth Providers<br/>Google + Yandex]
Payment[💳 YooKassa<br/>Payment Gateway]
FileStorage[📁 File Storage<br/>Local Uploads]
end

%% Основные связи
Axios -.->|HTTP/HTTPS| Gateway
AuthCtrl -.->|OAuth| OAuth
OrderCtrl -.->|Payments| Payment
FileCtrl -.->|File Upload| FileStorage

%% Связи между моделями БД
UserModel -.->|1:N| StoreModel
UserModel -.->|M:N| ProductModel
UserModel -.->|1:N| ReviewModel
UserModel -.->|1:N| OrderModel

StoreModel -.->|1:N| ProductModel
StoreModel -.->|1:N| CategoryModel
StoreModel -.->|1:N| ColorModel
StoreModel -.->|1:N| ReviewModel

ProductModel -.->|N:1| CategoryModel
ProductModel -.->|N:1| ColorModel
ProductModel -.->|1:N| ReviewModel
ProductModel -.->|1:N| OrderItemModel

OrderModel -.->|1:N| OrderItemModel

classDef clientSide fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#000
classDef serverSide fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px,color:#000
classDef database fill:#e8f5e8,stroke:#388e3c,stroke-width:3px,color:#000
classDef external fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#000
classDef apiLayer fill:#fce4ec,stroke:#c2185b,stroke-width:3px,color:#000

class UI,Pages,Store,Services,Hooks clientSide
class Gateway,AuthCtrl,UserCtrl,StoreCtrl,ProductCtrl,OrderCtrl,CategoryCtrl,ColorCtrl,ReviewCtrl,StatsCtrl,FileCtrl serverSide
class Prisma,UserModel,StoreModel,ProductModel,CategoryModel,ColorModel,ReviewModel,OrderModel,OrderItemModel database
class OAuth,Payment,FileStorage external
class Axios,Auth,ProductAPI,OrderAPI,UserAPI apiLayer
```



## Поддержка и контактная информация
- **Автор**: [Ximelay](https://t.me/Ximelay_y)
- **Автор**: [Diablo_max](https://t.me/Ne_otmechai_menya_pishi_menegeru)
