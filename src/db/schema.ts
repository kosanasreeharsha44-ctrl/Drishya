import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Users table (maps Firebase Auth UID to relational record)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  role: text('role').default('team').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Client Inquiries
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  service: text('service').notNull(),
  deadline: text('deadline'),
  details: text('details').notNull(),
  referenceLink: text('reference_link'),
  status: text('status').default('New').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Creative Concepts
export const creativeConcepts = pgTable('creative_concepts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  contact: text('contact').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').default('Creative Concept').notNull(),
  fileUrl: text('file_url'),
  consent: boolean('consent').default(true).notNull(),
  status: text('status').default('New').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Customer Reviews
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  projectId: text('project_id').notNull(),
  projectTitle: text('project_title').notNull(),
  clientName: text('client_name').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  service: text('service'),
  isApproved: boolean('is_approved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Studio Projects
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  clientContact: text('client_contact').notNull(),
  service: text('service').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  startDate: text('start_date'),
  deadline: text('deadline'),
  deliveredDate: text('delivered_date'),
  status: text('status').default('Pending').notNull(),
  progressPercent: integer('progress_percent').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
