import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";

const PORT = 3000;

app.listen(3000, () => {
  console.log(`Server listening on port: ${PORT}`);
});
