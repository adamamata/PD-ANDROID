import { Field } from 'formik'
import React from 'react'
import { connect } from 'react-redux';

const Checkbox: React.FC<any> = ({
  touched, errors, data, handleCheckBox, isChecked, name, labelClassName, setFieldValue
}: any) => {
  return (
    <>
      <Field
        type="checkbox"
        name={name}
        // placeholder="Profile Description"
        id={name}
        className={`border-[#37085B] h-5 w-5 rounded-lg border bg-white checked:bg-[#37085B] checked:border-[#37085B] focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer ${errors.callSettings && touched.callSettings && "border-[#E85626]"}`}
        onChange={(event: any) => handleCheckBox(event, data.value, setFieldValue ?? null)}
        checked={isChecked}
      />
      <label
        className={`text-sm font-semibold inline-block text-[#37085B] ${labelClassName ? labelClassName : ""}`}
        htmlFor={name}
        style={{ fontFamily: "Montserrat" }}
      >
        {data.lable || data.name}
      </label>
    </>
  )
}

export default connect()(Checkbox)