import { createStore, combineReducers } from "redux";
import { v4 as uuidv4 } from "uuid";

/* DEFINE DEFAULT STATE */

// tutor list...
const tutorDefaultState = [];

// filter tutor...
const filter = {
  tutorName: "",
  star: 3
};

// class list...
const classDefaultState = {
  error: false,
  hasMore: true,
  isLoading: false,
  skip: 0,
  users: []
};

// filter classes...
const filterClass = {
  isBefore: false,
  time: "07:30",
  subject: [],
  day: "",
  level: 0
};

// hasFetch; determine if server has alrdy pre-fetch
const hasFetch = false;
const hasFetchReducer = (state = hasFetch, action) => {
  switch (action.type) {
    case "update":
      return !state;
    default:
      return state;
  }
};
// class reducer
const classReducer = (state = classDefaultState, { type, initialData }) => {
  switch (type) {
    case "updateClassList":
      return { ...state, users: initialData };
    case "updateWholeClassObj":
      return { ...state, skip: state.skip + 4, users: initialData };
    case "mergeNewUsers":
      console.log('store > redux > mergeNewusers', initialData)
      return { ...state, hasMore: state.users.length < 100, isLoading: false, skip: state.skip + 4, users: initialData }
    case "updateError":
      return { ...state, isLoading: false, error: initialData }

    default:
      return state;
  }
};

const filterClassReducer = (state = filterClass, action) => {
  switch (action.type) {
    case "updateTime":
      return { ...state, time: action.time };
    case "updateBeforeOrAfter":
      return { ...state, isBefore: !state.isBefore };
    case "updateFilterSubject":
      return { ...state, subject: action.subject };
    case "updateFilterDay":
      return { ...state, day: action.day };
    case "updateFilterLevel":
      return { ...state, level: action.level };
    default:
      return state;
  }
};

// reducer for tutor
const tutorReducer = (state = tutorDefaultState, action) => {
  switch (action.type) {
    case "change":
      const dummySample = {
        _id: uuidv4(),
        name: action.name,
        stars: 4,
        bio:
          "Goal-oriented 'math-head' with passion in crunching numbers - only numbers",
        subject: ["E Maths", "A Maths", "C Maths"],
        level: ["Secondary 2", "Secondary 3", "Secondary 4"],
        contact: {
          email: "vvalentine@telegram.com",
          phone: "94131322"
        }
      };
      return [...state, dummySample];
    case "fill":
      return action.initialData;

    default:
      return state;
  }
};

const filterReducer = (state = filter, action) => {
  switch (action.type) {
    case "update":
      return { ...state, tutorName: action.tutorName };
    case "changeStar":
      return { ...state, star: action.star };
    default:
      return state;
  }
};
export default function (initialState) {
  const store = createStore(
    combineReducers({
      tutor: tutorReducer,
      filter: filterReducer,
      classes: classReducer,
      filterClass: filterClassReducer,
      hasFetch: hasFetchReducer
    }),
    initialState
  );

  return store;
}
