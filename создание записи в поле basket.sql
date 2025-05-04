UPDATE public.users
	SET basket = ARRAY[
  '{
    "ticket_id": 123,
    "selected_tariffs": [
      { "seat": "A1", "tariff": "standard" },
      { "seat": "A2", "tariff": "vip" }
    ]
  }'::jsonb,
  '{
    "ticket_id": 456,
    "selected_tariffs": [
      { "seat": "B1", "tariff": "economy" }
    ]
  }'::jsonb
]
	WHERE user_id=2;