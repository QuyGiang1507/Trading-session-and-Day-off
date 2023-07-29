import { mongoConnector } from "../mongo/mongoConnector";
import { redisConnector } from "@mxs/common";
import axios from "axios";

beforeAll(async () => {
  console.log("beforeAll");
  redisConnector.connect();

  // login
  const res = await LoginForTest("quangvd@gmail.com", "Quang1234");
  globalThis.tokenJWT = res.headers["x-auth"];
});

async function LoginForTest(email, password) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.URL_AUTH_SERVICE}/user/login`,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      email,
      password,
    },
  };

  const res = await axios.request(config);
  return res;
}
