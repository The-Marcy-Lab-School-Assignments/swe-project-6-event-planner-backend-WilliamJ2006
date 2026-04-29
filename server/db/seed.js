const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  await pool.query('DROP TABLE IF EXISTS rsvp');
  await pool.query('DROP TABLE IF EXISTS events');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE events (
      event_id       SERIAL PRIMARY KEY,
      title      TEXT NOT NULL UNIQUE,
      description TEXT,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      event_type TEXT NOT NULL,
      max_capacity INTEGER NOT NULL,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE rsvps (
      rsvp_id       SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
      UNIQUE(user_id, event_id)
    )
  `);

  const aliceHash = await bcrypt.hash('password123', SALT_ROUNDS);
  const bobHash = await bcrypt.hash('hunter2', SALT_ROUNDS);
  const carolHash = await bcrypt.hash('opensesame', SALT_ROUNDS);
  const chrisHash = await bcrypt.hash('password', SALT_ROUNDS);
  const zaneHash = await bcrypt.hash('hunterpassword', SALT_ROUNDS);
  const gabeHash = await bcrypt.hash('password45', SALT_ROUNDS);
  const jojoHash = await bcrypt.hash('jojolionPeak', SALT_ROUNDS);

  const insertUserSql =
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING user_id;';

  const aliceResponse = await pool.query(insertUserSql, ['alice', aliceHash]);
  const bobResponse = await pool.query(insertUserSql, ['bob', bobHash]);
  const carolResponse = await pool.query(insertUserSql, ['carol', carolHash]);
  const chrisResponse = await pool.query(insertUserSql, ['chris', chrisHash]);
  const zaneResponse = await pool.query(insertUserSql, ['zane', zaneHash]);
  const gabeResponse = await pool.query(insertUserSql, ['gabe', gabeHash]);
  const jojoResponse = await pool.query(insertUserSql, ['jojo', jojoHash]);

  const aliceId = aliceResponse.rows[0].user_id;
  const bobId = bobResponse.rows[0].user_id;
  const carolId = carolResponse.rows[0].user_id;
  const chrisId = chrisResponse.rows[0].user_id;
  const zaneId = zaneResponse.rows[0].user_id;
  const gabeId = gabeResponse.rows[0].user_id;
  const jojoId = jojoResponse.rows[0].user_id;

  const eventsQuery =
    'INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)';

  await pool.query(eventsQuery, [
    'Tech Innovators Conference',
    'A full-day conference with speakers and panels.',
    '2026-06-12',
    'Convention Center',
    'conference',
    200,
    aliceId,
  ]);

  await pool.query(eventsQuery, [
    'React Beginner Workshop',
    'Hands-on workshop building React apps.',
    '2026-06-18',
    'Computer Lab',
    'workshop',
    30,
    bobId,
  ]);

  await pool.query(eventsQuery, [
    'Summer Mixer',
    'Casual student social with food and games.',
    '2026-06-20',
    'Student Union',
    'social',
    75,
    aliceId,
  ]);

  await pool.query(eventsQuery, [
    'Startup Networking Night',
    'Meet founders and local professionals.',
    '2026-06-25',
    'Innovation Hub',
    'networking',
    50,
    carolId,
  ]);

  await pool.query(eventsQuery, [
    'Campus Battle of the Bands',
    'Live performances from student bands.',
    '2026-07-02',
    'Outdoor Amphitheater',
    'concert',
    300,
    bobId,
  ]);

  await pool.query(eventsQuery, [
    'Community Soccer Tournament',
    'Friendly 5v5 tournament.',
    '2026-07-08',
    'Athletic Field',
    'sports',
    60,
    carolId,
  ]);

  await pool.query(eventsQuery, [
    'Scholarship Fundraiser Gala',
    'Dinner event raising money for scholarships.',
    '2026-07-15',
    'Grand Ballroom',
    'fundraiser',
    120,
    aliceId,
  ]);

  await pool.query(eventsQuery, [
    'Open Mic Night',
    'Poetry, music, and comedy performances.',
    '2026-07-22',
    'Campus Cafe',
    'other',
    40,
    bobId,
  ]);

  const rsvpsQuery = 'INSERT INTO rsvps (user_id, event_id) VALUES ($1, $2)';

  await pool.query(rsvpsQuery, [aliceId, 2]);
  await pool.query(rsvpsQuery, [aliceId, 4]);

  await pool.query(rsvpsQuery, [bobId, 1]);
  await pool.query(rsvpsQuery, [bobId, 6]);

  await pool.query(rsvpsQuery, [carolId, 3]);
  await pool.query(rsvpsQuery, [carolId, 5]);

  await pool.query(rsvpsQuery, [chrisId, 1]);
  await pool.query(rsvpsQuery, [chrisId, 7]);

  await pool.query(rsvpsQuery, [zaneId, 2]);
  await pool.query(rsvpsQuery, [zaneId, 8]);

  await pool.query(rsvpsQuery, [gabeId, 4]);
  await pool.query(rsvpsQuery, [gabeId, 6]);

  await pool.query(rsvpsQuery, [chrisId, 3]);
  await pool.query(rsvpsQuery, [zaneId, 5]);
  await pool.query(rsvpsQuery, [gabeId, 7]);
  await pool.query(rsvpsQuery, [jojoId, 2]);

  console.log('Database seeded.');
};

seed()
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
