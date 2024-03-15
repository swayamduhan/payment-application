const { Router } = require("express");
const { authMiddleware } = require("../middlewares");
const { Account, User } = require("../database/db");
const zod = require("zod");
const mongoose = require("mongoose");
const router = Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const foundAccount = await Account.findOne({ userId: userId });
  res.json({
    balance: foundAccount.balance / 100,
  });
});

const transferSchema = zod.object({
  amount: zod.number().positive(),
  to: zod.string(),
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const { success } = transferSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: "Invalid Inputs!",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  const { amount, to } = req.body;
  const fromAccount = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!fromAccount || fromAccount.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "You don't have enough balance, check dashboard to see balance!",
    });
  }

  const toAccount = await Account.findOne({ userId: to });
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Couldn't find recipient's account!",
    });
  }

  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);

  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  await session.commitTransaction();
  res.status(200).json({
    message: "transaction completed",
  });
});

router.put("/topup", authMiddleware, async (req, res) => {
  const { amount } = req.body;
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: amount } }
  );
  res.status(200).json({
    message: "successfully topped up!",
  });
});

module.exports = router;
