--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

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
-- Name: CartItemType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CartItemType" AS ENUM (
    'PIZZA',
    'CALZONE',
    'MENU_ITEM',
    'CUSTOM'
);


--
-- Name: CustomizationType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."CustomizationType" AS ENUM (
    'SINGLE_SELECT',
    'MULTI_SELECT',
    'QUANTITY_SELECT',
    'SPECIAL_LOGIC'
);


--
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PERCENTAGE',
    'FIXED_AMOUNT',
    'FREE_ITEM'
);


--
-- Name: EmailStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EmailStatus" AS ENUM (
    'PENDING',
    'SENT',
    'FAILED',
    'DELIVERED',
    'BOUNCED'
);


--
-- Name: ModifierType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ModifierType" AS ENUM (
    'TOPPING',
    'SIDE',
    'DRESSING',
    'CONDIMENT',
    'SIZE'
);


--
-- Name: OrderItemType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderItemType" AS ENUM (
    'PIZZA',
    'CALZONE',
    'MENU_ITEM',
    'CUSTOM'
);


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'COMPLETED',
    'CANCELLED'
);


--
-- Name: OrderType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderType" AS ENUM (
    'PICKUP',
    'DELIVERY'
);


--
-- Name: PriceType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PriceType" AS ENUM (
    'FLAT',
    'PERCENTAGE',
    'PER_UNIT'
);


--
-- Name: ProductType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ProductType" AS ENUM (
    'PIZZA',
    'CALZONE'
);


--
-- Name: PromotionType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PromotionType" AS ENUM (
    'PERCENTAGE_DISCOUNT',
    'FIXED_AMOUNT_DISCOUNT',
    'BOGO_HALF_OFF',
    'BOGO_FREE',
    'BUY_X_GET_Y_PERCENT',
    'BUY_X_GET_Y_FREE',
    'CATEGORY_DISCOUNT',
    'ITEM_DISCOUNT',
    'FREE_DELIVERY',
    'HAPPY_HOUR'
);


--
-- Name: SettingType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."SettingType" AS ENUM (
    'STRING',
    'NUMBER',
    'BOOLEAN',
    'JSON'
);


