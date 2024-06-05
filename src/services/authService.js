import api from "../API/api";

export const authLogin = (body, token) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithCaptch(`authapi/auths/login`, body, token)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getReferralCode = (code) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .get(`authapi/auths/refcode/${code}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const createConsult = (body, token) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithCaptch(`authapi/auths/create-provider`, body, token)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("errerr", err);
          reject(err);
        });
    });
  };
};

export const createUser = (body, token) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithCaptch(`authapi/auths/create-user`, body, token)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const userImageUpload = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/${id}/upload-images`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const uploadImage64Base = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/${id}/upload-images/base64`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const uploadImage64BaseSPIdCard = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`authapi/auths/accounts/${id}/idcard-images/base64`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const uploadImage64BaseSP = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`authapi/auths/accounts/${id}/images/base64`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};
export const uploadImage64BaseAccount = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(
          `userapi/users/accounts/${id}/register/upload-images/base64`,
          body
        )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const editProfile = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .patchtwithToken(`userapi/users/${id}`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const addMultiUserData = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`userapi/users/accounts/${id}/profiles`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const getProfileData = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`userapi/users/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const forgotPasswords = (body, token) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithCaptch(`authapi/auths/forgot-password`, body, token)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const resetPassword = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .put(`authapi/auths/forgot-password-confirm`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const chnagePassword = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`authapi/auths/${id}/reset-password`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const refreshToken = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .put(`authapi/auths/${id}/refresh-token`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const logoutuser = () => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`authapi/auths/logout`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const uploadImageAddProfile = (data) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`userapi/users/upload-images/base64`, data)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};
export const createmultipleAccounts = (data) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithToken(`userapi/users/profiles`, data)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log("error", err);
          reject(err);
        });
    });
  };
};

export const getAccountsData = () => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .getwithToken(`authapi/auths/accounts`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const deleteProfile = (id) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .deleteWithToken(`userapi/users/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const updateAccountData = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .putwithToken(`authapi/auths/accounts/${id}`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const editUserProfile = (id, body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .patchtwithToken(`authapi/auths/accounts/${id}`, body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const affiliatesVisits = (refCode, token) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .postwithCaptch(`paymentapi/affiliates/${refCode}/visits`, {}, token)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
};

export const sendOtp = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .post('authapi/auths/otp/send', body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        }); 
    });
  }
}

export const verifyOtp = (body) => {
  return (dispatch) => {
    return new Promise(async (resolve, reject) => {
      return api
        .post('authapi/auths/otp/verify', body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        }); 
    });
  }
}