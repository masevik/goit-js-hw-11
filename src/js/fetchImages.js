import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.headers.common['Authorization'] =
  '30591553-02722de834b11b67bfed3cccc';
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';

export function fetchImages(searchQuery) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '30591553-02722de834b11b67bfed3cccc';

  // https://pixabay.com/api/?key=30591553-02722de834b11b67bfed3cccc&q=cat&image_type=photo&orientation=horizontal&safesearch=true

  return fetch(`${BASE_URL}/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true
  `).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
