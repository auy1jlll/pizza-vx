-- Disable foreign key checks
SET session_replication_role = replica;

-- Table: app_settings
DROP TABLE IF EXISTS "app_settings" CASCADE;
CREATE TABLE "app_settings" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "type" USER-DEFINED NOT NULL DEFAULT 'STRING'::"SettingType",
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez7o5lt0003vknkjfru4c7i', 'emailFromName', 'Greenland Famous Pizza', 'STRING', '2025-08-31T08:49:23.298Z', '2025-08-31T08:49:23.298Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez7o5lu0004vknk87tbnc1d', 'emailReplyTo', '', 'STRING', '2025-08-31T08:49:23.299Z', '2025-08-31T08:49:23.299Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0e000rvkowkj2az45m', 'taxRate', '8.5', 'NUMBER', '2025-08-31T09:06:50.990Z', '2025-09-01T05:33:12.215Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez7o5lo0000vknkwdrxuglz', 'gmailUser', 'auy1jlll@gmail.com', 'STRING', '2025-08-31T08:49:23.292Z', '2025-08-31T11:50:23.378Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez7o5ls0002vknk9jpckgwa', 'emailServiceEnabled', 'true', 'BOOLEAN', '2025-08-31T08:49:23.296Z', '2025-08-31T08:50:34.554Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez7wd8j0000vk80i9ng2tu4', 'emailNotifications', 'true', 'BOOLEAN', '2025-08-31T08:55:46.435Z', '2025-08-31T08:56:06.092Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez7wsg70001vk4c5rcwn5tw', 'orderNotifications', 'true', 'BOOLEAN', '2025-08-31T08:56:06.151Z', '2025-08-31T08:56:06.151Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez7wsg80002vk4cxd4fymix', 'customerNotifications', 'true', 'BOOLEAN', '2025-08-31T08:56:06.153Z', '2025-08-31T08:56:06.153Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0e000svkowz2zu2je4', 'deliveryFee', '3.99', 'NUMBER', '2025-08-31T09:06:50.991Z', '2025-08-31T09:06:50.991Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0g000vvkowsuo0aof3', 'tipPercentages', '[15,18,20,25]', 'JSON', '2025-08-31T09:06:50.993Z', '2025-08-31T09:06:50.993Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0h000wvkow1xdz0sm3', 'defaultTipPercentage', '18', 'NUMBER', '2025-08-31T09:06:50.993Z', '2025-08-31T09:06:50.993Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0i000xvkowy7sevixe', 'allowPayAtPickup', 'true', 'BOOLEAN', '2025-08-31T09:06:50.994Z', '2025-08-31T09:06:50.994Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0i000yvkowyy1ml1hs', 'allowPayLater', 'false', 'BOOLEAN', '2025-08-31T09:06:50.995Z', '2025-08-31T09:06:50.995Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0j000zvkowjlzr4wbn', 'payLaterMinimumOrder', '25.00', 'NUMBER', '2025-08-31T09:06:50.996Z', '2025-08-31T09:06:50.996Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0k0010vkow5m3mraiu', 'intensityLightMultiplier', '0.8', 'NUMBER', '2025-08-31T09:06:50.996Z', '2025-08-31T09:06:50.996Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0k0011vkow1vpdf6r0', 'intensityRegularMultiplier', '1.0', 'NUMBER', '2025-08-31T09:06:50.997Z', '2025-08-31T09:06:50.997Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0l0012vkow3ho09fo5', 'intensityExtraMultiplier', '1.2', 'NUMBER', '2025-08-31T09:06:50.998Z', '2025-08-31T09:06:50.998Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0m0013vkow3tu34n8l', 'removalCreditPercentage', '10', 'NUMBER', '2025-08-31T09:06:50.998Z', '2025-08-31T09:06:50.998Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0n0014vkoww7sxyzxd', 'preparationTime', '20', 'NUMBER', '2025-08-31T09:06:50.999Z', '2025-08-31T09:06:50.999Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0n0015vkow7im1y94v', 'deliveryTimeBuffer', '10', 'NUMBER', '2025-08-31T09:06:51.000Z', '2025-08-31T09:06:51.000Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0o0016vkow14pehnhe', 'showDeliveryTime', 'true', 'BOOLEAN', '2025-08-31T09:06:51.000Z', '2025-08-31T09:06:51.000Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0p0017vkow96glgrlv', 'showPricingBreakdown', 'true', 'BOOLEAN', '2025-08-31T09:06:51.001Z', '2025-08-31T09:06:51.001Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0q0018vkowvr4ec8jl', 'allowRemovalCredits', 'true', 'BOOLEAN', '2025-08-31T09:06:51.002Z', '2025-08-31T09:06:51.002Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0r0019vkowpyzqgl1i', 'enableRewards', 'true', 'BOOLEAN', '2025-08-31T09:06:51.003Z', '2025-08-31T09:06:51.003Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0s001avkow0rkbjkjx', 'enableNotifications', 'true', 'BOOLEAN', '2025-08-31T09:06:51.004Z', '2025-08-31T09:06:51.004Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0t001bvkows2nap4mr', 'enableInventoryTracking', 'false', 'BOOLEAN', '2025-08-31T09:06:51.005Z', '2025-08-31T09:06:51.005Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am1d001cvkow9h7xap47', 'enableLoyaltyProgram', 'true', 'BOOLEAN', '2025-08-31T09:06:51.026Z', '2025-08-31T09:06:51.026Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am1v001dvkowfx6bdkuu', 'enableMultiLocation', 'false', 'BOOLEAN', '2025-08-31T09:06:51.043Z', '2025-08-31T09:06:51.043Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am1w001evkowf8fsg85u', 'enableAdvancedReporting', 'true', 'BOOLEAN', '2025-08-31T09:06:51.045Z', '2025-08-31T09:06:51.045Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am1y001fvkowmu2qyxl5', 'primaryColor', '#FF6B35', 'STRING', '2025-08-31T09:06:51.046Z', '2025-08-31T09:06:51.046Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am1z001gvkow1d28p7bs', 'secondaryColor', '#FFA500', 'STRING', '2025-08-31T09:06:51.048Z', '2025-08-31T09:06:51.048Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am21001hvkow8rcy5q4m', 'logoUrl', '/logo.png', 'STRING', '2025-08-31T09:06:51.049Z', '2025-08-31T09:06:51.049Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am22001ivkowtccanm4t', 'faviconUrl', '/favicon.ico', 'STRING', '2025-08-31T09:06:51.050Z', '2025-08-31T09:06:51.050Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am23001jvkowkw0j9fej', 'themeMode', 'light', 'STRING', '2025-08-31T09:06:51.052Z', '2025-08-31T09:06:51.052Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am25001kvkowgzrq75rb', 'brandFont', 'Inter', 'STRING', '2025-08-31T09:06:51.053Z', '2025-08-31T09:06:51.053Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am26001lvkowikllj9b6', 'headerBackgroundColor', '#1a1a1a', 'STRING', '2025-08-31T09:06:51.054Z', '2025-08-31T09:06:51.054Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am27001mvkownq7rarm8', 'accentColor', '#FF6B35', 'STRING', '2025-08-31T09:06:51.055Z', '2025-08-31T09:06:51.055Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am28001nvkow5t2u5e7p', 'customCSS', '', 'STRING', '2025-08-31T09:06:51.057Z', '2025-08-31T09:06:51.057Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am29001ovkow26m1ud9o', 'brand_colors', '{"primary":"#FF6B35","secondary":"#FFA500","accent":"#FF6B35"}', 'JSON', '2025-08-31T09:06:51.058Z', '2025-08-31T09:06:51.058Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2b001pvkowtxmvsrqj', 'smsNotifications', 'false', 'BOOLEAN', '2025-08-31T09:06:51.059Z', '2025-08-31T09:06:51.059Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2c001qvkow07893o4m', 'adminAlerts', 'true', 'BOOLEAN', '2025-08-31T09:06:51.060Z', '2025-08-31T09:06:51.060Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2d001rvkow1rabhvof', 'inventoryAlerts', 'true', 'BOOLEAN', '2025-08-31T09:06:51.061Z', '2025-08-31T09:06:51.061Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2e001svkow4ehl21tz', 'lowStockAlerts', 'true', 'BOOLEAN', '2025-08-31T09:06:51.062Z', '2025-08-31T09:06:51.062Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2f001tvkowp6v73k85', 'rateLimitWindowSeconds', '60', 'NUMBER', '2025-08-31T09:06:51.064Z', '2025-08-31T09:06:51.064Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8alzu0002vkowgaaufy7b', 'businessEmail', 'info@greenlandFamous.com', 'STRING', '2025-08-31T09:06:50.971Z', '2025-08-31T09:16:55.570Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez7o5lr0001vknk63jyojk3', 'gmailAppPassword', 'apjniqjmtqmjmnwf', 'STRING', '2025-08-31T08:49:23.295Z', '2025-08-31T11:50:23.384Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0g000uvkow47w8azfl', 'minimumOrder', '10.5', 'NUMBER', '2025-08-31T09:06:50.992Z', '2025-09-01T05:33:12.215Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0f000tvkowryn8rc4c', 'deliveryEnabled', 'false', 'BOOLEAN', '2025-08-31T09:06:50.991Z', '2025-09-01T05:33:12.215Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8alzw0004vkowjqqj6hgc', 'businessDescription', 'Authentic home recipe pizza and cuisine since 1985', 'STRING', '2025-08-31T09:06:50.972Z', '2025-09-01T05:33:54.431Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8alzt0001vkowwv955h2t', 'businessPhone', '(603) 501 0774', 'STRING', '2025-08-31T09:06:50.970Z', '2025-09-01T05:33:54.431Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8alzr0000vkowntbx1me2', 'businessName', 'Greenland Famous Pizza', 'STRING', '2025-08-31T09:06:50.968Z', '2025-09-01T05:44:00.345Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8alzx0005vkowwxj4fznt', 'mondayOpen', '10:30', 'STRING', '2025-08-31T09:06:50.973Z', '2025-09-01T06:29:41.757Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8alzy0006vkowd8ea11f9', 'mondayClose', '20:00', 'STRING', '2025-08-31T09:06:50.974Z', '2025-09-01T06:29:41.758Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8alzy0007vkow32q1g0a7', 'mondayClosed', 'false', 'BOOLEAN', '2025-08-31T09:06:50.975Z', '2025-09-01T06:29:41.760Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8alzz0008vkow7p5rssa8', 'tuesdayOpen', '10:30', 'STRING', '2025-08-31T09:06:50.976Z', '2025-09-01T06:29:41.761Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am000009vkow064o24b5', 'tuesdayClose', '20:00', 'STRING', '2025-08-31T09:06:50.977Z', '2025-09-01T06:29:41.762Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am01000avkowknsafahb', 'tuesdayClosed', 'false', 'BOOLEAN', '2025-08-31T09:06:50.977Z', '2025-09-01T06:29:41.765Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am02000bvkowcwg1a06z', 'wednesdayOpen', '10:30', 'STRING', '2025-08-31T09:06:50.978Z', '2025-09-01T06:29:41.766Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am02000cvkowsdcqcnpd', 'wednesdayClose', '20:00', 'STRING', '2025-08-31T09:06:50.979Z', '2025-09-01T06:29:41.768Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am03000dvkowk2v720nv', 'wednesdayClosed', 'false', 'BOOLEAN', '2025-08-31T09:06:50.980Z', '2025-09-01T06:29:41.770Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am04000evkowt049n51r', 'thursdayOpen', '10:30', 'STRING', '2025-08-31T09:06:50.980Z', '2025-09-01T06:29:41.771Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am05000fvkowr6j41swy', 'thursdayClose', '20:00', 'STRING', '2025-08-31T09:06:50.981Z', '2025-09-01T06:29:41.772Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am05000gvkowhcw9rhem', 'thursdayClosed', 'false', 'BOOLEAN', '2025-08-31T09:06:50.982Z', '2025-09-01T06:29:41.774Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am06000hvkow318xtrv0', 'fridayOpen', '10:30', 'STRING', '2025-08-31T09:06:50.982Z', '2025-09-01T06:29:41.775Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am07000ivkow6crzitwk', 'fridayClose', '20:00', 'STRING', '2025-08-31T09:06:50.983Z', '2025-09-01T06:29:41.776Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am07000jvkow1azqg1rd', 'fridayClosed', 'false', 'BOOLEAN', '2025-08-31T09:06:50.984Z', '2025-09-01T06:29:41.777Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am08000kvkowwzlxwzsm', 'saturdayOpen', '10:30', 'STRING', '2025-08-31T09:06:50.985Z', '2025-09-01T06:29:41.778Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am09000lvkownykqt7fs', 'saturdayClose', '20:00', 'STRING', '2025-08-31T09:06:50.986Z', '2025-09-01T06:29:41.779Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0a000mvkowrzkhvs6w', 'saturdayClosed', 'false', 'BOOLEAN', '2025-08-31T09:06:50.986Z', '2025-09-01T06:29:41.781Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0b000nvkowc782cnox', 'sundayOpen', '10:30', 'STRING', '2025-08-31T09:06:50.987Z', '2025-09-01T06:29:41.783Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0b000ovkowy5t3qwxx', 'sundayClose', '20:00', 'STRING', '2025-08-31T09:06:50.988Z', '2025-09-01T06:29:41.784Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0c000pvkow6n3kzzgh', 'sundayClosed', 'false', 'BOOLEAN', '2025-08-31T09:06:50.989Z', '2025-09-01T06:29:41.786Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8alzv0003vkow7vlvrhox', 'businessAddress', '381 Portsmouth ave, Greenland, NH 03849', 'STRING', '2025-08-31T09:06:50.971Z', '2025-09-02T07:08:28.828Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am0d000qvkowk457iy4c', 'operating_hours', '{"monday":"10:30-20:00","tuesday":"10:30-20:00","wednesday":"10:30-20:00","thursday":"10:30-20:00","friday":"10:30-20:00","saturday":"10:30-20:00","sunday":"10:30-20:00"}', 'JSON', '2025-08-31T09:06:50.989Z', '2025-09-01T06:29:41.751Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2g001uvkow2kqhq0li', 'rateLimitMaxRequests', '100', 'NUMBER', '2025-08-31T09:06:51.065Z', '2025-08-31T09:06:51.065Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2i001vvkowmuajol7j', 'adminRateLimitWindowSeconds', '60', 'NUMBER', '2025-08-31T09:06:51.066Z', '2025-08-31T09:06:51.066Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2j001wvkow3rhrj5vo', 'adminRateLimitMaxRequests', '500', 'NUMBER', '2025-08-31T09:06:51.067Z', '2025-08-31T09:06:51.067Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2k001xvkowina0m1z0', 'kitchenPollingIntervalSeconds', '30', 'NUMBER', '2025-08-31T09:06:51.068Z', '2025-08-31T09:06:51.068Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2m001zvkowwciam7r8', 'facebookUrl', 'https://facebook.com/greenlandpizza', 'STRING', '2025-08-31T09:06:51.070Z', '2025-08-31T09:06:51.070Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2n0020vkow5sv53e2e', 'instagramUrl', 'https://instagram.com/greenlandpizza', 'STRING', '2025-08-31T09:06:51.071Z', '2025-08-31T09:06:51.071Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2o0021vkow521a0moc', 'twitterUrl', 'https://twitter.com/greenlandpizza', 'STRING', '2025-08-31T09:06:51.072Z', '2025-08-31T09:06:51.072Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2p0022vkowglkybzsw', 'googleMapsUrl', '', 'STRING', '2025-08-31T09:06:51.073Z', '2025-08-31T09:06:51.073Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2q0024vkow1wgxlm5n', 'cateringPhone', '(603) 555-0123', 'STRING', '2025-08-31T09:06:51.075Z', '2025-08-31T09:06:51.075Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2r0025vkowdavdh7a6', 'managerOnDuty', 'John Smith', 'STRING', '2025-08-31T09:06:51.076Z', '2025-08-31T09:06:51.076Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2t0027vkowf1yx6jx4', 'showPrices', 'true', 'BOOLEAN', '2025-08-31T09:06:51.077Z', '2025-08-31T09:06:51.077Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2u0028vkowfsmlfyc3', 'showCalories', 'false', 'BOOLEAN', '2025-08-31T09:06:51.078Z', '2025-08-31T09:06:51.078Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2v0029vkowx95uehky', 'showAllergens', 'true', 'BOOLEAN', '2025-08-31T09:06:51.079Z', '2025-08-31T09:06:51.079Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2w002avkow11fl2wfl', 'enableOnlineOrdering', 'true', 'BOOLEAN', '2025-08-31T09:06:51.081Z', '2025-08-31T09:06:51.081Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2y002bvkowwqlr2opd', 'enableReservations', 'true', 'BOOLEAN', '2025-08-31T09:06:51.082Z', '2025-08-31T09:06:51.082Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2z002cvkowal97cwxg', 'enableCatering', 'true', 'BOOLEAN', '2025-08-31T09:06:51.083Z', '2025-08-31T09:06:51.083Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am30002dvkowf0w595ab', 'maxOrderAdvanceDays', '7', 'NUMBER', '2025-08-31T09:06:51.084Z', '2025-08-31T09:06:51.084Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am31002evkowuv3dfjnn', 'minOrderAdvanceHours', '1', 'NUMBER', '2025-08-31T09:06:51.085Z', '2025-08-31T09:06:51.085Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am32002fvkownsyqvknm', 'acceptCash', 'true', 'BOOLEAN', '2025-08-31T09:06:51.086Z', '2025-08-31T09:06:51.086Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am34002hvkowvhdk2px1', 'acceptDebitCard', 'true', 'BOOLEAN', '2025-08-31T09:06:51.088Z', '2025-08-31T09:06:51.088Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am35002jvkowbj5i5lfd', 'squarePaymentEnabled', 'false', 'BOOLEAN', '2025-08-31T09:06:51.090Z', '2025-08-31T09:06:51.090Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am36002kvkowy1adg0j8', 'stripePaymentEnabled', 'false', 'BOOLEAN', '2025-08-31T09:06:51.091Z', '2025-08-31T09:06:51.091Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am37002lvkow8or38ywx', 'paypalEnabled', 'false', 'BOOLEAN', '2025-08-31T09:06:51.092Z', '2025-08-31T09:06:51.092Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am38002mvkowe5zea43b', 'deliveryRadius', '10', 'NUMBER', '2025-08-31T09:06:51.092Z', '2025-08-31T09:06:51.092Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am39002nvkowg65c6dqv', 'freeDeliveryThreshold', '25.00', 'NUMBER', '2025-08-31T09:06:51.093Z', '2025-08-31T09:06:51.093Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3a002ovkow3ssy6c6q', 'deliveryDrivers', '3', 'NUMBER', '2025-08-31T09:06:51.094Z', '2025-08-31T09:06:51.094Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3b002pvkowzkbjcrqt', 'averageDeliveryTime', '30', 'NUMBER', '2025-08-31T09:06:51.095Z', '2025-08-31T09:06:51.095Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3c002qvkowvwlkngcm', 'deliveryInstructions', 'Please ring doorbell and leave at door if no answer', 'STRING', '2025-08-31T09:06:51.096Z', '2025-08-31T09:06:51.096Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3d002rvkowmw6g2wj4', 'kitchenStations', '3', 'NUMBER', '2025-08-31T09:06:51.098Z', '2025-08-31T09:06:51.098Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3e002svkowi2pahtjp', 'maxConcurrentOrders', '10', 'NUMBER', '2025-08-31T09:06:51.099Z', '2025-08-31T09:06:51.099Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3f002tvkowyo4v5uxk', 'orderAlertsEnabled', 'true', 'BOOLEAN', '2025-08-31T09:06:51.100Z', '2025-08-31T09:06:51.100Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3g002uvkowatblw6nw', 'printerEnabled', 'true', 'BOOLEAN', '2025-08-31T09:06:51.101Z', '2025-08-31T09:06:51.101Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3k002yvkowbrf64bg7', 'feedbackEnabled', 'true', 'BOOLEAN', '2025-08-31T09:06:51.104Z', '2025-08-31T09:06:51.104Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3k002zvkow68wi2raj', 'surveyEnabled', 'true', 'BOOLEAN', '2025-08-31T09:06:51.105Z', '2025-08-31T09:06:51.105Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3l0030vkow435v0mw5', 'loyaltyPointsPerDollar', '1', 'NUMBER', '2025-08-31T09:06:51.106Z', '2025-08-31T09:06:51.106Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3m0031vkow70r88fsk', 'loyaltyPointsValue', '0.01', 'NUMBER', '2025-08-31T09:06:51.107Z', '2025-08-31T09:06:51.107Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3n0032vkowqz63zqxq', 'googleAnalyticsId', '', 'STRING', '2025-08-31T09:06:51.107Z', '2025-08-31T09:06:51.107Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3o0033vkowj7lvfgz9', 'facebookPixelId', '', 'STRING', '2025-08-31T09:06:51.108Z', '2025-08-31T09:06:51.108Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3p0035vkowqqwfl8jj', 'enableCustomerTracking', 'true', 'BOOLEAN', '2025-08-31T09:06:51.110Z', '2025-08-31T09:06:51.110Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3q0036vkowsteqzpm2', 'reportRetentionDays', '365', 'NUMBER', '2025-08-31T09:06:51.111Z', '2025-08-31T09:06:51.111Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3r0037vkowbubk8guj', 'sessionTimeoutMinutes', '60', 'NUMBER', '2025-08-31T09:06:51.111Z', '2025-08-31T09:06:51.111Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3s0038vkows82e6d5b', 'maxLoginAttempts', '5', 'NUMBER', '2025-08-31T09:06:51.112Z', '2025-08-31T09:06:51.112Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3t0039vkowhod4vpe4', 'passwordMinLength', '8', 'NUMBER', '2025-08-31T09:06:51.113Z', '2025-08-31T09:06:51.113Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3u003avkowrf5lka5a', 'requireSpecialCharacters', 'true', 'BOOLEAN', '2025-08-31T09:06:51.115Z', '2025-08-31T09:06:51.115Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3v003bvkown1kvu81b', 'twoFactorEnabled', 'false', 'BOOLEAN', '2025-08-31T09:06:51.115Z', '2025-08-31T09:06:51.115Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3x003dvkownaks6ziv', 'backupFrequency', 'daily', 'STRING', '2025-08-31T09:06:51.117Z', '2025-08-31T09:06:51.117Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3y003evkow3h30kz41', 'backupRetentionDays', '30', 'NUMBER', '2025-08-31T09:06:51.118Z', '2025-08-31T09:06:51.118Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3z003fvkow6x07yj48', 'maintenanceMode', 'false', 'BOOLEAN', '2025-08-31T09:06:51.119Z', '2025-08-31T09:06:51.119Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3z003gvkowp1mpbe48', 'maintenanceMessage', 'We are currently performing maintenance. Please check back soon.', 'STRING', '2025-08-31T09:06:51.120Z', '2025-08-31T09:06:51.120Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am33002gvkowpkygvybp', 'acceptCreditCard', 'false', 'BOOLEAN', '2025-08-31T09:06:51.087Z', '2025-08-31T09:16:05.628Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am34002ivkow623t2nyn', 'acceptGiftCards', 'false', 'BOOLEAN', '2025-08-31T09:06:51.089Z', '2025-08-31T09:16:05.628Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3h002vvkowek8t70d1', 'autoPrintOrders', 'false', 'BOOLEAN', '2025-08-31T09:06:51.101Z', '2025-08-31T09:16:05.628Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3w003cvkowv86clmi0', 'autoBackupEnabled', 'false', 'BOOLEAN', '2025-08-31T09:06:51.116Z', '2025-08-31T09:16:05.628Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3i002wvkownt0pfuji', 'customerServiceEmail', 'support@greenlandFamous.com', 'STRING', '2025-08-31T09:06:51.102Z', '2025-08-31T09:16:05.628Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3p0034vkowftwweh23', 'enableOrderTracking', 'false', 'BOOLEAN', '2025-08-31T09:06:51.109Z', '2025-08-31T09:16:05.628Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2l001yvkowkbh3giva', 'websiteUrl', 'https://greenlandFamous.com', 'STRING', '2025-08-31T09:06:51.069Z', '2025-08-31T09:16:05.629Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am3j002xvkowv7e5txuh', 'complaintEmail', 'manager@greenlandfamous.com', 'STRING', '2025-08-31T09:06:51.103Z', '2025-08-31T09:16:05.628Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmf0ghlr60000vkqk4nkodn74', 'business_name', 'Greenland Famous Pizza', 'STRING', '2025-09-01T05:44:00.354Z', '2025-09-01T05:44:00.354Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2p0023vkowwohlyf3i', 'reservationPhone', '(603) 501-074', 'STRING', '2025-08-31T09:06:51.074Z', '2025-09-02T06:21:59.613Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmf1wge670000vkf84ad63i1u', 'appLogoUrl', '/uploads/logo-1756779650899.png', 'STRING', '2025-09-02T05:58:43.902Z', '2025-09-02T06:21:59.613Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmez8am2s0026vkowdpd3bh2v', 'storeManager', 'Big AL', 'STRING', '2025-08-31T09:06:51.077Z', '2025-09-02T06:21:59.614Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmf1xe4p00001vklgietyly09', 'app_tagline', 'Fresh • Authentic • Delicious', 'STRING', '2025-09-02T06:24:57.924Z', '2025-09-02T06:24:57.924Z');
INSERT INTO "app_settings" ("id", "key", "value", "type", "createdAt", "updatedAt") VALUES ('cmf1xe4ou0000vklgte5k8rbf', 'app_name', 'Greenland Famous', 'STRING', '2025-09-02T06:24:57.918Z', '2025-09-02T07:11:55.038Z');

