import express, {Response} from "express";
const router = express.Router();
import TaskModel from "../models/Task";

interface CurrentTaskResponse extends Response {
    currentTask?: any
}

// Middleware process that is always called when an endpoint includes an :id parameter
router.param("id", async (request, response: CurrentTaskResponse, next, id) => {
    // Get task from MongoDB
    let currentTask;
    try {
        currentTask = await TaskModel.findById(id);
        if(currentTask === null) response.status(404).json({ message: "Cannot find task."})
    } catch (error) {
        if (error instanceof Error) response.status(500).json({message: error.message});
    }

    // Store the current task in variable
    response.currentTask = currentTask;

    // Run the route code
    next();
});

router.route("/")
    // Get all tasks
    .get(async (request, response) => {
        try {
            const allTasks = await TaskModel.find();
            response.json(allTasks);
        } catch (error) {
            response.status(500).json({message: (error as Error).message});
        }
    })
    // Create a new task
    .post(async (request, response) => {
        try {
            const newTask = await TaskModel.create({
                userId: request.body.userId,
                title: request.body.title,
                language: request.body.language,
                dateTime: request.body.dateTime,
                completed: request.body.completed
            });

            response.status(201).json(newTask);
        } catch (error) {
            response.status(400).json({message: (error as Error).message});
        }
    })
    // Delete a task using ?id=
    .delete(async (request, response) => {
        try {
            const deletedTask = await TaskModel.findByIdAndDelete(request.query.id);
            response.json(deletedTask);
        } catch (error) {
            response.status(500).json({message: (error as Error).message});
        }
    })

router.route("/:id")
    // Get task by id
    .get((request, response: CurrentTaskResponse) => {
        response.json(response.currentTask);
    })
    // Update task by id
    .put(async (request, response: CurrentTaskResponse) => {
        response.currentTask.userId = request.body.userId;
        response.currentTask.title = request.body.title;
        response.currentTask.language = request.body.language;
        response.currentTask.dateTime = request.body.dateTime;
        response.currentTask.completed = request.body.completed;

        try {
            const updatedTask = await response.currentTask.save();
            response.json(updatedTask);
        } catch (error) {
            response.status(400).json({message: (error as Error).message});
        }
    })

router.route("/completed/:id")
    .patch(async (request, response: CurrentTaskResponse) => {
        response.currentTask.completed = request.body.completed;

        try {
            const updatedTask = await response.currentTask.save();
            response.json(updatedTask);
        } catch (error) {
            response.status(400).json({message: (error as Error).message});
        }
    })

module.exports = router;