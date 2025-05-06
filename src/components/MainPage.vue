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
      <div class="card-item" v-for="(item) in filteredPosts" :key="item.id">
        <PostCard :card-title="item.title" :card-info="item.body" :card-author="getUserById(item.userId).name"/>
      </div>
    </div>
    <div class="no-result" v-else>Not found a single coincidence</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { PlaceHolderApi } from '../api/jsonplaceholder.api.js'
import PostCard from './PostCard.vue'

const posts = ref([])
const users = ref([])
const searchAuthor = ref('')

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
    // console.log(posts.value)
  } catch (error) {
    console.error(error)
  }
}

const getUsers = async() => {
  try {
    users.value = await PlaceHolderApi.getUsers()
    // console.log(sortedPosts.value)    
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
}

.no-result {
  font-size: 20px;
  margin-top: 40px;
}
</style>
