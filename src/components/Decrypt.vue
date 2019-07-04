<template>
  <div class="p-4 w-1/2 flex justify-center flex-col">
    <h1 class="text-center text-2xl">Decrypt</h1>

    <div v-if="hasKey">
      <Key :plaintext="key" label="Decryption Key"></Key>
      <Uploader label="Upload a file to decrypt" @upload="onUpload"></Uploader>
    </div>
    <div v-else>
      <Uploader label="Upload a decryption key" @upload="onKeyUpload"></Uploader>
    </div>
  </div>
</template>

<script>
import Key from '@/components/Key.vue'
import Uploader from '@/components/Uploader.vue'

export default {
  name: 'Decrypt',
  components: {
    Key,
    Uploader
  },
  computed: {
    hasKey () {
      return !!this.$store.state.privateKey
    },
    isGenerating () {
      return this.$store.state.isGeneratingKeys
    },
    key () {
      return this.$store.state.privateKey
    }
  },
  methods: {
    fileToText (file) {
      const reader = new FileReader()

      return new Promise(resolve => {
        reader.addEventListener('load', ev => {
          let text = ev.target.result
          resolve(text)
        })

        reader.readAsText(file)
      })
    },
    async onUpload (file) {
      let sourceText = await this.fileToText(file)
      let manifest = JSON.parse(atob(sourceText))

      let serializedPlainKey = await this.$store.dispatch('jsencrypt-decrypt', {
        worker: this.$worker,
        key: this.key,
        ciphertext: manifest.cipherkey
      })

      let plainkey = new Uint8Array(serializedPlainKey.split(','))

      let plaintext = await this.$store.dispatch('aes-decrypt', {
        worker: this.$worker,
        key: plainkey,
        ciphertext: manifest.ciphertext
      })

      delete manifest.cipherkey
      delete manifest.ciphertext

      manifest.plaintext = plaintext
      manifest.encrypted = false
      this.$store.commit('add-file', manifest)
    },

    async onKeyUpload (file) {
      let key = await this.fileToText(file)
      this.$store.commit('private-key', key)
    }
  }
}
</script>
