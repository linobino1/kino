#!/bin/bash
# a little helper to debug the migration from v1 to v2
# 
# arguments:
#   --u: the URI of the v1 database  (alternatively, you can set the SOURCE_DB_URI environment variable)
#   --n: the name of the v1 database (alternatively, you can set the SOURCE_DB_NAME environment variable)
#   --t: the URI of the v2 database (make sure that node also uses this URI) (alternatively, you can set the DATABASE_URI environment variable)
#   --d: if set, the script will not download the source database
#   --r: if set, the script will not clear and restore the target database
#  
# example:
#   ./migrateV2.sh --source-uri "mongodb://localhost:27017/source_db" --source-name "source_db" --target-uri "mongodb://localhost:27017/target_db"

# load dotenv
source .env

# set the default values
SOURCE_DB_URI=${SOURCE_DB_URI}
SOURCE_DB_NAME=${SOURCE_DB_NAME}
DATABASE_URI=${DATABASE_URI}
SKIP_DOWNLOAD=
SKIP_RESTORE=
SKIP_NODE=

# read the arguments
while getopts "u:n:t:drpx" var
do
    case "$var" in
        u) SOURCE_DB_URI=${OPTARG};;
        n) SOURCE_DB_NAME=${OPTARG};;
        t) DATABASE_URI=${OPTARG};;
        d) SKIP_DOWNLOAD=1;;
        r) SKIP_RESTORE=1;;
        x) SKIP_NODE=1;;
    esac
done

# dump the v1 database
if [ -z "$SKIP_DOWNLOAD" ]; then
  echo "Downloading the v1 database"
  rm -rf $(pwd)/migrationV2/
  mongodump --uri $SOURCE_DB_URI --out $(pwd)/migrationV2/
fi

# copy the v1 database to the target database
if [ -z "$SKIP_RESTORE" ]; then
  # clear the target database
  echo "Clearing the target database"
  mongosh $DATABASE_URI --eval "db.dropDatabase()"

  echo "Restoring the v1 database"
  mongorestore --uri $DATABASE_URI $(pwd)/migrationV2/$SOURCE_DB_NAME
fi

# run the node script
if [ -z "$SKIP_NODE" ]; then
  echo "Running the migration script"
  pnpm migrate:v2
fi
