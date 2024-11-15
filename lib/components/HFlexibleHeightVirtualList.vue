<script setup lang="ts" generic="T">
import { computed, onMounted, onUnmounted, reactive, useTemplateRef, nextTick, watch, type WatchHandle } from "vue"
import { throttle } from "../utils/index"
import type { FlexibleHeightProps, PositionType } from "../types/index"

const ctnRef = useTemplateRef<HTMLDivElement>("virtual-list-container")
const cttRef = useTemplateRef<HTMLDivElement>("virtual-list-content")

const {
    list,
    bufferCount = 0,
    height = "100vh",
    width = "100%",
    hiddenScrollbar = false,
    reachBottomFn = null,
    reachBottomDistance = 50,
    initItemHeight = 40,
    triggerBottomFnTime = 400
} = defineProps<FlexibleHeightProps<T>>()

const state = reactive({
    start: 0,
    renderCount: 0,
    currentOffset: 0, // -- 偏移量 → 用于平移渲染区域
    scrollHeight: 0,
    positions: [] as PositionType[],
    initItemHeight: 50,
    listHeihgt: 0 // -- 整个 list 列表的高度（用于占位撑开容器）
})

const end = computed(() => Math.min(state.start + state.renderCount + bufferCount, list.length)) // -- 计算结束索引

const showList = computed<T[]>(() => list.slice(state.start, end.value)) // -- 所要展示的数据
const showListPositions = computed(() => state.positions.slice(state.start, end.value)) // -- 所要展示的数据对应的 position 信息（用于在渲染时给对应元素对应的 index 作为唯一标识）

// -- 初始化状态
function init() {
    state.listHeihgt = list.length * initItemHeight

    initPositions()

    function initPositions() {
        const tempPositions: PositionType[] = []
        for (let i = 0; i < list.length; i++) {
            tempPositions.push({
                index: i,
                height: initItemHeight,
                top: i * initItemHeight,
                bottom: (i + 1) * initItemHeight,
                dHeight: 0,
            })

            // -- 为 list 中的每一项都添加一个唯一 id 属性（id 为对应的索引）
        }
        state.positions = [...tempPositions]

    }
}
init()

// -- 初始计算: 计算按照 initItemHeight 定宽时对应的渲染状态 → 当第一次渲染后再进行真实 DOM 节点的获取
let unWatch: WatchHandle | null = null
const initListHeightAndRenderCount = () => { // -- 初始化 scrollHeight 与 renderCount 数据
    if (!ctnRef.value) return
    const itemHeight = initItemHeight

    const ctnHeight = ctnRef.value.clientHeight

    state.renderCount = Math.ceil(ctnHeight / itemHeight) // -- 计算初始渲染个数
    state.listHeihgt = state.positions[state.positions.length - 1].bottom // -- 整个 list 高度等于 positions 中最后一项的 bottom 值
}

onMounted(() => {
    if (!ctnRef.value) return
    initListHeightAndRenderCount()

    setPositions() // -- 更新 positions 信息
    unWatch = watch([() => state.start, () => end.value], () => { // 当 start 更新或 end 时，也需要重新进行更新 positions 信息
        setPositions()
    })
})

function setPositions() { // -- 更新真实的 positions 信息
    // -- 因为更新真实 positions 的前提时对应的 DOM 已经渲染了，所以这里需要使用 nextTick
    nextTick(() => { // -- 更新具体的高度 -- 经过上面的初始化计算且DOM已更新后 → 这里需要等到第一个 DOM 渲染完后再进行执行 setPositions，所以这里需要使用 vue 中的 nextTick 函数来延迟执行
        const nodes = cttRef.value?.children

        if (!nodes || !nodes.length) return

        Array.from(nodes).forEach((node) => { // -- 遍历内容区中的每一项，并将对应的 DOM 信息更新到 state.positions 中
            if (!node) return
            const rect = node.getBoundingClientRect() // -- 获取当前元素节点信息
            const index = +node.id
            const oldHeight = state.positions[index].height
            const dHeight = oldHeight - rect.height // -- 获取预设高度与真实DOM渲染的高度差

            if (dHeight) { // -- 当高度差不为 0 时，更新当前元素 postion 信息
                state.positions[index].height = rect.height
                state.positions[index].bottom = state.positions[index].bottom - dHeight
                state.positions[index].dHeight = dHeight
            }
        })

        // -- 重新计算整体高度  
        const startIndex = +nodes[0].id
        const positionsLength = state.positions.length
        let startHeight = state.positions[startIndex].dHeight
        state.positions[startIndex].dHeight = 0

        for (let i = startIndex + 1; i < positionsLength; i++) {
            const item = state.positions[i];
            state.positions[i].top = state.positions[i - 1].bottom;
            state.positions[i].bottom = state.positions[i].bottom - startHeight;

            if (item.dHeight !== 0) {
                startHeight += item.dHeight;
                item.dHeight = 0;
            }
        }

        // 重新计算子列表的高度（占位元素）
        state.listHeihgt = state.positions[positionsLength - 1].bottom;
    })
}

