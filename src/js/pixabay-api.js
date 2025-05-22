import axios from 'axios';

const API_KEY = '11450328-c2e7c4daa2322168e3859ef5d';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                key: API_KEY,
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page,
                per_page: 15,
            },
        });
        return response.data;
    } catch (error) {
        console.error(
            `Sorry, there are no images matching your search query. Please try again!`,
            error
        );
        throw error;
    }
}
