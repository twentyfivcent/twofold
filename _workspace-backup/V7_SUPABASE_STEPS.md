# Running the v7 database update (Supabase)

The update only adds things. It never deletes or changes existing players, money, skins or history, and it is safe to run more than once.

1. **Back up first (recommended).** In Supabase, open **Database → Backups** and check that a recent backup exists. On the free plan, you can instead run `select * from profiles;` in the SQL Editor and export the results as CSV.
2. Open your project at https://supabase.com/dashboard and click **SQL Editor** in the left sidebar.
3. Click **New query**.
4. Open `supabase-setup.sql` from twofold-v7.zip in a text editor. Select all and copy it.
5. Paste it into the editor and click **Run** (or press Ctrl/Cmd+Enter). You should see "Success. No rows returned". If Supabase warns about "destructive operations", that comes from the `drop policy if exists` / `create or replace` lines that make the file re-runnable. Click to confirm.
6. **Verify** by running each query below in a new query:
   - `select name from dev_names order by 1;` should return purplejay83, twentyfivcent and weebier.
   - `select count(*) from profiles;` should return the same number as before the update.
   - `select username, money from profiles order by money desc limit 5;` should show money unchanged.
   - `select tablename, rowsecurity from pg_tables where schemaname='public';` should show rowsecurity = true for every table.
   - `select public.heartbeat(gen_random_uuid()); select public.online_count();` should return a count of 1 or more.
7. Tell Jeff "go live". Jeff pushes the new `index.html` to GitHub Pages; it usually shows up within a couple of minutes.
8. Open the game. Under the TWOFOLD header you should see a green dot with "N online". If it is missing after the update is live, step 5 did not finish. Re-run it, because running it again is safe.
9. **Optional check:** log in with an existing account. Your money, skins and stats should all be intact, and DEV accounts should show the DEV tag.
