"use strict";

const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = await client.db("Flight_1");

    const result = await db.collection("Seats").find().toArray();
    const resultObject = {};

    result.forEach((seat) => {
      resultObject[seat._id] = seat;
    });

    return res.json({
      seats: resultObject,
      numOfRows: 8,
      seatsPerRow: 12,
    });
  } catch (err) {
    res.status(404).json({ status: 404, data: "Not Found" });
  }

  client.close();
};

const bookSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const _id = req.body.seatId;
  const query = { _id };

  console.log({ query: query });
  try {
    await client.connect();
    const db = await client.db("Flight_1");

    const createSeatUpdate = { _id: _id, price: 255, isBooked: true };

    const seatUpdate = { $set: { ...createSeatUpdate } };

    const results = await db.collection("Seats").updateOne(query, seatUpdate);

    assert.equal(1, results.matchedCount);
    assert.equal(1, results.modifiedCount);

    res.status(200).json({
      status: 200,
      _id,
      ...req.body,
      message: `flight ${_id} has been booked!`,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "failure",
    });
  }

  client.close();
};

const addBooking = async (req, res) => {
  console.log("any");
  const client = await MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = await client.db("Flight_1");

    const result = await db.collection("Bookings").insertOne(req.body);

    assert.equal(1, result.insertedCount);

    res.status(201).json({
      status: 201,
      message: "the following data entry has been made in the database",
      data: req.body,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      data: req.body,
      message: err.message,
    });
  }

  client.close();
};

const cancelSeat = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const _id = req.body.seatId;
  const query = { _id };

  try {
    await client.connect();
    const db = await client.db("Flight_1");

    const createSeatUpdate = { _id: _id, price: 255, isBooked: false };

    const seatUpdate = { $set: { ...createSeatUpdate } };

    const results = await db.collection("Seats").updateOne(query, seatUpdate);

    assert.equal(1, results.matchedCount);
    assert.equal(1, results.modifiedCount);

    res.status(200).json({
      status: 200,
      _id,
      ...req.body,
      message: `seat ${_id} has been cancelled and is now available agian!`,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "failure",
    });
  }

  client.close();
};

const updateBooking = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const { fullName, email, seatId } = req.body;
  const query = { seatId };
  console.log(req.body);
  console.log(query);

  const createBookingUpdate = { ...req.body, fullName: fullName, email: email };

  const bookingUpdate = { $set: { ...createBookingUpdate } };

  try {
    await client.connect();
    const db = await client.db("Flight_1");

    const results = await db
      .collection("Bookings")
      .updateOne(query, bookingUpdate);

    console.log(results);

    assert.equal(1, results.matchedCount);

    res.status(201).json({
      status: 201,
      message: "the following data entry has been made in the database",
      data: req.body,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      data: req.body,
      message: err.message,
    });
  }

  client.close();
};

const deleteBooking = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  const seatId = req.body.seatId;

  try {
    await client.connect();
    const db = await client.db("Flight_1");

    const results = await db.collection("Bookings").deleteOne({ seatId });

    assert.equal(1, results.deletedCount);

    res.status(204).json({
      status: 204,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }

  client.close();
};

module.exports = {
  getSeats,
  bookSeat,
  addBooking,
  cancelSeat,
  updateBooking,
  deleteBooking,
};
