<template>
  <div class="key">
    <h3 class="text-lg">{{ label }}</h3>

    <textarea class="py-2 w-full" v-if="shown" v-model="plaintext" readonly></textarea>

    <div class="py-2">
      <a v-if="shown" href="#hide-key" @click.prevent="hide">Hide</a>
      <a v-else href="#show-key" @click.prevent="show">Show</a>
      <a class="px-4" href="#clear-key" @click.prevent="clear">Clear</a>
      <a :href="buildData()" :download="downloadName()">Download</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Key',
  props: ['plaintext', 'label'],
  data () {
    return {
      shown: false
    }
  },
  methods: {
    buildData () {
      return `data:text/plain;base64,${btoa(this.plaintext)}`
    },

    downloadName () {
      return this.label.toLowerCase().replace(' ', '.')
    },

    clear () {
      this.$emit('clear')
    },

    show () {
      this.shown = true
    },

    hide () {
      this.shown = false
    }
  }
}
</script>
