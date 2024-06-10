const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({include: [{ model: Product}] });
    if(!tagData){
     res.status(404).json({ message: 'No tags stored!' });
       return;
    }
    res.json(tagData);
   } catch (error) {
     res.status(500).json(err);
   }
  // find all tags
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {include: [{ model: Product }] });
    if(!tagData){
     res.status(404).json({ message: 'No tags stored!' });
       return;
    }
    res.json(tagData);
   } catch (error) {
     res.status(500).json(err);
   }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
   res.status(200).json(tagData);
   } catch (error) {
     res.status(500).json(err);
   }
  // create a new tag
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
      individualHooks: true
    });
    if (!tagData[0]) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (error) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
     })
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = router;