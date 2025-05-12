<template>
    <div>
        <transition name="fade">
            <div 
                class="popup-overlay" 
                v-if="props.selectedPost"
                @click.self="$emit('closePopup')"
            >
                <div 
                class="popup-content"
                :style="props.popupStyle"
                ref="popupContent"
                >
                    <button class="close-btn" @click="$emit('closePopup')">×</button>
                    <div class="popup-card">
                        <h2>{{ selectedPost.title }}</h2>
                        <p>{{ selectedPost.body }}</p>
                        <p class="author">Author: {{ user.name }}</p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>


defineEmits(['closePopup'])

const props = defineProps({
    selectedPost: {},
    user: {},
    popupStyle: {}
})

</script>

<style scoped lang="scss">
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  will-change: transform;
  position: fixed;
}

.popup-card {
  padding: 30px;
  text-align: left;
  
  h2 {
    margin-top: 0;
    color: #333;
  }
  
  p {
    margin-bottom: 10px;
  }
  
  .author {
    font-style: italic;
    color: #666;
  }
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  z-index: 10;
  
  &:hover {
    color: #333;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>