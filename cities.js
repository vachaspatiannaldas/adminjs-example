import { Schema } from "mongoose";
export const citiesSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    street: String,
    number: Number,
    postcode: String,
});