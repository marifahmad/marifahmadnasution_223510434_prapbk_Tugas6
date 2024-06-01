<template>
  <div class="container">
    <button @click="showModal = true; isEditMode = false;" class="add-button">Tambah Data</button>
    <h2 style="text-align: start;">Data Pariwisata</h2>
    <div v-if="showModal" class="modal" style="margin-top: 20px;">
      <div class="modal-content">
        
        <span class="close" @click="showModal = false">&times;</span>
        <h2 style="color: #0000009e;">{{ isEditMode ? 'Edit Data' : 'Data Pariwisata' }}</h2>
        <form @submit.prevent="onSubmit">
          <input type="date" v-model="form.tanggal" placeholder="Tanggal" required />
          <input type="text" v-model="form.wisatawan" placeholder="Wisatawan" required />
          <input type="text" v-model="form.usia" placeholder="Usia" required />
          <h4 style="color: #0000009e; text-align: start;">Jenis Kelamin</h4>

         
          <div class="radio-label" style="margin-bottom: 10px;">
  <label>
    
    <input type="radio" v-model="form.gender" value="Laki-laki" /> Laki-laki
  </label>
  <label>
    <input type="radio" v-model="form.gender" value="Perempuan" /> Perempuan
  </label>
</div>

          <input type="text" v-model="form.turis" placeholder="Negara Asal" required />
          <input type="text" v-model="form.durasi" placeholder="Durasi Kunjungan" required />

          <button type="submit" class="submit-button">{{ isEditMode ? 'Update' : 'Tambah' }}</button>
        </form>
      </div>
    </div>
    <table class="article-table">
      <thead>
        <tr>
          <th>No</th>
          <th style="width: 200px;">Tanggal Kunjungan</th>
          <th>Wisatawan</th>
          <th style="width: 80px; text-align: center;">Usia</th>
          <th style="width: 150px;">Jenis Kelamin</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(article, index) in articles" :key="article.id">
          <td>{{ index + 1 }}</td>
          <td > {{ article.tanggal }}</td>
          <td>{{ article.wisatawan }}</td>
          <td>{{ article.usia }}</td>
          <td>{{ article.gender }}</td>
          <td style="padding: 10px;">
            <button class="edit-button" style=" background-color: rgb(11, 182, 240); font-size: 15px; width: 50px; padding: none;" @click="editArticle(article)"><i class="fas fa-edit edit-button" style="padding-top: 10px; padding-bottom: 10px; padding-right: 10px;background-color: rgb(11, 182, 240)"></i></button>
            <button class="delete-button" style=" background-color: #d32f2f; margin-top: 10px; font-size: 15px; width: 50px; padding: none;" @click="deleteArticle(article.id)"><i class="fas fa-trash delete-button" style="padding-top: 10px;  padding-bottom: 10px; padding-right: 10px; background-color: #d32f2f;" ></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <footer>
    <p>&copy; 2024 Integrasi Dengan API. All rights reserved.</p>
    <p>Contact: marifahmad145@gmail.com</p>
  </footer>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  components: {
    FontAwesomeIcon
  },
  setup() {
    const articles = ref([]);
    const binId = '665a5652acd3cb34a850d96b'; // Replace with your actual bin ID from JSON Bin
    const apiKey = '$2a$10$3h0EzbkfDqg5XVaa/5AIW.PX9kFIUSnu54dNCGtFLY4ZO6l2Sulq.'; // Replace with your actual API key from JSON Bin
    const baseUrl = `https://api.jsonbin.io/v3/b/${binId}`;

    const showModal = ref(false);
    const isEditMode = ref(false);
    const currentArticleId = ref(null);

    const form = reactive({
      tanggal: '',
      wisatawan: '',
      usia: '',
      gender: '',
      turis: '',
      durasi: ''
    });

    const fetchData = async () => {
      try {
        const response = await axios.get(baseUrl, {
          headers: {
            'X-Master-Key': apiKey
          }
        });
        articles.value = response.data.record.articles;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const addData = async (newData) => {
      try {
        const response = await axios.put(baseUrl, { articles: [...articles.value, newData] }, {
          headers: {
            'X-Master-Key': apiKey,
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error adding data:', error);
        throw error;
      }
    };

    const updateData = async (id, updatedData) => {
      try {
        const updatedArticles = articles.value.map(article =>
          article.id === id ? updatedData : article
        );
        const response = await axios.put(baseUrl, { articles: updatedArticles }, {
          headers: {
            'X-Master-Key': apiKey,
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error updating data:', error);
        throw error;
      }
    };

    const deleteArticle = async (id) => {
      try {
        const updatedArticles = articles.value.filter(article => article.id !== id);
        await axios.put(baseUrl, { articles: updatedArticles }, {
          headers: {
            'X-Master-Key': apiKey,
            'Content-Type': 'application/json'
          }
        });
        await fetchData();
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    };

    const editArticle = (article) => {
      isEditMode.value = true;
      currentArticleId.value = article.id;
      form.tanggal = article.tanggal;
      form.wisatawan = article.wisatawan;
      form.usia = article.usia;
      form.gender = article.gender;
      form.turis = article.turis;
      form.durasi = article.durasi;
      showModal.value = true;
    };

    const onSubmit = async () => {
      try {
        const newData = {
          tanggal: form.tanggal,
          wisatawan: form.wisatawan,
          usia: form.usia,
          gender: form.gender,
          turis: form.turis,
          durasi: form.durasi,
          id: isEditMode.value ? currentArticleId.value : new Date().toISOString() // Generating unique ID for new articles
        };

        if (isEditMode.value) {
          await updateData(currentArticleId.value, newData);
        } else {
          await addData(newData);
        }
        form.tanggal = '';
        form.wisatawan = '';
        form.usia = '';
        form.gender = '';
        form.turis = '';
        form.durasi = '';
        showModal.value = false;
        isEditMode.value = false;
        currentArticleId.value = null;
        await fetchData();
      } catch (error) {
        console.error('Error adding/updating data:', error);
      }
    };

    onMounted(async () => {
      await fetchData();
    });

    return {
      articles,
      showModal,
      isEditMode, 
      currentArticleId,
      form,
      fetchData,
      addData,
      updateData,
      deleteArticle,
      editArticle,
      onSubmit
    };
  }
};
</script>

<style>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('/src/assets/img/jepangmalam.jpeg') no-repeat center center/cover;
  margin: 0;
  font-family: 'Arial', sans-serif;
}

.container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
  color: #fff;
  text-align: center;
  width: 100%;
  max-width: 600px;
}

.add-button {
  padding: 10px 20px;
  margin-bottom: 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #45a049;
}

input[type="text"],
input[type="date"],
input[type="checkbox"],

textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}
.radio-label {
  display: block;
  text-align: left;
  margin-right: 10px; /* Sesuaikan jarak sesuai kebutuhan */
}

.radio-text {
  margin-left: 5px; /* Sesuaikan jarak sesuai kebutuhan */
}

/* Gaya untuk label yang berisi tombol radio "Laki-laki" */
.radio-label label:nth-child(1) {
  color: blue; /* Misalnya, memberikan warna biru untuk "Laki-laki" */
}

/* Gaya untuk label yang berisi tombol radio "Perempuan" */
.radio-label label:nth-child(2) {
  color: red; /* Misalnya, memberikan warna merah untuk "Perempuan" */
}
.submit-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #45a049;
}

.article-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.article-table th {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

.article-table th {
  background-color: #4caf50;
  color: white;
}

.article-table td {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid #252020;
  position: relative;
}

.article-table .edit-button{
  border: none;
  border-radius: 5px;
  cursor: pointer;
 
}

.article-table .delete-button {
  border: none;
  border-radius: 5px;
  
}










footer {
  margin-top: 20px;
  padding: 20px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
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

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  color: #aaa;
  transition: color 0.3s ease;
}

.close:hover {
  color: #ff0000;
}
</style>