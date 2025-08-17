--
-- PostgreSQL database dump
--

\restrict mmFufGPmjQSZlwTgx3Jbs0XdWZL5oTNjZRQpYUG7OMmdz9FJD2ExT3XtLbO853X

-- Dumped from database version 14.19
-- Dumped by pg_dump version 14.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public._prisma_migrations VALUES ('400a60d0-a7eb-460e-97db-6a754a5229a3', '0365097d75cabf57d973817d51c9eca88a1e10623e60d7a769c50b09c083b423', '2025-08-16 04:53:06.098944+00', '20250816045302_add_menu_categories', NULL, NULL, '2025-08-16 04:53:02.327436+00', 1);
INSERT INTO public._prisma_migrations VALUES ('d7aa1b69-0ac9-4a32-b9f5-c87e4667e396', 'd4dc22501bd9ee24abb1d19ba72595d0fe51983c1820ab9edfaecdc8ea64af4c', '2025-08-16 09:18:17.701331+00', '20250816091817_add_menu_item_order_tables', NULL, NULL, '2025-08-16 09:18:17.391475+00', 1);
INSERT INTO public._prisma_migrations VALUES ('09e8cb18-f3bc-42d1-b319-1ae01b2268d3', '6be20c5fe2999efadd2d0f48ec183e41fbd961e98001ea02dae4fec5cedc9523', '2025-08-16 09:31:50.53385+00', '20250816093150_unified_order_items', NULL, NULL, '2025-08-16 09:31:50.291501+00', 1);


--
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.app_settings VALUES ('cmeevilxq0000vkxo88s78fgn', 'taxRate', '0.0825', 'NUMBER', '2025-08-16 23:13:45.612', '2025-08-16 23:13:45.612');


--
-- Data for Name: menu_categories; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.menu_categories VALUES ('cmef5tf9i0000vki4nu1ru1r0', 'Salads', 'salads', 'Fresh, crisp salads with premium ingredients', NULL, true, 2, '2025-08-17 04:02:06.343', '2025-08-17 04:02:06.343', NULL);
INSERT INTO public.menu_categories VALUES ('cmef5tfa60001vki4dhxa1tsl', 'Seafood', 'seafood', 'Fresh seafood prepared to perfection', NULL, true, 3, '2025-08-17 04:02:06.343', '2025-08-17 04:02:06.343', NULL);
INSERT INTO public.menu_categories VALUES ('cmef5tfa90002vki495kawde2', 'Sandwiches', 'sandwiches', 'Fresh sandwiches and subs made to order', NULL, true, 1, '2025-08-17 04:02:06.343', '2025-08-17 04:02:06.343', NULL);
INSERT INTO public.menu_categories VALUES ('cmef5tfaa0003vki4u6ekmzq6', 'Dinner Plates', 'dinner-plates', 'Hearty dinner plates with your choice of sides', NULL, true, 4, '2025-08-17 04:02:06.343', '2025-08-17 04:02:06.343', NULL);


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.menu_items VALUES ('cmef5tfxh0036vki4cm5lesno', 'cmef5tfa90002vki495kawde2', 'Turkey Club', 'Sliced turkey, bacon, lettuce, tomato, mayo on toasted bread', 9.99, NULL, true, true, 2, 10, NULL, NULL, '2025-08-17 04:02:07.205', '2025-08-17 04:02:07.205');
INSERT INTO public.menu_items VALUES ('cmef5tfxh0034vki4st3l89ac', 'cmef5tfa90002vki495kawde2', 'Italian Sub', 'Ham, salami, pepperoni, provolone cheese with lettuce, tomato, onion', 8.99, NULL, true, true, 1, 8, NULL, NULL, '2025-08-17 04:02:07.205', '2025-08-17 04:02:07.205');
INSERT INTO public.menu_items VALUES ('cmef5tfxh0035vki4fz8sud31', 'cmef5tfa90002vki495kawde2', 'Chicken Parmesan Sub', 'Breaded chicken, marinara sauce, mozzarella cheese', 10.99, NULL, true, true, 3, 12, NULL, NULL, '2025-08-17 04:02:07.205', '2025-08-17 04:02:07.205');
INSERT INTO public.menu_items VALUES ('cmef5tfyo0039vki4g3od5wim', 'cmef5tf9i0000vki4nu1ru1r0', 'Caesar Salad', 'Romaine lettuce, parmesan cheese, croutons, Caesar dressing', 7.99, NULL, true, true, 1, 5, NULL, NULL, '2025-08-17 04:02:07.248', '2025-08-17 04:02:07.248');
INSERT INTO public.menu_items VALUES ('cmef5tfyo003bvki46o5mdyf7', 'cmef5tf9i0000vki4nu1ru1r0', 'Garden Salad', 'Mixed greens, tomatoes, cucumbers, onions, choice of dressing', 6.99, NULL, true, true, 2, 5, NULL, NULL, '2025-08-17 04:02:07.248', '2025-08-17 04:02:07.248');
INSERT INTO public.menu_items VALUES ('cmef5tfyo003cvki4p6oi7jez', 'cmef5tf9i0000vki4nu1ru1r0', 'Chef Salad', 'Mixed greens, ham, turkey, cheese, hard boiled egg, choice of dressing', 9.99, NULL, true, true, 3, 7, NULL, NULL, '2025-08-17 04:02:07.248', '2025-08-17 04:02:07.248');
INSERT INTO public.menu_items VALUES ('cmef5tfzs003gvki4bxqb7ujp', 'cmef5tfa60001vki4dhxa1tsl', 'Fish and Chips', 'Beer battered cod with crispy french fries', 12.99, NULL, true, true, 3, 18, NULL, NULL, '2025-08-17 04:02:07.289', '2025-08-17 04:02:07.289');
INSERT INTO public.menu_items VALUES ('cmef5tfzs003fvki43tseh6z2', 'cmef5tfa60001vki4dhxa1tsl', 'Atlantic Salmon', 'Fresh Atlantic salmon fillet with your choice of preparation and seasoning', 16.99, NULL, true, true, 1, 15, NULL, NULL, '2025-08-17 04:02:07.288', '2025-08-17 04:02:07.288');
INSERT INTO public.menu_items VALUES ('cmef5tfzt003ivki4d8ox3hqv', 'cmef5tfa60001vki4dhxa1tsl', 'Shrimp Scampi', 'Large shrimp sautéed in garlic butter sauce', 14.99, NULL, true, true, 2, 12, NULL, NULL, '2025-08-17 04:02:07.289', '2025-08-17 04:02:07.289');
INSERT INTO public.menu_items VALUES ('cmef5tg0z003mvki4p5lt148y', 'cmef5tfaa0003vki4u6ekmzq6', 'Grilled Chicken Dinner', 'Grilled chicken breast with your choice of 2 sides', 13.99, NULL, true, true, 1, 20, NULL, NULL, '2025-08-17 04:02:07.331', '2025-08-17 04:02:07.331');
INSERT INTO public.menu_items VALUES ('cmef5tg0z003ovki4qj1klike', 'cmef5tfaa0003vki4u6ekmzq6', 'BBQ Ribs Dinner', 'Half rack of BBQ ribs with your choice of 2 sides', 17.99, NULL, true, true, 2, 25, NULL, NULL, '2025-08-17 04:02:07.331', '2025-08-17 04:02:07.331');
INSERT INTO public.menu_items VALUES ('cmef5tg0z003nvki4ki75gu9k', 'cmef5tfaa0003vki4u6ekmzq6', 'Meatloaf Dinner', 'Homestyle meatloaf with gravy and your choice of 2 sides', 12.99, NULL, true, true, 3, 18, NULL, NULL, '2025-08-17 04:02:07.331', '2025-08-17 04:02:07.331');


--
-- Data for Name: pizza_crusts; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.pizza_crusts VALUES ('cmedtz4uq0002vk4klzs7jjwx', 'THICK CRUST', 'Deep dish style', 2, true, 0, '2025-08-16 05:42:51.218', '2025-08-16 05:42:51.218');
INSERT INTO public.pizza_crusts VALUES ('cmedtz4u50001vk4kc54gk39n', 'REGULAR CRUST', 'Classic hand-tossed', 0, true, 0, '2025-08-16 05:42:51.197', '2025-08-16 05:57:15.392');
INSERT INTO public.pizza_crusts VALUES ('cmedtz4sw0000vk4k0bft96ej', 'THIN CRUST', 'Crispy and light', 2, true, 0, '2025-08-16 05:42:51.152', '2025-08-16 05:57:28.187');
INSERT INTO public.pizza_crusts VALUES ('cmeevim1w0005vkxol59mvqka', 'Thin Crust', 'Crispy and light', 0, true, 1, '2025-08-16 23:13:45.764', '2025-08-16 23:13:45.764');
INSERT INTO public.pizza_crusts VALUES ('cmeevim3g0006vkxoquirys39', 'Hand-Tossed', 'Classic, chewy crust', 0, true, 2, '2025-08-16 23:13:45.82', '2025-08-16 23:13:45.82');
INSERT INTO public.pizza_crusts VALUES ('cmeevim5l0007vkxom5nmq46q', 'Stuffed Crust', 'Cheese-filled crust', 3, true, 3, '2025-08-16 23:13:45.897', '2025-08-16 23:13:45.897');
INSERT INTO public.pizza_crusts VALUES ('cmeevim6r0008vkxo8a8ap1dx', 'Cauliflower Crust', 'Gluten-free option', 2.5, true, 4, '2025-08-16 23:13:45.939', '2025-08-16 23:13:45.939');


