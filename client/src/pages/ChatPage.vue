<template>
  <q-page padding>
    <div class="text-bold q-pb-md">
      Sample Chat app
    </div>

    <q-tabs
      v-model="tab"
      @update:model-value="joinRoom"
    >
      <q-tab name="all">
        All
      </q-tab>
      <q-tab name="delta">
        Delta
      </q-tab>
      <q-tab name="zulu">
        Zulu
      </q-tab>
    </q-tabs>

    <q-tab-panels
      v-model="tab"
    >
      <q-tab-panel name="all">
        <ChatMessages :messages="allMessages"  />
      </q-tab-panel>
      <q-tab-panel name="delta">
        <ChatMessages :messages="deltaMessages"  />
      </q-tab-panel>
      <q-tab-panel name="zulu">
        <ChatMessages :messages="zuluMessages"  />
      </q-tab-panel>
    </q-tab-panels>

    <div class="row items-center">
      <q-input v-model="text" class="col q-mr-sm" @keydown.enter="submit" />
      <q-btn
        color="primary"
        label="Send"
        icon-right="send"
        @click="submit"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { Message } from 'src/components/models'
import ChatMessages from 'src/components/ChatMessages.vue'
import { io } from 'socket.io-client'

const $q = useQuasar()
const socket = ref()
const allMessages = ref<Message[]>([])
const deltaMessages = ref<Message[]>([])
const zuluMessages = ref<Message[]>([])

const tab = ref('all')
const forAllTab = computed(() => tab.value === 'all')

const user = ref('Anonymous')
const text = ref('')

function connect () {
  socket.value = io('http://localhost:3000')

  socket.value.on('chat_message', (data: Message) => {
    allMessages.value.push(data)
  })

  socket.value.on('delta_message', (data: Message) => {
    deltaMessages.value.push(data)
  })

  socket.value.on('zulu_message', (data: Message) => {
    zuluMessages.value.push(data)
  })
}

function submit () {
  const payload: Record<string, string> = { user: user.value, msg: text.value }
  let emitKey = 'chat_message'

  if (!forAllTab.value) {
    emitKey = 'room_chat_message'
    payload.room = tab.value
  }

  socket.value.emit(emitKey, payload)
  text.value = ''
}

function joinRoom (newTab: string | number) {
  if (newTab === 'all') {
    return
  }

  socket.value.emit('joinRoom', { room: newTab, user: user.value })
}

onMounted(() => {
  $q.dialog({
    title: 'Prompt',
    message: 'What is your name?',
    prompt: {
      model: '',
      type: 'text' // optional
    },
    cancel: false,
    persistent: true
  }).onOk(data => {
    if (data) {
      user.value = data
    }

    connect()
  })
})

</script>
