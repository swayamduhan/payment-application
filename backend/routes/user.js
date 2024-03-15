const { Router } = require("express");
const router = Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middlewares");
require("dotenv").config();
const { User, Account } = require("../database/db");
const JWT_SECRET = process.env.JWT_SECRET;

const signupSchema = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  email: zod.string().email(),
  username: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(body);
  if (!success) {
    return res.json({
      message: "Invalid inputs",
    });
  }
  const user = await User.findOne({ username: body.username });
  console.log(user);
  if (user) {
    return res.json({
      message: "username already exists",
    });
  }
  const email = await User.findOne({ email: body.email });
  if (email) {
    return res.json({
      message: "Email is already in use. Login instead",
    });
  }

  const newUser = await User.create(body);
  await Account.create({
    userId: newUser._id,
    balance: 0,
  })
  const token = await jwt.sign({ userId: newUser._id }, JWT_SECRET);
  res.json({
    message: "user created!",
    token: token,
    name: newUser.firstName,
  });
});

const signinSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});
router.post("/signin", async (req, res) => {
  const body = req.body;
  const { success } = signinSchema.safeParse(body);
  if (!success) {
    return res.json({
      message: "invalid inputs",
    });
  }
  let foundUser = await User.findOne({ email: body.email });
  if (!foundUser) {
    return res.json({
      message: "wrong email id",
    });
  }
  if (foundUser.password != body.password) {
    return res.json({
      message: "wrong password, try again!",
    });
  }

  let token = jwt.sign({ userId: foundUser._id }, JWT_SECRET);
  res.json({
    message: "successfully logged in",
    token: token,
    name : foundUser.firstName
  });
});

const updateSchema = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
});

router.put("/update", authMiddleware, async (req, res) => {
  const body = req.body;
  const { success } = updateSchema.safeParse(body);
  if (!success) {
    return res.json({
      message: "invalid inputs",
    });
  }
  await User.updateOne({ _id: req.userId }, req.body);
  const updatedUser = await User.findOne({ _id: req.userId });
  res.json({
    message: "updated successfully!",
    name : updatedUser.firstName
  });
});

// /bulk?filter=your_shit_here
router.get("/bulk", authMiddleware, async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
          $options : 'i'
        },
      },
      {
        lastName: {
          $regex: filter,  // to handle filter to act upon letters within the name instead of just begn. and end
          $options : 'i'  // for case insensitivity
        },
      },
    ],
  });


  return res.json({
    user: users.map((user) => {
      return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id : user._id
      };
    }),
  });
});


router.get('/loggedUser', authMiddleware, async(req,res)=>{
  const userId = req.userId;
  const user = await User.findOne({_id : userId});
  res.json({
    name : user.firstName
  })
})

module.exports = router;
