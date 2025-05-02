import axios from 'axios';
import { SERVER_URL as serverUrl, TIME_TO_PING as pingTime, API_VERSION as apiVersion } from './config';

const ping = async () => {
    try{
        const { data } = await axios.get(`${serverUrl}/api/${apiVersion}/ping`);
        console.info(`Server pinged successfully: ${data.message}! Status code is ${200} & Status text is OK`);
    } catch(e: any) {
        console.info(`this the error message: ${e.message}`); 
    }
};

setInterval(ping, pingTime)