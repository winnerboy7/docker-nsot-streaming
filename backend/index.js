const express = require("express")
const os = require("os")
const app = express()
const fs = require("fs")
const cors = require("cors")

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8000"],
    credentials: true,
  })
)

app.get("/", (req, res) => {
  res.json({
    message: "Hello World! Chaimongkol Khamkom (God)",
    hostname: `${os.hostname()}`,
    CPU: `${os.cpus()[0].model}`,
  })
})

app.get("/video", function (req, res) {
  const range = req.headers.range
  if (!range) {
    res.status(400).send("Requires Range header")
  }
  const videoFileName = req.query.fileName || "file_example_MP4_1920_18MG.mp4"
  // const videoPath ="videos/" + videoFileName
  const videoPath ="videos/" + videoFileName

  const videoSize = fs.statSync(videoPath).size
  const CHUNK_SIZE = 10 ** 6 // 1MB
  const start = Number(range.replace(/\D/g, ""))
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
  const contentLength = end - start + 1
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  }
  res.writeHead(206, headers)
  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running at <http://localhost>:${PORT}/`)
})
