import { useEffect, useReducer, useState } from "react";
import { BookGuests } from "./BookGuests";
import { BookingForm } from "./BookingForm";
import { CalendarPage } from "./CalendarPage";
import { BookingDispatchContext } from "../contexts/BookingDispatchContext";
import { CurrentBookingContext } from "../contexts/BookingsContext";
import { CurrentBookingReducer } from "../reducers/CurrentBookingReducer";
import { defaultBooking } from "../models/Booking";
import { GdprInfo } from "./GdprInfo";

export const BookingComponent = () => {
  const [step, setStep] = useState<"guests" | "calendar" | "form" | "gdpr">(
    "guests"
  );
  const [currentBooking, dispatch] = useReducer(
    CurrentBookingReducer,
    defaultBooking
  );

  useEffect(() => {
    console.log("booking updated:", currentBooking);
  }, [currentBooking]);

  const renderStep = () => {
    switch (step) {
      case "guests":
        return <BookGuests goToCalendar={() => setStep("calendar")} />;
      case "calendar":
        return (
          <CalendarPage
            goToGuests={() => setStep("guests")}
            goToForm={() => setStep("form")}
          />
        );
      case "form":
        return (
          <BookingForm
            goToCalendar={() => setStep("calendar")}
            showGdprPage={() => setStep("gdpr")}
          />
        );
      case "gdpr":
        return <GdprInfo goToForm={() => setStep("form")} />;
      default:
        return null;
    }
  };

  return (
    <CurrentBookingContext.Provider value={currentBooking}>
      <BookingDispatchContext.Provider value={dispatch}>
        {renderStep()}
      </BookingDispatchContext.Provider>
    </CurrentBookingContext.Provider>
  );
};
