"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var noteRouter = require("./routes/note.route");
var connectDatabase = require("./utills/connectDatabase");
var http = require("http");
var Server = require("socket.io").Server;
var envObj = require("./config").envObj;
// app created
var app = express();
//htto server
var server = http.createServer(app);
var io = new Server(server, {
    cors: {
        origin: "*",
    },
});
io.on("connection", function (socket) {
    console.log("connected:", socket.id);
    socket.on("disconnect", function () {
        console.log("disconnected:", socket.id);
    });
});
app.set("io", io);
//test api
app.get("/", function (req, res) {
    res.send("api is working!!!");
});
// middelware
app.use(cors());
app.use(express.json());
app.use("/api/notes", noteRouter);
//global error handler
app.use(function (error, req, res, next) {
    console.log("🚀 ~ error:", error);
    res.status(error.statusCode || 500).json({
        status: false,
        message: "something went wrong",
        error: error.message,
    });
});
//global exception handler
//like this erroe express will not catch
// setTimeout(() => {
//   throw new Error("Crash after 2 seconds");
// }, 2000);
process.on("uncaughtException", function (err) {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});
process.on("unhandledRejection", function (reason) {
    console.error("Unhandled Rejection:", reason);
    process.exit(1);
});
var startServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                //connect to database
                return [4 /*yield*/, connectDatabase()];
            case 1:
                //connect to database
                _a.sent();
                server.listen(envObj.PORT, function () {
                    console.log("Server running on port ".concat(envObj.PORT));
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                if (error_1 instanceof Error) {
                    console.log("🚀 ~ startServer ~ error:", error_1.message);
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// start server
startServer();
