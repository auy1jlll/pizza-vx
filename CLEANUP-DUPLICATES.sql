-- SQL COMMANDS TO REMOVE DUPLICATE CUSTOMIZATION RECORDS
-- Run these in your database tool (pgAdmin, TablePlus, etc.)

-- First, let's see what duplicates we have
SELECT 
  name,
  COUNT(*) as duplicate_count,
  STRING_AGG(id::text, ', ') as ids
FROM "CustomizationGroup" 
GROUP BY LOWER(TRIM(name))
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Delete duplicate CustomizationOptions for groups we'll delete
DELETE FROM "CustomizationOption" 
WHERE "groupId" IN (
  SELECT cg.id 
  FROM "CustomizationGroup" cg
  INNER JOIN (
    SELECT LOWER(TRIM(name)) as normalized_name, MIN(id) as keep_id
    FROM "CustomizationGroup"
    GROUP BY LOWER(TRIM(name))
  ) keepers ON LOWER(TRIM(cg.name)) = keepers.normalized_name
  WHERE cg.id != keepers.keep_id
);

-- Delete duplicate CustomizationGroups (keep the one with lowest ID = oldest)
DELETE FROM "CustomizationGroup" 
WHERE id IN (
  SELECT cg.id 
  FROM "CustomizationGroup" cg
  INNER JOIN (
    SELECT LOWER(TRIM(name)) as normalized_name, MIN(id) as keep_id
    FROM "CustomizationGroup"
    GROUP BY LOWER(TRIM(name))
  ) keepers ON LOWER(TRIM(cg.name)) = keepers.normalized_name
  WHERE cg.id != keepers.keep_id
);

-- Verify cleanup - this should show no duplicates
SELECT 
  name,
  COUNT(*) as count
FROM "CustomizationGroup" 
GROUP BY LOWER(TRIM(name))
HAVING COUNT(*) > 1;

-- Final count
SELECT COUNT(*) as total_groups FROM "CustomizationGroup";
SELECT COUNT(*) as total_options FROM "CustomizationOption";
