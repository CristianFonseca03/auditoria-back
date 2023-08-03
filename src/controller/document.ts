import { Request, Response } from "express";
import { database } from "../database";
import { Document } from "../models";

export const getDocuments = async (_req: Request, res: Response) => {
  try {
    await database.connect();
    const documents = await Document.find({});
    if (documents!.length === 0) {
      const document = new Document({
        tittle: "tittle",
        description: "description",
        //TODO: replace link with a real link
        link: "https://drive.google.com/file/d/1y2aZVUGRsoqr4lzh54Eoc1lkzgAdsjgV/view?usp=sharing",
      });
      await document.save();
      const documents = await Document.find({});
      await database.disconnect();
      return res.status(200).json({
        success: true,
        message: "Documentos encontrados",
        data: documents,
      });
    }
    await database.disconnect();
    return res.status(200).json({
      success: true,
      message: "Documentos encontrados",
      data: documents,
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    await database.connect();
    const { id } = req.body;
    const document = await Document.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!document) {
      await database.disconnect();
      return res.status(400).json({
        success: false,
        message: "Documento no encontrado",
      });
    }
    await database.disconnect();
    return res.status(200).json({
      success: true,
      message: "Documento actualizado",
      data: document,
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
