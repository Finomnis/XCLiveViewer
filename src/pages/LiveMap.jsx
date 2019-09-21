import React from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

export class LiveMap extends React.Component {
  onMarkerClick = args => {
    console.log(args);
  };

  render() {
    const style = { width: "100%", height: "100%" };

    return (
      <Map google={this.props.google} zoom={14} style={style}>
        <Marker onClick={this.onMarkerClick} name={"Current location"} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GAPI_KEY
})(LiveMap);
