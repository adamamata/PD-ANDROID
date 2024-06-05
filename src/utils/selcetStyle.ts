import React from 'react'

export const selectStyle = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "4px",
    background: "transparent",
    // border: "2px solid #D1D5DB",
    // minHeight: "auto",

    // Overwrittes the different states of border
    borderColor: state.isFocused ? null : null,

    // Removes weird border around container
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      // Overwrittes the different states of border
      borderColor: state.isFocused ? null : null,
    },
  }),

  menu: (css: any) => ({
    ...css,
    "@media only screen and (max-width: 600px)": {
      ...css["@media only screen and (max-width: 1200px)"],
      width: "200px",
    },
    width: "300px",
  }),

  indicators: (base: any, state: any) => ({
    ...base,
    background: "white !important",
  }),
  
  dropdownIndicator: (base: any) => ({
    ...base,
    padding: "0px !important"
  })
}

export const userSelectStyle = {
  control: (base: any, state: any) => ({
    ...base,
    borderRadius: "8px",
    background: "transparent",
    border: "2px solid",
    minHeight: "auto",

    // Overwrittes the different states of border
    borderColor: state.isFocused ? null : null,

    // Removes weird border around container
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      // Overwrittes the different states of border
      borderColor: state.isFocused ? null : null,
    },
  }),

  valueContainer: (css: any) => ({
    ...css,
    padding: "8px 8px"
  }),

  menu: (css: any) => ({
    ...css,
    "@media only screen and (max-width: 600px)": {
      ...css["@media only screen and (max-width: 1200px)"],
      width: "200px",
    },
    width: "300px",
  }),

  indicators: (base: any, state: any) => ({
    ...base,
    background: "white !important",
  }),
  
  indicatorsContainer: (base: any) => ({
    ...base,
  }),
  
  dropdownIndicator: (base: any) => ({
    ...base,
    padding: "0px !important",
    color: "#37085B"
  }),
  
  indicatorSeparator: (base: any) => ({
    ...base,
    background: "#37085B"
  })
}