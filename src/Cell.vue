<template>
  <div>
    {{params.value}}
  </div>
</template>

<script lang="ts" setup>
  type Props = {
      params: any
  }
  const props = defineProps<Props>()
  console.log(props?.params)

</script>

<style lang="scss" scoped>

</style>