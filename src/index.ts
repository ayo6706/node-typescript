import http from "http";
import { getTasks, addTask, getTasksList } from "./controller";


// create the http server
const server = http.createServer  ( async (req, res)  => {

  //fetch all tasks or fetch by author
   if (req.method == "GET" && req.url == "/tasks") {
     return await getTasksList(res);
   } else if (req.url?.match(/tasks\/\w+/)  && req.method === 'GET') {

    const author = req.url?.split('/')[2]
     await getTasks(res, author);
  
   }

   
   // add a task
   if (req.method == "POST" && req.url == "/tasks") {
     return addTask(req, res);
   }

   
});

// set up the server port and listen for connections
server.listen(3000, () => {
   console.log("Server is running on port 3000");
});