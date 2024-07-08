import 'reflect-metadata';
import dataSource from './src/database/data-source';

async function runMigrations() {
  try {
    await dataSource.initialize();
    await dataSource.runMigrations();
    console.log('Migrations ran successfully');
  } catch (err) {
    console.error('Error running migrations', err);
  } finally {
    await dataSource.destroy();
  }
}

runMigrations();
