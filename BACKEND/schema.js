import Joi from "joi";

const userSchema = Joi.object({
    email: Joi.string().required().email(),
    username: Joi.string().required(),
    password: Joi.string().required().min(6),
});

const detailsSchema = Joi.object({
  Country: Joi.string().allow('').trim().default(""),
  Bio: Joi.string().allow('').trim().default(""),
  Nickname: Joi.string().allow('').trim().max(20).default(""),
  Dp: Joi.object({
    url: Joi.string().uri().default("https://res.cloudinary.com/dxhyznlyz/image/upload/v1744097488/default-avatar_tcbmo5.jpg"),
    public_id: Joi.string().default("default-avatar_tcbmo5"),
  }).default(),
  Owner: Joi.string().required(), 
});

const friendSchema = Joi.object({
    Friends: Joi.array().items(Joi.string()),
    Blocked: Joi.array().items(Joi.string()),
    BlockedBy: Joi.array().items(Joi.string()),
    Wishlist: Joi.array().items(Joi.string()), 
    Requests: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),
        requestedAt: Joi.date().default(Date.now),
      })
    ), 
    PopUp: Joi.object({
      arr: Joi.array().items(Joi.string()),
    }),
    Owner: Joi.string().required(),
  });

  const chatSchema = Joi.object({
    Owner: Joi.string().required(),
    chatWith: Joi.string().required(),
    messages: Joi.array().items(Joi.object({
        sender: Joi.string().required(),
        content: Joi.string().required(),
        isRead: Joi.boolean().default(false),
        timestamp: Joi.date().default(() => new Date()),
    })),
  });

  const updateMessageSchema = Joi.object({
    content: Joi.string().required(),
  }); 

  export { userSchema, detailsSchema, friendSchema, chatSchema, updateMessageSchema };