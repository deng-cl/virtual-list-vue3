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

export interface FixedHeightProps<T> extends VitualListProps<T> { // -- 定高虚拟列表参数
    itemHeight: number
}

export interface FlexibleHeightProps<T> extends VitualListProps<T> { // -- 非定高虚拟列表参数
    initItemHeight?: number
}

export interface PositionType { // -- 非定高虚拟列表位置信息接口
    index: number
    height: number
    top: number
    bottom: number
    dHeight: number
}

