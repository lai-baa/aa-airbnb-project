const express = require('express');
const router = express.Router();
const { Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const { user } = req;

  try {
    // Find the review image by id
    const reviewImage = await ReviewImage.findByPk(imageId, {
      include: [{ model: Review }]
    });

    // If review image is not found, return a 404 error
    if (!reviewImage) {
      const err = new Error("Review Image couldn't be found");
      err.status = 404;
      err.errors = { message: "Review Image couldn't be found" };
      return next(err);
    }

    // Check if the current user is the owner of the review
    if (reviewImage.Review.userId !== user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      err.errors = { message: "You do not have permission to delete this review image" };
      return next(err);
    }

    // Delete the review image
    await reviewImage.destroy();

    // Return success message
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;