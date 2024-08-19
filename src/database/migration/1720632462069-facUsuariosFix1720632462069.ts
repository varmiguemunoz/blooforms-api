import { MigrationInterface, QueryRunner } from 'typeorm';

export class facUsuariosFix1720632462069 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE TABLE spaces (
  id bigint primary key generated always as identity,
  name text not null,
  created_at timestamp with time zone default now()
);

CREATE TABLE events (
  id bigint primary key generated always as identity,
  space_id bigint references spaces (id),
  event_type text not null,
  event_data jsonb,
  created_at timestamp with time zone default now()
);

CREATE TABLE customers (
  id bigint primary key generated always as identity,
  space_id bigint references spaces (id),
  name text not null,
  email text unique not null,
  phone text,
  created_at timestamp with time zone default now()
);

CREATE TABLE users (
  id bigint primary key generated always as identity,
  username text unique not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone
);

alter table spaces
add column user_id bigint unique references users (id);

create type user_role as enum('admin', 'client');

alter table users
add column role user_role not null default 'client';

alter table users
drop role;

CREATE TABLE roles (
  id bigint primary key generated always as identity,
  name text unique not null
);

CREATE TABLE fac_user (
  id bigint primary key generated always as identity,
  user_id bigint references users (id),
  role_id bigint references roles (id),
  assigned_at timestamp with time zone default now()
);

alter table events
drop space_id;

alter table customers
drop space_id;

CREATE TABLE space_types (
  id bigint primary key generated always as identity,
  name text unique not null
);

CREATE TABLE fac_spaces (
  id bigint primary key generated always as identity,
  user_id bigint unique references users (id),
  space_type_id bigint references space_types (id),
  name text not null,
  created_at timestamp with time zone default now()
);

drop table spaces;

alter table events
add column space_id bigint references fac_spaces (id);

alter table customers
add column space_id bigint references fac_spaces (id);

CREATE TABLE payment_types (
  id bigint primary key generated always as identity,
  name text unique not null
);

CREATE TABLE payment_status (
  id bigint primary key generated always as identity,
  name text unique not null
);

CREATE TABLE fac_payments (
  id bigint primary key generated always as identity,
  user_id bigint references users (id),
  payment_type_id bigint references payment_types (id),
  payment_status_id bigint references payment_statuses (id),
  amount numeric(10, 2) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
DROP TABLE IF EXISTS fac_payments;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS fac_user;
DROP TABLE IF EXISTS fac_spaces;
DROP TABLE IF EXISTS payment_types;
DROP TABLE IF EXISTS payment_status;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS space_types;
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS fac_usuarios_id_rol_fkey CASCADE;
DROP TYPE IF EXISTS fac_users CASCADE;
DROP TYPE IF EXISTS role CASCADE;
DROP TYPE IF EXISTS fac_spaces CASCADE;
DROP TYPE IF EXISTS events CASCADE;
DROP TYPE IF EXISTS fac_payments CASCADE;
`);
  }
}
