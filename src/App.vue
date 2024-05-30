<template>
  <div class="container">
    <form @submit.prevent="save">
  <h1 style="color: #fff">Integrasi dengan API</h1>
      
      <input type="text" v-model="form.title" placeholder="Title" /><br />
      <textarea v-model="form.content" placeholder="Content"></textarea><br />
      <button type="submit">Save</button>
    </form>
    <ul>
      <li v-for="article in articles" :key="article.id">
        {{ article.title }}<br />
        {{ article.content }}<br />
        <button class="edit" @click="edit(article)">Edit</button>
        <button @click="remove(article.id)">Delete</button>
      </li>
    </ul>
    <button @click="load">Load</button>
  </div>
  <footer>
    <p>&copy; 2024 Integrasi Dengan API. All rights reserved.</p>
    <p>Contact: marifahmad145@gmail.com</p>
  </footer>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';

const form = reactive({
  id: null,
  title: '',
  content: '',
});

const articles = ref([]);

async function load() {
  try {
    const storedArticles = localStorage.getItem('articles');
    if (storedArticles) {
      articles.value = JSON.parse(storedArticles);
    } else {
      // Jika tidak ada data di localStorage, lakukan permintaan ke server
      const response = await axios.get('http://localhost:3000/articles');
      articles.value = response.data;
      // Simpan data ke localStorage
      localStorage.setItem('articles', JSON.stringify(response.data));
    }
  } catch (error) {
    console.error('Error loading articles', error);
  }
}

async function save() {
  try {
    const url = form.id
      ? `http://localhost:3000/articles/${form.id}`
      : 'http://localhost:3000/articles';
    const method = form.id ? 'put' : 'post';
    const response = await axios[method](url, form);

    if (form.id) {
      // Update existing article in the articles array
      articles.value = articles.value.map((article) =>
        article.id === response.data.id ? response.data : article
      );
    } else {
      // Add new article to the articles array
      articles.value.push(response.data);
    }

    form.id = null;
    form.title = '';
    form.content = '';
  } catch (error) {
    console.error('Error saving articles', error);
  }
}

async function remove(id) {
  try {
    await axios.delete(`http://localhost:3000/articles/${id}`);
    articles.value = articles.value.filter((article) => article.id !== id);
  } catch (error) {
    console.error('Error removing article', error);
  }
}

function edit(article) {
  form.id = article.id;
  form.title = article.title;
  form.content = article.content;
}

onMounted(load);
</script>

<style>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('/src/assets/img/jepangmalam.jpeg') no-repeat;
  background-size: cover;
  background-position: center;
}

.container {
  background: transparent;
  border: 2px solid rgb(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: #fff;
  border-radius: 10px;
  padding: 30px 40px;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

li button {
  margin-left: 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
}

li button.edit {
  background-color: rgb(17, 170, 221);
}

li button.edit:hover {
  background-color: rgb(11, 182, 240);
}

li button:hover {
  background-color: #d32f2f;
}

footer {
  margin-top: 20px;
  padding: 20px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 10px;
}

footer p {
  margin: 5px 0;
}

footer a {
  color: #fff;
  text-decoration: none;
}

footer a:hover {
  text-decoration: underline;
}
</style>
