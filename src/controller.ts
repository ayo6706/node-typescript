import fs from "fs";
import path from "path";
import { ServerResponse, IncomingMessage } from "http";
import { getAll, getById } from './file';
import { Task } from "./ITask";


// fetch tasks all  
export const getTasksList = async (res: ServerResponse) => {
  const tasks = await getAll();
  res.writeHead(200,  { "Content-Type": "application/json" });
  res.end(JSON.stringify(tasks));
};

// fetch tasks by author
const getTasks = async ( res: ServerResponse, author: string) => {

    try {
     
        // Read the db.json
      const task = await getById(author);
     
      if (!task) {
        res.writeHead(404,  { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: `Task with author: ${author} not found` }));
      } else {
        res.writeHead(200,  { "Content-Type": "application/json" });
        res.end(JSON.stringify(task))
     
      }
    } catch (e) {
      
      console.error(e)
    }
  };



 //add tasks
 const addTask = (req: IncomingMessage, res: ServerResponse) => {
    // Read the data from the request
    let data = "";
 
    req.on("data", (chunk) => {
      data += chunk.toString();
    });
 
    // When the request is done
    req.on("end", () => {
      let task = JSON.parse(data);
 
      // Read the db.json file
      fs.readFile(path.join(__dirname, "db.json"), "utf8", (err, data) => {
        // Check out any errors
        if (err) {
          // error, send an error message
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: false,
              error: err,
            })
          );
        } else {
          // no error, get the current tasks
          let tasks: [Task] = JSON.parse(data);
          // get the id of the latest task
          let latest_id = tasks.reduce(
            (max = 0, task: Task) => (task.id > max ? task.id : max),
            0
          );
          // increment the id by 1
          task.id = latest_id + 1;
          // add the new task to the tasks array
          tasks.push(task);
          // write the new tasks array to the db.json file
          fs.writeFile(
            path.join(__dirname, "db.json"),
            JSON.stringify(tasks),
            (err) => {
              // Check out any errors
              if (err) {
                // error, send an error message
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: false,
                    error: err,
                  })
                );
              } else {
                // no error, send the data
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: true,
                    message: task,
                  })
                );
              }
            }
          );
        }
      });
    });
 };


 export { getTasks, addTask };