--
-- Data for Name: pizza_sauces; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.pizza_sauces VALUES ('cmedtz4vb0003vk4kdd41lpsl', 'ORIGINAL PIZZA', 'Classic tomato sauce', '#CC0000', 1, 0, true, 0, '2025-08-16 05:42:51.24', '2025-08-16 05:42:51.24');
INSERT INTO public.pizza_sauces VALUES ('cmedtz4vz0004vk4kafl7bpgd', 'BBQ SAUCE', 'Smoky barbecue', '#8B4513', 2, 0.5, true, 0, '2025-08-16 05:42:51.263', '2025-08-16 05:42:51.263');
INSERT INTO public.pizza_sauces VALUES ('cmedtz4wk0005vk4k83ai9zsv', 'WHITE SAUCE', 'Creamy garlic', '#FFFFFF', 0, 0.75, true, 0, '2025-08-16 05:42:51.285', '2025-08-16 05:42:51.285');
INSERT INTO public.pizza_sauces VALUES ('cmeevim7w0009vkxow3b5mquc', 'Marinara', 'Classic tomato sauce', '#e53e3e', 0, 0, true, 1, '2025-08-16 23:13:45.98', '2025-08-16 23:13:45.98');
INSERT INTO public.pizza_sauces VALUES ('cmeevim9f000avkxonr0ogyxu', 'Alfredo', 'Creamy white sauce', '#f7fafc', 0, 1.5, true, 2, '2025-08-16 23:13:46.036', '2025-08-16 23:13:46.036');
INSERT INTO public.pizza_sauces VALUES ('cmeevimam000bvkxo9jlf6b9v', 'BBQ Sauce', 'Smoky and sweet', '#8a380c', 1, 1, true, 3, '2025-08-16 23:13:46.079', '2025-08-16 23:13:46.079');
INSERT INTO public.pizza_sauces VALUES ('cmeevimbq000cvkxoc52xpn7h', 'Pesto', 'Basil and garlic sauce', '#38a169', 0, 1.5, true, 4, '2025-08-16 23:13:46.118', '2025-08-16 23:13:46.118');


--
-- Data for Name: pizza_sizes; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.pizza_sizes VALUES ('cmedughin0000vkjwzquehzwn', 'Small', 'Small', 11.5, true, 0, NULL, '2025-08-16 05:56:20.782', '2025-08-16 05:56:20.782');
INSERT INTO public.pizza_sizes VALUES ('cmeduh41j0001vkjwnk2k9s73', 'Large', 'Large', 16.5, true, 0, NULL, '2025-08-16 05:56:49.974', '2025-08-16 05:56:49.974');
INSERT INTO public.pizza_sizes VALUES ('cmeevilzg0002vkxo9zub3l22', 'Medium', '12"', 15.99, true, 2, NULL, '2025-08-16 23:13:45.676', '2025-08-16 23:13:45.676');
INSERT INTO public.pizza_sizes VALUES ('cmeevim0u0004vkxorbh41esp', 'Extra Large', '18"', 21.99, true, 4, NULL, '2025-08-16 23:13:45.726', '2025-08-16 23:13:45.726');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.users VALUES ('cmedt5v0x0000vk6ozug7dkk9', 'admin@pizzabuilder.com', 'Pizza Admin', '$2b$10$6Y2BlqSBDU/i5ivP0GnCJO.7QmSkrQHZbGrQADbF2AEeH48bPmivK', 'ADMIN', '2025-08-16 05:20:05.457', '2025-08-16 05:20:05.457');


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: restobuilder
--



--
-- Data for Name: customization_groups; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.customization_groups VALUES ('cmef5tfbd0004vki4v6fb8du3', NULL, 'Size', 'Choose your size', 'SINGLE_SELECT', true, 1, 1, 1, true, '2025-08-17 04:02:06.409', '2025-08-17 04:02:06.409');
INSERT INTO public.customization_groups VALUES ('cmef5tfbz0006vki48pfi6918', 'cmef5tfa90002vki495kawde2', 'Bread', 'Choose your bread', 'SINGLE_SELECT', true, 1, 1, 2, true, '2025-08-17 04:02:06.432', '2025-08-17 04:02:06.432');
INSERT INTO public.customization_groups VALUES ('cmef5tfcm0008vki4j55wm3px', 'cmef5tfa90002vki495kawde2', 'Condiments', 'Add condiments', 'MULTI_SELECT', false, 0, NULL, 3, true, '2025-08-17 04:02:06.455', '2025-08-17 04:02:06.455');
INSERT INTO public.customization_groups VALUES ('cmef5tfd7000avki4hse70hec', 'cmef5tfa90002vki495kawde2', 'Toppings', 'Add toppings', 'MULTI_SELECT', false, 0, NULL, 4, true, '2025-08-17 04:02:06.476', '2025-08-17 04:02:06.476');
INSERT INTO public.customization_groups VALUES ('cmef5tfdr000cvki4amx64zle', 'cmef5tf9i0000vki4nu1ru1r0', 'Protein', 'Add protein', 'SINGLE_SELECT', false, 0, 1, 2, true, '2025-08-17 04:02:06.496', '2025-08-17 04:02:06.496');
INSERT INTO public.customization_groups VALUES ('cmef5tfed000evki49zjk8ktf', 'cmef5tf9i0000vki4nu1ru1r0', 'Dressing', 'Choose your dressing', 'SINGLE_SELECT', true, 1, 1, 3, true, '2025-08-17 04:02:06.517', '2025-08-17 04:02:06.517');
INSERT INTO public.customization_groups VALUES ('cmef5tffh000gvki42l5mtuog', 'cmef5tf9i0000vki4nu1ru1r0', 'Extra Toppings', 'Add extra toppings', 'MULTI_SELECT', false, 0, NULL, 4, true, '2025-08-17 04:02:06.557', '2025-08-17 04:02:06.557');
INSERT INTO public.customization_groups VALUES ('cmef5tfgz000ivki4512kikx7', 'cmef5tfa60001vki4dhxa1tsl', 'Preparation', 'How would you like it prepared?', 'SINGLE_SELECT', true, 1, 1, 2, true, '2025-08-17 04:02:06.612', '2025-08-17 04:02:06.612');
INSERT INTO public.customization_groups VALUES ('cmef5tfhl000kvki4bzsf4qps', 'cmef5tfa60001vki4dhxa1tsl', 'Seasoning', 'Choose your seasoning', 'SINGLE_SELECT', true, 1, 1, 3, true, '2025-08-17 04:02:06.633', '2025-08-17 04:02:06.633');
INSERT INTO public.customization_groups VALUES ('cmef5tfi6000mvki4931fkwv3', 'cmef5tfa60001vki4dhxa1tsl', 'Side Dish', 'Choose a side dish', 'SINGLE_SELECT', false, 0, 1, 4, true, '2025-08-17 04:02:06.655', '2025-08-17 04:02:06.655');
INSERT INTO public.customization_groups VALUES ('cmef5tfiq000ovki48jbwi2av', 'cmef5tfaa0003vki4u6ekmzq6', 'Sides', 'Choose 2 of 3 sides', 'SPECIAL_LOGIC', true, 2, 2, 2, true, '2025-08-17 04:02:06.674', '2025-08-17 04:02:06.674');


