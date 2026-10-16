# Add MongoDB to FastAPI

Page: [adding-mongodb-to-fastapi.html](../../pages/topics/adding-mongodb-to-fastapi.html).
Scope: a first local MongoDB connection with synchronous PyMongo and a short CRUD
reference. Prerequisite: [Starting a FastAPI backend](starting-a-fastapi-backend.md),
including its virtual environment, main.py and basic Python dictionaries.

1. **Introduced** — `#before-you-start`: persistence across program runs; the
   FastAPI → PyMongo → MongoDB relationship. The connection module is database.py;
   MongoDB stores the data separately, not in a project database.db file.
2. **Covered** — `#documents`: database, collection, document and field, using
   arcane_avenue, users and one fictional email/username document throughout.
3. **Developed** — `#install-driver`: local Community Server prerequisite and port
   27017; install PyMongo in the existing venv and update requirements.txt.
   OS-specific server installation/startup is delegated to the official guide.
4. **Covered** — `#connect-client`: package/class import, MongoClient object,
   connection string, localhost, port and the 5000 ms server selection timeout.
   Client construction alone does not confirm server availability.
5. **Covered** — `#select-database`: database and collection handles versus stored
   documents; missing namespaces are created by the first write or index command.
6. **Developed** — `#email-index`: create_index, unique=True, duplicate inserts and
   updates, pre-existing duplicate data and exact case-sensitive values. Uniqueness
   does not validate email format, ownership or required fields.
7. **Covered** — `#database-file`: complete requested connection module and the
   collection import used by the reference examples.
8. **Covered** — `#crud-reference`: operation/result lookup. Individual examples
   are shown on their own slides without a separate practice-file workflow.
9. **Covered** — `#add-item`, `#find-item`, `#list-items`: insert_one and inserted_id;
   DuplicateKeyError import and a try/except insert example with success and
   duplicate outcomes; equality filters, find_one and None; find cursors, loops,
   sort and limit.
10. **Covered** — `#update-item`, `#delete-item`, `#count-items`: update_one with $set;
    matched versus modified counts, no implicit insert, targeted delete_one,
    deleted_count and filtered counts. Empty filters and repeated-run outcomes.
11. `#sources`: official connection, CRUD and duplicate-key
    exception documentation.

HTML is the authored source. The page reuses the setup lesson's layout stylesheet,
shared backend diagrams, code snippets and lesson shell. It follows ASD-STE100
principles: short sentences, direct instructions, defined technical names and
consistent terms. There is no quiz or written-answer store on this reference lesson.

The local unauthenticated server and fictional user data are classroom assumptions.
Accounts, passwords, authentication, Atlas, deployment, async drivers, bulk writes,
aggregation, FastAPI route implementation and application lifecycle design are
outside scope. The import-time index follows the requested small example;
database.py must remain separate from reference operations. The education site
itself remains static.
