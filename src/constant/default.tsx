export const DevURL: string = process.env.REACT_APP_BASE_URL as string;

export const siteKey = "6LcrsDEnAAAAAM1C5Cnu3gsyBJynNX994C5LrexP"

export const LOCALSTORE = {
  token: "token",
  email:"email",
  refreshToken: "refreshToken",
  role: "role",
  id:"id",
  callAgent: "callAgent",
  communicationIdentifier: {
    token: "communicationToken",
    expiredOn: "communicationExpiredOn",
    userId: "communicationUserId",
    threadId: "threadId"
  },
  isOver18: "yes"
};

export const GetUserId = () => {
  return localStorage.getItem(LOCALSTORE.id);
};

export const GetToken = () => {
  let token = localStorage.getItem(LOCALSTORE.token);
  return token;
};

export const GetRefreshToken = () => {
  let token = localStorage.getItem(LOCALSTORE.refreshToken);
  return token;
};

export const getRole = () => {
  let role = localStorage.getItem(LOCALSTORE.role);
  return role;
};

export const phoneNumberRegex = /^[0-9\b]+$/;

// export const getIsOver18 = () => {
//   let isOver18 = localStorage.getItem(LOCALSTORE.isOver18);
//   return isOver18;
// }
