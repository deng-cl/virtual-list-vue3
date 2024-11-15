# virtual-list-vue3 的基本使用

**概述：该组件组件库用于提供虚拟化列表能力的组件，用于解决展示大量数据渲染时首屏渲染缓慢和滚动卡顿问题**

**功能：该组件库主要包含 `HFixedHeightVirtualList` 与 `HFixedHeightVirtualList` 两个组件**

- **`HFixedHeightVirtualList:`** - 定高虚拟列表组件，用于列表中每一项 item 的高度都是固定时
- **`HFlexibleHeightVirtualList:`** - 不定高虚拟列表组件，用于列表中的每一项 item 都可能是不一样时

**安装:** **`npm i virtual-list-vue3`**

**使用:🔺通过 item 具名插槽插槽，插入对应的 HTML 结构，该插槽也接收一个** **`{ itemData }`** **属性（** **`itemData 为该项 item 的数据`** **）**

## 使用示例

**定高虚拟列表示例:** - HFixedHeightVirtualList

- ```html
  <script setup lang="ts">
  import { HFixedHeightVirtualList } from 'virtual-list-vue3';
  
  const list = Array.from({ length: 1000 }, (_, i) => i + 1) // -- 1.模拟长列表数据（生产一个长度为1000的数组）
  </script>
  
  <template>
      <!-- 2.传入对应的 list 数据，与对应 item 的定高高度 -->
      <HFxiedHeightVirtualList :list="list" :item-height="40">
          <!-- 3.通过 item 具名插槽传入对应的 item 的 HTML 结构，该插槽会返回该项的 itemData 数据  -->
          <template #item="{ itemData }">
              <div class="item">{{ itemData }}</div>
          </template>
      </HFxiedHeightVirtualList>
  </template>
  
  <style scoped>
  /* 4.基本样式，.item 的高度需要与上面传入的 item-height 配置的一样 */
  .item {
      height: 40px; /* 定高 */
      background-color: orange;
      color: white;
      line-height: 40px;
      text-align: center;
      margin-bottom: 8px;
  }
  </style>
  ```

**不定高虚拟列表示例:** - HFlexibleHeightVirtualList

- ```html
  <script setup lang="ts">
  import { HFlexibleHeightVirtualList } from 'virtual-list-vue3';
      
  // -- 1.模拟长列表数据（生产一个长度为1000的，且值为不定数量的文字，为了模拟不定高的情况）
  const list = Array.from({ length: 1000 }, (_, i) => {
      let item = "小"
      if(i === 999) item = "END:"
      for(let i = 0; Math.floor(Math.random() * 200); i++) {
          item += "孔" // -- tip：注意这里不能使用英文来进行模拟，因为html的截断规则是根据单词来的，所以就会导致不会换行（了解）
      }
      return item
  }) 
  
  </script>
  
  <template>
      <!-- 2. 传入对应的列表数据 -->
      <HFlexibleHeightVirtualList :list="list">
          <!-- 3.通过 item 具名插槽传入对应的 item 的 HTML 结构，该插槽会返回该项的 itemData 数据  -->
          <template #item="{ itemData }">
              <div class="item" >{{ itemData }}</div>
          </template>
      </HFlexibleHeightVirtualList>
  </template>
  
  <style scoped>
  /* 4.基本样式: 不定高，根据内容适应高度 */
  .item {
      background-color: orange;
      color: white;
      margin-bottom: 8px;
  }
  </style>
  ```

## Props

|        属性名         |                        说明                        |         类型          | 默认值  |             是否必传              |                             tip                              |
| :-------------------: | :------------------------------------------------: | :-------------------: | :-----: | :-------------------------------: | :----------------------------------------------------------: |
|         list          |                      列表数据                      |        `any[]`        |    -    | <span style="color:red">是</span> |                                                              |
|         width         |                     容器的宽度                     | ``number` / `string`` | "100%"  |                否                 | 当为 `number` 时以 px 为单位，当为 `string` 时，则会直接赋值到容器上 |
|        height         |                     容器的高度                     |  `number` / `string`  | "100vh" |                否                 | 当为 `number` 时以 px 为单位，当为 `string` 时，则会直接赋值到容器上 |
|      bufferCount      |    视区上、下额外展示的 DOM 节点数量（预加载）     |       `number`        |    6    |                否                 |                              -                               |
|    hiddenScrollbar    |                   是否隐藏滚动条                   |       `boolean`       |  false  |                否                 |                              -                               |
|     reachBottomFn     |                    触底回调函数                    | `() => void` / `null` |  null   |                否                 |                              -                               |
| reachBottomFnDistance | 滚动到底部触发触底回调的触发距离（距离底部的距离） |       `number`        |   50    |                否                 |                         以 px 为单位                         |
|  triggerBottomFnTime  |             触发触底执行函数的节流时间             |       `number`        |   400   |                否                 |                         以 ms 为单位                         |

## 定高列表特有 Props

|   属性名   |          说明          |   类型   | 默认值 |             是否必传              |     tip      |
| :--------: | :--------------------: | :------: | :----: | :-------------------------------: | :----------: |
| itemHeight | 列表每一项 item 的高度 | `number` |   -    | <span style="color:red">是</span> | 以 px 为单位 |

## 不定高列表特有 Props

|     属性名     |         说明         |   类型   | 默认值 | 是否必传 |                             tip                              |
| :------------: | :------------------: | :------: | :----: | :------: | :----------------------------------------------------------: |
| initItemHeight | 列表 item 的预计高度 | `number` |   40   |    否    | 预计高度，尽量要小点，可以多加载，但不能少，防止渲染不全（但也不能过小） |

## Props API

```ts
interface VitualListProps<T> {
    list: T[],
    bufferCount?: number
    height?: number | string
    width?: number | string
    hiddenScrollbar?: boolean
    reachBottomFn?: (...props: any[]) => any | null
    reachBottomDistance?: number
    triggerBottomFnTime?: number
}

interface FixedHeightProps<T> extends VitualListProps<T> {
    itemHeight: number
}

interface FlexibleHeightProps<T> extends VitualListProps<T> { 
    initItemHeight?: number
}
```

