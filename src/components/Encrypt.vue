<template>
  <div class="p-4 w-1/2 flex justify-center flex-col">
    <h1 class="text-center text-2xl">Encrypt</h1>

    <div v-if="hasKey">
      <Key :plaintext="key" label="Encryption Key" @clear="clearKey"></Key>
      <Uploader label="Upload a file to encrypt" @upload="onUpload"></Uploader>
    </div>
    <div v-else>
      <Uploader label="Upload an encryption key"  @upload="onKeyUpload"></Uploader>
    </div>
  </div>
</template>

<script>
import Key from '@/components/Key.vue'
import Uploader from '@/components/Uploader.vue'
import sum from 'hash-sum'

export default {
  name: 'Encrypt',
  components: {
    Key,
    Uploader
  },
  computed: {
    hasKey () {
      return !!this.$store.state.publicKey
    },
    isGenerating () {
      return this.$store.state.isGeneratingKeys
    },
    key () {
      return this.$store.state.publicKey
    }
  },
  methods: {
    fileToBinaryString (file) {
      const reader = new FileReader()

      return new Promise(resolve => {
        reader.addEventListener('load', ev => {
          let binaryString = ev.target.result
          resolve(binaryString)
        })

        reader.readAsBinaryString(file)
      })
    },

    async onUpload (file) {
      if ((file.size / 1024) > 500) {
        return alert('There is a 500Kb limit.  Larger files start to use a ton of memory and can freeze the browser.')
      }

      const binaryString = await this.fileToBinaryString(file)

      const key = await this.$store.dispatch('aes-generate-key', {
        worker: this.$worker,
        size: 192
      })

      const ciphertext = await this.$store.dispatch('aes-encrypt', {
        key,
        plaintext: binaryString,
        worker: this.$worker
      })

      const cipherkey = await this.$store.dispatch('jsencrypt-encrypt', {
        key: this.key,
        worker: this.$worker,
        plaintext: key.join(',')
      })

      let manifest = {
        integrity: sum(ciphertext),
        name: file.name,
        type: file.type,
        size: file.size,
        encrypted: true,
        cipherkey,
        ciphertext
      }

      this.$store.commit('add-file', manifest)
    },

    async onKeyUpload (file) {
      let key = await this.fileToBinaryString(file)
      this.$store.commit('public-key', key)
    },

    clearKey () {
      this.$store.commit('public-key', '')
    }
  }
}
</script>
