import client from "../utility/database";
import {Request, Response} from "express";

export default class QueryManager {
  async querySingle(req: Request, res: Response) {
    try {
      const { name } = req.params;

      if (name === "") {
        return res.status(400).send({ message: "Bad request." });
      }

      const university = await client.hGetAll(String(name));
      if (!university) {
        return res.status(404).send({ message: `${name} not found.` });
      }

      let singleUni = {name: name, ...university};
      return res.status(200).send({ message: `${name} retrieved successfully.`, singleUni });
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
      const min = parseFloat(req.query.min as string);
      const max = parseFloat(req.query.max as string);

      if (min === undefined && max === undefined) {
        return res.status(400).send({ message: "Bad request.", reason: "min and max are undefined." });
      }

      const universities = await client.keys('*');
      const result = [];

      for (let university of universities) {
        const data = await client.hGetAll(university);
        if (data && data.score !== undefined) {
          let scoreNum = parseFloat(data.score);
          if (scoreNum >= min && scoreNum <= max) result.push({name: university, ...data});
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