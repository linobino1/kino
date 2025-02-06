import * as migration_20241107_201219_generate_all_urls from './20241107_201219_generate_all_urls';
import * as migration_20250206_111921_migration from './20250206_111921_migration';

export const migrations = [
  {
    up: migration_20241107_201219_generate_all_urls.up,
    down: migration_20241107_201219_generate_all_urls.down,
    name: '20241107_201219_generate_all_urls',
  },
  {
    up: migration_20250206_111921_migration.up,
    down: migration_20250206_111921_migration.down,
    name: '20250206_111921_migration'
  },
];
