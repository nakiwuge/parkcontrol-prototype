export async function sendDemoSms(phone, message) {
  console.log(`[ParkControl Demo SMS] ${phone}: ${message}`);

  return {
    success: true,
    phone,
    message,
  };
}
