import { Router } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'
import { User, userModel } from '../models/user.model';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import bcrypt from 'bcryptjs';


const router = Router();

// router.get('/seed', asyncHandler(async (req, res) => {
//     const usersCount = await userModel.countDocuments();
//     if (usersCount > 0) {
//         res.send('Food data already seeded');
//         return;
//     }

//     await userModel.create(sample_users);
//     res.send('Food data seeded successfully');
// }));

router.post("/login", asyncHandler(
    async (req, res) => {
      const {email, password} = req.body;
      const user = await userModel.findOne({email});
    
       if(user && (await bcrypt.compare(password,user.password))) {
        res.send(generateTokenResponse(user));
       }
       else{
         res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
       }
    
    }
  ))

router.post('/register', asyncHandler(async (req, res) => {
    const { name, email, password, address } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        res.status(HTTP_BAD_REQUEST).send({ message: 'User already exists' });
        return;
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
        id: '',
        name,
        email: email.toLowerCase(),
        password: encryptedPassword,
        address,
        isAdmin: false,
    }
    const createdUser = await userModel.create(newUser);
    res.send(generateTokenResponse(createdUser));
    }));

const generateTokenResponse = (user: any) => {
    const token = jwt.sign({
        email: user.email,
        isAdmin: user.isAdmin
    },
        "secret", { expiresIn: '30d' });
    user.token = token;
    return user;
};


export default router;