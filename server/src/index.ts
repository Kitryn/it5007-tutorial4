import express from "express";

const PORT = process.env.PORT ?? 3000;
const app = express();

app.get("/*", (req, res) => {
  return res.send("Hello world?!!");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
