--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

-- Started on 2025-08-31 06:42:52

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
-- TOC entry 1023 (class 1247 OID 48146)
-- Name: CartItemType; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."CartItemType" AS ENUM (
    'PIZZA',
    'CALZONE',
    'MENU_ITEM',
    'CUSTOM'
);


ALTER TYPE public."CartItemType" OWNER TO auy1jll;

--
-- TOC entry 897 (class 1247 OID 47476)
-- Name: CustomizationType; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."CustomizationType" AS ENUM (
    'SINGLE_SELECT',
    'MULTI_SELECT',
    'QUANTITY_SELECT',
    'SPECIAL_LOGIC'
);


ALTER TYPE public."CustomizationType" OWNER TO auy1jll;

--
-- TOC entry 906 (class 1247 OID 47516)
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PERCENTAGE',
    'FIXED_AMOUNT',
    'FREE_ITEM'
);


ALTER TYPE public."DiscountType" OWNER TO auy1jll;

--
-- TOC entry 909 (class 1247 OID 47524)
-- Name: EmailStatus; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."EmailStatus" AS ENUM (
    'PENDING',
    'SENT',
    'FAILED',
    'DELIVERED',
    'BOUNCED'
);


ALTER TYPE public."EmailStatus" OWNER TO auy1jll;

--
-- TOC entry 894 (class 1247 OID 47464)
-- Name: ModifierType; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."ModifierType" AS ENUM (
    'TOPPING',
    'SIDE',
    'DRESSING',
    'CONDIMENT',
    'SIZE'
);


ALTER TYPE public."ModifierType" OWNER TO auy1jll;

--
-- TOC entry 1026 (class 1247 OID 48156)
-- Name: OrderItemType; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."OrderItemType" AS ENUM (
    'PIZZA',
    'CALZONE',
    'MENU_ITEM',
    'CUSTOM'
);


ALTER TYPE public."OrderItemType" OWNER TO auy1jll;

--
-- TOC entry 888 (class 1247 OID 47440)
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO auy1jll;

--
-- TOC entry 885 (class 1247 OID 47434)
-- Name: OrderType; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."OrderType" AS ENUM (
    'PICKUP',
    'DELIVERY'
);


ALTER TYPE public."OrderType" OWNER TO auy1jll;

--
-- TOC entry 900 (class 1247 OID 47486)
-- Name: PriceType; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."PriceType" AS ENUM (
    'FLAT',
    'PERCENTAGE',
    'PER_UNIT'
);


ALTER TYPE public."PriceType" OWNER TO auy1jll;

--
-- TOC entry 879 (class 1247 OID 47416)
-- Name: ProductType; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."ProductType" AS ENUM (
    'PIZZA',
    'CALZONE'
);


ALTER TYPE public."ProductType" OWNER TO auy1jll;

--
-- TOC entry 903 (class 1247 OID 47494)
-- Name: PromotionType; Type: TYPE; Schema: public; Owner: auy1jll
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


ALTER TYPE public."PromotionType" OWNER TO auy1jll;

--
-- TOC entry 891 (class 1247 OID 47454)
-- Name: SettingType; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."SettingType" AS ENUM (
    'STRING',
    'NUMBER',
    'BOOLEAN',
    'JSON'
);


ALTER TYPE public."SettingType" OWNER TO auy1jll;

--
-- TOC entry 882 (class 1247 OID 47422)
-- Name: ToppingCategory; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."ToppingCategory" AS ENUM (
    'MEAT',
    'VEGETABLE',
    'CHEESE',
    'SAUCE',
    'SPECIALTY'
);


ALTER TYPE public."ToppingCategory" OWNER TO auy1jll;

--
-- TOC entry 876 (class 1247 OID 47407)
-- Name: UserRole; Type: TYPE; Schema: public; Owner: auy1jll
--

CREATE TYPE public."UserRole" AS ENUM (
    'CUSTOMER',
    'EMPLOYEE',
    'ADMIN',
    'SUPER_ADMIN'
);


ALTER TYPE public."UserRole" OWNER TO auy1jll;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 47715)
-- Name: app_settings; Type: TABLE; Schema: public; Owner: auy1jll
--