--
-- Data for Name: customization_options; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.customization_options VALUES ('cmef5tfjd000svki4nrxvlnjr', 'cmef5tfbd0004vki4v6fb8du3', 'Large', 'For big appetites', 4, 'FLAT', false, true, 3, NULL, NULL, NULL, '2025-08-17 04:02:06.697', '2025-08-17 04:02:06.697');
INSERT INTO public.customization_options VALUES ('cmef5tfjd000tvki4swal33co', 'cmef5tfbd0004vki4v6fb8du3', 'Small', 'Perfect for light appetite', 0, 'FLAT', false, true, 1, NULL, NULL, NULL, '2025-08-17 04:02:06.697', '2025-08-17 04:02:06.697');
INSERT INTO public.customization_options VALUES ('cmef5tfjd000uvki4vznoqsoz', 'cmef5tfbd0004vki4v6fb8du3', 'Regular', 'Our most popular size', 2, 'FLAT', true, true, 2, NULL, NULL, NULL, '2025-08-17 04:02:06.697', '2025-08-17 04:02:06.697');
INSERT INTO public.customization_options VALUES ('cmef5tfl4000yvki4bnmgha0d', 'cmef5tfbz0006vki48pfi6918', 'Italian', 'Fresh Italian bread', 1, 'FLAT', false, true, 4, NULL, NULL, NULL, '2025-08-17 04:02:06.76', '2025-08-17 04:02:06.76');
INSERT INTO public.customization_options VALUES ('cmef5tfl40011vki4or4z784h', 'cmef5tfbz0006vki48pfi6918', 'White', 'Classic white bread', 0, 'FLAT', true, true, 1, NULL, NULL, NULL, '2025-08-17 04:02:06.76', '2025-08-17 04:02:06.76');
INSERT INTO public.customization_options VALUES ('cmef5tfl40010vki4x8y1rzh5', 'cmef5tfbz0006vki48pfi6918', 'Wheat', 'Whole wheat bread', 0.5, 'FLAT', false, true, 2, NULL, NULL, NULL, '2025-08-17 04:02:06.76', '2025-08-17 04:02:06.76');
INSERT INTO public.customization_options VALUES ('cmef5tfmr0018vki4jmihhhq3', 'cmef5tfcm0008vki4j55wm3px', 'Ranch', 'Creamy ranch dressing', 0.5, 'FLAT', false, true, 4, NULL, NULL, NULL, '2025-08-17 04:02:06.819', '2025-08-17 04:02:06.819');
INSERT INTO public.customization_options VALUES ('cmef5tfmr0019vki46n4g5sbw', 'cmef5tfcm0008vki4j55wm3px', 'Ketchup', 'Tomato ketchup', 0, 'FLAT', false, true, 3, NULL, NULL, NULL, '2025-08-17 04:02:06.819', '2025-08-17 04:02:06.819');
INSERT INTO public.customization_options VALUES ('cmef5tfmr0017vki4vy8p94wg', 'cmef5tfcm0008vki4j55wm3px', 'Mayo', 'Creamy mayonnaise', 0, 'FLAT', false, true, 1, NULL, NULL, NULL, '2025-08-17 04:02:06.819', '2025-08-17 04:02:06.819');
INSERT INTO public.customization_options VALUES ('cmef5tfny001evki4sqi93uvj', 'cmef5tfd7000avki4hse70hec', 'Lettuce', 'Fresh crisp lettuce', 0, 'FLAT', false, true, 1, NULL, NULL, NULL, '2025-08-17 04:02:06.862', '2025-08-17 04:02:06.862');
INSERT INTO public.customization_options VALUES ('cmef5tfny001fvki4yrbb4ld9', 'cmef5tfd7000avki4hse70hec', 'Tomato', 'Fresh sliced tomatoes', 0, 'FLAT', false, true, 2, NULL, NULL, NULL, '2025-08-17 04:02:06.862', '2025-08-17 04:02:06.862');
INSERT INTO public.customization_options VALUES ('cmef5tfny001ivki4lc7dk1jf', 'cmef5tfd7000avki4hse70hec', 'Cheese', 'American cheese slice', 1.5, 'FLAT', false, true, 4, NULL, NULL, NULL, '2025-08-17 04:02:06.862', '2025-08-17 04:02:06.862');
INSERT INTO public.customization_options VALUES ('cmef5tfpm001qvki4g54nadu2', 'cmef5tfdr000cvki4amx64zle', 'Grilled Chicken', 'Tender grilled chicken breast', 4, 'FLAT', false, true, 1, NULL, NULL, NULL, '2025-08-17 04:02:06.922', '2025-08-17 04:02:06.922');
INSERT INTO public.customization_options VALUES ('cmef5tfpm001svki4sjr8rug0', 'cmef5tfdr000cvki4amx64zle', 'Salmon', 'Fresh grilled salmon', 8, 'FLAT', false, true, 3, NULL, NULL, NULL, '2025-08-17 04:02:06.922', '2025-08-17 04:02:06.922');
INSERT INTO public.customization_options VALUES ('cmef5tfqq001zvki46mg2x50o', 'cmef5tfed000evki49zjk8ktf', 'Italian', 'Zesty Italian dressing', 0, 'FLAT', false, true, 2, NULL, NULL, NULL, '2025-08-17 04:02:06.962', '2025-08-17 04:02:06.962');
INSERT INTO public.customization_options VALUES ('cmef5tfqq001xvki4lt0otezo', 'cmef5tfed000evki49zjk8ktf', 'Caesar', 'Classic Caesar dressing', 0, 'FLAT', false, true, 3, NULL, NULL, NULL, '2025-08-17 04:02:06.962', '2025-08-17 04:02:06.962');
INSERT INTO public.customization_options VALUES ('cmef5tfrt0025vki42kgnlx0q', 'cmef5tffh000gvki42l5mtuog', 'Extra Cheese', 'Additional shredded cheese', 1.5, 'FLAT', false, true, 2, NULL, NULL, NULL, '2025-08-17 04:02:07.002', '2025-08-17 04:02:07.002');
INSERT INTO public.customization_options VALUES ('cmef5tfsy002cvki4na6nllke', 'cmef5tfgz000ivki4512kikx7', 'Baked', 'Oven baked', 0, 'FLAT', false, true, 3, NULL, NULL, NULL, '2025-08-17 04:02:07.042', '2025-08-17 04:02:07.042');
INSERT INTO public.customization_options VALUES ('cmef5tfsy002evki4wsv72dyr', 'cmef5tfgz000ivki4512kikx7', 'Blackened', 'Cajun blackened', 1, 'FLAT', false, true, 4, NULL, NULL, NULL, '2025-08-17 04:02:07.042', '2025-08-17 04:02:07.042');
INSERT INTO public.customization_options VALUES ('cmef5tfu4002mvki40cibmv4d', 'cmef5tfhl000kvki4bzsf4qps', 'Garlic Herb', 'Garlic and herb blend', 0, 'FLAT', false, true, 3, NULL, NULL, NULL, '2025-08-17 04:02:07.085', '2025-08-17 04:02:07.085');
INSERT INTO public.customization_options VALUES ('cmef5tfu4002kvki42th9d7c5', 'cmef5tfhl000kvki4bzsf4qps', 'Plain', 'No seasoning', 0, 'FLAT', false, true, 4, NULL, NULL, NULL, '2025-08-17 04:02:07.085', '2025-08-17 04:02:07.085');
INSERT INTO public.customization_options VALUES ('cmef5tfv9002tvki49fqn3jm8', 'cmef5tfi6000mvki4931fkwv3', 'Rice Pilaf', 'Seasoned rice pilaf', 3, 'FLAT', false, true, 2, NULL, NULL, NULL, '2025-08-17 04:02:07.125', '2025-08-17 04:02:07.125');
INSERT INTO public.customization_options VALUES ('cmef5tfv9002rvki49o7jc4wh', 'cmef5tfi6000mvki4931fkwv3', 'Coleslaw', 'Creamy coleslaw', 2.5, 'FLAT', false, true, 4, NULL, NULL, NULL, '2025-08-17 04:02:07.125', '2025-08-17 04:02:07.125');
INSERT INTO public.customization_options VALUES ('cmef5tfwd002zvki47jgtq9tj', 'cmef5tfiq000ovki48jbwi2av', 'Green Beans', 'Fresh green beans', 0, 'FLAT', false, true, 2, NULL, NULL, NULL, '2025-08-17 04:02:07.165', '2025-08-17 04:02:07.165');
INSERT INTO public.customization_options VALUES ('cmef5tfl40012vki409c59a20', 'cmef5tfbz0006vki48pfi6918', 'Sourdough', 'Tangy sourdough bread', 1, 'FLAT', false, true, 3, NULL, NULL, NULL, '2025-08-17 04:02:06.76', '2025-08-17 04:02:06.76');
INSERT INTO public.customization_options VALUES ('cmef5tfmr001avki4zm21ofru', 'cmef5tfcm0008vki4j55wm3px', 'Mustard', 'Classic yellow mustard', 0, 'FLAT', false, true, 2, NULL, NULL, NULL, '2025-08-17 04:02:06.819', '2025-08-17 04:02:06.819');
INSERT INTO public.customization_options VALUES ('cmef5tfny001hvki4e27y6nt5', 'cmef5tfd7000avki4hse70hec', 'Onion', 'Fresh sliced onions', 0, 'FLAT', false, true, 3, NULL, NULL, NULL, '2025-08-17 04:02:06.862', '2025-08-17 04:02:06.862');
INSERT INTO public.customization_options VALUES ('cmef5tfpm001rvki48rpgllwm', 'cmef5tfdr000cvki4amx64zle', 'Turkey', 'Sliced turkey breast', 3, 'FLAT', false, true, 4, NULL, NULL, NULL, '2025-08-17 04:02:06.922', '2025-08-17 04:02:06.922');
INSERT INTO public.customization_options VALUES ('cmef5tfqq0020vki4zprwc14d', 'cmef5tfed000evki49zjk8ktf', 'Ranch', 'Creamy ranch dressing', 0, 'FLAT', true, true, 1, NULL, NULL, NULL, '2025-08-17 04:02:06.962', '2025-08-17 04:02:06.962');
INSERT INTO public.customization_options VALUES ('cmef5tfrt0026vki4z4lohsar', 'cmef5tffh000gvki42l5mtuog', 'Croutons', 'Crunchy garlic croutons', 1, 'FLAT', false, true, 1, NULL, NULL, NULL, '2025-08-17 04:02:07.002', '2025-08-17 04:02:07.002');
INSERT INTO public.customization_options VALUES ('cmef5tfsy002bvki4ypkgdgn9', 'cmef5tfgz000ivki4512kikx7', 'Grilled', 'Grilled to perfection', 0, 'FLAT', true, true, 1, NULL, NULL, NULL, '2025-08-17 04:02:07.042', '2025-08-17 04:02:07.042');
INSERT INTO public.customization_options VALUES ('cmef5tfu4002ivki4yx9peiq7', 'cmef5tfhl000kvki4bzsf4qps', 'Cajun', 'Spicy Cajun seasoning', 0, 'FLAT', false, true, 2, NULL, NULL, NULL, '2025-08-17 04:02:07.085', '2025-08-17 04:02:07.085');
INSERT INTO public.customization_options VALUES ('cmef5tfv9002uvki4ou47w89u', 'cmef5tfi6000mvki4931fkwv3', 'Steamed Vegetables', 'Fresh steamed vegetables', 3.5, 'FLAT', false, true, 3, NULL, NULL, NULL, '2025-08-17 04:02:07.125', '2025-08-17 04:02:07.125');
INSERT INTO public.customization_options VALUES ('cmef5tfwd002yvki42en1faz0', 'cmef5tfiq000ovki48jbwi2av', 'Mashed Potatoes', 'Creamy mashed potatoes', 0, 'FLAT', false, true, 1, NULL, NULL, NULL, '2025-08-17 04:02:07.165', '2025-08-17 04:02:07.165');
INSERT INTO public.customization_options VALUES ('cmef5tfoo001kvki4xxnrpj1a', 'cmef5tfd7000avki4hse70hec', 'Bacon', 'Crispy bacon strips', 2.5, 'FLAT', false, true, 5, NULL, NULL, NULL, '2025-08-17 04:02:06.862', '2025-08-17 04:02:06.862');
INSERT INTO public.customization_options VALUES ('cmef5tfpm001pvki4fv269ybi', 'cmef5tfdr000cvki4amx64zle', 'Grilled Shrimp', 'Seasoned grilled shrimp', 6, 'FLAT', false, true, 2, NULL, NULL, NULL, '2025-08-17 04:02:06.922', '2025-08-17 04:02:06.922');
INSERT INTO public.customization_options VALUES ('cmef5tfqq001yvki4kmg5dgxq', 'cmef5tfed000evki49zjk8ktf', 'Balsamic', 'Balsamic vinaigrette', 0, 'FLAT', false, true, 4, NULL, NULL, NULL, '2025-08-17 04:02:06.962', '2025-08-17 04:02:06.962');
INSERT INTO public.customization_options VALUES ('cmef5tfrt0024vki4fc68i28l', 'cmef5tffh000gvki42l5mtuog', 'Avocado', 'Fresh sliced avocado', 2.5, 'FLAT', false, true, 3, NULL, NULL, NULL, '2025-08-17 04:02:07.002', '2025-08-17 04:02:07.002');
INSERT INTO public.customization_options VALUES ('cmef5tfsy002dvki4xlavmuft', 'cmef5tfgz000ivki4512kikx7', 'Fried', 'Golden fried', 0, 'FLAT', false, true, 2, NULL, NULL, NULL, '2025-08-17 04:02:07.042', '2025-08-17 04:02:07.042');
INSERT INTO public.customization_options VALUES ('cmef5tfu4002lvki45h1r31gb', 'cmef5tfhl000kvki4bzsf4qps', 'Lemon Pepper', 'Zesty lemon pepper seasoning', 0, 'FLAT', true, true, 1, NULL, NULL, NULL, '2025-08-17 04:02:07.085', '2025-08-17 04:02:07.085');
INSERT INTO public.customization_options VALUES ('cmef5tfv9002svki4lnro7fyk', 'cmef5tfi6000mvki4931fkwv3', 'French Fries', 'Crispy golden fries', 3, 'FLAT', false, true, 1, NULL, NULL, NULL, '2025-08-17 04:02:07.125', '2025-08-17 04:02:07.125');
INSERT INTO public.customization_options VALUES ('cmef5tfwd0030vki44907g740', 'cmef5tfiq000ovki48jbwi2av', 'Mac and Cheese', 'Creamy mac and cheese', 0, 'FLAT', false, true, 3, NULL, NULL, NULL, '2025-08-17 04:02:07.165', '2025-08-17 04:02:07.165');


