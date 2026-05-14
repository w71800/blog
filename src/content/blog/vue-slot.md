---
title: Vue Slot 與 Scoped Slot 筆記
description: 從預設插槽、具名插槽到作用域插槽，整理 Vue 中 slot 的資料流與常見用法。
pubDate: 2026-05-14
tags:
  - 文章
  - Vue
  - 前端
---

# 1. Slot 是什麼？

slot 可以理解成：

> 子元件預留一個位置，讓父元件決定裡面要放什麼內容。

---

## Child.vue

```html
<template>
  <div class="card">
    <slot></slot>
  </div>
</template>
```

---

## Parent.vue

```html
<Child>
  <p>Hello Slot</p>
</Child>
```

---

## 最後概念上會 render 成

```html
<div class="card">
  <p>Hello Slot</p>
</div>
```

---

# 2. Slot 的核心概念

slot 的資料流方向是：

```text
Parent -> Child
```

不是：

```text
Child -> Parent
```

因為：

```html
<Child>
  <p>Hello</p>
</Child>
```

這段 `<p>Hello</p>` 本質上仍屬於 Parent 的 template。

Child 只是決定：

> 這段內容要 render 在哪裡。

---

# 3. Named Slot（具名插槽）

當元件有多個插槽位置時，可以替 slot 命名。

---

## Child.vue

```html
<template>
  <div>
    <header>
      <slot name="header"></slot>
    </header>

    <main>
      <slot></slot>
    </main>

    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

---

## Parent.vue

```html
<Dialog>
  <template #header>
    <h1>標題</h1>
  </template>

  <p>內容</p>

  <template #footer>
    <button>關閉</button>
  </template>
</Dialog>
```

---

# 4. `#header` 是什麼？

```html
<template #header>
```

等價於：

```html
<template v-slot:header>
```

意思是：

> 這段內容要放進名為 header 的 slot。

---

# 5. Scoped Slot 是什麼？

Scoped Slot 是：

> 子元件在 render slot 時，
> 主動提供資料給父元件的 slot template 使用。

---

## Child.vue

```html
<slot :item="item"></slot>
```

這裡：

```html
:item="item"
```

等價於：

```js
{
  item: item
}
```

本質上可以理解成：

```js
slot({
  item: item
})
```

---

# 6. Parent 如何接收？

## Parent.vue

```html
<template #default="{ item }">
  {{ item.name }}
</template>
```

這裡的：

```html
"{ item }"
```

其實是 JavaScript 物件解構。

等價於：

```js
(slotProps) => {
  const { item } = slotProps
}
```

---

# 7. Scoped Slot 的完整心智模型

## Child

```html
<slot :item="user"></slot>
```

概念上：

```js
slot({
  item: user
})
```

---

## Parent

```html
<template #default="{ item }">
  {{ item.name }}
</template>
```

概念上：

```js
({ item }) => {
  return item.name
}
```

---

# 8. 多個 Scoped Slot Props

## Child.vue

```html
<slot
  :item="item"
  :list="list"
></slot>
```

概念上：

```js
slot({
  item,
  list
})
```

---

## Parent.vue

```html
<template #default="{ item, list }">
  {{ item.name + list.content }}
</template>
```

等價於：

```js
({ item, list }) => {

}
```

---

# 9. 為什麼 Scoped Slot 很重要？

因為：

> 子元件知道資料，
> 父元件知道 UI 該怎麼長。

---

## 典型場景：Table

### Child

負責：

- pagination
- sorting
- filtering
- data fetching

---

### Parent

負責：

- row 長怎樣
- button 放哪
- 樣式如何呈現

---

## Child.vue

```html
<tr v-for="item in items">
  <slot :item="item"></slot>
</tr>
```

---

## Parent.vue

```html
<DataTable :items="users">
  <template #default="{ item }">
    <td>
      {{ item.name }}
      <button>編輯</button>
    </td>
  </template>
</DataTable>
```

---

# 10. Scoped Slot 與 emit 的差異

emit：

```text
事件通知
```

Scoped Slot：

```text
render 控制權交接
```

---

emit 適合：

- click
- submit
- change

---

Scoped Slot 適合：

- render row
- render option
- render card
- render list item

---

# 11. Scoped Slot 的本質

Scoped Slot 不只是資料傳遞。

更接近：

- callback
- render delegation
- inversion of control

---

一句話理解：

> 子元件在 render slot 時，
> 呼叫父元件提供的 template function，
> 並把自己的資料作為參數傳入。

---

# 12. Slot 的三個層級

---

## 普通 Slot

```html
<slot />
```

用途：

```text
內容插入
```

---

## Named Slot

```html
<slot name="header" />
```

用途：

```text
多個插槽位置
```

---

## Scoped Slot

```html
<slot :item="item" />
```

用途：

```text
子元件提供 render context
父元件控制 render output
```

---

# 13. 一句話總結

普通 Slot：

```text
父元件提供內容
子元件決定放哪
```

Scoped Slot：

```text
子元件提供資料
父元件決定怎麼 render
```