--
-- Name: ToppingCategory; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."ToppingCategory" AS ENUM (
    'MEAT',
    'VEGETABLE',
    'CHEESE',
    'SAUCE',
    'SPECIALTY'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'CUSTOMER',
    'EMPLOYEE',
    'ADMIN',
    'SUPER_ADMIN'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_settings (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    type public."SettingType" DEFAULT 'STRING'::public."SettingType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: cart_item_customizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_item_customizations (
    id text NOT NULL,
    "cartItemId" text NOT NULL,
    "customizationOptionId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: cart_item_pizza_toppings; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
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
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "itemType" public."CartItemType" DEFAULT 'PIZZA'::public."CartItemType" NOT NULL,
    "specialtyCalzoneId" text,
    "specialtyPizzaId" text
);


--
-- Name: customer_addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_addresses (
    id text NOT NULL,
    "userId" text NOT NULL,
    label text NOT NULL,
    "addressLine1" text NOT NULL,
    "addressLine2" text,
    city text NOT NULL,
    state text NOT NULL,
    "zipCode" text NOT NULL,
    country text DEFAULT 'US'::text NOT NULL,
    "deliveryInstructions" text,
    "isDefault" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: customer_favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_favorites (
    id text NOT NULL,
    "userId" text NOT NULL,
    "favoriteName" text NOT NULL,
    "itemType" text NOT NULL,
    "itemData" jsonb NOT NULL,
    "orderCount" integer DEFAULT 0 NOT NULL,
    "lastOrdered" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: customer_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_profiles (
    id text NOT NULL,
    "userId" text NOT NULL,
    "firstName" text,
    "lastName" text,
    "dateOfBirth" timestamp(3) without time zone,
    phone text,
    "avatarUrl" text,
    "dietaryPreferences" text[],
    "favoritePizzaSizeId" text,
    "favoriteCrustId" text,
    "defaultOrderType" public."OrderType" DEFAULT 'PICKUP'::public."OrderType" NOT NULL,
    "marketingOptIn" boolean DEFAULT false NOT NULL,
    "loyaltyPoints" integer DEFAULT 0 NOT NULL,
    "totalOrders" integer DEFAULT 0 NOT NULL,
    "totalSpent" double precision DEFAULT 0.00 NOT NULL,
    "lastOrderDate" timestamp(3) without time zone,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: customization_groups; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: customization_options; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: email_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_logs (
    id text NOT NULL,
    "to" text NOT NULL,
    subject text NOT NULL,
    "templateKey" text,
    status public."EmailStatus" DEFAULT 'PENDING'::public."EmailStatus" NOT NULL,
    "errorMessage" text,
    "sentAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: email_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_settings (
    id text NOT NULL,
    "settingKey" text NOT NULL,
    "settingValue" text NOT NULL,
    description text,
    "isEncrypted" boolean DEFAULT false NOT NULL,
    category text DEFAULT 'general'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: email_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_templates (
    id text NOT NULL,
    "templateKey" text NOT NULL,
    name text NOT NULL,
    subject text NOT NULL,
    "htmlContent" text NOT NULL,
    "textContent" text,
    variables text[],
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: employee_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employee_profiles (
    id text NOT NULL,
    "userId" text NOT NULL,
    "employeeId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "position" text,
    department text,
    phone text,
    "emergencyContactName" text,
    "emergencyContactPhone" text,
    "hireDate" timestamp(3) without time zone,
    "hourlyWage" double precision,
    "isActive" boolean DEFAULT true NOT NULL,
    permissions text[],
    "scheduleNotes" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: item_modifiers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.item_modifiers (
    id text NOT NULL,
    "itemId" text NOT NULL,
    "modifierId" text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "maxSelectable" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: jwt_blacklist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jwt_blacklist (
    id text NOT NULL,
    jti text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: jwt_secrets; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: menu_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_categories (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "parentCategoryId" text,
    "imageUrl" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: menu_item_customizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.menu_item_customizations (
    id text NOT NULL,
    "menuItemId" text NOT NULL,
    "customizationGroupId" text NOT NULL,
    "isRequired" boolean DEFAULT false NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: modifiers; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: order_item_customizations; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: order_item_toppings; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "pizzaSizeId" text,
    "pizzaCrustId" text,
    "pizzaSauceId" text,
    "menuItemId" text,
    quantity integer DEFAULT 1 NOT NULL,
    "basePrice" double precision NOT NULL,
    "totalPrice" double precision NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "itemType" public."OrderItemType" DEFAULT 'PIZZA'::public."OrderItemType" NOT NULL,
    "specialtyCalzoneId" text,
    "specialtyPizzaId" text
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
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
    "scheduleType" text DEFAULT 'NOW'::text,
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


--
-- Name: pizza_crusts; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: pizza_sauces; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: pizza_sizes; Type: TABLE; Schema: public; Owner: -
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
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "productType" public."ProductType" DEFAULT 'PIZZA'::public."ProductType" NOT NULL
);


--
-- Name: pizza_toppings; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: price_snapshots; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: pricing_history; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: promotions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.promotions (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    type public."PromotionType" NOT NULL,
    "discountType" public."DiscountType" NOT NULL,
    "discountValue" numeric(10,2) NOT NULL,
    "minimumOrderAmount" numeric(10,2),
    "maximumDiscountAmount" numeric(10,2),
    "minimumQuantity" integer,
    "applicableCategories" text[],
    "applicableItems" text[],
    "requiresLogin" boolean DEFAULT false NOT NULL,
    "userGroupRestrictions" text[],
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "usageLimit" integer,
    "usageCount" integer DEFAULT 0 NOT NULL,
    "perUserLimit" integer,
    stackable boolean DEFAULT false NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    terms text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: specialty_calzone_sizes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.specialty_calzone_sizes (
    id text NOT NULL,
    "specialtyCalzoneId" text NOT NULL,
    "pizzaSizeId" text NOT NULL,
    price double precision NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: specialty_calzones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.specialty_calzones (
    id text NOT NULL,
    "calzoneName" text NOT NULL,
    "calzoneDescription" text NOT NULL,
    "basePrice" double precision NOT NULL,
    category text NOT NULL,
    "imageUrl" text,
    fillings text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: specialty_pizza_sizes; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: specialty_pizzas; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    password text,
    phone text,
    "dateOfBirth" timestamp(3) without time zone,
    "avatarUrl" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastLoginAt" timestamp(3) without time zone,
    "emailVerified" boolean DEFAULT false NOT NULL,
    "marketingOptIn" boolean DEFAULT false NOT NULL,
    role public."UserRole" DEFAULT 'CUSTOMER'::public."UserRole" NOT NULL,
    "resetTokenExpiry" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "resetToken" text
);


--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);


--
-- Name: cart_item_customizations cart_item_customizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_item_customizations
    ADD CONSTRAINT cart_item_customizations_pkey PRIMARY KEY (id);


--
-- Name: cart_item_pizza_toppings cart_item_pizza_toppings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_item_pizza_toppings
    ADD CONSTRAINT cart_item_pizza_toppings_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: customer_addresses customer_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_pkey PRIMARY KEY (id);


--
-- Name: customer_favorites customer_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_favorites
    ADD CONSTRAINT customer_favorites_pkey PRIMARY KEY (id);


--
-- Name: customer_profiles customer_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_profiles
    ADD CONSTRAINT customer_profiles_pkey PRIMARY KEY (id);


--
-- Name: customization_groups customization_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customization_groups
    ADD CONSTRAINT customization_groups_pkey PRIMARY KEY (id);


--
-- Name: customization_options customization_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customization_options
    ADD CONSTRAINT customization_options_pkey PRIMARY KEY (id);


--
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- Name: email_settings email_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_settings
    ADD CONSTRAINT email_settings_pkey PRIMARY KEY (id);


--
-- Name: email_templates email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);


--
-- Name: employee_profiles employee_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_profiles
    ADD CONSTRAINT employee_profiles_pkey PRIMARY KEY (id);


--
-- Name: item_modifiers item_modifiers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.item_modifiers
    ADD CONSTRAINT item_modifiers_pkey PRIMARY KEY (id);


--
-- Name: jwt_blacklist jwt_blacklist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jwt_blacklist
    ADD CONSTRAINT jwt_blacklist_pkey PRIMARY KEY (id);


--
-- Name: jwt_secrets jwt_secrets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jwt_secrets
    ADD CONSTRAINT jwt_secrets_pkey PRIMARY KEY (id);


--
-- Name: menu_categories menu_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_pkey PRIMARY KEY (id);


--
-- Name: menu_item_customizations menu_item_customizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_item_customizations
    ADD CONSTRAINT menu_item_customizations_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: modifiers modifiers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modifiers
    ADD CONSTRAINT modifiers_pkey PRIMARY KEY (id);


--
-- Name: order_item_customizations order_item_customizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item_customizations
    ADD CONSTRAINT order_item_customizations_pkey PRIMARY KEY (id);


--
-- Name: order_item_toppings order_item_toppings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item_toppings
    ADD CONSTRAINT order_item_toppings_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: pizza_crusts pizza_crusts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pizza_crusts
    ADD CONSTRAINT pizza_crusts_pkey PRIMARY KEY (id);


--
-- Name: pizza_sauces pizza_sauces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pizza_sauces
    ADD CONSTRAINT pizza_sauces_pkey PRIMARY KEY (id);


--
-- Name: pizza_sizes pizza_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pizza_sizes
    ADD CONSTRAINT pizza_sizes_pkey PRIMARY KEY (id);


--
-- Name: pizza_toppings pizza_toppings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pizza_toppings
    ADD CONSTRAINT pizza_toppings_pkey PRIMARY KEY (id);


--
-- Name: price_snapshots price_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_snapshots
    ADD CONSTRAINT price_snapshots_pkey PRIMARY KEY (id);


--
-- Name: pricing_history pricing_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_history
    ADD CONSTRAINT pricing_history_pkey PRIMARY KEY (id);


--
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: specialty_calzone_sizes specialty_calzone_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_calzone_sizes
    ADD CONSTRAINT specialty_calzone_sizes_pkey PRIMARY KEY (id);


--
-- Name: specialty_calzones specialty_calzones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_calzones
    ADD CONSTRAINT specialty_calzones_pkey PRIMARY KEY (id);


--
-- Name: specialty_pizza_sizes specialty_pizza_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_pizza_sizes
    ADD CONSTRAINT specialty_pizza_sizes_pkey PRIMARY KEY (id);


--
-- Name: specialty_pizzas specialty_pizzas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_pizzas
    ADD CONSTRAINT specialty_pizzas_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: app_settings_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX app_settings_key_key ON public.app_settings USING btree (key);


--
-- Name: cart_items_sessionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "cart_items_sessionId_idx" ON public.cart_items USING btree ("sessionId");


--
-- Name: cart_items_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "cart_items_userId_idx" ON public.cart_items USING btree ("userId");


--
-- Name: customer_profiles_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "customer_profiles_userId_key" ON public.customer_profiles USING btree ("userId");


--
-- Name: customization_groups_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "customization_groups_categoryId_idx" ON public.customization_groups USING btree ("categoryId");


--
-- Name: customization_options_groupId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "customization_options_groupId_idx" ON public.customization_options USING btree ("groupId");


--
-- Name: email_settings_settingKey_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "email_settings_settingKey_key" ON public.email_settings USING btree ("settingKey");


--
-- Name: email_templates_templateKey_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "email_templates_templateKey_key" ON public.email_templates USING btree ("templateKey");


--
-- Name: employee_profiles_employeeId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "employee_profiles_employeeId_key" ON public.employee_profiles USING btree ("employeeId");


--
-- Name: employee_profiles_userId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "employee_profiles_userId_key" ON public.employee_profiles USING btree ("userId");


--
-- Name: item_modifiers_itemId_modifierId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "item_modifiers_itemId_modifierId_key" ON public.item_modifiers USING btree ("itemId", "modifierId");


--
-- Name: jwt_blacklist_expiresAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "jwt_blacklist_expiresAt_idx" ON public.jwt_blacklist USING btree ("expiresAt");


--
-- Name: jwt_blacklist_jti_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX jwt_blacklist_jti_key ON public.jwt_blacklist USING btree (jti);


--
-- Name: jwt_secrets_kid_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX jwt_secrets_kid_key ON public.jwt_secrets USING btree (kid);


--
-- Name: menu_categories_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX menu_categories_name_key ON public.menu_categories USING btree (name);


--
-- Name: menu_categories_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX menu_categories_slug_key ON public.menu_categories USING btree (slug);


--
-- Name: menu_item_customizations_menuItemId_customizationGroupId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "menu_item_customizations_menuItemId_customizationGroupId_key" ON public.menu_item_customizations USING btree ("menuItemId", "customizationGroupId");


--
-- Name: menu_items_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "menu_items_categoryId_idx" ON public.menu_items USING btree ("categoryId");


--
-- Name: order_item_toppings_orderItemId_pizzaToppingId_section_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "order_item_toppings_orderItemId_pizzaToppingId_section_key" ON public.order_item_toppings USING btree ("orderItemId", "pizzaToppingId", section);


--
-- Name: order_items_orderId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "order_items_orderId_idx" ON public.order_items USING btree ("orderId");


--
-- Name: orders_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "orders_createdAt_idx" ON public.orders USING btree ("createdAt");


--
-- Name: orders_orderNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "orders_orderNumber_key" ON public.orders USING btree ("orderNumber");


--
-- Name: orders_orderType_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "orders_orderType_idx" ON public.orders USING btree ("orderType");


--
-- Name: orders_status_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "orders_status_createdAt_idx" ON public.orders USING btree (status, "createdAt");


--
-- Name: orders_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_status_idx ON public.orders USING btree (status);


--
-- Name: orders_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "orders_userId_idx" ON public.orders USING btree ("userId");


--
-- Name: pizza_crusts_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pizza_crusts_name_key ON public.pizza_crusts USING btree (name);


--
-- Name: pizza_sauces_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pizza_sauces_name_key ON public.pizza_sauces USING btree (name);


--
-- Name: pizza_sizes_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pizza_sizes_name_key ON public.pizza_sizes USING btree (name);


--
-- Name: pizza_toppings_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pizza_toppings_name_key ON public.pizza_toppings USING btree (name);


--
-- Name: promotions_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "promotions_isActive_idx" ON public.promotions USING btree ("isActive");


--
-- Name: promotions_priority_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX promotions_priority_idx ON public.promotions USING btree (priority);


--
-- Name: promotions_startDate_endDate_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "promotions_startDate_endDate_idx" ON public.promotions USING btree ("startDate", "endDate");


--
-- Name: promotions_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX promotions_type_idx ON public.promotions USING btree (type);


--
-- Name: refresh_tokens_expiresAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "refresh_tokens_expiresAt_idx" ON public.refresh_tokens USING btree ("expiresAt");


--
-- Name: refresh_tokens_tokenHash_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON public.refresh_tokens USING btree ("tokenHash");


--
-- Name: refresh_tokens_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "refresh_tokens_userId_idx" ON public.refresh_tokens USING btree ("userId");


--
-- Name: specialty_calzone_sizes_specialtyCalzoneId_pizzaSizeId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "specialty_calzone_sizes_specialtyCalzoneId_pizzaSizeId_key" ON public.specialty_calzone_sizes USING btree ("specialtyCalzoneId", "pizzaSizeId");


--
-- Name: specialty_calzones_calzoneName_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "specialty_calzones_calzoneName_key" ON public.specialty_calzones USING btree ("calzoneName");


--
-- Name: specialty_calzones_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX specialty_calzones_category_idx ON public.specialty_calzones USING btree (category);


--
-- Name: specialty_calzones_isActive_sortOrder_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "specialty_calzones_isActive_sortOrder_idx" ON public.specialty_calzones USING btree ("isActive", "sortOrder");


--
-- Name: specialty_pizza_sizes_specialtyPizzaId_pizzaSizeId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "specialty_pizza_sizes_specialtyPizzaId_pizzaSizeId_key" ON public.specialty_pizza_sizes USING btree ("specialtyPizzaId", "pizzaSizeId");


--
-- Name: specialty_pizzas_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX specialty_pizzas_category_idx ON public.specialty_pizzas USING btree (category);


--
-- Name: specialty_pizzas_isActive_sortOrder_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "specialty_pizzas_isActive_sortOrder_idx" ON public.specialty_pizzas USING btree ("isActive", "sortOrder");


--
-- Name: specialty_pizzas_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX specialty_pizzas_name_key ON public.specialty_pizzas USING btree (name);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_isActive_idx" ON public.users USING btree ("isActive");


--
-- Name: cart_item_customizations cart_item_customizations_cartItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_item_customizations
    ADD CONSTRAINT "cart_item_customizations_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES public.cart_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_item_customizations cart_item_customizations_customizationOptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_item_customizations
    ADD CONSTRAINT "cart_item_customizations_customizationOptionId_fkey" FOREIGN KEY ("customizationOptionId") REFERENCES public.customization_options(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: cart_item_pizza_toppings cart_item_pizza_toppings_cartItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_item_pizza_toppings
    ADD CONSTRAINT "cart_item_pizza_toppings_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES public.cart_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_item_pizza_toppings cart_item_pizza_toppings_pizzaToppingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_item_pizza_toppings
    ADD CONSTRAINT "cart_item_pizza_toppings_pizzaToppingId_fkey" FOREIGN KEY ("pizzaToppingId") REFERENCES public.pizza_toppings(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: cart_items cart_items_menuItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_items cart_items_pizzaCrustId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_pizzaCrustId_fkey" FOREIGN KEY ("pizzaCrustId") REFERENCES public.pizza_crusts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_items cart_items_pizzaSauceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_pizzaSauceId_fkey" FOREIGN KEY ("pizzaSauceId") REFERENCES public.pizza_sauces(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_items cart_items_pizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_items cart_items_specialtyCalzoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_specialtyCalzoneId_fkey" FOREIGN KEY ("specialtyCalzoneId") REFERENCES public.specialty_calzones(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_items cart_items_specialtyPizzaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_specialtyPizzaId_fkey" FOREIGN KEY ("specialtyPizzaId") REFERENCES public.specialty_pizzas(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_items cart_items_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: customer_addresses customer_addresses_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT "customer_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_favorites customer_favorites_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_favorites
    ADD CONSTRAINT "customer_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_profiles customer_profiles_favoriteCrustId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_profiles
    ADD CONSTRAINT "customer_profiles_favoriteCrustId_fkey" FOREIGN KEY ("favoriteCrustId") REFERENCES public.pizza_crusts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: customer_profiles customer_profiles_favoritePizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_profiles
    ADD CONSTRAINT "customer_profiles_favoritePizzaSizeId_fkey" FOREIGN KEY ("favoritePizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: customer_profiles customer_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_profiles
    ADD CONSTRAINT "customer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customization_groups customization_groups_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customization_groups
    ADD CONSTRAINT "customization_groups_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.menu_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: customization_options customization_options_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customization_options
    ADD CONSTRAINT "customization_options_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.customization_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: employee_profiles employee_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employee_profiles
    ADD CONSTRAINT "employee_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: item_modifiers item_modifiers_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.item_modifiers
    ADD CONSTRAINT "item_modifiers_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: item_modifiers item_modifiers_modifierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.item_modifiers
    ADD CONSTRAINT "item_modifiers_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES public.modifiers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menu_categories menu_categories_parentCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT "menu_categories_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES public.menu_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: menu_item_customizations menu_item_customizations_customizationGroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_item_customizations
    ADD CONSTRAINT "menu_item_customizations_customizationGroupId_fkey" FOREIGN KEY ("customizationGroupId") REFERENCES public.customization_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menu_item_customizations menu_item_customizations_menuItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_item_customizations
    ADD CONSTRAINT "menu_item_customizations_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: menu_items menu_items_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "menu_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.menu_categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item_customizations order_item_customizations_customizationOptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item_customizations
    ADD CONSTRAINT "order_item_customizations_customizationOptionId_fkey" FOREIGN KEY ("customizationOptionId") REFERENCES public.customization_options(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_item_customizations order_item_customizations_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item_customizations
    ADD CONSTRAINT "order_item_customizations_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public.order_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item_toppings order_item_toppings_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item_toppings
    ADD CONSTRAINT "order_item_toppings_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public.order_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item_toppings order_item_toppings_pizzaToppingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item_toppings
    ADD CONSTRAINT "order_item_toppings_pizzaToppingId_fkey" FOREIGN KEY ("pizzaToppingId") REFERENCES public.pizza_toppings(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_items order_items_menuItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_items order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_pizzaCrustId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_pizzaCrustId_fkey" FOREIGN KEY ("pizzaCrustId") REFERENCES public.pizza_crusts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_items order_items_pizzaSauceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_pizzaSauceId_fkey" FOREIGN KEY ("pizzaSauceId") REFERENCES public.pizza_sauces(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_items order_items_pizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_items order_items_specialtyCalzoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_specialtyCalzoneId_fkey" FOREIGN KEY ("specialtyCalzoneId") REFERENCES public.specialty_calzones(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_items order_items_specialtyPizzaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_specialtyPizzaId_fkey" FOREIGN KEY ("specialtyPizzaId") REFERENCES public.specialty_pizzas(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: orders orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: price_snapshots price_snapshots_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_snapshots
    ADD CONSTRAINT "price_snapshots_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: specialty_calzone_sizes specialty_calzone_sizes_pizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_calzone_sizes
    ADD CONSTRAINT "specialty_calzone_sizes_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: specialty_calzone_sizes specialty_calzone_sizes_specialtyCalzoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_calzone_sizes
    ADD CONSTRAINT "specialty_calzone_sizes_specialtyCalzoneId_fkey" FOREIGN KEY ("specialtyCalzoneId") REFERENCES public.specialty_calzones(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: specialty_pizza_sizes specialty_pizza_sizes_pizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_pizza_sizes
    ADD CONSTRAINT "specialty_pizza_sizes_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: specialty_pizza_sizes specialty_pizza_sizes_specialtyPizzaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.specialty_pizza_sizes
    ADD CONSTRAINT "specialty_pizza_sizes_specialtyPizzaId_fkey" FOREIGN KEY ("specialtyPizzaId") REFERENCES public.specialty_pizzas(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

