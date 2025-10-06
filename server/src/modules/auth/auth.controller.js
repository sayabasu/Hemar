import { loginUser, registerUser, getProfile } from './auth.service.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const register = async (req, res, next) => {
  try {
    const { user, token } = await registerUser(req.body);
    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/** same jsdoc**/
export const login = async (req, res, next) => {
  try {
    const { user, token } = await loginUser(req.body);
    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const profile = async (req, res, next) => {
  try {
    const user = await getProfile(req.auth.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
