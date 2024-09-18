<template>
  <q-page padding>
    <div class="text-bold q-pb-md">
      Sample Chat app
    </div>

    <q-tabs>
      <q-tab>
        All
      </q-tab>
      <q-tab>
        Delta
      </q-tab>
      <q-tab>
        Zulu
      </q-tab>
    </q-tabs>

    <q-card>
      <q-card-section>
        <q-list>
          <q-item
            v-for="(message, index) in messages"
            :key="index"
            dense
          >
            <q-item-section side>
              <q-item-label class="text-bold">{{ message.name }}:</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ message.msg }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section class="row items-end">
        <q-input v-model="text" class="col q-mr-sm" @keydown.enter="submit" />
        <q-btn
          color="primary"
          label="Send"
          icon-right="send"
          @click="submit"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { io } from 'socket.io-client'

interface Message {
  msg: string
  name: string
}

const $q = useQuasar()
const socket = ref()

const name = ref('Anonymous')
const text = ref('')
const messages = ref<Message[]>([])

function connect () {
  socket.value = io('http://localhost:3000')

  console.log(socket.value)

  socket.value.on('chat_message', (data: Message) => {
    messages.value.push(data)
  })
}

function submit () {
  socket.value.emit('chat_message', { name: name.value, msg: text.value })
  text.value = ''
}

onMounted(() => {
  $q.dialog({
    title: 'Prompt',
    message: 'What is your name?',
    prompt: {
      model: '',
      type: 'text' // optional
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    name.value = data
    connect()
  })
})

</script>
