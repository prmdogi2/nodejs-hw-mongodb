import Joi from 'joi';

export const createContactSchema = Joi.object({
  // Ödev kuralı: min 3, max 20
  name: Joi.string().min(3).max(20).required(),
  
  phoneNumber: Joi.string()
    .pattern(/^[\d\s()+-]+$/)
    .min(3) // Ödev kuralına göre güncellendi
    .max(20)
    .required()
    .messages({
      'string.pattern.base': 'Telefon numarası sadece rakam ve +, -, (, ), boşluk içerebilir.',
    }),

  // Email için de min 3, max 20 kuralını ekleyelim (ödevde string alanlar dendiği için)
  email: Joi.string().email().min(3).max(20),
  
  isFavourite: Joi.boolean(),
  
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string()
    .pattern(/^[\d\s()+-]+$/)
    .min(3)
    .max(20),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});