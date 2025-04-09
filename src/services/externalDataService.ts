import axios from "axios";
import Entity from "../models/Task";
import dbConnect from "../utils/dbConnect";

const EXTERNAL_API_URL = "https://api.example.com/data"; // Replace with actual API URL

export const fetchExternalData = async () => {
  try {
    const response = await axios.get(EXTERNAL_API_URL);
    const data = response.data;

    // Process and store the fetched data
    await dbConnect();
    for (const item of data) {
      const entity = new Entity({
        name: item.name,
        createdAt: new Date(),
        isActive: item.isActive,
        value: item.value,
      });
      await entity.save();
    }
  } catch (error) {
    console.error("Error fetching external data:", error);
  }
};

export const getExternalData = async () => {
  try {
    await dbConnect();
    const entities = await Entity.find({});
    return entities;
  } catch (error) {
    console.error("Error retrieving external data:", error);
    throw error;
  }
};
