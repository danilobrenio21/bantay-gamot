-- Insert Sample Metro Manila Facilities
INSERT INTO facilities (name, facility_type, region, city, barangay, contact_phone, is_verified)
VALUES
('Ospital ng Maynila Medical Center', 'DISTRICT_HOSPITAL', 'NCR', 'Manila', 'Malate', '09171234567', true),
('Quezon City General Hospital', 'DISTRICT_HOSPITAL', 'NCR', 'Quezon City', 'Bahay Toro', '09187654321', true),
('Barangay San Antonio Health Center', 'BARANGAY_HEALTH_CENTER', 'NCR', 'Pasig', 'San Antonio', '09205551234', true);

-- Insert Essential Lifesaving Medicines
INSERT INTO medicines (generic_name, dosage, category, doh_essential)
VALUES
('Anti-Rabies Vaccine (PVRV)', '2.5 IU / 0.5 mL', 'EMERGENCY', true),
('Human Regular Insulin', '100 IU/mL (10 mL vial)', 'MAINTENANCE', true),
('Paracetamol Syrup', '250mg / 5mL', 'MAINTENANCE', true),
('Anti-Tetanus Serum (ATS)', '1500 IU / vial', 'EMERGENCY', true);

-- Seed Live Inventory
INSERT INTO facility_inventory (facility_id, medicine_id, units_available, batch_number, expiration_date, is_free_subsidy)
SELECT 
    f.id, 
    m.id, 
    45, 
    'BATCH-2026-A', 
    '2026-12-31', 
    true
FROM facilities f, medicines m
WHERE f.name = 'Ospital ng Maynila Medical Center' 
  AND m.generic_name = 'Anti-Rabies Vaccine (PVRV)';
