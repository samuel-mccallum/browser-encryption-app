<template>
  <div class="py-4 flex flex-col">
    <label>{{ label }}</label>
    <input class="py-2" type='file' @change="onChange">
  </div>
</template>

<script>
export default {
  name: 'Uploader',
  props: ['label'],
  methods: {
    onChange (ev) {
      const file = ev.target.files[0]
      this.$emit('upload', file)
    }
  }
}
</script>
