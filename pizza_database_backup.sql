--
-- PostgreSQL database dump
--

\restrict f9Tfn5bdFxTSLSca7hlycE7Ek9d3twYjrnCj0cveZUsMechSY5rAeafW3lBe1NY

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
-- Name: CustomizationType; Type: TYPE; Schema: public; Owner: restobuilder
--

CREATE TYPE public."CustomizationType" AS ENUM (
    'SINGLE_SELECT',
    'MULTI_SELECT',
    'QUANTITY_SELECT',
    'SPECIAL_LOGIC'
);


ALTER TYPE public."CustomizationType" OWNER TO restobuilder;

--
-- Name: ModifierType; Type: TYPE; Schema: public; Owner: restobuilder
--

CREATE TYPE public."ModifierType" AS ENUM (
    'TOPPING',
    'SIDE',
    'DRESSING',
    'CONDIMENT',
    'SIZE'
);


ALTER TYPE public."ModifierType" OWNER TO restobuilder;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: restobuilder
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO restobuilder;

--
-- Name: OrderType; Type: TYPE; Schema: public; Owner: restobuilder
--

CREATE TYPE public."OrderType" AS ENUM (
    'PICKUP',
    'DELIVERY'
);


ALTER TYPE public."OrderType" OWNER TO restobuilder;

--
-- Name: PriceType; Type: TYPE; Schema: public; Owner: restobuilder
--

CREATE TYPE public."PriceType" AS ENUM (
    'FLAT',
    'PERCENTAGE',
    'PER_UNIT'
);


ALTER TYPE public."PriceType" OWNER TO restobuilder;

--
-- Name: SettingType; Type: TYPE; Schema: public; Owner: restobuilder
--

CREATE TYPE public."SettingType" AS ENUM (
    'STRING',
    'NUMBER',
    'BOOLEAN',
    'JSON'
);


ALTER TYPE public."SettingType" OWNER TO restobuilder;

--
-- Name: ToppingCategory; Type: TYPE; Schema: public; Owner: restobuilder
--

CREATE TYPE public."ToppingCategory" AS ENUM (
    'MEAT',
    'VEGETABLE',
    'CHEESE',
    'SAUCE',
    'SPECIALTY'
);


ALTER TYPE public."ToppingCategory" OWNER TO restobuilder;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: restobuilder
--

