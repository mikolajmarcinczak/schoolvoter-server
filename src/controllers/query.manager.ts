import client from "../utility/database";
import {Request, Response} from "express";

export default class QueryManager {
  async querySingle(req: Request, res: Response) {
    try {
      const { name } = req.params;

      if (name === "") {
        return res.status(400).send({ message: "Bad request." });
      }

      const university = await client.hGetAll(name as string);
      if (!university) {
        return res.status(404).send({ message: `${name} not found.` });
      }

      return res.status(200).send({ message: `${name} retrieved successfully.`, university });
    }
    catch (error: unknown) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error." });
    }
  }

  async queryAll(req: Request, res: Response) {
    try {
      const universities = await client.keys('*');
      const result = [];

      for (let university of universities) {
        const data = await client.hGetAll(university);
        if (university) result.push({name: university, ...data});
      }

      return res.status(200).send({ message: "Universities retrieved successfully.", universities: result });
    }
    catch (error: unknown) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error." });
    }
  }

  async queryByScore(req: Request, res: Response) {
    try {
      const { min, max } = req.params;

      if (min === undefined && max === undefined) {
        return res.status(400).send({ message: "Bad request.", reason: "min and max are undefined." });
      }

      const universities = await client.keys('*');
      const result = [];

      for (let university of universities) {
        const data = await client.hmGet(university, 'score');
        if (data[0] !== undefined && !isNaN(Number(data[0]))) {
          let score = parseFloat(data[0] || '0');
          if (min === undefined) {
            if (score === parseFloat(max as string)) {
              result.push({name: university, ...data});
            }
          } else if (max === undefined) {
            if (score === parseFloat(min as string)) {
              result.push({name: university, ...data});
            }
          } else {
            if (score >= parseFloat(min as string) && score <= parseFloat(max as string)) {
              result.push({name: university, ...data});
            }
          }
        }
      }

      return res.status(200).send({ message: "Universities retrieved successfully.", universities: result });
    }
    catch (error: unknown) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error." });
    }
  }
}