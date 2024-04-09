import { db_places } from "../../../lib/db_places";
import dbConnect from "../../../db/connect";
import Place from "../../../db/models/Place";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "GET") {
    try {
      const places = await Place.find();
      return response.status(200).json(places);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }

  if (request.method === "POST") {
    try {
      const placeData = request.body;
      console.log("222222222222222222222222222222222222", placeData);
      const result = await Place.create(placeData);
      console.log("==========================", result);
      return response.status(201).json({ status: "place created" });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: error.message });
    }
  }

  return response.status(405).json({ message: "Method not allowed" });
}
