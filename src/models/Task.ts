import {model, Schema} from "mongoose";

interface ITask {
    userId: string,
    title: string,
    language: string,
    dateTime: Date,
    completed: boolean
}

const taskSchema = new Schema<ITask>({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    }
});

const TaskModel = model<ITask>("Task", taskSchema, "Tasks");

export default TaskModel;