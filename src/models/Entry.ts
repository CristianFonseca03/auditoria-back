import mongoose, { Model, Schema } from "mongoose";
import { Entry } from "../interfaces";

export interface IEntry extends Entry {}

const entrySchema = new Schema({
  description: { type: String, required: true },
  createdAt: { type: Number },
  status: {
    type: String,
    enum: {
      values: ["pending", "in-progress", "finished"],
      message: "{VALUE} no es u estado permitido",
    },
    default: "pending",
  },
});

const Entry: Model<IEntry> =
  mongoose.models.Entry || mongoose.model("Entry", entrySchema);

export default Entry;
