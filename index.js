const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIP_KEY);

// Middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "usd",
            unit_amount: item.price * 100,
            product_data: {
              name: item.title,
            },
          },
          quantity: item.quantity,
        };
      }),
      success_url: "https://payment-frontend-olive.vercel.app/success",
      cancel_url: "https://payment-frontend-olive.vercel.app/cancel",
    });
    res.json({ session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