-- Table: cart_item_customizations
DROP TABLE IF EXISTS "cart_item_customizations" CASCADE;
CREATE TABLE "cart_item_customizations" (
  "id" TEXT NOT NULL,
  "cartItemId" TEXT NOT NULL,
  "customizationOptionId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "price" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: cart_item_pizza_toppings
DROP TABLE IF EXISTS "cart_item_pizza_toppings" CASCADE;
CREATE TABLE "cart_item_pizza_toppings" (
  "id" TEXT NOT NULL,
  "cartItemId" TEXT NOT NULL,
  "pizzaToppingId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "section" TEXT NOT NULL DEFAULT 'WHOLE'::text,
  "intensity" TEXT NOT NULL DEFAULT 'REGULAR'::text,
  "price" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: cart_items
DROP TABLE IF EXISTS "cart_items" CASCADE;
CREATE TABLE "cart_items" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT,
  "userId" TEXT,
  "pizzaSizeId" TEXT,
  "pizzaCrustId" TEXT,
  "pizzaSauceId" TEXT,
  "menuItemId" TEXT,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "basePrice" DOUBLE PRECISION NOT NULL,
  "totalPrice" DOUBLE PRECISION NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  "itemType" USER-DEFINED NOT NULL DEFAULT 'PIZZA'::"CartItemType",
  "specialtyCalzoneId" TEXT,
  "specialtyPizzaId" TEXT
);

-- Table: customer_addresses
DROP TABLE IF EXISTS "customer_addresses" CASCADE;
CREATE TABLE "customer_addresses" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "addressLine1" TEXT NOT NULL,
  "addressLine2" TEXT,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "zipCode" TEXT NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'US'::text,
  "deliveryInstructions" TEXT,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Table: customer_favorites
DROP TABLE IF EXISTS "customer_favorites" CASCADE;
CREATE TABLE "customer_favorites" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "favoriteName" TEXT NOT NULL,
  "itemType" TEXT NOT NULL,
  "itemData" JSONB NOT NULL,
  "orderCount" INTEGER NOT NULL DEFAULT 0,
  "lastOrdered" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Table: customer_profiles
DROP TABLE IF EXISTS "customer_profiles" CASCADE;
CREATE TABLE "customer_profiles" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "firstName" TEXT,
  "lastName" TEXT,
  "dateOfBirth" TIMESTAMP,
  "phone" TEXT,
  "avatarUrl" TEXT,
  "dietaryPreferences" ARRAY,
  "favoritePizzaSizeId" TEXT,
  "favoriteCrustId" TEXT,
  "defaultOrderType" USER-DEFINED NOT NULL DEFAULT 'PICKUP'::"OrderType",
  "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
  "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
  "totalOrders" INTEGER NOT NULL DEFAULT 0,
  "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
  "lastOrderDate" TIMESTAMP,
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Table: customization_groups
DROP TABLE IF EXISTS "customization_groups" CASCADE;
CREATE TABLE "customization_groups" (
  "id" TEXT NOT NULL,
  "categoryId" TEXT,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type" USER-DEFINED NOT NULL,
  "isRequired" BOOLEAN NOT NULL DEFAULT false,
  "minSelections" INTEGER NOT NULL DEFAULT 0,
  "maxSelections" INTEGER,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmez4ylw70003vkvowz7y4tsn', 'cmez4xl780003vkwcly8nts4q', 'Dressing', 'Choose your preferred dressing', 'SINGLE_SELECT', TRUE, 1, 1, 1, TRUE, '2025-08-31T07:33:32.069Z', '2025-08-31T07:33:32.069Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmez4ylwa0005vkvoe8fpfq94', 'cmez4xl780003vkwcly8nts4q', 'Add-ons', 'Extra toppings and proteins', 'MULTI_SELECT', FALSE, 0, 5, 2, TRUE, '2025-08-31T07:33:32.069Z', '2025-08-31T07:33:32.069Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf06ou8b0000vkq4cyng3byo', NULL, 'Bread Type', 'Select your bread', 'SINGLE_SELECT', TRUE, 1, 1, 1, TRUE, '2025-09-01T01:09:41.772Z', '2025-09-01T01:09:41.772Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf07bxj10000vkv8ziod1skk', NULL, 'Bread Type - Large Only', 'Select your bread (Large sizes only)', 'SINGLE_SELECT', TRUE, 1, 1, 1, TRUE, '2025-09-01T01:27:39.133Z', '2025-09-01T01:27:39.133Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf08pvb50000vkz04t32pcxq', NULL, 'Condiments', 'Choose your condiments', 'MULTI_SELECT', FALSE, 0, NULL, 2, TRUE, '2025-09-01T02:06:29.058Z', '2025-09-01T02:06:29.058Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf08pvbl000dvkz0ti867vpd', NULL, 'Add Cheese', 'Add cheese for $0.75', 'MULTI_SELECT', FALSE, 0, NULL, 3, TRUE, '2025-09-01T02:06:29.073Z', '2025-09-01T02:06:29.073Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf09u7jm0000vkic0gt7k9ax', NULL, 'Cold Sub Toppings', 'Fresh vegetables and toppings for cold subs', 'MULTI_SELECT', FALSE, 0, 5, 10, TRUE, '2025-09-01T02:37:51.154Z', '2025-09-01T02:37:51.154Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf0a0tg30000vkhsnwdbi0nm', NULL, 'Hot Sub Toppings', 'Grilled and fresh toppings for hot subs', 'MULTI_SELECT', FALSE, 0, 5, 10, TRUE, '2025-09-01T02:42:59.475Z', '2025-09-01T02:42:59.475Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf0dooqi0005vkbcaetve5zt', NULL, 'Side Choice', 'Choose your side', 'SINGLE_SELECT', TRUE, 0, 1, 2, TRUE, '2025-09-01T04:25:31.962Z', '2025-09-01T04:25:31.962Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf0doopy0000vkbcb6citd6a', NULL, 'Fries and Onion Rings', 'Choose your fries option', 'SINGLE_SELECT', TRUE, 0, 1, 1, TRUE, '2025-09-01T04:25:31.942Z', '2025-09-01T04:29:57.541Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf0klk1c0000vki0gy432pcp', NULL, 'Premium Toppings', NULL, 'MULTI_SELECT', FALSE, 0, NULL, 3, TRUE, '2025-09-01T07:39:03.216Z', '2025-09-01T07:39:03.216Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf0kymvt000svk5g00zjcfdl', NULL, 'Size', NULL, 'SINGLE_SELECT', TRUE, 1, 1, 1, TRUE, '2025-09-01T07:49:13.434Z', '2025-09-01T07:49:13.434Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf0l31z80000vk0s10ywj3zp', NULL, 'Choose Your Side', NULL, 'SINGLE_SELECT', TRUE, 1, 1, 1, TRUE, '2025-09-01T07:52:39.620Z', '2025-09-01T07:52:39.620Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf0lfe6w0001vkqgiubwi9uz', 'cmez5bueu0001vkvsuragc8gi', 'Seafood Roll Sides', 'Choose your side for the seafood roll', 'SINGLE_SELECT', TRUE, 0, NULL, 0, TRUE, '2025-09-01T08:02:15.321Z', '2025-09-01T08:02:15.321Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmez4ylus0001vkvoy8fe9hdo', NULL, 'Toppings', 'Choose your pizza toppings', 'MULTI_SELECT', FALSE, 0, 10, 1, TRUE, '2025-08-31T07:33:32.069Z', '2025-08-31T07:33:32.069Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf26g4mw002pvkq03xf5r2t1', 'cmez4xl780003vkwcly8nts4q', 'Build your Salad', 'Select the salad bed', 'SINGLE_SELECT', TRUE, 0, 1, 0, TRUE, '2025-09-02T10:38:27.705Z', '2025-09-02T10:38:27.705Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf26thyi002xvkq01n46mw31', 'cmez4xl780003vkwcly8nts4q', 'Protein Build your Salad', 'Select your Protein ', 'MULTI_SELECT', TRUE, 0, 4, 3, TRUE, '2025-09-02T10:48:51.498Z', '2025-09-02T11:33:12.097Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf28n7mi003yvkq0k99uuzyp', NULL, 'Sea Food condiments ', '', 'MULTI_SELECT', FALSE, 0, 4, 0, TRUE, '2025-09-02T11:39:57.402Z', '2025-09-02T11:39:57.402Z');
INSERT INTO "customization_groups" ("id", "categoryId", "name", "description", "type", "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") VALUES ('cmf2al5u70002vka4wyhqmvaq', 'cmez4xl780003vkwcly8nts4q', 'chef salad', '', 'SINGLE_SELECT', FALSE, 0, 1, 1, TRUE, '2025-09-02T12:34:21.007Z', '2025-09-02T12:34:21.007Z');

-- Table: customization_options
DROP TABLE IF EXISTS "customization_options" CASCADE;
CREATE TABLE "customization_options" (
  "id" TEXT NOT NULL,
  "groupId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "priceModifier" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "priceType" USER-DEFINED NOT NULL DEFAULT 'FLAT'::"PriceType",
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "maxQuantity" INTEGER,
  "nutritionInfo" TEXT,
  "allergens" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmez4ylwn000avkvoem5xnd9y', 'cmez4ylw70003vkvowz7y4tsn', 'Ranch', 'Creamy ranch dressing', 0, 'FLAT', TRUE, TRUE, 1, NULL, NULL, NULL, '2025-08-31T07:33:32.135Z', '2025-08-31T07:33:32.135Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmez4ylwn000bvkvobo7zjy6m', 'cmez4ylw70003vkvowz7y4tsn', 'Caesar', 'Tangy Caesar dressing', 0, 'FLAT', FALSE, TRUE, 2, NULL, NULL, NULL, '2025-08-31T07:33:32.135Z', '2025-08-31T07:33:32.135Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf09u7k3000gvkicqq2y4tv1', 'cmf09u7jm0000vkic0gt7k9ax', 'Cucumbers', 'Fresh cucumbers for your sub', 0, 'FLAT', FALSE, TRUE, 8, 3, NULL, NULL, '2025-09-01T02:37:51.172Z', '2025-09-01T02:52:09.123Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf09u7k5000ivkic4pk85wxs', 'cmf09u7jm0000vkic0gt7k9ax', 'Fresh Mushrooms', 'Fresh fresh mushrooms for your sub', 0, 'FLAT', FALSE, TRUE, 9, 3, NULL, NULL, '2025-09-01T02:37:51.173Z', '2025-09-01T02:52:09.129Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf09u7k6000kvkic0llcwu9q', 'cmf09u7jm0000vkic0gt7k9ax', 'Green Peppers', 'Fresh green peppers for your sub', 0, 'FLAT', FALSE, TRUE, 10, 3, NULL, NULL, '2025-09-01T02:37:51.175Z', '2025-09-01T02:52:09.130Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf09u7k8000mvkicokx89ynd', 'cmf09u7jm0000vkic0gt7k9ax', 'Red Onions', 'Fresh red onions for your sub', 0, 'FLAT', FALSE, TRUE, 11, 3, NULL, NULL, '2025-09-01T02:37:51.176Z', '2025-09-01T02:52:09.131Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf09u7ka000ovkicff5wdz2m', 'cmf09u7jm0000vkic0gt7k9ax', 'Jalapeños', 'Fresh jalapeños for your sub', 0, 'FLAT', FALSE, TRUE, 12, 3, NULL, NULL, '2025-09-01T02:37:51.178Z', '2025-09-01T02:52:09.132Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf09u7jr0002vkicqbtrp0we', 'cmf09u7jm0000vkic0gt7k9ax', 'Lettuce', 'Fresh lettuce for your sub', 0, 'FLAT', FALSE, TRUE, 1, 3, NULL, NULL, '2025-09-01T02:37:51.159Z', '2025-09-01T02:52:09.134Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0a0tgc0006vkhsyfb3pgu4', 'cmf0a0tg30000vkhsnwdbi0nm', 'Grilled Bell Peppers', 'grilled bell peppers for your hot sub', 0, 'FLAT', FALSE, TRUE, 3, 3, NULL, NULL, '2025-09-01T02:42:59.484Z', '2025-09-01T02:52:09.143Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0a0tgd0008vkhssaorp2x4', 'cmf0a0tg30000vkhsnwdbi0nm', 'Lettuce', 'lettuce for your hot sub', 0, 'FLAT', FALSE, TRUE, 4, 3, NULL, NULL, '2025-09-01T02:42:59.486Z', '2025-09-01T02:52:09.144Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0a0tgf000avkhs7tr5wdkk', 'cmf0a0tg30000vkhsnwdbi0nm', 'Tomatoes', 'tomatoes for your hot sub', 0, 'FLAT', FALSE, TRUE, 5, 3, NULL, NULL, '2025-09-01T02:42:59.487Z', '2025-09-01T02:52:09.145Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0a0tgh000cvkhsakb48jl5', 'cmf0a0tg30000vkhsnwdbi0nm', 'Fresh Onions', 'fresh onions for your hot sub', 0, 'FLAT', FALSE, TRUE, 6, 3, NULL, NULL, '2025-09-01T02:42:59.489Z', '2025-09-01T02:52:09.146Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0a0tgi000evkhs2xjdf2xx', 'cmf0a0tg30000vkhsnwdbi0nm', 'Jalapeños', 'jalapeños for your hot sub', 0, 'FLAT', FALSE, TRUE, 7, 3, NULL, NULL, '2025-09-01T02:42:59.491Z', '2025-09-01T02:52:09.147Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0dooqj0007vkbcz8vw554e', 'cmf0dooqi0005vkbcaetve5zt', 'Coleslaw', 'Fresh coleslaw', 0, 'FLAT', TRUE, TRUE, 1, NULL, NULL, NULL, '2025-09-01T04:25:31.964Z', '2025-09-01T04:25:31.964Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0dooql0009vkbcrmhfopxt', 'cmf0dooqi0005vkbcaetve5zt', 'Pasta Salad', 'Homemade pasta salad', 0, 'FLAT', FALSE, TRUE, 2, NULL, NULL, NULL, '2025-09-01T04:25:31.966Z', '2025-09-01T04:25:31.966Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0dudnt0003vkjwclyl8g2k', 'cmf0doopy0000vkbcb6citd6a', 'All Fries', 'French fries only', 0, 'FLAT', FALSE, TRUE, 2, NULL, NULL, NULL, '2025-09-01T04:29:57.546Z', '2025-09-01T04:29:57.546Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0dudnv0005vkjw4aa3lm0g', 'cmf0doopy0000vkbcb6citd6a', 'All Onion Rings', 'Onion rings only', 0, 'FLAT', FALSE, TRUE, 3, NULL, NULL, NULL, '2025-09-01T04:29:57.547Z', '2025-09-01T04:29:57.547Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0klk1j0002vki0navxncgu', 'cmf0klk1c0000vki0gy432pcp', 'Bacon', NULL, 2, 'FLAT', FALSE, TRUE, 1, NULL, NULL, NULL, '2025-09-01T07:39:03.224Z', '2025-09-01T07:39:03.224Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0klk1p0004vki0pofd29vg', 'cmf0klk1c0000vki0gy432pcp', 'Salami', NULL, 2, 'FLAT', FALSE, TRUE, 2, NULL, NULL, NULL, '2025-09-01T07:39:03.229Z', '2025-09-01T07:39:03.229Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0klk1q0006vki0ecxlwjzy', 'cmf0klk1c0000vki0gy432pcp', 'Avocado', NULL, 2, 'FLAT', FALSE, TRUE, 3, NULL, NULL, NULL, '2025-09-01T07:39:03.231Z', '2025-09-01T07:39:03.231Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0klk1t0008vki0uppynuey', 'cmf0klk1c0000vki0gy432pcp', 'Extra Meat', NULL, 4, 'FLAT', FALSE, TRUE, 4, NULL, NULL, NULL, '2025-09-01T07:39:03.233Z', '2025-09-01T07:39:03.233Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0kymvu000uvk5ghcgju24v', 'cmf0kymvt000svk5g00zjcfdl', 'Small', NULL, 0, 'FLAT', TRUE, TRUE, 1, NULL, NULL, NULL, '2025-09-01T07:49:13.435Z', '2025-09-01T07:49:13.435Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0kymvw000wvk5gwbw1ndjz', 'cmf0kymvt000svk5g00zjcfdl', 'Large', NULL, 3, 'FLAT', FALSE, TRUE, 2, NULL, NULL, NULL, '2025-09-01T07:49:13.436Z', '2025-09-01T07:49:13.436Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0l31zb0002vk0shzvlil4v', 'cmf0l31z80000vk0s10ywj3zp', 'French Fries', NULL, 0, 'FLAT', TRUE, TRUE, 1, NULL, NULL, NULL, '2025-09-01T07:52:39.623Z', '2025-09-01T07:52:39.623Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0l31zf0004vk0syluylhsb', 'cmf0l31z80000vk0s10ywj3zp', 'Onion Rings', NULL, 0, 'FLAT', FALSE, TRUE, 2, NULL, NULL, NULL, '2025-09-01T07:52:39.628Z', '2025-09-01T07:52:39.628Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0lfe6w0002vkqgp8xrtwbi', 'cmf0lfe6w0001vkqgiubwi9uz', 'French Fries', 'Crispy golden french fries', 0, 'FLAT', TRUE, TRUE, 1, NULL, NULL, NULL, '2025-09-01T08:02:15.321Z', '2025-09-01T08:02:15.321Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0lfe6w0003vkqg4z175z2i', 'cmf0lfe6w0001vkqgiubwi9uz', 'Onion Rings', 'Crispy battered onion rings', 0, 'FLAT', FALSE, TRUE, 2, NULL, NULL, NULL, '2025-09-01T08:02:15.321Z', '2025-09-01T08:02:15.321Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf26lne3002tvkq0c2zngqdv', 'cmf26g4mw002pvkq03xf5r2t1', 'Iceberg Lettuce ', 'All Iceberg  Lettuce', 0, 'FLAT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T10:42:45.291Z', '2025-09-02T10:42:45.291Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmez4ylwn000fvkvohplrherr', 'cmez4ylw70003vkvowz7y4tsn', 'Italian', 'Classic Italian dressing', 0, 'FLAT', FALSE, TRUE, 3, NULL, NULL, NULL, '2025-08-31T07:33:32.135Z', '2025-08-31T07:33:32.135Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmez4ylwn000evkvobelyorqq', 'cmez4ylw70003vkvowz7y4tsn', 'Balsamic Vinaigrette', 'Sweet and tangy balsamic dressing', 0, 'FLAT', FALSE, TRUE, 4, NULL, NULL, NULL, '2025-08-31T07:33:32.135Z', '2025-08-31T07:33:32.135Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmez4ylyi000hvkvobyftgnx5', 'cmez4ylwa0005vkvoe8fpfq94', 'Feta Cheese', 'Crumbled feta cheese', 1.99, 'FLAT', FALSE, TRUE, 2, NULL, NULL, NULL, '2025-08-31T07:33:32.135Z', '2025-08-31T07:33:32.135Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmez4ylyt000nvkvoebyzpq2w', 'cmez4ylwa0005vkvoe8fpfq94', 'Grilled Chicken', 'Tender grilled chicken breast', 4.99, 'FLAT', FALSE, TRUE, 1, NULL, NULL, NULL, '2025-08-31T07:33:32.135Z', '2025-08-31T07:33:32.135Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmez4ylyt000lvkvobpaa1h4o', 'cmez4ylwa0005vkvoe8fpfq94', 'Avocado', 'Fresh avocado slices', 2.49, 'FLAT', FALSE, TRUE, 3, NULL, NULL, NULL, '2025-08-31T07:33:32.136Z', '2025-08-31T07:33:32.136Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmez4ylyu000pvkvouuz9ap6r', 'cmez4ylus0001vkvoy8fe9hdo', 'Mushrooms', 'Fresh sliced mushrooms', 1.99, 'FLAT', FALSE, TRUE, 2, NULL, NULL, NULL, '2025-08-31T07:33:32.135Z', '2025-08-31T07:33:32.135Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmez4ylyy000tvkvo86xfgohf', 'cmez4ylus0001vkvoy8fe9hdo', 'Green Peppers', 'Crisp green bell peppers', 1.99, 'FLAT', FALSE, TRUE, 3, NULL, NULL, NULL, '2025-08-31T07:33:32.135Z', '2025-08-31T07:33:32.135Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmez4ylyy000vvkvow9wu95oy', 'cmez4ylus0001vkvoy8fe9hdo', 'Pepperoni', 'Classic pepperoni slices', 2.49, 'FLAT', FALSE, TRUE, 1, NULL, NULL, NULL, '2025-08-31T07:33:32.136Z', '2025-08-31T07:33:32.136Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmez4ylyz000xvkvo3eaxqke7', 'cmez4ylus0001vkvoy8fe9hdo', 'Extra Cheese', 'Additional mozzarella cheese', 2.49, 'FLAT', FALSE, TRUE, 4, NULL, NULL, NULL, '2025-08-31T07:33:32.136Z', '2025-08-31T07:33:32.136Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf06ou8e0002vkq477o75rr7', 'cmf06ou8b0000vkq4cyng3byo', 'Small Sub Roll', 'Regular small sub roll', 0, 'FLAT', TRUE, TRUE, 1, 1, NULL, NULL, '2025-09-01T01:09:41.775Z', '2025-09-01T01:09:41.775Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf06ou8j0004vkq4424ax940', 'cmf06ou8b0000vkq4cyng3byo', 'Large Sub Roll', 'Large sub roll', 1, 'FLAT', FALSE, TRUE, 2, 1, NULL, NULL, '2025-09-01T01:09:41.779Z', '2025-09-01T01:09:41.779Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf06ou8k0006vkq4ad0nom4b', 'cmf06ou8b0000vkq4cyng3byo', 'Spinach Wrap', 'Fresh spinach wrap', 1, 'FLAT', FALSE, TRUE, 3, 1, NULL, NULL, '2025-09-01T01:09:41.781Z', '2025-09-01T01:09:41.781Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf06ou8l0008vkq4nq6u1es0', 'cmf06ou8b0000vkq4cyng3byo', 'Tomato Basil Wrap', 'Tomato basil flavored wrap', 1, 'FLAT', FALSE, TRUE, 4, 1, NULL, NULL, '2025-09-01T01:09:41.782Z', '2025-09-01T01:09:41.782Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf06ou8n000avkq49vu9wtla', 'cmf06ou8b0000vkq4cyng3byo', 'Wheat Wrap', 'Whole wheat wrap', 1, 'FLAT', FALSE, TRUE, 5, 1, NULL, NULL, '2025-09-01T01:09:41.783Z', '2025-09-01T01:09:41.783Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf06ou8o000cvkq43wz2o2h0', 'cmf06ou8b0000vkq4cyng3byo', 'White Wrap', 'Classic white wrap', 1, 'FLAT', FALSE, TRUE, 6, 1, NULL, NULL, '2025-09-01T01:09:41.784Z', '2025-09-01T01:09:41.784Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf06ou8q000evkq4m4gitee8', 'cmf06ou8b0000vkq4cyng3byo', 'No Bread', 'No bread - lettuce wrap style', 0, 'FLAT', FALSE, TRUE, 7, 1, NULL, NULL, '2025-09-01T01:09:41.787Z', '2025-09-01T01:09:41.787Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf07bxje0002vkv8j5whj331', 'cmf07bxj10000vkv8ziod1skk', 'Large Sub Roll', 'Large sub roll', 0, 'FLAT', TRUE, TRUE, 1, 1, NULL, NULL, '2025-09-01T01:27:39.147Z', '2025-09-01T01:27:39.147Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf07bxjl0004vkv8fj0fh19s', 'cmf07bxj10000vkv8ziod1skk', 'Spinach Wrap', 'Fresh spinach wrap', 0, 'FLAT', FALSE, TRUE, 2, 1, NULL, NULL, '2025-09-01T01:27:39.153Z', '2025-09-01T01:27:39.153Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf07bxjn0006vkv8l7et6vko', 'cmf07bxj10000vkv8ziod1skk', 'Tomato Basil Wrap', 'Tomato basil flavored wrap', 0, 'FLAT', FALSE, TRUE, 3, 1, NULL, NULL, '2025-09-01T01:27:39.155Z', '2025-09-01T01:27:39.155Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf07bxjp0008vkv8jeo8tgsm', 'cmf07bxj10000vkv8ziod1skk', 'Wheat Wrap', 'Whole wheat wrap', 0, 'FLAT', FALSE, TRUE, 4, 1, NULL, NULL, '2025-09-01T01:27:39.157Z', '2025-09-01T01:27:39.157Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf07bxjq000avkv8v2wfpeae', 'cmf07bxj10000vkv8ziod1skk', 'White Wrap', 'Classic white wrap', 0, 'FLAT', FALSE, TRUE, 5, 1, NULL, NULL, '2025-09-01T01:27:39.159Z', '2025-09-01T01:27:39.159Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf07bxjs000cvkv8al4440da', 'cmf07bxj10000vkv8ziod1skk', 'No Bread', 'No bread - lettuce wrap style', 0, 'FLAT', FALSE, TRUE, 6, 1, NULL, NULL, '2025-09-01T01:27:39.160Z', '2025-09-01T01:27:39.160Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf08pvba0002vkz07r7tyh9r', 'cmf08pvb50000vkz04t32pcxq', 'Horseradish', NULL, 0, 'FLAT', FALSE, TRUE, 1, 3, NULL, NULL, '2025-09-01T02:06:29.062Z', '2025-09-01T02:24:47.183Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf08pvbe0004vkz0fen2jgf8', 'cmf08pvb50000vkz04t32pcxq', 'Mayonnaise', NULL, 0, 'FLAT', FALSE, TRUE, 2, 3, NULL, NULL, '2025-09-01T02:06:29.067Z', '2025-09-01T02:24:47.198Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf08pvbf0006vkz0dieef09l', 'cmf08pvb50000vkz04t32pcxq', 'Mustard', NULL, 0, 'FLAT', FALSE, TRUE, 3, 3, NULL, NULL, '2025-09-01T02:06:29.068Z', '2025-09-01T02:24:47.200Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf08pvbg0008vkz06snvl9iq', 'cmf08pvb50000vkz04t32pcxq', 'Ranch', NULL, 0, 'FLAT', FALSE, TRUE, 4, 3, NULL, NULL, '2025-09-01T02:06:29.069Z', '2025-09-01T02:24:47.201Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf08pvbh000avkz039qbpu19', 'cmf08pvb50000vkz04t32pcxq', 'Spicy Mustard', NULL, 0, 'FLAT', FALSE, TRUE, 5, 3, NULL, NULL, '2025-09-01T02:06:29.070Z', '2025-09-01T02:24:47.203Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf08pvbi000cvkz0laf72bax', 'cmf08pvb50000vkz04t32pcxq', 'Special BBQ Sauce', NULL, 0, 'FLAT', FALSE, TRUE, 6, 3, NULL, NULL, '2025-09-01T02:06:29.071Z', '2025-09-01T02:24:47.204Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf08pvbn000hvkz0fgk5onm6', 'cmf08pvbl000dvkz0ti867vpd', 'American Cheese', NULL, 0.75, 'FLAT', FALSE, TRUE, 2, 3, NULL, NULL, '2025-09-01T02:06:29.075Z', '2025-09-01T02:53:38.201Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf08pvbo000jvkz02vh4ikuz', 'cmf08pvbl000dvkz0ti867vpd', 'Provolone', NULL, 0.75, 'FLAT', FALSE, TRUE, 3, 3, NULL, NULL, '2025-09-01T02:06:29.076Z', '2025-09-01T02:53:38.203Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf08pvbp000lvkz0djarjstz', 'cmf08pvbl000dvkz0ti867vpd', 'Swiss', NULL, 0.75, 'FLAT', FALSE, TRUE, 4, 3, NULL, NULL, '2025-09-01T02:06:29.078Z', '2025-09-01T02:53:38.204Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf09u7jv0004vkic4y9hurlf', 'cmf09u7jm0000vkic0gt7k9ax', 'Tomatoes', 'Fresh tomatoes for your sub', 0, 'FLAT', FALSE, TRUE, 2, 3, NULL, NULL, '2025-09-01T02:37:51.163Z', '2025-09-01T02:52:09.136Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf09u7jw0006vkicosrfrw9a', 'cmf09u7jm0000vkic0gt7k9ax', 'Onions', 'Fresh onions for your sub', 0, 'FLAT', FALSE, TRUE, 3, 3, NULL, NULL, '2025-09-01T02:37:51.165Z', '2025-09-01T02:52:09.137Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf09u7jy0008vkicf8evi6kp', 'cmf09u7jm0000vkic0gt7k9ax', 'Pickles', 'Fresh pickles for your sub', 0, 'FLAT', FALSE, TRUE, 4, 3, NULL, NULL, '2025-09-01T02:37:51.166Z', '2025-09-01T02:52:09.138Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf09u7jz000avkicdaycl1k4', 'cmf09u7jm0000vkic0gt7k9ax', 'Hot Relish', 'Fresh hot relish for your sub', 0, 'FLAT', FALSE, TRUE, 5, 3, NULL, NULL, '2025-09-01T02:37:51.167Z', '2025-09-01T02:52:09.139Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf09u7k0000cvkic89ptj8tw', 'cmf09u7jm0000vkic0gt7k9ax', 'Banana Peppers', 'Fresh banana peppers for your sub', 0, 'FLAT', FALSE, TRUE, 6, 3, NULL, NULL, '2025-09-01T02:37:51.169Z', '2025-09-01T02:52:09.140Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf09u7k1000evkichr21ugn2', 'cmf09u7jm0000vkic0gt7k9ax', 'Black Olives', 'Fresh black olives for your sub', 0, 'FLAT', FALSE, TRUE, 7, 3, NULL, NULL, '2025-09-01T02:37:51.170Z', '2025-09-01T02:52:09.141Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0a0tg70002vkhs95ofvt30', 'cmf0a0tg30000vkhsnwdbi0nm', 'Grilled Onions', 'grilled onions for your hot sub', 0, 'FLAT', FALSE, TRUE, 1, 3, NULL, NULL, '2025-09-01T02:42:59.479Z', '2025-09-01T02:52:09.148Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0a0tga0004vkhsc1f2fbl7', 'cmf0a0tg30000vkhsnwdbi0nm', 'Grilled Mushrooms', 'grilled mushrooms for your hot sub', 0, 'FLAT', FALSE, TRUE, 2, 3, NULL, NULL, '2025-09-01T02:42:59.483Z', '2025-09-01T02:52:09.149Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf08pvbm000fvkz0szjg433q', 'cmf08pvbl000dvkz0ti867vpd', 'Blue Cheese', NULL, 0.75, 'FLAT', FALSE, TRUE, 1, 3, NULL, NULL, '2025-09-01T02:06:29.074Z', '2025-09-01T02:53:38.199Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf0dudnr0001vkjwmeeto4hp', 'cmf0doopy0000vkbcb6citd6a', 'French Fries & Onion Rings', 'Combination of french fries and onion rings', 0, 'FLAT', TRUE, TRUE, 1, NULL, NULL, NULL, '2025-09-01T04:29:57.543Z', '2025-09-01T04:29:57.543Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf26mk8o002vvkq0l94u5kxr', 'cmf26g4mw002pvkq03xf5r2t1', 'Romaine Lettuce', 'Romaine', 0, 'FLAT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T10:43:27.864Z', '2025-09-02T10:43:27.864Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf26iyjo002rvkq0nk8h33ql', 'cmf26g4mw002pvkq03xf5r2t1', 'Mixed Greens', 'Mixed Greens', 0, 'FLAT', TRUE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T10:40:39.780Z', '2025-09-02T10:43:42.790Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf26xfwg0035vkq0p113lugf', 'cmf26thyi002xvkq01n46mw31', 'Grilled Chicken', '', 5, 'PER_UNIT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T10:51:55.457Z', '2025-09-02T10:51:55.457Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf26thyn0033vkq0w54jn5fe', 'cmf26thyi002xvkq01n46mw31', 'Avocado ', 'Avocado ', 3.5, 'FLAT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T10:48:51.503Z', '2025-09-02T10:52:57.171Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf26thym0031vkq0ndc313xd', 'cmf26thyi002xvkq01n46mw31', 'Crabmeat', 'Crabmeat ', 4, 'FLAT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T10:48:51.503Z', '2025-09-02T10:53:42.020Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf270ukw0037vkq04c456k1c', 'cmf26thyi002xvkq01n46mw31', 'Tuna salad', '', 4, 'FLAT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T10:54:34.449Z', '2025-09-02T10:54:34.449Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf271mk20039vkq0plf56o5p', 'cmf26thyi002xvkq01n46mw31', 'Chicken Fingers', '', 5, 'FLAT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T10:55:10.706Z', '2025-09-02T10:55:10.706Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf272ats003bvkq09b2j4v55', 'cmf26thyi002xvkq01n46mw31', 'Chicken Salad', '', 4, 'FLAT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T10:55:42.160Z', '2025-09-02T10:55:42.160Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf272mrh003dvkq06e5os3b2', 'cmf26thyi002xvkq01n46mw31', 'Steak Tips', '', 6, 'FLAT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T10:55:57.630Z', '2025-09-02T10:55:57.630Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf28oh1a0040vkq01v4l72ca', 'cmf28n7mi003yvkq0k99uuzyp', 'Tartar Sauce', '', 0, 'PER_UNIT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T11:40:56.255Z', '2025-09-02T11:40:56.255Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf28p1nq0042vkq0cjlvv894', 'cmf28n7mi003yvkq0k99uuzyp', 'Cocktail sauce', '', 0, 'PER_UNIT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T11:41:22.982Z', '2025-09-02T11:41:22.982Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf28poh50044vkq0fbql3z7l', 'cmf28n7mi003yvkq0k99uuzyp', 'Ketchup', '', 0, 'PER_UNIT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T11:41:52.554Z', '2025-09-02T11:41:52.554Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf28qam90046vkq0ndftlkvh', 'cmf28n7mi003yvkq0k99uuzyp', 'Hot Sauce', '', 0, 'PER_UNIT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T11:42:21.250Z', '2025-09-02T11:42:21.250Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf2am3yb0004vka4zd46wqmm', 'cmf2al5u70002vka4wyhqmvaq', 'Tuna', '', 0, 'PER_UNIT', TRUE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T12:35:05.220Z', '2025-09-02T12:35:05.220Z');
INSERT INTO "customization_options" ("id", "groupId", "name", "description", "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", "allergens", "createdAt", "updatedAt") VALUES ('cmf2amz9c0006vka4nqlm138t', 'cmf2al5u70002vka4wyhqmvaq', 'Chicken salad', '', 0, 'PER_UNIT', FALSE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T12:35:45.792Z', '2025-09-02T12:35:45.792Z');

-- Table: email_logs
DROP TABLE IF EXISTS "email_logs" CASCADE;
CREATE TABLE "email_logs" (
  "id" TEXT NOT NULL,
  "to" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "templateKey" TEXT,
  "status" USER-DEFINED NOT NULL DEFAULT 'PENDING'::"EmailStatus",
  "errorMessage" TEXT,
  "sentAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Table: email_settings
DROP TABLE IF EXISTS "email_settings" CASCADE;
CREATE TABLE "email_settings" (
  "id" TEXT NOT NULL,
  "settingKey" TEXT NOT NULL,
  "settingValue" TEXT NOT NULL,
  "description" TEXT,
  "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
  "category" TEXT NOT NULL DEFAULT 'general'::text,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Table: email_templates
DROP TABLE IF EXISTS "email_templates" CASCADE;
CREATE TABLE "email_templates" (
  "id" TEXT NOT NULL,
  "templateKey" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "htmlContent" TEXT NOT NULL,
  "textContent" TEXT,
  "variables" ARRAY,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Table: employee_profiles
DROP TABLE IF EXISTS "employee_profiles" CASCADE;
CREATE TABLE "employee_profiles" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "position" TEXT,
  "department" TEXT,
  "phone" TEXT,
  "emergencyContactName" TEXT,
  "emergencyContactPhone" TEXT,
  "hireDate" TIMESTAMP,
  "hourlyWage" DOUBLE PRECISION,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "permissions" ARRAY,
  "scheduleNotes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "employee_profiles" ("id", "userId", "employeeId", "firstName", "lastName", "position", "department", "phone", "emergencyContactName", "emergencyContactPhone", "hireDate", "hourlyWage", "isActive", "permissions", "scheduleNotes", "createdAt", "updatedAt") VALUES ('cmez83ksq0001vkqwy6w4ixr9', 'cmez7yyig0000vkgsnomscjd6', 'EMP1756616482824', 'omar', '', 'Manager', '', NULL, NULL, NULL, NULL, NULL, TRUE, , NULL, '2025-08-31T09:01:22.826Z', '2025-08-31T09:01:22.826Z');
INSERT INTO "employee_profiles" ("id", "userId", "employeeId", "firstName", "lastName", "position", "department", "phone", "emergencyContactName", "emergencyContactPhone", "hireDate", "hourlyWage", "isActive", "permissions", "scheduleNotes", "createdAt", "updatedAt") VALUES ('cmez8ob62000cvkn8fy00rlhs', 'cmez8ob60000avkn8yv0rn3sc', '', '', '', '', '', '', '', '', '2025-08-31T09:17:30.121Z', NULL, TRUE, order_management,kitchen_access,menu_edit,reports_access,user_management, NULL, '2025-08-31T09:17:30.122Z', '2025-08-31T09:17:30.122Z');
INSERT INTO "employee_profiles" ("id", "userId", "employeeId", "firstName", "lastName", "position", "department", "phone", "emergencyContactName", "emergencyContactPhone", "hireDate", "hourlyWage", "isActive", "permissions", "scheduleNotes", "createdAt", "updatedAt") VALUES ('cmez8pyj0000fvkn8u2iytrm7', 'cmez8pyiz000dvkn8mhu5agrf', '1212', 'LIZ', 'LIZ', '', 'Kitchen', '', '', '', '2025-08-31T09:18:47.049Z', NULL, TRUE, order_management,kitchen_access, NULL, '2025-08-31T09:18:47.052Z', '2025-08-31T09:18:47.052Z');
INSERT INTO "employee_profiles" ("id", "userId", "employeeId", "firstName", "lastName", "position", "department", "phone", "emergencyContactName", "emergencyContactPhone", "hireDate", "hourlyWage", "isActive", "permissions", "scheduleNotes", "createdAt", "updatedAt") VALUES ('cmezfwz7o0002vktgg14isvfl', 'cmezfwz7b0000vktgdestx9tn', '101', 'operations', 'greenland', '', '', '', '', '', '2025-08-31T12:40:11.842Z', NULL, TRUE, kitchen_access,order_management, NULL, '2025-08-31T12:40:11.843Z', '2025-08-31T12:40:11.843Z');

-- Table: item_modifiers
DROP TABLE IF EXISTS "item_modifiers" CASCADE;
CREATE TABLE "item_modifiers" (
  "id" TEXT NOT NULL,
  "itemId" TEXT NOT NULL,
  "modifierId" TEXT NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "maxSelectable" INTEGER,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: jwt_blacklist
DROP TABLE IF EXISTS "jwt_blacklist" CASCADE;
CREATE TABLE "jwt_blacklist" (
  "id" TEXT NOT NULL,
  "jti" TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: jwt_secrets
DROP TABLE IF EXISTS "jwt_secrets" CASCADE;
CREATE TABLE "jwt_secrets" (
  "id" TEXT NOT NULL,
  "kid" TEXT NOT NULL,
  "secret" TEXT NOT NULL,
  "algorithm" TEXT NOT NULL DEFAULT 'HS256'::text,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "rotatedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: menu_categories
DROP TABLE IF EXISTS "menu_categories" CASCADE;
CREATE TABLE "menu_categories" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "parentCategoryId" TEXT,
  "imageUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez4xl780003vkwcly8nts4q', 'Salads', 'salads', 'Fresh, healthy salads with various toppings and dressings', NULL, NULL, TRUE, 1, '2025-08-31T07:32:44.441Z', '2025-08-31T07:32:44.441Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5buep0000vkvs74qojdfm', 'Dinner Plates', 'dinner-plates', 'Hearty dinner plates with sides', NULL, NULL, TRUE, 6, '2025-08-31T07:43:49.681Z', '2025-08-31T07:43:49.681Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5buf50008vkvsbnhrhccb', 'Soups & Chowders', 'soups-chowders', 'Hot soups and chowders', NULL, NULL, TRUE, 14, '2025-08-31T07:43:49.697Z', '2025-08-31T07:43:49.697Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5buf70009vkvsdqx26uux', 'Specialty Items', 'specialty-items', 'Specialty sandwiches and items', NULL, NULL, TRUE, 15, '2025-08-31T07:43:49.699Z', '2025-08-31T07:43:49.699Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmf0llm9l0000vkk84p800i04', 'Seafood', 'seafood', 'Fresh seafood options including boxes, rolls, and dinner plates', NULL, NULL, TRUE, 8, '2025-09-01T08:07:05.721Z', '2025-09-01T08:07:05.721Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5bueu0001vkvsuragc8gi', 'Seafood Plates', 'seafood-plates', 'Seafood dinner plates and entrees', 'cmf0llm9l0000vkk84p800i04', NULL, TRUE, 3, '2025-08-31T07:43:49.687Z', '2025-09-01T08:50:11.158Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmf1pnx7k0009vk58x1j00wur', 'Appetizers', 'appetizers', '', NULL, '', TRUE, 0, '2025-09-02T02:48:37.856Z', '2025-09-02T02:48:37.856Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmf0llm9o0002vkk8ah0l3w9l', 'Seafood Boxes', 'seafood-boxes', 'Small and Large seafood boxes', 'cmf0llm9l0000vkk84p800i04', '', TRUE, 1, '2025-09-01T08:07:05.725Z', '2025-09-01T21:52:25.048Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmf0llm9r0004vkk848mn4a93', 'Seafood Rolls', 'seafood-rolls', 'Seafood rolls with choice of French Fries or Onion Rings', 'cmf0llm9l0000vkk84p800i04', '', TRUE, 2, '2025-09-01T08:07:05.728Z', '2025-09-01T21:52:36.564Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmf1fm9r30001vkwwsv4n14qt', 'Chicken', 'chicken', '', NULL, '', TRUE, 0, '2025-09-01T22:07:24.639Z', '2025-09-01T22:07:24.639Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5buf00005vkvso9m4c4xj', 'Wings', 'wings', 'Chicken wings in various flavors', 'cmf1fm9r30001vkwwsv4n14qt', '', TRUE, 11, '2025-08-31T07:43:49.692Z', '2025-09-01T22:07:42.809Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5buf20006vkvsv0wezhi1', 'Fingers', 'fingers', 'Chicken fingers and tenders', 'cmf1fm9r30001vkwwsv4n14qt', '', TRUE, 12, '2025-08-31T07:43:49.694Z', '2025-09-01T22:09:42.126Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmf0cawz80000vkccemljdoul', 'Sandwiches', 'sandwiches', 'Classic sandwiches and burgers', 'cmf1g3aqb0001vkisf6n0t7om', '', TRUE, 6, '2025-09-01T03:46:49.842Z', '2025-09-01T22:21:11.464Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5buew0002vkvs0misx39j', 'Hot Subs', 'hot-subs', 'Hot sandwiches and subs', 'cmf1g3aqb0001vkisf6n0t7om', '', TRUE, 8, '2025-08-31T07:43:49.688Z', '2025-09-01T22:21:36.433Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5buex0003vkvs8abknm9j', 'Cold Subs', 'cold-subs', 'Cold sandwiches and subs', 'cmf1g3aqb0001vkisf6n0t7om', '', TRUE, 9, '2025-08-31T07:43:49.689Z', '2025-09-01T22:22:05.195Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5buey0004vkvs8ypqlpri', 'Steak and Cheese Subs', 'steak-and-cheese-subs', 'Steak and cheese variations', 'cmf1g3aqb0001vkisf6n0t7om', '', TRUE, 10, '2025-08-31T07:43:49.691Z', '2025-09-01T22:22:25.115Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmf1g3aqb0001vkisf6n0t7om', 'Subs & Sandwiches', 'subs-sandwiches', '', NULL, '', TRUE, 0, '2025-09-01T22:20:39.059Z', '2025-09-02T08:31:46.046Z');
INSERT INTO "menu_categories" ("id", "name", "slug", "description", "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmf283ib1003nvkq0tvwy17r3', 'Build Your salad', 'build-your-salad', '', 'cmez4xl780003vkwcly8nts4q', '', TRUE, 0, '2025-09-02T11:24:38.125Z', '2025-09-02T11:24:38.125Z');

-- Table: menu_item_customizations
DROP TABLE IF EXISTS "menu_item_customizations" CASCADE;
CREATE TABLE "menu_item_customizations" (
  "id" TEXT NOT NULL,
  "menuItemId" TEXT NOT NULL,
  "customizationGroupId" TEXT NOT NULL,
  "isRequired" BOOLEAN NOT NULL DEFAULT false,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2ah31w0000vka4nq0b7ksd', 'cmez527ch0018vk8032m02431', 'cmez4ylw70003vkvowz7y4tsn', FALSE, 1, '2025-09-02T12:31:10.772Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf1s5lq6005yvk0sh4ir46oj', 'cmez5bugk001fvkvs8jtn5du0', 'cmf0klk1c0000vki0gy432pcp', FALSE, 1, '2025-09-02T03:58:22.014Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf1s5lq6005zvk0sj7xdi0c9', 'cmez5bugk001fvkvs8jtn5du0', 'cmf07bxj10000vkv8ziod1skk', FALSE, 2, '2025-09-02T03:58:22.014Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf1s5lq60060vk0ssljoohmo', 'cmez5bugk001fvkvs8jtn5du0', 'cmf08pvb50000vkz04t32pcxq', FALSE, 3, '2025-09-02T03:58:22.014Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf1s5lq60061vk0sg13ivkb0', 'cmez5bugk001fvkvs8jtn5du0', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 4, '2025-09-02T03:58:22.014Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf1s5lq60062vk0s9negvrnv', 'cmez5bugk001fvkvs8jtn5du0', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 5, '2025-09-02T03:58:22.014Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf24tnfu000yvkq0064p77x9', 'cmf24skss000vvkq0y84brlq9', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:52:59.370Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf24uoxf0013vkq07w0qtyzy', 'cmf24ueki0010vkq0m620k5bu', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:53:47.956Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf24we160018vkq0egms4kaa', 'cmf24vzqk0015vkq06atrczo6', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:55:07.146Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf28imbc003tvkq080i84s30', 'cmez4ylz7001cvkvoyc2xmwxy', 'cmez4ylw70003vkvowz7y4tsn', FALSE, 1, '2025-09-02T11:36:23.160Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf28imbc003uvkq04r1sp1xs', 'cmez4ylz7001cvkvoyc2xmwxy', 'cmf26thyi002xvkq01n46mw31', FALSE, 2, '2025-09-02T11:36:23.160Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf28jfai003vvkq08xjgg0zw', 'cmez4ylz7001evkvoo7mcs4ly', 'cmez4ylw70003vkvowz7y4tsn', FALSE, 1, '2025-09-02T11:37:00.715Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf28jfai003wvkq0ex5ihixp', 'cmez4ylz7001evkvoo7mcs4ly', 'cmf26thyi002xvkq01n46mw31', FALSE, 2, '2025-09-02T11:37:00.715Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jpfq0004vk7c0tgca00n', 'cmf0kymsi0006vk5gyp8abnrw', 'cmf0kymvt000svk5g00zjcfdl', FALSE, 999, '2025-09-02T12:05:13.479Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jpg20008vk7clcvg4kcm', 'cmf0kymsi0006vk5gyp8abnrw', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T12:05:13.490Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jpg4000avk7cfalyb3m3', 'cmf0kymv2000evk5gecv43nyi', 'cmf0kymvt000svk5g00zjcfdl', FALSE, 999, '2025-09-02T12:05:13.493Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jpg9000evk7c8pw9bxur', 'cmf0kymv2000evk5gecv43nyi', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T12:05:13.498Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jpgc000gvk7cl5dhlg59', 'cmf0kymv8000ivk5gtwrp5ro4', 'cmf0kymvt000svk5g00zjcfdl', FALSE, 999, '2025-09-02T12:05:13.500Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jpgi000kvk7cacc6f35l', 'cmf0kymv8000ivk5gtwrp5ro4', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T12:05:13.506Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jpgk000mvk7cj2nle7yf', 'cmf0kz13z0006vkg4nqr2kpbj', 'cmf0kymvt000svk5g00zjcfdl', FALSE, 999, '2025-09-02T12:05:13.508Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jpgq000qvk7cb6hsg1m3', 'cmf0kz147000avkg4lcptf42p', 'cmf0kymvt000svk5g00zjcfdl', FALSE, 999, '2025-09-02T12:05:13.515Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jpgw000uvk7cjdji47yd', 'cmf0kz147000avkg4lcptf42p', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T12:05:13.520Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jpgy000wvk7c6iv343c7', 'cmf0kz14a000evkg4fvz7l8ax', 'cmf0kymvt000svk5g00zjcfdl', FALSE, 999, '2025-09-02T12:05:13.523Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jph30010vk7cm770vt5n', 'cmf0kz14a000evkg4fvz7l8ax', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T12:05:13.528Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jph60012vk7c1y5g5p0t', 'cmf0kz14e000ivkg4fpi95zfv', 'cmf0kymvt000svk5g00zjcfdl', FALSE, 999, '2025-09-02T12:05:13.530Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jphb0016vk7cp6y2qt05', 'cmf0kz14e000ivkg4fpi95zfv', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T12:05:13.535Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2anqkd0007vka4dxm5zxk1', 'cmez4ylz7001avkvowcpcy4ea', 'cmez4ylw70003vkvowz7y4tsn', FALSE, 1, '2025-09-02T12:36:21.182Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2anqkd0008vka44uvqs8lg', 'cmez4ylz7001avkvowcpcy4ea', 'cmf2al5u70002vka4wyhqmvaq', FALSE, 2, '2025-09-02T12:36:21.182Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2391ng0012vk88f47y61ab', 'cmf237uan0011vk88f0katf7g', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:08:58.397Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf25bdp3002fvkq07w1oybf3', 'cmf25al1g002cvkq0yqm24f0y', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T10:06:46.552Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf28td880047vkq0pn0j1u6t', 'cmez5bufx000tvkvs3psh4hyl', 'cmf0doopy0000vkbcb6citd6a', FALSE, 1, '2025-09-02T11:44:44.601Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf28td880048vkq0rj2jc75z', 'cmez5bufx000tvkvs3psh4hyl', 'cmf0dooqi0005vkbcaetve5zt', FALSE, 2, '2025-09-02T11:44:44.601Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf28td880049vkq0hmwknk6y', 'cmez5bufx000tvkvs3psh4hyl', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 3, '2025-09-02T11:44:44.601Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29kss60017vk7cku6bjgzt', 'cmez5bug1000xvkvsytz35wfc', 'cmf0doopy0000vkbcb6citd6a', FALSE, 1, '2025-09-02T12:06:04.470Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29kss60018vk7cpsf789m7', 'cmez5bug1000xvkvsytz35wfc', 'cmf0dooqi0005vkbcaetve5zt', FALSE, 2, '2025-09-02T12:06:04.470Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29kss60019vk7cz0jvdsx7', 'cmez5bug1000xvkvsytz35wfc', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 3, '2025-09-02T12:06:04.470Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2avd8u0009vka47m67gvf1', 'cmez5bufb000bvkvsvxlcblte', 'cmf0doopy0000vkbcb6citd6a', FALSE, 1, '2025-09-02T12:42:17.166Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2avd8u000avka4eue7apbt', 'cmez5bufb000bvkvsvxlcblte', 'cmf0l31z80000vk0s10ywj3zp', FALSE, 2, '2025-09-02T12:42:17.166Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf07zb3m0001vkk8gan9wdxi', 'cmez5bugf001bvkvs9utg7k5d', 'cmf07bxj10000vkv8ziod1skk', TRUE, 0, '2025-09-01T01:45:49.811Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf07zb400005vkk8kr551ejp', 'cmez5bugm001hvkvswtop2ezu', 'cmf07bxj10000vkv8ziod1skk', TRUE, 0, '2025-09-01T01:45:49.824Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf07zb450007vkk8eaetf6uh', 'cmez5bufk000hvkvspk80r6rp', 'cmf07bxj10000vkv8ziod1skk', TRUE, 0, '2025-09-01T01:45:49.830Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf09u7kh000qvkic1svzpk6z', 'cmez5buhf0029vkvs95vr1a6m', 'cmf09u7jm0000vkic0gt7k9ax', FALSE, 4, '2025-09-01T02:37:51.185Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf09u7kj000svkic3wudogh0', 'cmez5buhh002bvkvsqef86gvy', 'cmf09u7jm0000vkic0gt7k9ax', FALSE, 4, '2025-09-01T02:37:51.187Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf09u7kk000uvkicrgbma9af', 'cmez5buhj002dvkvs2wlo8w8h', 'cmf09u7jm0000vkic0gt7k9ax', FALSE, 4, '2025-09-01T02:37:51.188Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf09u7kl000wvkic4qsznkbz', 'cmez5buhl002fvkvs101lksxm', 'cmf09u7jm0000vkic0gt7k9ax', FALSE, 4, '2025-09-01T02:37:51.189Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf09u7km000yvkiczpiditgj', 'cmez5buhn002hvkvsfy7fj8g9', 'cmf09u7jm0000vkic0gt7k9ax', FALSE, 4, '2025-09-01T02:37:51.191Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf09u7ko0010vkicty25h4yw', 'cmez5buh4001zvkvsodoxnl83', 'cmf09u7jm0000vkic0gt7k9ax', FALSE, 4, '2025-09-01T02:37:51.192Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf09u7kp0012vkic27apsbfv', 'cmez5buh60021vkvsx6pjsrsl', 'cmf09u7jm0000vkic0gt7k9ax', FALSE, 4, '2025-09-01T02:37:51.194Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf09u7kq0014vkic1voizwpc', 'cmez5buh80023vkvsyejru7y7', 'cmf09u7jm0000vkic0gt7k9ax', FALSE, 4, '2025-09-01T02:37:51.195Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf09u7kr0016vkicee6l8616', 'cmez5buha0025vkvss8g1oejt', 'cmf09u7jm0000vkic0gt7k9ax', FALSE, 4, '2025-09-01T02:37:51.196Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf09u7kt0018vkic3q8788xu', 'cmez5buhc0027vkvsy1aicbxf', 'cmf09u7jm0000vkic0gt7k9ax', FALSE, 4, '2025-09-01T02:37:51.197Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrkb001hvkz4u3nmb1tk', 'cmez5buhx002rvkvs1n6haty2', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T03:24:09.804Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrkd001jvkz45von16yk', 'cmez5buhx002rvkvs1n6haty2', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:24:09.805Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrkf001lvkz4mb1abudf', 'cmez5buhx002rvkvs1n6haty2', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:24:09.807Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrkh001nvkz4hn8678gl', 'cmez5buhx002rvkvs1n6haty2', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:24:09.809Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbiy001rvk70t7erqw78', 'cmf0cax0s000mvkcc28pgk2s4', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:54:08.602Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbiz001tvk70bp3473xk', 'cmf0cax0s000mvkcc28pgk2s4', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:54:08.603Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbj1001vvk70kexozzl8', 'cmf0cax0u000ovkcclyep16m6', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:54:08.605Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbj2001xvk70n9efppyo', 'cmf0cax0u000ovkcclyep16m6', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:54:08.607Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbj4001zvk700j7ftu3w', 'cmf0cax0u000ovkcclyep16m6', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:54:08.608Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0dooqy000fvkbcunpmgzde', 'cmez5bufz000vvkvssfm47yoi', 'cmf0doopy0000vkbcb6citd6a', TRUE, 1, '2025-09-01T04:25:31.978Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0door0000hvkbck9gy0yj3', 'cmez5bufz000vvkvssfm47yoi', 'cmf0dooqi0005vkbcaetve5zt', TRUE, 2, '2025-09-01T04:25:31.980Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0door9000nvkbc2yjp9kpx', 'cmez5bug3000zvkvshe0vwnu8', 'cmf0doopy0000vkbcb6citd6a', TRUE, 1, '2025-09-01T04:25:31.989Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0doorb000pvkbcw7s1s7zy', 'cmez5bug3000zvkvshe0vwnu8', 'cmf0dooqi0005vkbcaetve5zt', TRUE, 2, '2025-09-01T04:25:31.991Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0doord000rvkbct38ckcsj', 'cmez5bug50011vkvs330um4k1', 'cmf0doopy0000vkbcb6citd6a', TRUE, 1, '2025-09-01T04:25:31.993Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0doore000tvkbc0gn790xw', 'cmez5bug50011vkvs330um4k1', 'cmf0dooqi0005vkbcaetve5zt', TRUE, 2, '2025-09-01T04:25:31.995Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0doorg000vvkbcpj3yaboa', 'cmez5bug70013vkvs6aw3qmtk', 'cmf0doopy0000vkbcb6citd6a', TRUE, 1, '2025-09-01T04:25:31.996Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0doori000xvkbcp6ggn8wx', 'cmez5bug70013vkvs6aw3qmtk', 'cmf0dooqi0005vkbcaetve5zt', TRUE, 2, '2025-09-01T04:25:31.999Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0doorl000zvkbcon6o8pq0', 'cmez5bug90015vkvsh9ihifu1', 'cmf0doopy0000vkbcb6citd6a', TRUE, 1, '2025-09-01T04:25:32.001Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0doorn0011vkbcubd41d4e', 'cmez5bug90015vkvsh9ihifu1', 'cmf0dooqi0005vkbcaetve5zt', TRUE, 2, '2025-09-01T04:25:32.004Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0doorq0013vkbcwniod1ig', 'cmez5bugb0017vkvs8vxrv5iw', 'cmf0doopy0000vkbcb6citd6a', TRUE, 1, '2025-09-01T04:25:32.006Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0doort0015vkbcxwm9wrz0', 'cmez5bugb0017vkvs8vxrv5iw', 'cmf0dooqi0005vkbcaetve5zt', TRUE, 2, '2025-09-01T04:25:32.009Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk2d000avki0g3qq2dj9', 'cmf0cawzy0002vkccpj8t0hcd', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.254Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk2j000cvki0ti5st1wv', 'cmf0cax050004vkccpmzsgz01', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.260Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk2m000evki0qb1k1ac0', 'cmf0cax090006vkcc6nicnffq', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.262Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk2o000gvki0y80je4l4', 'cmf0cax0c0008vkcckefjlktt', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.265Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk2r000ivki06kwhooo5', 'cmf0cax0e000avkcc3z2pv3mf', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.268Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk2u000kvki0ugj0292b', 'cmf0cax0g000cvkcc3yucqldr', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.270Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk2w000mvki0xq28yqc0', 'cmf0cax0j000evkccpkhckphc', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.273Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk2z000ovki0ggj4ik4v', 'cmf0cax0l000gvkccso3qb8to', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.275Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk31000qvki0lzacrgaf', 'cmf0cax0o000ivkcca3j6fhf0', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.278Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk33000svki0ptmmtcic', 'cmf0cax0q000kvkccfccoae63', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.279Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk34000uvki0x5kvaehe', 'cmf0cax0s000mvkcc28pgk2s4', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.280Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk36000wvki03kl2jt2x', 'cmf0cax0u000ovkcclyep16m6', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.282Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk39000yvki077wlyjpf', 'cmez5buhf0029vkvs95vr1a6m', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.286Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3c0010vki0j9t8f2af', 'cmez5buhh002bvkvsqef86gvy', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.288Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3d0012vki0b05youxu', 'cmez5buhj002dvkvs2wlo8w8h', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.290Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3e0014vki0o6xgvwvd', 'cmez5buhl002fvkvs101lksxm', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.291Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3g0016vki0v7h8xj4j', 'cmez5buhn002hvkvsfy7fj8g9', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.292Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3h0018vki09g8hys0x', 'cmez5buhp002jvkvs1ar0eppl', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.294Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3i001avki0nrlj24ke', 'cmez5buhq002lvkvsp6t5damr', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.295Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3k001cvki0gcb597l0', 'cmez5buhv002pvkvs92heqdfm', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.296Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3l001evki0cjib6adb', 'cmez5buhx002rvkvs1n6haty2', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.297Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3n001gvki0u15bsjch', 'cmez5buhs002nvkvs686iuiqw', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.299Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf28wicn004bvkq0hv1lrorx', 'cmf0kz13z0006vkg4nqr2kpbj', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 2, '2025-09-02T11:47:11.207Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29ksv0001bvk7ceyfwr5f2', 'cmez5bug3000zvkvshe0vwnu8', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T12:06:04.572Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29ksv5001dvk7cibe2ilu0', 'cmez5bug50011vkvs330um4k1', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T12:06:04.577Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29ksv8001fvk7c1v2a926c', 'cmez5bufz000vvkvssfm47yoi', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T12:06:04.581Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29ksvc001hvk7cq3pp1206', 'cmez5bug70013vkvs6aw3qmtk', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T12:06:04.585Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29ksvg001jvk7cuo3092c3', 'cmez5bug90015vkvsh9ihifu1', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T12:06:04.589Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29ksvk001lvk7cwjdgjvoe', 'cmez5bugb0017vkvs8vxrv5iw', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T12:06:04.592Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2avd8u000bvka4o5x27m9g', 'cmez5bufb000bvkvsvxlcblte', 'cmf08pvb50000vkz04t32pcxq', FALSE, 3, '2025-09-02T12:42:17.166Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf23yb3f000lvkq0k8ngbe9t', 'cmf23x5cr0006vkq0ijin4rtq', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:28:37.036Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf23zg35000mvkq0af45mprf', 'cmf23xcdt000gvkq0ga0itt8k', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:29:30.161Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf240jkh000nvkq0ewcmklq8', 'cmf23x7tz000avkq0qwdluiuz', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:30:21.329Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf241hqs000ovkq0y3kj6sb5', 'cmf23xaiy000cvkq0ekts44ni', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:31:05.621Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf24zqee001avkq012p1xrab', 'cmez5buij003dvkvsofytltn1', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:57:43.142Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf252y5a001gvkq0hz10k6pq', 'cmf251n5m001cvkq02mypho7f', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T10:00:13.150Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf253wyt001lvkq0endweuo1', 'cmf253ief001ivkq0ncp320fv', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T10:00:58.277Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29b8l60001vk2g98n3k3uu', 'cmf0l31zw000mvk0sassix80k', 'cmf0lfe6w0001vkqgiubwi9uz', FALSE, 2, '2025-09-02T11:58:38.394Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29b8l60002vk2g227m0d8m', 'cmf0l31zw000mvk0sassix80k', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 3, '2025-09-02T11:58:38.394Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf22fjxp0001vk88s8i3h3gg', 'cmez4ylz7001jvkvorf8gutkb', 'cmez4ylw70003vkvowz7y4tsn', FALSE, 1, '2025-09-02T08:46:02.413Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf22fjxp0002vk88sg769m75', 'cmez4ylz7001jvkvorf8gutkb', 'cmez4ylwa0005vkvoe8fpfq94', FALSE, 2, '2025-09-02T08:46:02.413Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou91000gvkq4p7ebzdvi', 'cmez5bugd0019vkvss1syr7lw', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.798Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2avenx000dvka43wgge8fn', 'cmez5buff000dvkvsaexqwttc', 'cmf0doopy0000vkbcb6citd6a', FALSE, 999, '2025-09-02T12:42:19.005Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9e000uvkq4ne9j35x2', 'cmez5bugs001nvkvsg4st51kb', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.811Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9g000wvkq4wfygffkr', 'cmez5bugt001pvkvshj4za05r', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.812Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9h000yvkq48x073wra', 'cmez5bugw001rvkvszj8ensiv', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.814Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9j0010vkq4qy6cjzj8', 'cmez5bugz001tvkvsin6tvpm5', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.815Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9k0012vkq4jfxcjuny', 'cmez5buh0001vvkvsxlvetfm6', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.817Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9m0014vkq4yn11b9i9', 'cmez5buh2001xvkvsnhog34dl', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.818Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9o0016vkq4afs0bmjs', 'cmez5buh4001zvkvsodoxnl83', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.820Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9p0018vkq4u1dwqqq6', 'cmez5buh60021vkvsx6pjsrsl', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.821Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9q001avkq4zb9g0uza', 'cmez5buh80023vkvsyejru7y7', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.823Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9s001cvkq4j9eurglb', 'cmez5buha0025vkvss8g1oejt', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.824Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9t001evkq4s495npvw', 'cmez5buhc0027vkvsy1aicbxf', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.826Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9v001gvkq4rb971e3x', 'cmez5buhf0029vkvs95vr1a6m', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.828Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9x001ivkq41lwf7d77', 'cmez5buhh002bvkvsqef86gvy', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.829Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06ou9y001kvkq44rk3kjjj', 'cmez5buhj002dvkvs2wlo8w8h', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.831Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06oua0001mvkq4pk0h5a44', 'cmez5buhl002fvkvs101lksxm', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.832Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf06oua1001ovkq4jyizjyqv', 'cmez5buhn002hvkvsfy7fj8g9', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T01:09:41.834Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08331u0001vk1gb03dsker', 'cmez5bugo001jvkvslr3gsci2', 'cmf07bxj10000vkv8ziod1skk', TRUE, 0, '2025-09-01T01:48:46.002Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0833290003vk1g3ymkbe12', 'cmez5bugi001dvkvsvl6qxe2v', 'cmf07bxj10000vkv8ziod1skk', TRUE, 0, '2025-09-01T01:48:46.017Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0a0tgq000gvkhsm2ecpdiy', 'cmez5bugd0019vkvss1syr7lw', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T02:42:59.498Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0a0tgs000ivkhsbanxtjma', 'cmez5bugs001nvkvsg4st51kb', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T02:42:59.501Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0a0tgt000kvkhsg8x2pjg3', 'cmez5bugt001pvkvshj4za05r', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T02:42:59.502Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0a0tgv000mvkhshsxlqkmk', 'cmez5bugw001rvkvszj8ensiv', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T02:42:59.503Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0a0tgw000ovkhsfmqxyikl', 'cmez5bugz001tvkvsin6tvpm5', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T02:42:59.504Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0a0tgx000qvkhs54bwvjvd', 'cmez5buh0001vvkvsxlvetfm6', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T02:42:59.506Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0a0tgy000svkhsedxu7cbb', 'cmez5buh2001xvkvsnhog34dl', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T02:42:59.507Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0a0th1000wvkhs81uxrfpm', 'cmez5bugq001lvkvse0ycua9x', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T02:42:59.509Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0a0th2000yvkhs31v1f3gu', 'cmez5bugf001bvkvs9utg7k5d', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T02:42:59.510Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0a0th30010vkhsskfjexc3', 'cmez5bugo001jvkvslr3gsci2', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T02:42:59.511Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0a0th40012vkhsmi32l7sa', 'cmez5bugm001hvkvswtop2ezu', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T02:42:59.513Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0a0th50014vkhs4kwoi8bu', 'cmez5bugi001dvkvsvl6qxe2v', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T02:42:59.514Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbhi0001vk70yi0m19to', 'cmf0cawzy0002vkccpj8t0hcd', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:54:08.551Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbhl0003vk70obvim9rc', 'cmf0cawzy0002vkccpj8t0hcd', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:54:08.554Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbhn0005vk7037iod9te', 'cmf0cawzy0002vkccpj8t0hcd', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:54:08.555Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbhq0007vk70yfrj4vfp', 'cmf0cax050004vkccpmzsgz01', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:54:08.559Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbht0009vk709ff5dx5e', 'cmf0cax050004vkccpmzsgz01', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:54:08.561Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbhu000bvk7092t850hu', 'cmf0cax050004vkccpmzsgz01', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:54:08.562Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbhw000dvk70g4j1rcb6', 'cmf0cax090006vkcc6nicnffq', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:54:08.564Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbhx000fvk70la3fw5nv', 'cmf0cax090006vkcc6nicnffq', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:54:08.566Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbhz000hvk70u2ddhwom', 'cmf0cax090006vkcc6nicnffq', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:54:08.567Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbi0000jvk70kwgo5z7c', 'cmf0cax0c0008vkcckefjlktt', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:54:08.569Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbi1000lvk70u29krbbc', 'cmf0cax0c0008vkcckefjlktt', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:54:08.570Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbi2000nvk7057s7r5qb', 'cmf0cax0c0008vkcckefjlktt', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:54:08.571Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbi5000pvk70fqct4fb5', 'cmf0cax0e000avkcc3z2pv3mf', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:54:08.574Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbi7000rvk70nh8ijvh8', 'cmf0cax0e000avkcc3z2pv3mf', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:54:08.575Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbi9000tvk70fuc6zxa4', 'cmf0cax0e000avkcc3z2pv3mf', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:54:08.577Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbib000vvk70hrjln08z', 'cmf0cax0g000cvkcc3yucqldr', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:54:08.579Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbic000xvk70x9nizhk4', 'cmf0cax0g000cvkcc3yucqldr', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:54:08.580Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbid000zvk700pb0ffpn', 'cmf0cax0g000cvkcc3yucqldr', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:54:08.581Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbif0011vk70yauft2uw', 'cmf0cax0j000evkccpkhckphc', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:54:08.583Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbig0013vk70rplxai45', 'cmf0cax0j000evkccpkhckphc', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:54:08.584Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbih0015vk70oeunl8hw', 'cmf0cax0j000evkccpkhckphc', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:54:08.585Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbij0017vk70f9dyqnfs', 'cmf0cax0l000gvkccso3qb8to', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:54:08.587Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbik0019vk70e3sgsn67', 'cmf0cax0l000gvkccso3qb8to', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:54:08.588Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbil001bvk70q10oip4f', 'cmf0cax0l000gvkccso3qb8to', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:54:08.589Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbip001dvk70pxkla0pw', 'cmf0cax0o000ivkcca3j6fhf0', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:54:08.593Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbiq001fvk7074lwil0h', 'cmf0cax0o000ivkcca3j6fhf0', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:54:08.594Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbir001hvk707j7joon9', 'cmf0cax0o000ivkcca3j6fhf0', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:54:08.595Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbit001jvk70z0l4ryw0', 'cmf0cax0q000kvkccfccoae63', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:54:08.597Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbiu001lvk70lcbph6pz', 'cmf0cax0q000kvkccfccoae63', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:54:08.598Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbiv001nvk705abiixsq', 'cmf0cax0q000kvkccfccoae63', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:54:08.599Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0ckbix001pvk70se10gvbe', 'cmf0cax0s000mvkcc28pgk2s4', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:54:08.601Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveo1000fvka4fdor7ns7', 'cmez5buff000dvkvsaexqwttc', 'cmf0l31z80000vk0s10ywj3zp', FALSE, 999, '2025-09-02T12:42:19.010Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveo4000hvka4dsk1r0p3', 'cmez5buff000dvkvsaexqwttc', 'cmf08pvb50000vkz04t32pcxq', FALSE, 999, '2025-09-02T12:42:19.012Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveo6000jvka47entq3jy', 'cmez5bufh000fvkvscpxd5o66', 'cmf0doopy0000vkbcb6citd6a', FALSE, 999, '2025-09-02T12:42:19.015Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveo9000lvka40e5ucpzz', 'cmez5bufh000fvkvscpxd5o66', 'cmf0l31z80000vk0s10ywj3zp', FALSE, 999, '2025-09-02T12:42:19.017Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveob000nvka4ecm1tqo2', 'cmez5bufh000fvkvscpxd5o66', 'cmf08pvb50000vkz04t32pcxq', FALSE, 999, '2025-09-02T12:42:19.019Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveod000pvka4cxoo93st', 'cmez5bufm000jvkvsxckws9nb', 'cmf0doopy0000vkbcb6citd6a', FALSE, 999, '2025-09-02T12:42:19.021Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveof000rvka4gcx4p6k7', 'cmez5bufm000jvkvsxckws9nb', 'cmf0l31z80000vk0s10ywj3zp', FALSE, 999, '2025-09-02T12:42:19.023Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveoh000tvka4ivs8mirg', 'cmez5bufm000jvkvsxckws9nb', 'cmf08pvb50000vkz04t32pcxq', FALSE, 999, '2025-09-02T12:42:19.025Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveoj000vvka4lc4v56jm', 'cmez5bufp000lvkvs2gz0d9ii', 'cmf0doopy0000vkbcb6citd6a', FALSE, 999, '2025-09-02T12:42:19.027Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf07bxkc000gvkv8drvmecbb', 'cmez5bugq001lvkvse0ycua9x', 'cmf07bxj10000vkv8ziod1skk', TRUE, 1, '2025-09-01T01:27:39.181Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvby000nvkz0zjq5hd52', 'cmez5bugd0019vkvss1syr7lw', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T02:06:29.086Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvc0000pvkz066gxe15g', 'cmez5bugd0019vkvss1syr7lw', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T02:06:29.088Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvc1000rvkz0zzsdtw1s', 'cmez5bugs001nvkvsg4st51kb', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T02:06:29.089Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvc2000tvkz0mu10b4e3', 'cmez5bugs001nvkvsg4st51kb', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T02:06:29.090Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvc3000vvkz03lzd5zzl', 'cmez5bugt001pvkvshj4za05r', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T02:06:29.092Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvc4000xvkz0hqgrihkz', 'cmez5bugt001pvkvshj4za05r', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T02:06:29.092Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvc5000zvkz0zs4ojzr6', 'cmez5bugw001rvkvszj8ensiv', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T02:06:29.094Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvc70011vkz0dkxph5th', 'cmez5bugw001rvkvszj8ensiv', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T02:06:29.095Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvc80013vkz0o9w9afn2', 'cmez5bugz001tvkvsin6tvpm5', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T02:06:29.097Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvc90015vkz0714vcx4y', 'cmez5bugz001tvkvsin6tvpm5', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T02:06:29.098Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvca0017vkz0gsn0idj8', 'cmez5buh0001vvkvsxlvetfm6', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T02:06:29.099Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvcb0019vkz0szbal667', 'cmez5buh0001vvkvsxlvetfm6', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T02:06:29.099Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvcc001bvkz08j4dp43e', 'cmez5buh2001xvkvsnhog34dl', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T02:06:29.101Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvcd001dvkz0u8dfc44l', 'cmez5buh2001xvkvsnhog34dl', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T02:06:29.101Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveok000xvka4b965ocx8', 'cmez5bufp000lvkvs2gz0d9ii', 'cmf0l31z80000vk0s10ywj3zp', FALSE, 999, '2025-09-02T12:42:19.029Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveom000zvka45wix504t', 'cmez5bufp000lvkvs2gz0d9ii', 'cmf08pvb50000vkz04t32pcxq', FALSE, 999, '2025-09-02T12:42:19.031Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvcg001jvkz0mhad25pp', 'cmez5bugq001lvkvse0ycua9x', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T02:06:29.104Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvcg001lvkz0u7zhc7ur', 'cmez5bugq001lvkvse0ycua9x', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T02:06:29.105Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvci001nvkz0ohzfs8h7', 'cmez5bugf001bvkvs9utg7k5d', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T02:06:29.106Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvci001pvkz0f95q18ly', 'cmez5bugf001bvkvs9utg7k5d', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T02:06:29.107Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvcj001rvkz07cq12sq2', 'cmez5bugo001jvkvslr3gsci2', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T02:06:29.108Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvck001tvkz0qp2l8hcl', 'cmez5bugo001jvkvslr3gsci2', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T02:06:29.109Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvcm001vvkz02vs2sc8t', 'cmez5bugm001hvkvswtop2ezu', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T02:06:29.110Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvcn001xvkz0dbaxaxcx', 'cmez5bugm001hvkvswtop2ezu', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T02:06:29.111Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvcp001zvkz02a7bkljc', 'cmez5bugi001dvkvsvl6qxe2v', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T02:06:29.113Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf08pvcq0021vkz0ga5sfs2e', 'cmez5bugi001dvkvsvl6qxe2v', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T02:06:29.114Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf23p7x80000vkq01r0sbabp', 'cmf23bzgf0016vk88w5s74h2s', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:21:33.020Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveoo0011vka4f2acbttt', 'cmez5bufr000nvkvs5a925es2', 'cmf0doopy0000vkbcb6citd6a', FALSE, 999, '2025-09-02T12:42:19.032Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf244w1w000rvkq0orcxy1y4', 'cmf23x2l00004vkq04uywrd85', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:33:44.132Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf248rv7000tvkq035bs89r2', 'cmf23xe7i000kvkq0qudi6y99', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:36:45.331Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrgk0005vkz4oxo8ls6o', 'cmez5buhp002jvkvs1ar0eppl', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T03:24:09.669Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrgm0007vkz4d89dcyl1', 'cmez5buhp002jvkvs1ar0eppl', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:24:09.671Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrgo0009vkz4b0sq9r25', 'cmez5buhp002jvkvs1ar0eppl', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:24:09.673Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrgq000bvkz4txw5vy84', 'cmez5buhp002jvkvs1ar0eppl', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:24:09.674Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf25cccj002gvkq0u1efoeeq', 'cmf2570be001uvkq0qnysaenz', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T10:07:31.460Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf25cn5r002hvkq04gc5vazs', 'cmf254y9l001nvkq028daxm2u', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T10:07:45.472Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrgy000hvkz4vindep58', 'cmez5buhq002lvkvsp6t5damr', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T03:24:09.683Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrh0000jvkz41bx389zh', 'cmez5buhq002lvkvsp6t5damr', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:24:09.685Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrh2000lvkz4v2m22kf9', 'cmez5buhq002lvkvsp6t5damr', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:24:09.686Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrh4000nvkz4xfcl5831', 'cmez5buhq002lvkvsp6t5damr', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:24:09.689Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29b9qb0004vk2gbb3kgab2', 'cmf0l31zh0006vk0szbgocarb', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T11:58:39.875Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29b9qg0006vk2gf0lff46u', 'cmf0l31zm000avk0sn2us2ca1', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T11:58:39.880Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrip000tvkz4cjmyodg0', 'cmez5buhs002nvkvs686iuiqw', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T03:24:09.746Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrj6000vvkz46g78o725', 'cmez5buhs002nvkvs686iuiqw', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:24:09.763Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrjq000xvkz4wohacl63', 'cmez5buhs002nvkvs686iuiqw', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:24:09.782Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrjt000zvkz4dqkntnoh', 'cmez5buhs002nvkvs686iuiqw', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:24:09.785Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29b9qi0008vk2grbvmfk6y', 'cmf0l31zp000evk0sbt2tojs7', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T11:58:39.883Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29b9ql000avk2geeh44ak0', 'cmf0l31zs000ivk0smgvhtovt', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T11:58:39.885Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrjy0015vkz43v9k2cx1', 'cmez5buhv002pvkvs92heqdfm', 'cmf06ou8b0000vkq4cyng3byo', TRUE, 1, '2025-09-01T03:24:09.790Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrk00017vkz4bsd5vznl', 'cmez5buhv002pvkvs92heqdfm', 'cmf08pvb50000vkz04t32pcxq', FALSE, 2, '2025-09-01T03:24:09.792Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrk30019vkz4ujcc8ddh', 'cmez5buhv002pvkvs92heqdfm', 'cmf08pvbl000dvkz0ti867vpd', FALSE, 3, '2025-09-01T03:24:09.795Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0bhrk5001bvkz4sjcksuy1', 'cmez5buhv002pvkvs92heqdfm', 'cmf0a0tg30000vkhsnwdbi0nm', FALSE, 4, '2025-09-01T03:24:09.797Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29b9qo000cvk2gcned6hm3', 'cmf0l31zy000qvk0saes8ra8z', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T11:58:39.888Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29b9qs000evk2geplzftgh', 'cmf0l3201000uvk0slm026x8y', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 999, '2025-09-02T11:58:39.892Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3q001ivki0wxzcjbmv', 'cmez5bugd0019vkvss1syr7lw', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.303Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3s001kvki09cg4vfne', 'cmez5bugs001nvkvsg4st51kb', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.305Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3u001mvki0gdfkjxzj', 'cmez5bugt001pvkvshj4za05r', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.306Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3v001ovki0qobdb9yd', 'cmez5bugw001rvkvszj8ensiv', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.307Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3w001qvki0zssr75m9', 'cmez5bugz001tvkvsin6tvpm5', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.309Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3y001svki0yfkpzub2', 'cmez5buh0001vvkvsxlvetfm6', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.310Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk3z001uvki0azfg30mp', 'cmez5buh2001xvkvsnhog34dl', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.312Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk40001wvki0pn8fpov8', 'cmez5buh4001zvkvsodoxnl83', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.313Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk42001yvki013dpn14k', 'cmez5buh60021vkvsx6pjsrsl', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.314Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk440020vki0d08w4008', 'cmez5buh80023vkvsyejru7y7', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.316Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk460022vki0ifq6ykef', 'cmez5buha0025vkvss8g1oejt', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.319Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk480024vki0opdab4zw', 'cmez5buhc0027vkvsy1aicbxf', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.320Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveop0013vka4dbf4d5e6', 'cmez5bufr000nvkvs5a925es2', 'cmf0l31z80000vk0s10ywj3zp', FALSE, 999, '2025-09-02T12:42:19.034Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk4b0028vki0ii8135wg', 'cmez5bugq001lvkvse0ycua9x', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.323Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk4c002avki0v2g7nvrg', 'cmez5bugf001bvkvs9utg7k5d', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.324Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk4e002cvki0mf4e1wms', 'cmez5bugo001jvkvslr3gsci2', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.326Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk4f002evki063t8p8u5', 'cmez5bugm001hvkvswtop2ezu', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.327Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0klk4g002gvki0edg5zgo4', 'cmez5bugi001dvkvsvl6qxe2v', 'cmf0klk1c0000vki0gy432pcp', FALSE, 0, '2025-09-01T07:39:03.329Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveor0015vka4l0bntuzx', 'cmez5bufr000nvkvs5a925es2', 'cmf08pvb50000vkz04t32pcxq', FALSE, 999, '2025-09-02T12:42:19.036Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveot0017vka4d8ctzy09', 'cmez5buft000pvkvsdwqpwkc5', 'cmf0doopy0000vkbcb6citd6a', FALSE, 999, '2025-09-02T12:42:19.038Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf233jwi000xvk882z8w0d46', 'cmez5bui80033vkvshs0kiawt', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:04:42.114Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf23497a000yvk88tbj5f7y4', 'cmez5bui3002xvkvsn4umf699', 'cmf08pvb50000vkz04t32pcxq', FALSE, 1, '2025-09-02T09:05:14.903Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveov0019vka4f1eqmo25', 'cmez5buft000pvkvsdwqpwkc5', 'cmf0l31z80000vk0s10ywj3zp', FALSE, 999, '2025-09-02T12:42:19.039Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveow001bvka4v1uf31jy', 'cmez5buft000pvkvsdwqpwkc5', 'cmf08pvb50000vkz04t32pcxq', FALSE, 999, '2025-09-02T12:42:19.041Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveoz001dvka4a1eagg7e', 'cmez5bufv000rvkvsq3b7iw35', 'cmf0doopy0000vkbcb6citd6a', FALSE, 999, '2025-09-02T12:42:19.043Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveph001fvka4cgxm8j7n', 'cmez5bufv000rvkvsq3b7iw35', 'cmf0l31z80000vk0s10ywj3zp', FALSE, 999, '2025-09-02T12:42:19.062Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2avepz001hvka4d46r1y9t', 'cmez5bufv000rvkvsq3b7iw35', 'cmf08pvb50000vkz04t32pcxq', FALSE, 999, '2025-09-02T12:42:19.079Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveq1001jvka4czejvg1y', 'cmez5bufk000hvkvspk80r6rp', 'cmf0doopy0000vkbcb6citd6a', FALSE, 999, '2025-09-02T12:42:19.081Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveq2001lvka4t3lqbd4o', 'cmez5bufk000hvkvspk80r6rp', 'cmf0l31z80000vk0s10ywj3zp', FALSE, 999, '2025-09-02T12:42:19.083Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2aveq4001nvka42altttu1', 'cmez5bufk000hvkvspk80r6rp', 'cmf08pvb50000vkz04t32pcxq', FALSE, 999, '2025-09-02T12:42:19.084Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0lfe7e0005vkqgjjq400vt', 'cmf0l31zh0006vk0szbgocarb', 'cmf0lfe6w0001vkqgiubwi9uz', TRUE, 1, '2025-09-01T08:02:15.338Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0lfe7h0007vkqgcrbgvp90', 'cmf0l31zm000avk0sn2us2ca1', 'cmf0lfe6w0001vkqgiubwi9uz', TRUE, 1, '2025-09-01T08:02:15.341Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0lfe7j0009vkqg6xlhbc5x', 'cmf0l31zp000evk0sbt2tojs7', 'cmf0lfe6w0001vkqgiubwi9uz', TRUE, 1, '2025-09-01T08:02:15.344Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0lfe7l000bvkqgbajd5zu1', 'cmf0l31zs000ivk0smgvhtovt', 'cmf0lfe6w0001vkqgiubwi9uz', TRUE, 1, '2025-09-01T08:02:15.346Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0lfe7n000dvkqgsk29nuxn', 'cmf0l31zy000qvk0saes8ra8z', 'cmf0lfe6w0001vkqgiubwi9uz', TRUE, 1, '2025-09-01T08:02:15.347Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf0lfe7q000fvkqg8uv522v9', 'cmf0l3201000uvk0slm026x8y', 'cmf0lfe6w0001vkqgiubwi9uz', TRUE, 1, '2025-09-01T08:02:15.350Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2896ok003qvkq0o1lcm1wz', 'cmf2896oh003pvkq0y570kdx0', 'cmf26thyi002xvkq01n46mw31', FALSE, 0, '2025-09-02T11:29:02.997Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2896ok003rvkq0y5qbaeck', 'cmf2896oh003pvkq0y570kdx0', 'cmf26g4mw002pvkq03xf5r2t1', FALSE, 0, '2025-09-02T11:29:02.997Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf2896ok003svkq0vlh0qpbp', 'cmf2896oh003pvkq0y570kdx0', 'cmez4ylw70003vkvowz7y4tsn', FALSE, 0, '2025-09-02T11:29:02.997Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jnp30000vk7cxsx4kby4', 'cmf0kymu2000avk5g9b5f3kt4', 'cmf0kymvt000svk5g00zjcfdl', FALSE, 1, '2025-09-02T12:05:11.223Z');
INSERT INTO "menu_item_customizations" ("id", "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") VALUES ('cmf29jnp30002vk7cy835dnaq', 'cmf0kymu2000avk5g9b5f3kt4', 'cmf28n7mi003yvkq0k99uuzyp', FALSE, 3, '2025-09-02T12:05:11.223Z');

-- Table: menu_items
DROP TABLE IF EXISTS "menu_items" CASCADE;
CREATE TABLE "menu_items" (
  "id" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "basePrice" DOUBLE PRECISION NOT NULL,
  "imageUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "preparationTime" INTEGER,
  "allergens" TEXT,
  "nutritionInfo" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez4ylz7001avkvowcpcy4ea', 'cmez4xl780003vkwcly8nts4q', 'Chef Salad', 'Ham, turkey, cheese, eggs, tomatoes, and cucumbers on mixed greens', 14.25, NULL, TRUE, TRUE, 4, NULL, NULL, NULL, '2025-08-31T07:33:32.227Z', '2025-09-02T12:36:21.176Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf22ossn000avk88ywzcfgyt', 'cmez4xl780003vkwcly8nts4q', 'Cole Slaw', '', 5.5, NULL, TRUE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T08:53:13.784Z', '2025-09-02T08:53:13.784Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf22pslj000cvk88sk6izvcw', 'cmez4xl780003vkwcly8nts4q', 'Pasta Salad', '', 5.5, NULL, TRUE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T08:54:00.199Z', '2025-09-02T08:54:00.199Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf23xaiy000cvkq0ekts44ni', 'cmez5buf20006vkvsv0wezhi1', 'Regular Fingers (12 pcs)', 'Classic regular Fingers', 23, NULL, TRUE, TRUE, 1006, NULL, NULL, NULL, '2025-09-02T09:27:49.642Z', '2025-09-02T09:31:05.619Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf2570be001uvkq0qnysaenz', 'cmf1pnx7k0009vk58x1j00wur', 'French Fries (large)', 'Fried Mushrooms', 7.5, NULL, TRUE, TRUE, 4001, NULL, NULL, NULL, '2025-09-02T10:03:22.586Z', '2025-09-02T10:07:31.457Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez4ylz7001evkvoo7mcs4ly', 'cmez4xl780003vkwcly8nts4q', 'California Salad', 'Mixed greens, avocado, tomatoes, cucumbers, and balsamic vinaigrette', 12.75, NULL, TRUE, TRUE, 3, NULL, NULL, NULL, '2025-08-31T07:33:32.227Z', '2025-09-02T11:37:00.713Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf23xcdt000gvkq0ga0itt8k', 'cmez5buf20006vkvsv0wezhi1', 'Buffalo Fingers (6 pcs)', 'Sweet and tangy BBQ ', 12.5, NULL, TRUE, TRUE, 2002, NULL, NULL, NULL, '2025-09-02T09:27:52.049Z', '2025-09-02T09:29:30.158Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf25al1g002cvkq0yqm24f0y', 'cmf1pnx7k0009vk58x1j00wur', 'Onion Rings (large)', 'battered onion rings', 7.5, NULL, TRUE, TRUE, 1002, NULL, NULL, NULL, '2025-09-02T10:06:09.412Z', '2025-09-02T10:06:46.549Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0cawzy0002vkccpj8t0hcd', 'cmf0cawz80000vkccemljdoul', 'Super Beef on Onion Roll', 'Premium beef sandwich served on fresh onion roll', 12.55, NULL, TRUE, TRUE, 1, NULL, NULL, NULL, '2025-09-01T03:46:49.870Z', '2025-09-01T03:46:49.870Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0cax050004vkccpmzsgz01', 'cmf0cawz80000vkccemljdoul', 'Regular Beef on Sesame Roll', 'Classic beef sandwich served on sesame roll', 11.55, NULL, TRUE, TRUE, 2, NULL, NULL, NULL, '2025-09-01T03:46:49.878Z', '2025-09-01T03:46:49.878Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0cax090006vkcc6nicnffq', 'cmf0cawz80000vkccemljdoul', 'Junior Beef', 'Smaller portion beef sandwich perfect for lighter appetites', 10.55, NULL, TRUE, TRUE, 3, NULL, NULL, NULL, '2025-09-01T03:46:49.881Z', '2025-09-01T03:46:49.881Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0cax0c0008vkcckefjlktt', 'cmf0cawz80000vkccemljdoul', 'Super Pastrami on Onion Roll', 'Premium pastrami sandwich served on fresh onion roll', 12.55, NULL, TRUE, TRUE, 4, NULL, NULL, NULL, '2025-09-01T03:46:49.884Z', '2025-09-01T03:46:49.884Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0cax0e000avkcc3z2pv3mf', 'cmf0cawz80000vkccemljdoul', 'Regular Pastrami', 'Classic pastrami sandwich on your choice of bread', 11.55, NULL, TRUE, TRUE, 5, NULL, NULL, NULL, '2025-09-01T03:46:49.886Z', '2025-09-01T03:46:49.886Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0cax0g000cvkcc3yucqldr', 'cmf0cawz80000vkccemljdoul', 'Haddock Sandwich (2pcs)', 'Two pieces of fresh haddock served on sesame bun', 16.3, NULL, TRUE, TRUE, 6, NULL, NULL, NULL, '2025-09-01T03:46:49.889Z', '2025-09-01T03:46:49.889Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0cax0j000evkccpkhckphc', 'cmf0cawz80000vkccemljdoul', 'Chicken Sandwich', 'Crispy chicken breast served with lettuce and tomato', 8.55, NULL, TRUE, TRUE, 7, NULL, NULL, NULL, '2025-09-01T03:46:49.891Z', '2025-09-01T03:46:49.891Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0cax0l000gvkccso3qb8to', 'cmf0cawz80000vkccemljdoul', 'Hamburger', 'Classic hamburger with fresh beef patty', 7.8, NULL, TRUE, TRUE, 8, NULL, NULL, NULL, '2025-09-01T03:46:49.893Z', '2025-09-01T03:46:49.893Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0cax0o000ivkcca3j6fhf0', 'cmf0cawz80000vkccemljdoul', 'Cheeseburger', 'Classic hamburger with melted cheese', 8.3, NULL, TRUE, TRUE, 9, NULL, NULL, NULL, '2025-09-01T03:46:49.896Z', '2025-09-01T03:46:49.896Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0cax0q000kvkccfccoae63', 'cmf0cawz80000vkccemljdoul', 'Hot Dog', 'All-beef hot dog served on frankfurter roll', 6.3, NULL, TRUE, TRUE, 10, NULL, NULL, NULL, '2025-09-01T03:46:49.898Z', '2025-09-01T03:46:49.898Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0cax0s000mvkcc28pgk2s4', 'cmf0cawz80000vkccemljdoul', 'Gyro', 'Traditional Greek gyro with lamb and beef, onions, tomatoes and tzatziki sauce', 11.5, NULL, TRUE, TRUE, 11, NULL, NULL, NULL, '2025-09-01T03:46:49.900Z', '2025-09-01T03:46:49.900Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0cax0u000ovkcclyep16m6', 'cmf0cawz80000vkccemljdoul', 'Reuben', 'Classic Reuben with corned beef, sauerkraut, Swiss cheese and thousand island dressing on rye', 12.8, NULL, TRUE, TRUE, 12, NULL, NULL, NULL, '2025-09-01T03:46:49.902Z', '2025-09-01T03:46:49.902Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf23xe7i000kvkq0qudi6y99', 'cmez5buf20006vkvsv0wezhi1', 'BBQ Fingers (12 pcs)', 'Sweet and tangy BBQ Fingers', 23, NULL, TRUE, TRUE, 2002, NULL, NULL, NULL, '2025-09-02T09:27:54.415Z', '2025-09-02T09:36:45.329Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf25rmyb002jvkq0q7k9kjv1', 'cmez5buf50008vkvsbnhrhccb', 'Haddock Chowder', 'Creamy clam chowder with tender clams and potatoes', 10, NULL, TRUE, TRUE, 1001, NULL, NULL, NULL, '2025-09-02T10:19:25.044Z', '2025-09-02T10:22:50.866Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf24skss000vvkq0y84brlq9', 'cmf1pnx7k0009vk58x1j00wur', 'Fried Raviolis ', 'Fried Raviolis', 9.5, NULL, TRUE, TRUE, 1001, NULL, NULL, NULL, '2025-09-02T09:52:09.292Z', '2025-09-02T09:52:59.367Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf25wi8c002lvkq0tsshzk16', 'cmez5buf50008vkvsbnhrhccb', 'Cup of Chili', '', 7.5, NULL, TRUE, TRUE, 1001, NULL, NULL, NULL, '2025-09-02T10:23:12.204Z', '2025-09-02T10:24:50.985Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0kymu2000avk5g9b5f3kt4', 'cmf0llm9o0002vkk8ah0l3w9l', 'Scallops', 'Fresh scallops box', 27, NULL, TRUE, TRUE, 2, NULL, NULL, NULL, '2025-09-01T07:49:13.371Z', '2025-09-02T12:05:11.218Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez527ch0018vk8032m02431', 'cmez4xl780003vkwcly8nts4q', 'Salad with Lobster', 'Fresh mixed greens, with our local lobster', 39, NULL, TRUE, TRUE, 7, NULL, NULL, NULL, '2025-08-31T07:36:19.889Z', '2025-09-02T12:31:10.769Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf237uan0011vk88f0katf7g', 'cmez5buf00005vkvso9m4c4xj', 'Buffalo Wings (6 pcs)', 'Sweet and tangy BBQ wings', 12.5, NULL, TRUE, TRUE, 1002, NULL, NULL, NULL, '2025-09-02T09:08:02.208Z', '2025-09-02T09:08:58.394Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf24ueki0010vkq0m620k5bu', 'cmf1pnx7k0009vk58x1j00wur', 'Fried Mushrooms', 'Fried Mushrooms', 9.5, NULL, TRUE, TRUE, 2001, NULL, NULL, NULL, '2025-09-02T09:53:34.530Z', '2025-09-02T09:53:47.954Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf25wmfm002nvkq03z4gq4ea', 'cmez5buf50008vkvsbnhrhccb', 'Chicken Noodle', '', 7.5, NULL, TRUE, TRUE, 2001, NULL, NULL, NULL, '2025-09-02T10:23:17.650Z', '2025-09-02T10:24:34.701Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez4ylz7001cvkvoyc2xmwxy', 'cmez4xl780003vkwcly8nts4q', 'Caesar Salad', 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing', 12.5, NULL, TRUE, TRUE, 2, NULL, NULL, NULL, '2025-08-31T07:33:32.227Z', '2025-09-02T11:36:23.156Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0kymsi0006vk5gyp8abnrw', 'cmf0llm9o0002vkk8ah0l3w9l', 'Native Clams', 'Fresh native clams box', 29, NULL, TRUE, TRUE, 1, NULL, NULL, NULL, '2025-09-01T07:49:13.314Z', '2025-09-01T08:07:35.166Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0kymv2000evk5gecv43nyi', 'cmf0llm9o0002vkk8ah0l3w9l', 'Strip Clams', 'Fresh strip clams box', 16, NULL, TRUE, TRUE, 3, NULL, NULL, NULL, '2025-09-01T07:49:13.407Z', '2025-09-01T08:07:35.179Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0kymv8000ivk5gtwrp5ro4', 'cmf0llm9o0002vkk8ah0l3w9l', 'Shrimps', 'Fresh shrimp box', 18.5, NULL, TRUE, TRUE, 4, NULL, NULL, NULL, '2025-09-01T07:49:13.412Z', '2025-09-01T08:07:35.186Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf23bzgf0016vk88w5s74h2s', 'cmez5buf00005vkvso9m4c4xj', 'BBQ Wings (12 pcs)', 'Classic regular wings', 23, NULL, TRUE, TRUE, 1006, NULL, NULL, NULL, '2025-09-02T09:11:15.520Z', '2025-09-02T09:21:33.014Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf24vzqk0015vkq06atrczo6', 'cmf1pnx7k0009vk58x1j00wur', 'Mozzarella Sticks', 'Mozzarella Sticks ', 9.5, NULL, TRUE, TRUE, 3001, NULL, NULL, NULL, '2025-09-02T09:54:48.620Z', '2025-09-02T09:55:07.145Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf2896oh003pvkq0y570kdx0', 'cmf283ib1003nvkq0tvwy17r3', 'Build Your Salad', 'Select salad bed, protein, and dressing', 9.75, NULL, TRUE, TRUE, 0, NULL, NULL, NULL, '2025-09-02T11:29:02.994Z', '2025-09-02T11:29:02.994Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bufx000tvkvs3psh4hyl', 'cmez5bueu0001vkvsuragc8gi', 'Sea Monster (Scallops, Clams, Shrimps & Haddock)', 'Fresh Haddock, scallops, shrimps and clams it is HUGE good for two people, comes with french fries, onion rings and a side of coleslaw or pasta salad', 48, NULL, TRUE, TRUE, 1, NULL, NULL, NULL, '2025-08-31T07:43:49.725Z', '2025-09-02T11:44:44.597Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buff000dvkvsaexqwttc', 'cmez5buep0000vkvs74qojdfm', 'Hamburger Plate', 'Juicy hamburger patty with lettuce, tomato, onion, served with fries', 14.99, NULL, TRUE, TRUE, 2, NULL, NULL, NULL, '2025-08-31T07:43:49.707Z', '2025-08-31T07:43:49.707Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bufh000fvkvscpxd5o66', 'cmez5buep0000vkvs74qojdfm', 'Cheeseburger Plate', 'Hamburger with American cheese, lettuce, tomato, onion, served with fries', 15.99, NULL, TRUE, TRUE, 3, NULL, NULL, NULL, '2025-08-31T07:43:49.709Z', '2025-08-31T07:43:49.709Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bufm000jvkvsxckws9nb', 'cmez5buep0000vkvs74qojdfm', 'Chicken Wings Plate', '8 pieces of chicken wings with fries and coleslaw', 15.99, NULL, TRUE, TRUE, 5, NULL, NULL, NULL, '2025-08-31T07:43:49.715Z', '2025-08-31T07:43:49.715Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bufp000lvkvs2gz0d9ii', 'cmez5buep0000vkvs74qojdfm', 'Chicken Fingers Plate', 'Chicken fingers with fries and choice of dipping sauce', 14.99, NULL, TRUE, TRUE, 6, NULL, NULL, NULL, '2025-08-31T07:43:49.717Z', '2025-08-31T07:43:49.717Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bufr000nvkvs5a925es2', 'cmez5buep0000vkvs74qojdfm', 'Roast Beef Plate', 'Sliced roast beef with mashed potatoes and gravy', 16.99, NULL, TRUE, TRUE, 7, NULL, NULL, NULL, '2025-08-31T07:43:49.719Z', '2025-08-31T07:43:49.719Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buft000pvkvsdwqpwkc5', 'cmez5buep0000vkvs74qojdfm', 'Steak Tip Kabob Plate', 'Grilled steak tips with rice, salad, and tzatziki sauce', 18.99, NULL, TRUE, TRUE, 8, NULL, NULL, NULL, '2025-08-31T07:43:49.721Z', '2025-08-31T07:43:49.721Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bufv000rvkvsq3b7iw35', 'cmez5buep0000vkvs74qojdfm', 'Fish ''n Chips', 'Beer-battered haddock with fries and coleslaw', 15.99, NULL, TRUE, TRUE, 9, NULL, NULL, NULL, '2025-08-31T07:43:49.723Z', '2025-08-31T07:43:49.723Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bug1000xvkvsytz35wfc', 'cmez5bueu0001vkvsuragc8gi', 'Haddock Plate', 'A huge piece of haddock fish on a bed of french fries and onion rings and a choice of pasta or coleslaw', 35.5, NULL, TRUE, TRUE, 3, NULL, NULL, NULL, '2025-08-31T07:43:49.730Z', '2025-09-02T12:06:04.467Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf23x2l00004vkq04uywrd85', 'cmez5buf20006vkvsv0wezhi1', 'BBQ Fingers (6 pcs)', 'Sweet and tangy BBQ Fingers', 12.5, NULL, TRUE, TRUE, 1002, NULL, NULL, NULL, '2025-09-02T09:27:39.348Z', '2025-09-02T09:33:44.131Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bufb000bvkvsvxlcblte', 'cmez5buep0000vkvs74qojdfm', 'Gyro Plate', 'Traditional Greek gyro with tzatziki sauce, served with fries and Greek salad', 17.25, NULL, TRUE, TRUE, 1, NULL, NULL, NULL, '2025-08-31T07:43:49.704Z', '2025-09-02T12:42:17.163Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf251n5m001cvkq02mypho7f', 'cmf1pnx7k0009vk58x1j00wur', 'Spinach Egg Roll', 'Spinach Egg Roll', 5, NULL, TRUE, TRUE, 1002, NULL, NULL, NULL, '2025-09-02T09:59:12.251Z', '2025-09-02T10:00:13.148Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bufk000hvkvspk80r6rp', 'cmez5buep0000vkvs74qojdfm', 'Chicken Kabob Plate', 'Grilled chicken kabob with rice, salad, and tzatziki sauce', 13.74, NULL, TRUE, TRUE, 4, NULL, NULL, NULL, '2025-08-31T07:43:49.713Z', '2025-09-01T01:45:56.451Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bug3000zvkvshe0vwnu8', 'cmez5bueu0001vkvsuragc8gi', '2-way Scallops & Clams Plate', 'Best of the Sea.. scallops and Native clams, piled on onion rings and french fries with a choice of coleslaw or pasta salad', 39.5, NULL, TRUE, TRUE, 4, NULL, NULL, NULL, '2025-08-31T07:43:49.732Z', '2025-09-01T04:25:31.930Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bug50011vkvs330um4k1', 'cmez5bueu0001vkvsuragc8gi', '3-way Shrimps, Scallops & Clams Plate', 'A fresh pile of shrimps, scallops and clams piled on onion rings and french fries with a side of coleslaw or pasta salad', 40.95, NULL, TRUE, TRUE, 5, NULL, NULL, NULL, '2025-08-31T07:43:49.734Z', '2025-09-01T04:25:31.931Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bufz000vvkvssfm47yoi', 'cmez5bueu0001vkvsuragc8gi', 'Scallops Plate', 'A plate of scallops fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad', 43.5, NULL, TRUE, TRUE, 2, NULL, NULL, NULL, '2025-08-31T07:43:49.728Z', '2025-09-01T04:25:31.927Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bug70013vkvs6aw3qmtk', 'cmez5bueu0001vkvsuragc8gi', 'Strip Clams Plate', 'Strip clams deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad', 23.5, NULL, TRUE, TRUE, 6, NULL, NULL, NULL, '2025-08-31T07:43:49.736Z', '2025-09-01T04:25:31.933Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bug90015vkvsh9ihifu1', 'cmez5bueu0001vkvsuragc8gi', 'Shrimps Plate', 'Fresh shrimps deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad', 26.5, NULL, TRUE, TRUE, 7, NULL, NULL, NULL, '2025-08-31T07:43:49.738Z', '2025-09-01T04:25:31.935Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bugb0017vkvs8vxrv5iw', 'cmez5bueu0001vkvsuragc8gi', 'Native Clams Plate', 'Fresh locally sourced clams with an option of pasta salad or coleslaw on a bed of french fries and onion rings', 44, NULL, TRUE, TRUE, 8, NULL, NULL, NULL, '2025-08-31T07:43:49.739Z', '2025-09-01T04:25:31.938Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bui80033vkvshs0kiawt', 'cmez5buf00005vkvso9m4c4xj', 'Regular Wings (12 pcs)', 'Classic regular wings', 23, NULL, TRUE, TRUE, 6, NULL, NULL, NULL, '2025-08-31T07:43:49.809Z', '2025-09-02T09:04:42.111Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0kz13z0006vkg4nqr2kpbj', 'cmf0llm9o0002vkk8ah0l3w9l', 'Native Clams', 'Fresh native clams box', 29, NULL, TRUE, TRUE, 1, NULL, NULL, NULL, '2025-09-01T07:49:31.872Z', '2025-09-02T11:47:11.204Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bui3002xvkvsn4umf699', 'cmez5buf00005vkvso9m4c4xj', 'Regular Wings (6 pcs)', 'Classic regular wings', 12.5, NULL, TRUE, TRUE, 3, NULL, NULL, NULL, '2025-08-31T07:43:49.803Z', '2025-09-02T09:05:14.901Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bui5002zvkvspubn8tcx', 'cmez5buf00005vkvso9m4c4xj', 'Buffalo Wings (12 pcs)', 'Classic buffalo wings with hot sauce', 23, NULL, TRUE, TRUE, 4, NULL, NULL, NULL, '2025-08-31T07:43:49.805Z', '2025-09-02T09:22:54.128Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf23x5cr0006vkq0ijin4rtq', 'cmez5buf20006vkvsv0wezhi1', 'Regular Fingers (6 pcs)', 'Classic regular wings', 12.5, NULL, TRUE, TRUE, 1003, NULL, NULL, NULL, '2025-09-02T09:27:42.939Z', '2025-09-02T09:28:37.033Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buij003dvkvsofytltn1', 'cmf1pnx7k0009vk58x1j00wur', 'Onion Rings', 'battered onion rings', 6.5, NULL, TRUE, TRUE, 2, NULL, NULL, NULL, '2025-08-31T07:43:49.819Z', '2025-09-02T09:57:43.140Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf253ief001ivkq0ncp320fv', 'cmf1pnx7k0009vk58x1j00wur', ' Egg Roll', 'Egg Roll', 5, NULL, TRUE, TRUE, 2002, NULL, NULL, NULL, '2025-09-02T10:00:39.399Z', '2025-09-02T10:00:58.276Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buir003lvkvstoqgn5ml', 'cmez5buf50008vkvsbnhrhccb', 'New England Clam Chowder', 'Creamy clam chowder with tender clams and potatoes', 10, NULL, TRUE, TRUE, 1, NULL, NULL, NULL, '2025-08-31T07:43:49.827Z', '2025-09-02T10:18:52.540Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buhf0029vkvs95vr1a6m', 'cmez5buex0003vkvs8abknm9j', 'Chicken Salad', 'Roasted chicken salad, all we add is mayonnaise so you can taste the chicken. add to it as you need from a variety of condiments or toppings', 12.74, NULL, TRUE, TRUE, 6, NULL, NULL, NULL, '2025-08-31T07:43:49.779Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buhh002bvkvsqef86gvy', 'cmez5buex0003vkvs8abknm9j', 'Crab Meat', 'Crab meat salad, select your size and your type of bread', 12.74, NULL, TRUE, TRUE, 7, NULL, NULL, NULL, '2025-08-31T07:43:49.781Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buhj002dvkvs2wlo8w8h', 'cmez5buex0003vkvs8abknm9j', 'Veggie Sub', 'Cold veggies sub, loaded with lettuce, tomatoes, green peppers, cucumbers, black olives, onions', 12.74, NULL, TRUE, TRUE, 8, NULL, NULL, NULL, '2025-08-31T07:43:49.783Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buhl002fvkvs101lksxm', 'cmez5buex0003vkvs8abknm9j', 'Turkey Sub', 'Turkey sub with or without cheese but you can add veggies', 12.74, NULL, TRUE, TRUE, 9, NULL, NULL, NULL, '2025-08-31T07:43:49.785Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buhn002hvkvsfy7fj8g9', 'cmez5buex0003vkvs8abknm9j', 'BLT Sub', 'We can spell too yes it is...Bacon, Lettuce and Tomatoes. add other toppings as well.', 12.74, NULL, TRUE, TRUE, 10, NULL, NULL, NULL, '2025-08-31T07:43:49.787Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buhp002jvkvs1ar0eppl', 'cmez5buey0004vkvs8ypqlpri', 'Steak Bomb', 'Steak and Cheese with Grilled peppers, Onions, mushrooms and american cheese', 12.74, NULL, TRUE, TRUE, 1, NULL, NULL, NULL, '2025-08-31T07:43:49.789Z', '2025-09-01T03:36:18.650Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buhq002lvkvsp6t5damr', 'cmez5buey0004vkvs8ypqlpri', 'Pepper Cheese Steak', 'Steak and Cheese with Grilled peppers', 12.25, NULL, TRUE, TRUE, 2, NULL, NULL, NULL, '2025-08-31T07:43:49.791Z', '2025-09-01T03:36:18.654Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buhv002pvkvs92heqdfm', 'cmez5buey0004vkvs8ypqlpri', 'Mushroom Cheese Steak', 'Steak and Cheese with Mushroom', 12.25, NULL, TRUE, TRUE, 4, NULL, NULL, NULL, '2025-08-31T07:43:49.795Z', '2025-09-01T03:36:18.656Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buhx002rvkvs1n6haty2', 'cmez5buey0004vkvs8ypqlpri', 'Steak Sub Build Your Own', 'Select the size of your sub starts with the shaved steaks and add your cheese, toppings and condiments', 12.25, NULL, TRUE, TRUE, 5, NULL, NULL, NULL, '2025-08-31T07:43:49.797Z', '2025-09-01T03:36:18.646Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buhs002nvkvs686iuiqw', 'cmez5buey0004vkvs8ypqlpri', 'Onion Cheese Steak', 'Steak and Cheese with Grilled onions', 12.25, NULL, TRUE, TRUE, 3, NULL, NULL, NULL, '2025-08-31T07:43:49.793Z', '2025-09-01T03:36:18.652Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0kz147000avkg4lcptf42p', 'cmf0llm9o0002vkk8ah0l3w9l', 'Scallops', 'Fresh scallops box', 27, NULL, TRUE, TRUE, 2, NULL, NULL, NULL, '2025-09-01T07:49:31.879Z', '2025-09-01T08:07:35.175Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0kz14a000evkg4fvz7l8ax', 'cmf0llm9o0002vkk8ah0l3w9l', 'Strip Clams', 'Fresh strip clams box', 16, NULL, TRUE, TRUE, 3, NULL, NULL, NULL, '2025-09-01T07:49:31.883Z', '2025-09-01T08:07:35.182Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0kz14e000ivkg4fpi95zfv', 'cmf0llm9o0002vkk8ah0l3w9l', 'Shrimps', 'Fresh shrimp box', 18.5, NULL, TRUE, TRUE, 4, NULL, NULL, NULL, '2025-09-01T07:49:31.886Z', '2025-09-01T08:07:35.188Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bui1002vvkvsu8xtp50l', 'cmez5buf00005vkvso9m4c4xj', 'BBQ Wings (6 pcs)', 'Sweet and tangy BBQ wings', 12.5, NULL, TRUE, TRUE, 2, NULL, NULL, NULL, '2025-08-31T07:43:49.801Z', '2025-09-01T12:11:30.890Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez4ylz7001jvkvorf8gutkb', 'cmez4xl780003vkwcly8nts4q', 'Greek Salad', 'Fresh romaine lettuce, tomatoes, cucumbers, red onions, Kalamata olives, and feta cheese', 12.25, NULL, TRUE, TRUE, 1, NULL, NULL, NULL, '2025-08-31T07:33:32.227Z', '2025-09-02T08:46:02.410Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0l31zw000mvk0sassix80k', 'cmf0llm9r0004vkk848mn4a93', 'Lobster Roll', 'Fresh New England Lobster roll with an option of Onion Rings or French fries (Seasonal)', 41, NULL, TRUE, TRUE, 15, NULL, NULL, 'Seasonal availability - please ask about current availability', '2025-09-01T07:52:39.644Z', '2025-09-02T11:58:38.390Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf23x7tz000avkq0qwdluiuz', 'cmez5buf20006vkvsv0wezhi1', 'Buffalo Fingers (12 pcs)', 'Classic buffalo fingers with hot sauce', 23, NULL, TRUE, TRUE, 1004, NULL, NULL, NULL, '2025-09-02T09:27:46.151Z', '2025-09-02T09:30:21.327Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bugd0019vkvss1syr7lw', 'cmez5buew0002vkvs0misx39j', 'Build your Own Roast Beef Sub', 'Start by choosing size sub, and add toppings', 12.74, NULL, TRUE, TRUE, 1, NULL, NULL, NULL, '2025-08-31T07:43:49.741Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bugs001nvkvsg4st51kb', 'cmez5buew0002vkvs0misx39j', 'Meat Ball Sub', 'Meatballs in marinara sauce with your choice of no cheese or one of many options we have to offer', 12.74, NULL, TRUE, TRUE, 8, NULL, NULL, NULL, '2025-08-31T07:43:49.756Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bugt001pvkvshj4za05r', 'cmez5buew0002vkvs0misx39j', 'Hot Pastrami', 'Pastrami in a warp or a 10" sub with options to make it your own', 12.74, NULL, TRUE, TRUE, 9, NULL, NULL, NULL, '2025-08-31T07:43:49.758Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bugw001rvkvszj8ensiv', 'cmez5buew0002vkvs0misx39j', 'Hot Veggies', 'Fresh made to order Grilled Veggies, (grilled Mushroom, peppers and onions)', 12.74, NULL, TRUE, TRUE, 10, NULL, NULL, NULL, '2025-08-31T07:43:49.760Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bugz001tvkvsin6tvpm5', 'cmez5buew0002vkvs0misx39j', 'Eggplant', 'Fresh made to order Eggplant, you can choose it in a wrap or a sub roll', 12.74, NULL, TRUE, TRUE, 11, NULL, NULL, NULL, '2025-08-31T07:43:49.763Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buh0001vvkvsxlvetfm6', 'cmez5buew0002vkvs0misx39j', 'Veal Cutlet', 'Fresh made to order Veal cutlet, you can choose it in a wrap or a sub roll', 12.74, NULL, TRUE, TRUE, 12, NULL, NULL, NULL, '2025-08-31T07:43:49.765Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buh2001xvkvsnhog34dl', 'cmez5buew0002vkvs0misx39j', 'Sausage sub', 'Fresh made to order Sausage, you can choose it in a wrap or a sub roll', 12.74, NULL, TRUE, TRUE, 13, NULL, NULL, NULL, '2025-08-31T07:43:49.767Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buh4001zvkvsodoxnl83', 'cmez5buex0003vkvs8abknm9j', 'Italian Sub', 'Mortadella, salami and hot ham with provolone cheese, add oil and vinegar, pickles and hots', 12.74, NULL, TRUE, TRUE, 1, NULL, NULL, NULL, '2025-08-31T07:43:49.769Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buh60021vkvsx6pjsrsl', 'cmez5buex0003vkvs8abknm9j', 'American Sub', 'American Sub with Ham, Mortadella and American cheese.', 12.74, NULL, TRUE, TRUE, 2, NULL, NULL, NULL, '2025-08-31T07:43:49.770Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buh80023vkvsyejru7y7', 'cmez5buex0003vkvs8abknm9j', 'Imported Ham', 'Imported Ham add cheese and veggies to make it your way', 12.74, NULL, TRUE, TRUE, 3, NULL, NULL, NULL, '2025-08-31T07:43:49.772Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buha0025vkvss8g1oejt', 'cmez5buex0003vkvs8abknm9j', 'Genoa Salami Sub', 'Imported Genoa Salami with many options to customize', 12.74, NULL, TRUE, TRUE, 4, NULL, NULL, NULL, '2025-08-31T07:43:49.774Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5buhc0027vkvsy1aicbxf', 'cmez5buex0003vkvs8abknm9j', 'Tuna Salad', 'Homemade tuna salad no additives and no crazy things it is basic but add condiments, cheese and veggies and spice it up', 12.74, NULL, TRUE, TRUE, 5, NULL, NULL, NULL, '2025-08-31T07:43:49.776Z', '2025-09-01T01:16:20.212Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bugq001lvkvse0ycua9x', 'cmez5buew0002vkvs0misx39j', 'Chicken Caesar Wrap', 'Fresh made to order Grilled Chicken, you can choose the type of wrap.', 15.25, NULL, TRUE, TRUE, 7, NULL, NULL, NULL, '2025-08-31T07:43:49.754Z', '2025-09-01T01:27:39.130Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf254y9l001nvkq028daxm2u', 'cmf1pnx7k0009vk58x1j00wur', 'French Fries (small)', 'Fried Mushrooms', 6.5, NULL, TRUE, TRUE, 3001, NULL, NULL, NULL, '2025-09-02T10:01:46.618Z', '2025-09-02T10:07:45.470Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bugf001bvkvs9utg7k5d', 'cmez5buew0002vkvs0misx39j', 'Chicken Cutlet Sub', 'Chicken cutlet in special batter fried in a large sub roll.', 13, NULL, TRUE, TRUE, 2, NULL, NULL, NULL, '2025-08-31T07:43:49.744Z', '2025-09-01T01:48:45.993Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bugo001jvkvslr3gsci2', 'cmez5buew0002vkvs0misx39j', 'Chicken Fingers/tenders', 'Fresh made to order Chicken fingers, you can choose it in a wrap or a sub roll', 13, NULL, TRUE, TRUE, 6, NULL, NULL, NULL, '2025-08-31T07:43:49.752Z', '2025-09-01T01:48:45.999Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bugm001hvkvswtop2ezu', 'cmez5buew0002vkvs0misx39j', 'Cheese Burger', 'Fresh made to order 2-patty cheese burger, you can choose it in a wrap or a sub roll', 13, NULL, TRUE, TRUE, 5, NULL, NULL, NULL, '2025-08-31T07:43:49.750Z', '2025-09-01T01:48:46.009Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bugi001dvkvsvl6qxe2v', 'cmez5buew0002vkvs0misx39j', 'Grilled Chicken Kabob', 'Fresh made to order Grilled Chicken, you can choose it in a wrap or a sub roll', 13.74, NULL, TRUE, TRUE, 3, NULL, NULL, NULL, '2025-08-31T07:43:49.747Z', '2025-09-01T01:48:46.015Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0l31zh0006vk0szbgocarb', 'cmf0llm9r0004vkk848mn4a93', 'Native Clams Roll', 'Locally sourced native clams on a bed of French fries or Onion rings', 33, NULL, TRUE, TRUE, 11, NULL, NULL, NULL, '2025-09-01T07:52:39.630Z', '2025-09-01T08:07:35.193Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0l31zm000avk0sn2us2ca1', 'cmf0llm9r0004vkk848mn4a93', 'Scallop Roll', 'Scallops locally sourced on a bed of French fries or Onion Rings', 33, NULL, TRUE, TRUE, 12, NULL, NULL, NULL, '2025-09-01T07:52:39.634Z', '2025-09-01T08:07:35.195Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0l31zp000evk0sbt2tojs7', 'cmf0llm9r0004vkk848mn4a93', 'Strip Clams Roll', 'Fresh strip clams on a roll with choice of French fries or Onion rings', 18.5, NULL, TRUE, TRUE, 13, NULL, NULL, NULL, '2025-09-01T07:52:39.637Z', '2025-09-01T08:07:35.197Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0l31zs000ivk0smgvhtovt', 'cmf0llm9r0004vkk848mn4a93', 'Shrimp Roll', 'Locally sourced shrimps on a bed of French fries or Onion Rings', 20.5, NULL, TRUE, TRUE, 14, NULL, NULL, NULL, '2025-09-01T07:52:39.641Z', '2025-09-01T08:07:35.200Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0l31zy000qvk0saes8ra8z', 'cmf0llm9r0004vkk848mn4a93', 'Tuna Roll', 'Tuna Salad on a roll with an option of onion rings or french fries', 13.99, NULL, TRUE, TRUE, 16, NULL, NULL, NULL, '2025-09-01T07:52:39.646Z', '2025-09-01T08:07:35.201Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmf0l3201000uvk0slm026x8y', 'cmf0llm9r0004vkk848mn4a93', 'Crab Meat Roll', 'Crab meat on a roll with option of Fries or Onion Rings', 13.99, NULL, TRUE, TRUE, 17, NULL, NULL, NULL, '2025-09-01T07:52:39.649Z', '2025-09-01T08:07:35.203Z');
INSERT INTO "menu_items" ("id", "categoryId", "name", "description", "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", "allergens", "nutritionInfo", "createdAt", "updatedAt") VALUES ('cmez5bugk001fvkvs8jtn5du0', 'cmez5buew0002vkvs0misx39j', 'Steak Tips Kabob', 'Fresh made to order Grilled Steak tips, you can choose it in a wrap or a sub roll', 16.75, NULL, TRUE, TRUE, 1, NULL, NULL, NULL, '2025-08-31T07:43:49.749Z', '2025-09-02T03:58:22.010Z');

-- Table: modifiers
DROP TABLE IF EXISTS "modifiers" CASCADE;
CREATE TABLE "modifiers" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" USER-DEFINED NOT NULL,
  "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Table: order_item_customizations
DROP TABLE IF EXISTS "order_item_customizations" CASCADE;
CREATE TABLE "order_item_customizations" (
  "id" TEXT NOT NULL,
  "orderItemId" TEXT NOT NULL,
  "customizationOptionId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "price" DOUBLE PRECISION NOT NULL,
  "pizzaHalf" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "order_item_customizations" ("id", "orderItemId", "customizationOptionId", "quantity", "price", "pizzaHalf", "createdAt") VALUES ('cmez71q9y002jvk60m41xxtno', 'cmez71q9v002hvk609w7x1wqv', 'cmez4ylyu000pvkvouuz9ap6r', 1, 1.99, NULL, '2025-08-31T08:31:56.999Z');
INSERT INTO "order_item_customizations" ("id", "orderItemId", "customizationOptionId", "quantity", "price", "pizzaHalf", "createdAt") VALUES ('cmf084pj10005vkhce6v430lb', 'cmf084piu0003vkhcmcky4bso', 'cmf07bxjn0006vkv8l7et6vko', 1, 0, NULL, '2025-09-01T01:50:01.790Z');
INSERT INTO "order_item_customizations" ("id", "orderItemId", "customizationOptionId", "quantity", "price", "pizzaHalf", "createdAt") VALUES ('cmf0e2ona0005vkvcek12ds4o', 'cmf0e2on20003vkvcc1uu86k6', 'cmf0dudnr0001vkjwmeeto4hp', 1, 0, NULL, '2025-09-01T04:36:25.030Z');
INSERT INTO "order_item_customizations" ("id", "orderItemId", "customizationOptionId", "quantity", "price", "pizzaHalf", "createdAt") VALUES ('cmf0e2ond0007vkvckjbq6ijh', 'cmf0e2on20003vkvcc1uu86k6', 'cmf0dooqj0007vkbcz8vw554e', 1, 0, NULL, '2025-09-01T04:36:25.033Z');
INSERT INTO "order_item_customizations" ("id", "orderItemId", "customizationOptionId", "quantity", "price", "pizzaHalf", "createdAt") VALUES ('cmf1l6koi000dvkskczkmneoc', 'cmf1l6koe000bvkskmin9u3b1', 'cmf0klk1j0002vki0navxncgu', 1, 2, NULL, '2025-09-02T00:43:10.003Z');
INSERT INTO "order_item_customizations" ("id", "orderItemId", "customizationOptionId", "quantity", "price", "pizzaHalf", "createdAt") VALUES ('cmf1l6kol000fvkskh4yarlum', 'cmf1l6koe000bvkskmin9u3b1', 'cmf07bxjl0004vkv8fj0fh19s', 1, 1, NULL, '2025-09-02T00:43:10.006Z');
INSERT INTO "order_item_customizations" ("id", "orderItemId", "customizationOptionId", "quantity", "price", "pizzaHalf", "createdAt") VALUES ('cmf1luvas0005vk4ojowpwcen', 'cmf1luvan0003vk4ogu7mtc0d', 'cmf06ou8e0002vkq477o75rr7', 1, 0, NULL, '2025-09-02T01:02:03.509Z');
INSERT INTO "order_item_customizations" ("id", "orderItemId", "customizationOptionId", "quantity", "price", "pizzaHalf", "createdAt") VALUES ('cmf1lybu2000dvk4owfy4p6bz', 'cmf1lybtz000bvk4olqowb86p', 'cmez4ylwn000avkvoem5xnd9y', 1, 0, NULL, '2025-09-02T01:04:44.906Z');

-- Table: order_item_toppings
DROP TABLE IF EXISTS "order_item_toppings" CASCADE;
CREATE TABLE "order_item_toppings" (
  "id" TEXT NOT NULL,
  "orderItemId" TEXT NOT NULL,
  "pizzaToppingId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "section" TEXT NOT NULL DEFAULT 'WHOLE'::text,
  "intensity" TEXT NOT NULL DEFAULT 'REGULAR'::text,
  "price" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "order_item_toppings" ("id", "orderItemId", "pizzaToppingId", "quantity", "section", "intensity", "price", "createdAt") VALUES ('cmezdi7je0004vk68axnk09of', 'cmezdi7j60003vk68h3sznenr', 'cmez57ctq000pvkc41cp4qe5p', 1, 'WHOLE', 'REGULAR', 2, '2025-08-31T11:32:43.562Z');
INSERT INTO "order_item_toppings" ("id", "orderItemId", "pizzaToppingId", "quantity", "section", "intensity", "price", "createdAt") VALUES ('cmf06d16i0004vkignokte6zm', 'cmf06d1670003vkig06bge9uc', 'cmez57ctp000nvkc48fy737nq', 1, 'WHOLE', 'REGULAR', 2, '2025-09-01T01:00:30.906Z');
INSERT INTO "order_item_toppings" ("id", "orderItemId", "pizzaToppingId", "quantity", "section", "intensity", "price", "createdAt") VALUES ('cmf0is4160004vkl8o4wun6h8', 'cmf0is3zq0003vkl85pz1zzr0', 'cmez57ctp000nvkc48fy737nq', 1, 'WHOLE', 'REGULAR', 2, '2025-09-01T06:48:09.834Z');
INSERT INTO "order_item_toppings" ("id", "orderItemId", "pizzaToppingId", "quantity", "section", "intensity", "price", "createdAt") VALUES ('cmf0is4160005vkl84bjppt4h', 'cmf0is3zq0003vkl85pz1zzr0', 'cmez57ctc0008vkc4gno2jo9r', 1, 'RIGHT', 'REGULAR', 2, '2025-09-01T06:48:09.834Z');

-- Table: order_items
DROP TABLE IF EXISTS "order_items" CASCADE;
CREATE TABLE "order_items" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "pizzaSizeId" TEXT,
  "pizzaCrustId" TEXT,
  "pizzaSauceId" TEXT,
  "menuItemId" TEXT,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "basePrice" DOUBLE PRECISION NOT NULL,
  "totalPrice" DOUBLE PRECISION NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  "itemType" USER-DEFINED NOT NULL DEFAULT 'PIZZA'::"OrderItemType",
  "specialtyCalzoneId" TEXT,
  "specialtyPizzaId" TEXT
);

INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmez71q980025vk60l0i5wkps', 'cmez71q930023vk60eh0tw6ip', 'cmez5n8nn0001vk3kjqe0zbsp', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct10002vkc4dd3k6gig', NULL, 1, 22, 22, 'Large Calzone Regular with Pizza Sauce', '2025-08-31T08:31:56.972Z', '2025-08-31T08:31:56.972Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmez71q9c0027vk60cq8t35vo', 'cmez71q930023vk60eh0tw6ip', 'cmez5n8nn0001vk3kjqe0zbsp', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct40004vkc4ndh8iu2b', NULL, 1, 29.99, 29.99, 'Large Calzone Regular with Garlic Butter Sauce', '2025-08-31T08:31:56.976Z', '2025-08-31T08:31:56.976Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmez71q9e0029vk60copcqebl', 'cmez71q930023vk60eh0tw6ip', 'cmez57csy0001vkc4fbtoets6', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct10002vkc4dd3k6gig', NULL, 1, 23.5, 23.5, 'Large Pizza Regular with Pizza Sauce', '2025-08-31T08:31:56.979Z', '2025-08-31T08:31:56.979Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmez71q9g002bvk60rykofmoe', 'cmez71q930023vk60eh0tw6ip', 'cmez57csy0001vkc4fbtoets6', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct10002vkc4dd3k6gig', NULL, 1, 23.5, 23.5, 'Large Pizza Regular with Pizza Sauce', '2025-08-31T08:31:56.980Z', '2025-08-31T08:31:56.980Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmez71q9i002dvk60owbdju1a', 'cmez71q930023vk60eh0tw6ip', 'cmez5n8nl0000vk3k7n5edmea', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct40004vkc4ndh8iu2b', NULL, 1, 23, 23, 'Small Calzone Regular with Garlic Butter Sauce', '2025-08-31T08:31:56.982Z', '2025-08-31T08:31:56.982Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmez71q9n002fvk607yl7eq4q', 'cmez71q930023vk60eh0tw6ip', NULL, NULL, NULL, 'cmez5bufx000tvkvs3psh4hyl', 1, 27.5, 27.5, '**Scallops** (seafood-boxes) | Customization | Customization', '2025-08-31T08:31:56.987Z', '2025-08-31T08:31:56.987Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmez7rtft0003vk6c7o66dohe', 'cmez7rtfj0001vk6cp40pfe9r', 'cmez57csy0001vkc4fbtoets6', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct40004vkc4ndh8iu2b', NULL, 1, 23.5, 23.5, 'Large Pizza Regular with Garlic Butter Sauce', '2025-08-31T08:52:14.153Z', '2025-08-31T08:52:14.153Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmezdi7j60003vk68h3sznenr', 'cmezdi7iz0001vk68exctnpic', 'cmez5n8nn0001vk3kjqe0zbsp', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct10002vkc4dd3k6gig', NULL, 1, 31.99, 31.99, 'Large Calzone Regular with Pizza Sauce | Toppings: whole: meatballs', '2025-08-31T11:32:43.555Z', '2025-08-31T11:32:43.555Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf06d1670003vkig06bge9uc', 'cmf06d15r0001vkiggcvs62fg', 'cmez5n8nn0001vk3kjqe0zbsp', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct10002vkc4dd3k6gig', NULL, 1, 31.99, 31.99, 'Large Calzone Regular with Pizza Sauce | Toppings: whole: ricotta cheese', '2025-09-01T01:00:30.896Z', '2025-09-01T01:00:30.896Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf084piu0003vkhcmcky4bso', 'cmf084pin0001vkhc781oh61h', NULL, NULL, NULL, 'cmez5bugk001fvkvs8jtn5du0', 1, 16.75, 16.75, '**Steak Tips Kabob** (hot-subs) | Customization', '2025-09-01T01:50:01.782Z', '2025-09-01T01:50:01.782Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf0e2on20003vkvcc1uu86k6', 'cmf0e2omw0001vkvcra6xd8gq', NULL, NULL, NULL, 'cmez5bufx000tvkvs3psh4hyl', 1, 48, 48, '**Sea Monster (Scallops, Clams, Shrimps & Haddock)** (seafood-plates) | Customization | Customization', '2025-09-01T04:36:25.023Z', '2025-09-01T04:36:25.023Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf0is3zq0003vkl85pz1zzr0', 'cmf0is3ye0001vkl8xgty6kfm', 'cmez5n8nn0001vk3kjqe0zbsp', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct10002vkc4dd3k6gig', NULL, 1, 33.98999999999999, 33.98999999999999, 'Large Calzone Regular with Pizza Sauce | Toppings: whole: ricotta cheese | right: black olives', '2025-09-01T06:48:09.783Z', '2025-09-01T06:48:09.783Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf1g6hpc0005vkiszudlgy8y', 'cmf1g6hp60003vkisuncn4q3e', NULL, NULL, NULL, 'cmf0cax0q000kvkccfccoae63', 1, 6.3, 6.3, '**Hot Dog** (Sandwiches)', '2025-09-01T22:23:08.065Z', '2025-09-01T22:23:08.065Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmez71q9v002hvk609w7x1wqv', 'cmez71q930023vk60eh0tw6ip', NULL, NULL, NULL, NULL, 1, 18.98, 18.98, '**Pepperoni Pizza** (pizzas) | Customization', '2025-08-31T08:31:56.996Z', '2025-08-31T08:31:56.996Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf1kzp9g0003vkskh6goxujr', 'cmf1kzp930001vkskwcg6dkgt', 'cmez57csy0001vkc4fbtoets6', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct10002vkc4dd3k6gig', NULL, 1, 16.5, 16.5, 'Large Pizza Regular with Pizza Sauce', '2025-09-02T00:37:49.348Z', '2025-09-02T00:37:49.348Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf1l3ias0007vksknataxeh3', 'cmf1l3iap0005vkskwovncy2r', 'cmez57csy0001vkc4fbtoets6', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct10002vkc4dd3k6gig', NULL, 1, 16.5, 16.5, 'Large Pizza Regular with Pizza Sauce', '2025-09-02T00:40:46.948Z', '2025-09-02T00:40:46.948Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf1l6koe000bvkskmin9u3b1', 'cmf1l6koa0009vkskk0pwapt7', NULL, NULL, NULL, 'cmez5bugd0019vkvss1syr7lw', 1, 15.74, 15.74, '**Build your Own Roast Beef Sub** (hot-subs) | Customization | Customization', '2025-09-02T00:43:09.998Z', '2025-09-02T00:43:09.998Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf1lhngz0003vkw0xsjdd0al', 'cmf1lhngv0001vkw0yq4yfx6a', 'cmez57csy0001vkc4fbtoets6', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct10002vkc4dd3k6gig', NULL, 1, 16.5, 16.5, 'Large Pizza Regular with Pizza Sauce', '2025-09-02T00:51:46.836Z', '2025-09-02T00:51:46.836Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf1luvan0003vk4ogu7mtc0d', 'cmf1luvah0001vk4oopj49vtd', NULL, NULL, NULL, 'cmez5bugd0019vkvss1syr7lw', 1, 12.74, 12.74, '**Build your Own Roast Beef Sub** (hot-subs) | Customization', '2025-09-02T01:02:03.503Z', '2025-09-02T01:02:03.503Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf1lybty0009vk4ox1g8lri0', 'cmf1lybtv0007vk4o3mxxd5ov', NULL, NULL, NULL, 'cmez5buff000dvkvsaexqwttc', 1, 14.99, 14.99, '**Hamburger Plate** (dinner-plates)', '2025-09-02T01:04:44.902Z', '2025-09-02T01:04:44.902Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf1lybtz000bvk4olqowb86p', 'cmf1lybtv0007vk4o3mxxd5ov', NULL, NULL, NULL, 'cmez4ylz7001cvkvoyc2xmwxy', 1, 10.5, 10.5, '**Caesar Salad** (salads) | Customization', '2025-09-02T01:04:44.904Z', '2025-09-02T01:04:44.904Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf1n5ll10003vk583hedomdg', 'cmf1n5lkv0001vk58avtfjqp3', 'cmez57csy0001vkc4fbtoets6', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct10002vkc4dd3k6gig', NULL, 1, 16.5, 16.5, 'Large Pizza Regular with Pizza Sauce', '2025-09-02T01:38:23.749Z', '2025-09-02T01:38:23.749Z', 'PIZZA', NULL, NULL);
INSERT INTO "order_items" ("id", "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", "quantity", "basePrice", "totalPrice", "notes", "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") VALUES ('cmf1n6i030007vk580pg6s3k5', 'cmf1n6i000005vk588g7zuywy', 'cmez5n8nn0001vk3kjqe0zbsp', 'cmez57ct90007vkc4memkf1p1', 'cmez57ct10002vkc4dd3k6gig', NULL, 1, 21.5, 21.5, 'Large Calzone Regular with Pizza Sauce', '2025-09-02T01:39:05.764Z', '2025-09-02T01:39:05.764Z', 'PIZZA', NULL, NULL);

-- Table: orders
DROP TABLE IF EXISTS "orders" CASCADE;
CREATE TABLE "orders" (
  "id" TEXT NOT NULL,
  "orderNumber" TEXT NOT NULL,
  "userId" TEXT,
  "customerName" TEXT,
  "customerEmail" TEXT,
  "customerPhone" TEXT,
  "status" USER-DEFINED NOT NULL DEFAULT 'PENDING'::"OrderStatus",
  "orderType" USER-DEFINED NOT NULL DEFAULT 'PICKUP'::"OrderType",
  "scheduleType" TEXT DEFAULT 'NOW'::text,
  "paymentMethod" TEXT,
  "deliveryAddress" TEXT,
  "deliveryCity" TEXT,
  "deliveryZip" TEXT,
  "deliveryInstructions" TEXT,
  "scheduledTime" TIMESTAMP,
  "subtotal" DOUBLE PRECISION NOT NULL,
  "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "tipAmount" DOUBLE PRECISION,
  "tipPercentage" DOUBLE PRECISION,
  "customTipAmount" DOUBLE PRECISION,
  "tax" DOUBLE PRECISION NOT NULL,
  "total" DOUBLE PRECISION NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmez71q930023vk60eh0tw6ip', 'BO716951I19', NULL, 'omar hassan', 'auy1jll@gmail.com', '6172494115', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 168.47, 0, NULL, NULL, NULL, 13.9, 182.37, NULL, '2025-08-31T08:31:56.967Z', '2025-08-31T08:31:56.967Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmez7rtfj0001vk6cp40pfe9r', 'BO9341130LO', NULL, 'omar hassan', 'auy1jll@gmail.com', '6178673842', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 23.5, 0, NULL, NULL, NULL, 1.94, 25.44, NULL, '2025-08-31T08:52:14.143Z', '2025-08-31T08:52:14.143Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmezdi7iz0001vk68exctnpic', 'BO56353962Q', NULL, 'omar hassan', 'auy1jll@gmail.com', '16178673842', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 31.99, 0, NULL, NULL, NULL, 2.88, 34.87, NULL, '2025-08-31T11:32:43.548Z', '2025-08-31T11:32:43.548Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf06d15r0001vkiggcvs62fg', 'BO030868ZTP', NULL, 'Omar hassan', 'auy1jll@gmail.com', '999 121 2222', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 31.99, 0, NULL, NULL, NULL, 2.88, 34.87, NULL, '2025-09-01T01:00:30.876Z', '2025-09-01T01:00:30.876Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf084pin0001vkhc781oh61h', 'BO001770KK0', NULL, 'omar hassan', 'auy1jll@gmail.com', '16178673842', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 16.75, 0, NULL, NULL, NULL, 1.51, 18.26, NULL, '2025-09-01T01:50:01.775Z', '2025-09-01T01:50:01.775Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf0e2omw0001vkvcra6xd8gq', 'BO985011HBF', NULL, 'Hassan Omar', 'auy1jll@gmail.com', '6172494115', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 48, 0, NULL, NULL, NULL, 4.32, 52.32, NULL, '2025-09-01T04:36:25.016Z', '2025-09-01T04:36:25.016Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf0is3ye0001vkl8xgty6kfm', 'BO889450U74', NULL, 'Omar hassan', 'auy1jll@pizza-subs.com', '999 121 2222', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 33.98999999999999, 0, NULL, NULL, NULL, 2.89, 36.88, NULL, '2025-09-01T06:48:09.732Z', '2025-09-01T06:48:09.732Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf1g6hp60003vkisuncn4q3e', 'BO988049JGL', NULL, 'omar hassan', 'auy1jll@gmail.com', '16178673842', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 6.3, 0, NULL, NULL, NULL, 0.54, 6.84, NULL, '2025-09-01T22:23:08.059Z', '2025-09-01T22:23:08.059Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf1kzp930001vkskwcg6dkgt', 'BO069322BQS', NULL, 'omar hassan', 'auy1jll@gmail.com', '16178673842', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 16.5, 0, NULL, NULL, NULL, 1.4, 17.9, NULL, '2025-09-02T00:37:49.335Z', '2025-09-02T00:37:49.335Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf1l3iap0005vkskwovncy2r', 'BO246941FFE', NULL, 'Hassan Omar', 'auy1jll@gmail.com', '6172494115', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 16.5, 0, NULL, NULL, NULL, 1.4, 17.9, NULL, '2025-09-02T00:40:46.945Z', '2025-09-02T00:40:46.945Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf1l6koa0009vkskk0pwapt7', 'BO389942ZNF', NULL, 'Test Customer', 'auy1jll@gmail.com', '6178673842', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 15.74, 0, NULL, NULL, NULL, 1.34, 17.08, NULL, '2025-09-02T00:43:09.994Z', '2025-09-02T00:43:09.994Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf1lhngv0001vkw0yq4yfx6a', 'BO906822FPO', NULL, 'omar hassan', 'auy1jll@gmail.com', '16178673842', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 16.5, 0, NULL, NULL, NULL, 1.4, 17.9, NULL, '2025-09-02T00:51:46.831Z', '2025-09-02T00:51:46.831Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf1luvah0001vk4oopj49vtd', 'BO523489LJ1', NULL, 'Hassan Omar', 'auy1jll@gmail.com', '6172494115', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 12.74, 0, NULL, NULL, NULL, 1.08, 13.82, NULL, '2025-09-02T01:02:03.497Z', '2025-09-02T01:02:03.497Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf1lybtv0007vk4o3mxxd5ov', 'BO684896F6Z', NULL, 'omar hassan', 'auy1jll@gmail.com', '16178673842', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 25.49, 0, NULL, NULL, NULL, 2.17, 27.66, NULL, '2025-09-02T01:04:44.899Z', '2025-09-02T01:04:44.899Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf1n5lkv0001vk58avtfjqp3', 'BO703736758', NULL, 'Hassan Omar', 'auy1jll@gmail.com', '6172494115', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 16.5, 0, NULL, NULL, NULL, 1.4, 17.9, NULL, '2025-09-02T01:38:23.744Z', '2025-09-02T01:38:23.744Z');
INSERT INTO "orders" ("id", "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", "status", "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", "subtotal", "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", "tax", "total", "notes", "createdAt", "updatedAt") VALUES ('cmf1n6i000005vk588g7zuywy', 'BO745756CDP', NULL, 'Hassan Omar', 'auy1jll@gmail.com', '6172494115', 'PENDING', 'PICKUP', 'NOW', NULL, NULL, NULL, NULL, NULL, NULL, 21.5, 0, NULL, NULL, NULL, 1.83, 23.33, NULL, '2025-09-02T01:39:05.760Z', '2025-09-02T01:39:05.760Z');

-- Table: pizza_crusts
DROP TABLE IF EXISTS "pizza_crusts" CASCADE;
CREATE TABLE "pizza_crusts" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "priceModifier" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "pizza_crusts" ("id", "name", "description", "priceModifier", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez57ct90007vkc4memkf1p1', 'Regular', 'Our classic hand-tossed crust', 0, TRUE, 1, '2025-08-31T07:40:20.254Z', '2025-08-31T07:40:20.254Z');

-- Table: pizza_sauces
DROP TABLE IF EXISTS "pizza_sauces" CASCADE;
CREATE TABLE "pizza_sauces" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "color" TEXT,
  "spiceLevel" INTEGER NOT NULL DEFAULT 0,
  "priceModifier" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "pizza_sauces" ("id", "name", "description", "color", "spiceLevel", "priceModifier", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez57ct10002vkc4dd3k6gig', 'Pizza Sauce', 'Classic tomato pizza sauce', '#e53e3e', 0, 0, TRUE, 1, '2025-08-31T07:40:20.245Z', '2025-08-31T07:40:20.245Z');
INSERT INTO "pizza_sauces" ("id", "name", "description", "color", "spiceLevel", "priceModifier", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez57ct30003vkc4zgf8fsbt', 'Alfredo Sauce', 'Creamy white alfredo sauce', '#f7fafc', 0, 0, TRUE, 1, '2025-08-31T07:40:20.247Z', '2025-08-31T07:40:20.247Z');
INSERT INTO "pizza_sauces" ("id", "name", "description", "color", "spiceLevel", "priceModifier", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez57ct40004vkc4ndh8iu2b', 'Garlic Butter Sauce', 'Rich garlic butter sauce', '#fefcbf', 0, 0, TRUE, 1, '2025-08-31T07:40:20.248Z', '2025-08-31T07:40:20.248Z');
INSERT INTO "pizza_sauces" ("id", "name", "description", "color", "spiceLevel", "priceModifier", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez57ct50005vkc4udrjjw5h', 'White (No Sauce)', 'No sauce - just cheese and toppings', '#ffffff', 0, 0, TRUE, 1, '2025-08-31T07:40:20.250Z', '2025-08-31T07:40:20.250Z');
INSERT INTO "pizza_sauces" ("id", "name", "description", "color", "spiceLevel", "priceModifier", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez57ct70006vkc4uuwgkjk5', 'Marinara sauce', 'Marinara sauce', '#ff0000', 1, 0, TRUE, 1, '2025-08-31T07:40:20.251Z', '2025-08-31T07:40:20.251Z');

-- Table: pizza_sizes
DROP TABLE IF EXISTS "pizza_sizes" CASCADE;
CREATE TABLE "pizza_sizes" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "diameter" TEXT NOT NULL,
  "basePrice" DOUBLE PRECISION NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "description" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  "productType" USER-DEFINED NOT NULL DEFAULT 'PIZZA'::"ProductType"
);

INSERT INTO "pizza_sizes" ("id", "name", "diameter", "basePrice", "isActive", "sortOrder", "description", "createdAt", "updatedAt", "productType") VALUES ('cmez57csv0000vkc4nzo0th14', 'Small Pizza', '12"', 11.5, TRUE, 1, 'Perfect for 1-2 people', '2025-08-31T07:40:20.240Z', '2025-09-02T00:15:54.868Z', 'PIZZA');
INSERT INTO "pizza_sizes" ("id", "name", "diameter", "basePrice", "isActive", "sortOrder", "description", "createdAt", "updatedAt", "productType") VALUES ('cmez57csy0001vkc4fbtoets6', 'Large Pizza', '16"', 16.5, TRUE, 2, 'Great for families and sharing', '2025-08-31T07:40:20.242Z', '2025-09-02T00:16:17.579Z', 'PIZZA');
INSERT INTO "pizza_sizes" ("id", "name", "diameter", "basePrice", "isActive", "sortOrder", "description", "createdAt", "updatedAt", "productType") VALUES ('cmez5n8nl0000vk3k7n5edmea', 'Small Calzone', 'Personal size calzone', 16, TRUE, 10, NULL, '2025-08-31T07:52:41.361Z', '2025-09-02T00:16:24.519Z', 'CALZONE');
INSERT INTO "pizza_sizes" ("id", "name", "diameter", "basePrice", "isActive", "sortOrder", "description", "createdAt", "updatedAt", "productType") VALUES ('cmez5n8nn0001vk3kjqe0zbsp', 'Large Calzone', 'Family size calzone', 21.5, TRUE, 11, NULL, '2025-08-31T07:52:41.364Z', '2025-09-02T00:16:34.376Z', 'CALZONE');

-- Table: pizza_toppings
DROP TABLE IF EXISTS "pizza_toppings" CASCADE;
CREATE TABLE "pizza_toppings" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "category" USER-DEFINED NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
  "isVegan" BOOLEAN NOT NULL DEFAULT false,
  "isGlutenFree" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctc0008vkc4gno2jo9r', 'Black Olives', NULL, 'VEGETABLE', 2, TRUE, 1, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.257Z', '2025-08-31T07:40:20.257Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57cte0009vkc4cdbrvja2', 'Broccoli', NULL, 'VEGETABLE', 2, TRUE, 2, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.258Z', '2025-08-31T07:40:20.258Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57cte000avkc4lpgv97o3', 'Eggplant', NULL, 'VEGETABLE', 2, TRUE, 3, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.259Z', '2025-08-31T07:40:20.259Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctf000bvkc4u8jfcctq', 'Fresh Mushrooms', NULL, 'VEGETABLE', 2, TRUE, 4, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.260Z', '2025-08-31T07:40:20.260Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctg000cvkc46m0wjghg', 'Fresh Onions', NULL, 'VEGETABLE', 2, TRUE, 5, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.260Z', '2025-08-31T07:40:20.260Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57cth000dvkc4whyx28oq', 'Fresh Garlic', NULL, 'VEGETABLE', 2, TRUE, 6, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.261Z', '2025-08-31T07:40:20.261Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57cti000evkc4pxjejpaa', 'Green Bell Peppers', NULL, 'VEGETABLE', 2, TRUE, 7, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.263Z', '2025-08-31T07:40:20.263Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctj000fvkc4dut7xifh', 'Grilled Onions', NULL, 'VEGETABLE', 2, TRUE, 8, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.264Z', '2025-08-31T07:40:20.264Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctk000gvkc47fcafj1f', 'Hot Pepper Rings', NULL, 'VEGETABLE', 2, TRUE, 9, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.264Z', '2025-08-31T07:40:20.264Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctl000hvkc4gf4s6kgl', 'Jalapeños', NULL, 'VEGETABLE', 2, TRUE, 10, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.265Z', '2025-08-31T07:40:20.265Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctl000ivkc444c40p29', 'Roasted Bell Peppers', NULL, 'VEGETABLE', 2, TRUE, 11, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.266Z', '2025-08-31T07:40:20.266Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctm000jvkc4nxabd229', 'Spinach', NULL, 'VEGETABLE', 2, TRUE, 12, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.267Z', '2025-08-31T07:40:20.267Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctn000kvkc4cgoe6sqn', 'Tomatoes', NULL, 'VEGETABLE', 2, TRUE, 13, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.267Z', '2025-08-31T07:40:20.267Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57cto000lvkc42gzgyexr', 'Extra Cheese', NULL, 'CHEESE', 2, TRUE, 14, TRUE, FALSE, FALSE, '2025-08-31T07:40:20.268Z', '2025-08-31T07:40:20.268Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57cto000mvkc4x4bugo9m', 'Feta', NULL, 'CHEESE', 2, TRUE, 15, TRUE, FALSE, FALSE, '2025-08-31T07:40:20.269Z', '2025-08-31T07:40:20.269Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctp000nvkc48fy737nq', 'Ricotta Cheese', NULL, 'CHEESE', 2, TRUE, 16, TRUE, FALSE, FALSE, '2025-08-31T07:40:20.269Z', '2025-08-31T07:40:20.269Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctq000ovkc4qt73cxo1', 'Ham', NULL, 'MEAT', 2, TRUE, 17, FALSE, FALSE, FALSE, '2025-08-31T07:40:20.270Z', '2025-08-31T07:40:20.270Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctq000pvkc41cp4qe5p', 'Meatballs', NULL, 'MEAT', 2, TRUE, 18, FALSE, FALSE, FALSE, '2025-08-31T07:40:20.271Z', '2025-08-31T07:40:20.271Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctr000qvkc4rkn1c368', 'Pepperoni', NULL, 'MEAT', 2, TRUE, 19, FALSE, FALSE, FALSE, '2025-08-31T07:40:20.271Z', '2025-08-31T07:40:20.271Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57cts000rvkc4p6c3nhua', 'Salami', NULL, 'MEAT', 2, TRUE, 20, FALSE, FALSE, FALSE, '2025-08-31T07:40:20.272Z', '2025-08-31T07:40:20.272Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57cts000svkc4jnanslc0', 'Sausage', NULL, 'MEAT', 2, TRUE, 21, FALSE, FALSE, FALSE, '2025-08-31T07:40:20.273Z', '2025-08-31T07:40:20.273Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctt000tvkc4ln5deozo', 'Bacon', NULL, 'MEAT', 5, TRUE, 22, FALSE, FALSE, FALSE, '2025-08-31T07:40:20.274Z', '2025-08-31T07:40:20.274Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctu000uvkc4asbg1mbb', 'Chicken Fingers', NULL, 'MEAT', 5, TRUE, 23, FALSE, FALSE, FALSE, '2025-08-31T07:40:20.274Z', '2025-08-31T07:40:20.274Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctv000vvkc4uz394m7n', 'Grilled Chicken', NULL, 'MEAT', 5, TRUE, 24, FALSE, FALSE, FALSE, '2025-08-31T07:40:20.275Z', '2025-08-31T07:40:20.275Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctv000wvkc4d2cfji19', 'Roasted Chicken', NULL, 'MEAT', 5, TRUE, 25, FALSE, FALSE, FALSE, '2025-08-31T07:40:20.276Z', '2025-08-31T07:40:20.276Z');
INSERT INTO "pizza_toppings" ("id", "name", "description", "category", "price", "isActive", "sortOrder", "isVegetarian", "isVegan", "isGlutenFree", "createdAt", "updatedAt") VALUES ('cmez57ctw000xvkc4evclv18m', 'Pineapple', NULL, 'SPECIALTY', 2, TRUE, 26, TRUE, TRUE, FALSE, '2025-08-31T07:40:20.277Z', '2025-08-31T07:40:20.277Z');

-- Table: price_snapshots
DROP TABLE IF EXISTS "price_snapshots" CASCADE;
CREATE TABLE "price_snapshots" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "componentType" TEXT NOT NULL,
  "componentId" TEXT NOT NULL,
  "componentName" TEXT NOT NULL,
  "snapshotPrice" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: pricing_history
DROP TABLE IF EXISTS "pricing_history" CASCADE;
CREATE TABLE "pricing_history" (
  "id" TEXT NOT NULL,
  "componentType" TEXT NOT NULL,
  "componentId" TEXT NOT NULL,
  "componentName" TEXT NOT NULL,
  "oldPrice" DOUBLE PRECISION,
  "newPrice" DOUBLE PRECISION NOT NULL,
  "changeReason" TEXT,
  "changedBy" TEXT,
  "changedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: promotions
DROP TABLE IF EXISTS "promotions" CASCADE;
CREATE TABLE "promotions" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type" USER-DEFINED NOT NULL,
  "discountType" USER-DEFINED NOT NULL,
  "discountValue" DECIMAL NOT NULL,
  "minimumOrderAmount" DECIMAL,
  "maximumDiscountAmount" DECIMAL,
  "minimumQuantity" INTEGER,
  "applicableCategories" ARRAY,
  "applicableItems" ARRAY,
  "requiresLogin" BOOLEAN NOT NULL DEFAULT false,
  "userGroupRestrictions" ARRAY,
  "startDate" TIMESTAMP,
  "endDate" TIMESTAMP,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "usageLimit" INTEGER,
  "usageCount" INTEGER NOT NULL DEFAULT 0,
  "perUserLimit" INTEGER,
  "stackable" BOOLEAN NOT NULL DEFAULT false,
  "priority" INTEGER NOT NULL DEFAULT 0,
  "terms" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "promotions" ("id", "name", "description", "type", "discountType", "discountValue", "minimumOrderAmount", "maximumDiscountAmount", "minimumQuantity", "applicableCategories", "applicableItems", "requiresLogin", "userGroupRestrictions", "startDate", "endDate", "isActive", "usageLimit", "usageCount", "perUserLimit", "stackable", "priority", "terms", "createdAt", "updatedAt") VALUES ('cmf0erpns0000vkjcp8tqb35b', 'BOGO', 'Buy any One Pizza and get the 2nd half Price ', 'BOGO_HALF_OFF', 'PERCENTAGE', '50.00', NULL, NULL, NULL, pizza, , FALSE, , '2025-08-02T04:54:00.000Z', '2027-10-01T04:54:00.000Z', TRUE, NULL, 0, NULL, FALSE, 1, 'the 50% discount applies to the item of lesser price', '2025-09-01T04:55:52.741Z', '2025-09-01T04:55:52.741Z');

-- Table: refresh_tokens
DROP TABLE IF EXISTS "refresh_tokens" CASCADE;
CREATE TABLE "refresh_tokens" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "deviceFingerprint" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "revoked" BOOLEAN NOT NULL DEFAULT false,
  "revokedAt" TIMESTAMP,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

-- Table: specialty_calzone_sizes
DROP TABLE IF EXISTS "specialty_calzone_sizes" CASCADE;
CREATE TABLE "specialty_calzone_sizes" (
  "id" TEXT NOT NULL,
  "specialtyCalzoneId" TEXT NOT NULL,
  "pizzaSizeId" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncag0002vkawcfri9cj5', 'cmez5ncad0000vkawbsowxu3l', 'cmez5n8nl0000vk3k7n5edmea', 23, TRUE, '2025-08-31T07:52:46.072Z', '2025-08-31T07:56:48.866Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncaj0004vkaws75wn51t', 'cmez5ncad0000vkawbsowxu3l', 'cmez5n8nn0001vk3kjqe0zbsp', 29.99, TRUE, '2025-08-31T07:52:46.076Z', '2025-08-31T07:56:48.869Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncan0007vkaw4kxqm5z8', 'cmez5ncal0005vkawc1hizvly', 'cmez5n8nl0000vk3k7n5edmea', 23, TRUE, '2025-08-31T07:52:46.079Z', '2025-08-31T07:56:48.871Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncao0009vkaw0amijn0b', 'cmez5ncal0005vkawc1hizvly', 'cmez5n8nn0001vk3kjqe0zbsp', 29.99, TRUE, '2025-08-31T07:52:46.081Z', '2025-08-31T07:56:48.873Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncas000cvkawksqhl8fv', 'cmez5ncaq000avkawfzyept7d', 'cmez5n8nl0000vk3k7n5edmea', 23, TRUE, '2025-08-31T07:52:46.084Z', '2025-08-31T07:56:48.875Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncat000evkawp8maql95', 'cmez5ncaq000avkawfzyept7d', 'cmez5n8nn0001vk3kjqe0zbsp', 29.99, TRUE, '2025-08-31T07:52:46.085Z', '2025-08-31T07:56:48.879Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncaw000hvkaw2spnkusy', 'cmez5ncav000fvkaw5851hj5o', 'cmez5n8nl0000vk3k7n5edmea', 23, TRUE, '2025-08-31T07:52:46.089Z', '2025-08-31T07:56:48.882Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncax000jvkawsixm5e3b', 'cmez5ncav000fvkaw5851hj5o', 'cmez5n8nn0001vk3kjqe0zbsp', 29.99, TRUE, '2025-08-31T07:52:46.090Z', '2025-08-31T07:56:48.885Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncb1000mvkawxmaeus87', 'cmez5ncaz000kvkawt4u0qleq', 'cmez5n8nl0000vk3k7n5edmea', 23, TRUE, '2025-08-31T07:52:46.093Z', '2025-08-31T07:56:48.887Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncb2000ovkawwuy8yju3', 'cmez5ncaz000kvkawt4u0qleq', 'cmez5n8nn0001vk3kjqe0zbsp', 29.99, TRUE, '2025-08-31T07:52:46.094Z', '2025-08-31T07:56:48.891Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncb5000rvkawzw0605s3', 'cmez5ncb4000pvkawtrsi1vx1', 'cmez5n8nl0000vk3k7n5edmea', 23, TRUE, '2025-08-31T07:52:46.098Z', '2025-08-31T07:56:48.894Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncb6000tvkawm2371h2m', 'cmez5ncb4000pvkawtrsi1vx1', 'cmez5n8nn0001vk3kjqe0zbsp', 29.99, TRUE, '2025-08-31T07:52:46.099Z', '2025-08-31T07:56:48.897Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncb9000wvkaw3z1k6udp', 'cmez5ncb8000uvkawhnyir4x3', 'cmez5n8nl0000vk3k7n5edmea', 23, TRUE, '2025-08-31T07:52:46.102Z', '2025-08-31T07:56:48.900Z');
INSERT INTO "specialty_calzone_sizes" ("id", "specialtyCalzoneId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5ncbb000yvkawcj2k0nbx', 'cmez5ncb8000uvkawhnyir4x3', 'cmez5n8nn0001vk3kjqe0zbsp', 29.99, TRUE, '2025-08-31T07:52:46.103Z', '2025-08-31T07:56:48.903Z');

-- Table: specialty_calzones
DROP TABLE IF EXISTS "specialty_calzones" CASCADE;
CREATE TABLE "specialty_calzones" (
  "id" TEXT NOT NULL,
  "calzoneName" TEXT NOT NULL,
  "calzoneDescription" TEXT NOT NULL,
  "basePrice" DOUBLE PRECISION NOT NULL,
  "category" TEXT NOT NULL,
  "imageUrl" TEXT,
  "fillings" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "specialty_calzones" ("id", "calzoneName", "calzoneDescription", "basePrice", "category", "imageUrl", "fillings", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5ncad0000vkawbsowxu3l', 'Veggie Calzone', 'Fresh vegetable calzone', 21.5, 'CALZONE', NULL, '["Roasted peppers","roasted onions","grilled tomatoes","mushrooms and broccoli"]', TRUE, 1, '2025-08-31T07:52:46.070Z', '2025-08-31T07:52:46.070Z');
INSERT INTO "specialty_calzones" ("id", "calzoneName", "calzoneDescription", "basePrice", "category", "imageUrl", "fillings", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5ncal0005vkawc1hizvly', 'Traditional Calzone', 'Classic pepperoni calzone', 21.5, 'CALZONE', NULL, '["Pepperoni","ricotta cheese","sauce and our blends of mozzarella cheese"]', TRUE, 2, '2025-08-31T07:52:46.078Z', '2025-08-31T07:52:46.078Z');
INSERT INTO "specialty_calzones" ("id", "calzoneName", "calzoneDescription", "basePrice", "category", "imageUrl", "fillings", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5ncaq000avkawfzyept7d', 'Ham & Cheese Calzone', 'Ham and cheese calzone', 21.5, 'CALZONE', NULL, '["Sauce","a blend of our cheese and ham and american cheese"]', TRUE, 3, '2025-08-31T07:52:46.083Z', '2025-08-31T07:52:46.083Z');
INSERT INTO "specialty_calzones" ("id", "calzoneName", "calzoneDescription", "basePrice", "category", "imageUrl", "fillings", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5ncav000fvkaw5851hj5o', 'Chicken Parmesan Calzone', 'Chicken parmesan calzone with marinara', 21.5, 'CALZONE', NULL, '["Chicken parmesan","ricotta cheese with marinara sauce"]', TRUE, 4, '2025-08-31T07:52:46.087Z', '2025-08-31T07:52:46.087Z');
INSERT INTO "specialty_calzones" ("id", "calzoneName", "calzoneDescription", "basePrice", "category", "imageUrl", "fillings", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5ncaz000kvkawt4u0qleq', 'Chicken Broccoli Alfredo Calzone', 'Chicken and broccoli with alfredo sauce', 21.5, 'CALZONE', NULL, '["Chicken","broccoli and onions with white alfredo sauce"]', TRUE, 5, '2025-08-31T07:52:46.092Z', '2025-08-31T07:52:46.092Z');
INSERT INTO "specialty_calzones" ("id", "calzoneName", "calzoneDescription", "basePrice", "category", "imageUrl", "fillings", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5ncb4000pvkawtrsi1vx1', 'Greek Calzone', 'Mediterranean style calzone', 21.5, 'CALZONE', NULL, '["Feta","spinach and tomatoes"]', TRUE, 6, '2025-08-31T07:52:46.096Z', '2025-08-31T07:52:46.096Z');
INSERT INTO "specialty_calzones" ("id", "calzoneName", "calzoneDescription", "basePrice", "category", "imageUrl", "fillings", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5ncb8000uvkawhnyir4x3', 'Meatball Calzone', 'Hearty meatball calzone', 21.5, 'CALZONE', NULL, '["Meatballs with marinara sauce and mozzarella cheese"]', TRUE, 7, '2025-08-31T07:52:46.101Z', '2025-08-31T07:52:46.101Z');

-- Table: specialty_pizza_sizes
DROP TABLE IF EXISTS "specialty_pizza_sizes" CASCADE;
CREATE TABLE "specialty_pizza_sizes" (
  "id" TEXT NOT NULL,
  "specialtyPizzaId" TEXT NOT NULL,
  "pizzaSizeId" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msfc0002vkaw1pg8gzw9', 'cmez5mset0000vkawy2dx6uqm', 'cmez57csv0000vkc4nzo0th14', 15.45, TRUE, '2025-08-31T07:52:20.328Z', '2025-08-31T07:56:48.923Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msft0004vkawzep2vsrx', 'cmez5mset0000vkawy2dx6uqm', 'cmez57csy0001vkc4fbtoets6', 22.45, TRUE, '2025-08-31T07:52:20.345Z', '2025-08-31T07:56:48.928Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msfy0007vkawj6c7mc5m', 'cmez5msfw0005vkawuq4y4j55', 'cmez57csv0000vkc4nzo0th14', 16.5, TRUE, '2025-08-31T07:52:20.351Z', '2025-08-31T07:56:48.930Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msg00009vkawqvsf044p', 'cmez5msfw0005vkawuq4y4j55', 'cmez57csy0001vkc4fbtoets6', 23.5, TRUE, '2025-08-31T07:52:20.353Z', '2025-08-31T07:56:48.933Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msg6000cvkaw7xzftxxw', 'cmez5msg3000avkawvqe7cusa', 'cmez57csv0000vkc4nzo0th14', 16.5, TRUE, '2025-08-31T07:52:20.358Z', '2025-08-31T07:56:48.936Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msg7000evkawwdwwgk26', 'cmez5msg3000avkawvqe7cusa', 'cmez57csy0001vkc4fbtoets6', 23.5, TRUE, '2025-08-31T07:52:20.360Z', '2025-08-31T07:56:48.939Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msgc000hvkawh0nbmx4u', 'cmez5msga000fvkawa2hp9b38', 'cmez57csv0000vkc4nzo0th14', 16.5, TRUE, '2025-08-31T07:52:20.364Z', '2025-08-31T07:56:48.942Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msge000jvkawaqkscudz', 'cmez5msga000fvkawa2hp9b38', 'cmez57csy0001vkc4fbtoets6', 23.5, TRUE, '2025-08-31T07:52:20.366Z', '2025-08-31T07:56:48.945Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msgj000mvkawxhxy420f', 'cmez5msgh000kvkawdkkg9et6', 'cmez57csv0000vkc4nzo0th14', 16.5, TRUE, '2025-08-31T07:52:20.371Z', '2025-08-31T07:56:48.948Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msgl000ovkawpop68yru', 'cmez5msgh000kvkawdkkg9et6', 'cmez57csy0001vkc4fbtoets6', 23.5, TRUE, '2025-08-31T07:52:20.373Z', '2025-08-31T07:56:48.951Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msgp000rvkaw1avim59u', 'cmez5msgn000pvkaw23ywxpn7', 'cmez57csv0000vkc4nzo0th14', 16.5, TRUE, '2025-08-31T07:52:20.378Z', '2025-08-31T07:56:48.953Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msgr000tvkaw1v8g73pu', 'cmez5msgn000pvkaw23ywxpn7', 'cmez57csy0001vkc4fbtoets6', 23.5, TRUE, '2025-08-31T07:52:20.379Z', '2025-08-31T07:56:48.956Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msgw000wvkaw2ebm1kvl', 'cmez5msgu000uvkawnh7fpkrg', 'cmez57csv0000vkc4nzo0th14', 16.5, TRUE, '2025-08-31T07:52:20.384Z', '2025-08-31T07:56:48.959Z');
INSERT INTO "specialty_pizza_sizes" ("id", "specialtyPizzaId", "pizzaSizeId", "price", "isAvailable", "createdAt", "updatedAt") VALUES ('cmez5msgx000yvkawj09t373n', 'cmez5msgu000uvkawnh7fpkrg', 'cmez57csy0001vkc4fbtoets6', 23.5, TRUE, '2025-08-31T07:52:20.386Z', '2025-08-31T07:56:48.963Z');

-- Table: specialty_pizzas
DROP TABLE IF EXISTS "specialty_pizzas" CASCADE;
CREATE TABLE "specialty_pizzas" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "basePrice" DOUBLE PRECISION NOT NULL,
  "category" TEXT NOT NULL,
  "imageUrl" TEXT,
  "ingredients" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL
);

INSERT INTO "specialty_pizzas" ("id", "name", "description", "basePrice", "category", "imageUrl", "ingredients", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5mset0000vkawy2dx6uqm', 'Chicken Alfredo', 'Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses', 15.45, 'Premium', NULL, '["Alfredo Sauce","Chicken","Broccoli","Onions","Cheese Blend"]', TRUE, 1, '2025-08-31T07:52:20.309Z', '2025-08-31T07:52:20.309Z');
INSERT INTO "specialty_pizzas" ("id", "name", "description", "basePrice", "category", "imageUrl", "ingredients", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5msfw0005vkawuq4y4j55', 'BBQ Chicken', 'Chicken, Onion and Bacon with lots of BBQ sauce', 16.5, 'Premium', NULL, '["BBQ Sauce","Chicken","Onion","Bacon","Cheese"]', TRUE, 2, '2025-08-31T07:52:20.349Z', '2025-08-31T07:52:20.349Z');
INSERT INTO "specialty_pizzas" ("id", "name", "description", "basePrice", "category", "imageUrl", "ingredients", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5msg3000avkawvqe7cusa', 'House Special', 'Meatball, Sausage, Pepperoni, Mushrooms, Grilled peppers and onions', 16.5, 'Premium', NULL, '["Meatball","Sausage","Pepperoni","Mushrooms","Grilled Peppers","Grilled Onions","Cheese"]', TRUE, 3, '2025-08-31T07:52:20.356Z', '2025-08-31T07:52:20.356Z');
INSERT INTO "specialty_pizzas" ("id", "name", "description", "basePrice", "category", "imageUrl", "ingredients", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5msga000fvkawa2hp9b38', 'Buffalo Chicken', 'Buffalo Chicken, grilled Onion, grilled peppers with lots of cheese', 16.5, 'Premium', NULL, '["Buffalo Chicken","Grilled Onion","Grilled Peppers","Extra Cheese"]', TRUE, 4, '2025-08-31T07:52:20.363Z', '2025-08-31T07:52:20.363Z');
INSERT INTO "specialty_pizzas" ("id", "name", "description", "basePrice", "category", "imageUrl", "ingredients", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5msgh000kvkawdkkg9et6', 'Meat Lovers', 'Meatball, Sausage, Pepperoni, Bacon, Salami and Ham', 16.5, 'Meat Lovers', NULL, '["Meatball","Sausage","Pepperoni","Bacon","Salami","Ham","Cheese"]', TRUE, 5, '2025-08-31T07:52:20.369Z', '2025-08-31T07:52:20.369Z');
INSERT INTO "specialty_pizzas" ("id", "name", "description", "basePrice", "category", "imageUrl", "ingredients", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5msgn000pvkaw23ywxpn7', 'Athenian', 'Chicken with Alfredo, grilled Onion, fresh spinach and of course feta cheese', 16.5, 'Premium', NULL, '["Chicken","Alfredo Sauce","Grilled Onion","Fresh Spinach","Feta Cheese","Mozzarella"]', TRUE, 6, '2025-08-31T07:52:20.376Z', '2025-08-31T07:52:20.376Z');
INSERT INTO "specialty_pizzas" ("id", "name", "description", "basePrice", "category", "imageUrl", "ingredients", "isActive", "sortOrder", "createdAt", "updatedAt") VALUES ('cmez5msgu000uvkawnh7fpkrg', 'Veggie Pizza', 'Roasted peppers, roasted onions, fresh tomatoes, mushrooms and broccoli', 16.5, 'Vegetarian', NULL, '["Roasted Peppers","Roasted Onions","Fresh Tomatoes","Mushrooms","Broccoli","Cheese"]', TRUE, 7, '2025-08-31T07:52:20.382Z', '2025-08-31T07:52:20.382Z');

-- Table: users
DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "password" TEXT,
  "phone" TEXT,
  "dateOfBirth" TIMESTAMP,
  "avatarUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" TIMESTAMP,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
  "role" USER-DEFINED NOT NULL DEFAULT 'CUSTOMER'::"UserRole",
  "resetTokenExpiry" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  "resetToken" TEXT
);

INSERT INTO "users" ("id", "email", "name", "password", "phone", "dateOfBirth", "avatarUrl", "isActive", "lastLoginAt", "emailVerified", "marketingOptIn", "role", "resetTokenExpiry", "createdAt", "updatedAt", "resetToken") VALUES ('cmez7yyig0000vkgsnomscjd6', 'auy1jll33@gmail.com', 'Pizza Admin', '$2b$12$9ed51fnOYuaP.4gNX/iP8eB69x0mQk/pMOXKUQ1ZUGO3JCd8cvgYu', '', NULL, NULL, TRUE, NULL, TRUE, FALSE, 'ADMIN', NULL, '2025-08-31T08:57:47.320Z', '2025-08-31T09:01:22.816Z', NULL);
INSERT INTO "users" ("id", "email", "name", "password", "phone", "dateOfBirth", "avatarUrl", "isActive", "lastLoginAt", "emailVerified", "marketingOptIn", "role", "resetTokenExpiry", "createdAt", "updatedAt", "resetToken") VALUES ('cmez8pyiz000dvkn8mhu5agrf', 'Liz@greenlandfamous.com', 'LIZ LIZ', '$2b$12$lIN4lNxjf6U.KWcleUAw9O9PvhFk9Rvig5ThmPhqoLjjy5HYG/xfi', '', NULL, NULL, TRUE, NULL, TRUE, FALSE, 'EMPLOYEE', NULL, '2025-08-31T09:18:47.051Z', '2025-08-31T09:18:47.051Z', NULL);
INSERT INTO "users" ("id", "email", "name", "password", "phone", "dateOfBirth", "avatarUrl", "isActive", "lastLoginAt", "emailVerified", "marketingOptIn", "role", "resetTokenExpiry", "createdAt", "updatedAt", "resetToken") VALUES ('cmezcuymv0000vkgssi6itsdv', 'auy1jll@gmail.com', 'Admin User', '$2b$10$Fu1DxTQRAksEwa0AN10tEuQGU6pJ/5G8rqYpnx9fWtoCCe1jRSECu', NULL, NULL, NULL, TRUE, NULL, TRUE, FALSE, 'ADMIN', '2025-08-31T13:02:32.253Z', '2025-08-31T11:14:38.933Z', '2025-08-31T12:02:32.253Z', '8d81e9f63c7a05bdcc0cf5bfceb520d887d9f7655b9dba340c218cf90f3f9b88');
INSERT INTO "users" ("id", "email", "name", "password", "phone", "dateOfBirth", "avatarUrl", "isActive", "lastLoginAt", "emailVerified", "marketingOptIn", "role", "resetTokenExpiry", "createdAt", "updatedAt", "resetToken") VALUES ('cmezfwz7b0000vktgdestx9tn', 'staff101@greenlandFamous.com', 'operations greenland', '$2b$12$wD89t2wf4E520KEhLqD2C.muvpRoxWlxuhO44XxjZDnkBdOl9oG4.', '', NULL, NULL, TRUE, NULL, TRUE, FALSE, 'EMPLOYEE', NULL, '2025-08-31T12:40:11.829Z', '2025-08-31T12:58:06.567Z', NULL);
INSERT INTO "users" ("id", "email", "name", "password", "phone", "dateOfBirth", "avatarUrl", "isActive", "lastLoginAt", "emailVerified", "marketingOptIn", "role", "resetTokenExpiry", "createdAt", "updatedAt", "resetToken") VALUES ('cmez8ob60000avkn8yv0rn3sc', 'admin@pizzabuilder.com', ' ', '$2b$12$cUlfC/XtlV3piEXjN8CBFOuLb/xCibHWm9sbEd0MREsObk5iUD9cC', '', NULL, NULL, TRUE, NULL, TRUE, FALSE, 'ADMIN', NULL, '2025-08-31T09:17:30.121Z', '2025-09-01T04:50:59.909Z', NULL);

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;
