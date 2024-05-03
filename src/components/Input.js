// Input Component
import React from "react";
import PropTypes from "prop-types";

const Input = ({ label, onInput, inputRef }) => {
  return (
    <div className="input-box">
      <span className="label">{label}</span>
      <input type="text" onChange={onInput} ref={inputRef} />
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string.isRequired, // label is use to show label of input
  onInput: PropTypes.func, // onInput is a function which is called when input value is changed, take input from input field to parent state
  inputRef: PropTypes.object, // inputRef is a reference of input field, and it is used to focus on input field
};

export default Input;
