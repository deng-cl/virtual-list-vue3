<script setup lang="ts">
import { HFlexibleHeightVirtualList } from "../../dist/index"

const list = Array.from({ length: 1000 }, (_, i) => {
    let r = ""
    if (i === 999) r = "END:"
    for (let i = 0; i < Math.floor(Math.random() * 50000); i++) {
        r += "孔"
    }
    return r
})

</script>

<template>
    <HFlexibleHeightVirtualList :list="list" height="100vh">
        <template #item="{ itemData }">
            <div class="item">
                {{ itemData }}
            </div>
        </template>
    </HFlexibleHeightVirtualList>
</template>

<style scoped>
.item {
    /* height: 40px; */
    width: 100%;
    margin-bottom: 20px;
    background-color: orange;
    color: white;
    line-height: 40px;
    text-align: center;
}
</style>../../lib/main