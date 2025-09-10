DELETE FROM menu_categories;

INSERT INTO menu_categories (id, name, slug, description, "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES 
('cmf0llm9l0000vkk84p800i04', 'Seafood', 'seafood', 'Fresh seafood options including boxes, rolls, and dinner plates', NULL, NULL, true, 8, '2025-09-01 04:07:05.721', '2025-09-01 04:07:05.721'),
('cmez5bueu0001vkvsuragc8gi', 'Seafood Plates', 'seafood-plates', 'Seafood dinner plates and entrees', 'cmf0llm9l0000vkk84p800i04', NULL, true, 3, '2025-08-31 03:43:49.687', '2025-09-01 04:50:11.158'),
('cmf1pnx7k0009vk58x1j00wur', 'Appetizers', 'appetizers', '', NULL, NULL, true, 0, '2025-09-01 22:48:37.856', '2025-09-01 22:48:37.856'),
('cmf0llm9o0002vkk8ah0l3w9l', 'Seafood Boxes', 'seafood-boxes', 'Small and Large seafood boxes', 'cmf0llm9l0000vkk84p800i04', NULL, true, 1, '2025-09-01 04:07:05.725', '2025-09-01 17:52:25.048'),
('cmf0llm9r0004vkk848mn4a93', 'Seafood Rolls', 'seafood-rolls', 'Seafood rolls with choice of French Fries or Onion Rings', 'cmf0llm9l0000vkk84p800i04', NULL, true, 2, '2025-09-01 04:07:05.728', '2025-09-01 17:52:36.564'),
('cmf1fm9r30001vkwwsv4n14qt', 'Chicken', 'chicken', '', NULL, NULL, true, 0, '2025-09-01 18:07:24.639', '2025-09-01 18:07:24.639'),
('cmez5buf00005vkvso9m4c4xj', 'Wings', 'wings', 'Chicken wings in various flavors', 'cmf1fm9r30001vkwwsv4n14qt', NULL, true, 11, '2025-08-31 03:43:49.692', '2025-09-01 18:07:42.809'),
('cmez5buf20006vkvsv0wezhi1', 'Fingers', 'fingers', 'Chicken fingers and tenders', 'cmf1fm9r30001vkwwsv4n14qt', NULL, true, 12, '2025-08-31 03:43:49.694', '2025-09-01 18:09:42.126'),
('cmf0cawz80000vkccemljdoul', 'Sandwiches', 'sandwiches', 'Classic sandwiches and burgers', 'cmf1g3aqb0001vkisf6n0t7om', NULL, true, 6, '2025-08-31 23:46:49.842', '2025-09-01 18:21:11.464'),
('cmez4xl780003vkwcly8nts4q', 'Salads', 'salads', 'Fresh, healthy salads with various toppings and dressings', NULL, NULL, true, 1, '2025-08-31 03:32:44.441', '2025-08-31 03:32:44.441'),
('cmez5buep0000vkvs74qojdfm', 'Dinner Plates', 'dinner-plates', 'Hearty dinner plates with sides', NULL, NULL, true, 6, '2025-08-31 03:43:49.681', '2025-08-31 03:43:49.681'),
('cmez5buf50008vkvsbnhrhccb', 'Soups & Chowders', 'soups-chowders', 'Hot soups and chowders', NULL, NULL, true, 14, '2025-08-31 03:43:49.697', '2025-08-31 03:43:49.697'),
('cmez5buf70009vkvsdqx26uux', 'Specialty Items', 'specialty-items', 'Specialty sandwiches and items', NULL, NULL, true, 15, '2025-08-31 03:43:49.699', '2025-08-31 03:43:49.699'),
('cmez5buew0002vkvs0misx39j', 'Hot Subs', 'hot-subs', 'Hot sandwiches and subs', 'cmf1g3aqb0001vkisf6n0t7om', NULL, true, 8, '2025-08-31 03:43:49.688', '2025-09-01 18:21:36.433'),
('cmez5buex0003vkvs8abknm9j', 'Cold Subs', 'cold-subs', 'Cold sandwiches and subs', 'cmf1g3aqb0001vkisf6n0t7om', NULL, true, 9, '2025-08-31 03:43:49.689', '2025-09-01 18:22:05.195'),
('cmez5buey0004vkvs8ypqlpri', 'Steak and Cheese Subs', 'steak-and-cheese-subs', 'Steak and cheese variations', 'cmf1g3aqb0001vkisf6n0t7om', NULL, true, 10, '2025-08-31 03:43:49.691', '2025-09-01 18:22:25.115'),
('cmf1g3aqb0001vkisf6n0t7om', 'Subs & Sandwiches', 'subs-sandwiches', '', NULL, NULL, true, 0, '2025-09-01 18:20:39.059', '2025-09-02 04:31:46.046'),
('cmf283ib1003nvkq0tvwy17r3', 'Build Your salad', 'build-your-salad', '', 'cmez4xl780003vkwcly8nts4q', NULL, true, 0, '2025-09-02 07:24:38.125', '2025-09-02 07:24:38.125');
