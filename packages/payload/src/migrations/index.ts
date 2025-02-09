import * as migration_20241107_201219_generate_all_urls from './20241107_201219_generate_all_urls';
import * as migration_20250206_111921_migration from './20250206_111921_migration';
import * as migration_20250206_190444_localize_media_alt from './20250206_190444_localize_media_alt';
import * as migration_20250208_164718_events_v3 from './20250208_164718_events_v3';

export const migrations = [
  {
    up: migration_20241107_201219_generate_all_urls.up,
    down: migration_20241107_201219_generate_all_urls.down,
    name: '20241107_201219_generate_all_urls',
  },
  {
    up: migration_20250206_111921_migration.up,
    down: migration_20250206_111921_migration.down,
    name: '20250206_111921_migration',
  },
  {
    up: migration_20250206_190444_localize_media_alt.up,
    down: migration_20250206_190444_localize_media_alt.down,
    name: '20250206_190444_localize_media_alt',
  },
  {
    up: migration_20250208_164718_events_v3.up,
    down: migration_20250208_164718_events_v3.down,
    name: '20250208_164718_events_v3'
  },
];
