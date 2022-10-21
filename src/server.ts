import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.options("*", cors());
app.use(express.json());

const prisma = new PrismaClient();

const port = 4000;
const SECRET = process.env.SECRET!;

function getToken(id: number) {
  return jwt.sign({ id: id }, SECRET, {
    expiresIn: "20 days",
  });
}

async function getCurrentUser(token: string) {
  const decodedData = jwt.verify(token, SECRET);
  const user = await prisma.user.findUnique({
    // @ts-ignore
    where: { id: decodedData.id },
  });
  return user;
}
export function hash(password: string) {
  return bcrypt.hashSync(password, 6);
}

export function verify(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(id: number) {
  return jwt.sign({ id }, process.env.SECRET!, { expiresIn: "10 day" });
}

app.get("/pizza", async (req, res) => {
  try {
    const pizza = await prisma.pizza.findMany({ 
      // include: { varients: true }
     });
    res.send(pizza);
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error.message });
  }
});
app.post("/pizza", async (req, res) => {
  const pizza= {
    description: req.body.description,
      image: req.body.image,
      prices: Number(req.body.prices),
      title: req.body.title,
      type: req.body.type,
      // varientId: req.body.varientId
  }
  const newpizza = await prisma.pizza.create({
    //@ts-ignore
    data: {
      description: pizza.description,
      image: pizza.image,
      prices: Number(pizza.prices),
      title: pizza.title,
      type: pizza.type,
       
    }
  })
  res.send(pizza)
});
app.get(`/pizza/:id`, async (req, res) => {
  try {
    const pizza = await prisma.pizza.findUnique({
      where: { id: Number(req.params.id) },
      // include: { varients: true },
    });
    if (pizza) {
      res.send(pizza);
    } else {
      res.status(404).send({ error: "pizza not found" });
    }
  } catch (error) {
    //@ts-ignored
    res.status(400).send({ error: error.message });
  }
});
app.get("/about", async (req, res) => {
  try {
    // @ts-ignore
    const about = await prisma.about.findMany();
    res.send(about);
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error.message });
  }
});

app.post("/sign-up", async (req, res) => {
  try {
    const match = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (match) {
      res.status(400).send({ error: "This account already exists." });
    } else {
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password),
        },
      });

      res.send({ user: user });
    }
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error.message });
  }
});

app.post("/sign-in", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    res.send({ user: user });
  } else {
    res.status(400).send({ error: "Invalid email/password combination." });
  }
});

app.get("/validate", async (req, res) => {
  try {
    if (req.headers.authorization) {
      const user = await getCurrentUser(req.headers.authorization);
      // @ts-ignore
      res.send({ user, token: getToken(user.id) });
    }
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error.message });
  }
});
app.get("/cartItem", async (req, res) => {
  try {
    // @ts-ignore
    const cartItem = await prisma.cartItem.findMany({
      include: { pizza: true, user: true },
    });
    res.send(cartItem);
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error.message });
  }
});
app.post("/cartItem", async (req, res) => {
  try { const item={
    userId: req.body.userId,
    pizzaId: req.body.pizzaId,
    quantity: req.body.quantity,
  }
    // @ts-ignore
    const cartItem = await prisma.cartItem.create({
      //@ts-ignore
      data: {
        userId: item.userId,
        pizzaId: item.pizzaId,
        quantity: item.quantity,
      },
    });
    res.send(cartItem);
  } catch (error) {
    // @ts-ignore
    res.status(400).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`App running: http://localhost:${port}`);
});
