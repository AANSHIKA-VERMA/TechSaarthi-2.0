alter table opportunities
  alter column tags type text using array_to_string(tags, ', ');

alter table opportunities
  alter column tags set default '';

alter table opportunities
  add column if not exists deadline_text text;

