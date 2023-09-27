const Booking = require("../models/Booking");
var nodemailer = require("nodemailer");

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find();
    return res.json(bookings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const newBooking = await Booking.create(req.body);
    const cancelLink = `http://localhost:5173/cancel/${newBooking.bookingId}`;
    let sittingTime = "";

    if (newBooking.sitting == 1) {
      sittingTime = "18:00-20:00";
    }
    if (newBooking.sitting == 2) {
      sittingTime = "20:00-22:00";
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "restaurang.bakgarden@gmail.com",
        pass: "wvyppbywtqyssext", //autogenererat lösen för tredjepartsapplikationer för inloggning till vår gmail
      },
    });

    let date = newBooking.date;
    const dateSplitted = date.split("");
    dateSplitted.splice(4, 0, "-");
    dateSplitted.splice(7, 0, "-");
    date = dateSplitted.join("");

    const mailText = `Tack för din bokning! Här nedan ser du dina bokningsdetaljer.
    Datum: ${date}
    Tid: ${sittingTime}
    Antal gäster: ${newBooking.numberOfGuests}
    Namn: ${newBooking.user.name}
    Mejladress: ${newBooking.user.email}
    Telefonnummer: ${newBooking.user.phonenumber}
    Bokningsnummer: ${newBooking.bookingId}

    Om något ser fel ut, vänligen kontakta oss. 
    Vid avbokning, klicka på länken ${cancelLink} `;

    const mailOptions = {
      from: "restaurang.bakgarden@hotmail.com",
      to: newBooking.user.email,
      subject: "Bokningsbekräftelse",
      text: mailText,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mejlet skickat: ", info.response);
      }
    });

    return res.json(newBooking);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId;
    const bookingToDelete = await Booking.findOne({ bookingId: bookingId });
    if (!bookingToDelete) return res.status(404).json();

    let sittingTime = "";

    if (bookingToDelete.sitting == 1) {
      sittingTime = "18:00-20:00";
    }
    if (bookingToDelete.sitting == 2) {
      sittingTime = "20:00-22:00";
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "restaurang.bakgarden@gmail.com",
        pass: "wvyppbywtqyssext", //autogenererat lösen för tredjepartsapplikationer för inloggning till vår gmail
      },
    });

    let date = bookingToDelete.date;
    const dateSplitted = date.split("");
    dateSplitted.splice(4, 0, "-");
    dateSplitted.splice(7, 0, "-");
    date = dateSplitted.join("");

    const mailText = `Avbokningsbekräftelse. Du har nu avbokat din bokning den ${date} klockan ${sittingTime}. 

    Bokningsuppgifter: 
    Antal gäster: ${bookingToDelete.numberOfGuests}
    Namn: ${bookingToDelete.user.name}
    Mejladress: ${bookingToDelete.user.email}
    Telefonnummer: ${bookingToDelete.user.phonenumber}
    Bokningsnummer: ${bookingToDelete.bookingId}

    Om du inte önskat avboka din bokning, vänligen kontakta oss snarast!
    Vid andra frågor, välkommen att kontakta oss på mejl eller telefon.
    
    Vänliga hälsningar,
    
    personalen på Restaurang Bakgården
    `;

    const mailOptions = {
      from: "restaurang.bakgarden@hotmail.com",
      to: bookingToDelete.user.email,
      subject: "Avbokningsbekräftelse",
      text: mailText,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mejlet skickat: ", info.response);
      }
    });

    await bookingToDelete.deleteOne();
    return res.sendStatus(204);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

exports.getBookingsByDate = async (req, res, next) => {
  try {
    const bookingDate = req.params.bookingDate;
    const bookingsOnSelectedDate = await Booking.find({ date: bookingDate });
    return res.json(bookingsOnSelectedDate);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateBookingById = async (req, res, next) => {
  try {
    const givenId = req.params.bookingId;
    const bookingToUpdate = await Booking.find({ bookingId: givenId }); //behövs ej egentligen?
    const updatedBooking = req.body;

    const newUpdatedBooking = await Booking.findOneAndReplace(
      { bookingId: { $eq: givenId } },
      updatedBooking,
      { returnNewDocument: true }
    );

    const cancelLink = `http://localhost:5173/cancel/${updatedBooking.bookingId}`;
    let sittingTime = "";

    if (updatedBooking.sitting == 1) {
      sittingTime = "18:00-20:00";
    }
    if (updatedBooking.sitting == 2) {
      sittingTime = "20:00-22:00";
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "restaurang.bakgarden@gmail.com",
        pass: "wvyppbywtqyssext", //autogenererat lösen för tredjepartsapplikationer för inloggning till vår gmail
      },
    });

    let date = updatedBooking.date;
    const dateSplitted = date.split("");
    dateSplitted.splice(4, 0, "-");
    dateSplitted.splice(7, 0, "-");
    date = dateSplitted.join("");

    const mailText = `Vi har uppdaterat din bokning! Här nedan ser du dina nya bokningsdetaljer.
    Datum: ${date}
    Tid: ${sittingTime}
    Antal gäster: ${updatedBooking.numberOfGuests}
    Namn: ${updatedBooking.user.name}
    Mejladress: ${updatedBooking.user.email}
    Telefonnummer: ${updatedBooking.user.phonenumber}
    Bokningsnummer: ${updatedBooking.bookingId}

    Om något ser fel ut, vänligen kontakta oss!
    Vid avbokning, klicka på länken ${cancelLink} `;

    const mailOptions = {
      from: "restaurang.bakgarden@hotmail.com",
      to: updatedBooking.user.email,
      subject: "Uppdaterad bokning",
      text: mailText,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mejlet skickat: ", info.response);
      }
    });

    return res.json(newUpdatedBooking);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getBookingById = async () => {
  try {
    const givenId = req.params.bookingId;
    const bookingToDelete = await Booking.find({ bookingId: givenId });
    if (!bookingToDelete) {
      return res.status(404).json();
    } else {
      return res.json(bookingToDelete);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: error.message });
  }
};
