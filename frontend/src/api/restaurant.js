import apiInstance from '../utils/apiInstance';

/* 식당 검색 */
export function searchRestaurant(word, res, err) {
  apiInstance
    .get('/greenmates/restaurant/search/', {
      params: {
        word,
      },
    })
    .then(res)
    .catch(err);
}

export const temp = '';
