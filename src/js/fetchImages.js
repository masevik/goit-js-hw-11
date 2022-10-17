import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export function fetchImages(searchQuery) {
  const params = {
    params: {
      key: '30591553-02722de834b11b67bfed3cccc',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    },
  };

  return axios(`?q=${searchQuery}`, params);
}
