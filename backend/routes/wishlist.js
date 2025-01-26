const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist');

router.post('/', wishlistController.addToWishlist);


router.get("/", wishlistController.getWishlist);
router.delete("/", wishlistController.removeFromWishlist);
module.exports = router;
