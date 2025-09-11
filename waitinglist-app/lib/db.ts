import { init } from '@instantdb/react';
import { i } from '@instantdb/core';

// Define your schema
const schema = i.schema({
  entities: {
    signups: i.entity({
      name: i.string(),
      email: i.string(),
      interest: i.string().optional(),
      status: i.string(), // 'pending', 'confirmed', 'notified'
      welcomeEmailSent: i.boolean(),
      createdAt: i.date(),
    }),
  },
});

export const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  schema,
});

export type Schema = typeof schema;