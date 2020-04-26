import axios from "axios";
import {BASE_URL} from "./config";
const http = axios.create({
  baseURL:BASE_URL
})

http.interceptors.response.use(function(res){
  //配置响应拦截器
  return res;
})

export default http;