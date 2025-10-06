import { listActivities } from './activities.service.js';
import { authorize } from '../../middlewares/auth.js';

export const recent = async (req, res, next) => {
  try {
    const activities = await listActivities(Number(req.query.limit) || 20);
    res.json({ activities });
  } catch (error) {
    next(error);
  }
};

export const activitiesRoutes = (router) => {
  router.get('/activities', authorize('ADMIN'), recent);
  return router;
};
