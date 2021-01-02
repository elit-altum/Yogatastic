const path = require("path");
const express = require("express");
const poseRouter = require("./routes/poseRoute");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/api/v1/poses", poseRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log("Server is up on port: ", port);
});
