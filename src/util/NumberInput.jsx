import React, { Component } from "react";
import { TextField, InputAdornment } from "@material-ui/core";

export default class NumberInput extends Component {
  state = {
    internalUpdate: false,
    value: null
  };

  static getDerivedStateFromProps(props, state) {
    const resultState = { ...state, internalUpdate: false };

    // Overwrite with external value if we got an update from the parent element
    if (!state.internalUpdate) {
      resultState.value = props.value;
    }

    return resultState;
  }

  render() {
    console.log(localStorage);
    return (
      <TextField
        onChange={event => {
          const value = event.target.value;
          // If the value is too small, send the smallest possible value to the parent,
          // but keep the incorrect value in the text field.
          // If the value is too large, send the largest possible value to the parent,
          // and also set the text field to the largest possible value.
          // Otherwise, just update.

          if (value < this.props.min) {
            // If those two messages get delivered out of order, this entire trick will stop working.
            // But I think setting states will never be done in an incorrect order, that would really break things.
            this.props.onChange(this.props.min);
            this.setState({
              ...this.state,
              internalUpdate: true,
              value: value
            });
          } else if (value > this.props.max) {
            this.props.onChange(this.props.max);
          } else {
            this.props.onChange(value);
          }
        }}
        variant="outlined"
        disabled={this.props.disabled}
        margin="dense"
        hiddenLabel
        type="number"
        value={this.state.value}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">{this.props.unit}</InputAdornment>
          )
        }}
        inputProps={{
          min: this.props.min,
          max: this.props.max
        }}
      />
    );
  }
}
