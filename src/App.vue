<template>
  <div id="app" class="p-4 flex flex-wrap items-start justify-around">
    <div class="block">
      Status: {{ status }}
    </div>

    <GenerateKeys></GenerateKeys>

    <Encrypt></Encrypt>
    <Decrypt></Decrypt>

    <files></files>
  </div>
</template>

<script>
import GenerateKeys from '@/components/GenerateKeys.vue'
import Encrypt from '@/components/Encrypt.vue'
import Decrypt from '@/components/Decrypt.vue'
import Files from '@/components/Files.vue'

export default {
  name: 'app',
  components: {
    GenerateKeys,
    Encrypt,
    Decrypt,
    Files
  },
  computed: {
    status () {
      if (this.$store.state.generatingKeys) {
        return 'Generating keys&hellip;'
      }
      else if (this.$store.state.generatingAesKey) {
        return 'Generating AES key&hellip;'
      }
      else if (this.$store.state.encrypting) {
        return 'Encrypting...'
      }
      else if (this.$store.state.decrypting) {
        return 'Decrypting&hellip;'
      }
      else {
        return 'Idle'
      }
    }
  }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

textarea {
  min-height: 200px;

  @apply rounded-lg p-4 text-gray-800;
}

a {
  @apply text-purple-500;
}

a:hover {
  @apply text-purple-700;
}

a:focus {
  @apply outline-none;
}

body {
  @apply bg-gray-800 text-orange-100;
}
</style>
