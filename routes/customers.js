const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const router = express.Router();


const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  isGold: {
      type: Boolean,
      default: false
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
}));


router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({ 
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  }); 
  customer = await customer.save();
  res.send(customer);
});

router.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  try{
    const customer = await Customer.findByIdAndUpdate(req.params.id,
      { 
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
      }, { new: true });
    res.send(customer);
  }
  catch(err){
    return res.status(404).send('The customer with the given ID was not found.');
  }

  //this is the promise-based approach for reference, we are using await/async approach instead though
  // customer.findByIdAndUpdate(req.params.id, { name: req.body.name}, { new: true})
  //   .then( (customer) => res.send(customer))
  //   .catch( (err) => res.status(404).send('The customer with the given ID was not found.'));
    

  
});

router.delete('/:id', async (req, res) => {
  try{
    const customer = await Customer.findByIdAndRemove(req.params.id);
    res.send(customer);
  }
  catch(err){
    return res.status(404).send('The customer with the given ID was not found.');
  }

});

router.get('/:id', async (req, res) => {
  try{
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  }
  catch(err){
    return res.status(404).send('The customer with the given ID was not found.');
  }
});

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean()

  };

  return Joi.validate(customer, schema);
}

module.exports = router;