CREATE TYPE public."UserRole" AS ENUM (
    'CUSTOMER',
    'EMPLOYEE',
    'ADMIN',
    'SUPER_ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO restobuilder;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO restobuilder;

--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.app_settings (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    type public."SettingType" DEFAULT 'STRING'::public."SettingType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.app_settings OWNER TO restobuilder;

--
-- Name: cart_item_customizations; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.cart_item_customizations (
    id text NOT NULL,
    "cartItemId" text NOT NULL,
    "customizationOptionId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.cart_item_customizations OWNER TO restobuilder;

--
-- Name: cart_item_pizza_toppings; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.cart_item_pizza_toppings (
    id text NOT NULL,
    "cartItemId" text NOT NULL,
    "pizzaToppingId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    section text DEFAULT 'WHOLE'::text NOT NULL,
    intensity text DEFAULT 'REGULAR'::text NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.cart_item_pizza_toppings OWNER TO restobuilder;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.cart_items (
    id text NOT NULL,
    "sessionId" text,
    "userId" text,
    "pizzaSizeId" text,
    "pizzaCrustId" text,
    "pizzaSauceId" text,
    "menuItemId" text,
    quantity integer DEFAULT 1 NOT NULL,
    "basePrice" double precision NOT NULL,
    "totalPrice" double precision NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cart_items OWNER TO restobuilder;

--
-- Name: customization_groups; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.customization_groups (
    id text NOT NULL,
    "categoryId" text,
    name text NOT NULL,
    description text,
    type public."CustomizationType" NOT NULL,
    "isRequired" boolean DEFAULT false NOT NULL,
    "minSelections" integer DEFAULT 0 NOT NULL,
    "maxSelections" integer,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.customization_groups OWNER TO restobuilder;

--
-- Name: customization_options; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.customization_options (
    id text NOT NULL,
    "groupId" text NOT NULL,
    name text NOT NULL,
    description text,
    "priceModifier" double precision DEFAULT 0 NOT NULL,
    "priceType" public."PriceType" DEFAULT 'FLAT'::public."PriceType" NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "maxQuantity" integer,
    "nutritionInfo" text,
    allergens text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.customization_options OWNER TO restobuilder;

--
-- Name: item_modifiers; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.item_modifiers (
    id text NOT NULL,
    "itemId" text NOT NULL,
    "modifierId" text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "maxSelectable" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.item_modifiers OWNER TO restobuilder;

--
-- Name: jwt_blacklist; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.jwt_blacklist (
    id text NOT NULL,
    jti text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.jwt_blacklist OWNER TO restobuilder;

--
-- Name: jwt_secrets; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.jwt_secrets (
    id text NOT NULL,
    kid text NOT NULL,
    secret text NOT NULL,
    algorithm text DEFAULT 'HS256'::text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "rotatedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.jwt_secrets OWNER TO restobuilder;

--
-- Name: menu_categories; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.menu_categories (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "imageUrl" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "parentCategoryId" text
);


ALTER TABLE public.menu_categories OWNER TO restobuilder;

--
-- Name: menu_item_customizations; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.menu_item_customizations (
    id text NOT NULL,
    "menuItemId" text NOT NULL,
    "customizationGroupId" text NOT NULL,
    "isRequired" boolean DEFAULT false NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.menu_item_customizations OWNER TO restobuilder;

--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.menu_items (
    id text NOT NULL,
    "categoryId" text NOT NULL,
    name text NOT NULL,
    description text,
    "basePrice" double precision NOT NULL,
    "imageUrl" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "preparationTime" integer,
    allergens text,
    "nutritionInfo" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.menu_items OWNER TO restobuilder;

--
-- Name: modifiers; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.modifiers (
    id text NOT NULL,
    name text NOT NULL,
    type public."ModifierType" NOT NULL,
    price double precision DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.modifiers OWNER TO restobuilder;

--
-- Name: order_item_customizations; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.order_item_customizations (
    id text NOT NULL,
    "orderItemId" text NOT NULL,
    "customizationOptionId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price double precision NOT NULL,
    "pizzaHalf" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.order_item_customizations OWNER TO restobuilder;

--
-- Name: order_item_toppings; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.order_item_toppings (
    id text NOT NULL,
    "orderItemId" text NOT NULL,
    "pizzaToppingId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    section text DEFAULT 'WHOLE'::text NOT NULL,
    intensity text DEFAULT 'REGULAR'::text NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.order_item_toppings OWNER TO restobuilder;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "pizzaSizeId" text,
    "pizzaCrustId" text,
    "pizzaSauceId" text,
    quantity integer DEFAULT 1 NOT NULL,
    "basePrice" double precision NOT NULL,
    "totalPrice" double precision NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "menuItemId" text
);


ALTER TABLE public.order_items OWNER TO restobuilder;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.orders (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "userId" text,
    "customerName" text,
    "customerEmail" text,
    "customerPhone" text,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "orderType" public."OrderType" DEFAULT 'PICKUP'::public."OrderType" NOT NULL,
    "paymentMethod" text,
    "deliveryAddress" text,
    "deliveryCity" text,
    "deliveryZip" text,
    "deliveryInstructions" text,
    "scheduledTime" timestamp(3) without time zone,
    subtotal double precision NOT NULL,
    "deliveryFee" double precision DEFAULT 0 NOT NULL,
    "tipAmount" double precision,
    "tipPercentage" double precision,
    "customTipAmount" double precision,
    tax double precision NOT NULL,
    total double precision NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO restobuilder;

--
-- Name: pizza_crusts; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.pizza_crusts (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "priceModifier" double precision DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.pizza_crusts OWNER TO restobuilder;

--
-- Name: pizza_sauces; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.pizza_sauces (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    color text,
    "spiceLevel" integer DEFAULT 0 NOT NULL,
    "priceModifier" double precision DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.pizza_sauces OWNER TO restobuilder;

--
-- Name: pizza_sizes; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.pizza_sizes (
    id text NOT NULL,
    name text NOT NULL,
    diameter text NOT NULL,
    "basePrice" double precision NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.pizza_sizes OWNER TO restobuilder;

--
-- Name: pizza_toppings; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.pizza_toppings (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    category public."ToppingCategory" NOT NULL,
    price double precision NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isVegetarian" boolean DEFAULT false NOT NULL,
    "isVegan" boolean DEFAULT false NOT NULL,
    "isGlutenFree" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.pizza_toppings OWNER TO restobuilder;

--
-- Name: price_snapshots; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.price_snapshots (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "componentType" text NOT NULL,
    "componentId" text NOT NULL,
    "componentName" text NOT NULL,
    "snapshotPrice" double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.price_snapshots OWNER TO restobuilder;

--
-- Name: pricing_history; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.pricing_history (
    id text NOT NULL,
    "componentType" text NOT NULL,
    "componentId" text NOT NULL,
    "componentName" text NOT NULL,
    "oldPrice" double precision,
    "newPrice" double precision NOT NULL,
    "changeReason" text,
    "changedBy" text,
    "changedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pricing_history OWNER TO restobuilder;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.refresh_tokens (
    id text NOT NULL,
    "userId" text NOT NULL,
    "tokenHash" text NOT NULL,
    "deviceFingerprint" text,
    "ipAddress" text,
    "userAgent" text,
    revoked boolean DEFAULT false NOT NULL,
    "revokedAt" timestamp(3) without time zone,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO restobuilder;

--
-- Name: specialty_pizza_sizes; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.specialty_pizza_sizes (
    id text NOT NULL,
    "specialtyPizzaId" text NOT NULL,
    "pizzaSizeId" text NOT NULL,
    price double precision NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.specialty_pizza_sizes OWNER TO restobuilder;

--
-- Name: specialty_pizzas; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.specialty_pizzas (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "basePrice" double precision NOT NULL,
    category text NOT NULL,
    "imageUrl" text,
    ingredients text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.specialty_pizzas OWNER TO restobuilder;

--
-- Name: users; Type: TABLE; Schema: public; Owner: restobuilder
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    password text,
    role public."UserRole" DEFAULT 'CUSTOMER'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO restobuilder;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
400a60d0-a7eb-460e-97db-6a754a5229a3	0365097d75cabf57d973817d51c9eca88a1e10623e60d7a769c50b09c083b423	2025-08-16 04:53:06.098944+00	20250816045302_add_menu_categories	\N	\N	2025-08-16 04:53:02.327436+00	1
d7aa1b69-0ac9-4a32-b9f5-c87e4667e396	d4dc22501bd9ee24abb1d19ba72595d0fe51983c1820ab9edfaecdc8ea64af4c	2025-08-16 09:18:17.701331+00	20250816091817_add_menu_item_order_tables	\N	\N	2025-08-16 09:18:17.391475+00	1
09e8cb18-f3bc-42d1-b319-1ae01b2268d3	6be20c5fe2999efadd2d0f48ec183e41fbd961e98001ea02dae4fec5cedc9523	2025-08-16 09:31:50.53385+00	20250816093150_unified_order_items	\N	\N	2025-08-16 09:31:50.291501+00	1
\.


--
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.app_settings (id, key, value, type, "createdAt", "updatedAt") FROM stdin;
cmeevilxq0000vkxo88s78fgn	taxRate	0.0825	NUMBER	2025-08-16 23:13:45.612	2025-08-16 23:13:45.612
\.


--
-- Data for Name: cart_item_customizations; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.cart_item_customizations (id, "cartItemId", "customizationOptionId", quantity, price, "createdAt") FROM stdin;
\.


--
-- Data for Name: cart_item_pizza_toppings; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.cart_item_pizza_toppings (id, "cartItemId", "pizzaToppingId", quantity, section, intensity, price, "createdAt") FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.cart_items (id, "sessionId", "userId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", quantity, "basePrice", "totalPrice", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: customization_groups; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.customization_groups (id, "categoryId", name, description, type, "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
cmef5tfbd0004vki4v6fb8du3	\N	Size	Choose your size	SINGLE_SELECT	t	1	1	1	t	2025-08-17 04:02:06.409	2025-08-17 04:02:06.409
cmef5tfbz0006vki48pfi6918	cmef5tfa90002vki495kawde2	Bread	Choose your bread	SINGLE_SELECT	t	1	1	2	t	2025-08-17 04:02:06.432	2025-08-17 04:02:06.432
cmef5tfcm0008vki4j55wm3px	cmef5tfa90002vki495kawde2	Condiments	Add condiments	MULTI_SELECT	f	0	\N	3	t	2025-08-17 04:02:06.455	2025-08-17 04:02:06.455
cmef5tfd7000avki4hse70hec	cmef5tfa90002vki495kawde2	Toppings	Add toppings	MULTI_SELECT	f	0	\N	4	t	2025-08-17 04:02:06.476	2025-08-17 04:02:06.476
cmef5tfdr000cvki4amx64zle	cmef5tf9i0000vki4nu1ru1r0	Protein	Add protein	SINGLE_SELECT	f	0	1	2	t	2025-08-17 04:02:06.496	2025-08-17 04:02:06.496
cmef5tfed000evki49zjk8ktf	cmef5tf9i0000vki4nu1ru1r0	Dressing	Choose your dressing	SINGLE_SELECT	t	1	1	3	t	2025-08-17 04:02:06.517	2025-08-17 04:02:06.517
cmef5tffh000gvki42l5mtuog	cmef5tf9i0000vki4nu1ru1r0	Extra Toppings	Add extra toppings	MULTI_SELECT	f	0	\N	4	t	2025-08-17 04:02:06.557	2025-08-17 04:02:06.557
cmef5tfgz000ivki4512kikx7	cmef5tfa60001vki4dhxa1tsl	Preparation	How would you like it prepared?	SINGLE_SELECT	t	1	1	2	t	2025-08-17 04:02:06.612	2025-08-17 04:02:06.612
cmef5tfhl000kvki4bzsf4qps	cmef5tfa60001vki4dhxa1tsl	Seasoning	Choose your seasoning	SINGLE_SELECT	t	1	1	3	t	2025-08-17 04:02:06.633	2025-08-17 04:02:06.633
cmef5tfi6000mvki4931fkwv3	cmef5tfa60001vki4dhxa1tsl	Side Dish	Choose a side dish	SINGLE_SELECT	f	0	1	4	t	2025-08-17 04:02:06.655	2025-08-17 04:02:06.655
cmef5tfiq000ovki48jbwi2av	cmef5tfaa0003vki4u6ekmzq6	Sides	Choose 2 of 3 sides	SPECIAL_LOGIC	t	2	2	2	t	2025-08-17 04:02:06.674	2025-08-17 04:02:06.674
\.


--
-- Data for Name: customization_options; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.customization_options (id, "groupId", name, description, "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", allergens, "createdAt", "updatedAt") FROM stdin;
cmef5tfjd000svki4nrxvlnjr	cmef5tfbd0004vki4v6fb8du3	Large	For big appetites	4	FLAT	f	t	3	\N	\N	\N	2025-08-17 04:02:06.697	2025-08-17 04:02:06.697
cmef5tfjd000tvki4swal33co	cmef5tfbd0004vki4v6fb8du3	Small	Perfect for light appetite	0	FLAT	f	t	1	\N	\N	\N	2025-08-17 04:02:06.697	2025-08-17 04:02:06.697
cmef5tfjd000uvki4vznoqsoz	cmef5tfbd0004vki4v6fb8du3	Regular	Our most popular size	2	FLAT	t	t	2	\N	\N	\N	2025-08-17 04:02:06.697	2025-08-17 04:02:06.697
cmef5tfl4000yvki4bnmgha0d	cmef5tfbz0006vki48pfi6918	Italian	Fresh Italian bread	1	FLAT	f	t	4	\N	\N	\N	2025-08-17 04:02:06.76	2025-08-17 04:02:06.76
cmef5tfl40011vki4or4z784h	cmef5tfbz0006vki48pfi6918	White	Classic white bread	0	FLAT	t	t	1	\N	\N	\N	2025-08-17 04:02:06.76	2025-08-17 04:02:06.76
cmef5tfl40010vki4x8y1rzh5	cmef5tfbz0006vki48pfi6918	Wheat	Whole wheat bread	0.5	FLAT	f	t	2	\N	\N	\N	2025-08-17 04:02:06.76	2025-08-17 04:02:06.76
cmef5tfmr0018vki4jmihhhq3	cmef5tfcm0008vki4j55wm3px	Ranch	Creamy ranch dressing	0.5	FLAT	f	t	4	\N	\N	\N	2025-08-17 04:02:06.819	2025-08-17 04:02:06.819
cmef5tfmr0019vki46n4g5sbw	cmef5tfcm0008vki4j55wm3px	Ketchup	Tomato ketchup	0	FLAT	f	t	3	\N	\N	\N	2025-08-17 04:02:06.819	2025-08-17 04:02:06.819
cmef5tfmr0017vki4vy8p94wg	cmef5tfcm0008vki4j55wm3px	Mayo	Creamy mayonnaise	0	FLAT	f	t	1	\N	\N	\N	2025-08-17 04:02:06.819	2025-08-17 04:02:06.819
cmef5tfny001evki4sqi93uvj	cmef5tfd7000avki4hse70hec	Lettuce	Fresh crisp lettuce	0	FLAT	f	t	1	\N	\N	\N	2025-08-17 04:02:06.862	2025-08-17 04:02:06.862
cmef5tfny001fvki4yrbb4ld9	cmef5tfd7000avki4hse70hec	Tomato	Fresh sliced tomatoes	0	FLAT	f	t	2	\N	\N	\N	2025-08-17 04:02:06.862	2025-08-17 04:02:06.862
cmef5tfny001ivki4lc7dk1jf	cmef5tfd7000avki4hse70hec	Cheese	American cheese slice	1.5	FLAT	f	t	4	\N	\N	\N	2025-08-17 04:02:06.862	2025-08-17 04:02:06.862
cmef5tfpm001qvki4g54nadu2	cmef5tfdr000cvki4amx64zle	Grilled Chicken	Tender grilled chicken breast	4	FLAT	f	t	1	\N	\N	\N	2025-08-17 04:02:06.922	2025-08-17 04:02:06.922
cmef5tfpm001svki4sjr8rug0	cmef5tfdr000cvki4amx64zle	Salmon	Fresh grilled salmon	8	FLAT	f	t	3	\N	\N	\N	2025-08-17 04:02:06.922	2025-08-17 04:02:06.922
cmef5tfqq001zvki46mg2x50o	cmef5tfed000evki49zjk8ktf	Italian	Zesty Italian dressing	0	FLAT	f	t	2	\N	\N	\N	2025-08-17 04:02:06.962	2025-08-17 04:02:06.962
cmef5tfqq001xvki4lt0otezo	cmef5tfed000evki49zjk8ktf	Caesar	Classic Caesar dressing	0	FLAT	f	t	3	\N	\N	\N	2025-08-17 04:02:06.962	2025-08-17 04:02:06.962
cmef5tfrt0025vki42kgnlx0q	cmef5tffh000gvki42l5mtuog	Extra Cheese	Additional shredded cheese	1.5	FLAT	f	t	2	\N	\N	\N	2025-08-17 04:02:07.002	2025-08-17 04:02:07.002
cmef5tfsy002cvki4na6nllke	cmef5tfgz000ivki4512kikx7	Baked	Oven baked	0	FLAT	f	t	3	\N	\N	\N	2025-08-17 04:02:07.042	2025-08-17 04:02:07.042
cmef5tfsy002evki4wsv72dyr	cmef5tfgz000ivki4512kikx7	Blackened	Cajun blackened	1	FLAT	f	t	4	\N	\N	\N	2025-08-17 04:02:07.042	2025-08-17 04:02:07.042
cmef5tfu4002mvki40cibmv4d	cmef5tfhl000kvki4bzsf4qps	Garlic Herb	Garlic and herb blend	0	FLAT	f	t	3	\N	\N	\N	2025-08-17 04:02:07.085	2025-08-17 04:02:07.085
cmef5tfu4002kvki42th9d7c5	cmef5tfhl000kvki4bzsf4qps	Plain	No seasoning	0	FLAT	f	t	4	\N	\N	\N	2025-08-17 04:02:07.085	2025-08-17 04:02:07.085
cmef5tfv9002tvki49fqn3jm8	cmef5tfi6000mvki4931fkwv3	Rice Pilaf	Seasoned rice pilaf	3	FLAT	f	t	2	\N	\N	\N	2025-08-17 04:02:07.125	2025-08-17 04:02:07.125
cmef5tfv9002rvki49o7jc4wh	cmef5tfi6000mvki4931fkwv3	Coleslaw	Creamy coleslaw	2.5	FLAT	f	t	4	\N	\N	\N	2025-08-17 04:02:07.125	2025-08-17 04:02:07.125
cmef5tfwd002zvki47jgtq9tj	cmef5tfiq000ovki48jbwi2av	Green Beans	Fresh green beans	0	FLAT	f	t	2	\N	\N	\N	2025-08-17 04:02:07.165	2025-08-17 04:02:07.165
cmef5tfl40012vki409c59a20	cmef5tfbz0006vki48pfi6918	Sourdough	Tangy sourdough bread	1	FLAT	f	t	3	\N	\N	\N	2025-08-17 04:02:06.76	2025-08-17 04:02:06.76
cmef5tfmr001avki4zm21ofru	cmef5tfcm0008vki4j55wm3px	Mustard	Classic yellow mustard	0	FLAT	f	t	2	\N	\N	\N	2025-08-17 04:02:06.819	2025-08-17 04:02:06.819
cmef5tfny001hvki4e27y6nt5	cmef5tfd7000avki4hse70hec	Onion	Fresh sliced onions	0	FLAT	f	t	3	\N	\N	\N	2025-08-17 04:02:06.862	2025-08-17 04:02:06.862
cmef5tfpm001rvki48rpgllwm	cmef5tfdr000cvki4amx64zle	Turkey	Sliced turkey breast	3	FLAT	f	t	4	\N	\N	\N	2025-08-17 04:02:06.922	2025-08-17 04:02:06.922
cmef5tfqq0020vki4zprwc14d	cmef5tfed000evki49zjk8ktf	Ranch	Creamy ranch dressing	0	FLAT	t	t	1	\N	\N	\N	2025-08-17 04:02:06.962	2025-08-17 04:02:06.962
cmef5tfrt0026vki4z4lohsar	cmef5tffh000gvki42l5mtuog	Croutons	Crunchy garlic croutons	1	FLAT	f	t	1	\N	\N	\N	2025-08-17 04:02:07.002	2025-08-17 04:02:07.002
cmef5tfsy002bvki4ypkgdgn9	cmef5tfgz000ivki4512kikx7	Grilled	Grilled to perfection	0	FLAT	t	t	1	\N	\N	\N	2025-08-17 04:02:07.042	2025-08-17 04:02:07.042
cmef5tfu4002ivki4yx9peiq7	cmef5tfhl000kvki4bzsf4qps	Cajun	Spicy Cajun seasoning	0	FLAT	f	t	2	\N	\N	\N	2025-08-17 04:02:07.085	2025-08-17 04:02:07.085
cmef5tfv9002uvki4ou47w89u	cmef5tfi6000mvki4931fkwv3	Steamed Vegetables	Fresh steamed vegetables	3.5	FLAT	f	t	3	\N	\N	\N	2025-08-17 04:02:07.125	2025-08-17 04:02:07.125
cmef5tfwd002yvki42en1faz0	cmef5tfiq000ovki48jbwi2av	Mashed Potatoes	Creamy mashed potatoes	0	FLAT	f	t	1	\N	\N	\N	2025-08-17 04:02:07.165	2025-08-17 04:02:07.165
cmef5tfoo001kvki4xxnrpj1a	cmef5tfd7000avki4hse70hec	Bacon	Crispy bacon strips	2.5	FLAT	f	t	5	\N	\N	\N	2025-08-17 04:02:06.862	2025-08-17 04:02:06.862
cmef5tfpm001pvki4fv269ybi	cmef5tfdr000cvki4amx64zle	Grilled Shrimp	Seasoned grilled shrimp	6	FLAT	f	t	2	\N	\N	\N	2025-08-17 04:02:06.922	2025-08-17 04:02:06.922
cmef5tfqq001yvki4kmg5dgxq	cmef5tfed000evki49zjk8ktf	Balsamic	Balsamic vinaigrette	0	FLAT	f	t	4	\N	\N	\N	2025-08-17 04:02:06.962	2025-08-17 04:02:06.962
cmef5tfrt0024vki4fc68i28l	cmef5tffh000gvki42l5mtuog	Avocado	Fresh sliced avocado	2.5	FLAT	f	t	3	\N	\N	\N	2025-08-17 04:02:07.002	2025-08-17 04:02:07.002
cmef5tfsy002dvki4xlavmuft	cmef5tfgz000ivki4512kikx7	Fried	Golden fried	0	FLAT	f	t	2	\N	\N	\N	2025-08-17 04:02:07.042	2025-08-17 04:02:07.042
cmef5tfu4002lvki45h1r31gb	cmef5tfhl000kvki4bzsf4qps	Lemon Pepper	Zesty lemon pepper seasoning	0	FLAT	t	t	1	\N	\N	\N	2025-08-17 04:02:07.085	2025-08-17 04:02:07.085
cmef5tfv9002svki4lnro7fyk	cmef5tfi6000mvki4931fkwv3	French Fries	Crispy golden fries	3	FLAT	f	t	1	\N	\N	\N	2025-08-17 04:02:07.125	2025-08-17 04:02:07.125
cmef5tfwd0030vki44907g740	cmef5tfiq000ovki48jbwi2av	Mac and Cheese	Creamy mac and cheese	0	FLAT	f	t	3	\N	\N	\N	2025-08-17 04:02:07.165	2025-08-17 04:02:07.165
\.


--
-- Data for Name: item_modifiers; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.item_modifiers (id, "itemId", "modifierId", "isDefault", "maxSelectable", "createdAt") FROM stdin;
\.


--
-- Data for Name: jwt_blacklist; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.jwt_blacklist (id, jti, "expiresAt", reason, "createdAt") FROM stdin;
\.


--
-- Data for Name: jwt_secrets; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.jwt_secrets (id, kid, secret, algorithm, "isActive", "rotatedAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: menu_categories; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.menu_categories (id, name, slug, description, "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt", "parentCategoryId") FROM stdin;
cmef5tf9i0000vki4nu1ru1r0	Salads	salads	Fresh, crisp salads with premium ingredients	\N	t	2	2025-08-17 04:02:06.343	2025-08-17 04:02:06.343	\N
cmef5tfa60001vki4dhxa1tsl	Seafood	seafood	Fresh seafood prepared to perfection	\N	t	3	2025-08-17 04:02:06.343	2025-08-17 04:02:06.343	\N
cmef5tfa90002vki495kawde2	Sandwiches	sandwiches	Fresh sandwiches and subs made to order	\N	t	1	2025-08-17 04:02:06.343	2025-08-17 04:02:06.343	\N
cmef5tfaa0003vki4u6ekmzq6	Dinner Plates	dinner-plates	Hearty dinner plates with your choice of sides	\N	t	4	2025-08-17 04:02:06.343	2025-08-17 04:02:06.343	\N
\.


--
-- Data for Name: menu_item_customizations; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.menu_item_customizations (id, "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") FROM stdin;
cmef5tg23003tvki43oq9oq6h	cmef5tfxh0034vki4st3l89ac	cmef5tfcm0008vki4j55wm3px	f	3	2025-08-17 04:02:07.371
cmef5tg23003wvki4qb8or37i	cmef5tfxh0034vki4st3l89ac	cmef5tfd7000avki4hse70hec	f	4	2025-08-17 04:02:07.371
cmef5tg23003svki41wrta3r3	cmef5tfxh0034vki4st3l89ac	cmef5tfbd0004vki4v6fb8du3	t	1	2025-08-17 04:02:07.371
cmef5tg23003vvki400rsobsw	cmef5tfxh0034vki4st3l89ac	cmef5tfbz0006vki48pfi6918	t	2	2025-08-17 04:02:07.371
cmef5tg380042vki4vc4pmmc4	cmef5tfxh0036vki4cm5lesno	cmef5tfcm0008vki4j55wm3px	f	3	2025-08-17 04:02:07.412
cmef5tg380041vki4lrunzdya	cmef5tfxh0036vki4cm5lesno	cmef5tfbd0004vki4v6fb8du3	t	1	2025-08-17 04:02:07.412
cmef5tg380043vki4lgk6p2rx	cmef5tfxh0036vki4cm5lesno	cmef5tfbz0006vki48pfi6918	t	2	2025-08-17 04:02:07.412
cmef5tg380044vki4fl53funr	cmef5tfxh0036vki4cm5lesno	cmef5tfd7000avki4hse70hec	f	4	2025-08-17 04:02:07.412
cmef5tg4b004avki45edymf2a	cmef5tfxh0035vki4fz8sud31	cmef5tfbz0006vki48pfi6918	t	2	2025-08-17 04:02:07.452
cmef5tg4b0049vki4jg13s2p3	cmef5tfxh0035vki4fz8sud31	cmef5tfbd0004vki4v6fb8du3	t	1	2025-08-17 04:02:07.452
cmef5tg4b004bvki4lwlkk37f	cmef5tfxh0035vki4fz8sud31	cmef5tfcm0008vki4j55wm3px	f	3	2025-08-17 04:02:07.452
cmef5tg4b004cvki4t3iz6o6c	cmef5tfxh0035vki4fz8sud31	cmef5tfd7000avki4hse70hec	f	4	2025-08-17 04:02:07.452
cmef5tg5f004kvki4e2625qif	cmef5tfyo0039vki4g3od5wim	cmef5tfdr000cvki4amx64zle	f	2	2025-08-17 04:02:07.492
cmef5tg5f004ivki40oyfnwdj	cmef5tfyo0039vki4g3od5wim	cmef5tfed000evki49zjk8ktf	t	3	2025-08-17 04:02:07.492
cmef5tg5f004jvki4zv1d2zg5	cmef5tfyo0039vki4g3od5wim	cmef5tffh000gvki42l5mtuog	f	4	2025-08-17 04:02:07.492
cmef5tg5f004hvki4lytjcjg0	cmef5tfyo0039vki4g3od5wim	cmef5tfbd0004vki4v6fb8du3	t	1	2025-08-17 04:02:07.492
cmef5tg6n004qvki4p0823szt	cmef5tfyo003bvki46o5mdyf7	cmef5tfdr000cvki4amx64zle	f	2	2025-08-17 04:02:07.535
cmef5tg6n004rvki4i4tyjycl	cmef5tfyo003bvki46o5mdyf7	cmef5tfed000evki49zjk8ktf	t	3	2025-08-17 04:02:07.535
cmef5tg6n004svki49or6n5pq	cmef5tfyo003bvki46o5mdyf7	cmef5tffh000gvki42l5mtuog	f	4	2025-08-17 04:02:07.535
cmef5tg6m004pvki414jy9l99	cmef5tfyo003bvki46o5mdyf7	cmef5tfbd0004vki4v6fb8du3	t	1	2025-08-17 04:02:07.535
cmef5tg7r0050vki42o2l60c1	cmef5tfyo003cvki4p6oi7jez	cmef5tffh000gvki42l5mtuog	f	4	2025-08-17 04:02:07.575
cmef5tg7q004zvki4s3jkrcno	cmef5tfyo003cvki4p6oi7jez	cmef5tfdr000cvki4amx64zle	f	2	2025-08-17 04:02:07.574
cmef5tg7q004vvki4pi19d5cj	cmef5tfyo003cvki4p6oi7jez	cmef5tfbd0004vki4v6fb8du3	t	1	2025-08-17 04:02:07.574
cmef5tg7q004wvki4nu1nm8mb	cmef5tfyo003cvki4p6oi7jez	cmef5tfed000evki49zjk8ktf	t	3	2025-08-17 04:02:07.575
cmef5tg8v0056vki476b2p2pa	cmef5tfzs003fvki43tseh6z2	cmef5tfi6000mvki4931fkwv3	f	3	2025-08-17 04:02:07.615
cmef5tg8v0054vki4tri7u13d	cmef5tfzs003fvki43tseh6z2	cmef5tfgz000ivki4512kikx7	t	1	2025-08-17 04:02:07.615
cmef5tg8v0055vki43xdn4fqv	cmef5tfzs003fvki43tseh6z2	cmef5tfhl000kvki4bzsf4qps	t	2	2025-08-17 04:02:07.615
cmef5tga0005cvki4du46rtxl	cmef5tfzt003ivki4d8ox3hqv	cmef5tfi6000mvki4931fkwv3	f	3	2025-08-17 04:02:07.656
cmef5tg9z005avki44vvshysr	cmef5tfzt003ivki4d8ox3hqv	cmef5tfgz000ivki4512kikx7	t	1	2025-08-17 04:02:07.656
cmef5tg9z005bvki4854hvaje	cmef5tfzt003ivki4d8ox3hqv	cmef5tfhl000kvki4bzsf4qps	t	2	2025-08-17 04:02:07.656
cmef5tgb4005ivki4wo4vx3gm	cmef5tfzs003gvki4bxqb7ujp	cmef5tfi6000mvki4931fkwv3	f	3	2025-08-17 04:02:07.696
cmef5tgb3005fvki42wakofak	cmef5tfzs003gvki4bxqb7ujp	cmef5tfgz000ivki4512kikx7	t	1	2025-08-17 04:02:07.696
cmef5tgb3005hvki4j3fo7v9g	cmef5tfzs003gvki4bxqb7ujp	cmef5tfhl000kvki4bzsf4qps	t	2	2025-08-17 04:02:07.696
cmef5tgc8005kvki4t3nhd84w	cmef5tg0z003mvki4p5lt148y	cmef5tfiq000ovki48jbwi2av	t	1	2025-08-17 04:02:07.737
cmef5tgcu005mvki4r6y4vueo	cmef5tg0z003ovki4qj1klike	cmef5tfiq000ovki48jbwi2av	t	1	2025-08-17 04:02:07.758
cmef5tgde005ovki47c5f337b	cmef5tg0z003nvki4ki75gu9k	cmef5tfiq000ovki48jbwi2av	t	1	2025-08-17 04:02:07.779
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.menu_items (id, "categoryId", name, description, "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", allergens, "nutritionInfo", "createdAt", "updatedAt") FROM stdin;
cmef5tfxh0036vki4cm5lesno	cmef5tfa90002vki495kawde2	Turkey Club	Sliced turkey, bacon, lettuce, tomato, mayo on toasted bread	9.99	\N	t	t	2	10	\N	\N	2025-08-17 04:02:07.205	2025-08-17 04:02:07.205
cmef5tfxh0034vki4st3l89ac	cmef5tfa90002vki495kawde2	Italian Sub	Ham, salami, pepperoni, provolone cheese with lettuce, tomato, onion	8.99	\N	t	t	1	8	\N	\N	2025-08-17 04:02:07.205	2025-08-17 04:02:07.205
cmef5tfxh0035vki4fz8sud31	cmef5tfa90002vki495kawde2	Chicken Parmesan Sub	Breaded chicken, marinara sauce, mozzarella cheese	10.99	\N	t	t	3	12	\N	\N	2025-08-17 04:02:07.205	2025-08-17 04:02:07.205
cmef5tfyo0039vki4g3od5wim	cmef5tf9i0000vki4nu1ru1r0	Caesar Salad	Romaine lettuce, parmesan cheese, croutons, Caesar dressing	7.99	\N	t	t	1	5	\N	\N	2025-08-17 04:02:07.248	2025-08-17 04:02:07.248
cmef5tfyo003bvki46o5mdyf7	cmef5tf9i0000vki4nu1ru1r0	Garden Salad	Mixed greens, tomatoes, cucumbers, onions, choice of dressing	6.99	\N	t	t	2	5	\N	\N	2025-08-17 04:02:07.248	2025-08-17 04:02:07.248
cmef5tfyo003cvki4p6oi7jez	cmef5tf9i0000vki4nu1ru1r0	Chef Salad	Mixed greens, ham, turkey, cheese, hard boiled egg, choice of dressing	9.99	\N	t	t	3	7	\N	\N	2025-08-17 04:02:07.248	2025-08-17 04:02:07.248
cmef5tfzs003gvki4bxqb7ujp	cmef5tfa60001vki4dhxa1tsl	Fish and Chips	Beer battered cod with crispy french fries	12.99	\N	t	t	3	18	\N	\N	2025-08-17 04:02:07.289	2025-08-17 04:02:07.289
cmef5tfzs003fvki43tseh6z2	cmef5tfa60001vki4dhxa1tsl	Atlantic Salmon	Fresh Atlantic salmon fillet with your choice of preparation and seasoning	16.99	\N	t	t	1	15	\N	\N	2025-08-17 04:02:07.288	2025-08-17 04:02:07.288
cmef5tfzt003ivki4d8ox3hqv	cmef5tfa60001vki4dhxa1tsl	Shrimp Scampi	Large shrimp saut├⌐ed in garlic butter sauce	14.99	\N	t	t	2	12	\N	\N	2025-08-17 04:02:07.289	2025-08-17 04:02:07.289
cmef5tg0z003mvki4p5lt148y	cmef5tfaa0003vki4u6ekmzq6	Grilled Chicken Dinner	Grilled chicken breast with your choice of 2 sides	13.99	\N	t	t	1	20	\N	\N	2025-08-17 04:02:07.331	2025-08-17 04:02:07.331
cmef5tg0z003ovki4qj1klike	cmef5tfaa0003vki4u6ekmzq6	BBQ Ribs Dinner	Half rack of BBQ ribs with your choice of 2 sides	17.99	\N	t	t	2	25	\N	\N	2025-08-17 04:02:07.331	2025-08-17 04:02:07.331
cmef5tg0z003nvki4ki75gu9k	cmef5tfaa0003vki4u6ekmzq6	Meatloaf Dinner	Homestyle meatloaf with gravy and your choice of 2 sides	12.99	\N	t	t	3	18	\N	\N	2025-08-17 04:02:07.331	2025-08-17 04:02:07.331
\.


--
-- Data for Name: modifiers; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.modifiers (id, name, type, price, "isActive", "createdAt", "updatedAt") FROM stdin;
cmeeyvoob0000vkbsqexdy8yj	Extra Cheese	TOPPING	2.5	t	2025-08-17 00:47:54.539	2025-08-17 00:47:54.539
cmeeyvoqj0001vkbsjao4brry	Pepperoni	TOPPING	3	t	2025-08-17 00:47:54.619	2025-08-17 00:47:54.619
cmeeyvos10002vkbs07m1lajh	Mushrooms	TOPPING	2	t	2025-08-17 00:47:54.673	2025-08-17 00:47:54.673
cmeeyvot50003vkbsn2q0dywc	French Fries	SIDE	4.99	t	2025-08-17 00:47:54.714	2025-08-17 00:47:54.714
cmeeyvoua0004vkbshsn253wx	Onion Rings	SIDE	5.99	t	2025-08-17 00:47:54.755	2025-08-17 00:47:54.755
cmeeyvowb0005vkbsew0j4toz	Ranch Dressing	DRESSING	0.5	t	2025-08-17 00:47:54.828	2025-08-17 00:47:54.828
cmeeyvowy0006vkbshi9bvglu	Caesar Dressing	DRESSING	0.5	t	2025-08-17 00:47:54.851	2025-08-17 00:47:54.851
cmeeyvoxl0007vkbsfxar772t	Ketchup	CONDIMENT	0	t	2025-08-17 00:47:54.874	2025-08-17 00:47:54.874
cmeeyvoy80008vkbslnwzdldj	Mustard	CONDIMENT	0	t	2025-08-17 00:47:54.896	2025-08-17 00:47:54.896
cmeeyvozd0009vkbsa37pjiox	Large	SIZE	3	t	2025-08-17 00:47:54.938	2025-08-17 00:47:54.938
cmeeyvozz000avkbsr9j36rxp	Medium	SIZE	1.5	t	2025-08-17 00:47:54.96	2025-08-17 00:47:54.96
cmeeyvp0l000bvkbs6m8t6zmr	Small	SIZE	0	t	2025-08-17 00:47:54.981	2025-08-17 00:47:54.981
\.


--
-- Data for Name: order_item_customizations; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.order_item_customizations (id, "orderItemId", "customizationOptionId", quantity, price, "pizzaHalf", "createdAt") FROM stdin;
\.


--
-- Data for Name: order_item_toppings; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.order_item_toppings (id, "orderItemId", "pizzaToppingId", quantity, section, intensity, price, "createdAt") FROM stdin;
cmedz5c660008vkgokv49bnji	cmedz5c5i0007vkgon9nj5kzj	cmedtz4yu0008vk4kfqochmjz	1	WHOLE	REGULAR	1.5	2025-08-16 08:07:38.718
cmedz5c660009vkgoy7r0xv57	cmedz5c5i0007vkgon9nj5kzj	cmedtz50g000avk4k6mgg7u20	1	WHOLE	REGULAR	1.25	2025-08-16 08:07:38.718
cmedz5c66000avkgoka82uf50	cmedz5c5i0007vkgon9nj5kzj	cmedtz4x50006vk4kkt5ntf7v	1	RIGHT	REGULAR	2	2025-08-16 08:07:38.718
cmedzbdcs000fvkgozon019kr	cmedzbdcn000evkgokb4cejbf	cmedtz4x50006vk4kkt5ntf7v	1	WHOLE	REGULAR	2	2025-08-16 08:12:20.188
cmedzdcg2000kvkgofujtasex	cmedzdcfu000jvkgo016p253n	cmedtz4x50006vk4kkt5ntf7v	1	WHOLE	REGULAR	2	2025-08-16 08:13:52.323
cmedzeniz000pvkgopy3qmbyp	cmedzeniv000ovkgoodtqne5o	cmedtz4x50006vk4kkt5ntf7v	1	WHOLE	REGULAR	2	2025-08-16 08:14:53.339
cmedzhfei000wvkgot62j92g2	cmedzhfef000vvkgo9jc18817	cmedtz4x50006vk4kkt5ntf7v	1	WHOLE	REGULAR	2	2025-08-16 08:17:02.779
cmedzhfei000xvkgogqof2g6r	cmedzhfef000vvkgo9jc18817	cmedtz4zv0009vk4k7refm0lf	1	WHOLE	REGULAR	2.75	2025-08-16 08:17:02.779
cmedzhfei000yvkgoz28s0erz	cmedzhfef000vvkgo9jc18817	cmedtz4xs0007vk4k2czguwk2	1	WHOLE	REGULAR	2.5	2025-08-16 08:17:02.779
cmedzhfei000zvkgom8l0mqzn	cmedzhfef000vvkgo9jc18817	cmedtz50g000avk4k6mgg7u20	1	WHOLE	REGULAR	1.25	2025-08-16 08:17:02.779
cmedzhfei0010vkgownbpymy5	cmedzhfef000vvkgo9jc18817	cmedtz4yu0008vk4kfqochmjz	1	WHOLE	REGULAR	1.5	2025-08-16 08:17:02.779
cmedzrm510004vk84coy49ws5	cmedzrm4t0003vk845r4nv977	cmedtz4yu0008vk4kfqochmjz	1	WHOLE	REGULAR	1.5	2025-08-16 08:24:58.07
cmedzrm510005vk84wspfv5q7	cmedzrm4t0003vk845r4nv977	cmedtz50g000avk4k6mgg7u20	1	WHOLE	REGULAR	1.25	2025-08-16 08:24:58.07
cmedzrm5d0008vk844h0a6zdq	cmedzrm590007vk84f6lqce9h	cmedtz4yu0008vk4kfqochmjz	1	WHOLE	REGULAR	1.5	2025-08-16 08:24:58.081
cmedzrm5d0009vk84z5rzgly6	cmedzrm590007vk84f6lqce9h	cmedtz50g000avk4k6mgg7u20	1	WHOLE	REGULAR	1.25	2025-08-16 08:24:58.081
cmedzrm5j000cvk84aej31mfc	cmedzrm5g000bvk84x3y0mpz3	cmedtz4yu0008vk4kfqochmjz	1	WHOLE	REGULAR	1.5	2025-08-16 08:24:58.088
cmedzrm5j000dvk847lqt3zck	cmedzrm5g000bvk84x3y0mpz3	cmedtz50g000avk4k6mgg7u20	1	WHOLE	REGULAR	1.25	2025-08-16 08:24:58.088
cmedzrm5p000gvk84cndbtw9j	cmedzrm5m000fvk84dfsyb7ly	cmedtz4yu0008vk4kfqochmjz	1	WHOLE	REGULAR	1.5	2025-08-16 08:24:58.093
cmedzrm5p000hvk84d2ba7gl8	cmedzrm5m000fvk84dfsyb7ly	cmedtz50g000avk4k6mgg7u20	1	WHOLE	REGULAR	1.25	2025-08-16 08:24:58.093
cmedzrm5u000kvk84fg3u146x	cmedzrm5r000jvk84dg5ofdyw	cmedtz4yu0008vk4kfqochmjz	1	WHOLE	REGULAR	1.5	2025-08-16 08:24:58.099
cmedzrm5v000lvk84hdc0dy7h	cmedzrm5r000jvk84dg5ofdyw	cmedtz50g000avk4k6mgg7u20	1	WHOLE	REGULAR	1.25	2025-08-16 08:24:58.099
cmee0ripd0004vky8oukhxddu	cmee0rip40003vky8itgla8qg	cmedtz4x50006vk4kkt5ntf7v	1	WHOLE	REGULAR	2	2025-08-16 08:52:53.233
cmeep67m10008vk88pc4oapuj	cmeep67lt0007vk88v7tpzkyx	cmedtz4x50006vk4kkt5ntf7v	1	WHOLE	REGULAR	2	2025-08-16 20:16:09.481
cmef0gita0004vkbc4gpxxwdu	cmef0git10003vkbcxialv3zw	cmedtz4x50006vk4kkt5ntf7v	1	WHOLE	REGULAR	2	2025-08-17 01:32:06.334
cmef0gita0005vkbco6m5ak5u	cmef0git10003vkbcxialv3zw	cmeevimpc000qvkxo1ac78nfo	1	RIGHT	REGULAR	3	2025-08-17 01:32:06.334
cmef0gita0006vkbcafq8t1ki	cmef0git10003vkbcxialv3zw	cmeevimon000pvkxoatos8rzw	1	RIGHT	REGULAR	2.5	2025-08-17 01:32:06.334
cmef0gita0007vkbcsum76sob	cmef0git10003vkbcxialv3zw	cmeevimny000ovkxo1b7w4w83	1	LEFT	REGULAR	2	2025-08-17 01:32:06.334
cmef6vjbs0004vkpw6spxm3kd	cmef6vjbk0003vkpwlbemi3m1	cmedtz4yu0008vk4kfqochmjz	1	WHOLE	REGULAR	1.5	2025-08-17 04:31:44.537
cmef6vjbs0005vkpwq7ozhs6p	cmef6vjbk0003vkpwlbemi3m1	cmedtz50g000avk4k6mgg7u20	1	WHOLE	REGULAR	1.25	2025-08-17 04:31:44.537
cmef6wpre000avkpwerk3p9sn	cmef6wprb0009vkpwxzd8bb3u	cmedtz4x50006vk4kkt5ntf7v	1	WHOLE	REGULAR	2	2025-08-17 04:32:39.53
cmef6wpre000bvkpwo1u5ghej	cmef6wprb0009vkpwxzd8bb3u	cmeevimpc000qvkxo1ac78nfo	1	RIGHT	REGULAR	3	2025-08-17 04:32:39.53
cmef6wpre000cvkpwqnwpdkh7	cmef6wprb0009vkpwxzd8bb3u	cmeevimon000pvkxoatos8rzw	1	RIGHT	REGULAR	2.5	2025-08-17 04:32:39.53
cmef6wpre000dvkpw72sm7c3n	cmef6wprb0009vkpwxzd8bb3u	cmeevimny000ovkxo1b7w4w83	1	RIGHT	REGULAR	2	2025-08-17 04:32:39.53
cmef7pn73000ivkpwgg4f94yp	cmef7pn6e000hvkpw25ak4fvc	cmedtz4yu0008vk4kfqochmjz	1	WHOLE	REGULAR	1.5	2025-08-17 04:55:09.231
cmef7pn73000jvkpwjf637rmi	cmef7pn6e000hvkpw25ak4fvc	cmedtz50g000avk4k6mgg7u20	1	WHOLE	REGULAR	1.25	2025-08-17 04:55:09.231
cmef7rw46000qvkpw1sjahhi1	cmef7rw44000pvkpwd9sdlswk	cmedtz4x50006vk4kkt5ntf7v	1	RIGHT	REGULAR	2	2025-08-17 04:56:54.103
cmef7rw46000rvkpwzgtffxyd	cmef7rw44000pvkpwd9sdlswk	cmeevimny000ovkxo1b7w4w83	1	LEFT	REGULAR	2	2025-08-17 04:56:54.103
cmef7rw46000svkpwxfmvu9wr	cmef7rw44000pvkpwd9sdlswk	cmeevimon000pvkxoatos8rzw	1	WHOLE	REGULAR	2.5	2025-08-17 04:56:54.103
cmef7rw46000tvkpwp6stqd8w	cmef7rw44000pvkpwd9sdlswk	cmeevimpc000qvkxo1ac78nfo	1	WHOLE	REGULAR	3	2025-08-17 04:56:54.103
cmef8zhbs0010vkpwl3j8whgw	cmef8zhb7000zvkpwvi6yss04	cmedtz4yu0008vk4kfqochmjz	1	WHOLE	REGULAR	1.5	2025-08-17 05:30:47.8
cmef8zhbs0011vkpwjtn922fs	cmef8zhb7000zvkpwvi6yss04	cmedtz50g000avk4k6mgg7u20	1	WHOLE	REGULAR	1.25	2025-08-17 05:30:47.8
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.order_items (id, "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", quantity, "basePrice", "totalPrice", notes, "createdAt", "updatedAt", "menuItemId") FROM stdin;
cmedultju000fvkjwtrgq2fjp	cmedultjm000dvkjw356776hm	cmeduh41j0001vkjwnk2k9s73	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	18.5	18.5	Large THICK CRUST with ORIGINAL PIZZA	2025-08-16 06:00:29.658	2025-08-16 06:00:29.658	\N
cmedz5c5i0007vkgon9nj5kzj	cmedz5c5b0005vkgo23e4el7e	cmeduh41j0001vkjwnk2k9s73	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	23.25	23.25	Large THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers | right: extra cheese	2025-08-16 08:07:38.694	2025-08-16 08:07:38.694	\N
cmedzbdcn000evkgokb4cejbf	cmedzbdcf000cvkgoa4baa27d	cmeduh41j0001vkjwnk2k9s73	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	20.5	20.5	Large THICK CRUST with ORIGINAL PIZZA | Toppings: whole: extra cheese	2025-08-16 08:12:20.183	2025-08-16 08:12:20.183	\N
cmedzdcfu000jvkgo016p253n	cmedzdcfm000hvkgotdgcwgu8	cmeduh41j0001vkjwnk2k9s73	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	20.5	20.5	Large THICK CRUST with ORIGINAL PIZZA | Toppings: whole: extra cheese	2025-08-16 08:13:52.315	2025-08-16 08:13:52.315	\N
cmedzeniv000ovkgoodtqne5o	cmedzenir000mvkgoqc16azjz	cmedughin0000vkjwzquehzwn	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	15.5	15.5	Small THICK CRUST with ORIGINAL PIZZA | Toppings: whole: extra cheese	2025-08-16 08:14:53.335	2025-08-16 08:14:53.335	\N
cmedzhfe7000tvkgoipcyhue5	cmedzhfe0000rvkgolza57z4q	cmedughin0000vkjwzquehzwn	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	13.5	13.5	Small THICK CRUST with ORIGINAL PIZZA	2025-08-16 08:17:02.768	2025-08-16 08:17:02.768	\N
cmedzhfef000vvkgo9jc18817	cmedzhfe0000rvkgolza57z4q	cmeduh41j0001vkjwnk2k9s73	cmedtz4sw0000vk4k0bft96ej	cmedtz4vb0003vk4kdd41lpsl	1	28.5	28.5	Large THIN CRUST with ORIGINAL PIZZA | Toppings: whole: extra cheese, italian sausage, pepperoni, green peppers, mushrooms	2025-08-16 08:17:02.775	2025-08-16 08:17:02.775	\N
cmedzrm4t0003vk845r4nv977	cmedzrm4j0001vk847rvzzoun	cmedughin0000vkjwzquehzwn	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	16.25	16.25	Small THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers	2025-08-16 08:24:58.061	2025-08-16 08:24:58.061	\N
cmedzrm590007vk84f6lqce9h	cmedzrm4j0001vk847rvzzoun	cmedughin0000vkjwzquehzwn	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	16.25	16.25	Small THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers	2025-08-16 08:24:58.077	2025-08-16 08:24:58.077	\N
cmedzrm5g000bvk84x3y0mpz3	cmedzrm4j0001vk847rvzzoun	cmedughin0000vkjwzquehzwn	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	16.25	16.25	Small THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers	2025-08-16 08:24:58.084	2025-08-16 08:24:58.084	\N
cmedzrm5m000fvk84dfsyb7ly	cmedzrm4j0001vk847rvzzoun	cmedughin0000vkjwzquehzwn	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	16.25	16.25	Small THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers	2025-08-16 08:24:58.091	2025-08-16 08:24:58.091	\N
cmedzrm5r000jvk84dg5ofdyw	cmedzrm4j0001vk847rvzzoun	cmedughin0000vkjwzquehzwn	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	16.25	16.25	Small THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers	2025-08-16 08:24:58.096	2025-08-16 08:24:58.096	\N
cmee0rip40003vky8itgla8qg	cmee0rioy0001vky8rc3ivht3	cmeduh41j0001vkjwnk2k9s73	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	20.5	20.5	Large THICK CRUST with ORIGINAL PIZZA | Toppings: whole: extra cheese	2025-08-16 08:52:53.225	2025-08-16 08:52:53.225	\N
cmeeo5mx50003vk88ymo99g0m	cmeeo5mx00001vk88nap4n9o2	cmeduh41j0001vkjwnk2k9s73	cmedtz4u50001vk4kc54gk39n	cmedtz4vb0003vk4kdd41lpsl	1	16.5	16.5	Large REGULAR CRUST with ORIGINAL PIZZA	2025-08-16 19:47:43.049	2025-08-16 19:47:43.049	\N
cmeep67lt0007vk88v7tpzkyx	cmeep67ln0005vk88dj4ltu9s	cmeduh41j0001vkjwnk2k9s73	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	20.5	20.5	Large THICK CRUST with ORIGINAL PIZZA | Toppings: whole: extra cheese	2025-08-16 20:16:09.473	2025-08-16 20:16:09.473	\N
cmeeqriwz0003vkt8ktv7n47o	cmeeqriwr0001vkt8t4h9v5fg	cmeduh41j0001vkjwnk2k9s73	cmedtz4u50001vk4kc54gk39n	cmedtz4vb0003vk4kdd41lpsl	1	16.5	16.5	Large REGULAR CRUST with ORIGINAL PIZZA	2025-08-16 21:00:43.523	2025-08-16 21:00:43.523	\N
cmef0git10003vkbcxialv3zw	cmef0gisu0001vkbcw323ktwp	cmeevim0u0004vkxorbh41esp	cmeevim6r0008vkxo8a8ap1dx	cmeevim7w0009vkxow3b5mquc	1	33.98999999999999	33.98999999999999	Extra Large Cauliflower Crust with Marinara | Toppings: whole: extra cheese | left: extra cheese | right: goat cheese, feta cheese	2025-08-17 01:32:06.325	2025-08-17 01:32:06.325	\N
cmef1wvm30003vkb4nckek2en	cmef1wvlv0001vkb4dgphrihs	\N	\N	\N	1	18.99	18.99	**Shrimp Scampi** (seafood) | undefined: undefined (+$1.00) | undefined: undefined | undefined: undefined (+$3.00)	2025-08-17 02:12:49.036	2025-08-17 02:12:49.036	\N
cmeenzukz0003vkh8rvaq0w47	cmeenzukf0001vkh8s6fvt4qq	\N	\N	\N	1	12.99	12.99	**Italian Sub** (Sandwiches)	2025-08-16 19:43:13.044	2025-08-16 19:43:13.044	\N
cmef6vjbk0003vkpwlbemi3m1	cmef6vjb70001vkpwh3zb9guc	cmeduh41j0001vkjwnk2k9s73	cmeevim1w0005vkxol59mvqka	cmeevim7w0009vkxow3b5mquc	1	19.25	19.25	Large Thin Crust with Marinara | Toppings: whole: mushrooms, green peppers	2025-08-17 04:31:44.529	2025-08-17 04:31:44.529	\N
cmef6wprb0009vkpwxzd8bb3u	cmef6wpr80007vkpwm74h59es	cmedughin0000vkjwzquehzwn	cmeevim6r0008vkxo8a8ap1dx	cmedtz4vb0003vk4kdd41lpsl	1	23.5	23.5	Small Cauliflower Crust with ORIGINAL PIZZA | Toppings: whole: extra cheese | right: goat cheese, feta cheese, extra cheese	2025-08-17 04:32:39.528	2025-08-17 04:32:39.528	\N
cmef7pn6e000hvkpw25ak4fvc	cmef7pn68000fvkpwxj897bs8	cmeduh41j0001vkjwnk2k9s73	cmeevim1w0005vkxol59mvqka	cmeevimbq000cvkxoc52xpn7h	1	20.75	20.75	Large Thin Crust with Pesto | Toppings: whole: mushrooms, green peppers	2025-08-17 04:55:09.207	2025-08-17 04:55:09.207	\N
cmef7pn7s000lvkpwy3txdgq4	cmef7pn68000fvkpwxj897bs8	\N	\N	\N	1	8.99	8.99	**Italian Sub**	2025-08-17 04:55:09.256	2025-08-17 04:55:09.256	cmef5tfxh0034vki4st3l89ac
cmef7rw44000pvkpwd9sdlswk	cmef7rw40000nvkpwzwvt8qsl	cmeevim0u0004vkxorbh41esp	cmedtz4u50001vk4kc54gk39n	cmedtz4wk0005vk4k83ai9zsv	1	32.23999999999999	32.23999999999999	Extra Large REGULAR CRUST with WHITE SAUCE | Toppings: whole: feta cheese, goat cheese | left: extra cheese | right: extra cheese	2025-08-17 04:56:54.1	2025-08-17 04:56:54.1	\N
cmef7rw4a000vvkpw9r7jox4q	cmef7rw40000nvkpwzwvt8qsl	\N	\N	\N	1	8.99	8.99	**Italian Sub**	2025-08-17 04:56:54.106	2025-08-17 04:56:54.106	cmef5tfxh0034vki4st3l89ac
cmef8zhb7000zvkpwvi6yss04	cmef8zhac000xvkpwor1ayszp	cmeduh41j0001vkjwnk2k9s73	cmedtz4uq0002vk4klzs7jjwx	cmedtz4vb0003vk4kdd41lpsl	1	21.25	21.25	Large THICK CRUST with ORIGINAL PIZZA | Toppings: whole: mushrooms, green peppers	2025-08-17 05:30:47.779	2025-08-17 05:30:47.779	\N
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.orders (id, "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", status, "orderType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", subtotal, "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", tax, total, notes, "createdAt", "updatedAt") FROM stdin;
cmedultjm000dvkjw356776hm	BO029625YDM	\N	Test Customer	test@example.com	6178673842	PENDING	PICKUP	pay-at-pickup	\N	\N	\N	\N	\N	18.5	0	\N	18	\N	1.53	20.03	\N	2025-08-16 06:00:29.65	2025-08-16 06:00:29.65
cmedz5c5b0005vkgo23e4el7e	BO658660K8Q	\N	omar	auy1jll@gmail.com	6172494115	PENDING	DELIVERY	\N	auy1jll@gmail.com	salem	01970		\N	23.25	3.99	\N	\N	\N	1.92	29.16	\N	2025-08-16 08:07:38.687	2025-08-16 08:07:38.687
cmedzbdcf000cvkgoa4baa27d	BO9401688WI	\N	omar	auy1jll@gmail.com	6172494115	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	20.5	0	\N	\N	\N	1.69	22.19	\N	2025-08-16 08:12:20.175	2025-08-16 08:12:20.175
cmedzdcfm000hvkgotdgcwgu8	BO0322827JI	\N	Test Customer	test@example.com	6178673842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	20.5	0	\N	\N	\N	1.69	22.19	\N	2025-08-16 08:13:52.307	2025-08-16 08:13:52.307
cmedzenir000mvkgoqc16azjz	BO0933195YX	\N	Hassan Omar	auy1jll@gmail.com	16178673842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	15.5	0	\N	\N	\N	1.28	16.78	\N	2025-08-16 08:14:53.331	2025-08-16 08:14:53.331
cmedzhfe0000rvkgolza57z4q	BO22273519R	\N	auy1jll	auy1jll@pizza-subs.com	6178673842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	42	0	\N	\N	\N	3.47	45.47	\N	2025-08-16 08:17:02.761	2025-08-16 08:17:02.761
cmedzrm4j0001vk847rvzzoun	BO6980236P5	\N	auy1jll	auy1jll@pizza-subs.com	6178673842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	81.25	0	\N	\N	\N	6.7	87.95	\N	2025-08-16 08:24:58.051	2025-08-16 08:24:58.051
cmee0rioy0001vky8rc3ivht3	BO373210UNB	\N	auy1jll	auy1jll@pizza-subs.com	6178673842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	20.5	0	\N	\N	\N	1.69	22.19	\N	2025-08-16 08:52:53.219	2025-08-16 08:52:53.219
cmeenzukf0001vkh8s6fvt4qq	BO392992HSZ	\N	Test User	test@example.com	555-123-4567	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	12.99	0	\N	\N	\N	1.07	14.06	\N	2025-08-16 19:43:13.021	2025-08-16 19:43:13.021
cmeeo5mx00001vk88nap4n9o2	BO663036X9R	\N	Test Customer	test@example.com	6178673842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	16.5	0	\N	\N	\N	1.36	17.86	\N	2025-08-16 19:47:43.044	2025-08-16 19:47:43.044
cmeep67ln0005vk88dj4ltu9s	BO36942263S	\N	Test Customer	test@example.com	6178673842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	20.5	0	\N	\N	\N	1.69	22.19	\N	2025-08-16 20:16:09.468	2025-08-16 20:16:09.468
cmeeqriwr0001vkt8t4h9v5fg	BO043505YBM	\N	auy1jll	auy1jll@pizza-subs.com	6178673842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	16.5	0	\N	\N	\N	1.36	17.86	\N	2025-08-16 21:00:43.516	2025-08-16 21:00:43.516
cmef0gisu0001vkbcw323ktwp	BO326309Y2G	\N	Test Customer	test@example.com	6178673842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	33.98999999999999	0	\N	\N	\N	0.03	34.02	\N	2025-08-17 01:32:06.318	2025-08-17 01:32:06.318
cmef1wvlv0001vkb4dgphrihs	BO7689893EA	\N	auy1jll	auy1jll@pizza-subs.com	6178673842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	18.99	0	\N	\N	\N	0.02	19.01	\N	2025-08-17 02:12:49.027	2025-08-17 02:12:49.027
cmef6vjb70001vkpwh3zb9guc	BO10448226H	\N	auy1jll	auy1jll@pizza-subs.com	6178673842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	19.25	0	\N	\N	\N	0.02	19.27	\N	2025-08-17 04:31:44.513	2025-08-17 04:31:44.513
cmef6wpr80007vkpwm74h59es	BO159518MRO	\N	Hassan Omar	auy1jll@gmail.com	16178673842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	23.5	0	\N	\N	\N	0.02	23.52	\N	2025-08-17 04:32:39.524	2025-08-17 04:32:39.524
cmef7pn68000fvkpwxj897bs8	BO509154937	\N	ghizlan Sourourou	auy1jll@gmail.com	(617) 867-3842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	29.74	0	\N	\N	\N	0.02	29.76	\N	2025-08-17 04:55:09.201	2025-08-17 04:55:09.201
cmef7rw40000nvkpwzwvt8qsl	BO6140881M3	\N	ghizlan Sourourou	auy1jll@gmail.com	(617) 867-3842	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	41.23	0	\N	\N	\N	0.03	41.26	\N	2025-08-17 04:56:54.097	2025-08-17 04:56:54.097
cmef8zhac000xvkpwor1ayszp	BO647721OSY	\N	UPS Supply Chain sloutions	auy1jll@gmail.com	3393389189	PENDING	PICKUP	\N	\N	\N	\N	\N	\N	21.25	0	\N	\N	\N	0.02	21.27	\N	2025-08-17 05:30:47.748	2025-08-17 05:30:47.748
\.


--
-- Data for Name: pizza_crusts; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.pizza_crusts (id, name, description, "priceModifier", "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmedtz4uq0002vk4klzs7jjwx	THICK CRUST	Deep dish style	2	t	0	2025-08-16 05:42:51.218	2025-08-16 05:42:51.218
cmedtz4u50001vk4kc54gk39n	REGULAR CRUST	Classic hand-tossed	0	t	0	2025-08-16 05:42:51.197	2025-08-16 05:57:15.392
cmedtz4sw0000vk4k0bft96ej	THIN CRUST	Crispy and light	2	t	0	2025-08-16 05:42:51.152	2025-08-16 05:57:28.187
cmeevim1w0005vkxol59mvqka	Thin Crust	Crispy and light	0	t	1	2025-08-16 23:13:45.764	2025-08-16 23:13:45.764
cmeevim3g0006vkxoquirys39	Hand-Tossed	Classic, chewy crust	0	t	2	2025-08-16 23:13:45.82	2025-08-16 23:13:45.82
cmeevim5l0007vkxom5nmq46q	Stuffed Crust	Cheese-filled crust	3	t	3	2025-08-16 23:13:45.897	2025-08-16 23:13:45.897
cmeevim6r0008vkxo8a8ap1dx	Cauliflower Crust	Gluten-free option	2.5	t	4	2025-08-16 23:13:45.939	2025-08-16 23:13:45.939
\.


--
-- Data for Name: pizza_sauces; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.pizza_sauces (id, name, description, color, "spiceLevel", "priceModifier", "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmedtz4vb0003vk4kdd41lpsl	ORIGINAL PIZZA	Classic tomato sauce	#CC0000	1	0	t	0	2025-08-16 05:42:51.24	2025-08-16 05:42:51.24
cmedtz4vz0004vk4kafl7bpgd	BBQ SAUCE	Smoky barbecue	#8B4513	2	0.5	t	0	2025-08-16 05:42:51.263	2025-08-16 05:42:51.263
cmedtz4wk0005vk4k83ai9zsv	WHITE SAUCE	Creamy garlic	#FFFFFF	0	0.75	t	0	2025-08-16 05:42:51.285	2025-08-16 05:42:51.285
cmeevim7w0009vkxow3b5mquc	Marinara	Classic tomato sauce	#e53e3e	0	0	t	1	2025-08-16 23:13:45.98	2025-08-16 23:13:45.98
cmeevim9f000avkxonr0ogyxu	Alfredo	Creamy white sauce	#f7fafc	0	1.5	t	2	2025-08-16 23:13:46.036	2025-08-16 23:13:46.036
cmeevimam000bvkxo9jlf6b9v	BBQ Sauce	Smoky and sweet	#8a380c	1	1	t	3	2025-08-16 23:13:46.079	2025-08-16 23:13:46.079
cmeevimbq000cvkxoc52xpn7h	Pesto	Basil and garlic sauce	#38a169	0	1.5	t	4	2025-08-16 23:13:46.118	2025-08-16 23:13:46.118
\.


--
-- Data for Name: pizza_sizes; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.pizza_sizes (id, name, diameter, "basePrice", "isActive", "sortOrder", description, "createdAt", "updatedAt") FROM stdin;
cmedughin0000vkjwzquehzwn	Small	Small	11.5	t	0	\N	2025-08-16 05:56:20.782	2025-08-16 05:56:20.782
cmeduh41j0001vkjwnk2k9s73	Large	Large	16.5	t	0	\N	2025-08-16 05:56:49.974	2025-08-16 05:56:49.974
cmeevilzg0002vkxo9zub3l22	Medium	12"	15.99	t	2	\N	2025-08-16 23:13:45.676	2025-08-16 23:13:45.676
cmeevim0u0004vkxorbh41esp	Extra Large	18"	21.99	t	4	\N	2025-08-16 23:13:45.726	2025-08-16 23:13:45.726
\.


--
-- Data for Name: pizza_toppings; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.pizza_toppings (id, name, description, category, price, "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") FROM stdin;
cmedtz4x50006vk4kkt5ntf7v	EXTRA CHEESE	\N	CHEESE	2	t	0	t	f	f	2025-08-16 05:42:51.306	2025-08-16 05:42:51.306
cmedtz4xs0007vk4k2czguwk2	PEPPERONI	\N	MEAT	2.5	t	0	f	f	f	2025-08-16 05:42:51.328	2025-08-16 05:42:51.328
cmedtz4yu0008vk4kfqochmjz	MUSHROOMS	\N	VEGETABLE	1.5	t	0	t	f	f	2025-08-16 05:42:51.366	2025-08-16 05:42:51.366
cmedtz4zv0009vk4k7refm0lf	ITALIAN SAUSAGE	\N	MEAT	2.75	t	0	f	f	f	2025-08-16 05:42:51.403	2025-08-16 05:42:51.403
cmedtz50g000avk4k6mgg7u20	GREEN PEPPERS	\N	VEGETABLE	1.25	t	0	t	f	f	2025-08-16 05:42:51.424	2025-08-16 05:42:51.424
cmeevimcu000dvkxoa3jsk4x3	Pepperoni	\N	MEAT	2	t	1	f	f	f	2025-08-16 23:13:46.159	2025-08-16 23:13:46.159
cmeevimej000evkxoqst73crk	Sausage	\N	MEAT	2	t	2	f	f	f	2025-08-16 23:13:46.219	2025-08-16 23:13:46.219
cmeevimfo000fvkxoq8201k2i	Bacon	\N	MEAT	2.5	t	3	f	f	f	2025-08-16 23:13:46.26	2025-08-16 23:13:46.26
cmeevimgt000gvkxof0m6leje	Ham	\N	MEAT	2	t	4	f	f	f	2025-08-16 23:13:46.301	2025-08-16 23:13:46.301
cmeevimhw000hvkxozgngi6z8	Chicken	\N	MEAT	2.5	t	5	f	f	f	2025-08-16 23:13:46.34	2025-08-16 23:13:46.34
cmeevimj2000ivkxo6k7jpkqp	Mushrooms	\N	VEGETABLE	1.5	t	10	t	t	f	2025-08-16 23:13:46.382	2025-08-16 23:13:46.382
cmeevimk9000jvkxo757ew4i3	Onions	\N	VEGETABLE	1	t	11	t	t	f	2025-08-16 23:13:46.426	2025-08-16 23:13:46.426
cmeeviml4000kvkxom5yve4wj	Green Peppers	\N	VEGETABLE	1.5	t	12	t	t	f	2025-08-16 23:13:46.456	2025-08-16 23:13:46.456
cmeevimlw000lvkxof6wrc283	Black Olives	\N	VEGETABLE	1.5	t	13	t	t	f	2025-08-16 23:13:46.484	2025-08-16 23:13:46.484
cmeevimml000mvkxonca8tu7y	Tomatoes	\N	VEGETABLE	1.5	t	14	t	t	f	2025-08-16 23:13:46.509	2025-08-16 23:13:46.509
cmeevimn9000nvkxov3u1nue9	Spinach	\N	VEGETABLE	1.5	t	15	t	t	f	2025-08-16 23:13:46.533	2025-08-16 23:13:46.533
cmeevimny000ovkxo1b7w4w83	Extra Cheese	\N	CHEESE	2	t	20	t	f	f	2025-08-16 23:13:46.558	2025-08-16 23:13:46.558
cmeevimon000pvkxoatos8rzw	Feta Cheese	\N	CHEESE	2.5	t	21	t	f	f	2025-08-16 23:13:46.583	2025-08-16 23:13:46.583
cmeevimpc000qvkxo1ac78nfo	Goat Cheese	\N	CHEESE	3	t	22	t	f	f	2025-08-16 23:13:46.608	2025-08-16 23:13:46.608
cmeevimq7000rvkxojm1rqsby	Pineapple	\N	SPECIALTY	1.5	t	30	t	t	f	2025-08-16 23:13:46.639	2025-08-16 23:13:46.639
cmeevimr4000svkxoq8k3bpt9	Jalape├▒os	\N	SPECIALTY	1.5	t	31	t	t	f	2025-08-16 23:13:46.672	2025-08-16 23:13:46.672
\.


--
-- Data for Name: price_snapshots; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.price_snapshots (id, "orderId", "componentType", "componentId", "componentName", "snapshotPrice", "createdAt") FROM stdin;
\.


--
-- Data for Name: pricing_history; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.pricing_history (id, "componentType", "componentId", "componentName", "oldPrice", "newPrice", "changeReason", "changedBy", "changedAt") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.refresh_tokens (id, "userId", "tokenHash", "deviceFingerprint", "ipAddress", "userAgent", revoked, "revokedAt", "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: specialty_pizza_sizes; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.specialty_pizza_sizes (id, "specialtyPizzaId", "pizzaSizeId", price, "isAvailable", "createdAt", "updatedAt") FROM stdin;
cmedyvm6t0001vkgofjrh73jx	cmeduk9su0003vkjwhv6r7vux	cmeduh41j0001vkjwnk2k9s73	23	t	2025-08-16 08:00:05.139	2025-08-16 08:00:05.139
cmedyvm7i0003vkgomzn852ye	cmeduk9su0003vkjwhv6r7vux	cmedughin0000vkjwzquehzwn	15	t	2025-08-16 08:00:05.166	2025-08-16 08:00:05.166
\.


--
-- Data for Name: specialty_pizzas; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.specialty_pizzas (id, name, description, "basePrice", category, "imageUrl", ingredients, "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmedujag70002vkjwflajym9w	Cheese	Cheese	0	CLASSIC	\N	[]	t	0	2025-08-16 05:58:31.591	2025-08-16 05:58:31.591
cmeduk9su0003vkjwhv6r7vux	Veggie	Veggie	11.5	VEGETARIAN	\N	["MUSHROOMS","GREEN PEPPERS"]	t	0	2025-08-16 05:59:17.406	2025-08-16 08:00:05.079
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: restobuilder
--

COPY public.users (id, email, name, password, role, "createdAt", "updatedAt") FROM stdin;
cmedt5v0x0000vk6ozug7dkk9	admin@pizzabuilder.com	Pizza Admin	$2b$10$6Y2BlqSBDU/i5ivP0GnCJO.7QmSkrQHZbGrQADbF2AEeH48bPmivK	ADMIN	2025-08-16 05:20:05.457	2025-08-16 05:20:05.457
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);


--
-- Name: cart_item_customizations cart_item_customizations_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.cart_item_customizations
    ADD CONSTRAINT cart_item_customizations_pkey PRIMARY KEY (id);


--
-- Name: cart_item_pizza_toppings cart_item_pizza_toppings_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.cart_item_pizza_toppings
    ADD CONSTRAINT cart_item_pizza_toppings_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: customization_groups customization_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.customization_groups
    ADD CONSTRAINT customization_groups_pkey PRIMARY KEY (id);


--
-- Name: customization_options customization_options_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.customization_options
    ADD CONSTRAINT customization_options_pkey PRIMARY KEY (id);


--
-- Name: item_modifiers item_modifiers_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.item_modifiers
    ADD CONSTRAINT item_modifiers_pkey PRIMARY KEY (id);


--
-- Name: jwt_blacklist jwt_blacklist_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.jwt_blacklist
    ADD CONSTRAINT jwt_blacklist_pkey PRIMARY KEY (id);


--
-- Name: jwt_secrets jwt_secrets_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.jwt_secrets
    ADD CONSTRAINT jwt_secrets_pkey PRIMARY KEY (id);


--
-- Name: menu_categories menu_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_pkey PRIMARY KEY (id);


--
-- Name: menu_item_customizations menu_item_customizations_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.menu_item_customizations
    ADD CONSTRAINT menu_item_customizations_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: modifiers modifiers_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.modifiers
    ADD CONSTRAINT modifiers_pkey PRIMARY KEY (id);


--
-- Name: order_item_customizations order_item_customizations_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.order_item_customizations
    ADD CONSTRAINT order_item_customizations_pkey PRIMARY KEY (id);


--
-- Name: order_item_toppings order_item_toppings_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.order_item_toppings
    ADD CONSTRAINT order_item_toppings_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: pizza_crusts pizza_crusts_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.pizza_crusts
    ADD CONSTRAINT pizza_crusts_pkey PRIMARY KEY (id);


--
-- Name: pizza_sauces pizza_sauces_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.pizza_sauces
    ADD CONSTRAINT pizza_sauces_pkey PRIMARY KEY (id);


--
-- Name: pizza_sizes pizza_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.pizza_sizes
    ADD CONSTRAINT pizza_sizes_pkey PRIMARY KEY (id);


--
-- Name: pizza_toppings pizza_toppings_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.pizza_toppings
    ADD CONSTRAINT pizza_toppings_pkey PRIMARY KEY (id);


--
-- Name: price_snapshots price_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.price_snapshots
    ADD CONSTRAINT price_snapshots_pkey PRIMARY KEY (id);


--
-- Name: pricing_history pricing_history_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.pricing_history
    ADD CONSTRAINT pricing_history_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: specialty_pizza_sizes specialty_pizza_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.specialty_pizza_sizes
    ADD CONSTRAINT specialty_pizza_sizes_pkey PRIMARY KEY (id);


--
-- Name: specialty_pizzas specialty_pizzas_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.specialty_pizzas
    ADD CONSTRAINT specialty_pizzas_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: app_settings_key_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX app_settings_key_key ON public.app_settings USING btree (key);


--
-- Name: cart_items_sessionId_idx; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE INDEX "cart_items_sessionId_idx" ON public.cart_items USING btree ("sessionId");


--
-- Name: cart_items_userId_idx; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE INDEX "cart_items_userId_idx" ON public.cart_items USING btree ("userId");


--
-- Name: customization_groups_categoryId_idx; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE INDEX "customization_groups_categoryId_idx" ON public.customization_groups USING btree ("categoryId");


--
-- Name: customization_options_groupId_idx; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE INDEX "customization_options_groupId_idx" ON public.customization_options USING btree ("groupId");


--
-- Name: item_modifiers_itemId_modifierId_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX "item_modifiers_itemId_modifierId_key" ON public.item_modifiers USING btree ("itemId", "modifierId");


--
-- Name: jwt_blacklist_expiresAt_idx; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE INDEX "jwt_blacklist_expiresAt_idx" ON public.jwt_blacklist USING btree ("expiresAt");


--
-- Name: jwt_blacklist_jti_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX jwt_blacklist_jti_key ON public.jwt_blacklist USING btree (jti);


--
-- Name: jwt_secrets_kid_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX jwt_secrets_kid_key ON public.jwt_secrets USING btree (kid);


--
-- Name: menu_categories_name_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX menu_categories_name_key ON public.menu_categories USING btree (name);


--
-- Name: menu_categories_slug_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX menu_categories_slug_key ON public.menu_categories USING btree (slug);


--
-- Name: menu_item_customizations_menuItemId_customizationGroupId_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX "menu_item_customizations_menuItemId_customizationGroupId_key" ON public.menu_item_customizations USING btree ("menuItemId", "customizationGroupId");


--
-- Name: menu_items_categoryId_idx; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE INDEX "menu_items_categoryId_idx" ON public.menu_items USING btree ("categoryId");


--
-- Name: order_item_toppings_orderItemId_pizzaToppingId_section_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX "order_item_toppings_orderItemId_pizzaToppingId_section_key" ON public.order_item_toppings USING btree ("orderItemId", "pizzaToppingId", section);


--
-- Name: orders_orderNumber_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX "orders_orderNumber_key" ON public.orders USING btree ("orderNumber");


--
-- Name: pizza_crusts_name_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX pizza_crusts_name_key ON public.pizza_crusts USING btree (name);


--
-- Name: pizza_sauces_name_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX pizza_sauces_name_key ON public.pizza_sauces USING btree (name);


--
-- Name: pizza_sizes_name_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX pizza_sizes_name_key ON public.pizza_sizes USING btree (name);


--
-- Name: pizza_toppings_name_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX pizza_toppings_name_key ON public.pizza_toppings USING btree (name);


--
-- Name: refresh_tokens_expiresAt_idx; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE INDEX "refresh_tokens_expiresAt_idx" ON public.refresh_tokens USING btree ("expiresAt");


--
-- Name: refresh_tokens_tokenHash_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON public.refresh_tokens USING btree ("tokenHash");


--
-- Name: refresh_tokens_userId_idx; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE INDEX "refresh_tokens_userId_idx" ON public.refresh_tokens USING btree ("userId");


--
-- Name: specialty_pizza_sizes_specialtyPizzaId_pizzaSizeId_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX "specialty_pizza_sizes_specialtyPizzaId_pizzaSizeId_key" ON public.specialty_pizza_sizes USING btree ("specialtyPizzaId", "pizzaSizeId");


--
-- Name: specialty_pizzas_name_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX specialty_pizzas_name_key ON public.specialty_pizzas USING btree (name);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: restobuilder
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: cart_item_customizations cart_item_customizations_cartItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.cart_item_customizations
    ADD CONSTRAINT "cart_item_customizations_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES public.cart_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_item_customizations cart_item_customizations_customizationOptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.cart_item_customizations
    ADD CONSTRAINT "cart_item_customizations_customizationOptionId_fkey" FOREIGN KEY ("customizationOptionId") REFERENCES public.customization_options(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: cart_item_pizza_toppings cart_item_pizza_toppings_cartItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.cart_item_pizza_toppings
    ADD CONSTRAINT "cart_item_pizza_toppings_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES public.cart_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_item_pizza_toppings cart_item_pizza_toppings_pizzaToppingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.cart_item_pizza_toppings
    ADD CONSTRAINT "cart_item_pizza_toppings_pizzaToppingId_fkey" FOREIGN KEY ("pizzaToppingId") REFERENCES public.pizza_toppings(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: cart_items cart_items_menuItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_items cart_items_pizzaCrustId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_pizzaCrustId_fkey" FOREIGN KEY ("pizzaCrustId") REFERENCES public.pizza_crusts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_items cart_items_pizzaSauceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_pizzaSauceId_fkey" FOREIGN KEY ("pizzaSauceId") REFERENCES public.pizza_sauces(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_items cart_items_pizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_items cart_items_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: customization_groups customization_groups_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.customization_groups
    ADD CONSTRAINT "customization_groups_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.menu_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: customization_options customization_options_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.customization_options
    ADD CONSTRAINT "customization_options_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.customization_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: item_modifiers item_modifiers_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.item_modifiers
    ADD CONSTRAINT "item_modifiers_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: item_modifiers item_modifiers_modifierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.item_modifiers
    ADD CONSTRAINT "item_modifiers_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES public.modifiers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menu_categories menu_categories_parentCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT "menu_categories_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES public.menu_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: menu_item_customizations menu_item_customizations_customizationGroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.menu_item_customizations
    ADD CONSTRAINT "menu_item_customizations_customizationGroupId_fkey" FOREIGN KEY ("customizationGroupId") REFERENCES public.customization_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menu_item_customizations menu_item_customizations_menuItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.menu_item_customizations
    ADD CONSTRAINT "menu_item_customizations_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menu_items menu_items_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "menu_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.menu_categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item_customizations order_item_customizations_customizationOptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.order_item_customizations
    ADD CONSTRAINT "order_item_customizations_customizationOptionId_fkey" FOREIGN KEY ("customizationOptionId") REFERENCES public.customization_options(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_item_customizations order_item_customizations_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.order_item_customizations
    ADD CONSTRAINT "order_item_customizations_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public.order_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item_toppings order_item_toppings_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.order_item_toppings
    ADD CONSTRAINT "order_item_toppings_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public.order_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item_toppings order_item_toppings_pizzaToppingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.order_item_toppings
    ADD CONSTRAINT "order_item_toppings_pizzaToppingId_fkey" FOREIGN KEY ("pizzaToppingId") REFERENCES public.pizza_toppings(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_items order_items_menuItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_items order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_pizzaCrustId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_pizzaCrustId_fkey" FOREIGN KEY ("pizzaCrustId") REFERENCES public.pizza_crusts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_items order_items_pizzaSauceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_pizzaSauceId_fkey" FOREIGN KEY ("pizzaSauceId") REFERENCES public.pizza_sauces(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_items order_items_pizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: orders orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: price_snapshots price_snapshots_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.price_snapshots
    ADD CONSTRAINT "price_snapshots_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: specialty_pizza_sizes specialty_pizza_sizes_pizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.specialty_pizza_sizes
    ADD CONSTRAINT "specialty_pizza_sizes_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: specialty_pizza_sizes specialty_pizza_sizes_specialtyPizzaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: restobuilder
--

ALTER TABLE ONLY public.specialty_pizza_sizes
    ADD CONSTRAINT "specialty_pizza_sizes_specialtyPizzaId_fkey" FOREIGN KEY ("specialtyPizzaId") REFERENCES public.specialty_pizzas(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict f9Tfn5bdFxTSLSca7hlycE7Ek9d3twYjrnCj0cveZUsMechSY5rAeafW3lBe1NY

