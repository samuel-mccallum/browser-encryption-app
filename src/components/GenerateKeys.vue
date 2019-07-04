<template>
    <div class="p-4 w-full flex justify-center text-lg">
      <div v-if="generating">
        <span>Generating Keys&hellip;</span>
      </div>
      <div v-else>
        <button class="bg-purple-700 hover:bg-purple-500 p-4 rounded-lg focus:outline-none" @click="click">{{ label }}</button>
      </div>
    </div>
</template>

<script>

export default {
  name: 'GenerateKeys',
  computed: {
    hasKeys () {
      return this.$store.getters.keysPresent
    },
    label () {
      return this.hasKeys ? 'Remove Keys' : 'GenerateKeys'
    },
    generating () {
      return this.$store.state.isGeneratingKeys
    }
  },
  methods: {
    click () {
      this.hasKeys ? this.clear() : this.generate()
    },
    generate () {
      const options = { worker: this.$worker, size: 1024 }
      this.$store.dispatch('jsencrypt-generate-keys', options)
    },
    clear () {
      this.$store.commit('clear-keys')
    }
  }
}
</script>
