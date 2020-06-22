import axios from 'axios'
import utils from '@/utils/utils.js'
export default {
  post(url, param, fn){
    param = JSON.stringify(param);
    console.log('param', param);
    axios.post(url, param, {
      headers: {
        'token': localStorage.getItem("token")
      }
    }).then((res) => {
      if(res.data.errorCode === '00000') {
        let data = res.data.datas;
        fn(data);
      }else{
        utils.msg(res.data.errorMessage);
      }
    });
  }
}
