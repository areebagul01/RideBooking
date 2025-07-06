const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

router.post('/', rideController.createRide);
router.get('/active/:userId', rideController.getActiveRide);
router.get('/history/:userId', rideController.getRideHistory);
router.get('/available', rideController.getAvailableRides);
router.patch('/:rideId/accept', rideController.acceptRide);
router.patch('/:rideId/status', rideController.updateRideStatus);

module.exports = router;