// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from "http-status-codes";
import {
  jwtProvider,
  ACCESS_TOKEN_SECRET_SIGNATURE,
  REFRESH_TOKEN_SECRET_SIGNATURE,
} from "~/providers/JwtProvider";
const isAuthorized = async (req, res, next) => {
  // cách 1: lấy accessToken từ httpOnly cookie
  // const accessTokeFromCookie = req.cookies?.accessToken;

  // if (!accessTokeFromCookie) {
  //   res
  //     .status(StatusCodes.UNAUTHORIZED)
  //     .json({ message: "Unauthorization (Token not found)" });
  //   return;
  // }
  // cách 2: lấy accessToken từ jwt
  const accessTokeFromHeader = req.headers?.authorization;
  if (!accessTokeFromHeader) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorization (Token not found)" });
    return;
  }

  try {
    // giải mã token
    const accessTokenDecoded = await jwtProvider.verifyToken(
      accessTokeFromHeader.substring("Bearer ".length),
      ACCESS_TOKEN_SECRET_SIGNATURE
    );
    // token hợp lệ thì gắn vào req.jwtDecoded
    req.jwtDecoded = accessTokenDecoded;
    // gọi next để đi tiếp
    next();
  } catch (err) {
    // nếu accessToken hết hạn thì trả về mã GONE - 410

    if (err.message?.includes("jwt expired")) {
      res.status(StatusCodes.GONE).json({ message: "Need to refresh token" });
      return;
    }
    //nếu accessToken không hợp lệ thì trả về 401
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorization please login" });
  }
};

export const authMiddeware = {
  isAuthorized,
};
