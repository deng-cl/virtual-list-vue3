<script setup lang="ts" generic="T">
import { computed, onMounted, onUnmounted, reactive, useTemplateRef } from "vue"
import { throttle } from "../utils/index"
import type { FixedHeightProps } from "../types/index"

const {
    list,
    itemHeight,
    bufferCount = 6,
    height = "100vh",
    width = "100%",
    hiddenScrollbar = false,
    reachBottomFn = null,
    reachBottomDistance = 50,
    triggerBottomFnTime = 400
} = defineProps<FixedHeightProps<T>>()

const state = reactive({
    start: 0,
    renderCount: 0,
    currentOffset: 0, // -- 偏移量 → 用于平移渲染区域
    scrollHeight: 0
})

const end = computed(() => Math.min(state.start + state.renderCount + bufferCount, list.length)) // -- 计算结束索引

const showList = computed(() => list.slice(state.start, end.value)) // -- 所要展示的数据

const placeholderHeight = list.length * itemHeight

const initScrollHeightAndRenderCount = () => { // -- 初始化 scrollHeight 与 renderCount 数据
    if (!ctnRef.value) return
    const containerHeight = ctnRef.value.offsetHeight
    state.scrollHeight = containerHeight
    state.renderCount = Math.round(containerHeight / itemHeight)
}

// -- 事件处理
const ctnRef = useTemplateRef<HTMLDivElement>("virtual-list-container")

const handleScrollReachBootomThrottle = throttle( // -- 处理触底部分
    () => {
        const { scrollTop, clientHeight, scrollHeight } = ctnRef.value!

        // -- 判断是否已经滚动到底部，如果滚动到底部，则执行一个外部传入的（用于外部可能需要下拉加载更多的情况）
        if (reachBottomFn) {
            const bottomDis = scrollHeight - clientHeight - scrollTop
            if (bottomDis < reachBottomDistance) {
                reachBottomFn()
            }
        }
    }, triggerBottomFnTime, true
)

const handleScrollEvent = () => {
    if (!ctnRef.value) return
    const { scrollTop } = ctnRef.value
    state.start = Math.round(scrollTop / itemHeight)
    state.currentOffset = scrollTop - (scrollTop % itemHeight)

    handleScrollReachBootomThrottle() // -- 判断是否为滚动到底部，并触发外部传入的回调函数
}

// -- 滚动事件的监听
onMounted(() => {
    initScrollHeightAndRenderCount()
    if (!ctnRef.value) return
    ctnRef.value.addEventListener("scroll", handleScrollEvent)
    window.addEventListener("resize", initScrollHeightAndRenderCount)
})

onUnmounted(() => {
    if (!ctnRef.value) return
    ctnRef.value.removeEventListener("scroll", handleScrollEvent)
    window.removeEventListener("resize", initScrollHeightAndRenderCount)
})

// -- utils
function handleUnitOfSizeProps(value: number | string) { // -- 处理 width 与 height 参数的类型
    if (typeof value === "string") return value
    return value + "px"
}

// -- handle scrollbar
const hidden = hiddenScrollbar ? 'none' : 'block'
</script>

<template>
    <!-- 容器 -->
    <div class="virtual-list-container" ref="virtual-list-container" :style="{
        width: handleUnitOfSizeProps(width),
        height: handleUnitOfSizeProps(height)
    }">
        <!-- 占位元素 -->
        <div class="virtual-list-placeholder" :style="{
        height: handleUnitOfSizeProps(placeholderHeight)
    }">
        </div>
        <!-- 渲染区域 -->
        <div class="virtual-list-content" :style="{ transform: `translateY(${state.currentOffset}px)` }">
            <!-- 子组件: 列表中的每一项 -->
            <template v-for="(item, index) in showList" :key="index">
                <slot name="item" :itemData="item" :index="index"></slot>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.virtual-list {
    &-container {
        position: relative;
        overflow: auto;

        &::-webkit-scrollbar {
            width: 2px;
            height: 1px;
            display: v-bind(hidden);
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 12px;
            background: rgb(167, 165, 165);
        }

        /*滚动条里面轨道*/
        &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            background: #fffefe;
        }
    }

    &-placeholder {
        position: absolute;
        inset: 0;
    }

    &-content {
        position: absolute;
        inset: 0;
        padding-right: 2px;
        box-sizing: border-box;
    }
}
</style>

<!-- HFxiedHeightVirtualList 组件用法
    + 必传属性
        - list: 列表数据（类型: T[]）
        - itemHeight: 传入列表展示 item 元素的高度（类型: number → 内部以 px 为单位）
    + 通过插槽具名插槽 item，向 HFxiedHeightVirtualList 传入所要展示的内容 → tip: 该插槽为一个作用域插槽，在对应的插槽中可以接收一个 itemData 数据，对应一项 item 的数据

    + 基本使用示例
        <HFxiedHeightVirtualList :list="list" :item-height="60">
            <template #item="{ itemData }">
                <div class="item">{{ itemData }}</div>
            </template>
        </HFxiedHeightVirtualList>

    + 非必传属性
        - width: 容器的宽度（类型: number | string → 默认: 100%）
        - height: 容器的高度（类型: number | string → 默认: 100%）
        - bufferCount: 预加载的 item 个数（类型: number → 默认: 6）
        - hiddenScrollbar: 是否隐藏滚动条（类型: boolean → 默认: false）
        - reachBottomFn: 滚动到底部时触发的回调函数（类型: () => void | null → 默认: null）
        - reachBottomDistance: 滚动到底部时触发的回调函数的触发距离（类型: number → 默认: 50）
        - triggerBottomFnTime: 触发触底执行函数的节流时间（类型: number → 默认: 400ms）
-->