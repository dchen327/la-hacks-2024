import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { getDistance } from "geolib";

export const EventMapModal = ({ event, onClose }) => {
  const claremont = { latitude: 34.11228, longitude: -117.71489 };
  let distance = getDistance(claremont, event.location);
  // convert distance (in meters) to miles, with 1 decimal point
  distance = Math.round((distance / 1609.344) * 10) / 10;

  return (
    <div className="modal is-active justify-end mb-14">
      <div className="modal-background bg-transparent" onClick={onClose}></div>
      <div className="modal-content">
        <div className="card is-shadowless">
          <div className="card-content px-4 py-2">
            <div className="media mb-2 flex items-center">
              <div className="media-content">
                <p className="title is-4 mb-2">{event.title}</p>
                <div className="flex flex-row mb-0">
                  <p className="is-6">{event.leader}</p>
                  <p className="is-6 font-thin">•</p>
                  <p className="is-6">Wed</p>
                </div>
              </div>
              <div className="bg-gray-100 rounded">
                <p className="p-1 text-lg text-black is-4">{distance}mi</p>
              </div>
            </div>
            <div className="content">{event.description}</div>
            <div className="suggested items">{"Suggested items to bring:" + event.items}</div>
            <div className="buttons are-small mt-2">
              <button className="button is-info">Register</button>
              <button className="button is-light">
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button className="button is-light">
                <FontAwesomeIcon icon={faShareNodes} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
};
