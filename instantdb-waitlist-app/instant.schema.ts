import { i } from '@instantdb/react';

export default i.schema({
  entities: {
    signups: i.entity({
      name: i.string(),
      email: i.string(),
      interest: i.string(), // Why they're interested
      status: i.string(), // 'pending', 'email_sent', 'failed'
      createdAt: i.date(),
      welcomeEmailSent: i.boolean(),
    }),
  },
});