import React from "react";
import { Map as GMap, Marker, GoogleApiWrapper } from "google-maps-react";

export class Map extends React.Component {
  render() {
    return (
      <GMap google={this.props.google} zoom={14}>
        <Marker onClick={this.onMarkerClick} name={"Current location"} />
      </GMap>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GAPI_KEY
})(Map);
