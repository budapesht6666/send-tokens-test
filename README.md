## dApp UI (mobile-first)

Проект: Next.js 16 (App Router) + React 19 + Tailwind CSS 4.

Собран базовый мобильный интерфейс: хедер с меню (Sheet), переключатель темы (dark по умолчанию), hero-блок "Lending", KPI-плашки, баннер Rewards и сетка карточек ассетов. Контент — заглушки.

### Запуск

```bash
npm install
npm run dev
```

Откройте http://localhost:3000.

### Переключение темы

Переключатель в правой части хедера. Состояние хранится в localStorage (ключ `ui-theme`). Темная тема активна при первом визите.

### Структура ключевых компонентов

- `src/components/theme/theme-provider.tsx` — провайдер темы (управляет классом `dark` на `<html>`).
- `src/components/theme/theme-toggle.tsx` — кнопка-тоггл с иконками Sun/Moon (lucide-react).
- `src/components/header/mobile-header.tsx` — мобильный хедер, меню внутри `Sheet`.
- `src/components/ui/*` — примитивы (button, card, switch, sheet) в стиле shadcn упрощённые.

### Кодстайл

Следуйте правилам из `codestyle.docs.md`: строгая типизация, `cn` из `@/lib/utils`, без any.

### Дальнейшие шаги (предложения)

- Добавить реальные данные и форматирование чисел.
- Реализовать состояние подключения кошелька (например, RainbowKit / wagmi).
- Адаптировать десктопную сетку и навигацию.
- Написать unit-тесты для провайдера темы.
