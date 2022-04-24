import {readFile} from 'fs/promises'
import { Task } from "./ITask";


export const getAll = async(): Promise<Task[]> => {
  const buffer = await readFile('./src/db.json', {
    encoding: 'utf-8'
  })

  return JSON.parse(buffer)
}

export const getById  =  async(author:string) =>{
  const TasksList =  await getAll();
  const task = TasksList.filter(task => task.author === author) as any;

  if(task){
    return  task
  }
}  
