import express from "express";
import { prisma } from "./prisma";
import { User } from "@prisma/client";
import { compareSync, hashSync } from "bcrypt";
import jwt from 'jsonwebtoken';
import { getJwtKeys } from "./key";

const auth = express();
auth.use(express.json())


// Function for verification email and password user
async function verifyUser(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    if (!user) {
        return null
    }
    if (!compareSync(password, user.password)) {
        return null
    }
    return user
}


function getExpTime(min: number) {
    const now = Math.trunc(new Date().getTime() / 1000);
    return now + min * 10;
}

async function generateJwt(user: User | null): Promise<string> {
    const payload = {
        aud: 'access',
        exp: getExpTime(2 * 60),
        id: user!.id,
        email: user!.email
    }
    const { privateKey } = await getJwtKeys();
    return jwt.sign(payload, privateKey, { algorithm: 'RS256' })
}


auth.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await verifyUser(email, password)
    if (!user) {
        return res.status(403).send({ msg: 'Invalid authentication' })
    }
    const token = await generateJwt(user);
    return res.status(201).send({
        msg: `Hello ${user?.name}`,
        accessToken: token,

    })
})


auth.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const passwordHash = hashSync(password, 5);
    let user: User;
    try {
      user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: passwordHash
            }
        })
        return res.status(201).send(user)
    } catch {
        return res.status(401).send({ mag: 'Cannot create user' })
    }
})


auth.get('/user', async (req, res) => {
    try {
        const user = await prisma.user.findMany({
            include: {
                infoBeer: true
            }
        })
        return res.status(200).send(user)
    } catch {
        return res.status(404).send({ msg: 'Cannot find user' })
    }
})

export { auth }