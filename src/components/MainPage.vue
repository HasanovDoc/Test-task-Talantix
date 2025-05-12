<template>
  <div class="main">
    <div class="posts-filter">
      <input 
        v-model="searchAuthor" 
        type="text" 
        placeholder="Filter by author"
        class="filter-input"
      >
    </div>
    <div class="posts-cards" v-if="filteredPosts.length">
      <div 
        class="card-item" 
        v-for="(item) in filteredPosts" 
        :style="cardStyles[item.id]"
        :key="item.id"
        :ref="el => setCardRef(el, item.id)"
        @click="openPopup(item, $event)"
        @mouseenter="calculatePopupStyles(item)"
      >
        <PostCard 
          :card-title="item.title" 
          :card-info="item.body" 
          :card-author="getUserById(item.userId).name"
        />
      </div>
    </div>
    <div class="no-result" v-else>Not found a single coincidence</div>

    <!-- Popup overlay -->
     <PopupCard 
        v-if="selectedPost" 
        :selected-post="selectedPost" 
        :popup-style="popupStyle" 
        :user="getUserById(selectedPost.userId)" 
        @close-popup="closePopup"
      />
    <!-- <transition name="fade">
      <div 
        class="popup-overlay" 
        v-if="selectedPost"
        @click.self="closePopup"
      >
        <div 
          class="popup-content"
          :style="popupStyle"
          ref="popupContent"
        >
          <button class="close-btn" @click="closePopup">×</button>
          <div class="popup-card">
            <h2>{{ selectedPost.title }}</h2>
            <p>{{ selectedPost.body }}</p>
            <p class="author">Author: {{ getUserById(selectedPost.userId).name }}</p>
          </div>
        </div>
      </div>
    </transition> -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { PlaceHolderApi } from '../api/jsonplaceholder.api.js'
import PostCard from './PostCard.vue'
import PopupCard from './PopupCard.vue'

const posts = ref([])
const users = ref([])
const searchAuthor = ref('')
const selectedPost = ref(null)
const cardRefs = ref({})
// const popupContent = ref(null)
const cardRect = ref(null)
const popupStyle = ref({
  transform: 'scale(0.5)',
  opacity: 0
})
const cardStyles = ref({})

const setCardRef = (el, id) => {
  if (el) {
    cardRefs.value[id] = el
  }
}

const calculatePopupStyles = (post) => {
  const cardElement = cardRefs.value[post.id]
  cardRect.value = cardElement.getBoundingClientRect()
  popupStyle.value = {
      position: 'fixed',
      left: `${cardRect.value.left}px`,
      top: `${cardRect.value.top}px`,
      width: `${cardRect.value.width}px`,
      height: `${cardRect.value.height}px`,
      transformOrigin: 'top left',
      transform: 'scale(1)',
      opacity: 1,
      transition: 'all 0.8s'
    }
}

const openPopup = async (post) => {
  selectedPost.value = post
  
  await nextTick()
  
  const cardElement = cardRefs.value[post.id]
  cardRect.value = cardElement.getBoundingClientRect()
  if (cardElement) { 
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Calculate target position (center of screen)
    const targetLeft = (viewportWidth - 600) / 2
    const targetTop = (viewportHeight - 400) / 2

    cardStyles.value[post.id] = {
      opacity: 0
    }
    
    // Force reflow to apply initial styles
    await nextTick()
    // await nextTick()
    // await nextTick()
    
    // Animate to final position
    popupStyle.value = {
      ...popupStyle.value,
      left: `${targetLeft}px`,
      top: `${targetTop}px`,
      width: '600px',
      height: '400px',
      transform: 'scale(1)',
      transition: 'all 0.8s',
      opacity: 1
    }
  }
}

const closePopup = async () => {
  if (!selectedPost.value) return
  
  const post = selectedPost.value
  const cardElement = cardRefs.value[post.id]
  
  if (cardElement) {
    cardRect.value = cardElement.getBoundingClientRect()

    // Set styles for closing animation
    popupStyle.value = {
      ...popupStyle.value,
      left: `${cardRect.value.left}px`,
      top: `${cardRect.value.top}px`,
      width: `${cardRect.value.width}px`,
      height: `${cardRect.value.height}px`,
      transform: 'scale(1)',
      transition: 'all 0.3s',
      opacity: 0
    }
    
    // Wait for animation to complete
    setTimeout(() => {
      cardStyles.value[post.id] = {
        opacity: 1,
      }
      selectedPost.value = null
    }, 400)
  }
}

const filteredPosts = computed(() => {
  if (!searchAuthor.value) return posts.value
  
  const searchTerm = searchAuthor.value.toLowerCase()
  return posts.value.filter(post => {
    const user = getUserById(post.userId)
    return user.name.toLowerCase().includes(searchTerm)
  })
})

const getPosts = async() => {
  try {
    posts.value = await PlaceHolderApi.getPosts()  
  } catch (error) {
    console.error(error)
  }
}

const getUsers = async() => {
  try {
    users.value = await PlaceHolderApi.getUsers()
  } catch (error) {
    console.error(error)
  }
}

const getUserById = (userId) => {
  return users.value.find(user => user.id === userId) || { name: 'Unknown' }
}

onMounted(() => {
  getPosts()
  getUsers()
})
</script>

<style scoped lang="scss">
.main {
  max-width: 100vw;
  text-align: center;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.posts-filter {
  display: flex;
  justify-content: center;
  input {
    width: 300px;
    height: 30px;
    padding: 4px;
  }
}

.posts-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 0;
  }
}

.card-item {
  padding: 10px;
  width: fit-content;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
}

.no-result {
  font-size: 20px;
  margin-top: 40px;
}

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