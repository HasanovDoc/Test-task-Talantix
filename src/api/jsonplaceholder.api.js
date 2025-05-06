export class PlaceHolderApi {
    static BASE_URL = 'https://jsonplaceholder.typicode.com'

    static async getPosts() {
      try {
          const response = await fetch(`${this.BASE_URL}/posts`)
          const json = await response.json()
          return json
      } catch (error) {
          console.error(error)
      }
    }
    
    static async getPostById(id) {
      try {
        const response = await fetch(`${this.BASE_URL}/posts/${id}`)
        const json = await response.json()
        return json
      } catch (error) {
        console.error(error)
      }
    }

    static async getUsers() {
      try {
        const response = await fetch(`${this.BASE_URL}/users`)
        const json = await response.json()
        return json
      } catch (error) {
        console.error(error)
      }
    }
}