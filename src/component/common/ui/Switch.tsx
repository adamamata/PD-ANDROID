import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import styled from 'styled-components';

interface StyledSwitchProps {
  checkedround: string;
  uncheckedround: string;
  checkedbackground: string;
  uncheckedbackground: string;
}

const StyledSwitch = styled.div<StyledSwitchProps>`
  height: 25px;
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 25px;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.uncheckedbackground};
    -webkit-transition: .4s;
    transition: .4s;
    width: 50px;
    height: 25px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.25rem;
    width: 1.25rem;
    left: 2px;
    top: 1.5px;
    background-color: ${props => props.uncheckedround};
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: ${props => props.checkedbackground};
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
    background-color: ${props => props.checkedround} !important;
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }

  input:checked + .slider.round:before {
    left: 0px;
  }
`

const Switch: React.FC<any> = ({
  isChecked, checkedBorder, unCheckedBorder, checkedRound, unCheckedRound,
  checkedBackground, unCheckedBackground, onSwitchChange
}: any) => {

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(isChecked)
  }, [isChecked])

  const onHandleChange = () => {
    onSwitchChange()
  }

  return (
    <StyledSwitch
      uncheckedbackground={unCheckedBackground}
      checkedbackground={checkedBackground}
      checkedround={checkedRound}
      uncheckedround={unCheckedRound}
      className="status-slider"
    >
      <label className={`h-[25px] inline-block ms-0 ms-md-3 switch w-[50px]`} aria-checked={checked}>
        <input className="hidden" type="checkbox" onChange={() => onHandleChange()} checked={checked} />
        <div className={`slider round border ${checked ? `border-[${checkedBorder}]` : `border-[${unCheckedBorder}]`}  `} />
      </label>
    </StyledSwitch>
  )
}

export default connect()(Switch);