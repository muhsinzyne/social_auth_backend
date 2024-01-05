export const ERRORS = {
  INTERNAL_SERVER: {
    code: 500,
    message: "Internal Server Error",
  },
  INVALID_CREDS: {
    code: 400,
    message: "Invalid Creds",
  },
  USER_NOT_FOUND: {
    code: 404,
    message: "User Not Found",
  },
  INVALID_TOKEN: {
    code: 400,
    ACCESS: {
      expired: "Access Token Expired",
      message: "Invalid Acess Token",
    },
    REFRESH: {
      expired: "Refresh Token Expired",
      message: "Invalid Refresh Token",
    },
  },
  UNAUTHORIZED: {
    code: 401,
    message: "Unauthorized",
  },
};
