# Кодстайл проекта

Набор обязательных правил для разработки. Все примеры на TypeScript с импортами ES-модулей и с учётом Next.js 16, React 19 и Tailwind CSS 4.

## 1. Типизация и строгий режим

- Всегда используем строгие типы (tsconfig strict=true). Не используем any!!! Не используем unknown без необходимости.
- Публичные функции/компоненты всегда с явными типами пропсов и возвращаемых значений.
  Пример:

```ts
export type Product = { id: string; title: string };

export function formatTitle(product: Product): string {
  return product.title.trim();
}
```

## 2. Tailwind CSS и утилита cn

- Классы пишем явными строками; динамику объединяем через cn из '@/lib/utils'.
- Не дублируем конфликтующие классы; доверяем twMerge.
  Пример:

```tsx
import { cn } from '@/lib/utils';

export function Badge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-1 text-xs',
        active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700',
      )}
    />
  );
}
```

## 3. Формы и адаптеры RHF

- Для интеграции с react-hook-form используем внутренние адаптеры из '@/components/formAdapters'.
- Сообщения об ошибках выводим через FormMessage, правила валидации — в rules.
  Пример:

```tsx
<FormInput name="email" type="email" rules={{ required: 'Обязательное поле' }} />
```

## 4. Константы, перечисления и магические значения

- Числа/строки, влияющие на логику, выносим в константы/enum в локальный модуль или src\lib\constants.ts.
  Пример:

```ts
export const TEL_LENGTH = 11;

export function isValidPhone(raw: string): boolean {
  return raw.replace(/\D/g, '').length === TEL_LENGTH;
}
```

## 5. Обработка ошибок и исключения

- Никогда не оставляем пустой catch. Либо логируем, либо пробрасываем выше контролируемую ошибку.
- Для пользовательских ошибок создаём Error с понятным сообщением.
  Пример:

```ts
try {
  await api.updateUser(id, payload);
} catch (error) {
  console.error('updateUser failed', error);
  throw new Error('Не удалось сохранить изменения');
}
```

## 6. Архитектура

- Общие компоненты клади в папку /src/components
- Компоненты относящиеся только к конкретной странице клади рядом с page.tsx в папку [название_страницы]/\_components

## 7. Компоненты

- Не пиши компоненты длиннее чем 200 строк, если длиннее чем 200 строк, то разбивай на отдельные смысловые компоненты.
- Не делай вложенные тернарные условия в компонентах.
