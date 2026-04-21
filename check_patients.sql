-- Step 1: Migrate Patient data into Mothers
-- Patients don't have UserId, so we create new Users for them first
-- then create Mother records linked to those users

-- First check what's in Patients
SELECT p.*, pa."DoctorId", pa."AppointmentDate", pa."Type", pa."Status", pa."Notes", pa."CancellationReason"
FROM "Patients" p
LEFT JOIN "PatientAppointments" pa ON pa."PatientId" = p."Id"
ORDER BY p."Id";
