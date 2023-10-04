import got from "./index.js";
import { setTimeout } from "node:timers/promises";
import { StorageAdapter } from "cacheable-request";
import { StoredData } from "keyv";

class Caching implements StorageAdapter {
	private map = new Map();
	get(key: string) {
		console.log("get", key);
		return this.map.get(key);
	}

	set(key: string, value: any, ttl?: number | undefined) {
		console.log("set", { key, value, ttl });
		return this.map.set(key, value);
	}

	delete(key: string): boolean | Promise<boolean> {
		console.log("delete", key);
		return this.map.delete(key);
	}

	clear(): void | Promise<void> {
		console.log("clear");
		return this.map.clear();
	}

	has?(key: string): boolean | Promise<boolean> {
		console.log("has", key);
		return this.map.has(key);
	}

	getMany?(
		keys: string[]
	): StoredData<any>[] | Promise<StoredData<any>[]> | undefined {
		return keys.map((key) => this.get(key));
	}
}

const paths = ["no-store", "no-cache", "short-cache", "long-cache"];
const http = got.extend({
	prefixUrl: "http://localhost:3000/",
	cache: new Caching(),
	hooks: {
		beforeCache: [() => true],
	},
});

await Promise.all(paths.map((path) => http.get(path).text()))
	.then(console.log)
	.catch(() => console.error("whoops"));

await setTimeout(5000);

await Promise.all(paths.map((path) => http.get(path).text())).then(console.log);
