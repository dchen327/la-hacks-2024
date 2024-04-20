import { useRef, useEffect } from "react";
const GoogleMapSearchBox = () => {
  const autoCompleteRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        componentRestrictions: { country: "us" },
      }
    );
  }, []);
  return (
    <div>
      <label>enter address :</label>
      <input ref={inputRef} />
    </div>
  );
};
export default GoogleMapSearchBox;
