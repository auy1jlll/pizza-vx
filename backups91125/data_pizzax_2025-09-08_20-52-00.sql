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
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public; Owner: -
--

SET SESSION AUTHORIZATION DEFAULT;

ALTER TABLE public.app_settings DISABLE TRIGGER ALL;

COPY public.app_settings (id, key, value, type, "createdAt", "updatedAt") FROM stdin;
cmez7o5lt0003vknkjfru4c7i	emailFromName	Greenland Famous Pizza	STRING	2025-08-31 04:49:23.298	2025-08-31 04:49:23.298
cmez7o5lu0004vknk87tbnc1d	emailReplyTo		STRING	2025-08-31 04:49:23.299	2025-08-31 04:49:23.299
cmez8am0e000rvkowkj2az45m	taxRate	8.5	NUMBER	2025-08-31 05:06:50.99	2025-09-01 01:33:12.215
cmez7o5lo0000vknkwdrxuglz	gmailUser	auy1jlll@gmail.com	STRING	2025-08-31 04:49:23.292	2025-08-31 07:50:23.378
cmez7o5ls0002vknk9jpckgwa	emailServiceEnabled	true	BOOLEAN	2025-08-31 04:49:23.296	2025-08-31 04:50:34.554
cmez7wd8j0000vk80i9ng2tu4	emailNotifications	true	BOOLEAN	2025-08-31 04:55:46.435	2025-08-31 04:56:06.092
cmez7wsg70001vk4c5rcwn5tw	orderNotifications	true	BOOLEAN	2025-08-31 04:56:06.151	2025-08-31 04:56:06.151
cmez7wsg80002vk4cxd4fymix	customerNotifications	true	BOOLEAN	2025-08-31 04:56:06.153	2025-08-31 04:56:06.153
cmez8am0e000svkowz2zu2je4	deliveryFee	3.99	NUMBER	2025-08-31 05:06:50.991	2025-08-31 05:06:50.991
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
cmez8am0g000uvkow47w8azfl	minimumOrder	10.5	NUMBER	2025-08-31 05:06:50.992	2025-09-01 01:33:12.215
cmez8am0f000tvkowryn8rc4c	deliveryEnabled	false	BOOLEAN	2025-08-31 05:06:50.991	2025-09-01 01:33:12.215
cmez8alzw0004vkowjqqj6hgc	businessDescription	Authentic home recipe pizza and cuisine since 1985	STRING	2025-08-31 05:06:50.972	2025-09-01 01:33:54.431
cmez8alzt0001vkowwv955h2t	businessPhone	(603) 501 0774	STRING	2025-08-31 05:06:50.97	2025-09-01 01:33:54.431
cmez8alzr0000vkowntbx1me2	businessName	Greenland Famous Pizza	STRING	2025-08-31 05:06:50.968	2025-09-01 01:44:00.345
cmez8alzx0005vkowwxj4fznt	mondayOpen	10:30	STRING	2025-08-31 05:06:50.973	2025-09-01 02:29:41.757
cmez8alzy0006vkowd8ea11f9	mondayClose	20:00	STRING	2025-08-31 05:06:50.974	2025-09-01 02:29:41.758
cmez8alzy0007vkow32q1g0a7	mondayClosed	false	BOOLEAN	2025-08-31 05:06:50.975	2025-09-01 02:29:41.76
cmez8alzz0008vkow7p5rssa8	tuesdayOpen	10:30	STRING	2025-08-31 05:06:50.976	2025-09-01 02:29:41.761
cmez8am000009vkow064o24b5	tuesdayClose	20:00	STRING	2025-08-31 05:06:50.977	2025-09-01 02:29:41.762
cmez8am01000avkowknsafahb	tuesdayClosed	false	BOOLEAN	2025-08-31 05:06:50.977	2025-09-01 02:29:41.765
cmez8am02000bvkowcwg1a06z	wednesdayOpen	10:30	STRING	2025-08-31 05:06:50.978	2025-09-01 02:29:41.766
cmez8am02000cvkowsdcqcnpd	wednesdayClose	20:00	STRING	2025-08-31 05:06:50.979	2025-09-01 02:29:41.768
cmez8am03000dvkowk2v720nv	wednesdayClosed	false	BOOLEAN	2025-08-31 05:06:50.98	2025-09-01 02:29:41.77
cmez8am04000evkowt049n51r	thursdayOpen	10:30	STRING	2025-08-31 05:06:50.98	2025-09-01 02:29:41.771
cmez8am05000fvkowr6j41swy	thursdayClose	20:00	STRING	2025-08-31 05:06:50.981	2025-09-01 02:29:41.772
cmez8am05000gvkowhcw9rhem	thursdayClosed	false	BOOLEAN	2025-08-31 05:06:50.982	2025-09-01 02:29:41.774
cmez8am06000hvkow318xtrv0	fridayOpen	10:30	STRING	2025-08-31 05:06:50.982	2025-09-01 02:29:41.775
cmez8am07000ivkow6crzitwk	fridayClose	20:00	STRING	2025-08-31 05:06:50.983	2025-09-01 02:29:41.776
cmez8am07000jvkow1azqg1rd	fridayClosed	false	BOOLEAN	2025-08-31 05:06:50.984	2025-09-01 02:29:41.777
cmez8am08000kvkowwzlxwzsm	saturdayOpen	10:30	STRING	2025-08-31 05:06:50.985	2025-09-01 02:29:41.778
cmez8am09000lvkownykqt7fs	saturdayClose	20:00	STRING	2025-08-31 05:06:50.986	2025-09-01 02:29:41.779
cmez8am0a000mvkowrzkhvs6w	saturdayClosed	false	BOOLEAN	2025-08-31 05:06:50.986	2025-09-01 02:29:41.781
cmez8am0b000nvkowc782cnox	sundayOpen	10:30	STRING	2025-08-31 05:06:50.987	2025-09-01 02:29:41.783
cmez8am0b000ovkowy5t3qwxx	sundayClose	20:00	STRING	2025-08-31 05:06:50.988	2025-09-01 02:29:41.784
cmez8am0c000pvkow6n3kzzgh	sundayClosed	false	BOOLEAN	2025-08-31 05:06:50.989	2025-09-01 02:29:41.786
cmez8alzv0003vkow7vlvrhox	businessAddress	381 Portsmouth ave, Greenland, NH 03849	STRING	2025-08-31 05:06:50.971	2025-09-02 03:08:28.828
cmez8am0d000qvkowk457iy4c	operating_hours	{"monday":"10:30-20:00","tuesday":"10:30-20:00","wednesday":"10:30-20:00","thursday":"10:30-20:00","friday":"10:30-20:00","saturday":"10:30-20:00","sunday":"10:30-20:00"}	JSON	2025-08-31 05:06:50.989	2025-09-01 02:29:41.751
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
cmez8am3j002xvkowv7e5txuh	complaintEmail	manager@greenlandfamous.com	STRING	2025-08-31 05:06:51.103	2025-08-31 05:16:05.628
cmf0ghlr60000vkqk4nkodn74	business_name	Greenland Famous Pizza	STRING	2025-09-01 01:44:00.354	2025-09-01 01:44:00.354
cmez8am2p0023vkowwohlyf3i	reservationPhone	(603) 501-074	STRING	2025-08-31 05:06:51.074	2025-09-02 02:21:59.613
cmf1wge670000vkf84ad63i1u	appLogoUrl	/uploads/logo-1756779650899.png	STRING	2025-09-02 01:58:43.902	2025-09-02 02:21:59.613
cmez8am2s0026vkowdpd3bh2v	storeManager	Big AL	STRING	2025-08-31 05:06:51.077	2025-09-02 02:21:59.614
cmf1xe4p00001vklgietyly09	app_tagline	Fresh • Authentic • Delicious	STRING	2025-09-02 02:24:57.924	2025-09-02 02:24:57.924
cmf1xe4ou0000vklgte5k8rbf	app_name	Greenland Famous	STRING	2025-09-02 02:24:57.918	2025-09-02 03:11:55.038
\.


ALTER TABLE public.app_settings ENABLE TRIGGER ALL;

--
-- Data for Name: menu_categories; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.menu_categories DISABLE TRIGGER ALL;

