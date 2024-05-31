import express from 'express';
import completionRoute from './completion.route';
import collectionRoute from './collection.route';
import chatRoute from './chat.route';
import higginsChatRoute from './higginsChat.route';
import higginsCompletionRoute from './higginsCompletion.route';
import feedbackRoute from './feedback.route';
import publicRoute from './public';
import industryRoute from './industry.route';
import {ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));
router.use('/completion', ClerkExpressRequireAuth(), completionRoute);
router.use('/collection', ClerkExpressRequireAuth(), collectionRoute);
router.use('/chat', ClerkExpressRequireAuth(), chatRoute);
router.use('/higgins-chat', ClerkExpressRequireAuth(), higginsChatRoute);
router.use('/higgins-completion', ClerkExpressRequireAuth(), higginsCompletionRoute);
router.use('/feedback', ClerkExpressRequireAuth(), feedbackRoute);
router.use('/public', publicRoute);
router.use('/industry', ClerkExpressRequireAuth(), industryRoute);

export default router;
