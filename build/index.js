"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cheerio = __importStar(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://muhammad-muizzuddin.vercel.app"],
}));
app.get("/", (req, res) => {
    res.send("okeh");
});
app.get("/api/walpaper/:src", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const src = req.params.src;
        const page = req.query.page || "1";
        if (Array.isArray(page)) {
            res.status(400).json({ errors: ["only one query string of page"] });
            return;
        }
        if (isNaN(+page)) {
            res.status(400).json({ errors: ["page query only number"] });
            return;
        }
        const result = yield axios_1.default.post(`${process.env.URL}${src}/${page}`);
        const $ = cheerio.load(result.data);
        const dataUrl = [];
        const ul = $("div.container-2 ul.image-gallery-items");
        ul.first()
            .find("li.image-gallery-items__item")
            .map((i, element) => {
            const img = $(element)
                .find(".image-gallery-image__inner")
                .find("img");
            const url = img.attr("src");
            if (url) {
                dataUrl.push(url + "?w=600&r=0.5625");
            }
        });
        res.status(200).json({ message: "all url", data: dataUrl });
    }
    catch (err) {
        if (err instanceof axios_1.default.AxiosError) {
            if ((_a = err.response) === null || _a === void 0 ? void 0 : _a.status) {
                res
                    .status((_b = err.response) === null || _b === void 0 ? void 0 : _b.status)
                    .json({ errors: [err.message + " from external fetch"] });
                return;
            }
        }
        res.status(500).json({ errors: [err.message] });
    }
}));
app.listen(3000, function () {
    console.log("server is listening");
});