COPY public.menu_categories (id, name, slug, description, "parentCategoryId", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmf0llm9l0000vkk84p800i04	Seafood	seafood	Fresh seafood options including boxes, rolls, and dinner plates	\N	\N	t	8	2025-09-01 04:07:05.721	2025-09-01 04:07:05.721
cmez5bueu0001vkvsuragc8gi	Seafood Plates	seafood-plates	Seafood dinner plates and entrees	cmf0llm9l0000vkk84p800i04	\N	t	3	2025-08-31 03:43:49.687	2025-09-01 04:50:11.158
cmf1pnx7k0009vk58x1j00wur	Appetizers	appetizers		\N		t	0	2025-09-01 22:48:37.856	2025-09-01 22:48:37.856
cmf0llm9o0002vkk8ah0l3w9l	Seafood Boxes	seafood-boxes	Small and Large seafood boxes	cmf0llm9l0000vkk84p800i04		t	1	2025-09-01 04:07:05.725	2025-09-01 17:52:25.048
cmf0llm9r0004vkk848mn4a93	Seafood Rolls	seafood-rolls	Seafood rolls with choice of French Fries or Onion Rings	cmf0llm9l0000vkk84p800i04		t	2	2025-09-01 04:07:05.728	2025-09-01 17:52:36.564
cmf1fm9r30001vkwwsv4n14qt	Chicken	chicken		\N		t	0	2025-09-01 18:07:24.639	2025-09-01 18:07:24.639
cmez5buf00005vkvso9m4c4xj	Wings	wings	Chicken wings in various flavors	cmf1fm9r30001vkwwsv4n14qt		t	11	2025-08-31 03:43:49.692	2025-09-01 18:07:42.809
cmez5buf20006vkvsv0wezhi1	Fingers	fingers	Chicken fingers and tenders	cmf1fm9r30001vkwwsv4n14qt		t	12	2025-08-31 03:43:49.694	2025-09-01 18:09:42.126
cmf0cawz80000vkccemljdoul	Sandwiches	sandwiches	Classic sandwiches and burgers	cmf1g3aqb0001vkisf6n0t7om		t	6	2025-08-31 23:46:49.842	2025-09-01 18:21:11.464
cmez4xl780003vkwcly8nts4q	Salads	salads	Fresh, healthy salads with various toppings and dressings	\N	\N	t	1	2025-08-31 03:32:44.441	2025-08-31 03:32:44.441
cmez5buep0000vkvs74qojdfm	Dinner Plates	dinner-plates	Hearty dinner plates with sides	\N	\N	t	6	2025-08-31 03:43:49.681	2025-08-31 03:43:49.681
cmez5buf50008vkvsbnhrhccb	Soups & Chowders	soups-chowders	Hot soups and chowders	\N	\N	t	14	2025-08-31 03:43:49.697	2025-08-31 03:43:49.697
cmez5buf70009vkvsdqx26uux	Specialty Items	specialty-items	Specialty sandwiches and items	\N	\N	t	15	2025-08-31 03:43:49.699	2025-08-31 03:43:49.699
cmez5buew0002vkvs0misx39j	Hot Subs	hot-subs	Hot sandwiches and subs	cmf1g3aqb0001vkisf6n0t7om		t	8	2025-08-31 03:43:49.688	2025-09-01 18:21:36.433
cmez5buex0003vkvs8abknm9j	Cold Subs	cold-subs	Cold sandwiches and subs	cmf1g3aqb0001vkisf6n0t7om		t	9	2025-08-31 03:43:49.689	2025-09-01 18:22:05.195
cmez5buey0004vkvs8ypqlpri	Steak and Cheese Subs	steak-and-cheese-subs	Steak and cheese variations	cmf1g3aqb0001vkisf6n0t7om		t	10	2025-08-31 03:43:49.691	2025-09-01 18:22:25.115
cmf1g3aqb0001vkisf6n0t7om	Subs & Sandwiches	subs-sandwiches		\N		t	0	2025-09-01 18:20:39.059	2025-09-02 04:31:46.046
cmf283ib1003nvkq0tvwy17r3	Build Your salad	build-your-salad		cmez4xl780003vkwcly8nts4q		t	0	2025-09-02 07:24:38.125	2025-09-02 07:24:38.125
\.


ALTER TABLE public.menu_categories ENABLE TRIGGER ALL;

--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.menu_items DISABLE TRIGGER ALL;

COPY public.menu_items (id, "categoryId", name, description, "basePrice", "imageUrl", "isActive", "isAvailable", "sortOrder", "preparationTime", allergens, "nutritionInfo", "createdAt", "updatedAt") FROM stdin;
cmez4ylz7001avkvowcpcy4ea	cmez4xl780003vkwcly8nts4q	Chef Salad	Ham, turkey, cheese, eggs, tomatoes, and cucumbers on mixed greens	14.25	\N	t	t	4	\N	\N	\N	2025-08-31 03:33:32.227	2025-09-02 08:36:21.176
cmf22ossn000avk88ywzcfgyt	cmez4xl780003vkwcly8nts4q	Cole Slaw		5.5	\N	t	t	0	\N	\N	\N	2025-09-02 04:53:13.784	2025-09-02 04:53:13.784
cmf22pslj000cvk88sk6izvcw	cmez4xl780003vkwcly8nts4q	Pasta Salad		5.5	\N	t	t	0	\N	\N	\N	2025-09-02 04:54:00.199	2025-09-02 04:54:00.199
cmf23xaiy000cvkq0ekts44ni	cmez5buf20006vkvsv0wezhi1	Regular Fingers (12 pcs)	Classic regular Fingers	23	\N	t	t	1006	\N	\N	\N	2025-09-02 05:27:49.642	2025-09-02 05:31:05.619
cmf2570be001uvkq0qnysaenz	cmf1pnx7k0009vk58x1j00wur	French Fries (large)	Fried Mushrooms	7.5	\N	t	t	4001	\N	\N	\N	2025-09-02 06:03:22.586	2025-09-02 06:07:31.457
cmez4ylz7001evkvoo7mcs4ly	cmez4xl780003vkwcly8nts4q	California Salad	Mixed greens, avocado, tomatoes, cucumbers, and balsamic vinaigrette	12.75	\N	t	t	3	\N	\N	\N	2025-08-31 03:33:32.227	2025-09-02 07:37:00.713
cmf23xcdt000gvkq0ga0itt8k	cmez5buf20006vkvsv0wezhi1	Buffalo Fingers (6 pcs)	Sweet and tangy BBQ 	12.5	\N	t	t	2002	\N	\N	\N	2025-09-02 05:27:52.049	2025-09-02 05:29:30.158
cmf25al1g002cvkq0yqm24f0y	cmf1pnx7k0009vk58x1j00wur	Onion Rings (large)	battered onion rings	7.5	\N	t	t	1002	\N	\N	\N	2025-09-02 06:06:09.412	2025-09-02 06:06:46.549
cmf0cawzy0002vkccpj8t0hcd	cmf0cawz80000vkccemljdoul	Super Beef on Onion Roll	Premium beef sandwich served on fresh onion roll	12.55	\N	t	t	1	\N	\N	\N	2025-08-31 23:46:49.87	2025-08-31 23:46:49.87
cmf0cax050004vkccpmzsgz01	cmf0cawz80000vkccemljdoul	Regular Beef on Sesame Roll	Classic beef sandwich served on sesame roll	11.55	\N	t	t	2	\N	\N	\N	2025-08-31 23:46:49.878	2025-08-31 23:46:49.878
cmf0cax090006vkcc6nicnffq	cmf0cawz80000vkccemljdoul	Junior Beef	Smaller portion beef sandwich perfect for lighter appetites	10.55	\N	t	t	3	\N	\N	\N	2025-08-31 23:46:49.881	2025-08-31 23:46:49.881
cmf0cax0c0008vkcckefjlktt	cmf0cawz80000vkccemljdoul	Super Pastrami on Onion Roll	Premium pastrami sandwich served on fresh onion roll	12.55	\N	t	t	4	\N	\N	\N	2025-08-31 23:46:49.884	2025-08-31 23:46:49.884
cmf0cax0e000avkcc3z2pv3mf	cmf0cawz80000vkccemljdoul	Regular Pastrami	Classic pastrami sandwich on your choice of bread	11.55	\N	t	t	5	\N	\N	\N	2025-08-31 23:46:49.886	2025-08-31 23:46:49.886
cmf0cax0g000cvkcc3yucqldr	cmf0cawz80000vkccemljdoul	Haddock Sandwich (2pcs)	Two pieces of fresh haddock served on sesame bun	16.3	\N	t	t	6	\N	\N	\N	2025-08-31 23:46:49.889	2025-08-31 23:46:49.889
cmf0cax0j000evkccpkhckphc	cmf0cawz80000vkccemljdoul	Chicken Sandwich	Crispy chicken breast served with lettuce and tomato	8.55	\N	t	t	7	\N	\N	\N	2025-08-31 23:46:49.891	2025-08-31 23:46:49.891
cmf0cax0l000gvkccso3qb8to	cmf0cawz80000vkccemljdoul	Hamburger	Classic hamburger with fresh beef patty	7.8	\N	t	t	8	\N	\N	\N	2025-08-31 23:46:49.893	2025-08-31 23:46:49.893
cmf0cax0o000ivkcca3j6fhf0	cmf0cawz80000vkccemljdoul	Cheeseburger	Classic hamburger with melted cheese	8.3	\N	t	t	9	\N	\N	\N	2025-08-31 23:46:49.896	2025-08-31 23:46:49.896
cmf0cax0q000kvkccfccoae63	cmf0cawz80000vkccemljdoul	Hot Dog	All-beef hot dog served on frankfurter roll	6.3	\N	t	t	10	\N	\N	\N	2025-08-31 23:46:49.898	2025-08-31 23:46:49.898
cmf0cax0s000mvkcc28pgk2s4	cmf0cawz80000vkccemljdoul	Gyro	Traditional Greek gyro with lamb and beef, onions, tomatoes and tzatziki sauce	11.5	\N	t	t	11	\N	\N	\N	2025-08-31 23:46:49.9	2025-08-31 23:46:49.9
cmf0cax0u000ovkcclyep16m6	cmf0cawz80000vkccemljdoul	Reuben	Classic Reuben with corned beef, sauerkraut, Swiss cheese and thousand island dressing on rye	12.8	\N	t	t	12	\N	\N	\N	2025-08-31 23:46:49.902	2025-08-31 23:46:49.902
cmf23xe7i000kvkq0qudi6y99	cmez5buf20006vkvsv0wezhi1	BBQ Fingers (12 pcs)	Sweet and tangy BBQ Fingers	23	\N	t	t	2002	\N	\N	\N	2025-09-02 05:27:54.415	2025-09-02 05:36:45.329
cmf25rmyb002jvkq0q7k9kjv1	cmez5buf50008vkvsbnhrhccb	Haddock Chowder	Creamy clam chowder with tender clams and potatoes	10	\N	t	t	1001	\N	\N	\N	2025-09-02 06:19:25.044	2025-09-02 06:22:50.866
cmf24skss000vvkq0y84brlq9	cmf1pnx7k0009vk58x1j00wur	Fried Raviolis 	Fried Raviolis	9.5	\N	t	t	1001	\N	\N	\N	2025-09-02 05:52:09.292	2025-09-02 05:52:59.367
cmf25wi8c002lvkq0tsshzk16	cmez5buf50008vkvsbnhrhccb	Cup of Chili		7.5	\N	t	t	1001	\N	\N	\N	2025-09-02 06:23:12.204	2025-09-02 06:24:50.985
cmf0kymu2000avk5g9b5f3kt4	cmf0llm9o0002vkk8ah0l3w9l	Scallops	Fresh scallops box	27	\N	t	t	2	\N	\N	\N	2025-09-01 03:49:13.371	2025-09-02 08:05:11.218
cmez527ch0018vk8032m02431	cmez4xl780003vkwcly8nts4q	Salad with Lobster	Fresh mixed greens, with our local lobster	39	\N	t	t	7	\N	\N	\N	2025-08-31 03:36:19.889	2025-09-02 08:31:10.769
cmf237uan0011vk88f0katf7g	cmez5buf00005vkvso9m4c4xj	Buffalo Wings (6 pcs)	Sweet and tangy BBQ wings	12.5	\N	t	t	1002	\N	\N	\N	2025-09-02 05:08:02.208	2025-09-02 05:08:58.394
cmf24ueki0010vkq0m620k5bu	cmf1pnx7k0009vk58x1j00wur	Fried Mushrooms	Fried Mushrooms	9.5	\N	t	t	2001	\N	\N	\N	2025-09-02 05:53:34.53	2025-09-02 05:53:47.954
cmf25wmfm002nvkq03z4gq4ea	cmez5buf50008vkvsbnhrhccb	Chicken Noodle		7.5	\N	t	t	2001	\N	\N	\N	2025-09-02 06:23:17.65	2025-09-02 06:24:34.701
cmez4ylz7001cvkvoyc2xmwxy	cmez4xl780003vkwcly8nts4q	Caesar Salad	Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing	12.5	\N	t	t	2	\N	\N	\N	2025-08-31 03:33:32.227	2025-09-02 07:36:23.156
cmf0kymsi0006vk5gyp8abnrw	cmf0llm9o0002vkk8ah0l3w9l	Native Clams	Fresh native clams box	29	\N	t	t	1	\N	\N	\N	2025-09-01 03:49:13.314	2025-09-01 04:07:35.166
cmf0kymv2000evk5gecv43nyi	cmf0llm9o0002vkk8ah0l3w9l	Strip Clams	Fresh strip clams box	16	\N	t	t	3	\N	\N	\N	2025-09-01 03:49:13.407	2025-09-01 04:07:35.179
cmf0kymv8000ivk5gtwrp5ro4	cmf0llm9o0002vkk8ah0l3w9l	Shrimps	Fresh shrimp box	18.5	\N	t	t	4	\N	\N	\N	2025-09-01 03:49:13.412	2025-09-01 04:07:35.186
cmf23bzgf0016vk88w5s74h2s	cmez5buf00005vkvso9m4c4xj	BBQ Wings (12 pcs)	Classic regular wings	23	\N	t	t	1006	\N	\N	\N	2025-09-02 05:11:15.52	2025-09-02 05:21:33.014
cmf24vzqk0015vkq06atrczo6	cmf1pnx7k0009vk58x1j00wur	Mozzarella Sticks	Mozzarella Sticks 	9.5	\N	t	t	3001	\N	\N	\N	2025-09-02 05:54:48.62	2025-09-02 05:55:07.145
cmf2896oh003pvkq0y570kdx0	cmf283ib1003nvkq0tvwy17r3	Build Your Salad	Select salad bed, protein, and dressing	9.75	\N	t	t	0	\N	\N	\N	2025-09-02 07:29:02.994	2025-09-02 07:29:02.994
cmez5bufx000tvkvs3psh4hyl	cmez5bueu0001vkvsuragc8gi	Sea Monster (Scallops, Clams, Shrimps & Haddock)	Fresh Haddock, scallops, shrimps and clams it is HUGE good for two people, comes with french fries, onion rings and a side of coleslaw or pasta salad	48	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.725	2025-09-02 07:44:44.597
cmez5buff000dvkvsaexqwttc	cmez5buep0000vkvs74qojdfm	Hamburger Plate	Juicy hamburger patty with lettuce, tomato, onion, served with fries	14.99	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.707	2025-08-31 03:43:49.707
cmez5bufh000fvkvscpxd5o66	cmez5buep0000vkvs74qojdfm	Cheeseburger Plate	Hamburger with American cheese, lettuce, tomato, onion, served with fries	15.99	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.709	2025-08-31 03:43:49.709
cmez5bufm000jvkvsxckws9nb	cmez5buep0000vkvs74qojdfm	Chicken Wings Plate	8 pieces of chicken wings with fries and coleslaw	15.99	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.715	2025-08-31 03:43:49.715
cmez5bufp000lvkvs2gz0d9ii	cmez5buep0000vkvs74qojdfm	Chicken Fingers Plate	Chicken fingers with fries and choice of dipping sauce	14.99	\N	t	t	6	\N	\N	\N	2025-08-31 03:43:49.717	2025-08-31 03:43:49.717
cmez5bufr000nvkvs5a925es2	cmez5buep0000vkvs74qojdfm	Roast Beef Plate	Sliced roast beef with mashed potatoes and gravy	16.99	\N	t	t	7	\N	\N	\N	2025-08-31 03:43:49.719	2025-08-31 03:43:49.719
cmez5buft000pvkvsdwqpwkc5	cmez5buep0000vkvs74qojdfm	Steak Tip Kabob Plate	Grilled steak tips with rice, salad, and tzatziki sauce	18.99	\N	t	t	8	\N	\N	\N	2025-08-31 03:43:49.721	2025-08-31 03:43:49.721
cmez5bufv000rvkvsq3b7iw35	cmez5buep0000vkvs74qojdfm	Fish 'n Chips	Beer-battered haddock with fries and coleslaw	15.99	\N	t	t	9	\N	\N	\N	2025-08-31 03:43:49.723	2025-08-31 03:43:49.723
cmez5bug1000xvkvsytz35wfc	cmez5bueu0001vkvsuragc8gi	Haddock Plate	A huge piece of haddock fish on a bed of french fries and onion rings and a choice of pasta or coleslaw	35.5	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.73	2025-09-02 08:06:04.467
cmf23x2l00004vkq04uywrd85	cmez5buf20006vkvsv0wezhi1	BBQ Fingers (6 pcs)	Sweet and tangy BBQ Fingers	12.5	\N	t	t	1002	\N	\N	\N	2025-09-02 05:27:39.348	2025-09-02 05:33:44.131
cmez5bufb000bvkvsvxlcblte	cmez5buep0000vkvs74qojdfm	Gyro Plate	Traditional Greek gyro with tzatziki sauce, served with fries and Greek salad	17.25	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.704	2025-09-02 08:42:17.163
cmf251n5m001cvkq02mypho7f	cmf1pnx7k0009vk58x1j00wur	Spinach Egg Roll	Spinach Egg Roll	5	\N	t	t	1002	\N	\N	\N	2025-09-02 05:59:12.251	2025-09-02 06:00:13.148
cmez5bufk000hvkvspk80r6rp	cmez5buep0000vkvs74qojdfm	Chicken Kabob Plate	Grilled chicken kabob with rice, salad, and tzatziki sauce	13.74	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.713	2025-08-31 21:45:56.451
cmez5bug3000zvkvshe0vwnu8	cmez5bueu0001vkvsuragc8gi	2-way Scallops & Clams Plate	Best of the Sea.. scallops and Native clams, piled on onion rings and french fries with a choice of coleslaw or pasta salad	39.5	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.732	2025-09-01 00:25:31.93
cmez5bug50011vkvs330um4k1	cmez5bueu0001vkvsuragc8gi	3-way Shrimps, Scallops & Clams Plate	A fresh pile of shrimps, scallops and clams piled on onion rings and french fries with a side of coleslaw or pasta salad	40.95	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.734	2025-09-01 00:25:31.931
cmez5bufz000vvkvssfm47yoi	cmez5bueu0001vkvsuragc8gi	Scallops Plate	A plate of scallops fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad	43.5	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.728	2025-09-01 00:25:31.927
cmez5bug70013vkvs6aw3qmtk	cmez5bueu0001vkvsuragc8gi	Strip Clams Plate	Strip clams deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad	23.5	\N	t	t	6	\N	\N	\N	2025-08-31 03:43:49.736	2025-09-01 00:25:31.933
cmez5bug90015vkvsh9ihifu1	cmez5bueu0001vkvsuragc8gi	Shrimps Plate	Fresh shrimps deep fried to perfection, served with fries, onion rings and a side of coleslaw or pasta salad	26.5	\N	t	t	7	\N	\N	\N	2025-08-31 03:43:49.738	2025-09-01 00:25:31.935
cmez5bugb0017vkvs8vxrv5iw	cmez5bueu0001vkvsuragc8gi	Native Clams Plate	Fresh locally sourced clams with an option of pasta salad or coleslaw on a bed of french fries and onion rings	44	\N	t	t	8	\N	\N	\N	2025-08-31 03:43:49.739	2025-09-01 00:25:31.938
cmez5bui80033vkvshs0kiawt	cmez5buf00005vkvso9m4c4xj	Regular Wings (12 pcs)	Classic regular wings	23	\N	t	t	6	\N	\N	\N	2025-08-31 03:43:49.809	2025-09-02 05:04:42.111
cmf0kz13z0006vkg4nqr2kpbj	cmf0llm9o0002vkk8ah0l3w9l	Native Clams	Fresh native clams box	29	\N	t	t	1	\N	\N	\N	2025-09-01 03:49:31.872	2025-09-02 07:47:11.204
cmez5bui3002xvkvsn4umf699	cmez5buf00005vkvso9m4c4xj	Regular Wings (6 pcs)	Classic regular wings	12.5	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.803	2025-09-02 05:05:14.901
cmez5bui5002zvkvspubn8tcx	cmez5buf00005vkvso9m4c4xj	Buffalo Wings (12 pcs)	Classic buffalo wings with hot sauce	23	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.805	2025-09-02 05:22:54.128
cmf23x5cr0006vkq0ijin4rtq	cmez5buf20006vkvsv0wezhi1	Regular Fingers (6 pcs)	Classic regular wings	12.5	\N	t	t	1003	\N	\N	\N	2025-09-02 05:27:42.939	2025-09-02 05:28:37.033
cmez5buij003dvkvsofytltn1	cmf1pnx7k0009vk58x1j00wur	Onion Rings	battered onion rings	6.5	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.819	2025-09-02 05:57:43.14
cmf253ief001ivkq0ncp320fv	cmf1pnx7k0009vk58x1j00wur	 Egg Roll	Egg Roll	5	\N	t	t	2002	\N	\N	\N	2025-09-02 06:00:39.399	2025-09-02 06:00:58.276
cmez5buir003lvkvstoqgn5ml	cmez5buf50008vkvsbnhrhccb	New England Clam Chowder	Creamy clam chowder with tender clams and potatoes	10	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.827	2025-09-02 06:18:52.54
cmez5buhf0029vkvs95vr1a6m	cmez5buex0003vkvs8abknm9j	Chicken Salad	Roasted chicken salad, all we add is mayonnaise so you can taste the chicken. add to it as you need from a variety of condiments or toppings	12.74	\N	t	t	6	\N	\N	\N	2025-08-31 03:43:49.779	2025-08-31 21:16:20.212
cmez5buhh002bvkvsqef86gvy	cmez5buex0003vkvs8abknm9j	Crab Meat	Crab meat salad, select your size and your type of bread	12.74	\N	t	t	7	\N	\N	\N	2025-08-31 03:43:49.781	2025-08-31 21:16:20.212
cmez5buhj002dvkvs2wlo8w8h	cmez5buex0003vkvs8abknm9j	Veggie Sub	Cold veggies sub, loaded with lettuce, tomatoes, green peppers, cucumbers, black olives, onions	12.74	\N	t	t	8	\N	\N	\N	2025-08-31 03:43:49.783	2025-08-31 21:16:20.212
cmez5buhl002fvkvs101lksxm	cmez5buex0003vkvs8abknm9j	Turkey Sub	Turkey sub with or without cheese but you can add veggies	12.74	\N	t	t	9	\N	\N	\N	2025-08-31 03:43:49.785	2025-08-31 21:16:20.212
cmez5buhn002hvkvsfy7fj8g9	cmez5buex0003vkvs8abknm9j	BLT Sub	We can spell too yes it is...Bacon, Lettuce and Tomatoes. add other toppings as well.	12.74	\N	t	t	10	\N	\N	\N	2025-08-31 03:43:49.787	2025-08-31 21:16:20.212
cmez5buhp002jvkvs1ar0eppl	cmez5buey0004vkvs8ypqlpri	Steak Bomb	Steak and Cheese with Grilled peppers, Onions, mushrooms and american cheese	12.74	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.789	2025-08-31 23:36:18.65
cmez5buhq002lvkvsp6t5damr	cmez5buey0004vkvs8ypqlpri	Pepper Cheese Steak	Steak and Cheese with Grilled peppers	12.25	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.791	2025-08-31 23:36:18.654
cmez5buhv002pvkvs92heqdfm	cmez5buey0004vkvs8ypqlpri	Mushroom Cheese Steak	Steak and Cheese with Mushroom	12.25	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.795	2025-08-31 23:36:18.656
cmez5buhx002rvkvs1n6haty2	cmez5buey0004vkvs8ypqlpri	Steak Sub Build Your Own	Select the size of your sub starts with the shaved steaks and add your cheese, toppings and condiments	12.25	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.797	2025-08-31 23:36:18.646
cmez5buhs002nvkvs686iuiqw	cmez5buey0004vkvs8ypqlpri	Onion Cheese Steak	Steak and Cheese with Grilled onions	12.25	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.793	2025-08-31 23:36:18.652
cmf0kz147000avkg4lcptf42p	cmf0llm9o0002vkk8ah0l3w9l	Scallops	Fresh scallops box	27	\N	t	t	2	\N	\N	\N	2025-09-01 03:49:31.879	2025-09-01 04:07:35.175
cmf0kz14a000evkg4fvz7l8ax	cmf0llm9o0002vkk8ah0l3w9l	Strip Clams	Fresh strip clams box	16	\N	t	t	3	\N	\N	\N	2025-09-01 03:49:31.883	2025-09-01 04:07:35.182
cmf0kz14e000ivkg4fpi95zfv	cmf0llm9o0002vkk8ah0l3w9l	Shrimps	Fresh shrimp box	18.5	\N	t	t	4	\N	\N	\N	2025-09-01 03:49:31.886	2025-09-01 04:07:35.188
cmez5bui1002vvkvsu8xtp50l	cmez5buf00005vkvso9m4c4xj	BBQ Wings (6 pcs)	Sweet and tangy BBQ wings	12.5	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.801	2025-09-01 08:11:30.89
cmez4ylz7001jvkvorf8gutkb	cmez4xl780003vkwcly8nts4q	Greek Salad	Fresh romaine lettuce, tomatoes, cucumbers, red onions, Kalamata olives, and feta cheese	12.25	\N	t	t	1	\N	\N	\N	2025-08-31 03:33:32.227	2025-09-02 04:46:02.41
cmf0l31zw000mvk0sassix80k	cmf0llm9r0004vkk848mn4a93	Lobster Roll	Fresh New England Lobster roll with an option of Onion Rings or French fries (Seasonal)	41	\N	t	t	15	\N	\N	Seasonal availability - please ask about current availability	2025-09-01 03:52:39.644	2025-09-02 07:58:38.39
cmf23x7tz000avkq0qwdluiuz	cmez5buf20006vkvsv0wezhi1	Buffalo Fingers (12 pcs)	Classic buffalo fingers with hot sauce	23	\N	t	t	1004	\N	\N	\N	2025-09-02 05:27:46.151	2025-09-02 05:30:21.327
cmez5bugd0019vkvss1syr7lw	cmez5buew0002vkvs0misx39j	Build your Own Roast Beef Sub	Start by choosing size sub, and add toppings	12.74	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.741	2025-08-31 21:16:20.212
cmez5bugs001nvkvsg4st51kb	cmez5buew0002vkvs0misx39j	Meat Ball Sub	Meatballs in marinara sauce with your choice of no cheese or one of many options we have to offer	12.74	\N	t	t	8	\N	\N	\N	2025-08-31 03:43:49.756	2025-08-31 21:16:20.212
cmez5bugt001pvkvshj4za05r	cmez5buew0002vkvs0misx39j	Hot Pastrami	Pastrami in a warp or a 10" sub with options to make it your own	12.74	\N	t	t	9	\N	\N	\N	2025-08-31 03:43:49.758	2025-08-31 21:16:20.212
cmez5bugw001rvkvszj8ensiv	cmez5buew0002vkvs0misx39j	Hot Veggies	Fresh made to order Grilled Veggies, (grilled Mushroom, peppers and onions)	12.74	\N	t	t	10	\N	\N	\N	2025-08-31 03:43:49.76	2025-08-31 21:16:20.212
cmez5bugz001tvkvsin6tvpm5	cmez5buew0002vkvs0misx39j	Eggplant	Fresh made to order Eggplant, you can choose it in a wrap or a sub roll	12.74	\N	t	t	11	\N	\N	\N	2025-08-31 03:43:49.763	2025-08-31 21:16:20.212
cmez5buh0001vvkvsxlvetfm6	cmez5buew0002vkvs0misx39j	Veal Cutlet	Fresh made to order Veal cutlet, you can choose it in a wrap or a sub roll	12.74	\N	t	t	12	\N	\N	\N	2025-08-31 03:43:49.765	2025-08-31 21:16:20.212
cmez5buh2001xvkvsnhog34dl	cmez5buew0002vkvs0misx39j	Sausage sub	Fresh made to order Sausage, you can choose it in a wrap or a sub roll	12.74	\N	t	t	13	\N	\N	\N	2025-08-31 03:43:49.767	2025-08-31 21:16:20.212
cmez5buh4001zvkvsodoxnl83	cmez5buex0003vkvs8abknm9j	Italian Sub	Mortadella, salami and hot ham with provolone cheese, add oil and vinegar, pickles and hots	12.74	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.769	2025-08-31 21:16:20.212
cmez5buh60021vkvsx6pjsrsl	cmez5buex0003vkvs8abknm9j	American Sub	American Sub with Ham, Mortadella and American cheese.	12.74	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.77	2025-08-31 21:16:20.212
cmez5buh80023vkvsyejru7y7	cmez5buex0003vkvs8abknm9j	Imported Ham	Imported Ham add cheese and veggies to make it your way	12.74	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.772	2025-08-31 21:16:20.212
cmez5buha0025vkvss8g1oejt	cmez5buex0003vkvs8abknm9j	Genoa Salami Sub	Imported Genoa Salami with many options to customize	12.74	\N	t	t	4	\N	\N	\N	2025-08-31 03:43:49.774	2025-08-31 21:16:20.212
cmez5buhc0027vkvsy1aicbxf	cmez5buex0003vkvs8abknm9j	Tuna Salad	Homemade tuna salad no additives and no crazy things it is basic but add condiments, cheese and veggies and spice it up	12.74	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.776	2025-08-31 21:16:20.212
cmez5bugq001lvkvse0ycua9x	cmez5buew0002vkvs0misx39j	Chicken Caesar Wrap	Fresh made to order Grilled Chicken, you can choose the type of wrap.	15.25	\N	t	t	7	\N	\N	\N	2025-08-31 03:43:49.754	2025-08-31 21:27:39.13
cmf254y9l001nvkq028daxm2u	cmf1pnx7k0009vk58x1j00wur	French Fries (small)	Fried Mushrooms	6.5	\N	t	t	3001	\N	\N	\N	2025-09-02 06:01:46.618	2025-09-02 06:07:45.47
cmez5bugf001bvkvs9utg7k5d	cmez5buew0002vkvs0misx39j	Chicken Cutlet Sub	Chicken cutlet in special batter fried in a large sub roll.	13	\N	t	t	2	\N	\N	\N	2025-08-31 03:43:49.744	2025-08-31 21:48:45.993
cmez5bugo001jvkvslr3gsci2	cmez5buew0002vkvs0misx39j	Chicken Fingers/tenders	Fresh made to order Chicken fingers, you can choose it in a wrap or a sub roll	13	\N	t	t	6	\N	\N	\N	2025-08-31 03:43:49.752	2025-08-31 21:48:45.999
cmez5bugm001hvkvswtop2ezu	cmez5buew0002vkvs0misx39j	Cheese Burger	Fresh made to order 2-patty cheese burger, you can choose it in a wrap or a sub roll	13	\N	t	t	5	\N	\N	\N	2025-08-31 03:43:49.75	2025-08-31 21:48:46.009
cmez5bugi001dvkvsvl6qxe2v	cmez5buew0002vkvs0misx39j	Grilled Chicken Kabob	Fresh made to order Grilled Chicken, you can choose it in a wrap or a sub roll	13.74	\N	t	t	3	\N	\N	\N	2025-08-31 03:43:49.747	2025-08-31 21:48:46.015
cmf0l31zh0006vk0szbgocarb	cmf0llm9r0004vkk848mn4a93	Native Clams Roll	Locally sourced native clams on a bed of French fries or Onion rings	33	\N	t	t	11	\N	\N	\N	2025-09-01 03:52:39.63	2025-09-01 04:07:35.193
cmf0l31zm000avk0sn2us2ca1	cmf0llm9r0004vkk848mn4a93	Scallop Roll	Scallops locally sourced on a bed of French fries or Onion Rings	33	\N	t	t	12	\N	\N	\N	2025-09-01 03:52:39.634	2025-09-01 04:07:35.195
cmf0l31zp000evk0sbt2tojs7	cmf0llm9r0004vkk848mn4a93	Strip Clams Roll	Fresh strip clams on a roll with choice of French fries or Onion rings	18.5	\N	t	t	13	\N	\N	\N	2025-09-01 03:52:39.637	2025-09-01 04:07:35.197
cmf0l31zs000ivk0smgvhtovt	cmf0llm9r0004vkk848mn4a93	Shrimp Roll	Locally sourced shrimps on a bed of French fries or Onion Rings	20.5	\N	t	t	14	\N	\N	\N	2025-09-01 03:52:39.641	2025-09-01 04:07:35.2
cmf0l31zy000qvk0saes8ra8z	cmf0llm9r0004vkk848mn4a93	Tuna Roll	Tuna Salad on a roll with an option of onion rings or french fries	13.99	\N	t	t	16	\N	\N	\N	2025-09-01 03:52:39.646	2025-09-01 04:07:35.201
cmf0l3201000uvk0slm026x8y	cmf0llm9r0004vkk848mn4a93	Crab Meat Roll	Crab meat on a roll with option of Fries or Onion Rings	13.99	\N	t	t	17	\N	\N	\N	2025-09-01 03:52:39.649	2025-09-01 04:07:35.203
cmez5bugk001fvkvs8jtn5du0	cmez5buew0002vkvs0misx39j	Steak Tips Kabob	Fresh made to order Grilled Steak tips, you can choose it in a wrap or a sub roll	16.75	\N	t	t	1	\N	\N	\N	2025-08-31 03:43:49.749	2025-09-01 23:58:22.01
\.


ALTER TABLE public.menu_items ENABLE TRIGGER ALL;

--
-- Data for Name: pizza_crusts; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pizza_crusts DISABLE TRIGGER ALL;

COPY public.pizza_crusts (id, name, description, "priceModifier", "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmez57ct90007vkc4memkf1p1	Regular	Our classic hand-tossed crust	0	t	1	2025-08-31 03:40:20.254	2025-08-31 03:40:20.254
\.


ALTER TABLE public.pizza_crusts ENABLE TRIGGER ALL;

--
-- Data for Name: pizza_sauces; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pizza_sauces DISABLE TRIGGER ALL;

COPY public.pizza_sauces (id, name, description, color, "spiceLevel", "priceModifier", "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmez57ct10002vkc4dd3k6gig	Pizza Sauce	Classic tomato pizza sauce	#e53e3e	0	0	t	1	2025-08-31 03:40:20.245	2025-08-31 03:40:20.245
cmez57ct30003vkc4zgf8fsbt	Alfredo Sauce	Creamy white alfredo sauce	#f7fafc	0	0	t	1	2025-08-31 03:40:20.247	2025-08-31 03:40:20.247
cmez57ct40004vkc4ndh8iu2b	Garlic Butter Sauce	Rich garlic butter sauce	#fefcbf	0	0	t	1	2025-08-31 03:40:20.248	2025-08-31 03:40:20.248
cmez57ct50005vkc4udrjjw5h	White (No Sauce)	No sauce - just cheese and toppings	#ffffff	0	0	t	1	2025-08-31 03:40:20.25	2025-08-31 03:40:20.25
cmez57ct70006vkc4uuwgkjk5	Marinara sauce	Marinara sauce	#ff0000	1	0	t	1	2025-08-31 03:40:20.251	2025-08-31 03:40:20.251
\.


ALTER TABLE public.pizza_sauces ENABLE TRIGGER ALL;

--
-- Data for Name: pizza_sizes; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pizza_sizes DISABLE TRIGGER ALL;

COPY public.pizza_sizes (id, name, diameter, "basePrice", "isActive", "sortOrder", description, "createdAt", "updatedAt", "productType") FROM stdin;
cmez57csv0000vkc4nzo0th14	Small Pizza	12"	11.5	t	1	Perfect for 1-2 people	2025-08-31 03:40:20.24	2025-09-01 20:15:54.868	PIZZA
cmez57csy0001vkc4fbtoets6	Large Pizza	16"	16.5	t	2	Great for families and sharing	2025-08-31 03:40:20.242	2025-09-01 20:16:17.579	PIZZA
cmez5n8nl0000vk3k7n5edmea	Small Calzone	Personal size calzone	16	t	10	\N	2025-08-31 03:52:41.361	2025-09-01 20:16:24.519	CALZONE
cmez5n8nn0001vk3kjqe0zbsp	Large Calzone	Family size calzone	21.5	t	11	\N	2025-08-31 03:52:41.364	2025-09-01 20:16:34.376	CALZONE
\.


ALTER TABLE public.pizza_sizes ENABLE TRIGGER ALL;

--
-- Data for Name: specialty_calzones; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.specialty_calzones DISABLE TRIGGER ALL;

COPY public.specialty_calzones (id, "calzoneName", "calzoneDescription", "basePrice", category, "imageUrl", fillings, "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmez5ncad0000vkawbsowxu3l	Veggie Calzone	Fresh vegetable calzone	21.5	CALZONE	\N	["Roasted peppers","roasted onions","grilled tomatoes","mushrooms and broccoli"]	t	1	2025-08-31 03:52:46.07	2025-08-31 03:52:46.07
cmez5ncal0005vkawc1hizvly	Traditional Calzone	Classic pepperoni calzone	21.5	CALZONE	\N	["Pepperoni","ricotta cheese","sauce and our blends of mozzarella cheese"]	t	2	2025-08-31 03:52:46.078	2025-08-31 03:52:46.078
cmez5ncaq000avkawfzyept7d	Ham & Cheese Calzone	Ham and cheese calzone	21.5	CALZONE	\N	["Sauce","a blend of our cheese and ham and american cheese"]	t	3	2025-08-31 03:52:46.083	2025-08-31 03:52:46.083
cmez5ncav000fvkaw5851hj5o	Chicken Parmesan Calzone	Chicken parmesan calzone with marinara	21.5	CALZONE	\N	["Chicken parmesan","ricotta cheese with marinara sauce"]	t	4	2025-08-31 03:52:46.087	2025-08-31 03:52:46.087
cmez5ncaz000kvkawt4u0qleq	Chicken Broccoli Alfredo Calzone	Chicken and broccoli with alfredo sauce	21.5	CALZONE	\N	["Chicken","broccoli and onions with white alfredo sauce"]	t	5	2025-08-31 03:52:46.092	2025-08-31 03:52:46.092
cmez5ncb4000pvkawtrsi1vx1	Greek Calzone	Mediterranean style calzone	21.5	CALZONE	\N	["Feta","spinach and tomatoes"]	t	6	2025-08-31 03:52:46.096	2025-08-31 03:52:46.096
cmez5ncb8000uvkawhnyir4x3	Meatball Calzone	Hearty meatball calzone	21.5	CALZONE	\N	["Meatballs with marinara sauce and mozzarella cheese"]	t	7	2025-08-31 03:52:46.101	2025-08-31 03:52:46.101
\.


ALTER TABLE public.specialty_calzones ENABLE TRIGGER ALL;

--
-- Data for Name: specialty_pizzas; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.specialty_pizzas DISABLE TRIGGER ALL;

COPY public.specialty_pizzas (id, name, description, "basePrice", category, "imageUrl", ingredients, "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmez5mset0000vkawy2dx6uqm	Chicken Alfredo	Alfredo sauce topped with Broccoli, Onions, Chicken and our blend of cheeses	15.45	Premium	\N	["Alfredo Sauce","Chicken","Broccoli","Onions","Cheese Blend"]	t	1	2025-08-31 03:52:20.309	2025-08-31 03:52:20.309
cmez5msfw0005vkawuq4y4j55	BBQ Chicken	Chicken, Onion and Bacon with lots of BBQ sauce	16.5	Premium	\N	["BBQ Sauce","Chicken","Onion","Bacon","Cheese"]	t	2	2025-08-31 03:52:20.349	2025-08-31 03:52:20.349
cmez5msg3000avkawvqe7cusa	House Special	Meatball, Sausage, Pepperoni, Mushrooms, Grilled peppers and onions	16.5	Premium	\N	["Meatball","Sausage","Pepperoni","Mushrooms","Grilled Peppers","Grilled Onions","Cheese"]	t	3	2025-08-31 03:52:20.356	2025-08-31 03:52:20.356
cmez5msga000fvkawa2hp9b38	Buffalo Chicken	Buffalo Chicken, grilled Onion, grilled peppers with lots of cheese	16.5	Premium	\N	["Buffalo Chicken","Grilled Onion","Grilled Peppers","Extra Cheese"]	t	4	2025-08-31 03:52:20.363	2025-08-31 03:52:20.363
cmez5msgh000kvkawdkkg9et6	Meat Lovers	Meatball, Sausage, Pepperoni, Bacon, Salami and Ham	16.5	Meat Lovers	\N	["Meatball","Sausage","Pepperoni","Bacon","Salami","Ham","Cheese"]	t	5	2025-08-31 03:52:20.369	2025-08-31 03:52:20.369
cmez5msgn000pvkaw23ywxpn7	Athenian	Chicken with Alfredo, grilled Onion, fresh spinach and of course feta cheese	16.5	Premium	\N	["Chicken","Alfredo Sauce","Grilled Onion","Fresh Spinach","Feta Cheese","Mozzarella"]	t	6	2025-08-31 03:52:20.376	2025-08-31 03:52:20.376
cmez5msgu000uvkawnh7fpkrg	Veggie Pizza	Roasted peppers, roasted onions, fresh tomatoes, mushrooms and broccoli	16.5	Vegetarian	\N	["Roasted Peppers","Roasted Onions","Fresh Tomatoes","Mushrooms","Broccoli","Cheese"]	t	7	2025-08-31 03:52:20.382	2025-08-31 03:52:20.382
\.


ALTER TABLE public.specialty_pizzas ENABLE TRIGGER ALL;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.users DISABLE TRIGGER ALL;

COPY public.users (id, email, name, password, phone, "dateOfBirth", "avatarUrl", "isActive", "lastLoginAt", "emailVerified", "marketingOptIn", role, "resetTokenExpiry", "createdAt", "updatedAt", "resetToken") FROM stdin;
cmez7yyig0000vkgsnomscjd6	auy1jll33@gmail.com	Pizza Admin	$2b$12$9ed51fnOYuaP.4gNX/iP8eB69x0mQk/pMOXKUQ1ZUGO3JCd8cvgYu		\N	\N	t	\N	t	f	ADMIN	\N	2025-08-31 04:57:47.32	2025-08-31 05:01:22.816	\N
cmez8pyiz000dvkn8mhu5agrf	Liz@greenlandfamous.com	LIZ LIZ	$2b$12$lIN4lNxjf6U.KWcleUAw9O9PvhFk9Rvig5ThmPhqoLjjy5HYG/xfi		\N	\N	t	\N	t	f	EMPLOYEE	\N	2025-08-31 05:18:47.051	2025-08-31 05:18:47.051	\N
cmezcuymv0000vkgssi6itsdv	auy1jll@gmail.com	Admin User	$2b$10$Fu1DxTQRAksEwa0AN10tEuQGU6pJ/5G8rqYpnx9fWtoCCe1jRSECu	\N	\N	\N	t	\N	t	f	ADMIN	2025-08-31 09:02:32.253	2025-08-31 07:14:38.933	2025-08-31 08:02:32.253	8d81e9f63c7a05bdcc0cf5bfceb520d887d9f7655b9dba340c218cf90f3f9b88
cmezfwz7b0000vktgdestx9tn	staff101@greenlandFamous.com	operations greenland	$2b$12$wD89t2wf4E520KEhLqD2C.muvpRoxWlxuhO44XxjZDnkBdOl9oG4.		\N	\N	t	\N	t	f	EMPLOYEE	\N	2025-08-31 08:40:11.829	2025-08-31 08:58:06.567	\N
cmez8ob60000avkn8yv0rn3sc	admin@pizzabuilder.com	 	$2b$12$cUlfC/XtlV3piEXjN8CBFOuLb/xCibHWm9sbEd0MREsObk5iUD9cC		\N	\N	t	\N	t	f	ADMIN	\N	2025-08-31 05:17:30.121	2025-09-01 00:50:59.909	\N
\.


ALTER TABLE public.users ENABLE TRIGGER ALL;

--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.cart_items DISABLE TRIGGER ALL;

COPY public.cart_items (id, "sessionId", "userId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", quantity, "basePrice", "totalPrice", notes, "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") FROM stdin;
\.


ALTER TABLE public.cart_items ENABLE TRIGGER ALL;

--
-- Data for Name: customization_groups; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.customization_groups DISABLE TRIGGER ALL;

COPY public.customization_groups (id, "categoryId", name, description, type, "isRequired", "minSelections", "maxSelections", "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
cmez4ylw70003vkvowz7y4tsn	cmez4xl780003vkwcly8nts4q	Dressing	Choose your preferred dressing	SINGLE_SELECT	t	1	1	1	t	2025-08-31 03:33:32.069	2025-08-31 03:33:32.069
cmez4ylwa0005vkvoe8fpfq94	cmez4xl780003vkwcly8nts4q	Add-ons	Extra toppings and proteins	MULTI_SELECT	f	0	5	2	t	2025-08-31 03:33:32.069	2025-08-31 03:33:32.069
cmf06ou8b0000vkq4cyng3byo	\N	Bread Type	Select your bread	SINGLE_SELECT	t	1	1	1	t	2025-08-31 21:09:41.772	2025-08-31 21:09:41.772
cmf07bxj10000vkv8ziod1skk	\N	Bread Type - Large Only	Select your bread (Large sizes only)	SINGLE_SELECT	t	1	1	1	t	2025-08-31 21:27:39.133	2025-08-31 21:27:39.133
cmf08pvb50000vkz04t32pcxq	\N	Condiments	Choose your condiments	MULTI_SELECT	f	0	\N	2	t	2025-08-31 22:06:29.058	2025-08-31 22:06:29.058
cmf08pvbl000dvkz0ti867vpd	\N	Add Cheese	Add cheese for $0.75	MULTI_SELECT	f	0	\N	3	t	2025-08-31 22:06:29.073	2025-08-31 22:06:29.073
cmf09u7jm0000vkic0gt7k9ax	\N	Cold Sub Toppings	Fresh vegetables and toppings for cold subs	MULTI_SELECT	f	0	5	10	t	2025-08-31 22:37:51.154	2025-08-31 22:37:51.154
cmf0a0tg30000vkhsnwdbi0nm	\N	Hot Sub Toppings	Grilled and fresh toppings for hot subs	MULTI_SELECT	f	0	5	10	t	2025-08-31 22:42:59.475	2025-08-31 22:42:59.475
cmf0dooqi0005vkbcaetve5zt	\N	Side Choice	Choose your side	SINGLE_SELECT	t	0	1	2	t	2025-09-01 00:25:31.962	2025-09-01 00:25:31.962
cmf0doopy0000vkbcb6citd6a	\N	Fries and Onion Rings	Choose your fries option	SINGLE_SELECT	t	0	1	1	t	2025-09-01 00:25:31.942	2025-09-01 00:29:57.541
cmf0klk1c0000vki0gy432pcp	\N	Premium Toppings	\N	MULTI_SELECT	f	0	\N	3	t	2025-09-01 03:39:03.216	2025-09-01 03:39:03.216
cmf0kymvt000svk5g00zjcfdl	\N	Size	\N	SINGLE_SELECT	t	1	1	1	t	2025-09-01 03:49:13.434	2025-09-01 03:49:13.434
cmf0l31z80000vk0s10ywj3zp	\N	Choose Your Side	\N	SINGLE_SELECT	t	1	1	1	t	2025-09-01 03:52:39.62	2025-09-01 03:52:39.62
cmf0lfe6w0001vkqgiubwi9uz	cmez5bueu0001vkvsuragc8gi	Seafood Roll Sides	Choose your side for the seafood roll	SINGLE_SELECT	t	0	\N	0	t	2025-09-01 04:02:15.321	2025-09-01 04:02:15.321
cmez4ylus0001vkvoy8fe9hdo	\N	Toppings	Choose your pizza toppings	MULTI_SELECT	f	0	10	1	t	2025-08-31 03:33:32.069	2025-08-31 03:33:32.069
cmf26g4mw002pvkq03xf5r2t1	cmez4xl780003vkwcly8nts4q	Build your Salad	Select the salad bed	SINGLE_SELECT	t	0	1	0	t	2025-09-02 06:38:27.705	2025-09-02 06:38:27.705
cmf26thyi002xvkq01n46mw31	cmez4xl780003vkwcly8nts4q	Protein Build your Salad	Select your Protein 	MULTI_SELECT	t	0	4	3	t	2025-09-02 06:48:51.498	2025-09-02 07:33:12.097
cmf28n7mi003yvkq0k99uuzyp	\N	Sea Food condiments 		MULTI_SELECT	f	0	4	0	t	2025-09-02 07:39:57.402	2025-09-02 07:39:57.402
cmf2al5u70002vka4wyhqmvaq	cmez4xl780003vkwcly8nts4q	chef salad		SINGLE_SELECT	f	0	1	1	t	2025-09-02 08:34:21.007	2025-09-02 08:34:21.007
\.


ALTER TABLE public.customization_groups ENABLE TRIGGER ALL;

--
-- Data for Name: customization_options; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.customization_options DISABLE TRIGGER ALL;

COPY public.customization_options (id, "groupId", name, description, "priceModifier", "priceType", "isDefault", "isActive", "sortOrder", "maxQuantity", "nutritionInfo", allergens, "createdAt", "updatedAt") FROM stdin;
cmez4ylwn000avkvoem5xnd9y	cmez4ylw70003vkvowz7y4tsn	Ranch	Creamy ranch dressing	0	FLAT	t	t	1	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylwn000bvkvobo7zjy6m	cmez4ylw70003vkvowz7y4tsn	Caesar	Tangy Caesar dressing	0	FLAT	f	t	2	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmf09u7k3000gvkicqq2y4tv1	cmf09u7jm0000vkic0gt7k9ax	Cucumbers	Fresh cucumbers for your sub	0	FLAT	f	t	8	3	\N	\N	2025-08-31 22:37:51.172	2025-08-31 22:52:09.123
cmf09u7k5000ivkic4pk85wxs	cmf09u7jm0000vkic0gt7k9ax	Fresh Mushrooms	Fresh fresh mushrooms for your sub	0	FLAT	f	t	9	3	\N	\N	2025-08-31 22:37:51.173	2025-08-31 22:52:09.129
cmf09u7k6000kvkic0llcwu9q	cmf09u7jm0000vkic0gt7k9ax	Green Peppers	Fresh green peppers for your sub	0	FLAT	f	t	10	3	\N	\N	2025-08-31 22:37:51.175	2025-08-31 22:52:09.13
cmf09u7k8000mvkicokx89ynd	cmf09u7jm0000vkic0gt7k9ax	Red Onions	Fresh red onions for your sub	0	FLAT	f	t	11	3	\N	\N	2025-08-31 22:37:51.176	2025-08-31 22:52:09.131
cmf09u7ka000ovkicff5wdz2m	cmf09u7jm0000vkic0gt7k9ax	Jalapeños	Fresh jalapeños for your sub	0	FLAT	f	t	12	3	\N	\N	2025-08-31 22:37:51.178	2025-08-31 22:52:09.132
cmf09u7jr0002vkicqbtrp0we	cmf09u7jm0000vkic0gt7k9ax	Lettuce	Fresh lettuce for your sub	0	FLAT	f	t	1	3	\N	\N	2025-08-31 22:37:51.159	2025-08-31 22:52:09.134
cmf0a0tgc0006vkhsyfb3pgu4	cmf0a0tg30000vkhsnwdbi0nm	Grilled Bell Peppers	grilled bell peppers for your hot sub	0	FLAT	f	t	3	3	\N	\N	2025-08-31 22:42:59.484	2025-08-31 22:52:09.143
cmf0a0tgd0008vkhssaorp2x4	cmf0a0tg30000vkhsnwdbi0nm	Lettuce	lettuce for your hot sub	0	FLAT	f	t	4	3	\N	\N	2025-08-31 22:42:59.486	2025-08-31 22:52:09.144
cmf0a0tgf000avkhs7tr5wdkk	cmf0a0tg30000vkhsnwdbi0nm	Tomatoes	tomatoes for your hot sub	0	FLAT	f	t	5	3	\N	\N	2025-08-31 22:42:59.487	2025-08-31 22:52:09.145
cmf0a0tgh000cvkhsakb48jl5	cmf0a0tg30000vkhsnwdbi0nm	Fresh Onions	fresh onions for your hot sub	0	FLAT	f	t	6	3	\N	\N	2025-08-31 22:42:59.489	2025-08-31 22:52:09.146
cmf0a0tgi000evkhs2xjdf2xx	cmf0a0tg30000vkhsnwdbi0nm	Jalapeños	jalapeños for your hot sub	0	FLAT	f	t	7	3	\N	\N	2025-08-31 22:42:59.491	2025-08-31 22:52:09.147
cmf0dooqj0007vkbcz8vw554e	cmf0dooqi0005vkbcaetve5zt	Coleslaw	Fresh coleslaw	0	FLAT	t	t	1	\N	\N	\N	2025-09-01 00:25:31.964	2025-09-01 00:25:31.964
cmf0dooql0009vkbcrmhfopxt	cmf0dooqi0005vkbcaetve5zt	Pasta Salad	Homemade pasta salad	0	FLAT	f	t	2	\N	\N	\N	2025-09-01 00:25:31.966	2025-09-01 00:25:31.966
cmf0dudnt0003vkjwclyl8g2k	cmf0doopy0000vkbcb6citd6a	All Fries	French fries only	0	FLAT	f	t	2	\N	\N	\N	2025-09-01 00:29:57.546	2025-09-01 00:29:57.546
cmf0dudnv0005vkjw4aa3lm0g	cmf0doopy0000vkbcb6citd6a	All Onion Rings	Onion rings only	0	FLAT	f	t	3	\N	\N	\N	2025-09-01 00:29:57.547	2025-09-01 00:29:57.547
cmf0klk1j0002vki0navxncgu	cmf0klk1c0000vki0gy432pcp	Bacon	\N	2	FLAT	f	t	1	\N	\N	\N	2025-09-01 03:39:03.224	2025-09-01 03:39:03.224
cmf0klk1p0004vki0pofd29vg	cmf0klk1c0000vki0gy432pcp	Salami	\N	2	FLAT	f	t	2	\N	\N	\N	2025-09-01 03:39:03.229	2025-09-01 03:39:03.229
cmf0klk1q0006vki0ecxlwjzy	cmf0klk1c0000vki0gy432pcp	Avocado	\N	2	FLAT	f	t	3	\N	\N	\N	2025-09-01 03:39:03.231	2025-09-01 03:39:03.231
cmf0klk1t0008vki0uppynuey	cmf0klk1c0000vki0gy432pcp	Extra Meat	\N	4	FLAT	f	t	4	\N	\N	\N	2025-09-01 03:39:03.233	2025-09-01 03:39:03.233
cmf0kymvu000uvk5ghcgju24v	cmf0kymvt000svk5g00zjcfdl	Small	\N	0	FLAT	t	t	1	\N	\N	\N	2025-09-01 03:49:13.435	2025-09-01 03:49:13.435
cmf0kymvw000wvk5gwbw1ndjz	cmf0kymvt000svk5g00zjcfdl	Large	\N	3	FLAT	f	t	2	\N	\N	\N	2025-09-01 03:49:13.436	2025-09-01 03:49:13.436
cmf0l31zb0002vk0shzvlil4v	cmf0l31z80000vk0s10ywj3zp	French Fries	\N	0	FLAT	t	t	1	\N	\N	\N	2025-09-01 03:52:39.623	2025-09-01 03:52:39.623
cmf0l31zf0004vk0syluylhsb	cmf0l31z80000vk0s10ywj3zp	Onion Rings	\N	0	FLAT	f	t	2	\N	\N	\N	2025-09-01 03:52:39.628	2025-09-01 03:52:39.628
cmf0lfe6w0002vkqgp8xrtwbi	cmf0lfe6w0001vkqgiubwi9uz	French Fries	Crispy golden french fries	0	FLAT	t	t	1	\N	\N	\N	2025-09-01 04:02:15.321	2025-09-01 04:02:15.321
cmf0lfe6w0003vkqg4z175z2i	cmf0lfe6w0001vkqgiubwi9uz	Onion Rings	Crispy battered onion rings	0	FLAT	f	t	2	\N	\N	\N	2025-09-01 04:02:15.321	2025-09-01 04:02:15.321
cmf26lne3002tvkq0c2zngqdv	cmf26g4mw002pvkq03xf5r2t1	Iceberg Lettuce 	All Iceberg  Lettuce	0	FLAT	f	t	0	\N	\N	\N	2025-09-02 06:42:45.291	2025-09-02 06:42:45.291
cmez4ylwn000fvkvohplrherr	cmez4ylw70003vkvowz7y4tsn	Italian	Classic Italian dressing	0	FLAT	f	t	3	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylwn000evkvobelyorqq	cmez4ylw70003vkvowz7y4tsn	Balsamic Vinaigrette	Sweet and tangy balsamic dressing	0	FLAT	f	t	4	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylyi000hvkvobyftgnx5	cmez4ylwa0005vkvoe8fpfq94	Feta Cheese	Crumbled feta cheese	1.99	FLAT	f	t	2	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylyt000nvkvoebyzpq2w	cmez4ylwa0005vkvoe8fpfq94	Grilled Chicken	Tender grilled chicken breast	4.99	FLAT	f	t	1	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylyt000lvkvobpaa1h4o	cmez4ylwa0005vkvoe8fpfq94	Avocado	Fresh avocado slices	2.49	FLAT	f	t	3	\N	\N	\N	2025-08-31 03:33:32.136	2025-08-31 03:33:32.136
cmez4ylyu000pvkvouuz9ap6r	cmez4ylus0001vkvoy8fe9hdo	Mushrooms	Fresh sliced mushrooms	1.99	FLAT	f	t	2	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylyy000tvkvo86xfgohf	cmez4ylus0001vkvoy8fe9hdo	Green Peppers	Crisp green bell peppers	1.99	FLAT	f	t	3	\N	\N	\N	2025-08-31 03:33:32.135	2025-08-31 03:33:32.135
cmez4ylyy000vvkvow9wu95oy	cmez4ylus0001vkvoy8fe9hdo	Pepperoni	Classic pepperoni slices	2.49	FLAT	f	t	1	\N	\N	\N	2025-08-31 03:33:32.136	2025-08-31 03:33:32.136
cmez4ylyz000xvkvo3eaxqke7	cmez4ylus0001vkvoy8fe9hdo	Extra Cheese	Additional mozzarella cheese	2.49	FLAT	f	t	4	\N	\N	\N	2025-08-31 03:33:32.136	2025-08-31 03:33:32.136
cmf06ou8e0002vkq477o75rr7	cmf06ou8b0000vkq4cyng3byo	Small Sub Roll	Regular small sub roll	0	FLAT	t	t	1	1	\N	\N	2025-08-31 21:09:41.775	2025-08-31 21:09:41.775
cmf06ou8j0004vkq4424ax940	cmf06ou8b0000vkq4cyng3byo	Large Sub Roll	Large sub roll	1	FLAT	f	t	2	1	\N	\N	2025-08-31 21:09:41.779	2025-08-31 21:09:41.779
cmf06ou8k0006vkq4ad0nom4b	cmf06ou8b0000vkq4cyng3byo	Spinach Wrap	Fresh spinach wrap	1	FLAT	f	t	3	1	\N	\N	2025-08-31 21:09:41.781	2025-08-31 21:09:41.781
cmf06ou8l0008vkq4nq6u1es0	cmf06ou8b0000vkq4cyng3byo	Tomato Basil Wrap	Tomato basil flavored wrap	1	FLAT	f	t	4	1	\N	\N	2025-08-31 21:09:41.782	2025-08-31 21:09:41.782
cmf06ou8n000avkq49vu9wtla	cmf06ou8b0000vkq4cyng3byo	Wheat Wrap	Whole wheat wrap	1	FLAT	f	t	5	1	\N	\N	2025-08-31 21:09:41.783	2025-08-31 21:09:41.783
cmf06ou8o000cvkq43wz2o2h0	cmf06ou8b0000vkq4cyng3byo	White Wrap	Classic white wrap	1	FLAT	f	t	6	1	\N	\N	2025-08-31 21:09:41.784	2025-08-31 21:09:41.784
cmf06ou8q000evkq4m4gitee8	cmf06ou8b0000vkq4cyng3byo	No Bread	No bread - lettuce wrap style	0	FLAT	f	t	7	1	\N	\N	2025-08-31 21:09:41.787	2025-08-31 21:09:41.787
cmf07bxje0002vkv8j5whj331	cmf07bxj10000vkv8ziod1skk	Large Sub Roll	Large sub roll	0	FLAT	t	t	1	1	\N	\N	2025-08-31 21:27:39.147	2025-08-31 21:27:39.147
cmf07bxjl0004vkv8fj0fh19s	cmf07bxj10000vkv8ziod1skk	Spinach Wrap	Fresh spinach wrap	0	FLAT	f	t	2	1	\N	\N	2025-08-31 21:27:39.153	2025-08-31 21:27:39.153
cmf07bxjn0006vkv8l7et6vko	cmf07bxj10000vkv8ziod1skk	Tomato Basil Wrap	Tomato basil flavored wrap	0	FLAT	f	t	3	1	\N	\N	2025-08-31 21:27:39.155	2025-08-31 21:27:39.155
cmf07bxjp0008vkv8jeo8tgsm	cmf07bxj10000vkv8ziod1skk	Wheat Wrap	Whole wheat wrap	0	FLAT	f	t	4	1	\N	\N	2025-08-31 21:27:39.157	2025-08-31 21:27:39.157
cmf07bxjq000avkv8v2wfpeae	cmf07bxj10000vkv8ziod1skk	White Wrap	Classic white wrap	0	FLAT	f	t	5	1	\N	\N	2025-08-31 21:27:39.159	2025-08-31 21:27:39.159
cmf07bxjs000cvkv8al4440da	cmf07bxj10000vkv8ziod1skk	No Bread	No bread - lettuce wrap style	0	FLAT	f	t	6	1	\N	\N	2025-08-31 21:27:39.16	2025-08-31 21:27:39.16
cmf08pvba0002vkz07r7tyh9r	cmf08pvb50000vkz04t32pcxq	Horseradish	\N	0	FLAT	f	t	1	3	\N	\N	2025-08-31 22:06:29.062	2025-08-31 22:24:47.183
cmf08pvbe0004vkz0fen2jgf8	cmf08pvb50000vkz04t32pcxq	Mayonnaise	\N	0	FLAT	f	t	2	3	\N	\N	2025-08-31 22:06:29.067	2025-08-31 22:24:47.198
cmf08pvbf0006vkz0dieef09l	cmf08pvb50000vkz04t32pcxq	Mustard	\N	0	FLAT	f	t	3	3	\N	\N	2025-08-31 22:06:29.068	2025-08-31 22:24:47.2
cmf08pvbg0008vkz06snvl9iq	cmf08pvb50000vkz04t32pcxq	Ranch	\N	0	FLAT	f	t	4	3	\N	\N	2025-08-31 22:06:29.069	2025-08-31 22:24:47.201
cmf08pvbh000avkz039qbpu19	cmf08pvb50000vkz04t32pcxq	Spicy Mustard	\N	0	FLAT	f	t	5	3	\N	\N	2025-08-31 22:06:29.07	2025-08-31 22:24:47.203
cmf08pvbi000cvkz0laf72bax	cmf08pvb50000vkz04t32pcxq	Special BBQ Sauce	\N	0	FLAT	f	t	6	3	\N	\N	2025-08-31 22:06:29.071	2025-08-31 22:24:47.204
cmf08pvbn000hvkz0fgk5onm6	cmf08pvbl000dvkz0ti867vpd	American Cheese	\N	0.75	FLAT	f	t	2	3	\N	\N	2025-08-31 22:06:29.075	2025-08-31 22:53:38.201
cmf08pvbo000jvkz02vh4ikuz	cmf08pvbl000dvkz0ti867vpd	Provolone	\N	0.75	FLAT	f	t	3	3	\N	\N	2025-08-31 22:06:29.076	2025-08-31 22:53:38.203
cmf08pvbp000lvkz0djarjstz	cmf08pvbl000dvkz0ti867vpd	Swiss	\N	0.75	FLAT	f	t	4	3	\N	\N	2025-08-31 22:06:29.078	2025-08-31 22:53:38.204
cmf09u7jv0004vkic4y9hurlf	cmf09u7jm0000vkic0gt7k9ax	Tomatoes	Fresh tomatoes for your sub	0	FLAT	f	t	2	3	\N	\N	2025-08-31 22:37:51.163	2025-08-31 22:52:09.136
cmf09u7jw0006vkicosrfrw9a	cmf09u7jm0000vkic0gt7k9ax	Onions	Fresh onions for your sub	0	FLAT	f	t	3	3	\N	\N	2025-08-31 22:37:51.165	2025-08-31 22:52:09.137
cmf09u7jy0008vkicf8evi6kp	cmf09u7jm0000vkic0gt7k9ax	Pickles	Fresh pickles for your sub	0	FLAT	f	t	4	3	\N	\N	2025-08-31 22:37:51.166	2025-08-31 22:52:09.138
cmf09u7jz000avkicdaycl1k4	cmf09u7jm0000vkic0gt7k9ax	Hot Relish	Fresh hot relish for your sub	0	FLAT	f	t	5	3	\N	\N	2025-08-31 22:37:51.167	2025-08-31 22:52:09.139
cmf09u7k0000cvkic89ptj8tw	cmf09u7jm0000vkic0gt7k9ax	Banana Peppers	Fresh banana peppers for your sub	0	FLAT	f	t	6	3	\N	\N	2025-08-31 22:37:51.169	2025-08-31 22:52:09.14
cmf09u7k1000evkichr21ugn2	cmf09u7jm0000vkic0gt7k9ax	Black Olives	Fresh black olives for your sub	0	FLAT	f	t	7	3	\N	\N	2025-08-31 22:37:51.17	2025-08-31 22:52:09.141
cmf0a0tg70002vkhs95ofvt30	cmf0a0tg30000vkhsnwdbi0nm	Grilled Onions	grilled onions for your hot sub	0	FLAT	f	t	1	3	\N	\N	2025-08-31 22:42:59.479	2025-08-31 22:52:09.148
cmf0a0tga0004vkhsc1f2fbl7	cmf0a0tg30000vkhsnwdbi0nm	Grilled Mushrooms	grilled mushrooms for your hot sub	0	FLAT	f	t	2	3	\N	\N	2025-08-31 22:42:59.483	2025-08-31 22:52:09.149
cmf08pvbm000fvkz0szjg433q	cmf08pvbl000dvkz0ti867vpd	Blue Cheese	\N	0.75	FLAT	f	t	1	3	\N	\N	2025-08-31 22:06:29.074	2025-08-31 22:53:38.199
cmf0dudnr0001vkjwmeeto4hp	cmf0doopy0000vkbcb6citd6a	French Fries & Onion Rings	Combination of french fries and onion rings	0	FLAT	t	t	1	\N	\N	\N	2025-09-01 00:29:57.543	2025-09-01 00:29:57.543
cmf26mk8o002vvkq0l94u5kxr	cmf26g4mw002pvkq03xf5r2t1	Romaine Lettuce	Romaine	0	FLAT	f	t	0	\N	\N	\N	2025-09-02 06:43:27.864	2025-09-02 06:43:27.864
cmf26iyjo002rvkq0nk8h33ql	cmf26g4mw002pvkq03xf5r2t1	Mixed Greens	Mixed Greens	0	FLAT	t	t	0	\N	\N	\N	2025-09-02 06:40:39.78	2025-09-02 06:43:42.79
cmf26xfwg0035vkq0p113lugf	cmf26thyi002xvkq01n46mw31	Grilled Chicken		5	PER_UNIT	f	t	0	\N	\N	\N	2025-09-02 06:51:55.457	2025-09-02 06:51:55.457
cmf26thyn0033vkq0w54jn5fe	cmf26thyi002xvkq01n46mw31	Avocado 	Avocado 	3.5	FLAT	f	t	0	\N	\N	\N	2025-09-02 06:48:51.503	2025-09-02 06:52:57.171
cmf26thym0031vkq0ndc313xd	cmf26thyi002xvkq01n46mw31	Crabmeat	Crabmeat 	4	FLAT	f	t	0	\N	\N	\N	2025-09-02 06:48:51.503	2025-09-02 06:53:42.02
cmf270ukw0037vkq04c456k1c	cmf26thyi002xvkq01n46mw31	Tuna salad		4	FLAT	f	t	0	\N	\N	\N	2025-09-02 06:54:34.449	2025-09-02 06:54:34.449
cmf271mk20039vkq0plf56o5p	cmf26thyi002xvkq01n46mw31	Chicken Fingers		5	FLAT	f	t	0	\N	\N	\N	2025-09-02 06:55:10.706	2025-09-02 06:55:10.706
cmf272ats003bvkq09b2j4v55	cmf26thyi002xvkq01n46mw31	Chicken Salad		4	FLAT	f	t	0	\N	\N	\N	2025-09-02 06:55:42.16	2025-09-02 06:55:42.16
cmf272mrh003dvkq06e5os3b2	cmf26thyi002xvkq01n46mw31	Steak Tips		6	FLAT	f	t	0	\N	\N	\N	2025-09-02 06:55:57.63	2025-09-02 06:55:57.63
cmf28oh1a0040vkq01v4l72ca	cmf28n7mi003yvkq0k99uuzyp	Tartar Sauce		0	PER_UNIT	f	t	0	\N	\N	\N	2025-09-02 07:40:56.255	2025-09-02 07:40:56.255
cmf28p1nq0042vkq0cjlvv894	cmf28n7mi003yvkq0k99uuzyp	Cocktail sauce		0	PER_UNIT	f	t	0	\N	\N	\N	2025-09-02 07:41:22.982	2025-09-02 07:41:22.982
cmf28poh50044vkq0fbql3z7l	cmf28n7mi003yvkq0k99uuzyp	Ketchup		0	PER_UNIT	f	t	0	\N	\N	\N	2025-09-02 07:41:52.554	2025-09-02 07:41:52.554
cmf28qam90046vkq0ndftlkvh	cmf28n7mi003yvkq0k99uuzyp	Hot Sauce		0	PER_UNIT	f	t	0	\N	\N	\N	2025-09-02 07:42:21.25	2025-09-02 07:42:21.25
cmf2am3yb0004vka4zd46wqmm	cmf2al5u70002vka4wyhqmvaq	Tuna		0	PER_UNIT	t	t	0	\N	\N	\N	2025-09-02 08:35:05.22	2025-09-02 08:35:05.22
cmf2amz9c0006vka4nqlm138t	cmf2al5u70002vka4wyhqmvaq	Chicken salad		0	PER_UNIT	f	t	0	\N	\N	\N	2025-09-02 08:35:45.792	2025-09-02 08:35:45.792
\.


ALTER TABLE public.customization_options ENABLE TRIGGER ALL;

--
-- Data for Name: cart_item_customizations; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.cart_item_customizations DISABLE TRIGGER ALL;

COPY public.cart_item_customizations (id, "cartItemId", "customizationOptionId", quantity, price, "createdAt") FROM stdin;
\.


ALTER TABLE public.cart_item_customizations ENABLE TRIGGER ALL;

--
-- Data for Name: pizza_toppings; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pizza_toppings DISABLE TRIGGER ALL;

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


ALTER TABLE public.pizza_toppings ENABLE TRIGGER ALL;

--
-- Data for Name: cart_item_pizza_toppings; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.cart_item_pizza_toppings DISABLE TRIGGER ALL;

COPY public.cart_item_pizza_toppings (id, "cartItemId", "pizzaToppingId", quantity, section, intensity, price, "createdAt") FROM stdin;
\.


ALTER TABLE public.cart_item_pizza_toppings ENABLE TRIGGER ALL;

--
-- Data for Name: customer_addresses; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.customer_addresses DISABLE TRIGGER ALL;

COPY public.customer_addresses (id, "userId", label, "addressLine1", "addressLine2", city, state, "zipCode", country, "deliveryInstructions", "isDefault", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


ALTER TABLE public.customer_addresses ENABLE TRIGGER ALL;

--
-- Data for Name: customer_favorites; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.customer_favorites DISABLE TRIGGER ALL;

COPY public.customer_favorites (id, "userId", "favoriteName", "itemType", "itemData", "orderCount", "lastOrdered", "createdAt", "updatedAt") FROM stdin;
\.


ALTER TABLE public.customer_favorites ENABLE TRIGGER ALL;

--
-- Data for Name: customer_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.customer_profiles DISABLE TRIGGER ALL;

COPY public.customer_profiles (id, "userId", "firstName", "lastName", "dateOfBirth", phone, "avatarUrl", "dietaryPreferences", "favoritePizzaSizeId", "favoriteCrustId", "defaultOrderType", "marketingOptIn", "loyaltyPoints", "totalOrders", "totalSpent", "lastOrderDate", notes, "createdAt", "updatedAt") FROM stdin;
\.


ALTER TABLE public.customer_profiles ENABLE TRIGGER ALL;

--
-- Data for Name: email_logs; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.email_logs DISABLE TRIGGER ALL;

COPY public.email_logs (id, "to", subject, "templateKey", status, "errorMessage", "sentAt", "createdAt", "updatedAt") FROM stdin;
\.


ALTER TABLE public.email_logs ENABLE TRIGGER ALL;

--
-- Data for Name: email_settings; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.email_settings DISABLE TRIGGER ALL;

COPY public.email_settings (id, "settingKey", "settingValue", description, "isEncrypted", category, "createdAt", "updatedAt") FROM stdin;
\.


ALTER TABLE public.email_settings ENABLE TRIGGER ALL;

--
-- Data for Name: email_templates; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.email_templates DISABLE TRIGGER ALL;

COPY public.email_templates (id, "templateKey", name, subject, "htmlContent", "textContent", variables, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


ALTER TABLE public.email_templates ENABLE TRIGGER ALL;

--
-- Data for Name: employee_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.employee_profiles DISABLE TRIGGER ALL;

COPY public.employee_profiles (id, "userId", "employeeId", "firstName", "lastName", "position", department, phone, "emergencyContactName", "emergencyContactPhone", "hireDate", "hourlyWage", "isActive", permissions, "scheduleNotes", "createdAt", "updatedAt") FROM stdin;
cmez83ksq0001vkqwy6w4ixr9	cmez7yyig0000vkgsnomscjd6	EMP1756616482824	omar		Manager		\N	\N	\N	\N	\N	t	{}	\N	2025-08-31 05:01:22.826	2025-08-31 05:01:22.826
cmez8ob62000cvkn8fy00rlhs	cmez8ob60000avkn8yv0rn3sc									2025-08-31 05:17:30.121	\N	t	{order_management,kitchen_access,menu_edit,reports_access,user_management}	\N	2025-08-31 05:17:30.122	2025-08-31 05:17:30.122
cmez8pyj0000fvkn8u2iytrm7	cmez8pyiz000dvkn8mhu5agrf	1212	LIZ	LIZ		Kitchen				2025-08-31 05:18:47.049	\N	t	{order_management,kitchen_access}	\N	2025-08-31 05:18:47.052	2025-08-31 05:18:47.052
cmezfwz7o0002vktgg14isvfl	cmezfwz7b0000vktgdestx9tn	101	operations	greenland						2025-08-31 08:40:11.842	\N	t	{kitchen_access,order_management}	\N	2025-08-31 08:40:11.843	2025-08-31 08:40:11.843
\.


ALTER TABLE public.employee_profiles ENABLE TRIGGER ALL;

--
-- Data for Name: modifiers; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.modifiers DISABLE TRIGGER ALL;

COPY public.modifiers (id, name, type, price, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


ALTER TABLE public.modifiers ENABLE TRIGGER ALL;

--
-- Data for Name: item_modifiers; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.item_modifiers DISABLE TRIGGER ALL;

COPY public.item_modifiers (id, "itemId", "modifierId", "isDefault", "maxSelectable", "createdAt") FROM stdin;
\.


ALTER TABLE public.item_modifiers ENABLE TRIGGER ALL;

--
-- Data for Name: jwt_blacklist; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.jwt_blacklist DISABLE TRIGGER ALL;

COPY public.jwt_blacklist (id, jti, "expiresAt", reason, "createdAt") FROM stdin;
\.


ALTER TABLE public.jwt_blacklist ENABLE TRIGGER ALL;

--
-- Data for Name: jwt_secrets; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.jwt_secrets DISABLE TRIGGER ALL;

COPY public.jwt_secrets (id, kid, secret, algorithm, "isActive", "rotatedAt", "createdAt") FROM stdin;
\.


ALTER TABLE public.jwt_secrets ENABLE TRIGGER ALL;

--
-- Data for Name: menu_item_customizations; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.menu_item_customizations DISABLE TRIGGER ALL;

COPY public.menu_item_customizations (id, "menuItemId", "customizationGroupId", "isRequired", "sortOrder", "createdAt") FROM stdin;
cmf2ah31w0000vka4nq0b7ksd	cmez527ch0018vk8032m02431	cmez4ylw70003vkvowz7y4tsn	f	1	2025-09-02 08:31:10.772
cmf1s5lq6005yvk0sh4ir46oj	cmez5bugk001fvkvs8jtn5du0	cmf0klk1c0000vki0gy432pcp	f	1	2025-09-01 23:58:22.014
cmf1s5lq6005zvk0sj7xdi0c9	cmez5bugk001fvkvs8jtn5du0	cmf07bxj10000vkv8ziod1skk	f	2	2025-09-01 23:58:22.014
cmf1s5lq60060vk0ssljoohmo	cmez5bugk001fvkvs8jtn5du0	cmf08pvb50000vkz04t32pcxq	f	3	2025-09-01 23:58:22.014
cmf1s5lq60061vk0sg13ivkb0	cmez5bugk001fvkvs8jtn5du0	cmf08pvbl000dvkz0ti867vpd	f	4	2025-09-01 23:58:22.014
cmf1s5lq60062vk0s9negvrnv	cmez5bugk001fvkvs8jtn5du0	cmf0a0tg30000vkhsnwdbi0nm	f	5	2025-09-01 23:58:22.014
cmf24tnfu000yvkq0064p77x9	cmf24skss000vvkq0y84brlq9	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:52:59.37
cmf24uoxf0013vkq07w0qtyzy	cmf24ueki0010vkq0m620k5bu	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:53:47.956
cmf24we160018vkq0egms4kaa	cmf24vzqk0015vkq06atrczo6	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:55:07.146
cmf28imbc003tvkq080i84s30	cmez4ylz7001cvkvoyc2xmwxy	cmez4ylw70003vkvowz7y4tsn	f	1	2025-09-02 07:36:23.16
cmf28imbc003uvkq04r1sp1xs	cmez4ylz7001cvkvoyc2xmwxy	cmf26thyi002xvkq01n46mw31	f	2	2025-09-02 07:36:23.16
cmf28jfai003vvkq08xjgg0zw	cmez4ylz7001evkvoo7mcs4ly	cmez4ylw70003vkvowz7y4tsn	f	1	2025-09-02 07:37:00.715
cmf28jfai003wvkq0ex5ihixp	cmez4ylz7001evkvoo7mcs4ly	cmf26thyi002xvkq01n46mw31	f	2	2025-09-02 07:37:00.715
cmf29jpfq0004vk7c0tgca00n	cmf0kymsi0006vk5gyp8abnrw	cmf0kymvt000svk5g00zjcfdl	f	999	2025-09-02 08:05:13.479
cmf29jpg20008vk7clcvg4kcm	cmf0kymsi0006vk5gyp8abnrw	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 08:05:13.49
cmf29jpg4000avk7cfalyb3m3	cmf0kymv2000evk5gecv43nyi	cmf0kymvt000svk5g00zjcfdl	f	999	2025-09-02 08:05:13.493
cmf29jpg9000evk7c8pw9bxur	cmf0kymv2000evk5gecv43nyi	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 08:05:13.498
cmf29jpgc000gvk7cl5dhlg59	cmf0kymv8000ivk5gtwrp5ro4	cmf0kymvt000svk5g00zjcfdl	f	999	2025-09-02 08:05:13.5
cmf29jpgi000kvk7cacc6f35l	cmf0kymv8000ivk5gtwrp5ro4	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 08:05:13.506
cmf29jpgk000mvk7cj2nle7yf	cmf0kz13z0006vkg4nqr2kpbj	cmf0kymvt000svk5g00zjcfdl	f	999	2025-09-02 08:05:13.508
cmf29jpgq000qvk7cb6hsg1m3	cmf0kz147000avkg4lcptf42p	cmf0kymvt000svk5g00zjcfdl	f	999	2025-09-02 08:05:13.515
cmf29jpgw000uvk7cjdji47yd	cmf0kz147000avkg4lcptf42p	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 08:05:13.52
cmf29jpgy000wvk7c6iv343c7	cmf0kz14a000evkg4fvz7l8ax	cmf0kymvt000svk5g00zjcfdl	f	999	2025-09-02 08:05:13.523
cmf29jph30010vk7cm770vt5n	cmf0kz14a000evkg4fvz7l8ax	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 08:05:13.528
cmf29jph60012vk7c1y5g5p0t	cmf0kz14e000ivkg4fpi95zfv	cmf0kymvt000svk5g00zjcfdl	f	999	2025-09-02 08:05:13.53
cmf29jphb0016vk7cp6y2qt05	cmf0kz14e000ivkg4fpi95zfv	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 08:05:13.535
cmf2anqkd0007vka4dxm5zxk1	cmez4ylz7001avkvowcpcy4ea	cmez4ylw70003vkvowz7y4tsn	f	1	2025-09-02 08:36:21.182
cmf2anqkd0008vka44uvqs8lg	cmez4ylz7001avkvowcpcy4ea	cmf2al5u70002vka4wyhqmvaq	f	2	2025-09-02 08:36:21.182
cmf2391ng0012vk88f47y61ab	cmf237uan0011vk88f0katf7g	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:08:58.397
cmf25bdp3002fvkq07w1oybf3	cmf25al1g002cvkq0yqm24f0y	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 06:06:46.552
cmf28td880047vkq0pn0j1u6t	cmez5bufx000tvkvs3psh4hyl	cmf0doopy0000vkbcb6citd6a	f	1	2025-09-02 07:44:44.601
cmf28td880048vkq0rj2jc75z	cmez5bufx000tvkvs3psh4hyl	cmf0dooqi0005vkbcaetve5zt	f	2	2025-09-02 07:44:44.601
cmf28td880049vkq0hmwknk6y	cmez5bufx000tvkvs3psh4hyl	cmf28n7mi003yvkq0k99uuzyp	f	3	2025-09-02 07:44:44.601
cmf29kss60017vk7cku6bjgzt	cmez5bug1000xvkvsytz35wfc	cmf0doopy0000vkbcb6citd6a	f	1	2025-09-02 08:06:04.47
cmf29kss60018vk7cpsf789m7	cmez5bug1000xvkvsytz35wfc	cmf0dooqi0005vkbcaetve5zt	f	2	2025-09-02 08:06:04.47
cmf29kss60019vk7cz0jvdsx7	cmez5bug1000xvkvsytz35wfc	cmf28n7mi003yvkq0k99uuzyp	f	3	2025-09-02 08:06:04.47
cmf2avd8u0009vka47m67gvf1	cmez5bufb000bvkvsvxlcblte	cmf0doopy0000vkbcb6citd6a	f	1	2025-09-02 08:42:17.166
cmf2avd8u000avka4eue7apbt	cmez5bufb000bvkvsvxlcblte	cmf0l31z80000vk0s10ywj3zp	f	2	2025-09-02 08:42:17.166
cmf07zb3m0001vkk8gan9wdxi	cmez5bugf001bvkvs9utg7k5d	cmf07bxj10000vkv8ziod1skk	t	0	2025-08-31 21:45:49.811
cmf07zb400005vkk8kr551ejp	cmez5bugm001hvkvswtop2ezu	cmf07bxj10000vkv8ziod1skk	t	0	2025-08-31 21:45:49.824
cmf07zb450007vkk8eaetf6uh	cmez5bufk000hvkvspk80r6rp	cmf07bxj10000vkv8ziod1skk	t	0	2025-08-31 21:45:49.83
cmf09u7kh000qvkic1svzpk6z	cmez5buhf0029vkvs95vr1a6m	cmf09u7jm0000vkic0gt7k9ax	f	4	2025-08-31 22:37:51.185
cmf09u7kj000svkic3wudogh0	cmez5buhh002bvkvsqef86gvy	cmf09u7jm0000vkic0gt7k9ax	f	4	2025-08-31 22:37:51.187
cmf09u7kk000uvkicrgbma9af	cmez5buhj002dvkvs2wlo8w8h	cmf09u7jm0000vkic0gt7k9ax	f	4	2025-08-31 22:37:51.188
cmf09u7kl000wvkic4qsznkbz	cmez5buhl002fvkvs101lksxm	cmf09u7jm0000vkic0gt7k9ax	f	4	2025-08-31 22:37:51.189
cmf09u7km000yvkiczpiditgj	cmez5buhn002hvkvsfy7fj8g9	cmf09u7jm0000vkic0gt7k9ax	f	4	2025-08-31 22:37:51.191
cmf09u7ko0010vkicty25h4yw	cmez5buh4001zvkvsodoxnl83	cmf09u7jm0000vkic0gt7k9ax	f	4	2025-08-31 22:37:51.192
cmf09u7kp0012vkic27apsbfv	cmez5buh60021vkvsx6pjsrsl	cmf09u7jm0000vkic0gt7k9ax	f	4	2025-08-31 22:37:51.194
cmf09u7kq0014vkic1voizwpc	cmez5buh80023vkvsyejru7y7	cmf09u7jm0000vkic0gt7k9ax	f	4	2025-08-31 22:37:51.195
cmf09u7kr0016vkicee6l8616	cmez5buha0025vkvss8g1oejt	cmf09u7jm0000vkic0gt7k9ax	f	4	2025-08-31 22:37:51.196
cmf09u7kt0018vkic3q8788xu	cmez5buhc0027vkvsy1aicbxf	cmf09u7jm0000vkic0gt7k9ax	f	4	2025-08-31 22:37:51.197
cmf0bhrkb001hvkz4u3nmb1tk	cmez5buhx002rvkvs1n6haty2	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 23:24:09.804
cmf0bhrkd001jvkz45von16yk	cmez5buhx002rvkvs1n6haty2	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:24:09.805
cmf0bhrkf001lvkz4mb1abudf	cmez5buhx002rvkvs1n6haty2	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:24:09.807
cmf0bhrkh001nvkz4hn8678gl	cmez5buhx002rvkvs1n6haty2	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:24:09.809
cmf0ckbiy001rvk70t7erqw78	cmf0cax0s000mvkcc28pgk2s4	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:54:08.602
cmf0ckbiz001tvk70bp3473xk	cmf0cax0s000mvkcc28pgk2s4	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:54:08.603
cmf0ckbj1001vvk70kexozzl8	cmf0cax0u000ovkcclyep16m6	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:54:08.605
cmf0ckbj2001xvk70n9efppyo	cmf0cax0u000ovkcclyep16m6	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:54:08.607
cmf0ckbj4001zvk700j7ftu3w	cmf0cax0u000ovkcclyep16m6	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:54:08.608
cmf0dooqy000fvkbcunpmgzde	cmez5bufz000vvkvssfm47yoi	cmf0doopy0000vkbcb6citd6a	t	1	2025-09-01 00:25:31.978
cmf0door0000hvkbck9gy0yj3	cmez5bufz000vvkvssfm47yoi	cmf0dooqi0005vkbcaetve5zt	t	2	2025-09-01 00:25:31.98
cmf0door9000nvkbc2yjp9kpx	cmez5bug3000zvkvshe0vwnu8	cmf0doopy0000vkbcb6citd6a	t	1	2025-09-01 00:25:31.989
cmf0doorb000pvkbcw7s1s7zy	cmez5bug3000zvkvshe0vwnu8	cmf0dooqi0005vkbcaetve5zt	t	2	2025-09-01 00:25:31.991
cmf0doord000rvkbct38ckcsj	cmez5bug50011vkvs330um4k1	cmf0doopy0000vkbcb6citd6a	t	1	2025-09-01 00:25:31.993
cmf0doore000tvkbc0gn790xw	cmez5bug50011vkvs330um4k1	cmf0dooqi0005vkbcaetve5zt	t	2	2025-09-01 00:25:31.995
cmf0doorg000vvkbcpj3yaboa	cmez5bug70013vkvs6aw3qmtk	cmf0doopy0000vkbcb6citd6a	t	1	2025-09-01 00:25:31.996
cmf0doori000xvkbcp6ggn8wx	cmez5bug70013vkvs6aw3qmtk	cmf0dooqi0005vkbcaetve5zt	t	2	2025-09-01 00:25:31.999
cmf0doorl000zvkbcon6o8pq0	cmez5bug90015vkvsh9ihifu1	cmf0doopy0000vkbcb6citd6a	t	1	2025-09-01 00:25:32.001
cmf0doorn0011vkbcubd41d4e	cmez5bug90015vkvsh9ihifu1	cmf0dooqi0005vkbcaetve5zt	t	2	2025-09-01 00:25:32.004
cmf0doorq0013vkbcwniod1ig	cmez5bugb0017vkvs8vxrv5iw	cmf0doopy0000vkbcb6citd6a	t	1	2025-09-01 00:25:32.006
cmf0doort0015vkbcxwm9wrz0	cmez5bugb0017vkvs8vxrv5iw	cmf0dooqi0005vkbcaetve5zt	t	2	2025-09-01 00:25:32.009
cmf0klk2d000avki0g3qq2dj9	cmf0cawzy0002vkccpj8t0hcd	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.254
cmf0klk2j000cvki0ti5st1wv	cmf0cax050004vkccpmzsgz01	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.26
cmf0klk2m000evki0qb1k1ac0	cmf0cax090006vkcc6nicnffq	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.262
cmf0klk2o000gvki0y80je4l4	cmf0cax0c0008vkcckefjlktt	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.265
cmf0klk2r000ivki06kwhooo5	cmf0cax0e000avkcc3z2pv3mf	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.268
cmf0klk2u000kvki0ugj0292b	cmf0cax0g000cvkcc3yucqldr	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.27
cmf0klk2w000mvki0xq28yqc0	cmf0cax0j000evkccpkhckphc	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.273
cmf0klk2z000ovki0ggj4ik4v	cmf0cax0l000gvkccso3qb8to	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.275
cmf0klk31000qvki0lzacrgaf	cmf0cax0o000ivkcca3j6fhf0	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.278
cmf0klk33000svki0ptmmtcic	cmf0cax0q000kvkccfccoae63	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.279
cmf0klk34000uvki0x5kvaehe	cmf0cax0s000mvkcc28pgk2s4	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.28
cmf0klk36000wvki03kl2jt2x	cmf0cax0u000ovkcclyep16m6	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.282
cmf0klk39000yvki077wlyjpf	cmez5buhf0029vkvs95vr1a6m	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.286
cmf0klk3c0010vki0j9t8f2af	cmez5buhh002bvkvsqef86gvy	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.288
cmf0klk3d0012vki0b05youxu	cmez5buhj002dvkvs2wlo8w8h	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.29
cmf0klk3e0014vki0o6xgvwvd	cmez5buhl002fvkvs101lksxm	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.291
cmf0klk3g0016vki0v7h8xj4j	cmez5buhn002hvkvsfy7fj8g9	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.292
cmf0klk3h0018vki09g8hys0x	cmez5buhp002jvkvs1ar0eppl	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.294
cmf0klk3i001avki0nrlj24ke	cmez5buhq002lvkvsp6t5damr	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.295
cmf0klk3k001cvki0gcb597l0	cmez5buhv002pvkvs92heqdfm	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.296
cmf0klk3l001evki0cjib6adb	cmez5buhx002rvkvs1n6haty2	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.297
cmf0klk3n001gvki0u15bsjch	cmez5buhs002nvkvs686iuiqw	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.299
cmf28wicn004bvkq0hv1lrorx	cmf0kz13z0006vkg4nqr2kpbj	cmf28n7mi003yvkq0k99uuzyp	f	2	2025-09-02 07:47:11.207
cmf29ksv0001bvk7ceyfwr5f2	cmez5bug3000zvkvshe0vwnu8	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 08:06:04.572
cmf29ksv5001dvk7cibe2ilu0	cmez5bug50011vkvs330um4k1	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 08:06:04.577
cmf29ksv8001fvk7c1v2a926c	cmez5bufz000vvkvssfm47yoi	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 08:06:04.581
cmf29ksvc001hvk7cq3pp1206	cmez5bug70013vkvs6aw3qmtk	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 08:06:04.585
cmf29ksvg001jvk7cuo3092c3	cmez5bug90015vkvsh9ihifu1	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 08:06:04.589
cmf29ksvk001lvk7cwjdgjvoe	cmez5bugb0017vkvs8vxrv5iw	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 08:06:04.592
cmf2avd8u000bvka4o5x27m9g	cmez5bufb000bvkvsvxlcblte	cmf08pvb50000vkz04t32pcxq	f	3	2025-09-02 08:42:17.166
cmf23yb3f000lvkq0k8ngbe9t	cmf23x5cr0006vkq0ijin4rtq	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:28:37.036
cmf23zg35000mvkq0af45mprf	cmf23xcdt000gvkq0ga0itt8k	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:29:30.161
cmf240jkh000nvkq0ewcmklq8	cmf23x7tz000avkq0qwdluiuz	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:30:21.329
cmf241hqs000ovkq0y3kj6sb5	cmf23xaiy000cvkq0ekts44ni	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:31:05.621
cmf24zqee001avkq012p1xrab	cmez5buij003dvkvsofytltn1	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:57:43.142
cmf252y5a001gvkq0hz10k6pq	cmf251n5m001cvkq02mypho7f	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 06:00:13.15
cmf253wyt001lvkq0endweuo1	cmf253ief001ivkq0ncp320fv	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 06:00:58.277
cmf29b8l60001vk2g98n3k3uu	cmf0l31zw000mvk0sassix80k	cmf0lfe6w0001vkqgiubwi9uz	f	2	2025-09-02 07:58:38.394
cmf29b8l60002vk2g227m0d8m	cmf0l31zw000mvk0sassix80k	cmf28n7mi003yvkq0k99uuzyp	f	3	2025-09-02 07:58:38.394
cmf22fjxp0001vk88s8i3h3gg	cmez4ylz7001jvkvorf8gutkb	cmez4ylw70003vkvowz7y4tsn	f	1	2025-09-02 04:46:02.413
cmf22fjxp0002vk88sg769m75	cmez4ylz7001jvkvorf8gutkb	cmez4ylwa0005vkvoe8fpfq94	f	2	2025-09-02 04:46:02.413
cmf06ou91000gvkq4p7ebzdvi	cmez5bugd0019vkvss1syr7lw	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.798
cmf2avenx000dvka43wgge8fn	cmez5buff000dvkvsaexqwttc	cmf0doopy0000vkbcb6citd6a	f	999	2025-09-02 08:42:19.005
cmf06ou9e000uvkq4ne9j35x2	cmez5bugs001nvkvsg4st51kb	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.811
cmf06ou9g000wvkq4wfygffkr	cmez5bugt001pvkvshj4za05r	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.812
cmf06ou9h000yvkq48x073wra	cmez5bugw001rvkvszj8ensiv	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.814
cmf06ou9j0010vkq4qy6cjzj8	cmez5bugz001tvkvsin6tvpm5	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.815
cmf06ou9k0012vkq4jfxcjuny	cmez5buh0001vvkvsxlvetfm6	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.817
cmf06ou9m0014vkq4yn11b9i9	cmez5buh2001xvkvsnhog34dl	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.818
cmf06ou9o0016vkq4afs0bmjs	cmez5buh4001zvkvsodoxnl83	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.82
cmf06ou9p0018vkq4u1dwqqq6	cmez5buh60021vkvsx6pjsrsl	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.821
cmf06ou9q001avkq4zb9g0uza	cmez5buh80023vkvsyejru7y7	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.823
cmf06ou9s001cvkq4j9eurglb	cmez5buha0025vkvss8g1oejt	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.824
cmf06ou9t001evkq4s495npvw	cmez5buhc0027vkvsy1aicbxf	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.826
cmf06ou9v001gvkq4rb971e3x	cmez5buhf0029vkvs95vr1a6m	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.828
cmf06ou9x001ivkq41lwf7d77	cmez5buhh002bvkvsqef86gvy	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.829
cmf06ou9y001kvkq44rk3kjjj	cmez5buhj002dvkvs2wlo8w8h	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.831
cmf06oua0001mvkq4pk0h5a44	cmez5buhl002fvkvs101lksxm	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.832
cmf06oua1001ovkq4jyizjyqv	cmez5buhn002hvkvsfy7fj8g9	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 21:09:41.834
cmf08331u0001vk1gb03dsker	cmez5bugo001jvkvslr3gsci2	cmf07bxj10000vkv8ziod1skk	t	0	2025-08-31 21:48:46.002
cmf0833290003vk1g3ymkbe12	cmez5bugi001dvkvsvl6qxe2v	cmf07bxj10000vkv8ziod1skk	t	0	2025-08-31 21:48:46.017
cmf0a0tgq000gvkhsm2ecpdiy	cmez5bugd0019vkvss1syr7lw	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 22:42:59.498
cmf0a0tgs000ivkhsbanxtjma	cmez5bugs001nvkvsg4st51kb	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 22:42:59.501
cmf0a0tgt000kvkhsg8x2pjg3	cmez5bugt001pvkvshj4za05r	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 22:42:59.502
cmf0a0tgv000mvkhshsxlqkmk	cmez5bugw001rvkvszj8ensiv	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 22:42:59.503
cmf0a0tgw000ovkhsfmqxyikl	cmez5bugz001tvkvsin6tvpm5	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 22:42:59.504
cmf0a0tgx000qvkhs54bwvjvd	cmez5buh0001vvkvsxlvetfm6	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 22:42:59.506
cmf0a0tgy000svkhsedxu7cbb	cmez5buh2001xvkvsnhog34dl	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 22:42:59.507
cmf0a0th1000wvkhs81uxrfpm	cmez5bugq001lvkvse0ycua9x	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 22:42:59.509
cmf0a0th2000yvkhs31v1f3gu	cmez5bugf001bvkvs9utg7k5d	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 22:42:59.51
cmf0a0th30010vkhsskfjexc3	cmez5bugo001jvkvslr3gsci2	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 22:42:59.511
cmf0a0th40012vkhsmi32l7sa	cmez5bugm001hvkvswtop2ezu	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 22:42:59.513
cmf0a0th50014vkhs4kwoi8bu	cmez5bugi001dvkvsvl6qxe2v	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 22:42:59.514
cmf0ckbhi0001vk70yi0m19to	cmf0cawzy0002vkccpj8t0hcd	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:54:08.551
cmf0ckbhl0003vk70obvim9rc	cmf0cawzy0002vkccpj8t0hcd	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:54:08.554
cmf0ckbhn0005vk7037iod9te	cmf0cawzy0002vkccpj8t0hcd	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:54:08.555
cmf0ckbhq0007vk70yfrj4vfp	cmf0cax050004vkccpmzsgz01	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:54:08.559
cmf0ckbht0009vk709ff5dx5e	cmf0cax050004vkccpmzsgz01	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:54:08.561
cmf0ckbhu000bvk7092t850hu	cmf0cax050004vkccpmzsgz01	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:54:08.562
cmf0ckbhw000dvk70g4j1rcb6	cmf0cax090006vkcc6nicnffq	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:54:08.564
cmf0ckbhx000fvk70la3fw5nv	cmf0cax090006vkcc6nicnffq	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:54:08.566
cmf0ckbhz000hvk70u2ddhwom	cmf0cax090006vkcc6nicnffq	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:54:08.567
cmf0ckbi0000jvk70kwgo5z7c	cmf0cax0c0008vkcckefjlktt	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:54:08.569
cmf0ckbi1000lvk70u29krbbc	cmf0cax0c0008vkcckefjlktt	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:54:08.57
cmf0ckbi2000nvk7057s7r5qb	cmf0cax0c0008vkcckefjlktt	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:54:08.571
cmf0ckbi5000pvk70fqct4fb5	cmf0cax0e000avkcc3z2pv3mf	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:54:08.574
cmf0ckbi7000rvk70nh8ijvh8	cmf0cax0e000avkcc3z2pv3mf	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:54:08.575
cmf0ckbi9000tvk70fuc6zxa4	cmf0cax0e000avkcc3z2pv3mf	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:54:08.577
cmf0ckbib000vvk70hrjln08z	cmf0cax0g000cvkcc3yucqldr	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:54:08.579
cmf0ckbic000xvk70x9nizhk4	cmf0cax0g000cvkcc3yucqldr	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:54:08.58
cmf0ckbid000zvk700pb0ffpn	cmf0cax0g000cvkcc3yucqldr	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:54:08.581
cmf0ckbif0011vk70yauft2uw	cmf0cax0j000evkccpkhckphc	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:54:08.583
cmf0ckbig0013vk70rplxai45	cmf0cax0j000evkccpkhckphc	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:54:08.584
cmf0ckbih0015vk70oeunl8hw	cmf0cax0j000evkccpkhckphc	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:54:08.585
cmf0ckbij0017vk70f9dyqnfs	cmf0cax0l000gvkccso3qb8to	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:54:08.587
cmf0ckbik0019vk70e3sgsn67	cmf0cax0l000gvkccso3qb8to	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:54:08.588
cmf0ckbil001bvk70q10oip4f	cmf0cax0l000gvkccso3qb8to	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:54:08.589
cmf0ckbip001dvk70pxkla0pw	cmf0cax0o000ivkcca3j6fhf0	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:54:08.593
cmf0ckbiq001fvk7074lwil0h	cmf0cax0o000ivkcca3j6fhf0	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:54:08.594
cmf0ckbir001hvk707j7joon9	cmf0cax0o000ivkcca3j6fhf0	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:54:08.595
cmf0ckbit001jvk70z0l4ryw0	cmf0cax0q000kvkccfccoae63	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:54:08.597
cmf0ckbiu001lvk70lcbph6pz	cmf0cax0q000kvkccfccoae63	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:54:08.598
cmf0ckbiv001nvk705abiixsq	cmf0cax0q000kvkccfccoae63	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:54:08.599
cmf0ckbix001pvk70se10gvbe	cmf0cax0s000mvkcc28pgk2s4	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:54:08.601
cmf2aveo1000fvka4fdor7ns7	cmez5buff000dvkvsaexqwttc	cmf0l31z80000vk0s10ywj3zp	f	999	2025-09-02 08:42:19.01
cmf2aveo4000hvka4dsk1r0p3	cmez5buff000dvkvsaexqwttc	cmf08pvb50000vkz04t32pcxq	f	999	2025-09-02 08:42:19.012
cmf2aveo6000jvka47entq3jy	cmez5bufh000fvkvscpxd5o66	cmf0doopy0000vkbcb6citd6a	f	999	2025-09-02 08:42:19.015
cmf2aveo9000lvka40e5ucpzz	cmez5bufh000fvkvscpxd5o66	cmf0l31z80000vk0s10ywj3zp	f	999	2025-09-02 08:42:19.017
cmf2aveob000nvka4ecm1tqo2	cmez5bufh000fvkvscpxd5o66	cmf08pvb50000vkz04t32pcxq	f	999	2025-09-02 08:42:19.019
cmf2aveod000pvka4cxoo93st	cmez5bufm000jvkvsxckws9nb	cmf0doopy0000vkbcb6citd6a	f	999	2025-09-02 08:42:19.021
cmf2aveof000rvka4gcx4p6k7	cmez5bufm000jvkvsxckws9nb	cmf0l31z80000vk0s10ywj3zp	f	999	2025-09-02 08:42:19.023
cmf2aveoh000tvka4ivs8mirg	cmez5bufm000jvkvsxckws9nb	cmf08pvb50000vkz04t32pcxq	f	999	2025-09-02 08:42:19.025
cmf2aveoj000vvka4lc4v56jm	cmez5bufp000lvkvs2gz0d9ii	cmf0doopy0000vkbcb6citd6a	f	999	2025-09-02 08:42:19.027
cmf07bxkc000gvkv8drvmecbb	cmez5bugq001lvkvse0ycua9x	cmf07bxj10000vkv8ziod1skk	t	1	2025-08-31 21:27:39.181
cmf08pvby000nvkz0zjq5hd52	cmez5bugd0019vkvss1syr7lw	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 22:06:29.086
cmf08pvc0000pvkz066gxe15g	cmez5bugd0019vkvss1syr7lw	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 22:06:29.088
cmf08pvc1000rvkz0zzsdtw1s	cmez5bugs001nvkvsg4st51kb	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 22:06:29.089
cmf08pvc2000tvkz0mu10b4e3	cmez5bugs001nvkvsg4st51kb	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 22:06:29.09
cmf08pvc3000vvkz03lzd5zzl	cmez5bugt001pvkvshj4za05r	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 22:06:29.092
cmf08pvc4000xvkz0hqgrihkz	cmez5bugt001pvkvshj4za05r	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 22:06:29.092
cmf08pvc5000zvkz0zs4ojzr6	cmez5bugw001rvkvszj8ensiv	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 22:06:29.094
cmf08pvc70011vkz0dkxph5th	cmez5bugw001rvkvszj8ensiv	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 22:06:29.095
cmf08pvc80013vkz0o9w9afn2	cmez5bugz001tvkvsin6tvpm5	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 22:06:29.097
cmf08pvc90015vkz0714vcx4y	cmez5bugz001tvkvsin6tvpm5	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 22:06:29.098
cmf08pvca0017vkz0gsn0idj8	cmez5buh0001vvkvsxlvetfm6	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 22:06:29.099
cmf08pvcb0019vkz0szbal667	cmez5buh0001vvkvsxlvetfm6	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 22:06:29.099
cmf08pvcc001bvkz08j4dp43e	cmez5buh2001xvkvsnhog34dl	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 22:06:29.101
cmf08pvcd001dvkz0u8dfc44l	cmez5buh2001xvkvsnhog34dl	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 22:06:29.101
cmf2aveok000xvka4b965ocx8	cmez5bufp000lvkvs2gz0d9ii	cmf0l31z80000vk0s10ywj3zp	f	999	2025-09-02 08:42:19.029
cmf2aveom000zvka45wix504t	cmez5bufp000lvkvs2gz0d9ii	cmf08pvb50000vkz04t32pcxq	f	999	2025-09-02 08:42:19.031
cmf08pvcg001jvkz0mhad25pp	cmez5bugq001lvkvse0ycua9x	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 22:06:29.104
cmf08pvcg001lvkz0u7zhc7ur	cmez5bugq001lvkvse0ycua9x	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 22:06:29.105
cmf08pvci001nvkz0ohzfs8h7	cmez5bugf001bvkvs9utg7k5d	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 22:06:29.106
cmf08pvci001pvkz0f95q18ly	cmez5bugf001bvkvs9utg7k5d	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 22:06:29.107
cmf08pvcj001rvkz07cq12sq2	cmez5bugo001jvkvslr3gsci2	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 22:06:29.108
cmf08pvck001tvkz0qp2l8hcl	cmez5bugo001jvkvslr3gsci2	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 22:06:29.109
cmf08pvcm001vvkz02vs2sc8t	cmez5bugm001hvkvswtop2ezu	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 22:06:29.11
cmf08pvcn001xvkz0dbaxaxcx	cmez5bugm001hvkvswtop2ezu	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 22:06:29.111
cmf08pvcp001zvkz02a7bkljc	cmez5bugi001dvkvsvl6qxe2v	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 22:06:29.113
cmf08pvcq0021vkz0ga5sfs2e	cmez5bugi001dvkvsvl6qxe2v	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 22:06:29.114
cmf23p7x80000vkq01r0sbabp	cmf23bzgf0016vk88w5s74h2s	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:21:33.02
cmf2aveoo0011vka4f2acbttt	cmez5bufr000nvkvs5a925es2	cmf0doopy0000vkbcb6citd6a	f	999	2025-09-02 08:42:19.032
cmf244w1w000rvkq0orcxy1y4	cmf23x2l00004vkq04uywrd85	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:33:44.132
cmf248rv7000tvkq035bs89r2	cmf23xe7i000kvkq0qudi6y99	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:36:45.331
cmf0bhrgk0005vkz4oxo8ls6o	cmez5buhp002jvkvs1ar0eppl	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 23:24:09.669
cmf0bhrgm0007vkz4d89dcyl1	cmez5buhp002jvkvs1ar0eppl	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:24:09.671
cmf0bhrgo0009vkz4b0sq9r25	cmez5buhp002jvkvs1ar0eppl	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:24:09.673
cmf0bhrgq000bvkz4txw5vy84	cmez5buhp002jvkvs1ar0eppl	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:24:09.674
cmf25cccj002gvkq0u1efoeeq	cmf2570be001uvkq0qnysaenz	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 06:07:31.46
cmf25cn5r002hvkq04gc5vazs	cmf254y9l001nvkq028daxm2u	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 06:07:45.472
cmf0bhrgy000hvkz4vindep58	cmez5buhq002lvkvsp6t5damr	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 23:24:09.683
cmf0bhrh0000jvkz41bx389zh	cmez5buhq002lvkvsp6t5damr	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:24:09.685
cmf0bhrh2000lvkz4v2m22kf9	cmez5buhq002lvkvsp6t5damr	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:24:09.686
cmf0bhrh4000nvkz4xfcl5831	cmez5buhq002lvkvsp6t5damr	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:24:09.689
cmf29b9qb0004vk2gbb3kgab2	cmf0l31zh0006vk0szbgocarb	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 07:58:39.875
cmf29b9qg0006vk2gf0lff46u	cmf0l31zm000avk0sn2us2ca1	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 07:58:39.88
cmf0bhrip000tvkz4cjmyodg0	cmez5buhs002nvkvs686iuiqw	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 23:24:09.746
cmf0bhrj6000vvkz46g78o725	cmez5buhs002nvkvs686iuiqw	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:24:09.763
cmf0bhrjq000xvkz4wohacl63	cmez5buhs002nvkvs686iuiqw	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:24:09.782
cmf0bhrjt000zvkz4dqkntnoh	cmez5buhs002nvkvs686iuiqw	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:24:09.785
cmf29b9qi0008vk2grbvmfk6y	cmf0l31zp000evk0sbt2tojs7	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 07:58:39.883
cmf29b9ql000avk2geeh44ak0	cmf0l31zs000ivk0smgvhtovt	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 07:58:39.885
cmf0bhrjy0015vkz43v9k2cx1	cmez5buhv002pvkvs92heqdfm	cmf06ou8b0000vkq4cyng3byo	t	1	2025-08-31 23:24:09.79
cmf0bhrk00017vkz4bsd5vznl	cmez5buhv002pvkvs92heqdfm	cmf08pvb50000vkz04t32pcxq	f	2	2025-08-31 23:24:09.792
cmf0bhrk30019vkz4ujcc8ddh	cmez5buhv002pvkvs92heqdfm	cmf08pvbl000dvkz0ti867vpd	f	3	2025-08-31 23:24:09.795
cmf0bhrk5001bvkz4sjcksuy1	cmez5buhv002pvkvs92heqdfm	cmf0a0tg30000vkhsnwdbi0nm	f	4	2025-08-31 23:24:09.797
cmf29b9qo000cvk2gcned6hm3	cmf0l31zy000qvk0saes8ra8z	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 07:58:39.888
cmf29b9qs000evk2geplzftgh	cmf0l3201000uvk0slm026x8y	cmf28n7mi003yvkq0k99uuzyp	f	999	2025-09-02 07:58:39.892
cmf0klk3q001ivki0wxzcjbmv	cmez5bugd0019vkvss1syr7lw	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.303
cmf0klk3s001kvki09cg4vfne	cmez5bugs001nvkvsg4st51kb	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.305
cmf0klk3u001mvki0gdfkjxzj	cmez5bugt001pvkvshj4za05r	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.306
cmf0klk3v001ovki0qobdb9yd	cmez5bugw001rvkvszj8ensiv	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.307
cmf0klk3w001qvki0zssr75m9	cmez5bugz001tvkvsin6tvpm5	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.309
cmf0klk3y001svki0yfkpzub2	cmez5buh0001vvkvsxlvetfm6	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.31
cmf0klk3z001uvki0azfg30mp	cmez5buh2001xvkvsnhog34dl	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.312
cmf0klk40001wvki0pn8fpov8	cmez5buh4001zvkvsodoxnl83	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.313
cmf0klk42001yvki013dpn14k	cmez5buh60021vkvsx6pjsrsl	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.314
cmf0klk440020vki0d08w4008	cmez5buh80023vkvsyejru7y7	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.316
cmf0klk460022vki0ifq6ykef	cmez5buha0025vkvss8g1oejt	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.319
cmf0klk480024vki0opdab4zw	cmez5buhc0027vkvsy1aicbxf	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.32
cmf2aveop0013vka4dbf4d5e6	cmez5bufr000nvkvs5a925es2	cmf0l31z80000vk0s10ywj3zp	f	999	2025-09-02 08:42:19.034
cmf0klk4b0028vki0ii8135wg	cmez5bugq001lvkvse0ycua9x	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.323
cmf0klk4c002avki0v2g7nvrg	cmez5bugf001bvkvs9utg7k5d	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.324
cmf0klk4e002cvki0mf4e1wms	cmez5bugo001jvkvslr3gsci2	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.326
cmf0klk4f002evki063t8p8u5	cmez5bugm001hvkvswtop2ezu	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.327
cmf0klk4g002gvki0edg5zgo4	cmez5bugi001dvkvsvl6qxe2v	cmf0klk1c0000vki0gy432pcp	f	0	2025-09-01 03:39:03.329
cmf2aveor0015vka4l0bntuzx	cmez5bufr000nvkvs5a925es2	cmf08pvb50000vkz04t32pcxq	f	999	2025-09-02 08:42:19.036
cmf2aveot0017vka4d8ctzy09	cmez5buft000pvkvsdwqpwkc5	cmf0doopy0000vkbcb6citd6a	f	999	2025-09-02 08:42:19.038
cmf233jwi000xvk882z8w0d46	cmez5bui80033vkvshs0kiawt	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:04:42.114
cmf23497a000yvk88tbj5f7y4	cmez5bui3002xvkvsn4umf699	cmf08pvb50000vkz04t32pcxq	f	1	2025-09-02 05:05:14.903
cmf2aveov0019vka4f1eqmo25	cmez5buft000pvkvsdwqpwkc5	cmf0l31z80000vk0s10ywj3zp	f	999	2025-09-02 08:42:19.039
cmf2aveow001bvka4v1uf31jy	cmez5buft000pvkvsdwqpwkc5	cmf08pvb50000vkz04t32pcxq	f	999	2025-09-02 08:42:19.041
cmf2aveoz001dvka4a1eagg7e	cmez5bufv000rvkvsq3b7iw35	cmf0doopy0000vkbcb6citd6a	f	999	2025-09-02 08:42:19.043
cmf2aveph001fvka4cgxm8j7n	cmez5bufv000rvkvsq3b7iw35	cmf0l31z80000vk0s10ywj3zp	f	999	2025-09-02 08:42:19.062
cmf2avepz001hvka4d46r1y9t	cmez5bufv000rvkvsq3b7iw35	cmf08pvb50000vkz04t32pcxq	f	999	2025-09-02 08:42:19.079
cmf2aveq1001jvka4czejvg1y	cmez5bufk000hvkvspk80r6rp	cmf0doopy0000vkbcb6citd6a	f	999	2025-09-02 08:42:19.081
cmf2aveq2001lvka4t3lqbd4o	cmez5bufk000hvkvspk80r6rp	cmf0l31z80000vk0s10ywj3zp	f	999	2025-09-02 08:42:19.083
cmf2aveq4001nvka42altttu1	cmez5bufk000hvkvspk80r6rp	cmf08pvb50000vkz04t32pcxq	f	999	2025-09-02 08:42:19.084
cmf0lfe7e0005vkqgjjq400vt	cmf0l31zh0006vk0szbgocarb	cmf0lfe6w0001vkqgiubwi9uz	t	1	2025-09-01 04:02:15.338
cmf0lfe7h0007vkqgcrbgvp90	cmf0l31zm000avk0sn2us2ca1	cmf0lfe6w0001vkqgiubwi9uz	t	1	2025-09-01 04:02:15.341
cmf0lfe7j0009vkqg6xlhbc5x	cmf0l31zp000evk0sbt2tojs7	cmf0lfe6w0001vkqgiubwi9uz	t	1	2025-09-01 04:02:15.344
cmf0lfe7l000bvkqgbajd5zu1	cmf0l31zs000ivk0smgvhtovt	cmf0lfe6w0001vkqgiubwi9uz	t	1	2025-09-01 04:02:15.346
cmf0lfe7n000dvkqgsk29nuxn	cmf0l31zy000qvk0saes8ra8z	cmf0lfe6w0001vkqgiubwi9uz	t	1	2025-09-01 04:02:15.347
cmf0lfe7q000fvkqg8uv522v9	cmf0l3201000uvk0slm026x8y	cmf0lfe6w0001vkqgiubwi9uz	t	1	2025-09-01 04:02:15.35
cmf2896ok003qvkq0o1lcm1wz	cmf2896oh003pvkq0y570kdx0	cmf26thyi002xvkq01n46mw31	f	0	2025-09-02 07:29:02.997
cmf2896ok003rvkq0y5qbaeck	cmf2896oh003pvkq0y570kdx0	cmf26g4mw002pvkq03xf5r2t1	f	0	2025-09-02 07:29:02.997
cmf2896ok003svkq0vlh0qpbp	cmf2896oh003pvkq0y570kdx0	cmez4ylw70003vkvowz7y4tsn	f	0	2025-09-02 07:29:02.997
cmf29jnp30000vk7cxsx4kby4	cmf0kymu2000avk5g9b5f3kt4	cmf0kymvt000svk5g00zjcfdl	f	1	2025-09-02 08:05:11.223
cmf29jnp30002vk7cy835dnaq	cmf0kymu2000avk5g9b5f3kt4	cmf28n7mi003yvkq0k99uuzyp	f	3	2025-09-02 08:05:11.223
\.


ALTER TABLE public.menu_item_customizations ENABLE TRIGGER ALL;

--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.orders DISABLE TRIGGER ALL;

COPY public.orders (id, "orderNumber", "userId", "customerName", "customerEmail", "customerPhone", status, "orderType", "scheduleType", "paymentMethod", "deliveryAddress", "deliveryCity", "deliveryZip", "deliveryInstructions", "scheduledTime", subtotal, "deliveryFee", "tipAmount", "tipPercentage", "customTipAmount", tax, total, notes, "createdAt", "updatedAt") FROM stdin;
cmf084pin0001vkhc781oh61h	BO001770KK0	\N	omar hassan	auy1jll@gmail.com	16178673842	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	16.75	0	\N	\N	\N	1.51	18.26	\N	2025-08-31 21:50:01.775	2025-08-31 21:50:01.775
cmf0is3ye0001vkl8xgty6kfm	BO889450U74	\N	Omar hassan	auy1jll@pizza-subs.com	999 121 2222	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	33.98999999999999	0	\N	\N	\N	2.89	36.88	\N	2025-09-01 02:48:09.732	2025-09-01 02:48:09.732
cmf1g6hp60003vkisuncn4q3e	BO988049JGL	\N	omar hassan	auy1jll@gmail.com	16178673842	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	6.3	0	\N	\N	\N	0.54	6.84	\N	2025-09-01 18:23:08.059	2025-09-01 18:23:08.059
cmf1kzp930001vkskwcg6dkgt	BO069322BQS	\N	omar hassan	auy1jll@gmail.com	16178673842	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	16.5	0	\N	\N	\N	1.4	17.9	\N	2025-09-01 20:37:49.335	2025-09-01 20:37:49.335
cmf1l6koa0009vkskk0pwapt7	BO389942ZNF	\N	Test Customer	auy1jll@gmail.com	6178673842	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	15.74	0	\N	\N	\N	1.34	17.08	\N	2025-09-01 20:43:09.994	2025-09-01 20:43:09.994
cmf1lhngv0001vkw0yq4yfx6a	BO906822FPO	\N	omar hassan	auy1jll@gmail.com	16178673842	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	16.5	0	\N	\N	\N	1.4	17.9	\N	2025-09-01 20:51:46.831	2025-09-01 20:51:46.831
cmf1luvah0001vk4oopj49vtd	BO523489LJ1	\N	Hassan Omar	auy1jll@gmail.com	6172494115	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	12.74	0	\N	\N	\N	1.08	13.82	\N	2025-09-01 21:02:03.497	2025-09-01 21:02:03.497
cmf1lybtv0007vk4o3mxxd5ov	BO684896F6Z	\N	omar hassan	auy1jll@gmail.com	16178673842	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	25.49	0	\N	\N	\N	2.17	27.66	\N	2025-09-01 21:04:44.899	2025-09-01 21:04:44.899
cmf1n5lkv0001vk58avtfjqp3	BO703736758	\N	Hassan Omar	auy1jll@gmail.com	6172494115	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	16.5	0	\N	\N	\N	1.4	17.9	\N	2025-09-01 21:38:23.744	2025-09-01 21:38:23.744
cmf1n6i000005vk588g7zuywy	BO745756CDP	\N	Hassan Omar	auy1jll@gmail.com	6172494115	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	21.5	0	\N	\N	\N	1.83	23.33	\N	2025-09-01 21:39:05.76	2025-09-01 21:39:05.76
cmf3e6ros0001vkw82b423gwi	BO574059775	\N	Hassan Omar	auy1jll@gmail.com	6178673842	PENDING	PICKUP	NOW	\N	\N	\N	\N	\N	\N	25.5	0	\N	\N	\N	2.17	27.67	\N	2025-09-03 03:02:54.124	2025-09-03 03:02:54.124
cmez7rtfj0001vk6cp40pfe9r	BO9341130LO	\N	omar hassan	auy1jll@gmail.com	6178673842	COMPLETED	PICKUP	NOW	\N	\N	\N	\N	\N	\N	23.5	0	\N	\N	\N	1.94	25.44	\N	2025-08-31 04:52:14.143	2025-09-03 06:04:10.923
cmezdi7iz0001vk68exctnpic	BO56353962Q	\N	omar hassan	auy1jll@gmail.com	16178673842	COMPLETED	PICKUP	NOW	\N	\N	\N	\N	\N	\N	31.99	0	\N	\N	\N	2.88	34.87	\N	2025-08-31 07:32:43.548	2025-09-03 06:04:13.321
cmf06d15r0001vkiggcvs62fg	BO030868ZTP	\N	Omar hassan	auy1jll@gmail.com	999 121 2222	COMPLETED	PICKUP	NOW	\N	\N	\N	\N	\N	\N	31.99	0	\N	\N	\N	2.88	34.87	\N	2025-08-31 21:00:30.876	2025-09-03 06:04:14.922
cmez71q930023vk60eh0tw6ip	BO716951I19	\N	omar hassan	auy1jll@gmail.com	6172494115	COMPLETED	PICKUP	NOW	\N	\N	\N	\N	\N	\N	168.47	0	\N	\N	\N	13.9	182.37	\N	2025-08-31 04:31:56.967	2025-09-03 06:05:34.716
cmf0e2omw0001vkvcra6xd8gq	BO985011HBF	\N	Hassan Omar	auy1jll@gmail.com	6172494115	COMPLETED	PICKUP	NOW	\N	\N	\N	\N	\N	\N	48	0	\N	\N	\N	4.32	52.32	\N	2025-09-01 00:36:25.016	2025-09-03 06:08:26.816
cmf1l3iap0005vkskwovncy2r	BO246941FFE	\N	Hassan Omar	auy1jll@gmail.com	6172494115	COMPLETED	PICKUP	NOW	\N	\N	\N	\N	\N	\N	16.5	0	\N	\N	\N	1.4	17.9	\N	2025-09-01 20:40:46.945	2025-09-03 11:24:52.43
\.


ALTER TABLE public.orders ENABLE TRIGGER ALL;

--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.order_items DISABLE TRIGGER ALL;

COPY public.order_items (id, "orderId", "pizzaSizeId", "pizzaCrustId", "pizzaSauceId", "menuItemId", quantity, "basePrice", "totalPrice", notes, "createdAt", "updatedAt", "itemType", "specialtyCalzoneId", "specialtyPizzaId") FROM stdin;
cmez71q980025vk60l0i5wkps	cmez71q930023vk60eh0tw6ip	cmez5n8nn0001vk3kjqe0zbsp	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	22	22	Large Calzone Regular with Pizza Sauce	2025-08-31 04:31:56.972	2025-08-31 04:31:56.972	PIZZA	\N	\N
cmez71q9c0027vk60cq8t35vo	cmez71q930023vk60eh0tw6ip	cmez5n8nn0001vk3kjqe0zbsp	cmez57ct90007vkc4memkf1p1	cmez57ct40004vkc4ndh8iu2b	\N	1	29.99	29.99	Large Calzone Regular with Garlic Butter Sauce	2025-08-31 04:31:56.976	2025-08-31 04:31:56.976	PIZZA	\N	\N
cmez71q9e0029vk60copcqebl	cmez71q930023vk60eh0tw6ip	cmez57csy0001vkc4fbtoets6	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	23.5	23.5	Large Pizza Regular with Pizza Sauce	2025-08-31 04:31:56.979	2025-08-31 04:31:56.979	PIZZA	\N	\N
cmez71q9g002bvk60rykofmoe	cmez71q930023vk60eh0tw6ip	cmez57csy0001vkc4fbtoets6	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	23.5	23.5	Large Pizza Regular with Pizza Sauce	2025-08-31 04:31:56.98	2025-08-31 04:31:56.98	PIZZA	\N	\N
cmez71q9i002dvk60owbdju1a	cmez71q930023vk60eh0tw6ip	cmez5n8nl0000vk3k7n5edmea	cmez57ct90007vkc4memkf1p1	cmez57ct40004vkc4ndh8iu2b	\N	1	23	23	Small Calzone Regular with Garlic Butter Sauce	2025-08-31 04:31:56.982	2025-08-31 04:31:56.982	PIZZA	\N	\N
cmez71q9n002fvk607yl7eq4q	cmez71q930023vk60eh0tw6ip	\N	\N	\N	cmez5bufx000tvkvs3psh4hyl	1	27.5	27.5	**Scallops** (seafood-boxes) | Customization | Customization	2025-08-31 04:31:56.987	2025-08-31 04:31:56.987	PIZZA	\N	\N
cmez7rtft0003vk6c7o66dohe	cmez7rtfj0001vk6cp40pfe9r	cmez57csy0001vkc4fbtoets6	cmez57ct90007vkc4memkf1p1	cmez57ct40004vkc4ndh8iu2b	\N	1	23.5	23.5	Large Pizza Regular with Garlic Butter Sauce	2025-08-31 04:52:14.153	2025-08-31 04:52:14.153	PIZZA	\N	\N
cmezdi7j60003vk68h3sznenr	cmezdi7iz0001vk68exctnpic	cmez5n8nn0001vk3kjqe0zbsp	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	31.99	31.99	Large Calzone Regular with Pizza Sauce | Toppings: whole: meatballs	2025-08-31 07:32:43.555	2025-08-31 07:32:43.555	PIZZA	\N	\N
cmf06d1670003vkig06bge9uc	cmf06d15r0001vkiggcvs62fg	cmez5n8nn0001vk3kjqe0zbsp	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	31.99	31.99	Large Calzone Regular with Pizza Sauce | Toppings: whole: ricotta cheese	2025-08-31 21:00:30.896	2025-08-31 21:00:30.896	PIZZA	\N	\N
cmf084piu0003vkhcmcky4bso	cmf084pin0001vkhc781oh61h	\N	\N	\N	cmez5bugk001fvkvs8jtn5du0	1	16.75	16.75	**Steak Tips Kabob** (hot-subs) | Customization	2025-08-31 21:50:01.782	2025-08-31 21:50:01.782	PIZZA	\N	\N
cmf0e2on20003vkvcc1uu86k6	cmf0e2omw0001vkvcra6xd8gq	\N	\N	\N	cmez5bufx000tvkvs3psh4hyl	1	48	48	**Sea Monster (Scallops, Clams, Shrimps & Haddock)** (seafood-plates) | Customization | Customization	2025-09-01 00:36:25.023	2025-09-01 00:36:25.023	PIZZA	\N	\N
cmf0is3zq0003vkl85pz1zzr0	cmf0is3ye0001vkl8xgty6kfm	cmez5n8nn0001vk3kjqe0zbsp	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	33.98999999999999	33.98999999999999	Large Calzone Regular with Pizza Sauce | Toppings: whole: ricotta cheese | right: black olives	2025-09-01 02:48:09.783	2025-09-01 02:48:09.783	PIZZA	\N	\N
cmf1g6hpc0005vkiszudlgy8y	cmf1g6hp60003vkisuncn4q3e	\N	\N	\N	cmf0cax0q000kvkccfccoae63	1	6.3	6.3	**Hot Dog** (Sandwiches)	2025-09-01 18:23:08.065	2025-09-01 18:23:08.065	PIZZA	\N	\N
cmez71q9v002hvk609w7x1wqv	cmez71q930023vk60eh0tw6ip	\N	\N	\N	\N	1	18.98	18.98	**Pepperoni Pizza** (pizzas) | Customization	2025-08-31 04:31:56.996	2025-08-31 04:31:56.996	PIZZA	\N	\N
cmf1kzp9g0003vkskh6goxujr	cmf1kzp930001vkskwcg6dkgt	cmez57csy0001vkc4fbtoets6	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	16.5	16.5	Large Pizza Regular with Pizza Sauce	2025-09-01 20:37:49.348	2025-09-01 20:37:49.348	PIZZA	\N	\N
cmf1l3ias0007vksknataxeh3	cmf1l3iap0005vkskwovncy2r	cmez57csy0001vkc4fbtoets6	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	16.5	16.5	Large Pizza Regular with Pizza Sauce	2025-09-01 20:40:46.948	2025-09-01 20:40:46.948	PIZZA	\N	\N
cmf1l6koe000bvkskmin9u3b1	cmf1l6koa0009vkskk0pwapt7	\N	\N	\N	cmez5bugd0019vkvss1syr7lw	1	15.74	15.74	**Build your Own Roast Beef Sub** (hot-subs) | Customization | Customization	2025-09-01 20:43:09.998	2025-09-01 20:43:09.998	PIZZA	\N	\N
cmf1lhngz0003vkw0xsjdd0al	cmf1lhngv0001vkw0yq4yfx6a	cmez57csy0001vkc4fbtoets6	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	16.5	16.5	Large Pizza Regular with Pizza Sauce	2025-09-01 20:51:46.836	2025-09-01 20:51:46.836	PIZZA	\N	\N
cmf1luvan0003vk4ogu7mtc0d	cmf1luvah0001vk4oopj49vtd	\N	\N	\N	cmez5bugd0019vkvss1syr7lw	1	12.74	12.74	**Build your Own Roast Beef Sub** (hot-subs) | Customization	2025-09-01 21:02:03.503	2025-09-01 21:02:03.503	PIZZA	\N	\N
cmf1lybty0009vk4ox1g8lri0	cmf1lybtv0007vk4o3mxxd5ov	\N	\N	\N	cmez5buff000dvkvsaexqwttc	1	14.99	14.99	**Hamburger Plate** (dinner-plates)	2025-09-01 21:04:44.902	2025-09-01 21:04:44.902	PIZZA	\N	\N
cmf1lybtz000bvk4olqowb86p	cmf1lybtv0007vk4o3mxxd5ov	\N	\N	\N	cmez4ylz7001cvkvoyc2xmwxy	1	10.5	10.5	**Caesar Salad** (salads) | Customization	2025-09-01 21:04:44.904	2025-09-01 21:04:44.904	PIZZA	\N	\N
cmf1n5ll10003vk583hedomdg	cmf1n5lkv0001vk58avtfjqp3	cmez57csy0001vkc4fbtoets6	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	16.5	16.5	Large Pizza Regular with Pizza Sauce	2025-09-01 21:38:23.749	2025-09-01 21:38:23.749	PIZZA	\N	\N
cmf1n6i030007vk580pg6s3k5	cmf1n6i000005vk588g7zuywy	cmez5n8nn0001vk3kjqe0zbsp	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	21.5	21.5	Large Calzone Regular with Pizza Sauce	2025-09-01 21:39:05.764	2025-09-01 21:39:05.764	PIZZA	\N	\N
cmf3e6rqi0003vkw8arz591kz	cmf3e6ros0001vkw82b423gwi	cmez57csv0000vkc4nzo0th14	cmez57ct90007vkc4memkf1p1	cmez57ct10002vkc4dd3k6gig	\N	1	25.5	25.5	Small Pizza Regular with Pizza Sauce | Toppings: whole: chicken fingers, fresh onions, bacon, extra cheese	2025-09-03 03:02:54.186	2025-09-03 03:02:54.186	PIZZA	\N	\N
\.


ALTER TABLE public.order_items ENABLE TRIGGER ALL;

--
-- Data for Name: order_item_customizations; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.order_item_customizations DISABLE TRIGGER ALL;

COPY public.order_item_customizations (id, "orderItemId", "customizationOptionId", quantity, price, "pizzaHalf", "createdAt") FROM stdin;
cmez71q9y002jvk60m41xxtno	cmez71q9v002hvk609w7x1wqv	cmez4ylyu000pvkvouuz9ap6r	1	1.99	\N	2025-08-31 04:31:56.999
cmf084pj10005vkhce6v430lb	cmf084piu0003vkhcmcky4bso	cmf07bxjn0006vkv8l7et6vko	1	0	\N	2025-08-31 21:50:01.79
cmf0e2ona0005vkvcek12ds4o	cmf0e2on20003vkvcc1uu86k6	cmf0dudnr0001vkjwmeeto4hp	1	0	\N	2025-09-01 00:36:25.03
cmf0e2ond0007vkvckjbq6ijh	cmf0e2on20003vkvcc1uu86k6	cmf0dooqj0007vkbcz8vw554e	1	0	\N	2025-09-01 00:36:25.033
cmf1l6koi000dvkskczkmneoc	cmf1l6koe000bvkskmin9u3b1	cmf0klk1j0002vki0navxncgu	1	2	\N	2025-09-01 20:43:10.003
cmf1l6kol000fvkskh4yarlum	cmf1l6koe000bvkskmin9u3b1	cmf07bxjl0004vkv8fj0fh19s	1	1	\N	2025-09-01 20:43:10.006
cmf1luvas0005vk4ojowpwcen	cmf1luvan0003vk4ogu7mtc0d	cmf06ou8e0002vkq477o75rr7	1	0	\N	2025-09-01 21:02:03.509
cmf1lybu2000dvk4owfy4p6bz	cmf1lybtz000bvk4olqowb86p	cmez4ylwn000avkvoem5xnd9y	1	0	\N	2025-09-01 21:04:44.906
\.


ALTER TABLE public.order_item_customizations ENABLE TRIGGER ALL;

--
-- Data for Name: order_item_toppings; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.order_item_toppings DISABLE TRIGGER ALL;

COPY public.order_item_toppings (id, "orderItemId", "pizzaToppingId", quantity, section, intensity, price, "createdAt") FROM stdin;
cmezdi7je0004vk68axnk09of	cmezdi7j60003vk68h3sznenr	cmez57ctq000pvkc41cp4qe5p	1	WHOLE	REGULAR	2	2025-08-31 07:32:43.562
cmf06d16i0004vkignokte6zm	cmf06d1670003vkig06bge9uc	cmez57ctp000nvkc48fy737nq	1	WHOLE	REGULAR	2	2025-08-31 21:00:30.906
cmf0is4160004vkl8o4wun6h8	cmf0is3zq0003vkl85pz1zzr0	cmez57ctp000nvkc48fy737nq	1	WHOLE	REGULAR	2	2025-09-01 02:48:09.834
cmf0is4160005vkl84bjppt4h	cmf0is3zq0003vkl85pz1zzr0	cmez57ctc0008vkc4gno2jo9r	1	RIGHT	REGULAR	2	2025-09-01 02:48:09.834
cmf3e6rsn0004vkw8ji0t9pep	cmf3e6rqi0003vkw8arz591kz	cmez57ctu000uvkc4asbg1mbb	1	WHOLE	REGULAR	5	2025-09-03 03:02:54.263
cmf3e6rsn0005vkw8bg80dyge	cmf3e6rqi0003vkw8arz591kz	cmez57ctg000cvkc46m0wjghg	1	WHOLE	REGULAR	2	2025-09-03 03:02:54.263
cmf3e6rsn0006vkw8996of7t3	cmf3e6rqi0003vkw8arz591kz	cmez57ctt000tvkc4ln5deozo	1	WHOLE	REGULAR	5	2025-09-03 03:02:54.263
cmf3e6rsn0007vkw8667xxyb0	cmf3e6rqi0003vkw8arz591kz	cmez57cto000lvkc42gzgyexr	1	WHOLE	REGULAR	2	2025-09-03 03:02:54.263
\.


ALTER TABLE public.order_item_toppings ENABLE TRIGGER ALL;

--
-- Data for Name: price_snapshots; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.price_snapshots DISABLE TRIGGER ALL;

COPY public.price_snapshots (id, "orderId", "componentType", "componentId", "componentName", "snapshotPrice", "createdAt") FROM stdin;
\.


ALTER TABLE public.price_snapshots ENABLE TRIGGER ALL;

--
-- Data for Name: pricing_history; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.pricing_history DISABLE TRIGGER ALL;

COPY public.pricing_history (id, "componentType", "componentId", "componentName", "oldPrice", "newPrice", "changeReason", "changedBy", "changedAt") FROM stdin;
\.


ALTER TABLE public.pricing_history ENABLE TRIGGER ALL;

--
-- Data for Name: promotions; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.promotions DISABLE TRIGGER ALL;

COPY public.promotions (id, name, description, type, "discountType", "discountValue", "minimumOrderAmount", "maximumDiscountAmount", "minimumQuantity", "applicableCategories", "applicableItems", "requiresLogin", "userGroupRestrictions", "startDate", "endDate", "isActive", "usageLimit", "usageCount", "perUserLimit", stackable, priority, terms, "createdAt", "updatedAt") FROM stdin;
cmf0erpns0000vkjcp8tqb35b	BOGO	Buy any One Pizza and get the 2nd half Price 	BOGO_HALF_OFF	PERCENTAGE	50.00	\N	\N	\N	{pizza}	{}	f	{}	2025-08-02 00:54:00	2027-10-01 00:54:00	t	\N	0	\N	f	1	the 50% discount applies to the item of lesser price	2025-09-01 00:55:52.741	2025-09-01 00:55:52.741
\.


ALTER TABLE public.promotions ENABLE TRIGGER ALL;

--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.refresh_tokens DISABLE TRIGGER ALL;

COPY public.refresh_tokens (id, "userId", "tokenHash", "deviceFingerprint", "ipAddress", "userAgent", revoked, "revokedAt", "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


ALTER TABLE public.refresh_tokens ENABLE TRIGGER ALL;

--
-- Data for Name: specialty_calzone_sizes; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.specialty_calzone_sizes DISABLE TRIGGER ALL;

COPY public.specialty_calzone_sizes (id, "specialtyCalzoneId", "pizzaSizeId", price, "isAvailable", "createdAt", "updatedAt") FROM stdin;
cmez5ncb6000tvkawm2371h2m	cmez5ncb4000pvkawtrsi1vx1	cmez5n8nn0001vk3kjqe0zbsp	29.99	t	2025-08-31 03:52:46.099	2025-08-31 03:56:48.897
cmez5ncb9000wvkaw3z1k6udp	cmez5ncb8000uvkawhnyir4x3	cmez5n8nl0000vk3k7n5edmea	23	t	2025-08-31 03:52:46.102	2025-08-31 03:56:48.9
cmez5ncbb000yvkawcj2k0nbx	cmez5ncb8000uvkawhnyir4x3	cmez5n8nn0001vk3kjqe0zbsp	29.99	t	2025-08-31 03:52:46.103	2025-08-31 03:56:48.903
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
\.


ALTER TABLE public.specialty_calzone_sizes ENABLE TRIGGER ALL;

--
-- Data for Name: specialty_pizza_sizes; Type: TABLE DATA; Schema: public; Owner: -
--

ALTER TABLE public.specialty_pizza_sizes DISABLE TRIGGER ALL;

COPY public.specialty_pizza_sizes (id, "specialtyPizzaId", "pizzaSizeId", price, "isAvailable", "createdAt", "updatedAt") FROM stdin;
cmez5msgl000ovkawpop68yru	cmez5msgh000kvkawdkkg9et6	cmez57csy0001vkc4fbtoets6	23.5	t	2025-08-31 03:52:20.373	2025-08-31 03:56:48.951
cmez5msgp000rvkaw1avim59u	cmez5msgn000pvkaw23ywxpn7	cmez57csv0000vkc4nzo0th14	16.5	t	2025-08-31 03:52:20.378	2025-08-31 03:56:48.953
cmez5msgr000tvkaw1v8g73pu	cmez5msgn000pvkaw23ywxpn7	cmez57csy0001vkc4fbtoets6	23.5	t	2025-08-31 03:52:20.379	2025-08-31 03:56:48.956
cmez5msgw000wvkaw2ebm1kvl	cmez5msgu000uvkawnh7fpkrg	cmez57csv0000vkc4nzo0th14	16.5	t	2025-08-31 03:52:20.384	2025-08-31 03:56:48.959
cmez5msgx000yvkawj09t373n	cmez5msgu000uvkawnh7fpkrg	cmez57csy0001vkc4fbtoets6	23.5	t	2025-08-31 03:52:20.386	2025-08-31 03:56:48.963
cmez5msfc0002vkaw1pg8gzw9	cmez5mset0000vkawy2dx6uqm	cmez57csv0000vkc4nzo0th14	15.45	t	2025-08-31 03:52:20.328	2025-08-31 03:56:48.923
cmez5msft0004vkawzep2vsrx	cmez5mset0000vkawy2dx6uqm	cmez57csy0001vkc4fbtoets6	22.45	t	2025-08-31 03:52:20.345	2025-08-31 03:56:48.928
cmez5msfy0007vkawj6c7mc5m	cmez5msfw0005vkawuq4y4j55	cmez57csv0000vkc4nzo0th14	16.5	t	2025-08-31 03:52:20.351	2025-08-31 03:56:48.93
cmez5msg00009vkawqvsf044p	cmez5msfw0005vkawuq4y4j55	cmez57csy0001vkc4fbtoets6	23.5	t	2025-08-31 03:52:20.353	2025-08-31 03:56:48.933
cmez5msg6000cvkaw7xzftxxw	cmez5msg3000avkawvqe7cusa	cmez57csv0000vkc4nzo0th14	16.5	t	2025-08-31 03:52:20.358	2025-08-31 03:56:48.936
cmez5msg7000evkawwdwwgk26	cmez5msg3000avkawvqe7cusa	cmez57csy0001vkc4fbtoets6	23.5	t	2025-08-31 03:52:20.36	2025-08-31 03:56:48.939
cmez5msgc000hvkawh0nbmx4u	cmez5msga000fvkawa2hp9b38	cmez57csv0000vkc4nzo0th14	16.5	t	2025-08-31 03:52:20.364	2025-08-31 03:56:48.942
cmez5msge000jvkawaqkscudz	cmez5msga000fvkawa2hp9b38	cmez57csy0001vkc4fbtoets6	23.5	t	2025-08-31 03:52:20.366	2025-08-31 03:56:48.945
cmez5msgj000mvkawxhxy420f	cmez5msgh000kvkawdkkg9et6	cmez57csv0000vkc4nzo0th14	16.5	t	2025-08-31 03:52:20.371	2025-08-31 03:56:48.948
\.


ALTER TABLE public.specialty_pizza_sizes ENABLE TRIGGER ALL;

--
-- PostgreSQL database dump complete
--

