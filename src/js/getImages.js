import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getImages(searchQuery, page, per_page) {
  const params = {
    params: {
      key: '30591553-02722de834b11b67bfed3cccc',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: per_page,
      page: page,
    },
  };

  return await axios.get(`?q=${searchQuery}`, params);
}
