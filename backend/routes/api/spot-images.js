const express = require('express');
const router = express.Router();
const { Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const { imageId } = req.params;
  const { user } = req;

  try {
    // Find the spot image by id
    const spotImage = await SpotImage.findByPk(imageId, {
      include: [{ model: Spot }]
    });

    // If spot image is not found, return a 404 error
    if (!spotImage) {
      const err = new Error("Spot Image couldn't be found");
      err.status = 404;
      err.errors = { message: "Spot Image couldn't be found" };
      return next(err);
    }

    // Check if the current user is the owner of the spot
    if (spotImage.Spot.ownerId !== user.id) {
      const err = new Error("Forbidden");
      err.status = 403;
      err.errors = { message: "You do not have permission to delete this spot image" };
      return next(err);
    }

    // Delete the spot image
    await spotImage.destroy();

    // Return success message
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;