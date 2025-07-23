import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url';

const app = express();

const PORT = process.env.PORT || 5500

//Get file path from the URL of the current module
const __fileName = fileURLToPath(import.meta.url);
//Get the directory name from the file path
const __dirName = dirname(__fileName);

//MIDDLEWARE
app.use(express.json());
//Serve the HTML file from the /public directory
//Tell express to serve all files from the public folder as static files/assets
app.use(express.static(path.join(__dirName, './src/public')));

//Serving up the HTML file from the /public directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirName), 'public', 'index.html')
})

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
})
