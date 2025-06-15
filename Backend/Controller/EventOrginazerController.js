const db = require("../Config_database/db");

//1. Event Creation APIs:
//Controller to create an event
const createEvent = async (req, res) => {
  try {
    const {
      name,
      type,
      dateOfEvent,
      organizer_id,
      status,
      starttime,
      endtime,
      description,
    } = req.body;

    const query = `INSERT INTO event (name, type,dateOfEvent ,organizer_id, status, starttime, endtime,description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, type, dateOfEvent,organizer_id, status, starttime,endtime, description ];

    await db.execute(query, values);

    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating event' });
  }
};


//Controller to create the ticket
const createTicket = async (req, res) => {
  try {
    const { name, ticketCode, creatDate, eventID } = req.body;

    const query = `INSERT INTO ticket (name, ticketCode, creatDate, eventID) VALUES (?, ?, ?, ?)`;
    const values = [name, ticketCode, creatDate, eventID];

    await db.execute(query, values);

    res.status(201).json({ message: `Ticket for event number: ${eventID} created successfully ` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating ticket' });
  }
};



//Controller to create the venue 
const createVenue = async (req, res) => {
  try {
    const {  name, locatName, capacity ,coordinates , eventID  } = req.body;

    const query = `INSERT INTO venue (name, locatName, capacity ,coordinates , eventID) VALUES (?, ?, ?, ?,?)`;
    const values = [name, locatName, capacity ,coordinates , eventID];

    await db.execute(query, values);

    res.status(201).json({ message: 'Venue created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating venue' });
  }
};



const updateEventDetails = async (req, res) => {
  try {
    const { eventID } = req.params;
    const allowedFields = ["name", "type", "dateOfEvent", "organizer_id", "status", "starttime", "endtime", "description"];
    const updates = [];
    const values = [];

    // Dynamically build query based on provided fields
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No valid update fields provided" });
    }

    values.push(eventID); // Append eventID at the end for WHERE clause

    const query = `UPDATE event SET ${updates.join(", ")} WHERE eventID = ?`;

    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating event" });
  }
};


//Controller to get all events
const getOrginazerEvents = async (req, res) => {
  try {
    const { organizer_id } = req.params;

    const query = `SELECT * FROM event WHERE organizer_id = ?`;
    const [events] = await db.execute(query, [organizer_id]);

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving events' });
  }
};

// Controller to get all events
const getAllEvents = async (req, res) => {
  try {
    const query = `SELECT * FROM event`;
    const [events] = await db.execute(query);

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving events' });
  }
};



//Controller to search event by name
const searchEventByName = async (req, res) => {
  try {
    const { name } = req.params;

    const query = `SELECT * FROM event WHERE name LIKE ?`;
    const [events] = await db.execute(query, [`%${name}%`]);

    if (events.length === 0) {
      return res.status(404).json({ message: 'No events found' });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching for events' });
  }
};


//Controller to search event by type
const searchEventByType = async (req, res) =>{
    try {
        const { type } = req.params;
    
        const query = `SELECT * FROM event WHERE type = ?`;
        const [events] = await db.execute(query, [type]);
    
        if (events.length === 0) {
        return res.status(404).json({ message: 'No events found' });
        }
    
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching for events' });
    }
}


//Controller delete event

const deleteEvent = async (req,res) => {

  try{

    const { eventID } = req.params;

    const query = `DELETE FROM event WHERE eventID = ?`;
    const values = [eventID ];

    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });


  }catch(error){
    console.error(error);
    res.status(500).json({ message: 'Error deleting event' });
  }

}


//Controller to send notification
const postNotification = async (req, res) => {
  try {
    // Placeholder for sending notification logic
    // For example, integrate with email or SMS service here

    res.status(200).json({ message: 'Notification sent successfully (placeholder)' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending notification' });
  }
};



//Search event notification by event name





//Controller get all event notifications 






module.exports = {
createEvent,
createTicket,
createVenue,
postNotification,
updateEventDetails,
getOrginazerEvents, 
getAllEvents,
searchEventByName,
searchEventByType,
deleteEvent

};
