import express, { json } from "express";
import cors from "cors";

import routes from "./routers/routes.js";

const app = express();
app.use(cors());
app.use(json());

app.use(routes);

app.listen(4000, () => {
  console.log(`Server listening on port 4000`);
});
