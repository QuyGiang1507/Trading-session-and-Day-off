export default function authHeader() {
  const obj = JSON.parse(localStorage.getItem("token"));

  if (obj) {
    return {Authorization: obj};
  } else {
    return {};
  }
}
