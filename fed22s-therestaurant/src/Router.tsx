import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Contact } from "./components/Contact";
import { Confirmation } from "./components/Confirmation";
import { BookingComponent } from "./components/BookingComponent";
import { CancelBooking } from "./components/CancelBooking";
import { CancelConfirmation } from "./components/CancelConfirmation";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/cancel/:bookingId",
        element: <CancelBooking></CancelBooking>,
      },
      {
        path: "/cancel/confirmation",
        element: <CancelConfirmation></CancelConfirmation>,
      },

      {
        path: "/booking",
        element: <BookingComponent></BookingComponent>,
      },
      {
        path: "/contact",
        element: <Contact></Contact>,
      },
      {
        path: "/confirmation",
        element: <Confirmation></Confirmation>,
      },
    ],
  },
]);
