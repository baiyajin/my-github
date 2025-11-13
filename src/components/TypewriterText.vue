<template>
  <span class="inline-block">{{ displayText }}<span class="animate-blink">|</span></span>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  speed: {
    type: Number,
    default: 100,
  },
})

const displayText = ref('')
let typingTimer = null

onMounted(() => {
  startTyping()
})

const startTyping = () => {
  displayText.value = ''
  let index = 0
  
  const type = () => {
    if (index < props.text.length) {
      displayText.value += props.text[index]
      index++
      typingTimer = setTimeout(type, props.speed)
    }
  }
  
  type()
}

watch(() => props.text, () => {
  if (typingTimer) {
    clearTimeout(typingTimer)
  }
  startTyping()
})

</script>

<style scoped>
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.animate-blink {
  animation: blink 1s infinite;
  margin-left: 2px;
}
</style>

