import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-dd0b5.firebaseio.com/'
});
export default instance;