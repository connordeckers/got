import express from "express";
import http from "node:http";

const app = express();

app.get("/no-store", (_res, req) => {
	return req
		.setHeader("Cache-Control", "no-cache, no-store")
		.send(req.getHeader("Cache-Control") + ' ' + new Date().toUTCString());
});

app.get("/no-cache", (_res, req) => {
	return req
		.setHeader("Cache-Control", "no-cache")
		.send("no-cache " + new Date().toUTCString());
});

app.get("/short-cache", (_res, req) => {
	return req
		.setHeader("Cache-Control", "public,max-age=60")
		.send("short-cache " + new Date().toUTCString());
});

app.get("/long-cache", (_res, req) => {
	return req
		.setHeader("Cache-Control", "public,max-age=360000")
		.send("long-cache " + new Date().toUTCString());
});

http.createServer(app).listen(3000, () => {
	console.log("Listening on port 3000");
});
