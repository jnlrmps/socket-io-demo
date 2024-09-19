<template>
    <q-card>
      <q-card-section>
        <q-list>
          <q-item
            v-for="(message, index) in messages"
            :key="index"
            dense
          >
            <q-item-section
              v-if="message?.user"
              side
            >
              <q-item-label class="text-bold">{{ message?.user }}:</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ message.msg }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
</template>

<script lang="ts" setup>
import { Message } from 'src/components/models'

defineProps<{
  messages: Message[]
}>()
</script>
