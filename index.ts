import express from "express";
import { Request, Response } from "express";
import * as cheerio from "cheerio";
import axios, { AxiosResponse } from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app: express.Application = express();
app.use(cors({ origin: "http://localhost:5173" }));

app.get("/", (req: Request, res: Response) => {
  res.send("okeh");
});

app.get("/api/walpaper/:src", async (req: Request, res: Response) => {
  try {
    const src: string = req.params.src;

    const result: AxiosResponse<string> = await axios.post(
      `${process.env.URL}${src}`
    );

    const $: cheerio.CheerioAPI = cheerio.load(result.data);
    const dataUrl: string[] = [];

    const ul: cheerio.Cheerio<cheerio.Element> = $(
      "div.container-2 ul.image-gallery-items"
    );
    ul.first()
      .find("li.image-gallery-items__item")
      .map((i, element) => {
        const img: cheerio.Cheerio<cheerio.Element> = $(element)
          .find(".image-gallery-image__inner")
          .find("img");
        const url: string | undefined = img.attr("src");
        if (url) {
          dataUrl.push(url + "?w=600&r=0.5625");
        }
      });

    res.status(200).json({ message: "all url", data: dataUrl });
  } catch (err: any) {
    if (err instanceof axios.AxiosError) {
      if (err.response?.status) {
        res
          .status(err.response?.status)
          .json({ errors: [err.message + " from external fetch"] });
        return;
      }
    }
    res.status(500).json({ errors: [err.message] });
  }
});

app.listen(3000, function () {
  console.log("server is listening");
});
