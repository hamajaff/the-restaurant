import { useContext, useState } from "react";
import { BookingDispatchContext } from "../contexts/BookingDispatchContext";
import { ActionTypeCurrentBooking } from "../reducers/CurrentBookingReducer";
import { CurrentBookingContext } from "../contexts/BookingsContext";
import { Button } from "./styled/Buttons";
import { GuestBox, GuestBoxWrapper, GuestWrapper } from "./styled/GuestBox";
import { ContactContainer } from "./styled/ContactContainer";
import { ImageContainer } from "./styled/Containers";
import { GuestInfoSpan } from "./styled/Texts";

interface IChooseGuests {
  goToCalendar: () => void;
}

interface IGuest {
  guests: number;
  selected: boolean;
}

export const BookGuests = ({ goToCalendar }: IChooseGuests) => {
  const [numberOfGuests, setNumberOfGuests] = useState<IGuest[]>(
    Array.from({ length: 8 }, (_, i) => ({ guests: i + 1, selected: false }))
  );
  const currentBooking = useContext(CurrentBookingContext);
  const dispatch = useContext(BookingDispatchContext);
  const [html, setHtml] = useState<JSX.Element | null>(null);

  const calculateTables = (guests: number) => Math.round(guests / 6 + 0.4);

  const handleClick = (guests: number) => {
    const updatedGuests = numberOfGuests.map((guest) => ({
      ...guest,
      selected: guest.guests === guests,
    }));
    setNumberOfGuests(updatedGuests);

    const tables = calculateTables(guests);
    dispatch({
      type: ActionTypeCurrentBooking.SET_NUMBER_OF_GUESTS,
      payload: guests,
    });
    dispatch({
      type: ActionTypeCurrentBooking.SET_BOOKED_TABLES,
      payload: tables,
    });
  };

  const checkNumberOfGuests = () => {
    if (!currentBooking.numberOfGuests) {
      setHtml(<div>Du måste välja antalet gäster innan du går vidare</div>);
    } else {
      setHtml(null);
      goToCalendar();
    }
  };

  return (
    <ContactContainer>
      <ImageContainer img={"src/assets/plate-figgs.jpg"}>
        <img />
      </ImageContainer>
      <GuestWrapper>
        <p>Välj antalet gäster</p>
        <GuestBoxWrapper>
          {numberOfGuests.map((guest) => (
            <GuestBox
              selected={guest.selected}
              key={guest.guests}
              onClick={() => handleClick(guest.guests)}
            >
              {guest.guests}
            </GuestBox>
          ))}
        </GuestBoxWrapper>
        <GuestInfoSpan>
          Vid sällskap fler än 8, vänligen kontakta oss så hjälper vi dig!
        </GuestInfoSpan>
        <Button type="button" onClick={checkNumberOfGuests}>
          Nästa
        </Button>
        {html}
      </GuestWrapper>
    </ContactContainer>
  );
};
