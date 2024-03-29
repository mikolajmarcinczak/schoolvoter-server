import client from "../utility/database";
import {Request, Response} from "express";
import {promisify} from "util";

//const hsetAsync = promisify(client.HSET).bind(client);

export default class ContextManager {

  async create(req: Request, res: Response) {
    try {
      const name: string = req.body.name;
      const type: string = req.body.type;
      const miasto: string = req.body.miasto;

      if (name === "" || type === "" || miasto === "") {
        return res.status(400).send({ message: "Bad request." });
      }

      //const exists: boolean = await hgetallAsync(name);
      const exists = await client.exists(name)
      if (exists === 1) {
        return res.status(409).send({ message: `${name} already exists.`, result: exists });
      }

      await client.hSet(name, {"type": type, "miasto": miasto, "score": "0", "votes": "0"});
      return res.status(201).send({ message: `Successfully added ${name}.`});
    }
    catch (error: unknown) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error.", error: error });
    }
  }

  async updateScore(req: Request, res: Response) {
    try {
      const name: string = req.body.name;
      const newScore: number = req.body.newScore;

      if (name === "" || isNaN(newScore) || (newScore < 1 || newScore > 10)) {
        return res.status(400).send({message: "Bad request."});
      }

      const university = await client.hGetAll(String(name));
      if (!university) {
        return res.status(404).send({message: `${name} not found.`});
      }

      const currentScore = parseFloat(university.score || '0');
      const currentCount = parseInt(university.votes || '0');
      const updatedScore = (currentScore * currentCount + newScore) / (currentCount + 1);

      await client.hSet(name, {"score": updatedScore.toString(), "votes": (currentCount + 1).toString()});
      return res.status(200).send({message: `${name} updated successfully.`, score: updatedScore});
    }
    catch (error: unknown) {
      console.error(error);
      return res.status(500).send({message: "Internal server error.", error: error});
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const name: string = req.params.name;

      if (name === "") {
        return res.status(400).send({ message: "Bad request." });
      }

      const exists = await client.exists(name)
      if (exists === 0) {
        return res.status(404).send({ message: `${name} does not exist.`, result: exists });
      }

      await client.del(name);
      return res.status(204).send({ message: `Successfully deleted ${name}.`});
    }
    catch (error: unknown) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error.", error: error });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const keys = await client.keys('*');

      if (keys.length === 0) {
        return res.status(404).send({ message: `Database is empty.`});
      }

      for (const key of keys) {
        await client.del(key);
      }

      return res.status(204).send({ message: `Successfully deleted all.`});
    }
    catch (error: unknown) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error.", error: error });
    }
  }
}