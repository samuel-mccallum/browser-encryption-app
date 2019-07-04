<template>
  <div class="p-4 w-full">
    <h1 class="text-2xl">Files</h1>

    <p v-if="!files.length" class="py-2 text-lg">
      No files yet.  Try clicking on "Generate Keys" and Encrypt a file.  
      If you already have keys and files download, try uploading them to decrypt.
    </p>

    <ul>
      <li class="py-2" v-for="file in files" :key="file.id">
        <div class="flex justify-between">
          <span class="w-1/3">
            {{ file.name }}
          </span>

          <span v-if="file.encrypted">Encrypted File</span>
          <span v-else>Decrypted File</span>

          <a :href="buildData(file)" :download="fileName(file)">Download</a>

          <a href="#remove-file-from-list" @click.prevent="remove(file.id)">X</a>
        </div>
      </li>
    </ul>
  </div>

</template>

<script>
export default {
  name: 'Files',
  computed: {
    files () {
      return this.$store.state.files
    }
  },
  methods: {
    fileName (file) {
      return file.encrypted ? file.integrity : file.name
    },
    buildData (file) {
      if (file.encrypted) {
        return `data:text/plain;charset=utf-8,${encodeURIComponent(btoa(JSON.stringify(file)))}`
      } else {
        return `data:${file.type};base64,${btoa(file.plaintext)}`
      }
    },
    remove (id) {
      this.$store.commit('remove-file', id)
    }
  }
}
</script>
