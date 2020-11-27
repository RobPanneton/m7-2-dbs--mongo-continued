const router = require("express").Router();
const { MongoClient } = require("mongodb");
const assert = require("assert");
const {
  getSeats,
  bookSeat,
  addBooking,
  cancelSeat,
  updateBooking,
  deleteBooking,
} = require("./handlers");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

// Code that is generating the seats.
// ----------------------------------
const seats = {};

//////// HELPERS
const getRowName = (rowIndex) => {
  return String.fromCharCode(65 + rowIndex);
};

const randomlyBookSeats = (num) => {
  const bookedSeats = {};

  while (num > 0) {
    const row = Math.floor(Math.random() * NUM_OF_ROWS);
    const seat = Math.floor(Math.random() * SEATS_PER_ROW);

    const seatId = `${getRowName(row)}-${seat + 1}`;

    bookedSeats[seatId] = true;

    num--;
  }

  return bookedSeats;
};

router.post(`/seats/populateSeatDBData`, async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();

    const db = await client.db("Flight_1");

    for (let r = 0; r < row.length; r++) {
      for (let s = 1; s < 13; s++) {
        seats[`${row[r]}-${s}`] = {
          _id: `${row[r]}-${s}`,
          price: 225,
          isBooked: false,
        };
        result = await db
          .collection("Seats")
          .insertOne(seats[`${row[r]}-${s}`]);
        assert.equal(1, result.insertedCount);
      }
    }

    res.status(201).json({
      status: 201,
      message: "success, the database has been populated",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "failure",
    });
  }
  await client.close();
});

let state;

// GET SEATS, BOOK SEAT

router.get("/api/seat-availability", getSeats);

router.post("/api/book-seat", bookSeat);

router.post("/api/add-booking", addBooking);

router.post("/api/cancel-seat", cancelSeat);

router.post("/api/update-booking", updateBooking);

router.delete("/api/delete-booking", deleteBooking);

module.exports = router;
