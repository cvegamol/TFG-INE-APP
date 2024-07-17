"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
//middlewares que transforma la req.body en json
app.use(express_1.default.json());
//definimos el puerto
const PORT = 3000;
app.get('/ping', (req, res) => {
    res.send('Hello World');
});
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
