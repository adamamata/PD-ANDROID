import React, { useState, useEffect } from "react";
import { addNewCardData, getStateSearchList, getallcontryList } from "../../../services/homeService";
import { connect } from "react-redux";
import RctPageLoader from "../../../component/RctPageLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LOCALSTORE } from "../../../constant/default";
import BankAccountForm from "./addBankAccountForm";
import AddWiseBankAccountForm from "./addWiseBankAccountForm";
import AddPayPalAccountForm from "./addPayPalAccountForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AddNewBank: React.FC<any> = (props: any) => {

  const { cancel, getCardDetails } = props;
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [accountType, setAccountType] = useState("Savings")
  const [countryList, setCountryList] = useState<any>([]);
  const [options, setOption] = useState<any>([]);
  const [selectedDialCode, setSelectedDialCode] = useState();
  const [selectedState, setSelectedState] = useState("");
  const [bankMethod, setBankMethod] = useState("BankAccount");
  const [countryDialCode, setCountryDialCode] = useState<any>([])

  useEffect(() => {
    getCountryListData();
  }, []);

  const OnSubmit = (values: any) => {
    const { dispatch } = props
    setisLoading(true);
    const body = {
      userId: localStorage.getItem(LOCALSTORE.id),
      cardType: "Bank",
      CardHolder: values.fName + values.lName,
      cardNo: values.accountNumber,
      state: values?.state,
      country: values?.country,
      city: values.city,
      bankName: values.bankName,
      address1: values.address,
      address2: "",
      phoneNumber: values.pNumber,
      dialCode: selectedDialCode,
      email: values.email,
      routingNumber: values.RoutingNumber,
      bankAccountType: accountType,
      ssn: values.ssn,
      ein: values.ein,
      postalCode: values.zipCode,
      firstName: values.fName,
      lastName: values.lName,
    };

    dispatch(addNewCardData(body))
      .then((res: any) => {
        setisLoading(false);
        getCardDetails()
        toast.success("Add Bank Successfull!", {
          theme: "colored",
          autoClose: 5000,
        });

        cancel();
      })
      .catch((err: any) => {

        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
        setisLoading(false);
        cancel();
      });
  };

  const cancelData = () => {
    props.cancel();
  };

  const onChangeAccount = (e: any) => {
    setAccountType(e.target.value)
  }

  const onChangeBankMethod = (e: any) => {
    setBankMethod(e.target.value)
  }

  const getCountryListData = () => {
    const { dispatch } = props;

    dispatch(getallcontryList())
      .then((res: any) => {
        const temp: any = [];
        const optionArr: any[] = []
        res.data.map((item: any) => {
          const obj = {
            value: item.name,
            label: item.name,
            id: item.id,
            dialCode: item.dialCode

          };

          optionArr.push({
            label: `(${item.dialCode}) ${item.name}`,
            value: item.dialCode,
            key: item.dialCode,
            chipLabel: `${item.dialCode}`
          });


          temp.push(obj);
        });


        setCountryList(temp);
        setCountryDialCode(optionArr);
      })
      .catch((err: any) => {
        console.log("err", err);
      });
  };

  const onChangeState = (setFieldValue: any, value: any, name: any) => {
    if(name) {
      setFieldValue(name, value)
    } else {
      setFieldValue("state", value)
    }
    const selectedOption = options.find((option: any) => option.value === value)

    setSelectedState(selectedOption)
  };

  const onChangeCountry = (setFieldValue: any, value: any, name?: any) => {
    setSelectedState("")
    if(name) {
      setFieldValue(name, value)
    } else {
      setFieldValue("country", value)
    }
    const selectedCountry = countryList.find((item: any) => item?.value === value)
    setSelectedDialCode(selectedCountry?.dialCode)
    getCountryStateDetails(selectedCountry?.id);
  };

  const getCountryStateDetails = (id: any) => {
    const { dispatch } = props;
    if (id) {
      dispatch(getStateSearchList(id))
        .then((res: any) => {
          const temp: any = [];
          res.data.map((item: any) => {
            const obj = {
              value: item.name,
              label: item.name,
            };
            temp.push(obj);
          });
          setOption(temp);
        })
        .catch((err: any) => {
          console.log("err");
        });
    }
  };

  const onSubmitWiseForm = (values: any) => {
    const { dispatch } = props
    setisLoading(true);
    const body = {
      userId: localStorage.getItem(LOCALSTORE.id),
      cardType: "WISE",
      bankName: values.bankName,
      bankAddress1: values.bankAddress,
      bankAddress2: "",
      bankCity: values.bankCity,
      bankState: values.bankState,
      bankCountry: values.bankCountry,
      bankPostalCode: values.bankZipCode,
      firstName: values.fName,
      lastName: values.lName,
      cardNo: values.accountNumber,
      swiftCode: values.swiftCode,
      email: values.email,
      address1: values.address,
      address2: "",
      city: values.city,
      state: values.state,
      country: values.country,
      postalCode: values.zipCode
    };

    dispatch(addNewCardData(body))
      .then((res: any) => {
        setisLoading(false);
        getCardDetails()
        toast.success("Add Bank Successfull!", {
          theme: "colored",
          autoClose: 5000,
        });

        cancel();
      })
      .catch((err: any) => {

        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
        setisLoading(false);
        cancel();
      });

  }

  const onSubmitPayPalForm = (values: any) => {
    const { dispatch } = props
    setisLoading(true);
    const body = {
      userId: localStorage.getItem(LOCALSTORE.id),
      cardType: "PayPal",
      FirstName: values.fName,
      LastName: values.lName,
      PaypalUsername: values.payPalUserName,
    };

    if(values.email) {
      Object.assign(body, {Email: values.email})
    }

    if(values.dialCode && values.phoneNumber) {
      Object.assign(body, {DialCode: values.dialCode})
      Object.assign(body, {PhoneNumber: values.phoneNumber})
    }
    
   
    dispatch(addNewCardData(body))
      .then((res: any) => {
        setisLoading(false);
        getCardDetails()
        toast.success("Add Bank Successfull!", {
          theme: "colored",
          autoClose: 5000,
        });

        cancel();
      })
      .catch((err: any) => {

        const massage = err.response.data.message;
        toast.error(massage, {
          theme: "colored",
          autoClose: 5000,
        });
        setisLoading(false);
        cancel();
      });
  }

  return (
    <>
      <div className="w-full">
        <div className="fixed flex items-center inset-0 z-50 outline-none focus:outline-none rounded-2xl py-8">
          {isLoading && <RctPageLoader />}
          <div className="relative font-['Montserrat'] w-11/12  mx-auto max-w-3xl bg-white rounded px-6 py-8 h-[100%] smallScroll overflow-auto">
            <div
              className="flex justify-end text-xl font-bold text-black cursor-pointer"
              onClick={cancelData}
            >
              <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
            </div>
            <div className="text-primary text-center text-3xl font-bold 2xl:mt-4">
              New Account
            </div>
            <div className="text-sm mt-6">Enter the details below to add an account</div>

            <div className="mt-6 form-label font-['Montserrat'] leading-none inline-block text-base font-normal text-black">Select Your Withdrawal Method </div>

            <div className="mb-2 flex items-center">
              <div className="flex items-center">
                <input
                  type="radio"
                  className="accent-primary w-[17px] h-[17px]"
                  name="radioSavings"
                  value="BankAccount"
                  onChange={onChangeBankMethod}
                  checked={bankMethod === "BankAccount"}
                />
                <label
                  className={`ml-2 text-[14px] ${bankMethod === "BankAccount" && "text-primary font-medium"}`}
                  htmlFor="flexRadioDefault2"
                >
                  Bank Account
                </label>
              </div>

              <div className="flex items-center ml-8">
                <input
                  type="radio"
                  className="accent-primary w-[17px] h-[17px]"
                  name="radioSavings"
                  value="WISE"
                  onChange={onChangeBankMethod}
                  checked={bankMethod === "WISE"}
                />
                <label
                  className={`ml-2 text-[14px] ${bankMethod === "WISE" && "text-primary font-medium"}`}
                  htmlFor="flexRadioDefault2"
                >
                  WISE
                </label>
              </div>

              <div className="flex items-center ml-8">
                <input
                  type="radio"
                  className="accent-primary w-[17px] h-[17px]"
                  name="radioSavings"
                  value="PayPal"
                  onChange={onChangeBankMethod}
                  checked={bankMethod === "PayPal"}
                />
                <label
                  className={`ml-2 text-[14px] ${bankMethod === "PayPal" && "text-primary font-medium"}`}
                  htmlFor="flexRadioDefault2"
                >
                  PayPal
                </label>
              </div>
            </div>

            {bankMethod === "BankAccount" &&
              <BankAccountForm
                onSubmit={OnSubmit}
                countryList={countryList}
                onChangeCountry={onChangeCountry}
                selectedState={selectedState}
                onChangeState={onChangeState}
                options={options}
                selectedDialCode={selectedDialCode}
                accountType={accountType}
                onChangeAccount={onChangeAccount}
              />
            }

            {bankMethod === "WISE" &&
              <AddWiseBankAccountForm
                onSubmit={onSubmitWiseForm}
                countryList={countryList}
                onChangeCountry={onChangeCountry}
                selectedState={selectedState}
                onChangeState={onChangeState}
                options={options}
              />
            }

            {bankMethod === "PayPal" &&
              <AddPayPalAccountForm
                onSubmit={onSubmitPayPalForm}
                countryList={countryDialCode}
                onChangeCountry={onChangeCountry}
                selectedState={selectedState}
                onChangeState={onChangeState}
                options={options}
              />
            }


          </div>
        </div>
        <div className="opacity-70 fixed inset-0 z-40 bg-black"></div>
      </div>
    </>
  );
};

export default connect()(AddNewBank);