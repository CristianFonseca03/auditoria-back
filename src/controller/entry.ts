import { Request, Response } from "express";
import { database } from "../database";
import { Entry } from "../models";

export const getEntries = async (_req: Request, res: Response) => {
  try {
    await database.connect();
    const entries = await Entry.find({});
    if (entries!) {
      await database.disconnect();
      return res.status(404).json({
        success: false,
        message: "No se encontraron notas",
      });
    }
    await database.disconnect();
    return res.status(200).json({
      success: true,
      message: "Notas encontradas",
      data: entries,
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await database.connect();
    const entry = await Entry.findById(id);
    if (!entry) {
      await database.disconnect();
      return res.status(404).json({
        success: false,
        message: "Nota no encontrada",
      });
    }
    await database.disconnect();
    return res.status(200).json({
      success: true,
      message: "Nota encontrada",
      data: entry,
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const postEntry = async (req: Request, res: Response) => {
  try {
    await database.connect();
    const entry = new Entry({
      description: req.body.description,
      createdAt: Date.now(),
    });
    await entry.save();
    await database.disconnect();
    return res.status(201).json({
      success: true,
      message: "Nota creada",
      data: entry,
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEntry = async (req: Request, res: Response) => {
  try {
    await database.connect();

    const { id } = req.params;
    const entry = await Entry.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!entry) {
      await database.disconnect();
      return res.status(400).json({
        success: false,
        message: "Nota no encontrada",
      });
    }
    await database.disconnect();
    return res.status(200).json({
      success: true,
      message: "Nota actualizada",
      entry,
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEntry = async (req: Request, res: Response) => {
  try {
    await database.connect();
    const { id } = req.params;
    const entry = await Entry.findOneAndDelete({ _id: id });
    if (!entry) {
      await database.disconnect();
      return res.status(400).json({
        success: false,
        message: "No se pudo eliminar la nota",
      });
    }
    await database.disconnect();
    return res.status(200).json({
      success: true,
      message: "Nota eliminada",
    });
  } catch (error) {
    await database.disconnect();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
