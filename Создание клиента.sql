INSERT INTO public.clients(
	last_name, first_name, middle_name, birth_date, passport_data, phone_number, email, password_hash, gender, citizenship)
	VALUES ('Иванов', 'Иван', 'Иваныч', '2003-03-09', '{
  "passport_series": "4509",
  "passport_number": "123456",
  "issue_date": "2010-07-20",
  "issued_by": "Отделение УФМС России по г. Москве"
}', '79856810350', 'scfe@mail.ru', '$argon2id$v=19$m=65536,t=3,p=4$53wt3Tc915NsSYtV3lrpGA$wA8oirJmQaF0as5vxaavP15r9v3ZFUupvN6PA92OWBI', 'Мужской', 'Россия');