--
-- Data for Name: cart_item_customizations; Type: TABLE DATA; Schema: public; Owner: restobuilder
--



--
-- Data for Name: pizza_toppings; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.pizza_toppings VALUES ('cmedtz4x50006vk4kkt5ntf7v', 'EXTRA CHEESE', NULL, 'CHEESE', 2, true, 0, true, false, false, '2025-08-16 05:42:51.306', '2025-08-16 05:42:51.306');
INSERT INTO public.pizza_toppings VALUES ('cmedtz4xs0007vk4k2czguwk2', 'PEPPERONI', NULL, 'MEAT', 2.5, true, 0, false, false, false, '2025-08-16 05:42:51.328', '2025-08-16 05:42:51.328');
INSERT INTO public.pizza_toppings VALUES ('cmedtz4yu0008vk4kfqochmjz', 'MUSHROOMS', NULL, 'VEGETABLE', 1.5, true, 0, true, false, false, '2025-08-16 05:42:51.366', '2025-08-16 05:42:51.366');
INSERT INTO public.pizza_toppings VALUES ('cmedtz4zv0009vk4k7refm0lf', 'ITALIAN SAUSAGE', NULL, 'MEAT', 2.75, true, 0, false, false, false, '2025-08-16 05:42:51.403', '2025-08-16 05:42:51.403');
INSERT INTO public.pizza_toppings VALUES ('cmedtz50g000avk4k6mgg7u20', 'GREEN PEPPERS', NULL, 'VEGETABLE', 1.25, true, 0, true, false, false, '2025-08-16 05:42:51.424', '2025-08-16 05:42:51.424');
INSERT INTO public.pizza_toppings VALUES ('cmeevimcu000dvkxoa3jsk4x3', 'Pepperoni', NULL, 'MEAT', 2, true, 1, false, false, false, '2025-08-16 23:13:46.159', '2025-08-16 23:13:46.159');
INSERT INTO public.pizza_toppings VALUES ('cmeevimej000evkxoqst73crk', 'Sausage', NULL, 'MEAT', 2, true, 2, false, false, false, '2025-08-16 23:13:46.219', '2025-08-16 23:13:46.219');
INSERT INTO public.pizza_toppings VALUES ('cmeevimfo000fvkxoq8201k2i', 'Bacon', NULL, 'MEAT', 2.5, true, 3, false, false, false, '2025-08-16 23:13:46.26', '2025-08-16 23:13:46.26');
INSERT INTO public.pizza_toppings VALUES ('cmeevimgt000gvkxof0m6leje', 'Ham', NULL, 'MEAT', 2, true, 4, false, false, false, '2025-08-16 23:13:46.301', '2025-08-16 23:13:46.301');
INSERT INTO public.pizza_toppings VALUES ('cmeevimhw000hvkxozgngi6z8', 'Chicken', NULL, 'MEAT', 2.5, true, 5, false, false, false, '2025-08-16 23:13:46.34', '2025-08-16 23:13:46.34');
INSERT INTO public.pizza_toppings VALUES ('cmeevimj2000ivkxo6k7jpkqp', 'Mushrooms', NULL, 'VEGETABLE', 1.5, true, 10, true, true, false, '2025-08-16 23:13:46.382', '2025-08-16 23:13:46.382');
INSERT INTO public.pizza_toppings VALUES ('cmeevimk9000jvkxo757ew4i3', 'Onions', NULL, 'VEGETABLE', 1, true, 11, true, true, false, '2025-08-16 23:13:46.426', '2025-08-16 23:13:46.426');
INSERT INTO public.pizza_toppings VALUES ('cmeeviml4000kvkxom5yve4wj', 'Green Peppers', NULL, 'VEGETABLE', 1.5, true, 12, true, true, false, '2025-08-16 23:13:46.456', '2025-08-16 23:13:46.456');
INSERT INTO public.pizza_toppings VALUES ('cmeevimlw000lvkxof6wrc283', 'Black Olives', NULL, 'VEGETABLE', 1.5, true, 13, true, true, false, '2025-08-16 23:13:46.484', '2025-08-16 23:13:46.484');
INSERT INTO public.pizza_toppings VALUES ('cmeevimml000mvkxonca8tu7y', 'Tomatoes', NULL, 'VEGETABLE', 1.5, true, 14, true, true, false, '2025-08-16 23:13:46.509', '2025-08-16 23:13:46.509');
INSERT INTO public.pizza_toppings VALUES ('cmeevimn9000nvkxov3u1nue9', 'Spinach', NULL, 'VEGETABLE', 1.5, true, 15, true, true, false, '2025-08-16 23:13:46.533', '2025-08-16 23:13:46.533');
INSERT INTO public.pizza_toppings VALUES ('cmeevimny000ovkxo1b7w4w83', 'Extra Cheese', NULL, 'CHEESE', 2, true, 20, true, false, false, '2025-08-16 23:13:46.558', '2025-08-16 23:13:46.558');
INSERT INTO public.pizza_toppings VALUES ('cmeevimon000pvkxoatos8rzw', 'Feta Cheese', NULL, 'CHEESE', 2.5, true, 21, true, false, false, '2025-08-16 23:13:46.583', '2025-08-16 23:13:46.583');
INSERT INTO public.pizza_toppings VALUES ('cmeevimpc000qvkxo1ac78nfo', 'Goat Cheese', NULL, 'CHEESE', 3, true, 22, true, false, false, '2025-08-16 23:13:46.608', '2025-08-16 23:13:46.608');
INSERT INTO public.pizza_toppings VALUES ('cmeevimq7000rvkxojm1rqsby', 'Pineapple', NULL, 'SPECIALTY', 1.5, true, 30, true, true, false, '2025-08-16 23:13:46.639', '2025-08-16 23:13:46.639');
INSERT INTO public.pizza_toppings VALUES ('cmeevimr4000svkxoq8k3bpt9', 'Jalapeños', NULL, 'SPECIALTY', 1.5, true, 31, true, true, false, '2025-08-16 23:13:46.672', '2025-08-16 23:13:46.672');


--
-- Data for Name: cart_item_pizza_toppings; Type: TABLE DATA; Schema: public; Owner: restobuilder
--



--
-- Data for Name: modifiers; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.modifiers VALUES ('cmeeyvoob0000vkbsqexdy8yj', 'Extra Cheese', 'TOPPING', 2.5, true, '2025-08-17 00:47:54.539', '2025-08-17 00:47:54.539');
INSERT INTO public.modifiers VALUES ('cmeeyvoqj0001vkbsjao4brry', 'Pepperoni', 'TOPPING', 3, true, '2025-08-17 00:47:54.619', '2025-08-17 00:47:54.619');
INSERT INTO public.modifiers VALUES ('cmeeyvos10002vkbs07m1lajh', 'Mushrooms', 'TOPPING', 2, true, '2025-08-17 00:47:54.673', '2025-08-17 00:47:54.673');
INSERT INTO public.modifiers VALUES ('cmeeyvot50003vkbsn2q0dywc', 'French Fries', 'SIDE', 4.99, true, '2025-08-17 00:47:54.714', '2025-08-17 00:47:54.714');
INSERT INTO public.modifiers VALUES ('cmeeyvoua0004vkbshsn253wx', 'Onion Rings', 'SIDE', 5.99, true, '2025-08-17 00:47:54.755', '2025-08-17 00:47:54.755');
INSERT INTO public.modifiers VALUES ('cmeeyvowb0005vkbsew0j4toz', 'Ranch Dressing', 'DRESSING', 0.5, true, '2025-08-17 00:47:54.828', '2025-08-17 00:47:54.828');
INSERT INTO public.modifiers VALUES ('cmeeyvowy0006vkbshi9bvglu', 'Caesar Dressing', 'DRESSING', 0.5, true, '2025-08-17 00:47:54.851', '2025-08-17 00:47:54.851');
INSERT INTO public.modifiers VALUES ('cmeeyvoxl0007vkbsfxar772t', 'Ketchup', 'CONDIMENT', 0, true, '2025-08-17 00:47:54.874', '2025-08-17 00:47:54.874');
INSERT INTO public.modifiers VALUES ('cmeeyvoy80008vkbslnwzdldj', 'Mustard', 'CONDIMENT', 0, true, '2025-08-17 00:47:54.896', '2025-08-17 00:47:54.896');
INSERT INTO public.modifiers VALUES ('cmeeyvozd0009vkbsa37pjiox', 'Large', 'SIZE', 3, true, '2025-08-17 00:47:54.938', '2025-08-17 00:47:54.938');
INSERT INTO public.modifiers VALUES ('cmeeyvozz000avkbsr9j36rxp', 'Medium', 'SIZE', 1.5, true, '2025-08-17 00:47:54.96', '2025-08-17 00:47:54.96');
INSERT INTO public.modifiers VALUES ('cmeeyvp0l000bvkbs6m8t6zmr', 'Small', 'SIZE', 0, true, '2025-08-17 00:47:54.981', '2025-08-17 00:47:54.981');


--
-- Data for Name: item_modifiers; Type: TABLE DATA; Schema: public; Owner: restobuilder
--



--
-- Data for Name: jwt_blacklist; Type: TABLE DATA; Schema: public; Owner: restobuilder
--



--
-- Data for Name: jwt_secrets; Type: TABLE DATA; Schema: public; Owner: restobuilder
--



