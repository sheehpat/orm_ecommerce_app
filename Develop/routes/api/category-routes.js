const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
   const catData = await Category.findAll();
   if(!catData){
    res.status(404).json({ message: 'No categories stored!' });
      return;
   }
   res.json(catData);
  } catch (error) {
    res.status(500).json(err);
  }
  // find all categories
  // be sure to include its associated Products
});

router.get('/:id', async (req, res) => {
  try {
    const catData = await Category.findByPk(req.params.id);
    if(!catData){
      res.status(404).json({ message: 'No categories stored!' });
        return;
     }
  } catch (error) {
    res.status(500).json(err);
  }
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', async (req, res) => {
  // create a new category
  try {
   const catData = await Category.create(req.body);
   res.status(200).json(catData);
  } catch (error) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const catData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
      individualHooks: true
    });
    if (!catData[0]) {
      res.status(404).json({ message: 'No user with this id!' });
      return;
    }
    res.status(200).json(catData);
  } catch (error) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const catData = await Category.destroy({
      where: {
        id: req.params.id,
      },
     })
     
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = router;
