<script setup lang="ts">
import { HFxiedHeightVirtualList } from "../../dist/index"

const list = Array.from({ length: 10000 }, (_, i) => i + 1)

</script>

<template>
    <HFxiedHeightVirtualList :item-height="40" :list="list" height="500px">
        <template #item="{ itemData }">
            <div class="item">
                {{ itemData }}
            </div>
        </template>
    </HFxiedHeightVirtualList>
</template>

<style scoped>
.item {
    height: 40px;
    width: 100%;
    margin-bottom: 20px;
    background-color: orange;
    color: white;
    line-height: 40px;
    text-align: center;
}
</style>