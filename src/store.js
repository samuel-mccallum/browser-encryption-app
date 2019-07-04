import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    generatingKeys: false,
    generatingAesKey: false,
    encrypting: false,
    eecrypting: false,
    privateKey: '',
    publicKey: '',
    files: []
  },
  mutations: {
    'private-key' (state, key) {
      state.privateKey = key
    },
    'public-key' (state, key) {
      state.publicKey = key
    },
    'clear-keys' (state) {
      state.publicKey = ''
      state.privateKey = ''
    },
    'generating-keys' (state, generating) {
      state.isGeneratingKeys = generating
    },
    'add-file' (state, manifest) {
      delete manifest.id
      manifest.id = new Date().getTime()
      state.files.push(manifest)
    },
    'remove-file' (state, id) {
      let file = state.files.find(el => el.id === id)
      if (file) {
        state.files.splice(state.files.indexOf(file), 1)
      }
    },
    'encrypting' (state, encrypting) {
      state.encrypting = encrypting
    },
    'decrypting' (state, decrypting) {
      state.decrypting = decrypting
    },
    'generating-aes-key' (state, generating) {
      state.generatingAesKey = generating
    }
  },
  actions: {
    'jsencrypt-generate-keys' ({ commit }, { size, worker }) {
      commit('generating-keys', true)
      worker.run(size => {
        self.window = self
        self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/2.3.1/jsencrypt.min.js')
        let crypt = new JSEncrypt({ default_key_size: size }) // eslint-disable-line

        return {
          publicKey: crypt.getPublicKey(),
          privateKey: crypt.getPrivateKey()
        }
      }, [size]).then(keys => {
        commit('public-key', keys.publicKey)
        commit('private-key', keys.privateKey)
        commit('generating-keys', false)
      })
    },

    'jsencrypt-encrypt' ({ commit }, { key, plaintext, worker }) {
      commit('encrypting', true)

      let promise = new Promise(resolve => {
        worker.run(( key, plaintext ) => {
          self.window = self
          self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/2.3.1/jsencrypt.min.js')
          let crypt = new JSEncrypt() // eslint-disable-line
          crypt.setKey(key)
          return crypt.encrypt(plaintext)
        }, [key, plaintext]).then(ciphertext => resolve(ciphertext))
      })

      promise.then(() => { commit('encrypting', false) })
      return promise
    },

    'jsencrypt-decrypt' ({ commit }, { key, ciphertext, worker }) {
      commit('decrypting', true)

      let promise = new Promise(resolve => {
        worker.run(( key, ciphertext ) => {
          self.window = self
          self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/2.3.1/jsencrypt.min.js')
          let crypt = new JSEncrypt() // eslint-disable-line
          crypt.setKey(key)
          return crypt.decrypt(ciphertext)
        }, [key, ciphertext]).then(plaintext => resolve(plaintext))
      })

      promise.then(() => {commit('decrypting', false)})
      return promise
    },

    'aes-generate-key' ({ commit }, { size, worker }) {
      commit('generating-aes-key', true)
      const bytes = size / 8

      let promise = new Promise(resolve => {
        worker.run(bytes => {
          const key = new Uint8Array(bytes)
          key.forEach((el, ind) => { key[ind] = Math.floor(Math.random() * Math.floor(99)) })
          return key
        }, [bytes]).then(key => resolve(key))
      })

      promise.then(() => { commit('generating-aes-key', false) })
      return promise
    },

    'aes-encrypt' ({ commit }, { key, plaintext, worker }) {
      commit('encrypting', true)

      let promise = new Promise( resolve => {
        worker.run( (key, plaintext) => {
          self.window = self
          self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/aes-js/3.1.2/index.min.js')
          const ctr = new aesjs.ModeOfOperation.ctr(key)
          const encryptedBytes = ctr.encrypt(aesjs.utils.utf8.toBytes(plaintext))
          return aesjs.utils.hex.fromBytes(encryptedBytes)

        }, [key, plaintext]).then( ciphertext => resolve(ciphertext))
      })

      promise.then(() => {commit('encrypting', false)})
      return promise
    },

    'aes-decrypt' ({ commit }, { key, ciphertext, worker }) {
      commit('decrypting', true)

      let promise = new Promise( resolve => {
        worker.run( (key, ciphertext) => {
          self.window = self
          self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/aes-js/3.1.2/index.min.js')
          const ctr = new aesjs.ModeOfOperation.ctr(key)
          const encryptedBytes = aesjs.utils.hex.toBytes(ciphertext)
          const decryptedBytes = ctr.decrypt(encryptedBytes)
          const plaintext = aesjs.utils.utf8.fromBytes(decryptedBytes)
          return plaintext
        }, [key, ciphertext]).then( plaintext => resolve(plaintext))
      })

      promise.then(() => { commit('decrypting', false) })
      return promise
    }
  },
  getters: {
    keysPresent (state) {
      return state.publicKey.length && state.privateKey.length
    }
  }
})
