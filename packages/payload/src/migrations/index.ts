import * as migration_20241107_201219_generate_all_urls from './20241107_201219_generate_all_urls'
import * as migration_20250206_111921_migration from './20250206_111921_migration'
import * as migration_20250206_190444_localize_media_alt from './20250206_190444_localize_media_alt'
import * as migration_20250208_164718_events_v3 from './20250208_164718_events_v3'
import * as migration_20250210_200748_slug_lock from './20250210_200748_slug_lock'
import * as migration_20250210_215532_enable_drafts_on_posts from './20250210_215532_enable_drafts_on_posts'
import * as migration_20250210_222846_rename_screeningSeries_eventSeries from './20250210_222846_rename_screeningSeries_eventSeries'
import * as migration_20250210_224545_rename_screeningSeries_eventSeries_part2 from './20250210_224545_rename_screeningSeries_eventSeries_part2'
import * as migration_20250211_083006_fix_event_series_links_in_richtext from './20250211_083006_fix_event_series_links_in_richtext'
import * as migration_20250211_160155_events_series_has_many from './20250211_160155_events_series_has_many'
import * as migration_20250212_072144_fix_null_values_in_events_series from './20250212_072144_fix_null_values_in_events_series'
import * as migration_20250212_074118_fix_null_values_in_events_series_versions from './20250212_074118_fix_null_values_in_events_series_versions'
import * as migration_20250215_181351_add_news_page from './20250215_181351_add_news_page'
import * as migration_20250306_100232_press_releases from './20250306_100232_press_releases'
import * as migration_20250317_105110_eventsHeaderLock from './20250317_105110_eventsHeaderLock'

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
    name: '20250208_164718_events_v3',
  },
  {
    up: migration_20250210_200748_slug_lock.up,
    down: migration_20250210_200748_slug_lock.down,
    name: '20250210_200748_slug_lock',
  },
  {
    up: migration_20250210_215532_enable_drafts_on_posts.up,
    down: migration_20250210_215532_enable_drafts_on_posts.down,
    name: '20250210_215532_enable_drafts_on_posts',
  },
  {
    up: migration_20250210_222846_rename_screeningSeries_eventSeries.up,
    down: migration_20250210_222846_rename_screeningSeries_eventSeries.down,
    name: '20250210_222846_rename_screeningSeries_eventSeries',
  },
  {
    up: migration_20250210_224545_rename_screeningSeries_eventSeries_part2.up,
    down: migration_20250210_224545_rename_screeningSeries_eventSeries_part2.down,
    name: '20250210_224545_rename_screeningSeries_eventSeries_part2',
  },
  {
    up: migration_20250211_083006_fix_event_series_links_in_richtext.up,
    down: migration_20250211_083006_fix_event_series_links_in_richtext.down,
    name: '20250211_083006_fix_event_series_links_in_richtext',
  },
  {
    up: migration_20250211_160155_events_series_has_many.up,
    down: migration_20250211_160155_events_series_has_many.down,
    name: '20250211_160155_events_series_has_many',
  },
  {
    up: migration_20250212_072144_fix_null_values_in_events_series.up,
    down: migration_20250212_072144_fix_null_values_in_events_series.down,
    name: '20250212_072144_fix_null_values_in_events_series',
  },
  {
    up: migration_20250212_074118_fix_null_values_in_events_series_versions.up,
    down: migration_20250212_074118_fix_null_values_in_events_series_versions.down,
    name: '20250212_074118_fix_null_values_in_events_series_versions',
  },
  {
    up: migration_20250215_181351_add_news_page.up,
    down: migration_20250215_181351_add_news_page.down,
    name: '20250215_181351_add_news_page',
  },
  {
    up: migration_20250306_100232_press_releases.up,
    down: migration_20250306_100232_press_releases.down,
    name: '20250306_100232_press_releases',
  },
  {
    up: migration_20250317_105110_eventsHeaderLock.up,
    down: migration_20250317_105110_eventsHeaderLock.down,
    name: '20250317_105110_eventsHeaderLock',
  },
]
