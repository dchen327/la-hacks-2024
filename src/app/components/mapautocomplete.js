import { useRef, useEffect } from "react";
const GoogleMapSearchBox = () => {
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {
    componentRestrictions: { country: "us" },
    fields: ["address_components", "geometry", "icon", "name"],
    types: ["establishment"],
  };
  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
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
