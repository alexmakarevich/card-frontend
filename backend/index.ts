import express from "express";
import axios from "axios";
async function server() {
	const app = express();

	const PORT = 8888;

	app.use(express.json());

	const router = express.Router();

	router.get("/cards", async (req, res) => {
		try {
			const {data} = await axios.get("https://www.myposter.de/web-api/job-interview");
			res.status(200).setHeader("Access-Control-Allow-Origin", "*").send(data.payload.data);
		} catch (err) {
			console.log(err);
			return res.status(500).send("Unexpected Error");
		}
	});

	app.use(router);

	app.listen(PORT, function () {
		console.log("Server is running on Port: " + PORT);
	});
}

server();
