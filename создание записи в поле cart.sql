UPDATE users
SET cart = '{
  "cruise_id": 42,
  "tickets": [
    {
      "ticket_id": 101,
      "selected_tariffs": ["adult", "child"]
    },
    {
      "ticket_id": 102,
      "selected_tariffs": ["adult", "adult"]
    }
  ]
}'::jsonb
WHERE user_id = 2;