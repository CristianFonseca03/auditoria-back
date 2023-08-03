import mongoose, { Model, Schema, model } from "mongoose";
import { Document } from "../interfaces";

export interface IDocument extends Document {}

const documentSchema = new Schema(
  {
    tittle: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Document: Model<IDocument> =
  mongoose.models.Document || model("Document", documentSchema);

export default Document;
