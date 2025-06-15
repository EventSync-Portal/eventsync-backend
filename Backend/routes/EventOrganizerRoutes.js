const router = require("express").Router();
const eventOrginazerControl = require("../Controller/EventOrginazerController");

//Create routes for Event Organizer:
router.post('/makeEvent', eventOrginazerControl.createEvent);
router.post('/createTicket',eventOrginazerControl.createTicket);
router.post('/bookVenue',eventOrginazerControl.createVenue);
router.post('/notify', eventOrginazerControl.postNotification);


//Search routes for Event Organizer:
router.get('/searchByName/:name',eventOrginazerControl.searchEventByName);
router.get('/searchByType/:type', eventOrginazerControl.searchEventByType);


//Retrieve routes for Event Organizer:
router.get('/getOrginazerEvents/:organizer_id', eventOrginazerControl.getOrginazerEvents);
router.get('/getAllEvents',eventOrginazerControl.getAllEvents);


//Delete routes for Event Organizer:
router.delete('/deleteEvent/:eventID',eventOrginazerControl.deleteEvent);


//Update routes for Event Organizer:
router.put('/updateEventDetails/:eventID', eventOrginazerControl.updateEventDetails);

module.exports = router;
