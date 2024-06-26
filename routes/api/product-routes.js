const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const prodData = await Product.findAll({
      include: [
      {model: Category, attributes: ['id', 'category_name']}, 
      {model: Tag, attributes: ['id', 'tag_name']}
    ]});
    if (!prodData){
      res.status(404).json({message: 'No products stored!'});
      return;
    }
    res.json(prodData);
  } catch (error) {
    res.status(500).json(error);
  }
  // find all products
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const prodData = await Product.findByPk(req.params.id, 
      {include: [
        {model: Category, attributes: ['id', 'category_name']}, 
        {model: Tag, attributes: ['id', 'tag_name']}]
      });
    if(!prodData){
      res.status(404).json({message: 'No Product stores with that ID!'});
      return;
    }
    res.json(prodData);
  } catch (error) {
    res.status(500).json(err);
  }
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    try {
      const product = await Product.create(req.body);
      if(!req.body.tag_id){
        res.status(200).json(product)
      }

    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    } 
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
});

module.exports = router;
