const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();





router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
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
  const { error } = validate(req.body); 
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

module.exports = router;