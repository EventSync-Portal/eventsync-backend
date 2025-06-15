// AdminController.js
const db = require("../Config_database/db");

// Controller to get all events
const getAllEvents = async (req, res) => {
  try {
    // Execute the query to retrieve all events
    const [events] = await db.execute('SELECT * FROM event'); 
    
    // If events are found, return them as JSON
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving events from database' });
  }
};


// Controller to get event counts by status
const getEventCounts = async (req, res) => {
  try {
    // Query to count events for each status
    const [approvedCount] = await db.execute('SELECT COUNT(*) AS count FROM event WHERE Status = "Approved"');
    const [declinedCount] = await db.execute('SELECT COUNT(*) AS count FROM event WHERE Status = "Declined"');
    const [pendingCount] = await db.execute('SELECT COUNT(*) AS count FROM event WHERE Status = "Pending"');
    
    // Query to get the total number of events
    const [totalCount] = await db.execute('SELECT COUNT(*) AS count FROM event');
    
    // Prepare the response with counts
    const result = {
      totalEvents: totalCount[0].count,
      approvedEvents: approvedCount[0].count,
      declinedEvents: declinedCount[0].count,
      pendingEvents: pendingCount[0].count
    };
    
    res.status(200).json(result); // Send back the counts
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting events' });
  }
};

// You can add more methods here if needed for other admin functionalities, like creating, updating, or deleting events.

module.exports = {
  getAllEvents,
  getEventCounts
};
