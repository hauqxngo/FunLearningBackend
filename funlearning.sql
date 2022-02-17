\echo 'Delete and recreate funlearning db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE funlearning;
CREATE DATABASE funlearning;
\connect funlearning

\i funlearning-schema.sql
\i funlearning-seed.sql

\echo 'Delete and recreate funlearning_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE funlearning_test;
CREATE DATABASE funlearning_test;
\connect funlearning_test

\i funlearning-schema.sql
