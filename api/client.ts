import axios from "axios";

export const HOST = "https://api.myanimelist.net/v2";

export const client = axios.create({
  headers: {
    "X-MAL-CLIENT-ID": process.env.EXPO_PUBLIC_MAL_CLIENT_ID,
  },
});
