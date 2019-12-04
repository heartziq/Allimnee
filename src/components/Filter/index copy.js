import React from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Slider from "@material-ui/core/Slider";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import fetch from "isomorphic-fetch";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import Box from "@material-ui/core/Box";

import DropDownSelect from "./DropDownSelect";

const useStyles = makeStyles(theme => ({
  divider: {
    height: theme.spacing(2)
  },
  formContainer: { margin: 8 }
}));

const Filter = props => {
  const classes = useStyles();

  const [state, setState] = React.useState("");

  const handleChange = event => setState(event.target.value);


  const [gender, setGender] = React.useState("female");
  const [filter, setFilter] = React.useState({
    area: {},
    subject: {}
  });

  const getSubsAndArea = async () => {
    // get subject
    const subjectResponse = await fetch("/api/subject");
    const subject = await subjectResponse.json();

    // get area
    const areaResponse = await fetch("/api/area");
    const area = await areaResponse.json();

    setFilter({
      area,
      subject
    });
  };

  // equivalent to componentDidMount()
  React.useEffect(() => {
    getSubsAndArea();
  }, []);

  const handleRadioChange = event => {
    const value = event.target.value;
    setGender(value);
  };

  function valuetext(value) {
    return `${value}°C`;
  }
  return (
    <form className={classes.formContainer} noValidate autoComplete="off">
      <TextField
        id="standard-full-width"
        label="Name"
        placeholder="Search tutor..."
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true
        }}
        value={props.filter.tutorName}
        onChange={e => {
          props.dispatch({ type: "update", tutorName: e.target.value });
        }}
      />
      <div className={classes.divider} />
      {/* <DropDownSelect title={"Subject"} data={filter.subject} /> */}
      <Box width={1}>
        <InputLabel htmlFor="name-native-error">Level: {state}</InputLabel>
        <NativeSelect
          value={state}
          onChange={handleChange}
          name={'Level'}
          inputProps={{
            id: "name-native-error"
          }}
        >
          <option value="" />
          <option key={1} value={1}>
            {'Primary 1'}
          </option>
          <option key={2} value={2}>
            {'Primary 2'}
          </option>
          <option key={3} value={3}>
            {'Primary 3'}
          </option>
        </NativeSelect>
      </Box>
      <div className={classes.divider} />
      <DropDownSelect title={"Area"} data={filter.area} />
      {/* <Level /> */}
      <div className={classes.divider} />
      <FormControl component="fieldset">
        <FormLabel component="legend">Gender:</FormLabel>
        <RadioGroup
          aria-label="position"
          name="position"
          value={gender}
          onChange={handleRadioChange}
          row
        >
          <FormControlLabel
            value="male"
            control={<Radio color="primary" />}
            label="Male"
            labelPlacement="end"
          />
          <FormControlLabel
            value="female"
            control={<Radio color="primary" />}
            label="Female"
            labelPlacement="end"
          />
        </RadioGroup>
        <FormLabel component="legend">Ratings:</FormLabel>
        <Slider
          defaultValue={props.filter.star}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={5}
          onChange={(e, value) =>
            props.dispatch({
              type: "changeStar",
              star: parseInt(value, 10)
            })
          }
        />
      </FormControl>
    </form>
  );
};

const mapStateToProps = state => ({
  filter: state.filter
});

export default connect(mapStateToProps)(Filter);