// -- 滚动处理: 再滚动事件中为了更好的性能查找对应的 start 索引，外面可以通过 "二分查找" 的方式进行查找
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

    state.start = binarySearch(state.positions, scrollTop) // -- 查找开始索引

    state.currentOffset = state.start !== 0 ? state.positions[state.start - 1].bottom : 0
    state.listHeihgt = state.positions[state.positions.length - 1].bottom

    handleScrollReachBootomThrottle() // -- 判断是否为滚动到底部，并触发外部传入的回调函数
}

onMounted(() => { // -- 滚动事件监听
    if (!ctnRef.value) return
    ctnRef.value.addEventListener("scroll", handleScrollEvent)
    window.addEventListener("resize", initListHeightAndRenderCount)
})

onUnmounted(() => {
    if (unWatch) unWatch()
    if (ctnRef.value) {
        ctnRef.value.removeEventListener("scroll", handleScrollEvent)
        window.removeEventListener("resize", initListHeightAndRenderCount)
    }
})

function binarySearch(positions: PositionType[], value: number) { // -- 根据滚动大小再 state.positions 中查找对应的开始索引
    let [start, end, tempIndex] = [0, positions.length, 0]
    // let tempIndex: null | number = null

    while (start <= end) {
        const midIndex = Math.floor((end + start) / 2)
        const midValue = positions[midIndex].bottom

        if (midValue === value) return midIndex + 1
        else if (midValue < value) start = midIndex + 1
        else if (midValue > value) {
            if (tempIndex === 0 || tempIndex > midIndex) {
                tempIndex = midIndex
            }
            end = end - 1
        }
    }

    return tempIndex
}


// -- utils
function handleUnitOfSizeProps(value: number | string) { // -- 处理 width 与 height 参数的类型
    if (typeof value === "string") return value
    return value + "px"
}

// -- handle scrollbar
const hidden = hiddenScrollbar ? 'none' : 'block'

// -- vue3.3 定义 slot (可无: 写上可以有更好的代码提示与 TS 校验)
defineSlots<{
    item?: (props: { itemData: T }) => any
}>()
</script>

<template>
    <!-- 容器 -->
    <div class="virtual-list-container" ref="virtual-list-container" :style="{
        width: handleUnitOfSizeProps(width),
        height: handleUnitOfSizeProps(height)
    }">
        <!-- 占位元素 -->
        <div class="virtual-list-placeholder" :style="{
        height: handleUnitOfSizeProps(state.listHeihgt)
    }">
        </div>
        <!-- 渲染区域 -->
        <div class="virtual-list-content" ref="virtual-list-content"
            :style="{ transform: `translateY(${state.currentOffset}px)` }">
            <!-- 子组件: 列表中的每一项 -->
            <!-- 为每个 slot 外面再套一层 div 是，为了能够再组件中更好的获取对应的元素再 state.positions 中的索引位置，将对应的唯一 ID 绑定到该 div 的 id 属性中 -->
            <template v-for="(item, index) in showList" :key="item.id ?? index">
                <div :id="showListPositions[index].index + ''">
                    <slot name="item" :itemData="item"></slot>
                </div>
            </template>
        </div>
    </div>
</template>



<style lang="scss" scoped>
.virtual-list {
    &-container {
        width: 100%;
        height: 100vh;
        position: relative;
        overflow: auto;


        &::-webkit-scrollbar {
            width: 3px;
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


<!-- HFlexibleHeightVirtualList 组件用法
    + 必传属性
        - list: 列表数据（类型: T[]）
    + 通过插槽具名插槽 item，向 HFlexibleHeightVirtualList 传入所要展示的内容 → tip: 该插槽为一个作用域插槽，在对应的插槽中可以接收一个 itemData 数据，对应一项 item 的数据

    + 基本使用示例
        <HFlexibleHeightVirtualList :list="list">
            <template #item="{ itemData }">
                <div class="item">{{ itemData }}</div>
            </template>
        </HFlexibleHeightVirtualList>

    + 非必传属性
        - width: 容器的宽度（类型: number | string → 默认: 100%）
        - height: 容器的高度（类型: number | string → 默认: 100%）
        - bufferCount: 预加载的 item 个数（类型: number → 默认: 6）
        - initItemHeight: 预设的 item 高度（类型: number → 默认: 50）
        - hiddenScrollbar: 是否隐藏滚动条（类型: boolean → 默认: false）
        - reachBottomFn: 滚动到底部时触发的回调函数（类型: () => void | null → 默认: null）
        - reachBottomDistance: 滚动到底部时触发的回调函数的触发距离（类型: number → 默认: 50）
        - triggerBottomFnTime: 触发触底执行函数的节流时间（类型: number → 默认: 400ms）
-->