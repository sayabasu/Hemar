import { Activity } from './activity.model.js';

/**
 * Records an activity log entry.
 * @param {{type: string, message: string, metadata?: object}} payload
 */
export const recordActivity = (payload) => Activity.create(payload);

/**
 * Lists recent activities.
 */
export const listActivities = (limit = 20) => Activity.find().sort({ createdAt: -1 }).limit(limit).lean();
