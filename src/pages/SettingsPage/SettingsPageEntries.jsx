import React from "react";
import { getSetting } from "../../common/PersistentState/Settings";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch
} from "@material-ui/core";
import NumberInput from "../../util/NumberInput";
import { pure } from "recompose";

export const BooleanSetting = pure(props => {
  const [settingValue, setSettingValue] = getSetting(props.setting).use();
  const flipSetting = () => setSettingValue(!settingValue);

  return (
    <ListItem button onClick={flipSetting}>
      <ListItemText
        primary={props.primaryText}
        secondary={props.secondaryText}
      />
      <ListItemSecondaryAction>
        <Switch edge="end" onChange={flipSetting} checked={settingValue} />
      </ListItemSecondaryAction>
    </ListItem>
  );
});

export const NumberSetting = pure(props => {
  const [settingValue, setSettingValue] = getSetting(props.setting).use();

  return (
    <ListItem disabled={props.disabled}>
      <ListItemText
        primary={props.primaryText}
        secondary={props.secondaryText}
      />
      <ListItemSecondaryAction>
        <NumberInput
          value={settingValue}
          onChange={setSettingValue}
          disabled={props.disabled}
          unit={props.unit}
          min={props.min}
          max={props.max}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
});
