import axios from "axios";
//工具类
export function getLocalCity(callback) {
  return new Promise(function(resolve, reject) {
    const city = localStorage.getItem("city_item");
    if (city) {
      resolve(JSON.parse(city));
      callback && callback(JSON.parse(city));
    } else {
      const myCity = new window.BMap.LocalCity();
      myCity.get(res => {
        const cityName = res.name;
        axios
          .get("http://localhost:8080/area/info", {
            params: { name: cityName }
          })
          .then(res => {
            const { status, body } = res.data;
            if (status === 200) {
              localStorage.setItem("city_item", JSON.stringify(body));
              resolve(body);
              callback && callback(body);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  });
}
