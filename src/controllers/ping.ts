import axios from "axios"
import { Request, Response } from "express";
import { API_VERSION, SERVER_URL } from "../config";

export const ping = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/${API_VERSION}/health`);
    res.status(response.status).json({
      message: "Your server is healthy",
    });
  } catch (error) {
    console.log("error:", {error});
    
    res.status(500).json({
      success: false,
      message: "Your server is unhealthy",
    });
  }
};