--
-- Data for Name: menu_item_customizations; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.menu_item_customizations VALUES ('cmef5tg23003tvki43oq9oq6h', 'cmef5tfxh0034vki4st3l89ac', 'cmef5tfcm0008vki4j55wm3px', false, 3, '2025-08-17 04:02:07.371');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg23003wvki4qb8or37i', 'cmef5tfxh0034vki4st3l89ac', 'cmef5tfd7000avki4hse70hec', false, 4, '2025-08-17 04:02:07.371');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg23003svki41wrta3r3', 'cmef5tfxh0034vki4st3l89ac', 'cmef5tfbd0004vki4v6fb8du3', true, 1, '2025-08-17 04:02:07.371');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg23003vvki400rsobsw', 'cmef5tfxh0034vki4st3l89ac', 'cmef5tfbz0006vki48pfi6918', true, 2, '2025-08-17 04:02:07.371');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg380042vki4vc4pmmc4', 'cmef5tfxh0036vki4cm5lesno', 'cmef5tfcm0008vki4j55wm3px', false, 3, '2025-08-17 04:02:07.412');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg380041vki4lrunzdya', 'cmef5tfxh0036vki4cm5lesno', 'cmef5tfbd0004vki4v6fb8du3', true, 1, '2025-08-17 04:02:07.412');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg380043vki4lgk6p2rx', 'cmef5tfxh0036vki4cm5lesno', 'cmef5tfbz0006vki48pfi6918', true, 2, '2025-08-17 04:02:07.412');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg380044vki4fl53funr', 'cmef5tfxh0036vki4cm5lesno', 'cmef5tfd7000avki4hse70hec', false, 4, '2025-08-17 04:02:07.412');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg4b004avki45edymf2a', 'cmef5tfxh0035vki4fz8sud31', 'cmef5tfbz0006vki48pfi6918', true, 2, '2025-08-17 04:02:07.452');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg4b0049vki4jg13s2p3', 'cmef5tfxh0035vki4fz8sud31', 'cmef5tfbd0004vki4v6fb8du3', true, 1, '2025-08-17 04:02:07.452');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg4b004bvki4lwlkk37f', 'cmef5tfxh0035vki4fz8sud31', 'cmef5tfcm0008vki4j55wm3px', false, 3, '2025-08-17 04:02:07.452');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg4b004cvki4t3iz6o6c', 'cmef5tfxh0035vki4fz8sud31', 'cmef5tfd7000avki4hse70hec', false, 4, '2025-08-17 04:02:07.452');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg5f004kvki4e2625qif', 'cmef5tfyo0039vki4g3od5wim', 'cmef5tfdr000cvki4amx64zle', false, 2, '2025-08-17 04:02:07.492');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg5f004ivki40oyfnwdj', 'cmef5tfyo0039vki4g3od5wim', 'cmef5tfed000evki49zjk8ktf', true, 3, '2025-08-17 04:02:07.492');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg5f004jvki4zv1d2zg5', 'cmef5tfyo0039vki4g3od5wim', 'cmef5tffh000gvki42l5mtuog', false, 4, '2025-08-17 04:02:07.492');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg5f004hvki4lytjcjg0', 'cmef5tfyo0039vki4g3od5wim', 'cmef5tfbd0004vki4v6fb8du3', true, 1, '2025-08-17 04:02:07.492');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg6n004qvki4p0823szt', 'cmef5tfyo003bvki46o5mdyf7', 'cmef5tfdr000cvki4amx64zle', false, 2, '2025-08-17 04:02:07.535');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg6n004rvki4i4tyjycl', 'cmef5tfyo003bvki46o5mdyf7', 'cmef5tfed000evki49zjk8ktf', true, 3, '2025-08-17 04:02:07.535');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg6n004svki49or6n5pq', 'cmef5tfyo003bvki46o5mdyf7', 'cmef5tffh000gvki42l5mtuog', false, 4, '2025-08-17 04:02:07.535');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg6m004pvki414jy9l99', 'cmef5tfyo003bvki46o5mdyf7', 'cmef5tfbd0004vki4v6fb8du3', true, 1, '2025-08-17 04:02:07.535');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg7r0050vki42o2l60c1', 'cmef5tfyo003cvki4p6oi7jez', 'cmef5tffh000gvki42l5mtuog', false, 4, '2025-08-17 04:02:07.575');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg7q004zvki4s3jkrcno', 'cmef5tfyo003cvki4p6oi7jez', 'cmef5tfdr000cvki4amx64zle', false, 2, '2025-08-17 04:02:07.574');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg7q004vvki4pi19d5cj', 'cmef5tfyo003cvki4p6oi7jez', 'cmef5tfbd0004vki4v6fb8du3', true, 1, '2025-08-17 04:02:07.574');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg7q004wvki4nu1nm8mb', 'cmef5tfyo003cvki4p6oi7jez', 'cmef5tfed000evki49zjk8ktf', true, 3, '2025-08-17 04:02:07.575');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg8v0056vki476b2p2pa', 'cmef5tfzs003fvki43tseh6z2', 'cmef5tfi6000mvki4931fkwv3', false, 3, '2025-08-17 04:02:07.615');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg8v0054vki4tri7u13d', 'cmef5tfzs003fvki43tseh6z2', 'cmef5tfgz000ivki4512kikx7', true, 1, '2025-08-17 04:02:07.615');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg8v0055vki43xdn4fqv', 'cmef5tfzs003fvki43tseh6z2', 'cmef5tfhl000kvki4bzsf4qps', true, 2, '2025-08-17 04:02:07.615');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tga0005cvki4du46rtxl', 'cmef5tfzt003ivki4d8ox3hqv', 'cmef5tfi6000mvki4931fkwv3', false, 3, '2025-08-17 04:02:07.656');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg9z005avki44vvshysr', 'cmef5tfzt003ivki4d8ox3hqv', 'cmef5tfgz000ivki4512kikx7', true, 1, '2025-08-17 04:02:07.656');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tg9z005bvki4854hvaje', 'cmef5tfzt003ivki4d8ox3hqv', 'cmef5tfhl000kvki4bzsf4qps', true, 2, '2025-08-17 04:02:07.656');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tgb4005ivki4wo4vx3gm', 'cmef5tfzs003gvki4bxqb7ujp', 'cmef5tfi6000mvki4931fkwv3', false, 3, '2025-08-17 04:02:07.696');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tgb3005fvki42wakofak', 'cmef5tfzs003gvki4bxqb7ujp', 'cmef5tfgz000ivki4512kikx7', true, 1, '2025-08-17 04:02:07.696');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tgb3005hvki4j3fo7v9g', 'cmef5tfzs003gvki4bxqb7ujp', 'cmef5tfhl000kvki4bzsf4qps', true, 2, '2025-08-17 04:02:07.696');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tgc8005kvki4t3nhd84w', 'cmef5tg0z003mvki4p5lt148y', 'cmef5tfiq000ovki48jbwi2av', true, 1, '2025-08-17 04:02:07.737');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tgcu005mvki4r6y4vueo', 'cmef5tg0z003ovki4qj1klike', 'cmef5tfiq000ovki48jbwi2av', true, 1, '2025-08-17 04:02:07.758');
INSERT INTO public.menu_item_customizations VALUES ('cmef5tgde005ovki47c5f337b', 'cmef5tg0z003nvki4ki75gu9k', 'cmef5tfiq000ovki48jbwi2av', true, 1, '2025-08-17 04:02:07.779');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.orders VALUES ('cmedultjm000dvkjw356776hm', 'BO029625YDM', NULL, 'Test Customer', 'test@example.com', '6178673842', 'PENDING', 'PICKUP', 'pay-at-pickup', NULL, NULL, NULL, NULL, NULL, 18.5, 0, NULL, 18, NULL, 1.53, 20.03, NULL, '2025-08-16 06:00:29.65', '2025-08-16 06:00:29.65');
INSERT INTO public.orders VALUES ('cmedz5c5b0005vkgo23e4el7e', 'BO658660K8Q', NULL, 'omar', 'auy1jll@gmail.com', '6172494115', 'PENDING', 'DELIVERY', NULL, 'auy1jll@gmail.com', 'salem', '01970', '', NULL, 23.25, 3.99, NULL, NULL, NULL, 1.92, 29.16, NULL, '2025-08-16 08:07:38.687', '2025-08-16 08:07:38.687');
INSERT INTO public.orders VALUES ('cmedzbdcf000cvkgoa4baa27d', 'BO9401688WI', NULL, 'omar', 'auy1jll@gmail.com', '6172494115', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 20.5, 0, NULL, NULL, NULL, 1.69, 22.19, NULL, '2025-08-16 08:12:20.175', '2025-08-16 08:12:20.175');
INSERT INTO public.orders VALUES ('cmedzdcfm000hvkgotdgcwgu8', 'BO0322827JI', NULL, 'Test Customer', 'test@example.com', '6178673842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 20.5, 0, NULL, NULL, NULL, 1.69, 22.19, NULL, '2025-08-16 08:13:52.307', '2025-08-16 08:13:52.307');
INSERT INTO public.orders VALUES ('cmedzenir000mvkgoqc16azjz', 'BO0933195YX', NULL, 'Hassan Omar', 'auy1jll@gmail.com', '16178673842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 15.5, 0, NULL, NULL, NULL, 1.28, 16.78, NULL, '2025-08-16 08:14:53.331', '2025-08-16 08:14:53.331');
INSERT INTO public.orders VALUES ('cmedzhfe0000rvkgolza57z4q', 'BO22273519R', NULL, 'auy1jll', 'auy1jll@pizza-subs.com', '6178673842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 42, 0, NULL, NULL, NULL, 3.47, 45.47, NULL, '2025-08-16 08:17:02.761', '2025-08-16 08:17:02.761');
INSERT INTO public.orders VALUES ('cmedzrm4j0001vk847rvzzoun', 'BO6980236P5', NULL, 'auy1jll', 'auy1jll@pizza-subs.com', '6178673842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 81.25, 0, NULL, NULL, NULL, 6.7, 87.95, NULL, '2025-08-16 08:24:58.051', '2025-08-16 08:24:58.051');
INSERT INTO public.orders VALUES ('cmee0rioy0001vky8rc3ivht3', 'BO373210UNB', NULL, 'auy1jll', 'auy1jll@pizza-subs.com', '6178673842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 20.5, 0, NULL, NULL, NULL, 1.69, 22.19, NULL, '2025-08-16 08:52:53.219', '2025-08-16 08:52:53.219');
INSERT INTO public.orders VALUES ('cmeenzukf0001vkh8s6fvt4qq', 'BO392992HSZ', NULL, 'Test User', 'test@example.com', '555-123-4567', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 12.99, 0, NULL, NULL, NULL, 1.07, 14.06, NULL, '2025-08-16 19:43:13.021', '2025-08-16 19:43:13.021');
INSERT INTO public.orders VALUES ('cmeeo5mx00001vk88nap4n9o2', 'BO663036X9R', NULL, 'Test Customer', 'test@example.com', '6178673842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 16.5, 0, NULL, NULL, NULL, 1.36, 17.86, NULL, '2025-08-16 19:47:43.044', '2025-08-16 19:47:43.044');
INSERT INTO public.orders VALUES ('cmeep67ln0005vk88dj4ltu9s', 'BO36942263S', NULL, 'Test Customer', 'test@example.com', '6178673842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 20.5, 0, NULL, NULL, NULL, 1.69, 22.19, NULL, '2025-08-16 20:16:09.468', '2025-08-16 20:16:09.468');
INSERT INTO public.orders VALUES ('cmeeqriwr0001vkt8t4h9v5fg', 'BO043505YBM', NULL, 'auy1jll', 'auy1jll@pizza-subs.com', '6178673842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 16.5, 0, NULL, NULL, NULL, 1.36, 17.86, NULL, '2025-08-16 21:00:43.516', '2025-08-16 21:00:43.516');
INSERT INTO public.orders VALUES ('cmef0gisu0001vkbcw323ktwp', 'BO326309Y2G', NULL, 'Test Customer', 'test@example.com', '6178673842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 33.98999999999999, 0, NULL, NULL, NULL, 0.03, 34.02, NULL, '2025-08-17 01:32:06.318', '2025-08-17 01:32:06.318');
INSERT INTO public.orders VALUES ('cmef1wvlv0001vkb4dgphrihs', 'BO7689893EA', NULL, 'auy1jll', 'auy1jll@pizza-subs.com', '6178673842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 18.99, 0, NULL, NULL, NULL, 0.02, 19.01, NULL, '2025-08-17 02:12:49.027', '2025-08-17 02:12:49.027');
INSERT INTO public.orders VALUES ('cmef6vjb70001vkpwh3zb9guc', 'BO10448226H', NULL, 'auy1jll', 'auy1jll@pizza-subs.com', '6178673842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 19.25, 0, NULL, NULL, NULL, 0.02, 19.27, NULL, '2025-08-17 04:31:44.513', '2025-08-17 04:31:44.513');
INSERT INTO public.orders VALUES ('cmef6wpr80007vkpwm74h59es', 'BO159518MRO', NULL, 'Hassan Omar', 'auy1jll@gmail.com', '16178673842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 23.5, 0, NULL, NULL, NULL, 0.02, 23.52, NULL, '2025-08-17 04:32:39.524', '2025-08-17 04:32:39.524');
INSERT INTO public.orders VALUES ('cmef7pn68000fvkpwxj897bs8', 'BO509154937', NULL, 'ghizlan Sourourou', 'auy1jll@gmail.com', '(617) 867-3842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 29.74, 0, NULL, NULL, NULL, 0.02, 29.76, NULL, '2025-08-17 04:55:09.201', '2025-08-17 04:55:09.201');
INSERT INTO public.orders VALUES ('cmef7rw40000nvkpwzwvt8qsl', 'BO6140881M3', NULL, 'ghizlan Sourourou', 'auy1jll@gmail.com', '(617) 867-3842', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 41.23, 0, NULL, NULL, NULL, 0.03, 41.26, NULL, '2025-08-17 04:56:54.097', '2025-08-17 04:56:54.097');
INSERT INTO public.orders VALUES ('cmef8zhac000xvkpwor1ayszp', 'BO647721OSY', NULL, 'UPS Supply Chain sloutions', 'auy1jll@gmail.com', '3393389189', 'PENDING', 'PICKUP', NULL, NULL, NULL, NULL, NULL, NULL, 21.25, 0, NULL, NULL, NULL, 0.02, 21.27, NULL, '2025-08-17 05:30:47.748', '2025-08-17 05:30:47.748');


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.order_items VALUES ('cmedultju000fvkjwtrgq2fjp', 'cmedultjm000dvkjw356776hm', 'cmeduh41j0001vkjwnk2k9s73', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 18.5, 18.5, 'Large THICK CRUST with ORIGINAL PIZZA', '2025-08-16 06:00:29.658', '2025-08-16 06:00:29.658', NULL);
INSERT INTO public.order_items VALUES ('cmedz5c5i0007vkgon9nj5kzj', 'cmedz5c5b0005vkgo23e4el7e', 'cmeduh41j0001vkjwnk2k9s73', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 23.25, 23.25, 'Large THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers | right: extra cheese', '2025-08-16 08:07:38.694', '2025-08-16 08:07:38.694', NULL);
INSERT INTO public.order_items VALUES ('cmedzbdcn000evkgokb4cejbf', 'cmedzbdcf000cvkgoa4baa27d', 'cmeduh41j0001vkjwnk2k9s73', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 20.5, 20.5, 'Large THICK CRUST with ORIGINAL PIZZA | Toppings: whole: extra cheese', '2025-08-16 08:12:20.183', '2025-08-16 08:12:20.183', NULL);
INSERT INTO public.order_items VALUES ('cmedzdcfu000jvkgo016p253n', 'cmedzdcfm000hvkgotdgcwgu8', 'cmeduh41j0001vkjwnk2k9s73', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 20.5, 20.5, 'Large THICK CRUST with ORIGINAL PIZZA | Toppings: whole: extra cheese', '2025-08-16 08:13:52.315', '2025-08-16 08:13:52.315', NULL);
INSERT INTO public.order_items VALUES ('cmedzeniv000ovkgoodtqne5o', 'cmedzenir000mvkgoqc16azjz', 'cmedughin0000vkjwzquehzwn', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 15.5, 15.5, 'Small THICK CRUST with ORIGINAL PIZZA | Toppings: whole: extra cheese', '2025-08-16 08:14:53.335', '2025-08-16 08:14:53.335', NULL);
INSERT INTO public.order_items VALUES ('cmedzhfe7000tvkgoipcyhue5', 'cmedzhfe0000rvkgolza57z4q', 'cmedughin0000vkjwzquehzwn', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 13.5, 13.5, 'Small THICK CRUST with ORIGINAL PIZZA', '2025-08-16 08:17:02.768', '2025-08-16 08:17:02.768', NULL);
INSERT INTO public.order_items VALUES ('cmedzhfef000vvkgo9jc18817', 'cmedzhfe0000rvkgolza57z4q', 'cmeduh41j0001vkjwnk2k9s73', 'cmedtz4sw0000vk4k0bft96ej', 'cmedtz4vb0003vk4kdd41lpsl', 1, 28.5, 28.5, 'Large THIN CRUST with ORIGINAL PIZZA | Toppings: whole: extra cheese, italian sausage, pepperoni, green peppers, mushrooms', '2025-08-16 08:17:02.775', '2025-08-16 08:17:02.775', NULL);
INSERT INTO public.order_items VALUES ('cmedzrm4t0003vk845r4nv977', 'cmedzrm4j0001vk847rvzzoun', 'cmedughin0000vkjwzquehzwn', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 16.25, 16.25, 'Small THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers', '2025-08-16 08:24:58.061', '2025-08-16 08:24:58.061', NULL);
INSERT INTO public.order_items VALUES ('cmedzrm590007vk84f6lqce9h', 'cmedzrm4j0001vk847rvzzoun', 'cmedughin0000vkjwzquehzwn', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 16.25, 16.25, 'Small THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers', '2025-08-16 08:24:58.077', '2025-08-16 08:24:58.077', NULL);
INSERT INTO public.order_items VALUES ('cmedzrm5g000bvk84x3y0mpz3', 'cmedzrm4j0001vk847rvzzoun', 'cmedughin0000vkjwzquehzwn', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 16.25, 16.25, 'Small THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers', '2025-08-16 08:24:58.084', '2025-08-16 08:24:58.084', NULL);
INSERT INTO public.order_items VALUES ('cmedzrm5m000fvk84dfsyb7ly', 'cmedzrm4j0001vk847rvzzoun', 'cmedughin0000vkjwzquehzwn', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 16.25, 16.25, 'Small THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers', '2025-08-16 08:24:58.091', '2025-08-16 08:24:58.091', NULL);
INSERT INTO public.order_items VALUES ('cmedzrm5r000jvk84dg5ofdyw', 'cmedzrm4j0001vk847rvzzoun', 'cmedughin0000vkjwzquehzwn', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 16.25, 16.25, 'Small THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers', '2025-08-16 08:24:58.096', '2025-08-16 08:24:58.096', NULL);
INSERT INTO public.order_items VALUES ('cmee0rip40003vky8itgla8qg', 'cmee0rioy0001vky8rc3ivht3', 'cmeduh41j0001vkjwnk2k9s73', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 20.5, 20.5, 'Large THICK CRUST with ORIGINAL PIZZA | Toppings: whole: extra cheese', '2025-08-16 08:52:53.225', '2025-08-16 08:52:53.225', NULL);
INSERT INTO public.order_items VALUES ('cmeeo5mx50003vk88ymo99g0m', 'cmeeo5mx00001vk88nap4n9o2', 'cmeduh41j0001vkjwnk2k9s73', 'cmedtz4u50001vk4kc54gk39n', 'cmedtz4vb0003vk4kdd41lpsl', 1, 16.5, 16.5, 'Large REGULAR CRUST with ORIGINAL PIZZA', '2025-08-16 19:47:43.049', '2025-08-16 19:47:43.049', NULL);
INSERT INTO public.order_items VALUES ('cmeep67lt0007vk88v7tpzkyx', 'cmeep67ln0005vk88dj4ltu9s', 'cmeduh41j0001vkjwnk2k9s73', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 20.5, 20.5, 'Large THICK CRUST with ORIGINAL PIZZA | Toppings: whole: extra cheese', '2025-08-16 20:16:09.473', '2025-08-16 20:16:09.473', NULL);
INSERT INTO public.order_items VALUES ('cmeeqriwz0003vkt8ktv7n47o', 'cmeeqriwr0001vkt8t4h9v5fg', 'cmeduh41j0001vkjwnk2k9s73', 'cmedtz4u50001vk4kc54gk39n', 'cmedtz4vb0003vk4kdd41lpsl', 1, 16.5, 16.5, 'Large REGULAR CRUST with ORIGINAL PIZZA', '2025-08-16 21:00:43.523', '2025-08-16 21:00:43.523', NULL);
INSERT INTO public.order_items VALUES ('cmef0git10003vkbcxialv3zw', 'cmef0gisu0001vkbcw323ktwp', 'cmeevim0u0004vkxorbh41esp', 'cmeevim6r0008vkxo8a8ap1dx', 'cmeevim7w0009vkxow3b5mquc', 1, 33.98999999999999, 33.98999999999999, 'Extra Large Cauliflower Crust with Marinara | Toppings: whole: extra cheese | left: extra cheese | right: goat cheese, feta cheese', '2025-08-17 01:32:06.325', '2025-08-17 01:32:06.325', NULL);
INSERT INTO public.order_items VALUES ('cmef1wvm30003vkb4nckek2en', 'cmef1wvlv0001vkb4dgphrihs', NULL, NULL, NULL, 1, 18.99, 18.99, '**Shrimp Scampi** (seafood) | undefined: undefined (+$1.00) | undefined: undefined | undefined: undefined (+$3.00)', '2025-08-17 02:12:49.036', '2025-08-17 02:12:49.036', NULL);
INSERT INTO public.order_items VALUES ('cmeenzukz0003vkh8rvaq0w47', 'cmeenzukf0001vkh8s6fvt4qq', NULL, NULL, NULL, 1, 12.99, 12.99, '**Italian Sub** (Sandwiches)', '2025-08-16 19:43:13.044', '2025-08-16 19:43:13.044', NULL);
INSERT INTO public.order_items VALUES ('cmef6vjbk0003vkpwlbemi3m1', 'cmef6vjb70001vkpwh3zb9guc', 'cmeduh41j0001vkjwnk2k9s73', 'cmeevim1w0005vkxol59mvqka', 'cmeevim7w0009vkxow3b5mquc', 1, 19.25, 19.25, 'Large Thin Crust with Marinara | Toppings: whole: mushrooms, green peppers', '2025-08-17 04:31:44.529', '2025-08-17 04:31:44.529', NULL);
INSERT INTO public.order_items VALUES ('cmef6wprb0009vkpwxzd8bb3u', 'cmef6wpr80007vkpwm74h59es', 'cmedughin0000vkjwzquehzwn', 'cmeevim6r0008vkxo8a8ap1dx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 23.5, 23.5, 'Small Cauliflower Crust with ORIGINAL PIZZA | Toppings: whole: extra cheese | right: goat cheese, feta cheese, extra cheese', '2025-08-17 04:32:39.528', '2025-08-17 04:32:39.528', NULL);
INSERT INTO public.order_items VALUES ('cmef7pn6e000hvkpw25ak4fvc', 'cmef7pn68000fvkpwxj897bs8', 'cmeduh41j0001vkjwnk2k9s73', 'cmeevim1w0005vkxol59mvqka', 'cmeevimbq000cvkxoc52xpn7h', 1, 20.75, 20.75, 'Large Thin Crust with Pesto | Toppings: whole: mushrooms, green peppers', '2025-08-17 04:55:09.207', '2025-08-17 04:55:09.207', NULL);
INSERT INTO public.order_items VALUES ('cmef7pn7s000lvkpwy3txdgq4', 'cmef7pn68000fvkpwxj897bs8', NULL, NULL, NULL, 1, 8.99, 8.99, '**Italian Sub**', '2025-08-17 04:55:09.256', '2025-08-17 04:55:09.256', 'cmef5tfxh0034vki4st3l89ac');
INSERT INTO public.order_items VALUES ('cmef7rw44000pvkpwd9sdlswk', 'cmef7rw40000nvkpwzwvt8qsl', 'cmeevim0u0004vkxorbh41esp', 'cmedtz4u50001vk4kc54gk39n', 'cmedtz4wk0005vk4k83ai9zsv', 1, 32.23999999999999, 32.23999999999999, 'Extra Large REGULAR CRUST with WHITE SAUCE | Toppings: whole: feta cheese, goat cheese | left: extra cheese | right: extra cheese', '2025-08-17 04:56:54.1', '2025-08-17 04:56:54.1', NULL);
INSERT INTO public.order_items VALUES ('cmef7rw4a000vvkpw9r7jox4q', 'cmef7rw40000nvkpwzwvt8qsl', NULL, NULL, NULL, 1, 8.99, 8.99, '**Italian Sub**', '2025-08-17 04:56:54.106', '2025-08-17 04:56:54.106', 'cmef5tfxh0034vki4st3l89ac');
INSERT INTO public.order_items VALUES ('cmef8zhb7000zvkpwvi6yss04', 'cmef8zhac000xvkpwor1ayszp', 'cmeduh41j0001vkjwnk2k9s73', 'cmedtz4uq0002vk4klzs7jjwx', 'cmedtz4vb0003vk4kdd41lpsl', 1, 21.25, 21.25, 'Large THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers', '2025-08-17 05:30:47.779', '2025-08-17 05:30:47.779', NULL);


--
-- Data for Name: order_item_customizations; Type: TABLE DATA; Schema: public; Owner: restobuilder
--



--
-- Data for Name: order_item_toppings; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.order_item_toppings VALUES ('cmedz5c660008vkgokv49bnji', 'cmedz5c5i0007vkgon9nj5kzj', 'cmedtz4yu0008vk4kfqochmjz', 1, 'WHOLE', 'REGULAR', 1.5, '2025-08-16 08:07:38.718');
INSERT INTO public.order_item_toppings VALUES ('cmedz5c660009vkgoy7r0xv57', 'cmedz5c5i0007vkgon9nj5kzj', 'cmedtz50g000avk4k6mgg7u20', 1, 'WHOLE', 'REGULAR', 1.25, '2025-08-16 08:07:38.718');
INSERT INTO public.order_item_toppings VALUES ('cmedz5c66000avkgoka82uf50', 'cmedz5c5i0007vkgon9nj5kzj', 'cmedtz4x50006vk4kkt5ntf7v', 1, 'RIGHT', 'REGULAR', 2, '2025-08-16 08:07:38.718');
INSERT INTO public.order_item_toppings VALUES ('cmedzbdcs000fvkgozon019kr', 'cmedzbdcn000evkgokb4cejbf', 'cmedtz4x50006vk4kkt5ntf7v', 1, 'WHOLE', 'REGULAR', 2, '2025-08-16 08:12:20.188');
INSERT INTO public.order_item_toppings VALUES ('cmedzdcg2000kvkgofujtasex', 'cmedzdcfu000jvkgo016p253n', 'cmedtz4x50006vk4kkt5ntf7v', 1, 'WHOLE', 'REGULAR', 2, '2025-08-16 08:13:52.323');
INSERT INTO public.order_item_toppings VALUES ('cmedzeniz000pvkgopy3qmbyp', 'cmedzeniv000ovkgoodtqne5o', 'cmedtz4x50006vk4kkt5ntf7v', 1, 'WHOLE', 'REGULAR', 2, '2025-08-16 08:14:53.339');
INSERT INTO public.order_item_toppings VALUES ('cmedzhfei000wvkgot62j92g2', 'cmedzhfef000vvkgo9jc18817', 'cmedtz4x50006vk4kkt5ntf7v', 1, 'WHOLE', 'REGULAR', 2, '2025-08-16 08:17:02.779');
INSERT INTO public.order_item_toppings VALUES ('cmedzhfei000xvkgogqof2g6r', 'cmedzhfef000vvkgo9jc18817', 'cmedtz4zv0009vk4k7refm0lf', 1, 'WHOLE', 'REGULAR', 2.75, '2025-08-16 08:17:02.779');
INSERT INTO public.order_item_toppings VALUES ('cmedzhfei000yvkgoz28s0erz', 'cmedzhfef000vvkgo9jc18817', 'cmedtz4xs0007vk4k2czguwk2', 1, 'WHOLE', 'REGULAR', 2.5, '2025-08-16 08:17:02.779');
INSERT INTO public.order_item_toppings VALUES ('cmedzhfei000zvkgom8l0mqzn', 'cmedzhfef000vvkgo9jc18817', 'cmedtz50g000avk4k6mgg7u20', 1, 'WHOLE', 'REGULAR', 1.25, '2025-08-16 08:17:02.779');
INSERT INTO public.order_item_toppings VALUES ('cmedzhfei0010vkgownbpymy5', 'cmedzhfef000vvkgo9jc18817', 'cmedtz4yu0008vk4kfqochmjz', 1, 'WHOLE', 'REGULAR', 1.5, '2025-08-16 08:17:02.779');
INSERT INTO public.order_item_toppings VALUES ('cmedzrm510004vk84coy49ws5', 'cmedzrm4t0003vk845r4nv977', 'cmedtz4yu0008vk4kfqochmjz', 1, 'WHOLE', 'REGULAR', 1.5, '2025-08-16 08:24:58.07');
INSERT INTO public.order_item_toppings VALUES ('cmedzrm510005vk84wspfv5q7', 'cmedzrm4t0003vk845r4nv977', 'cmedtz50g000avk4k6mgg7u20', 1, 'WHOLE', 'REGULAR', 1.25, '2025-08-16 08:24:58.07');
INSERT INTO public.order_item_toppings VALUES ('cmedzrm5d0008vk844h0a6zdq', 'cmedzrm590007vk84f6lqce9h', 'cmedtz4yu0008vk4kfqochmjz', 1, 'WHOLE', 'REGULAR', 1.5, '2025-08-16 08:24:58.081');
INSERT INTO public.order_item_toppings VALUES ('cmedzrm5d0009vk84z5rzgly6', 'cmedzrm590007vk84f6lqce9h', 'cmedtz50g000avk4k6mgg7u20', 1, 'WHOLE', 'REGULAR', 1.25, '2025-08-16 08:24:58.081');
INSERT INTO public.order_item_toppings VALUES ('cmedzrm5j000cvk84aej31mfc', 'cmedzrm5g000bvk84x3y0mpz3', 'cmedtz4yu0008vk4kfqochmjz', 1, 'WHOLE', 'REGULAR', 1.5, '2025-08-16 08:24:58.088');
INSERT INTO public.order_item_toppings VALUES ('cmedzrm5j000dvk847lqt3zck', 'cmedzrm5g000bvk84x3y0mpz3', 'cmedtz50g000avk4k6mgg7u20', 1, 'WHOLE', 'REGULAR', 1.25, '2025-08-16 08:24:58.088');
INSERT INTO public.order_item_toppings VALUES ('cmedzrm5p000gvk84cndbtw9j', 'cmedzrm5m000fvk84dfsyb7ly', 'cmedtz4yu0008vk4kfqochmjz', 1, 'WHOLE', 'REGULAR', 1.5, '2025-08-16 08:24:58.093');
INSERT INTO public.order_item_toppings VALUES ('cmedzrm5p000hvk84d2ba7gl8', 'cmedzrm5m000fvk84dfsyb7ly', 'cmedtz50g000avk4k6mgg7u20', 1, 'WHOLE', 'REGULAR', 1.25, '2025-08-16 08:24:58.093');
INSERT INTO public.order_item_toppings VALUES ('cmedzrm5u000kvk84fg3u146x', 'cmedzrm5r000jvk84dg5ofdyw', 'cmedtz4yu0008vk4kfqochmjz', 1, 'WHOLE', 'REGULAR', 1.5, '2025-08-16 08:24:58.099');
INSERT INTO public.order_item_toppings VALUES ('cmedzrm5v000lvk84hdc0dy7h', 'cmedzrm5r000jvk84dg5ofdyw', 'cmedtz50g000avk4k6mgg7u20', 1, 'WHOLE', 'REGULAR', 1.25, '2025-08-16 08:24:58.099');
INSERT INTO public.order_item_toppings VALUES ('cmee0ripd0004vky8oukhxddu', 'cmee0rip40003vky8itgla8qg', 'cmedtz4x50006vk4kkt5ntf7v', 1, 'WHOLE', 'REGULAR', 2, '2025-08-16 08:52:53.233');
INSERT INTO public.order_item_toppings VALUES ('cmeep67m10008vk88pc4oapuj', 'cmeep67lt0007vk88v7tpzkyx', 'cmedtz4x50006vk4kkt5ntf7v', 1, 'WHOLE', 'REGULAR', 2, '2025-08-16 20:16:09.481');
INSERT INTO public.order_item_toppings VALUES ('cmef0gita0004vkbc4gpxxwdu', 'cmef0git10003vkbcxialv3zw', 'cmedtz4x50006vk4kkt5ntf7v', 1, 'WHOLE', 'REGULAR', 2, '2025-08-17 01:32:06.334');
INSERT INTO public.order_item_toppings VALUES ('cmef0gita0005vkbco6m5ak5u', 'cmef0git10003vkbcxialv3zw', 'cmeevimpc000qvkxo1ac78nfo', 1, 'RIGHT', 'REGULAR', 3, '2025-08-17 01:32:06.334');
INSERT INTO public.order_item_toppings VALUES ('cmef0gita0006vkbcafq8t1ki', 'cmef0git10003vkbcxialv3zw', 'cmeevimon000pvkxoatos8rzw', 1, 'RIGHT', 'REGULAR', 2.5, '2025-08-17 01:32:06.334');
INSERT INTO public.order_item_toppings VALUES ('cmef0gita0007vkbcsum76sob', 'cmef0git10003vkbcxialv3zw', 'cmeevimny000ovkxo1b7w4w83', 1, 'LEFT', 'REGULAR', 2, '2025-08-17 01:32:06.334');
INSERT INTO public.order_item_toppings VALUES ('cmef6vjbs0004vkpw6spxm3kd', 'cmef6vjbk0003vkpwlbemi3m1', 'cmedtz4yu0008vk4kfqochmjz', 1, 'WHOLE', 'REGULAR', 1.5, '2025-08-17 04:31:44.537');
INSERT INTO public.order_item_toppings VALUES ('cmef6vjbs0005vkpwq7ozhs6p', 'cmef6vjbk0003vkpwlbemi3m1', 'cmedtz50g000avk4k6mgg7u20', 1, 'WHOLE', 'REGULAR', 1.25, '2025-08-17 04:31:44.537');
INSERT INTO public.order_item_toppings VALUES ('cmef6wpre000avkpwerk3p9sn', 'cmef6wprb0009vkpwxzd8bb3u', 'cmedtz4x50006vk4kkt5ntf7v', 1, 'WHOLE', 'REGULAR', 2, '2025-08-17 04:32:39.53');
INSERT INTO public.order_item_toppings VALUES ('cmef6wpre000bvkpwo1u5ghej', 'cmef6wprb0009vkpwxzd8bb3u', 'cmeevimpc000qvkxo1ac78nfo', 1, 'RIGHT', 'REGULAR', 3, '2025-08-17 04:32:39.53');
INSERT INTO public.order_item_toppings VALUES ('cmef6wpre000cvkpwqnwpdkh7', 'cmef6wprb0009vkpwxzd8bb3u', 'cmeevimon000pvkxoatos8rzw', 1, 'RIGHT', 'REGULAR', 2.5, '2025-08-17 04:32:39.53');
INSERT INTO public.order_item_toppings VALUES ('cmef6wpre000dvkpw72sm7c3n', 'cmef6wprb0009vkpwxzd8bb3u', 'cmeevimny000ovkxo1b7w4w83', 1, 'RIGHT', 'REGULAR', 2, '2025-08-17 04:32:39.53');
INSERT INTO public.order_item_toppings VALUES ('cmef7pn73000ivkpwgg4f94yp', 'cmef7pn6e000hvkpw25ak4fvc', 'cmedtz4yu0008vk4kfqochmjz', 1, 'WHOLE', 'REGULAR', 1.5, '2025-08-17 04:55:09.231');
INSERT INTO public.order_item_toppings VALUES ('cmef7pn73000jvkpwjf637rmi', 'cmef7pn6e000hvkpw25ak4fvc', 'cmedtz50g000avk4k6mgg7u20', 1, 'WHOLE', 'REGULAR', 1.25, '2025-08-17 04:55:09.231');
INSERT INTO public.order_item_toppings VALUES ('cmef7rw46000qvkpw1sjahhi1', 'cmef7rw44000pvkpwd9sdlswk', 'cmedtz4x50006vk4kkt5ntf7v', 1, 'RIGHT', 'REGULAR', 2, '2025-08-17 04:56:54.103');
INSERT INTO public.order_item_toppings VALUES ('cmef7rw46000rvkpwzgtffxyd', 'cmef7rw44000pvkpwd9sdlswk', 'cmeevimny000ovkxo1b7w4w83', 1, 'LEFT', 'REGULAR', 2, '2025-08-17 04:56:54.103');
INSERT INTO public.order_item_toppings VALUES ('cmef7rw46000svkpwxfmvu9wr', 'cmef7rw44000pvkpwd9sdlswk', 'cmeevimon000pvkxoatos8rzw', 1, 'WHOLE', 'REGULAR', 2.5, '2025-08-17 04:56:54.103');
INSERT INTO public.order_item_toppings VALUES ('cmef7rw46000tvkpwp6stqd8w', 'cmef7rw44000pvkpwd9sdlswk', 'cmeevimpc000qvkxo1ac78nfo', 1, 'WHOLE', 'REGULAR', 3, '2025-08-17 04:56:54.103');
INSERT INTO public.order_item_toppings VALUES ('cmef8zhbs0010vkpwl3j8whgw', 'cmef8zhb7000zvkpwvi6yss04', 'cmedtz4yu0008vk4kfqochmjz', 1, 'WHOLE', 'REGULAR', 1.5, '2025-08-17 05:30:47.8');
INSERT INTO public.order_item_toppings VALUES ('cmef8zhbs0011vkpwjtn922fs', 'cmef8zhb7000zvkpwvi6yss04', 'cmedtz50g000avk4k6mgg7u20', 1, 'WHOLE', 'REGULAR', 1.25, '2025-08-17 05:30:47.8');


--
-- Data for Name: price_snapshots; Type: TABLE DATA; Schema: public; Owner: restobuilder
--



--
-- Data for Name: pricing_history; Type: TABLE DATA; Schema: public; Owner: restobuilder
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: restobuilder
--



--
-- Data for Name: specialty_pizzas; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.specialty_pizzas VALUES ('cmedujag70002vkjwflajym9w', 'Cheese', 'Cheese', 0, 'CLASSIC', NULL, '[]', true, 0, '2025-08-16 05:58:31.591', '2025-08-16 05:58:31.591');
INSERT INTO public.specialty_pizzas VALUES ('cmeduk9su0003vkjwhv6r7vux', 'Veggie', 'Veggie', 11.5, 'VEGETARIAN', NULL, '["MUSHROOMS","GREEN PEPPERS"]', true, 0, '2025-08-16 05:59:17.406', '2025-08-16 08:00:05.079');


--
-- Data for Name: specialty_pizza_sizes; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

INSERT INTO public.specialty_pizza_sizes VALUES ('cmedyvm6t0001vkgofjrh73jx', 'cmeduk9su0003vkjwhv6r7vux', 'cmeduh41j0001vkjwnk2k9s73', 23, true, '2025-08-16 08:00:05.139', '2025-08-16 08:00:05.139');
INSERT INTO public.specialty_pizza_sizes VALUES ('cmedyvm7i0003vkgomzn852ye', 'cmeduk9su0003vkjwhv6r7vux', 'cmedughin0000vkjwzquehzwn', 15, true, '2025-08-16 08:00:05.166', '2025-08-16 08:00:05.166');


--
-- PostgreSQL database dump complete
--

\unrestrict mmFufGPmjQSZlwTgx3Jbs0XdWZL5oTNjZRQpYUG7OMmdz9FJD2ExT3XtLbO853X