CREATE TABLE public.app_settings (
    id text NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    type public."SettingType" DEFAULT 'STRING'::public."SettingType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.app_settings OWNER TO auy1jll;

--
-- TOC entry 246 (class 1259 OID 47851)
-- Name: cart_item_customizations; Type: TABLE; Schema: public; Owner: auy1jll
--

CREATE TABLE public.cart_item_customizations (
    id text NOT NULL,
    "cartItemId" text NOT NULL,
    "customizationOptionId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.cart_item_customizations OWNER TO auy1jll;

--
-- TOC entry 247 (class 1259 OID 47860)
-- Name: cart_item_pizza_toppings; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.cart_item_pizza_toppings OWNER TO auy1jll;

--
-- TOC entry 245 (class 1259 OID 47842)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.cart_items OWNER TO auy1jll;

--
-- TOC entry 217 (class 1259 OID 47560)
-- Name: customer_addresses; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.customer_addresses OWNER TO auy1jll;

--
-- TOC entry 219 (class 1259 OID 47580)
-- Name: customer_favorites; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.customer_favorites OWNER TO auy1jll;

--
-- TOC entry 216 (class 1259 OID 47547)
-- Name: customer_profiles; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.customer_profiles OWNER TO auy1jll;

--
-- TOC entry 242 (class 1259 OID 47807)
-- Name: customization_groups; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.customization_groups OWNER TO auy1jll;

--
-- TOC entry 243 (class 1259 OID 47819)
-- Name: customization_options; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.customization_options OWNER TO auy1jll;

--
-- TOC entry 251 (class 1259 OID 47903)
-- Name: email_logs; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.email_logs OWNER TO auy1jll;

--
-- TOC entry 250 (class 1259 OID 47893)
-- Name: email_settings; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.email_settings OWNER TO auy1jll;

--
-- TOC entry 249 (class 1259 OID 47884)
-- Name: email_templates; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.email_templates OWNER TO auy1jll;

--
-- TOC entry 218 (class 1259 OID 47571)
-- Name: employee_profiles; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.employee_profiles OWNER TO auy1jll;

--
-- TOC entry 241 (class 1259 OID 47798)
-- Name: item_modifiers; Type: TABLE; Schema: public; Owner: auy1jll
--

CREATE TABLE public.item_modifiers (
    id text NOT NULL,
    "itemId" text NOT NULL,
    "modifierId" text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "maxSelectable" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.item_modifiers OWNER TO auy1jll;

--
-- TOC entry 236 (class 1259 OID 47749)
-- Name: jwt_blacklist; Type: TABLE; Schema: public; Owner: auy1jll
--

CREATE TABLE public.jwt_blacklist (
    id text NOT NULL,
    jti text NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.jwt_blacklist OWNER TO auy1jll;

--
-- TOC entry 237 (class 1259 OID 47757)
-- Name: jwt_secrets; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.jwt_secrets OWNER TO auy1jll;

--
-- TOC entry 238 (class 1259 OID 47767)
-- Name: menu_categories; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.menu_categories OWNER TO auy1jll;

--
-- TOC entry 244 (class 1259 OID 47832)
-- Name: menu_item_customizations; Type: TABLE; Schema: public; Owner: auy1jll
--

CREATE TABLE public.menu_item_customizations (
    id text NOT NULL,
    "menuItemId" text NOT NULL,
    "customizationGroupId" text NOT NULL,
    "isRequired" boolean DEFAULT false NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.menu_item_customizations OWNER TO auy1jll;

--
-- TOC entry 239 (class 1259 OID 47777)
-- Name: menu_items; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.menu_items OWNER TO auy1jll;

--
-- TOC entry 240 (class 1259 OID 47788)
-- Name: modifiers; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.modifiers OWNER TO auy1jll;

--
-- TOC entry 231 (class 1259 OID 47706)
-- Name: order_item_customizations; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.order_item_customizations OWNER TO auy1jll;

--
-- TOC entry 230 (class 1259 OID 47695)
-- Name: order_item_toppings; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.order_item_toppings OWNER TO auy1jll;

--
-- TOC entry 229 (class 1259 OID 47686)
-- Name: order_items; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.order_items OWNER TO auy1jll;

--
-- TOC entry 228 (class 1259 OID 47674)
-- Name: orders; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.orders OWNER TO auy1jll;

--
-- TOC entry 221 (class 1259 OID 47600)
-- Name: pizza_crusts; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.pizza_crusts OWNER TO auy1jll;

--
-- TOC entry 222 (class 1259 OID 47611)
-- Name: pizza_sauces; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.pizza_sauces OWNER TO auy1jll;

--
-- TOC entry 220 (class 1259 OID 47589)
-- Name: pizza_sizes; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.pizza_sizes OWNER TO auy1jll;

--
-- TOC entry 223 (class 1259 OID 47623)
-- Name: pizza_toppings; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.pizza_toppings OWNER TO auy1jll;

--
-- TOC entry 233 (class 1259 OID 47724)
-- Name: price_snapshots; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.price_snapshots OWNER TO auy1jll;

--
-- TOC entry 234 (class 1259 OID 47732)
-- Name: pricing_history; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.pricing_history OWNER TO auy1jll;

--
-- TOC entry 248 (class 1259 OID 47871)
-- Name: promotions; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.promotions OWNER TO auy1jll;

--
-- TOC entry 235 (class 1259 OID 47740)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.refresh_tokens OWNER TO auy1jll;

--
-- TOC entry 227 (class 1259 OID 47665)
-- Name: specialty_calzone_sizes; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.specialty_calzone_sizes OWNER TO auy1jll;

--
-- TOC entry 226 (class 1259 OID 47655)
-- Name: specialty_calzones; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.specialty_calzones OWNER TO auy1jll;

--
-- TOC entry 225 (class 1259 OID 47646)
-- Name: specialty_pizza_sizes; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.specialty_pizza_sizes OWNER TO auy1jll;

--
-- TOC entry 224 (class 1259 OID 47636)
-- Name: specialty_pizzas; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.specialty_pizzas OWNER TO auy1jll;

--
-- TOC entry 215 (class 1259 OID 47535)
-- Name: users; Type: TABLE; Schema: public; Owner: auy1jll
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


ALTER TABLE public.users OWNER TO auy1jll;

--
-- TOC entry 5264 (class 0 OID 47715)
-- Dependencies: 232
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.app_settings (id, key, value, type, "createdAt", "updatedAt") FROM stdin;
cmez7o5lt0003vknkjfru4c7i	emailFromName	Greenland Famous Pizza	STRING	2025-08-31 04:49:23.298	2025-08-31 04:49:23.298
cmez7o5lu0004vknk87tbnc1d	emailReplyTo		STRING	2025-08-31 04:49:23.299	2025-08-31 04:49:23.299
cmez7o5lo0000vknkwdrxuglz	gmailUser	auy1jlll@gmail.com	STRING	2025-08-31 04:49:23.292	2025-08-31 07:50:23.378
cmez7o5ls0002vknk9jpckgwa	emailServiceEnabled	true	BOOLEAN	2025-08-31 04:49:23.296	2025-08-31 04:50:34.554
cmez7wd8j0000vk80i9ng2tu4	emailNotifications	true	BOOLEAN	2025-08-31 04:55:46.435	2025-08-31 04:56:06.092
cmez7wsg70001vk4c5rcwn5tw	orderNotifications	true	BOOLEAN	2025-08-31 04:56:06.151	2025-08-31 04:56:06.151
cmez7wsg80002vk4cxd4fymix	customerNotifications	true	BOOLEAN	2025-08-31 04:56:06.153	2025-08-31 04:56:06.153
cmez8alzr0000vkowntbx1me2	businessName	Greenland Famous Pizza	STRING	2025-08-31 05:06:50.968	2025-08-31 05:06:50.968
cmez8alzt0001vkowwv955h2t	businessPhone	(603) 555-0123	STRING	2025-08-31 05:06:50.97	2025-08-31 05:06:50.97
cmez8alzv0003vkow7vlvrhox	businessAddress	123 Main Street, Greenland, NH 03840	STRING	2025-08-31 05:06:50.971	2025-08-31 05:06:50.971
cmez8alzw0004vkowjqqj6hgc	businessDescription	Authentic Italian pizza and cuisine since 1985	STRING	2025-08-31 05:06:50.972	2025-08-31 05:06:50.972
cmez8alzx0005vkowwxj4fznt	mondayOpen	11:00	STRING	2025-08-31 05:06:50.973	2025-08-31 05:06:50.973
cmez8alzy0006vkowd8ea11f9	mondayClose	22:00	STRING	2025-08-31 05:06:50.974	2025-08-31 05:06:50.974
cmez8alzy0007vkow32q1g0a7	mondayClosed	false	BOOLEAN	2025-08-31 05:06:50.975	2025-08-31 05:06:50.975
cmez8alzz0008vkow7p5rssa8	tuesdayOpen	11:00	STRING	2025-08-31 05:06:50.976	2025-08-31 05:06:50.976
cmez8am000009vkow064o24b5	tuesdayClose	22:00	STRING	2025-08-31 05:06:50.977	2025-08-31 05:06:50.977
cmez8am01000avkowknsafahb	tuesdayClosed	false	BOOLEAN	2025-08-31 05:06:50.977	2025-08-31 05:06:50.977
cmez8am02000bvkowcwg1a06z	wednesdayOpen	11:00	STRING	2025-08-31 05:06:50.978	2025-08-31 05:06:50.978
cmez8am02000cvkowsdcqcnpd	wednesdayClose	22:00	STRING	2025-08-31 05:06:50.979	2025-08-31 05:06:50.979
cmez8am03000dvkowk2v720nv	wednesdayClosed	false	BOOLEAN	2025-08-31 05:06:50.98	2025-08-31 05:06:50.98
cmez8am04000evkowt049n51r	thursdayOpen	11:00	STRING	2025-08-31 05:06:50.98	2025-08-31 05:06:50.98
cmez8am05000fvkowr6j41swy	thursdayClose	22:00	STRING	2025-08-31 05:06:50.981	2025-08-31 05:06:50.981
cmez8am05000gvkowhcw9rhem	thursdayClosed	false	BOOLEAN	2025-08-31 05:06:50.982	2025-08-31 05:06:50.982
cmez8am06000hvkow318xtrv0	fridayOpen	11:00	STRING	2025-08-31 05:06:50.982	2025-08-31 05:06:50.982
cmez8am07000ivkow6crzitwk	fridayClose	23:00	STRING	2025-08-31 05:06:50.983	2025-08-31 05:06:50.983
cmez8am07000jvkow1azqg1rd	fridayClosed	false	BOOLEAN	2025-08-31 05:06:50.984	2025-08-31 05:06:50.984
cmez8am08000kvkowwzlxwzsm	saturdayOpen	11:00	STRING	2025-08-31 05:06:50.985	2025-08-31 05:06:50.985
cmez8am09000lvkownykqt7fs	saturdayClose	23:00	STRING	2025-08-31 05:06:50.986	2025-08-31 05:06:50.986
cmez8am0a000mvkowrzkhvs6w	saturdayClosed	false	BOOLEAN	2025-08-31 05:06:50.986	2025-08-31 05:06:50.986
cmez8am0b000nvkowc782cnox	sundayOpen	12:00	STRING	2025-08-31 05:06:50.987	2025-08-31 05:06:50.987
cmez8am0b000ovkowy5t3qwxx	sundayClose	21:00	STRING	2025-08-31 05:06:50.988	2025-08-31 05:06:50.988
cmez8am0c000pvkow6n3kzzgh	sundayClosed	false	BOOLEAN	2025-08-31 05:06:50.989	2025-08-31 05:06:50.989
cmez8am0d000qvkowk457iy4c	operating_hours	{"monday":"11:00-22:00","tuesday":"11:00-22:00","wednesday":"11:00-22:00","thursday":"11:00-22:00","friday":"11:00-23:00","saturday":"11:00-23:00","sunday":"12:00-21:00"}	JSON	2025-08-31 05:06:50.989	2025-08-31 05:06:50.989
cmez8am0e000rvkowkj2az45m	taxRate	9.0	NUMBER	2025-08-31 05:06:50.99	2025-08-31 05:06:50.99
cmez8am0e000svkowz2zu2je4	deliveryFee	3.99	NUMBER	2025-08-31 05:06:50.991	2025-08-31 05:06:50.991
cmez8am0f000tvkowryn8rc4c	deliveryEnabled	true	BOOLEAN	2025-08-31 05:06:50.991	2025-08-31 05:06:50.991
cmez8am0g000uvkow47w8azfl	minimumOrder	15.00	NUMBER	2025-08-31 05:06:50.992	2025-08-31 05:06:50.992
cmez8am0g000vvkowsuo0aof3	tipPercentages	[15,18,20,25]	JSON	2025-08-31 05:06:50.993	2025-08-31 05:06:50.993
cmez8am0h000wvkow1xdz0sm3	defaultTipPercentage	18	NUMBER	2025-08-31 05:06:50.993	2025-08-31 05:06:50.993
cmez8am0i000xvkowy7sevixe	allowPayAtPickup	true	BOOLEAN	2025-08-31 05:06:50.994	2025-08-31 05:06:50.994
cmez8am0i000yvkowyy1ml1hs	allowPayLater	false	BOOLEAN	2025-08-31 05:06:50.995	2025-08-31 05:06:50.995
cmez8am0j000zvkowjlzr4wbn	payLaterMinimumOrder	25.00	NUMBER	2025-08-31 05:06:50.996	2025-08-31 05:06:50.996
cmez8am0k0010vkow5m3mraiu	intensityLightMultiplier	0.8	NUMBER	2025-08-31 05:06:50.996	2025-08-31 05:06:50.996
cmez8am0k0011vkow1vpdf6r0	intensityRegularMultiplier	1.0	NUMBER	2025-08-31 05:06:50.997	2025-08-31 05:06:50.997
cmez8am0l0012vkow3ho09fo5	intensityExtraMultiplier	1.2	NUMBER	2025-08-31 05:06:50.998	2025-08-31 05:06:50.998
cmez8am0m0013vkow3tu34n8l	removalCreditPercentage	10	NUMBER	2025-08-31 05:06:50.998	2025-08-31 05:06:50.998
cmez8am0n0014vkoww7sxyzxd	preparationTime	20	NUMBER	2025-08-31 05:06:50.999	2025-08-31 05:06:50.999
cmez8am0n0015vkow7im1y94v	deliveryTimeBuffer	10	NUMBER	2025-08-31 05:06:51	2025-08-31 05:06:51
cmez8am0o0016vkow14pehnhe	showDeliveryTime	true	BOOLEAN	2025-08-31 05:06:51	2025-08-31 05:06:51
cmez8am0p0017vkow96glgrlv	showPricingBreakdown	true	BOOLEAN	2025-08-31 05:06:51.001	2025-08-31 05:06:51.001
cmez8am0q0018vkowvr4ec8jl	allowRemovalCredits	true	BOOLEAN	2025-08-31 05:06:51.002	2025-08-31 05:06:51.002
cmez8am0r0019vkowpyzqgl1i	enableRewards	true	BOOLEAN	2025-08-31 05:06:51.003	2025-08-31 05:06:51.003
cmez8am0s001avkow0rkbjkjx	enableNotifications	true	BOOLEAN	2025-08-31 05:06:51.004	2025-08-31 05:06:51.004
cmez8am0t001bvkows2nap4mr	enableInventoryTracking	false	BOOLEAN	2025-08-31 05:06:51.005	2025-08-31 05:06:51.005
cmez8am1d001cvkow9h7xap47	enableLoyaltyProgram	true	BOOLEAN	2025-08-31 05:06:51.026	2025-08-31 05:06:51.026
cmez8am1v001dvkowfx6bdkuu	enableMultiLocation	false	BOOLEAN	2025-08-31 05:06:51.043	2025-08-31 05:06:51.043
cmez8am1w001evkowf8fsg85u	enableAdvancedReporting	true	BOOLEAN	2025-08-31 05:06:51.045	2025-08-31 05:06:51.045
cmez8am1y001fvkowmu2qyxl5	primaryColor	#FF6B35	STRING	2025-08-31 05:06:51.046	2025-08-31 05:06:51.046
cmez8am1z001gvkow1d28p7bs	secondaryColor	#FFA500	STRING	2025-08-31 05:06:51.048	2025-08-31 05:06:51.048
cmez8am21001hvkow8rcy5q4m	logoUrl	/logo.png	STRING	2025-08-31 05:06:51.049	2025-08-31 05:06:51.049
cmez8am22001ivkowtccanm4t	faviconUrl	/favicon.ico	STRING	2025-08-31 05:06:51.05	2025-08-31 05:06:51.05
cmez8am23001jvkowkw0j9fej	themeMode	light	STRING	2025-08-31 05:06:51.052	2025-08-31 05:06:51.052
cmez8am25001kvkowgzrq75rb	brandFont	Inter	STRING	2025-08-31 05:06:51.053	2025-08-31 05:06:51.053
cmez8am26001lvkowikllj9b6	headerBackgroundColor	#1a1a1a	STRING	2025-08-31 05:06:51.054	2025-08-31 05:06:51.054
cmez8am27001mvkownq7rarm8	accentColor	#FF6B35	STRING	2025-08-31 05:06:51.055	2025-08-31 05:06:51.055
cmez8am28001nvkow5t2u5e7p	customCSS		STRING	2025-08-31 05:06:51.057	2025-08-31 05:06:51.057
cmez8am29001ovkow26m1ud9o	brand_colors	{"primary":"#FF6B35","secondary":"#FFA500","accent":"#FF6B35"}	JSON	2025-08-31 05:06:51.058	2025-08-31 05:06:51.058
cmez8am2b001pvkowtxmvsrqj	smsNotifications	false	BOOLEAN	2025-08-31 05:06:51.059	2025-08-31 05:06:51.059
cmez8am2c001qvkow07893o4m	adminAlerts	true	BOOLEAN	2025-08-31 05:06:51.06	2025-08-31 05:06:51.06
cmez8am2d001rvkow1rabhvof	inventoryAlerts	true	BOOLEAN	2025-08-31 05:06:51.061	2025-08-31 05:06:51.061
cmez8am2e001svkow4ehl21tz	lowStockAlerts	true	BOOLEAN	2025-08-31 05:06:51.062	2025-08-31 05:06:51.062
cmez8am2f001tvkowp6v73k85	rateLimitWindowSeconds	60	NUMBER	2025-08-31 05:06:51.064	2025-08-31 05:06:51.064
cmez8alzu0002vkowgaaufy7b	businessEmail	info@greenlandFamous.com	STRING	2025-08-31 05:06:50.971	2025-08-31 05:16:55.57
cmez7o5lr0001vknk63jyojk3	gmailAppPassword	apjniqjmtqmjmnwf	STRING	2025-08-31 04:49:23.295	2025-08-31 07:50:23.384
cmez8am2g001uvkow2kqhq0li	rateLimitMaxRequests	100	NUMBER	2025-08-31 05:06:51.065	2025-08-31 05:06:51.065
cmez8am2i001vvkowmuajol7j	adminRateLimitWindowSeconds	60	NUMBER	2025-08-31 05:06:51.066	2025-08-31 05:06:51.066
cmez8am2j001wvkow3rhrj5vo	adminRateLimitMaxRequests	500	NUMBER	2025-08-31 05:06:51.067	2025-08-31 05:06:51.067
cmez8am2k001xvkowina0m1z0	kitchenPollingIntervalSeconds	30	NUMBER	2025-08-31 05:06:51.068	2025-08-31 05:06:51.068
cmez8am2m001zvkowwciam7r8	facebookUrl	https://facebook.com/greenlandpizza	STRING	2025-08-31 05:06:51.07	2025-08-31 05:06:51.07
cmez8am2n0020vkow5sv53e2e	instagramUrl	https://instagram.com/greenlandpizza	STRING	2025-08-31 05:06:51.071	2025-08-31 05:06:51.071
cmez8am2o0021vkow521a0moc	twitterUrl	https://twitter.com/greenlandpizza	STRING	2025-08-31 05:06:51.072	2025-08-31 05:06:51.072
cmez8am2p0022vkowglkybzsw	googleMapsUrl		STRING	2025-08-31 05:06:51.073	2025-08-31 05:06:51.073
cmez8am2q0024vkow1wgxlm5n	cateringPhone	(603) 555-0123	STRING	2025-08-31 05:06:51.075	2025-08-31 05:06:51.075
cmez8am2r0025vkowdavdh7a6	managerOnDuty	John Smith	STRING	2025-08-31 05:06:51.076	2025-08-31 05:06:51.076
cmez8am2s0026vkowdpd3bh2v	storeManager	Jane Doe	STRING	2025-08-31 05:06:51.077	2025-08-31 05:06:51.077
cmez8am2t0027vkowf1yx6jx4	showPrices	true	BOOLEAN	2025-08-31 05:06:51.077	2025-08-31 05:06:51.077
cmez8am2u0028vkowfsmlfyc3	showCalories	false	BOOLEAN	2025-08-31 05:06:51.078	2025-08-31 05:06:51.078
cmez8am2v0029vkowx95uehky	showAllergens	true	BOOLEAN	2025-08-31 05:06:51.079	2025-08-31 05:06:51.079
cmez8am2w002avkow11fl2wfl	enableOnlineOrdering	true	BOOLEAN	2025-08-31 05:06:51.081	2025-08-31 05:06:51.081
cmez8am2y002bvkowwqlr2opd	enableReservations	true	BOOLEAN	2025-08-31 05:06:51.082	2025-08-31 05:06:51.082
cmez8am2z002cvkowal97cwxg	enableCatering	true	BOOLEAN	2025-08-31 05:06:51.083	2025-08-31 05:06:51.083
cmez8am30002dvkowf0w595ab	maxOrderAdvanceDays	7	NUMBER	2025-08-31 05:06:51.084	2025-08-31 05:06:51.084
cmez8am31002evkowuv3dfjnn	minOrderAdvanceHours	1	NUMBER	2025-08-31 05:06:51.085	2025-08-31 05:06:51.085
cmez8am32002fvkownsyqvknm	acceptCash	true	BOOLEAN	2025-08-31 05:06:51.086	2025-08-31 05:06:51.086
cmez8am34002hvkowvhdk2px1	acceptDebitCard	true	BOOLEAN	2025-08-31 05:06:51.088	2025-08-31 05:06:51.088
cmez8am35002jvkowbj5i5lfd	squarePaymentEnabled	false	BOOLEAN	2025-08-31 05:06:51.09	2025-08-31 05:06:51.09
cmez8am36002kvkowy1adg0j8	stripePaymentEnabled	false	BOOLEAN	2025-08-31 05:06:51.091	2025-08-31 05:06:51.091
cmez8am37002lvkow8or38ywx	paypalEnabled	false	BOOLEAN	2025-08-31 05:06:51.092	2025-08-31 05:06:51.092
cmez8am38002mvkowe5zea43b	deliveryRadius	10	NUMBER	2025-08-31 05:06:51.092	2025-08-31 05:06:51.092
cmez8am39002nvkowg65c6dqv	freeDeliveryThreshold	25.00	NUMBER	2025-08-31 05:06:51.093	2025-08-31 05:06:51.093
cmez8am3a002ovkow3ssy6c6q	deliveryDrivers	3	NUMBER	2025-08-31 05:06:51.094	2025-08-31 05:06:51.094
cmez8am3b002pvkowzkbjcrqt	averageDeliveryTime	30	NUMBER	2025-08-31 05:06:51.095	2025-08-31 05:06:51.095
cmez8am3c002qvkowvwlkngcm	deliveryInstructions	Please ring doorbell and leave at door if no answer	STRING	2025-08-31 05:06:51.096	2025-08-31 05:06:51.096
cmez8am3d002rvkowmw6g2wj4	kitchenStations	3	NUMBER	2025-08-31 05:06:51.098	2025-08-31 05:06:51.098
cmez8am3e002svkowi2pahtjp	maxConcurrentOrders	10	NUMBER	2025-08-31 05:06:51.099	2025-08-31 05:06:51.099
cmez8am3f002tvkowyo4v5uxk	orderAlertsEnabled	true	BOOLEAN	2025-08-31 05:06:51.1	2025-08-31 05:06:51.1
cmez8am3g002uvkowatblw6nw	printerEnabled	true	BOOLEAN	2025-08-31 05:06:51.101	2025-08-31 05:06:51.101
cmez8am3k002yvkowbrf64bg7	feedbackEnabled	true	BOOLEAN	2025-08-31 05:06:51.104	2025-08-31 05:06:51.104
cmez8am3k002zvkow68wi2raj	surveyEnabled	true	BOOLEAN	2025-08-31 05:06:51.105	2025-08-31 05:06:51.105
cmez8am3l0030vkow435v0mw5	loyaltyPointsPerDollar	1	NUMBER	2025-08-31 05:06:51.106	2025-08-31 05:06:51.106
cmez8am3m0031vkow70r88fsk	loyaltyPointsValue	0.01	NUMBER	2025-08-31 05:06:51.107	2025-08-31 05:06:51.107
cmez8am3n0032vkowqz63zqxq	googleAnalyticsId		STRING	2025-08-31 05:06:51.107	2025-08-31 05:06:51.107
cmez8am3o0033vkowj7lvfgz9	facebookPixelId		STRING	2025-08-31 05:06:51.108	2025-08-31 05:06:51.108
cmez8am3p0035vkowqqwfl8jj	enableCustomerTracking	true	BOOLEAN	2025-08-31 05:06:51.11	2025-08-31 05:06:51.11
cmez8am3q0036vkowsteqzpm2	reportRetentionDays	365	NUMBER	2025-08-31 05:06:51.111	2025-08-31 05:06:51.111
cmez8am3r0037vkowbubk8guj	sessionTimeoutMinutes	60	NUMBER	2025-08-31 05:06:51.111	2025-08-31 05:06:51.111
cmez8am3s0038vkows82e6d5b	maxLoginAttempts	5	NUMBER	2025-08-31 05:06:51.112	2025-08-31 05:06:51.112
cmez8am3t0039vkowhod4vpe4	passwordMinLength	8	NUMBER	2025-08-31 05:06:51.113	2025-08-31 05:06:51.113
cmez8am3u003avkowrf5lka5a	requireSpecialCharacters	true	BOOLEAN	2025-08-31 05:06:51.115	2025-08-31 05:06:51.115
cmez8am3v003bvkown1kvu81b	twoFactorEnabled	false	BOOLEAN	2025-08-31 05:06:51.115	2025-08-31 05:06:51.115
cmez8am3x003dvkownaks6ziv	backupFrequency	daily	STRING	2025-08-31 05:06:51.117	2025-08-31 05:06:51.117
cmez8am3y003evkow3h30kz41	backupRetentionDays	30	NUMBER	2025-08-31 05:06:51.118	2025-08-31 05:06:51.118
cmez8am3z003fvkow6x07yj48	maintenanceMode	false	BOOLEAN	2025-08-31 05:06:51.119	2025-08-31 05:06:51.119
cmez8am3z003gvkowp1mpbe48	maintenanceMessage	We are currently performing maintenance. Please check back soon.	STRING	2025-08-31 05:06:51.12	2025-08-31 05:06:51.12
cmez8am33002gvkowpkygvybp	acceptCreditCard	false	BOOLEAN	2025-08-31 05:06:51.087	2025-08-31 05:16:05.628
cmez8am34002ivkow623t2nyn	acceptGiftCards	false	BOOLEAN	2025-08-31 05:06:51.089	2025-08-31 05:16:05.628
cmez8am3h002vvkowek8t70d1	autoPrintOrders	false	BOOLEAN	2025-08-31 05:06:51.101	2025-08-31 05:16:05.628
cmez8am3w003cvkowv86clmi0	autoBackupEnabled	false	BOOLEAN	2025-08-31 05:06:51.116	2025-08-31 05:16:05.628
cmez8am3i002wvkownt0pfuji	customerServiceEmail	support@greenlandFamous.com	STRING	2025-08-31 05:06:51.102	2025-08-31 05:16:05.628
cmez8am3p0034vkowftwweh23	enableOrderTracking	false	BOOLEAN	2025-08-31 05:06:51.109	2025-08-31 05:16:05.628
cmez8am2l001yvkowkbh3giva	websiteUrl	https://greenlandFamous.com	STRING	2025-08-31 05:06:51.069	2025-08-31 05:16:05.629
cmez8am2p0023vkowwohlyf3i	reservationPhone	(603) 074	STRING	2025-08-31 05:06:51.074	2025-08-31 05:16:05.628
cmez8am3j002xvkowv7e5txuh	complaintEmail	manager@greenlandfamous.com	STRING	2025-08-31 05:06:51.103	2025-08-31 05:16:05.628
\.


--
-- TOC entry 5278 (class 0 OID 47851)
-- Dependencies: 246
-- Data for Name: cart_item_customizations; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.cart_item_customizations (id, "cartItemId", "customizationOptionId", quantity, price, "createdAt") FROM stdin;
\.


--
-- TOC entry 5279 (class 0 OID 47860)
-- Dependencies: 247
-- Data for Name: cart_item_pizza_toppings; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.cart_item_pizza_toppings (id, "cartItemId", "pizzaToppingId", quantity, section, intensity, price, "createdAt") FROM stdin;
\.


--
-- TOC entry 5277 (class 0 OID 47842)
-- Dependencies: 245
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.cart_items (id, "sessionId", "userId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", quantity, "basePrice", "totalPrice", notes, "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") FROM stdin;
\.


--
-- TOC entry 5249 (class 0 OID 47560)
-- Dependencies: 217
-- Data for Name: customer_addresses; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.customer_addresses (id, "userId", label, "addressLine1", "addressLine2", city, state, "zipCode", country, "deliveryInstructions", "isDefault", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5251 (class 0 OID 47580)
-- Dependencies: 219
-- Data for Name: customer_favorites; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.customer_favorites (id, "userId", "favoriteName", "itemType", "itemData", "orderCount", "lastOrdered", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5248 (class 0 OID 47547)
-- Dependencies: 216
-- Data for Name: customer_profiles; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.customer_profiles (id, "userId", "firstName", "lastName", "dateOfBirth", phone, "avatarUrl", "dietaryPreferences", "favoritePizzaSizeId", "favoriteCrustId", "defaultOrderType", "marketingOptIn", "loyaltyPoints", "totalOrders", "totalSpent", "lastOrderDate", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5274 (class 0 OID 47807)
-- Dependencies: 242
-- Data for Name: customization_groups; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.customization_groups (id, "categoryId", name, description, type, "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
cmez4ylus0001vkvoy8fe9hdo	cmez4xl6y0002vkwcc28fjbty	Toppings	Choose your pizza toppings	MULTI_SELECT	f	0	10	1	t	2025-08-31 03:33:32.069	2025-08-31 03:33:32.069
cmez4ylw70003vkvowz7y4tsn	cmez4xl780003vkwcly8nts4q	Dressing	Choose your preferred dressing	SINGLE_SELECT	t	1	1	1	t	2025-08-31 03:33:32.069	2025-08-31 03:33:32.069
cmez4ylwa0005vkvoe8fpfq94	cmez4xl780003vkwcly8nts4q	Add-ons	Extra toppings and proteins	MULTI_SELECT	f	0	5	2	t	2025-08-31 03:33:32.069	2025-08-31 03:33:32.069
cmez4ylwg0007vkvovrlq7jkr	cmez4xl5v0001vkwcbpbsmbms	Fillings	Choose your calzone fillings	MULTI_SELECT	f	0	8	1	t	2025-08-31 03:33:32.069	2025-08-31 03:33:32.069
cmez5278y0002vk80qmrtnt9l	cmez5278v0000vk8053v9munw	Extra Toppings	Add extra toppings to your specialty pizza	MULTI_SELECT	f	0	8	1	t	2025-08-31 03:36:19.762	2025-08-31 03:36:19.762
\.


--
-- TOC entry 5275 (class 0 OID 47819)
-- Dependencies: 243
-- Data for Name: customization_options; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.customization_options (id, "groupId", name, description, "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", allergens, "createdAt", "updatedAt") FROM stdin;
cmez4ylwn000avkvoem5xnd9y	cmez4ylw70003vkvowz7y4tsn	Ranch	Creamy ranch dressing	0	FLAT	t	t	1	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylwn000bvkvobo7zjy6m	cmez4ylw70003vkvowz7y4tsn	Caesar	Tangy Caesar dressing	0	FLAT	f	t	2	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylwn000fvkvohplrherr	cmez4ylw70003vkvowz7y4tsn	Italian	Classic Italian dressing	0	FLAT	f	t	3	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylwn000evkvobelyorqq	cmez4ylw70003vkvowz7y4tsn	Balsamic Vinaigrette	Sweet and tangy balsamic dressing	0	FLAT	f	t	4	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylyi000hvkvobyftgnx5	cmez4ylwa0005vkvoe8fpfq94	Feta Cheese	Crumbled feta cheese	1.99	FLAT	f	t	2	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylyl000jvkvo95kwc003	cmez4ylwg0007vkvovrlq7jkr	Ricotta Cheese	Creamy ricotta filling	1.99	FLAT	f	t	1	\N	\N	\N	2025-08-31 03:33:32.136	2025-08-31 03:33:32.136
cmez4ylyt000nvkvoebyzpq2w	cmez4ylwa0005vkvoe8fpfq94	Grilled Chicken	Tender grilled chicken breast	4.99	FLAT	f	t	1	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylyt000lvkvobpaa1h4o	cmez4ylwa0005vkvoe8fpfq94	Avocado	Fresh avocado slices	2.49	FLAT	f	t	3	\N	\N	\N	2025-08-31 03:33:32.136	2025-08-31 03:33:32.136
cmez4ylyu000pvkvouuz9ap6r	cmez4ylus0001vkvoy8fe9hdo	Mushrooms	Fresh sliced mushrooms	1.99	FLAT	f	t	2	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylyw000rvkvoepx6dt78	cmez4ylwg0007vkvovrlq7jkr	Meatballs	Homemade meatballs	3.49	FLAT	f	t	2	\N	\N	\N	2025-08-31 03:33:32.136	2025-08-31 03:33:32.136
cmez4ylyy000tvkvo86xfgohf	cmez4ylus0001vkvoy8fe9hdo	Green Peppers	Crisp green bell peppers	1.99	FLAT	f	t	3	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylyy000vvkvow9wu95oy	cmez4ylus0001vkvoy8fe9hdo	Pepperoni	Classic pepperoni slices	2.49	FLAT	f	t	1	\N	\N	\N	2025-08-31 03:33:32.136	2025-08-31 03:33:32.136
cmez4ylyz000xvkvo3eaxqke7	cmez4ylus0001vkvoy8fe9hdo	Extra Cheese	Additional mozzarella cheese	2.49	FLAT	f	t	4	\N	\N	\N	2025-08-31 03:33:32.136	2025-08-31 03:33:32.136
cmez4ylyz000zvkvocnyo667z	cmez4ylwg0007vkvovrlq7jkr	Sausage	Italian sausage	2.99	FLAT	f	t	3	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez527b5000nvk805nxxw2o4	cmez5278y0002vk80qmrtnt9l	Extra Chicken	Additional grilled chicken	3.99	FLAT	f	t	1	\N	\N	\N	2025-08-31 03:36:19.841	2025-08-31 03:36:19.841
cmez527b5000svk80rsba5bvw	cmez5278y0002vk80qmrtnt9l	Extra Onions	Additional grilled onions	1.49	FLAT	f	t	6	\N	\N	\N	2025-08-31 03:36:19.841	2025-08-31 03:36:19.841
cmez527b5000pvk80bz5ht3d8	cmez5278y0002vk80qmrtnt9l	Extra Bacon	Additional crispy bacon	2.99	FLAT	f	t	3	\N	\N	\N	2025-08-31 03:36:19.841	2025-08-31 03:36:19.841
cmez527b5000rvk80l3187hno	cmez5278y0002vk80qmrtnt9l	Extra Pepperoni	Additional pepperoni slices	2.49	FLAT	f	t	4	\N	\N	\N	2025-08-31 03:36:19.841	2025-08-31 03:36:19.841
cmez527b5000ovk80c8bolvep	cmez5278y0002vk80qmrtnt9l	Extra Cheese	Additional mozzarella cheese	2.49	FLAT	f	t	2	\N	\N	\N	2025-08-31 03:36:19.841	2025-08-31 03:36:19.841
cmez527b5000qvk805rmd06qi	cmez5278y0002vk80qmrtnt9l	Extra Mushrooms	Additional fresh mushrooms	1.99	FLAT	f	t	5	\N	\N	\N	2025-08-31 03:36:19.841	2025-08-31 03:36:19.841
\.


--
-- TOC entry 5283 (class 0 OID 47903)
-- Dependencies: 251
-- Data for Name: email_logs; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.email_logs (id, "to", subject, "templateKey", status, "errorMessage", "sentAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5282 (class 0 OID 47893)
-- Dependencies: 250
-- Data for Name: email_settings; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.email_settings (id, "settingKey", "settingValue", description, "isEncrypted", category, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5281 (class 0 OID 47884)
-- Dependencies: 249
-- Data for Name: email_templates; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.email_templates (id, "templateKey", name, subject, "htmlContent", "textContent", variables, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5250 (class 0 OID 47571)
-- Dependencies: 218
-- Data for Name: employee_profiles; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.employee_profiles (id, "userId", "employeeId", "firstName", "lastName", "position", department, phone, "emergencyContactName", "emergencyContactPhone", "hireDate", "hourlyWage", "isActive", permissions, "scheduleNotes", "createdAt", "updatedAt") FROM stdin;
cmez83ksq0001vkqwy6w4ixr9	cmez7yyig0000vkgsnomscjd6	EMP1756616482824	omar		Manager		\N	\N	\N	\N	\N	t	{}	\N	2025-08-31 05:01:22.826	2025-08-31 05:01:22.826
cmez8ob62000cvkn8fy00rlhs	cmez8ob60000avkn8yv0rn3sc									2025-08-31 05:17:30.121	\N	t	{order_management,kitchen_access,menu_edit,reports_access,user_management}	\N	2025-08-31 05:17:30.122	2025-08-31 05:17:30.122
cmez8pyj0000fvkn8u2iytrm7	cmez8pyiz000dvkn8mhu5agrf	1212	LIZ	LIZ		Kitchen				2025-08-31 05:18:47.049	\N	t	{order_management,kitchen_access}	\N	2025-08-31 05:18:47.052	2025-08-31 05:18:47.052
cmezfwz7o0002vktgg14isvfl	cmezfwz7b0000vktgdestx9tn	101	operations	greenland						2025-08-31 08:40:11.842	\N	t	{kitchen_access,order_management}	\N	2025-08-31 08:40:11.843	2025-08-31 08:40:11.843
\.


--
-- TOC entry 5273 (class 0 OID 47798)
-- Dependencies: 241
-- Data for Name: item_modifiers; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.item_modifiers (id, "itemId", "modifierId", "isDefault", "maxSelectable", "createdAt") FROM stdin;
\.


--
-- TOC entry 5268 (class 0 OID 47749)
-- Dependencies: 236
-- Data for Name: jwt_blacklist; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.jwt_blacklist (id, jti, "expiresAt", reason, "createdAt") FROM stdin;
\.


--
-- TOC entry 5269 (class 0 OID 47757)
-- Dependencies: 237
-- Data for Name: jwt_secrets; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.jwt_secrets (id, kid, secret, algorithm, "isActive", "rotatedAt", "createdAt") FROM stdin;
\.


--
-- TOC entry 5270 (class 0 OID 47767)
-- Dependencies: 238
-- Data for Name: menu_categories; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.menu_categories (id, name, slug, description, "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmez4xl5v0001vkwcbpbsmbms	Calzones	calzones	Folded pizzas stuffed with delicious fillings	\N	\N	t	3	2025-08-31 03:32:44.441	2025-08-31 03:32:44.441
cmez4xl3t0000vkwcukra8aqx	Beverages	beverages	Refreshing drinks and beverages	\N	\N	t	4	2025-08-31 03:32:44.441	2025-08-31 03:32:44.441
cmez4xl6y0002vkwcc28fjbty	Pizzas	pizzas	Traditional and specialty pizzas	\N	\N	t	2	2025-08-31 03:32:44.441	2025-08-31 03:32:44.441
cmez4xl780003vkwcly8nts4q	Salads	salads	Fresh, healthy salads with various toppings and dressings	\N	\N	t	1	2025-08-31 03:32:44.441	2025-08-31 03:32:44.441
cmez5278v0000vk8053v9munw	Specialty Pizzas	specialty-pizzas	Our signature specialty pizzas with premium toppings and unique flavor combinations	\N	\N	t	3	2025-08-31 03:36:19.76	2025-08-31 03:36:19.76
cmez527cz0019vk80iukl7ulg	Side Orders	side-orders	Delicious appetizers and side dishes to complement your meal	\N	\N	t	5	2025-08-31 03:36:19.908	2025-08-31 03:36:19.908
cmez5buep0000vkvs74qojdfm	Dinner Plates	dinner-plates	Hearty dinner plates with sides	\N	\N	t	6	2025-08-31 03:43:49.681	2025-08-31 03:43:49.681
cmez5bueu0001vkvsuragc8gi	Seafood Plates	seafood-plates	Fresh seafood plates with fries and sides	\N	\N	t	7	2025-08-31 03:43:49.687	2025-08-31 03:43:49.687
cmez5buew0002vkvs0misx39j	Hot Subs	hot-subs	Hot sandwiches and subs	\N	\N	t	8	2025-08-31 03:43:49.688	2025-08-31 03:43:49.688
cmez5buex0003vkvs8abknm9j	Cold Subs	cold-subs	Cold sandwiches and subs	\N	\N	t	9	2025-08-31 03:43:49.689	2025-08-31 03:43:49.689
cmez5buey0004vkvs8ypqlpri	Steak and Cheese Subs	steak-and-cheese-subs	Steak and cheese variations	\N	\N	t	10	2025-08-31 03:43:49.691	2025-08-31 03:43:49.691
cmez5buf00005vkvso9m4c4xj	Wings	wings	Chicken wings in various flavors	\N	\N	t	11	2025-08-31 03:43:49.692	2025-08-31 03:43:49.692
cmez5buf20006vkvsv0wezhi1	Fingers	fingers	Chicken fingers and tenders	\N	\N	t	12	2025-08-31 03:43:49.694	2025-08-31 03:43:49.694
cmez5buf40007vkvsfjj76sy6	Fried Appetizers	fried-appetizers	Crispy fried appetizers	\N	\N	t	13	2025-08-31 03:43:49.696	2025-08-31 03:43:49.696
cmez5buf50008vkvsbnhrhccb	Soups & Chowders	soups-chowders	Hot soups and chowders	\N	\N	t	14	2025-08-31 03:43:49.697	2025-08-31 03:43:49.697
cmez5buf70009vkvsdqx26uux	Specialty Items	specialty-items	Specialty sandwiches and items	\N	\N	t	15	2025-08-31 03:43:49.699	2025-08-31 03:43:49.699
\.


--
-- TOC entry 5276 (class 0 OID 47832)
-- Dependencies: 244
-- Data for Name: menu_item_customizations; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.menu_item_customizations (id, "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") FROM stdin;
cmez4ylzh0020vkvobo7r0a0z	cmez4ylz7001jvkvorf8gutkb	cmez4ylw70003vkvowz7y4tsn	t	1	2025-08-31 03:33:32.237
cmez4ylzh001yvkvoyuzk3i05	cmez4ylz7001avkvowcpcy4ea	cmez4ylw70003vkvowz7y4tsn	t	1	2025-08-31 03:33:32.237
cmez4ylzh001vvkvo45q8nxy9	cmez4ylz7001jvkvorf8gutkb	cmez4ylwa0005vkvoe8fpfq94	f	2	2025-08-31 03:33:32.237
cmez4ylzh0029vkvo4yhc7xl8	cmez4ylz7001kvkvop6mtgwdi	cmez4ylus0001vkvoy8fe9hdo	f	1	2025-08-31 03:33:32.237
cmez527bc0013vk8051hud2ud	cmez527av000evk80jgqwrbff	cmez5278y0002vk80qmrtnt9l	f	1	2025-08-31 03:36:19.848
cmez527bc0014vk80qzd46oti	cmez527az000gvk80g11bh5gp	cmez5278y0002vk80qmrtnt9l	f	1	2025-08-31 03:36:19.848
cmez527bc000yvk8090y7h0ts	cmez527aj0006vk80373gqd7i	cmez5278y0002vk80qmrtnt9l	f	1	2025-08-31 03:36:19.848
cmez4ylzh0027vkvofftm5wke	cmez4ylz7001fvkvopjtpc9j6	cmez4ylus0001vkvoy8fe9hdo	f	1	2025-08-31 03:33:32.237
cmez527bc0011vk80i34qv42r	cmez527920004vk80sc2mwydz	cmez5278y0002vk80qmrtnt9l	f	1	2025-08-31 03:36:19.848
cmez527bc0010vk80s0wm6bhh	cmez527al0008vk805q7ub3s3	cmez5278y0002vk80qmrtnt9l	f	1	2025-08-31 03:36:19.848
cmez4ylzh002dvkvou27040kv	cmez4ylz8001nvkvofae6gozm	cmez4ylwg0007vkvovrlq7jkr	f	1	2025-08-31 03:33:32.238
cmez4ylzh002avkvotveo5eqn	cmez4ylz8001pvkvook09e4tk	cmez4ylus0001vkvoy8fe9hdo	f	1	2025-08-31 03:33:32.237
cmez4ylzh0025vkvo0repl0jw	cmez4ylz8001ovkvoqkxzmsij	cmez4ylw70003vkvowz7y4tsn	t	1	2025-08-31 03:33:32.237
cmez4ylzh0023vkvo8jjowb8p	cmez4ylz7001cvkvoyc2xmwxy	cmez4ylw70003vkvowz7y4tsn	t	1	2025-08-31 03:33:32.237
cmez4ylzh002bvkvorysvviip	cmez4ylz7001lvkvo7ne36ovs	cmez4ylwg0007vkvovrlq7jkr	f	1	2025-08-31 03:33:32.237
cmez4ylzh001xvkvo7oi3bu5r	cmez4ylz7001evkvoo7mcs4ly	cmez4ylw70003vkvowz7y4tsn	t	1	2025-08-31 03:33:32.237
cmez4ylzh0028vkvo9794s5x6	cmez4ylz8001ovkvoqkxzmsij	cmez4ylwa0005vkvoe8fpfq94	f	2	2025-08-31 03:33:32.237
cmez527bc0012vk80vzqix9ce	cmez527au000avk80zo515d19	cmez5278y0002vk80qmrtnt9l	f	1	2025-08-31 03:36:19.848
cmez527bc0016vk8026zcbfyv	cmez527av000dvk80l3w23f3v	cmez5278y0002vk80qmrtnt9l	f	1	2025-08-31 03:36:19.849
\.


--
-- TOC entry 5271 (class 0 OID 47777)
-- Dependencies: 239
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.menu_items (id, "categoryId", name, description, "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", allergens, "nutritionInfo", "createdAt", "updatedAt") FROM stdin;
cmez4ylz7001avkvowcpcy4ea	cmez4xl780003vkwcly8nts4q	Chef Salad	Ham, turkey, cheese, eggs, tomatoes, and cucumbers on mixed greens	13.5	\N	t	t	4	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez4ylz7001evkvoo7mcs4ly	cmez4xl780003vkwcly8nts4q	California Salad	Mixed greens, avocado, tomatoes, cucumbers, and balsamic vinaigrette	12.25	\N	t	t	3	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez4ylz7001kvkvop6mtgwdi	cmez4xl6y0002vkwcc28fjbty	Pepperoni Pizza	Classic pepperoni with mozzarella and tomato sauce	16.99	\N	t	t	2	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez527920004vk80sc2mwydz	cmez5278v0000vk8053v9munw	House Special Pizza	Meatball, Sausage, Pepperoni, Mushrooms, Grilled peppers and onions	16.5	\N	t	t	3	\N	\N	\N	2025-08-31 03:36:19.766	2025-08-31 03:36:19.766
cmez527av000evk80jgqwrbff	cmez5278v0000vk8053v9munw	Athenian Pizza	Chicken with Alfredo, grilled Onion, fresh spinach and of course feta cheese	16.5	\N	t	t	6	\N	\N	\N	2025-08-31 03:36:19.766	2025-08-31 03:36:19.766
cmez4ylz7001fvkvopjtpc9j6	cmez4xl6y0002vkwcc28fjbty	Margherita Pizza	Fresh mozzarella, tomato sauce, basil, and olive oil	14.99	\N	t	t	1	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez4ylz7001cvkvoyc2xmwxy	cmez4xl780003vkwcly8nts4q	Caesar Salad	Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing	10.5	\N	t	t	2	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez527aj0006vk80373gqd7i	cmez5278v0000vk8053v9munw	BBQ Chicken Pizza	Chicken, Onion and Bacon with lots of BBQ sauce	16.5	\N	t	t	2	\N	\N	\N	2025-08-31 03:36:19.766	2025-08-31 03:36:19.766
cmez527az000gvk80g11bh5gp	cmez5278v0000vk8053v9munw	Meat Lovers Pizza	Meatball, Sausage, Pepperoni, Bacon, Salami and Ham	16.5	\N	t	t	5	\N	\N	\N	2025-08-31 03:36:19.766	2025-08-31 03:36:19.766
cmez527ch0018vk8032m02431	cmez4xl780003vkwcly8nts4q	Salad with Lobster	Fresh mixed greens, with our local lobster	38	\N	t	t	7	\N	\N	\N	2025-08-31 03:36:19.889	2025-08-31 03:36:19.889
cmez527dh001bvk80kzsufa5x	cmez527cz0019vk80iukl7ulg	BBQ Chicken Fingers	Crispy chicken tenders with BBQ sauce	11.99	\N	t	t	1	\N	\N	\N	2025-08-31 03:36:19.926	2025-08-31 03:36:19.926
cmez527dj001evk80pf9ur70n	cmez4xl3t0000vkwcukra8aqx	Diet Coke	Diet Coca-Cola soda	2.49	\N	t	t	4	\N	\N	\N	2025-08-31 03:36:19.928	2025-08-31 03:36:19.928
cmez527dj001fvk802m8puu0e	cmez4xl3t0000vkwcukra8aqx	Dr Pepper	Classic Dr Pepper soda	2.49	\N	t	t	5	\N	\N	\N	2025-08-31 03:36:19.928	2025-08-31 03:36:19.928
cmez527dm001ivk800996xqce	cmez4xl5v0001vkwcbpbsmbms	Small Calzone	Personal size calzone with your choice of fillings	16	\N	t	t	3	\N	\N	\N	2025-08-31 03:36:19.931	2025-08-31 03:36:19.931
cmez527dm001jvk80o72i8vfp	cmez4xl5v0001vkwcbpbsmbms	Large Calzone	Family size calzone with your choice of fillings	21	\N	t	t	4	\N	\N	\N	2025-08-31 03:36:19.931	2025-08-31 03:36:19.931
cmez4ylz7001lvkvo7ne36ovs	cmez4xl5v0001vkwcbpbsmbms	Meat Lovers Calzone	Pepperoni, sausage, meatballs, and cheese	19.99	\N	t	t	2	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez527al0008vk805q7ub3s3	cmez5278v0000vk8053v9munw	Chicken Alfredo Pizza	Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses	15.45	\N	t	t	1	\N	\N	\N	2025-08-31 03:36:19.766	2025-08-31 03:36:19.766
cmez5bufb000bvkvsvxlcblte	cmez5buep0000vkvs74qojdfm	Gyro Plate	Traditional Greek gyro with tzatziki sauce, served with fries and Greek salad	17.25	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.704	2025-08-31 03:43:49.704
cmez5buff000dvkvsaexqwttc	cmez5buep0000vkvs74qojdfm	Hamburger Plate	Juicy hamburger patty with lettuce, tomato, onion, served with fries	14.99	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.707	2025-08-31 03:43:49.707
cmez5bufh000fvkvscpxd5o66	cmez5buep0000vkvs74qojdfm	Cheeseburger Plate	Hamburger with American cheese, lettuce, tomato, onion, served with fries	15.99	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.709	2025-08-31 03:43:49.709
cmez5bufk000hvkvspk80r6rp	cmez5buep0000vkvs74qojdfm	Chicken Kabob Plate	Grilled chicken kabob with rice, salad, and tzatziki sauce	16.5	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.713	2025-08-31 03:43:49.713
cmez5bufm000jvkvsxckws9nb	cmez5buep0000vkvs74qojdfm	Chicken Wings Plate	8 pieces of chicken wings with fries and coleslaw	15.99	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.715	2025-08-31 03:43:49.715
cmez5bufp000lvkvs2gz0d9ii	cmez5buep0000vkvs74qojdfm	Chicken Fingers Plate	Chicken fingers with fries and choice of dipping sauce	14.99	\N	t	t	6	\N	\N	\N	2025-08-31 03:43:49.717	2025-08-31 03:43:49.717
cmez5bufr000nvkvs5a925es2	cmez5buep0000vkvs74qojdfm	Roast Beef Plate	Sliced roast beef with mashed potatoes and gravy	16.99	\N	t	t	7	\N	\N	\N	2025-08-31 03:43:49.719	2025-08-31 03:43:49.719
cmez5buft000pvkvsdwqpwkc5	cmez5buep0000vkvs74qojdfm	Steak Tip Kabob Plate	Grilled steak tips with rice, salad, and tzatziki sauce	18.99	\N	t	t	8	\N	\N	\N	2025-08-31 03:43:49.721	2025-08-31 03:43:49.721
cmez5bufv000rvkvsq3b7iw35	cmez5buep0000vkvs74qojdfm	Fish 'n Chips	Beer-battered haddock with fries and coleslaw	15.99	\N	t	t	9	\N	\N	\N	2025-08-31 03:43:49.723	2025-08-31 03:43:49.723
cmez5bufx000tvkvs3psh4hyl	cmez5bueu0001vkvsuragc8gi	Sea Monster (Scallops, Clams, Shrimps & Haddock)	Fresh Haddock, scallops, shrimps and clams it is HUGE good for two people, comes with french fries, onion rings and a side of coleslaw or pasta salad	46	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.725	2025-08-31 03:43:49.725
cmez5bufz000vvkvssfm47yoi	cmez5bueu0001vkvsuragc8gi	Scallops Plate	A plate of scallops fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad	41.5	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.728	2025-08-31 03:43:49.728
cmez5bug1000xvkvsytz35wfc	cmez5bueu0001vkvsuragc8gi	Haddock Plate	A huge piece of haddock fish on a bed of french fries and onion rings and a choice of pasta or coleslaw	33.5	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.73	2025-08-31 03:43:49.73
cmez5bug3000zvkvshe0vwnu8	cmez5bueu0001vkvsuragc8gi	2-way Scallops & Clams Plate	Best of the Sea.. scallops and Native clams, piled on onion rings and french fries with a choice of coleslaw or pasta salad	37.5	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.732	2025-08-31 03:43:49.732
cmez5bug50011vkvs330um4k1	cmez5bueu0001vkvsuragc8gi	3-way Shrimps, Scallops & Clams Plate	A fresh pile of shrimps, scallops and clams piled on onion rings and french fries with a side of coleslaw or pasta salad	38.95	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.734	2025-08-31 03:43:49.734
cmez5bug70013vkvs6aw3qmtk	cmez5bueu0001vkvsuragc8gi	Strip Clams Plate	Strip clams deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad	21.5	\N	t	t	6	\N	\N	\N	2025-08-31 03:43:49.736	2025-08-31 03:43:49.736
cmez5bug90015vkvsh9ihifu1	cmez5bueu0001vkvsuragc8gi	Shrimps Plate	Fresh shrimps deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad	24.5	\N	t	t	7	\N	\N	\N	2025-08-31 03:43:49.738	2025-08-31 03:43:49.738
cmez5bugb0017vkvs8vxrv5iw	cmez5bueu0001vkvsuragc8gi	Native Clams Plate	Fresh locally sourced clams with an option of pasta salad or coleslaw on a bed of french fries and onion rings	42	\N	t	t	8	\N	\N	\N	2025-08-31 03:43:49.739	2025-08-31 03:43:49.739
cmez5bugd0019vkvss1syr7lw	cmez5buew0002vkvs0misx39j	Build your Own Roast Beef Sub	Start by choosing size sub, and add toppings	11.99	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.741	2025-08-31 03:43:49.741
cmez5bugf001bvkvs9utg7k5d	cmez5buew0002vkvs0misx39j	Chicken Cutlet Sub	Chicken cutlet in special batter fried in a large sub roll.	12.99	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.744	2025-08-31 03:43:49.744
cmez5bugi001dvkvsvl6qxe2v	cmez5buew0002vkvs0misx39j	Grilled Chicken Kabob	Fresh made to order Grilled Chicken, you can choose it in a wrap or a sub roll	12.99	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.747	2025-08-31 03:43:49.747
cmez5bugk001fvkvs8jtn5du0	cmez5buew0002vkvs0misx39j	Steak Tips Kabob	Fresh made to order Grilled Steak tips, you can choose it in a wrap or a sub roll	15.99	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.749	2025-08-31 03:43:49.749
cmez5bugm001hvkvswtop2ezu	cmez5buew0002vkvs0misx39j	Cheese Burger	Fresh made to order 2-patty cheese burger, you can choose it in a wrap or a sub roll	12.99	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.75	2025-08-31 03:43:49.75
cmez5bugo001jvkvslr3gsci2	cmez5buew0002vkvs0misx39j	Chicken Fingers/tenders	Fresh made to order Chicken fingers, you can choose it in a wrap or a sub roll	12.99	\N	t	t	6	\N	\N	\N	2025-08-31 03:43:49.752	2025-08-31 03:43:49.752
cmez5bugq001lvkvse0ycua9x	cmez5buew0002vkvs0misx39j	Chicken Caesar Wrap	Fresh made to order Grilled Chicken, you can choose the type of wrap.	14.5	\N	t	t	7	\N	\N	\N	2025-08-31 03:43:49.754	2025-08-31 03:43:49.754
cmez5bugs001nvkvsg4st51kb	cmez5buew0002vkvs0misx39j	Meat Ball Sub	Meatballs in marinara sauce with your choice of no cheese or one of many options we have to offer	11.99	\N	t	t	8	\N	\N	\N	2025-08-31 03:43:49.756	2025-08-31 03:43:49.756
cmez5bugt001pvkvshj4za05r	cmez5buew0002vkvs0misx39j	Hot Pastrami	Pastrami in a warp or a 10" sub with options to make it your own	12.99	\N	t	t	9	\N	\N	\N	2025-08-31 03:43:49.758	2025-08-31 03:43:49.758
cmez5bugw001rvkvszj8ensiv	cmez5buew0002vkvs0misx39j	Hot Veggies	Fresh made to order Grilled Veggies, (grilled Mushroom, peppers and onions)	12.99	\N	t	t	10	\N	\N	\N	2025-08-31 03:43:49.76	2025-08-31 03:43:49.76
cmez5bugz001tvkvsin6tvpm5	cmez5buew0002vkvs0misx39j	Eggplant	Fresh made to order Eggplant, you can choose it in a wrap or a sub roll	12.25	\N	t	t	11	\N	\N	\N	2025-08-31 03:43:49.763	2025-08-31 03:43:49.763
cmez5buh0001vvkvsxlvetfm6	cmez5buew0002vkvs0misx39j	Veal Cutlet	Fresh made to order Veal cutlet, you can choose it in a wrap or a sub roll	12.99	\N	t	t	12	\N	\N	\N	2025-08-31 03:43:49.765	2025-08-31 03:43:49.765
cmez5buh2001xvkvsnhog34dl	cmez5buew0002vkvs0misx39j	Sausage sub	Fresh made to order Sausage, you can choose it in a wrap or a sub roll	12.99	\N	t	t	13	\N	\N	\N	2025-08-31 03:43:49.767	2025-08-31 03:43:49.767
cmez5buh4001zvkvsodoxnl83	cmez5buex0003vkvs8abknm9j	Italian Sub	Mortadella, salami and hot ham with provolone cheese, add oil and vinegar, pickles and hots	11.99	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.769	2025-08-31 03:43:49.769
cmez5buh60021vkvsx6pjsrsl	cmez5buex0003vkvs8abknm9j	American Sub	American Sub with Ham, Mortadella and American cheese.	11.99	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.77	2025-08-31 03:43:49.77
cmez5buh80023vkvsyejru7y7	cmez5buex0003vkvs8abknm9j	Imported Ham	Imported Ham add cheese and veggies to make it your way	11.99	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.772	2025-08-31 03:43:49.772
cmez5buha0025vkvss8g1oejt	cmez5buex0003vkvs8abknm9j	Genoa Salami Sub	Imported Genoa Salami with many options to customize	11.99	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.774	2025-08-31 03:43:49.774
cmez5buhc0027vkvsy1aicbxf	cmez5buex0003vkvs8abknm9j	Tuna Salad	Homemade tuna salad no additives and no crazy things it is basic but add condiments, cheese and veggies and spice it up	11.99	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.776	2025-08-31 03:43:49.776
cmez527au000avk80zo515d19	cmez5278v0000vk8053v9munw	Buffalo Chicken Pizza	Buffalo Chicken, grilled Onion, grilled peppers with lots of cheese	16.5	\N	t	t	4	\N	\N	\N	2025-08-31 03:36:19.766	2025-08-31 03:36:19.766
cmez5buhf0029vkvs95vr1a6m	cmez5buex0003vkvs8abknm9j	Chicken Salad	Roasted chicken salad, all we add is mayonnaise so you can taste the chicken. add to it as you need from a variety of condiments or toppings	11.99	\N	t	t	6	\N	\N	\N	2025-08-31 03:43:49.779	2025-08-31 03:43:49.779
cmez5buhh002bvkvsqef86gvy	cmez5buex0003vkvs8abknm9j	Crab Meat	Crab meat salad, select your size and your type of bread	11.99	\N	t	t	7	\N	\N	\N	2025-08-31 03:43:49.781	2025-08-31 03:43:49.781
cmez5buhj002dvkvs2wlo8w8h	cmez5buex0003vkvs8abknm9j	Veggie Sub	Cold veggies sub, loaded with lettuce, tomatoes, green peppers, cucumbers, black olives, onions	11.99	\N	t	t	8	\N	\N	\N	2025-08-31 03:43:49.783	2025-08-31 03:43:49.783
cmez5buhl002fvkvs101lksxm	cmez5buex0003vkvs8abknm9j	Turkey Sub	Turkey sub with or without cheese but you can add veggies	11.99	\N	t	t	9	\N	\N	\N	2025-08-31 03:43:49.785	2025-08-31 03:43:49.785
cmez5buhn002hvkvsfy7fj8g9	cmez5buex0003vkvs8abknm9j	BLT Sub	We can spell too yes it is...Bacon, Lettuce and Tomatoes. add other toppings as well.	11.99	\N	t	t	10	\N	\N	\N	2025-08-31 03:43:49.787	2025-08-31 03:43:49.787
cmez5buhp002jvkvs1ar0eppl	cmez5buey0004vkvs8ypqlpri	Steak Bomb	Steak and Cheese with Grilled peppers, Onions, mushrooms and american cheese	11.99	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.789	2025-08-31 03:43:49.789
cmez5buhq002lvkvsp6t5damr	cmez5buey0004vkvs8ypqlpri	Pepper Cheese Steak	Steak and Cheese with Grilled peppers	11.5	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.791	2025-08-31 03:43:49.791
cmez5buhs002nvkvs686iuiqw	cmez5buey0004vkvs8ypqlpri	Onion Cheese Steak	Steak and Cheese with Grilled onions	11.5	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.793	2025-08-31 03:43:49.793
cmez5buhv002pvkvs92heqdfm	cmez5buey0004vkvs8ypqlpri	Mushroom Cheese Steak	Steak and Cheese with Mushroom	11.5	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.795	2025-08-31 03:43:49.795
cmez5buhx002rvkvs1n6haty2	cmez5buey0004vkvs8ypqlpri	Steak Sub Build Your Own	Select the size of your sub starts with the shaved steaks and add your cheese, toppings and condiments	11.5	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.797	2025-08-31 03:43:49.797
cmez5buhz002tvkvscxj4iqvo	cmez5buf00005vkvso9m4c4xj	Buffalo Wings (6 pcs)	Classic buffalo wings with hot sauce	11.99	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.799	2025-08-31 03:43:49.799
cmez5bui1002vvkvsu8xtp50l	cmez5buf00005vkvso9m4c4xj	BBQ Wings (6 pcs)	Sweet and tangy BBQ wings	11.99	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.801	2025-08-31 03:43:49.801
cmez5bui3002xvkvsn4umf699	cmez5buf00005vkvso9m4c4xj	Regular Wings (6 pcs)	Classic regular wings	11.99	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.803	2025-08-31 03:43:49.803
cmez5bui5002zvkvspubn8tcx	cmez5buf00005vkvso9m4c4xj	Buffalo Wings (12 pcs)	Classic buffalo wings with hot sauce	21.99	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.805	2025-08-31 03:43:49.805
cmez5bui60031vkvs7grjv1za	cmez5buf00005vkvso9m4c4xj	BBQ Wings (12 pcs)	Sweet and tangy BBQ wings	21.99	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.807	2025-08-31 03:43:49.807
cmez5bui80033vkvshs0kiawt	cmez5buf00005vkvso9m4c4xj	Regular Wings (12 pcs)	Classic regular wings	21.99	\N	t	t	6	\N	\N	\N	2025-08-31 03:43:49.809	2025-08-31 03:43:49.809
cmez5buib0035vkvsevf4w1wh	cmez5buf20006vkvsv0wezhi1	Chicken Tenders (3 pcs)	Crispy breaded chicken tenders	7.99	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.811	2025-08-31 03:43:49.811
cmez5buid0037vkvsssw7ny4v	cmez5buf20006vkvsv0wezhi1	Chicken Tenders (5 pcs)	Crispy breaded chicken tenders	12.99	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.814	2025-08-31 03:43:49.814
cmez5buif0039vkvsn8dmwe21	cmez5buf20006vkvsv0wezhi1	Buffalo Chicken Tenders (5 pcs)	Crispy tenders tossed in buffalo sauce	13.99	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.815	2025-08-31 03:43:49.815
cmez5buih003bvkvszcyk42v7	cmez5buf40007vkvsfjj76sy6	Mozzarella Sticks (6 pcs)	Golden fried mozzarella with marinara sauce	6.99	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.817	2025-08-31 03:43:49.817
cmez5buij003dvkvsofytltn1	cmez5buf40007vkvsfjj76sy6	Onion Rings	Crispy beer-battered onion rings	5.99	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.819	2025-08-31 03:43:49.819
cmez5buil003fvkvski7etr8d	cmez5buf40007vkvsfjj76sy6	Jalapeño Poppers (6 pcs)	Cream cheese stuffed jalapeños, breaded and fried	7.49	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.821	2025-08-31 03:43:49.821
cmez5buin003hvkvs856a2pwn	cmez5buf40007vkvsfjj76sy6	Fried Pickles	Beer-battered dill pickle spears	6.49	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.823	2025-08-31 03:43:49.823
cmez5buio003jvkvsn5syml5e	cmez5buf40007vkvsfjj76sy6	Loaded Potato Skins (4 pcs)	Crispy potato skins with cheese, bacon, and sour cream	8.99	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.825	2025-08-31 03:43:49.825
cmez5buir003lvkvstoqgn5ml	cmez5buf50008vkvsbnhrhccb	New England Clam Chowder	Creamy clam chowder with tender clams and potatoes	4.99	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.827	2025-08-31 03:43:49.827
cmez5buit003nvkvso2nvyt5l	cmez5buf50008vkvsbnhrhccb	Seafood Bisque	Rich and creamy seafood bisque	5.99	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.829	2025-08-31 03:43:49.829
cmez5buiv003pvkvs3sa8nil2	cmez5buf50008vkvsbnhrhccb	Fish Chowder	Traditional New England fish chowder	4.99	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.831	2025-08-31 03:43:49.831
cmez5buix003rvkvsam7jtkre	cmez5buf50008vkvsbnhrhccb	Lobster Bisque	Premium lobster bisque with real lobster meat	7.99	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.833	2025-08-31 03:43:49.833
cmez5buiz003tvkvsbe5qijlr	cmez5buf70009vkvsdqx26uux	Haddock Sandwich (2pcs)	You get 2 Pcs of Haddock on a sesame bun	15.75	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.835	2025-08-31 03:43:49.835
cmez5buj1003vvkvsyla9bw80	cmez5buf70009vkvsdqx26uux	Reuben on Rye	Reuben on Rye topped with sauerkraut and 1000 island dressing	12.5	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.837	2025-08-31 03:43:49.837
cmez5buj3003xvkvs9jp487vw	cmez5buf70009vkvsdqx26uux	Gyro	Greek Gyro on special Pita bread comes with onion, tomatoes and Tzatziki sauce	10.5	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.839	2025-08-31 03:43:49.839
cmez5buj5003zvkvsjnzzji1d	cmez5buf70009vkvsdqx26uux	Hot Dog	Everybody loves a hot dog, it comes topped with onions and mustard on a frankfurter.	5.75	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.841	2025-08-31 03:43:49.841
cmez5buj70041vkvsoeo8tp2j	cmez5buf70009vkvsdqx26uux	Hot Pastrami	Start by choosing size Sandwich (Reg on Sesame @ Super on Onion Roll), and add toppings	11	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.843	2025-08-31 03:43:49.843
cmez5buja0043vkvsh3fubsro	cmez5buf70009vkvsdqx26uux	Chicken Sandwich	Select your Chicken and add cheese and toppings as you wish	8	\N	t	t	6	\N	\N	\N	2025-08-31 03:43:49.846	2025-08-31 03:43:49.846
cmez5bujc0045vkvs796i8rtk	cmez5buf70009vkvsdqx26uux	Hamburger	Select your burger and add cheese and toppings as you wish	7.25	\N	t	t	7	\N	\N	\N	2025-08-31 03:43:49.848	2025-08-31 03:43:49.848
cmez4ylz8001pvkvook09e4tk	cmez4xl6y0002vkwcc28fjbty	Vegetarian Pizza	Mushrooms, peppers, onions, olives, and tomatoes	15.99	\N	t	t	3	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez4ylz7001mvkvotrp9y37v	cmez4xl3t0000vkwcukra8aqx	Iced Tea	Fresh brewed iced tea	2.99	\N	t	t	3	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez4ylz7001ivkvoc63nf8ai	cmez4xl3t0000vkwcukra8aqx	Coca-Cola	Classic Coca-Cola soda	2.49	\N	t	t	1	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez4ylz8001nvkvofae6gozm	cmez4xl5v0001vkwcbpbsmbms	Classic Calzone	Ricotta, mozzarella, and your choice of fillings	16.99	\N	t	t	1	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez4ylz7001gvkvoh0tfaroc	cmez4xl3t0000vkwcukra8aqx	Sprite	Lemon-lime soda	2.49	\N	t	t	2	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez4ylz8001ovkvoqkxzmsij	cmez4xl780003vkwcly8nts4q	Build Your Own Salad	Choose your greens and customize with your favorite toppings	9.99	\N	t	t	5	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez4ylz7001jvkvorf8gutkb	cmez4xl780003vkwcly8nts4q	Greek Salad	Fresh romaine lettuce, tomatoes, cucumbers, red onions, Kalamata olives, and feta cheese	11.75	\N	t	t	1	\N	\N	\N	2025-08-31 03:33:32.227	2025-08-31 03:33:32.227
cmez527av000dvk80l3w23f3v	cmez5278v0000vk8053v9munw	Veggie Pizza	Roasted peppers, roasted onions, fresh tomatoes, mushrooms and broccoli	16.5	\N	t	t	7	\N	\N	\N	2025-08-31 03:36:19.766	2025-08-31 03:36:19.766
\.


--
-- TOC entry 5272 (class 0 OID 47788)
-- Dependencies: 240
-- Data for Name: modifiers; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.modifiers (id, name, type, price, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5263 (class 0 OID 47706)
-- Dependencies: 231
-- Data for Name: order_item_customizations; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.order_item_customizations (id, "orderItemId", "customizationOptionId", quantity, price, "pizzaHalf", "createdAt") FROM stdin;
cmez71q9y002jvk60m41xxtno	cmez71q9v002hvk609w7x1wqv	cmez4ylyu000pvkvouuz9ap6r	1	1.99	\N	2025-08-31 04:31:56.999
\.


--
-- TOC entry 5262 (class 0 OID 47695)
-- Dependencies: 230
-- Data for Name: order_item_toppings; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.order_item_toppings (id, "orderItemId", "pizzaToppingId", quantity, section, intensity, price, "createdAt") FROM stdin;
cmezdi7je0004vk68axnk09of	cmezdi7j60003vk68h3sznenr	cmez57ctq000pvkc41cp4qe5p	1	WHOLE	REGULAR	2	2025-08-31 07:32:43.562
\.


--
-- TOC entry 5261 (class 0 OID 47686)
-- Dependencies: 229
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.order_items (id, "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", quantity, "basePrice", "totalPrice", notes, "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") FROM stdin;
cmez71q980025vk60l0i5wkps	cmez71q930023vk60eh0tw6ip	cmez5n8nn0001vk3kjqe0zbsp	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	22	22	Large Calzone Regular with Pizza Sauce	2025-08-31 04:31:56.972	2025-08-31 04:31:56.972	PIZZA	\N	\N
cmez71q9c0027vk60cq8t35vo	cmez71q930023vk60eh0tw6ip	cmez5n8nn0001vk3kjqe0zbsp	cmez57ct90007vkc4memkf1p1	cmez57ct40004vkc4ndh8iu2b	\N	1	29.99	29.99	Large Calzone Regular with Garlic Butter Sauce	2025-08-31 04:31:56.976	2025-08-31 04:31:56.976	PIZZA	\N	\N
cmez71q9e0029vk60copcqebl	cmez71q930023vk60eh0tw6ip	cmez57csy0001vkc4fbtoets6	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	23.5	23.5	Large Pizza Regular with Pizza Sauce	2025-08-31 04:31:56.979	2025-08-31 04:31:56.979	PIZZA	\N	\N
cmez71q9g002bvk60rykofmoe	cmez71q930023vk60eh0tw6ip	cmez57csy0001vkc4fbtoets6	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	23.5	23.5	Large Pizza Regular with Pizza Sauce	2025-08-31 04:31:56.98	2025-08-31 04:31:56.98	PIZZA	\N	\N
cmez71q9i002dvk60owbdju1a	cmez71q930023vk60eh0tw6ip	cmez5n8nl0000vk3k7n5edmea	cmez57ct90007vkc4memkf1p1	cmez57ct40004vkc4ndh8iu2b	\N	1	23	23	Small Calzone Regular with Garlic Butter Sauce	2025-08-31 04:31:56.982	2025-08-31 04:31:56.982	PIZZA	\N	\N
cmez71q9n002fvk607yl7eq4q	cmez71q930023vk60eh0tw6ip	\N	\N	\N	cmez5bufx000tvkvs3psh4hyl	1	27.5	27.5	**Scallops** (seafood-boxes) | Customization | Customization	2025-08-31 04:31:56.987	2025-08-31 04:31:56.987	PIZZA	\N	\N
cmez71q9v002hvk609w7x1wqv	cmez71q930023vk60eh0tw6ip	\N	\N	\N	cmez4ylz7001kvkvop6mtgwdi	1	18.98	18.98	**Pepperoni Pizza** (pizzas) | Customization	2025-08-31 04:31:56.996	2025-08-31 04:31:56.996	PIZZA	\N	\N
cmez7rtft0003vk6c7o66dohe	cmez7rtfj0001vk6cp40pfe9r	cmez57csy0001vkc4fbtoets6	cmez57ct90007vkc4memkf1p1	cmez57ct40004vkc4ndh8iu2b	\N	1	23.5	23.5	Large Pizza Regular with Garlic Butter Sauce	2025-08-31 04:52:14.153	2025-08-31 04:52:14.153	PIZZA	\N	\N
cmezdi7j60003vk68h3sznenr	cmezdi7iz0001vk68exctnpic	cmez5n8nn0001vk3kjqe0zbsp	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	31.99	31.99	Large Calzone Regular with Pizza Sauce | Toppings: whole: meatballs	2025-08-31 07:32:43.555	2025-08-31 07:32:43.555	PIZZA	\N	\N
\.


--
-- TOC entry 5260 (class 0 OID 47674)
-- Dependencies: 228
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.orders (id, "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", status, "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", subtotal, "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", tax, total, notes, "createdAt", "updatedAt") FROM stdin;
cmez71q930023vk60eh0tw6ip	BO716951I19	\N	omar hassan	auy1jll@gmail.com	6172494115	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	168.47	0	\N	\N	\N	13.9	182.37	\N	2025-08-31 04:31:56.967	2025-08-31 04:31:56.967
cmez7rtfj0001vk6cp40pfe9r	BO9341130LO	\N	omar hassan	auy1jll@gmail.com	6178673842	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	23.5	0	\N	\N	\N	1.94	25.44	\N	2025-08-31 04:52:14.143	2025-08-31 04:52:14.143
cmezdi7iz0001vk68exctnpic	BO56353962Q	\N	omar hassan	auy1jll@gmail.com	16178673842	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	31.99	0	\N	\N	\N	2.88	34.87	\N	2025-08-31 07:32:43.548	2025-08-31 07:32:43.548
\.


--
-- TOC entry 5253 (class 0 OID 47600)
-- Dependencies: 221
-- Data for Name: pizza_crusts; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.pizza_crusts (id, name, description, "priceModifier", "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmez57ct90007vkc4memkf1p1	Regular	Our classic hand-tossed crust	0	t	1	2025-08-31 03:40:20.254	2025-08-31 03:40:20.254
\.


--
-- TOC entry 5254 (class 0 OID 47611)
-- Dependencies: 222
-- Data for Name: pizza_sauces; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.pizza_sauces (id, name, description, color, "spiceLevel", "priceModifier", "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmez57ct10002vkc4dd3k6gig	Pizza Sauce	Classic tomato pizza sauce	#e53e3e	0	0	t	1	2025-08-31 03:40:20.245	2025-08-31 03:40:20.245
cmez57ct30003vkc4zgf8fsbt	Alfredo Sauce	Creamy white alfredo sauce	#f7fafc	0	0	t	1	2025-08-31 03:40:20.247	2025-08-31 03:40:20.247
cmez57ct40004vkc4ndh8iu2b	Garlic Butter Sauce	Rich garlic butter sauce	#fefcbf	0	0	t	1	2025-08-31 03:40:20.248	2025-08-31 03:40:20.248
cmez57ct50005vkc4udrjjw5h	White (No Sauce)	No sauce - just cheese and toppings	#ffffff	0	0	t	1	2025-08-31 03:40:20.25	2025-08-31 03:40:20.25
cmez57ct70006vkc4uuwgkjk5	Marinara sauce	Marinara sauce	#ff0000	1	0	t	1	2025-08-31 03:40:20.251	2025-08-31 03:40:20.251
\.


--
-- TOC entry 5252 (class 0 OID 47589)
-- Dependencies: 220
-- Data for Name: pizza_sizes; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.pizza_sizes (id, name, diameter, "basePrice", "isActive", "sortOrder", description, "createdAt", "updatedAt", "productType") FROM stdin;
cmez5n8nl0000vk3k7n5edmea	Small Calzone	Personal size calzone	23	t	10	\N	2025-08-31 03:52:41.361	2025-08-31 03:56:48.817	CALZONE
cmez5n8nn0001vk3kjqe0zbsp	Large Calzone	Family size calzone	29.99	t	11	\N	2025-08-31 03:52:41.364	2025-08-31 03:56:48.825	CALZONE
cmez57csv0000vkc4nzo0th14	Small Pizza	12"	16.5	t	1	Perfect for 1-2 people	2025-08-31 03:40:20.24	2025-08-31 03:56:48.838	PIZZA
cmez57csy0001vkc4fbtoets6	Large Pizza	16"	23.5	t	2	Great for families and sharing	2025-08-31 03:40:20.242	2025-08-31 03:56:48.844	PIZZA
\.


--
-- TOC entry 5255 (class 0 OID 47623)
-- Dependencies: 223
-- Data for Name: pizza_toppings; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.pizza_toppings (id, name, description, category, price, "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") FROM stdin;
cmez57ctc0008vkc4gno2jo9r	Black Olives	\N	VEGETABLE	2	t	1	t	t	f	2025-08-31 03:40:20.257	2025-08-31 03:40:20.257
cmez57cte0009vkc4cdbrvja2	Broccoli	\N	VEGETABLE	2	t	2	t	t	f	2025-08-31 03:40:20.258	2025-08-31 03:40:20.258
cmez57cte000avkc4lpgv97o3	Eggplant	\N	VEGETABLE	2	t	3	t	t	f	2025-08-31 03:40:20.259	2025-08-31 03:40:20.259
cmez57ctf000bvkc4u8jfcctq	Fresh Mushrooms	\N	VEGETABLE	2	t	4	t	t	f	2025-08-31 03:40:20.26	2025-08-31 03:40:20.26
cmez57ctg000cvkc46m0wjghg	Fresh Onions	\N	VEGETABLE	2	t	5	t	t	f	2025-08-31 03:40:20.26	2025-08-31 03:40:20.26
cmez57cth000dvkc4whyx28oq	Fresh Garlic	\N	VEGETABLE	2	t	6	t	t	f	2025-08-31 03:40:20.261	2025-08-31 03:40:20.261
cmez57cti000evkc4pxjejpaa	Green Bell Peppers	\N	VEGETABLE	2	t	7	t	t	f	2025-08-31 03:40:20.263	2025-08-31 03:40:20.263
cmez57ctj000fvkc4dut7xifh	Grilled Onions	\N	VEGETABLE	2	t	8	t	t	f	2025-08-31 03:40:20.264	2025-08-31 03:40:20.264
cmez57ctk000gvkc47fcafj1f	Hot Pepper Rings	\N	VEGETABLE	2	t	9	t	t	f	2025-08-31 03:40:20.264	2025-08-31 03:40:20.264
cmez57ctl000hvkc4gf4s6kgl	Jalapeños	\N	VEGETABLE	2	t	10	t	t	f	2025-08-31 03:40:20.265	2025-08-31 03:40:20.265
cmez57ctl000ivkc444c40p29	Roasted Bell Peppers	\N	VEGETABLE	2	t	11	t	t	f	2025-08-31 03:40:20.266	2025-08-31 03:40:20.266
cmez57ctm000jvkc4nxabd229	Spinach	\N	VEGETABLE	2	t	12	t	t	f	2025-08-31 03:40:20.267	2025-08-31 03:40:20.267
cmez57ctn000kvkc4cgoe6sqn	Tomatoes	\N	VEGETABLE	2	t	13	t	t	f	2025-08-31 03:40:20.267	2025-08-31 03:40:20.267
cmez57cto000lvkc42gzgyexr	Extra Cheese	\N	CHEESE	2	t	14	t	f	f	2025-08-31 03:40:20.268	2025-08-31 03:40:20.268
cmez57cto000mvkc4x4bugo9m	Feta	\N	CHEESE	2	t	15	t	f	f	2025-08-31 03:40:20.269	2025-08-31 03:40:20.269
cmez57ctp000nvkc48fy737nq	Ricotta Cheese	\N	CHEESE	2	t	16	t	f	f	2025-08-31 03:40:20.269	2025-08-31 03:40:20.269
cmez57ctq000ovkc4qt73cxo1	Ham	\N	MEAT	2	t	17	f	f	f	2025-08-31 03:40:20.27	2025-08-31 03:40:20.27
cmez57ctq000pvkc41cp4qe5p	Meatballs	\N	MEAT	2	t	18	f	f	f	2025-08-31 03:40:20.271	2025-08-31 03:40:20.271
cmez57ctr000qvkc4rkn1c368	Pepperoni	\N	MEAT	2	t	19	f	f	f	2025-08-31 03:40:20.271	2025-08-31 03:40:20.271
cmez57cts000rvkc4p6c3nhua	Salami	\N	MEAT	2	t	20	f	f	f	2025-08-31 03:40:20.272	2025-08-31 03:40:20.272
cmez57cts000svkc4jnanslc0	Sausage	\N	MEAT	2	t	21	f	f	f	2025-08-31 03:40:20.273	2025-08-31 03:40:20.273
cmez57ctt000tvkc4ln5deozo	Bacon	\N	MEAT	5	t	22	f	f	f	2025-08-31 03:40:20.274	2025-08-31 03:40:20.274
cmez57ctu000uvkc4asbg1mbb	Chicken Fingers	\N	MEAT	5	t	23	f	f	f	2025-08-31 03:40:20.274	2025-08-31 03:40:20.274
cmez57ctv000vvkc4uz394m7n	Grilled Chicken	\N	MEAT	5	t	24	f	f	f	2025-08-31 03:40:20.275	2025-08-31 03:40:20.275
cmez57ctv000wvkc4d2cfji19	Roasted Chicken	\N	MEAT	5	t	25	f	f	f	2025-08-31 03:40:20.276	2025-08-31 03:40:20.276
cmez57ctw000xvkc4evclv18m	Pineapple	\N	SPECIALTY	2	t	26	t	t	f	2025-08-31 03:40:20.277	2025-08-31 03:40:20.277
\.


--
-- TOC entry 5265 (class 0 OID 47724)
-- Dependencies: 233
-- Data for Name: price_snapshots; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.price_snapshots (id, "orderId", "componentType", "componentId", "componentName", "snapshotPrice", "createdAt") FROM stdin;
\.


--
-- TOC entry 5266 (class 0 OID 47732)
-- Dependencies: 234
-- Data for Name: pricing_history; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.pricing_history (id, "componentType", "componentId", "componentName", "oldPrice", "newPrice", "changeReason", "changedBy", "changedAt") FROM stdin;
\.


--
-- TOC entry 5280 (class 0 OID 47871)
-- Dependencies: 248
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.promotions (id, name, description, type, "discountType", "discountValue", "minimumOrderAmount", "maximumDiscountAmount", "minimumQuantity", "applicableCategories", "applicableItems", "requiresLogin", "userGroupRestrictions", "startDate", "endDate", "isActive", "usageLimit", "usageCount", "perUserLimit", stackable, priority, terms, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5267 (class 0 OID 47740)
-- Dependencies: 235
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.refresh_tokens (id, "userId", "tokenHash", "deviceFingerprint", "ipAddress", "userAgent", revoked, "revokedAt", "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 5259 (class 0 OID 47665)
-- Dependencies: 227
-- Data for Name: specialty_calzone_sizes; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.specialty_calzone_sizes (id, "specialtyCalzoneId", "pizzaSizeId", price, "isAvailable", "createdAt", "updatedAt") FROM stdin;
cmez5ncag0002vkawcfri9cj5	cmez5ncad0000vkawbsowxu3l	cmez5n8nl0000vk3k7n5edmea	23	t	2025-08-31 03:52:46.072	2025-08-31 03:56:48.866
cmez5ncaj0004vkaws75wn51t	cmez5ncad0000vkawbsowxu3l	cmez5n8nn0001vk3kjqe0zbsp	29.99	t	2025-08-31 03:52:46.076	2025-08-31 03:56:48.869
cmez5ncan0007vkaw4kxqm5z8	cmez5ncal0005vkawc1hizvly	cmez5n8nl0000vk3k7n5edmea	23	t	2025-08-31 03:52:46.079	2025-08-31 03:56:48.871
cmez5ncao0009vkaw0amijn0b	cmez5ncal0005vkawc1hizvly	cmez5n8nn0001vk3kjqe0zbsp	29.99	t	2025-08-31 03:52:46.081	2025-08-31 03:56:48.873
cmez5ncas000cvkawksqhl8fv	cmez5ncaq000avkawfzyept7d	cmez5n8nl0000vk3k7n5edmea	23	t	2025-08-31 03:52:46.084	2025-08-31 03:56:48.875
cmez5ncat000evkawp8maql95	cmez5ncaq000avkawfzyept7d	cmez5n8nn0001vk3kjqe0zbsp	29.99	t	2025-08-31 03:52:46.085	2025-08-31 03:56:48.879
cmez5ncaw000hvkaw2spnkusy	cmez5ncav000fvkaw5851hj5o	cmez5n8nl0000vk3k7n5edmea	23	t	2025-08-31 03:52:46.089	2025-08-31 03:56:48.882
cmez5ncax000jvkawsixm5e3b	cmez5ncav000fvkaw5851hj5o	cmez5n8nn0001vk3kjqe0zbsp	29.99	t	2025-08-31 03:52:46.09	2025-08-31 03:56:48.885
cmez5ncb1000mvkawxmaeus87	cmez5ncaz000kvkawt4u0qleq	cmez5n8nl0000vk3k7n5edmea	23	t	2025-08-31 03:52:46.093	2025-08-31 03:56:48.887
cmez5ncb2000ovkawwuy8yju3	cmez5ncaz000kvkawt4u0qleq	cmez5n8nn0001vk3kjqe0zbsp	29.99	t	2025-08-31 03:52:46.094	2025-08-31 03:56:48.891
cmez5ncb5000rvkawzw0605s3	cmez5ncb4000pvkawtrsi1vx1	cmez5n8nl0000vk3k7n5edmea	23	t	2025-08-31 03:52:46.098	2025-08-31 03:56:48.894
cmez5ncb6000tvkawm2371h2m	cmez5ncb4000pvkawtrsi1vx1	cmez5n8nn0001vk3kjqe0zbsp	29.99	t	2025-08-31 03:52:46.099	2025-08-31 03:56:48.897
cmez5ncb9000wvkaw3z1k6udp	cmez5ncb8000uvkawhnyir4x3	cmez5n8nl0000vk3k7n5edmea	23	t	2025-08-31 03:52:46.102	2025-08-31 03:56:48.9
cmez5ncbb000yvkawcj2k0nbx	cmez5ncb8000uvkawhnyir4x3	cmez5n8nn0001vk3kjqe0zbsp	29.99	t	2025-08-31 03:52:46.103	2025-08-31 03:56:48.903
\.


--
-- TOC entry 5258 (class 0 OID 47655)
-- Dependencies: 226
-- Data for Name: specialty_calzones; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.specialty_calzones (id, "calzoneName", "calzoneDescription", "basePrice", category, "imageUrl", fillings, "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmez5ncad0000vkawbsowxu3l	Veggie Calzone	Fresh vegetable calzone	21.5	CALZONE	\N	["Roasted peppers","roasted onions","grilled tomatoes","mushrooms and broccoli"]	t	1	2025-08-31 03:52:46.07	2025-08-31 03:52:46.07
cmez5ncal0005vkawc1hizvly	Traditional Calzone	Classic pepperoni calzone	21.5	CALZONE	\N	["Pepperoni","ricotta cheese","sauce and our blends of mozzarella cheese"]	t	2	2025-08-31 03:52:46.078	2025-08-31 03:52:46.078
cmez5ncaq000avkawfzyept7d	Ham & Cheese Calzone	Ham and cheese calzone	21.5	CALZONE	\N	["Sauce","a blend of our cheese and ham and american cheese"]	t	3	2025-08-31 03:52:46.083	2025-08-31 03:52:46.083
cmez5ncav000fvkaw5851hj5o	Chicken Parmesan Calzone	Chicken parmesan calzone with marinara	21.5	CALZONE	\N	["Chicken parmesan","ricotta cheese with marinara sauce"]	t	4	2025-08-31 03:52:46.087	2025-08-31 03:52:46.087
cmez5ncaz000kvkawt4u0qleq	Chicken Broccoli Alfredo Calzone	Chicken and broccoli with alfredo sauce	21.5	CALZONE	\N	["Chicken","broccoli and onions with white alfredo sauce"]	t	5	2025-08-31 03:52:46.092	2025-08-31 03:52:46.092
cmez5ncb4000pvkawtrsi1vx1	Greek Calzone	Mediterranean style calzone	21.5	CALZONE	\N	["Feta","spinach and tomatoes"]	t	6	2025-08-31 03:52:46.096	2025-08-31 03:52:46.096
cmez5ncb8000uvkawhnyir4x3	Meatball Calzone	Hearty meatball calzone	21.5	CALZONE	\N	["Meatballs with marinara sauce and mozzarella cheese"]	t	7	2025-08-31 03:52:46.101	2025-08-31 03:52:46.101
\.


--
-- TOC entry 5257 (class 0 OID 47646)
-- Dependencies: 225
-- Data for Name: specialty_pizza_sizes; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.specialty_pizza_sizes (id, "specialtyPizzaId", "pizzaSizeId", price, "isAvailable", "createdAt", "updatedAt") FROM stdin;
cmez5msfc0002vkaw1pg8gzw9	cmez5mset0000vkawy2dx6uqm	cmez57csv0000vkc4nzo0th14	15.45	t	2025-08-31 03:52:20.328	2025-08-31 03:56:48.923
cmez5msft0004vkawzep2vsrx	cmez5mset0000vkawy2dx6uqm	cmez57csy0001vkc4fbtoets6	22.45	t	2025-08-31 03:52:20.345	2025-08-31 03:56:48.928
cmez5msfy0007vkawj6c7mc5m	cmez5msfw0005vkawuq4y4j55	cmez57csv0000vkc4nzo0th14	16.5	t	2025-08-31 03:52:20.351	2025-08-31 03:56:48.93
cmez5msg00009vkawqvsf044p	cmez5msfw0005vkawuq4y4j55	cmez57csy0001vkc4fbtoets6	23.5	t	2025-08-31 03:52:20.353	2025-08-31 03:56:48.933
cmez5msg6000cvkaw7xzftxxw	cmez5msg3000avkawvqe7cusa	cmez57csv0000vkc4nzo0th14	16.5	t	2025-08-31 03:52:20.358	2025-08-31 03:56:48.936
cmez5msg7000evkawwdwwgk26	cmez5msg3000avkawvqe7cusa	cmez57csy0001vkc4fbtoets6	23.5	t	2025-08-31 03:52:20.36	2025-08-31 03:56:48.939
cmez5msgc000hvkawh0nbmx4u	cmez5msga000fvkawa2hp9b38	cmez57csv0000vkc4nzo0th14	16.5	t	2025-08-31 03:52:20.364	2025-08-31 03:56:48.942
cmez5msge000jvkawaqkscudz	cmez5msga000fvkawa2hp9b38	cmez57csy0001vkc4fbtoets6	23.5	t	2025-08-31 03:52:20.366	2025-08-31 03:56:48.945
cmez5msgj000mvkawxhxy420f	cmez5msgh000kvkawdkkg9et6	cmez57csv0000vkc4nzo0th14	16.5	t	2025-08-31 03:52:20.371	2025-08-31 03:56:48.948
cmez5msgl000ovkawpop68yru	cmez5msgh000kvkawdkkg9et6	cmez57csy0001vkc4fbtoets6	23.5	t	2025-08-31 03:52:20.373	2025-08-31 03:56:48.951
cmez5msgp000rvkaw1avim59u	cmez5msgn000pvkaw23ywxpn7	cmez57csv0000vkc4nzo0th14	16.5	t	2025-08-31 03:52:20.378	2025-08-31 03:56:48.953
cmez5msgr000tvkaw1v8g73pu	cmez5msgn000pvkaw23ywxpn7	cmez57csy0001vkc4fbtoets6	23.5	t	2025-08-31 03:52:20.379	2025-08-31 03:56:48.956
cmez5msgw000wvkaw2ebm1kvl	cmez5msgu000uvkawnh7fpkrg	cmez57csv0000vkc4nzo0th14	16.5	t	2025-08-31 03:52:20.384	2025-08-31 03:56:48.959
cmez5msgx000yvkawj09t373n	cmez5msgu000uvkawnh7fpkrg	cmez57csy0001vkc4fbtoets6	23.5	t	2025-08-31 03:52:20.386	2025-08-31 03:56:48.963
\.


--
-- TOC entry 5256 (class 0 OID 47636)
-- Dependencies: 224
-- Data for Name: specialty_pizzas; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.specialty_pizzas (id, name, description, "basePrice", category, "imageUrl", ingredients, "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmez5mset0000vkawy2dx6uqm	Chicken Alfredo	Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses	15.45	Premium	\N	["Alfredo Sauce","Chicken","Broccoli","Onions","Cheese Blend"]	t	1	2025-08-31 03:52:20.309	2025-08-31 03:52:20.309
cmez5msfw0005vkawuq4y4j55	BBQ Chicken	Chicken, Onion and Bacon with lots of BBQ sauce	16.5	Premium	\N	["BBQ Sauce","Chicken","Onion","Bacon","Cheese"]	t	2	2025-08-31 03:52:20.349	2025-08-31 03:52:20.349
cmez5msg3000avkawvqe7cusa	House Special	Meatball, Sausage, Pepperoni, Mushrooms, Grilled peppers and onions	16.5	Premium	\N	["Meatball","Sausage","Pepperoni","Mushrooms","Grilled Peppers","Grilled Onions","Cheese"]	t	3	2025-08-31 03:52:20.356	2025-08-31 03:52:20.356
cmez5msga000fvkawa2hp9b38	Buffalo Chicken	Buffalo Chicken, grilled Onion, grilled peppers with lots of cheese	16.5	Premium	\N	["Buffalo Chicken","Grilled Onion","Grilled Peppers","Extra Cheese"]	t	4	2025-08-31 03:52:20.363	2025-08-31 03:52:20.363
cmez5msgh000kvkawdkkg9et6	Meat Lovers	Meatball, Sausage, Pepperoni, Bacon, Salami and Ham	16.5	Meat Lovers	\N	["Meatball","Sausage","Pepperoni","Bacon","Salami","Ham","Cheese"]	t	5	2025-08-31 03:52:20.369	2025-08-31 03:52:20.369
cmez5msgn000pvkaw23ywxpn7	Athenian	Chicken with Alfredo, grilled Onion, fresh spinach and of course feta cheese	16.5	Premium	\N	["Chicken","Alfredo Sauce","Grilled Onion","Fresh Spinach","Feta Cheese","Mozzarella"]	t	6	2025-08-31 03:52:20.376	2025-08-31 03:52:20.376
cmez5msgu000uvkawnh7fpkrg	Veggie Pizza	Roasted peppers, roasted onions, fresh tomatoes, mushrooms and broccoli	16.5	Vegetarian	\N	["Roasted Peppers","Roasted Onions","Fresh Tomatoes","Mushrooms","Broccoli","Cheese"]	t	7	2025-08-31 03:52:20.382	2025-08-31 03:52:20.382
\.


--
-- TOC entry 5247 (class 0 OID 47535)
-- Dependencies: 215
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: auy1jll
--

COPY public.users (id, email, name, password, phone, "dateOfBirth", "avatarUrl", "isActive", "lastLoginAt", "emailVerified", "marketingOptIn", role, "resetTokenExpiry", "createdAt", "updatedAt", "resetToken") FROM stdin;
cmez7yyig0000vkgsnomscjd6	auy1jll33@gmail.com	Pizza Admin	$2b$12$9ed51fnOYuaP.4gNX/iP8eB69x0mQk/pMOXKUQ1ZUGO3JCd8cvgYu		\N	\N	t	\N	t	f	ADMIN	\N	2025-08-31 04:57:47.32	2025-08-31 05:01:22.816	\N
cmez8ob60000avkn8yv0rn3sc	admin@pizzabuilder.com	 	$2b$12$cUlfC/XtlV3piEXjN8CBFOuLb/xCibHWm9sbEd0MREsObk5iUD9cC		\N	\N	t	\N	t	f	EMPLOYEE	\N	2025-08-31 05:17:30.121	2025-08-31 05:17:30.121	\N
cmez8pyiz000dvkn8mhu5agrf	Liz@greenlandfamous.com	LIZ LIZ	$2b$12$lIN4lNxjf6U.KWcleUAw9O9PvhFk9Rvig5ThmPhqoLjjy5HYG/xfi		\N	\N	t	\N	t	f	EMPLOYEE	\N	2025-08-31 05:18:47.051	2025-08-31 05:18:47.051	\N
cmezcuymv0000vkgssi6itsdv	auy1jll@gmail.com	Admin User	$2b$10$Fu1DxTQRAksEwa0AN10tEuQGU6pJ/5G8rqYpnx9fWtoCCe1jRSECu	\N	\N	\N	t	\N	t	f	ADMIN	2025-08-31 09:02:32.253	2025-08-31 07:14:38.933	2025-08-31 08:02:32.253	8d81e9f63c7a05bdcc0cf5bfceb520d887d9f7655b9dba340c218cf90f3f9b88
cmezfwz7b0000vktgdestx9tn	staff101@greenlandFamous.com	operations greenland	$2b$12$wD89t2wf4E520KEhLqD2C.muvpRoxWlxuhO44XxjZDnkBdOl9oG4.		\N	\N	t	\N	t	f	EMPLOYEE	\N	2025-08-31 08:40:11.829	2025-08-31 08:58:06.567	\N
\.


--
-- TOC entry 5001 (class 2606 OID 47723)
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 5044 (class 2606 OID 47859)
-- Name: cart_item_customizations cart_item_customizations_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_item_customizations
    ADD CONSTRAINT cart_item_customizations_pkey PRIMARY KEY (id);


--
-- TOC entry 5046 (class 2606 OID 47870)
-- Name: cart_item_pizza_toppings cart_item_pizza_toppings_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_item_pizza_toppings
    ADD CONSTRAINT cart_item_pizza_toppings_pkey PRIMARY KEY (id);


--
-- TOC entry 5040 (class 2606 OID 47850)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4948 (class 2606 OID 47570)
-- Name: customer_addresses customer_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT customer_addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 4954 (class 2606 OID 47588)
-- Name: customer_favorites customer_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.customer_favorites
    ADD CONSTRAINT customer_favorites_pkey PRIMARY KEY (id);


--
-- TOC entry 4945 (class 2606 OID 47559)
-- Name: customer_profiles customer_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.customer_profiles
    ADD CONSTRAINT customer_profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 5032 (class 2606 OID 47818)
-- Name: customization_groups customization_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.customization_groups
    ADD CONSTRAINT customization_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 5035 (class 2606 OID 47831)
-- Name: customization_options customization_options_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.customization_options
    ADD CONSTRAINT customization_options_pkey PRIMARY KEY (id);


--
-- TOC entry 5060 (class 2606 OID 47911)
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5057 (class 2606 OID 47902)
-- Name: email_settings email_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.email_settings
    ADD CONSTRAINT email_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 5054 (class 2606 OID 47892)
-- Name: email_templates email_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.email_templates
    ADD CONSTRAINT email_templates_pkey PRIMARY KEY (id);


--
-- TOC entry 4951 (class 2606 OID 47579)
-- Name: employee_profiles employee_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.employee_profiles
    ADD CONSTRAINT employee_profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 5029 (class 2606 OID 47806)
-- Name: item_modifiers item_modifiers_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.item_modifiers
    ADD CONSTRAINT item_modifiers_pkey PRIMARY KEY (id);


--
-- TOC entry 5014 (class 2606 OID 47756)
-- Name: jwt_blacklist jwt_blacklist_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.jwt_blacklist
    ADD CONSTRAINT jwt_blacklist_pkey PRIMARY KEY (id);


--
-- TOC entry 5017 (class 2606 OID 47766)
-- Name: jwt_secrets jwt_secrets_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.jwt_secrets
    ADD CONSTRAINT jwt_secrets_pkey PRIMARY KEY (id);


--
-- TOC entry 5020 (class 2606 OID 47776)
-- Name: menu_categories menu_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT menu_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5038 (class 2606 OID 47841)
-- Name: menu_item_customizations menu_item_customizations_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.menu_item_customizations
    ADD CONSTRAINT menu_item_customizations_pkey PRIMARY KEY (id);


--
-- TOC entry 5024 (class 2606 OID 47787)
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5026 (class 2606 OID 47797)
-- Name: modifiers modifiers_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.modifiers
    ADD CONSTRAINT modifiers_pkey PRIMARY KEY (id);


--
-- TOC entry 4998 (class 2606 OID 47714)
-- Name: order_item_customizations order_item_customizations_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_item_customizations
    ADD CONSTRAINT order_item_customizations_pkey PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 47705)
-- Name: order_item_toppings order_item_toppings_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_item_toppings
    ADD CONSTRAINT order_item_toppings_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 47694)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4987 (class 2606 OID 47685)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4960 (class 2606 OID 47610)
-- Name: pizza_crusts pizza_crusts_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.pizza_crusts
    ADD CONSTRAINT pizza_crusts_pkey PRIMARY KEY (id);


--
-- TOC entry 4963 (class 2606 OID 47622)
-- Name: pizza_sauces pizza_sauces_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.pizza_sauces
    ADD CONSTRAINT pizza_sauces_pkey PRIMARY KEY (id);


--
-- TOC entry 4957 (class 2606 OID 47599)
-- Name: pizza_sizes pizza_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.pizza_sizes
    ADD CONSTRAINT pizza_sizes_pkey PRIMARY KEY (id);


--
-- TOC entry 4966 (class 2606 OID 47635)
-- Name: pizza_toppings pizza_toppings_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.pizza_toppings
    ADD CONSTRAINT pizza_toppings_pkey PRIMARY KEY (id);


--
-- TOC entry 5003 (class 2606 OID 47731)
-- Name: price_snapshots price_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.price_snapshots
    ADD CONSTRAINT price_snapshots_pkey PRIMARY KEY (id);


--
-- TOC entry 5005 (class 2606 OID 47739)
-- Name: pricing_history pricing_history_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.pricing_history
    ADD CONSTRAINT pricing_history_pkey PRIMARY KEY (id);


--
-- TOC entry 5049 (class 2606 OID 47883)
-- Name: promotions promotions_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.promotions
    ADD CONSTRAINT promotions_pkey PRIMARY KEY (id);


--
-- TOC entry 5008 (class 2606 OID 47748)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 47673)
-- Name: specialty_calzone_sizes specialty_calzone_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.specialty_calzone_sizes
    ADD CONSTRAINT specialty_calzone_sizes_pkey PRIMARY KEY (id);


--
-- TOC entry 4979 (class 2606 OID 47664)
-- Name: specialty_calzones specialty_calzones_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.specialty_calzones
    ADD CONSTRAINT specialty_calzones_pkey PRIMARY KEY (id);


--
-- TOC entry 4973 (class 2606 OID 47654)
-- Name: specialty_pizza_sizes specialty_pizza_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.specialty_pizza_sizes
    ADD CONSTRAINT specialty_pizza_sizes_pkey PRIMARY KEY (id);


--
-- TOC entry 4971 (class 2606 OID 47645)
-- Name: specialty_pizzas specialty_pizzas_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.specialty_pizzas
    ADD CONSTRAINT specialty_pizzas_pkey PRIMARY KEY (id);


--
-- TOC entry 4943 (class 2606 OID 47546)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4999 (class 1259 OID 47926)
-- Name: app_settings_key_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX app_settings_key_key ON public.app_settings USING btree (key);


--
-- TOC entry 5041 (class 1259 OID 47940)
-- Name: cart_items_sessionId_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "cart_items_sessionId_idx" ON public.cart_items USING btree ("sessionId");


--
-- TOC entry 5042 (class 1259 OID 47941)
-- Name: cart_items_userId_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "cart_items_userId_idx" ON public.cart_items USING btree ("userId");


--
-- TOC entry 4946 (class 1259 OID 47913)
-- Name: customer_profiles_userId_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "customer_profiles_userId_key" ON public.customer_profiles USING btree ("userId");


--
-- TOC entry 5030 (class 1259 OID 47937)
-- Name: customization_groups_categoryId_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "customization_groups_categoryId_idx" ON public.customization_groups USING btree ("categoryId");


--
-- TOC entry 5033 (class 1259 OID 47938)
-- Name: customization_options_groupId_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "customization_options_groupId_idx" ON public.customization_options USING btree ("groupId");


--
-- TOC entry 5058 (class 1259 OID 47947)
-- Name: email_settings_settingKey_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "email_settings_settingKey_key" ON public.email_settings USING btree ("settingKey");


--
-- TOC entry 5055 (class 1259 OID 47946)
-- Name: email_templates_templateKey_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "email_templates_templateKey_key" ON public.email_templates USING btree ("templateKey");


--
-- TOC entry 4949 (class 1259 OID 47915)
-- Name: employee_profiles_employeeId_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "employee_profiles_employeeId_key" ON public.employee_profiles USING btree ("employeeId");


--
-- TOC entry 4952 (class 1259 OID 47914)
-- Name: employee_profiles_userId_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "employee_profiles_userId_key" ON public.employee_profiles USING btree ("userId");


--
-- TOC entry 5027 (class 1259 OID 47936)
-- Name: item_modifiers_itemId_modifierId_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "item_modifiers_itemId_modifierId_key" ON public.item_modifiers USING btree ("itemId", "modifierId");


--
-- TOC entry 5011 (class 1259 OID 47931)
-- Name: jwt_blacklist_expiresAt_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "jwt_blacklist_expiresAt_idx" ON public.jwt_blacklist USING btree ("expiresAt");


--
-- TOC entry 5012 (class 1259 OID 47930)
-- Name: jwt_blacklist_jti_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX jwt_blacklist_jti_key ON public.jwt_blacklist USING btree (jti);


--
-- TOC entry 5015 (class 1259 OID 47932)
-- Name: jwt_secrets_kid_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX jwt_secrets_kid_key ON public.jwt_secrets USING btree (kid);


--
-- TOC entry 5018 (class 1259 OID 47933)
-- Name: menu_categories_name_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX menu_categories_name_key ON public.menu_categories USING btree (name);


--
-- TOC entry 5021 (class 1259 OID 47934)
-- Name: menu_categories_slug_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX menu_categories_slug_key ON public.menu_categories USING btree (slug);


--
-- TOC entry 5036 (class 1259 OID 47939)
-- Name: menu_item_customizations_menuItemId_customizationGroupId_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "menu_item_customizations_menuItemId_customizationGroupId_key" ON public.menu_item_customizations USING btree ("menuItemId", "customizationGroupId");


--
-- TOC entry 5022 (class 1259 OID 47935)
-- Name: menu_items_categoryId_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "menu_items_categoryId_idx" ON public.menu_items USING btree ("categoryId");


--
-- TOC entry 4994 (class 1259 OID 47925)
-- Name: order_item_toppings_orderItemId_pizzaToppingId_section_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "order_item_toppings_orderItemId_pizzaToppingId_section_key" ON public.order_item_toppings USING btree ("orderItemId", "pizzaToppingId", section);


--
-- TOC entry 4991 (class 1259 OID 48167)
-- Name: order_items_orderId_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "order_items_orderId_idx" ON public.order_items USING btree ("orderId");


--
-- TOC entry 4983 (class 1259 OID 48171)
-- Name: orders_createdAt_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "orders_createdAt_idx" ON public.orders USING btree ("createdAt");


--
-- TOC entry 4984 (class 1259 OID 47924)
-- Name: orders_orderNumber_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "orders_orderNumber_key" ON public.orders USING btree ("orderNumber");


--
-- TOC entry 4985 (class 1259 OID 48170)
-- Name: orders_orderType_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "orders_orderType_idx" ON public.orders USING btree ("orderType");


--
-- TOC entry 4988 (class 1259 OID 48172)
-- Name: orders_status_createdAt_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "orders_status_createdAt_idx" ON public.orders USING btree (status, "createdAt");


--
-- TOC entry 4989 (class 1259 OID 48169)
-- Name: orders_status_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX orders_status_idx ON public.orders USING btree (status);


--
-- TOC entry 4990 (class 1259 OID 48168)
-- Name: orders_userId_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "orders_userId_idx" ON public.orders USING btree ("userId");


--
-- TOC entry 4958 (class 1259 OID 47917)
-- Name: pizza_crusts_name_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX pizza_crusts_name_key ON public.pizza_crusts USING btree (name);


--
-- TOC entry 4961 (class 1259 OID 47918)
-- Name: pizza_sauces_name_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX pizza_sauces_name_key ON public.pizza_sauces USING btree (name);


--
-- TOC entry 4955 (class 1259 OID 47916)
-- Name: pizza_sizes_name_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX pizza_sizes_name_key ON public.pizza_sizes USING btree (name);


--
-- TOC entry 4964 (class 1259 OID 47919)
-- Name: pizza_toppings_name_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX pizza_toppings_name_key ON public.pizza_toppings USING btree (name);


--
-- TOC entry 5047 (class 1259 OID 47943)
-- Name: promotions_isActive_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "promotions_isActive_idx" ON public.promotions USING btree ("isActive");


--
-- TOC entry 5050 (class 1259 OID 47945)
-- Name: promotions_priority_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX promotions_priority_idx ON public.promotions USING btree (priority);


--
-- TOC entry 5051 (class 1259 OID 47944)
-- Name: promotions_startDate_endDate_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "promotions_startDate_endDate_idx" ON public.promotions USING btree ("startDate", "endDate");


--
-- TOC entry 5052 (class 1259 OID 47942)
-- Name: promotions_type_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX promotions_type_idx ON public.promotions USING btree (type);


--
-- TOC entry 5006 (class 1259 OID 47929)
-- Name: refresh_tokens_expiresAt_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "refresh_tokens_expiresAt_idx" ON public.refresh_tokens USING btree ("expiresAt");


--
-- TOC entry 5009 (class 1259 OID 47927)
-- Name: refresh_tokens_tokenHash_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON public.refresh_tokens USING btree ("tokenHash");


--
-- TOC entry 5010 (class 1259 OID 47928)
-- Name: refresh_tokens_userId_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "refresh_tokens_userId_idx" ON public.refresh_tokens USING btree ("userId");


--
-- TOC entry 4982 (class 1259 OID 47923)
-- Name: specialty_calzone_sizes_specialtyCalzoneId_pizzaSizeId_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "specialty_calzone_sizes_specialtyCalzoneId_pizzaSizeId_key" ON public.specialty_calzone_sizes USING btree ("specialtyCalzoneId", "pizzaSizeId");


--
-- TOC entry 4975 (class 1259 OID 47922)
-- Name: specialty_calzones_calzoneName_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "specialty_calzones_calzoneName_key" ON public.specialty_calzones USING btree ("calzoneName");


--
-- TOC entry 4976 (class 1259 OID 48174)
-- Name: specialty_calzones_category_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX specialty_calzones_category_idx ON public.specialty_calzones USING btree (category);


--
-- TOC entry 4977 (class 1259 OID 48173)
-- Name: specialty_calzones_isActive_sortOrder_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "specialty_calzones_isActive_sortOrder_idx" ON public.specialty_calzones USING btree ("isActive", "sortOrder");


--
-- TOC entry 4974 (class 1259 OID 47921)
-- Name: specialty_pizza_sizes_specialtyPizzaId_pizzaSizeId_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX "specialty_pizza_sizes_specialtyPizzaId_pizzaSizeId_key" ON public.specialty_pizza_sizes USING btree ("specialtyPizzaId", "pizzaSizeId");


--
-- TOC entry 4967 (class 1259 OID 48176)
-- Name: specialty_pizzas_category_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX specialty_pizzas_category_idx ON public.specialty_pizzas USING btree (category);


--
-- TOC entry 4968 (class 1259 OID 48175)
-- Name: specialty_pizzas_isActive_sortOrder_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "specialty_pizzas_isActive_sortOrder_idx" ON public.specialty_pizzas USING btree ("isActive", "sortOrder");


--
-- TOC entry 4969 (class 1259 OID 47920)
-- Name: specialty_pizzas_name_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX specialty_pizzas_name_key ON public.specialty_pizzas USING btree (name);


--
-- TOC entry 4939 (class 1259 OID 48177)
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- TOC entry 4940 (class 1259 OID 47912)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 4941 (class 1259 OID 48178)
-- Name: users_isActive_idx; Type: INDEX; Schema: public; Owner: auy1jll
--

CREATE INDEX "users_isActive_idx" ON public.users USING btree ("isActive");


--
-- TOC entry 5100 (class 2606 OID 48123)
-- Name: cart_item_customizations cart_item_customizations_cartItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_item_customizations
    ADD CONSTRAINT "cart_item_customizations_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES public.cart_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5101 (class 2606 OID 48128)
-- Name: cart_item_customizations cart_item_customizations_customizationOptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_item_customizations
    ADD CONSTRAINT "cart_item_customizations_customizationOptionId_fkey" FOREIGN KEY ("customizationOptionId") REFERENCES public.customization_options(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5102 (class 2606 OID 48133)
-- Name: cart_item_pizza_toppings cart_item_pizza_toppings_cartItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_item_pizza_toppings
    ADD CONSTRAINT "cart_item_pizza_toppings_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES public.cart_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5103 (class 2606 OID 48138)
-- Name: cart_item_pizza_toppings cart_item_pizza_toppings_pizzaToppingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_item_pizza_toppings
    ADD CONSTRAINT "cart_item_pizza_toppings_pizzaToppingId_fkey" FOREIGN KEY ("pizzaToppingId") REFERENCES public.pizza_toppings(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5093 (class 2606 OID 48098)
-- Name: cart_items cart_items_menuItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5094 (class 2606 OID 48103)
-- Name: cart_items cart_items_pizzaCrustId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_pizzaCrustId_fkey" FOREIGN KEY ("pizzaCrustId") REFERENCES public.pizza_crusts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5095 (class 2606 OID 48108)
-- Name: cart_items cart_items_pizzaSauceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_pizzaSauceId_fkey" FOREIGN KEY ("pizzaSauceId") REFERENCES public.pizza_sauces(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5096 (class 2606 OID 48113)
-- Name: cart_items cart_items_pizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5097 (class 2606 OID 48194)
-- Name: cart_items cart_items_specialtyCalzoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_specialtyCalzoneId_fkey" FOREIGN KEY ("specialtyCalzoneId") REFERENCES public.specialty_calzones(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5098 (class 2606 OID 48189)
-- Name: cart_items cart_items_specialtyPizzaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_specialtyPizzaId_fkey" FOREIGN KEY ("specialtyPizzaId") REFERENCES public.specialty_pizzas(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5099 (class 2606 OID 48118)
-- Name: cart_items cart_items_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5064 (class 2606 OID 47963)
-- Name: customer_addresses customer_addresses_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.customer_addresses
    ADD CONSTRAINT "customer_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5066 (class 2606 OID 47973)
-- Name: customer_favorites customer_favorites_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.customer_favorites
    ADD CONSTRAINT "customer_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5061 (class 2606 OID 47958)
-- Name: customer_profiles customer_profiles_favoriteCrustId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.customer_profiles
    ADD CONSTRAINT "customer_profiles_favoriteCrustId_fkey" FOREIGN KEY ("favoriteCrustId") REFERENCES public.pizza_crusts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5062 (class 2606 OID 47953)
-- Name: customer_profiles customer_profiles_favoritePizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.customer_profiles
    ADD CONSTRAINT "customer_profiles_favoritePizzaSizeId_fkey" FOREIGN KEY ("favoritePizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5063 (class 2606 OID 47948)
-- Name: customer_profiles customer_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.customer_profiles
    ADD CONSTRAINT "customer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5089 (class 2606 OID 48078)
-- Name: customization_groups customization_groups_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.customization_groups
    ADD CONSTRAINT "customization_groups_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.menu_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5090 (class 2606 OID 48083)
-- Name: customization_options customization_options_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.customization_options
    ADD CONSTRAINT "customization_options_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.customization_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5065 (class 2606 OID 47968)
-- Name: employee_profiles employee_profiles_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.employee_profiles
    ADD CONSTRAINT "employee_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5087 (class 2606 OID 48068)
-- Name: item_modifiers item_modifiers_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.item_modifiers
    ADD CONSTRAINT "item_modifiers_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5088 (class 2606 OID 48073)
-- Name: item_modifiers item_modifiers_modifierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.item_modifiers
    ADD CONSTRAINT "item_modifiers_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES public.modifiers(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5085 (class 2606 OID 48058)
-- Name: menu_categories menu_categories_parentCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.menu_categories
    ADD CONSTRAINT "menu_categories_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES public.menu_categories(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5091 (class 2606 OID 48088)
-- Name: menu_item_customizations menu_item_customizations_customizationGroupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.menu_item_customizations
    ADD CONSTRAINT "menu_item_customizations_customizationGroupId_fkey" FOREIGN KEY ("customizationGroupId") REFERENCES public.customization_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5092 (class 2606 OID 48093)
-- Name: menu_item_customizations menu_item_customizations_menuItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.menu_item_customizations
    ADD CONSTRAINT "menu_item_customizations_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5086 (class 2606 OID 48063)
-- Name: menu_items menu_items_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "menu_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.menu_categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5081 (class 2606 OID 48038)
-- Name: order_item_customizations order_item_customizations_customizationOptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_item_customizations
    ADD CONSTRAINT "order_item_customizations_customizationOptionId_fkey" FOREIGN KEY ("customizationOptionId") REFERENCES public.customization_options(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5082 (class 2606 OID 48043)
-- Name: order_item_customizations order_item_customizations_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_item_customizations
    ADD CONSTRAINT "order_item_customizations_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public.order_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5079 (class 2606 OID 48028)
-- Name: order_item_toppings order_item_toppings_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_item_toppings
    ADD CONSTRAINT "order_item_toppings_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public.order_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5080 (class 2606 OID 48033)
-- Name: order_item_toppings order_item_toppings_pizzaToppingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_item_toppings
    ADD CONSTRAINT "order_item_toppings_pizzaToppingId_fkey" FOREIGN KEY ("pizzaToppingId") REFERENCES public.pizza_toppings(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5072 (class 2606 OID 48003)
-- Name: order_items order_items_menuItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES public.menu_items(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5073 (class 2606 OID 48008)
-- Name: order_items order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5074 (class 2606 OID 48013)
-- Name: order_items order_items_pizzaCrustId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_pizzaCrustId_fkey" FOREIGN KEY ("pizzaCrustId") REFERENCES public.pizza_crusts(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5075 (class 2606 OID 48018)
-- Name: order_items order_items_pizzaSauceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_pizzaSauceId_fkey" FOREIGN KEY ("pizzaSauceId") REFERENCES public.pizza_sauces(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5076 (class 2606 OID 48023)
-- Name: order_items order_items_pizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5077 (class 2606 OID 48184)
-- Name: order_items order_items_specialtyCalzoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_specialtyCalzoneId_fkey" FOREIGN KEY ("specialtyCalzoneId") REFERENCES public.specialty_calzones(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5078 (class 2606 OID 48179)
-- Name: order_items order_items_specialtyPizzaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_specialtyPizzaId_fkey" FOREIGN KEY ("specialtyPizzaId") REFERENCES public.specialty_pizzas(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5071 (class 2606 OID 47998)
-- Name: orders orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 5083 (class 2606 OID 48048)
-- Name: price_snapshots price_snapshots_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.price_snapshots
    ADD CONSTRAINT "price_snapshots_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5084 (class 2606 OID 48053)
-- Name: refresh_tokens refresh_tokens_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5069 (class 2606 OID 47988)
-- Name: specialty_calzone_sizes specialty_calzone_sizes_pizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.specialty_calzone_sizes
    ADD CONSTRAINT "specialty_calzone_sizes_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5070 (class 2606 OID 47993)
-- Name: specialty_calzone_sizes specialty_calzone_sizes_specialtyCalzoneId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.specialty_calzone_sizes
    ADD CONSTRAINT "specialty_calzone_sizes_specialtyCalzoneId_fkey" FOREIGN KEY ("specialtyCalzoneId") REFERENCES public.specialty_calzones(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 5067 (class 2606 OID 47978)
-- Name: specialty_pizza_sizes specialty_pizza_sizes_pizzaSizeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.specialty_pizza_sizes
    ADD CONSTRAINT "specialty_pizza_sizes_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES public.pizza_sizes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 5068 (class 2606 OID 47983)
-- Name: specialty_pizza_sizes specialty_pizza_sizes_specialtyPizzaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: auy1jll
--

ALTER TABLE ONLY public.specialty_pizza_sizes
    ADD CONSTRAINT "specialty_pizza_sizes_specialtyPizzaId_fkey" FOREIGN KEY ("specialtyPizzaId") REFERENCES public.specialty_pizzas(id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-08-31 06:42:54

--
-- PostgreSQL database dump complete
--

