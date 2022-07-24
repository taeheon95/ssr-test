import React, { createElement } from "react";
import ReactDOMServer from "react-dom/server";
import express, { NextFunction, Request, Response } from "express";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import path from "path";

const app = express();

const serverRender = (req: Request, res: Response, next: NextFunction) => {
  const jsx = (
    <StaticRouter location={req.url}>
      <App />
    </StaticRouter>
  );
  const root = ReactDOMServer.renderToString(jsx);
  res.send(root);
};

const serve = express.static(path.resolve("./build"), {
  index: false,
});

app.use(serve);
app.use(serverRender);

app.listen(5000, () => {
  console.log("running on http://localhost:5000");
});
