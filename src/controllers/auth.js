import { registerUser, loginUser, refreshSession, logoutUser } from '../services/auth.js';

const setupSessionCookies = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerController = async (req, res) => {
  const user = await registerUser(req.body);
  
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: userResponse,
  });
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);

  setupSessionCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const session = await refreshSession({
    refreshToken: req.cookies.refreshToken,
  });

  setupSessionCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.refreshToken) {
    await logoutUser({ refreshToken: req.cookies.refreshToken });
  }
  
  res.clearCookie('refreshToken');
  res.status(204).send();
};